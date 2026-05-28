import { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Form, Button, Alert, Nav, Table, Modal, Badge, Image } from 'react-bootstrap';
import api from '../services/api';

const AdminPanel = () => {
  const [activeTab, setActiveTab] = useState('lugares');
  const [towns, setTowns] = useState([]);
  const [selectedTown, setSelectedTown] = useState(null);
  const [places, setPlaces] = useState([]);
  
  const [showTownModal, setShowTownModal] = useState(false);
  const [showPlaceModal, setShowPlaceModal] = useState(false);
  
  const [town, setTown] = useState({ slug: '', name: '', description: '', imageUrl: '' });
  const [place, setPlace] = useState({ name: '', description: '', category: '', address: '', imageUrl: '', latitude: '', longitude: '', townId: '' });
  const [msg, setMsg] = useState({ text: '', type: '' });

  useEffect(() => {
    fetchTowns();
  }, []);

  const fetchTowns = () => {
    api.get('/towns').then(res => {
        setTowns(res.data);
        if(res.data.length > 0 && !selectedTown) {
            setSelectedTown(res.data[0]);
        }
    }).catch(err => console.log(err));
  };

  useEffect(() => {
    if (selectedTown) {
      fetchPlaces();
    }
  }, [selectedTown]);

  const fetchPlaces = () => {
    if(selectedTown) {
        api.get(`/towns/${selectedTown.slug}/places`)
         .then(res => setPlaces(res.data))
         .catch(err => console.log(err));
    }
  }

  const showMessage = (text, type = 'success') => {
    setMsg({ text, type });
    setTimeout(() => setMsg({ text: '', type: '' }), 4000);
  };

  const handleTownSubmit = async (e) => {
    e.preventDefault();
    try {
      if (town.id) {
        await api.put(`/admin/towns/${town.id}`, town);
        showMessage('Pueblo actualizado exitosamente');
      } else {
        await api.post('/admin/towns', town);
        showMessage('Pueblo agregado exitosamente');
      }
      setTown({ slug: '', name: '', description: '', imageUrl: '' });
      setShowTownModal(false);
      fetchTowns();
    } catch (err) {
      showMessage('Error al guardar el pueblo (Asegúrate de estar autenticado)', 'danger');
    }
  };

  const handleDeleteTown = async (id) => {
    if(window.confirm('¿Estás seguro de eliminar este pueblo y todos sus lugares?')) {
        try {
            await api.delete(`/admin/towns/${id}`);
            showMessage('Pueblo eliminado');
            fetchTowns();
            if(selectedTown?.id === id) setSelectedTown(null);
        } catch(err) {
            showMessage('Error al eliminar el pueblo', 'danger');
        }
    }
  };

  const handlePlaceSubmit = async (e) => {
    e.preventDefault();
    try {
      const placeData = {
        ...place,
        latitude: parseFloat(place.latitude),
        longitude: parseFloat(place.longitude),
        town: { id: parseInt(place.townId) }
      };
      
      if (place.id) {
        await api.put(`/admin/places/${place.id}`, placeData);
        showMessage('Lugar actualizado exitosamente');
      } else {
        await api.post('/admin/places', placeData);
        showMessage('Lugar agregado exitosamente');
      }
      
      setPlace({ name: '', description: '', category: '', address: '', imageUrl: '', latitude: '', longitude: '', townId: '' });
      setShowPlaceModal(false);
      fetchPlaces();
    } catch (err) {
      showMessage('Error al guardar el lugar (Asegúrate de estar autenticado)', 'danger');
    }
  };

  const handleDeletePlace = async (id) => {
    if(window.confirm('¿Estás seguro de eliminar este lugar?')) {
        try {
            await api.delete(`/admin/places/${id}`);
            showMessage('Lugar eliminado');
            fetchPlaces();
        } catch(err) {
            showMessage('Error al eliminar el lugar', 'danger');
        }
    }
  };

  const sidebarStyle = {
    minHeight: 'calc(100vh - 56px)',
    backgroundColor: '#f8f9fa',
    borderRight: '1px solid #dee2e6'
  };

  const navItemStyle = (tabName) => ({
    cursor: 'pointer',
    borderRadius: '6px',
    marginBottom: '8px',
    backgroundColor: activeTab === tabName ? '#d39e00' : 'transparent',
    color: activeTab === tabName ? 'white' : '#495057',
    fontWeight: activeTab === tabName ? 'bold' : 'normal',
    padding: '10px 15px'
  });

  return (
    <Container fluid className="p-0">
      <Row className="g-0">
        {/* Sidebar */}
        <Col md={2} style={sidebarStyle} className="p-3">
          <Nav className="flex-column mt-3">
            <Nav.Link style={navItemStyle('dashboard')} onClick={() => setActiveTab('dashboard')}>
              ⏱️ Dashboard
            </Nav.Link>
            <Nav.Link style={navItemStyle('pueblos')} onClick={() => setActiveTab('pueblos')}>
              🏛️ Pueblos
            </Nav.Link>
            <Nav.Link style={navItemStyle('lugares')} onClick={() => setActiveTab('lugares')}>
              📍 Lugares
            </Nav.Link>
            <Nav.Link style={navItemStyle('usuarios')} onClick={() => setActiveTab('usuarios')}>
              👥 Usuarios
            </Nav.Link>
            <Nav.Link style={navItemStyle('estadisticas')} onClick={() => setActiveTab('estadisticas')}>
              📊 Estadísticas
            </Nav.Link>
          </Nav>
        </Col>

        {/* Main Content */}
        <Col md={10} className="p-4 bg-white">
          {msg.text && <Alert variant={msg.type}>{msg.text}</Alert>}

          {activeTab === 'pueblos' && (
            <div>
              <div className="d-flex justify-content-between align-items-center mb-4">
                <h3>Gestión de Pueblos</h3>
                <Button variant="primary" onClick={() => setShowTownModal(true)}>
                  + Agregar Nuevo Pueblo
                </Button>
              </div>
              <Table hover responsive className="align-middle">
                <thead className="bg-light">
                  <tr>
                    <th>Imagen</th>
                    <th>Nombre</th>
                    <th>Slug</th>
                    <th>Descripción</th>
                    <th>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {towns.map(t => (
                    <tr key={t.id}>
                      <td>
                        <Image src={t.imageUrl || 'https://via.placeholder.com/50'} rounded width={50} height={50} style={{objectFit: 'cover'}} />
                      </td>
                      <td className="fw-bold">{t.name}</td>
                      <td><Badge bg="secondary">{t.slug}</Badge></td>
                      <td>{t.description.substring(0, 50)}...</td>
                      <td>
                        <Button variant="outline-secondary" size="sm" className="me-2" onClick={() => {
                          setTown(t);
                          setShowTownModal(true);
                        }}>✏️</Button>
                        <Button variant="danger" size="sm" onClick={() => handleDeleteTown(t.id)}>🗑️</Button>
                      </td>
                    </tr>
                  ))}
                  {towns.length === 0 && <tr><td colSpan="5" className="text-center text-muted">No hay pueblos registrados</td></tr>}
                </tbody>
              </Table>
            </div>
          )}

          {activeTab === 'lugares' && (
            <div>
              <div className="d-flex justify-content-between align-items-center mb-4">
                <h3 className="m-0">
                  Gestión de Lugares Turísticos {selectedTown ? `- ${selectedTown.name}` : ''}
                </h3>
                <Button variant="primary" onClick={() => {
                  if(towns.length === 0) return alert('Debes crear un pueblo primero');
                  setPlace({...place, townId: selectedTown?.id || towns[0].id});
                  setShowPlaceModal(true);
                }}>
                  + Agregar Nuevo Lugar
                </Button>
              </div>
              
              <div className="mb-4 w-25">
                <Form.Select 
                  value={selectedTown?.id || ''} 
                  onChange={(e) => {
                    const found = towns.find(t => t.id === parseInt(e.target.value));
                    setSelectedTown(found);
                  }}
                >
                  {towns.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
                </Form.Select>
              </div>

              <Table hover responsive className="align-middle">
                <thead className="bg-light">
                  <tr>
                    <th>Imagen</th>
                    <th>Nombre</th>
                    <th>Categoría</th>
                    <th>Dirección</th>
                    <th>Estado</th>
                    <th>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {places.map(p => (
                    <tr key={p.id}>
                      <td>
                        <Image src={p.imageUrl || 'https://via.placeholder.com/50'} rounded width={50} height={50} style={{objectFit: 'cover'}} />
                      </td>
                      <td className="fw-bold">{p.name}</td>
                      <td><Badge bg="warning" text="dark" className="rounded-pill px-3">{p.category}</Badge></td>
                      <td>{p.address}</td>
                      <td>
                        <Form.Check type="switch" id={`switch-${p.id}`} label="Activo" defaultChecked />
                      </td>
                      <td>
                        <Button variant="secondary" size="sm" className="me-2 text-white border-0" style={{backgroundColor: '#6c757d'}} onClick={() => {
                          setPlace({...p, townId: selectedTown.id});
                          setShowPlaceModal(true);
                        }}>✏️</Button>
                        <Button variant="danger" size="sm" className="border-0" onClick={() => handleDeletePlace(p.id)} style={{backgroundColor: '#dc3545'}}>🗑️</Button>
                      </td>
                    </tr>
                  ))}
                  {places.length === 0 && <tr><td colSpan="6" className="text-center text-muted">No hay lugares en este pueblo</td></tr>}
                </tbody>
              </Table>
            </div>
          )}

          {(activeTab === 'dashboard' || activeTab === 'usuarios' || activeTab === 'estadisticas') && (
            <div className="d-flex justify-content-center align-items-center" style={{height: '60vh'}}>
              <div className="text-center text-muted">
                <h1 style={{fontSize: '4rem'}}>🚧</h1>
                <h4>Módulo en construcción</h4>
                <p>Esta sección estará disponible en la próxima versión.</p>
              </div>
            </div>
          )}
        </Col>
      </Row>

      {/* Modal Pueblo */}
      <Modal show={showTownModal} onHide={() => {
        setShowTownModal(false);
        setTown({ slug: '', name: '', description: '', imageUrl: '' });
      }}>
        <Modal.Header closeButton className="bg-primary text-white">
          <Modal.Title>{town.id ? 'Editar Pueblo' : 'Agregar Nuevo Pueblo'}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleTownSubmit}>
            <Form.Group className="mb-3">
              <Form.Label>Nombre del Pueblo</Form.Label>
              <Form.Control type="text" value={town.name} onChange={e => setTown({...town, name: e.target.value})} required />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Ruta (Slug)</Form.Label>
              <Form.Control type="text" value={town.slug} onChange={e => setTown({...town, slug: e.target.value})} placeholder="ej: santa-maria" required />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Descripción</Form.Label>
              <Form.Control as="textarea" rows={3} value={town.description} onChange={e => setTown({...town, description: e.target.value})} required />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>URL de Imagen</Form.Label>
              <Form.Control type="url" value={town.imageUrl} onChange={e => setTown({...town, imageUrl: e.target.value})} />
            </Form.Group>
            <Button type="submit" variant="primary" className="w-100">Guardar Pueblo</Button>
          </Form>
        </Modal.Body>
      </Modal>

      {/* Modal Lugar */}
      <Modal show={showPlaceModal} onHide={() => {
        setShowPlaceModal(false);
        setPlace({ name: '', description: '', category: '', address: '', imageUrl: '', latitude: '', longitude: '', townId: '' });
      }}>
        <Modal.Header closeButton className="bg-primary text-white">
          <Modal.Title>{place.id ? 'Editar Lugar Turístico' : 'Agregar Nuevo Lugar'}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handlePlaceSubmit}>
            <Form.Group className="mb-3">
              <Form.Label>Pertenece al Pueblo:</Form.Label>
              <Form.Select value={place.townId} onChange={e => setPlace({...place, townId: e.target.value})} required>
                <option value="">Selecciona un pueblo</option>
                {towns.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
              </Form.Select>
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Nombre del Lugar</Form.Label>
              <Form.Control type="text" value={place.name} onChange={e => setPlace({...place, name: e.target.value})} required />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Categoría</Form.Label>
              <Form.Control type="text" value={place.category} onChange={e => setPlace({...place, category: e.target.value})} placeholder="Mirador, Parque, Restaurante..." required />
            </Form.Group>
            <Row>
              <Col>
                <Form.Group className="mb-3">
                  <Form.Label>Latitud</Form.Label>
                  <Form.Control type="number" step="any" value={place.latitude} onChange={e => setPlace({...place, latitude: e.target.value})} placeholder="ej: 9.9281" required />
                </Form.Group>
              </Col>
              <Col>
                <Form.Group className="mb-3">
                  <Form.Label>Longitud</Form.Label>
                  <Form.Control type="number" step="any" value={place.longitude} onChange={e => setPlace({...place, longitude: e.target.value})} placeholder="ej: -84.0907" required />
                </Form.Group>
              </Col>
            </Row>
            <Form.Group className="mb-3">
              <Form.Label>Dirección Física</Form.Label>
              <Form.Control type="text" value={place.address} onChange={e => setPlace({...place, address: e.target.value})} required />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Descripción</Form.Label>
              <Form.Control as="textarea" rows={2} value={place.description} onChange={e => setPlace({...place, description: e.target.value})} required />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>URL de Fotografía</Form.Label>
              <Form.Control type="url" value={place.imageUrl} onChange={e => setPlace({...place, imageUrl: e.target.value})} />
            </Form.Group>
            <Button type="submit" variant="primary" className="w-100">Guardar Lugar Turístico</Button>
          </Form>
        </Modal.Body>
      </Modal>

    </Container>
  );
};

export default AdminPanel;
