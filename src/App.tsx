import React, { useEffect } from 'react'
import { HashRouter, Routes, Route } from 'react-router-dom'
import { telegram } from './lib/telegram'
import { BottomNav } from './components/BottomNav'
import MapPage from './pages/Map'
import ContactsPage from './pages/Contacts'
import ContactDetailPage from './pages/ContactDetail'
import AddContactPage from './pages/AddContact'
import AlertsPage from './pages/Alerts'

export default function App() {
  useEffect(() => {
    telegram.ready()
    telegram.expand()
  }, [])

  return (
    <HashRouter>
      <div className="max-w-md mx-auto relative min-h-screen">
        <Routes>
          <Route path="/" element={<MapPage />} />
          <Route path="/contacts" element={<ContactsPage />} />
          <Route path="/contact/:id" element={<ContactDetailPage />} />
          <Route path="/add" element={<AddContactPage />} />
          <Route path="/alerts" element={<AlertsPage />} />
        </Routes>
        <BottomNav />
      </div>
    </HashRouter>
  )
}

