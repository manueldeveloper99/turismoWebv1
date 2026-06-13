import { useEffect, useState, useRef, useCallback, useMemo } from 'react'; 
import { Container, Row, Col, Card, Badge, Button, Pagination } from 'react-bootstrap';
import { useParams } from 'react-router-dom';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import api from '../services/api';
import { useTranslation } from 'react-i18next';//Alegr
import { MapPin, Target, MessageSquare } from 'lucide-react';
import { DiscussionEmbed } from 'disqus-react';

// Definición del icono para la ubicación del usuario
const userIcon = L.icon({
  iconUrl: 'https://cdn-icons-png.flaticon.com/512/235/235861.png',
  iconSize: [32, 32],
  iconAnchor: [16, 32],
});

// Ayuda a que se actualice la vista del mapa al cambiar el lugar seleccionado
function ChangeView({ center, zoom }) {
  const map = useMap();
  useEffect(() => {
    if (center) {
      map.setView(center, zoom);
    }
  }, [center, zoom, map]);
  return null;
}

// Definido fuera para evitar que el marcador se reinicie al cambiar el estado de la página
const MarkerWithPopup = ({ place, index, isSelected, onSelect, getCategoryColor, createCustomIcon }) => {
  const markerRef = useRef(null);
  
  useEffect(() => {
    if (isSelected && markerRef.current) {
      markerRef.current.openPopup();
    }
  }, [isSelected]);

  return (
    <Marker 
      ref={markerRef}
      position={[place.latitude, place.longitude]}
      icon={createCustomIcon(getCategoryColor(place.category), index + 1)}
      eventHandlers={{ click: () => onSelect(place) }}
    >
      <Popup className="custom-popup" autoPan={false}>
        <div style={{ width: '200px' }}>
          <img src={place.imageUrl || 'https://via.placeholder.com/200'} alt={place.name} style={{ width: '100%', height: '100px', objectFit: 'cover', borderRadius: '8px 8px 0 0', marginBottom: '8px' }} />
          <h6 className="fw-bold mb-1 text-truncate">{index + 1}. {place.name}</h6>
          <span className="badge rounded-pill mb-2" style={{backgroundColor: getCategoryColor(place.category), color: '#fff'}}>{place.category}</span>
          <p style={{ fontSize: '0.8rem', margin: 0 }} className="text-truncate">{place.description}</p>
        </div>
      </Popup>
    </Marker>
  );
};


