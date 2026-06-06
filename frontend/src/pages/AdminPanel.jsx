import { useState, useEffect, useRef } from 'react';
import { Container, Row, Col, Card, Form, Button, Alert, Nav, Table, Modal, Badge, Image, Toast, ToastContainer } from 'react-bootstrap';
import api from '../services/api';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import QRPoster from '../components/QRPoster';
import {
  LayoutDashboard,
  Landmark,
  MapPin,
  Users,
  BarChart3,
  Pencil,
  Trash2,
  QrCode,
  Plus,
  ShieldAlert,
} from 'lucide-react';

const AdminPanel = () => {
  const [activeTab, setActiveTab] = useState('lugares');
  const [towns, setTowns] = useState([]);
  const [selectedTown, setSelectedTown] = useState(null);
  const [places, setPlaces] = useState([]);

  const [showTownModal, setShowTownModal] = useState(false);
  const [showPlaceModal, setShowPlaceModal] = useState(false);
  const [showQRModal, setShowQRModal] = useState(false);
  const [qrTown, setQrTown] = useState(null);

  const [town, setTown] = useState({ slug: '', name: '', description: '', imageUrl: '' });
  const [place, setPlace] = useState({ name: '', description: '', category: '', address: '', imageUrl: '', latitude: '', longitude: '', townId: '', active: true });
  const [msg, setMsg] = useState({ text: '', type: '' });
  const [users, setUsers] = useState([]);
  const [stats, setStats] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);
  const [accessDenied, setAccessDenied] = useState(false);
  const [loading, setLoading] = useState(true);
  const messageTimerRef = useRef(null);

  useEffect(() => {
    // Validar acceso
    api.get('/users/me').then(res => {
      if (res.data.role !== 'ROLE_ADMIN' || !res.data.active) {
        setAccessDenied(true);
      } else {
        setCurrentUser(res.data);
        fetchTowns();
      }
    }).catch(err => {
      setAccessDenied(true);
    }).finally(() => {
      setLoading(false);
    });
  }, []);

  const fetchUsers = () => {
    api.get('/admin/users').then(res => setUsers(res.data)).catch(console.error);
  };

  const fetchStats = () => {
    return api.get('/admin/stats').then(res => { setStats(res.data); return res.data; }).catch(err => { console.error(err); return null; });
  };

  useEffect(() => {
    if (!accessDenied && activeTab === 'usuarios') fetchUsers();
    if (!accessDenied && (activeTab === 'dashboard' || activeTab === 'estadisticas' || activeTab === 'pueblos')) fetchStats();
  }, [activeTab, accessDenied]);

  const fetchTowns = () => {
    return api.get('/towns').then(res => {
      const data = res.data || [];
      setTowns(data);
      if (data.length > 0 && !selectedTown) {
        setSelectedTown(data[0]);
      }
      return data;
    }).catch(err => {
      console.error("Error fetching towns", err);
      return [];
    });
  };

  useEffect(() => {
    if (selectedTown) {
      fetchPlaces();
    }
  }, [selectedTown]);

  const fetchPlaces = (slug) => {
    const targetSlug = slug || selectedTown?.slug;
    if (targetSlug) {
      return api.get(`/towns/${targetSlug}/places`)
        .then(res => {
          const data = res.data || [];
          setPlaces(data);
          return data;
        })
        .catch(err => {
          console.error("Error fetching places", err);
          return [];
        });
    }
    return Promise.resolve([]);
  }

  const showMessage = (text, type = 'success') => {
    // Limpiar temporizador anterior si existe para evitar conflictos
    if (messageTimerRef.current) {
      clearTimeout(messageTimerRef.current);
    }

    setMsg({ text, type });
    messageTimerRef.current = setTimeout(() => setMsg({ text: '', type: '' }), 3000);
  };

  const handleTownSubmit = async (e) => {
    e.preventDefault();
    try {
      if (town.id) {
        await api.put(`/admin/towns/${town.id}`, town);
        showMessage('Pueblo actualizado exitosamente');
      } else {
        const res = await api.post('/admin/towns', town);
        const newTown = res.data;
        showMessage('Pueblo agregado exitosamente');
        // Preparamos y mostramos el QR inmediatamente con los datos de la respuesta
        setQrTown({
          ...newTown,
          exactUrl: `${window.location.origin}/p/${newTown.slug}`
        });
        setShowQRModal(true);
      }

      // Refrescar datos y asegurar sincronización antes de cerrar el modal de edición
      await fetchTowns();
      await fetchStats();

      setTown({ slug: '', name: '', description: '', imageUrl: '' });
      setShowTownModal(false);
    } catch (err) {
      showMessage('Error al guardar el pueblo (Asegúrate de estar autenticado)', 'danger');
    }
  };

  const handleDeleteTown = async (id) => {
    if (window.confirm('¿Estás seguro de eliminar este pueblo y todos sus lugares?')) {
      try {
        await api.delete(`/admin/towns/${id}`);
        showMessage('Pueblo eliminado');
        fetchTowns();
        fetchStats();
        if (selectedTown?.id === id) setSelectedTown(null);
      } catch (err) {
        showMessage('Error al eliminar el pueblo', 'danger');
      }
    }
  };

  const handlePlaceSubmit = async (e) => {
    e.preventDefault();
    try {
      const targetTownId = Number(place.townId);
      if (!targetTownId) {
        showMessage('Debe seleccionar un pueblo válido', 'danger');
        return;
      }

      const placeData = {
        ...place,
        latitude: parseFloat(place.latitude) || 0,
        longitude: parseFloat(place.longitude) || 0,
        townId: targetTownId,
        town: { id: targetTownId },
        active: place.id ? place.active : true // Si es nuevo (sin id), siempre es true
      };

      if (place.id) {
        await api.put(`/admin/places/${place.id}`, placeData);
        showMessage('Lugar actualizado exitosamente');
      } else {
        await api.post('/admin/places', placeData);
        showMessage('Lugar agregado exitosamente');
      }

      // Forzar actualización de la lista de lugares
      const freshTowns = await fetchTowns();
      await fetchStats();

      const updatedTown = freshTowns.find(t => t.id === targetTownId);

      if (updatedTown) {
        setSelectedTown(updatedTown);
        fetchPlaces(updatedTown.slug); // Refrescar lugares con el slug fresquito
      }

      // Resetear formulario
      setPlace({ name: '', description: '', category: '', address: '', imageUrl: '', latitude: '', longitude: '', townId: '', active: true });
      setShowPlaceModal(false);
    } catch (err) {
      showMessage('Error al guardar el lugar (Asegúrate de estar autenticado)', 'danger');
    }
  };

  const handleTogglePlaceStatus = async (p) => {
    const originalStatus = p.active;
    const newStatus = !originalStatus;
    const targetTownId = p.town?.id || p.townId || selectedTown?.id;

    // 1. Actualización optimista inmediata en la UI
    setPlaces(prev => prev.map(item => item.id === p.id ? { ...item, active: newStatus } : item));

    try {
      // 2. Intentamos el endpoint de status
      await api.put(`/admin/places/${p.id}/status`, { active: newStatus });
      fetchStats().catch(() => { });
      showMessage(`Estado de ${p.name} actualizado`);
    } catch (err) {
      // 3. Fallback: Si el endpoint /status no existe, usamos el PUT general
      // Enviamos el objeto EXACTO que el backend espera (incluyendo la relación town)
      try {
        const updateData = {
          ...p,
          latitude: parseFloat(p.latitude) || 0,
          longitude: parseFloat(p.longitude) || 0,
          active: newStatus,
          townId: targetTownId,
          town: { id: targetTownId }
        };

        await api.put(`/admin/places/${p.id}`, updateData);
        fetchStats().catch(() => { });
        showMessage(`Estado de ${p.name} actualizado`);
      } catch (innerErr) {
        // 4. Revertimos y notificamos al usuario el fallo total
        setPlaces(prev => prev.map(item => item.id === p.id ? { ...item, active: originalStatus } : item));
        showMessage(`Error crítico: No se pudo actualizar el estado de ${p.name}`, 'danger');
        console.error("Error persistente al cambiar estado:", innerErr);
      }
    }
  };

  const handleDeletePlace = async (id) => {
    if (window.confirm('¿Estás seguro de eliminar este lugar?')) {
      try {
        await api.delete(`/admin/places/${id}`);
        showMessage('Lugar eliminado');
        await fetchPlaces(selectedTown?.slug);
        await fetchStats();
      } catch (err) {
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
    backgroundColor: activeTab === tabName ? '#1e293b' : 'transparent',
    color: activeTab === tabName ? 'white' : '#495057',
    fontWeight: activeTab === tabName ? '600' : '500',
    padding: '10px 15px',
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    transition: 'all 0.2s ease'
  });

  if (loading) {
    return (
      <Container className="d-flex justify-content-center align-items-center" style={{ minHeight: '80vh' }}>
        <div className="spinner-border text-primary" role="status"><span className="visually-hidden">Cargando...</span></div>
      </Container>
    );
  }

  if (accessDenied) {
    return (
      <Container className="mt-5 text-center">
        <Alert variant="danger">
          <ShieldAlert size={48} className="mb-3 text-danger" />
          <h3 className="fw-bold">Acceso Denegado</h3>
          <p>Esta sección es exclusiva para Administradores de Turismo Local UNA.</p>
          <Button variant="outline-danger" onClick={() => window.location.href = '/'}>Volver al Inicio</Button>
        </Alert>
      </Container>
    );
  }

  return (
    <Container fluid className="p-0">
      <Row className="g-0">
        {/* Sidebar */}
        <Col md={2} style={sidebarStyle} className="p-3">
          <Nav className="flex-column mt-3">
            <Nav.Link style={navItemStyle('dashboard')} onClick={() => setActiveTab('dashboard')}>
              <LayoutDashboard size={18} /> Dashboard
            </Nav.Link>
            <Nav.Link style={navItemStyle('pueblos')} onClick={() => setActiveTab('pueblos')}>
              <Landmark size={18} /> Pueblos
            </Nav.Link>
            <Nav.Link style={navItemStyle('lugares')} onClick={() => setActiveTab('lugares')}>
              <MapPin size={18} /> Lugares
            </Nav.Link>
            <Nav.Link style={navItemStyle('usuarios')} onClick={() => setActiveTab('usuarios')}>
              <Users size={18} /> Usuarios
            </Nav.Link>
            <Nav.Link style={navItemStyle('estadisticas')} onClick={() => setActiveTab('estadisticas')}>
              <BarChart3 size={18} /> Estadísticas
            </Nav.Link>
          </Nav>
        </Col>

        {/* Main Content */}
        <Col md={10} className="p-4 bg-white">
          {/* Toast Notification Container */}
          <ToastContainer position="top-end" className="p-3" style={{ zIndex: 9999 }}>
            <Toast
              key={msg.text}
              onClose={() => setMsg({ text: '', type: '' })}
              show={!!msg.text}
              delay={3000}
              autohide
              bg={msg.type === 'success' ? 'success' : 'danger'}
            >
              <Toast.Header closeButton={false} className="text-white" style={{ backgroundColor: 'rgba(0,0,0,0.1)', borderBottom: 'none' }}>
                <strong className="me-auto">{msg.type === 'success' ? '✅ Éxito' : '❌ Error'}</strong>
              </Toast.Header>
              <Toast.Body className="text-white fw-bold">
                {msg.text}
              </Toast.Body>
            </Toast>
          </ToastContainer>

          {activeTab === 'pueblos' && (
            <div>
              <div className="d-flex justify-content-between align-items-center mb-4">
                <h3>Gestión de Pueblos</h3>
                <Button variant="primary" className="d-flex align-items-center gap-2" onClick={() => setShowTownModal(true)}>
                  <Plus size={18} /> Agregar Nuevo Pueblo
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
                        <Image src={t.imageUrl || 'https://via.placeholder.com/50'} rounded width={50} height={50} style={{ objectFit: 'cover' }} />
                      </td>
                      <td className="fw-bold">{t.name}</td>
                      <td><Badge bg="secondary">{t.slug}</Badge></td>
                      <td>{t.description.substring(0, 50)}...</td>
                      <td>
                        <Button
                          variant="outline-primary"
                          size="sm"
                          className="me-2"
                          onClick={() => {
                            setQrTown({ ...t, exactUrl: `${window.location.origin}/p/${t.slug}` });
                            setShowQRModal(true);
                          }}
                        >
                          <QrCode size={16} className="me-1" /> QR
                        </Button>
                        <Button variant="outline-secondary" size="sm" className="me-2" onClick={() => {
                          setTown(t);
                          setShowTownModal(true);
                        }}><Pencil size={14} /></Button>
                        <Button variant="outline-danger" size="sm" onClick={() => handleDeleteTown(t.id)}><Trash2 size={14} /></Button>
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
                <Button variant="primary" className="d-flex align-items-center gap-2" onClick={() => {
                  if (towns.length === 0) return alert('Debes crear un pueblo primero');
                  setPlace({ name: '', description: '', category: '', address: '', imageUrl: '', latitude: '', longitude: '', townId: selectedTown?.id || towns[0].id, active: true });
                  setShowPlaceModal(true);
                }}>
                  <Plus size={18} /> Agregar Nuevo Lugar
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
                        <Image src={p.imageUrl || 'https://via.placeholder.com/50'} rounded width={50} height={50} style={{ objectFit: 'cover' }} />
                      </td>
                      <td className="fw-bold">{p.name}</td>
                      <td><span className="px-3 py-1 rounded-pill" style={{ backgroundColor: '#fef3c7', color: '#92400e', fontSize: '0.75rem', fontWeight: '600' }}>{p.category}</span></td>
                      <td>{p.address}</td>
                      <td>
                        <Form.Check
                          type="switch"
                          id={`switch-place-${p.id}`}
                          label={p.active ? "Activo" : "Inactivo"}
                          checked={p.active}
                          onChange={() => handleTogglePlaceStatus(p)}
                        />
                      </td>
                      <td>
                        {p.active && (
                          <Button
                            variant="outline-primary"
                            size="sm"
                            className="me-2"
                            onClick={() => {
                              setQrTown({
                                name: p.name,
                                slug: selectedTown.slug,
                                exactUrl: `${window.location.origin}/p/${selectedTown.slug}/places?destino=${p.id}`
                              });
                              setShowQRModal(true);
                            }}
                          >
                            <QrCode size={16} className="me-1" /> QR
                          </Button>
                        )}
                        <Button variant="outline-secondary" size="sm" className="me-2" onClick={() => {
                          setPlace({ ...p, townId: selectedTown.id });
                          setShowPlaceModal(true);
                        }}><Pencil size={14} /></Button>
                        <Button variant="outline-danger" size="sm" onClick={() => handleDeletePlace(p.id)}><Trash2 size={14} /></Button>
                      </td>
                    </tr>
                  ))}
                  {places.length === 0 && <tr><td colSpan="6" className="text-center text-muted">No hay lugares en este pueblo</td></tr>}
                </tbody>
              </Table>
            </div>
          )}

          {activeTab === 'dashboard' && stats && (
            <div>
              <h3 className="mb-4">Dashboard de Control</h3>
              <Row className="mb-4">
                <Col md={4}>
                  <Card className="border-0 shadow-sm h-100" style={{ borderLeft: '4px solid #4f46e5', backgroundColor: '#f8fafc' }}>
                    <Card.Body className="p-4">
                      <h6 className="text-muted text-uppercase mb-2" style={{ fontSize: '0.7rem', letterSpacing: '0.05em', fontWeight: '700' }}>Pueblos Totales</h6>
                      <h2 className="fw-bold mb-0" style={{ color: '#1e293b' }}>{stats.totalTowns}</h2>
                    </Card.Body>
                  </Card>
                </Col>
                <Col md={4}>
                  <Card className="border-0 shadow-sm h-100" style={{ borderLeft: '4px solid #10b981', backgroundColor: '#f8fafc' }}>
                    <Card.Body className="p-4">
                      <h6 className="text-muted text-uppercase mb-2" style={{ fontSize: '0.7rem', letterSpacing: '0.05em', fontWeight: '700' }}>Lugares Turísticos</h6>
                      <h2 className="fw-bold mb-0" style={{ color: '#1e293b' }}>{stats.totalPlaces}</h2>
                    </Card.Body>
                  </Card>
                </Col>
                <Col md={4}>
                  <Card className="border-0 shadow-sm h-100" style={{ borderLeft: '4px solid #f59e0b', backgroundColor: '#f8fafc' }}>
                    <Card.Body className="p-4">
                      <h6 className="text-muted text-uppercase mb-2" style={{ fontSize: '0.7rem', letterSpacing: '0.05em', fontWeight: '700' }}>Usuarios Registrados</h6>
                      <h2 className="fw-bold mb-0" style={{ color: '#1e293b' }}>{stats.totalUsers}</h2>
                    </Card.Body>
                  </Card>
                </Col>
              </Row>
              <h4 className="mb-3">Últimos Lugares Agregados</h4>
              <Table hover responsive className="align-middle">
                <thead className="bg-light">
                  <tr>
                    <th>Lugar</th>
                    <th>Categoría</th>
                  </tr>
                </thead>
                <tbody>
                  {stats.recentPlaces?.map(p => (
                    <tr key={p.id}>
                      <td className="fw-bold">{p.name}</td>
                      <td><span className="px-2 py-1 rounded text-xs" style={{ backgroundColor: '#e0f2fe', color: '#0369a1', fontSize: '0.75rem' }}>{p.category}</span></td>
                    </tr>
                  ))}
                  {stats.recentPlaces?.length === 0 && <tr><td colSpan="2" className="text-center text-muted">Aún no hay lugares</td></tr>}
                </tbody>
              </Table>
            </div>
          )}

          {activeTab === 'usuarios' && (
            <div>
              <h3 className="mb-4">Gestión de Usuarios</h3>
              <Table hover responsive className="align-middle">
                <thead className="bg-light">
                  <tr>
                    <th>Usuario</th>
                    <th>Email</th>
                    <th>Rol</th>
                    <th>Estado</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map(u => (
                    <tr key={u.id}>
                      <td>
                        <div className="d-flex align-items-center">
                          <Image src={u.pictureUrl || 'https://via.placeholder.com/40'} roundedCircle width={40} height={40} className="me-2" />
                          <span className="fw-bold">{u.name}</span>
                        </div>
                      </td>
                      <td>{u.email}</td>
                      <td>
                        <Form.Select size="sm" value={u.role} onChange={async (e) => {
                          try {
                            await api.put(`/admin/users/${u.id}/role`, { role: e.target.value });
                            fetchUsers();
                            showMessage('Rol actualizado');
                          } catch (err) {
                            const errorMessage = err.response?.data?.error || 'Error actualizando rol';
                            showMessage(errorMessage, 'danger');
                            // Volver a cargar para que el select vuelva a decir "Administrador"
                            fetchUsers();
                          }
                        }} style={{ width: '150px' }}>
                          <option value="ROLE_USER">Turista</option>
                          <option value="ROLE_ADMIN">Administrador</option>
                        </Form.Select>
                      </td>
                      <td>
                        <Form.Check
                          type="switch"
                          id={`user-active-${u.id}`}
                          checked={u.active}
                          label={u.active ? 'Activo' : 'Bloqueado'}
                          onChange={async (e) => {
                            try {
                              await api.put(`/admin/users/${u.id}/status`, { active: e.target.checked });
                              fetchUsers();
                              showMessage(e.target.checked ? 'Usuario activado' : 'Usuario bloqueado');
                            } catch (err) {
                              showMessage('Error actualizando estado', 'danger');
                            }
                          }}
                        />
                      </td>
                    </tr>
                  ))}
                  {users.length === 0 && <tr><td colSpan="4" className="text-center text-muted">No hay usuarios</td></tr>}
                </tbody>
              </Table>
            </div>
          )}

          {activeTab === 'estadisticas' && stats && (
            <div>
              <h3 className="mb-4">Análisis y Estadísticas Globales</h3>
              <Row>
                <Col md={6}>
                  <Card className="shadow-sm mb-4">
                    <Card.Header className="bg-white fw-bold">Lugares por Categoría</Card.Header>
                    <Card.Body style={{ height: '300px' }}>
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={Object.entries(stats.placesByCategory || {}).map(([name, value]) => ({ name, value }))}
                            dataKey="value"
                            nameKey="name"
                            cx="50%"
                            cy="50%"
                            outerRadius={80}
                            fill="#8884d8"
                            label
                          >
                            {Object.entries(stats.placesByCategory || {}).map((entry, index) => {
                              const colors = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#a28bfe'];
                              return <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />;
                            })}
                          </Pie>
                          <Tooltip />
                          <Legend />
                        </PieChart>
                      </ResponsiveContainer>
                    </Card.Body>
                  </Card>
                </Col>
                <Col md={6}>
                  <Card className="shadow-sm mb-4">
                    <Card.Header className="bg-white fw-bold">Top Últimos Lugares Agregados</Card.Header>
                    <Card.Body style={{ height: '300px' }}>
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={stats.recentPlaces?.map(p => ({ name: p.name, value: 1 })) || []}>
                          <XAxis dataKey="name" tick={{ fontSize: 10 }} interval={0} angle={-45} textAnchor="end" height={60} />
                          <YAxis />
                          <Tooltip />
                          <Bar dataKey="value" fill="#82ca9d" />
                        </BarChart>
                      </ResponsiveContainer>
                    </Card.Body>
                  </Card>
                </Col>
              </Row>
            </div>
          )}
        </Col>
      </Row>

      {/* Modal Pueblo */}
      <Modal show={showTownModal} onHide={() => {
        setShowTownModal(false);
        setTown({ slug: '', name: '', description: '', imageUrl: '' });
      }}>
        <Modal.Header closeButton className="border-0 pb-0">
          <Modal.Title>{town.id ? 'Editar Pueblo' : 'Agregar Nuevo Pueblo'}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleTownSubmit}>
            <Form.Group className="mb-3">
              <Form.Label>Nombre del Pueblo</Form.Label>
              <Form.Control type="text" value={town.name} onChange={e => setTown({ ...town, name: e.target.value })} required />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Ruta (Slug)</Form.Label>
              <Form.Control type="text" value={town.slug} onChange={e => setTown({ ...town, slug: e.target.value })} placeholder="ej: santa-maria" required />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Descripción</Form.Label>
              <Form.Control as="textarea" rows={3} value={town.description} onChange={e => setTown({ ...town, description: e.target.value })} required />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>URL de Imagen</Form.Label>
              <Form.Control type="url" value={town.imageUrl} onChange={e => setTown({ ...town, imageUrl: e.target.value })} />
            </Form.Group>
            <Button type="submit" variant="primary" className="w-100">Guardar Pueblo</Button>
          </Form>
        </Modal.Body>
      </Modal>

      {/* Modal Lugar */}
      <Modal show={showPlaceModal} onHide={() => {
        setShowPlaceModal(false);
        setPlace({ name: '', description: '', category: '', address: '', imageUrl: '', latitude: '', longitude: '', townId: '', active: true });
      }}>
        <Modal.Header closeButton className="border-0 pb-0">
          <Modal.Title>{place.id ? 'Editar Lugar Turístico' : 'Agregar Nuevo Lugar'}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handlePlaceSubmit}>
            <Form.Group className="mb-3">
              <Form.Label>Pertenece al Pueblo:</Form.Label>
              <Form.Select value={place.townId} onChange={e => setPlace({ ...place, townId: e.target.value })} required>
                <option value="">Selecciona un pueblo</option>
                {towns.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
              </Form.Select>
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Nombre del Lugar</Form.Label>
              <Form.Control type="text" value={place.name} onChange={e => setPlace({ ...place, name: e.target.value })} required />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Categoría</Form.Label>
              <Form.Select value={place.category} onChange={e => setPlace({ ...place, category: e.target.value })} required>
                <option value="">Selecciona una categoría</option>
                <option value="Mirador">Mirador</option>
                <option value="Cultural">Cultural</option>
                <option value="Gastronomía">Gastronomía</option>
                <option value="Parque">Parque</option>
              </Form.Select>
            </Form.Group>
            <Row>
              <Col>
                <Form.Group className="mb-3">
                  <Form.Label>Latitud</Form.Label>
                  <Form.Control type="number" step="any" value={place.latitude} onChange={e => setPlace({ ...place, latitude: e.target.value })} placeholder="ej: 9.9281" required />
                </Form.Group>
              </Col>
              <Col>
                <Form.Group className="mb-3">
                  <Form.Label>Longitud</Form.Label>
                  <Form.Control type="number" step="any" value={place.longitude} onChange={e => setPlace({ ...place, longitude: e.target.value })} placeholder="ej: -84.0907" required />
                </Form.Group>
              </Col>
            </Row>
            <Form.Group className="mb-3">
              <Form.Label>Dirección Física</Form.Label>
              <Form.Control type="text" value={place.address} onChange={e => setPlace({ ...place, address: e.target.value })} required />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Descripción</Form.Label>
              <Form.Control as="textarea" rows={2} value={place.description} onChange={e => setPlace({ ...place, description: e.target.value })} required />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>URL de Fotografía</Form.Label>
              <Form.Control type="url" value={place.imageUrl} onChange={e => setPlace({ ...place, imageUrl: e.target.value })} />
            </Form.Group>
            <Button type="submit" variant="primary" className="w-100">Guardar Lugar Turístico</Button>
          </Form>
        </Modal.Body>
      </Modal>

      {/* Modal QR Poster - Generación Inmediata */}
      <Modal show={showQRModal} onHide={() => setShowQRModal(false)} centered>
        <Modal.Header closeButton className="border-0">
          <Modal.Title className="fs-5">QR del Pueblo</Modal.Title>
        </Modal.Header>
        <Modal.Body className="text-center pb-4">
          {qrTown ? (
            <>
              <QRPoster townSlug={qrTown.slug} townName={qrTown.name} exactUrl={qrTown.exactUrl} />
              <div className="mt-3 p-2 bg-light rounded border text-break">
                <div className="text-muted mb-1 small fw-bold text-uppercase">URL de destino (QR):</div>
                <code className="text-primary" style={{ fontSize: '0.85rem' }}>
                  {qrTown.exactUrl || `${window.location.origin}/p/${qrTown.slug}`}
                </code>
              </div>
            </>
          ) : (
            <div className="spinner-border text-primary" role="status"></div>
          )}
        </Modal.Body>
      </Modal>

    </Container>
  );
};

export default AdminPanel;