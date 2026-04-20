'use client';

import { Button, Card, Col, Container, Form, Row } from 'react-bootstrap';
import { useForm } from 'react-hook-form';
import swal from 'sweetalert';
import { yupResolver } from '@hookform/resolvers/yup';
import { Template } from '@prisma/client';
import { EditTemplateSchema } from '@/lib/validationSchemas';
import { editTemplate } from '@/lib/dbActions';

const categories = [
  'Google Core/Consumer Apps',
  'STAR/Banner',
  'UH Account',
  'Duo Mobile/MFA',
  'Lamaku/Laulima LMS',
  'Network/Printing',
  'General Support',
  'Site License',
];

const EditTemplateForm = ({ template }: { template: Template }) => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<Template>({
    resolver: yupResolver(EditTemplateSchema),
    defaultValues: template,
  });

  const onSubmit = async (data: Template) => {
    try {
      await editTemplate(data);
      swal('Success', 'Your template has been updated', 'success', {
        timer: 2000,
      });
    } catch (error) {
      swal('Error', 'Something went wrong while updating.', 'error');
    }
  };

  return (
    <Container className="py-3">
      <Row className="justify-content-center">
        <Col xs={12} md={8} lg={6}>
          <Col className="text-center mb-3">
            <h2>Edit Template</h2>
          </Col>
          <Card>
            <Card.Body>
              <Form onSubmit={handleSubmit(onSubmit)}>
                
                <input type="hidden" {...register('id')} />

                <Form.Group className="mb-3">
                  <Form.Label>Title</Form.Label>
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
                    {categories.map((category) => (
                      <option key={category} value={category}>
                        {category}
                      </option>
                    ))}
                  </Form.Select>
                  <Form.Control.Feedback type="invalid">
                    {errors.category?.message}
                  </Form.Control.Feedback>
                </Form.Group>

                {/* Hidden fields to preserve existing data that isn't editable */}
                <input type="hidden" {...register('tags')} />
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
                      onClick={() => reset()} 
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
  );
};

export default EditTemplateForm;
