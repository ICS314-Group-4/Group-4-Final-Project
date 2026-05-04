'use client';

import { Suspense } from 'react';
import { signIn } from 'next-auth/react';
import { useSearchParams } from 'next/navigation';
import { Container, Form, Button } from 'react-bootstrap';

const errorMessages: Record<string, string> = {
  CredentialsSignin: 'Incorrect username or password.',
  default: 'Something went wrong. Please try again.',
};

const SignInForm = () => {
  const searchParams = useSearchParams();
  const error = searchParams.get('error');
  const errorMessage = error ? (errorMessages[error] ?? errorMessages.default) : null;

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const target = e.target as typeof e.target & {
      email: { value: string };
      password: { value: string };
    };
    await signIn('credentials', {
      callbackUrl: '/',
      email: target.email.value,
      password: target.password.value,
    });
  };

  return (
    <main style={{ minHeight: '100vh', backgroundColor: '#f4f7f5' }}>
      <div style={{ backgroundColor: '#024731', color: '#fff', position: 'relative', overflow: 'hidden' }} className="py-5">
        <div style={{
          position: 'absolute', inset: 0, pointerEvents: 'none',
          backgroundImage: 'radial-gradient(rgba(255,255,255,0.07) 1px, transparent 1px)',
          backgroundSize: '22px 22px',
        }} />
        <div style={{
          position: 'absolute', top: '-80px', right: '-80px', pointerEvents: 'none',
          width: '300px', height: '300px', borderRadius: '50%',
          backgroundColor: 'rgba(255,255,255,0.05)',
        }} />
        <Container style={{ position: 'relative' }}>
          <p style={{ opacity: 0.6, fontSize: '0.8rem', marginBottom: '0.4rem', letterSpacing: '0.03em' }}>
            UH ITS Email Helper
          </p>
          <h1 className="fw-bold mb-1" style={{ fontSize: '2rem' }}>Welcome back</h1>
          <p className="mb-0" style={{ opacity: 0.8, fontSize: '0.95rem' }}>
            Sign in to access the template library.
          </p>
        </Container>
      </div>

      <Container className="py-5" style={{ maxWidth: '420px' }}>
        <div style={{
          backgroundColor: '#fff',
          border: '1px solid #e4ebe7',
          borderRadius: '0.75rem',
          padding: '2rem',
          boxShadow: '0 4px 24px rgba(2,71,49,0.08)',
        }}>
          {errorMessage && (
            <div style={{
              backgroundColor: '#fff3f3',
              border: '1px solid #f5c6cb',
              borderRadius: '0.375rem',
              padding: '10px 16px',
              fontSize: '0.875rem',
              color: '#842029',
              marginBottom: '1.25rem',
              fontWeight: 500,
            }}>
              {errorMessage}
            </div>
          )}

          <Form method="post" onSubmit={handleSubmit}>
            <Form.Group className="mb-4">
              <Form.Label className="fw-semibold" style={{ fontSize: '0.9rem' }}>UH Username</Form.Label>
              <Form.Control
                name="email"
                type="text"
                placeholder="e.g. john123"
                style={{ borderColor: '#e4ebe7', fontSize: '0.95rem', padding: '10px 14px' }}
              />
            </Form.Group>

            <Form.Group className="mb-4">
              <Form.Label className="fw-semibold" style={{ fontSize: '0.9rem' }}>Password</Form.Label>
              <Form.Control
                name="password"
                type="password"
                placeholder="Enter your password"
                style={{ borderColor: '#e4ebe7', fontSize: '0.95rem', padding: '10px 14px' }}
              />
            </Form.Group>

            <Button
              type="submit"
              className="w-100"
              style={{ backgroundColor: '#024731', border: 'none', padding: '11px', fontWeight: 600, fontSize: '0.95rem' }}
            >
              Sign In
            </Button>
          </Form>

          <p className="mt-4 mb-0 text-center" style={{ fontSize: '0.875rem', color: '#6c757d' }}>
            Don&apos;t have an account?{' '}
            <a href="/auth/signup" style={{ color: '#024731', fontWeight: 500 }}>Sign up</a>
          </p>
        </div>
      </Container>
    </main>
  );
};

const SignIn = () => (
  <Suspense>
    <SignInForm />
  </Suspense>
);

export default SignIn;
