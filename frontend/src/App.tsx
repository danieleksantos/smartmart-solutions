import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'

// Componentes e Páginas
import Sidebar from './components/Sidebar'
import Dashboard from './components/Dashboard'
import Products from './pages/Products'
import ImportData from './pages/ImportData'

const App: React.FC = () => {
  return (
    <Router future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      <div className="flex min-h-screen bg-gray-50">
        <Sidebar />
        <main className="flex-1 overflow-auto h-screen">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/products" element={<Products />} />
            <Route path="/import" element={<ImportData />} />
          </Routes>
        </main>
      </div>
    </Router>
  )
}

export default App
