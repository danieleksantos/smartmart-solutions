import React, { useState } from 'react'
import { Upload, CheckCircle, AlertCircle, FileText } from 'lucide-react'
import type { UploadResponse } from '../types'

const CsvImportSection: React.FC = () => {
  const [loading, setLoading] = useState<string | null>(null)
  const [messages, setMessages] = useState<
    Record<string, { type: 'success' | 'error'; text: string }>
  >({})

  const uploadFile = async (endpoint: string, file: File, key: string) => {
    setLoading(key)
    const formData = new FormData()
    formData.append('file', file)

    try {
      const res = await fetch(
        `import.meta.env.VITE_API_URL/${endpoint}/upload-csv`,
        {
          method: 'POST',
          body: formData,
        },
      )

      const data: UploadResponse = await res.json()

      if (!res.ok) throw new Error(data.detail || 'Erro no upload')

      const count = data.added ?? data.products_added ?? data.total_added ?? 0
      setMessages((prev) => ({
        ...prev,
        [key]: {
          type: 'success',
          text: `Sucesso! ${count} registros processados.`,
        },
      }))
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'Erro desconhecido'

      setMessages((prev) => ({
        ...prev,
        [key]: { type: 'error', text: errorMessage },
      }))
    } finally {
      setLoading(null)
    }
  }

  const Card = ({
    title,
    description,
    endpoint,
    id,
  }: {
    title: string
    description: string
    endpoint: string
    id: string
  }) => (
    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="font-bold text-gray-800 flex items-center gap-2">
            {title}
          </h3>
          <p className="text-sm text-gray-500 mt-1">{description}</p>
        </div>
        <div className="p-2 bg-blue-50 rounded-full">
          <FileText className="text-blue-500" size={20} />
        </div>
      </div>

      <div className="mt-4">
        <label className="flex items-center justify-center w-full px-4 py-3 bg-gray-50 text-gray-700 rounded-lg border-2 border-dashed border-gray-300 cursor-pointer hover:bg-gray-100 transition relative">
          {loading === id ? (
            <span className="text-sm font-medium animate-pulse">
              Processando...
            </span>
          ) : (
            <>
              <Upload size={18} className="mr-2" />
              <span className="text-sm font-medium">Selecionar CSV</span>
            </>
          )}
          <input
            type="file"
            className="hidden"
            accept=".csv"
            onChange={(e) =>
              e.target.files?.[0] && uploadFile(endpoint, e.target.files[0], id)
            }
            disabled={loading !== null}
          />
        </label>
      </div>

      {messages[id] && (
        <div
          className={`mt-3 flex items-center gap-2 text-sm ${messages[id].type === 'success' ? 'text-green-600' : 'text-red-600'}`}
        >
          {messages[id].type === 'success' ? (
            <CheckCircle size={16} />
          ) : (
            <AlertCircle size={16} />
          )}
          <span>{messages[id].text}</span>
        </div>
      )}
    </div>
  )

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <Card
        id="categories"
        title="1. Categorias"
        description="Arquivo categories.csv. Obrigatório importar primeiro."
        endpoint="categories"
      />
      <Card
        id="products"
        title="2. Produtos"
        description="Arquivo products.csv. Requer categorias cadastradas."
        endpoint="products"
      />
      <Card
        id="sales"
        title="3. Histórico de Vendas"
        description="Arquivo sales.csv. Requer produtos cadastrados."
        endpoint="sales"
      />
    </div>
  )
}

export default CsvImportSection
