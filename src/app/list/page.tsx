import { Col, Container, Row, Table } from 'react-bootstrap';

import { loggedInProtectedPage } from '@/lib/page-protection';
import { auth } from '@/lib/auth';
// import { Template } from '@/lib/validationSchemas';
import TemplateListItem from '@/components/TemplateListItem';

interface Template {
    title: string;
    body: string;
    tags?: string[];
    owner: string;
    category: string;
}

/** Render a list of templates for the logged in user. */
const ListPage = async () => {
  // Protect the page, only logged in users can access it.
  const session = await auth();
  loggedInProtectedPage(
    session as {
      user: { email: string; id: string; name: string };
    } | null,
  );

  const testTemplates: Template[] = [{
      title: "Test Template",
      body: "This is a test template.",
      tags: ["test", "template", 'email'],
      owner: "owner",
      category: "login issues"
    },
    {
      title: "Test Template 2",
      body: "This is another test template.",
      tags: ['email one tag'],
      owner: "owner2",
      category: "login issues 2"
    }
  ];


  return (
    <main>
      <Container id="list" fluid className="py-3 px-4">
        <Row>
          <Col>
            <h2 className='mb-4 text-center'>List Templates</h2>
            <Table
              hover
              responsive
              className="w-100 overflow-hidden rounded shadow-sm"
              style={{ tableLayout: 'fixed' }}
            >
              <thead>
                <tr>
                  <th className="py-3" style={{ width: '50%' }}>Template</th>
                  <th className="py-3" style={{ width: '25%' }}>Category</th>
                  <th className="py-3" style={{ width: '25%' }}>Author</th>
                </tr>
              </thead>
              <tbody>
                {testTemplates.map((template) => (
                  <TemplateListItem
                    key={template.title + template.category}
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