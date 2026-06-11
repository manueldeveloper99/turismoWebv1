import { QRCodeSVG } from 'qrcode.react';
import { MapPin, Printer } from 'lucide-react';  //Alegr

function QRPoster({ townSlug, townName, exactUrl }) {
  const url = exactUrl || `${import.meta.env.VITE_APP_URL}/p/${townSlug}`;

  return (
    <div className="d-flex flex-column align-items-center p-2">
      <div style={styles.posterContainer} id="qr-poster">
        <div style={styles.innerFrame}>
          <div style={styles.header}>
            <MapPin size={28} style={{ color: '#ef4444', marginBottom: '8px' }} />
            <h5 style={styles.topText}>DESCUBRE LA MAGIA DE</h5>
            <h1 style={styles.townName}>{townName?.toUpperCase()}</h1>
          </div>

          <div style={styles.qrSection}>
            <div style={styles.qrDecorator}>
              <div style={styles.qrBackground}>
                <QRCodeSVG
                  value={url}
                  size={160}
                  level="H"
                  includeMargin={true}
                />
              </div>
            </div>
            <p style={styles.scanText}>Escanea para explorar</p>
          </div>

          <div style={styles.footer}>
            <div style={styles.line}></div>
            <p style={styles.urlDisplay}>{url}</p>
            <p style={styles.brandText}>TURISMO LOCAL · UNA</p>
          </div>
        </div>
      </div>

      <div className="no-print">
        <button
          className="btn btn-primary mt-4 rounded-pill px-4 d-flex align-items-center gap-2 shadow-sm fw-bold"
          onClick={() => window.print()}
        >
          <Printer size={18} /> Imprimir Cartel
        </button>
      </div>

      <style>{`
        @media print {
          body * { visibility: hidden; }
          #qr-poster, #qr-poster * { visibility: visible; }
          #qr-poster {
            position: absolute;
            left: 50%;
            top: 50%;
            transform: translate(-50%, -50%) scale(1.2);
          }
          .no-print { display: none !important; }
        }
      `}</style>
    </div>
  );
}

const styles = {
  posterContainer: {
    background: '#0f172a',
    padding: '12px',
    borderRadius: '20px',
    boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.2), 0 10px 10px -5px rgba(0, 0, 0, 0.1)',
    width: '320px',
    color: 'white',
    fontFamily: "'Segoe UI', system-ui, sans-serif"
  },
  innerFrame: {
    border: '2px solid rgba(255,255,255,0.1)',
    borderRadius: '16px',
    padding: '24px 16px',
    textAlign: 'center',
    background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)'
  },
  header: {
    marginBottom: '15px'
  },
  topText: {
    fontSize: '10px',
    letterSpacing: '3px',
    fontWeight: '600',
    margin: 0,
    color: '#94a3b8'
  },
  townName: {
    fontSize: '26px',
    fontWeight: '800',
    margin: '8px 0 0',
    letterSpacing: '-0.5px',
    color: '#ffffff'
  },
  qrSection: {
    margin: '25px 0'
  },
  qrDecorator: {
    background: 'white',
    padding: '14px',
    borderRadius: '18px',
    display: 'inline-block',
    boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.5)'
  },
  qrBackground: { background: 'white' },
  scanText: {
    fontSize: '12px',
    marginTop: '15px',
    fontWeight: '500',
    color: '#cbd5e1',
    textTransform: 'uppercase',
    letterSpacing: '1px'
  },
  footer: { marginTop: '10px' },
  line: { height: '1px', background: 'rgba(255,255,255,0.1)', margin: '15px 30px' },
  urlDisplay: { fontSize: '9px', opacity: 0.5, wordBreak: 'break-all', marginBottom: '8px' },
  brandText: { fontSize: '11px', fontWeight: '700', letterSpacing: '2px', color: '#64748b' }
};

export default QRPoster;