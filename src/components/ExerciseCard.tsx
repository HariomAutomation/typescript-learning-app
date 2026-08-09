import { useState } from 'react'
import { Lightbulb, Play, Wrench } from 'lucide-react'
import { CodeEditor } from './CodeEditor'
import { OutputView } from './CodeRunPanel'
import { useI18n } from '../i18n/LanguageContext'
import { useCodeRunner } from '../hooks/useCodeRunner'
import { parseAssertions } from '../utils/validate'
import type { LessonExercise } from '../data/types'

/**
 * In-lesson hands-on micro-challenge: starter code + hidden assert harness.
 * Runs in the same sandbox as the playground; result is advisory
 * (no progression/XP — exercises are for practice, questions for points).
 */
export function ExerciseCard({ exercise }: { exercise: LessonExercise }) {
  const { L, t } = useI18n()
  const { state, run } = useCodeRunner()
  const [code, setCode] = useState(exercise.starterCode)

  const rows = state.result ? parseAssertions(state.result.logs) : null
  const passed = rows ? rows.filter((r) => r.passed).length : 0
  const total = rows ? rows.length : 0
  const allPass = rows !== null && rows.length > 0 && passed === total

  return (
    <section className="card" style={{ marginTop: 22, borderColor: 'rgba(167,139,250,0.35)' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
        <Wrench size={15} style={{ color: 'var(--accent-2)' }} />
        <h3 style={{ margin: 0, fontSize: 15 }}>{t('chapter.exercise')}</h3>
        <span className="chip" style={{ color: 'var(--accent-2)' }}>🧪</span>
      </div>
      <p style={{ fontSize: 14, marginTop: 0 }}>{L(exercise.prompt)}</p>

      <CodeEditor value={code} onChange={(v) => setCode(v ?? '')} height={180} />

      <div style={{ display: 'flex', gap: 10, marginTop: 10, alignItems: 'center', flexWrap: 'wrap' }}>
        <button
          className="btn btn-primary btn-sm"
          onClick={() => void run(code, exercise.testCode)}
          disabled={state.status === 'running'}
        >
          <Play size={13} /> {t('editor.run')}
        </button>
        {rows && (
          <span
            className="chip"
            style={allPass ? { color: 'var(--green)' } : { color: 'var(--red)' }}
          >
            {passed}/{total} {t('question.passed')}
          </span>
        )}
      </div>

      {state.status !== 'idle' && (
        <div style={{ marginTop: 10 }}>
          <OutputView state={state} />
        </div>
      )}

      {exercise.hint && (
        <details style={{ marginTop: 10 }}>
          <summary style={{ cursor: 'pointer', color: 'var(--accent)', fontSize: 13, fontWeight: 600 }}>
            <Lightbulb size={13} style={{ verticalAlign: -2 }} /> {t('question.showHint')}
          </summary>
          <p style={{ margin: '8px 0 0', fontSize: 13.5 }}>{L(exercise.hint)}</p>
        </details>
      )}
    </section>
  )
}