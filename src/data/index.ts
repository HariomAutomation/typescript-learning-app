import type { Chapter, Lesson, Question } from './types'
import { chapter01 } from './chapters/ch01'
import { chapter02 } from './chapters/ch02'
import { chapter03 } from './chapters/ch03'
import { chapter04 } from './chapters/ch04'
import { chapter05 } from './chapters/ch05'
import { chapter06 } from './chapters/ch06'
import { chapter07 } from './chapters/ch07'
import { chapter08 } from './chapters/ch08'
import { chapter09 } from './chapters/ch09'
import { chapter10 } from './chapters/ch10'

export const CHAPTERS: Chapter[] = [
  chapter01,
  chapter02,
  chapter03,
  chapter04,
  chapter05,
  chapter06,
  chapter07,
  chapter08,
  chapter09,
  chapter10,
]

export function getChapter(chapterId: string): Chapter | undefined {
  return CHAPTERS.find((c) => c.id === chapterId)
}

export function getLesson(chapterId: string, lessonId: string): Lesson | undefined {
  return getChapter(chapterId)?.lessons.find((l) => l.id === lessonId)
}

export function getChapterOfLesson(lessonId: string): { chapter: Chapter; lesson: Lesson } | undefined {
  for (const chapter of CHAPTERS) {
    const lesson = chapter.lessons.find((l) => l.id === lessonId)
    if (lesson) return { chapter, lesson }
  }
  return undefined
}

export function allQuestions(): Question[] {
  return CHAPTERS.flatMap((c) => c.lessons.flatMap((l) => l.questions))
}

export interface QuestionMeta {
  question: Question
  chapterId: string
  chapterNumber: number
  lessonId: string
}

export function allQuestionsWithMeta(): QuestionMeta[] {
  return CHAPTERS.flatMap((c) =>
    c.lessons.flatMap((l) =>
      l.questions.map((q) => ({ question: q, chapterId: c.id, chapterNumber: c.number, lessonId: l.id })),
    ),
  )
}

export const STATS = {
  chapters: CHAPTERS.length,
  lessons: CHAPTERS.reduce((n, c) => n + c.lessons.length, 0),
  questions: allQuestions().length,
  languages: 2,
}

export function nextLesson(chapterId: string, lessonIndex: number) {
  const chapter = getChapter(chapterId)
  if (!chapter) return null
  if (lessonIndex + 1 < chapter.lessons.length) {
    return { chapter, lesson: chapter.lessons[lessonIndex + 1] }
  }
  const next = CHAPTERS[CHAPTERS.indexOf(chapter) + 1]
  return next ? { chapter: next, lesson: next.lessons[0] } : null
}