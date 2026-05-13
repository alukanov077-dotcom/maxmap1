import React from 'react'
import { useNavigate } from 'react-router-dom'
import { ChevronRight, AlertCircle } from 'lucide-react'
import type { Contact } from '../types'
import { TemperatureBadge, RoleBadge } from './Badge'

export function ContactCard({ contact }: { contact: Contact }) {
  const navigate = useNavigate()
  const budgetPct = Math.round((contact.budgetSpent / contact.budgetLimit) * 100)
  const isOverBudget = budgetPct >= 80

  return (
    <div
      className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 active:scale-[0.98] transition-transform cursor-pointer"
      onClick={() => navigate(`/contact/${contact.id}`)}
    >
      <div className="flex items-start gap-3">
        <div
          className={`w-11 h-11 rounded-xl flex items-center justify-center text-white font-bold text-sm ${
            contact.temperature === 'ambassador'
              ? 'bg-purple-500'
              : contact.temperature === 'hot'
                ? 'bg-red-500'
                : contact.temperature === 'warm'
                  ? 'bg-amber-500'
                  : 'bg-blue-400'
          }`}
        >
          {contact.avatar || contact.name.slice(0, 2)}
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className="font-semibold text-gray-900 text-sm truncate">{contact.name}</span>
            {contact.alerts.length > 0 && <AlertCircle size={14} className="text-accent flex-shrink-0" />}
          </div>
          <p className="text-xs text-gray-500 truncate">
            {contact.specialty} · {contact.organization}
          </p>
          <p className="text-xs text-gray-400 mt-0.5">{contact.city}</p>
          <div className="flex items-center gap-2 mt-2 flex-wrap">
            <RoleBadge role={contact.role} />
            <TemperatureBadge temp={contact.temperature} />
          </div>
        </div>

        <ChevronRight size={16} className="text-gray-300 flex-shrink-0 mt-1" />
      </div>

      <div className="mt-3">
        <div className="flex justify-between items-center mb-1">
          <span className="text-[10px] text-gray-400">Бюджет {budgetPct}%</span>
          {isOverBudget && <span className="text-[10px] text-accent font-medium">⚠ Лимит приближается</span>}
        </div>
        <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
          <div
            className={`h-full rounded-full transition-all ${isOverBudget ? 'bg-accent' : 'bg-success'}`}
            style={{ width: `${Math.min(budgetPct, 100)}%` }}
          />
        </div>
      </div>
    </div>
  )
}

