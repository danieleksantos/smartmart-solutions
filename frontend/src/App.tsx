import React, { useState } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { Menu } from 'lucide-react'

import Sidebar from './components/Sidebar'
import Dashboard from './components/Dashboard'
import Products from './pages/Products'
import ImportData from './pages/ImportData'

const App: React.FC = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)

  return (
    <Router future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      <div className="flex min-h-screen bg-gray-50">
        <Sidebar
          isOpen={isSidebarOpen}
          onClose={() => setIsSidebarOpen(false)}
        />

        <main className="flex-1 flex flex-col h-screen overflow-hidden">
          <header className="lg:hidden bg-slate-900 border-b border-slate-700 p-4 flex items-center gap-3 shadow-sm sticky top-0 z-10">
            <button
              onClick={() => setIsSidebarOpen(true)}
              className="p-2 text-slate-300 hover:text-white hover:bg-slate-800 rounded-lg transition"
            >
              <Menu size={24} />
            </button>
            <span className="font-bold text-white text-lg">
              SmartMart Solutions
            </span>
          </header>

          <div className="flex-1 overflow-auto p-4 md:p-8">
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/products" element={<Products />} />
              <Route path="/import" element={<ImportData />} />
            </Routes>
          </div>
        </main>
      </div>
    </Router>
  )
}

export default App
