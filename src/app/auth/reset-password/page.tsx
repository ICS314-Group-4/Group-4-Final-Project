'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';
import { Container, Form, Button } from 'react-bootstrap';
import { resetPassword } from '@/lib/dbActions';

type FormData = {
  username: string;
  masterCode: string;
  newPassword: string;
  confirmPassword: string;
};

const schema = Yup.object({
  username: Yup.string().required('UH username is required'),
  masterCode: Yup.string().required('Master code is required'),
  newPassword: Yup.string()
    .required('Password is required')
    .min(8, 'Must be at least 8 characters')
    .max(32, 'Must not exceed 32 characters')
    .matches(/[A-Z]/, 'Must contain at least one uppercase letter')
    .matches(/[0-9]/, 'Must contain at least one number'),
  confirmPassword: Yup.string()
    .required('Please confirm your password')
    .oneOf([Yup.ref('newPassword')], 'Passwords do not match'),
});

const ResetPassword = () => {
  const router = useRouter();
  const [serverError, setServerError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
    resolver: yupResolver(schema),
  });

  const onSubmit = async (data: FormData) => {
    setSubmitting(true);
    setServerError('');
    const result = await resetPassword(data.username, data.masterCode, data.newPassword);
    if ('error' in result) {
      setServerError(result.error);
      setSubmitting(false);
      return;
    }
    router.push('/auth/signin?reset=success');
  };

  return (
    <main>
      <div style={{ backgroundColor: '#024731', color: '#fff', position: 'relative', overflow: 'hidden' }} className="py-4">
        <div style={{
          position: 'absolute', inset: 0, pointerEvents: 'none',
          backgroundImage: 'radial-gradient(rgba(255,255,255,0.07) 1px, transparent 1px)',
          backgroundSize: '22px 22px',
        }} />
        <Container style={{ position: 'relative' }}>
          <h1 className="fw-bold mb-1">Reset Password</h1>
          <p className="mb-0" style={{ opacity: 0.85, fontSize: '0.95rem' }}>
            Verify your identity with your username and the team master code.
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

        <Form onSubmit={handleSubmit(onSubmit)}>
          <Form.Group className="mb-4">
            <Form.Label className="fw-semibold">UH Username</Form.Label>
            <Form.Control
              type="text"
              placeholder="e.g. john123"
              {...register('username')}
              isInvalid={!!errors.username}
              style={{ borderColor: '#e4ebe7' }}
            />
            <Form.Control.Feedback type="invalid">{errors.username?.message}</Form.Control.Feedback>
          </Form.Group>

          <Form.Group className="mb-4">
            <Form.Label className="fw-semibold">Master Code</Form.Label>
            <Form.Control
              type="password"
              placeholder="Enter the team master code"
              {...register('masterCode')}
              isInvalid={!!errors.masterCode}
              style={{ borderColor: '#e4ebe7' }}
            />
            <Form.Control.Feedback type="invalid">{errors.masterCode?.message}</Form.Control.Feedback>
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label className="fw-semibold">New Password</Form.Label>
            <Form.Control
              type="password"
              placeholder="Create a new password"
              {...register('newPassword')}
              isInvalid={!!errors.newPassword}
              style={{ borderColor: '#e4ebe7' }}
            />
            <Form.Control.Feedback type="invalid">{errors.newPassword?.message}</Form.Control.Feedback>
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

          <Button
            type="submit"
            disabled={submitting}
            style={{ backgroundColor: '#024731', border: 'none', padding: '10px 28px', fontWeight: 600 }}
          >
            {submitting ? 'Resetting...' : 'Reset Password'}
          </Button>
        </Form>

        <p className="mt-4" style={{ fontSize: '0.875rem', color: '#6c757d' }}>
          Remembered it?{' '}
          <a href="/auth/signin" style={{ color: '#024731' }}>Sign in</a>
        </p>
      </Container>
    </main>
  );
};

export default ResetPassword;
