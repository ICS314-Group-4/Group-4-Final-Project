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

  await prisma.template.create({
    data: {
      title: template.title,
      template: template.template,
      category: validatedCategory,
      tags: template.tags,
      author: template.author,
      used: template.used,
    },
  });
  redirect('/list');
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
