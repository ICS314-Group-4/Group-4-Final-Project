import { Col, Container, Row, Card, ListGroup } from 'react-bootstrap';
import { prisma } from '@/lib/prisma';
import { notFound } from 'next/navigation';
import { auth } from '@/lib/auth';
import { loggedInProtectedPage } from '@/lib/page-protection';

export default async function ViewTemplatePage({ params }: { params: { id: string } }) {
  const session = await auth();
  
  // Apply the same protection as your ListPage
  loggedInProtectedPage(
    session as {
      user: { email: string; id: string; name: string };
    } | null,
  );

  // Fetch the specific template
  // If your ID in Prisma is an Int, use Number(params.id). If it's a String/UUID, use params.id
  const item = await prisma.stuff.findUnique({
    where: { id: Number(params.id) },
  });

  // Basic security: 404 if it doesn't exist or isn't yours
  if (!item || item.owner !== session?.user?.email) {
    notFound();
  }

  return (
    <main>
      <Container className="py-5">
        <Row className="justify-content-center">
          <Col md={6}>
            <Card>
              <Card.Header as="h5">Template Inspection</Card.Header>
              <Card.Body>
                <Card.Title className="display-6 mb-4">{item.name}</Card.Title>
                <ListGroup variant="flush">
                  <ListGroup.Item><strong>Database ID:</strong> {item.id}</ListGroup.Item>
                  <ListGroup.Item><strong>Author:</strong> {item.owner}</ListGroup.Item>
                  <ListGroup.Item><strong>Category:</strong> {item.condition}</ListGroup.Item>
                  <ListGroup.Item><strong>Times Used:</strong> {item.quantity}</ListGroup.Item>
                </ListGroup>
                <div className="mt-4">
                  <a href="/list" className="btn btn-secondary">Back to List</a>
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </main>
  );
}