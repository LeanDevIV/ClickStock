# Guía de Integración - Categorías en el Frontend

## Resumen
Esta guía te muestra cómo usar el nuevo sistema de categorías en tu aplicación frontend.

## Componentes creados

### 1. `useCategoriesStore.js` (Hook de Zustand)
Un store centralizado para manejar el estado de las categorías usando **axios**.

**Ubicación**: `src/hooks/useCategoriesStore.js`

**Utiliza**: `clientAxios` desde `src/utils/clientAxios.js` para todas las peticiones HTTP

**Funciones disponibles:**
- `fetchCategorias()` - Obtiene todas las categorías
- `fetchCategoriaPorId(id)` - Obtiene una categoría específica
- `crearCategoria(datos)` - Crea una nueva categoría
- `actualizarCategoria(id, datos)` - Actualiza una categoría
- `eliminarCategoria(id)` - Elimina una categoría
- `desactivarCategoria(id)` - Desactiva una categoría
- `clearError()` - Limpia los errores

**Estado disponible:**
- `categorias` - Array de categorías
- `loading` - Boolean indicando si está cargando
- `error` - Mensaje de error si ocurre alguno

### 2. `CategoriesList.jsx` (Componente)
Componente que muestra todas las categorías en un grid.

**Ubicación**: `src/components/CategoriesList.jsx`

**Props:**
- `onSelectCategory` - Función que se ejecuta cuando se hace click en una categoría

**Ejemplo:**
```jsx
<CategoriesList onSelectCategory={(categoryId) => {
  console.log("Categoría seleccionada:", categoryId);
}} />
```

### 3. `CategoriesList.css` (Estilos)
Estilos para el componente de categorías.

---

## Cómo usar

### Paso 1: Importar el hook en tu componente
```jsx
import { useCategoriesStore } from "../hooks/useCategoriesStore";
```

El hook ya está configurado con `clientAxios`, así que automáticamente tendrá acceso al token de autenticación.

### Paso 2: Usar el hook para obtener categorías
```jsx
const { categorias, loading, error, fetchCategorias } = useCategoriesStore();

useEffect(() => {
  fetchCategorias();
}, [fetchCategorias]);
```

### Paso 3: Mostrar las categorías
```jsx
{categorias.map((categoria) => (
  <div key={categoria._id}>
    <h3>{categoria.nombre}</h3>
    <p>{categoria.descripcion}</p>
  </div>
))}
```

---

## Ejemplos de uso

### Ejemplo 1: Mostrar categorías simples
```jsx
import { useCategoriesStore } from "../hooks/useCategoriesStore";
import { useEffect } from "react";

export const MiComponente = () => {
  const { categorias, fetchCategorias } = useCategoriesStore();

  useEffect(() => {
    fetchCategorias();
  }, []);

  return (
    <ul>
      {categorias.map((cat) => (
        <li key={cat._id}>{cat.nombre}</li>
      ))}
    </ul>
  );
};
```

### Ejemplo 2: Filtrar productos por categoría
```jsx
import { useState, useEffect } from "react";
import { useCategoriesStore } from "../hooks/useCategoriesStore";
import clientAxios from "../utils/clientAxios";

export const ProductosPorCategoria = () => {
  const { categorias, fetchCategorias } = useCategoriesStore();
  const [selectedId, setSelectedId] = useState(null);
  const [productos, setProductos] = useState([]);

  useEffect(() => {
    fetchCategorias();
  }, []);

  useEffect(() => {
    if (selectedId) {
      clientAxios.get(`/productos/categoria/${selectedId}`)
        .then(res => setProductos(res.data))
        .catch(err => console.error(err));
    }
  }, [selectedId]);

  return (
    <div>
      <div>
        {categorias.map((cat) => (
          <button
            key={cat._id}
            onClick={() => setSelectedId(cat._id)}
            style={{ fontWeight: selectedId === cat._id ? "bold" : "normal" }}
          >
            {cat.nombre}
          </button>
        ))}
      </div>
      
      <div>
        {productos.map((prod) => (
          <div key={prod._id}>
            <h3>{prod.nombre}</h3>
            <p>{prod.precio}</p>
          </div>
        ))}
      </div>
    </div>
  );
};
```

