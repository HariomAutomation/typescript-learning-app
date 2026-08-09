import { useState } from 'react'
import { Check, Lightbulb, Play, X } from 'lucide-react'
import type { Question } from '../data/types'
import { useI18n } from '../i18n/LanguageContext'
import { useProgress } from '../hooks/useProgress'
import { useCodeRunner } from '../hooks/useCodeRunner'
import { CodeBlock } from './CodeBlock'
import { CodeEditor } from './CodeEditor'
import { OutputView } from './CodeRunPanel'
import {
  allAssertsPass,
  checkMCQ,
  checkOutputMatches,
  checkTrueFalse,
  parseAssertions,
} from '../utils/validate'

export function QuestionCard({ question }: { question: Question }) {
  const { L, t } = useI18n()
  const progress = useProgress()
  const [selected, setSelected] = useState<number | null>(null)
  const [tfAnswer, setTfAnswer] = useState<boolean | null>(null)
  const [prediction, setPrediction] = useState('')
  const [code, setCode] = useState(getInitialCode(question))
  const [feedback, setFeedback] = useState<'none' | 'correct' | 'wrong'>('none')
  const [showExplanation, setShowExplanation] = useState(false)

  const { state: runState, run } = useCodeRunner()

  const answered = progress.isQuestionDone(question.id)

  const judge = (correct: boolean) => {
    setFeedback(correct ? 'correct' : 'wrong')
    setShowExplanation(true)
    if (correct) progress.answerQuestion(question, true)
  }

  const handleMCQ = () => {
    if (selected === null || question.type !== 'mcq') return
    judge(checkMCQ(question, selected))
  }

  const handleTF = () => {
    if (tfAnswer === null || question.type !== 'truefalse') return
    judge(checkTrueFalse(question, tfAnswer))
  }

  const handleOutputCheck = async () => {
    if (question.type !== 'output') return
    const result = await run(question.code)
    const logs = result.result?.logs ?? []
    judge(checkOutputMatches(logs, question.expected))
  }

  const handleCodeRun = async () => {
    const result = await run(code, getTestCode(question))
    const rows = result.result ? parseAssertions(result.result.logs) : null
    judge(allAssertsPass(rows))
  }

  return (
    <div
      className="card fade-up"
      style={{
        height: 'fit-content',
        borderColor:
          feedback === 'correct' ? 'var(--green)' : feedback === 'wrong' ? 'var(--red)' : undefined,
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10, flexWrap: 'wrap' }}>
        <span className="chip">{TYPE_LABELS[question.type]}</span>
        <span className={`chip tag-difficulty tag-${question.difficulty}`}>{question.difficulty}</span>
        <span className="chip" style={{ color: 'var(--cyan)' }}>+{question.points} XP</span>
        {answered && (
          <span className="chip" style={{ color: 'var(--green)' }}>
            <Check size={12} /> solved
          </span>
        )}
      </div>

      <h4 style={{ fontSize: 15.5, fontWeight: 650, marginBottom: 12 }}>{L(question.prompt)}</h4>

      {(question.type === 'output' || question.type === 'mcq') && question.type === 'output' && (
        <CodeBlock code={question.code} />
      )}
      {question.type === 'mcq' && question.code && <CodeBlock code={question.code} />}
      {question.type === 'bugfix' && <CodeBlock code={question.buggyCode} />}

      {question.type === 'mcq' && (
        <McqOptions question={question} selected={selected} onSelect={setSelected} onDone={handleMCQ} />
      )}

      {question.type === 'truefalse' && <TfPicker pick={tfAnswer} onPick={setTfAnswer} onCheck={handleTF} />}

      {question.type === 'output' && (
        <OutputPredictor
          prediction={prediction}
          setPrediction={setPrediction}
          onCheck={handleOutputCheck}
          onRun={() => void run(question.code)}
          runState={runState}
        />
      )}

      {(question.type === 'code' || question.type === 'bugfix') && (
        <CodeChallenge code={code} setCode={setCode} onRun={handleCodeRun} runState={runState} />
      )}
      {question.type === 'bugfix' && (
        <CodeBlock code={question.fixedCode} title={{ en: 'Fixed reference', hi: 'shee snskrn' }} />
      )}

      {!answered && feedback === 'wrong' && (
        <p style={{ color: 'var(--red)', fontSize: 13.5, margin: '12px 0 0', fontWeight: 600 }}>
          <X size={14} style={{ verticalAlign: -2 }} /> {t('question.wrong')}
        </p>
      )}
      {feedback === 'correct' && (
        <p style={{ color: 'var(--green)', fontSize: 13.5, margin: '12px 0 0', fontWeight: 700 }}>
          <Check size={14} style={{ verticalAlign: -2 }} /> {t('question.correct')} +{question.points} XP
        </p>
      )}

      {question.hint && (
        <details style={{ marginTop: 12 }}>
          <summary style={{ cursor: 'pointer', color: 'var(--accent)', fontSize: 13, fontWeight: 600 }}>
            <Lightbulb size={13} style={{ verticalAlign: -2 }} /> {t('question.showHint')}
          </summary>
          <p style={{ margin: '8px 0 0', fontSize: 13.5 }}>{L(question.hint)}</p>
        </details>
      )}

      {showExplanation && (
        <div
          style={{
            marginTop: 14,
            padding: '12px 14px',
            borderRadius: 10,
            border: '1px solid var(--border)',
            background: 'rgba(108,139,255,0.07)',
          }}
        >
          <div style={{ fontWeight: 700, fontSize: 13, marginBottom: 4, color: 'var(--text-1)' }}>
            {t('question.explanation')}
          </div>
          <p style={{ margin: 0, fontSize: 13.5 }}>{L(question.explanation)}</p>
        </div>
      )}
    </div>
  )
}

