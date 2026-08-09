import { useMemo, useState } from 'react'
import { CHAPTERS, allQuestionsWithMeta } from '../data'
import { useI18n } from '../i18n/LanguageContext'
import { QuestionCard } from '../components/QuestionCard'

export function PracticePage() {
  const { t } = useI18n()
  const [chapterFilter, setChapterFilter] = useState<string>('all')
  const [typeFilter, setTypeFilter] = useState<string>('all')
  const [difficulty, setDifficulty] = useState<string>('all')
  const [search, setSearch] = useState('')

  const resolved = useMemo(() => {
    const norm = search.trim().toLowerCase()
    return allQuestionsWithMeta().filter(({ question, chapterId }) => {
      if (chapterFilter !== 'all' && chapterId !== chapterFilter) return false
      if (typeFilter !== 'all' && question.type !== typeFilter) return false
      if (difficulty !== 'all' && question.difficulty !== difficulty) return false
      if (norm && !(`${question.prompt.en} ${question.prompt.hi}`.toLowerCase().includes(norm))) return false
      return true
    })
  }, [chapterFilter, typeFilter, difficulty, search])

  return (
    <div className="fade-up">
      <h1 style={{ fontSize: 28, marginBottom: 4 }}>{t('practice.title')}</h1>
      <p style={{ marginTop: 0, marginBottom: 20 }}>{t('practice.subtitle')}</p>

      <div className="glass" style={{ padding: 14, marginBottom: 20, display: 'flex', gap: 10, flexWrap: 'wrap', alignItems: 'center' }}>
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder={`🔍 ${t('practice.search')}`}
          style={{ flex: 1, minWidth: 180, background: '#0b0f1d', border: '1px solid var(--border)', borderRadius: 10, padding: '9px 12px', color: 'var(--text-1)', fontSize: 13.5 }}
        />
        <select value={chapterFilter} onChange={(e) => setChapterFilter(e.target.value)} style={selectStyle}>
          <option value="all">{t('practice.filterAll')}</option>
          {CHAPTERS.map((c) => (
            <option key={c.id} value={c.id}>Ch {c.number} · {c.title.en}</option>
          ))}
        </select>
        <select value={typeFilter} onChange={(e) => setTypeFilter(e.target.value)} style={selectStyle}>
          <option value="all">{t('practice.filterType')}</option>
          {(['mcq', 'output', 'code', 'bugfix', 'truefalse'] as const).map((ty) => (
            <option key={ty} value={ty}>{ty}</option>
          ))}
        </select>
        <select value={difficulty} onChange={(e) => setDifficulty(e.target.value)} style={selectStyle}>
          <option value="all">{t('practice.filterDifficulty')}</option>
          {(['easy', 'medium', 'hard'] as const).map((d) => (
            <option key={d} value={d}>{d}</option>
          ))}
        </select>
      </div>

      <div style={{ display: 'grid', gap: 16 }}>
        {resolved.length === 0 && <p style={{ color: 'var(--text-3)' }}>No questions match the filters.</p>}
        {resolved.map(({ question }) => (
          <QuestionCard key={question.id} question={question} />
        ))}
      </div>
    </div>
  )
}

const selectStyle: React.CSSProperties = {
  background: '#0b0f1d',
  border: '1px solid var(--border)',
  borderRadius: 10,
  padding: '9px 12px',
  color: 'var(--text-1)',
  fontSize: 13,
  fontFamily: 'inherit',
}