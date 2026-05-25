import { useState, useEffect } from 'react'
import { apiClient } from '../../../lib/apiClient'
import { useAuth } from '../../context/AuthContext'

export default function EditSection() {
    const { user, setUser } = useAuth()

    const [name, setName] = useState('')
    const [email, setEmail] = useState('')
    const [fitnessLevel, setFitnessLevel] = useState('')
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(null)
    const [success, setSuccess] = useState(false)

    const LEVELS = [
        { value: 'BEGINNER',     label: 'Beginner',     desc: 'Less than 1 year' },
        { value: 'INTERMEDIATE', label: 'Intermediate', desc: '1 to 3 years' },
        { value: 'ADVANCED',     label: 'Advanced',     desc: 'More than 3 years' },
    ]

    useEffect(() => {
        if (user) {
            setName(user.name)
            setEmail(user.email)
            setFitnessLevel(user.fitnessLevel || '')
        }
    }, [user])

    const handleSave = async () => {
        if (!window.confirm('Are you sure you want to update your profile?')) return

        setLoading(true)
        setError(null)
        setSuccess(false)

        try {
            const updated = await apiClient(`/api/users/${user.id}`, {
                method: 'PUT',
                body: JSON.stringify({ name, email }),
            })

            if (fitnessLevel) {
                await apiClient(`/api/users/${user.id}/fitness-level`, {
                    method: 'PATCH',
                    body: JSON.stringify({ fitnessLevel })
                })
            }

            setUser({ ...updated, fitnessLevel })
            setSuccess(true)
        } catch (err) {
            setError(err.message || 'Failed to update profile.')
        } finally {
            setLoading(false)
        }
    }

    if (user?.isDemo) {
        return (
            <div className="bg-bg-card border border-border rounded-xl px-4 py-8 text-center">
                <div className="text-2xl mb-2">🔒</div>
                <div className="font-semibold text-text-primary mb-1.5">Demo account</div>
                <div className="text-text-muted text-sm">
                    Profile changes are not available in demo mode.
                </div>
            </div>
        )
    }

    return (
        
        <div className="bg-bg-card border-half rounded-xl px-4 py-3.5">
            <div className="font-semibold text-text-primary pb-2.5 mb-3">
                Edit profile
            </div>

            {/* Name */}
            <div className="mb-2.5">
                <label className="text-text-muted text-xs uppercase tracking-wider block mb-1.5">Name</label>
                <input
                    value={name}
                    onChange={e => setName(e.target.value)}
                    className="w-full bg-bg-input border-half rounded-md px-2.5 py-2 text-sm text-text-primary outline-none focus:border-half-purple transition-colors"
                />
            </div>

            {/* Email */}
            <div className="mb-2.5">
                <label className="text-text-muted text-xs uppercase tracking-wider block mb-1.5">Email</label>
                <input
                    type="email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    className="w-full bg-bg-input border-half rounded-md px-2.5 py-2 text-sm text-text-primary outline-none focus:border-half-purple transition-colors"
                />
            </div>

            {/* Fitness level */}
            <div className="mb-2.5">
                <label className="text-text-muted text-xs uppercase tracking-wider block mb-1.5">Fitness Level</label>
                {user?.fitnessLevel && (
                    <div className="text-text-muted text-xs mb-2">
                        Current: <span className="text-purple-light font-semibold">{user.fitnessLevel}</span>
                    </div>
                )}
                <div className="flex flex-col gap-2">
                    {LEVELS.map(level => (
                        <div
                            key={level.value}
                            onClick={() => setFitnessLevel(level.value)}
                            className={`px-3 py-2.5 rounded-lg cursor-pointer transition-colors
                                ${fitnessLevel === level.value
                                    ? 'border-half-purple bg-purple-bg'
                                    : 'border-half bg-bg-input hover:border-half-purple'
                                }`}
                        >
                            <div className={`font-semibold text-sm ${fitnessLevel === level.value ? 'text-purple-light' : 'text-text-primary'}`}>
                                {level.label}
                            </div>
                            <div className="text-text-muted text-xs mt-0.5">{level.desc}</div>
                        </div>
                    ))}
                </div>
            </div>

            {error && <div className="text-red text-sm mb-2">{error}</div>}
            {success && <div className="text-teal text-sm mb-2">Profile updated successfully.</div>}

            <div className="flex gap-2 mt-1">
                <button
                    onClick={handleSave}
                    disabled={loading}
                    className={`px-3.5 py-1.5 rounded-md text-sm font-semibold border-none transition-opacity
                        ${loading
                            ? 'bg-border text-text-muted cursor-not-allowed'
                            : 'bg-purple text-white cursor-pointer hover:opacity-90'
                        }`}
                >
                    {loading ? 'Saving...' : 'Save changes'}
                </button>
                <button
                    onClick={() => { setName(user.name); setEmail(user.email); setError(null); setSuccess(false) }}
                    className="px-3.5 py-1.5 rounded-md text-sm text-text-muted bg-bg-input border-half cursor-pointer hover:text-text-primary transition-colors"
                >
                    Cancel
                </button>
            </div>
        </div>
    )
}