import type { Chapter } from '../types'

export const chapter10: Chapter = {
  id: 'ch10',
  number: 10,
  title: { en: 'Tooling & TypeScript in the Wild', hi: 'tuling aur vastvik duniya' },
  tagline: {
    en: 'tsconfig mastery, strict flags, linting, and shipping confident code.',
    hi: 'tsconfig mhart, strict flags, linting aur bhrosemnd kod.',
  },
  color: '#6c8bff',
  objectives: [
    { en: 'Read and design tsconfig.json seriously', hi: 'tsconfig.json ko gmbheerta se dijain krna' },
    { en: 'Combine strict flags deliberately', hi: 'strict flags ka shee chyn' },
    { en: 'Ship with build steps and type-tests', hi: 'build steps aur taip-tests se kod jaree krna' },
  ],
  lessons: [
    {
      id: 'l10-1',
      title: { en: 'tsconfig as a spec', hi: 'tsconfig ek spek kee trh' },
      minutes: 8,
      sections: [
        {
          heading: { en: 'The core options map', hi: 'mukhy viklp' },
          paragraphs: [
            {
              en: 'target decides the JS dialect; module for module system; lib for available APIs; outDir where the emitted goes. baseUrl/paths alias imports.',
              hi: 'target javaskript ke str ty krta hai; module sistm; lib kaun-see API uplbdh; outDir aautput kee jgh.',
            },
          ],
          blocks: [{
            kind: 'code',
            code: `{
  "compilerOptions": {
    "target": "ESNext",
    "module": "ESNext",
    "moduleResolution": "bundler",
    "strict": true,
    "noUncheckedIndexedAccess": true,
    "noImplicitOverride": true,
    "isolatedModules": true,
    "skipLibCheck": true,
    "outDir": "dist"
  },
  "include": ["src"]
}
`,
          }],
        },
        {
          heading: { en: 'Strict sub-flags that change your life', hi: 'nirnayk strict sub-flags' },
          paragraphs: [
            {
              en: 'strictNullChecks protects null-world; noUncheckedIndexedAccess adds undefined to every index read; noImplicitOverride demands "override" keywords.',
              hi: 'strictNullChecks null se bchata hai; noUncheckedIndexedAccess hr indeks men undefined jodta hai; noImplicitOverride override kee mang krta hai.',
            },
          ],
        },
      ],
      questions: [
        {
          id: 'q10-1-1',
          type: 'mcq',
          difficulty: 'medium',
          points: 15,
          prompt: { en: 'Which flag checks that array indexes might be undefined?', hi: 'kaun-sa flag khta hai ki aire indeks undefined ho skta hai?' },
          code: `const names = ['a', 'b'];
console.log(names[2].toUpperCase()); // potential danger`,
          options: [
            { en: 'noUncheckedIndexedAccess', hi: 'noUncheckedIndexedAccess' },
            { en: 'noImplicitAny', hi: 'noImplicitAny' },
            { en: 'exactOptionalPropertyTypes', hi: 'exactOptionalPropertyTypes' },
            { en: 'skipLibCheck', hi: 'skipLibCheck' },
          ],
          correctIndex: 0,
          explanation: { en: 'noUncheckedIndexedAccess adds | undefined to indexing results.', hi: 'noUncheckedIndexedAccess hr indeks ke rijlt men | undefined jodta hai.' },
        },
        {
          id: 'q10-1-2',
          type: 'truefalse',
          difficulty: 'easy',
          points: 10,
          prompt: { en: 'Evaluate:', hi: 'kthn sty ya asty:' },
          statement: { en: '`target` decides which JavaScript syntax the compiler is allowed to emit.', hi: 'target ty krta hai ki kmpailr kaun-see JavaScript sintaiks bna skta hai.' },
          answer: true,
          explanation: { en: 'Lower targets down-level transform newer syntax.', hi: 'purane target pr nee sintaiks bdlkr nikltee hai.' },
        },
      ],
    },
    {
      id: 'l10-2',
      title: { en: 'Quality gates & shipping', hi: 'gunvtta aur rileej' },
      minutes: 7,
      sections: [
        {
          heading: { en: 'The three-step gate', hi: 'teen-step get' },
          paragraphs: [
            {
              en: 'Before merge: 1) tsc --noEmit (types), 2) linter static rules, 3) tests. Narrow arrow, deterministic and typy checks catch the weeds that walk.',
              hi: 'mrj se phle: 1) tsc --noEmit, 2) linter, 3) test — ye teenon get prkar kee gltiyan phle rokte hain.',
            },
          ],
        },
        {
          heading: { en: 'Type tests: the missed fourth gate', hi: 'taip-test: chautha get' },
          paragraphs: [
            {
              en: 'Assert type-level behavior with expectTypeOf-style helpers (vitest) so your generics behave long after writing.',
              hi: 'vitest kee type keywords (expectTypeOf) se taip-valee asrt; jenerik lmbe smy bad bhee shee rhte hain.',
            },
          ],
        },
        {
          heading: { en: 'The everyday workflow', hi: 'rojmrra ka kam' },
          paragraphs: [
            {
              en: 'Edit → see errors in the editor instantly → run tests → commit small — the TypeScript feedback loop is your super-power.',
              hi: 'likhen → editr hee gltee btata hai → test → chhote kmit — yhee dilchsp lup hai.',
            },
          ],
        },
      ],
      questions: [
        {
          id: 'q10-2-1',
          type: 'code',
          difficulty: 'medium',
          points: 15,
          prompt: { en: 'Write a type-safe `pluck` that returns an array of a given key from objects.', hi: 'aise objekts se dee gee kunjee ke vailyu lautane vala taip-sef plk pluck` likhen.' },
          starterCode: `export function pluck<T, K extends keyof T>(list: T[], key: K): T[K][] {
  // TODO
}`,
          hint: { en: 'map it.', hi: 'map ka upyog kren.' },
          testCode: `import { pluck } from './solution'
console.log('Assert 1:', pluck([{ id: 1 }, { id: 2 }], 'id').join() === '1,2')
console.log('Assert 2:', pluck([{ name: 'a' }, { name: 'b' }], 'name').join() === 'a,b')
`,
          explanation: {"en":"Map over the array picking key so type stays T[K].","hi":"aire pr map krke kunjee pdhen, taip T[K] rhega."},
        },
        {
          id: 'q10-2-2',
          type: 'output',
          difficulty: 'easy',
          points: 10,
          prompt: { en: 'What does the snippet print?', hi: 'snipet kya chhapega?' },
          code: `type T = { a: number; b: string };
const keys = Object.keys({ a: 1, b: 'x' } as { a: number; b: string }) as (keyof T)[];
console.log(keys.sort().join());
`,
          expected: 'a, b',
          explanation: { en: 'keyof cast makes the compiler happy; runtime sorts, arrays join with comma.', hi: 'keyof cast kafee hai; sort ke bad koma se joda jata hai.' },
        },

        {
          id: 'q10-2-3',
          type: 'bugfix',
          difficulty: 'medium',
          points: 15,
          prompt: { en: 'average() returns the minimum, not the average, of scores.', hi: 'average() scores ka minimum lauta hai, average nahi.' },
          hint: { en: 'Divide the sum by the count — not Math.min.', hi: 'Sum ko count se divide karo — Math.min se nahi.' },
          buggyCode: `export function average(scores: number[]): number {
  if (scores.length === 0) return 0
  return Math.min(...scores)
}`,
          fixedCode: `export function average(scores: number[]): number {
  if (scores.length === 0) return 0
  return Math.round(scores.reduce((a, b) => a + b, 0) / scores.length)
}`,
          testCode: `import { average } from './solution'
console.log('Assert 1:', average([10, 20]) === 15)
console.log('Assert 2:', average([]) === 0)`,
          explanation: { en: 'average needs the sum divided by the count; Math.min picks the smallest number.', hi: 'average ke liye sum ko count se divide karna hai; Math.min sabse chhota number chunta hai.' },
        },
      ],
    },
  ],
}