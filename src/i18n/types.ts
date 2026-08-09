export type Locale = 'en' | 'hi'

export interface LocalizedString {
  en: string
  hi: string
}

export function localize(s: LocalizedString | string, locale: Locale): string {
  if (typeof s === 'string') return s
  return s[locale] ?? s.en ?? ''
}