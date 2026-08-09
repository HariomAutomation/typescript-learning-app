import type { Chapter } from '../types'

export const chapter06: Chapter = {
  id: 'ch06',
  number: 6,
  title: { en: 'Interfaces & Structural Typing', hi: 'intrfes aur strkchrl taiping' },
  tagline: {
    en: 'TypeScript compares shapes, not names — the Duck System in action.',
    hi: 'TypeScript nam nheen, aakar se tulna krta hai.',
  },
  color: '#f472b6',
  objectives: [
    { en: 'Understand structural (duck) typing', hi: 'strkchrl (dk) taiping smjhna' },
    { en: 'Compose types with interface extends', hi: 'interface extends se compose krna' },
    { en: 'Decide type alias vs interface', hi: 'type eliyas bnam intrfes ka chunav' },
  ],
  lessons: [
    {
      id: 'l6-1',
      title: { en: 'Duck Typing, By Shape', hi: 'aakar se phchan' },
      minutes: 8,
      sections: [
        {
          heading: { en: 'What structural typing means', hi: 'strkchrl taiping ka arth' },
          paragraphs: [
            {
              en: 'If it walks like a Duck and quacks like a Duck, it is a Duck — so a value with the required properties satisfies the type, regardless of declared identity.',
              hi: 'agr vh btkh jaisa chlta aur bolta hai, to btkh hai — jruree proprteej valee vailyu staip ko sntusht krtee hai.',
            },
          ],
          blocks: [{
            kind: 'code',
            code: `interface Point { x: number; y: number }
interface LabeledPoint { x: number; y: number; label: string }

function draw(p: Point) { /* ... */ }
const lp: LabeledPoint = { x: 1, y: 2, label: 'A' };
draw(lp); // ✅ structural: has x & y
`,
          }],
        },
        {
          heading: { en: 'Fresh object literal excess checking', hi: 'ne objekt litrl kee janch' },
          paragraphs: [
            {
              en: 'Assigning an object literal with unknown keys directly produces an error; assigning it via a variable does not. Variables carry "extra" allowed.',
              hi: 'litrl men anjanee kunjee pr error aata hai; veriebl ke pas atipikt proprtee kee chhut hotee hai.',
            },
          ],
          blocks: [{
            kind: 'code',
            code: `draw({ x: 1, y: 2, label: 'a' }); // ok — extra props fine
interface Strict { x: number }
const bad = { x: 1, other: true };
let s: Strict = bad;                    // ok (via variable)
`,
          }],
        },
      ],
      questions: [
        {
          id: 'q6-1-1',
          type: 'truefalse',
          difficulty: 'easy',
          points: 10,
          prompt: { en: 'Evaluate:', hi: 'kthn sty ya asty:' },
          statement: {
            en: 'Two interfaces with identical properties are interchangeable even if declared in different files.',
            hi: 'sman proprtee vale do intrfes alg-alg failon men bne hon to bhee ek-dusre kee jgh istemal ho skte hain.',
          },
          answer: true,
          explanation: { en: 'Structural typing ignores names; shapes win.', hi: 'strkchrl taiping namon kee prvah nheen krtee; aakar pr dhyan detee hai.' },
        },
        {
          id: 'q6-1-2',
          type: 'mcq',
          difficulty: 'medium',
          points: 15,
          prompt: { en: 'When does the "excess property check" trigger?', hi: 'ekstra proprtee janch kb hotee hai?' },
          options: [
            { en: 'Only when assigning an object literal directly', hi: 'sirf objekt litrl seedhe asain krte smy' },
            { en: 'Only when assigning from a variable', hi: 'sirf veriebl se asain krte smy' },
            { en: 'Whenever using interface types', hi: 'hmesha intrfes taip istemal krne pr' },
            { en: 'Never — types are erased', hi: 'kbhee nheen — taip kt jate hain' },
          ],
          correctIndex: 0,
          explanation: { en: 'Excess checking applies to fresh literals so typos in keys get caught.', hi: 'yh janch litrl pr hotee hai taki taip kee glt kunjee pkdee jae.' },
        },
      ],
    },
    {
      id: 'l6-2',
      title: { en: 'Interface Composition', hi: 'intrfes ka mishrn' },
      minutes: 7,
      sections: [
        {
          heading: { en: 'Extending interfaces', hi: 'intrfes extends' },
          paragraphs: [
            {
              en: 'An interface can extend others and inherit all their properties — with the option to narrow-override none of them (same type).',
              hi: 'intrfes dusron ko extend krke saree proprtee le lete hain — aur apnee bhee jod skta hai.',
            },
          ],
          blocks: [{
            kind: 'code',
            code: `interface Named {
  name: string;
}
interface Greeter extends Named {
  greet(): string;
}
class Hello implements Greeter {
  name = 'world';
  greet() { return \`hello \${this.name}\`; }
}
`,
          }],
        },
        {
          heading: { en: 'Interface vs type — the short list', hi: 'intrfes bnam type — jruree baten' },
          paragraphs: [
            {
              en: 'type casts can create unions, tuples, and primitives; interfaces cannot. Interfaces merge declarations; type cannot. Both handle objects.',
              hi: 'type yuniyn/tpl bna skta hai, interface nheen. Interface kee ghoshnaen merge hotee hain, type kee nheen.',
            },
          ],
        },
      ],
      questions: [
        {
          id: 'q6-2-1',
          type: 'output',
          difficulty: 'medium',
          points: 15,
          prompt: { en: 'What prints?', hi: 'kya chhpega?' },
          code: `interface Base { id: number }
interface Child extends Base { label: string }
const item: Child = { id: 1, label: 'first' };
console.log(item.label.toUpperCase());
`,
          expected: 'FIRST',
          explanation: { en: 'The interface inherits id and adds label.', hi: 'intrfes id virast men leta hai aur label jodta hai.' },
        },

        {
          id: 'q6-2-2',
          type: 'bugfix',
          difficulty: 'easy',
          points: 10,
          prompt: { en: 'greeting() prints "undefined" for valid User objects.', hi: 'greeting() valid User object par "undefined" print karta hai.' },
          hint: { en: 'Check the property name against the interface.', hi: 'Interface ke property naam se milao.' },
          buggyCode: `export interface User {
  name: string
  age: number
}

export function greeting(u: User): string {
  return 'Hi, ' + u.firstName + '!'
}`,
          fixedCode: `export interface User {
  name: string
  age: number
}

export function greeting(u: User): string {
  return 'Hi, ' + u.name + '!'
}`,
          testCode: `import { greeting } from './solution'
console.log('Assert 1:', greeting({ name: 'Aarav', age: 24 }) === 'Hi, Aarav!')
console.log('Assert 2:', greeting({ name: 'Meera', age: 21 }) === 'Hi, Meera!')`,
          explanation: { en: 'The interface defines name, so firstName is undefined at runtime.', hi: 'Interface mein name hai, firstName runtime par undefined hota hai.' },
        },
      ],
    },
  ],
}