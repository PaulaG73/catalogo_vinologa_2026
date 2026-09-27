const { defineConfig } = require('@vue/cli-service')

const PUBLIC_SITE_FALLBACK = 'https://catalogo-vinologa-2026.netlify.app'
const LEGACY_PUBLIC_SITE_HOSTS = ['catalogo18.netlify.app', 'catalogofinde.netlify.app']

/** Sin barra final; para Open Graph / WhatsApp (VUE_APP_PUBLIC_SITE_URL en .env.production) */
function publicSiteOrigin() {
  let origin = (process.env.VUE_APP_PUBLIC_SITE_URL || '').replace(/\/+$/, '')
  origin = origin.replace(/^http:\/\//i, 'https://')
  if (origin) {
    try {
      const host = new URL(origin).hostname.toLowerCase()
      if (LEGACY_PUBLIC_SITE_HOSTS.includes(host)) origin = PUBLIC_SITE_FALLBACK
    } catch {
      origin = PUBLIC_SITE_FALLBACK
    }
  }
  return origin || PUBLIC_SITE_FALLBACK
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
