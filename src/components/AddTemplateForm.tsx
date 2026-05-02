'use client';

import { useState, useEffect } from 'react';
import { Container, Form, Button, Row, Col } from 'react-bootstrap';
import { useForm, useWatch } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useSession } from 'next-auth/react';
import { redirect, useRouter } from 'next/navigation';
import { addTemplate } from '@/lib/dbActions';
import { AddTemplateSchema } from '@/lib/validationSchemas';
import LoadingSpinner from '@/components/LoadingSpinner';

const categoryOptions = [
  'Google Core/Consumer Apps',
  'STAR/Banner',
  'UH Account',
  'Duo Mobile/MFA',
  'Lamaku/Laulima LMS',
  'Network/Printing',
  'General Support',
  'Site License',
];

const AddTemplateForm: React.FC = () => {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState('');
  const [published, setPublished] = useState(false);
  const [toastFading, setToastFading] = useState(false);

  const [showPreview, setShowPreview] = useState(false);
  const { register, handleSubmit, reset, setValue, control, formState: { errors } } = useForm({
    resolver: yupResolver(AddTemplateSchema),
    defaultValues: { tags: [] },
  });
  const watchTitle = useWatch({ control, name: 'title' });
  const watchTemplate = useWatch({ control, name: 'template' });
  const watchCategory = useWatch({ control, name: 'category' });
  const [existingTags, setExistingTags] = useState<string[]>([]);

  useEffect(() => { // API call for tag suggestions3
  fetch('/api/tags')
    .then(res => res.json())
    .then(data => setExistingTags(data))
    .catch(err => console.error('Failed to load tag suggestions', err));
}, []);

  if (status === 'loading') return <LoadingSpinner />;
  if (status === 'unauthenticated') redirect('/auth/signin');

  const currentUser = session?.user?.email || '';

  const addTag = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      const val = tagInput.trim().toLowerCase();
      if (val && !tags.includes(val)) {
        const updated = [...tags, val];
        setTags(updated);
        setValue('tags', updated);
      }
      setTagInput('');
    }
  };

  const removeTag = (tag: string) => {
    const updated = tags.filter(t => t !== tag);
    setTags(updated);
    setValue('tags', updated);
  };

  {/* Keyboard helper for creating tags. Pressing 'Enter' calls addTag, pressing 'Backspace* or 'Delete' calls removeTag */}
  const tagKeyboardHelper = (e: React.KeyboardEvent<HTMLInputElement>) => {
  if (e.key === 'Enter' || e.key === ',') {
    e.preventDefault();
    addTag(e);
  } else if ((e.key === 'Backspace' || e.key === 'Delete') && tagInput === '' && tags.length > 0) {
    e.preventDefault();
    const lastTag = tags[tags.length - 1];
    removeTag(lastTag);
  }
};

  const onSubmit = async (data: {
    title: string;
    template: string;
    category: string;
    tags: (string | undefined)[];
  }) => {
    const newId = await addTemplate({
      title: data.title,
      template: data.template,
      category: data.category,
      author: currentUser,
      tags: (data.tags ?? []).filter((t): t is string => !!t),
      used: 0,
    });
    setPublished(true);
    setToastFading(false);
    setTimeout(() => setToastFading(true), 3500);
    setTimeout(() => router.push(`/view/${newId}`), 5000);
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
        {published && (
          <div
            style={{
              position: 'fixed',
              top: '1.25rem',
              left: '50%',
              transform: 'translateX(-50%)',
              zIndex: 9999,
              backgroundColor: '#024731',
              color: '#fff',
              padding: '12px 28px',
              borderRadius: '999px',
              fontSize: '0.875rem',
              fontWeight: 600,
              boxShadow: '0 4px 20px rgba(0,0,0,0.18)',
              opacity: toastFading ? 0 : 1,
              transition: 'opacity 1.2s ease',
              pointerEvents: 'none',
              whiteSpace: 'nowrap',
            }}
          >
            Template published! Taking you there now...
          </div>
        )}
        <Form onSubmit={handleSubmit(onSubmit)}>

          {/* Title */}
          <Form.Group className="mb-4">
            <Form.Label className="fw-semibold">Problem Description / Title</Form.Label>
            <Form.Control
              type="text"
              placeholder="e.g. Resetting your UH Username password"
              {...register('title')}
              isInvalid={!!errors.title}
            />
            <Form.Control.Feedback type="invalid">{errors.title?.message}</Form.Control.Feedback>
          </Form.Group>

          {/* Category */}
          <Form.Group className="mb-4">
            <Form.Label className="fw-semibold">Category</Form.Label>
            <Form.Select {...register('category')} isInvalid={!!errors.category}>
              <option value="">Select a category...</option>
              {categoryOptions.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </Form.Select>
            <Form.Control.Feedback type="invalid">{errors.category?.message}</Form.Control.Feedback>
          </Form.Group>

          {/* Email Body */}
          <Form.Group className="mb-4">
            <Form.Label className="fw-semibold">Email Body</Form.Label>
            <Form.Control
              as="textarea"
              rows={10}
              placeholder={`Aloha [Student Name],\n\nMahalo for reaching out to the UH ITS Help Desk...\n\n`}
              style={{ fontFamily: 'monospace', fontSize: '0.9rem' }}
              {...register('template')}
              isInvalid={!!errors.template}
            />
            <Form.Control.Feedback type="invalid">{errors.template?.message}</Form.Control.Feedback>
            <Form.Text className="text-muted">
              Use placeholders like [Student Name] so others can quickly customize, but don&apos;t include a placeholder for sign-offs or sender contact info. The user&apos;s signature will be automatically appended when they press copy.
            </Form.Text>
          </Form.Group>

          {/* Tags */}
          <Form.Group className="mb-5">
            <Form.Label className="fw-semibold">
              Tags <span className="text-muted fw-normal">(optional — press Enter to add or press Backspace to delete)</span>
            </Form.Label>
            <div
              className="d-flex flex-wrap gap-2 align-items-center p-2"
              style={{ border: '1px solid #e4ebe7', borderRadius: '0.375rem', minHeight: '44px' }}
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
              {/* Suggests tags mapped to what is currently typed */}
              <datalist id="tag-suggestions"> 
                {existingTags.filter(tag => !tags.includes(tag)).map(tag => (
                  <option key={tag} value={tag} />
                ))}
              </datalist>
              <input
                type="text"
                value={tagInput}
                onChange={e => setTagInput(e.target.value)}
                onKeyDown={tagKeyboardHelper} // Redirected to tagKeyboardHelper to allow deletion of tags with keyboard as well.
                list={tagInput.length > 0 ? "tag-suggestions" : undefined}
                placeholder={tags.length === 0 ? 'e.g. password, reset, uh-username' : ''}
                style={{
                  border: 'none', outline: 'none', flexGrow: 1,
                  minWidth: '120px', fontSize: '0.9rem',
                }}
              />
            </div>
          </Form.Group>

          {/* Preview toggle */}
          <div className="mb-4">
            <Button
              type="button"
              variant="outline-secondary"
              size="sm"
              onClick={() => setShowPreview(p => !p)}
            >
              {showPreview ? 'Hide Preview' : 'Preview'}
            </Button>
          </div>

          {/* Live preview */}
          {showPreview && (
            <div
              className="mb-4"
              style={{
                border: '1px solid #e4ebe7',
                borderRadius: '0.375rem',
                overflow: 'hidden',
              }}
            >
              <div style={{ backgroundColor: '#024731', color: '#fff', padding: '16px 24px' }}>
                <div style={{ fontSize: '0.7rem', textTransform: 'uppercase', opacity: 0.7, letterSpacing: '0.1em', marginBottom: '4px' }}>
                  {watchCategory || 'No category selected'}
                </div>
                <div className="fw-bold" style={{ fontSize: '1.1rem' }}>
                  {watchTitle || 'No title yet'}
                </div>
              </div>
              <div style={{ padding: '20px 24px', backgroundColor: '#f4f7f5' }}>
                <pre style={{ whiteSpace: 'pre-wrap', fontFamily: 'inherit', fontSize: '0.9rem', marginBottom: 0, color: watchTemplate ? '#212529' : '#aaa' }}>
                  {watchTemplate || 'Email body will appear here...'}
                </pre>
              </div>
              {tags.length > 0 && (
                <div className="d-flex flex-wrap gap-1 px-4 py-3" style={{ borderTop: '1px solid #dee2e6' }}>
                  {tags.map(tag => (
                    <span key={tag} className="badge fw-normal" style={{ backgroundColor: '#024731', fontSize: '0.75rem' }}>
                      {tag}
                    </span>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Actions */}
          <Row>
            <Col className="d-flex gap-2">
              <Button type="submit" style={{ backgroundColor: '#024731', border: 'none' }}>
                Publish Template
              </Button>
              <Button
                type="button"
                variant="outline-secondary"
                onClick={() => { reset(); setTags([]); setTagInput(''); setShowPreview(false); }}
              >
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
