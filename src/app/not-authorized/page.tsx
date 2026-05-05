import { Container } from 'react-bootstrap';
import Link from 'next/link';

const NotAuthorized = () => (
  <main>
    <div style={{ backgroundColor: '#024731', color: '#fff' }} className="py-4">
      <Container>
        <h1 className="fw-bold mb-1">Not Authorized</h1>
        <p className="mb-0" style={{ opacity: 0.85, fontSize: '0.95rem' }}>
          You don&apos;t have permission to view this page.
        </p>
      </Container>
    </div>
    <Container className="py-5 text-center">
      <p style={{ color: '#6c757d', marginBottom: '1.5rem' }}>
        If you believe this is a mistake, contact your site administrator.
      </p>
      <Link href="/" className="btn fw-semibold" style={{ backgroundColor: '#024731', color: '#fff', border: 'none' }}>
        Go to Home
      </Link>
    </Container>
  </main>
);

export default NotAuthorized;
