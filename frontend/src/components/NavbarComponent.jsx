import { useState, useEffect } from 'react';
import { Navbar, Container, Nav, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { LogOut } from 'lucide-react';



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
    setUserDb(null);
    window.location.href = '/';
  };

  let user = null;
  if (token) {
    try {
      // Decodificación segura para caracteres UTF-8 (tildes, eñes)
      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(atob(base64).split('').map(function (c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
      }).join(''));
      user = JSON.parse(jsonPayload);
    } catch (e) {
      console.error('Error decoding token', e);
    }
  }

  const navbarStyle = {
    background: 'linear-gradient(135deg, rgba(0, 150, 136, 0.85) 0%, rgba(0, 77, 64, 0.9) 100%)',
    backdropFilter: 'blur(16px)',
    WebkitBackdropFilter: 'blur(16px)',
    boxShadow: '0 10px 30px rgba(0, 0, 0, 0.2)',
    borderBottomRightRadius: '25px',
    position: 'relative',
    overflow: 'hidden',
    zIndex: 1000,
    width: '100%'
  };

  const leaves = Array.from({ length: 8 });

  return (
    <>
      <style>{`
        @keyframes fallAndSway {
          0% { transform: translateY(-40px) translateX(0px) rotate(0deg); opacity: 0; }
          10% { opacity: 0.6; }
          90% { opacity: 0.6; }
          100% { transform: translateY(120px) translateX(30px) rotate(360deg); opacity: 0; }
        }
        .leaf {
          position: absolute;
          top: -20px;
          background: rgba(255, 255, 255, 0.15);
          width: 15px;
          height: 15px;
          border-radius: 0 15px 0 15px;
          pointer-events: none;
        }
      `}</style>
      <Navbar variant="dark" expand="lg" style={navbarStyle} className="mx-auto">

        {/* Partículas de hojas cayendo */}
        {leaves.map((_, i) => (
          <div key={i} className="leaf" style={{
            left: `${Math.random() * 95}%`,
            animation: `fallAndSway ${3 + Math.random() * 4}s linear infinite`,
            animationDelay: `${Math.random() * 5}s`,
            transform: `scale(${0.5 + Math.random() * 0.8})`
          }}></div>
        ))}

        <Container style={{ position: 'relative', zIndex: 1 }}>
          <Navbar.Brand href="/" style={{ color: 'white', fontWeight: '800', letterSpacing: '1px', textShadow: '0 2px 4px rgba(0,0,0,0.3)' }}>
            Turismo Local CR
          </Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="me-auto">
              {token && userDb?.role === 'ROLE_ADMIN' && <Nav.Link onClick={() => navigate('/admin')} style={{ color: '#00bfa5', fontWeight: '600' }}>Panel Admin</Nav.Link>}
            </Nav>

            {user ? (
              <div className="d-flex align-items-center">
                <img
                  src={user.picture}
                  alt="avatar"
                  width="32"
                  height="32"
                  className="rounded-circle me-2 border border-white"
                  referrerPolicy="no-referrer"
                />
                <span className="text-white me-3" style={{ fontSize: '0.9rem' }}>{user.name}</span>
                <Button variant="outline-light" size="sm" onClick={handleLogout} title="Cerrar Sesión">
                  <LogOut size={18} />
                </Button>
              </div>
            ) : (
              token && <Button variant="outline-light" onClick={handleLogout}>Cerrar Sesión</Button>
            )}
          </Navbar.Collapse>
        </Container>
      </Navbar>
    </>
  );
};

export default NavbarComponent;
