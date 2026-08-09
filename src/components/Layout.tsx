import { Outlet } from 'react-router-dom'
import { Header } from './Header'
import { useI18n } from '../i18n/LanguageContext'

export function Layout() {
  const { t } = useI18n()
  return (
    <>
      <Header />
      <main style={{ flex: 1, width: 'min(1080px, calc(100% - 24px))', margin: '0 auto', padding: '26px 0 60px' }}>
        <Outlet />
      </main>
      <footer className="glass" style={{ margin: '0 auto 14px', width: 'min(1080px, calc(100% - 24px))', padding: '16px 20px', display: 'flex', justifyContent: 'space-between', gap: 10, flexWrap: 'wrap', color: 'var(--text-3)', fontSize: 13 }}>
        <span>{t('footer.made')} · TypeScript Mastery Hub</span>
        <span style={{ fontFamily: 'var(--mono)', fontSize: 12 }}>built for learners · en / Hinglish</span>
      </footer>
    </>
  )
}