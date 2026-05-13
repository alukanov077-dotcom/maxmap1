export type ContactTemperature = 'cold' | 'warm' | 'hot' | 'ambassador'
export type ContactRole = 'HCP' | 'KOL' | 'DOL' | 'Pharmacist' | 'Admin'

export interface Visit {
  id: string
  date: string // ISO string
  notes: string
  materials: string[]
  outcome: 'positive' | 'neutral' | 'negative'
}

export interface Contact {
  id: string
  name: string
  role: ContactRole
  specialty: string
  organization: string
  city: string
  temperature: ContactTemperature
  phone?: string
  email?: string
  publications?: number
  conferences?: string[]
  tags: string[]
  connectedTo: string[] // массив id других контактов
  visits: Visit[]
  budgetSpent: number // потрачено на этого врача в году, USD
  budgetLimit: number // лимит по compliance
  alerts: string[] // список активных алертов
  createdAt: string
  lastVisit?: string
  avatar?: string // инициалы или emoji
}

export interface Alert {
  id: string
  contactId: string
  contactName: string
  type: 'publication' | 'conference' | 'budget' | 'competitor' | 'new_clinic'
  text: string
  date: string
  read: boolean
}

export interface GraphNode {
  id: string
  name: string
  role: ContactRole
  temperature: ContactTemperature
  val: number // размер узла = влияние (число связей)
}

export interface GraphLink {
  source: string
  target: string
  strength: number
}

