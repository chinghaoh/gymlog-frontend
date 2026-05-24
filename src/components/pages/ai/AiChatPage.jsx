import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { getAiContext, generateWorkout, saveFitnessLevel } from '../../services/aiService'
import { useAuth } from '../../context/AuthContext'

const SPLITS = [
    { label: 'Push Day',    value: 'PUSH' },
    { label: 'Pull Day',    value: 'PULL' },
    { label: 'Leg Day',     value: 'LEGS' },
    { label: 'Upper Body',  value: 'UPPER_BODY' },
    { label: 'Full Body',   value: 'FULL_BODY' },
]

const LEVELS = [
    { label: 'Beginner',     value: 'BEGINNER',     desc: 'Less than 1 year of training' },
    { label: 'Intermediate', value: 'INTERMEDIATE', desc: '1 to 3 years of training' },
    { label: 'Advanced',     value: 'ADVANCED',     desc: 'More than 3 years of training' },
]

const cardClass = "bg-bg-card border-half rounded-xl p-6"
const optionBtnClass = "w-full bg-bg-input border-half rounded-lg px-4 py-3 text-text-primary font-semibold cursor-pointer text-left hover:border-half-purple transition-colors"

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
                setStep('split')
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
        <div className="max-w-xl mx-auto py-8">

            {/* Header */}
            <div className="mb-8">
                <h1 className="text-xl font-bold text-text-primary mb-1">AI Workout Creator</h1>
                <div className="text-text-muted text-sm">
                    Let your personal trainer create a workout based on your history
                </div>
            </div>

            {/* Step — split */}
            {step === 'split' && (
                <div className={cardClass}>
                    <div className="font-semibold text-text-primary mb-1.5">
                        What kind of workout do you want today?
                    </div>
                    <div className="text-text-muted text-sm mb-6">
                        Select a split and your AI trainer will build a personalised session for you.
                    </div>
                    <div className="flex flex-col gap-2.5">
                        {SPLITS.map(split => (
                            <button
                                key={split.value}
                                onClick={() => handleSplitSelect(split)}
                                className={optionBtnClass}
                            >
                                {split.label}
                            </button>
                        ))}
                    </div>
                </div>
            )}

            {/* Step — level */}
            {step === 'level' && (
                <div className={cardClass}>
                    <div className="font-semibold text-text-primary mb-1.5">
                        What is your training experience?
                    </div>
                    <div className="text-text-muted text-sm mb-6">
                        This helps your AI trainer set the right weights. You only need to do this once.
                    </div>
                    <div className="flex flex-col gap-2.5">
                        {LEVELS.map(level => (
                            <button
                                key={level.value}
                                onClick={() => handleLevelSelect(level)}
                                className={optionBtnClass}
                            >
                                <div>{level.label}</div>
                                <div className="text-text-muted font-normal text-sm mt-0.5">{level.desc}</div>
                            </button>
                        ))}
                    </div>
                </div>
            )}

            {/* Step — generating */}
            {step === 'generating' && (
                <div className={`${cardClass} text-center py-10`}>
                    <div className="text-4xl mb-4">🏋️</div>
                    <div className="font-semibold text-text-primary mb-2">
                        Building your {selectedSplit?.label}...
                    </div>
                    <div className="text-text-muted text-sm">
                        Your AI trainer is reviewing your history and selecting the best exercises for you.
                    </div>
                </div>
            )}

            {/* Step — result */}
            {step === 'result' && result && (
                <div className={cardClass}>
                    <div className="flex items-center gap-2.5 mb-4">
                        <div className="text-2xl">✅</div>
                        <div className="font-bold text-text-primary">{result.message}</div>
                    </div>

                    <div className="bg-bg-input border-half rounded-lg px-3.5 py-3 mb-4">
                        <div className="text-text-muted text-xs font-semibold uppercase tracking-wider mb-1.5">
                            Trainer Notes
                        </div>
                        <div className="text-text-secondary text-sm leading-relaxed">
                            {result.reasoning}
                        </div>
                    </div>

                    <div className="flex gap-2.5">
                        <button
                            onClick={() => navigate(`/workouts/${result.workoutId}`)}
                            className="flex-1 bg-purple text-white border-none rounded-lg py-2.5 text-sm font-semibold cursor-pointer hover:opacity-90 transition-opacity"
                        >
                            View Workout
                        </button>
                        <button
                            onClick={handleReset}
                            className="flex-1 bg-transparent text-text-muted border-half rounded-lg py-2.5 text-sm cursor-pointer hover:text-text-primary hover:border-half-purple transition-colors"
                        >
                            Generate Another
                        </button>
                    </div>
                </div>
            )}

            {/* Step — error */}
            {step === 'error' && (
                <div className={`${cardClass} text-center`}>
                    <div className="text-4xl mb-4">⚠️</div>
                    <div className="font-semibold text-text-primary mb-2">
                        {errorMsg || 'Something went wrong'}
                    </div>
                    <button
                        onClick={handleReset}
                        className="bg-purple text-white border-none rounded-lg px-5 py-2.5 text-sm font-semibold cursor-pointer hover:opacity-90 transition-opacity mt-4"
                    >
                        Try Again
                    </button>
                </div>
            )}

        </div>
    )
}