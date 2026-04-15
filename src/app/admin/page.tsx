import { Col, Container, Row, Table } from 'react-bootstrap';
import TemplateItemAdmin from '@/components/TemplateItemAdmin';
import { prisma } from '@/lib/prisma';
import { adminProtectedPage } from '@/lib/page-protection';
import { auth } from '@/lib/auth';

const AdminPage = async () => {
  const session = await auth();
  adminProtectedPage(
    session as {
      user: { email: string; id: string; name: string };
    } | null,
  );
  const templates = await prisma.template.findMany({});
  const users = await prisma.user.findMany({});

  return (
    <main>
      <Container id="list" fluid className="py-3">
        <Row>
          <Col>
            <h1>List Templates Admin</h1>
            <Table striped bordered hover>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Title</th>
                  <th>Template</th>
                  <th>Author</th>
                  <th>Category</th>
                  <th>Tags</th>
                  <th>Used</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {templates.map((item) => (
                  <TemplateItemAdmin key={item.id} {...item} />
                ))}
              </tbody>
            </Table>
          </Col>
        </Row>
        <Row>
          <Col>
            <h1>List Users Admin</h1>
            <Table striped bordered hover>
              <thead>
                <tr>
                  <th>Email</th>
                  <th>Role</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user.id}>
                    <td>{user.email}</td>
                    <td>{user.role}</td>
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
