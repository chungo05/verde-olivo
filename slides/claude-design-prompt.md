# Prompt para Claude Design — Diapositivas Verde Olivo

Copia y pega este prompt completo en Claude para generar las diapositivas con diseño visual.

---

## PROMPT

Crea una presentación de diapositivas profesional en HTML para una empresa inmobiliaria de lujo llamada **Verde Olivo Inmuebles**, con sede en Querétaro, México.

### Paleta de colores oficial (obligatorio usar estos colores exactos)

- `#19322F` — Nordic Dark (textos principales, encabezados, fondos oscuros)
- `#006655` — Mosque (botones CTA, acentos, íconos activos, líneas decorativas)
- `#D9ECC8` — Hint Green (fondos de tarjetas destacadas, badges, chips)
- `#EEF6F6` — Background Light (fondo general de diapositivas claras)
- Blanco `#FFFFFF` — textos sobre fondos oscuros, tarjetas

### Tipografía
- Fuente: **Inter** (Google Fonts)
- Encabezados: 700 weight, tracking tight
- Cuerpo: 400–500 weight

### Estilo visual general
- Estético de **bienes raíces de lujo moderno**: limpio, minimalista, con toques verdes elegantes.
- Cada diapositiva tiene un número de slide discreto en la esquina inferior derecha.
- La diapositiva de portada tiene fondo `#19322F` con el logo en texto blanco.
- Las diapositivas de contenido alternan entre fondo `#EEF6F6` y fondo blanco.
- Usa íconos SVG inline o Unicode cuando sea necesario (casas, filtros, corazón, usuario, bandera).
- Elementos decorativos sutiles: línea verde `#006655` de 3px a la izquierda de los títulos de sección, o puntos verdes como viñetas.
- Las tablas y listas deben estar dentro de tarjetas con `border-radius: 12px` y sombra suave.

### Estructura de las diapositivas

Crea las siguientes **11 diapositivas** en una sola página HTML, navegables con botones Anterior / Siguiente. Cada diapositiva ocupa el 100% del viewport (estilo presentación fullscreen).

---

**Diapositiva 1 — Portada**  
Fondo: `#19322F`  
- Logo: texto "Verde**Olivo**" grande en blanco con la "O" en `#D9ECC8`
- Subtítulo: "Sistema Web Inmobiliario Inteligente"
- Tagline en gris claro: "Encuentra tu propiedad ideal con recomendaciones personalizadas"
- Línea decorativa horizontal en `#006655`
- Esquina inferior: "Querétaro, México · 2025"

---

**Diapositiva 2 — Problemática**  
Fondo: `#EEF6F6`  
Título con línea verde: "El Problema"  
Tres tarjetas horizontales con ícono + texto corto:
1. 🔍 "Búsquedas poco precisas" — filtros básicos que no reflejan necesidades reales
2. 📊 "Sin personalización" — sin mecanismo que aprenda preferencias del cliente
3. ⏱️ "Frustración y tiempo perdido" — menor probabilidad de concretar operaciones

Cita destacada en recuadro con borde izquierdo `#006655`:  
*"Menor conversión de clientes, agentes sobrecargados y posicionamiento digital débil."*

---

**Diapositiva 3 — Propuesta**  
Fondo: blanco  
Título: "La Solución"  
Tres pilares en tarjetas con fondo `#D9ECC8`:
1. **Filtros Avanzados** — ubicación, precio, tipo, habitaciones, operación
2. **Recomendaciones Automáticas** — sección "Para ti" basada en historial
3. **Experiencia Optimizada** — interfaz moderna, responsive, multilingüe

Stack tecnológico en chips pequeños al pie: `Next.js 16` · `React 19` · `TypeScript` · `Supabase` · `Tailwind CSS v4`

---

**Diapositiva 4 — Función: Búsqueda y Descubrimiento**  
Fondo: `#EEF6F6`  
Título: "Página de Inicio — Búsqueda Inteligente"  
Lista con íconos a la izquierda (usar emoji o SVG):
- 🔍 Barra de búsqueda por ciudad o dirección
- ⚡ Filtros rápidos por categoría (Casas, Deptos, Villas)
- ⭐ Sección "Para ti" — recomendaciones personalizadas
- 🏆 Colecciones Destacadas — propiedades de alta gama
- 🆕 Nuevo en Mercado — últimas oportunidades

Mock UI simplificado a la derecha (div con bordes redondeados que simule la barra de búsqueda y 2 tarjetas de propiedad pequeñas).

---

