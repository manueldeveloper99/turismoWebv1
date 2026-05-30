import { Container, Card } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import BackgroundCarousel from '../components/BackgroundCarousel';

const LandingPage = () => {
  return (
    <div style={{ position: 'relative', flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
      <BackgroundCarousel />


      <Container className="d-flex justify-content-center align-items-center flex-grow-1" style={{ position: 'relative', zIndex: 2, padding: '40px 0' }}>
        <Card className="text-center p-5 shadow-lg" style={{ 
          maxWidth: '500px', 
          borderRadius: '25px', 
          border: '1px solid rgba(255, 255, 255, 0.4)',
          background: 'rgba(255, 255, 255, 0.35)',
          backdropFilter: 'blur(16px)',
          WebkitBackdropFilter: 'blur(16px)',
          boxShadow: '0 8px 32px 0 rgba(0, 0, 0, 0.3)'
        }}>
        <Card.Body>
          <div className="mb-4">
            <h1 style={{ color: '#004d40', fontWeight: '900', textShadow: '0 2px 4px rgba(255,255,255,0.6)' }}>Turismo Local</h1>
            <p style={{ color: '#212529', fontWeight: '500', textShadow: '0 1px 2px rgba(255,255,255,0.8)' }}>Descubre la belleza de nuestros pueblos</p>
          </div>
          
          <div 
            className="d-flex align-items-center justify-content-center mb-4" 
            style={{ 
              width: '200px', 
              height: '200px', 
              margin: '0 auto', 
              background: 'rgba(255, 255, 255, 0.4)', 
              border: '2px dashed rgba(0, 77, 64, 0.6)',
              borderRadius: '16px'
            }}
          >
            <span style={{ color: '#004d40', fontWeight: 'bold' }}>QR aún no disponible</span>
          </div>
          
          <p className="mb-4" style={{ fontSize: '0.95rem', color: '#212529', fontWeight: '500', textShadow: '0 1px 2px rgba(255,255,255,0.8)' }}>
            Escanea el código QR físico ubicado en el pueblo para ver sus lugares turísticos.
          </p>

          <div className="mt-5 pt-3 border-top" style={{ borderColor: 'rgba(0,0,0,0.1) !important' }}>
            <Link to="/login" style={{ fontSize: '0.9rem', color: '#004d40', fontWeight: '600', textDecoration: 'none' }}>
              ¿Eres Administrador? Ingresa aquí
            </Link>
          </div>
        </Card.Body>
      </Card>
      </Container>
    </div>
  );
};

export default LandingPage;
