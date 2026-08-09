import { readFileSync, writeFileSync } from 'node:fs'
import { globSync } from 'node:fs'
import { fileURLToPath } from 'node:url'

const ROOT = fileURLToPath(new URL('../', import.meta.url))

const files = Array.from(
  new Set([
    ...globSync(`${ROOT}src/**/*.ts`),
    ...globSync(`${ROOT}src/**/*.tsx`),
  ]),
)

const VOWEL_MAP = {
  'अ': 'a', 'आ': 'aa', 'इ': 'i', 'ई': 'ee', 'उ': 'u', 'ऊ': 'oo', 'ऋ': 'ri', 'ए': 'e', 'ऐ': 'ai', 'ओ': 'o', 'औ': 'au', 'ऑ': 'o', 'ऍ': 'e',
}
const CONSONANT_MAP = {
  'क': 'k', 'ख': 'kh', 'ग': 'g', 'घ': 'gh', 'ङ': 'ng', 'च': 'ch', 'छ': 'chh', 'ज': 'j', 'झ': 'jh', 'ञ': 'ny',
  'ट': 't', 'ठ': 'th', 'ड': 'd', 'ढ': 'dh', 'ण': 'n', 'त': 't', 'थ': 'th', 'द': 'd', 'ध': 'dh', 'न': 'n',
  'प': 'p', 'फ': 'f', 'ब': 'b', 'भ': 'bh', 'म': 'm', 'य': 'y', 'र': 'r', 'ल': 'l', 'व': 'v', 'श': 'sh',
  'ष': 'sh', 'स': 's', 'ह': 'h', 'ळ': 'l', 'क़': 'q', 'ख़': 'kh', 'ग़': 'g', 'ज़': 'z', 'ड़': 'd', 'ढ़': 'dh', 'फ़': 'f', 'य़': 'y',
}
const MATRA_MAP = {
  'ा': 'a', 'ि': 'i', 'ी': 'ee', 'ु': 'u', 'ू': 'u', 'ृ': 'ri', 'े': 'e', 'ै': 'ai', 'ो': 'o', 'ौ': 'au', 'ॉ': 'o', 'ॅ': 'e',
}
const DIGIT_MAP = { '०': '0', '१': '1', '२': '2', '३': '3', '४': '4', '५': '5', '६': '6', '७': '7', '८': '8', '९': '9' }

function devanagariToHinglish(input) {
  let out = ''
  const chars = [...input]
  for (let i = 0; i < chars.length; i++) {
    const ch = chars[i]
    if (ch === '्' || ch === '\u093C') continue
    if (VOWEL_MAP[ch]) { out += VOWEL_MAP[ch]; continue }
    if (CONSONANT_MAP[ch]) { out += CONSONANT_MAP[ch]; continue }
    if (MATRA_MAP[ch]) { out += MATRA_MAP[ch]; continue }
    if (DIGIT_MAP[ch]) { out += DIGIT_MAP[ch]; continue }
    if (ch === 'ं') {
      const next = chars[i + 1]
      out += next && 'पफबभम'.includes(next) ? 'm' : 'n'
      continue
    }
    if (ch === 'ँ') { out += 'n'; continue }
    if (ch === 'ः') { out += 'h'; continue }
    if (ch === '।') { out += '...'; continue }
    out += ch
  }
  return out
}

const isDevanagari = (ch) => /\p{Script=Devanagari}/u.test(ch)

let changed = 0
for (const file of files) {
  const src = readFileSync(file, 'utf8')
  let out = ''
  let run = ''
  for (const ch of src) {
    if (isDevanagari(ch)) {
      run += ch
    } else {
      if (run) {
        out += devanagariToHinglish(run)
        run = ''
      }
      out += ch
    }
  }
  if (run) out += devanagariToHinglish(run)
  if (out !== src) {
    writeFileSync(file, out)
    changed++
    console.log('converted:', file)
  }
}
console.log(`done — ${changed} file(s) updated`)