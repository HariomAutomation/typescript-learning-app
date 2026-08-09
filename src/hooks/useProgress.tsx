import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react'
import type { ReactNode } from 'react'
import { CHAPTERS } from '../data'
import type { Question } from '../data/types'

/* ---------- persisted shape ---------- */

export interface ProgressState {
  completedLessons: string[]
  completedQuestions: string[]
  xp: number
  streak: number
  lastActiveDay: string | null
  dayHistory: Record<string, number>
}

export const initialProgress: ProgressState = {
  completedLessons: [],
  completedQuestions: [],
  xp: 0,
  streak: 0,
  lastActiveDay: null,
  dayHistory: {},
}

export type ProgressAction =
  | { type: 'lessonCompleted'; lessonId: string }
  | { type: 'questionAnswered'; question: Question; correct: boolean }
  | { type: 'dayVisited' }
  | { type: 'reset' }

const STORAGE_KEY = 'ts-progress-v1'

export function todayKey(): string {
  const d = new Date()
  return `${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()}`
}

export function yesterdayKey(): string {
  const d = new Date()
  d.setDate(d.getDate() - 1)
  return `${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()}`
}

/** Pure reducer — unit-testable without React or localStorage. */
export function reduceProgress(prev: ProgressState, action: ProgressAction): ProgressState {
  switch (action.type) {
    case 'lessonCompleted': {
      if (!action.lessonId || prev.completedLessons.includes(action.lessonId)) return prev
      const today = todayKey()
      return {
        ...prev,
        completedLessons: [...prev.completedLessons, action.lessonId],
        dayHistory: { ...prev.dayHistory, [today]: (prev.dayHistory[today] ?? 0) + 1 },
        xp: prev.xp + 50,
      }
    }
    case 'questionAnswered': {
      if (!action.question || prev.completedQuestions.includes(action.question.id) || !action.correct) {
        return prev
      }
      const today = todayKey()
      return {
        ...prev,
        completedQuestions: [...prev.completedQuestions, action.question.id],
        dayHistory: { ...prev.dayHistory, [today]: (prev.dayHistory[today] ?? 0) + 1 },
        xp: prev.xp + action.question.points,
      }
    }
    case 'dayVisited': {
      const today = todayKey()
      if (prev.lastActiveDay === today) return prev
      const active = yesterdayKey() === prev.lastActiveDay
      return { ...prev, lastActiveDay: today, streak: active ? prev.streak + 1 : 1 }
    }
    case 'reset':
      return initialProgress
  }
}

/* ---------- context ---------- */

export interface ProgressValue {
  state: ProgressState
  lessonCompleted: (lessonId: string) => void
  answerQuestion: (question: Question, correct: boolean) => void
  resetProgress: () => void
  isLessonDone: (lessonId: string) => boolean
  isQuestionDone: (questionId: string) => boolean
  totalLessons: number
  accuracy: number
}

const ProgressContext = createContext<ProgressValue | null>(null)

export function ProgressProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<ProgressState>(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY)
      if (raw) return { ...initialProgress, ...(JSON.parse(raw) as Partial<ProgressState>) }
    } catch {
      /* corrupted storage — start fresh */
    }
    return initialProgress
  })

  const appliedVisit = useRef(false)
  useEffect(() => {
    if (appliedVisit.current) return
    appliedVisit.current = true
    setState((s) => reduceProgress(s, { type: 'dayVisited' }))
  }, [])

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
    } catch {
      /* storage blocked/full — non-fatal */
    }
  }, [state])

  const lessonCompleted = useCallback(
    (lessonId: string) => setState((s) => reduceProgress(s, { type: 'lessonCompleted', lessonId })),
    [],
  )
  const answerQuestion = useCallback(
    (question: Question, correct: boolean) =>
      setState((s) => reduceProgress(s, { type: 'questionAnswered', question, correct })),
    [],
  )
  const resetProgress = useCallback(() => setState({ ...initialProgress }), [])

  const isLessonDone = useCallback((lessonId: string) => state.completedLessons.includes(lessonId), [state])
  const isQuestionDone = useCallback(
    (questionId: string) => state.completedQuestions.includes(questionId),
    [state],
  )

  const value = useMemo<ProgressValue>(() => {
      const doneCount = state.completedLessons.length + state.completedQuestions.length
      return {
        state,
        lessonCompleted: lessonCompleted,
        answerQuestion,
        resetProgress,
        isLessonDone,
        isQuestionDone,
        totalLessons: CHAPTERS.reduce((n, c) => n + c.lessons.length, 0),
        accuracy: doneCount === 0 ? 0 : Math.min(100, Math.round((state.completedQuestions.length / doneCount) * 100)),
      }
    }, [state, lessonCompleted, answerQuestion, resetProgress, isLessonDone, isQuestionDone])

  return <ProgressContext.Provider value={value}>{children}</ProgressContext.Provider>
}

export function useProgress(): ProgressValue {
  const ctx = useContext(ProgressContext)
  if (!ctx) throw new Error('useProgress must be used inside <ProgressProvider>')
  return ctx
}