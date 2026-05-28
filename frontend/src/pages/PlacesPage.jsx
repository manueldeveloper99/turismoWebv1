import { useEffect, useState } from 'react';
import { Container, Row, Col, Card } from 'react-bootstrap';
import { useParams } from 'react-router-dom';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import api from '../services/api';

const PlacesPage = () => {
  const { townSlug } = useParams();
  const [places, setPlaces] = useState([]);
  const [town, setTown] = useState(null);
  const [selectedPlace, setSelectedPlace] = useState(null);

  useEffect(() => {
    const fetchPlaces = async () => {
      try {
        const res = await api.get(`/towns/${townSlug}/places`);
        setPlaces(res.data);
        const placeWithCoords = res.data.find(p => p.latitude && p.longitude);
        if (placeWithCoords) {
          setSelectedPlace(placeWithCoords);
        }
        
        const townRes = await api.get(`/towns/${townSlug}`);
        setTown(townRes.data);
      } catch (err) {
        console.error('Error fetching places', err);
      }
    };
    fetchPlaces();
  }, [townSlug]);

  return (
    <Container className="mt-4">
      <h2 className="mb-4">Lugares para visitar en {town?.name || townSlug}</h2>
      <Row>
        <Col md={7}>
          <Row>
            {places.map((place) => (
              <Col md={6} key={place.id} className="mb-4">
                <Card 
                  className={`h-100 shadow-sm ${selectedPlace?.id === place.id ? 'border-primary' : ''}`}
                  style={{ cursor: place.latitude ? 'pointer' : 'default', borderWidth: selectedPlace?.id === place.id ? '2px' : '1px' }}
                  onClick={() => place.latitude && setSelectedPlace(place)}
                >
                  {place.imageUrl && <Card.Img variant="top" src={place.imageUrl} style={{ height: '200px', objectFit: 'cover' }} />}
                  <Card.Body>
                    <Card.Title>{place.name}</Card.Title>
                    <span className="badge bg-warning text-dark mb-2">{place.category}</span>
                    <Card.Text>{place.description}</Card.Text>
                    <small className="text-muted">{place.address}</small>
                    {!place.latitude && <small className="d-block text-danger mt-2">Sin coordenadas</small>}
                  </Card.Body>
                </Card>
              </Col>
            ))}
            {places.length === 0 && <p>No hay lugares registrados aún. Accede al panel Admin para agregar.</p>}
          </Row>
        </Col>
        <Col md={5}>
          {selectedPlace ? (
            <div style={{ height: '80vh', width: '100%', borderRadius: '8px', overflow: 'hidden' }}>
              <iframe
                width="100%"
                height="100%"
                frameBorder="0"
                scrolling="no"
                marginHeight="0"
                marginWidth="0"
                src={`https://maps.google.com/maps?q=${selectedPlace.latitude},${selectedPlace.longitude}&hl=es&z=14&output=embed`}
                style={{ border: '1px solid #ccc' }}
              ></iframe>
            </div>
          ) : (
             <div className="bg-light d-flex justify-content-center align-items-center" style={{ height: '80vh', borderRadius: '8px' }}>
                <p className="text-muted">Selecciona un lugar para ver su mapa.</p>
             </div>
          )}
        </Col>
      </Row>
    </Container>
  );
};

export default PlacesPage;
