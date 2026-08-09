import { useState } from 'react'
import { Languages, RotateCcw } from 'lucide-react'
import { useI18n } from '../i18n/LanguageContext'
import { useProgress } from '../hooks/useProgress'

export function SettingsPage() {
  const { t, locale, setLocale } = useI18n()
  const progress = useProgress()
  const [confirming, setConfirming] = useState(false)

  const reset = () => {
    progress.resetProgress()
    setConfirming(false)
  }

  return (
    <div className="fade-up" style={{ maxWidth: 640 }}>
      <h1 style={{ fontSize: 28, marginBottom: 20 }}>{t('nav.settings')}</h1>

      <div className="card" style={{ marginBottom: 16 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
          <Languages size={18} style={{ color: 'var(--accent)' }} />
          <h3 style={{ margin: 0, fontSize: 16 }}>{t('settings.language')}</h3>
        </div>
        <p style={{ fontSize: 13.5 }}>{t('settings.languageHint')}</p>
        <div style={{ display: 'flex', gap: 10 }}>
          <button
            className={locale === 'en' ? 'btn btn-primary' : 'btn btn-ghost'}
            onClick={() => setLocale('en')}
          >
            🌐 {t('settings.english')}
          </button>
          <button
            className={locale === 'hi' ? 'btn btn-primary' : 'btn btn-ghost'}
            onClick={() => setLocale('hi')}
          >
            🇮🇳 {t('settings.hindi')}
          </button>
        </div>
      </div>

      <div className="card" style={{ marginBottom: 16 }}>
        <h3 style={{ margin: '0 0 12px', fontSize: 16 }}>{t('settings.progress')}</h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))', gap: 10, marginBottom: 14 }}>
          <StatBox label={t('dash.xp')} value={progress.state.xp} />
          <StatBox label={t('dash.streak')} value={progress.state.streak} />
          <StatBox label={t('dash.lessonsDone')} value={progress.state.completedLessons.length} />
          <StatBox label={t('question.passed')} value={`${progress.accuracy}%`} />
        </div>
      </div>

      <div className="card" style={{ borderColor: 'rgba(248,113,113,0.3)' }}>
        <h3 style={{ margin: '0 0 10px', fontSize: 15, color: 'var(--red)' }}>
          <RotateCcw size={15} style={{ verticalAlign: -2 }} /> {t('settings.resetProgress')}
        </h3>
        {confirming ? (
          <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', alignItems: 'center' }}>
            <p style={{ margin: 0, fontSize: 13.5, flex: 1, minWidth: 220 }}>{t('settings.resetConfirm')}</p>
            <button className="btn btn-sm" style={{ background: 'var(--red)', color: '#fff' }} onClick={reset}>
              {t('settings.resetYes')}
            </button>
            <button className="btn btn-ghost btn-sm" onClick={() => setConfirming(false)}>
              {t('settings.resetNo')}
            </button>
          </div>
        ) : (
          <button className="btn btn-ghost btn-sm" onClick={() => setConfirming(true)}>
            <RotateCcw size={13} /> {t('settings.resetProgress')}
          </button>
        )}
      </div>
    </div>
  )
}

function StatBox({ label, value }: { label: string; value: number | string }) {
  return (
    <div style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid var(--border)', borderRadius: 12, padding: 12 }}>
      <div style={{ fontSize: 22, fontWeight: 800, color: 'var(--accent)' }}>{value}</div>
      <div style={{ fontSize: 12, color: 'var(--text-3)' }}>{label}</div>
    </div>
  )
}