import { Col, Container, Row, Table } from 'react-bootstrap';
import { prisma } from '@/lib/prisma';
import TemplateItem from '@/components/TemplateItem';
import { loggedInProtectedPage } from '@/lib/page-protection';
import { auth } from '@/lib/auth';

/** Render a list of templates for the logged in user. */
const ListPage = async () => {
  // Protect the page, only logged in users can access it.
  const session = await auth();
  loggedInProtectedPage(
    session as {
      user: { email: string; id: string; name: string };
    } | null,
  );
  // const author = (session && session.user && session.user.email) || '';
  // ^ kept this in case we want to add an edit button for the signed in user's templates

  const template = await prisma.template.findMany({});
  // console.log(template);
  return (
    <main>
      <Container id="list-templates-page" fluid className="py-3 px-4">
        <Row>
          <Col>
            <h2 className='mb-4 text-center'>List Templates</h2>
            <Table
              hover
              responsive
              className="w-100 overflow-auto"
              style={{ tableLayout: 'fixed' }}
            >
              <thead>
                <tr>
                  <th className="py-3" style={{ width: '3%' }}>ID</th>
                  <th className="py-3" style={{ width: '37%' }}>Template</th>
                  <th className="py-3" style={{ width: '15%' }}>Category</th>
                  <th className="py-3" style={{ width: '15%' }}>Author</th>
                  <th className="py-3" style={{ width: '12%' }}>Used</th>
                  <th className="py-3" style={{ width: '3%' }}></th>
                </tr>
              </thead>
              <tbody>
                {template.map((template) => (
                  <TemplateItem
                    key={template.id}
                    template={template}
                  />
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
