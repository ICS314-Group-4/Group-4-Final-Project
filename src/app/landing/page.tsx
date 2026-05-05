'use client';

import { Container, Row, Col, Button } from 'react-bootstrap';
import { BookmarkPlus, Search, Pen } from 'react-bootstrap-icons';

const features = [
  {
    icon: <Pen size={28} />,
    title: 'Create Templates',
    description: 'Write and publish your own email responses so the whole team can find and reuse them.',
    href: '/add',
  },
  {
    icon: <Search size={28} />,
    title: 'Browse & Copy',
    description: 'Search by category, tag, or keyword. Copy a template in one click and it\'s ready to paste.',
    href: '/list',
  },
  {
    icon: <BookmarkPlus size={28} />,
    title: 'Built by the Team',
    description: 'Every template is written by a fellow UH ITS student worker — responses that work across the whole UH community.',
    href: '/auth/signin',
  },
];

const LandingPage = () => (
  <main>

    {/* ── Hero ─────────────────────────────────────────────────── */}
    <div style={{ backgroundColor: '#024731', color: '#fff', position: 'relative', overflow: 'hidden' }} className="py-5">

      {/* Dot grid texture */}
      <div style={{
        position: 'absolute', inset: 0, pointerEvents: 'none',
        backgroundImage: 'radial-gradient(rgba(255,255,255,0.07) 1px, transparent 1px)',
        backgroundSize: '22px 22px',
      }} />
      <div style={{
        position: 'absolute', top: '-120px', right: '-120px', pointerEvents: 'none',
        width: '420px', height: '420px', borderRadius: '50%',
        backgroundColor: 'rgba(255,255,255,0.05)',
      }} />

      <Container style={{ position: 'relative' }}>
        <Row className="align-items-center g-5">

          {/* Left: text */}
          <Col lg={6}>
<h1 style={{ fontSize: '2.4rem', fontWeight: 800, lineHeight: 1.2, marginBottom: '1rem' }}>
              Save time.<br />Help more students.
            </h1>
            <p style={{ fontSize: '1rem', opacity: 0.85, lineHeight: 1.7, marginBottom: '2rem', maxWidth: '480px' }}>
              A shared library of email templates built by UH ITS student workers.
              Find a tested response, copy it, and get back to helping the UH community faster.
            </p>
            <div className="d-flex gap-3 flex-wrap">
              <Button
                href="/auth/signin"
                size="lg"
                variant="light"
                style={{ color: '#024731', fontWeight: 700, paddingLeft: '28px', paddingRight: '28px' }}
              >
                Sign In
              </Button>
              <Button
                href="/auth/signup"
                size="lg"
                variant="outline-light"
                style={{ paddingLeft: '28px', paddingRight: '28px' }}
              >
                Create Account
              </Button>
            </div>
          </Col>

          {/* Right: ITS building image */}
          <Col lg={6} className="d-none d-lg-block">
            <div style={{
              borderRadius: '0.75rem',
              overflow: 'hidden',
              boxShadow: '0 24px 64px rgba(0,0,0,0.3)',
            }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/ITS-Building.jpg"
                alt="UH ITS Building"
                style={{ width: '100%', height: '340px', objectFit: 'cover', display: 'block' }}
              />
            </div>
          </Col>

        </Row>
      </Container>

      {/* Diagonal into next section */}
      <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, lineHeight: 0 }}>
        <svg viewBox="0 0 1440 56" preserveAspectRatio="none" style={{ width: '100%', height: '56px', display: 'block' }}>
          <polygon points="0,56 1440,0 1440,56" fill="#f4f7f5" />
        </svg>
      </div>
      <div style={{ height: '56px' }} />
    </div>

    {/* ── Features ─────────────────────────────────────────────── */}
    <div style={{ backgroundColor: '#f4f7f5', paddingBottom: '4rem' }}>
      <Container>
        <div className="text-center pt-5 mb-5">
          <h2 className="fw-bold mb-2" style={{ fontSize: '1.6rem' }}>Everything you need, nothing you don&apos;t</h2>
          <p style={{ color: '#6c757d', fontSize: '0.95rem', maxWidth: '500px', margin: '0 auto' }}>
            Built specifically for the UH ITS Help Desk workflow.
          </p>
        </div>

        <Row className="g-4 justify-content-center">
          {features.map(f => (
            <Col key={f.title} md={4}>
              <div
                style={{
                  backgroundColor: '#fff',
                  border: '1px solid #e4ebe7',
                  borderRadius: '0.5rem',
                  padding: '2rem 1.5rem',
                  height: '100%',
                  boxShadow: '0 1px 4px rgba(2,71,49,0.06)',
                  transition: 'transform 0.15s ease, box-shadow 0.15s ease, border-color 0.15s ease',
                }}
                onMouseEnter={e => {
                  const el = e.currentTarget as HTMLDivElement;
                  el.style.transform = 'translateY(-3px)';
                  el.style.boxShadow = '0 8px 24px rgba(2,71,49,0.12)';
                  el.style.borderColor = '#024731';
                }}
                onMouseLeave={e => {
                  const el = e.currentTarget as HTMLDivElement;
                  el.style.transform = 'none';
                  el.style.boxShadow = '0 1px 4px rgba(2,71,49,0.06)';
                  el.style.borderColor = '#e4ebe7';
                }}
              >
                <div style={{
                  width: '52px', height: '52px', borderRadius: '0.5rem',
                  backgroundColor: '#e8f0ec', color: '#024731',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  marginBottom: '1.25rem',
                }}>
                  {f.icon}
                </div>
                <h5 className="fw-bold mb-2" style={{ fontSize: '1rem' }}>{f.title}</h5>
                <p style={{ fontSize: '0.875rem', color: '#6c757d', lineHeight: 1.6, marginBottom: 0 }}>
                  {f.description}
                </p>
              </div>
            </Col>
          ))}
        </Row>
      </Container>
    </div>

    {/* ── CTA strip ────────────────────────────────────────────── */}
    <div style={{ backgroundColor: '#024731', color: '#fff', position: 'relative', overflow: 'hidden' }} className="py-5">
      <div style={{
        position: 'absolute', inset: 0, pointerEvents: 'none',
        backgroundImage: 'radial-gradient(rgba(255,255,255,0.06) 1px, transparent 1px)',
        backgroundSize: '22px 22px',
      }} />
      <Container className="text-center" style={{ position: 'relative' }}>
        <h2 className="fw-bold mb-2" style={{ fontSize: '1.75rem' }}>Ready to get started?</h2>
        <p style={{ opacity: 0.8, fontSize: '0.95rem', marginBottom: '2rem' }}>
          Join your teammates and build the library together.
        </p>
        <div className="d-flex gap-3 justify-content-center flex-wrap">
          <Button
            href="/auth/signin"
            variant="light"
            style={{ color: '#024731', fontWeight: 700, padding: '10px 28px' }}
          >
            Sign In
          </Button>
          <Button
            href="/auth/signup"
            variant="outline-light"
            style={{ padding: '10px 28px' }}
          >
            Create Account
          </Button>
        </div>
      </Container>
    </div>

  </main>
);

export default LandingPage;
