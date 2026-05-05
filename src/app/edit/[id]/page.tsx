import { notFound } from 'next/navigation';
import { Template } from '@prisma/client';
import { loggedInProtectedPage } from '@/lib/page-protection';
import { prisma } from '@/lib/prisma';
import { auth } from '@/lib/auth';
import EditTemplateForm from '@/components/EditTemplateForm';
import { redirect } from 'next/navigation';

export default async function EditTemplatePage({ params }: { params: { id: string | string[] } }) {
  const { id } = await params;
  // Protect the page, only logged in users can access it.
  const session = await auth();
  loggedInProtectedPage(
    session as {
      user: { email: string; id: string; name: string };
    } | null,
  );
  const editID: number = +id;
  const template: Template | null = await prisma.template.findUnique({
    where: { id: editID },
    include: { comments: true },
  });
  if (!template) {
    return notFound();
  }
  if (template.author !== session?.user?.email && session?.user?.role !== 'ADMIN') {
    redirect('/not-authorized');
  }

  return (
    <main>
      <EditTemplateForm template={template} />
    </main>
  );
}
