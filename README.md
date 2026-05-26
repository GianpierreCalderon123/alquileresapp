# Sistema de Control de Propiedades

Versión simple separada en 3 archivos:

- `index.html`: estructura HTML
- `assets/css/styles.css`: estilos
- `assets/js/app.js`: lógica JavaScript

## Usar localmente

Abre `index.html` directamente en el navegador o usa una extensión como Live Server.

## Subir a GitHub + Vercel

1. Sube esta carpeta a un repositorio de GitHub.
2. En Vercel crea un New Project e importa el repositorio.
3. Como es HTML estático, no necesitas build command.
4. Output directory: deja vacío o usa la raíz del proyecto.

## Nota

El API está definido en `assets/js/app.js`:

```js
const API_BASE = "https://alquileresapi.duckdns.org/api";
```

Si cambias tu backend, actualiza esa línea.
