import React from 'react'
import { Link, useLocation } from 'react-router-dom'
import { LayoutDashboard, Database, Package, X } from 'lucide-react'
import logoImg from '../assets/logo.png'

interface SidebarProps {
  isOpen: boolean
  onClose: () => void
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
  const location = useLocation()

  const getLinkClass = (path: string) => {
    const baseClass = 'flex items-center gap-3 p-3 rounded transition'
    const activeClass = 'bg-blue-600 text-white hover:bg-blue-700'
    const inactiveClass = 'hover:bg-slate-800 text-slate-300'
    return `${baseClass} ${location.pathname === path ? activeClass : inactiveClass}`
  }

  return (
    <>
      <div
        className={`fixed inset-0 z-20 bg-black/50 transition-opacity lg:hidden ${
          isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        onClick={onClose}
      />

      <aside
        className={`
          fixed lg:sticky top-0 left-0 z-30 h-screen w-64 bg-slate-900 text-white flex flex-col transition-transform duration-300 ease-in-out
          ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        `}
      >
        <div className="p-6 flex items-center justify-between border-b border-slate-700">
          <div className="flex items-center gap-3">
            <img src={logoImg} alt="Logo" className="w-8 h-8 object-contain" />
            <span className="text-xl font-bold">SmartMart Solutions</span>
          </div>

          <button
            onClick={onClose}
            className="lg:hidden text-slate-400 hover:text-white"
          >
            <X size={24} />
          </button>
        </div>

        <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
          <Link to="/" className={getLinkClass('/')} onClick={onClose}>
            <LayoutDashboard size={20} />
            <span>Dashboard</span>
          </Link>

          <Link
            to="/products"
            className={getLinkClass('/products')}
            onClick={onClose}
          >
            <Package size={20} />
            <span>Produtos</span>
          </Link>

          <Link
            to="/import"
            className={getLinkClass('/import')}
            onClick={onClose}
          >
            <Database size={20} />
            <span>Importação de Dados</span>
          </Link>
        </nav>

        <div className="p-4 text-xs text-slate-500 text-center border-t border-slate-800">
          v1.0.0 - Fullstack Challenge
        </div>
      </aside>
    </>
  )
}

export default Sidebar
