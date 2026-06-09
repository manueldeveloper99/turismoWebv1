import i18n from 'i18next'; //Alegr
import { initReactI18next } from 'react-i18next';

const resources = {
  en: {
    translation: {
      "nav": {
        "admin": "Admin Panel",
        "logout": "Logout",
        "select_town": "Select Town"
      },
      "landing": {
        "title": "Local Tourism",
        "subtitle": "Discover the beauty of our towns",
        "instruction": "Scan the physical QR code located in the town to see its tourist attractions.",
        "admin_link": "Are you an Admin? Login here",
        "no_towns": "No towns registered"
      },
      "places": {
        "title": "Places Map",
        "list_view": "List View",
        "map_view": "Map View",
        "no_map": "No map",
        "no_places": "No places registered."
      },
      "admin": {
        "dashboard": "Dashboard",
        "towns": "Towns",
        "places": "Places",
        "users": "Users",
        "stats": "Statistics"
      },
      "login": {
        "admin_title": "Admin Access",
        "welcome": "Welcome to",
        "google_only": "Only @gmail.com accounts accepted"
      }
    }
  },
  es: {
    translation: {
      "nav": {
        "admin": "Panel Admin",
        "logout": "Cerrar Sesión",
        "select_town": "Seleccionar Pueblo"
      },
      "landing": {
        "title": "Turismo Local",
        "subtitle": "Descubre la belleza de nuestros pueblos",
        "instruction": "Escanea el código QR físico ubicado en el pueblo para ver sus lugares turísticos.",
        "admin_link": "¿Eres Administrador? Ingresa aquí",
        "no_towns": "No hay pueblos registrados"
      },
      "places": {
        "title": "Mapa de Lugares",
        "list_view": "Vista Lista",
        "map_view": "Vista Mapa",
        "no_map": "Sin mapa",
        "no_places": "No hay lugares registrados."
      },
      "admin": {
        "dashboard": "Dashboard",
        "towns": "Pueblos",
        "places": "Lugares",
        "users": "Usuarios",
        "stats": "Estadísticas"
      },
      "login": {
        "admin_title": "Acceso de Administrador",
        "welcome": "Bienvenido a",
        "google_only": "Solo se aceptan cuentas @gmail.com"
      }
    }
  }
};

const savedLanguage = localStorage.getItem('i18nextLng') || 'es';

i18n.use(initReactI18next).init({
  resources,
  lng: savedLanguage,
  interpolation: { escapeValue: false }
});

export default i18n;