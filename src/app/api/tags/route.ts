import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
    // Fetch all templates, only the `tags` field
    const templates = await prisma.template.findMany({
        select: { tags: true },
    });

    // Collect all tags into a single array, then get unique values
    const allTags = [...new Set(templates.flatMap(template => template.tags))];
    allTags.sort();

  return NextResponse.json(allTags);
}