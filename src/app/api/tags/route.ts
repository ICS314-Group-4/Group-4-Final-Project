import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { auth } from '@/lib/auth';

export async function GET() {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const templates = await prisma.template.findMany({ select: { tags: true } });
  const allTags = [...new Set(templates.flatMap(t => t.tags))].sort();
  return NextResponse.json(allTags);
}
