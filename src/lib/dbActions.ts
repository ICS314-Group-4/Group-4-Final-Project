'use server';

import { Category } from '@prisma/client';
import { Template } from '@prisma/client';
import { hash } from 'bcrypt';
import { redirect } from 'next/navigation';
import { prisma } from './prisma';

/**
 * Creates a new contact in the database.
 * @param template, an object with the following properties: title, template, category, author, tags, used.
 */
export async function addTemplate(template: { title: string; template: string; category: string; author: string; tags: string[]; used: number }) {
  const categoryMap: Record<string, Category> = {
  'google core': Category.GOOGLE_APPS,
  'star': Category.STAR_BANNER,
  'duo mobile': Category.DUO_MOBILE_MFA,
  'lamaku': Category.LAMAKU_LAULIMA,
  'network': Category.NETWORK_PRINTING,
  'general support': Category.GENERAL_SUPPORT,
  'site licensed apps': Category.SITE_LICENSE,
};

const category: Category = categoryMap[template.category] || Category.UH_ACCOUNT;

  await prisma.template.create({
    data: {
      title: template.title,
      template: template.template,
      category,
      tags: template.tags,
      author: template.author,
      used: template.used,
    },
  });
  redirect('/list');
}

export async function editTemplate(template: Template) {
  await prisma.template.update({
    where: { id: template.id },
    data: {
      title: template.title,
      template: template.template,
      category: template.category,
      tags: template.tags,
      author: template.author,
      used: template.used,
    },
  });
  redirect('/list');
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
  // After deleting, redirect to the list page
  redirect('/list');
}

/**
 * Creates a new user in the database.
 * @param credentials, an object with the following properties: email, password.
 */
export async function createUser(credentials: { email: string; password: string }) {
  // console.log(`createUser data: ${JSON.stringify(credentials, null, 2)}`);
  const password = await hash(credentials.password, 10);
  await prisma.user.create({
    data: {
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
