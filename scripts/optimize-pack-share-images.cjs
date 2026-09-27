/**
 * Genera JPG optimizados para og:image / tarjetas (ruta ASCII, < ~500KB típico).
 * WhatsApp/Facebook suelen fallar o mostrar preview sin foto con URLs muy largas,
 * caracteres no ASCII en la ruta o imágenes de varios MB.
 */
const fs = require('fs')
const path = require('path')
const sharp = require('sharp')

const imgDir = path.join(__dirname, '..', 'public', 'img')

async function writeOptimized(srcName, destName) {
  const src = path.join(imgDir, srcName)
  if (!fs.existsSync(src)) {
    console.warn('omitido (no existe):', srcName)
    return
  }
  const dest = path.join(imgDir, destName)
  await sharp(src)
    .resize({ width: 1200, height: 1200, fit: 'inside', withoutEnlargement: true })
    .jpeg({ quality: 82, mozjpeg: true })
    .toFile(dest)

  const before = fs.statSync(src).size
  const after = fs.statSync(dest).size
  console.log(`${destName}: ${(before / 1024).toFixed(0)} KiB → ${(after / 1024).toFixed(0)} KiB`)
}

async function main() {
  const files = fs.readdirSync(imgDir)
  /** No usar los JPG ya generados como entrada (evita input === output). */
  const skip = new Set(['innovacion.jpg', 'coleccion-algorta.jpg', 'pack-rockstars.jpg'])
  const innov = files.find((f) => !skip.has(f) && /^Innov.*\.jpe?g$/i.test(f))
  const col = files.find(
    (f) =>
      !skip.has(f) &&
      /colecci/i.test(f) &&
      /Algorta/i.test(f) &&
      /\.jpe?g$/i.test(f),
  )
  const rock = files.find((f) => !skip.has(f) && /^rockStars\.jpe?g$/i.test(f))

  if (innov) await writeOptimized(innov, 'innovacion.jpg')
  if (col) await writeOptimized(col, 'coleccion-algorta.jpg')
  /* En Windows no escribir "rockstars.jpg" si existe "rockStars.jpg" (mismo path). */
  if (rock) await writeOptimized(rock, 'pack-rockstars.jpg')
  if (fs.existsSync(path.join(imgDir, 'douro.PNG'))) {
    await writeOptimized('douro.PNG', 'douro.jpg')
  }
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})
