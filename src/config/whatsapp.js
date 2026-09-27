import OG_SLUG_BY_PACK_ID from '../data/ogSlugs.json'

/** Solo dígitos: código de país + número (sin + ni espacios). Ej. Chile: 56912345678 */
export const WHATSAPP_NUMBER_DIGITS = '56996450950'

/**
 * URL pública del sitio (.env.development / .env.production).
 * Referencia literal a `process.env.VUE_APP_PUBLIC_SITE_URL` para que @vue/cli-service la sustituya.
 */
const PUBLIC_SITE_FROM_ENV = process.env.VUE_APP_PUBLIC_SITE_URL || ''

/**
 * Si el .env no llega al bundle en dev, el enlace a la foto no puede quedar vacío.
 * Cambia esto si despliegas en otro dominio (o define siempre VUE_APP_PUBLIC_SITE_URL).
 */
const WHATSAPP_FALLBACK_SITE_ORIGIN = 'https://catalogo-vinologa-2026.netlify.app'
/** Hostnames viejos: al renombrar el sitio en Netlify dejan de existir y WhatsApp abre “Site not found”. */
const LEGACY_PUBLIC_SITE_HOSTS = ['catalogo18.netlify.app', 'catalogofinde.netlify.app']

function publicSiteUrlFromEnv() {
  return PUBLIC_SITE_FROM_ENV
}

function digitsOnly() {
  return WHATSAPP_NUMBER_DIGITS.replace(/\D/g, '')
}

