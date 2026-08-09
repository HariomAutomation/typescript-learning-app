import { lazy, Suspense, useMemo } from 'react'
import { ErrorBoundary } from './ErrorBoundary'

const MonacoEditor = lazy(() => import('@monaco-editor/react').then((m) => ({ default: m.Editor })))

/* @monaco-editor/react loads monaco from the jsDelivr CDN by default,
   keeping the app bundle lean and GitHub Pages friendly. */

interface CodeEditorProps {
  value: string
  onChange?: (value: string | undefined) => void
  readOnly?: boolean
  height?: number | string
  language?: string
}

export function CodeEditor({ value, onChange, readOnly, height = '100%', language = 'typescript' }: CodeEditorProps) {
  const options = useMemo(
    () => ({
      minimap: { enabled: false },
      fontSize: 13.5,
      fontFamily: "'JetBrains Mono', monospace",
      lineNumbers: 'on' as const,
      scrollBeyondLastLine: false,
      automaticLayout: true,
      tabSize: 2,
      readOnly: !!readOnly,
      padding: { top: 10, bottom: 10 },
    }),
    [readOnly],
  )

  return (
    <ErrorBoundary fallback={<TextareaEditor value={value} onChange={onChange} readOnly={readOnly} />}>
      <Suspense fallback={<div className="glass" style={{ height, display: 'grid', placeItems: 'center', color: 'var(--text-3)', fontSize: 13 }}>Loading editor…</div>}>
        <MonacoEditor
          height={height}
          language={language}
          value={value}
          theme="vs-dark"
          options={options}
          onChange={onChange}
        />
      </Suspense>
    </ErrorBoundary>
  )
}

function TextareaEditor({ value, onChange, readOnly }: { value: string; onChange?: (v: string | undefined) => void; readOnly?: boolean }) {
  return (
    <textarea
      className="code-block"
      style={{ width: '100%', height: '100%', minHeight: 180, resize: 'vertical', background: '#0b0f1d', color: '#cdd6f4', border: '1px solid var(--border)', fontFamily: "var(--mono)", fontSize: 13, padding: 14 }}
      value={value}
      readOnly={readOnly}
      spellCheck={false}
      onChange={(e) => onChange?.(e.target.value)}
    />
  )
}

export default CodeEditor