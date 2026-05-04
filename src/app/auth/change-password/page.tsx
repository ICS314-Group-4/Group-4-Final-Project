'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useSession } from 'next-auth/react';
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';
import { Container, Form, Button } from 'react-bootstrap';
import { changePassword } from '@/lib/dbActions';
import LoadingSpinner from '@/components/LoadingSpinner';

type ChangePasswordForm = {
  oldpassword: string;
  password: string;
  confirmPassword: string;
};

const validationSchema = Yup.object({
  oldpassword: Yup.string().required('Current password is required'),
  password: Yup.string()
    .required('Password is required')
    .min(8, 'Must be at least 8 characters')
    .max(32, 'Must not exceed 32 characters')
    .matches(/[A-Z]/, 'Must contain at least one uppercase letter')
    .matches(/[0-9]/, 'Must contain at least one number'),
  confirmPassword: Yup.string()
    .required('Please confirm your password')
    .oneOf([Yup.ref('password')], 'Passwords do not match'),
});

const ChangePassword = () => {
  const { data: session, status } = useSession();
  const email = session?.user?.email || '';
  const [saved, setSaved] = useState(false);
  const [serverError, setServerError] = useState('');

  const { register, handleSubmit, reset, formState: { errors } } = useForm<ChangePasswordForm>({
    resolver: yupResolver(validationSchema),
  });

  if (status === 'loading') return <LoadingSpinner />;

  const onSubmit = async (data: ChangePasswordForm) => {
    setServerError('');
    const result = await changePassword({ email, oldpassword: data.oldpassword, password: data.password });
    if ('error' in result) {
      setServerError(result.error);
      return;
    }
    reset();
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <main>
      <div style={{ backgroundColor: '#024731', color: '#fff' }} className="py-4">
        <Container>
          <h1 className="fw-bold mb-1">Change Password</h1>
          <p className="mb-0" style={{ opacity: 0.85, fontSize: '0.95rem' }}>
            Update your account password.
          </p>
        </Container>
      </div>

      <Container className="py-5" style={{ maxWidth: '480px' }}>
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
            Password updated successfully.
          </div>
        )}

        <Form onSubmit={handleSubmit(onSubmit)}>
          <Form.Group className="mb-4">
            <Form.Label className="fw-semibold">Current Password</Form.Label>
            <Form.Control
              type="password"
              placeholder="Enter your current password"
              {...register('oldpassword')}
              isInvalid={!!errors.oldpassword}
              style={{ borderColor: '#e4ebe7' }}
            />
            <Form.Control.Feedback type="invalid">{errors.oldpassword?.message}</Form.Control.Feedback>
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label className="fw-semibold">New Password</Form.Label>
            <Form.Control
              type="password"
              placeholder="Create a new password"
              {...register('password')}
              isInvalid={!!errors.password}
              style={{ borderColor: '#e4ebe7' }}
            />
            <Form.Control.Feedback type="invalid">{errors.password?.message}</Form.Control.Feedback>
            <Form.Text className="text-muted">8–32 characters, at least one uppercase letter and one number.</Form.Text>
          </Form.Group>

          <Form.Group className="mb-5">
            <Form.Label className="fw-semibold">Confirm New Password</Form.Label>
            <Form.Control
              type="password"
              placeholder="Re-enter your new password"
              {...register('confirmPassword')}
              isInvalid={!!errors.confirmPassword}
              style={{ borderColor: '#e4ebe7' }}
            />
            <Form.Control.Feedback type="invalid">{errors.confirmPassword?.message}</Form.Control.Feedback>
          </Form.Group>

          <div className="d-flex gap-2">
            <Button
              type="submit"
              style={{ backgroundColor: '#024731', border: 'none', padding: '10px 28px', fontWeight: 600 }}
            >
              Save Changes
            </Button>
            <Button
              type="button"
              variant="outline-secondary"
              onClick={() => { reset(); setSaved(false); }}
            >
              Reset
            </Button>
          </div>
        </Form>
      </Container>
    </main>
  );
};

export default ChangePassword;
