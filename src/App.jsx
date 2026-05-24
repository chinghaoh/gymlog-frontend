import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import Sidebar from './components/layout/Sidebar'
import Login from './components/pages/login/Login'
import Dashboard from './components/pages/dashboard/Dashboard'
import Workouts from './components/pages/workout/Workouts'
import WorkoutDetail from './components/pages/workout/WorkoutDetail'
import Exercises from './components/pages/exercise/Exercises'
import Records from './components/pages/record/Records'
import Profile from './components/pages/profile/Profile'
import ExerciseDetail from './components/pages/exercise/ExerciseDetail'
import VerifyEmail from './components/pages/login/VerifyEmail'
import ForgotPassword from './components/pages/login/ForgotPassword'
import ResetPassword from './components/pages/login/ResetPassword'
import AiChatPage from './components/pages/ai/AiChatPage'
import LogsPage from './components/pages/log/LogsPage'
import ProtectedRoute from './components/layout/ProtectedRoute'

export default function App() {
  return (
      <BrowserRouter>
          <Routes>
              {/* Public routes */}
              <Route path="/login" element={<Login />} />
              <Route path="/verify" element={<VerifyEmail />} />
              <Route path="/forgot-password" element={<ForgotPassword />} />
              <Route path="/reset-password" element={<ResetPassword />} />

              {/* Protected routes */}
              <Route path="/*" element={
                  <ProtectedRoute>
                      <div className="flex min-h-screen bg-bg-page">
                          <Sidebar />
                          <main className="flex-1 p-5 text-text-primary overflow-y-auto min-w-0">
                              <Routes>
                                  <Route path="/dashboard" element={<Dashboard />} />
                                  <Route path="/workouts" element={<Workouts />} />
                                  <Route path="/workouts/:id" element={<WorkoutDetail />} />
                                  <Route path="/logs" element={<LogsPage />} />
                                  <Route path="/exercises" element={<Exercises />} />
                                  <Route path="/exercises/:id" element={<ExerciseDetail />} />
                                  <Route path="/records" element={<Records />} />
                                  <Route path="/profile" element={<Profile />} />
                                  <Route path="/ai" element={<AiChatPage />} />
                                  <Route index element={<Navigate to="/dashboard" replace />} />
                              </Routes>
                          </main>
                      </div>
                  </ProtectedRoute>
              } />
          </Routes>
      </BrowserRouter>
  )
}