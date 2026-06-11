import { useState, useRef, useEffect } from 'react';
import { Button, Card, Form, InputGroup } from 'react-bootstrap';
import { MessageSquare, Send, X, Bot, Sparkles, Smile, Meh, Frown } from 'lucide-react';
import { useLocation } from 'react-router-dom';
import api from '../services/api';

const AIChatbot = () => {
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [chat, setChat] = useState([
    { role: 'ai', content: '¡Hola! Soy tu asistente de Turismo Local CR. Puedo recomendarte los mejores miradores, restaurantes o parques. ¿Qué buscas hoy?', sentiment: 'neutral' }
  ]);
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [chat]);

  // Extraer el pueblo actual de la URL si existe (/p/nombre-pueblo/places)
  const getCurrentTown = () => {
    const pathParts = location.pathname.split('/');
    const pIndex = pathParts.indexOf('p');
    return pIndex !== -1 ? pathParts[pIndex + 1] : null;
  };

  const handleSend = async (e) => {
    e.preventDefault();
    if (!message.trim()) return;

    const userMessage = { role: 'user', content: message };
    setChat(prev => [...prev, userMessage]);
    setMessage('');
    setLoading(true);

    try {
      const currentTown = getCurrentTown();
      
      // Enviamos el mensaje junto con el contexto del pueblo actual
      const res = await api.post('/ai/chat', { 
        prompt: message,
        townContext: currentTown 
      });

      // Manejo robusto de la respuesta: extraemos el contenido ya sea si viene como objeto o como string directo.
      const aiResponse = res.data?.response || (typeof res.data === 'string' ? res.data : 'Lo siento, no pude encontrar información sobre eso.');
      const aiSentiment = res.data?.sentiment || 'neutral';

      setChat(prev => [...prev, { 
        role: 'ai', 
        content: aiResponse,
        sentiment: aiSentiment
      }]);
    } catch (err) {
      // Logueamos el error para depuración técnica en la consola
      console.error('Error en la comunicación con el agente de IA:', err);
      setChat(prev => [...prev, { role: 'ai', content: 'Lo siento, tuve un problema al procesar tu solicitud.', sentiment: 'neutral' }]);
    } finally {
      setLoading(false);
    }
  };

  const getSentimentIcon = (sentiment) => {
    switch(sentiment) {
      case 'positive': return <Smile className="text-success" size={16} />;
      case 'negative': return <Frown className="text-danger" size={16} />;
      default: return <Meh className="text-muted" size={16} />;
    }
  };

  return (
    <div style={{ position: 'fixed', bottom: '30px', right: '30px', zIndex: 2000 }}>
      {!isOpen ? (
        <Button 
          onClick={() => setIsOpen(true)}
          className="rounded-circle shadow-lg p-3 d-flex align-items-center justify-content-center"
          style={{ width: '60px', height: '60px', background: 'linear-gradient(135deg, #00bfa5 0%, #00796b 100%)', border: 'none' }}
        >
          <MessageSquare color="white" size={30} />
        </Button>
      ) : (
        <Card className="shadow-2xl border-0" style={{ width: '350px', borderRadius: '20px', overflow: 'hidden', backdropFilter: 'blur(10px)', backgroundColor: 'rgba(255, 255, 255, 0.95)' }}>
          <Card.Header className="d-flex justify-content-between align-items-center bg-dark text-white p-3 border-0">
            <div className="d-flex align-items-center">
              <Bot size={20} className="me-2 text-info" />
              <span className="fw-bold">Turismo IA Asistente</span>
            </div>
            <X size={20} style={{ cursor: 'pointer' }} onClick={() => setIsOpen(false)} />
          </Card.Header>
          <Card.Body className="p-3" style={{ height: '400px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '10px' }} ref={scrollRef}>
            {chat.map((msg, idx) => (
              <div key={idx} className={`d-flex flex-column ${msg.role === 'user' ? 'align-items-end' : 'align-items-start'}`}>
                <div className={`p-3 rounded-2xl max-w-80 ${msg.role === 'user' ? 'bg-primary text-white' : 'bg-light'}`} style={{ borderRadius: '15px', maxWidth: '85%', fontSize: '0.9rem' }}>
                  {msg.content}
                </div>
                {msg.role === 'ai' && (
                  <div className="mt-1 d-flex align-items-center" style={{ fontSize: '0.7rem' }}>
                    {getSentimentIcon(msg.sentiment)} <span className="ms-1 text-muted">IA Analizando...</span>
                  </div>
                )}
              </div>
            ))}
            {loading && <div className="text-muted small"><Sparkles size={14} className="animate-pulse me-1" /> Generando respuesta...</div>}
          </Card.Body>
          <Card.Footer className="bg-white border-0 p-3">
            <Form onSubmit={handleSend}>
              <InputGroup>
                <Form.Control 
                  placeholder="Pregúntame algo..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  style={{ borderRadius: '20px 0 0 20px', fontSize: '0.9rem' }}
                />
                <Button type="submit" variant="primary" style={{ borderRadius: '0 20px 20px 0' }}>
                  <Send size={18} />
                </Button>
              </InputGroup>
            </Form>
          </Card.Footer>
        </Card>
      )}
    </div>
  );
};

export default AIChatbot;