// Componente para el Botón GPS
const LocationButton = ({ onLocationFound }) => {
  const map = useMap();

  useEffect(() => {
    const onLocationFoundHandler = (e) => {
      map.flyTo(e.latlng, 16);
      if (onLocationFound) onLocationFound(e.latlng);
    };

    map.on("locationfound", onLocationFoundHandler);
    return () => map.off("locationfound", onLocationFoundHandler);
  }, [map, onLocationFound]);

  const handleLocation = () => {
    map.locate({ enableHighAccuracy: true, setView: false });
  };
  return (
    <div className="leaflet-top leaflet-right" style={{ marginTop: '10px', marginRight: '10px' }}>
      <div className="leaflet-control leaflet-bar">
        <button 
          onClick={handleLocation}
          style={{ backgroundColor: 'white', width: '34px', height: '34px', border: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}
          title="Mi Ubicación"
        >
          <Target size={20} color="#0d6efd" />
        </button>
      </div>
    </div>
  );
};

const PlacesPage = () => {
  const { townSlug } = useParams();
  const { t, i18n } = useTranslation();
  const [places, setPlaces] = useState([]);
  const [searchPlace, setSearchPlace] = useState('');
  const [town, setTown] = useState(null);
  const [selectedPlace, setSelectedPlace] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState('Todas');
  const [viewMode, setViewMode] = useState('mapa'); // 'lista', 'mapa'
  const [userLocation, setUserLocation] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const mapRef = useRef(null);

  // Funciones de ayuda memoizadas para evitar errores de renderizado
  const getCategoryColor = useCallback((category) => {
    if(!category) return '#6c757d';
    const cat = category.toLowerCase();
    if (cat.includes('mirador')) return '#cca300';
    if (cat.includes('cultural') || cat.includes('histórico') || cat.includes('museo')) return '#77dd77';
    if (cat.includes('gastronomía') || cat.includes('restaurante')) return '#ffb347';
    if (cat.includes('parque')) return '#0d6efd';
    return '#6c757d';
  }, []);

  const createCustomIcon = useCallback((color, number) => {
    return L.divIcon({
      className: 'custom-leaflet-icon',
      html: `<div style="background-color: ${color}; width: 30px; height: 30px; border-radius: 50% 50% 50% 0; transform: rotate(-45deg); display: flex; align-items: center; justify-content: center; border: 2px solid white; box-shadow: 0 2px 5px rgba(0,0,0,0.3);">
               <span style="transform: rotate(45deg); color: white; font-weight: bold; font-size: 14px;">${number}</span>
             </div>`,
      iconSize: [30, 30],
      iconAnchor: [15, 30],
      popupAnchor: [0, -35]
    });
  }, []);

  // Escuchar recomendaciones del Chatbot IA
  useEffect(() => {
    const onFocusPlace = (e) => {
      const place = e.detail;
      if (place && place.latitude) {
        setSelectedPlace(place);
        setViewMode('mapa'); // Cambiar a vista mapa para ver la recomendación
      }
    };
    window.addEventListener('focusPlace', onFocusPlace);
    return () => window.removeEventListener('focusPlace', onFocusPlace);
  }, []);

  const uniqueCategories = useMemo(() => {
    const cats = new Set(places.map(p => p.category).filter(Boolean));
    return ['Todas', ...Array.from(cats)];
  }, [places]);

  const filteredPlaces = useMemo(() => {
    return places.filter(place => {
      const matchesSearch = place.name.toLowerCase().includes(searchPlace.toLowerCase()) || 
                            (place.description && place.description.toLowerCase().includes(searchPlace.toLowerCase()));
      const matchesCategory = selectedCategory === 'Todas' || place.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [places, searchPlace, selectedCategory]);

  useEffect(() => {
    if (selectedPlace && !filteredPlaces.find(p => p.id === selectedPlace.id)) {
      setSelectedPlace(null);
    }
  }, [filteredPlaces, selectedPlace]);

  useEffect(() => {
    setCurrentPage(1);
  }, [townSlug]);

  useEffect(() => {
    const fetchPlaces = async () => {
      try {
        const res = await api.get(`/towns/${townSlug}/places`, {
          params: { page: currentPage - 1, size: 20, onlyActive: true }
        });
        
        const data = res.data.content || res.data || [];
        const total = res.data.totalPages || 1;

        setPlaces(data);
        setTotalPages(total);

        if (data.length > 0) {
          const placeWithCoords = data.find(p => p.latitude && p.longitude);
          if (placeWithCoords) setSelectedPlace(placeWithCoords);
        }
        
        const townRes = await api.get(`/towns/${townSlug}`);
        setTown(townRes.data);
      } catch (err) {
        console.error('Error fetching places', err);
      }
    };
    fetchPlaces();
  }, [townSlug, currentPage]);

  const centerCoords = useMemo(() => {
    if (selectedPlace?.latitude && selectedPlace?.longitude) {
      return [selectedPlace.latitude, selectedPlace.longitude];
    }
    const firstWithCoords = places.find(p => p.latitude && p.longitude);
    return firstWithCoords ? [firstWithCoords.latitude, firstWithCoords.longitude] : [10, -84];
  }, [selectedPlace, places]);

  return (
    <div style={{ position: 'relative', minHeight: '100vh', overflow: 'hidden' }}>
      {/* Abstract Background Blobs */}
      <div style={{
        position: 'absolute',
        top: '-10%',
        left: '-10%',
        width: '50vw',
        height: '50vw',
        minWidth: '300px',
        minHeight: '300px',
        background: 'linear-gradient(135deg, rgba(0, 191, 165, 0.35) 0%, rgba(0, 150, 136, 0.15) 100%)',
        borderRadius: '50%',
        filter: 'blur(120px)',
        zIndex: 0,
        pointerEvents: 'none'
      }} />
      <div style={{
        position: 'absolute',
        bottom: '-10%',
        right: '-10%',
        width: '60vw',
        height: '60vw',
        minWidth: '400px',
        minHeight: '400px',
        background: 'linear-gradient(135deg, rgba(0, 188, 212, 0.25) 0%, rgba(0, 77, 64, 0.15) 100%)',
        borderRadius: '50%',
        filter: 'blur(150px)',
        zIndex: 0,
        pointerEvents: 'none'
      }} />

      <Container className="pt-4 pb-5" style={{ position: 'relative', zIndex: 1 }}>
        <div className="d-flex justify-content-between align-items-center mb-3">
        <h2 className="m-0 fw-bold">{t('places.title')} - {town?.name || townSlug}</h2>
        <Button 
          variant="outline-dark" 
          className="rounded-pill d-md-none" 
          onClick={() => setViewMode(viewMode === 'lista' ? 'mapa' : 'lista')}
        >
          {viewMode === 'lista' ? t('places.map_view') : t('places.list_view')}
        </Button>
        <div className="d-none d-md-flex bg-body rounded-pill p-1 shadow-sm border">
           <Button 
             variant={viewMode === 'lista' ? 'primary' : 'transparent'} 
             className={`rounded-pill px-3 fw-bold ${viewMode !== 'lista' ? 'text-body' : 'text-white'}`} 
             style={{border: 'none'}}
             onClick={() => setViewMode('lista')}
           >
             {t('places.list_view')}
           </Button>
           <Button 
             variant={viewMode === 'mapa' ? 'primary' : 'transparent'} 
             className={`rounded-pill px-3 fw-bold ${viewMode !== 'mapa' ? 'text-body' : 'text-white'}`}
             style={{border: 'none'}}
             onClick={() => setViewMode('mapa')}
           >
             {t('places.map_view')}
           </Button>
        </div>
      </div>

      {/* Search and Filters */}
      <Row className="mb-4">
        <Col md={6} lg={4} className="mb-3 mb-md-0">
          <div className="position-relative">
            <input 
              type="text" 
              className="form-control rounded-pill pe-5 translucent-card" 
              placeholder={t('places.search_placeholder', 'Buscar lugar...')} 
              value={searchPlace}
              onChange={(e) => setSearchPlace(e.target.value)}
              style={{ border: '1px solid var(--bs-border-color)' }}
            />
            <span className="position-absolute top-50 end-0 translate-middle-y me-3 text-muted">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
            </span>
          </div>
        </Col>
        <Col md={6} lg={8}>
          <div className="d-flex gap-2 overflow-auto custom-scrollbar pb-2" style={{ whiteSpace: 'nowrap' }}>
            {uniqueCategories.map(cat => (
              <Button 
                key={cat}
                variant={selectedCategory === cat ? 'primary' : 'outline-secondary'}
                className={`rounded-pill px-3 py-1 ${selectedCategory === cat ? 'shadow-sm' : 'translucent-card'}`}
                onClick={() => setSelectedCategory(cat)}
              >
                {cat}
              </Button>
            ))}
          </div>
        </Col>
      </Row>

      <Row>
        {/* Left Column: List */}
        <Col md={viewMode === 'lista' ? 12 : 4} className={`mb-4 custom-scrollbar ${viewMode === 'mapa' ? 'd-none d-md-block' : ''}`} style={{ maxHeight: '75vh', overflowY: 'auto', paddingRight: '15px', overflowX: 'hidden' }}>
          <Row>
          {filteredPlaces.map((place, index) => (
            <Col md={viewMode === 'lista' ? 6 : 12} lg={viewMode === 'lista' ? 4 : 12} key={place.id}>
            <Card 
              key={place.id} 
              className="mb-3 shadow-sm border-0 translucent-card" 
              style={{ 
                cursor: place.latitude ? 'pointer' : 'default', 
                borderRadius: '12px',
                boxShadow: selectedPlace?.id === place.id ? '0 0 0 2px #0d6efd' : '0 .125rem .25rem rgba(0,0,0,.075)'
              }}
              onClick={() => place.latitude && setSelectedPlace(place)}
            >
              <Row className="g-0 h-100">
                  <Col xs={4}>
                    <Card.Img 
                      src={place.imageUrl || 'https://via.placeholder.com/150'} 
                      style={{ height: '100%', minHeight: '120px', width: '100%', objectFit: 'cover', borderTopLeftRadius: '12px', borderBottomLeftRadius: '12px' }} 
                    />
                  </Col>
                  <Col xs={8}>
                    <Card.Body className="p-3 d-flex flex-column justify-content-center h-100">
                    <h6 className="fw-bold mb-1 text-truncate">{index + 1}. {place.name}</h6>
                    <div>
                      <span className="badge rounded-pill px-2 py-1" style={{backgroundColor: getCategoryColor(place.category), color: '#fff', fontWeight: 'normal'}}>
                        {place.category}
                      </span>
                    </div>
                    {!place.latitude && <small className="text-danger mt-1" style={{fontSize: '0.7rem'}}>{t('places.no_map')}</small>}
                  </Card.Body>
                </Col>
              </Row>
            </Card>
            </Col>
          ))}
          </Row>
          {totalPages > 1 && (
            <Pagination className="justify-content-center mt-3">
              <Pagination.Prev disabled={currentPage === 1} onClick={() => setCurrentPage(p => p - 1)} />
              {[...Array(totalPages).keys()].map(n => (
                <Pagination.Item key={n + 1} active={n + 1 === currentPage} onClick={() => setCurrentPage(n + 1)}>
                  {n + 1}
                </Pagination.Item>
              ))}
              <Pagination.Next disabled={currentPage === totalPages} onClick={() => setCurrentPage(p => p + 1)} />
            </Pagination>
          )}
          {filteredPlaces.length === 0 && <p className="text-muted">{t('places.no_places')}</p>}
        </Col>

        {/* Right Column: Map */}
        <Col md={8} className={`${viewMode === 'lista' ? 'd-none' : ''}`}>
          <div style={{ height: '75vh', width: '100%', borderRadius: '15px', overflow: 'hidden', boxShadow: '0 .5rem 1rem rgba(0,0,0,.15)' }}>
            <MapContainer 
              center={centerCoords} 
              zoom={14} 
              style={{ height: '100%', width: '100%' }}
              ref={mapRef}
            >
              <ChangeView center={centerCoords} zoom={14} />
              <LocationButton onLocationFound={setUserLocation} />
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
              {filteredPlaces.filter(p => p.latitude && p.longitude).map((place, index) => (
                <MarkerWithPopup 
                  key={place.id} 
                  place={place} 
                  index={index} 
                  isSelected={selectedPlace?.id === place.id}
                  onSelect={setSelectedPlace}
                  getCategoryColor={getCategoryColor}
                  createCustomIcon={createCustomIcon}
                />
              ))}
              {userLocation && (
                <Marker position={userLocation} icon={userIcon}>
                  <Popup>Estás aquí</Popup>
                </Marker>
              )}
            </MapContainer>
          </div>
        </Col>
      </Row>

      {/* Disqus Comments Section */}
{selectedPlace && (
  <Row className="mt-5">
    <Col md={12}>
      <Card className="shadow-sm border-0" style={{ borderRadius: '15px' }}>
        <Card.Body className="p-4">
          <h4 className="fw-bold mb-4 d-flex align-items-center">
            <MessageSquare className="me-2 text-primary" />
            {t('places.reviews', 'Reseñas y Comentarios')} - {selectedPlace.name}
          </h4>
          <DiscussionEmbed
            shortname="turismo-local-cr"
            config={{
              url: `${window.location.origin}/p/${townSlug}/places?destino=${selectedPlace.id}`,
              identifier: `place-${selectedPlace.id}`,
              title: selectedPlace.name,
              language: i18n.language === 'en' ? 'en_US' : 'es_ES'
            }}
          />
        </Card.Body>
      </Card>
    </Col>
  </Row>
)}
</Container>
</div>
  );
};

export default PlacesPage;