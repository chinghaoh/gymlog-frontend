import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import Sidebar from './components/layout/Sidebar'
import Login from './components/pages/login'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />

        <Route path="/*" element={
          <div style={{ display: 'flex' }}>
            <Sidebar />
            <div style={{ flex: 1, padding: 20, color: 'var(--text-primary)' }}>
              <Routes>
                <Route path="/dashboard" element={<div>Dashboard</div>} />
                <Route path="/workouts"  element={<div>Workouts</div>} />
                <Route path="/exercises" element={<div>Exercises</div>} />
                <Route path="/records"   element={<div>Records</div>} />
                <Route path="/stats"     element={<div>Stats</div>} />
                <Route path="/profile"   element={<div>Profile</div>} />
                <Route index             element={<Navigate to="/dashboard" replace />} />
              </Routes>
            </div>
          </div>
        } />
      </Routes>
    </BrowserRouter>
  )
}