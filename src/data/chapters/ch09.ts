import type { Chapter } from '../types'

export const chapter09: Chapter = {
  id: 'ch09',
  number: 9,
  title: { en: 'Advanced Types: keyof, Mapped & Conditional', hi: 'unnt taip: keyof, Mapped aur Conditional' },
  tagline: {
    en: 'Transform types like data — the type-level toolbox.',
    hi: 'deta kee trh taip ko bdlen — taip-str ka tulboks.',
  },
  color: '#22d3ee',
  objectives: [
    { en: 'Extract keys and value classes with keyof / indexed access', hi: 'keyof se kunjiyan nikalna' },
    { en: 'Map over properties with mapped types', hi: 'maipd taips se proprtee bdlna' },
    { en: 'Branch types with conditional types', hi: 'kndeeshnl taips se shakhaen' },
  ],
  lessons: [
    {
      id: 'l9-1',
      title: { en: 'keyof & Indexed Access', hi: 'keyof aur Indexed Access' },
      minutes: 8,
      sections: [
        {
          heading: { en: 'Keys as a type', hi: 'kunjiyan ek taip' },
          paragraphs: [
            {
              en: '`keyof` turns an object type into a union of its keys; indexed access `T["key"]` fetches the value type of a key.',
              hi: '`keyof` kisee objekt taip kee kunjiyon ka yuniyn bnata hai; `T["key"]` kunjee kee vailyu taip lata hai.',
            },
          ],
          blocks: [{
            kind: 'code',
            code: `type Config = { url: string; port: number; debug: boolean };
type ConfigKey = keyof Config;        // 'url' | 'port' | 'debug'
type UrlType = Config['url'];          // string

function get<K extends keyof Config>(c: Config, k: K): Config[K] {
  return c[k];   // returns the exact value type per key
}
`,
          }],
        },
      ],
      questions: [
        {
          id: 'q9-1-1',
          type: 'mcq',
          difficulty: 'medium',
          points: 15,
          prompt: { en: 'What is `keyof` of `{ a: string; b: number }`?', hi: '`{ a: string; b: number }` ka keyof kya hoga?' },
          options: [
            { en: "'a' | 'b'", hi: "'a' | 'b'" },
            { en: 'string | number', hi: 'string | number' },
            { en: "['a', 'b']", hi: "['a', 'b']" },
            { en: 'string', hi: 'string' },
          ],
          correctIndex: 0,
          explanation: { en: 'keyof yields the union of property names.', hi: 'keyof proprtee namon ka yuniyn deta hai.' },
        },
        {
          id: 'q9-1-2',
          type: 'truefalse',
          difficulty: 'easy',
          points: 10,
          prompt: { en: 'Evaluate:', hi: 'kthn sty ya asty:' },
          statement: { en: '`Type["property"]` is called indexed access and returns the property\'s type.', hi: '`Type["property"]` ko indexed access khte hain aur yh us proprtee ka taip lautata hai.' },
          answer: true,
          explanation: { en: 'Yes — exactly how Type["k"] reads value types.', hi: 'shee — Type["k"] se vailyu taip milta hai.' },
        },
      ],
    },
    {
      id: 'l9-2',
      title: { en: 'Mapped Types & Conditional Types', hi: 'Mapped aur Conditional taips' },
      minutes: 9,
      sections: [
        {
          heading: { en: 'Mapped types transform each key', hi: 'hr kunjee pr taip-bdlav' },
          paragraphs: [
            {
              en: 'Write `{ [K in keyof T]: ... }` to build a new type by transforming every property — read partial, required, readonly from this recipe.',
              hi: '`{ [K in keyof T]: ... }` se hr proprtee bdlkr nya taip bnta hai — Partial, Required, Readonly isee kism ke hain.',
            },
          ],
          blocks: [{
            kind: 'code',
            code: `type WithLabel<T> = { [K in keyof T]: T[K] } & { label: string };
type Nullable<T> = { [K in keyof T]: T[K] | null };

type User = { id: number; name: string };
type MaybeUser = Nullable<User>;  // { id: number | null; name: string | null }
`,
          }],
        },
        {
          heading: { en: 'Conditional types branch on types', hi: 'taip pr shakhaen (conditional types)' },
          paragraphs: [
            {
              en: '`T extends U ? X : Y` selects between two types. With infer inside, you can also unwrap generics — e.g. extract an array element type.',
              hi: '`T extends U ? X : Y` do taipon ke beech chunta hai; infer ke sath jenerik ko kholkr andr kee taip nikal skte hain.',
            },
          ],
          blocks: [{
            kind: 'code',
            code: `type Element<T> = T extends (infer E)[] ? E : never;
type A = Element<string[]>;   // string
type B = Element<number>;     // never

type Widen<T> = T extends string ? string : T extends number ? number : T;
type C = Widen<'hi'>;         // string
`,
          }],
        },
      ],
      questions: [
{
          id: 'q9-2-1',
          type: 'mcq',
          difficulty: 'hard',
          points: 25,
          prompt: { en: 'What is the type of `Box<number[]>`?', hi: '`Box<number[]>` ka taip kya hai?' },
          code: `type Box<T> = T extends number ? Box<T> : [T];`,
          options: [
            { en: '[number[]]', hi: '[number[]]' },
            { en: '{ value: number[] }', hi: '{ value: number[] }' },
            { en: 'number', hi: 'number' },
            { en: 'Box<number>', hi: 'Box<number>' },
          ],
          correctIndex: 0,
          explanation: {
            en: 'number[] does not extend number, so the conditional picks the false branch: [T] = [number[]].',
            hi: 'number[] ,number ko extend nheen krta islie conditional tyupl [number[]] chunta hai.',
          },
        },
        {
          id: 'q9-2-2',
          type: 'truefalse',
          difficulty: 'medium',
          points: 15,
          prompt: { en: 'Evaluate:', hi: 'kthn sty ya asty:' },
          statement: { en: '`infer` can only be used inside conditional types.', hi: '`infer` sirf conditional types ke andr upyog ho skta hai.' },
          answer: true,
          explanation: { en: 'infer is declared in the extends clause to capture a part of T.', hi: 'infer extends ke bhag men aakr T ka ek hissa pkdta hai.' },
        },

        {
          id: 'q9-2-3',
          type: 'bugfix',
          difficulty: 'medium',
          points: 15,
          prompt: { en: 'prefer() returns the opposite branch of what it should.', hi: 'prefer() galat branch return karta hai.' },
          hint: { en: 'When the flag matches the first arg, it should also return the first arg.', hi: 'Jab flag first arg hai, tab first arg return ho.' },
          buggyCode: `export function prefer(check: boolean, a: string, b: string): string {
  return check ? b : a
}`,
          fixedCode: `export function prefer(check: boolean, a: string, b: string): string {
  return check ? a : b
}`,
          testCode: `import { prefer } from './solution'
console.log('Assert 1:', prefer(true, 'on', 'off') === 'on')
console.log('Assert 2:', prefer(false, 'on', 'off') === 'off')`,
          explanation: { en: 'The ternary was inverted: true-branch returned b; the fix returns a when check is true.', hi: 'Ternary ulta tha: true hone par b wapas aata tha; fix men check true par a return hota hai.' },
        },
      ],
    },
  ],
}