import type { Chapter } from '../types'

export const chapter05: Chapter = {
  id: 'ch05',
  number: 5,
  title: { en: 'Generics: Type as a Parameter', hi: 'jenerik: taip input ke rup men' },
  tagline: {
    en: 'Write once, work for every type — the heart of reusable code.',
    hi: 'ek bar likho, hr taip ke lie — fir se istemal ka dil.',
  },
  color: '#fbbf24',
  objectives: [
    { en: 'Introduce type parameters and constraints', hi: 'taip pairameetr aur constraints se prichy' },
    { en: 'Build generic helpers and collections', hi: 'jenerik helpr aur klekshn' },
    { en: 'Spot where inference supplies the type args', hi: 'imfrens se jenerik aarg aana' },
  ],
  lessons: [
    {
      id: 'l5-1',
      title: { en: 'The identity of a generic', hi: 'jenerik kee phchan' },
      minutes: 8,
      sections: [
        {
          heading: { en: 'What a type parameter is', hi: 'taip pairameetr kya hota hai' },
          paragraphs: [
            {
              en: 'A generic function parameterizes the types it uses. `identity<T>(v: T): T` returns exactly what you put in.',
              hi: 'jenerik fnkshn apne taip ko pairameetr krta hai. `identity<T>(v: T): T` jo dalenge vhee lautata hai.',
            },
          ],
          blocks: [{
            kind: 'code',
            code: `function identity<T>(value: T): T {
  return value;
}
const s = identity('str');   // string
const n = identity(42);      // number

function first<T>(list: T[]): T | undefined {
  return list[0];
}
first([1, 2, 3]); // number | undefined
`,
          }],
        },
        {
          heading: { en: 'One function, many shapes', hi: 'ek fnkshn, kee aakar' },
          paragraphs: [
            {
              en: 'Without generics you would copy-paste per type. With them you write one source and the checker instantiates it per usage.',
              hi: 'jenerik ke bina hr taip ke lie kod kopee krnee pdtee. jenerik se ek sors aur hr upyog ke lie vhee janch.',
            },
          ],
        },
      ],
      questions: [
        {
          id: 'q5-1-1',
          type: 'code',
          difficulty: 'easy',
          points: 10,
          prompt: { en: 'Write `last<T>(list)` that returns the last element.', hi: '`last<T>(list)` likhen jo aakhiree ttv lautae.' },
          starterCode: `export function last<T>(list: T[]): T | undefined {
  // TODO
}`,
          hint: { en: 'Use length - 1.', hi: 'length - 1 istemal kren.' },
          testCode: `import { last } from './solution'
console.log('Assert 1:', last([1, 2, 3]) === 3)
console.log('Assert 2:', last([]) === undefined)
console.log('Assert 3:', last(['a', 'b']) === 'b')
`,
          explanation: {"en":"Index length-1, and return undefined for the empty array.","hi":"length-1 pr indeks kren; khalee aire pr undefined."},
        },
        {
          id: 'q5-1-2',
          type: 'mcq',
          difficulty: 'medium',
          points: 15,
          prompt: { en: 'What does `identity` infer when given `[1, 2]`?', hi: '`identity` ko `[1, 2]` dene pr kaun-sa taip aaega?' },
          code: `function identity<T>(v: T): T {}`,
          options: [
            { en: 'number[]', hi: 'number[]' },
            { en: 'number', hi: 'number' },
            { en: 'unknown[]', hi: 'unknown[]' },
            { en: 'number | string', hi: 'number | string' },
          ],
          correctIndex: 0,
          explanation: { en: 'T infers to the whole array type.', hi: 'T pura aire taip bn jata hai.' },
        },
      ],
    },
    {
      id: 'l5-2',
      title: { en: 'Constraints & Multiple Parameters', hi: 'Constraints aur kee pairameetr' },
      minutes: 9,
      sections: [
        {
          heading: { en: 'extends bounds the shape', hi: 'extends kee seema' },
          paragraphs: [
            {
              en: 'Constraints say "T must at least have these parts". Inside the generic you can only use the constrained features.',
              hi: 'Constraint khta hai ki T ke pas km se km yh hona chahie. andr sirf constrained cheejen hee istemal ho sktee hain.',
            },
          ],
          blocks: [{
            kind: 'code',
            code: `function describe<T extends { name: string }>(item: T): string {
  return item.name.toUpperCase();   // safe: name is guaranteed
}
describe({ name: 'book', pages: 300 }); // ok
`,
          }],
        },
        {
          heading: { en: 'Multiple type parameters', hi: 'ek sath kee taip pairameetr' },
          paragraphs: [
            {
              en: 'Generics compose: pairs, maps, and lookups all take multiple type params and infer each independently.',
              hi: 'Pairs, maps, lookups — sbhee kee taip pairameetr lete hain, hr ek apnee jgh imfr hota hai.',
            },
          ],
          blocks: [{
            kind: 'code',
            code: `function zip<K, V>(keys: K[], values: V[]): [K, V][] {
  return keys.map((k, i) => [k, values[i]]);
}
zip(['a', 'b'], [1, 2]); // [string, number][]
`,
          }],
        },
      ],
      questions: [
        {
          id: 'q5-2-1',
          type: 'truefalse',
          difficulty: 'easy',
          points: 10,
          prompt: { en: 'Evaluate:', hi: 'kthn sty ya asty:' },
          statement: {
            en: 'A generic constrained with `extends` can use only the properties declared in the constraint inside the body.',
            hi: 'jenerik men constraint valee proprteej ke alava bodee men koee cheej uplbdh nheen hotee.',
          },
          answer: true,
          explanation: { en: 'The checker guarantees only the constraint inside.', hi: 'kmpailr bodee men kevl constraint ka hee bhrosa deta hai.' },
        },

        {
          id: 'q5-2-2',
          type: 'bugfix',
          difficulty: 'medium',
          points: 15,
          prompt: { en: 'lastOf() returns undefined for every list. Off-by-one!', hi: 'lastOf() har list ke liye undefined deta hai. Off-by-one!' },
          hint: { en: 'length is one past the last valid index.', hi: 'length last valid index se ek aage hai.' },
          buggyCode: `export function lastOf<T extends { length: number }>(list: T): unknown {
  return list[list.length]
}`,
          fixedCode: `export function lastOf<T extends { length: number }>(list: T): unknown {
  return list[list.length - 1]
}`,
          testCode: `import { lastOf } from './solution'
console.log('Assert 1:', lastOf([1, 2, 3]) === 3)
console.log('Assert 2:', lastOf('hello') === 'o')`,
          explanation: { en: 'Indexes run 0..length-1, so the last element lives at length - 1.', hi: 'Index 0..length-1 tak chalte hain, toh last element length - 1 par hai.' },
        },
      ],
    },
  ],
}