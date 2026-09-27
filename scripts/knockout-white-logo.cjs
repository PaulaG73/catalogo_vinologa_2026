/**
 * Hace transparentes los píxeles claros del logo (fondo blanco / gris muy claro).
 * Uso: node scripts/knockout-white-logo.cjs
 */
const path = require('path')
const fs = require('fs')
const sharp = require('sharp')

const input = path.join(__dirname, '../public/img/logo-vinologa.png')

async function main() {
  if (!fs.existsSync(input)) {
    console.error('No existe:', input)
    process.exit(1)
  }

  const image = sharp(input)
  const { data, info } = await image.ensureAlpha().raw().toBuffer({ resolveWithObject: true })
  const { width, height } = info
  const px = Buffer.from(data)
  const channels = 4

  // Píxeles "blancos" o casi blancos → alpha 0 (ajusta umbral si hace falta)
  const minChannel = 232
  const maxDelta = 28

  for (let i = 0; i < px.length; i += channels) {
    const r = px[i]
    const g = px[i + 1]
    const b = px[i + 2]
    const mx = Math.max(r, g, b)
    const mn = Math.min(r, g, b)
    const light = r >= minChannel && g >= minChannel && b >= minChannel
    const lowSat = mx - mn <= maxDelta
    if (light && lowSat) {
      px[i + 3] = 0
    }
  }

  await sharp(px, {
    raw: { width, height, channels },
  })
    .png()
    .toFile(input + '.tmp')

  fs.renameSync(input + '.tmp', input)
  console.log('OK: fondo claro → transparente en', path.basename(input))
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
