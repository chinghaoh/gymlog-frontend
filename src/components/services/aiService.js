import { apiClient } from '../../lib/apiClient'

export const getAiContext = (userId) => {
    return apiClient(`/api/ai/chat/context?userId=${userId}`)
}

export const generateWorkout = (userId, splitCategory) => {
    return apiClient('/api/ai/chat', {
        method: 'POST',
        body: JSON.stringify({ userId, splitCategory })
    })
}

export const saveFitnessLevel = (userId, fitnessLevel) => {
    return apiClient(`/api/users/${userId}/fitness-level`, {
        method: 'PATCH',
        body: JSON.stringify({ fitnessLevel })
    })

}