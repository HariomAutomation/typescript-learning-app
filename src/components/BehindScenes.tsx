import { useEffect, useState } from 'react'
import { useI18n } from '../i18n/LanguageContext'
import type { BehindScenes } from '../data/types'
import { CodeBlock } from './CodeBlock'
import { inspectAst, transpileOnly } from '../lib/codeRunner'

/**
 * Behind-the-scenes deep dive: explanation blocks plus an interactive
 * visualization (emitted JavaScript or AST tree) that shares the cached
 * `import('typescript')` promise via tsLoader inside codeRunner helpers.
 */
export function BehindTheScenes({ data }: { data: BehindScenes }) {
  const { L } = useI18n()
  const visual = data.visual ?? 'compiled-js'

  return (
    <section className="glass" style={{ marginTop: 28, padding: 22 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap', marginBottom: 12 }}>
        <span className="chip" style={{ background: 'rgba(167,139,250,0.12)', color: 'var(--accent-2)' }}>🔬</span>
        <h3 style={{ margin: 0, fontSize: 17 }}>{L(data.title)}</h3>
      </div>
      <p style={{ marginTop: 0 }}>{L(data.description)}</p>

      {data.blocks.map((block, idx) => (
        <div key={idx} style={{ marginTop: 14 }}>
          <h4 style={{ fontSize: 14.5, margin: '0 0 6px' }}>{L(block.heading)}</h4>
          {block.paragraphs.map((p, i) => (
            <p key={i} style={{ fontSize: 14 }}>{L(p)}</p>
          ))}
          {block.blocks?.map((b, i) =>
            b.kind === 'code' ? (
              <CodeBlock key={i} code={b.code} title={b.title} />
            ) : (
              <ul key={i}>
                {b.items.map((item, j) => (
                  <li key={j} style={{ color: 'var(--text-2)', marginBottom: 6 }}>{L(item)}</li>
                ))}
              </ul>
            ),
          )}
        </div>
      ))}

      <Visualizer kind={visual} sample={VISUAL_SAMPLES[visual]} />
    </section>
  )
}

const VISUAL_SAMPLES: Record<string, string> = {
  'compiled-js': `const greet = (name: string): string => {
  const msg: string = "Hello " + name;
  return msg;
};
console.log(greet("TS"));`,
  ast: `function area(r: number): number {
  return 3.14 * r * r;
}
`,
  'type-systems': `type Status = "open" | "closed";
let s: Status = "open";`,
}

function Visualizer({ kind, sample }: { kind: string; sample: string }) {
  const { t } = useI18n()
  const [result, setResult] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let active = true
    setLoading(true)
    setResult('')
    ;(async () => {
      try {
        if (kind === 'compiled-js') {
          const { js, errors } = await transpileOnly(sample)
          if (active) setResult(errors.length ? `✗ ${errors.join('\n')}` : js)
        } else if (kind === 'ast') {
          const { tree, errors } = await inspectAst(sample)
          if (active) setResult(errors.length ? `✗ ${errors.join('\n')}` : tree)
        } else {
          // Types are erased at runtime — show the source->emitted correspondence statically.
          if (active)
            setResult(
              [
                '// At compile time: type-level facts',
                'type Status = "open" | "closed"',
                'let s: Status = "open"',
                '// error: "jammed" is not assignable to Status',
                '',
                '// ⇓ after erase (what the JS engine sees)',
                'let s = "open"',
                '',
                '// TypeScript = static analysis; JavaScript = runtime.',
              ].join('\n'),
            )
        }
      } finally {
        if (active) setLoading(false)
      }
    })()
    return () => {
      active = false
    }
  }, [kind, sample])

  return (
    <div style={{ marginTop: 14 }}>
      <span className="chip" style={{ marginBottom: 8 }}>
        {kind === 'compiled-js' ? 'Emitted JavaScript' : kind === 'ast' ? 'AST tree' : 'Type levels'}
      </span>
      <div style={{ marginTop: 8 }}>
        {loading ? (
          <div className="glass" style={{ padding: 12, fontSize: 13, color: 'var(--text-3)' }}>{t('misc.loading')}</div>
        ) : (
          <CodeBlock code={result} language="js" />
        )}
      </div>
    </div>
  )
}