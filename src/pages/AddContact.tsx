import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft, UserPlus } from 'lucide-react'
import { useStore } from '../store/useStore'
import { telegram } from '../lib/telegram'
import type { ContactRole, ContactTemperature } from '../types'

export default function AddContactPage() {
  const navigate = useNavigate()
  const addContact = useStore((s) => s.addContact)
  const contacts = useStore((s) => s.contacts)

  const [form, setForm] = useState({
    name: '',
    role: 'HCP' as ContactRole,
    specialty: '',
    organization: '',
    city: '',
    phone: '',
    email: '',
    temperature: 'cold' as ContactTemperature,
    tags: '',
    budgetLimit: '3000',
    connectedTo: [] as string[],
  })

  const set = (key: string, val: string) => setForm((f) => ({ ...f, [key]: val }))

  const handleSubmit = () => {
    if (!form.name || !form.specialty || !form.organization) {
      alert('Заполните обязательные поля')
      return
    }

    const initials = form.name
      .split(' ')
      .filter(Boolean)
      .map((w) => w[0])
      .join('')
      .slice(0, 2)
      .toUpperCase()

    addContact({
      id: Date.now().toString(),
      name: form.name,
      role: form.role,
      specialty: form.specialty,
      organization: form.organization,
      city: form.city,
      phone: form.phone || undefined,
      email: form.email || undefined,
      temperature: form.temperature,
      tags: form.tags ? form.tags.split(',').map((t) => t.trim()).filter(Boolean) : [],
      connectedTo: form.connectedTo,
      visits: [],
      publications: 0,
      conferences: [],
      budgetSpent: 0,
      budgetLimit: parseInt(form.budgetLimit) || 3000,
      alerts: [],
      createdAt: new Date().toISOString().split('T')[0],
      avatar: initials,
    })

    telegram.haptic('success')
    navigate('/contacts')
  }

  const roles: ContactRole[] = ['HCP', 'KOL', 'DOL', 'Pharmacist', 'Admin']
  const temps: { key: ContactTemperature; label: string; emoji: string }[] = [
    { key: 'cold', label: 'Холодный', emoji: '❄️' },
    { key: 'warm', label: 'Тёплый', emoji: '🌤️' },
    { key: 'hot', label: 'Горячий', emoji: '🔥' },
    { key: 'ambassador', label: 'Амбассадор', emoji: '👑' },
  ]

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <div className="bg-white px-4 pt-4 pb-4 shadow-sm">
        <button onClick={() => navigate(-1)} className="flex items-center gap-1.5 text-gray-500 text-sm mb-3">
          <ArrowLeft size={16} /> Назад
        </button>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-brand-500 rounded-xl flex items-center justify-center">
            <UserPlus size={18} className="text-white" />
          </div>
          <div>
            <h1 className="font-bold text-gray-900">Новый контакт</h1>
            <p className="text-xs text-gray-400">Заполните данные врача или KOL</p>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-4 py-4 pb-28 space-y-4">
        <div className="bg-white rounded-2xl p-4 space-y-3">
          <h3 className="font-semibold text-sm text-gray-900">Основное *</h3>
          <input
            placeholder="ФИО"
            value={form.name}
            onChange={(e) => set('name', e.target.value)}
            className="w-full px-3 py-2.5 bg-gray-50 rounded-xl text-sm outline-none border border-gray-200"
          />
          <input
            placeholder="Специализация (обязательно)"
            value={form.specialty}
            onChange={(e) => set('specialty', e.target.value)}
            className="w-full px-3 py-2.5 bg-gray-50 rounded-xl text-sm outline-none border border-gray-200"
          />
          <input
            placeholder="Организация / больница (обязательно)"
            value={form.organization}
            onChange={(e) => set('organization', e.target.value)}
            className="w-full px-3 py-2.5 bg-gray-50 rounded-xl text-sm outline-none border border-gray-200"
          />
          <input
            placeholder="Город"
            value={form.city}
            onChange={(e) => set('city', e.target.value)}
            className="w-full px-3 py-2.5 bg-gray-50 rounded-xl text-sm outline-none border border-gray-200"
          />
        </div>

        <div className="bg-white rounded-2xl p-4">
          <h3 className="font-semibold text-sm text-gray-900 mb-3">Роль</h3>
          <div className="flex gap-2 flex-wrap">
            {roles.map((r) => (
              <button
                key={r}
                onClick={() => set('role', r)}
                className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
                  form.role === r ? 'bg-brand-500 text-white' : 'bg-gray-100 text-gray-600'
                }`}
              >
                {r}
              </button>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-2xl p-4">
          <h3 className="font-semibold text-sm text-gray-900 mb-3">Температура отношений</h3>
          <div className="grid grid-cols-2 gap-2">
            {temps.map((t) => (
              <button
                key={t.key}
                onClick={() => set('temperature', t.key)}
                className={`flex items-center gap-2 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                  form.temperature === t.key ? 'bg-brand-500 text-white' : 'bg-gray-100 text-gray-600'
                }`}
              >
                <span>{t.emoji}</span> {t.label}
              </button>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-2xl p-4 space-y-3">
          <h3 className="font-semibold text-sm text-gray-900">Контакты</h3>
          <input
            placeholder="Телефон"
            value={form.phone}
            onChange={(e) => set('phone', e.target.value)}
            type="tel"
            className="w-full px-3 py-2.5 bg-gray-50 rounded-xl text-sm outline-none border border-gray-200"
          />
          <input
            placeholder="Email"
            value={form.email}
            onChange={(e) => set('email', e.target.value)}
            type="email"
            className="w-full px-3 py-2.5 bg-gray-50 rounded-xl text-sm outline-none border border-gray-200"
          />
        </div>

        <div className="bg-white rounded-2xl p-4">
          <h3 className="font-semibold text-sm text-gray-900 mb-1">Теги</h3>
          <p className="text-xs text-gray-400 mb-2">Через запятую: диабет, KOL, спикер</p>
          <input
            placeholder="диабет, спикер, КИ"
            value={form.tags}
            onChange={(e) => set('tags', e.target.value)}
            className="w-full px-3 py-2.5 bg-gray-50 rounded-xl text-sm outline-none border border-gray-200"
          />
        </div>

        <div className="bg-white rounded-2xl p-4">
          <h3 className="font-semibold text-sm text-gray-900 mb-2">Compliance лимит, $</h3>
          <input
            placeholder="3000"
            value={form.budgetLimit}
            onChange={(e) => set('budgetLimit', e.target.value)}
            type="number"
            className="w-full px-3 py-2.5 bg-gray-50 rounded-xl text-sm outline-none border border-gray-200"
          />
        </div>

        <div className="bg-white rounded-2xl p-4">
          <h3 className="font-semibold text-sm text-gray-900 mb-3">Связан с контактами</h3>
          <div className="space-y-2">
            {contacts.map((c) => (
              <div
                key={c.id}
                className="flex items-center gap-3 cursor-pointer"
                onClick={() => {
                  setForm((f) => ({
                    ...f,
                    connectedTo: f.connectedTo.includes(c.id)
                      ? f.connectedTo.filter((x) => x !== c.id)
                      : [...f.connectedTo, c.id],
                  }))
                }}
              >
                <div
                  className={`w-5 h-5 rounded-md border-2 flex items-center justify-center ${
                    form.connectedTo.includes(c.id) ? 'bg-brand-500 border-brand-500' : 'border-gray-300'
                  }`}
                >
                  {form.connectedTo.includes(c.id) && <span className="text-white text-xs">✓</span>}
                </div>
                <span className="text-sm text-gray-700">{c.name}</span>
                <span className="text-xs text-gray-400">· {c.specialty}</span>
              </div>
            ))}
          </div>
        </div>

        <button
          onClick={handleSubmit}
          className="w-full py-4 bg-brand-500 text-white rounded-2xl font-semibold text-base active:opacity-90"
        >
          Создать контакт
        </button>
      </div>
    </div>
  )
}

