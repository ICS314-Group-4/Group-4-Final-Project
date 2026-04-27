{/* API thing to store all existing tags */}
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
    // Get all tags
    const templates = await prisma.template.findMany({
        select: { tags: true },
    });

    // Collect all tags into a single array
    const allTags = [...new Set(templates.flatMap(template => template.tags))];
    allTags.sort();

  return NextResponse.json(allTags);
}