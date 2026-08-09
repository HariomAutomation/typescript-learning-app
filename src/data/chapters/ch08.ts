import type { Chapter } from '../types'

export const chapter08: Chapter = {
  id: 'ch08',
  number: 8,
  title: { en: 'Modules & Type Declarations', hi: 'modyul aur taip diklereshn' },
  tagline: {
    en: 'Imports for values, declarations for types — everywhere.',
    hi: 'vailyu ke lie import, taip ke lie declaration — hr jgh.',
  },
  color: '#fbbf24',
  objectives: [
    { en: 'Import and export types and values', hi: 'taip aur vailyu ko import/export krna' },
    { en: 'Use import type for type-only imports', hi: 'import type ka shee upyog' },
    { en: 'Read .d.ts and ambient declarations', hi: '.d.ts aur ambient ghoshnaen smjhna' },
  ],
  lessons: [
    {
      id: 'l8-1',
      title: { en: 'Modules 101', hi: 'modyul prichy' },
      minutes: 8,
      sections: [
        {
          heading: { en: 'Every file is a module', hi: 'hr fail ek modyul' },
          paragraphs: [
            {
              en: 'A file with any top-level import or export is a module with its own scope — no leaking globals.',
              hi: 'jis fail men top-level import/export hota hai vh modyul hai, apna alg scope.',
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
          heading: { en: 'import type: guaranteed type-only', hi: 'import type: pkka taip-sirf' },
          paragraphs: [
            {
              en: '`import type` marks the import as type-only: it is erased at compile time and cannot be used as a value.',
              hi: '`import type` btata hai ki yh import sirf taip hai — kmpail hote hee erase, vailyu nheen bn skta.',
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
          prompt: { en: 'Evaluate:', hi: 'kthn sty ya asty:' },
          statement: {
            en: '`import type` is erased during compilation and never creates a runtime import.',
            hi: 'import type kmpail hote hee erase hota hai aur rntaim men koee import nheen bnata.',
          },
          answer: true,
          explanation: { en: 'Type-only imports produce no runtime import statement.', hi: 'taip-sirf import se rntaim ka snkshep nheen bnta.' },
        },
        {
          id: 'q8-1-2',
          type: 'mcq',
          difficulty: 'easy',
          points: 10,
          prompt: { en: 'What makes a .ts file a module?', hi: 'kaun-see cheej .ts fail ko modyul bnatee hai?' },
          options: [
            { en: 'A top-level import or export', hi: 'Top-level import ya export hona' },
            { en: 'The file name containing "module"', hi: 'fail nam men module shbd' },
            { en: 'A class declaration', hi: 'klas diklereshn' },
            { en: 'Being listed in tsconfig', hi: 'tsconfig men sucheebddh hona' },
          ],
          correctIndex: 0,
          explanation: { en: 'Module-ness comes from top-level import/export syntax.', hi: 'modyul hona top-level import/export se ty hota hai.' },
        },
      ],
    },
    {
      id: 'l8-2',
      title: { en: 'Declaration Files (.d.ts)', hi: 'diklereshn failen (.d.ts)' },
      minutes: 7,
      sections: [
        {
          heading: { en: 'Types without implementation', hi: 'bina kod valee taiping' },
          paragraphs: [
            {
              en: 'A .d.ts file describes the shapes of existing JavaScript. Browsers APIs, Node APIs and many packages ship exactly this.',
              hi: '.d.ts bina kod ke btata hai ki maujuda JavaScript kaisa hai. Browser, Node aur kee paikej isee se taip dete hain.',
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
          heading: { en: 'Ambient declarations for the wild', hi: 'bahree duniya ke lie declaration' },
          paragraphs: [
            {
              en: 'When a library provides no types, add an ambient declaration with `declare module "name"` to describe it yourself, gradually.',
              hi: 'bina taip valee laibreree ke lie declare module valee ambient ghoshna bnakr khud taip joden.',
            },
          ],
          blocks: [{
            kind: 'code',
            code: `// globals.d.ts
declare module 'legacy-plot' {
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
          prompt: { en: 'A package has no type declarations. What is the cleanest local fix?', hi: 'bina taip vale paikej ka saf-suthra upay kya hai?' },
          options: [
            { en: 'Write an ambient declaration with declare module', hi: 'declare module valee ambient ghoshna likhna' },
            { en: 'Set noImplicitAny to false', hi: 'noImplicitAny ko false krna' },
            { en: 'Rewrite the package', hi: 'paikej ko fir se likhna' },
            { en: 'Import it with require() always', hi: 'hmesha require() se istemal krna' },
          ],
          correctIndex: 0,
          explanation: { en: 'Ambient declaration: describe the third-party module from your side in one file.', hi: 'ambient ghoshna se aap khud vh modyul btate hain jaisa hai.' },
        },

        {
          id: 'q8-2-2',
          type: 'bugfix',
          difficulty: 'easy',
          points: 10,
          prompt: { en: 'normalizeWhitespace() only trims the edges; inner whitespace stays.', hi: 'normalizeWhitespace() sirf kinare trim karta hai, andar ki spacing nahi.' },
          hint: { en: 'Collapse runs of whitespace to a single space between words.', hi: 'Shaabdon ke beech multiple spaces ko ek space mein merge karo.' },
          buggyCode: `export function normalizeWhitespace(text: string): string {
  return text.trim()
}`,
          fixedCode: `export function normalizeWhitespace(text: string): string {
  return text.trim().replace(/\s+/g, ' ')
}`,
          testCode: `import { normalizeWhitespace } from './solution'
console.log('Assert 1:', normalizeWhitespace('  a   b  ') === 'a b')
console.log('Assert 2:', normalizeWhitespace('hello    world') === 'hello world')`,
          explanation: { en: 'trim() only strips the ends; replace(/\s+/g, " ") collapses the middle runs.', hi: 'trim() sirf kinare hatata hai; beech ke runs /\s+/g wale replace se merge hote hain.' },
        },
      ],
    },
  ],
}