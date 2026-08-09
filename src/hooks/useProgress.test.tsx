import { afterEach, describe, expect, it, vi } from 'vitest'
import { initialProgress, reduceProgress, todayKey, yesterdayKey } from './useProgress'
import type { Question } from '../data/types'

const sampleQuestion: Question = {
  id: 'q-x-1',
  type: 'mcq',
  difficulty: 'easy',
  points: 10,
  prompt: { en: 'Q', hi: 'Q' },
  explanation: { en: 'E', hi: 'E' },
  options: [
    { en: 'a', hi: 'a' },
    { en: 'b', hi: 'b' },
  ],
  correctIndex: 1,
}

afterEach(() => {
  vi.useRealTimers()
})

describe('reduceProgress · lessons', () => {
  it('gives 50 XP and records the day once', () => {
    const a = reduceProgress(initialProgress, { type: 'lessonCompleted', lessonId: 'l1' })
    expect(a.xp).toBe(50)
    expect(a.completedLessons).toEqual(['l1'])
    expect(a.dayHistory[todayKey()]).toBe(1)

    const b = reduceProgress(a, { type: 'lessonCompleted', lessonId: 'l1' })
    expect(b).toBe(a)
  })
})

describe('reduceProgress · questions', () => {
  it('only correct answers earn points once', () => {
    const wrong = reduceProgress(initialProgress, { type: 'questionAnswered', question: sampleQuestion, correct: false })
    expect(wrong.xp).toBe(0)
    expect(wrong.completedQuestions).toEqual([])

    const right = reduceProgress(initialProgress, { type: 'questionAnswered', question: sampleQuestion, correct: true })
    expect(right.xp).toBe(10)
    expect(right.completedQuestions).toEqual(['q-x-1'])
    expect(right.dayHistory[todayKey()]).toBe(1)

    const again = reduceProgress(right, { type: 'questionAnswered', question: sampleQuestion, correct: true })
    expect(again).toBe(right)
  })
})

describe('reduceProgress · streaks', () => {
  it('first visit starts streak at 1', () => {
    const s = reduceProgress(initialProgress, { type: 'dayVisited' })
    expect(s.streak).toBe(1)
    expect(s.lastActiveDay).toBe(todayKey())
  })

  it('same day is a no-op', () => {
    const s = reduceProgress(initialProgress, { type: 'dayVisited' })
    expect(reduceProgress(s, { type: 'dayVisited' })).toBe(s)
  })

  it('consecutive-day visit increments the streak', () => {
    vi.useFakeTimers()
    vi.setSystemTime(new Date(2026, 7, 9, 10, 0, 0))
    const prev = { ...initialProgress, lastActiveDay: yesterdayKey(), streak: 3 }
    const s = reduceProgress(prev, { type: 'dayVisited' })
    expect(s.streak).toBe(4)
  })

  it('a missed day resets the streak to 1', () => {
    vi.useFakeTimers()
    vi.setSystemTime(new Date(2026, 7, 9, 10, 0, 0))
    const prev = { ...initialProgress, lastActiveDay: '2026-8-1', streak: 9 }
    const s = reduceProgress(prev, { type: 'dayVisited' })
    expect(s.streak).toBe(1)
  })
})

describe('reduceProgress · reset', () => {
  it('wipes everything', () => {
    const grown = reduceProgress(
      { ...initialProgress, xp: 400, completedLessons: ['a'], completedQuestions: ['b'] },
      { type: 'reset' },
    )
    expect(grown).toEqual(initialProgress)
  })
})

describe('date helpers', () => {
  it('yesterdayKey is the day before todayKey', () => {
    vi.useFakeTimers()
    vi.setSystemTime(new Date(2026, 7, 9, 0, 0, 0))
    expect(todayKey()).toBe('2026-8-9')
    expect(yesterdayKey()).toBe('2026-8-8')
  })
})