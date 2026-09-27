const { defineConfig } = require('@vue/cli-service')

const PUBLIC_SITE_FALLBACK = 'https://catalogovinologa.netlify.app'
const LEGACY_PUBLIC_SITE_HOSTS = [
  'catalogo18.netlify.app',
  'catalogofinde.netlify.app',
  'catalogo-vinologa-2026.netlify.app',
  'catalogo_vinologa_2026.netlify.app',
]

function isUnusablePublicHost(host) {
  const h = String(host || '').toLowerCase()
  if (!h) return true
  if (LEGACY_PUBLIC_SITE_HOSTS.includes(h)) return true
  if (h === 'github.com' || h === 'www.github.com') return true
  if (h.endsWith('.github.io')) return true
  if (h.includes('githubusercontent.com')) return true
  if (h.includes('catalogo_vinologa_2026') || h.includes('catalogo-vinologa-2026')) return true
  return false
}

/** Solo origen https de Netlify, sin path del repo de GitHub. */
function publicSiteOrigin() {
  const raw = String(process.env.VUE_APP_PUBLIC_SITE_URL || '').trim()
  if (raw) {
    try {
      const parsed = new URL(raw.includes('://') ? raw : `https://${raw}`)
      if (!isUnusablePublicHost(parsed.hostname)) {
        return `https://${parsed.hostname.toLowerCase()}`
      }
    } catch {
      /* usa fallback */
    }
  }
  return PUBLIC_SITE_FALLBACK
}

const OG_TITLE = 'Catálogo Vinóloga 2026'
const OG_DESCRIPTION =
  'Bienvenido al Mundo de Vinóloga: vinos con cuento, packs y despacho a tu comuna.'

module.exports = defineConfig({
  transpileDependencies: true,
  publicPath: '/',
  pages: {
    index: {
      entry: 'src/main.js',
      title: 'Catálogo Vinóloga 2026',
    },
  },
  devServer: {
    port: 8080,
    host: 'localhost',
    open: true,
    headers: {
      'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
    },
  },
  chainWebpack(config) {
    /* Con `pages`, el plugin de HtmlWebpackPlugin se llama `html-<nombrePagina>` */
    config.plugin('html-index').tap((args) => {
      const origin = publicSiteOrigin()
      const opts = args[0]
      opts.ogPageUrl = origin ? `${origin}/` : ''
      opts.ogImageUrl = origin ? `${origin}/img/${encodeURIComponent('Vinóloga_IA.jpg')}` : ''
      opts.ogImageWidth = 900
      opts.ogImageHeight = 1200
      opts.ogDescription = OG_DESCRIPTION
      opts.ogTitle = OG_TITLE
      return args
    })
  },
})
