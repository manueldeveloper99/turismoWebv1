import { useState, useEffect } from 'react';
import { Container, Card, Row, Col, ListGroup, Spinner } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import BackgroundCarousel from '../components/BackgroundCarousel';
import api from '../services/api';
import QRPoster from '../components/QRPoster';
import { Facebook, Instagram, Youtube, Music } from 'lucide-react';

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
                  <a href="#" style={{ color: '#1877F2', background: 'rgba(255,255,255,0.8)', padding: '12px', borderRadius: '50%', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }}><Facebook size={28} /></a>
                  <a href="#" style={{ color: '#E4405F', background: 'rgba(255,255,255,0.8)', padding: '12px', borderRadius: '50%', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }}><Instagram size={28} /></a>
                  <a href="#" style={{ color: '#000000', background: 'rgba(255,255,255,0.8)', padding: '12px', borderRadius: '50%', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }}><Music size={28} /></a>
                  <a href="#" style={{ color: '#FF0000', background: 'rgba(255,255,255,0.8)', padding: '12px', borderRadius: '50%', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }}><Youtube size={28} /></a>
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
