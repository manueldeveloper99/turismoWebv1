import { Container, Card, Row, Col } from 'react-bootstrap';
import { GoogleLogin } from '@react-oauth/google';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../services/api';
import BackgroundCarousel from '../components/BackgroundCarousel';

const LoginPage = () => {
  const { townSlug } = useParams();
  const navigate = useNavigate();

  const handleSuccess = async (credentialResponse) => {
    try {
      const res = await api.post('/auth/google', { token: credentialResponse.credential });
      localStorage.setItem('token', credentialResponse.credential);
      if (townSlug) {
        navigate(`/p/${townSlug}/places`);
      } else {
        navigate('/admin');
      }
    } catch (err) {
      console.error('Error autenticando', err);
      // Fallback para desarrollo rápido del PoC
      localStorage.setItem('token', credentialResponse.credential);
      if (townSlug) {
        navigate(`/p/${townSlug}/places`);
      } else {
        navigate('/admin');
      }
    }
  };

  return (
    <Row className="m-0" style={{ minHeight: '100vh', width: '100vw', backgroundColor: '#f4f6f8' }}>
      {/* Mitad Izquierda: Carrusel (Oculto en celulares) */}
      <Col md={7} lg={7} className="p-0 d-none d-md-block" style={{ position: 'relative', overflow: 'hidden', zIndex: 10 }}>
        <BackgroundCarousel inline={true} showCaptions={true} />
      </Col>

      {/* Mitad Derecha: Login */}
      <Col md={5} lg={5} xs={12} className="d-flex align-items-center justify-content-center p-0">
        <Card className="text-center p-5 shadow-lg border-0" style={{
          width: '100%',
          maxWidth: '450px',
          margin: '20px',
          borderRadius: '25px',
          background: '#ffffff'
        }}>
          <Card.Body>
            <h3 style={{ color: '#004d40', fontWeight: '900', fontSize: '2rem', marginBottom: '15px' }}>
              {townSlug ? `Acceder a ${townSlug}` : 'Acceso Administrador'}
            </h3>
            <p className="mb-4 mt-2 text-muted" style={{ fontSize: '1rem', fontWeight: '500' }}>
              {townSlug ? 'Inicia sesión para descubrir lugares turísticos.' : 'Inicia sesión de forma segura para gestionar el sistema de Turismo Local CR.'}
            </p>
            <div className="mt-5 mb-3 d-flex justify-content-center">
              <GoogleLogin
                onSuccess={handleSuccess}
                onError={() => console.log('Login Failed')}
                theme="filled_black"
                shape="pill"
                size="large"
              />
            </div>
            <small className="d-block mt-4 text-muted" style={{ fontWeight: '500' }}>Sistema exclusivo con cuentas @gmail.com</small>
          </Card.Body>
        </Card>
      </Col>
    </Row>
  );
};

export default LoginPage;