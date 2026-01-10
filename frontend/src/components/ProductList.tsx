import React, { useEffect, useState, useCallback } from 'react'
import {
  ChevronLeft,
  ChevronRight,
  Filter,
  Download,
  Edit,
  X,
  Save,
} from 'lucide-react'
import { toast } from 'react-toastify'
import type { Product, Category } from '../types'
import SearchProduct from './SearchProduct'

const PAGE_SIZE = 10

interface ProductListProps {
  searchTerm: string
  onSearchChange: (value: string) => void
  selectedCategory: string
  onCategoryChange: (value: string) => void
}

const ProductList: React.FC<ProductListProps> = ({
  searchTerm,
  onSearchChange,
  selectedCategory,
  onCategoryChange,
}) => {
  const [products, setProducts] = useState<Product[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [currentPage, setCurrentPage] = useState(1)
  const [totalCount, setTotalCount] = useState(0)

  const [editingProduct, setEditingProduct] = useState<Product | null>(null)
  const [editFormData, setEditFormData] = useState({
    name: '',
    price: '',
    category_id: '',
  })
  const [isSaving, setIsSaving] = useState(false)

  const fetchData = useCallback(async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams()
      if (searchTerm) params.append('search', searchTerm)
      if (selectedCategory) params.append('category_id', selectedCategory)

      const countRes = await fetch(
        `http://127.0.0.1:8000/products/count?${params.toString()}`,
      )
      const countData = await countRes.json()
      setTotalCount(countData.total)

      const skip = (currentPage - 1) * PAGE_SIZE
      params.append('skip', skip.toString())
      params.append('limit', PAGE_SIZE.toString())

      const response = await fetch(
        `http://127.0.0.1:8000/products/?${params.toString()}`,
      )
      const data = await response.json()
      setProducts(data)
    } catch (error) {
      console.error('Erro ao buscar dados:', error)
    } finally {
      setLoading(false)
    }
  }, [currentPage, searchTerm, selectedCategory])

  useEffect(() => {
    fetch('http://127.0.0.1:8000/categories/')
      .then((res) => res.json())
      .then((data) => setCategories(data))
      .catch((err) => console.error('Erro ao carregar categorias:', err))
  }, [])

  useEffect(() => {
    setCurrentPage(1)
  }, [searchTerm, selectedCategory])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  const handleEditClick = (product: Product) => {
    setEditingProduct(product)
    setEditFormData({
      name: product.name,
      price: product.price.toString(),
      category_id: product.category_id ? product.category_id.toString() : '',
    })
  }

  const handleUpdateProduct = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!editingProduct) return

    setIsSaving(true)
    try {
      const payload = {
        name: editFormData.name,
        price: parseFloat(editFormData.price),
        category_id: parseInt(editFormData.category_id),
      }

      const response = await fetch(
        `http://127.0.0.1:8000/products/${editingProduct.id}`,
        {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        },
      )

      if (response.ok) {
        setEditingProduct(null)
        fetchData()
        toast.success('Produto atualizado com sucesso!')
      } else {
        toast.error('Erro ao atualizar produto.')
      }
    } catch (error) {
      console.error('Erro ao salvar:', error)
      toast.error('Erro de conexão com o servidor.')
    } finally {
      setIsSaving(false)
    }
  }

  const handleExport = async () => {
    try {
      const params = new URLSearchParams()
      if (searchTerm) params.append('search', searchTerm)
      if (selectedCategory) params.append('category_id', selectedCategory)

      const response = await fetch(
        `http://127.0.0.1:8000/products/export-csv?${params.toString()}`,
      )

      if (!response.ok) throw new Error('Erro ao baixar CSV')

      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url

      let filename = 'produtos_geral.csv'
      if (selectedCategory) {
        const cat = categories.find((c) => c.id === Number(selectedCategory))
        if (cat) {
          const safeName = cat.name.trim().replace(/\s+/g, '_')
          filename = `produtos_${safeName}.csv`
        }
      }

      a.download = filename
      document.body.appendChild(a)
      a.click()
      a.remove()

      toast.success('Download iniciado!')
    } catch (error) {
      console.error('Erro no download:', error)
      toast.error('Falha ao exportar o arquivo CSV.')
    }
  }

  const totalPages = Math.ceil(totalCount / PAGE_SIZE)
  const handlePrev = () => {
    if (currentPage > 1) setCurrentPage((p) => p - 1)
  }
  const handleNext = () => {
    if (currentPage < totalPages) setCurrentPage((p) => p + 1)
  }

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value)
  }

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden flex flex-col h-full relative">
      <div className="p-6 border-b border-gray-200 flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
        <div className="flex items-center gap-4">
          <h2 className="text-xl font-bold text-gray-700">Produtos</h2>
          <span className="text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded-full whitespace-nowrap">
            {totalCount} itens encontrados
          </span>
        </div>

        <div className="w-full lg:w-auto flex flex-col md:flex-row gap-3">
          <button
            onClick={handleExport}
            className="flex items-center justify-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition shadow-sm whitespace-nowrap"
            title="Exportar dados para CSV"
          >
            <Download size={18} />
            <span className="hidden md:inline">Exportar CSV</span>
          </button>

          <div className="relative">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <Filter className="w-4 h-4 text-gray-400" />
            </div>
            <select
              value={selectedCategory}
              onChange={(e) => onCategoryChange(e.target.value)}
              className="block w-full md:w-48 p-2.5 pl-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 appearance-none cursor-pointer hover:bg-gray-50 transition"
            >
              <option value="">Todas Categorias</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>

          <div className="w-full md:w-80">
            <SearchProduct value={searchTerm} onChange={onSearchChange} />
          </div>
        </div>
      </div>

      <div className="overflow-x-auto flex-1">
        <table className="w-full text-left text-sm text-gray-600">
          <thead className="bg-gray-100 uppercase font-medium">
            <tr>
              <th className="px-6 py-3">ID</th>
              <th className="px-6 py-3">Nome</th>
              <th className="px-6 py-3">Categoria</th>
              <th className="px-6 py-3 text-right">Preço</th>
              <th className="px-6 py-3 text-center">Ações</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {loading ? (
              <tr>
                <td colSpan={5} className="px-6 py-8 text-center">
                  Carregando dados...
                </td>
              </tr>
            ) : products.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-6 py-8 text-center text-gray-400">
                  Nenhum produto encontrado.
                </td>
              </tr>
            ) : (
              products.map((product) => (
                <tr
                  key={product.id}
                  className="hover:bg-gray-50 transition group"
                >
                  <td className="px-6 py-4 font-medium text-gray-900">
                    #{product.id}
                  </td>
                  <td className="px-6 py-4">{product.name}</td>
                  <td className="px-6 py-4">
                    <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
                      {product.category?.name || 'Sem Categoria'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right font-medium text-green-600">
                    {formatCurrency(product.price)}
                  </td>
                  <td className="px-6 py-4 text-center">
                    <button
                      onClick={() => handleEditClick(product)}
                      className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-full transition"
                      title="Editar Produto"
                    >
                      <Edit size={18} />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <div className="bg-gray-50 px-6 py-4 border-t border-gray-200 flex items-center justify-between">
        <span className="text-sm text-gray-600">
          Página <span className="font-semibold">{currentPage}</span> de{' '}
          <span className="font-semibold">{totalPages || 1}</span>
        </span>
        <div className="flex gap-2">
          <button
            onClick={handlePrev}
            disabled={currentPage === 1 || loading}
            className="flex items-center gap-1 px-3 py-1 bg-white border border-gray-300 rounded hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition text-sm"
          >
            <ChevronLeft size={16} /> Anterior
          </button>

          <button
            onClick={handleNext}
            disabled={currentPage >= totalPages || loading}
            className="flex items-center gap-1 px-3 py-1 bg-white border border-gray-300 rounded hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition text-sm"
          >
            Próximo <ChevronRight size={16} />
          </button>
        </div>
      </div>

      {editingProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md animate-in fade-in zoom-in duration-200">
            <div className="flex justify-between items-center p-6 border-b border-gray-100">
              <h3 className="text-lg font-bold text-gray-800">
                Editar Produto
              </h3>
              <button
                onClick={() => setEditingProduct(null)}
                className="text-gray-400 hover:text-gray-600 transition"
              >
                <X size={24} />
              </button>
            </div>

            <form onSubmit={handleUpdateProduct} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nome do Produto
                </label>
                <input
                  type="text"
                  required
                  className="w-full border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  value={editFormData.name}
                  onChange={(e) =>
                    setEditFormData({ ...editFormData, name: e.target.value })
                  }
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Preço (R$)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    className="w-full border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    value={editFormData.price}
                    onChange={(e) =>
                      setEditFormData({
                        ...editFormData,
                        price: e.target.value,
                      })
                    }
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Categoria
                  </label>
                  <select
                    required
                    className="w-full border border-gray-300 rounded-md p-2 bg-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    value={editFormData.category_id}
                    onChange={(e) =>
                      setEditFormData({
                        ...editFormData,
                        category_id: e.target.value,
                      })
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

              <div className="flex justify-end gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setEditingProduct(null)}
                  className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-md transition"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={isSaving}
                  className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition disabled:opacity-50"
                >
                  <Save size={18} />
                  {isSaving ? 'Salvando...' : 'Salvar Alterações'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

export default ProductList
