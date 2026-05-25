const BASE_URL = ''

export async function apiClient(endpoint, options = {}) {
    const headers = {
        'Content-Type': 'application/json',
        ...options.headers,
    }

    const response = await fetch(`${BASE_URL}${endpoint}`, {
        ...options,
        headers,
        credentials: 'include',
    })

    if (response.status === 401 && !options.skipRedirect) {
        window.location.href = '/login'
        return
    }

    if (!response.ok) {
        const errorData = await response.json()
        const error = new Error(errorData.message || 'Something went wrong')
        error.fieldErrors = errorData.fieldErrors || null
        throw error
    }

    if (response.status === 204 || response.headers.get('content-length') === '0') {
        return null
    }

    return response.json()
}