**Diapositiva 5 — Función: Filtros Avanzados**  
Fondo: blanco  
Título: "Filtros Avanzados"  
Tabla de dos columnas (Filtro | Detalle) con fondo alternado en filas:

| Filtro | Detalle |
|---|---|
| 📍 Ubicación | Zona exacta (ej. Corregidora, Qro) |
| 💰 Rango de precio | Barra deslizante + campos min/max |
| 🏠 Tipo de propiedad | Casa, Departamento, Terreno, Villa |
| 🛏️ Habitaciones y baños | Contador + / − |
| ✨ Amenidades | Alberca, Gym, Estacionamiento, Wi-Fi |
| 🔄 Operación | Venta o Renta |

Nota al pie: "Las preferencias se guardan en sesión para alimentar las recomendaciones automáticas."

---

**Diapositiva 6 — Función: Vista Detallada**  
Fondo: `#EEF6F6`  
Título: "Ficha Técnica de Propiedad"  
Dos columnas:
- Izquierda: lista de características (galería, ficha técnica, mapa interactivo, amenidades, agente, favoritos)
- Derecha: mockup simplificado de una tarjeta de propiedad con precio, badges "NUEVO" y "VENTA" en colores `#006655` y `#D9ECC8`

---

**Diapositiva 7 — Función: Favoritos**  
Fondo: blanco  
Título: "Sistema de Favoritos"  
Ícono de corazón grande en `#006655` como elemento visual central  
Características en 2 columnas de 2 ítems cada una:
- ❤️ Lista de guardados con persistencia en Supabase
- 🃏 Tarjetas completas con acciones directas
- 🔒 Autenticación requerida con redirección inteligente
- 🔍 Acceso rápido a explorar más opciones

---

**Diapositiva 8 — Función: Autenticación**  
Fondo: `#19322F`  
Título en blanco: "Autenticación Segura"  
Cuatro tarjetas pequeñas con fondo semitransparente blanco:
- 🔑 OAuth con Google y GitHub
- 🔄 Sesiones persistentes con refresco automático
- 👥 Roles: admin · agent · user
- 🛡️ Doble protección en panel admin (middleware + server-side)

---

**Diapositiva 9 — Función: Internacionalización**  
Fondo: `#EEF6F6`  
Título: "Plataforma Multilingüe"  
Tres tarjetas grandes centradas con banderas (emoji):
- 🇲🇽 **Español** — `es` — idioma principal
- 🇺🇸 **Inglés** — `en` — mercado internacional
- 🇰🇷 **Coreano** — `ko` — comunidad asiática

Descripción breve: "Detección automática por cookie → Accept-Language → Inglés por defecto. Todas las rutas son locale-prefixed."

---

**Diapositiva 10 — Función: Panel Admin**  
Fondo: blanco  
Título: "Panel de Administración"  
Cinco puntos en lista con números circulares en `#006655`:
1. Dashboard con métricas (total propiedades, activas, ventas pendientes)
2. CRUD completo de propiedades con galería en Supabase Storage
3. Formulario de alta con mapa interactivo y amenidades
4. Directorio de usuarios con roles y métricas de desempeño
5. Doble capa de seguridad (middleware + guard server-side)

---

**Diapositiva 11 — Resultados y Conclusión**  
Fondo: `#19322F`  
Título en blanco: "Impacto del Sistema"  
Grid de 3×2 con checkmarks en `#D9ECC8`:

✓ Búsqueda con filtros avanzados conectados a Supabase  
✓ Favoritos con persistencia real por usuario  
✓ Autenticación OAuth sin fricción  
✓ Panel administrativo completo  
✓ Plataforma multilingüe (es / en / ko)  
✓ Interfaz responsive de lujo alineada a la marca  

Párrafo de cierre en blanco pequeño:  
*"Verde Olivo Inmuebles pasa de un portafolio estático a una plataforma digital inteligente, reduciendo la frustración del cliente y aumentando la probabilidad de concretar operaciones en Querétaro y el Bajío."*

Logo + "2025" al pie centrado.

---

### Requisitos técnicos del HTML

- Un solo archivo `.html` auto-contenido
- JavaScript vanilla para la navegación entre slides (no frameworks)
- CSS inline o en `<style>` dentro del `<head>`
- Animación de transición suave entre slides (fade o slide lateral)
- Responsive: funciona en pantallas de 1280px+
- Barra de progreso en la parte superior que indica el slide actual
- Teclas de teclado: flecha izquierda/derecha para navegar
- Botones "← Anterior" y "Siguiente →" en la parte inferior centrados
- Indicadores de puntos (dots) en la parte inferior

No uses librerías externas excepto Google Fonts para Inter.
