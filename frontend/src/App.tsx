import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'

import Sidebar from './components/Sidebar'
import Dashboard from './components/Dashboard'
import Uploads from './components/Uploads'
import Products from './pages/Products'

const App: React.FC = () => {
  return (
    <Router future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      <div className="flex min-h-screen bg-gray-50">
        <Sidebar />

        <main className="flex-1 overflow-auto h-screen">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/uploads" element={<Uploads />} />
            <Route path="/products" element={<Products />} />{' '}
          </Routes>
        </main>
      </div>
    </Router>
  )
}

export default App