### Ejemplo 3: Crear una categoría (Admin)
```jsx
import { useCategoriesStore } from "../hooks/useCategoriesStore";
import { useState } from "react";

export const AdminCategorias = () => {
  const { crearCategoria, error } = useCategoriesStore();
  const [nombre, setNombre] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [imagen, setImagen] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await crearCategoria({ nombre, descripcion, imagen });
      // Limpiar formulario
      setNombre("");
      setDescripcion("");
      setImagen("");
      alert("Categoría creada exitosamente");
    } catch (err) {
      alert("Error: " + error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder="Nombre"
        value={nombre}
        onChange={(e) => setNombre(e.target.value)}
        required
      />
      <textarea
        placeholder="Descripción"
        value={descripcion}
        onChange={(e) => setDescripcion(e.target.value)}
      />
      <input
        type="text"
        placeholder="URL de imagen"
        value={imagen}
        onChange={(e) => setImagen(e.target.value)}
      />
      <button type="submit">Crear Categoría</button>
    </form>
  );
};
```

### Ejemplo 4: Usar el componente CategoriesList
```jsx
import CategoriesList from "../components/CategoriesList";
import { useState } from "react";

export const MiPagina = () => {
  const [selectedCategory, setSelectedCategory] = useState(null);

  return (
    <div>
      <CategoriesList onSelectCategory={setSelectedCategory} />
      {selectedCategory && (
        <p>Has seleccionado la categoría: {selectedCategory}</p>
      )}
    </div>
  );
};
```

---

## Notas importantes

### Variables de entorno
Asegúrate de tener configurada tu URL de API en `.env`:
```env
VITE_API_URL=http://localhost:3000/api
```

**Nota**: El `clientAxios` utiliza esta URL como base y además agrega automáticamente:
- El token de autenticación en el header `Authorization`
- Manejo automático de errores 401 (Unauthorized)

### Manejo de errores
El hook devuelve un `error` que puedes mostrar al usuario:
```jsx
const { error, clearError } = useCategoriesStore();

if (error) {
  return <div className="error">{error}</div>;
}
```

### Performance
El hook de Zustand maneja el caché automáticamente. Los datos se mantienen en el store hasta que lo decidas limpiar.

---

## Integración con rutas existentes

Si deseas agregar el componente de categorías a tu página principal:

```jsx
// En Home.jsx
import CategoriesList from "../components/CategoriesList";
import ProductosRender from "../components/ProductosRender";
import { useState } from "react";

export const Home = () => {
  const [filtroCategoria, setFiltroCategoria] = useState(null);

  return (
    <div>
      <CategoriesList onSelectCategory={setFiltroCategoria} />
      {filtroCategoria && (
        <ProductosRender categoriaId={filtroCategoria} />
      )}
    </div>
  );
};
```

---

## Troubleshooting

### Las categorías no cargan
1. Verifica que el servidor backend esté ejecutándose
2. Comprueba que la URL de la API es correcta
3. Abre la consola de desarrollador (F12) para ver los errores

### Los productos no se filtran
1. Asegúrate de que los productos tienen asignada una categoría en la BD
2. Verifica el ID de la categoría que estás usando
3. Comprueba que el endpoint `/productos/categoria/:id` funciona en Postman

### El componente no se actualiza
1. Asegúrate de incluir `fetchCategorias` en las dependencias del useEffect
2. Comprueba que estás usando el hook correctamente
3. Revisa que los datos se están obteniendo correctamente en Network tab

---

## Próximos pasos

1. ✅ Crear categorías de ejemplo usando `npm run seed:categorias`
2. ✅ Mostrar categorías en tu página
3. ✅ Filtrar productos por categoría
4. ✅ (Opcional) Crear UI admin para gestionar categorías
5. ✅ (Opcional) Agregar filtros avanzados (búsqueda, ordenamiento, etc.)
