import { useNavigate } from 'react-router-dom';

const ErrorPage = ({ message }) => {
  const navigate = useNavigate();
  const goHome = () => navigate('/');
  const retryConnection = () => window.location.reload();

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #eef2f7 0%, #dce6f5 100%)',
      display: 'flex',
      flexDirection: 'column',
      fontFamily: "'Segoe UI', system-ui, sans-serif"
    }}>
      <nav style={{
        background: '#1a56b0',
        color: 'white',
        padding: '14px 32px',
        fontSize: '18px',
        fontWeight: '600',
        boxShadow: '0 2px 8px rgba(0,0,0,0.2)'
      }}>
        Turismo Local UNA
      </nav>

      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px 20px' }}>
        <div style={{
          display: 'flex', flexDirection: 'column', alignItems: 'center',
          maxWidth: '660px', width: '100%',
          background: 'white', borderRadius: '20px',
          boxShadow: '0 20px 60px rgba(0,0,0,0.12)', overflow: 'hidden'
        }}>
          {/* Sección superior con imagen y 404 */}
          <div style={{
            background: 'linear-gradient(160deg, #f8faff 0%, #edf2fb 100%)',
            width: '100%', display: 'flex', flexDirection: 'column',
            alignItems: 'center', padding: '44px 40px 32px',
            borderBottom: '1px solid #e8eef6'
          }}>
            <div style={{
              marginBottom: '24px',
              animation: 'floatAnim 4s ease-in-out infinite',
              filter: 'drop-shadow(0 12px 24px rgba(0,0,0,0.18))'
            }}>
              <img
                src="/images/1f7506a3-154e-49d2-9f93-0a0289bcd941.png"
                alt="Mapa"
                style={{ width: '220px', height: 'auto', borderRadius: '12px' }}
              />
            </div>
            <h1 style={{
              color: '#b91c3c', fontSize: '72px', fontWeight: '800',
              margin: 0, lineHeight: 1, letterSpacing: '-2px'
            }}>404</h1>
          </div>

          {/* Contenido */}
          <div style={{ padding: '32px 44px 40px', width: '100%', boxSizing: 'border-box', textAlign: 'center' }}>
            <h2 style={{ color: '#1e293b', fontSize: '26px', fontWeight: '700', margin: '0 0 10px' }}>
              ¡Ups! Pueblo no encontrado
            </h2>
            <p style={{ color: '#64748b', fontSize: '15.5px', lineHeight: '1.7', margin: '0 0 24px' }}>
              {message || 'El código QR escaneado no corresponde a un pueblo registrado en nuestro sistema, o tu sesión ha expirado.'}
            </p>

            <div style={{
              display: 'flex', alignItems: 'flex-start', gap: '12px',
              background: '#fffbeb', border: '2px solid #f59e0b',
              borderRadius: '12px', padding: '14px 18px',
              marginBottom: '28px', textAlign: 'left'
            }}>
              <span style={{ fontSize: '20px' }}>⚠️</span>
              <p style={{ margin: 0, color: '#78350f', fontSize: '14.5px', lineHeight: '1.6' }}>
                <strong>Posibles causas:</strong> QR inválido, sin conexión a internet, sesión expirada.
              </p>
            </div>

            <div style={{ display: 'flex', gap: '14px', justifyContent: 'center', flexWrap: 'wrap' }}>
              <button
                onClick={goHome}
                style={{
                  background: '#b91c3c', color: 'white', border: 'none',
                  padding: '13px 32px', fontSize: '15px', fontWeight: '600',
                  borderRadius: '10px', cursor: 'pointer',
                  boxShadow: '0 4px 14px rgba(185,28,60,0.35)'
                }}
              >
                Volver al inicio
              </button>
              <button
                onClick={retryConnection}
                style={{
                  background: 'white', color: '#b91c3c',
                  border: '2px solid #b91c3c', padding: '11px 30px',
                  fontSize: '15px', fontWeight: '600',
                  borderRadius: '10px', cursor: 'pointer'
                }}
              >
                Reintentar conexión
              </button>
            </div>

            <p style={{ marginTop: '20px', fontSize: '13px', color: '#94a3b8' }}>
              Si el problema persiste contacta a soporte técnico.
            </p>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes floatAnim {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-12px); }
        }
      `}</style>
    </div>
  );
};

export default ErrorPage;

//AlessandroErrorPage.jsx Viva messi 1 n