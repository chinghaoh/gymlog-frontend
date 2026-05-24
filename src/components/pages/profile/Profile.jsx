import { useState, useEffect } from 'react'
import { useAuth } from '../../context/AuthContext'
import OverviewSection from '../../ui/ProfileComponents/OverviewSection'
import EditSection from '../../ui/ProfileComponents/EditSection'
import SecuritySection from '../../ui/ProfileComponents/SecuritySection'
import DangerSection from '../../ui/ProfileComponents/DangerSection'

export default function Profile() {
    const { user } = useAuth()
    const [activeSection, setActiveSection] = useState('overview')

    const navItems = [
        { key: 'overview', label: 'Overview', icon: '👤' },
        { key: 'edit',     label: 'Edit profile', icon: '✏️' },
        { key: 'security', label: 'Security', icon: '🔒' },
    ]

    return (
        <div className="flex h-full">

            {/* Sidebar nav */}
            <div className="w-40 border-r border-half px-2.5 py-4 flex flex-col gap-0.5 flex-shrink-0">
                <div className="text-text-muted text-xs uppercase tracking-wider px-2.5 py-1 mb-1">
                    Profile
                </div>

                {navItems.map(item => (
                    <div
                        key={item.key}
                        onClick={() => setActiveSection(item.key)}
                        className={`flex items-center gap-2 px-2.5 py-1.5 rounded-md text-sm cursor-pointer transition-colors
                            ${activeSection === item.key
                                ? 'bg-purple-bg text-purple-light'
                                : 'text-text-muted hover:text-text-primary hover:bg-border-light'
                            }`}
                    >
                        <span>{item.icon}</span>
                        {item.label}
                    </div>
                ))}

                <div className="h-px bg-border mx-1 my-2" />

                <div
                    onClick={() => setActiveSection('danger')}
                    className={`flex items-center gap-2 px-2.5 py-1.5 rounded-md text-sm cursor-pointer transition-colors
                        ${activeSection === 'danger'
                            ? 'bg-red-bg text-red'
                            : 'text-red/40 hover:text-red hover:bg-red-bg'
                        }`}
                >
                    ⚠️ Danger zone
                </div>
            </div>

            {/* Content */}
            <div className="flex-1 p-4 overflow-y-auto max-w-md">
                {activeSection === 'overview'  && <OverviewSection />}
                {activeSection === 'edit'      && <EditSection />}
                {activeSection === 'security'  && <SecuritySection />}
                {activeSection === 'danger'    && <DangerSection />}
            </div>

        </div>
    )
}