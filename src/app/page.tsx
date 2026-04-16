import { redirect } from 'next/navigation';
import { auth } from '@/lib/auth';
import HomeContent from '@/components/HomeContent';

const Home = async () => {
  const session = await auth();
  if (!session) {
    redirect('/landing');
  }
  return <HomeContent />;
};

export default Home;
