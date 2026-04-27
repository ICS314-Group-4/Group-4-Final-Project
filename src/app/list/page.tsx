import { Col, Container, Row } from 'react-bootstrap';
import { Category } from '@prisma/client';
import { prisma } from '@/lib/prisma';
import TemplateFilter from '@/components/TemplateFilter';
import { landingProtectionPage } from '@/lib/page-protection';
import { auth } from '@/lib/auth';

/** Render a list of templates. */
const ListPage = async ({ searchParams }: { searchParams: Promise<{ category?: string; search?: string }> }) => {
  const { category, search } = await searchParams;
  const initialCategory = category ?? 'All';
  const initialSearch = search ?? '';
  const session = await auth();
  landingProtectionPage(
    session as {
      user: { email: string; id: string; name: string };
    } | null,
  );

  const templates = await prisma.template.findMany({
    orderBy: { used: 'desc' },
  });

  const users = await prisma.user.findMany({ 
    select: { email: true, name: true },
  });
  // There's probably a better solution for this, but in order to have the author names update in real time, 
  // I'm passing the emails and names so the templatefilter and templateitem can display names instead of emails.
  // this also means we don't need to change how templates are stored. they still store the author's email.


  // check templateitem and templatefilter

  const categories = Object.values(Category);

  const commentCountsRaw = await prisma.comment.groupBy({
    by: ['templateId'],
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
              <h1 className="fw-bold mb-1">Browse Templates</h1>
              <p className="mb-0" style={{ opacity: 0.8, fontSize: '0.9rem' }}>
                {templates.length} template{templates.length !== 1 ? 's' : ''} available
              </p>
            </div>
            <a
              href="/add"
              className="btn btn-light fw-semibold"
              style={{ color: '#024731', fontSize: '0.9rem' }}
            >
              + Add Template
            </a>
          </div>
        </Container>
      </div>

      <Container className="py-4">
        <Row>
          <Col>
            <TemplateFilter templates={templates} categories={categories} authors={users} commentCounts={commentCounts} initialCategory={initialCategory} initialSearch={initialSearch} />
          </Col>
        </Row>
      </Container>
    </main>
  );
};

export default ListPage;
