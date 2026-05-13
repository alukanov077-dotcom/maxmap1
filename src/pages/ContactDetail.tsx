import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import {
  ArrowLeft,
  Phone,
  Mail,
  BookOpen,
  Calendar,
  Plus,
  Trash2,
  ExternalLink,
  Users,
} from 'lucide-react'
import { useStore } from '../store/useStore'
import { TemperatureBadge, RoleBadge } from '../components/Badge'
import { telegram } from '../lib/telegram'

const tempColors: Record<string, string> = {
  cold: 'from-blue-50',
  warm: 'from-amber-50',
  hot: 'from-red-50',
  ambassador: 'from-purple-50',
}

export default function ContactDetailPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()

  const getContactById = useStore((s) => s.getContactById)
  const contacts = useStore((s) => s.contacts)
  const addVisit = useStore((s) => s.addVisit)
  const deleteContact = useStore((s) => s.deleteContact)

  const contact = getContactById(id!)
  const [tab, setTab] = useState<'info' | 'visits' | 'network'>('info')
  const [showAddVisit, setShowAddVisit] = useState(false)
  const [visitNote, setVisitNote] = useState('')
  const [visitOutcome, setVisitOutcome] = useState<'positive' | 'neutral' | 'negative'>('positive')

  useEffect(() => {
    telegram.setBackButton(() => navigate(-1))
    return () => telegram.hideBackButton()
  }, [navigate])

  if (!contact) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-gray-500">Контакт не найден</p>
      </div>
    )
  }

  const budgetPct = Math.round((contact.budgetSpent / contact.budgetLimit) * 100)
  const connectedContacts = contacts.filter((c) => contact.connectedTo.includes(c.id))

  const handleAddVisit = () => {
    if (!visitNote.trim()) return
    addVisit(contact.id, {
      id: Date.now().toString(),
      date: new Date().toISOString().split('T')[0],
      notes: visitNote,
      materials: [],
      outcome: visitOutcome,
    })
    setVisitNote('')
    setShowAddVisit(false)
    telegram.haptic('success')
  }

  const handleDelete = () => {
    if (window.confirm('Удалить контакт?')) {
      deleteContact(contact.id)
      navigate('/contacts')
    }
  }

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <div className={`bg-gradient-to-b ${tempColors[contact.temperature] || 'from-gray-50'} to-white p-4`}>
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-1.5 text-gray-500 text-sm mb-4"
        >
          <ArrowLeft size={16} /> Назад
        </button>

        <div className="flex items-start gap-4">
          <div
            className={`w-16 h-16 rounded-2xl flex items-center justify-center text-white font-bold text-xl ${
              contact.temperature === 'ambassador'
                ? 'bg-purple-500'
                : contact.temperature === 'hot'
                  ? 'bg-red-500'
                  : contact.temperature === 'warm'
                    ? 'bg-amber-500'
                    : 'bg-blue-400'
            }`}
          >
            {contact.avatar}
          </div>

          <div className="flex-1">
            <h1 className="font-bold text-gray-900 text-xl leading-tight">{contact.name}</h1>
            <p className="text-gray-600 text-sm mt-0.5">{contact.specialty}</p>
            <p className="text-gray-500 text-xs">{contact.organization}</p>
            <div className="flex gap-2 mt-2 flex-wrap">
              <RoleBadge role={contact.role} />
              <TemperatureBadge temp={contact.temperature} />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-3 mt-5">
          <div className="bg-white rounded-xl p-3 text-center shadow-sm">
            <p className="text-xl font-bold text-gray-900">{contact.publications || 0}</p>
            <p className="text-[10px] text-gray-400 mt-0.5">Публикаций</p>
          </div>
          <div className="bg-white rounded-xl p-3 text-center shadow-sm">
            <p className="text-xl font-bold text-gray-900">{contact.visits.length}</p>
            <p className="text-[10px] text-gray-400 mt-0.5">Визитов</p>
          </div>
          <div className="bg-white rounded-xl p-3 text-center shadow-sm">
            <p className={`text-xl font-bold ${budgetPct >= 80 ? 'text-accent' : 'text-success'}`}>
              {budgetPct}%
            </p>
            <p className="text-[10px] text-gray-400 mt-0.5">Бюджет</p>
          </div>
        </div>
      </div>

      {contact.alerts.length > 0 && (
        <div className="mx-4 mt-3 space-y-2">
          {contact.alerts.map((alert, i) => (
            <div
              key={i}
              className="bg-orange-50 border border-orange-200 rounded-xl p-3 flex items-start gap-3"
            >
              <span className="text-lg">⚠</span>
              <p className="text-xs text-orange-800 font-medium">{alert}</p>
            </div>
          ))}
        </div>
      )}

      <div className="flex gap-1 mx-4 mt-4 bg-gray-100 p-1 rounded-xl">
        {[
          { key: 'info', label: 'Профиль' },
          { key: 'visits', label: 'Визиты' },
          { key: 'network', label: 'Связи' },
        ].map((t) => (
          <button
            key={t.key}
            onClick={() => setTab(t.key as any)}
            className={`flex-1 py-2 rounded-lg text-sm font-medium transition-all ${
              tab === t.key ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500'
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      <div className="flex-1 px-4 py-4 pb-28 space-y-4">
        {tab === 'info' && (
          <>
            <div className="bg-white rounded-2xl p-4 space-y-3">
              <h3 className="font-semibold text-gray-900 text-sm">Контакты</h3>
              {contact.phone && (
                <a href={`tel:${contact.phone}`} className="flex items-center gap-3 text-sm text-gray-700">
                  <Phone size={15} className="text-brand-500" /> {contact.phone}
                </a>
              )}
              {contact.email && (
                <a href={`mailto:${contact.email}`} className="flex items-center gap-3 text-sm text-gray-700">
                  <Mail size={15} className="text-brand-500" /> {contact.email}
                </a>
              )}
              <div className="flex items-center gap-3 text-sm text-gray-700">
                <ExternalLink size={15} className="text-brand-500" />
                <span>{contact.city}</span>
              </div>
            </div>

            {contact.tags.length > 0 && (
              <div className="bg-white rounded-2xl p-4">
                <h3 className="font-semibold text-gray-900 text-sm mb-3">Теги</h3>
                <div className="flex flex-wrap gap-2">
                  {contact.tags.map((tag) => (
                    <span key={tag} className="bg-gray-100 text-gray-600 px-3 py-1 rounded-full text-xs">
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {contact.conferences && contact.conferences.length > 0 && (
              <div className="bg-white rounded-2xl p-4">
                <h3 className="font-semibold text-gray-900 text-sm mb-3 flex items-center gap-2">
                  <BookOpen size={14} className="text-brand-500" /> Конференции
                </h3>
                <div className="space-y-1">
                  {contact.conferences.map((conf) => (
                    <p key={conf} className="text-sm text-gray-600">
                      • {conf}
                    </p>
                  ))}
                </div>
              </div>
            )}

            <div className="bg-white rounded-2xl p-4">
              <h3 className="font-semibold text-gray-900 text-sm mb-3">Compliance / Бюджет</h3>
              <div className="flex justify-between text-sm text-gray-600 mb-2">
                <span>Потрачено: ${contact.budgetSpent.toLocaleString()}</span>
                <span>Лимит: ${contact.budgetLimit.toLocaleString()}</span>
              </div>
              <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full ${budgetPct >= 80 ? 'bg-accent' : 'bg-success'}`}
                  style={{ width: `${Math.min(budgetPct, 100)}%` }}
                />
              </div>
              {budgetPct >= 80 && (
                <p className="text-xs text-accent mt-1.5 font-medium">
                  ⚠ Использовано {budgetPct}% лимита. Согласуйте новые активности.
                </p>
              )}
            </div>

            <button
              onClick={handleDelete}
              className="w-full flex items-center justify-center gap-2 py-3 text-red-500 text-sm font-semibold bg-white rounded-2xl border border-red-100"
            >
              <Trash2 size={14} /> Удалить контакт
            </button>
          </>
        )}

        {tab === 'visits' && (
          <>
            <button
              onClick={() => setShowAddVisit(!showAddVisit)}
              className="w-full flex items-center justify-center gap-2 py-3 bg-brand-500 text-white rounded-2xl font-semibold"
            >
              <Plus size={16} /> Добавить визит
            </button>

            {showAddVisit && (
              <div className="bg-white rounded-2xl p-4 space-y-3 border border-brand-100">
                <h3 className="font-semibold text-sm text-gray-900">
                  Новый визит · {new Date().toLocaleDateString('ru-RU')}
                </h3>
                <textarea
                  value={visitNote}
                  onChange={(e) => setVisitNote(e.target.value)}
                  placeholder="Заметки о встрече..."
                  className="w-full p-3 bg-gray-50 rounded-xl text-sm resize-none outline-none"
                  rows={3}
                />
                <div className="flex gap-2">
                  {(['positive', 'neutral', 'negative'] as const).map((o) => (
                    <button
                      key={o}
                      onClick={() => setVisitOutcome(o)}
                      className={`flex-1 py-2 rounded-xl text-xs font-medium transition-colors ${
                        visitOutcome === o
                          ? o === 'positive'
                            ? 'bg-success text-white'
                            : o === 'negative'
                              ? 'bg-red-500 text-white'
                              : 'bg-gray-500 text-white'
                          : 'bg-gray-100 text-gray-600'
                      }`}
                    >
                      {o === 'positive' ? 'Позитивный' : o === 'negative' ? 'Негативный' : 'Нейтральный'}
                    </button>
                  ))}
                </div>
                <button
                  onClick={handleAddVisit}
                  className="w-full py-2.5 bg-brand-500 text-white rounded-xl text-sm font-medium"
                >
                  Сохранить визит
                </button>
              </div>
            )}

            {contact.visits.length === 0 ? (
              <div className="text-center py-8 text-gray-400 text-sm">Визитов пока нет. Добавьте первый!</div>
            ) : (
              <div className="space-y-3">
                {contact.visits.map((visit) => (
                  <div key={visit.id} className="bg-white rounded-2xl p-4">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-xs text-gray-400 flex items-center gap-1">
                        <Calendar size={11} /> {visit.date}
                      </span>
                      <span
                        className={`text-xs font-medium ${
                          visit.outcome === 'positive'
                            ? 'text-success'
                            : visit.outcome === 'negative'
                              ? 'text-red-500'
                              : 'text-gray-500'
                        }`}
                      >
                        {visit.outcome === 'positive' ? 'Позитивный' : visit.outcome === 'negative' ? 'Негативный' : 'Нейтральный'}
                      </span>
                    </div>
                    <p className="text-sm text-gray-700">{visit.notes}</p>
                    {visit.materials.length > 0 && (
                      <div className="flex gap-2 mt-2 flex-wrap">
                        {visit.materials.map((m) => (
                          <span key={m} className="bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full text-xs">
                            {m}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </>
        )}

        {tab === 'network' && (
          <div className="bg-white rounded-2xl p-4">
            <h3 className="font-semibold text-sm text-gray-900 mb-3 flex items-center gap-2">
              <Users size={14} className="text-brand-500" /> Связи ({connectedContacts.length})
            </h3>

            {connectedContacts.length === 0 ? (
              <p className="text-sm text-gray-400">Связей с другими контактами нет</p>
            ) : (
              <div className="space-y-3">
                {connectedContacts.map((cc) => (
                  <div
                    key={cc.id}
                    className="flex items-center gap-3 cursor-pointer active:opacity-70"
                    onClick={() => navigate(`/contact/${cc.id}`)}
                  >
                    <div
                      className={`w-10 h-10 rounded-xl flex items-center justify-center text-white font-bold text-sm ${
                        cc.temperature === 'ambassador'
                          ? 'bg-purple-500'
                          : cc.temperature === 'hot'
                            ? 'bg-red-500'
                            : cc.temperature === 'warm'
                              ? 'bg-amber-500'
                              : 'bg-blue-400'
                      }`}
                    >
                      {cc.avatar}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900">{cc.name}</p>
                      <p className="text-xs text-gray-400 truncate">
                        {cc.specialty} · {cc.organization}
                      </p>
                    </div>
                    <RoleBadge role={cc.role} />
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

