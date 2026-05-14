# Checklist de Mejores Prácticas: App Inmobiliaria (Next.js)

## 1. Rendimiento & SEO
* [ ] **SSG para Detalles:** Usa Static Site Generation (App Router) en páginas de propiedades individuales.
* [ ] **SSR para Búsquedas:** Usa Server-Side Rendering para resultados filtrados en tiempo real.
* [ ] **Optimización de Imágenes:** Obligatorio el uso de `next/image`. Aplica `priority` solo a la foto Hero.
* [ ] **Metadatos Dinámicos:** Genera `title`, `description` y tarjetas OG dinámicas para cada propiedad.
* [ ] **Sitemap Automatizado:** Crea un `sitemap.xml` dinámico que se actualice al subir/bajar inventario.

## 2. Arquitectura & Estado
* [ ] **Filtros en la URL:** Mantén el estado de las búsquedas en la URL (`?precioMax=X`), no en contextos globales.
* [ ] **On-Demand Caching:** Usa `revalidatePath` o `revalidateTag` cuando un asesor modifique una propiedad.
* [ ] **Navegación Eficiente:** Prefiere paginación tradicional o "Cargar Más" en lugar de scroll infinito puro.

## 3. UI / UX
* [ ] **Mapas Diferidos:** Carga Mapbox o Google Maps con `next/dynamic` (`ssr: false`) para no frenar la página.
* [ ] **Galerías Táctiles:** Carruseles de fotos 100% *swipeables* en móvil (ej. Swiper.js).
* [ ] **Formularios Ágiles:** Envío de leads (contactos) usando *Server Actions* de Next.js.
* [ ] **Skeletons de Carga:** Muestra estructuras fantasma (*skeletons*) mientras cargan los resultados.

## 4. Funcionalidades Clave (Features)
* [ ] **Sistema de Favoritos:** En `localStorage` para invitados y en base de datos para registrados.
* [ ] **Calculadora Hipotecaria:** Integrada directamente en la vista de la propiedad.
* [ ] **Comparador:** Herramienta para visualizar diferencias entre 2 o 3 propiedades lado a lado.
* [ ] **Exportación PDF:** Generación de fichas técnicas descargables con un clic.
* [ ] **Soporte Multimedia:** Integración fluida de videos y recorridos 3D (Matterport).

## 5. Seguridad & Administración
* [ ] **Rutas Protegidas:** Uso estricto de `middleware.ts` para bloquear el panel de asesores.
* [ ] **Procesamiento de Archivos:** Comprimir imágenes en el backend (Edge Functions/S3) antes de almacenar.
* [ ] **Rate Limiting:** Protección contra bots en los formularios de contacto y búsquedas.
