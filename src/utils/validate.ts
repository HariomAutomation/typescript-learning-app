import type { Question, MCQQuestion, TrueFalseQuestion } from '../data/types'
import type { RunResult } from '../lib/codeRunner'

/** Trim each line and drop blank leading/trailing noise — for output comparison. */
export function normalizeOutput(raw: string): string {
  return raw
    .split('\n')
    .map((line) => line.trim())
    .join('\n')
    .trim()
}

/** Output questions: predicted console lines vs the worker logs. */
export function checkOutputMatches(logs: string[], expected: string): boolean {
  return normalizeOutput(logs.join('\n')) === normalizeOutput(expected)
}

/** MCQ: selected index is the correct one. */
export function checkMCQ(q: MCQQuestion, selectedIndex: number): boolean {
  return selectedIndex === q.correctIndex
}

/** True/False: given boolean matches the expected answer. */
export function checkTrueFalse(q: TrueFalseQuestion, answer: boolean): boolean {
  return answer === q.answer
}

export interface AssertRow {
  line: string
  passed: boolean
}

/**
 * Code-challenge harness convention: every test line prints `Assert N: true|false`
 * (legacy `A N:` forms are accepted too). Returns verdict + per-line detail,
 * or null when no plain-language asserts found.
 */
export function parseAssertions(logs: string[]): AssertRow[] | null {
  const rows: AssertRow[] = []
  for (let i = 0; i < logs.length; i++) {
    const line = logs[i]
    const match = /^(?:Assert|A)\s*(\d+):\s*(true|false)\s*$/i.exec(line)
    if (match) {
      rows.push({ line: line, passed: match[2].toLowerCase() === 'true' })
    }
  }
  return rows.length > 0 ? rows : null
}

export function allAssertsPass(rows: AssertRow[] | null): boolean {
  return !!rows && rows.length > 0 && rows.every((r) => r.passed)
}

/** "Test suite" interpretation of a code-challenge run. */
export function checkTestRun(result: RunResult | null): { pass: boolean; rows: AssertRow[] | null } {
  const rows = result ? parseAssertions(result.logs) : null
  return { pass: allAssertsPass(rows), rows }
}

export function questionAutoCheck(
  question: Question,
  payload: { selectedIndex?: number; booleanAnswer?: boolean; logs?: string[]; result?: RunResult | null },
): boolean {
  switch (question.type) {
    case 'mcq':
      return payload.selectedIndex !== undefined && checkMCQ(question, payload.selectedIndex)
    case 'truefalse':
      return payload.booleanAnswer !== undefined && checkTrueFalse(question, payload.booleanAnswer)
    case 'output':
      return !!(payload.logs && checkOutputMatches(payload.logs, question.expected))
    case 'code':
    case 'bugfix':
      return checkTestRun(payload.result ?? null).pass
  }
}