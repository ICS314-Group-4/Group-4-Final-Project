'use client';

import { signOut } from 'next-auth/react';
import { Container, Button } from 'react-bootstrap';

const SignOut = () => (
  <main style={{ minHeight: '100vh', backgroundColor: '#f4f7f5' }}>
    <div style={{ backgroundColor: '#024731', color: '#fff', position: 'relative', overflow: 'hidden' }} className="py-5">
      <div style={{
        position: 'absolute', inset: 0, pointerEvents: 'none',
        backgroundImage: 'radial-gradient(rgba(255,255,255,0.07) 1px, transparent 1px)',
        backgroundSize: '22px 22px',
      }} />
      <Container style={{ position: 'relative' }}>
        <h1 className="fw-bold mb-1" style={{ fontSize: '2rem' }}>Sign Out</h1>
        <p className="mb-0" style={{ opacity: 0.8, fontSize: '0.95rem' }}>
          UH ITS Email Helper
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
        textAlign: 'center',
      }}>
        <p className="fw-semibold mb-1" style={{ fontSize: '1.1rem' }}>Are you sure you want to sign out?</p>
        <p style={{ fontSize: '0.875rem', color: '#6c757d', marginBottom: '1.75rem' }}>
          You&apos;ll need to sign back in to access the template library.
        </p>

        <div className="d-flex gap-3 justify-content-center">
          <Button
            onClick={() => signOut({ callbackUrl: '/', redirect: true })}
            style={{ backgroundColor: '#024731', border: 'none', padding: '10px 28px', fontWeight: 600 }}
          >
            Yes, sign out
          </Button>
          <Button
            href="/"
            variant="outline-secondary"
            style={{ padding: '10px 28px' }}
          >
            Cancel
          </Button>
        </div>
      </div>
    </Container>
  </main>
);

export default SignOut;
