'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Container, Row, Col, Button } from 'react-bootstrap';
import { Category } from '@prisma/client';
import { categoryLabels } from '@/lib/categoryLabels';

type TopTemplate = {
  id: number;
  title: string;
  category: string;
  used: number;
};

type Props = {
  userName: string;
  totalTemplates: number;
  totalUses: number;
  categoryCounts: Record<string, number>;
  topTemplates: TopTemplate[];
};

const allCategories = Object.values(Category);


const statPill: React.CSSProperties = {
  backgroundColor: 'rgba(255,255,255,0.12)',
  border: '1px solid rgba(255,255,255,0.22)',
  borderRadius: '999px',
  padding: '5px 16px',
  fontSize: '0.82rem',
  fontWeight: 500,
  color: '#fff',
  display: 'inline-block',
};

const HomeContent = ({ userName, totalTemplates, totalUses, categoryCounts, topTemplates }: Props) => {
  const router = useRouter();
  const [query, setQuery] = useState('');

  const handleSearch = () => {
    const q = query.trim();
    if (q) router.push(`/list?search=${encodeURIComponent(q)}`);
    else router.push('/list');
  };

  return (
    <main>

      {/* ── Hero ─────────────────────────────────────────────────── */}
      <div style={{ backgroundColor: '#024731', color: '#fff', position: 'relative', overflow: 'hidden' }} className="pt-5 pb-5">

        {/* Dot grid texture */}
        <div style={{
          position: 'absolute', inset: 0, pointerEvents: 'none',
          backgroundImage: 'radial-gradient(rgba(255,255,255,0.07) 1px, transparent 1px)',
          backgroundSize: '22px 22px',
        }} />

        {/* Decorative circles */}
        <div style={{
          position: 'absolute', top: '-120px', right: '-120px', pointerEvents: 'none',
          width: '420px', height: '420px', borderRadius: '50%',
          backgroundColor: 'rgba(255,255,255,0.05)',
        }} />
        <div style={{
          position: 'absolute', bottom: '-60px', right: '12%', pointerEvents: 'none',
          width: '220px', height: '220px', borderRadius: '50%',
          backgroundColor: 'rgba(255,255,255,0.04)',
        }} />

        <Container style={{ position: 'relative' }}>
          <Row className="align-items-center g-5">

            {/* Left: text */}
            <Col lg={6}>
              <p style={{ opacity: 0.6, fontSize: '0.8rem', marginBottom: '0.5rem', letterSpacing: '0.03em' }}>
                Welcome back, {userName}
              </p>
              <h1 style={{ fontSize: '2.2rem', fontWeight: 800, marginBottom: '0.75rem' }}>
                UH ITS Email Helper
              </h1>
              <p style={{ opacity: 0.82, fontSize: '0.95rem', lineHeight: 1.65, marginBottom: '1.75rem' }}>
                A shared library of email templates built by UH ITS student employees.
                Find a response, copy it, and get back to the next ticket faster.
              </p>
              <div className="d-flex gap-2 flex-wrap mb-4">
                <Button href="/list" variant="light" style={{ color: '#024731', fontWeight: 600 }}>
                  Browse Templates
                </Button>
                <Button href="/add" variant="outline-light">
                  Add a Template
                </Button>
              </div>
              <div className="d-flex gap-2 flex-wrap">
                <span style={statPill}>{totalTemplates} template{totalTemplates !== 1 ? 's' : ''}</span>
                <span style={statPill}>{totalUses.toLocaleString()} total uses</span>
              </div>
            </Col>

            {/* Right: search card */}
            <Col lg={6} className="d-none d-lg-block">
              <div style={{
                backgroundColor: '#fff',
                borderRadius: '0.75rem',
                boxShadow: '0 24px 64px rgba(0,0,0,0.28)',
                padding: '1.75rem',
                color: '#212529',
              }}>
                <p style={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: '#024731', opacity: 0.7, marginBottom: '0.75rem' }}>
                  Find a template
                </p>
                <div className="d-flex gap-2 mb-4">
                  <input
                    type="text"
                    value={query}
                    onChange={e => setQuery(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && handleSearch()}
                    placeholder="e.g. reset password, Duo setup..."
                    style={{
                      flex: 1,
                      border: '1.5px solid #e4ebe7',
                      borderRadius: '0.4rem',
                      padding: '9px 14px',
                      fontSize: '0.9rem',
                      outline: 'none',
                      transition: 'border-color 0.15s',
                    }}
                    onFocus={e => (e.target.style.borderColor = '#024731')}
                    onBlur={e => (e.target.style.borderColor = '#e4ebe7')}
                  />
                  <button
                    onClick={handleSearch}
                    style={{
                      backgroundColor: '#024731', color: '#fff',
                      border: 'none', borderRadius: '0.4rem',
                      padding: '9px 18px', fontWeight: 600,
                      fontSize: '0.9rem', cursor: 'pointer',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    Search
                  </button>
                </div>

                <div style={{ borderTop: '1px solid #e9ecef', paddingTop: '1rem' }}>
                  <a
                    href="/auth/edit-profile"
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.6rem',
                      fontSize: '0.875rem',
                      color: '#495057',
                      textDecoration: 'none',
                      padding: '8px 10px',
                      borderRadius: '0.375rem',
                      transition: 'background-color 0.15s, color 0.15s',
                    }}
                    onMouseEnter={e => {
                      const el = e.currentTarget as HTMLAnchorElement;
                      el.style.backgroundColor = '#f0f7f3';
                      el.style.color = '#024731';
                    }}
                    onMouseLeave={e => {
                      const el = e.currentTarget as HTMLAnchorElement;
                      el.style.backgroundColor = 'transparent';
                      el.style.color = '#495057';
                    }}
                  >
                    <span style={{ fontSize: '1rem' }}>✏️</span>
                    <div>
                      <div style={{ fontWeight: 600, lineHeight: 1.3 }}>Edit Profile</div>
                      <div style={{ fontSize: '0.75rem', opacity: 0.65 }}>Update your name &amp; email signature</div>
                    </div>
                  </a>
                </div>
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

      {/* ── Categories ───────────────────────────────────────────── */}
      <div style={{ backgroundColor: '#f4f7f5', paddingBottom: '3.5rem' }}>
        <Container>
          <div className="d-flex justify-content-between align-items-baseline mb-4 pt-4">
            <h2 className="fw-bold mb-0" style={{ fontSize: '1.15rem' }}>Browse by Category</h2>
            <a href="/list" className="text-muted" style={{ fontSize: '0.85rem' }}>See all →</a>
          </div>
          <Row xs={1} sm={2} md={4} className="g-3">
            {allCategories.map(cat => {
              const count = categoryCounts[cat] ?? 0;
              return (
                <Col key={cat}>
                  <a href={`/list?category=${cat}`} className="text-decoration-none" style={{ display: 'block', height: '100%' }}>
                    <div
                      style={{
                        height: '100%',
                        padding: '1.1rem 1.2rem',
                        backgroundColor: '#fff',
                        border: '1px solid #e4ebe7',
                        borderRadius: '0.5rem',
                        cursor: 'pointer',
                        boxShadow: '0 1px 4px rgba(2,71,49,0.06)',
                        transition: 'border-color 0.15s ease, box-shadow 0.15s ease, transform 0.15s ease',
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'space-between',
                      }}
                      onMouseEnter={e => {
                        const el = e.currentTarget as HTMLDivElement;
                        el.style.borderColor = '#024731';
                        el.style.transform = 'translateY(-3px)';
                        el.style.boxShadow = '0 8px 24px rgba(2,71,49,0.13)';
                      }}
                      onMouseLeave={e => {
                        const el = e.currentTarget as HTMLDivElement;
                        el.style.borderColor = '#e4ebe7';
                        el.style.transform = 'none';
                        el.style.boxShadow = '0 1px 4px rgba(2,71,49,0.06)';
                      }}
                    >
                      <div className="d-flex justify-content-between align-items-start">
                        <div style={{ fontSize: '1.6rem', fontWeight: 700, lineHeight: 1, color: count > 0 ? '#024731' : '#ccc' }}>
                          {count}
                        </div>
                        <span style={{ fontSize: '0.85rem', color: '#ccc', lineHeight: 1 }}>→</span>
                      </div>
                      <div style={{ fontSize: '0.83rem', color: '#495057', lineHeight: 1.35, fontWeight: 500, marginTop: '0.6rem' }}>
                        {categoryLabels[cat]}
                      </div>
                    </div>
                  </a>
                </Col>
              );
            })}
          </Row>
        </Container>
      </div>

      {/* ── Most Used ────────────────────────────────────────────── */}
      {topTemplates.length > 0 && (
        <div style={{ backgroundColor: '#fff', borderTop: '1px solid #e4ebe7', paddingTop: '3rem', paddingBottom: '3rem' }}>
          <Container>
            <div className="d-flex justify-content-between align-items-baseline mb-4">
              <h2 className="fw-bold mb-0" style={{ fontSize: '1.15rem' }}>Most Used</h2>
              <a href="/list" className="text-muted" style={{ fontSize: '0.85rem' }}>View all →</a>
            </div>
            <div className="d-flex flex-column gap-2">
              {topTemplates.map((t, i) => (
                <a key={t.id} href={`/view/${t.id}`} className="text-decoration-none">
                  <div
                    className="d-flex justify-content-between align-items-center px-3 py-3"
                    style={{
                      border: '1px solid #e9ecef',
                      borderRadius: '0.5rem',
                      backgroundColor: '#fff',
                      boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
                      transition: 'border-color 0.15s ease, box-shadow 0.15s ease, transform 0.15s ease',
                    }}
                    onMouseEnter={e => {
                      const el = e.currentTarget as HTMLDivElement;
                      el.style.borderColor = '#024731';
                      el.style.boxShadow = '0 4px 16px rgba(2,71,49,0.10)';
                      el.style.transform = 'translateY(-1px)';
                    }}
                    onMouseLeave={e => {
                      const el = e.currentTarget as HTMLDivElement;
                      el.style.borderColor = '#e9ecef';
                      el.style.boxShadow = '0 1px 3px rgba(0,0,0,0.04)';
                      el.style.transform = 'none';
                    }}
                  >
                    <div className="d-flex align-items-center gap-3">
                      <span style={{
                        width: '26px', height: '26px', borderRadius: '50%', flexShrink: 0,
                        backgroundColor: i === 0 ? '#024731' : '#eef1ef',
                        color: i === 0 ? '#fff' : '#888',
                        fontSize: '0.72rem', fontWeight: 700,
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                      }}>
                        {i + 1}
                      </span>
                      <div>
                        <div className="fw-semibold text-dark" style={{ fontSize: '0.95rem' }}>{t.title}</div>
                        <span className="badge fw-normal mt-1" style={{ backgroundColor: '#e8f0ec', color: '#024731', fontSize: '0.72rem' }}>
                          {categoryLabels[t.category as Category]}
                        </span>
                      </div>
                    </div>
                    <span style={{ fontSize: '0.82rem', color: '#024731', fontWeight: 700, whiteSpace: 'nowrap', marginLeft: '1rem' }}>
                      {t.used}×
                    </span>
                  </div>
                </a>
              ))}
            </div>
          </Container>
        </div>
      )}


    </main>
  );
};

export default HomeContent;
