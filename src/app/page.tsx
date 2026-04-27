import { redirect } from 'next/navigation';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import HomeContent from '@/components/HomeContent';

const Home = async () => {
  const session = await auth();
  if (!session) redirect('/landing');

  const currentUserEmail = session.user?.email ?? '';

  const [currentUser, categoryCountsRaw, stats, topTemplates] = await Promise.all([
    prisma.user.findUnique({ where: { email: currentUserEmail } }),
    prisma.template.groupBy({ by: ['category'], _count: { id: true } }),
    prisma.template.aggregate({ _sum: { used: true }, _count: { id: true } }),
    prisma.template.findMany({ orderBy: { used: 'desc' }, take: 5 }),
  ]);

  const userName = currentUser?.name ?? currentUserEmail;
  const categoryCounts: Record<string, number> = Object.fromEntries(
    categoryCountsRaw.map(r => [r.category, r._count.id]),
  );

  return (
    <HomeContent
      userName={userName}
      totalTemplates={stats._count.id}
      totalUses={stats._sum.used ?? 0}
      categoryCounts={categoryCounts}
      topTemplates={topTemplates.map(t => ({ id: t.id, title: t.title, category: t.category, used: t.used ?? 0 }))}
    />
  );
};

export default Home;
