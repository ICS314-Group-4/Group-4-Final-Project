import { Col, Container, Row } from 'react-bootstrap';
import { prisma } from '@/lib/prisma';
import TemplateFilterAdmin from '@/components/TemplateFilterAdmin';
import { adminProtectedPage } from '@/lib/page-protection';
import { auth } from '@/lib/auth';
import UserFilterAdmin from '@/components/UserFilterAdmin';

const AdminPage = async () => {
  const session = await auth();
  adminProtectedPage(
    session as {
      user: { email: string; id: string; name: string };
    } | null,
  );

  const templates = await prisma.template.findMany({
    orderBy: { used: 'desc' },
  });
  const users = await prisma.user.findMany({});

  const categories = [...new Set(templates.map(t => t.category))].filter(Boolean);
  const roles = [...new Set(users.map(u => u.role))].filter(Boolean);

  return (
    <main>
      {/* Header */}
      <div style={{ backgroundColor: '#024731', color: '#fff' }} className="py-4">
        <Container fluid className="px-4">
          <div className="d-flex justify-content-between align-items-center flex-wrap gap-2">
            <div>
              <h1 className="fw-bold mb-1">Admin Dashboard</h1>
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
      <Container fluid className="px-4 py-4">
        <div className="mb-4 pb-2 border-bottom d-flex align-items-center justify-content-between">
            <h2 className="h4 fw-bold mb-0" style={{ color: '#024731' }}>Content Templates</h2>
            <span className="badge rounded-pill bg-light text-dark border">{templates.length} Templates</span>
        </div>
        <Row>
          <Col>
            {/* Filter bar — client component */}
            <TemplateFilterAdmin templates={templates} categories={categories} />
          </Col>
        </Row>
      </Container>
      <Container fluid className="px-4 py-4">
        <div className="mb-4 pb-2 border-bottom d-flex align-items-center justify-content-between">
            <h2 className="h4 fw-bold mb-0" style={{ color: '#024731' }}>User Management</h2>
            <span className="badge rounded-pill bg-light text-dark border">{users.length} Users</span>
        </div>
        <Row>
          <Col>
            {/* Filter bar — client component */}
            <UserFilterAdmin user={users} roles={roles}/>
          </Col>
        </Row>
      </Container>
    </main>
  );
};

export default AdminPage;
