import { auth } from '@/lib/auth';
import { loggedInProtectedPage } from '@/lib/page-protection';
import ChangePasswordForm from '@/components/ChangePasswordForm';

export default async function ChangePasswordPage() {
  const session = await auth();
  loggedInProtectedPage(
    session as { user: { email: string; id: string; name: string } } | null,
  );
  return <ChangePasswordForm />;
}
