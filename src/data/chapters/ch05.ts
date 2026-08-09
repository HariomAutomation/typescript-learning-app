import type { Chapter } from '../types'

export const chapter05: Chapter = {
  id: 'ch05',
  number: 5,
  title: { en: 'Generics: Type as a Parameter', hi: 'Generics: Type ek parameter ke roop mein' },
  tagline: {
    en: 'Write once, work for every type — the heart of reusable code.',
    hi: 'Ek baar likho, har type ke liye kaam kare — reusar code ka dil.',
  },
  color: '#fbbf24',
  objectives: [
    { en: 'Introduce type parameters and constraints', hi: 'Type parameters aur constraints se pehchan' },
    { en: 'Build generic helpers and collections', hi: 'Generic helpers aur collections banao' },
    { en: 'Spot where inference supplies the type args', hi: 'Jahan inference type args khud de deta hai, usse pehchano' },
  ],
  lessons: [
    {
      id: 'l5-1',
      title: { en: 'The identity of a generic', hi: 'Generic ki pehchan' },
      minutes: 8,
      sections: [
        {
          heading: { en: 'What a type parameter is', hi: 'Type parameter kya hota hai' },
          paragraphs: [
            {
              en: 'A generic function parameterizes the types it uses. `identity<T>(v: T): T` returns exactly what you put in.',
              hi: 'Generic function apne types ko parameterize karta hai. `identity<T>(v: T): T` jo aap daalte ho wahi return karta hai.',
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
          heading: { en: 'One function, many shapes', hi: 'Ek function, kai shapes' },
          paragraphs: [
            {
              en: 'Without generics you would copy-paste per type. With them you write one source and the checker instantiates it per usage.',
              hi: 'Generics ke bina har type ke liye code copy-paste karna padta. Generics se ek hi source likhte ho aur checker usse har usage ke hisaab se use karta hai.',
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
          prompt: { en: 'Write `last<T>(list)` that returns the last element.', hi: '`last<T>(list)` likho jo last element return kare.' },
          starterCode: `export function last<T>(list: T[]): T | undefined {
  // TODO
}`,
          hint: { en: 'Use length - 1.', hi: 'length - 1 use karo.' },
          testCode: `import { last } from './solution'
console.log('Assert 1:', last([1, 2, 3]) === 3)
console.log('Assert 2:', last([]) === undefined)
console.log('Assert 3:', last(['a', 'b']) === 'b')
`,
          explanation: {"en":"Index length-1, and return undefined for the empty array.","hi":"Index length-1 karo; empty array ke liye undefined return karo."},
        },
        {
          id: 'q5-1-2',
          type: 'mcq',
          difficulty: 'medium',
          points: 15,
          prompt: { en: 'What does `identity` infer when given `[1, 2]`?', hi: '`identity` ko `[1, 2]` dene par kaunsa type infer hoga?' },
          code: `function identity<T>(v: T): T {}`,
          options: [
            { en: 'number[]', hi: 'number[]' },
            { en: 'number', hi: 'number' },
            { en: 'unknown[]', hi: 'unknown[]' },
            { en: 'number | string', hi: 'number | string' },
          ],
          correctIndex: 0,
          explanation: { en: 'T infers to the whole array type.', hi: 'T pura array type ban jata hai.' },
        },
      ],
    },
    {
      id: 'l5-2',
      title: { en: 'Constraints & Multiple Parameters', hi: 'Constraints aur Multiple Parameters' },
      minutes: 9,
      sections: [
        {
          heading: { en: 'extends bounds the shape', hi: 'extends shape ko bound karta hai' },
          paragraphs: [
            {
              en: 'Constraints say "T must at least have these parts". Inside the generic you can only use the constrained features.',
              hi: 'Constraint kehta hai ki T ke paas kam se kam yeh parts hone chahiye. Generic ke andar aap sirf constrained features hi use kar sakte ho.',
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
          heading: { en: 'Multiple type parameters', hi: 'Multiple type parameters' },
          paragraphs: [
            {
              en: 'Generics compose: pairs, maps, and lookups all take multiple type params and infer each independently.',
              hi: 'Generics compose hote hain: pairs, maps, lookups sab multiple type params lete hain, aur har ek apni jagah khud infer hota hai.',
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
          prompt: { en: 'Evaluate:', hi: 'True holo False:' },
          statement: {
            en: 'A generic constrained with `extends` can use only the properties declared in the constraint inside the body.',
            hi: '`extends` se constrained generic apne body mein sirf wahi properties use kar sakta hai jo constraint mein declare hui hain.',
          },
          answer: true,
          explanation: { en: 'The checker guarantees only the constraint inside.', hi: 'Compiler ko bharosa hota hai sirf constraint par, isliye body mein bhi wahi available hota hai.' },
        },

        {
          id: 'q5-2-2',
          type: 'bugfix',
          difficulty: 'medium',
          points: 15,
          prompt: { en: 'lastOf() returns undefined for every list. Off-by-one!', hi: 'lastOf() har list ke liye undefined de raha hai. Off-by-one!' },
          hint: { en: 'length is one past the last valid index.', hi: 'length last valid index se ek aage hota hai.' },
          buggyCode: `export function lastOf<T extends { length: number }>(list: T): unknown {
  return list[list.length]
}`,
          fixedCode: `export function lastOf<T extends { length: number }>(list: T): unknown {
  return list[list.length - 1]
}`,
          testCode: `import { lastOf } from './solution'
console.log('Assert 1:', lastOf([1, 2, 3]) === 3)
console.log('Assert 2:', lastOf('hello') === 'o')`,
          explanation: { en: 'Indexes run 0..length-1, so the last element lives at length - 1.', hi: 'Index 0 se length-1 tak chalte hain, isliye last element length - 1 par hota hai.' },
        },
      ],
    },
  ],
}