import { Col, Container, Row, Table } from 'react-bootstrap';
import { prisma } from '@/lib/prisma';
import TemplateItem from '@/components/StuffItem';
import { loggedInProtectedPage } from '@/lib/page-protection';
import { auth } from '@/lib/auth';

/** Render a list of stuff for the logged in user. */
const ListPage = async () => {
  // Protect the page, only logged in users can access it.
  const session = await auth();
  loggedInProtectedPage(
    session as {
      user: { email: string; id: string; name: string };
    } | null,
  );
  const author = (session && session.user && session.user.email) || '';
  const template = await prisma.template.findMany({
    where: {
      author,
    },
  });
  // console.log(stuff);
  return (
    <main>
      <Container id="list" fluid className="py-3">
        <Row>
          <Col>
            <h1>Template</h1>
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
                </tr>
              </thead>
              <tbody>
                {template.map((item) => (
                  <TemplateItem key={item.id} {...item} />
                ))}
              </tbody>
            </Table>
          </Col>
        </Row>
      </Container>
    </main>
  );
};

export default ListPage;
