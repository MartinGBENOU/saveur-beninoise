import { mkdir, stat } from 'node:fs/promises'
import path from 'node:path'
import sharp from 'sharp'

const root = process.cwd()
const imagesDir = path.join(root, 'public', 'images')

const targets = [
  { input: 'hero.png', output: 'hero.webp', width: 1600 },
  { input: 'poulet-braise-unsplash.jpg', output: 'poulet-braise.webp', width: 1200 },
  { input: 'amiwo.png', output: 'amiwo.webp', width: 1200 },
  { input: 'alloco-unsplash.jpg', output: 'alloco.webp', width: 1200 },
  { input: 'sauce-arachide.png', output: 'sauce-arachide.webp', width: 1200 },
  { input: 'brochettes.png', output: 'brochettes.webp', width: 1200 },
  { input: 'poisson-braise-unsplash.jpg', output: 'poisson-braise.webp', width: 1200 },
]

async function size(file) {
  const info = await stat(file)
  return `${(info.size / 1024).toFixed(0)} Ko`
}

await mkdir(imagesDir, { recursive: true })

let before = 0
let after = 0

for (const target of targets) {
  const input = path.join(imagesDir, target.input)
  const output = path.join(imagesDir, target.output)

  const inputInfo = await stat(input)
  before += inputInfo.size

  await sharp(input)
    .rotate()
    .resize({ width: target.width, withoutEnlargement: true })
    .webp({ quality: 78, effort: 5, smartSubsample: true })
    .toFile(output)

  const outputInfo = await stat(output)
  after += outputInfo.size

  console.log(
    `${target.input.padEnd(28)} ${(inputInfo.size / 1024).toFixed(0).padStart(5)} Ko -> ${target.output.padEnd(24)} ${(outputInfo.size / 1024).toFixed(0).padStart(4)} Ko`,
  )
}

console.log(`\nTotal: ${(before / 1024 / 1024).toFixed(2)} Mo -> ${(after / 1024 / 1024).toFixed(2)} Mo`)

// Image de partage WhatsApp / réseaux sociaux (1200 x 630)
const hero = path.join(imagesDir, 'hero.png')
const ogOutput = path.join(root, 'public', 'og-image.jpg')

const overlay = `
<svg width="1200" height="630" viewBox="0 0 1200 630" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="shade" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0%" stop-color="#16120f" stop-opacity="0.96"/>
      <stop offset="55%" stop-color="#16120f" stop-opacity="0.82"/>
      <stop offset="100%" stop-color="#16120f" stop-opacity="0.35"/>
    </linearGradient>
    <linearGradient id="bottom" x1="0" y1="0" x2="0" y2="1">
      <stop offset="55%" stop-color="#16120f" stop-opacity="0"/>
      <stop offset="100%" stop-color="#16120f" stop-opacity="0.85"/>
    </linearGradient>
  </defs>
  <rect width="1200" height="630" fill="url(#shade)"/>
  <rect width="1200" height="630" fill="url(#bottom)"/>
  <rect x="80" y="96" width="64" height="6" rx="3" fill="#e8892b"/>
  <text x="80" y="160" font-family="Segoe UI, Arial, sans-serif" font-size="26" font-weight="600" letter-spacing="6" fill="#e8892b">COTONOU · BÉNIN</text>
  <text x="78" y="268" font-family="Georgia, serif" font-size="76" font-weight="700" fill="#faf6ee">Saveur Béninoise</text>
  <text x="80" y="348" font-family="Georgia, serif" font-size="46" font-style="italic" fill="#faf6ee">Le Goût du Bénin, Livré Chaud</text>
  <text x="80" y="432" font-family="Segoe UI, Arial, sans-serif" font-size="26" fill="#cfc6b8">Poulet braisé · Amiwo · Alloco · Brochettes</text>
  <g transform="translate(80, 500)">
    <rect width="300" height="64" rx="32" fill="#25d366"/>
    <text x="34" y="41" font-family="Segoe UI, Arial, sans-serif" font-size="25" font-weight="700" fill="#08240f">Commander sur WhatsApp</text>
  </g>
  <text x="1120" y="560" text-anchor="end" font-family="Segoe UI, Arial, sans-serif" font-size="24" fill="#cfc6b8">saveur-beninoise.vercel.app</text>
</svg>`

await sharp(hero)
  .rotate()
  .resize({ width: 1200, height: 630, fit: 'cover', position: 'centre' })
  .composite([{ input: Buffer.from(overlay), top: 0, left: 0 }])
  .jpeg({ quality: 82, progressive: true, mozjpeg: true })
  .toFile(ogOutput)

console.log(`\nImage de partage : public/og-image.jpg (${await size(ogOutput)})`)
