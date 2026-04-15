'use client';

import { Container, Row, Col, Card, Button } from 'react-bootstrap';

const categories = [
  { id: 1, name: 'Google Core/Consumer Apps', count: 0 },
  { id: 2, name: 'STAR/Banner', count: 0 },
  { id: 3, name: 'UH Account', count: 0 },
  { id: 4, name: 'Duo Mobile/MFA', count: 0 },
  { id: 5, name: 'Lamaku/Laulima LMS', count: 0 },
  { id: 6, name: 'Network/Printing', count: 0 },
  { id: 7, name: 'General Support', count: 0 },
  { id: 8, name: 'Site License', count: 0 },
];

const Home = () => (
  <main>
    {/* Hero */}
    <div style={{ backgroundColor: '#024731', color: '#fff' }} className="py-5">
      <Container>
        <h1 className="fw-bold mb-2">UH ITS Email Helper</h1>
        <p className="mb-4" style={{ maxWidth: '600px', opacity: 0.9 }}>
          A shared library of email templates built by UH ITS student employees.
          Find a response, copy it, and get back to the next ticket faster.
        </p>
        <div className="d-flex gap-2 flex-wrap">
          <Button href="/list" variant="light" style={{ color: '#024731', fontWeight: 600 }}>
            Browse Templates
          </Button>
          <Button href="/add" variant="outline-light">
            Add a Template
          </Button>
        </div>
      </Container>
    </div>

    {/* Categories */}
    <Container className="py-5">
      <h2 className="mb-1">Browse by Category</h2>
      <p className="text-muted mb-4">{categories.length} categories</p>
      <Row xs={1} sm={2} md={4} className="g-3">
        {categories.map((cat) => (
          <Col key={cat.id}>
            <a href="/list" className="text-decoration-none text-dark h-100">
              <Card className="h-100" style={{ cursor: 'pointer' }}>
                <Card.Body>
                  <Card.Title style={{ fontSize: '1rem' }}>{cat.name}</Card.Title>
                  <Card.Text className="text-muted" style={{ fontSize: '0.85rem' }}>
                    {cat.count} templates
                  </Card.Text>
                </Card.Body>
              </Card>
            </a>
          </Col>
        ))}
      </Row>
    </Container>

    {/* CTA */}
    <div style={{ backgroundColor: '#f8f9fa', borderTop: '1px solid #dee2e6' }} className="py-4">
      <Container className="d-flex align-items-center justify-content-between flex-wrap gap-3">
        <div>
          <h5 className="mb-1">Just answered something new?</h5>
          <p className="text-muted mb-0" style={{ fontSize: '0.9rem' }}>
            Save your reply as a template so the whole team can use it.
          </p>
        </div>
        <Button href="/add" style={{ backgroundColor: '#024731', border: 'none' }}>
          + Add a Template
        </Button>
      </Container>
    </div>
  </main>
);

export default Home;
