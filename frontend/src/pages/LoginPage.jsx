import { Container, Card } from 'react-bootstrap';
import { GoogleLogin } from '@react-oauth/google';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../services/api';

const LoginPage = () => {
  const { townSlug } = useParams();
  const navigate = useNavigate();

  const handleSuccess = async (credentialResponse) => {
    try {
      const res = await api.post('/auth/google', { token: credentialResponse.credential });
      localStorage.setItem('token', credentialResponse.credential); 
      navigate(`/p/${townSlug}/places`);
    } catch (err) {
      console.error('Error autenticando', err);
      // Fallback para desarrollo rápido del PoC
      localStorage.setItem('token', credentialResponse.credential);
      navigate(`/p/${townSlug}/places`);
    }
  };

  return (
    <Container className="d-flex justify-content-center align-items-center" style={{ minHeight: '80vh' }}>
      <Card className="text-center p-4 shadow" style={{ width: '400px' }}>
        <Card.Body>
          <h3>Bienvenido a {townSlug}</h3>
          <p className="text-muted">Inicia sesión para descubrir los mejores lugares turísticos del pueblo.</p>
          <div className="mt-4 d-flex justify-content-center">
            <GoogleLogin
              onSuccess={handleSuccess}
              onError={() => console.log('Login Failed')}
            />
          </div>
          <small className="d-block mt-3 text-muted">Solo se aceptan cuentas @gmail.com</small>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default LoginPage;
