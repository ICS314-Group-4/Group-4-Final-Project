'use server';

import { Category } from '@prisma/client';
import { Template } from '@prisma/client';
import { hash } from 'bcrypt';
import { redirect } from 'next/navigation';
import { prisma } from './prisma';

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

/**
 * Creates a new contact in the database.
 * @param template, an object with the following properties: title, template, category, author, tags, used.
 */
export async function addTemplate(template: { title: string; template: string; category: string; author: string; tags: string[]; used: number }) {

  const validatedCategory = categoryMap[template.category] || template.category;

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
  return created.id;
}

export async function editTemplate(template: Template) {
  const validatedCategory = categoryMap[template.category] || template.category;
  await prisma.template.update({
    where: { id: template.id },
    data: {
      title: template.title,
      template: template.template,
      category: validatedCategory,
      tags: template.tags,
      author: template.author,
      used: template.used,
    },
  });
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
  if (!config || config.masterCode === '' || config.masterCode !== masterCode) {
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

/** Returns the current master code. */
export async function getMasterCode(): Promise<string> {
  const config = await prisma.siteConfig.upsert({
    where: { id: 1 },
    update: {},
    create: { id: 1, masterCode: '' },
  });
  return config.masterCode;
}

/** Updates the master code. */
export async function setMasterCode(code: string) {
  await prisma.siteConfig.upsert({
    where: { id: 1 },
    update: { masterCode: code },
    create: { id: 1, masterCode: code },
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
export async function changePassword(credentials: { email: string; password: string }) {
  // console.log(`changePassword data: ${JSON.stringify(credentials, null, 2)}`);
  const password = await hash(credentials.password, 10);
  await prisma.user.update({
    where: { email: credentials.email },
    data: {
      password,
    },
  });
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
