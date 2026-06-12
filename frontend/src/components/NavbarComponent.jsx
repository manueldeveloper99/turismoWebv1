import { useState, useEffect, useMemo } from 'react'; //Alegr
import { Navbar, Container, Nav, Button, NavDropdown } from 'react-bootstrap';
import { useNavigate, Link } from 'react-router-dom';
import { LogOut, Globe } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../contexts/ThemeContext';
import api from '../services/api';

const NavbarComponent = () => {
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();
  const { t, i18n } = useTranslation();
  const token = localStorage.getItem('token');
  const [userDb, setUserDb] = useState(null);
  const [towns, setTowns] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      if (token) {
        api.get('/users/me')
          .then(res => setUserDb(res.data))
          .catch(e => console.error(e));
      }

      api.get('/towns')
        .then(res => setTowns(res.data))
        .catch(e => console.error(e));
    };

    fetchData();
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
    zIndex: 1000,
    width: '100%'
  };

  // Memorizar estilos de las hojas para evitar parpadeo en re-renders
  const leafStyles = useMemo(() => {
    return Array.from({ length: 8 }).map(() => ({
      left: `${Math.random() * 95}%`,
      duration: `${3 + Math.random() * 4}s`,
      delay: `${Math.random() * 5}s`,
      scale: 0.5 + Math.random() * 0.8
    }));
  }, []);

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
        <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', overflow: 'hidden', pointerEvents: 'none', borderBottomRightRadius: '25px' }}>
          {leafStyles.map((style, i) => (
            <div key={i} className="leaf" style={{
              left: style.left,
              animation: `fallAndSway ${style.duration} linear infinite`,
              animationDelay: style.delay,
              transform: `scale(${style.scale})`
            }}></div>
          ))}
        </div>

        <Container style={{ position: 'relative', zIndex: 1 }}>
          <Navbar.Brand as={Link} to="/" style={{ color: 'white', fontWeight: '800', letterSpacing: '1px', textShadow: '0 2px 4px rgba(0,0,0,0.3)' }}>
            Turismo Local CR
          </Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="me-auto">
              <NavDropdown title={t('nav.select_town')} id="town-dropdown">
                {towns.map(town => (
                  <NavDropdown.Item key={town.id} onClick={() => navigate(`/p/${town.slug}/places`)}>
                    📍 {town.name}
                  </NavDropdown.Item>
                ))}
              </NavDropdown>

              {token && userDb?.role === 'ROLE_ADMIN' && (
                <Nav.Link 
                  onClick={() => navigate('/admin')} 
                  style={{ color: '#00bfa5', fontWeight: '600' }}
                >
                  {t('nav.admin')}
                </Nav.Link>
              )}
            </Nav>

            <div className="d-flex align-items-center me-3">
              <Button 
                variant="link" 
                className="text-white p-0 me-3 text-decoration-none" 
                onClick={toggleTheme}
                title={theme === 'light' ? 'Modo Oscuro' : 'Modo Claro'}
              >
                {theme === 'light' ? (
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-moon"><path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"/></svg>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-sun"><circle cx="12" cy="12" r="4"/><path d="M12 2v2"/><path d="M12 20v2"/><path d="m4.93 4.93 1.41 1.41"/><path d="m17.66 17.66 1.41 1.41"/><path d="M2 12h2"/><path d="M20 12h2"/><path d="m6.34 17.66-1.41 1.41"/><path d="m19.07 4.93-1.41 1.41"/></svg>
                )}
              </Button>
              
              <Button 
                variant="link" 
                className="text-white p-0 me-2 text-decoration-none" 
                onClick={() => { i18n.changeLanguage('es'); localStorage.setItem('i18nextLng', 'es'); }}
              >ES</Button>
              <span className="text-white-50">|</span>
              <Button 
                variant="link" 
                className="text-white p-0 ms-2 text-decoration-none" 
                onClick={() => { i18n.changeLanguage('en'); localStorage.setItem('i18nextLng', 'en'); }}
              >EN</Button>
              <Globe size={18} className="text-white ms-2" />
            </div>

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
                <span className="text-white me-3" style={{ fontSize: '0.9rem' }}>
                  {user.name}
                </span>
                <Button variant="outline-light" size="sm" onClick={handleLogout} title={t('nav.logout')}>
                  <LogOut size={18} />
                </Button>
              </div>
            ) : (
              token && <Button variant="outline-light" onClick={handleLogout}>{t('nav.logout')}</Button>
            )}
          </Navbar.Collapse>
        </Container>
      </Navbar>
    </>
  );
};

export default NavbarComponent;
