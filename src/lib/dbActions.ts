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
  // console.log(`createUser data: ${JSON.stringify(credentials, null, 2)}`);
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
