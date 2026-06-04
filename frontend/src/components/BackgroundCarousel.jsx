import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, EffectCoverflow } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/effect-coverflow';

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
  return (
    <div style={{
      position: inline ? 'absolute' : 'fixed',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      zIndex: 0,
      backgroundColor: 'transparent', // Sin fondo, hereda el color limpio de la página
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      overflow: 'hidden'
    }}>
      <Swiper
        modules={[Autoplay, EffectCoverflow]}
        effect="coverflow"
        grabCursor={true}
        centeredSlides={true}
        slidesPerView="auto"
        coverflowEffect={{
          rotate: 40,
          stretch: 0,
          depth: 200,
          modifier: 1,
          slideShadows: true,
        }}
        autoplay={{ delay: 3500, disableOnInteraction: false }}
        speed={1000}
        loop={true}
        style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center' }}
      >
        {backgroundImages.map((img, index) => (
          <SwiperSlide key={index} style={{ width: '60%', height: '70%', borderRadius: '15px', overflow: 'hidden', boxShadow: '0 15px 50px rgba(0,0,0,0.6)' }}>
            <div
              style={{
                width: '100%',
                height: '100%',
                backgroundImage: `url(${img})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                position: 'relative'
              }}
            >
              {/* Overlay interno oscuro para cada carta */}
              {showCaptions && (
                <div style={{
                  position: 'absolute',
                  top: 0, left: 0, width: '100%', height: '100%',
                  background: 'linear-gradient(to top, rgba(0,0,0,0.9) 0%, rgba(0,0,0,0) 60%)',
                  zIndex: 1
                }} />
              )}

              {/* Títulos dinámicos dentro de la carta */}
              {showCaptions && (
                <div style={{
                  position: 'absolute',
                  bottom: '8%',
                  left: '8%',
                  right: '8%',
                  zIndex: 2,
                  color: 'white',
                  textShadow: '0 4px 12px rgba(0,0,0,0.9)'
                }}>
                  <h2 style={{ color: '#ffffff', fontWeight: '800', fontSize: '2.5rem', marginBottom: '10px' }}>{captions[index]}</h2>
                  <h4 style={{ fontWeight: '500', color: '#00bfa5' }}>Costa Rica: ¡Pura Vida!</h4>
                </div>
              )}
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default BackgroundCarousel;
