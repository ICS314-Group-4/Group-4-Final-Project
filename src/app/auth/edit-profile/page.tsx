import { prisma } from '@/lib/prisma';
import { auth } from '@/lib/auth';
import { loggedInProtectedPage } from '@/lib/page-protection';
import { redirect } from 'next/navigation';
import EditProfileForm from '@/components/EditProfileForm';

/** The edit profile page. */
const EditProfilePage = async ({ searchParams }: { searchParams: Promise<{ id?: string }> }) => {
  const { id } = await searchParams;
  // support for editing other users' profiles using an id in the url
  const session = await auth();
  loggedInProtectedPage(
    session as {
      user: { email: string; id: string; name: string; role?: string };
    } | null,
  );

  const currentUserId = Number(session?.user?.id);
  const parsedId = id ? Number(id) : NaN;
  // if id is not provided in the url, set it to nan
  const targetUserId = Number.isInteger(parsedId) ? parsedId : currentUserId;
  // if parsed id is nan, use the currentUserId instead
  

  if (targetUserId !== currentUserId && session?.user?.role !== 'ADMIN') {
    redirect('/not-authorized');
  }
  // only allow admins to edit others' profiles

  const user = await prisma.user.findUnique({
    where: { id: targetUserId },
    select: { email: true, name: true, sign: true },
  });

  return <EditProfileForm email={user?.email ?? ''} name={user?.name ?? ''} signature={user?.sign ?? ''} />;
  // I do not understand how or why name and sign can be null, but this seems to silence the error at least
};

export default EditProfilePage;
