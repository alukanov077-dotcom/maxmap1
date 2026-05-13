import React, { useState, useMemo } from 'react'
import { Search, SlidersHorizontal, X } from 'lucide-react'
import { useStore } from '../store/useStore'
import { ContactCard } from '../components/ContactCard'
import { EmptyState } from '../components/EmptyState'
import type { ContactRole, ContactTemperature } from '../types'

const ROLES: ContactRole[] = ['HCP', 'KOL', 'DOL', 'Pharmacist', 'Admin']
const TEMPS: { key: ContactTemperature; label: string }[] = [
  { key: 'cold', label: 'Холодный' },
  { key: 'warm', label: 'Тёплый' },
  { key: 'hot', label: 'Горячий' },
  { key: 'ambassador', label: 'Амбассадор' },
]

export default function ContactsPage() {
  const contacts = useStore((s) => s.contacts)
  const [query, setQuery] = useState('')
  const [roleFilter, setRoleFilter] = useState<ContactRole | null>(null)
  const [tempFilter, setTempFilter] = useState<ContactTemperature | null>(null)
  const [showFilters, setShowFilters] = useState(false)

  const filtered = useMemo(() => {
    return contacts.filter((c) => {
      const q = query.toLowerCase()
      const matchQuery =
        !q ||
        c.name.toLowerCase().includes(q) ||
        c.specialty.toLowerCase().includes(q) ||
        c.organization.toLowerCase().includes(q) ||
        c.city.toLowerCase().includes(q) ||
        c.tags.some((t) => t.toLowerCase().includes(q))
      const matchRole = !roleFilter || c.role === roleFilter
      const matchTemp = !tempFilter || c.temperature === tempFilter
      return matchQuery && matchRole && matchTemp
    })
  }, [contacts, query, roleFilter, tempFilter])

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      <div className="bg-white px-4 pt-4 pb-3 shadow-sm">
        <div className="flex items-center gap-2 mb-3">
          <h1 className="font-bold text-gray-900 text-lg flex-1">Контакты</h1>
          <span className="text-sm text-gray-400">
            {filtered.length} из {contacts.length}
          </span>
          <button
            onClick={() => setShowFilters((v) => !v)}
            className={`p-2 rounded-xl transition-colors ${
              showFilters ? 'bg-brand-500 text-white' : 'bg-gray-100 text-gray-600'
            }`}
          >
            <SlidersHorizontal size={16} />
          </button>
        </div>

        <div className="relative">
          <Search
            size={16}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
          />
          <input
            type="text"
            placeholder="Поиск по имени, специальности, тегам..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full pl-9 pr-9 py-2.5 bg-gray-100 rounded-xl text-sm outline-none placeholder:text-gray-400"
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
            >
              <X size={14} />
            </button>
          )}
        </div>

        {showFilters && (
          <div className="mt-3 space-y-2">
            <div>
              <p className="text-xs text-gray-500 mb-1.5 font-medium">Роль</p>
              <div className="flex gap-2 flex-wrap">
                {ROLES.map((r) => (
                  <button
                    key={r}
                    onClick={() => setRoleFilter(roleFilter === r ? null : r)}
                    className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                      roleFilter === r ? 'bg-brand-500 text-white' : 'bg-gray-100 text-gray-600'
                    }`}
                  >
                    {r}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <p className="text-xs text-gray-500 mb-1.5 font-medium">Температура</p>
              <div className="flex gap-2 flex-wrap">
                {TEMPS.map((t) => (
                  <button
                    key={t.key}
                    onClick={() => setTempFilter(tempFilter === t.key ? null : t.key)}
                    className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                      tempFilter === t.key ? 'bg-brand-500 text-white' : 'bg-gray-100 text-gray-600'
                    }`}
                  >
                    {t.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="flex-1 overflow-y-auto px-4 py-4 pb-24 space-y-3">
        {filtered.length === 0 ? (
          <EmptyState
            icon={<Search size={28} />}
            title="Ничего не найдено"
            subtitle="Попробуйте изменить фильтры или поисковый запрос"
          />
        ) : (
          filtered.map((c) => <ContactCard key={c.id} contact={c} />)
        )}
      </div>
    </div>
  )
}

