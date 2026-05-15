import { useState, useEffect } from 'react'
import { apiClient } from '../../lib/apiClient'
import { useAuth } from '../context/AuthContext'
import OverviewSection from '../ui/ProfileComponents/OverviewSection'
import EditSection from '../ui/ProfileComponents/EditSection'
import SecuritySection from '../ui/ProfileComponents/SecuritySection'
import DangerSection from '../ui/ProfileComponents/DangerSection'

export default function Profile() {
    const { user, setUser } = useAuth()

    const [activeSection, setActiveSection] = useState('overview')


    const [name, setName] = useState('')
    const [email, setEmail] = useState('')
    const [profileLoading, setProfileLoading] = useState(false)
    const [profileError, setProfileError] = useState(null)
    const [profileSuccess, setProfileSuccess] = useState(false)

    const [currentPassword, setCurrentPassword] = useState('')
    const [newPassword, setNewPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const [passwordLoading, setPasswordLoading] = useState(false)
    const [passwordError, setPasswordError] = useState(null)
    const [passwordSuccess, setPasswordSuccess] = useState(false)

    useEffect(() => {
        if (user) {
            setName(user.name)
            setEmail(user.email)
        }
    }, [user])

    const handleUpdateProfile = async () => {
        setProfileLoading(true)
        setProfileError(null)
        setProfileSuccess(false)

        try {
            const updated = await apiClient(`/api/users/${user.id}`, {
                method: 'PUT',
                body: JSON.stringify({ name, email }),
            })
            setUser(updated)
            setProfileSuccess(true)
        } catch (err) {
            setProfileError(err.message || 'Failed to update profile.')
        } finally {
            setProfileLoading(false)
        }
    }

    const handleChangePassword = async () => {
        if (newPassword !== confirmPassword) {
            setPasswordError('Passwords do not match.')
            return
        }

        setPasswordLoading(true)
        setPasswordError(null)
        setPasswordSuccess(false)

        try {
            await apiClient(`/api/users/${user.id}/password`, {
                method: 'PUT',
                body: JSON.stringify({ currentPassword, newPassword }),
            })
            setPasswordSuccess(true)
            setCurrentPassword('')
            setNewPassword('')
            setConfirmPassword('')
        } catch (err) {
            setPasswordError(err.message || 'Failed to change password.')
        } finally {
            setPasswordLoading(false)
        }
    }

    return (
        <div style={{ display: 'flex', gap: 0, height: '100%' }}>

            {/* Profile*/}
            <div style={{
                width: 160, borderRight: '0.5px solid var(--border)',
                padding: '16px 10px', display: 'flex', flexDirection: 'column', gap: 2, flexShrink: 0,
            }}>
                <div style={{ color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em', padding: '4px 10px', marginBottom: 4 }}>
                    Profile
                </div>
                {[
                    { key: 'overview', label: 'Overview', icon: '👤' },
                    { key: 'edit', label: 'Edit profile', icon: '✏️' },
                    { key: 'security', label: 'Security', icon: '🔒' },
                ].map(item => (
                    <div
                        key={item.key}
                        onClick={() => setActiveSection(item.key)}
                        style={{
                            padding: '7px 10px', borderRadius: 6,
                            display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer',
                            background: activeSection === item.key ? 'var(--purple-bg)' : 'transparent',
                            color: activeSection === item.key ? 'var(--purple-light)' : 'var(--text-muted)',
                        }}
                    >
                        <span>{item.icon}</span> {item.label}
                    </div>
                ))}

                <div style={{ height: '0.5px', background: 'var(--border)', margin: '8px 4px' }} />

                <div
                    onClick={() => setActiveSection('danger')}
                    style={{
                        padding: '7px 10px', borderRadius: 6,
                        display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer',
                        color: activeSection === 'danger' ? 'var(--red)' : '#4a2020',
                        background: activeSection === 'danger' ? 'var(--red-bg)' : 'transparent',
                    }}
                >
                    ⚠️ Danger zone
                </div>
            </div>

            {/* Sections */}
            <div style={{ flex: 1, padding: 16, overflowY: 'auto', maxWidth: 480 }}>
                {activeSection === 'overview' && <OverviewSection/>}
                {activeSection === 'edit' && <EditSection />}
                {activeSection === 'security' && <SecuritySection />}
                {activeSection === 'danger' && <DangerSection />}
            </div>

        </div>
    )
}