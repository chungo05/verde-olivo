# Verde Olivo - Plataforma Inmobiliaria

Plataforma inmobiliaria moderna, optimizada para SEO y alto rendimiento, construida con Next.js y React. Diseñada para ofrecer una experiencia de usuario (UX) fluida y premium al buscar y visualizar propiedades.

## 🚀 Características Principales

Siguiendo las mejores prácticas de la industria para aplicaciones *Real Estate*, este proyecto incluye:

- **Rendimiento & SEO**: Arquitectura optimizada con SSG/SSR, imágenes de alta eficiencia (`next/image`) y metadatos dinámicos.
- **Mapas Interactivos**: Integración de mapas diferidos usando Leaflet (`react-leaflet`) para ubicar propiedades sin bloquear el renderizado inicial.
- **Galerías Inmersivas**: Visualización de propiedades mediante carruseles táctiles y adaptables a dispositivos móviles (Swiper.js).
- **Diseño Premium UI/UX**: Interfaz moderna, limpia y completamente responsiva construida con Tailwind CSS.
- **Arquitectura de Estado**: Filtros de búsqueda gestionados a través de la URL para facilitar la retención de estado y compartición de enlaces.

## 💻 Stack Tecnológico

- **Core**: [Next.js](https://nextjs.org/) (App Router) + [React](https://react.dev/)
- **Estilos**: [Tailwind CSS v4](https://tailwindcss.com/)
- **Mapas**: [Leaflet](https://leafletjs.com/) & [React-Leaflet](https://react-leaflet.js.org/)
- **Slider/Carrusel**: [Swiper](https://swiperjs.com/)
- **Lenguaje**: TypeScript

## 📂 Estructura del Proyecto

```text
verde-olivo/
├── app/               # Next.js App Router (Páginas, Layouts, Rutas)
├── components/        # Componentes UI reutilizables y modulares
├── lib/               # Utilidades, configuración y tipos compartidos
├── public/            # Archivos estáticos (imágenes de propiedades, íconos)
├── antigravity/       # Documentación interna y convenciones de equipo
└── ...                # Configuraciones raíz (Tailwind, ESLint, TS)
```

## 🛠️ Desarrollo Local

1. Instalar las dependencias del proyecto:

```bash
pnpm install
# o yarn install / npm install
```

2. Configurar las variables de entorno (clonar plantilla):

```bash
cp .env.template .env.local
```

3. Iniciar el servidor de desarrollo:

```bash
npm run dev
```

Abre [http://localhost:3000](http://localhost:3000) en tu navegador para ver la aplicación corriendo en local.

## 🚢 Despliegue

El proyecto está preparado para ser desplegado fácilmente en plataformas como [Vercel](https://vercel.com/new). Para más información, revisa la [guía de despliegue de Next.js](https://nextjs.org/docs/app/building-your-application/deploying).
