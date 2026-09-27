# Checklist: copiar este proyecto como base de un nuevo catálogo

Historial **limpio**: en la copia **no** llevas la carpeta `.git`; el nuevo repositorio empieza desde cero.

---

## 1. Dónde quedará la copia (importante)

La copia **no** se crea en un sitio fijo: **tú eliges la carpeta** poniendo la variable `DESTINO` en los comandos del siguiente apartado.

- **Después de copiar**, todo el proyecto nuevo está **exactamente** en la ruta que asignaste a `DESTINO`.
- Ejemplo: si pones  
  `DESTINO="/c/Users/paula/OneDrive/Desktop/Bootcamp_Frontend_2025/MÓDULO_7/catalogo_navidad"`  
  entonces abre ese directorio en el explorador o en el editor: **ahí está la copia**.
- Para comprobarlo en bash:

```bash
ls -la "$DESTINO"
cd "$DESTINO" && pwd
```

No debe existir `.git` dentro de `DESTINO` justo después del paso 2 (salvo que ya hubiera un repo ahí; mejor usar una carpeta **nueva y vacía**).

---

## 2. Copiar con Bash (Git Bash / WSL / macOS / Linux)

Define **origen** (esta carpeta `catalogo_vinos`) y **destino** (carpeta nueva). En **Git Bash** las rutas de Windows suelen ir como `/c/Users/...`.

### Opción A — `tar` (suele venir en Git Bash; no requiere `rsync`)

```bash
# Edita solo estas dos líneas:
ORIGEN="/c/Users/paula/OneDrive/Desktop/Bootcamp_Frontend_2025/MÓDULO_7/catalogo_vinos"
DESTINO="/c/Users/paula/OneDrive/Desktop/Bootcamp_Frontend_2025/MÓDULO_7/catalogo_NUEVO_NOMBRE"

mkdir -p "$DESTINO"
( cd "$ORIGEN" && tar --exclude='.git' --exclude='node_modules' --exclude='dist' --exclude='.cursor' -cf - . ) | ( cd "$DESTINO" && tar -xf - )
```

### Opción B — `rsync` (si lo tienes instalado)

```bash
ORIGEN="/c/Users/paula/OneDrive/Desktop/Bootcamp_Frontend_2025/MÓDULO_7/catalogo_vinos"
DESTINO="/c/Users/paula/OneDrive/Desktop/Bootcamp_Frontend_2025/MÓDULO_7/catalogo_NUEVO_NOMBRE"

mkdir -p "$DESTINO"
rsync -a --exclude='.git' --exclude='node_modules' --exclude='dist' --exclude='.cursor' "$ORIGEN"/ "$DESTINO"/
```

### Opción C — Rutas relativas (si ya estás en la carpeta padre de `catalogo_vinos`)

```bash
cd "/c/Users/paula/OneDrive/Desktop/Bootcamp_Frontend_2025/MÓDULO_7"
ORIGEN="$(pwd)/catalogo_vinos"
DESTINO="$(pwd)/catalogo_navidad"   # nombre de la carpeta nueva

mkdir -p "$DESTINO"
( cd "$ORIGEN" && tar --exclude='.git' --exclude='node_modules' --exclude='dist' --exclude='.cursor' -cf - . ) | ( cd "$DESTINO" && tar -xf - )
```

Comprueba que dentro de **`$DESTINO`** **no** aparezca la carpeta `.git`:

```bash
test ! -d "$DESTINO/.git" && echo "OK: sin historial git heredado"
```

Copia manual alternativa: duplicar la carpeta del proyecto y borrar en la copia `.git`, `node_modules`, `dist` y opcionalmente `.cursor`.

---

## 3. Instalar dependencias en la copia

```bash
cd "$DESTINO"    # misma variable que arriba: aquí está tu copia
npm install
```

Prueba: `npm run serve` y `npm run build`.

---

## 4. Personalizar el nuevo catálogo (evitar mezclar con el proyecto viejo)

Marca cada ítem cuando lo revises:

| Ítem | Archivo / acción |
|------|------------------|
| [ ] | `package.json` → campo `"name"` (ej. `catalogo_navidad`) |
| [ ] | `README.md` → título, enlaces GitHub y demo Netlify |
| [ ] | `.env.production` → vaciar o poner **`VUE_APP_PUBLIC_SITE_URL`** con la **URL nueva** cuando exista el sitio (no dejes la del catálogo Semana Santa si ya no aplica) |
| [ ] | `.env.example` → actualizar comentarios si cambias el dominio |
| [ ] | `vue.config.js` → `pages.index.title` (título de la pestaña / marca) |
| [ ] | `public/index.html` → textos de `meta name="description"` y, si quieres, bloque `og:*` / `twitter:*` (título y descripción) |
| [ ] | `vue.config.js` → URL en `ogImageUrl` si la imagen social **no** es `Vinóloga_IA.jpg` |
| [ ] | `src/data/catalogoPack.json` → packs y precios nuevos |
| [ ] | `public/img/` → fotos nuevas; alinear nombres con el JSON |
| [ ] | `src/views/HomeView.vue` → textos “Sobre mí”, `sobreMiFotoSrc`, secciones |
| [ ] | `src/components/NavBar.vue` / `FooterComponent.vue` → marca, enlaces, WhatsApp |

---

## 5. Repositorio nuevo en GitHub

1. En GitHub: **New repository** (vacío, sin README si ya lo tienes en la copia).
2. En la carpeta de la copia (`cd "$DESTINO"`):

```bash
git init
git add .
git commit -m "Initial commit from catalogo_vinos base"
git branch -M main
git remote add origin https://github.com/TU_USUARIO/NOMBRE_REPO_NUEVO.git
git push -u origin main
```

**No** añadas el remoto del repo `catalogo_vinos` antiguo.

---

## 6. Netlify (sitio nuevo, sin conflicto con el actual)

1. **Add new site** → Import from Git → el **nuevo** repositorio.
2. Build: `npm run build` · Publish directory: `dist`
3. **Environment variables** (opcional si no usas `.env.production` en el repo):  
   `VUE_APP_PUBLIC_SITE_URL` = `https://tu-sitio-nuevo.netlify.app` (sin `/` final)
4. Tras el primer deploy, actualiza `.env.production` con esa URL y vuelve a desplegar si quieres Open Graph correcto desde el build.

Cada catálogo = **un repo** + **un sitio Netlify** (otra URL). El sitio `catalogovinos.netlify.app` sigue ligado solo al repo viejo.

---

## 7. Limpieza opcional en la copia

- [ ] Elimina este archivo `CHECKLIST_NUEVO_CATALOGO.md` del **nuevo** repo si no quieres publicarlo.
- [ ] Añade `CLAUDE.md`, `.claude/` u otros archivos de ayuda solo si los necesitas.

---

*Generado como guía para bifurcar el proyecto con historial git nuevo.*
