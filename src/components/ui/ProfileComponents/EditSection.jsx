import { useState, useEffect } from 'react'
import { apiClient } from '../../../lib/apiClient'
import { useAuth } from '../../context/AuthContext'

export default function EditSection() {
    const { user, setUser } = useAuth()

    const [name, setName] = useState('')
    const [email, setEmail] = useState('')
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(null)
    const [success, setSuccess] = useState(false)

    useEffect(() => {
        if (user) {
            setName(user.name)
            setEmail(user.email)
        }
    }, [user])

    const handleSave = async () => {
        const confirmed = window.confirm('Are you sure you want to update your profile?')
        if (!confirmed) return
        
        setLoading(true)
        setError(null)
        setSuccess(false)

        try {
            const updated = await apiClient(`/api/users/${user.id}`, {
                method: 'PUT',
                body: JSON.stringify({ name, email }),
            })
            setUser(updated)
            setSuccess(true)
        } catch (err) {
            setError(err.message || 'Failed to update profile.')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div style={{ background: 'var(--bg-card)', border: '0.5px solid var(--border)', borderRadius: 10, padding: '14px 16px' }}>
            <div style={{ fontWeight: 600, color: 'var(--text-primary)', paddingBottom: 10, borderBottom: '0.5px solid var(--border)', marginBottom: 12 }}>
                Edit profile
            </div>

            <div style={{ marginBottom: 10 }}>
                <label style={{ color: 'var(--text-muted)', display: 'block', marginBottom: 5, textTransform: 'uppercase', letterSpacing: '0.04em' }}>Name</label>
                <input
                    className="input-field"
                    value={name}
                    onChange={e => setName(e.target.value)}
                    style={{ width: '100%', background: 'var(--bg-input)', borderRadius: 6, padding: '8px 10px', color: 'var(--text-primary)', outline: 'none' }}
                />
            </div>

            <div style={{ marginBottom: 10 }}>
                <label style={{ color: 'var(--text-muted)', display: 'block', marginBottom: 5, textTransform: 'uppercase', letterSpacing: '0.04em' }}>Email</label>
                <input
                    className="input-field"
                    type="email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    style={{ width: '100%', background: 'var(--bg-input)', borderRadius: 6, padding: '8px 10px', color: 'var(--text-primary)', outline: 'none' }}
                />
            </div>

            {error && <div style={{ color: 'var(--red)', marginBottom: 8 }}>{error}</div>}
            {success && <div style={{ color: 'var(--teal)', marginBottom: 8 }}>Profile updated successfully.</div>}

            <div style={{ display: 'flex', gap: 8, marginTop: 4 }}>
                <button
                    onClick={handleSave}
                    disabled={loading}
                    style={{
                        background: loading ? 'var(--border)' : 'var(--purple)',
                        border: 'none', borderRadius: 6, padding: '7px 14px',
                        fontWeight: 600, color: 'white', cursor: loading ? 'default' : 'pointer',
                    }}
                >{loading ? 'Saving...' : 'Save changes'}</button>
                <button
                    onClick={() => { setName(user.name); setEmail(user.email); setError(null); setSuccess(false) }}
                    style={{ background: 'var(--bg-input)', border: '0.5px solid var(--border)', borderRadius: 6, padding: '7px 14px', color: 'var(--text-muted)', cursor: 'pointer' }}
                >Cancel</button>
            </div>
        </div>
    )
}