function normalizeHttpsRoot(url) {
  const u = String(url || '')
    .trim()
    .replace(/\/+$/, '')
  if (!u) return ''
  return u.replace(/^http:\/\//i, 'https://')
}

function rewriteLegacyPublicOrigin(origin) {
  const o = normalizeHttpsRoot(origin)
  if (!o) return ''
  try {
    const host = new URL(o).hostname.toLowerCase()
    if (LEGACY_PUBLIC_SITE_HOSTS.includes(host)) return WHATSAPP_FALLBACK_SITE_ORIGIN
  } catch {
    return o
  }
  return o
}

/**
 * Origen público para enlaces en WhatsApp: env, luego fallback fijo, luego origin (no localhost).
 */
function getShareBaseOrigin() {
  let origin = rewriteLegacyPublicOrigin(publicSiteUrlFromEnv())
  if (!origin) origin = normalizeHttpsRoot(WHATSAPP_FALLBACK_SITE_ORIGIN)
  if (origin) return origin

  if (typeof window !== 'undefined' && window.location?.origin) {
    const o = window.location.origin.replace(/\/+$/, '')
    if (/^https?:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/i.test(o)) return ''
    return rewriteLegacyPublicOrigin(o)
  }

  return ''
}

const OG_PAGE_SUFFIX = '.html'
const OG_CATALOGO_PAGE = `og-catalogo${OG_PAGE_SUFFIX}`

/**
 * Nombre de archivo en `public/`: `og-{slug}.html` (Netlify/Linux distinguen mayúsculas; si no coincide, cae el SPA y WhatsApp muestra el og:image del index).
 */
function packOgPagePath(slug) {
  const id = typeof slug === 'string' ? slug.trim() : ''
  if (!id) return ''
  return `og-${id.toLowerCase()}${OG_PAGE_SUFFIX}`
}

function ogSlugFromPackId(packId) {
  const id = typeof packId === 'string' ? packId.trim().toLowerCase() : ''
  if (!id) return ''
  return OG_SLUG_BY_PACK_ID[id] || ''
}

function catalogPreviewUrlForWhatsApp() {
  const base = getShareBaseOrigin()
  if (!base) return ''
  return `${base}/${OG_CATALOGO_PAGE}`
}

function whatsAppSendUrl(text) {
  const digits = digitsOnly()
  if (!digits) return '#'
  return `https://api.whatsapp.com/send?phone=${digits}&text=${encodeURIComponent(text)}`
}

/**
 * URL para vista previa en WhatsApp: HTML con og:image (no el .jpg directo).
 */
function resolvePackPreviewUrlForWhatsApp(packId, imagePath) {
  const base = getShareBaseOrigin()
  if (!base) return resolvePackImageUrlForWhatsApp(imagePath)
  const slug = ogSlugFromPackId(packId)
  if (slug) {
    const page = packOgPagePath(slug)
    return `${base}/${page}`
  }
  return resolvePackImageUrlForWhatsApp(imagePath)
}

/**
 * URL absoluta de un asset en `public/` para compartir por WhatsApp (solo HTTPS y dominio público).
 */
function resolvePackImageUrlForWhatsApp(assetPath) {
  if (!assetPath || typeof assetPath !== 'string') return ''
  const trimmed = assetPath.trim()
  if (!trimmed) return ''
  if (/^https?:\/\//i.test(trimmed)) return normalizeHttpsRoot(trimmed)

  const path = trimmed.startsWith('/') ? trimmed : `/${trimmed}`
  const base = getShareBaseOrigin()
  if (!base) return ''
  return `${base}${path}`
}

/** Precio sin símbolo $ (en WhatsApp el $ puede truncar el resto del mensaje prefijado). */
function priceForWhatsAppMessage(price) {
  if (!price || typeof price !== 'string') return ''
  return price.trim().replace(/\$/g, '').replace(/\s+/g, ' ').trim()
}

/**
 * URL absoluta HTTPS de un asset en `public/` (p. ej. `/img/pack.jpg`).
 * En el navegador usa `location.origin`; sin `window` usa env.
 */
export function resolvePublicAssetUrl(assetPath) {
  if (!assetPath || typeof assetPath !== 'string') return ''
  const trimmed = assetPath.trim()
  if (!trimmed) return ''
  if (/^https?:\/\//i.test(trimmed)) return normalizeHttpsRoot(trimmed)

  const path = trimmed.startsWith('/') ? trimmed : `/${trimmed}`

  if (typeof window !== 'undefined' && window.location?.origin) {
    return `${window.location.origin}${path}`
  }

  const site = normalizeHttpsRoot(PUBLIC_SITE_FROM_ENV)
  if (site) return `${site}${path}`

  return path
}

export function getWhatsAppUrl() {
  const digits = digitsOnly()
  if (!digits) return '#'
  return `https://wa.me/${digits}`
}

/**
 * WhatsApp desde el pie: un solo texto (api.whatsapp.com evita rarezas con wa.me + borradores viejos).
 */
export function getWhatsAppFooterUrl() {
  const digits = digitsOnly()
  if (!digits) return '#'
  const previewUrl = catalogPreviewUrlForWhatsApp()
  const parts = ['Hola Vinóloga, quiero hacer un pedido de vinos...']
  if (previewUrl && /^https:\/\//i.test(previewUrl)) {
    parts.push('', previewUrl)
  }
  return whatsAppSendUrl(parts.join('\n').trimEnd())
}

/**
 * WhatsApp desde «Habla conmigo» (Sobre mí): saludo + vista previa del catálogo (foto Sobre mí).
 */
export function getWhatsAppHablaConmigoUrl() {
  const digits = digitsOnly()
  if (!digits) return '#'
  const previewUrl = catalogPreviewUrlForWhatsApp()
  const parts = ['Hola Vinóloga, te hablo desde tu catálogo...']
  if (previewUrl && /^https:\/\//i.test(previewUrl)) {
    parts.push('', previewUrl)
  }
  return whatsAppSendUrl(parts.join('\n').trimEnd())
}

/**
 * Enlace api.whatsapp.com: saludo + datos del pack + vista previa + precio.
 * @param {{ title?: string, valle?: string, price?: string, ofertaEtiqueta?: string, image?: string, packId?: string }} pack
 */
export function getWhatsAppPackUrl(pack) {
  const digits = digitsOnly()
  if (!digits) return '#'

  const packId = typeof pack?.packId === 'string' ? pack.packId.trim() : ''
  const title = typeof pack?.title === 'string' ? pack.title.trim() : ''
  const valle = typeof pack?.valle === 'string' ? pack.valle.trim() : ''
  const price = typeof pack?.price === 'string' ? pack.price.trim() : ''
  const ofertaEtiqueta =
    typeof pack?.ofertaEtiqueta === 'string' ? pack.ofertaEtiqueta.trim() : ''
  const previewUrl = resolvePackPreviewUrlForWhatsApp(packId, pack?.image || '')

  const titleHasNumero = /^N[°º\u00B0\u00BA]\s*\d+/i.test(title)
  const parts = [
    packId && /^\d+$/.test(packId) && !titleHasNumero
      ? `Hola Vinóloga, quiero el pack N°${packId}`
      : 'Hola Vinóloga, quiero este pack',
  ]
  if (title) parts.push(title)
  if (valle) parts.push(valle)
  parts.push('')

  if (previewUrl && /^https:\/\//i.test(previewUrl)) {
    parts.push(previewUrl)
    parts.push('')
  }

  const priceTxt = priceForWhatsAppMessage(price)
  if (priceTxt) {
    if (ofertaEtiqueta) {
      parts.push(`${ofertaEtiqueta} (CLP): ${priceTxt}`)
    } else {
      parts.push(`Precio (CLP): ${priceTxt}`)
    }
  }

  return whatsAppSendUrl(parts.join('\n').trimEnd())
}

export function isWhatsAppConfigured() {
  return digitsOnly().length > 0
}
