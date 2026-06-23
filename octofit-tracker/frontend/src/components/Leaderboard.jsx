import { useEffect, useState } from 'react'

function normalizeLeaderboardEntries(payload) {
  if (Array.isArray(payload)) return payload
  if (Array.isArray(payload?.results)) return payload.results
  if (Array.isArray(payload?.items)) return payload.items
  if (Array.isArray(payload?.item?.entries)) return payload.item.entries
  if (payload?.item && !Array.isArray(payload.item)) return [payload.item]
  return []
}

function Leaderboard({ apiHost }) {
  const [entries, setEntries] = useState([])
  const [status, setStatus] = useState('loading')
  const [error, setError] = useState('')

  useEffect(() => {
    const endpointPath = '/api/leaderboard/'
    const endpoint = `${apiHost}${endpointPath}`

    async function fetchLeaderboard() {
      setStatus('loading')
      setError('')
      try {
        const response = await fetch(endpoint)
        if (!response.ok) throw new Error(`HTTP ${response.status}`)
        const payload = await response.json()
        const normalized = normalizeLeaderboardEntries(payload)
          .map((entry) => ({
            rank: entry.rank,
            points: entry.points,
            name: entry.user?.name ?? entry.name ?? 'Unknown',
            email: entry.user?.email ?? entry.email ?? 'N/A',
          }))
          .sort((a, b) => (a.rank ?? Number.MAX_SAFE_INTEGER) - (b.rank ?? Number.MAX_SAFE_INTEGER))
        setEntries(normalized)
        setStatus('success')
      } catch (err) {
        setStatus('error')
        setError(err instanceof Error ? err.message : 'Unknown error')
      }
    }

    void fetchLeaderboard()
  }, [apiHost])

  return (
    <section>
      <div className="resource-header">
        <div>
          <h2 className="h4 mb-1">Leaderboard</h2>
          <p className="resource-subtitle">Endpoint: {`${apiHost}/api/leaderboard/`}</p>
        </div>
      </div>

      {status === 'loading' && <p>Loading leaderboard...</p>}
      {status === 'error' && <div className="alert alert-danger">Error: {error}</div>}

      {status === 'success' && (
        <div className="table-responsive">
          <table className="table table-striped table-hover align-middle">
            <thead>
              <tr>
                <th>Rank</th>
                <th>Name</th>
                <th>Email</th>
                <th>Points</th>
              </tr>
            </thead>
            <tbody>
              {entries.map((entry, index) => (
                <tr key={`${entry.email}-${entry.rank ?? index}`}>
                  <td>{entry.rank ?? index + 1}</td>
                  <td>{entry.name}</td>
                  <td>{entry.email}</td>
                  <td>{entry.points ?? 0}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  )
}

export default Leaderboard
