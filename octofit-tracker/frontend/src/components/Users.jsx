import { useEffect, useState } from 'react'

function normalizeCollection(payload) {
  if (Array.isArray(payload)) return payload
  if (Array.isArray(payload?.results)) return payload.results
  if (Array.isArray(payload?.items)) return payload.items
  if (payload?.item && !Array.isArray(payload.item)) return [payload.item]
  return []
}

function Users({ apiHost }) {
  const codespaceApiEndpointTemplate = 'https://${import.meta.env.VITE_CODESPACE_NAME}-8000.app.github.dev/api/users/'
  const [items, setItems] = useState([])
  const [status, setStatus] = useState('loading')
  const [error, setError] = useState('')

  useEffect(() => {
    const endpointPath = '/api/users/'
    const endpoint = `${apiHost}${endpointPath}`

    async function fetchUsers() {
      setStatus('loading')
      setError('')
      try {
        const response = await fetch(endpoint)
        if (!response.ok) throw new Error(`HTTP ${response.status}`)
        const payload = await response.json()
        setItems(normalizeCollection(payload))
        setStatus('success')
      } catch (err) {
        setStatus('error')
        setError(err instanceof Error ? err.message : 'Unknown error')
      }
    }

    void fetchUsers()
  }, [apiHost])

  return (
    <section>
      <div className="resource-header">
        <div>
          <h2 className="h4 mb-1">Users</h2>
          <p className="resource-subtitle">Endpoint: {`${apiHost}/api/users/`}</p>
          <p className="resource-subtitle small">Codespaces template: {codespaceApiEndpointTemplate}</p>
        </div>
      </div>

      {status === 'loading' && <p>Loading users...</p>}
      {status === 'error' && <div className="alert alert-danger">Error: {error}</div>}

      {status === 'success' && (
        <div className="table-responsive">
          <table className="table table-striped table-hover align-middle">
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Grade</th>
                <th>Fitness</th>
                <th>Points</th>
              </tr>
            </thead>
            <tbody>
              {items.map((user) => (
                <tr key={user._id ?? user.id ?? user.email}>
                  <td>{user.name ?? 'N/A'}</td>
                  <td>{user.email ?? 'N/A'}</td>
                  <td>{user.gradeLevel ?? 'N/A'}</td>
                  <td>{user.fitnessLevel ?? 'N/A'}</td>
                  <td>{user.totalPoints ?? 0}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  )
}

export default Users
