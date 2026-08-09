import type { Chapter } from '../types'

export const chapter08: Chapter = {
  id: 'ch08',
  number: 8,
  title: { en: 'Modules & Type Declarations', hi: 'Modules aur Type Declarations' },
  tagline: {
    en: 'Imports for values, declarations for types — everywhere.',
    hi: 'Values ke liye imports, types ke liye declarations — har jagah.',
  },
  color: '#fbbf24',
  objectives: [
    { en: 'Import and export types and values', hi: 'Types aur values ko import/export karna' },
    { en: 'Use import type for type-only imports', hi: 'Type-only imports ke liye import type use karna' },
    { en: 'Read .d.ts and ambient declarations', hi: '.d.ts aur ambient declarations samjho' },
  ],
  lessons: [
    {
      id: 'l8-1',
      title: { en: 'Modules 101', hi: 'Modules 101' },
      minutes: 8,
      sections: [
        {
          heading: { en: 'Every file is a module', hi: 'Har file ek module hai' },
          paragraphs: [
            {
              en: 'A file with any top-level import or export is a module with its own scope — no leaking globals.',
              hi: 'File mein top-level import/export hone par wo ek module ban jati hai, apna alag scope hota hai — koi global leak nahi hota.',
            },
          ],
          blocks: [{
            kind: 'code',
            code: `// math.ts
export const PI = 3.14159;
export function circleArea(r: number) { return PI * r * r }
export type Degrees = number;

// app.ts
import { circleArea, type Degrees } from './math';
const d: Degrees = 90;
`,
          }],
        },
        {
          heading: { en: 'import type: guaranteed type-only', hi: 'import type: pakka type-only' },
          paragraphs: [
            {
              en: '`import type` guarantees the import is type-only: it is erased at compile time and cannot be used as a value.',
              hi: '`import type` guarantee karta hai ki import sirf type hai — compile hote hi erase, aur use value ki tarah nahi kar sakte.',
            },
          ],
        },
      ],
      questions: [
        {
          id: 'q8-1-1',
          type: 'truefalse',
          difficulty: 'easy',
          points: 10,
          prompt: { en: 'Evaluate anything:', hi: 'Kya yeh hai?' },
          statement: {
            en: '`import type` is erased during compilation and never creates a runtime import.',
            hi: '`import type` compilation ke dauran erase ho jata hai aur runtime mein koi import nahi banata.',
          },
          answer: true,
          explanation: { en: 'Type-only imports produce no runtime import statement.', hi: 'Type-only imports runtime import statement generate nahi karte.' },
        },
        {
          id: 'q8-1-2',
          type: 'mcq',
          difficulty: 'easy',
          points: 10,
          prompt: { en: 'What makes a .ts file a module?', hi: 'Kaun si cheez .ts file ko module banati hai?' },
          options: [
            { en: 'A top-level import or export', hi: 'Top-level import ya export hona' },
            { en: 'The file name containing "module"', hi: 'File name mein "module" word hona' },
            { en: 'A class declaration', hi: 'Class declaration' },
            { en: 'Being listed in tsconfig', hi: 'tsconfig mein listed hona' },
          ],
          correctIndex: 0,
          explanation: { en: 'Module-ness comes from top-level import/export syntax', hi: 'Module wahi hota hai jisme top-level import/export syntax hota hai.' },
        },
      ],
    },
    {
      id: 'l8-2',
      title: { en: 'Declaration Files (.d.ts)', hi: 'Declaration Files (.d.ts)' },
      minutes: 7,
      sections: [
        {
          heading: { en: 'Types without implementation', hi: 'Bina implementation ke types' },
          paragraphs: [
            {
              en: 'A .d.ts file describes the shapes of existing JavaScript. Browsers APIs, Node APIs and many packages ship exactly this.',
              hi: '.d.ts file existing JavaScript ke shapes describe karti hai. Browser APIs, Node APIs aur kai saare packages isi tarah types ship karte hain.',
            },
          ],
          blocks: [{
            kind: 'code',
            code: `// lib.d.ts
export declare function answer(): number;

// lib.ts (real implementation)
export function answer() { return 42 }
`,
          }],
        },
        {
          heading: { en: 'Ambient declarations for the wild', hi: 'Bahari duniya ke liye ambient declarations' },
          paragraphs: [
            {
              en: 'When a library provides no types, add an ambient declaration with `declare module "name"` to describe it yourself, as needed.',
              hi: 'Jab library types nahi deti, to `declare module "name"` wali ambient declaration bana kar khud hi types describe karo.',
            },
          ],
          blocks: [{
            kind: 'code',
            code: `// globals.d.ts
declare module 'jquery' {
  export function plot(data: number[]): void;
}

declare const __VERSION__: string;
`,
          }],
        },
      ],
      questions: [
        {
          id: 'q8-2-1',
          type: 'mcq',
          difficulty: 'medium',
          points: 15,
          prompt: { en: 'A package has no type declarations. What is the cleanest local fix?', hi: 'Pakage ke paas type declarations nahi hain. Cleanest local solution kya hai?' },
          options: [
            { en: 'Write an ambient declaration with declare module', hi: 'declare module wali ambient declaration likhna' },
            { en: 'Set noImplicitAny to false', hi: 'noImplicitAny ko false karna' },
            { en: 'Rewrite the package', hi: 'Package ko rewrite karna' },
            { en: 'Import it with require() always', hi: 'Hamesha require() se use karna' },
          ],
          correctIndex: 0,
          explanation: { en: 'Ambient declaration: describe the third-party module from your side in one file.', hi: 'Ambient declaration se aap ek file mein third-party module ko khud describe karte ho.' },
        },

        {
          id: 'q8-2-2',
          type: 'bugfix',
          difficulty: 'easy',
          points: 10,
          prompt: { en: 'normalizeWhitespace() only trims the edges; inner spaces stay.', hi: 'normalizeWhitespace() sirf edges trim karta hai, beech ke spaces wahi rehte hain.' },
          hint: { en: 'Collapse runs of whitespace to a single space between words.', hi: 'Words ke beech multiple whitespace ko ek space mein collapse karo.' },
          buggyCode: `export function normalizeWhitespace(text: string): string {
  return text.trim()
}`,
          fixedCode: `export function normalizeWhitespace(text: string): string {
  return text.trim().replace(/\s+/g, ' ')
}`,
          testCode: `import { normalizeWhitespace } from './solution'
console.log('Assert 1:', normalizeWhitespace('  a   b  ') === 'a b')
console.log('Assert 2:', normalizeWhitespace('hello    world') === 'hello world')`,
          explanation: { en: 'trim() only strips the ends, replace(/\s+/g, " ") collapses the middle runs.', hi: 'trim() sirf ends hatata hai; multiply spaces ko /\s+/g wale replace se ek space banaya jata hai.' },
        },
      ],
    },
  ],
}