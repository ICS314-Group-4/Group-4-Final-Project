import { Col, Container, Row } from 'react-bootstrap';
import { prisma } from '@/lib/prisma';
import { loggedInProtectedPage } from '@/lib/page-protection';
import { auth } from '@/lib/auth';
import TemplateFilterUserTemplates from '@/components/TemplateFilterUserTemplates';

const userTemplatesPage = async ({ searchParams }: { searchParams: Promise<{ id?: string }> }) => {
  const { id } = await searchParams;
  // ability to view other users templates using an id passed in the url
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
    
  
    const isEditor = targetUserId === currentUserId || session?.user?.role === 'ADMIN';
    // only allow admins and the user themself to edit templates
  
    const user = await prisma.user.findUnique({
      where: { id: targetUserId },
      select: { email: true, name: true },
    });

  const templates = user?.email ? await prisma.template.findMany({
      where: { author: user.email },
      orderBy: { used: 'desc' },
    }) : [];
    // if user email isn't found, create templates as an empty array

  const categories = [...new Set(templates.map(t => t.category))].filter(Boolean);

  const commentCountsRaw = await prisma.comment.groupBy({
    by: ['templateId'],
    where: { isRevision: false },
    _count: { id: true },
  });
  const commentCounts: Record<number, number> = Object.fromEntries(
    commentCountsRaw.map(r => [r.templateId, r._count.id]),
  );

  return (
    <main>
      {/* Header */}
      <div style={{ backgroundColor: '#024731', color: '#fff' }} className="py-4">
        <Container>
          <div className="d-flex justify-content-between align-items-center flex-wrap gap-2">
            <div>
              <h1 className="fw-bold mb-1">{user?.name}&apos;s Templates</h1>
              <span className="badge rounded-pill bg-light text-dark border">{templates.length} Templates</span>
            </div>

          </div>
        </Container>
      </div>
      <Container className="py-4">
        <Row>
          <Col>
            {/* Filter bar — client component */}
            <TemplateFilterUserTemplates templates={templates} categories={categories} isEditor={isEditor} name={user?.name ?? ''} commentCount={commentCounts} />
          </Col>
        </Row>
      </Container>
    </main>
  );
};

export default userTemplatesPage;
