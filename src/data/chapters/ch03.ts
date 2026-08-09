import type { Chapter } from '../types'

export const chapter03: Chapter = {
  id: 'ch03',
  number: 3,
  title: { en: 'Functions in the Deep', hi: 'fnkshn: ghraee men' },
  tagline: {
    en: 'Parameters, returns, rest, overloads — the full contract toolkit.',
    hi: 'pairameetr, ritrn, rest, ovrlod — pura anubndh tulkit.',
  },
  color: '#22d3ee',
  objectives: [
    { en: 'Model optional, default and rest parameters', hi: 'optional, difolt aur rest pairameetr modl krna' },
    { en: 'Narrow return types with overloads', hi: 'ovrlod se ritrn taip ty krna' },
    { en: 'Put never to work in control flow', hi: 'niyntrn prvah men never ka upyog' },
  ],
  lessons: [
    {
      id: 'l3-1',
      title: { en: 'Parameter Recipes', hi: 'pairameetr resipee' },
      minutes: 8,
      sections: [
        {
          heading: { en: 'Optional after required', hi: 'aavshyk ke bad optional' },
          paragraphs: [
            {
              en: 'Optional parameters must come after required ones; use default values to keep the signature clean.',
              hi: 'optional pairameetr kee jgh aakhir men hotee hai; difolt man se signechr saf rhta hai.',
            },
          ],
          blocks: [{
            kind: 'code',
            code: `function greet(name: string, polite = true): string {
  return polite ? \`Hello, \${name}!\` : name;
}
greet('raw');          // ✅
greet('raw', true);    // ✅
`,
          }],
        },
        {
          heading: { en: 'Rest: never arrays by hand', hi: 'Rest: hath se arrays nheen' },
          paragraphs: [
            {
              en: 'A rest parameter collects arbitrary count of values into a typed array.',
              hi: 'Rest pairameetr mnmanee snkhya men vailyu ka ek taipd aire bna leta hai.',
            },
          ],
          blocks: [{
            kind: 'code',
            code: `export function max(...nums: number[]): number {
  return nums.length ? Math.max(...nums) : -Infinity;
}
max(1, 9, 3); // 9
`,
          }],
        },
        {
          heading: { en: 'this types: callbacks are honest', hi: 'this taip: kolbaik men' },
          paragraphs: [
            {
              en: 'You can declare this parameters — the first pseudo-parameter with a type that scopes who can call the function.',
              hi: 'phle pseudo-pairameetr se aap ghoshna krte hain ki is fnkshn ka this kaun ho skta hai.',
            },
          ],
        },
      ],
      questions: [
        {
          id: 'q3-1-1',
          type: 'code',
          difficulty: 'easy',
          points: 10,
          prompt: { en: 'Write joinAll(sep, ...items) joining all items with the separator.', hi: 'joinAll(sep, ...items) likhen jo sbhee items ko seapretr se jode.' },
          starterCode: `export function joinAll(sep: string, ...items: string[]): string {
  // TODO
}`,
          hint: { en: 'Array.prototype.join is your friend.', hi: 'Array.prototype.join istemal kren.' },
          testCode: `import { joinAll } from './solution'
console.log('Assert 1:', joinAll('-', 'a', 'b', 'c') === 'a-b-c')
console.log('Assert 2:', joinAll(',', 'x') === 'x')
`,
          explanation: {"en":"Array.join is the one-liner core.","hi":"Array.join hee ek-lain upay hai."},
        },
        {
          id: 'q3-1-2',
          type: 'mcq',
          difficulty: 'medium',
          points: 15,
          prompt: { en: 'What is the type of `toppings` inside the function?', hi: 'fnkshn ke andr `toppings` ka taip kya hai?' },
          code: `function buildPizza(size: number, ...toppings: string[]) {}`,
          options: [
            { en: 'string[]', hi: 'string[]' },
            { en: 'string', hi: 'string' },
            { en: 'string | undefined', hi: 'string | undefined' },
            { en: 'readonly string[]', hi: 'readonly string[]' },
          ],
          correctIndex: 0,
          explanation: { en: 'Rest parameters always produce an array of the given type.', hi: 'rest pairameetr hmesha ek aire bnata hai.' },
        },
      ],
    },
    {
      id: 'l3-2',
      title: { en: 'Return Types & Overloads', hi: 'ritrn taip aur ovrlod' },
      minutes: 9,
      sections: [
        {
          heading: { en: 'Inference vs annotations on returns', hi: 'imfrens bnam enoteshn' },
          paragraphs: [
            {
              en: 'TypeScript infers returns. Annotate when the logic complex or contract long-lived. An explicit return type is also a great bisect during refactors.',
              hi: 'TypeScript ritrn imfr krta hai. jtil ya lmbe jeevn vale fnkshnon pr spsht ritrn likhen.',
            },
          ],
        },
        {
          heading: { en: 'Function overloads: one name, many signatures', hi: 'fnkshn ovrlod: ek nam, kee signechr' },
          paragraphs: [
            {
              en: 'Overloads list several call signatures above the implementation. The implementation signature is not part of the public API.',
              hi: 'ovrlod ka kol signechr suchee oopr rhtee hai; impleementeshn signechr pblik API ka hissa nheen.',
            },
          ],
          blocks: [{
            kind: 'code',
            code: `function area(shape: 'circle', r: number): number;
function area(shape: 'square', side: number): number;
function area(shape: string, x: number): number {
  return shape === 'circle' ? Math.PI * x * x : x * x;
}
area('circle', 2); // 12.56…
area('square', 3); // 9
`,
          }],
        },
        {
          heading: { en: 'never in the return seat', hi: 'ritrn seet pr never' },
          paragraphs: [
            {
              en: 'A function that always throws, or terminates, returns never — the bottom type that refines unions to exhaustion.',
              hi: 'hmesha throw ya bnd krne vale fnkshn kbhee lautte hain never — sbse neeche vala taip jo bhed krta hai.',
            },
          ],
        },
      ],
      questions: [
        {
          id: 'q3-2-1',
          type: 'truefalse',
          difficulty: 'easy',
          points: 10,
          prompt: { en: 'Evaluate:', hi: 'sty ya asty:' },
          statement: { en: 'The implementation signature of an overloaded function is always part of the public API.', hi: 'ovrlod fnkshn ka impleementeshn signechr parlik API ka hmesha hissa hota hai.' },
          answer: false,
          explanation: { en: 'Only the overload signatures are exposed; implementation is internal.', hi: 'kevl ovrlod signechr dikhte hain; impleementeshn aantrik hota hai.' },
        },

        {
          id: 'q3-2-2',
          type: 'bugfix',
          difficulty: 'easy',
          points: 10,
          prompt: { en: 'titleCase() should capitalise only the first letter. Fix it.', hi: 'titleCase() ko sirf pehla letter bada karna chahiye. Fix karo.' },
          hint: { en: 'The rest of the word must be lowercase.', hi: 'Baaki ka word lowercase hona chahiye.' },
          buggyCode: `export function titleCase(name: string): string {
  return name[0] + name.slice(1).toUpperCase()
}`,
          fixedCode: `export function titleCase(name: string): string {
  return name[0].toUpperCase() + name.slice(1).toLowerCase()
}`,
          testCode: `import { titleCase } from './solution'
console.log('Assert 1:', titleCase('jAyA') === 'Jaya')
console.log('Assert 2:', titleCase('RUPA') === 'Rupa')`,
          explanation: { en: 'slice(1).toUpperCase() makes the whole tail capital; the fix lowercases the tail instead.', hi: 'slice(1).toUpperCase() pura tail capital kar deta hai; fix tail ko lowercase karta hai.' },
        },
      ],
    },
  ],
}