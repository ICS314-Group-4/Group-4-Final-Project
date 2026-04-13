import { loggedInProtectedPage } from '@/lib/page-protection';
import AddTemplateForm from '@/components/AddTemplateForm';
import { auth } from '@/lib/auth';

const AddTemplate = async () => {
  const session = await auth();
  loggedInProtectedPage(
    session as {
      user: { email: string; id: string; name: string };
    } | null,
  );
  return <AddTemplateForm />;
};

export default AddTemplate;
