import type { Chapter } from '../types'

export const chapter04: Chapter = {
  id: 'ch04',
  number: 4,
  title: { en: 'Narrowing & Control Flow', hi: 'Narrowing aur kntrol flo' },
  tagline: {
    en: 'The compiler shrinks unions as your code checks — learn to guide it.',
    hi: 'chek krte hee kmpailr yuniyn ko chhota krta hai — seekhen use rah dena.',
  },
  color: '#34d399',
  objectives: [
    { en: 'Understand the narrowing mental model', hi: 'narrowing ka mansik modl' },
    { en: 'Use typeof, truthiness, in, and instanceof', hi: 'typeof, truthiness, in aur instanceof' },
    { en: 'Build exhaustiveness with never', hi: 'never ke sath puree kvrej' },
  ],
  lessons: [
    {
      id: 'l4-1',
      title: { en: 'Guards & the narrow mental model', hi: 'gard aur narrowing ka modl' },
      minutes: 10,
      sections: [
        {
          heading: { en: 'The narrowing mental model', hi: 'narrowing ka mansik modl' },
          paragraphs: [
            {
              en: 'After a control-flow check, TypeScript narrows a union to the subset that survived it. Example: typeof on a string | number narrows the else-branch to number.',
              hi: 'hr chek ke bad TypeScript yuniyn ko chhantta hai jo chek se bchta hai. jaise typeof vale if ke else men sndeh number rh jata hai.',
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
          heading: { en: 'Truthiness is a guard', hi: 'Truthy-chek bhee ek gard hai' },
          paragraphs: [
            {
              en: 'If in a truthy branch → TS excludes falsy values: undefined, null, 0, "", NaN.',
              hi: 'Truthy valee shakha men undefined/null/0/""/NaN kt jate hain.',
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
              en: '"property" in obj narrows objects by presence; instanceof narrows by prototype chain.',
              hi: '"property" in obj proprtee kee maujudgee se chhantta hai; instanceof prototaip chen se.',
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
          prompt: { en: 'What prints to the console?', hi: 'knsol pr kya chhpega?' },
          code: `function classify(val: string | null): string {
  if (!val) return 'empty';
  return val.trim().length > 3 ? 'long' : 'short';
}
console.log(classify('hi'), classify(null), classify('hello'));
`,
          expected: 'short empty long',
          explanation: { en: 'Falsy null → "empty"; then trim/length branches decide.', hi: 'Falsy null → "empty"; bakee lmbaee ty krtee hai.' },
        },
        {
          id: 'q4-1-2',
          type: 'mcq',
          difficulty: 'hard',
          points: 25,
          prompt: { en: 'After the first if, what is the type of `x` in the else?', hi: 'phle if ke bad else men `x` ka taip kya hai?' },
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
          explanation: { en: 'The number branch returned, so the rest is string | null.', hi: 'number valee shakha laut gee, peechhe string | null bchta hai.' },
        },
      ],
    },
    {
      id: 'l4-2',
      title: { en: 'Discriminated Unions & Exhaustiveness', hi: 'Discriminated yuniyn aur Exhaustiveness' },
      minutes: 9,
      sections: [
        {
          heading: { en: 'The discriminated union pattern', hi: 'discriminated yuniyn paitrn' },
          paragraphs: [
            {
              en: 'Give each member a literal discriminant property; switching on it gives you full narrowing in every branch.',
              hi: 'hr sdsy ko ek litrl diskriminent proprtee den; us pr switch krte hee hr branch men puree narrowing miltee hai.',
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
          heading: { en: 'Exhaustiveness with never', hi: 'never ke sath smpurnta' },
          paragraphs: [
            {
              en: 'Add a default case that assigns the remaining event to never — if you add a new variant later, the compiler screams wherever you forgot a branch.',
              hi: 'default kes men bche hue event ko never asain kren— nya verient jodte hee bhulee huee jghen kmpailr dikhata hai.',
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
          prompt: { en: 'Evaluate:', hi: 'kthn sty ya asty:' },
          statement: { en: 'Property `kind` with literal values is a valid discriminant for a union.', hi: 'litrl vailyu vala `kind` proprtee diskriminent ho skta hai.' },
          answer: true,
          explanation: { en: 'A single common property with distinct literal values is exactly a discriminant.', hi: 'ek samany litikl-man valee proprtee hee discriminant khlatee hai.' },
        },
        {
          id: 'q4-2-2',
          type: 'code',
          difficulty: 'hard',
          points: 25,
          prompt: {
            en: 'Write area(shape) for the circle/square discriminated union below.',
            hi: 'neeche vale circle/square yuniyn ke lie area() likhen.',
          },
          starterCode: `type CircleShape = { kind: 'circle'; radius: number }
type SquareShape = { kind: 'square'; side: number }
type Shape = CircleShape | SquareShape

export function area(shape: Shape): number {
  // TODO
}`,
          hint: { en: 'Discriminated narrowing lets radius/side be accessed safely.', hi: 'Discriminant narrowing se radius/side surkshit milte hain.' },
          testCode: `import { area } from './solution'
console.log('Assert 1:', area({ kind: 'circle', radius: 1 }) === Math.PI)
console.log('Assert 2:', area({ kind: 'square', side: 4 }) === 16)
`,
          explanation: {"en":"Switch on the kind discriminant then use radius/side.","hi":"kind pr switch krke radius/side istemal kren."},
        },

        {
          id: 'q4-2-3',
          type: 'bugfix',
          difficulty: 'medium',
          points: 15,
          prompt: { en: 'area() of a square returns NaN. The switch is missing a case.', hi: 'square ka area NaN deta hai. switch mein case missing hai.' },
          hint: { en: 'radial is not defined on the square side; use the square case + default fallback.', hi: 'Square par radius nahi hota; square case aur default fallback istemal karo.' },
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
          explanation: { en: 'After the circle case, square objects fell through to the circle formula — the fix adds the missing case and exhaustive return.', hi: 'circle case ke baad square wale circle formula mein ghir jaate the; fix mein missing case joda gaya hai.' },
        },
      ],
    },
  ],
}