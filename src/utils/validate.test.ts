import { describe, expect, it } from 'vitest'
import type { CodeQuestion, MCQQuestion } from '../data/types'
import type { RunResult } from '../lib/codeRunner'
import {
  allAssertsPass,
  checkMCQ,
  checkOutputMatches,
  checkTestRun,
  checkTrueFalse,
  normalizeOutput,
  parseAssertions,
  questionAutoCheck,
} from './validate'

const mcq: MCQQuestion = {
  id: 'q-mcq-1',
  type: 'mcq',
  difficulty: 'easy',
  points: 10,
  prompt: { en: 'Pick one', hi: 'ek chune' },
  explanation: { en: 'First option', hi: 'pahla vikalp' },
  options: [
    { en: 'A', hi: 'A' },
    { en: 'B', hi: 'B' },
    { en: 'C', hi: 'C' },
  ],
  correctIndex: 1,
}

const sampleCodeQuestion: CodeQuestion = {
  id: 'q-code-1',
  type: 'code',
  difficulty: 'medium',
  points: 15,
  prompt: { en: 'Write fn', hi: 'fn likho' },
  explanation: { en: 'Use map', hi: 'map use kro' },
  starterCode: 'export function f(x: number): number {\n  // your code\n}',
  testCode: `import { f } from './solution'
console.log('Assert 1:', f(2) === 4)`,
}

function runResult(ok: boolean, logs: string[], error?: string): RunResult {
  return { ok, logs, error, durationMs: 5 }
}

describe('validate · normalizeOutput', () => {
  it('trims every line and the whole block', () => {
    expect(normalizeOutput('  a  \n\tb\n\n')).toBe('a\nb')
  })

  it('returns empty string for blank input', () => {
    expect(normalizeOutput('   \n ')).toBe('')
  })
})

describe('validate · checkOutputMatches', () => {
  it('accepts whitespace differences', () => {
    expect(checkOutputMatches(['  1 ', '2'], '1\n2')).toBe(true)
  })

  it('rejects different lines', () => {
    expect(checkOutputMatches(['1', '3'], '1\n2')).toBe(false)
  })

  it('rejects different line counts', () => {
    expect(checkOutputMatches(['1'], '1\n2')).toBe(false)
  })
})

describe('validate · checkMCQ / checkTrueFalse', () => {
  it('marks the correct index', () => {
    expect(checkMCQ(mcq, 1)).toBe(true)
    expect(checkMCQ(mcq, 0)).toBe(false)
  })

  it('checks boolean statement answers', () => {
    const tf = { ...mcq, type: 'truefalse' as const, statement: mcq.prompt, answer: true, options: undefined, correctIndex: undefined }
    expect(checkTrueFalse(tf, true)).toBe(true)
    expect(checkTrueFalse(tf, false)).toBe(false)
  })
})

describe('validate · parseAssertions', () => {
  it('parses Assert N: true/false lines', () => {
    const rows = parseAssertions(['Assert 1: true', 'Assert 2: false', 'ordinary log'])
    expect(rows).toEqual([
      { line: 'Assert 1: true', passed: true },
      { line: 'Assert 2: false', passed: false },
    ])
  })

  it('is case-insensitive', () => {
    expect(parseAssertions(['ASSERT 1: True'])?.[0]).toEqual({ line: 'ASSERT 1: True', passed: true })
  })

  it('returns null when no asserts found', () => {
    expect(parseAssertions(['just', 'regular', 'logs'])).toBeNull()
    expect(parseAssertions([])).toBeNull()
  })
})

describe('validate · allAssertsPass / checkTestRun', () => {
  it('requires at least one passing assert', () => {
    expect(allAssertsPass(null)).toBe(false)
    expect(allAssertsPass([])).toBe(false)
    expect(allAssertsPass([{ line: 'a', passed: true }])).toBe(true)
    expect(allAssertsPass([{ line: 'a', passed: true }, { line: 'b', passed: false }])).toBe(false)
  })

  it('checkTestRun bridges a run result', () => {
    const pass = checkTestRun(runResult(true, ['Assert 1: true']))
    expect(pass.pass).toBe(true)
    expect(pass.rows).toHaveLength(1)

    const fail = checkTestRun(runResult(true, ['Assert 1: false']))
    expect(fail.pass).toBe(false)

    const none = checkTestRun(null)
    expect(none.pass).toBe(false)
    expect(none.rows).toBeNull()
  })
})

describe('validate · questionAutoCheck', () => {
  it('routes every question type', () => {
    expect(questionAutoCheck(mcq, { selectedIndex: 1 })).toBe(true)
    expect(questionAutoCheck(mcq, { selectedIndex: 0 })).toBe(false)
    expect(questionAutoCheck(mcq, {})).toBe(false)

    const tf = { ...mcq, type: 'truefalse' as const, statement: mcq.prompt, answer: true }
    expect(questionAutoCheck(tf, { booleanAnswer: true })).toBe(true)
    expect(questionAutoCheck(tf, {})).toBe(false)

    const output = { ...mcq, type: 'output' as const, code: 'console.log(1)', expected: '1' }
    expect(questionAutoCheck(output, { logs: ['1'] })).toBe(true)
    expect(questionAutoCheck(output, { logs: ['2'] })).toBe(false)

    expect(questionAutoCheck(sampleCodeQuestion, { result: runResult(true, ['Assert 1: true']) })).toBe(true)
    expect(questionAutoCheck(sampleCodeQuestion, {})).toBe(false)
  })
})