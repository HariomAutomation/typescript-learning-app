import { NavLink, Link } from 'react-router-dom'
import { BookOpen, Code2, Flame, Home, Settings, Swords, Zap } from 'lucide-react'
import { useI18n } from '../i18n/LanguageContext'
import { useProgress } from '../hooks/useProgress'

export function Header() {
  const { t, locale, setLocale } = useI18n()
  const progress = useProgress()

  const links = [
    { to: '/', label: t('nav.dashboard'), icon: Home, end: true },
    { to: '/learn', label: t('nav.learn'), icon: BookOpen },
    { to: '/practice', label: t('nav.practice'), icon: Swords },
    { to: '/playground', label: t('nav.editor'), icon: Code2 },
    { to: '/settings', label: t('nav.settings'), icon: Settings },
  ]

  return (
    <header className="glass" style={{
      position: 'sticky', top: 12, zIndex: 50,
      margin: '12px auto 0', width: 'min(1080px, calc(100% - 24px))',
      display: 'flex', alignItems: 'center', gap: 18, padding: '10px 16px',
      borderRadius: 16,
    }}>
      <Link to="/" className="brand" style={{ display: 'flex', alignItems: 'center', gap: 8, fontWeight: 800, fontSize: 15, color: 'var(--text-1)', textDecoration: 'none' }}>
        <span className="brand-mark" style={{ display: 'grid', placeItems: 'center', width: 28, height: 28, borderRadius: 8, background: 'var(--grad)', color: '#fff', fontSize: 14, fontWeight: 800 }}>TS</span>
        <span>Mastery&nbsp;Hub</span>
      </Link>
      <nav style={{ display: 'flex', flex: 1, gap: 2, overflowX: 'auto' }}>
        {links.map(({ to, label, icon: Icon, end }) => (
          <NavLink
            key={to}
            to={to}
            end={end}
            className={({ isActive }) => 'nav-link' + (isActive ? ' active' : '')}
            style={({ isActive }) => ({
              display: 'inline-flex', alignItems: 'center', gap: 6, padding: '7px 12px',
              borderRadius: 9, fontSize: 13.5, fontWeight: 600, whiteSpace: 'nowrap',
              color: isActive ? 'var(--accent)' : 'var(--text-2)',
              background: isActive ? 'rgba(108,139,255,0.1)' : 'transparent',
            })}
          >
            <Icon size={15} />
            {label}
          </NavLink>
        ))}
      </nav>
      <div className="header-meta" style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        {progress.state.streak > 0 && (
          <span className="chip" title={t('dash.streak')}>
            <Flame size={13} style={{ color: 'var(--amber)' }} />
            {progress.state.streak}
          </span>
        )}
        <span className="chip" title="XP">
          <Zap size={13} style={{ color: 'var(--cyan)' }} />
          {progress.state.xp}
        </span>
        <div className="lang-switch" style={{ display: 'flex', border: '1px solid var(--border)', borderRadius: 10, overflow: 'hidden' }}>
          {(['en', 'hi'] as const).map((l) => (
            <button
              key={l}
              onClick={() => setLocale(l)}
              style={{
                border: 'none', cursor: 'pointer', padding: '6px 10px', fontSize: 12, fontWeight: 700, fontFamily: 'inherit',
                background: locale === l ? 'var(--grad)' : 'transparent',
                color: locale === l ? '#fff' : 'var(--text-2)',
              }}
            >
              {l === 'en' ? 'EN' : 'Hing'}
            </button>
          ))}
        </div>
      </div>
    </header>
  )
}