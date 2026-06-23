import { useEffect, useState } from 'react'

function normalizeCollection(payload) {
  if (Array.isArray(payload)) return payload
  if (Array.isArray(payload?.results)) return payload.results
  if (Array.isArray(payload?.items)) return payload.items
  if (payload?.item && !Array.isArray(payload.item)) return [payload.item]
  return []
}

function Activities({ apiHost }) {
  const [items, setItems] = useState([])
  const [status, setStatus] = useState('loading')
  const [error, setError] = useState('')

  useEffect(() => {
    const endpointPath = '/api/activities/'
    const endpoint = `${apiHost}${endpointPath}`

    async function fetchActivities() {
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

    void fetchActivities()
  }, [apiHost])

  return (
    <section>
      <div className="resource-header">
        <div>
          <h2 className="h4 mb-1">Activities</h2>
          <p className="resource-subtitle">Endpoint: {`${apiHost}/api/activities/`}</p>
        </div>
      </div>

      {status === 'loading' && <p>Loading activities...</p>}
      {status === 'error' && <div className="alert alert-danger">Error: {error}</div>}

      {status === 'success' && (
        <div className="table-responsive">
          <table className="table table-striped table-hover align-middle">
            <thead>
              <tr>
                <th>User</th>
                <th>Type</th>
                <th>Duration</th>
                <th>Calories</th>
                <th>Intensity</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              {items.map((activity) => (
                <tr key={activity._id ?? activity.id}>
                  <td>{activity.user?.name ?? activity.user?.email ?? 'N/A'}</td>
                  <td>{activity.activityType ?? 'N/A'}</td>
                  <td>{activity.durationMinutes ?? 0} min</td>
                  <td>{activity.caloriesBurned ?? 0}</td>
                  <td>{activity.intensity ?? 'N/A'}</td>
                  <td>
                    {activity.activityDate
                      ? new Date(activity.activityDate).toLocaleDateString()
                      : 'N/A'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  )
}

export default Activities
