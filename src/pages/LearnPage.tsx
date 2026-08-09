import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'
import { CHAPTERS } from '../data'
import { useI18n } from '../i18n/LanguageContext'
import { useProgress } from '../hooks/useProgress'

export function LearnPage() {
  const { t, L } = useI18n()
  const progress = useProgress()

  return (
    <div className="fade-up">
      <h1 style={{ fontSize: 28, marginBottom: 4 }}>{t('dash.title')}</h1>
      <p style={{ marginTop: 0, marginBottom: 22 }}>
        {progress.state.completedLessons.length}/{progress.totalLessons} {t('dash.lessonsDone').toLowerCase()}
      </p>

      <div style={{ display: 'grid', gap: 14 }}>
        {CHAPTERS.map((chapter) => {
          const done = chapter.lessons.filter((l) => progress.isLessonDone(l.id)).length
          const pct = Math.round((done / chapter.lessons.length) * 100)
          return (
            <Link
              key={chapter.id}
              to={`/chapter/${chapter.id}`}
              className="card"
              style={{ display: 'flex', gap: 18, alignItems: 'center', textDecoration: 'none' }}
            >
              <div
                style={{
                  width: 52, height: 52, borderRadius: 14, display: 'grid', placeItems: 'center',
                  background: `${chapter.color}22`, border: `1px solid ${chapter.color}55`,
                  color: chapter.color, fontWeight: 800, fontSize: 20, flexShrink: 0,
                }}
              >
                {chapter.number}
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <h3 style={{ margin: '0 0 4px', fontSize: 16 }}>{L(chapter.title)}</h3>
                <p style={{ margin: 0, fontSize: 13.5, color: 'var(--text-2)' }}>
                  {L(chapter.tagline)}
                </p>
                <div className="progress-track" style={{ marginTop: 10, maxWidth: 320 }}>
                  <div className="progress-fill" style={{ width: `${pct}%` }} />
                </div>
              </div>
              <div style={{ textAlign: 'right', flexShrink: 0 }}>
                <div style={{ fontSize: 12.5, color: 'var(--text-3)', marginBottom: 6, whiteSpace: 'nowrap' }}>
                  {done}/{chapter.lessons.length} • {chapter.lessons.reduce((n, l) => n + l.questions.length, 0)} {t('misc.questions')}
                </div>
                <span className="btn btn-ghost btn-sm">
                  {t('misc.unlock')} <ArrowRight size={13} />
                </span>
              </div>
            </Link>
          )
        })}
      </div>
    </div>
  )
}