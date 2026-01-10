import React from 'react'
import { Link, useLocation } from 'react-router-dom'
import { LayoutDashboard, Database, Package } from 'lucide-react'

import logoImg from '../assets/logo.png'

const Sidebar: React.FC = () => {
  const location = useLocation()

  const getLinkClass = (path: string) => {
    const baseClass = 'flex items-center gap-3 p-3 rounded transition'
    const activeClass = 'bg-blue-600 text-white hover:bg-blue-700'
    const inactiveClass = 'hover:bg-slate-800 text-slate-300'

    return `${baseClass} ${location.pathname === path ? activeClass : inactiveClass}`
  }

  return (
    <aside className="w-64 bg-slate-900 text-white flex flex-col h-screen sticky top-0">
      <div className="p-6 flex items-center gap-3 border-b border-slate-700">
        <img
          src={logoImg}
          alt="Logo SmartMart"
          className="w-8 h-8 object-contain"
        />

        <span className="text-xl font-bold">SmartMart</span>
      </div>

      <nav className="flex-1 p-4 space-y-2">
        <Link to="/" className={getLinkClass('/')}>
          <LayoutDashboard size={20} />
          <span>Dashboard</span>
        </Link>

        <Link to="/products" className={getLinkClass('/products')}>
          <Package size={20} />
          <span>Produtos</span>
        </Link>

        <Link to="/import" className={getLinkClass('/import')}>
          <Database size={20} />
          <span>Importação de Dados</span>
        </Link>
      </nav>

      <div className="p-4 text-xs text-slate-500 text-center">
        v1.0.0 - Fullstack Challenge
      </div>
    </aside>
  )
}

export default Sidebar
