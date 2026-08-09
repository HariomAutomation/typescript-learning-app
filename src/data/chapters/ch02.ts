import type { Chapter } from '../types'

export const chapter02: Chapter = {
  id: 'ch02',
  number: 2,
  title: { en: 'Primitives, Arrays & Objects', hi: 'primitiv, aire aur objekt' },
  tagline: {
    en: 'Type every shape of data — unions, tuples, and object types.',
    hi: 'deta ke hr aakar ke lie taip — yuniyn, tpl aur objekt taip.',
  },
  color: '#a78bfa',
  objectives: [
    { en: 'Model exact values with literals and unions', hi: 'litrl aur yuniys se steek man' },
    { en: 'Type arrays, tuples and readonly collections', hi: 'aire, tpl, readonly klekshn' },
    { en: 'Shape objects with type aliases and interfaces', hi: 'taip eliyas aur intrfes se objekt' },
    { en: 'Handle optional and nullable fields safely', hi: 'optional aur nullable feeld surksha' },
  ],
  lessons: [
    {
      id: 'l2-1',
      title: { en: 'Numbers, Strings, Booleans & Unions', hi: 'Number, String, Boolean aur yuniyn' },
      minutes: 9,
      sections: [
        {
          heading: { en: 'The four primitive monoliths', hi: 'char mul primitiv' },
          paragraphs: [
            {
              en: 'string, number, boolean, null/undefined. TypeScript models these tightly; null and undefined are distinct and their optionality handled via strictNullChecks.',
              hi: 'string, number, boolean, null/undefined. TypeScript inhen steek modl krta hai; null alg hai undefined alg.',
            },
          ],
          blocks: [{ kind: 'code', code: `let n: number = 3.14;   // numbers are floats — one type
let s: string = 'hi';
let ok: boolean = true;
let arr: null = null;   // you can only assign null
let undef: undefined = undefined;
` }],
        },
        {
          heading: { en: 'Literal types: precise values', hi: 'litrl taip: steek man' },
          paragraphs: [
            {
              en: 'Write the value itself as a type — "type Direction = \'up\' | \'down\'" — a string that is only those two strings. This is the kitchen of modeling states: status, mode, orientation.',
              hi: 'vailyu ko hee ek taip bna len — "type Direction = \'up\' | \'down\'". aise modl bnte hain: status, mode, orientation.',
            },
          ],
          blocks: [{
            kind: 'code',
            code: `type Direction = 'up' | 'down' | 'left' | 'right';
type Status = 'idle' | 'loading' | 'success' | 'error';

function move(d: Direction) { /* ... */ }
move('up');      // ✅
move('diagonal'); // ❌ not in union
`,
          }],
        },
        {
          heading: { en: 'Widening: why const is its own muscle', hi: 'vaidning: const kee apnee takt' },
          paragraphs: [
            {
              en: 'A direct literal assigned to const keeps the literal type; for let it widens to primitive. The compiler gives you precision only where it can.',
              hi: 'const men litrl taip rhta hai; let men primitive tk widen hota hai. kmpailr theek jhan ho ske steekta deta hai.',
            },
          ],
          blocks: [{
            kind: 'code',
            code: `const d = 'right';    // Type 'right'
let v = 'right';      // Type 'string' (widened)
`,
          }],
        },
      ],
      questions: [
        {
          id: 'q2-1-1',
          type: 'output',
          difficulty: 'easy',
          points: 10,
          prompt: { en: 'What prints?', hi: 'kya print hoga?' },
          code: `const mode: 'prod' | 'dev' = 'prod';
console.log(mode.toUpperCase());
`,
          expected: 'PROD',
          explanation: { en: 'The literal union still exposes all string methods.', hi: 'litrl yuniyn pr bhee string ke sbhee methd kam krte hain.' },
        },
        {
          id: 'q2-1-2',
          type: 'code',
          difficulty: 'medium',
          points: 15,
          prompt: {
            en: 'Write setSpeed(speed) that returns "slow" | "fast" — "slow" if the number is < 50 else "fast".',
            hi: 'setSpeed(speed) likhen jo koee snkhya 50 se chhotee ho to "slow" vrna "fast" lautae.',
          },
          starterCode: `export function setSpeed(speed: number): 'slow' | 'fast' {
  // ✏️ your code here
}`,
          hint: { en: 'Ternary suits this perfectly.', hi: 'ter ke lie ternary aadrsh hai.' },
          testCode: `import { setSpeed } from './solution'
// assert
console.log('Assert 1:', setSpeed(10) === 'slow')
console.log('Assert 2:', setSpeed(99) === 'fast')
console.log('Assert 3:', setSpeed(50) === 'fast')
`,
          explanation: {"en":"A ternary on the numeric argument selects the union member.","hi":"snkhyatmk trk pr ternary se yuniyn ka sdsy chuna jata hai."},
        },
      ],
      exercise: {
        prompt: {
          en: 'Write sumPair(pair) that returns pair[0] + pair[1] — the tuple has exactly two numbers.',
          hi: 'sumPair(pair) aisa likho jo pair[0] + pair[1] return kare — tuple mein theek do numbers hain.',
        },
        starterCode: `export function sumPair(pair: [number, number]): number {
  // ✏️ your code here
}`,
        hint: {
          en: 'Destructure: const [a, b] = pair.',
          hi: 'Destructure karo: const [a, b] = pair.',
        },
        testCode: `import { sumPair } from './solution'
console.log('Assert 1:', sumPair([3, 4]) === 7)
console.log('Assert 2:', sumPair([0, 0]) === 0)`,
      },
    },
    {
      id: 'l2-2',
      title: { en: 'Arrays & Tuples', hi: 'aire aur tpl' },
      minutes: 8,
      sections: [
        {
          heading: { en: 'Families of arrays', hi: 'aire ke prkar' },
          paragraphs: [
            {
              en: 'number[] and Array<number> are the same. For mixed content use tuples — fixed-length, position-aware arrays.',
              hi: 'number[] aur Array<number> ek hee hain. miks cheejon ke lie tpl — nishchit lmbaee vale aire.',
            },
          ],
          blocks: [
            { kind: 'code', code: `const nums: number[] = [1, 2, 3];
const names: string[] = ['a', 'b'];
type Point = [number, number];   // tuple
const p: Point = [1, 2];         // ✅
const q: Point = [1, 'x'];       // ❌
` },
          ],
        },
        {
          heading: { en: 'const assertions for immutable tail', hi: 'const assignment for immutable data' },
          paragraphs: [
            {
              en: 'readonly number[] rejects mutation methods — push, splice, sort — catching shared-state mistakes early.',
              hi: 'readonly number[] mutation methd (push, splice, sort) ko rokta hai — sajha stet se hone valee gltiyan phle pkdta hai.',
            },
          ],
        },
      ],
      questions: [
        {
          id: 'q2-2-1',
          type: 'truefalse',
          difficulty: 'easy',
          points: 10,
          prompt: { en: 'Evaluate the statement:', hi: 'kthn sty ya asty?', },
          statement: {
            en: '`readonly number[]` still allows calling `push()`.',
            hi: '`readonly number[]` pr `push()` abhee bhee chl skta hai.',
          },
          answer: false,
          explanation: {
            en: 'readonly arrays ban mutating methods at compile time.',
            hi: 'readonly aire men bdlne vale methd kmpail smy ty ho jate hain.',
          },
        },
        {
          id: 'q2-2-2',
          type: 'code',
          difficulty: 'easy',
          points: 10,
          prompt: {
            en: 'Write buildPoint(x, y) that returns a [number, number] tuple.',
            hi: 'buildPoint(x, y) likhen jo [number, number] tpl lautae.',
          },
          starterCode: `export function buildPoint(x: number, y: number): [number, number] {
  // TODO: return tuple
}`,
          hint: null,
          testCode: `import { buildPoint } from './solution'
console.log('Assert 1:', buildPoint(1, 2).join() === '1,2')
console.log('Assert 2:', buildPoint(-5, 9).length === 2)
`,
          explanation: {"en":"Box the arguments into a typed tuple.","hi":"donon trkon ko taipd tpl men rkhen."},
        },
      ],
    },
    {
      id: 'l2-3',
      title: { en: 'Objects & Type Aliases', hi: 'objekt aur taip eliyas' },
      minutes: 9,
      sections: [
        {
          heading: { en: 'The object shape', hi: 'objekt ka aakar' },
          paragraphs: [
            {
              en: 'An object type lists properties and their types. Optional properties via ?: — they may be absent. Index signatures cover arbitrary keys.',
              hi: 'objekt taip proprtee aur unke taip sucheebddh krta hai. ? vale optional hain — ho nheen skte. indeks signechr kisee bhee kunjee ke lie hai.',
            },
          ],
          blocks: [{
            kind: 'code',
            code: `type User = {
  id: number;
  name: string;
  email?: string;          // optional
  readonly role: 'admin' | 'viewer';
  [key: string]: unknown;  // index signature
};
`,
          }],
        },
        {
          heading: { en: 'Alias vs Interface', hi: 'eliyas bnam intrfes' },
          paragraphs: [
            {
              en: 'Both declare object shapes. type aliases can create unions/tuples and non-object types; interface supports declaration merging. Modern recommendation: prefer type until you need merging.',
              hi: 'donon aakar ghoshit krte hain. type yuniyn/tpl/non-objekt bna skta hai; interface merge ho skta hai.',
            },
          ],
        },
        {
          heading: { en: 'The readonly modifier', hi: 'readonly modifayr' },
          paragraphs: [
            {
              en: 'readonly marks properties immutable for the checker — assignment rejected, deep mutation still possible. It is a compile-time skin.',
              hi: 'readonly valee prop fir se asain nheen ho sktee — chekr rokta hai, pr ghra bdlav ab bhee smbhv. yh kmpail-taim bat hai.',
            },
          ],
        },
      ],
      questions: [
        {
          id: 'q2-3-1',
          type: 'mcq',
          difficulty: 'medium',
          points: 15,
          prompt: { en: 'Which yield-type is correct?', hi: 'kaun-sa prkar shee hai?' },
          code: `type Circle = { kind: 'circle'; radius: number }
type Square = { kind: 'square'; side: number }
type Shape = Circle | Square`,
          options: [
            { en: 'A discriminated union — the kind literal narrows the shape', hi: 'yh discriminated union hai — kind litrl shep ty krta hai' },
            { en: 'Interface inheritance', hi: 'intrfes inhritens' },
            { en: 'An array alias', hi: 'aire eliyas' },
            { en: 'A generics type', hi: 'jenerik taip' },
          ],
          correctIndex: 0,
          explanation: {
            en: 'Each member of the union carries a distinguishing literal — the "discriminant" — that lets narrowing happen.',
            hi: 'yuniyn ka hr sdsy ek alg phchan vale litrl (discriminant) se sjj hota hai, jo narrowing chlata hai.',
          },
        },
        {
          id: 'q2-3-2',
          type: 'code',
          difficulty: 'medium',
          points: 15,
          prompt: {
            en: 'Write total(prices: number[]): number that sums all numbers.',
            hi: 'total(prices: number[]): number likhen jo sbhee snkhyaen jode.',
          },
          starterCode: `export function total(prices: number[]): number {
  // TODO
}`,
          hint: { en: 'reduce is elegant; loop also fine.', hi: 'reduce saf hai; lup bhee chlega.' },
          testCode: `import { total } from './solution'
console.log('Assert 1:', total([1, 2, 3]) === 6)
console.log('Assert 2:', total([]) === 0)
console.log('Assert 3:', total([10, -5, 2]) === 7)
`,
          explanation: {"en":"Sum with reduce or a loop — both pass the asserts.","hi":"reduce ya lup — donon shee hain."},
        },

        {
          id: 'q2-3-3',
          type: 'bugfix',
          difficulty: 'easy',
          points: 10,
          prompt: { en: 'totalCost() always returns 0 for non-empty arrays. Find the typo.', hi: 'totalCost() khali na hone wale array par hamesha 0 deta hai. typo dhundo.' },
          hint: { en: 'The object property is spelled value. Is the reduce using it?', hi: 'Object property value hai — kya reduce wahi use kar raha hai?' },
          buggyCode: `export function totalCost(items: { value: number }[]): number {
  return items.reduce((sum, item) => sum + item.valu, 0)
}`,
          fixedCode: `export function totalCost(items: { value: number }[]): number {
  return items.reduce((sum, item) => sum + item.value, 0)
}`,
          testCode: `import { totalCost } from './solution'
console.log('Assert 1:', totalCost([{ value: 2 }, { value: 3 }]) === 5)
console.log('Assert 2:', totalCost([]) === 0)`,
          explanation: { en: 'item.valu is undefined, so sum + undefined yields NaN; the correct key is value.', hi: 'item.valu undefined hota hai, isliye NaN ban jaata hai; sahi key value hai.' },
        },
      ],
    },
  ],
}