import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Container, Spinner, Alert, Button } from 'react-bootstrap';
import api from '../services/api';
import QRPoster from '../components/QRPoster';

const QRPage = () => {
  const { slug } = useParams();
  const [town, setTown] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get(`/towns/${slug}`)
      .then(res => {
        setTown(res.data);
      })
      .catch(err => {
        console.error("Error cargando el pueblo", err);
        setTown(null);
      })
      .finally(() => setLoading(false));
  }, [slug]);

  if (loading) return (
    <Container className="d-flex flex-column justify-content-center align-items-center" style={{ minHeight: '100vh' }}>
      <Spinner animation="border" variant="warning" />
      <p className="mt-3 text-muted">Generando código QR...</p>
    </Container>
  );

  if (!town) return (
    <Container className="d-flex justify-content-center align-items-center" style={{ minHeight: '100vh' }}>
      <Alert variant="danger" className="text-center shadow">
        <h4>📍 Pueblo no encontrado</h4>
        <p>El enlace escaneado no parece ser válido o el pueblo ha sido eliminado.</p>
        <Button variant="outline-danger" onClick={() => window.location.href = '/'}>Ir al Inicio</Button>
      </Alert>
    </Container>
  );

  return (
    <Container className="d-flex justify-content-center align-items-center" style={{ minHeight: '100vh', backgroundColor: '#f8f9fa' }}>
      <QRPoster townSlug={town.slug} townName={town.name} />
    </Container>
  );
};

export default QRPage;