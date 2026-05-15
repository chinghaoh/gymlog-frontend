import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import Sidebar from './components/layout/Sidebar'
import Login from './components/pages/login'
import Dashboard from './components/pages/dashboard'
import Workouts from './components/pages/workouts'
import WorkoutDetail from './components/pages/WorkoutDetail'
import Exercises from './components/pages/Exercises'
import Records from './components/pages/Records'
import Profile from './components/pages/Profile'


export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login/>} />

        <Route path="/*" element={
          <div style={{ display: 'flex' }}>
            <Sidebar />
            <div style={{ flex: 1, padding: 20, color: 'var(--text-primary)' }}>
              <Routes>
                <Route path="/dashboard" element={<Dashboard/>} />
                <Route path="/workouts"  element={<Workouts/>} />
                <Route path="/workouts/:id" element={<WorkoutDetail />} />
                <Route path="/exercises" element={<Exercises/>} />
                <Route path="/records"   element={<Records/>} />
                <Route path="/profile"   element={<Profile/>} />
                <Route index             element={<Navigate to="/dashboard" replace />} />
              </Routes>
            </div>
          </div>
        } />
      </Routes>
    </BrowserRouter>
  )
}