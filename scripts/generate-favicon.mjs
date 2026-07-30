/**
 * Regenerates `app/favicon.ico` and `public/images/emblem-192.png` from the BYM
 * logo. Run after replacing `public/images/logo.jpg`:
 *
 *   node scripts/generate-favicon.mjs
 *
 * Why a script rather than a checked-in binary somebody made once by hand: the
 * logo will be redrawn eventually, and a favicon that silently stays on the old
 * mark is the kind of thing nobody notices for a year.
 *
 * `sharp` is already a Next.js dependency, so this adds nothing to install.
 */
import sharp from "sharp"
import { writeFileSync } from "node:fs"

const SOURCE = "public/images/logo.jpg"

/**
 * The emblem, cropped out of the full lockup.
 *
 * The logo wraps "BEKWAI YOUTH MOVEMENT" in a ring around the mark and carries a
 * "VOLUNTEERING FOR CHANGE" banner across the bottom. Neither is legible below
 * roughly 64px — at 16px they render as grey smear and drag the whole icon down
 * to a smudge. Cropping to the emblem keeps the three brand colours and the
 * figure, which do read at 16px.
 *
 * Measured against the 1050×1050 source. If the logo is redrawn at a different
 * size or composition, re-measure: the crop must clear the banner (which starts
 * around y=730) and the wordmark ring.
 */
const EMBLEM = { left: 285, top: 250, width: 480, height: 480 }

/** 16 for the tab, 32 for high-DPI and bookmarks, 48 for Google Search. */
const SIZES = [16, 32, 48]

const pngs = await Promise.all(
  SIZES.map((size) =>
    sharp(SOURCE)
      .extract(EMBLEM)
      .resize(size, size, { fit: "cover" })
      .png({ compressionLevel: 9 })
      .toBuffer()
  )
)

// ICO container: a 6-byte header, one 16-byte directory entry per image, then
// the image blobs. Every browser still in use accepts PNG blobs inside an ICO,
// which is what lets one small file carry three sizes without a BMP encoder.
const header = Buffer.alloc(6)
header.writeUInt16LE(0, 0) // reserved, always 0
header.writeUInt16LE(1, 2) // 1 = icon (2 would be a cursor)
header.writeUInt16LE(SIZES.length, 4)

const entries = []
let offset = 6 + SIZES.length * 16

SIZES.forEach((size, i) => {
  const e = Buffer.alloc(16)
  e.writeUInt8(size, 0) // width  — 0 would mean 256
  e.writeUInt8(size, 1) // height
  e.writeUInt8(0, 2) // colours in palette (0 = truecolour)
  e.writeUInt8(0, 3) // reserved
  e.writeUInt16LE(1, 4) // colour planes
  e.writeUInt16LE(32, 6) // bits per pixel
  e.writeUInt32LE(pngs[i].length, 8)
  e.writeUInt32LE(offset, 12)
  offset += pngs[i].length
  entries.push(e)
})

const ico = Buffer.concat([header, ...entries, ...pngs])
writeFileSync("app/favicon.ico", ico)

/**
 * Home-screen icons, at the sizes the manifest actually claims.
 *
 * The manifest used to declare 192×192 and 512×512 and point both at the
 * 1050×1050 JPEG. Browsers pick an icon by the declared size and then get
 * something else, which wastes bandwidth on a phone and can leave Android
 * scaling the wrong candidate.
 *
 * The full lockup rather than the emblem here: at 192px and above the wordmark
 * is perfectly legible, and on a home screen beside other apps the name is worth
 * having. PNG rather than JPEG because home-screen icons are composited and
 * JPEG has no alpha channel.
 */
for (const size of [192, 512]) {
  await sharp(SOURCE)
    .resize(size, size, { fit: "contain", background: "#ffffff" })
    .png({ compressionLevel: 9 })
    .toFile(`public/images/logo-${size}.png`)
}

console.log(
  `app/favicon.ico             ${ico.length} bytes (${SIZES.join("/")}px, emblem)\n` +
    `public/images/logo-192.png  192x192 (full logo)\n` +
    `public/images/logo-512.png  512x512 (full logo)`
)
