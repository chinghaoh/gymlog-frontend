import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { apiClient } from '../../../lib/apiClient'
import WorkoutDetailHeader from './WorkoutDetailHeader'
import WorkoutSetForm from './WorkoutSetForm'
import WorkoutSetsTable from './WorkoutSetsTable'

export default function WorkoutDetail() {
    const { id } = useParams()

    const [workout, setWorkout] = useState(null)
    const [sets, setSets] = useState([])
    const [exercises, setExercises] = useState([])

    useEffect(() => {
        apiClient(`/api/workouts/${id}`)
            .then(data => setWorkout(data))
            .catch(err => console.error(err))

        apiClient(`/api/sets?workoutId=${id}`)
            .then(data => setSets(data))
            .catch(err => console.error(err))

        apiClient('/api/exercises')
            .then(data => setExercises(data))
            .catch(err => console.error(err))
    }, [id])

    if (!workout) return <div className="text-text-muted">Loading...</div>

    return (
        <div>
            <WorkoutDetailHeader
                workout={workout}
                workoutId={id}
                onWorkoutUpdate={(updated) => setWorkout(prev => ({ ...prev, ...updated }))}
            />
            <WorkoutSetForm
                workoutId={id}
                exercises={exercises}
                sets={sets}
                onSetAdded={(updatedSets) => setSets(updatedSets)}
            />
            <WorkoutSetsTable
                sets={sets}
                onSetUpdated={(updated) => setSets(prev => prev.map(s => s.id === updated.id ? updated : s))}
                onSetDeleted={(id) => setSets(prev => prev.filter(s => s.id !== id))}
            />
        </div>
    )
}