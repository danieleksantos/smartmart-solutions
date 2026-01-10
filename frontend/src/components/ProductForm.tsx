import React, { useState, useEffect, type FormEvent } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'
import type { Category } from '../types'

interface ProductFormProps {
  onSuccess?: () => void
}

const ProductForm: React.FC<ProductFormProps> = ({ onSuccess }) => {
  const [categories, setCategories] = useState<Category[]>([])
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    category_id: '',
  })
  const [message, setMessage] = useState<{
    type: 'success' | 'error'
    text: string
  } | null>(null)

  useEffect(() => {
    fetch('http://127.0.0.1:8000/categories/')
      .then((res) => res.json())
      .then((data: Category[]) => setCategories(data))
      .catch((err) => console.error('Erro ao carregar categorias:', err))
  }, [])

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    try {
      const payload = {
        name: formData.name,
        price: parseFloat(formData.price),
        category_id: parseInt(formData.category_id),
      }

      const response = await fetch('http://127.0.0.1:8000/products/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })

      if (response.ok) {
        setMessage({ type: 'success', text: 'Produto criado com sucesso!' })
        setFormData({ name: '', price: '', category_id: '' })

        if (onSuccess) {
          onSuccess()
        }

        setTimeout(() => setMessage(null), 3000)
      } else {
        setMessage({ type: 'error', text: 'Erro ao criar produto.' })
      }
    } catch (error) {
      console.error(error)
      setMessage({ type: 'error', text: 'Erro de conexão.' })
    }
  }

  return (
    <div className="space-y-6">
      {' '}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Nome
            </label>
            <input
              type="text"
              required
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 border focus:ring-blue-500 focus:border-blue-500"
              placeholder="Ex: Smart TV 50 polegadas"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Preço (R$)
              </label>
              <input
                type="number"
                step="0.01"
                required
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 border focus:ring-blue-500 focus:border-blue-500"
                placeholder="0.00"
                value={formData.price}
                onChange={(e) =>
                  setFormData({ ...formData, price: e.target.value })
                }
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Categoria
              </label>
              <select
                required
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 border bg-white focus:ring-blue-500 focus:border-blue-500"
                value={formData.category_id}
                onChange={(e) =>
                  setFormData({ ...formData, category_id: e.target.value })
                }
              >
                <option value="">Selecione...</option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition font-medium"
        >
          Salvar Produto
        </button>

        {message && (
          <div
            className={`p-3 rounded text-sm flex items-center justify-center ${
              message.type === 'success'
                ? 'bg-green-50 text-green-700 border border-green-200'
                : 'bg-red-50 text-red-700 border border-red-200'
            }`}
          >
            {message.text}
          </div>
        )}
      </form>
      <div className="border-t border-gray-100 pt-4 flex justify-center">
        <Link
          to="/products"
          className="text-sm text-gray-500 hover:text-blue-600 flex items-center gap-1 transition-colors"
        >
          Ver lista de produtos cadastrados
          <ArrowRight size={14} />
        </Link>
      </div>
    </div>
  )
}

export default ProductForm
