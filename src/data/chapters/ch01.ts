import type { Chapter } from '../types'

export const chapter01: Chapter = {
  id: 'ch01',
  number: 1,
  title: {
    en: 'Why TypeScript & The Toolchain',
    hi: 'TypeScript kyon aur upkrn',
  },
  tagline: {
    en: 'Understand what TypeScript actually is — and where your code goes when you run it.',
    hi: 'smjhen ki TypeScript vastv men kya hai — aur aapka kod chlte smy khan jata hai.',
  },
  color: '#6c8bff',
  objectives: [
    { en: 'Explain the difference between TypeScript and JavaScript', hi: 'TypeScript aur JavaScript ke beech antr smjhana' },
    { en: 'Follow the compile → JavaScript → run pipeline', hi: 'kmpail → JavaScript → chlane kee prkriya ko smjhna' },
    { en: 'Read annotations and trust local inference', hi: 'enoteshn pdhna aur lokl imfrens pr bhrosa krna' },
    { en: 'Know `any`, `unknown` and strict-mode fears', hi: '`any`, `unknown` aur strict mod kee bareekiyan janna' },
  ],
  lessons: [
    {
      id: 'l01-1',
      title: { en: 'What is TypeScript?', hi: 'TypeScript kya hai?' },
      minutes: 8,
      sections: [
        {
          heading: { en: 'A super-set, not a language', hi: 'bhasha nheen, ek suprset' },
          paragraphs: [
            {
              en: 'TypeScript is JavaScript with a type system bolted on. Every valid JavaScript program is a valid TypeScript program — but TypeScript adds annotations, checks and inference that run before your code executes.',
              hi: 'TypeScript JavaScript hai jiske oopr ek taip-sistm lga hai. hr vaidh JavaScript program, ek vaidh TypeScript program bhee hai — lekin TypeScript men enoteshn, janch aur imfrens jude hote hain jo aapka kod chlne se phle kam krte hain.',
            },
            {
              en: 'The super-powers come from the runtime layer being erased: the browser and Node.js just see the JavaScript that TypeScript produced.',
              hi: 'supr-pavr rntaim leyr ke mit jane se aatee hai: braujr aur Node.js kevl us JavaScript ko dekhte hain jo TypeScript ne bnaee.',
            },
          ],
          blocks: [
            {
              kind: 'code',
              code: `// TypeScript (what you write)          // JavaScript (what runs)
let title: string = "TS Course"              let title = "TS Course";
title = 42; // ❌ type error             title = 42;   // ✅ runs fine
`,
            },
          ],
        },
        {
          heading: { en: 'Three jobs of the compiler', hi: 'kmpailr kee teen bhumikaen' },
          paragraphs: [
            {
              en: 'tsc (the TypeScript compiler) performs three jobs: 1) type-check your program, 2) erass type annotations, 3) transform newer syntax to older JavaScript if you ask it to. Only job 2 always happens — checking is on top; transform depends on your "target".',
              hi: 'tsc (TypeScript kmpailr) teen kam krta hai: 1) aapke program kee janch, 2) prkaron ko mitana, 3) nee jankaree ko puranee JavaScript men bdlna. kevl kam 2 hmesha hota hai.',
            },
          ],
        },
        {
          heading: { en: 'The pipeline at a glance', hi: 'ek njr men paiplain' },
          paragraphs: [
            {
              en: 'Your .ts source → type-checks → emit → plain JavaScript → engine runs it. The compiler IS your friend, it catches errors between the two steps.',
              hi: 'aapka .ts sors → taip-chek → jnret → sada JavaScript → injn chlata hai. kmpailr aapka dost hai: vh in do chrnon ke beech gltiyan pkdta hai.',
            },
          ],
          blocks: [
            {
              kind: 'code',
              code: `greet(name: string): void { ... }   // tsc
               ↓
function greet(name) { ... }              // JS to the engine
`,
            },
          ],
        },
      ],
      behindScenes: {
        title: { en: 'Peek: compiled output side-by-side', hi: 'jhankee: kmpaild aautput sath-sath' },
        description: {
          en: 'Compare the original .ts and the emitted JavaScript mentally — annotation vanish, control flow stays.',
          hi: 'mul .ts aur bntee JavaScript kee tulna kren — enoteshn gayb, niyntrn rhta hai.',
        },
        visual: 'compiled-js',
        blocks: [
          {
            heading: { en: 'See the erase step', hi: 'mitane vala kdm dekhen' },
            paragraphs: [
              {
                en: 'Inside the Playground, the "AST & Compilation" panel shows you the actual emitted JavaScript for any snippet. Try it with the example above.',
                hi: 'plegraund men "AST aur kmpaileshn" vala painl oopr ke udahrn ke lie vastvik JavaScript dikhata hai. aajmaie!',
              },
            ],
          },
        ],
      },
      questions: [
        {
          id: 'q01-1-1',
          type: 'mcq',
          difficulty: 'easy',
          points: 10,
          prompt: {
            en: 'What does the TypeScript compiler ALWAYS do?',
            hi: 'TypeScript kmpailr hmesha kya krta hai?',
          },
          options: [
            { en: 'Runs your code in the browser', hi: 'aapka kod braujr men chlata hai' },
            { en: 'Erases annotations and produces JavaScript', hi: 'enoteshn mitakr JavaScript bnata hai' },
            { en: 'Ships TypeScript to the user', hi: 'yujr ko TypeScript bhejta hai' },
            { en: 'Minifies and compresses your code', hi: 'kod ka aakar ghtata hai' },
          ],
          correctIndex: 1,
          explanation: {
            en: 'The compiler always erases type annotations and emits JavaScript. Type-checking and transformation depend on flags and target.',
            hi: 'kmpailr hmesha enoteshn mitakr JavaScript bnata hai. janch aur bdlav flags aur target pr nirbhr krtee hain.',
          },
        },
        {
          id: 'q1-1-2',
          type: 'truefalse',
          difficulty: 'easy',
          points: 10,
          prompt: {
            en: 'Evaluate the statement below.',
            hi: 'neeche vale kthn ka mulyankn kren.',
          },
          statement: {
            en: 'The browser executes TypeScript sources directly, without a compilation step.',
            hi: 'braujr TypeScript sors ko seedhe chlata hai, bina kmpail kie.',
          },
          answer: false,
          explanation: {
            en: 'Browsers understand JavaScript only. TypeScript is stage-incorporated before any engine sees it.',
            hi: 'braujr kevl JavaScript smjhte hain. TypeScript kisee bhee injn tk phunchne se phle kmpail hotee hai.',
          },
        },
      ],
      exercise: {
        prompt: {
          en: 'Write a function greet(name) that returns "Hello, " + name. Watch out: input may be undefined.',
          hi: 'Ek greet(name) function likho jo "Hello, " + name return kare. Sachet raho: input undefined ho sakta hai.',
        },
        starterCode: `export function greet(name?: string): string {
  // ✏️ your code here
}`,
        hint: {
          en: 'Default parameter: name = "stranger".',
          hi: 'Default parameter: name = "stranger".',
        },
        testCode: `import { greet } from './solution'
console.log('Assert 1:', greet('Riya') === 'Hello, Riya')
console.log('Assert 2:', greet(undefined) === 'Hello, stranger')`,
      },
    },
    {
      id: 'l1-2',
      title: { en: 'Annotations & Inference', hi: 'enoteshn aur imfrens' },
      minutes: 10,
      sections: [
        {
          heading: { en: 'What you write vs what you must', hi: 'aap kya likhte hain aur kya tatkalik' },
          paragraphs: [
            {
              en: 'Annotations are hints you write yourself; inference is the compiler guessing from the initial value and usage. A typed language is usually Java where you annotate everything — TypeScript builds happily letting the compiler infer.',
              hi: 'enoteshn khud likhe ge ishare hain; imfrens kmpailr ka anuman hai. TypeScript men jhan ho ske kmpailr pr anuman lgne dena aaramdayk shailee hai.',
            },
          ],
          blocks: [
            {
              kind: 'code',
              code: `const meeting = new Date();   // Date — inferred
let live: boolean = true;      // boolean — annotated
function avg(a: number, b: number): number {
  return (a + b) / 2;
}
`,
            },
          ],
        },
        {
          heading: { en: 'Parameters first, returns second', hi: 'phle pairameetr, fir ritrn' },
          paragraphs: [
            {
              en: 'Parameter types are almost always worth writing — they define the contract. Return types are nice for complex functions; for tiny ones inference suffices.',
              hi: 'pairameetr taip lgbhg hmesha likhne ke layk hain — ve kol krne ka anubndh bnate hain. ritrn taip jtil fnkshnon ke lie mhtvpurn hain; chhoton men imfrens kafee hota hai.',
            },
          ],
          blocks: [
            {
              kind: 'code',
              code: `// Optional and default parameters
function log(message: string, level = 'info'): void {
  console.log(\`[\${level}] \${message}\`);
}
log('Hello');          // [info] Hello
log('Error!', 'warn'); // [warn] Error!
`,
            },
          ],
        },
        {
          heading: { en: 'Arrays and objects need types too', hi: 'aire aur objekt ko bhee taip chahie' },
          paragraphs: [
            {
              en: 'Annotate what changes or comes from the outside. Everything else trusts inference — that is the “strict but comfortable” sweet spot.',
              hi: 'jo bdlta hai ya bahr se aata hai use enotet kren; bakee imfrens pr chhod den.',
            },
          ],
          blocks: [
            {
              kind: 'code',
              code: `const scores: number[] = [1, 2, 3];
const user: { name: string; age: number } = { name: 'Hari', age: 21 };
`,
            },
          ],
        },
      ],
      questions: [
        {
          id: 'q1-2-1',
          type: 'output',
          difficulty: 'medium',
          points: 15,
          prompt: { en: 'What does the console print?', hi: 'knsol kya print krta hai?' },
          code: `function repeat(txt: string, n = 2): string {
  return txt.repeat(n);
}
console.log(repeat('Ta'));
`,
          expected: `TaTa`,
          explanation: {
            en: 'The default parameter applies; repeat() joins "Ta" twice.',
            hi: 'difolt pairameetr lgta hai; repeat() "Ta" ko do bar jodta hai.',
          },
        },
        {
          id: 'q1-2-2',
          type: 'mcq',
          difficulty: 'easy',
          points: 10,
          prompt: { en: 'Which annotation is missing to the compile?', hi: 'kmpail hone ke lie kaun-see enoteshn jruree hai?' },
          code: `const price = 19.99;   price += 1;`,
          options: [
            { en: 'const price: number', hi: 'const price: number' },
            { en: 'None — the type is inferred', hi: 'koee nheen — taip anumanit ho jaega' },
            { en: 'let price: any', hi: 'let price: any' },
            { en: 'const price: string', hi: 'const price: string' },
          ],
          correctIndex: 1,
          explanation: {
            en: 'Inference figures out "number" from the initial value; no annotation is required for the compiler to be happy.',
            hi: 'prarmbhik man se imfrens "number" smjh leta hai; koee enoteshn jruree nheen.',
          },
        },
      ],
    },
    {
      id: 'l1-3',
      title: { en: 'any, unknown & strict mode', hi: 'any, unknown aur strict mod' },
      minutes: 8,
      sections: [
        {
          heading: { en: 'any is a type pillar (not a safe one)', hi: 'any ek dheelee taip hai (surkshit nheen)' },
          paragraphs: [
            {
              en: 'any switches off checking for a value, turning your compiler into a whisper. Mildly useful in migrations; harmful daily. strict-mode: turn every time you see an implicit any as a sign to infer or annotate.',
              hi: 'any kisee vailyu ke lie janch bnd kr deta hai — aapka kmpailr chup. maigreshn men thoda upyogee, jyadatr jghon pr hanikark.',
            },
          ],
          blocks: [
            { kind: 'code', code: `let a: any = 5;
a.toUpperCase();          // ✋ auto no error — crash at runtime!
let u: unknown = 5;
if (typeof u === 'string') u.toUpperCase(); // safe: we checked
` },
          ],
        },
        {
          heading: { en: 'unknown: the honest anything', hi: 'unknown: eemandar "kuchh bhee"' },
          paragraphs: [
            {
              en: 'unknown lets you assign anything, but requires a check before use — the type system forces the narrowing step. Use it when a value comes from JSON or an API.',
              hi: 'unknown se kuchh bhee asain ho skta hai, pr upyog se phle chek krna jruree hai — taip-sistm aapko janchne pr mjbur krta hai. yh API/JSON valon ke lie.',
            },
          ],
        },
        {
          heading: { en: 'Strict mode is non-negotiable', hi: 'strict mod anidary hai' },
          paragraphs: [
            {
              en: 'Four flags — strict optional, noImplicitAny, strictNullChecks, strictFunctionTypes — are the difference between "auto-checks me" and "build-time you are on your own". Always strict: true.',
              hi: 'char flags — strict, noImplicitAny, strictNullChecks, strictFunctionTypes — svchalit janch aur khud ghumte pairon ke beech ka antr bnate hain. hmesha strict: true rkhen.',
            },
          ],
        },
      ],
      questions: [
        {
          id: 'q1-3-1',
          type: 'mcq',
          difficulty: 'medium',
          points: 15,
          prompt: { en: 'Which choice is the correct escape hatch for a JSON API response?', hi: 'JSON API rispons ke lie kaun-sa prkar shee eskep hai?' },
          options: [
            { en: 'let data: any = await res.json()', hi: 'any' },
            { en: 'let data: unknown = await res.json()', hi: 'unknown' },
            { en: 'let data = await res.json()', hi: 'without annotation' },
            { en: 'let data: number = await res.json()', hi: 'number' },
          ],
          correctIndex: 1,
          explanation: {
            en: 'unknown forces a runtime check before use, which is what you want for data whose shape is not guaranteed.',
            hi: 'unknown upyog se phle rntaim-janch krvata hai, bahree deta ke lie.',
          },
        },

        {   id: 'q1-3-2',
          type: 'bugfix',
          difficulty: 'easy',
          points: 10,
          prompt: { en: 'shout() crashes when the input is not a string. Fix the bug.', hi: 'shout() jab input string na ho to crsh ho jata hai. bug fix karo.' },
          hint: { en: 'typeof-checks the unknown before calling string methods.', hi: 'unknown ko istemal karne se pehle typeof se check karo.' },
          buggyCode: `export function shout(message: unknown): string {
  return 'HEY ' + message.toUpperCase()
}`,
          fixedCode: `export function shout(message: unknown): string {
  const text = typeof message === 'string' ? message : String(message)
  return 'HEY ' + text.toUpperCase()
}`,
          testCode: `import { shout } from './solution'
console.log('Assert 1:', shout('tara') === 'HEY TARA')
console.log('Assert 2:', shout(42) === 'HEY 42')`,
          explanation: { en: 'unknown values must be narrowed before use; String(message) handles the non-string path safely.', hi: 'unknown value ko use karne se pehle narrow karna zaroori hai; baaki case ko String(message) sambhalta hai.' },
        },
      ],
    },
  ],
}