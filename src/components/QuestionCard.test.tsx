import { beforeEach, describe, expect, it } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { LanguageProvider } from '../i18n/LanguageContext'
import { ProgressProvider } from '../hooks/useProgress'
import { QuestionCard } from './QuestionCard'
import type { MCQQuestion } from '../data/types'

const mcq: MCQQuestion = {
  id: 'q-t-1',
  type: 'mcq',
  difficulty: 'easy',
  points: 10,
  prompt: { en: 'What is 2 + 2?', hi: '2 + 2 kya hai?' },
  explanation: { en: 'Basic arithmetic', hi: 'basic ganit' },
  options: [
    { en: '3', hi: '3' },
    { en: '4', hi: '4' },
  ],
  correctIndex: 1,
}

function renderQuiz() {
  return render(
    <LanguageProvider>
      <ProgressProvider>
        <QuestionCard question={mcq} />
      </ProgressProvider>
    </LanguageProvider>,
  )
}

describe('QuestionCard (MCQ)', () => {
  beforeEach(() => window.localStorage.clear())
  it('renders the prompt and both options', () => {
    renderQuiz()
    expect(screen.getByText('What is 2 + 2?')).toBeInTheDocument()
    expect(screen.getAllByRole('button').map((b) => b.textContent!.trim()).join(' ')).toContain('3')
  })

  it('gives correct feedback + XP when the right option is submitted', async () => {
    const user = userEvent.setup()
    renderQuiz()

    const optionButtons = screen.getAllByRole('button')
    await user.click(optionButtons.find((b) => b.textContent!.includes('4'))!)
    await user.click(optionButtons.find((b) => b.textContent!.includes('Submit'))!)

    expect(screen.getByText((_, el) => el?.tagName?.toLowerCase() === 'p' && el.textContent?.includes('Correct!') && el.textContent.includes('+10'))).toBeInTheDocument()
    expect(screen.getByText('solved')).toBeInTheDocument()
  })

  it('shows the retry message for a wrong pick and keeps Submit disabled', async () => {
    const user = userEvent.setup()
    renderQuiz()

    const submit = screen.getAllByRole('button').find((b) => b.textContent!.includes('Submit'))!
    expect(submit).toBeDisabled()

    const wrong = screen.getAllByRole('button').find((b) => b.textContent!.includes('3'))!
    await user.click(wrong)
    await user.click(submit)

    expect(screen.getByText((_, el) => el?.tagName?.toLowerCase() === 'p' && el.textContent?.includes('Not quite'))).toBeInTheDocument()
    expect(screen.queryByText(/Correct!/)).not.toBeInTheDocument()
  })
})