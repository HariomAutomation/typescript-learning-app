import type { Chapter } from '../types'

export const chapter07: Chapter = {
  id: 'ch07',
  number: 7,
  title: { en: 'Classes & OOP', hi: 'klas aur OOP' },
  tagline: {
    en: 'Typed fields, accessors, visibility and abstract shapes.',
    hi: 'taipd feeld, eksesr, vijibilitee aur abstraikt aakar.',
  },
  color: '#34d399',
  objectives: [
    { en: 'Declare fields, constructors, and methods tightly', hi: 'feeld, knstrktr, methd ghoshit krna' },
    { en: 'Use public/private/protected and readonly', hi: 'public/private/protected aur readonly' },
    { en: 'Implement interfaces and extend classes', hi: 'intrfes implement aur klas extend krna' },
  ],
  lessons: [
    {
      id: 'l7-1',
      title: { en: 'Class Anatomy', hi: 'klas kee snrchna' },
      minutes: 8,
      sections: [
        {
          heading: { en: 'Fields with types', hi: 'taip vale feeld' },
          paragraphs: [
            {
              en: 'Every field either gets an initializer or a definite assignment in the constructor. Strict mode flags lazily-initialized fields with "no definite assignment" unless you use the definite assignment assertion `!`.',
              hi: 'hr feeld ko inishiylaijr ya knstrktr men vailyu chahie. lazy init ke lie `!` ka definite assignment assertion.',
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
          heading: { en: 'Parameter properties', hi: 'pairameetr proprteej' },
          paragraphs: [
            {
              en: 'A shortcut: annotating the constructor parameter with visibility turns it into a field automatically.',
              hi: 'shortkット: knstrktr pairameetr men visibility likhte hee vh feeld bn jata hai.',
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
          heading: { en: 'Accessors: get / set', hi: 'eksesr: get / set' },
          paragraphs: [
            {
              en: 'Getters and setters let you wrap fields with logic while keeping the property syntax.',
              hi: 'get/set ke jrie feeld ko lojik ke sath ghera jata hai.',
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
          prompt: { en: 'Write a Person class: constructor name (public readonly) and age (private); method about() returns "Name (age)".', hi: 'Person klas likhen: constructor men name (public readonly) aur age; about() methd "name (age)" lautae.' },
          starterCode: `export class Person {
  // TODO fields + constructor
  about(): string {
    return ''
  }
}`,
          hint: { en: 'Parameter properties do the magic.', hi: 'pairameetr proprteej kmal krtee hain.' },
          testCode: `import { Person } from './solution'
const p = new Person('Aarav', 25)
console.log('Assert 1:', p.about() === 'Aarav (25)')
console.log('Assert 2:', p.name === 'Aarav')
`,
          explanation: {"en":"Parameter properties create the fields automatically.","hi":"pairameetr proprteej feeld khud bna detee hain."},
        },
        {
          id: 'q7-1-2',
          type: 'mcq',
          difficulty: 'easy',
          points: 10,
          prompt: { en: 'What does `readonly` guarantee for fields?', hi: '`readonly` feeld ke lie kya nishchit krta hai?' },
          options: [
            { en: 'The field cannot be reassigned after construction', hi: 'knstrkshn ke bad feeld dobara asain nheen ho sktee' },
            { en: 'The value is immutable forever', hi: 'vailyu hmesha ke lie aprivrtneey hai' },
            { en: 'The field is private', hi: 'feeld private hai' },
            { en: 'The field is static', hi: 'feeld static hai' },
          ],
          correctIndex: 0,
          explanation: { en: 'readonly blocks reassignment on the field itself, not deep mutation.', hi: 'readonly sirf feeld pr dobara asainment rokta hai, ghra bdlav nheen.' },
        },
      ],
    },
    {
      id: 'l7-2',
      title: { en: 'Abstract, implements & inheritance', hi: 'Abstract, implements aur virast' },
      minutes: 7,
      sections: [
        {
          heading: { en: 'Implements contracts only', hi: 'Implement chahie sirf anubndh' },
          paragraphs: [
            {
              en: '`implements SomeInterface` states the class must satisfy the shape — it does not inherit implementation.',
              hi: '`implements` sirf ghoshit krta hai ki klas ka aakar intrfes jaisa hoga — koee kod virast nheen milta.',
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
          heading: { en: 'Abstract: blur plans, defined factories', hi: 'Abstract: khaka, aml nheen' },
          paragraphs: [
            {
              en: 'Abstract classes can define abstract members that children must implement — perfect for shared skeletons.',
              hi: 'Abstract klas men amurt sdsy hote hain jinhen bchcha klas bhrta hai.',
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
          prompt: { en: 'Evaluate:', hi: 'kthn sty ya asty:' },
          statement: { en: 'A class that implements an interface inherits the interface\'s method implementations.', hi: 'intrfes implement krne valee klas ko intrfes ke methd ka kod virast men milta hai.' },
          answer: false,
          explanation: { en: 'implements only enforces the shape; you write the code.', hi: 'implements sirf aakar kee janch krta hai; kod aap likhte hain.' },
        },

        {
          id: 'q7-2-2',
          type: 'bugfix',
          difficulty: 'medium',
          points: 15,
          prompt: { en: 'Counter.increment() keeps returning the old value.', hi: 'Counter.increment() puraani value return karta hai.' },
          hint: { en: 'Post-increment returns before counting. Swap to pre-increment.', hi: 'Post-increment value return ke baad bhadata hai. Pre-increment use karo.' },
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
          explanation: { en: 'value++ returns the old value then increments; ++value returns the new value.', hi: 'value++ pehle value return karta hai phir badhata hai; ++value nayi value return karta hai.' },
        },
      ],
    },
  ],
}