import { useState, useEffect } from 'react';
import img1 from '../assets/imagen1.png';
import img2 from '../assets/imagen2.png';
import img3 from '../assets/imagen3.png';
import img4 from '../assets/imagen4.png';
import img5 from '../assets/imagen5.png';
import img6 from '../assets/imagen6.png';
import img7 from '../assets/imagen7.png';

const backgroundImages = [img1, img2, img3, img4, img5, img6, img7];
const captions = [
  "Playas paradisíacas de arena blanca",
  "Impresionantes volcanes y naturaleza",
  "Selvas tropicales y gran biodiversidad",
  "Aventura y pura vida en cada rincón",
  "Atardeceres mágicos en el Pacífico",
  "Cultura y tradición costarricense",
  "Fauna exótica en su hábitat natural"
];

const BackgroundCarousel = ({ inline = false, showCaptions = false }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) => (prevIndex + 1) % backgroundImages.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <>
      {/* Capas del carrusel de fondo */}
      {backgroundImages.map((img, index) => (
        <div
          key={index}
          style={{
            position: inline ? 'absolute' : 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundImage: `url(${img})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            opacity: index === currentImageIndex ? 1 : 0,
            transition: 'opacity 1.5s ease-in-out',
            zIndex: 0
          }}
        />
      ))}
      
      {/* Overlay oscuro para que el contenido resalte */}
      <div style={{
        position: inline ? 'absolute' : 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.4)',
        zIndex: 1,
        pointerEvents: 'none'
      }} />

      {/* Títulos dinámicos sobre el overlay */}
      {showCaptions && (
        <div style={{
          position: inline ? 'absolute' : 'fixed',
          bottom: '10%',
          left: '10%',
          right: '10%',
          zIndex: 2,
          color: 'white',
          textShadow: '0 4px 12px rgba(0,0,0,0.9)'
        }}>
          {backgroundImages.map((_, index) => (
            <div 
              key={index}
              style={{
                position: 'absolute',
                bottom: 0,
                left: 0,
                opacity: index === currentImageIndex ? 1 : 0,
                transition: 'opacity 1.5s ease-in-out'
              }}
            >
              <h2 style={{ color: '#ffffff', fontWeight: '800', fontSize: '2.5rem', marginBottom: '10px' }}>{captions[index]}</h2>
              <h4 style={{ fontWeight: '500', color: '#00bfa5' }}>Costa Rica: ¡Pura Vida!</h4>
            </div>
          ))}
        </div>
      )}
    </>
  );
};

export default BackgroundCarousel;
