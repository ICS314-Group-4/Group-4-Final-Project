'use client';

import { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Container, Button, Form } from 'react-bootstrap';
import { Template, Comment } from '@prisma/client';
import { categoryLabels } from '@/lib/categoryLabels';
import { addComment, deleteComment } from '@/lib/dbActions';

const MAX_COMMENT_LENGTH = 1000;

type Props = {
  item: Template;
  comments: Comment[];
  currentUserEmail: string;
  currentUserName: string;
  currentUserSign: string;
  isAdmin: boolean;
};

export default function ViewTemplate({ item, comments, currentUserEmail, currentUserName, currentUserSign, isAdmin }: Props) {
  const router = useRouter();
  const [copied, setCopied] = useState(false);
  const [usedCount, setUsedCount] = useState(item.used ?? 0);
  const countedRef = useRef(false);
  const [commentBody, setCommentBody] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [posted, setPosted] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText((item.template || '') + '\n' + currentUserSign);
      setCopied(true);
      if (!countedRef.current) {
        countedRef.current = true;
        setUsedCount(c => c + 1);
        const response = await fetch('/api/templates', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ templateId: item.id }),
        });
        const data = await response.json();
        if (!response.ok) console.warn('Counter skipped:', data.message);
      }
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Network error:', err);
    }
  };

  const handleAddComment = async () => {
    const trimmed = commentBody.trim();
    if (!trimmed || trimmed.length > MAX_COMMENT_LENGTH) return;
    setSubmitting(true);
    await addComment({
      body: trimmed,
      authorEmail: currentUserEmail,
      authorName: currentUserName,
      templateId: item.id,
    });
    setCommentBody('');
    setSubmitting(false);
    setPosted(true);
    setTimeout(() => setPosted(false), 3000);
    router.refresh();
  };

  const handleDeleteComment = async (commentId: number) => {
    await deleteComment(commentId, currentUserEmail);
    router.refresh();
  };

  return (
    <main>
      {/* Header */}
      <div style={{ backgroundColor: '#024731', color: '#fff' }} className="py-4">
        <Container>
          <div className="text-uppercase mb-1" style={{ fontSize: '0.75rem', opacity: 0.7, letterSpacing: '0.1em' }}>
            {categoryLabels[item.category]} · #{item.id}
          </div>
          <h1 className="fw-bold mb-1" style={{ fontSize: '1.75rem' }}>{item.title}</h1>
          <p className="mb-0" style={{ opacity: 0.75, fontSize: '0.875rem' }}>
            By {item.author}
          </p>
        </Container>
      </div>

      <Container className="py-5" style={{ maxWidth: '800px' }}>

        {/* Stats row */}
        <div className="d-flex gap-4 mb-5 pb-3" style={{ borderBottom: '1px solid #e4ebe7' }}>
          <div>
            <div className="fw-bold" style={{ fontSize: '1.4rem' }}>{usedCount}</div>
            <div style={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em', color: '#6c757d' }}>Times Used</div>
          </div>
          <div>
            <div className="fw-bold" style={{ fontSize: '1.4rem' }}>{comments.length}</div>
            <div style={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em', color: '#6c757d' }}>Comments</div>
          </div>
        </div>

        {/* Email body */}
        <div className="mb-2 d-flex justify-content-between align-items-center">
          <span className="fw-semibold">Email Template</span>
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
        <div
          className="p-4 mb-5"
          style={{
            backgroundColor: '#f4f7f5',
            border: '1px solid #e4ebe7',
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

          {/* Post success toast */}
          {posted && (
            <div
              style={{
                backgroundColor: '#e8f0ec',
                color: '#024731',
                border: '1px solid #c8d8d0',
                borderRadius: '0.375rem',
                padding: '10px 16px',
                fontSize: '0.875rem',
                marginBottom: '1rem',
                fontWeight: 500,
              }}
            >
              Comment posted.
            </div>
          )}

          {comments.length === 0 && (
            <p style={{ fontSize: '0.95rem', color: '#6c757d' }}>No comments yet. Be the first to leave one.</p>
          )}

          {comments.map(c => {
            const isOwn = c.authorEmail === currentUserEmail;
            return (
              <div
                key={c.id}
                className="mb-4 pb-3"
                style={{
                  borderBottom: '1px solid #e4ebe7',
                  ...(isOwn ? {
                    backgroundColor: '#f4f7f5',
                    borderLeft: '3px solid #024731',
                    borderRadius: '0 0.25rem 0.25rem 0',
                    padding: '10px 14px',
                    marginLeft: '-14px',
                  } : {}),
                }}
              >
                <div className="d-flex justify-content-between align-items-baseline mb-1">
                  <div className="d-flex gap-2 align-items-baseline">
                    <span className="fw-semibold" style={{ fontSize: '0.95rem' }}>{c.authorName}</span>
                    {isOwn && (
                      <span style={{ fontSize: '0.75rem', color: '#024731', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                        you
                      </span>
                    )}
                    <span style={{ fontSize: '0.8rem', color: '#6c757d' }}>
                      {new Date(c.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                    </span>
                  </div>
                  {(isOwn || isAdmin) && (
                    <button
                      onClick={() => handleDeleteComment(c.id)}
                      style={{
                        background: 'none', border: 'none', color: '#adb5bd',
                        fontSize: '0.8rem', cursor: 'pointer', padding: 0,
                      }}
                    >
                      Delete
                    </button>
                  )}
                </div>
                <p className="mb-0" style={{ fontSize: '0.95rem' }}>{c.body}</p>
              </div>
            );
          })}

          {/* Comment input */}
          <div className="mt-4">
            <Form.Control
              as="textarea"
              rows={3}
              placeholder="Add a comment or suggestion..."
              value={commentBody}
              onChange={e => {
                if (e.target.value.length <= MAX_COMMENT_LENGTH) setCommentBody(e.target.value);
              }}
              style={{ fontSize: '0.95rem', marginBottom: '6px', borderColor: '#e4ebe7' }}
            />
            <div className="d-flex justify-content-between align-items-center">
              <div>
                {commentBody.trim() && (
                  <Button
                    size="sm"
                    disabled={submitting}
                    onClick={handleAddComment}
                    style={{ backgroundColor: '#024731', border: 'none' }}
                  >
                    {submitting ? 'Posting...' : 'Post Comment'}
                  </Button>
                )}
              </div>
              {commentBody.length > 0 && (
                <span style={{ fontSize: '0.8rem', color: commentBody.length > MAX_COMMENT_LENGTH * 0.9 ? '#dc3545' : '#adb5bd' }}>
                  {commentBody.length} / {MAX_COMMENT_LENGTH}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Back */}
        <div className="mt-5">
          <button
            onClick={() => router.back()}
            style={{ background: 'none', border: 'none', padding: 0, fontSize: '0.95rem', color: '#6c757d', cursor: 'pointer' }}
          >
            ← Back
          </button>
        </div>
      </Container>
    </main>
  );
}
