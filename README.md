# 🛒 ClickStock - Frontend

> Aplicación web moderna de e-commerce con sistema de gestión de stock integrado. Interfaz de usuario premium construida con React y Material-UI.

---

## 🚀 Tecnologías Principales

### Core

- **React 19** - Framework principal con las últimas características
- **Vite 7** - Build tool ultrarrápido y HMR instantáneo
- **React Router DOM 7** - Navegación y enrutamiento SPA

### UI/UX

- **Material-UI (MUI) 7** - Sistema de diseño y componentes
- **Emotion** - CSS-in-JS para estilos dinámicos
- **React Icons** - Biblioteca de iconos
- **AOS** - Animaciones on-scroll
- **GSAP** - Animaciones avanzadas y efectos visuales

### Gestión de Estado

- **Zustand** - State management global ligero
- **React Hook Form** - Manejo de formularios optimizado
- **Zod** - Validación de esquemas y tipos

### Integraciones

- **Firebase** - Autenticación social (Google, GitHub)
- **MercadoPago SDK** - Pasarela de pagos
- **Axios** - Cliente HTTP para API REST
- **SweetAlert2** - Modales y alertas elegantes
- **React Hot Toast** - Notificaciones toast

### 3D y Efectos Visuales

- **Three.js** - Renderizado 3D
- **React Three Fiber** - React renderer para Three.js
- **Postprocessing** - Efectos visuales avanzados

---

## ⚙️ Características Principales

### 🛍️ E-commerce

- **Catálogo de productos** con búsqueda y filtros avanzados
- **Carrito de compras** persistente con gestión de cantidades
- **Sistema de favoritos** para usuarios autenticados
- **Detalles de producto** con galería de imágenes y reseñas
- **Checkout integrado** con MercadoPago

### 👤 Autenticación y Usuarios

- **Login/Registro** tradicional con JWT
- **Autenticación social** (Google, GitHub) vía Firebase
- **Perfil de usuario** editable
- **Historial de pedidos** personal
- **Gestión de favoritos** y preferencias

### 📦 Sistema de Gestión

- **Panel administrativo** completo
- **CRUD de productos** con carga de imágenes
- **Gestión de pedidos** con estados
- **Sistema de promociones** configurable
- **Gestión de reseñas** de productos

### 🎨 Experiencia Visual

- **Tema claro/oscuro** con persistencia
- **Efectos 3D opcionales** (LiquidEther background)
- **Pantalla de bienvenida** animada
- **Banner promocional** dinámico
- **Chatbot flotante** de asistencia
- **Modo mantenimiento** con countdown

---

## 📁 Estructura del Proyecto

```
stock-project-frontend/
│
├── src/
│   ├── components/          # Componentes reutilizables
│   │   ├── admin/          # Componentes del panel admin
│   │   ├── auth/           # Autenticación y perfil
│   │   ├── cart/           # Carrito de compras
│   │   ├── common/         # Componentes genéricos
│   │   ├── forms/          # Formularios especializados
│   │   ├── home/           # Componentes de la home
│   │   ├── layouts/        # Layouts compartidos
│   │   ├── pedidos/        # Gestión de pedidos
│   │   ├── products/       # Productos y catálogo
│   │   └── reviews/        # Sistema de reseñas
│   │
│   ├── pages/              # Páginas principales
│   │   ├── admin/          # Páginas administrativas
│   │   ├── checkout/       # Proceso de compra
│   │   ├── home/           # Página principal
│   │   ├── legal/          # Páginas legales
│   │   ├── shop/           # Tienda y búsqueda
│   │   └── user/           # Perfil y pedidos
│   │
│   ├── hooks/              # Custom hooks
│   │   ├── useCart.js              # Gestión del carrito
│   │   ├── useFavoritos.js         # Sistema de favoritos
│   │   ├── useStore.js             # Store de autenticación
│   │   ├── useCategoriesStore.js   # Categorías
│   │   ├── usePromocionStore.js    # Promociones
│   │   ├── useProductosFiltrados.js # Filtrado de productos
│   │   ├── useMercadoPago.js       # Integración MP
│   │   ├── useTableData.js         # Tablas admin
│   │   ├── useCompartir.js         # Compartir productos
│   │   └── useScrollDirection.js   # Detección de scroll
│   │
│   ├── services/           # Servicios API
│   │   ├── LoginService.js
│   │   ├── RegistroService.js
│   │   ├── carritoService.js
│   │   ├── favoritosService.js
│   │   ├── reviewService.js
│   │   ├── uploadService.js
│   │   └── usuarioService.js
│   │
│   ├── config/             # Configuraciones
│   │   ├── adminConfig.js  # Config del panel admin
│   │   └── firebase.js     # Config de Firebase
│   │
│   ├── schemas/            # Esquemas de validación Zod
│   ├── layouts/            # Layouts principales
│   ├── routes/             # Configuración de rutas
│   ├── styles/             # Estilos y temas
│   ├── utils/              # Utilidades y helpers
│   └── assets/             # Recursos estáticos
│
├── public/                 # Archivos públicos
├── .env                    # Variables de entorno
├── .env.example            # Ejemplo de variables
├── vite.config.js          # Configuración de Vite
└── package.json

```

---

## 🛠️ Instalación y Configuración

### Prerrequisitos

- Node.js 18+
- npm o yarn
- Backend de ClickStock corriendo

### Pasos de instalación

1. **Clonar el repositorio**

```bash
git clone <url-del-repo>
cd stock-project-frontend
```

2. **Instalar dependencias**

```bash
npm install
```

3. **Configurar variables de entorno**

Crear archivo `.env` en la raíz del proyecto:

