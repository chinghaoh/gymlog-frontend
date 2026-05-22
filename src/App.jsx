import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import Sidebar from './components/layout/Sidebar'
import Login from './components/pages/login'
import Dashboard from './components/pages/dashboard'
import Workouts from './components/pages/workouts'
import WorkoutDetail from './components/pages/WorkoutDetail'
import Exercises from './components/pages/Exercises'
import Records from './components/pages/Records'
import Profile from './components/pages/Profile'
import ExerciseDetail from './components/pages/ExerciseDetail'
import VerifyEmail from './components/pages/VerifyEmail'
import ForgotPassword from './components/pages/ForgotPassword'
import ResetPassword from './components/pages/ResetPassword'
import AiChatPage from './components/pages/ai/AiChatPage'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login/>} />
        <Route path="/verify" element={<VerifyEmail />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />

        <Route path="/*" element={
          <div style={{ display: 'flex' }}>
            <Sidebar />
            <div style={{ flex: 1, padding: 20, color: 'var(--text-primary)' }}>
              <Routes>
                <Route path="/dashboard" element={<Dashboard/>} />
                <Route path="/workouts"  element={<Workouts/>} />
                <Route path="/workouts/:id" element={<WorkoutDetail />} />
                <Route path="/exercises" element={<Exercises/>} />
                <Route path="/exercises/:id" element={<ExerciseDetail />} />
                <Route path="/records"   element={<Records/>} />
                <Route path="/profile"   element={<Profile/>} />
                <Route path="/ai" element={<AiChatPage />} />
                <Route index             element={<Navigate to="/dashboard" replace />} />
              </Routes>
            </div>
          </div>
        } />
      </Routes>
    </BrowserRouter>
  )
}