import React from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { Network, Users, Bell, PlusCircle } from 'lucide-react'
import { useStore } from '../store/useStore'

export function BottomNav() {
  const navigate = useNavigate()
  const location = useLocation()
  const getUnreadAlertCount = useStore((s) => s.getUnreadAlertCount)
  const unread = getUnreadAlertCount()

  const tabs = [
    { path: '/', icon: Network, label: 'Карта' },
    { path: '/contacts', icon: Users, label: 'Контакты' },
    { path: '/add', icon: PlusCircle, label: 'Добавить' },
    { path: '/alerts', icon: Bell, label: 'Сигналы', badge: unread },
  ]

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-50 safe-area-pb">
      <div className="flex items-center justify-around h-16">
        {tabs.map((tab) => {
          const active = location.pathname === tab.path
          return (
            <button
              key={tab.path}
              onClick={() => navigate(tab.path)}
              className={`flex flex-col items-center gap-0.5 px-4 py-2 relative transition-colors ${
                active ? 'text-brand-500' : 'text-gray-400'
              }`}
            >
              <tab.icon size={22} strokeWidth={active ? 2.5 : 1.8} />
              <span className="text-[10px] font-medium">{tab.label}</span>
              {'badge' in tab && tab.badge && tab.badge > 0 && (
                <span className="absolute top-1.5 right-2 min-w-4 h-4 px-1 bg-accent rounded-full text-white text-[10px] font-bold flex items-center justify-center">
                  {tab.badge > 9 ? '9+' : tab.badge}
                </span>
              )}
            </button>
          )
        })}
      </div>
    </nav>
  )
}

