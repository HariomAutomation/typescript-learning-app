import type { LocalizedString } from '../i18n/types'

export type Difficulty = 'easy' | 'medium' | 'hard'

// ---------- Lesson content blocks ----------

export interface CodeBlock {
  kind: 'code'
  code: string
  title?: LocalizedString
}

export interface Section {
  heading: LocalizedString
  paragraphs: LocalizedString[]
  blocks?: (CodeBlock | { kind: 'list'; items: LocalizedString[] })[]
}

export interface BehindScenes {
  title: LocalizedString
  description: LocalizedString
  visual?: 'compiled-js' | 'ast' | 'type-systems'
  blocks: Section[]
}

export interface LessonExercise {
  prompt: LocalizedString
  starterCode: string
  hint: LocalizedString | null
  testCode: string
}

export interface Lesson {
  id: string
  title: LocalizedString
  minutes: number
  sections: Section[]
  questions: Question[]
  behindScenes?: BehindScenes
  exercise?: LessonExercise
}

export interface Chapter {
  id: string
  number: number
  title: LocalizedString
  tagline: LocalizedString
  color: string
  objectives: LocalizedString[]
  lessons: Lesson[]
}

// ---------- Questions ----------

export interface QuestionBase {
  id: string
  type: string
  difficulty: Difficulty
  points: number
  prompt: LocalizedString
  explanation: LocalizedString
  hint?: LocalizedString | null
}

export interface MCQQuestion extends QuestionBase {
  type: 'mcq'
  code?: string
  options: LocalizedString[]
  correctIndex: number
}

export interface OutputQuestion extends QuestionBase {
  type: 'output'
  code: string
  expected: string
}

export interface CodeQuestion extends QuestionBase {
  type: 'code'
  starterCode: string
  /** JavaScript that defines test cases and asserts in the sandbox. See harness. */
  testCode: string
}

export interface BugFixQuestion extends QuestionBase {
  type: 'bugfix'
  buggyCode: string
  fixedCode: string
  testCode: string
}

export interface TrueFalseQuestion extends QuestionBase {
  type: 'truefalse'
  code?: string
  statement: LocalizedString
  answer: boolean
}

export type Question =
  | MCQQuestion
  | OutputQuestion
  | CodeQuestion
  | BugFixQuestion
  | TrueFalseQuestion

export interface QuizExercise {
  prompt: LocalizedString
  starterCode: string
  hint: LocalizedString | null
  testCode: string
}

export const POINTS_BY_DIFFICULTY: Record<Difficulty, number> = {
  easy: 10,
  medium: 15,
  hard: 25,
}

export function difficultyPoints(d: Difficulty): number {
  return POINTS_BY_DIFFICULTY[d]
}

export function questionPoints(d: Difficulty): number {
  return POINTS_BY_DIFFICULTY[d]
}