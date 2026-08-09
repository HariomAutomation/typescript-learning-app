import { Link, useParams } from 'react-router-dom'
import { ArrowLeft, ArrowRight } from 'lucide-react'
import { getChapter } from '../data'
import { useI18n } from '../i18n/LanguageContext'
import { useProgress } from '../hooks/useProgress'

export function ChapterPage() {
  const { t, L } = useI18n()
  const { chapterId } = useParams()
  const progress = useProgress()
  const chapter = getChapter(chapterId ?? '')

  if (!chapter) {
    return (
      <div className="glass" style={{ padding: 30, textAlign: 'center' }}>
        <h2>404</h2>
        <p>Unknown chapter.</p>
        <Link to="/learn" className="btn btn-primary">Home</Link>
      </div>
    )
  }

  const totalMinutes = chapter.lessons.reduce((n, l) => n + l.minutes, 0)
  const totalQuestions = chapter.lessons.reduce((n, l) => n + l.questions.length, 0)
  const done = chapter.lessons.filter((l) => progress.isLessonDone(l.id)).length

  return (
    <div className="fade-up" key={chapterId}>
      <Link to="/learn" className="btn btn-ghost btn-sm" style={{ marginBottom: 16 }}>
        <ArrowLeft size={14} /> {t('nav.learn')}
      </Link>

      <div style={{ display: 'flex', gap: 16, alignItems: 'center', marginBottom: 6, flexWrap: 'wrap' }}>
        <div
          style={{
            width: 56, height: 56, borderRadius: 16, display: 'grid', placeItems: 'center',
            background: `${chapter.color}22`, border: `1px solid ${chapter.color}55`, color: chapter.color,
            fontWeight: 800, fontSize: 26, flexShrink: 0,
          }}
        >
          {chapter.number}
        </div>
        <div>
          <h1 style={{ fontSize: 28, margin: 0 }}>{L(chapter.title)}</h1>
          <div style={{ display: 'flex', gap: 10, marginTop: 6, flexWrap: 'wrap' }}>
            <span className="chip">{totalMinutes} {t('misc.minutes')}</span>
            <span className="chip">{chapter.lessons.length} {t('chapter.lessons').toLowerCase()}</span>
            <span className="chip">{totalQuestions} {t('misc.questions')}</span>
          </div>
        </div>
      </div>
      <p style={{ maxWidth: 640 }}>{L(chapter.tagline)}</p>

      <div className="card" style={{ margin: '18px 0 24px' }}>
        <h3 style={{ fontSize: 15, marginBottom: 10 }}>{t('chapter.objectives')}</h3>
        <ul style={{ margin: 0, paddingLeft: 20 }}>
          {chapter.objectives.map((o, i) => (
            <li key={i} style={{ color: 'var(--text-2)', marginBottom: 5, fontSize: 14 }}>{L(o)}</li>
          ))}
        </ul>
      </div>

      <h3 style={{ fontSize: 17, marginBottom: 12 }}>{t('chapter.navigator')}</h3>
      <div style={{ display: 'grid', gap: 10 }}>
        {chapter.lessons.map((lesson, i) => {
          const isDone = progress.isLessonDone(lesson.id)
          return (
            <Link
              key={lesson.id}
              to={`/lesson/${chapter.id}/${lesson.id}`}
              className="card"
              style={{ display: 'flex', alignItems: 'center', gap: 14, textDecoration: 'none', padding: '14px 18px' }}
            >
              <div
                style={{
                  width: 34, height: 34, borderRadius: 10, display: 'grid', placeItems: 'center',
                  background: isDone ? 'var(--green)' : 'rgba(108,139,255,0.14)',
                  color: isDone ? '#fff' : 'var(--accent)', fontWeight: 800, fontSize: 14, flexShrink: 0,
                }}
              >
                {isDone ? '✓' : i + 1}
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontWeight: 600, fontSize: 14.5, color: 'var(--text-1)' }}>{L(lesson.title)}</div>
                <div style={{ fontSize: 12.5, color: 'var(--text-3)' }}>
                  {lesson.minutes} {t('misc.minutes')} · {lesson.questions.length} {t('misc.questions')}
                </div>
              </div>
              <ArrowRight size={15} style={{ color: 'var(--text-3)', flexShrink: 0 }} />
            </Link>
          )
        })}
      </div>

      <div className="progress-track" style={{ marginTop: 22, maxWidth: 420 }}>
        <div
          className="progress-fill"
          style={{ width: `${chapter.lessons.length ? Math.round((done / chapter.lessons.length) * 100) : 0}%` }}
        />
      </div>
      <p style={{ fontSize: 13, color: 'var(--text-3)', marginTop: 8 }}>
        {done}/{chapter.lessons.length} {t('chapter.lessons').toLowerCase()}
      </p>
    </div>
  )
}