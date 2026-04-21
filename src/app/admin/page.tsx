import { Col, Container, Row, Table } from 'react-bootstrap';
import { prisma } from '@/lib/prisma';
import TemplateFilterAdmin from '@/components/TemplateFilterAdmin';
import { adminProtectedPage } from '@/lib/page-protection';
import { auth } from '@/lib/auth';
import { deleteUser } from '@/lib/dbActions';

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
        <Row>
          <Col>
            {/* Filter bar — client component */}
            <TemplateFilterAdmin templates={templates} categories={categories} />
          </Col>
        </Row>
      </Container>
      <Container>
        <Row>
          <Col>
            <h1>List Users Admin</h1>
            <Table striped bordered hover>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Role</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user.id}>
                    <td>{user.name}</td>
                    <td>{user.email}</td>
                    <td>{user.role}</td>
                    <td>
                      <button
                        className="btn btn-sm btn-outline-danger"
                        style={{ fontSize: '0.75rem' }}
                        onClick={async (e) => {
                          e.stopPropagation();
                          if (confirm(`Delete "${user.name}"?`)) {
                            await deleteUser(user.id);
                          }
                        }}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </Col>
        </Row>
      </Container>
    </main>
  );
};

export default AdminPage;
