import React from 'react'
import type { ContactTemperature } from '../types'

const tempConfig: Record<ContactTemperature, { label: string; className: string }> = {
  cold: { label: 'Холодный', className: 'bg-blue-100 text-blue-700' },
  warm: { label: 'Тёплый', className: 'bg-amber-100 text-amber-700' },
  hot: { label: 'Горячий', className: 'bg-red-100 text-red-700' },
  ambassador: { label: 'Амбассадор', className: 'bg-purple-100 text-purple-700' },
}

export function TemperatureBadge({ temp }: { temp: ContactTemperature }) {
  const cfg = tempConfig[temp]
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${cfg.className}`}>
      {cfg.label}
    </span>
  )
}

export function RoleBadge({ role }: { role: string }) {
  const colors: Record<string, string> = {
    KOL: 'bg-brand-100 text-brand-700',
    DOL: 'bg-teal-100 text-teal-700',
    HCP: 'bg-gray-100 text-gray-700',
    Pharmacist: 'bg-green-100 text-green-700',
    Admin: 'bg-orange-100 text-orange-700',
  }
  return (
    <span
      className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
        colors[role] || 'bg-gray-100 text-gray-700'
      }`}
    >
      {role}
    </span>
  )
}

