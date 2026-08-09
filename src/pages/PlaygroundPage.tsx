import { useMemo, useState } from 'react'
import { BookOpen, GitBranch, TerminalSquare } from 'lucide-react'
import { CodeRunPanel, OutputView } from '../components/CodeRunPanel'
import { useI18n } from '../i18n/LanguageContext'
import { useCodeRunner } from '../hooks/useCodeRunner'
import { inspectAst, transpileOnly } from '../lib/codeRunner'

const BOOTSTRAP = `// TypeScript Playground — edit & press Run
interface User {
  name: string
  age: number
}

function describe(u: User): string {
  return \`\${u.name} is \${u.age} years old\`
}

const me: User = { name: 'Hari', age: 21 }
console.log(describe(me))
console.log('hello, world!')`

export function PlaygroundPage() {
  const { t } = useI18n()
  const [code, setCode] = useState(BOOTSTRAP)
  const { state } = useCodeRunner()
  const [tab, setTab] = useState<'output' | 'compile' | 'ast'>('output')
  const [visual, setVisual] = useState<{ kind: string; text: string; loading: boolean } | null>(null)

  const fetchVisual = useMemo(
    () => async (kind: 'compile' | 'ast') => {
      setVisual({ kind, text: '', loading: true })
      try {
        if (kind === 'compile') {
          const { js, errors } = await transpileOnly(code)
          setVisual({ kind, text: errors.length ? `✗ ${errors.join('\n')}` : js, loading: false })
        } else {
          const { tree, errors } = await inspectAst(code)
          setVisual({ kind, text: errors.length ? `✗ ${errors.join('\n')}` : tree, loading: false })
        }
      } catch (err) {
        setVisual({ kind, text: String(err), loading: false })
      }
    },
    [code],
  )

  return (
    <div className="fade-up">
      <h1 style={{ fontSize: 28, marginBottom: 4 }}>{t('editor.title')}</h1>
      <p style={{ marginTop: 0, marginBottom: 20 }}>
        TypeScript → Worker sandbox · 2.5s timeout · AST & emitted JS on demand
      </p>

      <CodeRunPanel code={code} onCodeChange={setCode} height={340} />

      <div style={{ display: 'flex', gap: 8, margin: '18px 0 10px' }}>
        <button className={`btn btn-sm ${tab === 'output' ? 'btn-primary' : 'btn-ghost'}`} onClick={() => setTab('output')}>
          <TerminalSquare size={14} /> {t('editor.output')}
        </button>
        <button className={`btn btn-sm ${tab === 'compile' ? 'btn-primary' : 'btn-ghost'}`} onClick={() => void fetchVisual('compile')}>
          <BookOpen size={14} /> Compiled JS
        </button>
        <button className={`btn btn-sm ${tab === 'ast' ? 'btn-primary' : 'btn-ghost'}`} onClick={() => void fetchVisual('ast')}>
          <GitBranch size={14} /> AST
        </button>
      </div>

      {tab === 'output' && (
        <div className="glass" style={{ padding: 14 }}>
          <OutputView state={state} />
        </div>
      )}

      {tab !== 'output' && visual && (
        <pre
          style={{
            background: '#0b0f1d', border: '1px solid var(--border)', borderRadius: 10, padding: 14,
            color: 'var(--text-2)', fontSize: 12.5, overflow: 'auto', maxHeight: 420, whiteSpace: 'pre-wrap',
          }}
        >
          {visual.loading ? t('misc.loading') : visual.text}
        </pre>
      )}
    </div>
  )
}