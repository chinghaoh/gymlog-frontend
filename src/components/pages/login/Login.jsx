import { useState } from "react"
import { apiClient } from '../../../lib/ApiClient'
import { useNavigate } from "react-router-dom"
import { useAuth } from '../../context/AuthContext'

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

    const handleDemo = async () => {
        setError('')
        try {
            await apiClient('/api/auth/demo', {
                method: 'POST',
                skipRedirect: true
            })
            await loadUser()
            navigate('/dashboard')
        } catch (err) {
            setError(err.message || 'Failed to start demo. Please try again.')
        }
    }

    const handleSubmit = async () => {
        if (!validate()) return

        const endpoint = isLogin ? '/api/auth/login' : '/api/auth/register'
        const body = isLogin ? { email, password } : { name, email, password }

        try {
            await apiClient(endpoint, {
                method: 'POST',
                body: JSON.stringify(body),
                skipRedirect: true
            })

            if (isLogin) {
                await loadUser()
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

    const isFormValid = () => {
        if (!email.includes('@')) return false
        if (password.length < 6) return false
        if (!isLogin && password !== confirmPassword) return false
        if (!isLogin && name.trim() === '') return false
        return true
    }

    const fieldError = (field) => getFieldError(field)
        ? <div className="text-red text-xs mb-2">{getFieldError(field)}</div>
        : <div className="mb-2" />

    return (
        <div className="min-h-screen bg-bg-page flex items-center justify-center p-8">
            <div className="bg-bg-card border-half rounded-xl p-8 w-full max-w-sm">

                {/* Logo */}
                <div className="flex items-center justify-center gap-2 mb-8">
                    <div className="w-7 h-7 bg-purple rounded-md flex items-center justify-center text-white font-bold text-sm">
                        G
                    </div>
                    <span className="text-text-primary font-semibold text-base">GymLog</span>
                </div>

                {/* Tabs */}
                <div className="flex bg-bg-page rounded-lg p-1 mb-6">
                    <button
                        onClick={() => { setIsLogin(true); setSuccess(''); setError('') }}
                        className={`flex-1 py-2 text-xs rounded-md font-medium transition-all cursor-pointer border-none
                            ${isLogin ? 'bg-purple text-white font-semibold' : 'bg-transparent text-text-muted'}`}
                    >
                        Login
                    </button>
                    <button
                        onClick={() => { setIsLogin(false); setSuccess(''); setError('') }}
                        className={`flex-1 py-2 text-xs rounded-md font-medium transition-all cursor-pointer border-none
                            ${!isLogin ? 'bg-purple text-white font-semibold' : 'bg-transparent text-text-muted'}`}
                    >
                        Register
                    </button>
                </div>

                {/* Name */}
                {!isLogin && (
                    <div className="mb-4">
                        <label className="block text-xs text-text-muted mb-2">Name</label>
                        <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            onBlur={() => handleBlur('name')}
                            placeholder="Your name"
                            className="w-full bg-bg-input border-half rounded-lg px-3 py-2 text-sm text-text-primary outline-none focus:border-half-purple transition-colors"
                        />
                        {fieldError('name')}
                    </div>
                )}

                {/* Email */}
                <div className="mb-4">
                    <label className="block text-xs text-text-muted mb-2">Email address</label>
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => { setEmail(e.target.value); setError('') }}
                        onBlur={() => handleBlur('email')}
                        placeholder="you@example.com"
                        className="w-full bg-bg-input border-half rounded-lg px-3 py-2 text-sm text-text-primary outline-none focus:border-half-purple transition-colors"
                    />
                    {fieldError('email')}
                </div>

                {/* Password */}
                <div className="mb-4">
                    <label className="block text-xs text-text-muted mb-2">Password</label>
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => { setPassword(e.target.value); setError('') }}
                        onBlur={() => handleBlur('password')}
                        placeholder="Type in your password"
                        className="w-full bg-bg-input border-half rounded-lg px-3 py-2 text-sm text-text-primary outline-none focus:border-half-purple transition-colors"
                    />
                    {fieldError('password')}
                </div>

                {/* Confirm password */}
                {!isLogin && (
                    <div className="mb-4">
                        <label className="block text-xs text-text-muted mb-2">Confirm password</label>
                        <input
                            type="password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            onBlur={() => handleBlur('confirmPassword')}
                            placeholder="Confirm your password"
                            className="w-full bg-bg-input border-half rounded-lg px-3 py-2 text-sm text-text-primary outline-none focus:border-half-purple transition-colors"
                        />
                        {fieldError('confirmPassword')}
                    </div>
                )}

                {/* Error */}
                {error && (
                    <div className="text-red text-xs mb-4 px-3 py-2 bg-red-bg rounded-md">
                        {error}
                    </div>
                )}

                {/* Success */}
                {success && (
                    <div className="text-teal text-xs mb-4 px-3 py-2 bg-teal-bg rounded-md">
                        {success}
                    </div>
                )}

                {/* Submit */}
                <button
                    onClick={handleSubmit}
                    disabled={!isFormValid()}
                    className={`w-full mt-2 py-2.5 rounded-lg text-sm font-semibold transition-opacity border-none
                        ${isFormValid()
                            ? 'bg-purple text-white cursor-pointer hover:opacity-90'
                            : 'bg-border text-text-muted cursor-not-allowed'
                        }`}
                >
                    {isLogin ? 'Sign in' : 'Sign up'}
                </button>

                {/* Demo button — only show on login tab */}
                {isLogin && (
                    <button
                        onClick={handleDemo}
                        className="w-full mt-2 py-2.5 rounded-lg text-sm font-semibold bg-transparent border border-border text-text-muted cursor-pointer hover:border-purple hover:text-text-primary transition-colors"
                    >
                        Try Demo
                    </button>
                )}

                {/* Forgot password */}
                <div
                    onClick={() => navigate('/forgot-password')}
                    className="text-center text-text-muted text-sm mt-4 cursor-pointer hover:text-text-primary transition-colors"
                >
                    Forgot password?
                </div>

            </div>
        </div>
    )
}