```env
# API Backend
VITE_API_URL=http://localhost:5000/api

# Firebase Authentication
VITE_FIREBASE_API_KEY=tu_api_key
VITE_FIREBASE_AUTH_DOMAIN=tu_auth_domain
VITE_FIREBASE_PROJECT_ID=tu_project_id
VITE_FIREBASE_STORAGE_BUCKET=tu_storage_bucket
VITE_FIREBASE_MESSAGING_SENDER_ID=tu_sender_id
VITE_FIREBASE_APP_ID=tu_app_id

# MercadoPago (opcional, se puede configurar desde el backend)
VITE_MP_PUBLIC_KEY=tu_public_key
```

4. **Ejecutar en desarrollo**

```bash
npm run dev
```

La aplicación estará disponible en `http://localhost:5173`

5. **Build para producción**

```bash
npm run build
```

Los archivos optimizados se generarán en la carpeta `dist/`

---

## 🧩 Arquitectura y Patrones

### Flujo de Datos

```
Usuario → Componente → Hook/Service → API Backend → Base de Datos
                ↓
            Zustand Store (Estado Global)
```

### Gestión de Estado

- **Zustand** para estado global (auth, cart, favoritos, categorías, promociones)
- **React Hook Form** para estado de formularios
- **Local Storage** para persistencia (tema, carrito, acceso)

### Validación

- **Zod schemas** en frontend y backend
- **React Hook Form + zodResolver** para validación de formularios
- Validación en tiempo real con feedback visual

### Comunicación con API

- **Axios** con interceptores para tokens JWT
- **Services** organizados por dominio
- Manejo centralizado de errores

---

## 🎨 Sistema de Diseño

### Temas

- **Modo claro/oscuro** con Material-UI theming
- **Paleta de colores** personalizada
- **Tipografía**: Orbitron (headings) + Exo 2 (body)

### Componentes Genéricos

- `GenericTable` - Tablas reutilizables con acciones
- `GenericCard` - Cards adaptables
- `GenericRow` - Filas de tabla configurables

### Efectos Visuales

- Animaciones con AOS y GSAP
- Background 3D opcional (LiquidEther)
- Transiciones suaves entre vistas

---

## 🔐 Autenticación

### Métodos Soportados

1. **Email/Password** - Registro y login tradicional
2. **Google** - OAuth via Firebase
3. **GitHub** - OAuth via Firebase

### Flujo de Autenticación

1. Usuario inicia sesión
2. Backend valida credenciales
3. Se genera JWT token
4. Token se almacena en localStorage
5. Axios interceptor añade token a requests
6. Zustand store mantiene estado del usuario

---

## 📦 Scripts Disponibles

```bash
npm run dev      # Servidor de desarrollo
npm run build    # Build de producción
npm run preview  # Preview del build
npm run lint     # Ejecutar ESLint
```

---

## 🌐 Rutas Principales

### Públicas

- `/` - Página principal
- `/producto/detalle/:id` - Detalle de producto
- `/buscar` - Resultados de búsqueda
- `/nosotros` - Sobre nosotros
- `/contacto` - Contacto

### Autenticadas

- `/carrito` - Carrito de compras
- `/favoritos` - Productos favoritos
- `/mis-pedidos` - Historial de pedidos

### Administrativas

- `/admin` - Dashboard principal
- `/admin/dashboard` - Gestión de entidades
- `/admin/pedidos` - Gestión de pedidos
- `/admin/promociones` - Gestión de promociones

---

## 🧪 Validaciones

### Productos

- Nombre: 3-100 caracteres
- Descripción: 10-500 caracteres
- Precio: > 0
- Stock: ≥ 0

### Promociones

- Nombre: 3-100 caracteres
- Descuento: 1-99%
- Fechas válidas

### Reseñas

- Calificación: 1-5 estrellas
- Comentario: 10-500 caracteres

---

## 🚀 Deploy

### Vercel (Recomendado)

1. Conectar repositorio en Vercel
2. Configurar variables de entorno
3. Deploy automático en cada push

**URL de producción**: https://stock-project-frontend-beta.vercel.app/

---

## 🔧 Configuración Adicional

### Modo Mantenimiento

En `App.jsx`, modificar:

```javascript
const MAINTENANCE_MODE = true; // false para desactivar
```

### Background 3D

El usuario puede activar/desactivar desde el header (modo oscuro requerido)

### Banner Promocional

Editable desde el componente `BannerPromocional.jsx`

---

## 📝 Convenciones de Código

### Nomenclatura

- **Componentes**: PascalCase (`ProductCard.jsx`)
- **Hooks**: camelCase con prefijo `use` (`useCart.js`)
- **Services**: camelCase con sufijo `Service` (`carritoService.js`)
- **Constantes**: UPPER_SNAKE_CASE
- **Variables/Funciones**: camelCase

### Estructura de Componentes

```javascript
// Imports
import { useState } from "react";

// Component
export default function MiComponente() {
  // Hooks
  // Estado
  // Efectos
  // Handlers
  // Render
}
```

---

## 🤝 Contribución

Este proyecto sigue las mejores prácticas de desarrollo:

- ✅ ESLint configurado
- ✅ Validación con Zod
- ✅ Componentes reutilizables
- ✅ Hooks personalizados
- ✅ Separación de responsabilidades

---

## 👨‍💻 Autores

**Leandro Córdoba**  
**Sara Robles**  

Desarrolladores Full Stack apasionados por crear experiencias web modernas y funcionales.

---

## 📄 Licencia

Este proyecto es parte de un portafolio educativo.

---

## 🔗 Links

- **Frontend**: https://stock-project-frontend-beta.vercel.app/
- **Backend**: https://click-stock-server.vercel.app/
