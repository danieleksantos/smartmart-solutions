import React, { useState } from 'react'
import ProductList from '../components/ProductList'

const Products: React.FC = () => {
  const [refreshKey, setRefreshKey] = useState(0)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('')

  const handleListUpdate = () => {
    setRefreshKey((prev) => prev + 1)
  }

  return (
    <div className="p-8 max-w-6xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-800">Gerenciar Produtos</h1>
        <p className="text-gray-500 mt-1">
          Visualize o inventário, filtre por categoria ou exporte relatórios.
        </p>
      </div>

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
