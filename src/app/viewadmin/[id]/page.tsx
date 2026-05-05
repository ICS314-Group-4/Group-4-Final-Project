import { notFound } from 'next/navigation';
import { Template, Comment } from '@prisma/client';
import { adminProtectedPage } from '@/lib/page-protection';
import { prisma } from '@/lib/prisma';
import { auth } from '@/lib/auth';
import ViewTemplateAdmin from '@/components/ViewTemplateAdmin';

export default async function ViewTemplateAdminPage({ params }: { params: { id: string | string[] } }) {
  const { id } = await params;

  const session = await auth();
  adminProtectedPage(
    session as { user: { email: string; id: string; name: string } } | null,
  );

  const viewID: number = +id;
  const item: Template | null = await prisma.template.findUnique({ where: { id: viewID } });

  if (!item) return notFound();

  const comments: Comment[] = await prisma.comment.findMany({
    where: { templateId: viewID },
    orderBy: { createdAt: 'desc' },
  });

  const currentUserEmail = session?.user?.email ?? '';
  const currentUser = await prisma.user.findUnique({
    where: { email: currentUserEmail },
    select: { name: true, sign: true },
  });
  const currentUserName = currentUser?.name ?? currentUserEmail;
  const currentUserSign = currentUser?.sign ?? '';

  return (
    <main>
      <ViewTemplateAdmin
        item={item}
        comments={comments}
        currentUserEmail={currentUserEmail}
        currentUserName={currentUserName}
        currentUserSign={currentUserSign}
      />
    </main>
  );
}
