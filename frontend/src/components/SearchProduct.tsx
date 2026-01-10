import React from 'react'
import { Search } from 'lucide-react'

interface SearchProductProps {
  value: string
  onChange: (value: string) => void
}

const SearchProduct: React.FC<SearchProductProps> = ({ value, onChange }) => {
  return (
    <div className="relative w-full md:w-96">
      <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
        <Search className="w-5 h-5 text-gray-400" />
      </div>
      <input
        type="text"
        className="block w-full p-2.5 pl-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 transition"
        placeholder="Buscar produto por nome..."
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  )
}

export default SearchProduct
