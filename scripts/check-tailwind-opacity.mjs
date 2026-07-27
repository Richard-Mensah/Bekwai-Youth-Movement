/**
 * Fails the build on Tailwind opacity modifiers that generate nothing.
 *
 * Tailwind's opacity scale runs in steps of five, so `border-canopy/8` is not
 * a class — it produces no CSS and the border simply does not render. Nothing
 * warns you: it is valid JSX, it passes typecheck and lint, and the element
 * looks subtly wrong forever. 24 of these had accumulated before this check
 * existed. Anything outside the scale must be written as an arbitrary value,
 * e.g. `border-canopy/[0.08]`.
 */
import { readdirSync, readFileSync, statSync } from "node:fs"
import { join, relative } from "node:path"

const ROOTS = ["app", "components", "lib"]
const EXTS = [".tsx", ".ts", ".css"]
const UTILITIES = "bg|text|border|ring|divide|from|to|via|fill|stroke|shadow|outline|accent|placeholder|caret|decoration"

// Captures the opacity step only when it is a bare number (arbitrary values in
// square brackets are exactly what we are telling people to use instead).
const PATTERN = new RegExp(
  String.raw`\b(?:${UTILITIES})-[a-z]+(?:-\d{2,3})?/(\d{1,3})\b`,
  "g"
)

const VALID = new Set([0, 100, ...Array.from({ length: 19 }, (_, i) => (i + 1) * 5)])

function* walk(dir) {
  for (const entry of readdirSync(dir)) {
    const path = join(dir, entry)
    if (statSync(path).isDirectory()) yield* walk(path)
    else if (EXTS.some((e) => path.endsWith(e))) yield path
  }
}

const problems = []
for (const root of ROOTS) {
  for (const file of walk(root)) {
    const lines = readFileSync(file, "utf8").split(/\r?\n/)
    lines.forEach((line, i) => {
      for (const match of line.matchAll(PATTERN)) {
        const step = Number(match[1])
        if (!VALID.has(step)) {
          problems.push({
            file: relative(process.cwd(), file).replace(/\\/g, "/"),
            line: i + 1,
            token: match[0],
            step,
          })
        }
      }
    })
  }
}

if (problems.length === 0) {
  console.log("✔ No off-scale Tailwind opacity modifiers")
  process.exit(0)
}

console.error(
  `\n✖ ${problems.length} Tailwind opacity modifier(s) outside the default scale.` +
    `\n  These generate no CSS at all. Use an arbitrary value instead.\n`
)
for (const p of problems) {
  const fixed = p.token.replace(
    `/${p.step}`,
    `/[${(p.step / 100).toFixed(2)}]`
  )
  console.error(`  ${p.file}:${p.line}\n    ${p.token}  →  ${fixed}`)
}
console.error("")
process.exit(1)
