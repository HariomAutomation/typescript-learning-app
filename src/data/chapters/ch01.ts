import type { Chapter } from '../types'

export const chapter01: Chapter = {
  id: 'ch01',
  number: 1,
  title: {
    en: 'Why TypeScript & The Toolchain',
    hi: 'TypeScript kyun aur uske tools',
  },
  tagline: {
    en: 'Understand what TypeScript actually is — and where your code goes when you run it.',
    hi: 'Samjho ki TypeScript asal mein kya hai — aur aapki code run karne par kahan jaati hai.',
  },
  color: '#6c8bff',
  objectives: [
    { en: 'Explain the difference between TypeScript and JavaScript', hi: 'TypeScript aur JavaScript ke beech ka difference samjhao' },
    { en: 'Follow the compile → JavaScript → run pipeline', hi: 'compile → JavaScript → run ki puri pipeline samjho' },
    { en: 'Read annotations and trust local inference', hi: 'Annotations padhna aur local inference par bharosa karna' },
    { en: 'Know `any`, `unknown` and strict-mode fears', hi: '`any`, `unknown` aur strict mode ki baareekiyaan jaan' },
  ],
  lessons: [
    {
      id: 'l01-1',
      title: { en: 'What is TypeScript?', hi: 'TypeScript kya hai?' },
      minutes: 8,
      sections: [
        {
          heading: { en: 'A super-set, not a language', hi: 'Language nahi, ek super-set' },
          paragraphs: [
            {
              en: 'TypeScript is JavaScript with a type system bolted on. Every valid JavaScript program is a valid TypeScript program — but TypeScript adds annotations, checks and inference that run before your code executes.',
              hi: 'TypeScript JavaScript hi hai, bas uske upar ek type system lagaya gaya hai. Har valid JavaScript program, valid TypeScript program bhi hai — lekin TypeScript mein annotations, checks aur inference jud jate hain jo aapki code ke chalne se pehle kaam karte hain.',
            },
            {
              en: 'The super-powers come from the runtime layer being erased: the browser and Node.js just see the JavaScript that TypeScript produced.',
              hi: 'Yeh super-powers runtime layer ke erase ho jaane se aati hain: browser aur Node.js sirf wahi JavaScript dekhte hain jo TypeScript ne banayi.',
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
          heading: { en: 'Three jobs of the compiler', hi: 'Compiler ke teen kaam' },
          paragraphs: [
            {
              en: 'tsc (the TypeScript compiler) performs three jobs: 1) type-check your program, 2) erass type annotations, 3) transform newer syntax to older JavaScript if you ask it to. Only job 2 always happens — checking is on top; transform depends on your "target".',
              hi: 'tsc (TypeScript compiler) teen kaam karta hai: 1) aapke program ka type-check karna, 2) type annotations ko erase karna, 3) agar aap bolo to nayi syntax ko purani JavaScript mein transform karna. Sirf kaam number 2 hamesha hota hai — checking aap par nirbhar hai, aur transform aapke "target" par.',
            },
          ],
        },
        {
          heading: { en: 'The pipeline at a glance', hi: 'Pipeline ek nazar mein' },
          paragraphs: [
            {
              en: 'Your .ts sources → type-checks → emit → plain JavaScript → engine runs it. The compiler IS your friend, it catches errors between the two steps.',
              hi: 'Aapki .ts source → type-check → emit → plain JavaScript → engine usse chalata hai. Compiler aapka dost hai: wo in dono steps ke beech errors pakad leta hai.',
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
        title: { en: 'Peek: compiled output side-by-side', hi: 'Jhalak: compiled output side-by-side' },
        description: {
          en: 'Compare the original .ts and the emitted JavaScript mentally — annotations vanish, control flow stays.',
          hi: 'Original .ts aur emitted JavaScript ki aapas mein compare karo — annotations gayab, control flow waisa hi hai.',
        },
        visual: 'compiled-js',
        blocks: [
          {
            heading: { en: 'See the erase step', hi: 'Erase wala step dekho' },
            paragraphs: [
              {
                en: 'Inside the Playground, the "AST & Compilation" panel shows you the actual emitted JavaScript for any snippet. Try it with the example above.',
                hi: 'Playground mein "AST aur Compilation" wala panel kisi bhi snippet ka actual emitted JavaScript dikhata hai. Upar wale example ke saath try karo!',
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
            hi: 'TypeScript compiler hamesha kya karta hai?',
          },
          options: [
            { en: 'Runs your code in the browser', hi: 'Aapki code browser mein chalata hai' },
            { en: 'Erases annotations and produces JavaScript', hi: 'Annotations erase karke JavaScript banata hai' },
            { en: 'Ships TypeScript to the user', hi: 'User tak TypeScript bhejta hai' },
            { en: 'Minifies and compresses your code', hi: 'Code ka size ghatata hai' },
          ],
          correctIndex: 1,
          explanation: {
            en: 'The compiler always erases type annotations and emits JavaScript. Type-checking and transformation depend on flags and target.',
            hi: 'Compiler hamesha type annotations erase karke JavaScript emit karta hai. Type-checking aur transformation flags aur target par depend karte hain.',
          },
        },
        {
          id: 'q1-1-2',
          type: 'truefalse',
          difficulty: 'easy',
          points: 10,
          prompt: {
            en: 'Evaluate the statement below.',
            hi: 'Neeche wale statement ka mulyankan karo.',
          },
          statement: {
            en: 'The browser executes TypeScript sources directly, without a compilation step.',
            hi: 'Browser TypeScript source ko bina compilation ke directly chala deta hai.',
          },
          answer: false,
          explanation: {
            en: 'Browsers understand JavaScript only. TypeScript is stage-incorporated before any engine sees it.',
            hi: 'Browser sirf JavaScript samajhte hain. TypeScript ko engine tak pahunchne se pehle compile karna padta hai.',
          },
        },
      ],
      exercise: {
        prompt: {
          en: 'Write a function greet(name) that returns "Hello, " + name. Watch out: input may be undefined.',
          hi: 'Ek greet(name) function likho jo "Hello, " + name return kare. Dhyan rahe: input undefined ho sakta hai.',
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
      title: { en: 'Annotations & Inference', hi: 'Annotations aur Inference' },
      minutes: 10,
      sections: [
        {
          heading: { en: 'What you write vs what you must', hi: 'Jo aap khud likhte hain vs jo zaroori hai' },
          paragraphs: [
            {
              en: 'Annotations are hints you write yourself; inference is the compiler guessing from the initial value and usage. A typed language is usually Java where you annotate everything — TypeScript builds happily letting the compiler infer.',
              hi: 'Annotations wo hints hain jo aap khud likhte ho; inference compiler ka guess hai jo initial value aur usage se lagta hai. Java jaise languages mein aapko sab kuch annotate karna padta hai — TypeScript mein compiler ko infer karne dena comfortable aur recommended style hai.',
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
          heading: { en: 'Parameters first, returns second', hi: 'Pehle parameters, phir returns' },
          paragraphs: [
            {
              en: 'Parameter types are almost always worth writing — they define the contract. Return types are nice for complex functions; for tiny ones inference does the job.',
              hi: 'Parameter types almost hamesha likhne chahiye — ye contract define karte hain. Complex functions ke liye return types zaroori hain; chhote functions mein inference kaafi hota hai.',
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
          heading: { en: 'Arrays and objects need types too', hi: 'Arrays aur objects ko bhi types chahiye' },
          paragraphs: [
            {
              en: 'Annotate what changes or comes from the outside. Everything else trusts inference — that is the "strict but comfortable" sweet spot.',
              hi: 'Jo bhi badalta hai ya bahar se aata hai, usse annotate karo; baaki sab inference par chhod do — yahi "strict but comfortable" sweet spot hai.',
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
          prompt: { en: 'What does the console print?', hi: 'Console kya print karta hai?' },
          code: `function repeat(txt: string, n = 2): string {
  return txt.repeat(n);
}
console.log(repeat('Ta'));
`,
          expected: `TaTa`,
          explanation: {
            en: 'The default parameter applies; repeat() joins "Ta" twice.',
            hi: 'Default parameter lag jata hain, to "Ta" repeat() do baar bhej deta hai, isliye "TaTa" banta hai.',
          },
        },
        {
          id: 'q1-2-2',
          type: 'mcq',
          difficulty: 'easy',
          points: 10,
          prompt: { en: 'Which annotation is missing to compile?', hi: 'Compile hone ke liye kaun si annotation zaroori hai?' },
          code: `const price = 19.99;   price += 1;`,
          options: [
            { en: 'const price: number', hi: 'const price: number' },
            { en: 'None — the type is inferred', hi: 'Koi nahi — type infer ho jata hai' },
            { en: 'let price: any', hi: 'let price: any' },
            { en: 'const price: string', hi: 'const price: string' },
          ],
          correctIndex: 1,
          explanation: {
            en: 'Inference figures out "number" from the initial value; no annotation is required for the compiler to be happy.',
            hi: 'Initial value se inference "number" samajh leta hai; compiler ke liye koi annotation zaroori nahi hai.',
          },
        },
      ],
    },
    {
      id: 'l1-3',
      title: { en: 'any, unknown & strict mode', hi: 'any, unknown aur strict mode' },
      minutes: 8,
      sections: [
        {
          heading: { en: 'any is a type pillar (not a safe one)', hi: 'any ek loose type hai (safe nahi)' },
          paragraphs: [
            {
              en: 'any switches off checking for a value, turning your compiler into a whisper. Mildly useful in migrations; harmful daily. strict-mode: treat every time you see an implicit any as a sign to infer or annotate.',
              hi: 'any ki wajah se value ka check band ho jata hai — aapka compiler chup ho jata hai. Migrations mein thoda useful hai, daily use mein harmful. Strict mode mein jab bhi implicit any dikhe, usse infer ya annotate kar ke aage badho.',
            },
          ],
          blocks: [
            { kind: 'code', code: `let a: any = 5;
a.toUpperCase();          // ✋ no error — crash at runtime!
let u: unknown = 5;
if (typeof u === 'string') u.toUpperCase(); // safe: we checked
` },
          ],
        },
        {
          heading: { en: 'unknown: the honest anything', hi: 'unknown: honest "kuch bhi"' },
          paragraphs: [
            {
              en: 'unknown lets you assign anything, but requires a check before use — the type system forces the narrowing step. Use it when a value comes from JSON or an API.',
              hi: 'unknown se aap kuch bhi assign kar sakte ho, lekin use karne se pehle check karna zaroori hai — type system aapko p narrow karne par magar karta hai. API/JSON se aane wale values ke liye perfect hai.',
            },
          ],
        },
        {
          heading: { en: 'Strict mode is non-negotiable', hi: 'Strict mode zaroori hai' },
          paragraphs: [
            {
              en: 'Four flags — strict, noImplicitAny, strictNullChecks, strictFunctionTypes — are the difference between "auto-checks me" and "build-time you are on your own". Always strict: true.',
              hi: 'Cha flags — strict, noImplicitAny, strictNullChecks, strictFunctionTypes — "automatic checks kiye jaate" aur "khud sambhalo" ke beech ka difference hain. Hamesha strict: true rakho.',
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
          prompt: { en: 'Which choice is the correct escape hatch for a JSON API response?', hi: 'JSON API response ke liye kaunsa sahi escape hatch hai?' },
          options: [
            { en: 'let data: any = await res.json()', hi: 'any' },
            { en: 'let data: unknown = await res.json()', hi: 'unknown' },
            { en: 'let data = await res.json()', hi: 'without annotation' },
            { en: 'let data: number = await res.json()', hi: 'number' },
          ],
          correctIndex: 1,
          explanation: {
            en: 'unknown forces a runtime check before use, which is what you want for data whose shape is not guaranteed.',
            hi: 'unknown use karne se pehle runtime check karta hai, aise data ke liye joee shape guaranteed nahi hoti.',
          },
        },
        {
          id: 'q1-3-2',
          type: 'bugfix',
          difficulty: 'easy',
          points: 10,
          prompt: { en: 'shout() crashes when the input is not a string. Fix the bug.', hi: 'jab input string nahi hai to shout() crash ho jata hai. Bug fix karo.' },
          hint: { en: 'typeof-checks the unknown before calling string methods.', hi: 'String methods use karne se pehle unknown ko typeof se check karo.' },
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
          explanation: { en: 'unknown values must be narrowed before use; String(message) handles the non-string path safely.', hi: 'Unknown value ko use karne se pehle narrow karna zaroori hai; non-string case ko String(message) safe tarike se handle karta hai.' },
        },
      ],
    },
  ],
}