import { beforeEach, describe, expect, it } from 'vitest'
import { act, render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { LanguageProvider, useI18n } from './LanguageContext'

function Probe() {
  const { t, L, locale, setLocale } = useI18n()
  return (
    <div>
      <span data-testid="locale">{locale}</span>
      <span data-testid="t">{t('hero.start')}</span>
      <span data-testid="L">{L({ en: 'TypeScript', hi: 'TypeScript' })}</span>
      <button onClick={() => setLocale('hi')}>to-hi</button>
      <button onClick={() => setLocale('en')}>to-en</button>
    </div>
  )
}

describe('LanguageContext', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  it('defaults to English when nothing is stored', () => {
    render(
      <LanguageProvider>
        <Probe />
      </LanguageProvider>,
    )
    expect(screen.getByTestId('locale').textContent).toBe('en')
    expect(screen.getByTestId('t').textContent).toBe('Start Learning')
  })

  it('switches translation on setLocale and persists it', async () => {
    const user = userEvent.setup()
    render(
      <LanguageProvider>
        <Probe />
      </LanguageProvider>,
    )
    await act(async () => {
      await user.click(screen.getByText('to-hi'))
    })
    expect(screen.getByTestId('locale').textContent).toBe('hi')
    expect(screen.getByTestId('t').textContent).toBe('seekhna shuru kren')
    expect(localStorage.getItem('tsma-locale')).toBe('hi')
  })

  it('restores the saved locale on mount', () => {
    localStorage.setItem('tsma-locale', 'hi')
    render(
      <LanguageProvider>
        <Probe />
      </LanguageProvider>,
    )
    expect(screen.getByTestId('locale').textContent).toBe('hi')
  })
})