'use client';

import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';
import { Container, Form, Button } from 'react-bootstrap';
import { registerUser } from '@/lib/dbActions';

type FormData = {
  username: string;
  masterCode: string;
  password: string;
  confirmPassword: string;
};

const schema = Yup.object({
  username: Yup.string().required('UH username is required'),
  masterCode: Yup.string().required('Master code is required'),
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

const SignUp = () => {
  const [serverError, setServerError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
    resolver: yupResolver(schema),
  });

  const onSubmit = async (data: FormData) => {
    setSubmitting(true);
    setServerError('');
    const result = await registerUser(data.username, data.masterCode, data.password);
    if ('error' in result) {
      setServerError(result.error);
      setSubmitting(false);
      return;
    }
    await signIn('credentials', {
      callbackUrl: '/auth/edit-profile',
      email: data.username.toLowerCase().trim(),
      password: data.password,
    });
  };

  return (
    <main>
      <div style={{ backgroundColor: '#024731', color: '#fff' }} className="py-4">
        <Container>
          <h1 className="fw-bold mb-1">Create Account</h1>
          <p className="mb-0" style={{ opacity: 0.85, fontSize: '0.95rem' }}>
            You need a UH username on the whitelist and the team master code to register.
          </p>
        </Container>
      </div>

      <Container className="py-5" style={{ maxWidth: '480px' }}>
        {serverError && (
          <div style={{
            backgroundColor: '#fff3f3', border: '1px solid #f5c6cb',
            borderRadius: '0.375rem', padding: '10px 16px',
            fontSize: '0.875rem', color: '#842029', marginBottom: '1.5rem',
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
            <Form.Text className="text-muted">Your UH username, not your full email address.</Form.Text>
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
            <Form.Text className="text-muted">Ask your site admin if you don&apos;t have this.</Form.Text>
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label className="fw-semibold">Password</Form.Label>
            <Form.Control
              type="password"
              placeholder="Create a password"
              {...register('password')}
              isInvalid={!!errors.password}
              style={{ borderColor: '#e4ebe7' }}
            />
            <Form.Control.Feedback type="invalid">{errors.password?.message}</Form.Control.Feedback>
            <Form.Text className="text-muted">8–32 characters, at least one uppercase letter and one number.</Form.Text>
          </Form.Group>

          <Form.Group className="mb-5">
            <Form.Label className="fw-semibold">Confirm Password</Form.Label>
            <Form.Control
              type="password"
              placeholder="Re-enter your password"
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
            {submitting ? 'Creating account...' : 'Create Account'}
          </Button>
        </Form>

        <p className="mt-4" style={{ fontSize: '0.875rem', color: '#6c757d' }}>
          Already have an account?{' '}
          <a href="/auth/signin" style={{ color: '#024731' }}>Sign in</a>
        </p>
      </Container>
    </main>
  );
};

export default SignUp;
