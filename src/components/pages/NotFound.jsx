import { useNavigate } from 'react-router-dom'

export default function NotFound() {
    const navigate = useNavigate()

    return (
        <div className="min-h-screen bg-bg-page flex items-center justify-center">
            <div className="text-center flex flex-col items-center gap-3">
                <div className="text-7xl font-bold text-purple opacity-20">404</div>
                <div className="text-xl font-bold text-text-primary">Page not found</div>
                <div className="text-text-muted text-sm">The page you're looking for doesn't exist.</div>
                <button
                    onClick={() => navigate('/dashboard')}
                    className="mt-2 bg-purple text-white border-none rounded-lg px-5 py-2.5 text-sm font-semibold cursor-pointer hover:opacity-90 transition-opacity"
                >
                    Back to Dashboard
                </button>
            </div>
        </div>
    )
}