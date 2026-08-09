import { Link } from 'react-router-dom'
import { ArrowRight, BookOpen, Code2, Languages, PlayCircle, Rocket, Swords, Zap } from 'lucide-react'
import { STATS } from '../data'
import { useI18n } from '../i18n/LanguageContext'
import type { LocalizedString } from '../i18n/types'
import type { ReactNode } from 'react'

interface Feature {
  icon: ReactNode
  title: LocalizedString
  text: LocalizedString
}

export function LandingPage() {
  const { t, L } = useI18n()

  const features: Feature[] = [
    {
      icon: <BookOpen size={18} />,
      title: { en: '10 chapters, 60+ lessons', hi: '10 adhyay, 60+ path' },
      text: { en: 'A structured bilingual curriculum from first principles to advanced types.', hi: 'shuruaat se unnt taips tk ka dvibhashee pathykrm.' },
    },
    {
      icon: <Swords size={18} />,
      title: { en: 'Practice Arena', hi: 'abhyas kshetr' },
      text: { en: 'MCQs, output prediction, bug-fixes and real code challenges — graded instantly.', hi: 'MCQ, aautput bhvishyvanee, bg fiks aur aslee kod chunautiyan.' },
    },
    {
      icon: <Code2 size={18} />,
      title: { en: 'Live playground', hi: 'laiv plegraund' },
      text: { en: 'Run TypeScript in your browser inside a safe worker sandbox with a 2.5s timeout.', hi: 'surkshit vrkr saindboks men braujr men hee TypeScript chlaen.' },
    },
    {
      icon: <Rocket size={18} />,
      title: { en: 'Behind the scenes', hi: 'prde ke peechhe' },
      text: { en: 'See the emitted JavaScript and the AST tree for every example.', hi: 'hr udahrn kee jnnee JavaScript aur AST tree dekhie.' },
    },
    {
      icon: <Languages size={18} />,
      title: { en: 'English + Hinglish', hi: 'angrejee + Hinglish' },
      text: { en: 'Flip the entire app UI and content between the two languages.', hi: 'pure aip ko do bhashaon ke beech svich kren.' },
    },
    {
      icon: <Zap size={18} />,
      title: { en: 'XP, streaks & progress', hi: 'XP, streek aur prgti' },
      text: { en: 'Everything is tracked locally — nothing leaves your device.', hi: 'sb kuchh sthaneey rup se traik — kuchh bhee bahr nheen jata.' },
    },
  ]

  return (
    <div className="fade-up">
      <section style={{ textAlign: 'center', padding: '44px 0 30px' }}>
        <span className="chip" style={{ marginBottom: 18 }}>{t('hero.badge')}</span>
        <h1 style={{ fontSize: 'clamp(34px, 6vw, 56px)', fontWeight: 800, letterSpacing: '-0.03em', marginBottom: 8 }}>
          {t('hero.title.a')} <span className="glow-text">{t('hero.title.b')}</span>
        </h1>
        <p style={{ maxWidth: 620, margin: '0 auto 26px', fontSize: 16.5 }}>
          {t('hero.subtitle')}
        </p>
        <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
          <Link to="/learn" className="btn btn-primary">
            <PlayCircle size={17} /> {t('hero.start')}
          </Link>
          <Link to="/playground" className="btn btn-ghost">
            <Code2 size={17} /> {t('hero.try')}
          </Link>
        </div>
        <div style={{ display: 'flex', gap: 30, justifyContent: 'center', marginTop: 34, flexWrap: 'wrap' }}>
          {(
            [
              [STATS.chapters, t('hero.stat.chapters')],
              [STATS.lessons, t('hero.stat.lessons')],
              [STATS.questions, t('hero.stat.questions')],
              [STATS.languages, t('hero.stat.languages')],
            ] as [number, string][]
          ).map(([num, label]) => (
            <div key={label}>
              <div style={{ fontSize: 26, fontWeight: 800, color: 'var(--accent)' }}>{num}</div>
              <div style={{ fontSize: 13, color: 'var(--text-3)' }}>{label}</div>
            </div>
          ))}
        </div>
      </section>

      <section style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 16, marginTop: 16 }}>
        {features.map((f) => (
          <div key={f.title.en} className="card">
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
              <span style={{ color: 'var(--accent)', display: 'grid', placeItems: 'center', width: 34, height: 34, borderRadius: 10, background: 'rgba(108,139,255,0.12)' }}>{f.icon}</span>
              <h3 style={{ margin: 0, fontSize: 15.5 }}>{L(f.title)}</h3>
            </div>
            <p style={{ margin: 0, fontSize: 13.8 }}>{L(f.text)}</p>
          </div>
        ))}
      </section>

      <section
        className="glass"
        style={{ marginTop: 26, padding: 26, display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16, flexWrap: 'wrap' }}
      >
        <div>
          <h3 style={{ margin: '0 0 6px', fontSize: 17 }}>{t('dash.nextLesson')} →</h3>
          <p style={{ margin: 0, fontSize: 14 }}>
            {t('chapter.lessons')} {STATS.lessons} — {t('hero.stat.questions')} {STATS.questions}
          </p>
        </div>
        <Link to="/learn" className="btn btn-primary">
          {t('hero.start')} <ArrowRight size={16} />
        </Link>
      </section>
    </div>
  )
}