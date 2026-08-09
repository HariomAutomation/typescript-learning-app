import type { Chapter } from '../types'

export const chapter04: Chapter = {
  id: 'ch04',
  number: 4,
  title: { en: 'Narrowing & Control Flow', hi: 'Narrowing aur Control Flow' },
  tagline: {
    en: 'The compiler shrinks unions as your code checks — learn to guide it.',
    hi: 'Jaise hi aap checks karte ho, compiler union ko chhota karta jaata hai — use guide karna seekho.',
  },
  color: '#34d399',
  objectives: [
    { en: 'Understand the narrowing mental model', hi: 'Narrowing ka mental model samjho' },
    { en: 'Use typeof, truthiness, in, and instanceof', hi: 'typeof, truthiness, in aur instanceof use karo' },
    { en: 'Build exhaustiveness with never', hi: 'never ke saath exhaustiveness banao' },
  ],
  lessons: [
    {
      id: 'l4-1',
      title: { en: 'Guards & the narrow mental model', hi: 'Guards aur narrowing ka model' },
      minutes: 10,
      sections: [
        {
          heading: { en: 'The narrowing mental model', hi: 'Narrowing ka mental model' },
          paragraphs: [
            {
              en: 'After a control-flow check, TypeScript narrows a union to the subset that survived it. Example: typeof on a string | number narrows the else-branch to number.',
              hi: 'Har control-flow check ke baad TypeScript union ko chhant kar wohi subset rakhta hai jo check se bachta hai. Jaise: string | number par typeof check karne par else-branch mein number reh jata hai.',
            },
          ],
          blocks: [{
            kind: 'code',
            code: `function render(input: string | number | boolean) {
  if (typeof input === 'string') return input.toUpperCase();
  if (typeof input === 'number') return input.toFixed(2);
  return input ? 'yes' : 'no';      // boolean narrowed here
}
`,
          }],
        },
        {
          heading: { en: 'Truthiness is a guard', hi: 'Truthy check bhi ek guard hai' },
          paragraphs: [
            {
              en: 'If in a truthy branch → TS excludes falsy values: undefined, null, 0, "", NaN.',
              hi: 'Truthy branch mein TypeScript falsy values — undefined, null, 0, "", NaN — ko remove kar deta hai.',
            },
          ],
          blocks: [{
            kind: 'code',
            code: `function log(name?: string) {
  if (name) return console.log(name.toUpperCase());
  console.log('anonymous');
}
`,
          }],
        },
        {
          heading: { en: 'in and instanceof', hi: 'in aur instanceof' },
          paragraphs: [
            {
              en: '"property" in obj narrows objects by property presence; instanceof narrows by prototype chain.',
              hi: '"property" in obj objects ko property ki maujoodgi se narrow karta hai; instanceof prototype chain se narrow karta hai.',
            },
          ],
        },
      ],
      questions: [
        {
          id: 'q4-1-1',
          type: 'output',
          difficulty: 'medium',
          points: 15,
          prompt: { en: 'What prints to the console?', hi: 'Console par kya print hoga?' },
          code: `function classify(val: string | null): string {
  if (!val) return 'empty';
  return val.trim().length > 3 ? 'long' : 'short';
}
console.log(classify('hi'), classify(null), classify('hello'));
`,
          expected: 'short empty long',
          explanation: { en: 'Falsy null → "empty"; then trim/length branches decide.', hi: 'Falsy null → "empty"; phir length decide kar deti hai.' },
        },
        {
          id: 'q4-1-2',
          type: 'mcq',
          difficulty: 'hard',
          points: 25,
          prompt: { en: 'After the first if, what is the type of `x` in the else?', hi: 'Pehle if ke baad else mein `x` ka type kya hai?' },
          code: `function f(x: number | string | null) {
  if (typeof x === 'number') return x * 2;
  // type of x here:
}`,
          options: [
            { en: 'string | null', hi: 'string | null' },
            { en: 'string', hi: 'string' },
            { en: 'number | string', hi: 'number | string' },
            { en: 'unknown', hi: 'unknown' },
          ],
          correctIndex: 0,
          explanation: { en: 'The number branch returned, so the rest is string | null.', hi: 'Number wali branch return ho gayi, to peechhe string | null reh jata hai.' },
        },
      ],
    },
    {
      id: 'l4-2',
      title: { en: 'Discriminated Unions & Exhaustiveness', hi: 'Discriminated Unions aur Exhaustiveness' },
      minutes: 9,
      sections: [
        {
          heading: { en: 'The discriminated union pattern', hi: 'Discriminated union pattern' },
          paragraphs: [
            {
              en: 'Give each member a literal discriminant property; switching on it gives you full narrowing in every branch.',
              hi: 'Har member ko ek literal discriminant property do; us par switch karne se, baaki harr branch mein full narrowing milti hai.',
            },
          ],
          blocks: [{
            kind: 'code',
            code: `type Event =
  | { type: 'click'; x: number; y: number }
  | { type: 'key'; key: string }
  | { type: 'scroll'; delta: number };

function handle(e: Event): string {
  switch (e.type) {
    case 'click': return \`click at \${e.x},\${e.y}\`;
    case 'key':   return \`key \${e.key}\`;
    case 'blur':  return \`scroll \${e.delta}\`;
  }
}
`,
          }],
        },
        {
          heading: { en: 'Exhaustiveness with never', hi: 'Never ke saath exhaustiveness' },
          paragraphs: [
            {
              en: 'Add a default case that assigns the remaining event to never — if you add a new variant later, the compiler flags every branch you forgot to update.',
              hi: 'Ek default case jodo jo baaki bache huye event ko never assign kare — agar baad mein naya variant jodte ho, to compiler har woh jagah dikha dega jahan branch miss hui hai.',
            },
          ],
          blocks: [{
            kind: 'code',
            code: `function assertNever(x: never): never { throw new Error('Unexhausted: ' + x); }
function handle(e: Event): string {
  switch (e.type) {
    // ...cases...
    default: return assertNever(e); // one new type → compile error here
  }
}
`,
          }],
        },
      ],
      questions: [
        {
          id: 'q4-2-1',
          type: 'truefalse',
          difficulty: 'medium',
          points: 15,
          prompt: { en: 'Evaluate:', hi: 'True ya False:' },
          statement: { en: 'Property `kind` with literal values is a valid discriminant for a union.', hi: 'Literal values wali `kind` property ek valid discriminant ho sakti hai.' },
          answer: true,
          explanation: { en: 'A single common property with distinct literal values is exactly a discriminant.', hi: 'Distinct literal values wali ek common property hi discriminant kehlati hai.' },
        },
        {
          id: 'q4-2-2',
          type: 'code',
          difficulty: 'hard',
          points: 25,
          prompt: {
            en: 'Write area(shape) for the circle/square discriminated union below.',
            hi: 'Neeche wale circle/square union ke liye area() likho.',
          },
          starterCode: `type CircleShape = { kind: 'circle'; radius: number }
type SquareShape = { kind: 'square'; side: number }
type Shape = CircleShape | SquareShape

export function area(shape: Shape): number {
  // TODO
}`,
          hint: { en: 'Discriminated narrowing lets radius/side be accessed safely.', hi: 'Discriminant narrowing se radius/side safely access hote hain.' },
          testCode: `import { area } from './solution'
console.log('Assert 1:', area({ kind: 'circle', radius: 1 }) === Math.PI)
console.log('Assert 2:', area({ kind: 'square', side: 4 }) === 16)
`,
          explanation: {"en":"Switch on the kind discriminant then use radius/side.","hi":"Kind par switch karke radius/side use karo."},
        },

        {
          id: 'q4-2-3',
          type: 'bugfix',
          difficulty: 'medium',
          points: 15,
          prompt: { en: 'area() of a square returns NaN. The switch is missing a case.', hi: 'Square ka area NaN de raha hai. Switch mein case missing hai.' },
          hint: { en: 'radial is not defined on the square side; add the square case and return there.', hi: 'Square par radius nahi hota; square case jodo aur wahi return karo.' },
          buggyCode: `export type Shape =
  | { kind: 'circle'; radius: number }
  | { kind: 'square'; side: number }

export function area(shape: Shape): number {
  switch (shape.kind) {
    case 'circle':
      return Math.PI * shape.radius * shape.radius
  }
  return shape.radius * shape.radius
}`,
          fixedCode: `export type Shape =
  | { kind: 'circle'; radius: number }
  | { kind: 'square'; side: number }

export function area(shape: Shape): number {
  switch (shape.kind) {
    case 'circle':
      return Math.PI * shape.radius * shape.radius
    case 'square':
      return shape.side * shape.side
  }
}`,
          testCode: `import { area } from './solution'
console.log('Assert 1:', area({ kind: 'circle', radius: 1 }) === Math.PI)
console.log('Assert 2:', area({ kind: 'square', side: 4 }) === 16)`,
          explanation: { en: 'After the circle case, square objects fell through to the circle formula — the fix adds the missing case and exhaustive return.', hi: 'Circle case ke baad square objects circle formula mein gir jate the; fix mein missing case jod kar exhaustive return kiya gaya hai.' },
        },
      ],
    },
  ],
}