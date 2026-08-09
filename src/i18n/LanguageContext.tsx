import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import type { ReactNode } from 'react'
import type { Locale, LocalizedString } from './types'
import { localize } from './types'
import { uiText, type UIKey } from './ui'

interface I18nValue {
  locale: Locale
  setLocale: (l: Locale) => void
  t: (key: UIKey) => string
  L: (s: LocalizedString | string) => string
}

const I18nContext = createContext<I18nValue | null>(null)
const STORAGE_KEY = 'tsma-locale'

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>(() => {
    const saved = typeof localStorage !== 'undefined' ? localStorage.getItem(STORAGE_KEY) : null
    return saved === 'hi' || saved === 'en' ? saved : 'en'
  })

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, locale)
    document.documentElement.lang = locale
  }, [locale])

  const setLocale = useCallback((l: Locale) => setLocaleState(l), [])
  const t = useCallback((key: UIKey) => uiText[key][locale], [locale])
  const L = useCallback((s: LocalizedString | string) => localize(s, locale), [locale])

  const value = useMemo(() => ({ locale, setLocale, t, L }), [locale, setLocale, t, L])

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>
}

export function useI18n(): I18nValue {
  const ctx = useContext(I18nContext)
  if (!ctx) throw new Error('useI18n must be used inside <LanguageProvider>')
  return ctx
}