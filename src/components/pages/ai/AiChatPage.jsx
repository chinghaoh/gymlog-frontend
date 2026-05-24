import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { getAiContext, generateWorkout, saveFitnessLevel } from '../../services/aiService'
import { useAuth } from '../../context/AuthContext'

const SPLITS = [
    { label: 'Push Day', value: 'PUSH' },
    { label: 'Pull Day', value: 'PULL' },
    { label: 'Leg Day', value: 'LEGS' },
    { label: 'Upper Body', value: 'UPPER_BODY' },
    { label: 'Full Body', value: 'FULL_BODY' },
]

const LEVELS = [
    { label: 'Beginner', value: 'BEGINNER', desc: 'Less than 1 year of training' },
    { label: 'Intermediate', value: 'INTERMEDIATE', desc: '1 to 3 years of training' },
    { label: 'Advanced', value: 'ADVANCED', desc: 'More than 3 years of training' },
]

export default function AiChatPage() {
    const navigate = useNavigate()
    const { user, setUser } = useAuth()
    
    const [context, setContext] = useState(null)
    const [step, setStep] = useState('loading')
    const [selectedSplit, setSelectedSplit] = useState(null)
    const [result, setResult] = useState(null)
    const [errorMsg, setErrorMsg] = useState(null)

    useEffect(() => {
        getAiContext(user?.id)
            .then(data => {
                setContext(data)
                if (data.fitnessLevel) {
                    setStep('split')
                } else {
                    setStep('split')
                }
            })
            .catch(() => setStep('error'))
    }, [])

    const handleSplitSelect = async (split) => {
        setSelectedSplit(split)
        if (!context.fitnessLevel) {
            setStep('level')
        } else {
            await handleGenerate(split, context.fitnessLevel)
        }
    }

    const handleLevelSelect = async (level) => {
        if (!user?.id) return
        try {
            await saveFitnessLevel(user.id, level.value)
            setUser(prev => ({ ...prev, fitnessLevel: level.value }))
            setContext(prev => ({ ...prev, fitnessLevel: level.value }))
            await handleGenerate(selectedSplit, level.value)
        } catch {
            setStep('error')
            setErrorMsg('Failed to save fitness level. Please try again.')
        }
    }

    const handleGenerate = async (split, level) => {
        setStep('generating')
        try {
            const data = await generateWorkout(user?.id, split.value)
            if (data.action === 'REJECTED') {
                setErrorMsg(data.message)
                setStep('error')
            } else {
                setResult(data)
                setStep('result')
            }
        } catch {
            setErrorMsg('Something went wrong. Please try again.')
            setStep('error')
        }
    }

    const handleReset = () => {
        setSelectedSplit(null)
        setResult(null)
        setErrorMsg(null)
        setStep('split')
    }

    return (
        <div style={{ maxWidth: 600, margin: '0 auto', padding: '2rem 0' }}>

            {/* Header */}
            <div style={{ marginBottom: '2rem' }}>
                <h1 style={{ fontWeight: 700, color: 'var(--text-primary)', marginBottom: 4 }}>AI Workout Creator</h1>
                <div style={{ color: 'var(--text-muted)' }}>Let your personal trainer create a workout based on your history</div>
            </div>

            {step === 'split' && (
                <div style={{ background: 'var(--bg-card)', border: '0.5px solid var(--border)', borderRadius: 12, padding: '1.5rem' }}>
                    <div style={{ color: 'var(--text-primary)', fontWeight: 600, marginBottom: '0.5rem' }}>
                        What kind of workout do you want today?
                    </div>
                    <div style={{ color: 'var(--text-muted)', marginBottom: '1.5rem' }}>
                        Select a split and your AI trainer will build a personalised session for you.
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                        {SPLITS.map(split => (
                            <button key={split.value} onClick={() => handleSplitSelect(split)}
                                style={{
                                    background: 'var(--bg-input)',
                                    border: '0.5px solid var(--border)',
                                    borderRadius: 8,
                                    padding: '12px 16px',
                                    color: 'var(--text-primary)',
                                    fontWeight: 600,
                                    cursor: 'pointer',
                                    textAlign: 'left',
                                    transition: 'border-color 0.15s'
                                }}
                                onMouseEnter={e => e.currentTarget.style.borderColor = 'var(--purple)'}
                                onMouseLeave={e => e.currentTarget.style.borderColor = 'var(--border)'}
                            >
                                {split.label}
                            </button>
                        ))}
                    </div>
                </div>
            )}

            {step === 'level' && (
                <div style={{ background: 'var(--bg-card)', border: '0.5px solid var(--border)', borderRadius: 12, padding: '1.5rem' }}>
                    <div style={{ color: 'var(--text-primary)', fontWeight: 600, marginBottom: '0.5rem' }}>
                        What is your training experience?
                    </div>
                    <div style={{ color: 'var(--text-muted)', marginBottom: '1.5rem' }}>
                        This helps your AI trainer set the right weights. You only need to do this once.
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                        {LEVELS.map(level => (
                            <button key={level.value} onClick={() => handleLevelSelect(level)}
                                style={{
                                    background: 'var(--bg-input)',
                                    border: '0.5px solid var(--border)',
                                    borderRadius: 8,
                                    padding: '14px 16px',
                                    color: 'var(--text-primary)',
                                    cursor: 'pointer',
                                    textAlign: 'left',
                                    transition: 'border-color 0.15s'
                                }}
                                onMouseEnter={e => e.currentTarget.style.borderColor = 'var(--purple)'}
                                onMouseLeave={e => e.currentTarget.style.borderColor = 'var(--border)'}
                            >
                                <div style={{ fontWeight: 600 }}>{level.label}</div>
                                <div style={{ color: 'var(--text-muted)', marginTop: 2 }}>{level.desc}</div>
                            </button>
                        ))}
                    </div>
                </div>
            )}

            {step === 'generating' && (
                <div style={{ background: 'var(--bg-card)', border: '0.5px solid var(--border)', borderRadius: 12, padding: '2.5rem', textAlign: 'center' }}>
                    <div style={{ fontSize: 32, marginBottom: '1rem' }}>🏋️</div>
                    <div style={{ color: 'var(--text-primary)', fontWeight: 600, marginBottom: 8 }}>
                        Building your {selectedSplit?.label}...
                    </div>
                    <div style={{ color: 'var(--text-muted)' }}>
                        Your AI trainer is reviewing your history and selecting the best exercises for you.
                    </div>
                </div>
            )}

            {step === 'result' && result && (
                <div style={{ background: 'var(--bg-card)', border: '0.5px solid var(--border)', borderRadius: 12, padding: '1.5rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: '1rem' }}>
                        <div style={{ fontSize: 24 }}>✅</div>
                        <div>
                            <div style={{ color: 'var(--text-primary)', fontWeight: 700 }}>{result.message}</div>
                        </div>
                    </div>

                    <div style={{ background: 'var(--bg-input)', borderRadius: 8, padding: '12px 14px', marginBottom: '1rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                        <div style={{ color: 'var(--text-muted)', marginBottom: 4, fontWeight: 600 }}>TRAINER NOTES</div>
                        {result.reasoning}
                    </div>

                    <div style={{ display: 'flex', gap: 10 }}>
                        <button onClick={() => navigate(`/workouts/${result.workoutId}`)}
                            style={{ flex: 1, background: 'var(--purple)', color: 'white', border: 'none', borderRadius: 8, padding: '10px 16px', fontWeight: 600, cursor: 'pointer' }}>
                            View Workout
                        </button>
                        <button onClick={handleReset}
                            style={{ flex: 1, background: 'transparent', color: 'var(--text-muted)', border: '0.5px solid var(--border)', borderRadius: 8, padding: '10px 16px', cursor: 'pointer' }}>
                            Generate Another
                        </button>
                    </div>
                </div>
            )}


            {step === 'error' && (
                <div style={{ background: 'var(--bg-card)', border: '0.5px solid var(--border)', borderRadius: 12, padding: '1.5rem', textAlign: 'center' }}>
                    <div style={{ fontSize: 32, marginBottom: '1rem' }}>⚠️</div>
                    <div style={{ color: 'var(--text-primary)', fontWeight: 600, marginBottom: 8 }}>
                        {errorMsg || 'Something went wrong'}
                    </div>
                    <button onClick={handleReset}
                        style={{ background: 'var(--purple)', color: 'white', border: 'none', borderRadius: 8, padding: '10px 20px', fontWeight: 600, cursor: 'pointer', marginTop: '1rem' }}>
                        Try Again
                    </button>
                </div>
            )}

        </div>
    )
}