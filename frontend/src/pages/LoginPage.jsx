import { Container, Card } from 'react-bootstrap';
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
    <div style={{ position: 'relative', flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
      <BackgroundCarousel />
      
      <Container className="d-flex justify-content-center align-items-center flex-grow-1" style={{ position: 'relative', zIndex: 2, padding: '40px 0' }}>
        <Card className="text-center p-5 shadow-lg" style={{ 
          width: '450px', 
          maxWidth: '90%',
          borderRadius: '25px', 
          border: '1px solid rgba(255, 255, 255, 0.4)',
          background: 'rgba(255, 255, 255, 0.35)',
          backdropFilter: 'blur(16px)',
          WebkitBackdropFilter: 'blur(16px)',
          boxShadow: '0 8px 32px 0 rgba(0, 0, 0, 0.3)'
        }}>
        <Card.Body>
          <h3 style={{ color: '#004d40', fontWeight: '900', textShadow: '0 2px 4px rgba(255,255,255,0.6)' }}>
            {townSlug ? `Bienvenido a ${townSlug}` : 'Acceso de Administrador'}
          </h3>
          <p className="mb-4 mt-3" style={{ fontSize: '1.05rem', color: '#212529', fontWeight: '500', textShadow: '0 1px 2px rgba(255,255,255,0.8)' }}>
            {townSlug ? 'Inicia sesión para descubrir los mejores lugares turísticos del pueblo.' : 'Inicia sesión para gestionar el sistema.'}
          </p>
          <div className="mt-4 d-flex justify-content-center">
            <GoogleLogin
              onSuccess={handleSuccess}
              onError={() => console.log('Login Failed')}
            />
          </div>
          <small className="d-block mt-4" style={{ color: '#212529', fontWeight: '600', textShadow: '0 1px 2px rgba(255,255,255,0.8)' }}>Solo se aceptan cuentas @gmail.com</small>
        </Card.Body>
      </Card>
      </Container>
    </div>
  );
};

export default LoginPage;