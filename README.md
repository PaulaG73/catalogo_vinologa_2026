# Catálogo Vinóloga 2026 (`catalogo_vinologa_2026`)



SPA en Vue 3 con packs de vino: presentación de marca, carrusel y pedido por WhatsApp.

- **Proyecto npm:** `catalogo_vinologa_2026`
- **Demo (producción):** [catalogo-vinologa-2026.netlify.app](https://catalogo-vinologa-2026.netlify.app)

---



## Descripción



Sitio de una sola vista principal con navegación por anclas (Packs, Contacto), diseño responsive y estética alineada a la identidad Vinóloga (paleta y tipografía Nunito en todo el sitio).



---



## Tecnologías utilizadas



| Tecnología | Uso |

|---|---|

| [Vue 3](https://vuejs.org/) | Framework (`<script setup>`) |

| [Vue Router 4](https://router.vuejs.org/) | Enrutamiento SPA |

| [Vuex 4](https://vuex.vuejs.org/) | Estado global (plantilla del proyecto) |

| [Bootstrap 5](https://getbootstrap.com/) | Layout y componentes UI |

| [Google Fonts — Nunito](https://fonts.google.com/specimen/Nunito) | Tipografía general (cuerpo y títulos) |

| [Netlify](https://www.netlify.com/) | Build y hosting del sitio estático desde GitHub |



---



## Características



- Sección **Sobre mí / El mundo de Vinóloga** con imagen y texto

- **Carrusel horizontal** de packs (auto-scroll, pausa con hover/teclado/táctil, flechas); implementación propia con scroll horizontal (sin usar la clase `.carousel-item` de Bootstrap, que ocultaría las tarjetas con `display: none`)

- Tarjetas alimentadas desde `src/data/catalogoPack.json`

- **Footer** con WhatsApp y copyright

- **Open Graph / Twitter Cards** en `public/index.html` (inyectadas en build): título, descripción e imagen al compartir el enlace en **WhatsApp** y otras redes (requiere URL pública en variable de entorno, ver más abajo)

- Archivo **`public/_redirects`** (`/* /index.html 200`) para que el historial del router de Vue funcione al refrescar en Netlify



---



## Estructura relevante



```

.

├── .env.example              # Documenta VUE_APP_PUBLIC_SITE_URL

├── .env.production           # URL del sitio en producción (Open Graph); opcional en repo / o definir en Netlify

├── vue.config.js             # título HTML, devServer, meta og:url y og:image vía html-webpack-plugin

├── src/

│   ├── components/

│   │   ├── NavBar.vue

│   │   ├── FooterComponent.vue

│   │   └── CardComponent.vue

│   ├── data/

│   │   └── catalogoPack.json

│   ├── views/

│   │   └── HomeView.vue

│   ├── router/

│   │   └── index.js

│   ├── store/

│   │   └── index.js

│   ├── styles/

│   │   └── theme_vino_tinto.css

│   ├── App.vue

│   └── main.js

└── public/

    ├── index.html            # plantilla con meta description y bloque condicional og:* / twitter:*

    ├── _redirects

    └── img/                  # imágenes servidas tal cual; packs + foto “Sobre mí” (p. ej. Vinóloga_IA.jpg)

```



---



## Instalación y uso



### Requisitos previos

- Node.js >= 14

- npm >= 6



### Instalación



```bash

npm install

```



### Servidor de desarrollo



```bash

npm run serve

```



Abre [http://localhost:8080] en tu navegador.



### Build para producción



```bash

npm run build

```



Salida en la carpeta `dist/`, lista para Netlify u otro hosting estático.



### Variables de entorno (vista previa al compartir el enlace)



Para que el `index.html` generado incluya `og:url`, `og:image` y las meta de Twitter (útil en **WhatsApp**), define la URL pública del sitio **sin barra final**:



| Archivo / lugar | Variable | Ejemplo |

|---|---|---|

| `.env.production` en la raíz (cargado al ejecutar `npm run build`) | `VUE_APP_PUBLIC_SITE_URL` | `https://catalogo-vinologa-2026.netlify.app` |

| Panel de Netlify → Environment variables | Misma variable | Mismo valor |



La imagen social del enlace apunta a `{URL}/img/Vin%C3%B3loga_IA.jpg`; el archivo debe existir en `public/img/` y publicarse en el deploy.



Si la variable no está definida en el momento del build, el sitio sigue funcionando, pero sin esas meta sociales.



### Lint



```bash

npm run lint

```



En el proyecto, ESLint declara como globales los macros de Vue 3 en `<script setup>` (`defineProps`, etc.) vía `package.json`.



---



## Autor

Paula Gajardo Schmidlin — Estudiante de Front End

📧 paulagajardosch@gmail.com

🐙 PaulaG73



---



*Desarrollado por Paula Gajardo Schmidlin, con Vue CLI · 2026*

