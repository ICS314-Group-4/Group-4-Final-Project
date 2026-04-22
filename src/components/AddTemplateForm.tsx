'use client';

import { useState } from 'react';
import { Container, Form, Button, Row, Col } from 'react-bootstrap';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useSession } from 'next-auth/react';
import { redirect } from 'next/navigation';
import swal from 'sweetalert';
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
  const { data: session, status } = useSession();
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState('');

  const { register, handleSubmit, reset, setValue, formState: { errors } } = useForm({
    resolver: yupResolver(AddTemplateSchema),
    defaultValues: { tags: [] },
  });

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

  const onSubmit = async (data: {
    title: string;
    template: string;
    category: string;
    tags: (string | undefined)[];
  }) => {
    await addTemplate({
      title: data.title,
      template: data.template,
      category: data.category,
      author: currentUser,
      tags: (data.tags ?? []).filter((t): t is string => !!t),
      used: 0,
    });
    await swal('Template Published!', 'Your template is now visible to the whole team.', 'success', { timer: 2000 });
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
              placeholder={`Aloha [Student Name],\n\nMahalo for reaching out to the UH ITS Help Desk...\n\nMahalo,\n[Your Name]\nUH ITS Help Desk`}
              style={{ fontFamily: 'monospace', fontSize: '0.9rem' }}
              {...register('template')}
              isInvalid={!!errors.template}
            />
            <Form.Control.Feedback type="invalid">{errors.template?.message}</Form.Control.Feedback>
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
              <Button
                type="button"
                variant="outline-secondary"
                onClick={() => { reset(); setTags([]); setTagInput(''); }}
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
