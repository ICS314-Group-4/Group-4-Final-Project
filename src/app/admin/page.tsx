import { Col, Container, Row } from 'react-bootstrap';
import { prisma } from '@/lib/prisma';
import TemplateFilterAdmin from '@/components/TemplateFilterAdmin';
import { adminProtectedPage } from '@/lib/page-protection';
import { auth } from '@/lib/auth';
import UserFilterAdmin from '@/components/UserFilterAdmin';
import MasterCodeManager from '@/components/MasterCodeManager';
import WhitelistManager from '@/components/WhitelistManager';
import { getMasterCode, getWhitelist } from '@/lib/dbActions';

const AdminPage = async () => {
  const session = await auth();
  adminProtectedPage(
    session as {
      user: { email: string; id: string; name: string };
    } | null,
  );

  const [templates, users, masterCode, whitelist] = await Promise.all([
    prisma.template.findMany({ orderBy: { used: 'desc' } }),
    prisma.user.findMany({}),
    getMasterCode().catch(() => ''),
    getWhitelist().catch(() => []),
  ]);

  const categories = [...new Set(templates.map(t => t.category))].filter(Boolean);
  const roles = [...new Set(users.map(u => u.role))].filter(Boolean);
  const registeredSet = new Set(users.map(u => u.email));
  const pendingWhitelist = whitelist.filter(e => !registeredSet.has(e.username));
  const registeredCount = whitelist.length - pendingWhitelist.length;

  const statPill = (label: string) => (
    <span style={{
      fontSize: '0.75rem', backgroundColor: '#e8f0ec', color: '#024731',
      padding: '4px 12px', borderRadius: '999px', fontWeight: 600,
    }}>
      {label}
    </span>
  );

  const sectionLabel = (eyebrow: string, title: string) => (
    <div className="mb-0">
      <span style={{ fontSize: '0.72rem', textTransform: 'uppercase', letterSpacing: '0.1em', color: '#024731', fontWeight: 700 }}>
        {eyebrow}
      </span>
      <h2 className="fw-bold mb-0" style={{ fontSize: '1.35rem' }}>{title}</h2>
    </div>
  );

  return (
    <main>

      {/* ── Header ───────────────────────────────────────────────── */}
      <div style={{ backgroundColor: '#024731', color: '#fff' }} className="py-4">
        <Container>
          <div className="d-flex justify-content-between align-items-center flex-wrap gap-2">
            <div>
              <h1 className="fw-bold mb-1">Admin Dashboard</h1>
              <p className="mb-0" style={{ opacity: 0.8, fontSize: '0.9rem' }}>
                {templates.length} template{templates.length !== 1 ? 's' : ''} · {users.length} user{users.length !== 1 ? 's' : ''}
              </p>
            </div>
            <a href="/add" className="btn btn-light fw-semibold" style={{ color: '#024731', fontSize: '0.9rem' }}>
              + Add Template
            </a>
          </div>
        </Container>
      </div>

      {/* ── Access Control ───────────────────────────────────────── */}
      <div style={{ backgroundColor: '#f4f7f5', borderBottom: '1px solid #e4ebe7' }} className="py-5">
        <Container>
          <div className="d-flex justify-content-between align-items-end mb-4">
            {sectionLabel('Access Control', 'Registration Settings')}
            <span style={{ fontSize: '0.875rem', color: '#6c757d' }}>
              {whitelist.length} whitelisted · {masterCode ? 'Code set' : 'No code set'}
            </span>
          </div>

          <Row className="g-4">
            {/* Master Code card */}
            <Col lg={4}>
              <div style={{
                backgroundColor: '#fff', border: '1px solid #e4ebe7',
                borderRadius: '0.5rem', padding: '1.5rem', height: '100%',
                boxShadow: '0 1px 4px rgba(2,71,49,0.06)',
              }}>
                <h3 className="fw-bold mb-1" style={{ fontSize: '1rem' }}>Master Code</h3>
                <p style={{ fontSize: '0.8rem', color: '#6c757d', marginBottom: '1.25rem' }}>
                  All new registrations require this code in addition to a whitelisted username.
                </p>
                <MasterCodeManager current={masterCode} />
              </div>
            </Col>

            {/* Whitelist card */}
            <Col lg={8}>
              <div style={{
                backgroundColor: '#fff', border: '1px solid #e4ebe7',
                borderRadius: '0.5rem', padding: '1.5rem', height: '100%',
                boxShadow: '0 1px 4px rgba(2,71,49,0.06)',
              }}>
                <div className="d-flex justify-content-between align-items-center mb-1">
                  <h3 className="fw-bold mb-0" style={{ fontSize: '1rem' }}>Username Whitelist</h3>
                  {statPill(`${whitelist.length} entr${whitelist.length !== 1 ? 'ies' : 'y'}`)}
                </div>
                <p style={{ fontSize: '0.8rem', color: '#6c757d', marginBottom: '1.25rem' }}>
                  Only UH usernames on this list can create an account. The display name is shown to other users.
                </p>
                <WhitelistManager entries={pendingWhitelist} registeredCount={registeredCount} />
              </div>
            </Col>
          </Row>
        </Container>
      </div>

      {/* ── User Management ──────────────────────────────────────── */}
      <div style={{ backgroundColor: '#fff', borderBottom: '1px solid #e4ebe7' }} className="py-5">
        <Container>
          <div className="d-flex justify-content-between align-items-end mb-4">
            {sectionLabel('Users', 'User Management')}
            {statPill(`${users.length} user${users.length !== 1 ? 's' : ''}`)}
          </div>
          <UserFilterAdmin user={users} roles={roles} />
        </Container>
      </div>

      {/* ── Content Templates ────────────────────────────────────── */}
      <div style={{ backgroundColor: '#f4f7f5', borderBottom: '1px solid #e4ebe7' }} className="py-5">
        <Container>
          <div className="d-flex justify-content-between align-items-end mb-4">
            {sectionLabel('Content', 'Templates')}
            {statPill(`${templates.length} template${templates.length !== 1 ? 's' : ''}`)}
          </div>
          <TemplateFilterAdmin templates={templates} categories={categories} />
        </Container>
      </div>

    </main>
  );
};

export default AdminPage;
