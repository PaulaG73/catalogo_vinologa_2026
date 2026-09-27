import OG_SLUG_BY_PACK_ID from '../data/ogSlugs.json'

/** Solo dígitos: código de país + número (sin + ni espacios). Ej. Chile: 56912345678 */
export const WHATSAPP_NUMBER_DIGITS = '56996450950'

/**
 * URL pública del sitio (.env.development / .env.production).
 * Referencia literal a `process.env.VUE_APP_PUBLIC_SITE_URL` para que @vue/cli-service la sustituya.
 */
const PUBLIC_SITE_FROM_ENV = process.env.VUE_APP_PUBLIC_SITE_URL || ''

/**
 * URL pública de Netlify (sin path). El repo de GitHub se llama catalogo_vinologa_2026;
 * ese nombre no es el sitio. Si se usa como path o como subdomain, WhatsApp abre 404 y no hay foto.
 */
const WHATSAPP_FALLBACK_SITE_ORIGIN = 'https://catalogovinologa.netlify.app'
const LEGACY_PUBLIC_SITE_HOSTS = [
  'catalogo18.netlify.app',
  'catalogofinde.netlify.app',
  'catalogo-vinologa-2026.netlify.app',
  'catalogo_vinologa_2026.netlify.app',
]

function publicSiteUrlFromEnv() {
  return PUBLIC_SITE_FROM_ENV
}

function digitsOnly() {
  return WHATSAPP_NUMBER_DIGITS.replace(/\D/g, '')
}

function isUnusablePublicHost(host) {
  const h = String(host || '').toLowerCase()
  if (!h) return true
  if (LEGACY_PUBLIC_SITE_HOSTS.includes(h)) return true
  if (h === 'localhost' || h === '127.0.0.1') return true
  if (h === 'github.com' || h === 'www.github.com') return true
  if (h.endsWith('.github.io')) return true
  if (h.includes('githubusercontent.com')) return true
  if (h.includes('catalogo_vinologa_2026') || h.includes('catalogo-vinologa-2026')) return true
  return false
}

/** Solo origen https, sin path del repo ni barra final. */
function normalizeHttpsRoot(url) {
  const raw = String(url || '').trim()
  if (!raw) return ''
  try {
    const parsed = new URL(raw.includes('://') ? raw : `https://${raw}`)
    if (isUnusablePublicHost(parsed.hostname)) return ''
    return `https://${parsed.hostname.toLowerCase()}`
  } catch {
    return ''
  }
}

/**
 * Enlaces de WhatsApp: siempre el sitio Netlify vivo.
 * No usar window.location (GitHub Pages / preview) ni paths tipo /catalogo_vinologa_2026.
 */
function getShareBaseOrigin() {
  const fromEnv = normalizeHttpsRoot(publicSiteUrlFromEnv())
  if (fromEnv) return fromEnv
  return WHATSAPP_FALLBACK_SITE_ORIGIN
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
