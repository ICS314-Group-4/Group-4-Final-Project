'use server';

import { Category } from '@prisma/client';
import { Template } from '@prisma/client';
import { hash, compare } from 'bcrypt';
import { prisma } from './prisma';
import { auth } from './auth';
import { revalidatePath } from 'next/cache';

const categoryMap: Record<string, Category> = {
  'Google Core/Consumer Apps': Category.GOOGLE_APPS,
  'STAR/Banner': Category.STAR_BANNER,
  'UH Account': Category.UH_ACCOUNT,
  'Duo Mobile/MFA': Category.DUO_MOBILE_MFA,
  'Lamaku/Laulima LMS': Category.LAMAKU_LAULIMA,
  'Network/Printing': Category.NETWORK_PRINTING,
  'General Support': Category.GENERAL_SUPPORT,
  'Site License': Category.SITE_LICENSE,
};

const reverseCategoryMap = Object.fromEntries(
  Object.entries(categoryMap).map(([label, value]) => [value, label])
);

type SessionUser = { email: string; name: string | null; role: string };

/** Resolves the current session and returns typed user fields, or throws if not authenticated. */
async function requireSession(): Promise<SessionUser> {
  const session = await auth();
  if (!session?.user?.email) throw new Error('Not authenticated');
  return {
    email: session.user.email,
    name: session.user.name ?? null,
    role: session.user.role ?? 'USER',
  };
}

/** Resolves the current session, verifies admin role, and returns typed user fields. */
async function requireAdmin(): Promise<SessionUser> {
  const user = await requireSession();
  if (user.role !== 'ADMIN') throw new Error('Not authorized');
  return user;
}

/**
 * Creates a new template in the database.
 * Author is always the authenticated user — the client cannot spoof it.
 */
export async function addTemplate(
  template: { title: string; template: string; category: string; tags: string[] },
): Promise<{ error: string } | { id: number }> {
  if (!template.title.trim()) return { error: 'Title is required.' };
  if (template.title.length > 200) return { error: 'Title must be 200 characters or fewer.' };
  if (!template.template.trim()) return { error: 'Template body is required.' };
  if (template.template.length > 10000) return { error: 'Template body must be 10,000 characters or fewer.' };
  if (template.tags.length > 20) return { error: 'Maximum 20 tags allowed.' };
  if (template.tags.some(t => t.length > 50)) return { error: 'Each tag must be 50 characters or fewer.' };
  const user = await requireSession();
  const validatedCategory = categoryMap[template.category] || template.category;
  try {
    const created = await prisma.template.create({
      data: {
        title: template.title,
        template: template.template,
        category: validatedCategory as Category,
        tags: template.tags,
        author: user.email,
        used: 0,
      },
    });
    return { id: created.id };
  } catch (e: unknown) {
    if ((e as { code?: string }).code === 'P2002') {
      return { error: 'A template with this title already exists. Please choose a different title.' };
    }
    throw e;
  }
}

/**
 * Updates a template. Only the author or an admin may do this.
 */
export async function editTemplate(template: Template): Promise<{ error: string } | { success: true }> {
  if (!template.title?.trim()) return { error: 'Title is required.' };
  if (template.title.length > 200) return { error: 'Title must be 200 characters or fewer.' };
  if (!template.template?.trim()) return { error: 'Template body is required.' };
  if (template.template.length > 10000) return { error: 'Template body must be 10,000 characters or fewer.' };
  if ((template.tags ?? []).length > 20) return { error: 'Maximum 20 tags allowed.' };
  if ((template.tags ?? []).some(t => t.length > 50)) return { error: 'Each tag must be 50 characters or fewer.' };
  const user = await requireSession();

  try {
    const oldVersion = await prisma.template.findUnique({ where: { id: template.id } });
    if (!oldVersion) return { error: 'Template not found.' };

    if (oldVersion.author !== user.email && user.role !== 'ADMIN') {
      return { error: 'Not authorized to edit this template.' };
    }

    const changes: string[] = [];

    if (oldVersion.title !== template.title) {
      changes.push(`Title changed from "${oldVersion.title}" to "${template.title}"`);
    }
    if (oldVersion.template !== template.template) {
      changes.push('Template body was updated');
    }
    if (oldVersion.category !== template.category) {
      const oldLabel = reverseCategoryMap[oldVersion.category] || oldVersion.category;
      const newLabel = reverseCategoryMap[template.category] || template.category;
      changes.push(`Category changed from ${oldLabel} to ${newLabel}`);
    }

    const oldTags = oldVersion.tags || [];
    const newTags = template.tags || [];
    const addedTags = newTags.filter(tag => !oldTags.includes(tag));
    const removedTags = oldTags.filter(tag => !newTags.includes(tag));
    if (addedTags.length > 0) changes.push(`Tags added: [${addedTags.join(', ')}]`);
    if (removedTags.length > 0) changes.push(`Tags removed: [${removedTags.join(', ')}]`);

    const revisionText = changes.length > 0
      ? changes.join('; ')
      : 'Minor revision (no tracked changes)';

    await prisma.$transaction(async (tx) => {
      await tx.template.update({
        where: { id: template.id },
        data: {
          title: template.title,
          template: template.template,
          category: template.category,
          tags: template.tags,
          modified: new Date(),
        },
      });

      await tx.comment.create({
        data: {
          body: revisionText,
          authorEmail: user.email,
          authorName: user.name || user.email,
          templateId: template.id,
          isRevision: true,
        },
      });
    });

    revalidatePath(`/view/${template.id}`);
    return { success: true };
  } catch (e: unknown) {
    console.error('[editTemplate]', e);
    if ((e as { code?: string }).code === 'P2002') {
      return { error: 'A template with this title already exists.' };
    }
    return { error: 'An unexpected error occurred.' };
  }
}

