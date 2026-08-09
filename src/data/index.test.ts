import { describe, expect, it } from 'vitest'
import { CHAPTERS, STATS, allQuestions, allQuestionsWithMeta, getChapter, getChapterOfLesson, getLesson, nextLesson } from './index'
import { POINTS_BY_DIFFICULTY } from './types'

const DEVANAGARI = /[\u0900-\u097F]/

function checkLocalized(s: { en: string; hi: string }, where: string) {
  expect(s.en.length, `${where}: en empty`).toBeGreaterThan(0)
  expect(s.hi.length, `${where}: hi empty`).toBeGreaterThan(0)
  expect(s.en, `${where} en has Devanagari`).not.toMatch(DEVANAGARI)
  expect(s.hi, `${where} hi has Devanagari`).not.toMatch(DEVANAGARI)
}

describe('data · structure', () => {
  it('has 10 chapters numbered 1..10 with unique ids', () => {
    expect(STATS.chapters).toBe(CHAPTERS.length)
    const ids = CHAPTERS.map((c) => c.id)
    expect(new Set(ids).size).toBe(ids.length)
    expect(CHAPTERS.map((c) => c.number)).toEqual([1, 2, 3, 4, 5, 6, 7, 8, 9, 10])
    for (const c of CHAPTERS) {
      expect(c.color).toMatch(/^#[0-9a-fA-F]{6}$/)
      expect(c.lessons.length).toBeGreaterThanOrEqual(1)
    }
  })

  it('keeps lesson ids unique across the course', () => {
    const ids = CHAPTERS.flatMap((c) => c.lessons.map((l) => l.id))
    expect(new Set(ids).size).toBe(ids.length)
  })

  it('every lesson has content sections and questions', () => {
    for (const c of CHAPTERS) {
      for (const l of c.lessons) {
        expect(l.sections.length, l.id).toBeGreaterThanOrEqual(1)
        expect(l.minutes).toBeGreaterThan(0)
      }
    }
  })

  it('STATS matches the actual data', () => {
    const q = allQuestions()
    expect(STATS.lessons).toBe(CHAPTERS.reduce((n, c) => n + c.lessons.length, 0))
    expect(STATS.questions).toBe(q.length)
    expect(STATS.languages).toBe(2)
  })
})

describe('data · question well-formedness', () => {
  it('unique ids and full bilingual text without Devanagari (Hinglish!)', () => {
    const ids: string[] = []
    for (const q of allQuestions()) {
      ids.push(q.id)
      checkLocalized(q.prompt, q.id)
      checkLocalized(q.explanation, q.id)
      expect(POINTS_BY_DIFFICULTY[q.difficulty]).toBe(q.points)
      if (q.hint) checkLocalized(q.hint, `${q.id}.hint`)
    }
    expect(new Set(ids).size).toBe(ids.length)
  })

  it('only ships known question types (no stray "type" values)', () => {
    const known = new Set(['mcq', 'output', 'code', 'bugfix', 'truefalse'])
    for (const q of allQuestions()) {
      expect(known.has(q.type), `${q.id} has unknown type ${q.type}`).toBe(true)
    }
  })

  it('type-specific fields are consistent', () => {
    for (const q of allQuestions()) {
      switch (q.type) {
        case 'mcq':
          expect(q.options.length).toBeGreaterThanOrEqual(2)
          expect(q.correctIndex).toBeGreaterThanOrEqual(0)
          expect(q.correctIndex).toBeLessThan(q.options.length)
          for (const opt of q.options) checkLocalized(opt, `${q.id}.opt`)
          break
        case 'output':
          expect(q.code.length).toBeGreaterThan(0)
          expect(q.expected.length).toBeGreaterThan(0)
          break
        case 'code':
        case 'bugfix':
          expect(q.testCode).toContain('Assert')
          break
        case 'truefalse':
          expect(typeof q.answer).toBe('boolean')
          checkLocalized(q.statement, `${q.id}.statement`)
          break
      }
    }
  })
})

describe('data · lookup helpers', () => {
  it('getChapter / getLesson find real entries', () => {
    const first = CHAPTERS[0]
    expect(getChapter(first.id)).toBe(first)
    expect(getChapter('nonexistent')).toBeUndefined()
    expect(getLesson(first.id, first.lessons[0].id)).toBe(first.lessons[0])
    expect(getLesson(first.id, 'nope')).toBeUndefined()
    expect(getLesson('nope', 'x')).toBeUndefined()
  })

  it('getChapterOfLesson maps a lesson to its chapter', () => {
    const first = CHAPTERS[0]
    const hit = getChapterOfLesson(first.lessons[0].id)
    expect(hit?.chapter).toBe(first)
    expect(hit?.lesson).toBe(first.lessons[0])
    expect(getChapterOfLesson('nope')).toBeUndefined()
  })

  it('allQuestionsWithMeta carries chapter + lesson linkage', () => {
    const meta = allQuestionsWithMeta()
    expect(meta.length).toBe(STATS.questions)
    for (const m of meta) {
      expect(getChapter(m.chapterId)?.number).toBe(m.chapterNumber)
      expect(m.lessonId.length).toBeGreaterThan(0)
    }
  })

  it('nextLesson flows within chapter then across chapters, then null', () => {
    const c1 = CHAPTERS[0]
    expect(nextLesson(c1.id, 0)).toEqual({ chapter: c1, lesson: c1.lessons[1] })
    if (c1.lessons.length >= 3) {
      const mid = c1.lessons.length - 2
      expect(nextLesson(c1.id, mid)).toEqual({ chapter: c1, lesson: c1.lessons[mid + 1] })
    }
    const last = CHAPTERS[9]
    expect(nextLesson(last.id, last.lessons.length - 1)).toBeNull()
    expect(nextLesson('nope', 0)).toBeNull()
  })
})

describe('data · quality guardrails', () => {
  it('lesson/question ids trace back to their chapter number', () => {
    for (const c of CHAPTERS) {
      c.lessons.forEach((l, li) => {
        const lm = /^l(\d+)-(\d+)$/.exec(l.id)
        expect(lm, `${l.id} malformed`).not.toBeNull()
        expect(Number(lm?.[1]), `${l.id} chapter mismatch`).toBe(c.number)
        expect(Number(lm?.[2]), `${l.id} lesson index`).toBe(li + 1)
        l.questions.forEach((q, qi) => {
          const qm = /^q(\d+)-(\d+)-(\d+)$/.exec(q.id)
          expect(qm, `${q.id} malformed`).not.toBeNull()
          expect(Number(qm?.[1]), `${q.id} chapter`).toBe(c.number)
          expect(Number(qm?.[2]), `${q.id} lesson`).toBe(li + 1)
          expect(Number(qm?.[3]), `${q.id} counter`).toBe(qi + 1)
        })
      })
    }
  })

  it('defensive: every chapter object has the required keys', () => {
    for (const c of CHAPTERS) {
      const keys = new Set(Object.keys(c))
      for (const k of ['id', 'number', 'title', 'tagline', 'color', 'objectives', 'lessons']) {
        expect(keys.has(k), `${c.id} missing ${k}`).toBe(true)
      }
    }
  })
})