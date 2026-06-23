import { useEffect, useState } from 'react'

function normalizeCollection(payload) {
  if (Array.isArray(payload)) return payload
  if (Array.isArray(payload?.results)) return payload.results
  if (Array.isArray(payload?.items)) return payload.items
  if (payload?.item && !Array.isArray(payload.item)) return [payload.item]
  return []
}

function Workouts({ apiBaseUrl }) {
  const [items, setItems] = useState([])
  const [status, setStatus] = useState('loading')
  const [error, setError] = useState('')

  useEffect(() => {
    const endpoint = `${apiBaseUrl}/workouts/`

    async function fetchWorkouts() {
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

    void fetchWorkouts()
  }, [apiBaseUrl])

  return (
    <section>
      <div className="resource-header">
        <div>
          <h2 className="h4 mb-1">Workouts</h2>
          <p className="resource-subtitle">Endpoint: {`${apiBaseUrl}/workouts/`}</p>
        </div>
      </div>

      {status === 'loading' && <p>Loading workouts...</p>}
      {status === 'error' && <div className="alert alert-danger">Error: {error}</div>}

      {status === 'success' && (
        <div className="row g-3">
          {items.map((workout) => (
            <article className="col-12 col-md-6" key={workout._id ?? workout.id ?? workout.title}>
              <div className="card h-100 border-0 shadow-sm">
                <div className="card-body">
                  <h3 className="h5 card-title">{workout.title ?? 'Untitled workout'}</h3>
                  <p className="mb-2 text-secondary">
                    {workout.category ?? 'N/A'} · {workout.difficulty ?? 'N/A'} · {workout.durationMinutes ?? 0} min
                  </p>
                  <p className="mb-2">Target level: {workout.targetFitnessLevel ?? 'N/A'}</p>
                  <ul className="mb-0">
                    {(workout.exercises ?? []).map((exercise) => (
                      <li key={`${workout._id ?? workout.title}-${exercise.name}`}>
                        {exercise.name}
                        {exercise.sets ? ` · ${exercise.sets} sets` : ''}
                        {exercise.reps ? ` · ${exercise.reps} reps` : ''}
                        {exercise.durationSeconds ? ` · ${exercise.durationSeconds}s` : ''}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}
    </section>
  )
}

export default Workouts
