import type { Chapter } from '../types'

export const chapter06: Chapter = {
  id: 'ch06',
  number: 6,
  title: { en: 'Interfaces & Structural Typing', hi: 'Interfaces aur Structural Typing' },
  tagline: {
    en: 'TypeScript compares shapes, not names — the Duck System in action.',
    hi: 'TypeScript naam nahi, shape se compare karta hai — Duck Typing action mein.',
  },
  color: '#f472b6',
  objectives: [
    { en: 'Understand structural (duck) typing', hi: 'Structural (duck) typing samjho' },
    { en: 'Compose types with interface extends', hi: 'Interface extends se types compose karo' },
    { en: 'Decide type alias vs interface', hi: 'Type alias vs interface ka chunaav karo' },
  ],
  lessons: [
    {
      id: 'l6-1',
      title: { en: 'Duck Typing, By Shape', hi: 'Shape se pehchan' },
      minutes: 8,
      sections: [
        {
          heading: { en: 'What structural typing means', hi: 'Structural typing ka matlab' },
          paragraphs: [
            {
              en: 'If it walks like a duck and quacks like a duck, it is a duck — so a value with the required properties satisfies the type, regardless of its name.',
              hi: 'Agar wo bațkh ki tarah chalta hai aur bațkh ki tarah bolta hai, to wo bațkh hai — matlab jis value mein required properties hain, wo type ko satisfy karti hai, chahe uska naam kuch bhi ho.',
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
          heading: { en: 'Fresh object literal excess checking', hi: 'Fresh object literal ki excess checking' },
          paragraphs: [
            {
              en: 'Assigning an object literal with unknown extra keys directly produces an error; assigning via a variable does not. Variables carry "extra" allowed.',
              hi: 'Object literal mein unknown extra keys directly assign karo to error aata hai; variable ke through assign karo to nahi. Variable ke paas extra properties ki chhoot hoti hai.',
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
          prompt: { en: 'Evaluate:', hi: 'True ya False:' },
          statement: {
            en: 'Two interfaces with identical properties are interchangeable even if declared in different files.',
            hi: 'Do interfaces jinki properties bilkul same hain, agar different files mein declare hui hon par ek doosri ki jagah use ho sakti hain.',
          },
          answer: true,
          explanation: { en: 'Structural typing ignores names; shapes win.', hi: 'Structural typing names ko ignore karti hai; shape jeetta hai.' },
        },
        {
          id: 'q6-1-2',
          type: 'mcq',
          difficulty: 'medium',
          points: 15,
          prompt: { en: 'When does the "excess property check" trigger trigger?', hi: 'Excess property check kab trigger hota hai?' },
          options: [
            { en: 'Only when assigning an object literal directly', hi: 'Sirf object literal directly assign karne par' },
            { en: 'Only when assigning from a variable', hi: 'Sirf variable se assign karne par' },
            { en: 'Whenever using interface types', hi: 'Interface types hamesha use karne par' },
            { en: 'Never — types are erased', hi: 'Kabhi nahi — types erase ho jate hain' },
          ],
          correctIndex: 0,
          explanation: { en: 'Excess checking applies to fresh literals so typos in keys get caught.', hi: 'Excess check fresh literals par hota hai, taaki keys mein typos pakdi jayein.' },
        },
      ],
    },
    {
      id: 'l6-2',
      title: { en: 'Interface Composition', hi: 'Interface composition' },
      minutes: 7,
      sections: [
        {
          heading: { en: 'Extending interfaces', hi: 'Interfaces ko extend karna' },
          paragraphs: [
            {
              en: 'An interface extends other interfaces and inherits all their properties — and can add own ones too.',
              hi: 'Interface doosre interfaces ko extend karke unki saari properties inherit karta hai — aur apni bhi jod sakta hai.',
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
          heading: { en: 'Interface vs type — the short list', hi: 'Interface vs type — chhoti list' },
          paragraphs: [
            {
              en: 'type can create unions, tuples, and primitives; interfaces cannot. Interfaces merge declarations; type cannot. Both handle objects.',
              hi: 'Type unions, tuples aur primitives bana sakta hai; interface nahi. Interface declarations merge ho sakte hain; type ka nahi. Dono objects handle karte hain.',
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
          prompt: { en: 'What prints?', hi: 'Kya print hoga?' },
          code: `interface Base { id: number }
interface Child extends Base { label: string }
const item: Child = { id: 1, label: 'first' };
console.log(item.label.toUpperCase());
`,
          expected: 'FIRST',
          explanation: { en: 'The interface inherits id and adds label.', hi: 'Interface id inherit karta hai aur label jodta hai.' },
        },

        {
          id: 'q6-2-2',
          type: 'bugfix',
          difficulty: 'easy',
          points: 10,
          prompt: { en: 'greeting() prints "undefined" for valid User objects.', hi: 'Greeting() valid User objects par "undefined" print karta hai.' },
          hint: { en: 'Check the property name against the interface.', hi: 'Property ka naam interface se match karo.' },
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
          explanation: { en: 'The interface defined name, so firstName is undefined at runtime.', hi: 'Interface mein name hai, isliye firstName runtime par undefined hota hai.' },
        },
      ],
    },
  ],
}