/**
 * Deletes a template. Only the author or an admin may do this.
 */
export async function deleteTemplate(id: number): Promise<{ error: string } | { success: true }> {
  try {
    const user = await requireSession();
    const template = await prisma.template.findUnique({ where: { id }, select: { author: true } });
    if (!template) return { error: 'Template not found.' };
    if (template.author !== user.email && user.role !== 'ADMIN') {
      return { error: 'Not authorized to delete this template.' };
    }
    await prisma.template.delete({ where: { id } });
    return { success: true };
  } catch (e) {
    console.error('[deleteTemplate]', e);
    return { error: 'An unexpected error occurred.' };
  }
}

/**
 * Adds a comment. Author is always the authenticated user — cannot be spoofed.
 */
export async function addComment(comment: { body: string; templateId: number }): Promise<{ error: string } | { success: true }> {
  const trimmed = comment.body.trim();
  if (!trimmed) return { error: 'Comment cannot be empty.' };
  if (trimmed.length > 1000) return { error: 'Comment must be 1000 characters or fewer.' };
  const sessionUser = await requireSession();
  const dbUser = await prisma.user.findUnique({
    where: { email: sessionUser.email },
    select: { name: true },
  });
  await prisma.comment.create({
    data: {
      body: trimmed,
      authorEmail: sessionUser.email,
      authorName: dbUser?.name || sessionUser.name || sessionUser.email,
      templateId: comment.templateId,
    },
  });
  return { success: true };
}

/**
 * Deletes a comment. Only the author or an admin may do this.
 * Revision comments (system-generated) cannot be deleted by anyone.
 */
export async function deleteComment(commentId: number) {
  const sessionUser = await requireSession();
  const comment = await prisma.comment.findUnique({ where: { id: commentId } });
  if (!comment) return;
  if (comment.isRevision) return;
  const requester = await prisma.user.findUnique({ where: { email: sessionUser.email } });
  if (!requester) return;
  if (comment.authorEmail !== sessionUser.email && requester.role !== 'ADMIN') return;
  await prisma.comment.delete({ where: { id: commentId } });
}

/**
 * Creates a new user in the database (legacy / dev path).
 */
export async function createUser(credentials: { name: string; email: string; password: string }) {
  const password = await hash(credentials.password, 10);
  await prisma.user.create({
    data: {
      name: credentials.name,
      email: credentials.email,
      password,
    },
  });
}

/**
 * Registers a new user via the whitelist + master code flow.
 */
export async function registerUser(
  username: string,
  masterCode: string,
  password: string,
): Promise<{ error: string } | { success: true }> {
  const normalized = username.toLowerCase().trim();

  const entry = await prisma.whitelistEntry.findUnique({ where: { username: normalized } });
  if (!entry) return { error: 'Username not found. Please contact the site admin.' };

  const config = await prisma.siteConfig.findUnique({ where: { id: 1 } });
  if (!config || config.masterCode === '') {
    return { error: 'No master code has been set. Please contact the site admin.' };
  }
  const masterCodeValid = await compare(masterCode, config.masterCode);
  if (!masterCodeValid) {
    return { error: 'Incorrect master code. Please contact the site admin.' };
  }

  const existing = await prisma.user.findUnique({ where: { email: normalized } });
  if (existing) return { error: 'An account with this username already exists.' };

  const hashed = await hash(password, 10);
  await prisma.user.create({
    data: { email: normalized, name: entry.name, password: hashed },
  });

  return { success: true };
}

