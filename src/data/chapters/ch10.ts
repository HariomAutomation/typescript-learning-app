import type { Chapter } from '../types'

export const chapter10: Chapter = {
  id: 'ch10',
  number: 10,
  title: { en: 'Tooling & TypeScript in the Wild', hi: 'Tooling aur real world mein TypeScript' },
  tagline: {
    en: 'tsconfig mastery, strict flags, linting, and shipping confident code.',
    hi: 'tsconfig ki mastery, strict flags, linting aur confident code ship karna.',
  },
  color: '#6c8bff',
  objectives: [
    { en: 'Read and design tsconfig.json seriously', hi: 'tsconfig.json ko seriously design karo' },
    { en: 'Combine strict flags deliberately', hi: 'Strict flags ko samajh ke combine karo' },
    { en: 'Ship with build steps and type-tests', hi: 'Build steps aur type-tests ke saath ship karo' },
  ],
  lessons: [
    {
      id: 'l10-1',
      title: { en: 'tsconfig as a spec', hi: 'tsconfig ek spec ki tarah' },
      minutes: 8,
      sections: [
        {
          heading: { en: 'The core options', hi: 'Core options' },
          paragraphs: [
            {
              en: 'target decides the JavaScript dialect; module for module system; lib for available APIs; outDir where the emitted files go. baseUrl/paths alias imports.',
              hi: 'target JavaScript ki dialect decide karta hai; module system module; lib available APIs; outDir emitted files ki jagah. baseUrl/paths imports ko alias karte hain.',
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
          heading: { en: 'Strict sub-flags that change your life', hi: 'Strict sub-flags jo game change kar dete hain' },
          paragraphs: [
            {
              en: 'strictNullChecks protects null-world; noUncheckedIndexedAccess adds undefined to every index read; noImplicitOverride demands "override" keywords.',
              hi: 'strictNullChecks null se protect karta hai; noUncheckedIndexedAccess har index read mein undefined jodta hai; noImplicitOverride "override" keyword ki demand karta hai.',
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
          prompt: { en: 'Which flag checks that array indexes might be undefined?', hi: 'Kaunsa flag check karta hai ki array index undefined ho sakta hai?' },
          code: `const names = ['a', 'b'];
console.log(names[2].toUpperCase()); // potential danger`,
          options: [
            { en: 'noUncheckedIndexedAccess', hi: 'noUncheckedIndexedAccess' },
            { en: 'noImplicitAny', hi: 'noImplicitAny' },
            { en: 'exactOptionalPropertyTypes', hi: 'exactOptionalPropertyTypes' },
            { en: 'skipLibCheck', hi: 'skipLibCheck' },
          ],
          correctIndex: 0,
          explanation: { en: 'noUncheckedIndexedAccess adds | undefined to indexing results.', hi: 'noUncheckedIndexedAccess har indexing result mein | undefined jod deta hai.' },
        },
        {
          id: 'q10-1-2',
          type: 'truefalse',
          difficulty: 'easy',
          points: 10,
          prompt: { en: 'Evaluate:', hi: 'True ya False:' },
          statement: { en: '`target` decides which JavaScript syntax the compiler is allowed to emit.', hi: '`target` decide karta hai ki compiler kaun si JavaScript syntax emit kar sakta hai.' },
          answer: true,
          explanation: { en: 'Lower targets down-level transform newer syntax.', hi: 'Niche wale targets nayi syntax ko purane level par transform karte hain.' },
        },
      ],
    },
    {
      id: 'l10-2',
      title: { en: 'Quality gates & shipping', hi: 'Quality gates aur shipping' },
      minutes: 7,
      sections: [
        {
          heading: { en: 'The three-step gate', hi: 'Teen-step gate' },
          paragraphs: [
            {
              en: 'Before merge: 1) tsc --noEmit (types), 2) linter static rules, 3) tests. Narrow arrow, deterministic and typo checks catch the weeds that walk.',
              hi: 'Merge se pehle: 1) tsc --noEmit (types), 2) linter static rules, 3) tests. Yeh teeno gates tarah tarah ki galtiyon ko pehle hi rok dete hain.',
            },
          ],
        },
        {
          heading: { en: 'Type tests: the missed fourth gate', hi: 'Type tests: chhuta hua chautha gate' },
          paragraphs: [
            {
              en: 'Assert type-level behavior with expectTypeOf-style helpers (vitest) so your generics behave long after writing.',
              hi: 'ExpectTypeOf jaise helpers (vitest) se type-level behavior assert karo, taaki generics bade din baad bhi sahi behave karein.',
            },
          ],
        },
        {
          heading: { en: 'The everyday workflow', hi: 'Roz ka workflow' },
          paragraphs: [
            {
              en: 'Edit → see errors in the editor instantly → run tests → commit small — the TypeScript feedback loop is your super-power.',
              hi: 'Edit karo → editor mein errors instantly dikh jaate hain → tests chalao → chhote commits karo — yehi TypeScript ka feedback loop aapki super-power hai.',
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
          prompt: { en: 'Write a type-safe `pluck` that returns an array of a given key from objects.', hi: 'Type-safe `pluck` likho jo objects se di gayi key ke values ka array return kare.' },
          starterCode: `export function pluck<T, K extends keyof T>(list: T[], key: K): T[K][] {
  // TODO
}`,
          hint: { en: 'map it.', hi: 'Map use karo.' },
          testCode: `import { pluck } from './solution'
console.log('Assert 1:', pluck([{ id: 1 }, { id: 2 }], 'id').join() === '1,2')
console.log('Assert 2:', pluck([{ name: 'a' }, { name: 'b' }], 'name').join() === 'a,b')
`,
          explanation: {"en":"Map over the array picking key so type stays T[K].","hi":"Array par map karke desired key pick karo, type T[K] hi rahega."},
        },
        {
          id: 'q10-2-2',
          type: 'output',
          difficulty: 'easy',
          points: 10,
          prompt: { en: 'What does the snippet print?', hi: 'Snippet kya print karega?' },
          code: `type T = { a: number; b: string };
const keys = Object.keys({ a: 1, b: 'x' } as { a: number; b: string }) as (keyof T)[];
console.log(keys.sort().join());
`,
          expected: 'a, b',
          explanation: { en: 'The keyof cast makes the compiler happy; runtime sorts, arrays join with comma.', hi: 'Keyof cast se compiler khush rehta hai; runtime par keys sort hoti hain aur comma se join hoti hain.' },
        },

        {
          id: 'q10-2-3',
          type: 'bugfix',
          difficulty: 'medium',
          points: 15,
          prompt: { en: 'average() returns the minimum, not the average, of scores.', hi: 'average() scores ka minimum return karta hai, average nahi.' },
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
          explanation: { en: 'average needs the sum divided by the count; Math.min picks the smallest number.', hi: 'Average ke liye sum ko count se divide karna hota hai; Math.min sabse chota number chunta hai.' },
        },
      ],
    },
  ],
}