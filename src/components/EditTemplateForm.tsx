'use client';

import { Button, Card, Col, Container, Form, Row } from 'react-bootstrap';
import { useForm } from 'react-hook-form';
import swal from 'sweetalert';
import { yupResolver } from '@hookform/resolvers/yup';
import { Template } from '@prisma/client';
import { EditTemplateSchema } from '@/lib/validationSchemas';
import { editTemplate } from '@/lib/dbActions';
import { useState } from 'react';
import { useRouter } from 'next/navigation';  
import { useEffect } from 'react';


const categoryMapping: Record<string, string> = {
  'GOOGLE_APPS': 'Google Core/Consumer Apps',
  'STAR_BANNER': 'STAR/Banner',
  'UH_ACCOUNT': 'UH Account',
  'DUO_MOBILE_MFA': 'Duo Mobile/MFA',
  'LAMAKU_LAULIMA': 'Lamaku/Laulima LMS',
  'NETWORK_PRINTING': 'Network/Printing',
  'GENERAL_SUPPORT': 'General Support',
  'SITE_LICENSE': 'Site License',
};


const EditTemplateForm = ({ template }: { template: Template }) => {
  const [tags, setTags] = useState<string[]>(template.tags || []);
  const [tagInput, setTagInput] = useState('');
  const [serverError, setServerError] = useState('');

  const router = useRouter();
  
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm<Template>({
    resolver: yupResolver(EditTemplateSchema),
    defaultValues: {
      ...template,
      category: template.category,
    },
  });

  useEffect(() => {
  setValue('tags', tags);
}, [tags, setValue]);

  const onSubmit = async (data: Template) => {
    setServerError('');
    const result = await editTemplate(data);
    if ('error' in result) {
      setServerError(result.error);
      return;
    }
    await swal({ title: 'Success!', text: 'Your template has been updated', icon: 'success', timer: 2000, buttons: [false] });
    router.push('/list');
  };
  
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

  const handleReset = () => {
  reset();            // Clears title, template, category, etc.
  setTags(template.tags || []);        // Clears your local tags state
  setTagInput('');    // Clears the input field
};

  return (
    <main>
    {/* Header */}
      <div style={{ backgroundColor: '#024731', color: '#fff' }} className="py-4">
        <Container>
          <h1 className="fw-bold mb-1">Edit Template</h1>
          <p className="mb-0" style={{ opacity: 0.85, fontSize: '0.95rem' }}>
            Share a response that worked — the whole team can find and use it.
          </p>
        </Container>
      </div>
      
    <Container className="py-3">
      <Row className="justify-content-center">
        <Col xs={12} md={8} lg={6}>
          {serverError && (
            <div style={{
              backgroundColor: '#fff3f3', border: '1px solid #f5c6cb',
              borderRadius: '0.375rem', padding: '10px 16px',
              fontSize: '0.875rem', color: '#842029',
              marginBottom: '1rem', fontWeight: 500,
            }}>
              {serverError}
            </div>
          )}
          <Card>
            <Card.Body>
              <Form onSubmit={handleSubmit(onSubmit)}>
                
                <input type="hidden" {...register('id')} />

                <Form.Group className="mb-3">
                  <Form.Label>Problem Description / Title</Form.Label>
                  <Form.Control
                    type="text"
                    {...register('title')}
                    isInvalid={!!errors.title}
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.title?.message}
                  </Form.Control.Feedback>
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Template Content</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={4}
                    {...register('template')}
                    isInvalid={!!errors.template}
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.template?.message}
                  </Form.Control.Feedback>
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Category</Form.Label>
                  <Form.Select
                    {...register('category')}
                    isInvalid={!!errors.category}
                  >
                    <option value="">Select a category...</option>
                    {Object.entries(categoryMapping).map(([key, label]) => (
                      <option key={key} value={key}>
                        {label}
                      </option>
                    ))}
                  </Form.Select>
                  <Form.Control.Feedback type="invalid">
                    {errors.category?.message}
                  </Form.Control.Feedback>
                </Form.Group>

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

                {/* Hidden fields to preserve existing data that isn't editable */}
                <input type="hidden" {...register('author')} />
                <input type="hidden" {...register('used')} />

                <Row className="pt-3">
                  <Col>
                    <Button type="submit" variant="primary" className="w-100">
                      Submit
                    </Button>
                  </Col>
                  <Col>
                    <Button 
                      type="button" 
                      onClick={handleReset} 
                      variant="outline-warning" 
                      className="w-100"
                    >
                      Reset
                    </Button>
                  </Col>
                </Row>
              </Form>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  </main>
  );
};

export default EditTemplateForm;
