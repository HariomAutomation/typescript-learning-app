import { useCallback, useMemo } from 'react'
import { AlertTriangle, Play, TerminalSquare } from 'lucide-react'
import { useCodeRunner } from '../hooks/useCodeRunner'
import type { RunState } from '../hooks/useCodeRunner'
import { CodeEditor } from './CodeEditor'
import { useI18n } from '../i18n/LanguageContext'

/**
 * Shared Run Panel: editor + Run button + captured output.
 * Worker-based execution with 2.5s timeout & cancellation (see useCodeRunner).
 */
export function CodeRunPanel({
  code,
  onCodeChange,
  height = 300,
}: {
  code: string
  onCodeChange?: (code: string) => void
  height?: number | string
}) {
  const { t } = useI18n()
  const { state, run, cancel } = useCodeRunner()

  const handleRun = useCallback(() => {
    void run(code)
  }, [code, run])

  const busy = state.status === 'running'

  return (
    <div className="glass" style={{ overflow: 'hidden' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '10px 14px', borderBottom: '1px solid var(--border)' }}>
        <span style={{ fontWeight: 700, fontSize: 13 }}>{'TypeScript …'}</span>
        <span className="chip">{'ts'}</span>
        <div style={{ flex: 1 }} />
        <button className="btn btn-primary btn-sm" onClick={handleRun} disabled={busy || !code.trim()}>
          <Play size={14} /> {busy ? t('editor.running') : t('editor.run')}
        </button>
        {busy && (
          <button className="btn btn-ghost btn-sm" onClick={cancel}>
            ✕
          </button>
        )}
      </div>
      <div style={{ padding: 14 }}>
        <CodeEditor value={code} onChange={(v) => onCodeChange?.(v ?? '')} height={height} />
      </div>
      <div style={{ padding: '0 14px 14px' }}>
        <OutputView state={state} />
      </div>
    </div>
  )
}

export function OutputView({ state }: { state: RunState }) {
  const { t } = useI18n()

  const { kind, text, meta } = useMemo(
    () => renderOutput(state, t as (k: string) => string),
    [state, t],
  )

  return (
    <div style={{ border: '1px solid var(--border)', borderRadius: 10, overflow: 'hidden', background: '#0b0f1d' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '8px 12px', borderBottom: '1px solid var(--border)', color: 'var(--text-3)', fontSize: 12, fontWeight: 600 }}>
        <TerminalSquare size={13} />
        {t('editor.output')}
        {(kind === 'error' || kind === 'timeout') && <AlertTriangle size={13} style={{ color: 'var(--red)' }} />}
        {kind === 'ok' && meta && <span className="chip" style={{ marginLeft: 6 }}>{meta}</span>}
      </div>
      <pre style={{ margin: 0, padding: '12px 14px', minHeight: 56, maxHeight: 260, overflow: 'auto', color: 'var(--text-2)', fontSize: 12.5, lineHeight: 1.6, whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>
        {text}
      </pre>
    </div>
  )
}

type OutputKind = 'idle' | 'running' | 'cancelled' | 'timeout' | 'error' | 'ok'

function renderOutput(
  state: RunState,
  t: (k: string) => string,
): { kind: OutputKind; text: string; meta?: string } {
  if (state.status === 'idle') return { kind: 'idle', text: '––' }
  if (state.status === 'running') return { kind: 'running', text: t('editor.running') }
  if (state.status === 'cancelled') return { kind: 'cancelled', text: t('runner.cancelled') }
  if (state.status === 'timeout') return { kind: 'timeout', text: t('runner.timeout') }
  if (state.status === 'error') return { kind: 'error', text: `✗ ${state.result?.error ?? t('runner.error')}` }
  return {
    kind: 'ok',
    text: state.result?.logs?.length ? state.result.logs.join('\n') : '∎ (no output)',
    meta: `${state.result?.durationMs ?? 0}ms`,
  }
}