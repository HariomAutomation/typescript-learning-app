import type { Chapter } from '../types'

export const chapter07: Chapter = {
  id: 'ch07',
  number: 7,
  title: { en: 'Classes & OOP', hi: 'Classes aur OOP' },
  tagline: {
    en: 'Typed fields, accessors, visibility and abstract shapes.',
    hi: 'Typed fields, accessors, visibility aur abstract shapes.',
  },
  color: '#34d399',
  objectives: [
    { en: 'Declare fields, constructors, and methods tightly', hi: 'Fields, constructors aur methods declare karna' },
    { en: 'Use public/private/protected and readonly', hi: 'Public/private/protected aur readonly use karna' },
    { en: 'Implement interfaces and extend classes', hi: 'Interfaces implement karna aur classes extend karna' },
  ],
  lessons: [
    {
      id: 'l7-1',
      title: { en: 'Class Anatomy', hi: 'Class ki anatomy' },
      minutes: 8,
      sections: [
        {
          heading: { en: 'Fields with types', hi: 'Typed fields' },
          paragraphs: [
            {
              en: 'Every field either gets an initializer or a definite assignment in the constructor. Strict mode flags lazily-initialized fields with "no definite assignment" unless you use the definite assignment assertion `!`.',
              hi: 'Har field ko initializer ya constructor mein definite assignment chahiye hota hai. Lazy initialize karte ho to `!` (definite assignment assertion) use karna padta hai, warna strict mode error deta hai.',
            },
          ],
          blocks: [{
            kind: 'code',
            code: `class Counter {
  private count = 0;          // initializer
  readonly label: string;      // set in constructor
  startedAt!: Date;            // definite assignment assertion

  constructor(label: string) {
    this.label = label;
  }
  increment(): number { return ++this.count; }
}
`,
          }],
        },
        {
          heading: { en: 'Parameter properties', hi: 'Parameter properties' },
          paragraphs: [
            {
              en: 'A shortcut: annotating the constructor parameter with visibility turns it into a field automatically.',
              hi: 'Shortcut: constructor ke parameter par visibility likhte hi wo khud-ba-khud field ban jata hai.',
            },
          ],
          blocks: [{
            kind: 'code',
            code: `class User {
  constructor(
    public readonly name: string,
    private age: number,
  ) {}
  describe() { return \`\${this.name} (\${this.age})\`; }
}
`,
          }],
        },
        {
          heading: { en: 'Accessors: get / set', hi: 'Accessors: get / set' },
          paragraphs: [
            {
              en: 'Getters and setters let you wrap fields with logic while keeping the property syntax.',
              hi: 'Get/set se main fields ko logic mein wrap kar sakte ho, lekin property syntax same rehta hai.',
            },
          ],
        },
      ],
      questions: [
        {
          id: 'q7-1-1',
          type: 'code',
          difficulty: 'medium',
          points: 15,
          prompt: { en: 'Write a Person class: constructor name (public readonly) and age (private); method about() returns "Name (age)".', hi: 'Person class likho: constructor mein name (public readonly) aur age (private); about() method "Name (age)" return kare.' },
          starterCode: `export class Person {
  // TODO fields + constructor
  about(): string {
    return ''
  }
}`,
          hint: { en: 'Parameter properties do the magic.', hi: 'Parameter properties magic karti hain.' },
          testCode: `import { Person } from './solution'
const p = new Person('Aarav', 25)
console.log('Assert 1:', p.about() === 'Aarav (25)')
console.log('Assert 2:', p.name === 'Aarav')
`,
          explanation: {"en":"Parameter properties create the fields automatically.","hi":"Parameter properties mata hui fields automatically bana deti hain."},
        },
        {
          id: 'q7-1-2',
          type: 'mcq',
          difficulty: 'easy',
          points: 10,
          prompt: { en: 'What does `readonly` guarantee for fields?', hi: '`readonly` fields ke liye kya guarantee karta hai?' },
          options: [
            { en: 'The field cannot be reassigned after construction', hi: 'Construction ke baad field dobara assign nahi ho sakti' },
            { en: 'The value is immutable forever', hi: 'Value hamesha ke liye immutable hai' },
            { en: 'The field is private', hi: 'Field private hai' },
            { en: 'The field is static', hi: 'Field static hai' },
          ],
          correctIndex: 0,
          explanation: { en: 'readonly blocks reassignment on the field itself, not deep mutation.', hi: 'Readonly sirf field par dobara assignment rokta hai, deep mutation nahi rokta.' },
        },
      ],
    },
    {
      id: 'l7-2',
      title: { en: 'Abstract, implements & inheritance', hi: 'Abstract, implements aur inheritance' },
      minutes: 7,
      sections: [
        {
          heading: { en: 'Implements contracts only', hi: 'Implements sirf contract' },
          paragraphs: [
            {
              en: '`implements SomeInterface` states the class must satisfy the shape of the interface — it does not inherit implementation.',
              hi: '`implements` sirf yeh contract hota hai ki class ka shape interface ke jaissa hona chahiye — implementation inherit nahi hoti.',
            },
          ],
          blocks: [{
            kind: 'code',
            code: `interface Measurable { area(): number }
class Square implements Measurable {
  constructor(private side: number) {}
  area() { return this.side * this.side; }
}
`,
          }],
        },
        {
          heading: { en: 'Abstract: blur plans, defined factories', hi: 'Abstract: khaka, implementation nahi' },
          paragraphs: [
            {
              en: 'Abstract classes can define abstract members that children must implement — perfect for shared skeletons.',
              hi: 'Abstract classes abstract members define kar sakti hain, jinhe child classes implement karna zaroori hai — shared skeleton ke liye perfect.',
            },
          ],
          blocks: [{
            kind: 'code',
            code: `abstract class Shape {
  abstract area(): number;
  describe() { return \`area: \${this.area()}\`; }
}
class Circle extends Shape {
  constructor(private r: number) { super() }
  area() { return Math.PI * this.r ** 2 }
}
`,
          }],
        },
      ],
      questions: [
        {
          id: 'q7-2-1',
          type: 'truefalse',
          difficulty: 'medium',
          points: 15,
          prompt: { en: 'Evaluate:', hi: 'True ya False:' },
          statement: { en: 'A class that implements an interface inherits the interface\'s method implementations.', hi: 'Interface implement karne wali class ko interface ke methods ki implementation inherit hoti hai.' },
          answer: false,
          explanation: { en: 'implements only enforces the shape; you write the code.', hi: 'Implements sirf shape enforce karta hai; code aap khud likhte ho.' },
        },

        {
          id: 'q7-2-2',
          type: 'bugfix',
          difficulty: 'medium',
          points: 15,
          prompt: { en: 'Counter.increment() keeps returning the old value.', hi: 'Counter.increment() purani value return karta hai.' },
          hint: { en: 'Post-increment returns before counting. Swap to pre-increment.', hi: 'Post-increment return ke baad badhata hai. Pre-increment use karo.' },
          buggyCode: `export class Counter {
  value = 0

  increment(): number {
    return this.value++
  }
}`,
          fixedCode: `export class Counter {
  value = 0

  increment(): number {
    return ++this.value
  }
}`,
          testCode: `import { Counter } from './solution'
const c = new Counter()
console.log('Assert 1:', c.increment() === 1)
console.log('Assert 2:', c.increment() === 2)`,
          explanation: { en: 'value++ returns the old value then increments; ++value returns the new value.', hi: 'value++ pehle old value return karta hai phir increment karta hai; ++value nayi value return karta hai.' },
        },
      ],
    },
  ],
}