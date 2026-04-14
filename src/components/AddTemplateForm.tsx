'use client';

import { useState } from 'react';
import { Container, Form, Button, Row, Col } from 'react-bootstrap';

const categories = [
  'Account & Login Issues',
  'WiFi & Network',
  'Email & Outlook',
  'Software & Licensing',
  'Laulima & Canvas',
  'Hardware Support',
  'Printing & Mahalo Cards',
  'General & Other',
];

const AddTemplateForm: React.FC = () => {
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState('');

  const addTag = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      const val = tagInput.trim().toLowerCase();
      if (val && !tags.includes(val)) {
        setTags([...tags, val]);
      }
      setTagInput('');
    }
  };

  const removeTag = (tag: string) => {
    setTags(tags.filter(t => t !== tag));
  };

  return (
    <main>
      {/* Header */}
      <div style={{ backgroundColor: '#024731', color: '#fff' }} className="py-4">
        <Container>
          <h1 className="fw-bold mb-1">Add a Template</h1>
          <p className="mb-0" style={{ opacity: 0.85, fontSize: '0.95rem' }}>
            Share a response that worked — the whole team can find and use it.
          </p>
        </Container>
      </div>

      {/* Form */}
      <Container className="py-5" style={{ maxWidth: '760px' }}>
        <Form>
          {/* Title */}
          <Form.Group className="mb-4">
            <Form.Label className="fw-semibold">Problem Description / Title</Form.Label>
            <Form.Control
              type="text"
              placeholder="e.g. Resetting your UH Username password"
            />
          </Form.Group>

          {/* Category */}
          <Form.Group className="mb-4">
            <Form.Label className="fw-semibold">Category</Form.Label>
            <Form.Select>
              <option value="">Select a category...</option>
              {categories.map(category => (
                <option key={category} value={category}>{category}</option>
              ))}
            </Form.Select>
          </Form.Group>

          {/* Email Body */}
          <Form.Group className="mb-4">
            <Form.Label className="fw-semibold">Email Body</Form.Label>
            <Form.Control
              as="textarea"
              rows={10}
              placeholder={`Aloha [Student Name],\n\nMahalo for reaching out to the UH ITS Help Desk...\n\nMahalo,\n[Your Name]\nUH ITS Help Desk`}
              style={{ fontFamily: 'monospace', fontSize: '0.9rem' }}
            />
            <Form.Text className="text-muted">
              Use placeholders like [Student Name] so others can quickly customize.
            </Form.Text>
          </Form.Group>

          {/* Tags */}
          <Form.Group className="mb-5">
            <Form.Label className="fw-semibold">
              Tags <span className="text-muted fw-normal">(optional — press Enter to add)</span>
            </Form.Label>
            <div
              className="d-flex flex-wrap gap-2 align-items-center p-2"
              style={{ border: '1px solid #dee2e6', borderRadius: '0.375rem', minHeight: '44px' }}
            >
              {tags.map(tag => (
                <span
                  key={tag}
                  className="badge d-flex align-items-center gap-1"
                  style={{ backgroundColor: '#024731', fontSize: '0.8rem', fontWeight: 500 }}
                >
                  {tag}
                  <button
                    type="button"
                    onClick={() => removeTag(tag)}
                    style={{
                      background: 'none', border: 'none', color: '#fff',
                      padding: '0 2px', cursor: 'pointer', lineHeight: 1,
                    }}
                  >
                    ×
                  </button>
                </span>
              ))}
              <input
                type="text"
                value={tagInput}
                onChange={e => setTagInput(e.target.value)}
                onKeyDown={addTag}
                placeholder={tags.length === 0 ? 'e.g. password, reset, uh-username' : ''}
                style={{
                  border: 'none', outline: 'none', flexGrow: 1,
                  minWidth: '120px', fontSize: '0.9rem',
                }}
              />
            </div>
          </Form.Group>

          {/* Actions */}
          <Row>
            <Col className="d-flex gap-2">
              <Button type="submit" style={{ backgroundColor: '#024731', border: 'none' }}>
                Publish Template
              </Button>
              <Button type="reset" variant="outline-secondary">
                Reset
              </Button>
            </Col>
          </Row>
        </Form>
      </Container>
    </main>
  );
};

export default AddTemplateForm;
