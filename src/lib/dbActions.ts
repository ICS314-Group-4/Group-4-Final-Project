'use server';

import { Category } from '@prisma/client';
import { Template } from '@prisma/client';
import { hash, compare } from 'bcrypt';
import { redirect } from 'next/navigation';
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

/**
 * Creates a new contact in the database.
 * @param template, an object with the following properties: title, template, category, author, tags, used.
 */
export async function addTemplate(
  template: { title: string; template: string; category: string; author: string; tags: string[]; used: number },
): Promise<{ error: string } | { id: number }> {
  const validatedCategory = categoryMap[template.category] || template.category;
  try {
    const created = await prisma.template.create({
      data: {
        title: template.title,
        template: template.template,
        category: validatedCategory,
        tags: template.tags,
        author: template.author,
        used: template.used,
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

export async function editTemplate(template: Template): Promise<{ error: string } | { success: true }> {
  const session = await auth();
  
  try {
    const oldVersion = await prisma.template.findUnique({
      where: { id: template.id },
    });

    if (!oldVersion) return { error: "Template not found." };

    const changes: string[] = [];
    if (oldVersion.title !== template.title) {
      changes.push(`Title changed from "${oldVersion.title}" to "${template.title}"`);
    }
    if (oldVersion.template !== template.template) {
      changes.push(`Template body was updated`);
    }
    if (oldVersion.category !== template.category) {
    const oldLabel = reverseCategoryMap[oldVersion.category] || oldVersion.category;
    const newLabel = reverseCategoryMap[template.category] || template.category;
    
    changes.push(`Category moved from ${oldLabel} to ${newLabel}`);

    const oldTags = oldVersion.tags || [];
    const newTags = template.tags || [];

    const addedTags = newTags.filter(tag => !oldTags.includes(tag));
    const removedTags = oldTags.filter(tag => !newTags.includes(tag));

    if (addedTags.length > 0 || removedTags.length > 0) {
      const tagChanges: string[] = [];
    if (addedTags.length > 0) tagChanges.push(`added [${addedTags.join(', ')}]`);
    if (removedTags.length > 0) tagChanges.push(`removed [${removedTags.join(', ')}]`);
    
    changes.push(`Tags updated: ${tagChanges.join(' and ')}`);
    }
  }

    const revisionText = changes.length > 0 
      ? `Revised: ${changes.join('; ')}.`
      : "The template was revised (no metadata changes).";

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
          authorEmail: session?.user?.email || "System",
          authorName: session?.user?.name || "System",
          templateId: template.id,
        },
      });
    });

    revalidatePath(`/template/${template.id}`);
    return { success: true };
  } catch (e: unknown) {
    if ((e as { code?: string }).code === 'P2002') {
      return { error: 'A template with this title already exists.' };
    }
    return { error: 'An unexpected error occurred.' };
  }
}

/**
 * Deletes an existing template from the database.
 * @param id, the id of the template to delete.
 */
export async function deleteTemplate(id: number) {
  // console.log(`deleteTemplate id: ${id}`);
  await prisma.template.delete({
    where: { id },
  });
}

/**
 * Adds a comment to a template.
 */
export async function addComment(comment: { body: string; authorEmail: string; authorName: string; templateId: number }) {
  await prisma.comment.create({
    data: {
      body: comment.body,
      authorEmail: comment.authorEmail,
      authorName: comment.authorName,
      templateId: comment.templateId,
    },
  });
}

/**
 * Deletes a comment. Only the author or an admin can delete.
 */
export async function deleteComment(commentId: number, requesterEmail: string) {
  const comment = await prisma.comment.findUnique({ where: { id: commentId } });
  if (!comment) return;
  const requester = await prisma.user.findUnique({ where: { email: requesterEmail } });
  if (!requester) return;
  if (comment.authorEmail !== requesterEmail && requester.role !== 'ADMIN') return;
  await prisma.comment.delete({ where: { id: commentId } });
}

/**
 * Creates a new user in the database.
 * @param credentials, an object with the following properties: name, email, password.
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
 * Returns an error string on failure, or { success: true } on success.
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
 * Returns an error string on failure, or { success: true } on success.
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

/** Returns the current master code. */
export async function getMasterCode(): Promise<string> {
  const config = await prisma.siteConfig.upsert({
    where: { id: 1 },
    update: {},
    create: { id: 1, masterCode: '' },
  });
  return config.masterCode;
}

/** Updates the master code, storing a bcrypt hash. */
export async function setMasterCode(code: string) {
  const hashed = await hash(code, 10);
  await prisma.siteConfig.upsert({
    where: { id: 1 },
    update: { masterCode: hashed },
    create: { id: 1, masterCode: hashed },
  });
}

/** Returns all whitelist entries sorted by username. */
export async function getWhitelist() {
  return prisma.whitelistEntry.findMany({ orderBy: { username: 'asc' } });
}

/** Adds a username + display name to the whitelist. */
export async function addWhitelistEntry(username: string, name: string) {
  await prisma.whitelistEntry.create({
    data: { username: username.toLowerCase().trim(), name: name.trim() },
  });
}

/** Removes a whitelist entry by id. */
export async function removeWhitelistEntry(id: number) {
  await prisma.whitelistEntry.delete({ where: { id } });
}

/**
 * Changes the password of an existing user in the database.
 * @param credentials, an object with the following properties: email, password.
 */
export async function changePassword(
  credentials: { email: string; oldpassword: string; password: string },
): Promise<{ error: string } | { success: true }> {
  const user = await prisma.user.findUnique({ where: { email: credentials.email } });
  if (!user) return { error: 'User not found.' };

  const oldPasswordValid = await compare(credentials.oldpassword, user.password);
  if (!oldPasswordValid) return { error: 'Current password is incorrect.' };

  const password = await hash(credentials.password, 10);
  await prisma.user.update({
    where: { email: credentials.email },
    data: { password },
  });
  return { success: true };
}

/**
 * edits the name and signature of an existing user
 */
export async function editProfile(credentials: { email: string; newName: string; newSig: string }) {
  // console.log(`editProfile data: ${JSON.stringify(credentials, null, 2)}`);
  await prisma.user.update({
    where: { email: credentials.email },
    data: {
      name: credentials.newName,
      sign: credentials.newSig,
    },
  });
}

/**
 * Deletes an existing user from the database.
 * @param id, the id of the user to delete.
 */
export async function deleteUser(id: number) {
  // console.log(`deleteUser id: ${id}`);
  await prisma.user.delete({
    where: { id },
  });
  // After deleting, redirect to the list page
  redirect('/list');
}
