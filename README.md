# 🧾 ClickStock – Control de Stock

## 🛒 Descripción del proyecto
**ClickStock** es una aplicación web desarrollada con **React** que permite gestionar y visualizar el stock de productos de un negocio de manera sencilla, rápida y moderna.  
El sistema está pensado para que **administradores** y **usuarios** interactúen con una base de datos central, manteniendo siempre actualizada la información de los productos.

Este frontend se conecta con un backend hecho en **Node.js + Express + MongoDB**, y juntos forman el proyecto final del curso de desarrollo web de Rolling Code School.

---------------------------------

## 🚀 Características principales

- 🏠 **Página principal** con listado de productos.
- 🔍 **Filtro por categorías** para facilitar la búsqueda.
- 🔐 **Sistema de registro e inicio de sesión** (autenticación con JWT).
- ⚙️ **Panel de administrador** con CRUD completo de productos.
- 👥 **Gestión de usuarios** (solo rol admin).
- ⚡ **Conexión con API REST** mediante Axios.
- 📱 **Diseño completamente responsive** (adaptado a todos los dispositivos).
- ❌ **Página de error 404** personalizada.

---------------------------------

## 🧩 Tecnologías utilizadas

### 🖥️ Frontend
- [React](https://react.dev/)
- [Vite](https://vitejs.dev/)
- [React Router DOM](https://reactrouter.com/)
- [Axios](https://axios-http.com/)
- [Bootstrap](https://getbootstrap.com/)  
- HTML5 / CSS3 / JavaScript (ES6+)

---------------------------------

## 🗂️ Estructura del proyecto

clickstock-frontend/
│
├── src/
│ ├── assets/ # Recursos estáticos (imágenes, íconos)
│ ├── components/ # Componentes reutilizables
│ ├── pages/ # Vistas principales (Home, Login, Admin, etc.)
│ ├── routes/ # Archivo de rutas de navegación
│ ├── services/ # Configuración de Axios y conexión al backend
│ ├── App.jsx # Estructura principal de la app
│ └── main.jsx # Punto de entrada
│
├── public/
│ └── index.html
│
├── package.json
└── README.md

---------------------------------

## 🔧 Instalación y uso

### 1️⃣ Clonar el repositorio

git clone https://github.com/tuusuario/clickstock-frontend.git

2️⃣ Instalar dependencias
npm install

3️⃣ Ejecutar en entorno de desarrollo
npm run dev

La aplicación estará disponible en:
👉 http://localhost:5173/

🔗 Conexión con el backend

El proyecto se conecta a una API desarrollada en Node.js + Express + MongoDB.
Para que funcione correctamente, asegurate de tener el backend ejecutándose y configurar la URL base en Axios.

Ejemplo:
// src/services/api.js
import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:3000/api"
});

export default api;
------------------------------
👥 Roles de usuario
Rol	Permisos
Usuario común	Puede visualizar productos y filtrar por categorías.
Administrador	Puede crear, editar y eliminar productos. También gestionar usuarios.
------------------------------
📄 Documentación adicional

🎨 Mockup del sitio (Figma/Canva)

⚙️ Documentación técnica (PDF) – arquitectura, modelos, rutas

🧱 Repositorio Backend: https://github.com/LeanDevIV/ClickStock-server.git
------------------------------
💬 Créditos

Proyecto desarrollado por el equipo de Rolling Code School – Tucumán, Argentina
Como parte del módulo final del curso de Desarrollo Web Full Stack.

💡 ClickStock: tu inventario, a un click de distancia.
 ------------------------------
