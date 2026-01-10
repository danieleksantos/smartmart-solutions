import React, { useState } from 'react'
import { Package, Tag, CheckCircle } from 'lucide-react'
import ProductForm from './ProductForm'

const ManualEntrySection: React.FC = () => {
  const [activeType, setActiveType] = useState<'product' | 'category'>(
    'product',
  )
  const [catName, setCatName] = useState('')
  const [message, setMessage] = useState<{
    type: 'success' | 'error'
    text: string
  } | null>(null)

  const handleCreateCategory = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const res = await fetch('import.meta.env.VITE_API_URL/categories/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: catName }),
      })
      if (res.ok) {
        setMessage({
          type: 'success',
          text: `Categoria "${catName}" criada com sucesso!`,
        })
        setCatName('')
      } else {
        setMessage({
          type: 'error',
          text: 'Categoria já cadastrada.',
        })
      }
    } catch (error) {
      console.error('Erro de conexão:', error)
      setMessage({ type: 'error', text: 'Erro de conexão.' })
    }
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
      <div className="bg-gray-50 border-b border-gray-200 p-4 flex gap-4">
        <button
          onClick={() => {
            setActiveType('product')
            setMessage(null)
          }}
          className={`flex items-center gap-2 px-4 py-2 rounded-md transition text-sm font-medium ${
            activeType === 'product'
              ? 'bg-white text-blue-600 shadow-sm ring-1 ring-gray-200'
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          <Package size={18} />
          Novo Produto
        </button>

        <button
          onClick={() => {
            setActiveType('category')
            setMessage(null)
          }}
          className={`flex items-center gap-2 px-4 py-2 rounded-md transition text-sm font-medium ${
            activeType === 'category'
              ? 'bg-white text-blue-600 shadow-sm ring-1 ring-gray-200'
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          <Tag size={18} />
          Nova Categoria
        </button>
      </div>

      <div className="p-6">
        {activeType === 'product' && (
          <div className="max-w-2xl">
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-gray-800">
                Cadastro de Produto
              </h3>
              <p className="text-sm text-gray-500">
                Preencha os dados abaixo para adicionar um item individual ao
                inventário.
              </p>
            </div>
            <ProductForm onSuccess={() => {}} />
          </div>
        )}

        {activeType === 'category' && (
          <div className="max-w-md">
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-gray-800">
                Cadastro de Categoria
              </h3>
              <p className="text-sm text-gray-500">
                Crie novas seções para organizar seus produtos.
              </p>
            </div>

            <form onSubmit={handleCreateCategory} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Nome da Categoria
                </label>
                <input
                  type="text"
                  required
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 border focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Ex: Bebidas, Limpeza..."
                  value={catName}
                  onChange={(e) => setCatName(e.target.value)}
                />
              </div>
              <button
                type="submit"
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition w-full"
              >
                Salvar Categoria
              </button>

              {message && (
                <div
                  className={`p-3 rounded text-sm flex items-center gap-2 ${message.type === 'success' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}
                >
                  <CheckCircle size={16} />
                  {message.text}
                </div>
              )}
            </form>
          </div>
        )}
      </div>
    </div>
  )
}

export default ManualEntrySection
