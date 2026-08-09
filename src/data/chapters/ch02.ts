import type { Chapter } from '../types'

export const chapter02: Chapter = {
  id: 'ch02',
  number: 2,
  title: { en: 'Primitives, Arrays & Objects', hi: 'Primitives, Arrays aur Objects' },
  tagline: {
    en: 'Type every shape of data — unions, tuples, and object types.',
    hi: 'Har tarah ke data ke liye types — unions, tuples aur object types.',
  },
  color: '#a78bfa',
  objectives: [
    { en: 'Model exact values with literals and unions', hi: 'Literals aur unions se exact values model karo' },
    { en: 'Type arrays, tuples and readonly collections', hi: 'Arrays, tuples aur readonly collections ki types likho' },
    { en: 'Shape objects with type aliases and interfaces', hi: 'Type aliases aur interfaces se objects shape karo' },
    { en: 'Handle optional and nullable fields safely', hi: 'Optional aur nullable fields ko safely handle karo' },
  ],
  lessons: [
    {
      id: 'l2-1',
      title: { en: 'Numbers, Strings, Booleans & Unions', hi: 'Numbers, Strings, Booleans aur Unions' },
      minutes: 9,
      sections: [
        {
          heading: { en: 'The four primitive monoliths', hi: 'Char basic primitives' },
          paragraphs: [
            {
              en: 'string, number, boolean, null/undefined. TypeScript models these tightly; null and undefined are distinct and their optionality handled via strictNullChecks.',
              hi: 'string, number, boolean, null/undefined. TypeScript inhe tightly model karta hai; null alag hai aur undefined alag.',
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
          heading: { en: 'Literal types: precise values', hi: 'Literal types: exact values' },
          paragraphs: [
            {
              en: 'Write the value itself as a type — "type Direction = \'up\' | \'down\'" — a string that is only those two strings. This is the kitchen of modeling states: status, mode, orientation.',
              hi: 'Value ko hi type bana do — "type Direction = \'up\' | \'down\'". Aise hi states, mode, orientation model hote hain.',
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
          heading: { en: 'Widening: why const is its own muscle', hi: 'Widening: const ki apni taakat' },
          paragraphs: [
            {
              en: 'A direct literal assigned to const keeps the literal type; for let it widens to primitive. The compiler gives you precision only where it can.',
              hi: 'Const mein literal type rehta hai; let mein value primitive tak widen ho jati hai. Compiler wahi precision deta hai jahan wo de sakta hai.',
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
          prompt: { en: 'What prints?', hi: 'Kya print hoga?' },
          code: `const mode: 'prod' | 'dev' = 'prod';
console.log(mode.toUpperCase());
`,
          expected: 'PROD',
          explanation: { en: 'The literal union still exposes all string methods.', hi: 'Literal union par bhi saare string methods kaam karte hain.' },
        },
        {
          id: 'q2-1-2',
          type: 'code',
          difficulty: 'medium',
          points: 15,
          prompt: {
            en: 'Write setSpeed(speed) that returns "slow" | "fast" — "slow" if the number is < 50 else "fast".',
            hi: 'setSpeed(speed) likho jo "slow" | "fast" return kare — agar number 50 se chhota hai to "slow" warna "fast".',
          },
          starterCode: `export function setSpeed(speed: number): 'slow' | 'fast' {
  // ✏️ your code here
}`,
          hint: { en: 'Ternary suits this perfectly.', hi: 'Iske liye ternary perfect hai.' },
          testCode: `import { setSpeed } from './solution'
// assert
console.log('Assert 1:', setSpeed(10) === 'slow')
console.log('Assert 2:', setSpeed(99) === 'fast')
console.log('Assert 3:', setSpeed(50) === 'fast')
`,
          explanation: {"en":"A ternary on the numeric argument selects the union member.","hi":"Numeric argument par ternary se union ka sahi member select ho jata hai."},
        },
      ],
      exercise: {
        prompt: {
          en: 'Write sumPair(pair) that returns pair[0] + pair[1] — the tuple has exactly two numbers.',
          hi: 'sumPair(pair) aisa likho jo pair[0] + pair[1] return kare — tuple mein exactly do numbers hain.',
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
      title: { en: 'Arrays & Tuples', hi: 'Arrays aur Tuples' },
      minutes: 8,
      sections: [
        {
          heading: { en: 'Families of arrays', hi: 'Arrays ki families' },
          paragraphs: [
            {
              en: 'number[] and Array<number> are the same. For mixed content use tuples — fixed-length, position-aware arrays.',
              hi: 'number[] aur Array<number> dono same hain. Mixed content ke liye tuples use karo — fixed-length position-aware arrays.',
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
          heading: { en: 'const assertions for immutable tail', hi: 'Immutable data ke liye readonly' },
          paragraphs: [
            {
              en: 'readonly number[] rejects mutation methods — push, splice, sort — catching shared-state mistakes early.',
              hi: 'readonly number[] mutation methods (push, splice, sort) ko rok deta hai — shared state ki galtiyan pehle pakad leta hai.',
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
          prompt: { en: 'Evaluate the statement:', hi: 'Statement True ya False:', },
          statement: {
            en: '`readonly number[]` still allows calling `push()`.',
            hi: '`readonly number[]` par `push()` ab bhi allowed hai.',
          },
          answer: false,
          explanation: {
            en: 'readonly arrays ban mutating methods at compile time.',
            hi: 'Readonly arrays mutation methods ko compile time par hi block kar dete hain.',
          },
        },
        {
          id: 'q2-2-2',
          type: 'code',
          difficulty: 'easy',
          points: 10,
          prompt: {
            en: 'Write buildPoint(x, y) that returns a [number, number] tuple.',
            hi: 'buildPoint(x, y) likho jo [number, number] tuple return kare.',
          },
          starterCode: `export function buildPoint(x: number, y: number): [number, number] {
  // TODO: return tuple
}`,
          hint: null,
          testCode: `import { buildPoint } from './solution'
console.log('Assert 1:', buildPoint(1, 2).join() === '1,2')
console.log('Assert 2:', buildPoint(-5, 9).length === 2)
`,
          explanation: {"en":"Box the arguments into a typed tuple.","hi":"Dono arguments ko ek typed tuple mein rakh do."},
        },
      ],
    },
    {
      id: 'l2-3',
      title: { en: 'Objects & Type Aliases', hi: 'Objects aur Type Aliases' },
      minutes: 9,
      sections: [
        {
          heading: { en: 'The object shape', hi: 'Object ka shape' },
          paragraphs: [
            {
              en: 'An object type lists properties and their types. Optional properties via ?: — they may be absent. Index signatures cover arbitrary keys.',
              hi: 'Object type properties aur unke types ki list karta hai. `?` wale properties optional hain — absent ho sakte hain. Index signatures kisi bhi key ke liye kaam karti hain.',
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
          heading: { en: 'Alias vs Interface', hi: 'Alias vs Interface' },
          paragraphs: [
            {
              en: 'Both declare object shapes. type aliases can create unions/tuples and non-object types; interface supports declaration merging. Modern recommendation: prefer type until you need merging.',
              hi: 'Dono object shapes declare karte hain. Type aliases unions/tuples aur non-object types bana sakte hain; interface declaration merging support karta hai. Modern recommendation: jab tak merging nahi chahiye, type hi prefer karo.',
            },
          ],
        },
        {
          heading: { en: 'The readonly modifier', hi: 'Readonly modifier' },
          paragraphs: [
            {
              en: 'readonly marks properties immutable for the checker — assignment rejected, deep mutation still possible. It is a compile-time skin.',
              hi: 'Readonly properties ko checker ke liye immutable mark karta hai — assignment reject ho jati hai, deep mutation abhi bhi possible hai. Yeh sirf compile-time ki baat hai.',
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
          prompt: { en: 'Which design is correct?', hi: 'Kaunsa design sahi hai?' },
          code: `type Circle = { kind: 'circle'; radius: number }
type Square = { kind: 'square'; side: number }
type Shape = Circle | Square`,
          options: [
            { en: 'A discriminated union — the kind literal narrows the shape', hi: 'Discriminated union — kind literal shape ko narrow karta hai' },
            { en: 'Interface inheritance', hi: 'Interface inheritance' },
            { en: 'An array alias', hi: 'Array alias' },
            { en: 'A generic type', hi: 'Generic type' },
          ],
          correctIndex: 0,
          explanation: {
            en: 'Each member of the union carries a distinguishing literal — the "discriminant" — that lets narrowing happen.',
            hi: 'Union ka har member apna distinct literal (discriminant) rakhta hai, jisse narrowing possible hoti hai.',
          },
        },
        {
          id: 'q2-3-2',
          type: 'code',
          difficulty: 'medium',
          points: 15,
          prompt: {
            en: 'Write total(prices: number[]): number that sums all numbers.',
            hi: 'total(prices: number[]): number likho jo saare numbers ka sum kare.',
          },
          starterCode: `export function total(prices: number[]): number {
  // TODO
}`,
          hint: { en: 'reduce is elegant; a loop also works.', hi: 'Reduce elegant hai; loop bhi chalta hai.' },
          testCode: `import { total } from './solution'
console.log('Assert 1:', total([1, 2, 3]) === 6)
console.log('Assert 2:', total([]) === 0)
console.log('Assert 3:', total([10, -5, 2]) === 7)
`,
          explanation: {"en":"Sum with reduce or a loop — both pass the asserts.","hi":"Reduce ya loop — dono se saare asserts pass ho jayenge."},
        },

        {
          id: 'q2-3-3',
          type: 'bugfix',
          difficulty: 'easy',
          points: 10,
          prompt: { en: 'totalCost() always returns 0 for non-empty arrays. Find the typo.', hi: 'totalCost() non-empty arrays ke liye hamesha 0 return karta hai. Typo dhundo.' },
          hint: { en: 'The object property is spelled value. Is reduce using it?', hi: 'Object property ka naam value hai — kya reduce wahi use kar raha hai?' },
          buggyCode: `export function totalCost(items: { value: number }[]): number {
  return items.reduce((sum, item) => sum + item.valu, 0)
}`,
          fixedCode: `export function totalCost(items: { value: number }[]): number {
  return items.reduce((sum, item) => sum + item.value, 0)
}`,
          testCode: `import { totalCost } from './solution'
console.log('Assert 1:', totalCost([{ value: 2 }, { value: 3 }]) === 5)
console.log('Assert 2:', totalCost([]) === 0)`,
          explanation: { en: 'item.valu is undefined, so the sum becomes NaN; the correct key is value.', hi: 'item.valu undefined hota hai, isliye sum NaN ban jata hai; sahi key value hai.' },
        },
      ],
    },
  ],
}