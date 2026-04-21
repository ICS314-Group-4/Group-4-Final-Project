import { notFound } from 'next/navigation';
import { Template } from '@prisma/client';
import { adminProtectedPage } from '@/lib/page-protection';
import { prisma } from '@/lib/prisma';
import { auth } from '@/lib/auth';
import ViewTemplateAdmin from '@/components/ViewTemplate';

export default async function ViewTemplatePage({ params }: { params: { id: string | string[] } }) {
  const { id } = await params;

  // Protect the page
  const session = await auth();
  adminProtectedPage(
    session as {
      user: { email: string; id: string; name: string };
    } | null,
  );

  const viewID: number = +id;
  const item: Template | null = await prisma.template.findUnique({
    where: {
      id: viewID,
    },
  });

  if (!item) {
    return notFound();
  }

  return (
    <main>
      <ViewTemplateAdmin item={item} />
    </main>
  );
}