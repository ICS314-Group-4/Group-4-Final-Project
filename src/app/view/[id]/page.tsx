import { notFound } from 'next/navigation';
import { Template, Comment } from '@prisma/client';
import { loggedInProtectedPage } from '@/lib/page-protection';
import { prisma } from '@/lib/prisma';
import { auth } from '@/lib/auth';
import ViewTemplate from '@/components/ViewTemplate';

export default async function ViewTemplatePage({ params }: { params: { id: string | string[] } }) {
  const { id } = await params;

  const session = await auth();
  loggedInProtectedPage(
    session as {
      user: { email: string; id: string; name: string };
    } | null,
  );

  const viewID: number = +id;
  const item: Template | null = await prisma.template.findUnique({
    where: { id: viewID },
  });

  if (!item) return notFound();

  const comments: Comment[] = await prisma.comment.findMany({
    where: { templateId: viewID },
    orderBy: { createdAt: 'asc' },
  });

  const currentUserEmail = session?.user?.email ?? '';
  const currentUser = await prisma.user.findUnique({ where: { email: currentUserEmail } });
  const currentUserName = currentUser?.name ?? currentUserEmail;
  const isAdmin = currentUser?.role === 'ADMIN';

  return (
    <main>
      <ViewTemplate
        item={item}
        comments={comments}
        currentUserEmail={currentUserEmail}
        currentUserName={currentUserName}
        isAdmin={isAdmin}
      />
    </main>
  );
}
