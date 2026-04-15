import { notFound } from 'next/navigation';
import { Template } from '@prisma/client';
import { loggedInProtectedPage } from '@/lib/page-protection';
import { prisma } from '@/lib/prisma';
import { auth } from '@/lib/auth';
import ViewTemplate from '@/components/ViewTemplate'; // Import the UI component

export default async function ViewTemplatePage({ params }: { params: { id: string | string[] } }) {
  const { id } = await params;

  // Protect the page
  const session = await auth();
  loggedInProtectedPage(
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

  // Security: 404 if it doesn't exist or isn't the user's
  if (!item || item.author !== session?.user?.email) {
    return notFound();
  }

  return (
    <main>
      <ViewTemplate item={item} />
    </main>
  );
}