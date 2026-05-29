import { useState, useEffect } from 'react';
import { Navbar, Container, Nav, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

const NavbarComponent = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem('token');
  const [userDb, setUserDb] = useState(null);

  useEffect(() => {
    if (token) {
      import('../services/api').then(module => {
        module.default.get('/users/me').then(res => {
          setUserDb(res.data);
        }).catch(e => console.error(e));
      });
    }
  }, [token]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/');
  };

  let user = null;
  if (token) {
    try {
      user = JSON.parse(atob(token.split('.')[1]));
    } catch(e) {
      console.error('Error decoding token', e);
    }
  }

  return (
    <Navbar bg="primary" variant="dark" expand="lg">
      <Container>
        <Navbar.Brand href="/">Turismo Local UNA</Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            {userDb?.role === 'ROLE_ADMIN' && <Nav.Link onClick={() => navigate('/admin')}>Panel Admin</Nav.Link>}
          </Nav>
          {user ? (
            <div className="d-flex align-items-center">
              <img src={user.picture} alt="avatar" width="32" height="32" className="rounded-circle me-2 border border-white" />
              <span className="text-white me-3" style={{ fontSize: '0.9rem' }}>{user.name}</span>
              <Button variant="outline-light" size="sm" onClick={handleLogout} title="Cerrar Sesión">
                <span aria-hidden="true">🚪</span>
              </Button>
            </div>
          ) : (
            token && <Button variant="outline-light" onClick={handleLogout}>Cerrar Sesión</Button>
          )}
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default NavbarComponent;
