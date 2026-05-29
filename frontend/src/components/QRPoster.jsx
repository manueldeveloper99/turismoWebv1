import { QRCodeSVG } from 'qrcode.react';

function QRPoster({ townSlug, townName }) {
  const url = `${import.meta.env.VITE_APP_URL}/p/${townSlug}`;

  return (
    <div className="d-flex flex-column align-items-center">
      <div style={styles.woodFrame}>
        <div style={styles.card}>
          <div style={styles.mountainBg}>
            <h3 style={styles.welcome}>BIENVENIDO A</h3>
            <h2 style={styles.townName}>{townName.toUpperCase()}</h2>
            <p style={styles.subtitle}>
              Escanea este código QR para descubrir<br />
              los mejores lugares turísticos de nuestro pueblo
            </p>
            <div style={styles.qrBox}>
              <QRCodeSVG value={url} size={180} level="H" includeMargin={true} />
            </div>
            <p style={styles.urlText}>{url}</p>
            <p style={styles.footer}>Universidad Nacional · Programación 4</p>
          </div>
        </div>
      </div>
      <button className="btn btn-primary mt-3" onClick={() => window.print()}>
        Imprimir cartel
      </button>
    </div>
  );
}

const styles = {
  woodFrame: { background: '#c8a55a', padding: 20, borderRadius: 8, display: 'inline-block' },
  card: { background: 'white', borderRadius: 4, width: 300, overflow: 'hidden' },
  mountainBg: { background: 'linear-gradient(180deg, #fff 45%, #c5d8e8 100%)', padding: 24, textAlign: 'center' },
  welcome: { color: '#1a3a5c', fontSize: 16, margin: 0 },
  townName: { color: '#1a3a5c', fontSize: 22, margin: '4px 0 12px', fontWeight: 'bold' },
  subtitle: { fontSize: 13, color: '#333', lineHeight: 1.5 },
  qrBox: { border: '2px solid #c8a84b', borderRadius: 8, display: 'inline-block', padding: 8, margin: '12px 0' },
  urlText: { fontSize: 10, color: '#555' },
  footer: { fontSize: 11, color: '#888', marginTop: 8 },
};

export default QRPoster;