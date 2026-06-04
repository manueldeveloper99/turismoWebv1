import { useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, EffectCreative } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/effect-creative';

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

  return (
    <>
      {/* Capas del carrusel de fondo con Swiper 3D */}
      <div style={{
        position: inline ? 'absolute' : 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        zIndex: 0,
        overflow: 'hidden'
      }}>
        <Swiper
          modules={[Autoplay, EffectCreative]}
          effect="creative"
          grabCursor={true}
          creativeEffect={{
            prev: {
              shadow: true,
              translate: ['-20%', 0, -1],
              scale: 0.9,
              opacity: 0.5,
            },
            next: {
              translate: ['100%', 0, 0],
            },
          }}
          autoplay={{ delay: 5000, disableOnInteraction: false }}
          speed={1200}
          loop={true}
          onSlideChange={(swiper) => setCurrentImageIndex(swiper.realIndex)}
          style={{ width: '100%', height: '100%' }}
        >
          {backgroundImages.map((img, index) => (
            <SwiperSlide key={index}>
              <div
                style={{
                  width: '100%',
                  height: '100%',
                  backgroundImage: `url(${img})`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                }}
              />
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
      
      {/* Overlay oscuro para que el contenido resalte */}
      <div style={{
        position: inline ? 'absolute' : 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
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
                transform: index === currentImageIndex ? 'translateY(0)' : 'translateY(20px)',
                transition: 'all 1s cubic-bezier(0.4, 0, 0.2, 1)',
                width: '100%'
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
