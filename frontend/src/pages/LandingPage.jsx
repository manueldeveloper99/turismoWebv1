import { useState, useEffect } from 'react';
import { Container, Card, Row, Col, ListGroup, Spinner } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import BackgroundCarousel from '../components/BackgroundCarousel';
import api from '../services/api';
import QRPoster from '../components/QRPoster';

const FacebookIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="currentColor"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.469h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.469h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
);
const InstagramIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/></svg>
);
const YoutubeIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="currentColor"><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.5 12 3.5 12 3.5s-7.505 0-9.377.55a3.016 3.016 0 0 0-2.122 2.136C0 8.07 0 12 0 12s0 3.93.501 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.55 9.377.55 9.377.55s7.505 0 9.377-.55a3.016 3.016 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>
);
const TiktokIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="currentColor"><path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93v7.2c0 1.63-.52 3.24-1.49 4.54-1.45 1.95-3.8 3.09-6.21 2.92-2.22-.16-4.28-1.27-5.59-3.04-1.32-1.78-1.77-4.14-1.22-6.27.53-2.09 1.9-3.88 3.79-4.81 1.9-.94 4.15-1.04 6.13-.31v4.25c-1.11-.27-2.31-.1-3.26.47-.94.57-1.55 1.57-1.68 2.65-.12 1.08.28 2.18 1.05 2.94.77.77 1.88 1.12 2.95.95 1.05-.17 1.98-.81 2.5-1.74.52-.92.68-2.01.44-3.04V.02z"/></svg>
);

const LandingPage = () => {
  const [towns, setTowns] = useState([]);
  const [selectedTown, setSelectedTown] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/towns')
      .then(res => {
        setTowns(res.data);
        if (res.data.length > 0) {
          setSelectedTown(res.data[0]);
        }
      })
      .catch(err => console.error("Error cargando pueblos", err))
      .finally(() => setLoading(false));
  }, []);

  const glassStyle = {
    borderRadius: '25px',
    border: '1px solid rgba(255, 255, 255, 0.4)',
    background: 'rgba(255, 255, 255, 0.35)',
    backdropFilter: 'blur(16px)',
    WebkitBackdropFilter: 'blur(16px)',
    boxShadow: '0 8px 32px 0 rgba(0, 0, 0, 0.3)'
  };

  return (
    <div style={{ position: 'relative', flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
      <BackgroundCarousel />

      <Container fluid className="py-5 flex-grow-1 d-flex align-items-center" style={{ position: 'relative', zIndex: 2 }}>
        <Row className="w-100 justify-content-center">
          {/* Sidebar de selección de pueblos */}
          {towns.length > 1 && (
            <Col md={3} className="mb-4">
              <Card style={{ ...glassStyle, maxHeight: '70vh', overflowY: 'auto' }} className="p-3">
                <h5 className="text-center fw-bold mb-3" style={{ color: '#004d40' }}>Seleccionar Pueblo</h5>
                <ListGroup variant="flush" style={{ background: 'transparent' }}>
                  {towns.map(t => (
                    <ListGroup.Item 
                      key={t.id}
                      onClick={() => setSelectedTown(t)}
                      style={{ 
                        cursor: 'pointer',
                        background: selectedTown?.id === t.id ? 'rgba(0, 77, 64, 0.2)' : 'transparent',
                        color: '#004d40',
                        fontWeight: selectedTown?.id === t.id ? 'bold' : 'normal',
                        border: 'none',
                        borderRadius: '10px',
                        marginBottom: '5px'
                      }}
                    >
                      📍 {t.name}
                    </ListGroup.Item>
                  ))}
                </ListGroup>
              </Card>
            </Col>
          )}

          <Col md={towns.length > 1 ? 6 : 5}>
            <Card className="text-center p-4 shadow-lg" style={glassStyle}>
              <Card.Body>
                <div className="mb-4 d-flex justify-content-center gap-4">
                  <a href="#" style={{ color: '#1877F2', background: 'rgba(255,255,255,0.8)', padding: '12px', borderRadius: '50%', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }}><FacebookIcon /></a>
                  <a href="#" style={{ color: '#E4405F', background: 'rgba(255,255,255,0.8)', padding: '12px', borderRadius: '50%', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }}><InstagramIcon /></a>
                  <a href="#" style={{ color: '#000000', background: 'rgba(255,255,255,0.8)', padding: '12px', borderRadius: '50%', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }}><TiktokIcon /></a>
                  <a href="#" style={{ color: '#FF0000', background: 'rgba(255,255,255,0.8)', padding: '12px', borderRadius: '50%', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }}><YoutubeIcon /></a>
                </div>

                <div className="d-flex flex-column align-items-center mb-4">
                  {loading ? (
                    <Spinner animation="border" variant="success" />
                  ) : selectedTown ? (
                    <>
                      <QRPoster 
                        townSlug={selectedTown.slug} 
                        townName={selectedTown.name} 
                        exactUrl={`${window.location.origin}/p/${selectedTown.slug}`} 
                      />
                      <h4 className="mt-3 fw-bold" style={{ color: '#004d40' }}>{selectedTown.name}</h4>
                    </>
                  ) : (
                    <div className="p-5 border border-dashed rounded text-muted">
                      No hay pueblos registrados
                    </div>
                  )}
                </div>
                
                <p className="mb-4" style={{ fontSize: '0.95rem', color: '#212529', fontWeight: '500', textShadow: '0 1px 2px rgba(255,255,255,0.8)' }}>
                  Escanea el código QR físico ubicado en el pueblo para ver sus lugares turísticos.
                </p>

                <div className="mt-4 pt-3 border-top" style={{ borderColor: 'rgba(0,0,0,0.1) !important' }}>
                  <Link to="/login" style={{ fontSize: '0.9rem', color: '#004d40', fontWeight: '600', textDecoration: 'none' }}>
                    ¿Eres Administrador? Ingresa aquí
                  </Link>
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
};
export default LandingPage;
