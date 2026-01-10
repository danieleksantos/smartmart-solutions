import React, { useState } from 'react'
import { UploadCloud, CheckCircle, AlertCircle } from 'lucide-react'
import type { UploadResponse } from '../types'

interface UploadCardProps {
  title: string
  endpoint: string
  description: string
  color: string
}

const UploadCard: React.FC<UploadCardProps> = ({
  title,
  endpoint,
  description,
  color,
}) => {
  const [status, setStatus] = useState<
    'idle' | 'uploading' | 'success' | 'error'
  >('idle')
  const [msg, setMsg] = useState<string>('')

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setStatus('uploading')
    const formData = new FormData()
    formData.append('file', file)

    try {
      const response = await fetch(`http://127.0.0.1:8000/${endpoint}`, {
        method: 'POST',
        body: formData,
      })

      const data: UploadResponse = await response.json()

      if (!response.ok) throw new Error(data.detail || 'Erro no upload')

      const count = data.products_added || data.added || data.total_added || 0

      setStatus('success')
      setMsg(`Sucesso! ${count} registros processados.`)
    } catch (error) {
      setStatus('error')
      if (error instanceof Error) {
        setMsg(error.message)
      } else {
        setMsg('Erro desconhecido')
      }
    }
  }

  return (
    <div className={`p-6 bg-white rounded-lg shadow-md border-t-4 ${color}`}>
      <h3 className="font-bold text-gray-700 text-lg mb-2">{title}</h3>
      <p className="text-sm text-gray-500 mb-4">{description}</p>

      <div className="flex items-center gap-4">
        <label className="cursor-pointer flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded text-gray-700 transition">
          <UploadCloud size={20} />
          <span>Selecionar CSV</span>
          <input
            type="file"
            className="hidden"
            accept=".csv"
            onChange={handleUpload}
          />
        </label>

        {status === 'uploading' && (
          <span className="text-blue-500 text-sm animate-pulse">
            Enviando...
          </span>
        )}
        {status === 'success' && (
          <div className="flex items-center text-green-600 text-sm">
            <CheckCircle size={16} className="mr-1" /> {msg}
          </div>
        )}
        {status === 'error' && (
          <div className="flex items-center text-red-600 text-sm">
            <AlertCircle size={16} className="mr-1" /> {msg}
          </div>
        )}
      </div>
    </div>
  )
}

const Uploads: React.FC = () => {
  return (
    <div className="p-8 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold text-gray-800 mb-2">
        Importação de Dados
      </h1>
      <p className="text-gray-600 mb-8">
        Siga a ordem abaixo para evitar erros de vínculo entre os dados.
      </p>

      <div className="space-y-6">
        <UploadCard
          title="1. Categorias"
          endpoint="categories/upload-csv"
          description="Arquivo categories.csv. Obrigatório importar primeiro."
          color="border-yellow-500"
        />
        <UploadCard
          title="2. Produtos"
          endpoint="products/upload-csv"
          description="Arquivo products.csv. Requer categorias cadastradas."
          color="border-blue-500"
        />
        <UploadCard
          title="3. Histórico de Vendas"
          endpoint="sales/upload-csv"
          description="Arquivo sales.csv. Requer produtos cadastrados."
          color="border-green-500"
        />
      </div>
    </div>
  )
}

export default Uploads
