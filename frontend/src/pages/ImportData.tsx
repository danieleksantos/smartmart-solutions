import React, { useState } from 'react'
import { FileSpreadsheet, Keyboard } from 'lucide-react'
import CsvImportSection from '../components/CsvImportSection'
import ManualEntrySection from '../components/ManualEntrySection'

const ImportData: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'csv' | 'manual'>('csv')

  return (
    <div className="p-8 max-w-5xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800">
          Importação de Dados
        </h1>
        <p className="text-gray-500 mt-1">
          Escolha como deseja alimentar o sistema: via arquivos em lote ou
          inserção manual.
        </p>
      </div>

      <div className="flex border-b border-gray-200 mb-6">
        <button
          onClick={() => setActiveTab('csv')}
          className={`flex items-center gap-2 px-6 py-3 font-medium text-sm transition-colors border-b-2 ${
            activeTab === 'csv'
              ? 'border-blue-600 text-blue-600'
              : 'border-transparent text-gray-500 hover:text-gray-700'
          }`}
        >
          <FileSpreadsheet size={18} />
          Importar CSV
        </button>

        <button
          onClick={() => setActiveTab('manual')}
          className={`flex items-center gap-2 px-6 py-3 font-medium text-sm transition-colors border-b-2 ${
            activeTab === 'manual'
              ? 'border-blue-600 text-blue-600'
              : 'border-transparent text-gray-500 hover:text-gray-700'
          }`}
        >
          <Keyboard size={18} />
          Inserção Manual
        </button>
      </div>

      <div className="min-h-[400px]">
        {activeTab === 'csv' ? <CsvImportSection /> : <ManualEntrySection />}
      </div>
    </div>
  )
}

export default ImportData
