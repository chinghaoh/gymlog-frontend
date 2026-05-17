import { useState } from "react"
import { apiClient } from '../../lib/ApiClient'
import { useNavigate } from "react-router-dom"
import { useAuth } from '../context/AuthContext'


export default function Login() {
    const [isLogin, setIsLogin] = useState(true)
    const [name, setName] = useState("")
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [confirmPassword, setConfirmPassword] = useState("")
    const [error, setError] = useState("")
    const [touched, setTouched] = useState({})
    const [success, setSuccess] = useState('')

    const navigate = useNavigate()
    const { loadUser } = useAuth()

    const handleBlur = (field) => {
        setTouched(prev => ({ ...prev, [field]: true }))
    }

    const getFieldError = (field) => {
        if (!touched[field]) return null
        if (field === 'email' && !email.includes('@')) return 'Please enter a valid email'
        if (field === 'password' && password.length < 6) return 'Password must be at least 6 characters'
        if (field === 'confirmPassword' && password !== confirmPassword) return 'Passwords do not match'
        if (field === 'name' && name.trim() === '') return 'Please enter your name'
        return null
    }

    const validate = () => {
        if (!email.includes('@')) { setError('Please enter a valid email'); return false }
        if (password.length < 6) { setError('Password must be at least 6 characters'); return false }
        if (!isLogin && password !== confirmPassword) { setError('Passwords do not match'); return false }
        if (!isLogin && name.trim() === '') { setError('Please enter your name'); return false }
        return true
    }

    const handleSubmit = async () => {
        if (!validate()) return

        const endpoint = isLogin ? '/api/auth/login' : '/api/auth/register'
        const body = isLogin ? { email, password } : { name, email, password }

        try {
            const data = await apiClient(endpoint, {
                method: 'POST',
                body: JSON.stringify(body),
                skipRedirect: true
            })

            if (isLogin) {
                localStorage.setItem('token', data.token)
                localStorage.setItem('userId', data.userId)
                localStorage.setItem('role', data.role)
                localStorage.setItem('email', data.email)
                loadUser()
                navigate('/dashboard')
            } else {
                setSuccess('Registration successful! Please check your email to verify your account.')
                setEmail('')
                setError('')
                setName('')
                setPassword('')
                setConfirmPassword('')
                setTouched({})
            }

        } catch (err) {
            setError(err.message)
        }
    }

    const inputStyle = {
        width: '100%',
        background: 'var(--bg-input)',
        borderRadius: 7,
        padding: '9px 12px',
        fontSize: 13,
        color: 'var(--text-primary)',
        outline: 'none',
        marginBottom: 4
    }

    const isFormValid = () => {
        if (!email.includes('@')) return false
        if (password.length < 6) return false
        if (!isLogin && password !== confirmPassword) return false
        if (!isLogin && name.trim() === '') return false
        return true
    }

    const fieldError = (field) => getFieldError(field) ? (
        <div style={{ color: 'var(--red)', fontSize: 11, marginBottom: 8 }}>
            {getFieldError(field)}
        </div>
    ) : <div style={{ marginBottom: 8 }} />

    return (
        <div style={{
            minHeight: '100vh',
            background: 'var(--bg-page)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
        }}>
            <div style={{
                background: 'var(--bg-card)',
                border: '0.5px solid var(--border)',
                borderRadius: 12,
                padding: '2rem',
                width: '100%',
                maxWidth: 360,
            }}>

                {/* Logo */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, marginBottom: '1.5rem' }}>
                    <div style={{
                        width: 28, height: 28, background: 'var(--purple)',
                        borderRadius: 6, display: 'flex', alignItems: 'center',
                        justifyContent: 'center', color: 'white', fontWeight: 700, fontSize: 14
                    }}>G</div>
                    <span style={{ color: 'var(--text-primary)', fontWeight: 600, fontSize: 16 }}>GymLog</span>
                </div>

                {/* Tabs */}
                <div style={{ display: 'flex', background: 'var(--bg-page)', borderRadius: 8, padding: 3, marginBottom: '1.5rem' }}>
                    <button onClick={() => { setIsLogin(true); setSuccess(''); setError('') }} style={{
                        flex: 1, padding: '7px', fontSize: 12, borderRadius: 6,
                        border: 'none', cursor: 'pointer',
                        background: isLogin ? 'var(--purple)' : 'transparent',
                        color: isLogin ? 'white' : 'var(--text-muted)',
                        fontWeight: isLogin ? 600 : 400
                    }}>Login</button>
                    <button onClick={() => { setIsLogin(false); setSuccess(''); setError('') }} style={{
                        flex: 1, padding: '7px', fontSize: 12, borderRadius: 6,
                        border: 'none', cursor: 'pointer',
                        background: isLogin ? 'transparent' : 'var(--purple)',
                        color: isLogin ? 'var(--text-muted)' : 'white',
                        fontWeight: isLogin ? 400 : 600
                    }}>Register</button>
                </div>

                {/* Name */}
                {!isLogin && (
                    <div>
                        <label style={{ display: 'block', fontSize: 12, color: 'var(--text-muted)', marginBottom: 6 }}>Name</label>
                        <input className="input-field" type="text" value={name}
                            onChange={(e) => setName(e.target.value)}
                            onBlur={() => handleBlur('name')}
                            placeholder="Your name" style={inputStyle} />
                        {fieldError('name')}
                    </div>
                )}

                {/* Email */}
                <div>
                    <label style={{ display: 'block', fontSize: 12, color: 'var(--text-muted)', marginBottom: 6 }}>Email address</label>
                    <input className="input-field" type="email" value={email}
                        onChange={(e) => { setEmail(e.target.value); setError('') }}
                        onBlur={() => handleBlur('email')}
                        placeholder="you@example.com" style={inputStyle} />
                    {fieldError('email')}
                </div>

                {/* Password */}
                <div>
                    <label style={{ display: 'block', fontSize: 12, color: 'var(--text-muted)', marginBottom: 6 }}>Password</label>
                    <input className="input-field" type="password" value={password}
                        onChange={(e) => { setPassword(e.target.value); setError('') }}
                        onBlur={() => handleBlur('password')}
                        placeholder="Type in your password" style={inputStyle} />
                    {fieldError('password')}
                </div>

                {/* Confirm password */}
                {!isLogin && (
                    <div>
                        <label style={{ display: 'block', fontSize: 12, color: 'var(--text-muted)', marginBottom: 6 }}>Confirm password</label>
                        <input className="input-field" type="password" value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            onBlur={() => handleBlur('confirmPassword')}
                            placeholder="Confirm your password" style={inputStyle} />
                        {fieldError('confirmPassword')}
                    </div>
                )}

                {/* Error message */}
                {error && (
                    <div style={{ color: 'var(--red)', fontSize: 12, marginBottom: 8, padding: '8px 12px', background: 'var(--red-bg)', borderRadius: 6 }}>
                        {error}
                    </div>
                )}

                {/* Success message */}
                {success && (
                    <div style={{ color: 'var(--teal)', fontSize: 12, marginBottom: 8, padding: '8px 12px', background: 'var(--teal-bg)', borderRadius: 6 }}>
                        {success}
                    </div>
                )}

                {/* Submit */}
                <button
                    onClick={handleSubmit}
                    disabled={!isFormValid()}
                    style={{
                        width: '100%',
                        background: isFormValid() ? 'var(--purple)' : 'var(--border)',
                        color: isFormValid() ? 'white' : 'var(--text-muted)',
                        border: 'none', borderRadius: 7, padding: '10px', fontSize: 13,
                        fontWeight: 600,
                        cursor: isFormValid() ? 'pointer' : 'not-allowed',
                        marginTop: 4
                    }}>
                    {isLogin ? 'Sign in' : 'Sign up'}
                </button>


                {/* Forgot password */}
                <div
                    onClick={() => navigate('/forgot-password')}
                    style={{ textAlign: 'center', color: 'var(--text-muted)', cursor: 'pointer', marginTop: 12 }}
                >Forgot password?</div>
            </div>

        </div>
    )
}