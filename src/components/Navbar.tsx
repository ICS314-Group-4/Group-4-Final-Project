'use client';

import { useSession } from 'next-auth/react';
import { usePathname } from 'next/navigation';
import { Container, Nav, Navbar, NavDropdown } from 'react-bootstrap';
import { BoxArrowRight, Lock, PersonFill, PersonGear, PersonPlusFill } from 'react-bootstrap-icons';

const NavBar: React.FC = () => {
  const { data: session, status } = useSession();
  const pathName = usePathname();
  if (status === 'loading') return null;
  const currentUser = session?.user?.email;
  const role = session?.user?.role;

  const linkStyle = (active: boolean): React.CSSProperties => ({
    fontSize: '0.9rem',
    fontWeight: 500,
    padding: '6px 14px',
    borderBottom: active ? '2px solid rgba(255,255,255,0.85)' : '2px solid transparent',
    borderRadius: 0,
    color: active ? '#fff' : 'rgba(255,255,255,0.75)',
    transition: 'color 0.15s, border-color 0.15s',
  });

  const userBoxTitle = (
    <span style={{
      display: 'inline-flex',
      alignItems: 'center',
      gap: '6px',
      border: '1px solid rgba(255,255,255,0.35)',
      borderRadius: '0.375rem',
      padding: '4px 12px',
      fontSize: '0.85rem',
      fontWeight: 500,
      color: '#fff',
    }}>
      <PersonFill size={13} />
      {currentUser}
    </span>
  );

  const loginBoxTitle = (
    <span style={{
      display: 'inline-flex',
      alignItems: 'center',
      gap: '6px',
      border: '1px solid rgba(255,255,255,0.35)',
      borderRadius: '0.375rem',
      padding: '4px 12px',
      fontSize: '0.85rem',
      fontWeight: 500,
      color: '#fff',
    }}>
      <PersonFill size={13} />
      Login
    </span>
  );

  return (
    <Navbar expand="lg" style={{ backgroundColor: '#024731' }} variant="dark">
      <Container>
        <Navbar.Brand href="/" style={{ fontWeight: 700, fontSize: '1.05rem', letterSpacing: '-0.01em' }}>
          UH ITS Email Helper
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            {currentUser && (
              <>
                <Nav.Link
                  id="browse-nav"
                  href="/list"
                  style={linkStyle(pathName === '/list')}
                >
                  Browse Templates
                </Nav.Link>
                <Nav.Link
                  id="add-nav"
                  href="/add"
                  style={linkStyle(pathName === '/add')}
                >
                  Add Template
                </Nav.Link>
                <Nav.Link id="my-templates" href="/user-templates" active={pathName === '/user-templates'}>
                  My Templates
                </Nav.Link>
              </>
            )}
            {currentUser && role === 'ADMIN' && (
              <Nav.Link
                id="admin-stuff-nav"
                href="/admin"
                style={linkStyle(pathName === '/admin')}
              >
                Admin
              </Nav.Link>
            )}
          </Nav>

          <Nav>
            {session ? (
              <NavDropdown id="login-dropdown" title={userBoxTitle}>
                <NavDropdown.Item id="login-dropdown-edit-profile" href="/auth/edit-profile" className="d-flex align-items-center gap-2">
                  <PersonGear size={14} />
                  Edit Profile
                </NavDropdown.Item>
                <NavDropdown.Item id="login-dropdown-change-password" href="/auth/change-password" className="d-flex align-items-center gap-2">
                  <Lock size={14} />
                  Change Password
                </NavDropdown.Item>
                <NavDropdown.Divider />
                <NavDropdown.Item id="login-dropdown-sign-out" href="/auth/signout" className="d-flex align-items-center gap-2">
                  <BoxArrowRight size={14} />
                  Sign Out
                </NavDropdown.Item>
              </NavDropdown>
            ) : (
              <NavDropdown id="login-dropdown" title={loginBoxTitle}>
                <NavDropdown.Item id="login-dropdown-sign-in" href="/auth/signin" className="d-flex align-items-center gap-2">
                  <PersonFill size={14} />
                  Sign In
                </NavDropdown.Item>
                <NavDropdown.Item id="login-dropdown-sign-up" href="/auth/signup" className="d-flex align-items-center gap-2">
                  <PersonPlusFill size={14} />
                  Sign Up
                </NavDropdown.Item>
              </NavDropdown>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default NavBar;
