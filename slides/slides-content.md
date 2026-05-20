# Verde Olivo Inmuebles — Presentación del Sistema Web

---

## Diapositiva 1 — Portada

**Título:** Verde Olivo Inmuebles  
**Subtítulo:** Sistema Web Inmobiliario Inteligente  
**Tagline:** Encuentra tu propiedad ideal con recomendaciones personalizadas  
**Empresa:** Verde Olivo Inmuebles — Querétaro, México  

---

## Diapositiva 2 — Problemática

**Título:** El Problema

Los clientes que buscan adquirir o rentar una propiedad enfrentan tres grandes obstáculos:

1. **Búsquedas poco precisas** — Los sistemas tradicionales solo ofrecen filtros básicos que no reflejan las necesidades reales del usuario.
2. **Resultados no personalizados** — No existe un mecanismo que aprenda de las preferencias del cliente con el tiempo.
3. **Frustración y pérdida de tiempo** — La experiencia de búsqueda ineficiente reduce la probabilidad de concretar una operación inmobiliaria.

> **Consecuencia:** Menor conversión de clientes, agentes sobrecargados de consultas repetitivas y posicionamiento digital débil frente a la competencia.

---

## Diapositiva 3 — Propuesta de Solución

**Título:** La Propuesta

Desarrollar un **sistema web inmobiliario inteligente** que combine:

- **Filtros avanzados** — Ubicación, rango de precio, tipo de propiedad, número de habitaciones y tipo de operación (venta/renta).
- **Recomendaciones automáticas** — El sistema analiza el historial de búsquedas y propiedades vistas para sugerir inmuebles relevantes bajo la sección *"Para ti"*.
- **Experiencia de usuario optimizada** — Interfaz moderna, responsive, multilingüe y accesible desde cualquier dispositivo.

**Stack tecnológico:** Next.js 16 · React 19 · TypeScript · Supabase · Tailwind CSS v4

---

## Diapositiva 4 — Función 1: Búsqueda y Descubrimiento

**Título:** Página de Inicio — Búsqueda Inteligente

La puerta de entrada al sistema, diseñada para rapidez y personalización:

- **Barra de búsqueda** por ciudad, vecindario o dirección.
- **Filtros rápidos** por categoría: Casas, Departamentos, Villas, Penthouses.
- **Sección "Para ti"** — propiedades recomendadas basadas en el historial del usuario.
- **Colecciones Destacadas** — propiedades de alta gama seleccionadas por la empresa.
- **Nuevo en Mercado** — las últimas oportunidades con opción de filtrar por venta o renta.

---

## Diapositiva 5 — Función 2: Filtros Avanzados

**Título:** Interfaz de Filtros Avanzados

El motor del algoritmo de recomendación:

| Filtro | Detalle |
|---|---|
| Ubicación | Zona exacta (ej. Corregidora, Querétaro) |
| Rango de precio | Barra deslizante + campos mínimo/máximo |
| Tipo de propiedad | Casa, Departamento, Terreno, Villa |
| Habitaciones y baños | Selección con contador + / − |
| Amenidades | Alberca, Gym, Estacionamiento, Wi-Fi, Patio |
| Operación | Venta o Renta |

- **Contador en tiempo real** de propiedades que coinciden antes de aplicar la búsqueda.
- Las preferencias del usuario se guardan en la sesión para alimentar las recomendaciones.

---

## Diapositiva 6 — Función 3: Vista Detallada de Propiedad

**Título:** Ficha Técnica de Propiedad

Todo lo que el cliente necesita para tomar una decisión:

- **Galería multimedia** — fotos de alta calidad de interiores y exteriores.
- **Ficha técnica** — m², recámaras, baños, cocheras, año de construcción.
- **Mapa interactivo** — ubicación exacta del inmueble con Leaflet.
- **Amenidades** — alberca, gym privado, hogar inteligente, cargadores eléctricos, bodega.
- **Agente asignado** — foto, nombre y botón de contacto directo.
- **Botón "Guardar en favoritos"** — integrado con autenticación Supabase.

---

## Diapositiva 7 — Función 4: Sistema de Favoritos

**Título:** Panel de Favoritos

Gestión completa de propiedades de interés:

- **Lista de guardados** — todas las propiedades marcadas con el corazón, vinculadas a la cuenta del usuario en Supabase.
- **Tarjetas completas** — imagen, precio, ubicación, características principales.
- **Acciones directas** — agendar visita o eliminar de favoritos desde la tarjeta.
- **Descubrimiento continuo** — acceso rápido a buscar más opciones si la lista es corta.
- **Autenticación requerida** — si el usuario no está logueado, se redirige al login con retorno al destino original.

---

## Diapositiva 8 — Función 5: Autenticación y Perfiles

**Título:** Autenticación Segura con Supabase

Acceso moderno sin fricción:

- **Login con Google y GitHub** vía OAuth — sin formularios largos.
- **Sesiones persistentes** gestionadas por Supabase Auth con refresco automático en cada request (middleware).
- **Roles de usuario** — `admin`, `agent`, `user` — controlados en tabla `user_roles` vía RPC seguro (`get_my_role`).
- **Doble protección del panel admin** — middleware + validación server-side en layout.
- **Perfil de usuario** — propiedades guardadas, visitas agendadas, configuración de cuenta.

---

## Diapositiva 9 — Función 6: Internacionalización (i18n)

**Título:** Plataforma Multilingüe

El sistema soporta tres idiomas de forma nativa:

| Idioma | Código |
|---|---|
| Español | `es` |
| Inglés | `en` |
| Coreano | `ko` |

- Detección automática por cookie `NEXT_LOCALE` → `accept-language` → `en` por defecto.
- Traducciones cargadas en el servidor (`getDictionary`) y distribuidas al cliente vía `I18nProvider`.
- Selector de idioma visible en la barra de navegación.
- Todas las rutas son locale-prefixed: `/es/`, `/en/`, `/ko/`.

---

## Diapositiva 10 — Función 7: Panel de Administración

**Título:** Panel Admin — Gestión Completa

Herramientas exclusivas para el equipo Verde Olivo:

- **Dashboard** — métricas rápidas: total de propiedades, activas, ventas pendientes.
- **Gestión de propiedades** — CRUD completo: crear, editar, cambiar estado (activa/pendiente/vendida), eliminar.
- **Formulario de alta** — título, precio, tipo, descripción, ubicación con mapa, detalles técnicos, amenidades y galería de imágenes (Supabase Storage).
- **Directorio de usuarios** — roles, estados (activo/inactivo/ausente), métricas de desempeño.
- **Doble capa de seguridad** — middleware + server-side guard en layout.

---

## Diapositiva 11 — Resultados y Conclusión

**Título:** Impacto del Sistema

**Lo que se logró:**

✓ Búsqueda personalizada con filtros avanzados conectados a Supabase  
✓ Sistema de favoritos con persistencia real por usuario  
✓ Autenticación OAuth sin fricción  
✓ Panel administrativo con gestión completa de propiedades  
✓ Plataforma multilingüe (es / en / ko)  
✓ Interfaz responsive con diseño de lujo alineado a la marca Verde Olivo  

**Verde Olivo Inmuebles** pasa de un portafolio estático a una **plataforma digital inteligente**, reduciendo la frustración del cliente y aumentando la probabilidad de concretar operaciones inmobiliarias en Querétaro y el Bajío.

---
