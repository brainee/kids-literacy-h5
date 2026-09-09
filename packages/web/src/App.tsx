import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { AppProvider } from './state/AppContext'
import { WelcomePage } from './pages/WelcomePage'
import { AgePage } from './pages/AgePage'
import { TodayPage } from './pages/TodayPage'
import { SubjectsPage } from './pages/SubjectsPage'
import { LessonPage } from './pages/LessonPage'
import { PetPage } from './pages/PetPage'
import { ParentPage } from './pages/ParentPage'
import './ui/shell.css'

const basename = import.meta.env.BASE_URL.replace(/\/$/, '') || ''

export default function App() {
  return (
    <AppProvider>
      <BrowserRouter basename={basename}>
        <Routes>
          <Route path="/" element={<WelcomePage />} />
          <Route path="/welcome" element={<Navigate to="/" replace />} />
          <Route path="/age" element={<AgePage />} />
          <Route path="/today" element={<TodayPage />} />
          <Route path="/subjects" element={<SubjectsPage />} />
          <Route path="/subject/:id" element={<SubjectsPage />} />
          <Route path="/lesson/:id" element={<LessonPage />} />
          <Route path="/pet" element={<PetPage />} />
          <Route path="/parent" element={<ParentPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AppProvider>
  )
}
