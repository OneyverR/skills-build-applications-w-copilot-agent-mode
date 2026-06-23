import { Navigate, NavLink, Route, Routes } from 'react-router-dom'
import Activities from './components/Activities.jsx'
import Leaderboard from './components/Leaderboard.jsx'
import Teams from './components/Teams.jsx'
import Users from './components/Users.jsx'
import Workouts from './components/Workouts.jsx'
import './App.css'

function App() {
  const codespaceName = import.meta.env.VITE_CODESPACE_NAME?.trim()
  const apiBaseUrl = codespaceName
    ? `https://${codespaceName}-8000.app.github.dev/api`
    : 'http://localhost:8000/api'

  const endpoints = [
    { path: '/users', label: 'Users' },
    { path: '/teams', label: 'Teams' },
    { path: '/activities', label: 'Activities' },
    { path: '/leaderboard', label: 'Leaderboard' },
    { path: '/workouts', label: 'Workouts' },
  ]

  return (
    <div className="app-shell">
      <header className="app-header">
        <div>
          <p className="eyebrow">OctoFit Tracker</p>
          <h1>Presentation Tier (React 19)</h1>
          <p className="subtitle">Multi-tier dashboard powered by Express and MongoDB.</p>
        </div>
        {!codespaceName && (
          <div className="alert alert-warning config-alert" role="alert">
            Define VITE_CODESPACE_NAME in .env.local to use the Codespaces API host.
            Local fallback is active: <strong>http://localhost:8000</strong>
          </div>
        )}
        {codespaceName && (
          <div className="alert alert-success config-alert" role="alert">
            API host resolved from VITE_CODESPACE_NAME: <strong>{apiBaseUrl}</strong>
          </div>
        )}
      </header>

      <nav className="nav nav-pills app-nav">
        {endpoints.map((endpoint) => (
          <NavLink
            key={endpoint.path}
            className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
            to={endpoint.path}
          >
            {endpoint.label}
          </NavLink>
        ))}
      </nav>

      <main className="app-content card shadow-sm">
        <div className="card-body">
          <Routes>
            <Route path="/" element={<Navigate to="/users" replace />} />
            <Route path="/users" element={<Users apiBaseUrl={apiBaseUrl} />} />
            <Route path="/teams" element={<Teams apiBaseUrl={apiBaseUrl} />} />
            <Route path="/activities" element={<Activities apiBaseUrl={apiBaseUrl} />} />
            <Route path="/leaderboard" element={<Leaderboard apiBaseUrl={apiBaseUrl} />} />
            <Route path="/workouts" element={<Workouts apiBaseUrl={apiBaseUrl} />} />
          </Routes>
        </div>
      </main>
    </div>
  )
}

export default App
