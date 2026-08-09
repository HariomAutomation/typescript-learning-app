import { useState } from 'react'
import { Check, Copy } from 'lucide-react'
import { useI18n } from '../i18n/LanguageContext'
import type { LocalizedString } from '../i18n/types'
import { localize } from '../i18n/types'

export function CodeBlock({ code, title, language = 'ts' }: { code: string; title?: LocalizedString; language?: 'ts' | 'tsx' | 'js' }) {
  const { L } = useI18n()
  const [copied, setCopied] = useState(false)

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(code)
      setCopied(true)
      setTimeout(() => setCopied(false), 1200)
    } catch {
      /* clipboard blocked */
    }
  }

  return (
    <div className="code-block">
      {title && (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '8px 14px', borderBottom: '1px solid var(--border)', color: 'var(--text-3)', fontSize: 12 }}>
          <span>{L(title)}</span>
          <button className="btn btn-ghost btn-sm" onClick={copy} aria-label="Copy code">
            {copied ? <Check size={13} /> : <Copy size={13} />}
            {copied ? '✓' : ''}
          </button>
        </div>
      )}
      <pre>
        <code className={`language-${language}`}>{code}</code>
      </pre>
    </div>
  )
}

export function useLocalString() {
  const { locale } = useI18n()
  return (s: LocalizedString | string) => localize(s, locale)
}