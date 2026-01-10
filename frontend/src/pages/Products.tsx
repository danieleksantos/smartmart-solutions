import React, { useState } from 'react'
import ProductForm from '../components/ProductForm'
import ProductList from '../components/ProductList'

const Products: React.FC = () => {
  const [refreshKey, setRefreshKey] = useState(0)
  const [searchTerm, setSearchTerm] = useState('')

  const [selectedCategory, setSelectedCategory] = useState('')

  const handleProductAdded = () => {
    setRefreshKey((prev) => prev + 1)
  }

  return (
    <div className="p-8 max-w-6xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-800">Gerenciar Produtos</h1>
        <p className="text-gray-500 mt-1">
          Cadastre novos itens e visualize o inventário atual.
        </p>
      </div>

      <ProductForm onSuccess={handleProductAdded} />

      <ProductList
        key={refreshKey}
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        selectedCategory={selectedCategory}
        onCategoryChange={setSelectedCategory}
      />
    </div>
  )
}

export default Products
