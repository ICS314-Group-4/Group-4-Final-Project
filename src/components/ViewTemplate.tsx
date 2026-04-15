'use client';

import { useState } from 'react';
import { Col, Container, Row, Card, ListGroup, Button } from 'react-bootstrap';
import { Template } from '@prisma/client';

export default function ViewTemplate({ item }: { item: Template }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      // Pulling the actual template body/description
      const textToCopy = item.template || "";
      await navigator.clipboard.writeText(textToCopy);
      
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  return (
    <Container className="py-5" >
      <Row className="justify-content-center" >
        <Col md={8}>
          <Card className="shadow-sm">
            <Card.Header className="text-white d-flex justify-content-between align-items-center py-3"
            style={{ backgroundColor: '#024731'}} >
              <h5 className="mb-0">{item.title}</h5>
              <Button 
                variant={copied ? "secondary" : "light"} 
                size="sm" 
                onClick={handleCopy}
                className="fw-bold"
              >
                {copied ? "Copied!" : "Copy"}
              </Button>
            </Card.Header>
            
            <Card.Body>
              {/* Display the actual Template Content in a readable box */}
              <div className="p-4 bg-light border rounded mb-4">
                <p className="text-muted small mb-2 uppercase fw-bold">Template Content:</p>
                <pre style={{ 
                  whiteSpace: 'pre-wrap', 
                  marginBottom: 0,
                  fontFamily: 'inherit',
                  fontSize: '1.1rem' 
                }}>
                  {item.template}
                </pre>
              </div>

              <ListGroup variant="flush" className="small border rounded">
                <ListGroup.Item><strong>Author:</strong> {item.author}</ListGroup.Item>
                <ListGroup.Item><strong>Category:</strong> {item.category}</ListGroup.Item>
                <ListGroup.Item><strong>Tags:</strong> {item.tags.join(', ')}</ListGroup.Item>
              </ListGroup>
              
              <div className="mt-4">
                <a href="/list" className="btn btn-outline-secondary">
                  Back to List
                </a>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}