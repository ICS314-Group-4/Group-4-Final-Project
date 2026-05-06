'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';
import { Container, Button, Form } from 'react-bootstrap';
import { editProfile } from '@/lib/dbActions';

type EditProfileForm = {
  newName: string;
  newSig: string;
};

const validationSchema = Yup.object().shape({
  newName: Yup.string().min(2, 'Name must be at least 2 characters').max(100, 'Name must not exceed 100 characters').default(''),
  newSig: Yup.string().max(1000, 'Signature must not exceed 1000 characters').default(''),
  // completely arbitrary max length, can change or even remove if there's reason to
});

const EditProfileForm = ({ email, name, signature }: { email: string; name: string; signature: string }) => {
  const [saved, setSaved] = useState(false);
  const [serverError, setServerError] = useState('');

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<EditProfileForm>({
    resolver: yupResolver(validationSchema),
    defaultValues: { newName: name, newSig: signature ?? '' },
  });

  const onSubmit = async (data: EditProfileForm) => {
    setServerError('');
    const result = await editProfile({ email, ...data });
    if ('error' in result) { setServerError(result.error); return; }
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <main>
      {/* Header */}
      <div style={{ backgroundColor: '#024731', color: '#fff' }} className="py-4">
        <Container>
          <h1 className="fw-bold mb-1">Edit Profile</h1>
        </Container>
      </div>
      {/* Body */}
      <Container className="py-5" style={{ maxWidth: '760px' }}>
        {serverError && (
          <div style={{
            backgroundColor: '#fff3f3', border: '1px solid #f5c6cb',
            borderRadius: '0.375rem', padding: '10px 16px',
            fontSize: '0.875rem', color: '#842029',
            marginBottom: '1.5rem', fontWeight: 500,
          }}>
            {serverError}
          </div>
        )}
        {saved && (
          <div style={{
            backgroundColor: '#e8f0ec', border: '1px solid #c8d8d0',
            borderRadius: '0.375rem', padding: '10px 16px',
            fontSize: '0.875rem', color: '#024731',
            marginBottom: '1.5rem', fontWeight: 500,
          }}>
            Profile updated successfully.
          </div>
        )}
        <Form onSubmit={handleSubmit(onSubmit)}>
            <Form.Group className="mb-4">
            <Form.Label>Name</Form.Label>
            <input
                type="text"
                {...register('newName')}
                className={`form-control ${errors.newName ? 'is-invalid' : ''}`}
            />
            <div className="invalid-feedback">{errors.newName?.message}</div>
            <Form.Text className="text-muted">
              This name will be shown to other users when you post templates and comments. This should be your real name. It will be shown to other users when you post templates/comments, and will also be added to your default signature.
            </Form.Text>
            </Form.Group>

            <Form.Group className="mb-4">
            <Form.Label>Signature</Form.Label>
            <textarea
                {...register('newSig')}
                className={`form-control ${errors.newSig ? 'is-invalid' : ''}`}
                rows={4}
                style={{ resize: 'vertical' }}
            />
            <div className="invalid-feedback">{errors.newSig?.message}</div>
            <Form.Text className="text-muted">
              This signature will be appended to the end of any template you copy. You can use it to add contact information and/or sign-offs. If you do not set one, your signature will default to:
              <br />
              <br />Thank you,
              <br />[Name]
              <br />ITS Help Desk Consultant
            </Form.Text>
            </Form.Group>

            <Form.Group className="py-3">
            <Button type="submit" className="button">
                Save Changes
            </Button>
            <Button type="button" variant='outline-secondary' onClick={() => reset({ newName: name, newSig: signature ?? '' })} className='float-end' >
                Reset
            </Button>
          </Form.Group>
        </Form>
      </Container>
    </main>
  );
};

export default EditProfileForm;
