import type { Chapter } from '../types'

export const chapter03: Chapter = {
  id: 'ch03',
  number: 3,
  title: { en: 'Functions in the Deep', hi: 'Functions: deep dive' },
  tagline: {
    en: 'Parameters, returns, rest, overloads — the full contract toolkit.',
    hi: 'Parameters, returns, rest, overloads — pura contract toolkit.',
  },
  color: '#22d3ee',
  objectives: [
    { en: 'Model optional, default and rest parameters', hi: 'Optional, default aur rest parameters model karo' },
    { en: 'Narrow return types with overloads', hi: 'Overloads se return types target karo' },
    { en: 'Put never to work in control flow', hi: 'Control flow mein never ka use' },
  ],
  lessons: [
    {
      id: 'l3-1',
      title: { en: 'Parameter Recipes', hi: 'Parameter Recipes' },
      minutes: 8,
      sections: [
        {
          heading: { en: 'Optional after required', hi: 'Required ke baad optional' },
          paragraphs: [
            {
              en: 'Optional parameters must come after required ones; use default values to keep the signature clean.',
              hi: 'Optional parameters hamesha required ke baad aate hain; default values se signature clean rehta hai.',
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
          heading: { en: 'Rest: never arrays by hand', hi: 'Rest: arrays haath se nahi' },
          paragraphs: [
            {
              en: 'A rest parameter collects arbitrary count of values into a typed array.',
              hi: 'Rest parameter kitni bhi values ko ek typed array mein collect kar leta hai.',
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
          heading: { en: 'this types: callbacks are honest', hi: 'This types: callbacks mein' },
          paragraphs: [
            {
              en: 'You can declare this parameters — the first pseudo-parameter with a type that scopes who can call the function.',
              hi: 'Pehle pseudo-parameter se declare karte hain ki is function ka this kaun ho sakta hai.',
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
          prompt: { en: 'Write joinAll(sep, ...items) joining all items with the separator.', hi: 'joinAll(sep, ...items) likho jo saare items ko separator ke saath jode.' },
          starterCode: `export function joinAll(sep: string, ...items: string[]): string {
  // TODO
}`,
          hint: { en: 'Array.prototype.join is your friend.', hi: 'Array.prototype.join use karo.' },
          testCode: `import { joinAll } from './solution'
console.log('Assert 1:', joinAll('-', 'a', 'b', 'c') === 'a-b-c')
console.log('Assert 2:', joinAll(',', 'x') === 'x')
`,
          explanation: {"en":"Array.join is the one-liner core.","hi":"Array.join hi ek-liner ka core hai."},
        },
        {
          id: 'q3-1-2',
          type: 'mcq',
          difficulty: 'medium',
          points: 15,
          prompt: { en: 'What is the type of `toppings` inside the function?', hi: 'Function ke andar `toppings` ka type kya hai?' },
          code: `function buildPizza(size: number, ...toppings: string[]) {}`,
          options: [
            { en: 'string[]', hi: 'string[]' },
            { en: 'string', hi: 'string' },
            { en: 'string | undefined', hi: 'string | undefined' },
            { en: 'readonly string[]', hi: 'readonly string[]' },
          ],
          correctIndex: 0,
          explanation: { en: 'Rest parameters always produce an array of the given type.', hi: 'Rest parameters hamesha diye gaye type ka array banate hain.' },
        },
      ],
    },
    {
      id: 'l3-2',
      title: { en: 'Return Types & Overloads', hi: 'Return Types aur Overloads' },
      minutes: 9,
      sections: [
        {
          heading: { en: 'Inference vs annotations on returns', hi: 'Returns par inference vs annotations' },
          paragraphs: [
            {
              en: 'TypeScript infers returns. Annotate when the approach is complex or contract is long-lived. An explicit return type also helps during refactors.',
              hi: 'TypeScript returns khud infer karta hai. Complex ya long-lived contracts par explicit return type likhna accha hai, refactor ke waqt bhi madad karta hai.',
            },
          ],
        },
        {
          heading: { en: 'Function overloads: one name, many signatures', hi: 'Function overloads: ek naam, kai signatures' },
          paragraphs: [
            {
              en: 'Overloads let you list several call signatures above the implementation. The implementation signature is not part of the public API.',
              hi: 'Overloads implementation ke upar kai call signatures likhne dete hain. Implementation signature public API ka hissa nahi hota.',
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
          heading: { en: 'never in the return seat', hi: 'Return position par never' },
          paragraphs: [
            {
              en: 'A function that always throws, or never returns, returns never — the bottom type that refines unions to exhaustion.',
              hi: 'Jo function hamesha throw karta hai ya return hi nahi karta, uska return type never hota hai — bottom type jo unions ko exhaustively khatam karta hai.',
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
          prompt: { en: 'Evaluate:', hi: 'True ya False:' },
          statement: { en: 'The implementation signature of an overloaded function is always part of the public API.', hi: 'Overloaded function ka implementation signature hamesha public API ka hissa hota hai.' },
          answer: false,
          explanation: { en: 'Only the overload signatures are exposed; implementation is internal.', hi: 'Sirf overload signatures expose hote hain; implementation internal hota hai.' },
        },

        {
          id: 'q3-2-2',
          type: 'bugfix',
          difficulty: 'easy',
          points: 10,
          prompt: { en: 'titleCase() should capitalise only the first letter. Fix it.', hi: 'titleCase() ko sirf pehla letter capital karna chahiye. Fix karo.' },
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
          explanation: { en: 'slice(1).toUpperCase() makes the whole tail capital; the fix lowercases the tail instead.', hi: 'slice(1).toUpperCase() pura tail capital kar deta hai; fix mein tail ko lowercase kiya gaya hai.' },
        },
      ],
    },
  ],
}