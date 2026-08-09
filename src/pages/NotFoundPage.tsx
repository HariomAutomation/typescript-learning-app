import { Link } from 'react-router-dom'
import { useI18n } from '../i18n/LanguageContext'

export function NotFoundPage() {
  const { t } = useI18n()
  return (
    <div className="glass fade-up" style={{ padding: 40, textAlign: 'center' }}>
      <div style={{ fontSize: 64, fontWeight: 800, color: 'var(--accent)', letterSpacing: 4 }}>404</div>
      <h2 style={{ fontSize: 20 }}>{t('notfound.title')}</h2>
      <Link to="/" className="btn btn-primary" style={{ marginTop: 10 }}>
        {t('notfound.home')}
      </Link>
    </div>
  )
}