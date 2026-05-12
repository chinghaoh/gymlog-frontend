import { useState } from "react"

export default function Login() {
    const [isLogin, setIsLogin] = useState(true)

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

                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, marginBottom: '1.5rem' }}>
                    <div style={{
                        width: 28, height: 28, background: 'var(--purple)',
                        borderRadius: 6, display: 'flex', alignItems: 'center',
                        justifyContent: 'center', color: 'white', fontWeight: 700, fontSize: 14
                    }}>G</div>
                    <span style={{ color: 'var(--text-primary)', fontWeight: 600, fontSize: 16 }}>GymLog</span>
                </div>

                <div style={{
                    display: 'flex',
                    background: 'var(--bg-page)',
                    borderRadius: 8,
                    padding: 3,
                    marginBottom: '1.5rem'
                }}>

                    <button
                        onClick={() => setIsLogin(true)}
                        style={{
                            flex: 1, padding: '7px', fontSize: 12, borderRadius: 6,
                            border: 'none', cursor: 'pointer',
                            background: isLogin ? 'var(--purple)' : 'transparent',
                            color: isLogin ? 'white' : 'var(--text-muted)',
                            fontWeight: isLogin ? 600 : 400
                        }}>Login
                    </button>

                    <button
                        onClick={() => setIsLogin(false)}
                        style={{
                            flex: 1, padding: '7px', fontSize: 12, borderRadius: 6,
                            border: 'none', cursor: 'pointer',
                            background: isLogin ? 'transparent' : 'var(--purple)',
                            color: isLogin ? 'var(--text-muted)' : 'white',
                            fontWeight: isLogin ? 400 : 600
                        }}>Register
                    </button>
                </div>

                <div>
                    <label style={{ display: 'block', fontSize: 12, color: 'var(--text-muted)', marginBottom: 10 }}>
                        Email address
                    </label>
                    <input
                        className="input-field"
                        type="email"
                        placeholder="you@example.com"
                        style={{
                            width: '100%',
                            background: 'var(--bg-input)',
                            borderRadius: 7,
                            padding: '9px 12px',
                            fontSize: 13,
                            color: 'var(--text-primary)',
                            outline: 'none',
                            marginBottom: 10
                        }}
                    />
                </div>

                <div>
                    <label style={{ display: 'block', fontSize: 12, color: 'var(--text-muted)', marginBottom: 10 }}>
                        Password
                    </label>
                    <input
                        className="input-field"
                        type="password"
                        placeholder="Type in your password"
                        style={{
                            width: '100%',
                            background: 'var(--bg-input)',
                            borderRadius: 7,
                            padding: '9px 12px',
                            fontSize: 13,
                            color: 'var(--text-primary)',
                            outline: 'none',
                            marginBottom: 10
                        }}
                    />
                </div>

                {!isLogin && (
                    <div>
                        <label style={{ display: 'block', fontSize: 12, color: 'var(--text-muted)', marginBottom: 10 }}>
                            Confirm password
                        </label>
                        <input
                            className="input-field"
                            type="password"
                            placeholder="Confirm your password"
                            style={{
                                width: '100%',
                                background: 'var(--bg-input)',
                                borderRadius: 7,
                                padding: '9px 12px',
                                fontSize: 13,
                                color: 'var(--text-primary)',
                                outline: 'none',
                                marginBottom: 10
                            }}
                        />
                    </div>
                )}

                <button style={{
                    width: '100%',
                    background: 'var(--purple)',
                    color: 'white',
                    border: 'none',
                    borderRadius: 7,
                    padding: '10px',
                    fontSize: 13,
                    fontWeight: 600,
                    cursor: 'pointer',
                    marginTop: 10
                }}>
                    {isLogin ? 'Sign in' : 'Sign up'}
                </button>
            </div>
        </div>
    )
}