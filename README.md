# 🛒 Click Stock

**Click Stock** es una aplicación web de **e-commerce** combinada con un sistema de **control de stock**, pensada para facilitar la gestión y venta de productos desde una sola plataforma.  
El proyecto está desarrollado con tecnologías modernas de frontend y busca ofrecer una experiencia rápida, intuitiva y adaptable a cualquier tipo de negocio.

---

## 🚀 Tecnologías principales

- **React.js** – Framework principal del frontend  
- **Vite** – Entorno de desarrollo ultrarrápido  
- **React Bootstrap** – Componentes visuales y responsive design  
- **Zustand** – Manejo de estado global  
- **Axios** – Comunicación con el backend mediante API REST  
- **React Router DOM** – Navegación entre vistas  
- **JSDoc** – Documentación del código  
- **ESLint / Prettier** – Normalización y formato del código  

---

## ⚙️ Funcionalidades principales

- 🧾 **Catálogo de productos:** Visualización de productos disponibles con buscador y filtros.  
- 🛍️ **Carrito de compras:** Agregar, modificar o eliminar productos del carrito.  
- 👤 **Autenticación:** Registro e inicio de sesión con manejo de tokens JWT.  
- 📦 **Control de stock:** Actualización automática del inventario al realizar ventas.  
- 🧠 **Panel administrativo:** Gestión de usuarios, productos y roles.  
- 💬 **Asistente virtual:** Chat con IA integrado para asistencia al usuario.  

---

## 🧩 Estructura del proyecto

click-stock-frontend/
├── src/
│ ├── assets/ # Recursos estáticos (imágenes, íconos, etc.)
│ ├── components/ # Componentes reutilizables de UI
│ ├── layouts/ # Estructuras base para distintas rutas
│ ├── pages/ # Páginas principales de la app
│ ├── services/ # Comunicación con la API (clientAxios)
│ ├── store/ # Manejo de estado global (Zustand)
│ ├── hooks/ # Hooks personalizados
│ ├── utils/ # Funciones auxiliares
│ └── main.jsx # Punto de entrada del proyecto
├── .env # Variables de entorno
├── package.json
└── README.md

---

## 🧱 Estructura lógica de desarrollo

> La lógica del proyecto sigue una arquitectura separada por responsabilidades:

**Backend → Modelo > Ruta > Controlador > Servicio**  
**Frontend → ClientAxios > Componentes > Páginas > Store (Zustand)**

Esto asegura una separación clara entre la capa de presentación, la lógica de negocio y la comunicación con la API.

---

## 🧾 Convenciones y normalización de código

Para mantener un código limpio y consistente se siguen estas reglas:

- **Documentación con JSDoc** para describir funciones, clases y componentes.  
- **Comentarios innecesarios** o redundantes son eliminados.  
- **Nomenclatura estandarizada:**
  - Archivos y módulos: `usuarios.controller.js`, `productos.service.js`, etc.  
  - Componentes React: `Header.jsx`, `ProductCard.jsx`  
  - Hooks: `useAuth.js`, `useScroll.js`  
  - Variables y funciones en **camelCase**  
  - Constantes en **MAYÚSCULAS_CON_GUIONES**

---

## 🧠 Objetivo del proyecto

Crear una aplicación web moderna que funcione tanto como **tienda online** como **sistema de gestión de stock**, buscando optimizar la administración de productos, reducir errores humanos y mejorar la experiencia del usuario final.

---

## 🧑‍💻 Autor

**Lean [@tuusuario]**  
Desarrollador web apasionado por la tecnología, la IA y el aprendizaje constante.  
Proyecto desarrollado como parte de una práctica formativa de desarrollo fullstack.

---

## 🪄 Próximas mejoras

- 📊 Dashboard con métricas de ventas  
- 💳 Integración con pasarelas de pago (MercadoPago / Stripe)  
- 🧾 Generación de facturas automáticas  
- 🔔 Notificaciones en tiempo real  

---

## 🧰 DEPLOY
https://stock-project-frontend-beta.vercel.app/