/**
 * Resets a user's password using their username and the master code.
 */
export async function resetPassword(
  username: string,
  masterCode: string,
  newPassword: string,
): Promise<{ error: string } | { success: true }> {
  const normalized = username.toLowerCase().trim();

  const user = await prisma.user.findUnique({ where: { email: normalized } });
  if (!user) return { error: 'Username not found.' };

  const config = await prisma.siteConfig.findUnique({ where: { id: 1 } });
  if (!config || config.masterCode === '') {
    return { error: 'No master code has been set. Please contact the site admin.' };
  }
  const masterCodeValid = await compare(masterCode, config.masterCode);
  if (!masterCodeValid) {
    return { error: 'Incorrect master code. Please contact the site admin.' };
  }

  const hashed = await hash(newPassword, 10);
  await prisma.user.update({
    where: { email: normalized },
    data: { password: hashed },
  });

  return { success: true };
}

/** Returns the current master code hash (admin only). */
export async function getMasterCode(): Promise<string> {
  await requireAdmin();
  const config = await prisma.siteConfig.upsert({
    where: { id: 1 },
    update: {},
    create: { id: 1, masterCode: '' },
  });
  return config.masterCode;
}

/** Updates the master code. Admin only. */
export async function setMasterCode(code: string) {
  await requireAdmin();
  const hashed = await hash(code, 10);
  await prisma.siteConfig.upsert({
    where: { id: 1 },
    update: { masterCode: hashed },
    create: { id: 1, masterCode: hashed },
  });
}

/** Returns all whitelist entries. Admin only. */
export async function getWhitelist() {
  await requireAdmin();
  return prisma.whitelistEntry.findMany({ orderBy: { username: 'asc' } });
}

/** Adds a username to the whitelist. Admin only. */
export async function addWhitelistEntry(username: string, name: string) {
  await requireAdmin();
  await prisma.whitelistEntry.create({
    data: { username: username.toLowerCase().trim(), name: name.trim() },
  });
}

/** Removes a whitelist entry. Admin only. */
export async function removeWhitelistEntry(id: number) {
  await requireAdmin();
  await prisma.whitelistEntry.delete({ where: { id } });
}

/**
 * Changes the authenticated user's password.
 * Email is taken from the session — the client cannot target another account.
 */
export async function changePassword(
  credentials: { oldpassword: string; password: string },
): Promise<{ error: string } | { success: true }> {
  const sessionUser = await requireSession();
  const dbUser = await prisma.user.findUnique({ where: { email: sessionUser.email } });
  if (!dbUser) return { error: 'User not found.' };

  const oldPasswordValid = await compare(credentials.oldpassword, dbUser.password);
  if (!oldPasswordValid) return { error: 'Current password is incorrect.' };

  const password = await hash(credentials.password, 10);
  await prisma.user.update({
    where: { email: sessionUser.email },
    data: { password },
  });
  return { success: true };
}

/**
 * Edits a user's display name and signature.
 * Users may only edit their own profile. Admins may edit any profile.
 */
export async function editProfile(credentials: { email: string; newName: string; newSig: string }): Promise<{ error: string } | { success: true }> {
  try {
    const sessionUser = await requireSession();
    if (sessionUser.email !== credentials.email && sessionUser.role !== 'ADMIN') {
      return { error: 'Not authorized to edit this profile.' };
    }
    if (credentials.newName.length > 100) return { error: 'Name must be 100 characters or fewer.' };
    if (credentials.newSig.length > 1000) return { error: 'Signature must be 1000 characters or fewer.' };
    await prisma.user.update({
      where: { email: credentials.email },
      data: { name: credentials.newName, sign: credentials.newSig },
    });
    return { success: true };
  } catch (e) {
    console.error('[editProfile]', e);
    return { error: 'An unexpected error occurred.' };
  }
}

/**
 * Deletes a user account. Admin only.
 */
export async function deleteUser(id: number): Promise<{ error: string } | { success: true }> {
  try {
    await requireAdmin();
    await prisma.user.delete({ where: { id } });
    return { success: true };
  } catch (e) {
    console.error('[deleteUser]', e);
    return { error: 'An unexpected error occurred.' };
  }
}
