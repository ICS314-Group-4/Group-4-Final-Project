'use client';

import { useState } from 'react';
import { Container, Button, Form } from 'react-bootstrap';
import { Template } from '@prisma/client';
import { categoryLabels } from '@/lib/categoryLabels';
import { deleteTemplate } from '@/lib/dbActions';

const MOCK_COMMENTS = [
  { initials: 'M', name: 'Maile A.', time: '2 days ago', body: 'This one has saved me so many times during peak hours.' },
  { initials: 'T', name: 'Tyler N.', time: '1 day ago', body: 'Heads up — double check the URL in step 3, it may have changed recently.' },
];

export default function ViewTemplateAdmin({ item }: { item: Template }) {
  const [copied, setCopied] = useState(false);
  const [comment, setComment] = useState('');

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(item.template || '');
      setCopied(true);

      const response = await fetch('/api/templates', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ templateId: item.id }),
      });

      const data = await response.json();
      if (!response.ok) console.warn('Counter skipped:', data.message);

      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Network error:', err);
    }
  };

  return (
    <main>
      {/* Header */}
      <div style={{ backgroundColor: '#024731', color: '#fff' }} className="py-4">
        <Container>
          <div className="text-uppercase mb-1" style={{ fontSize: '0.75rem', opacity: 0.7, letterSpacing: '0.1em' }}>
            {categoryLabels[item.category]}
          </div>
          <h1 className="fw-bold mb-1" style={{ fontSize: '1.75rem' }}>{item.title}</h1>
          <p className="mb-0" style={{ opacity: 0.75, fontSize: '0.85rem' }}>
            By {item.author}
          </p>
        </Container>
      </div>

      <Container className="py-5" style={{ maxWidth: '800px' }}>

        {/* Stats row */}
        <div className="d-flex gap-4 mb-4 pb-3" style={{ borderBottom: '1px solid #dee2e6' }}>
          <div>
            <div className="fw-bold" style={{ fontSize: '1.4rem' }}>{item.used ?? 0}</div>
            <div className="text-muted" style={{ fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Times Used</div>
          </div>
          <div>
            <div className="fw-bold" style={{ fontSize: '1.4rem' }}>{MOCK_COMMENTS.length}</div>
            <div className="text-muted" style={{ fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Comments</div>
          </div>
        </div>

        {/* Email body */}
        <div className="mb-2 d-flex justify-content-between align-items-center">
          <span className="fw-semibold">Email Template</span>
          <div className="d-flex align-items-center gap-2">
    {/* Edit and Delete are now grouped to the left of Copy */}
    <a 
      href={`/edit/${item.id}`} 
      className="btn btn-sm btn-outline-primary"
      style={{ fontSize: '0.75rem', padding: '4px 12px' }}
      onClick={(e) => e.stopPropagation()}
    > 
      Edit
    </a>
    <button
      className="btn btn-sm btn-outline-danger"
      style={{ fontSize: '0.75rem', padding: '4px 12px' }}
      onClick={async (e) => {
        e.stopPropagation();
        if (confirm(`Delete "${item.title}"?`)) {
          await deleteTemplate(item.id);
          window.location.href = '/list';
        }
      }}
    >
      Delete
    </button>
          <Button
            size="sm"
            onClick={handleCopy}
            style={{
              backgroundColor: copied ? '#6c757d' : '#024731',
              border: 'none',
              minWidth: '90px',
            }}
          >
            {copied ? 'Copied!' : 'Copy'}
          </Button>
        </div>
        </div>
        <div
          className="p-4 mb-4"
          style={{
            backgroundColor: '#f8f9fa',
            border: '1px solid #dee2e6',
            borderRadius: '0.375rem',
          }}
        >
          <pre style={{ whiteSpace: 'pre-wrap', fontFamily: 'inherit', fontSize: '0.95rem', marginBottom: 0 }}>
            {item.template}
          </pre>
        </div>

        {/* Tags */}
        {item.tags?.length > 0 && (
          <div className="d-flex flex-wrap gap-2 mb-5">
            {item.tags.map(tag => (
              <span
                key={tag}
                className="badge fw-normal"
                style={{ backgroundColor: '#024731', fontSize: '0.8rem' }}
              >
                {tag}
              </span>
            ))}
          </div>
        )}

        {/* Comments */}
        <div style={{ borderTop: '1.5px solid #212529' }} className="pt-4">
          <h5 className="fw-bold mb-4">Comments</h5>

          {MOCK_COMMENTS.map((c, i) => (
            <div key={i} className="d-flex gap-3 mb-4">
              <div
                className="d-flex align-items-center justify-content-center flex-shrink-0 rounded-circle text-white fw-bold"
                style={{ width: '38px', height: '38px', backgroundColor: '#024731', fontSize: '0.9rem' }}
              >
                {c.initials}
              </div>
              <div>
                <div className="d-flex gap-2 align-items-baseline mb-1">
                  <span className="fw-semibold" style={{ fontSize: '0.9rem' }}>{c.name}</span>
                  <span className="text-muted" style={{ fontSize: '0.78rem' }}>{c.time}</span>
                </div>
                <p className="mb-0" style={{ fontSize: '0.9rem' }}>{c.body}</p>
              </div>
            </div>
          ))}

          {/* Comment input */}
          <div className="d-flex gap-3 mt-3">
            <div
              className="d-flex align-items-center justify-content-center flex-shrink-0 rounded-circle text-white fw-bold"
              style={{ width: '38px', height: '38px', backgroundColor: '#6c757d', fontSize: '0.9rem' }}
            >
              ?
            </div>
            <div className="flex-grow-1">
              <Form.Control
                as="textarea"
                rows={2}
                placeholder="Add a comment or suggestion..."
                value={comment}
                onChange={e => setComment(e.target.value)}
                style={{ fontSize: '0.9rem' }}
              />
              {comment.trim() && (
                <Button
                  size="sm"
                  className="mt-2"
                  style={{ backgroundColor: '#024731', border: 'none' }}
                  onClick={() => setComment('')}
                >
                  Post
                </Button>
              )}
            </div>
          </div>
        </div>

        {/* Back */}
        <div className="mt-5">
          <a href="/list" className="text-muted" style={{ fontSize: '0.9rem' }}>
            ← Back to Browse
          </a>
        </div>
      </Container>
    </main>
  );
}
