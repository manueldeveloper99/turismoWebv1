# Turismo Local CR - Prueba de Concepto (PoC)

Bienvenido al repositorio oficial del **Sistema Web de Turismo Local**, un proyecto universitario diseñado bajo una arquitectura cliente-servidor desacoplada.

##  Descripción General
Este sistema es una Prueba de Concepto (PoC) y Producto Mínimo Viable (MVP) para promover el turismo a nivel cantonal. 
El flujo principal consiste en que los turistas escanean un **código QR físico** ubicado estratégicamente en un pueblo, el cual los redirige a la aplicación. Una vez allí, pueden iniciar sesión de forma segura utilizando su cuenta de Google (SSO) y acceder a un listado de lugares turísticos, restaurantes, miradores y más.

Incluye funcionalidades extra (Bonus) como un **Panel de Administración protegido** para realizar un CRUD completo de lugares y pueblos.

##  PWA (Progressive Web App)
El sistema es instalable en dispositivos móviles y permite:
*   **Acceso Rápido:** Icono en la pantalla de inicio.
*   **Carga Optimizada:** Cacheo de recursos estáticos para mejor rendimiento.
*   **Experiencia Nativa:** Interfaz a pantalla completa (standalone).

##  Stack Utilizado

### Frontend (SPA)
*   **Librería Principal:** React.js optimizado con Vite.
*   **Estilos y UI:** React-Bootstrap y CSS personalizado (Glassmorphism).
*   **Rutas:** React Router DOM.
*   **Autenticación:** Google OAuth 2.0 (SSO) + JWT.
*   **Pruebas Unitarias:** Vitest, Jest y React Testing Library.

### Backend (API REST)
*   **Framework:** Java 17 con Spring Boot.
*   **Seguridad:** Spring Security (Validación de Tokens de Google).
*   **Persistencia:** Spring Data JPA / Hibernate.
*   **Pruebas Unitarias:** JUnit 5 y Mockito.

### Infraestructura y DevOps
*   **Base de Datos:** PostgreSQL.
*   **CI/CD:** Integración y Despliegue Continuo con GitHub Actions.
*   **Despliegue Frontend:** Vercel.
*   **Despliegue Backend:** Render.

---

##  Instrucciones para correr localmente

### Requisitos previos
*   Node.js (v18+)
*   Java Development Kit (JDK 17+)
*   Maven
*   PostgreSQL instalado y corriendo localmente.

### 1. Levantar el Backend (Spring Boot)
1. Abre una terminal y navega a la carpeta del backend: `cd backend`
2. Configura tu base de datos y credenciales de Google en el archivo `src/main/resources/application.properties`.
3. Compila el proyecto: `mvn clean install`
4. Inicia el servidor: `mvn spring-boot:run`
*(El backend quedará corriendo en `http://localhost:8080`)*

### 2. Levantar el Frontend (React)
1. Abre una nueva terminal y navega a la carpeta del frontend: `cd frontend`
2. Instala las dependencias: `npm install`
3. Crea un archivo `.env` en la raíz de la carpeta `frontend` con las siguientes variables:
   * `VITE_GA_MEASUREMENT_ID`: Tu ID de seguimiento de Google Analytics 4.
   * `VITE_API_URL`: (Opcional) URL de tu API backend.
4. Inicia el servidor de desarrollo: `npm run dev`
*(El frontend quedará corriendo en `http://localhost:5173`)*

---

##  URLs Desplegadas (Producción)
La aplicación se encuentra desplegada públicamente y conectada al pipeline CI/CD de GitHub Actions.

*   **Aplicación Web (Vercel):** [https://turismo-webv1.vercel.app](https://turismo-webv1.vercel.app)
*   **API Backend (Render):** [https://turismowebv1.onrender.com](https://turismowebv1.onrender.com)

---

## 📷 Capturas de Pantalla

*(Reemplaza estos espacios con imágenes reales del proyecto antes de presentar)*

**Pantalla de Inicio de Sesión**
![Pantalla de Login](https://via.placeholder.com/800x400.png?text=Captura+de+Pantalla+Login)

**Listado de Lugares Turísticos**
![Lista de Lugares](https://via.placeholder.com/800x400.png?text=Captura+de+Pantalla+Lugares)

**Panel de Administración (Bonus)**
![Panel de Administración](https://via.placeholder.com/800x400.png?text=Captura+Panel+CRUD)

---

##  QR de Prueba
Puedes escanear este código QR directamente desde tu dispositivo móvil para ingresar a un pueblo de prueba en el sistema en producción.

![QR de Acceso a Santa María](https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=https://turismo-webv1.vercel.app/p/santa-maria)

*Este QR codifica la URL directa para ingresar al catálogo turístico tras la validación SSO.*
