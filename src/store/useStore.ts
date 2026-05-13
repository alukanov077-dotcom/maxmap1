import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { Contact, Alert } from '../types'
import { mockContacts, mockAlerts } from '../data/mockData'

interface StoreState {
  contacts: Contact[]
  alerts: Alert[]
  searchQuery: string

  // Actions — contacts
  addContact: (contact: Contact) => void
  updateContact: (id: string, updates: Partial<Contact>) => void
  deleteContact: (id: string) => void

  // Actions — visits
  addVisit: (contactId: string, visit: Contact['visits'][0]) => void

  // Actions — alerts
  markAlertRead: (id: string) => void
  markAllAlertsRead: () => void

  // Actions — search
  setSearchQuery: (q: string) => void

  // Derived
  getUnreadAlertCount: () => number
  getContactById: (id: string) => Contact | undefined
}

export const useStore = create<StoreState>()(
  persist(
    (set, get) => ({
      contacts: mockContacts,
      alerts: mockAlerts,
      searchQuery: '',

      addContact: (contact) => set((s) => ({ contacts: [...s.contacts, contact] })),

      updateContact: (id, updates) =>
        set((s) => ({
          contacts: s.contacts.map((c) => (c.id === id ? { ...c, ...updates } : c)),
        })),

      deleteContact: (id) =>
        set((s) => ({
          contacts: s.contacts.filter((c) => c.id !== id),
        })),

      addVisit: (contactId, visit) =>
        set((s) => ({
          contacts: s.contacts.map((c) =>
            c.id === contactId
              ? {
                  ...c,
                  visits: [visit, ...c.visits],
                  lastVisit: visit.date,
                }
              : c
          ),
        })),

      markAlertRead: (id) =>
        set((s) => ({
          alerts: s.alerts.map((a) => (a.id === id ? { ...a, read: true } : a)),
        })),

      markAllAlertsRead: () =>
        set((s) => ({
          alerts: s.alerts.map((a) => ({ ...a, read: true })),
        })),

      setSearchQuery: (q) => set({ searchQuery: q }),

      getUnreadAlertCount: () => get().alerts.filter((a) => !a.read).length,
      getContactById: (id) => get().contacts.find((c) => c.id === id),
    }),
    {
      name: 'nexmap-storage',
    }
  )
)

