import { HashRouter, Route, Routes } from 'react-router-dom'
import { Layout } from './components/Layout'
import { LanguageProvider } from './i18n/LanguageContext'
import { ProgressProvider } from './hooks/useProgress'
import { LandingPage } from './pages/LandingPage'
import { LearnPage } from './pages/LearnPage'
import { ChapterPage } from './pages/ChapterPage'
import { LessonPage } from './pages/LessonPage'
import { PracticePage } from './pages/PracticePage'
import { PlaygroundPage } from './pages/PlaygroundPage'
import { SettingsPage } from './pages/SettingsPage'
import { NotFoundPage } from './pages/NotFoundPage'

export function App() {
  return (
    <LanguageProvider>
      <ProgressProvider>
        <HashRouter>
          <Routes>
            <Route element={<Layout />}>
              <Route path="/" element={<LandingPage />} />
              <Route path="/learn" element={<LearnPage />} />
              <Route path="/chapter/:chapterId" element={<ChapterPage />} />
              <Route path="/lesson/:chapterId/:lessonId" element={<LessonPage />} />
              <Route path="/practice" element={<PracticePage />} />
              <Route path="/playground" element={<PlaygroundPage />} />
              <Route path="/settings" element={<SettingsPage />} />
              <Route path="*" element={<NotFoundPage />} />
            </Route>
          </Routes>
        </HashRouter>
      </ProgressProvider>
    </LanguageProvider>
  )
}