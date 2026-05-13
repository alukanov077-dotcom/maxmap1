import React from 'react'
import { Bell, BellOff, BookOpen, Calendar, DollarSign, Zap, MapPin } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useStore } from '../store/useStore'
import type { Alert } from '../types'

const alertConfig: Record<
  Alert['type'],
  { icon: React.ElementType; color: string; bg: string }
> = {
  publication: { icon: BookOpen, color: 'text-brand-500', bg: 'bg-blue-50' },
  conference: { icon: Calendar, color: 'text-purple-500', bg: 'bg-purple-50' },
  budget: { icon: DollarSign, color: 'text-amber-500', bg: 'bg-amber-50' },
  competitor: { icon: Zap, color: 'text-red-500', bg: 'bg-red-50' },
  new_clinic: { icon: MapPin, color: 'text-green-500', bg: 'bg-green-50' },
}

const alertTypeLabel: Record<Alert['type'], string> = {
  publication: 'Публикация',
  conference: 'Конференция',
  budget: 'Бюджет',
  competitor: 'Конкурент',
  new_clinic: 'Новая точка',
}

export default function AlertsPage() {
  const navigate = useNavigate()
  const alerts = useStore((s) => s.alerts)
  const markAlertRead = useStore((s) => s.markAlertRead)
  const markAllAlertsRead = useStore((s) => s.markAllAlertsRead)

  const unread = alerts.filter((a) => !a.read)
  const read = alerts.filter((a) => a.read)

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <div className="bg-white px-4 pt-4 pb-4 shadow-sm">
        <div className="flex items-center gap-2">
          <h1 className="font-bold text-gray-900 text-lg flex-1">Сигналы рынка</h1>
          {unread.length > 0 && (
            <button
              onClick={markAllAlertsRead}
              className="text-xs text-brand-500 font-medium flex items-center gap-1"
            >
              <BellOff size={13} /> Прочитать все
            </button>
          )}
        </div>
        {unread.length > 0 && <p className="text-xs text-gray-400 mt-1">{unread.length} новых уведомлений</p>}
      </div>

      <div className="flex-1 overflow-y-auto px-4 py-4 pb-24 space-y-6">
        {alerts.length === 0 && (
          <div className="flex flex-col items-center py-16 text-gray-400">
            <Bell size={40} className="mb-3 opacity-30" />
            <p className="text-sm">Сигналов пока нет</p>
          </div>
        )}

        {unread.length > 0 && (
          <div>
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">Новые</p>
            <div className="space-y-2">
              {unread.map((alert) => (
                <AlertItem
                  key={alert.id}
                  alert={alert}
                  onRead={() => markAlertRead(alert.id)}
                  onContactClick={() => navigate(`/contact/${alert.contactId}`)}
                />
              ))}
            </div>
          </div>
        )}

        {read.length > 0 && (
          <div>
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">Прочитанные</p>
            <div className="space-y-2 opacity-60">
              {read.map((alert) => (
                <AlertItem
                  key={alert.id}
                  alert={alert}
                  onContactClick={() => navigate(`/contact/${alert.contactId}`)}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

function AlertItem({
  alert,
  onRead,
  onContactClick,
}: {
  alert: Alert
  onRead?: () => void
  onContactClick: () => void
}) {
  const cfg = alertConfig[alert.type]
  const IconComponent = cfg.icon
  return (
    <div
      className={`${cfg.bg} rounded-2xl p-4 border ${
        !alert.read ? 'border-gray-200 shadow-sm' : 'border-transparent'
      } cursor-pointer active:opacity-80`}
      onClick={() => {
        onRead?.()
        onContactClick()
      }}
    >
      <div className="flex items-start gap-3">
        <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 bg-white/60">
          <IconComponent size={16} className={cfg.color} />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-0.5">
            <span className="text-xs font-semibold text-gray-500">{alertTypeLabel[alert.type]}</span>
            {!alert.read && <span className="w-2 h-2 bg-accent rounded-full flex-shrink-0" />}
          </div>
          <p className="text-sm text-gray-800 font-medium leading-snug">{alert.text}</p>
          <p className="text-xs text-gray-400 mt-1">
            {alert.contactName} · {alert.date}
          </p>
        </div>
      </div>
    </div>
  )
}

