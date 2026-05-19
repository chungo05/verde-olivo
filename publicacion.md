# Post de LinkedIn — Verde Olivo

---

Hace unas semanas abrí un editor de código con una idea sencilla: construir una plataforma inmobiliaria desde cero.

Hoy, esa idea tiene nombre: **Verde Olivo** 🏡

---

No fue un tutorial. No fue un boilerplate. Fue construir pieza por pieza algo que resuelve un problema real.

Y esto es lo que quedó:

**✦ Una app full-stack con Next.js 16 + React 19**
Rutas dinámicas, Server Components, streaming… usé lo que el framework tiene de mejor en lugar de pelearlo.

**✦ Internacionalización real: 🇲🇽 🇺🇸 🇰🇷**
Español, inglés y coreano. Con rutas por locale, detección automática del idioma del navegador y traducción hasta en las etiquetas de área (m² ↔ ft²).

**✦ Autenticación + panel de administración seguro**
Supabase Auth con middleware que protege las rutas, doble validación server-side vía RPC, y gestión de roles (admin / agente / usuario). Sin atajos de seguridad.

**✦ Búsqueda con filtros persistidos en la URL**
Precio, habitaciones, tipo de propiedad. Todo sincronizado en los query params para que el usuario pueda compartir su búsqueda exacta.

**✦ Mapas interactivos con Leaflet**
Cada propiedad tiene coordenadas. El mapa vive dentro del formulario de carga y en el detalle de cada listado.

**✦ CRUD de propiedades con Supabase Storage**
Subida de imágenes, estado activo/inactivo (sin borrado permanente), slugs únicos por propiedad, y SEO + Open Graph en cada página.

---

Lo que más me llevó tiempo no fue el código.

Fue aprender a tomar decisiones de arquitectura:
— ¿Dónde va la lógica de negocio? ¿En el servidor o en el cliente?
— ¿Cuándo usar RLS y cuándo delegar a una función con `SECURITY DEFINER`?
— ¿Cómo estructurar las traducciones sin que se conviertan en un caos?

Ese tipo de preguntas no las responde Stack Overflow.

---

**El stack final:**
`Next.js 16` · `React 19` · `TypeScript` · `Tailwind CSS v4` · `Supabase` · `Leaflet` · `Swiper`

Deployed en Vercel. Diseño propio con una paleta verde que le da identidad a la marca.

---

Si estás construyendo algo y tienes dudas sobre arquitectura de apps con Next.js + Supabase, con gusto hablo contigo.

Y si buscas a alguien que lleve proyectos de principio a fin — desde la base de datos hasta el SEO — aquí estoy.

#NextJS #React #Supabase #FullStack #WebDevelopment #RealEstate #TypeScript #OpenToWork