function McqOptions({
  question,
  selected,
  onSelect,
  onDone,
}: {
  question: Extract<Question, { type: 'mcq' }>
  selected: number | null
  onSelect: (i: number) => void
  onDone: () => void
}) {
  const { L } = useI18n()
  return (
    <div style={{ display: 'grid', gap: 8 }}>
      {question.options.map((opt, i) => (
        <button
          key={i}
          onClick={() => onSelect(i)}
          style={{
            textAlign: 'left',
            padding: '10px 14px',
            borderRadius: 10,
            border: `1px solid ${selected === i ? 'var(--accent)' : 'var(--border)'}`,
            background: selected === i ? 'rgba(108,139,255,0.15)' : 'rgba(255,255,255,0.03)',
            color: 'var(--text-1)',
            cursor: 'pointer',
            fontSize: 13.5,
            fontFamily: 'inherit',
            display: 'flex',
            gap: 10,
            alignItems: 'center',
          }}
        >
          <span className="mono" style={{ color: 'var(--accent)', fontWeight: 700 }}>
            {String.fromCharCode(65 + i)}
          </span>
          <span>{L(opt)}</span>
        </button>
      ))}
      <button className="btn btn-primary" style={{ justifySelf: 'start' }} disabled={selected === null} onClick={onDone}>
        Submit
      </button>
    </div>
  )
}

function TfPicker({
  pick,
  onPick,
  onCheck,
}: {
  pick: boolean | null
  onPick: (v: boolean) => void
  onCheck: () => void
}) {
  const { t } = useI18n()
  return (
    <div style={{ display: 'flex', gap: 10, alignItems: 'center', flexWrap: 'wrap' }}>
      {(['true', 'false'] as const).map((v) => {
        const val = v === 'true'
        return (
          <button
            key={v}
            onClick={() => onPick(val)}
            style={{
              padding: '10px 22px',
              borderRadius: 10,
              border: `1px solid ${pick === val ? 'var(--accent)' : 'var(--border)'}`,
              background: pick === val ? 'rgba(108,139,255,0.15)' : 'transparent',
              color: 'var(--text-1)',
              fontWeight: 700,
              cursor: 'pointer',
              fontSize: 14,
              fontFamily: 'inherit',
            }}
          >
            {t(v === 'true' ? 'question.true' : 'question.false')}
          </button>
        )
      })}
      <button className="btn btn-primary btn-sm" disabled={pick === null} onClick={onCheck}>
        Check
      </button>
    </div>
  )
}

function OutputPredictor({
  prediction,
  setPrediction,
  onCheck,
  onRun,
  runState,
}: {
  prediction: string
  setPrediction: (v: string) => void
  onCheck: () => void
  onRun: () => void
  runState: ReturnType<typeof useCodeRunner>['state']
}) {
  const { t } = useI18n()
  return (
    <div>
      <p style={{ fontSize: 13, color: 'var(--text-3)', margin: '8px 0 10px' }}>{t('question.outputs')}</p>
      <textarea
        value={prediction}
        onChange={(e) => setPrediction(e.target.value)}
        placeholder="…"
        rows={3}
        style={{
          width: '100%',
          boxSizing: 'border-box',
          background: '#0b0f1d',
          color: 'var(--text-1)',
          border: '1px solid var(--border)',
          borderRadius: 10,
          padding: 10,
          fontFamily: 'var(--mono)',
          fontSize: 13,
          resize: 'vertical',
        }}
      />
      <div style={{ display: 'flex', gap: 10, marginTop: 10, alignItems: 'center', flexWrap: 'wrap' }}>
        <button className="btn btn-primary btn-sm" disabled={!prediction.trim()} onClick={onCheck}>
          {t('question.check')}
        </button>
        <button className="btn btn-ghost btn-sm" onClick={onRun} disabled={runState.status === 'running'}>
          <Play size={13} /> {t('editor.run')}
        </button>
        {runState.status !== 'idle' && <OutputView state={runState} />}
      </div>
    </div>
  )
}

function CodeChallenge({
  code,
  setCode,
  onRun,
  runState,
}: {
  code: string
  setCode: (v: string) => void
  onRun: () => void
  runState: ReturnType<typeof useCodeRunner>['state']
}) {
  const { t } = useI18n()
  const rows = runState.result ? parseAssertions(runState.result.logs) : null
  const passed = rows ? rows.filter((r) => r.passed).length : 0
  const total = rows ? rows.length : 0

  return (
    <div>
      <CodeEditor value={code} onChange={(v) => setCode(v ?? '')} height={210} />
      <div style={{ display: 'flex', gap: 10, marginTop: 10, alignItems: 'center', flexWrap: 'wrap' }}>
        <button className="btn btn-primary btn-sm" onClick={onRun} disabled={runState.status === 'running'}>
          <Play size={13} /> {t('editor.run')}
        </button>
        {rows && (
          <span className="chip" style={passed === total ? { color: 'var(--green)' } : { color: 'var(--red)' }}>
            {passed}/{total} {t('question.passed')}
          </span>
        )}
      </div>
      {runState.status !== 'idle' && <div style={{ marginTop: 10 }}><OutputView state={runState} /></div>}
    </div>
  )
}

const TYPE_LABELS: Record<Question['type'], string> = {
  mcq: 'MCQ',
  output: 'Output',
  code: 'Code',
  bugfix: 'BugFix',
  truefalse: 'True/False',
}

function getInitialCode(q: Question): string {
  if (q.type === 'code') return q.starterCode
  if (q.type === 'bugfix') return q.buggyCode
  return ''
}

function getTestCode(q: Question): string | undefined {
  if (q.type === 'code' || q.type === 'bugfix') return q.testCode
  return undefined
}