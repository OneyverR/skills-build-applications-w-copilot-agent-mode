import { useEffect, useState } from 'react'

function normalizeCollection(payload) {
  if (Array.isArray(payload)) return payload
  if (Array.isArray(payload?.results)) return payload.results
  if (Array.isArray(payload?.items)) return payload.items
  if (payload?.item && !Array.isArray(payload.item)) return [payload.item]
  return []
}

function Teams({ apiHost }) {
  const [items, setItems] = useState([])
  const [status, setStatus] = useState('loading')
  const [error, setError] = useState('')

  useEffect(() => {
    const endpointPath = '/api/teams/'
    const endpoint = `${apiHost}${endpointPath}`

    async function fetchTeams() {
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

    void fetchTeams()
  }, [apiHost])

  return (
    <section>
      <div className="resource-header">
        <div>
          <h2 className="h4 mb-1">Teams</h2>
          <p className="resource-subtitle">Endpoint: {`${apiHost}/api/teams/`}</p>
        </div>
      </div>

      {status === 'loading' && <p>Loading teams...</p>}
      {status === 'error' && <div className="alert alert-danger">Error: {error}</div>}

      {status === 'success' && (
        <div className="table-responsive">
          <table className="table table-striped table-hover align-middle">
            <thead>
              <tr>
                <th>Team</th>
                <th>Coach</th>
                <th>Members</th>
                <th>Points</th>
              </tr>
            </thead>
            <tbody>
              {items.map((team) => (
                <tr key={team._id ?? team.id ?? team.name}>
                  <td>{team.name ?? 'N/A'}</td>
                  <td>{team.coachName ?? 'N/A'}</td>
                  <td>
                    {Array.isArray(team.members)
                      ? team.members.map((member) => member.name ?? member.email ?? 'Unknown').join(', ')
                      : 'N/A'}
                  </td>
                  <td>{team.points ?? 0}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  )
}

export default Teams
