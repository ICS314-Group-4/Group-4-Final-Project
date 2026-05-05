"use server"

import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';

export async function updateTemplateAndAddComment(
  templateId: number, 
  newContent: string, 
  user: { email: string; name: string }
) {
  await prisma.$transaction([
    prisma.template.update({
      where: { id: templateId },
      data: { 
        template: newContent,
        modified: new Date(),
      },
    }),

    prisma.comment.create({
      data: {
        body: "The template was revised.",
        authorEmail: user.email,
        authorName: user.name,
        templateId: templateId,
      },
    }),
  ]);

  // 2. Clear the cache for the template page so the new comment appears
  revalidatePath(`/template/${templateId}`); 
  // Adjust the path above to match your actual route (e.g., /edit/[id] or /view/[id])
}