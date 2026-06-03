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

const MapPinIcon = ({ size = 16, className, style }) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    width={size} 
    height={size} 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2.5" 
    strokeLinecap="round" 
    strokeLinejoin="round" 
    className={className}
    style={style}
  >
    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
    <circle cx="12" cy="10" r="3"></circle>
  </svg>
);

const BirdSilhouette = ({ size = 40, className }) => (
  <div className={`bird ${className}`}>
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      width={size} 
      height={size} 
      viewBox="0 0 100 100" 
    >
      <path 
        fill="#004d40" 
        d="M10,60 C25,20 40,40 50,55 C60,40 75,20 90,60 C75,40 60,50 50,65 C40,50 25,40 10,60 Z" 
      />
    </svg>
  </div>
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
    background: '#ffffff',
    boxShadow: '0 10px 30px rgba(0, 0, 0, 0.08)',
    border: 'none'
  };

  return (
    <Row className="m-0" style={{ height: '100vh', width: '100vw', overflow: 'hidden' }}>
      {/* Mitad Izquierda: Carrusel (Oculto en celulares) */}
      <Col md={7} lg={7} className="p-0 d-none d-md-block" style={{ height: '100vh', position: 'relative', overflow: 'hidden', borderTopRightRadius: '40px', borderBottomRightRadius: '40px', boxShadow: '5px 0 30px rgba(0,0,0,0.15)', zIndex: 10 }}>
        <BackgroundCarousel inline={true} showCaptions={true} />
      </Col>

      {/* Mitad Derecha: Contenido QR con Scroll */}
      <Col md={5} lg={5} xs={12} className="p-0" style={{ backgroundColor: '#f4f6f8', height: '100vh', overflowY: 'auto', overflowX: 'hidden', position: 'relative' }}>
        
        {/* Animaciones de Fauna Tica */}
        <style>{`
          @keyframes flySlowly {
            0% { transform: translate(-100px, 150px) scale(0.5); opacity: 0; }
            10% { transform: translate(-20px, 140px) scale(0.57); opacity: 0.15; }
            90% { transform: translate(620px, -165px) scale(1.13); opacity: 0.15; }
            100% { transform: translate(700px, -200px) scale(1.2); opacity: 0; }
          }
          @keyframes flyReverse {
            0% { transform: translate(700px, 50px) scale(-0.6, 0.6); opacity: 0; }
            10% { transform: translate(615px, 30px) scale(-0.65, 0.65); opacity: 0.12; }
            90% { transform: translate(-65px, -130px) scale(-1.05, 1.05); opacity: 0.12; }
            100% { transform: translate(-150px, -150px) scale(-1.1, 1.1); opacity: 0; }
          }
          @keyframes flyFast {
            0% { transform: translate(-100px, 200px) scale(0.3); opacity: 0; }
            10% { transform: translate(-20px, 190px) scale(0.35); opacity: 0.1; }
            90% { transform: translate(620px, -20px) scale(0.75); opacity: 0.1; }
            100% { transform: translate(700px, -50px) scale(0.8); opacity: 0; }
          }
          @keyframes flyReverseFast {
            0% { transform: translate(700px, 150px) scale(-0.4, 0.4); opacity: 0; }
            10% { transform: translate(615px, 130px) scale(-0.45, 0.45); opacity: 0.1; }
            90% { transform: translate(-65px, -30px) scale(-0.85, 0.85); opacity: 0.1; }
            100% { transform: translate(-150px, -50px) scale(-0.9, 0.9); opacity: 0; }
          }
          .bird {
            position: absolute;
            pointer-events: none;
            z-index: 0;
            opacity: 0; /* Invisible before animation starts */
          }
          .bird-1 { animation: flySlowly 18s linear infinite forwards; top: 15%; left: 0; }
          .bird-2 { animation: flySlowly 22s linear infinite forwards 5s; top: 45%; left: 0; }
          .bird-3 { animation: flyReverse 20s linear infinite forwards 2s; top: 25%; right: 0; }
          .bird-4 { animation: flyReverse 25s linear infinite forwards 8s; top: 65%; right: 0; }
          .bird-5 { animation: flyFast 12s linear infinite forwards 1s; top: 8%; left: 0; }
          .bird-6 { animation: flyFast 15s linear infinite forwards 6s; top: 55%; left: 0; }
          .bird-7 { animation: flyReverseFast 10s linear infinite forwards 3s; top: 18%; right: 0; }
          .bird-8 { animation: flyReverseFast 14s linear infinite forwards 9s; top: 80%; right: 0; }
          .bird-9 { animation: flySlowly 24s linear infinite forwards 12s; top: 35%; left: 0; }
          .bird-10 { animation: flyReverse 28s linear infinite forwards 15s; top: 50%; right: 0; }
          .bird-11 { animation: flySlowly 16s linear infinite forwards 4s; top: 5%; left: 0; }
          .bird-12 { animation: flyReverseFast 12s linear infinite forwards 6s; top: 40%; right: 0; }
          .bird-13 { animation: flyFast 14s linear infinite forwards 14s; top: 75%; left: 0; }
          .bird-14 { animation: flyReverse 18s linear infinite forwards 11s; top: 85%; right: 0; }
          .bird-15 { animation: flySlowly 26s linear infinite forwards 9s; top: 60%; left: 0; }
        `}</style>
        
        <BirdSilhouette className="bird-1" size={80} />
        <BirdSilhouette className="bird-2" size={50} />
        <BirdSilhouette className="bird-3" size={110} />
        <BirdSilhouette className="bird-4" size={65} />
        <BirdSilhouette className="bird-5" size={35} />
        <BirdSilhouette className="bird-6" size={45} />
        <BirdSilhouette className="bird-7" size={40} />
        <BirdSilhouette className="bird-8" size={30} />
        <BirdSilhouette className="bird-9" size={90} />
        <BirdSilhouette className="bird-10" size={75} />
        <BirdSilhouette className="bird-11" size={55} />
        <BirdSilhouette className="bird-12" size={45} />
        <BirdSilhouette className="bird-13" size={60} />
        <BirdSilhouette className="bird-14" size={85} />
        <BirdSilhouette className="bird-15" size={40} />

        <div className="d-flex flex-column align-items-center" style={{ minHeight: '100%', padding: '40px 20px', position: 'relative', zIndex: 1 }}>
          <div style={{ flexGrow: 1 }}></div>
          <div style={{ width: '100%', maxWidth: '500px', flexShrink: 0 }}>
          
          {/* Selección de pueblos (estilo píldoras) */}
          {towns.length > 1 && (
            <Card className="mb-4 shadow-sm" style={{ borderRadius: '20px', border: 'none' }}>
              <Card.Body className="p-3">
                <h6 className="fw-bold mb-3 text-center" style={{ color: '#004d40' }}>Selecciona un Pueblo:</h6>
                <div className="d-flex flex-wrap justify-content-center gap-2">
                  {towns.map(t => (
                    <button
                      key={t.id}
                      onClick={() => setSelectedTown(t)}
                      className="btn btn-sm"
                      style={{
                        backgroundColor: selectedTown?.id === t.id ? '#00bfa5' : '#e9ecef',
                        color: selectedTown?.id === t.id ? 'white' : '#495057',
                        borderRadius: '20px',
                        fontWeight: '600',
                        padding: '6px 15px',
                        border: 'none',
                        transition: 'all 0.2s',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px'
                      }}
                    >
                      <MapPinIcon size={14} /> {t.name}
                    </button>
                  ))}
                </div>
              </Card.Body>
            </Card>
          )}

          {/* Tarjeta principal del QR */}
          <Card className="text-center p-4 shadow-lg" style={glassStyle}>
            <Card.Body>
              {/* Redes sociales */}
              <div className="mb-4 d-flex justify-content-center gap-4">
                <a href="#" style={{ color: '#1877F2', background: '#f4f6f8', padding: '12px', borderRadius: '50%', transition: 'transform 0.2s' }}><FacebookIcon /></a>
                <a href="#" style={{ color: '#E4405F', background: '#f4f6f8', padding: '12px', borderRadius: '50%', transition: 'transform 0.2s' }}><InstagramIcon /></a>
                <a href="#" style={{ color: '#000000', background: '#f4f6f8', padding: '12px', borderRadius: '50%', transition: 'transform 0.2s' }}><TiktokIcon /></a>
                <a href="#" style={{ color: '#FF0000', background: '#f4f6f8', padding: '12px', borderRadius: '50%', transition: 'transform 0.2s' }}><YoutubeIcon /></a>
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
              
              <p className="mb-4 text-muted" style={{ fontSize: '0.95rem', fontWeight: '500' }}>
                Escanea el código QR físico ubicado en el pueblo para ver sus lugares turísticos.
              </p>

              <style>{`.admin-lock:hover { color: #00bfa5 !important; }`}</style>
              <div className="mt-3 text-end">
                <Link to="/login" style={{ color: '#dee2e6' }} title="Acceso Administrativo">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="admin-lock" style={{ transition: 'color 0.2s' }}>
                    <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                    <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
                  </svg>
                </Link>
              </div>
            </Card.Body>
          </Card>
          </div>
          <div style={{ flexGrow: 1 }}></div>
        </div>
      </Col>
    </Row>
  );
};
export default LandingPage;
