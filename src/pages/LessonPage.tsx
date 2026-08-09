import { Link, useParams } from 'react-router-dom'
import { ArrowLeft, ArrowRight, PlayCircle } from 'lucide-react'
import { CHAPTERS, getChapter, getLesson } from '../data'
import type { Chapter, Lesson } from '../data/types'
import { useI18n } from '../i18n/LanguageContext'
import { useProgress } from '../hooks/useProgress'
import { QuestionCard } from '../components/QuestionCard'
import { ExerciseCard } from '../components/ExerciseCard'
import { BehindTheScenes } from '../components/BehindScenes'
import { CodeBlock } from '../components/CodeBlock'

export function LessonPage() {
  const { t, L } = useI18n()
  const { chapterId, lessonId } = useParams()
  const progress = useProgress()
  const chapter = getChapter(chapterId ?? '')
  const lesson = getLesson(chapterId ?? '', lessonId ?? '')

  if (!chapter || !lesson) {
    return (
      <div className="glass" style={{ padding: 30, textAlign: 'center' }}>
        <h2>404</h2>
        <p>Unknown lesson.</p>
        <Link to="/learn" className="btn btn-primary">Home</Link>
      </div>
    )
  }

  const lessonIndex = chapter.lessons.indexOf(lesson)
  const done = progress.isLessonDone(lesson.id)

  return (
    <div className="fade-up" key={`${chapterId}/${lessonId}`}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 18, flexWrap: 'wrap' }}>
        <Link to={`/chapter/${chapter.id}`} className="btn btn-ghost btn-sm">
          <ArrowLeft size={14} /> {t('lesson.backChapter')}
        </Link>
        <span className="chip" style={{ color: chapter.color }}>Ch {chapter.number}</span>
        <span className="chip">{lesson.minutes} {t('misc.minutes')}</span>
        {done && (
          <span className="chip" style={{ color: 'var(--green)' }}>
            <PlayCircle size={12} /> {t('lesson.completed')}
          </span>
        )}
      </div>

      <h1 style={{ fontSize: 28, marginBottom: 4 }}>{L(lesson.title)}</h1>
      <p style={{ color: 'var(--text-3)', fontSize: 13.5, marginBottom: 20 }}>
        {L(chapter.title)} — {t('chapter.lessons')} {lessonIndex + 1}/{chapter.lessons.length}
      </p>

      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) 340px', gap: 24, alignItems: 'start' }}>
        <div>
          {lesson.sections.map((section, i) => (
            <section key={i} style={{ marginBottom: 22 }}>
              <h2 style={{ fontSize: 19, marginBottom: 8 }}>{L(section.heading)}</h2>
              {section.paragraphs.map((p, j) => <p key={j} style={{ fontSize: 15 }}>{L(p)}</p>)}
              {section.blocks?.map((b, k) =>
                b.kind === 'code' ? (
                  <CodeBlock key={k} code={b.code} title={b.title} />
                ) : (
                  <ul key={k}>
                    {b.items.map((item, l) => (
                      <li key={l} style={{ color: 'var(--text-2)', marginBottom: 6 }}>{L(item)}</li>
                    ))}
                  </ul>
                ),
              )}
            </section>
          ))}

          <LessonNav chapter={chapter} lessonIndex={lessonIndex} />

          {lesson.exercise && <ExerciseCard exercise={lesson.exercise} />}

          {lesson.questions.length > 0 && (
            <section style={{ marginTop: 34 }}>
              <h2 style={{ fontSize: 22 }}>Quiz 💡</h2>
              <div style={{ display: 'grid', gap: 16, marginTop: 16 }}>
                {lesson.questions.map((q) => <QuestionCard key={q.id} question={q} />)}
              </div>
            </section>
          )}
        </div>

        <aside style={{ position: 'sticky', top: 90, display: 'grid', gap: 16 }}>
          {lesson.behindScenes && <BehindTheScenes data={lesson.behindScenes} />}

          <button
            className="btn btn-primary"
            style={{ width: '100%' }}
            onClick={() => progress.lessonCompleted(lesson.id)}
          >
            {done ? `${t('lesson.completed')} ✓` : `${t('lesson.complete')} +50 XP`}
          </button>
          <Link to={`/chapter/${chapter.id}`} className="btn btn-ghost" style={{ width: '100%', justifyContent: 'center' }}>
            {t('chapter.navigator')} →
          </Link>
        </aside>
      </div>
    </div>
  )
}

function LessonNav({ chapter, lessonIndex }: { chapter: Chapter; lessonIndex: number }) {
  const { t, L } = useI18n()
  const prev = lessonIndex > 0 ? chapter.lessons[lessonIndex - 1] : null
  const nextRef = nextLessonRef(chapter, lessonIndex)

  return (
    <div style={{ display: 'flex', gap: 12, marginTop: 26, flexWrap: 'wrap' }}>
      {prev && (
        <Link to={`/lesson/${chapter.id}/${prev.id}`} className="btn btn-ghost">
          <ArrowLeft size={15} /> {t('lesson.prev')}: {L(prev.title)}
        </Link>
      )}
      {nextRef && (
        <Link to={`/lesson/${nextRef.chapter.id}/${nextRef.lesson.id}`} className="btn btn-primary" style={{ marginLeft: 'auto' }}>
          {t('lesson.next')}: {L(nextRef.lesson.title)} <ArrowRight size={15} />
        </Link>
      )}
    </div>
  )
}

function nextLessonRef(chapter: Chapter, index: number): { chapter: Chapter; lesson: Lesson } | undefined {
  if (index + 1 < chapter.lessons.length) return { chapter, lesson: chapter.lessons[index + 1] }
  const next = CHAPTERS[CHAPTERS.indexOf(chapter) + 1]
  return next ? { chapter: next, lesson: next.lessons[0] } : undefined
}