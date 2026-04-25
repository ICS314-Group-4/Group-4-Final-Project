import { prisma } from '@/lib/prisma';
import { auth } from '@/lib/auth';
import { loggedInProtectedPage } from '@/lib/page-protection';
import EditProfileForm from '@/components/EditProfileForm';

/** The edit profile page. */
const EditProfilePage = async () => {
  const session = await auth();
  loggedInProtectedPage(
    session as {
      user: { email: string; id: string; name: string };
    } | null,
  );

  const email = session?.user?.email ?? '';
  const user = await prisma.user.findUnique({
    where: { email },
    select: { name: true, sign: true },
  });

  return <EditProfileForm email={email} name={user?.name ?? ''} signature={user?.sign ?? ''} />;
  // I do not understand how or why name and sign can be null, but this seems to silence the error at least
};

export default EditProfilePage;
