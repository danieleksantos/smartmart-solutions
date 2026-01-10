import React, { useEffect, useState } from 'react'
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts'
import type { DashboardMetric, DashboardResponse } from '../types'

const Dashboard: React.FC = () => {
  const [data, setData] = useState<DashboardMetric[]>([])
  const [categoryData, setCategoryData] = useState<
    Record<string, string | number>[]
  >([])
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('http://127.0.0.1:8000/dashboard/metrics')

        if (!response.ok) {
          throw new Error('Falha ao buscar dados do dashboard')
        }

        const result: DashboardResponse = await response.json()
        setData(result.sales_by_month)
        setCategoryData(result.category_breakdown)
      } catch (err) {
        if (err instanceof Error) {
          setError(err.message)
        } else {
          setError('Erro desconhecido')
        }
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value)
  }

  const getCategoryKeys = () => {
    if (categoryData.length === 0) return []
    const allKeys = new Set<string>()
    categoryData.forEach((item) => {
      Object.keys(item).forEach((key) => {
        if (key !== 'month') allKeys.add(key)
      })
    })
    return Array.from(allKeys)
  }

  const colors = [
    '#3B82F6',
    '#10B981',
    '#F59E0B',
    '#EF4444',
    '#8B5CF6',
    '#EC4899',
  ]

  if (loading)
    return (
      <div className="p-8 text-center text-gray-500">Carregando dados...</div>
    )
  if (error)
    return <div className="p-8 text-center text-red-500">Erro: {error}</div>

  const totalSales = data.reduce((acc, curr) => acc + curr.total_quantity, 0)
  const totalRevenue = data.reduce((acc, curr) => acc + curr.total_revenue, 0)

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-800 mb-8">
          Dashboard de Vendas
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-blue-500">
            <h3 className="text-gray-500 text-sm font-medium uppercase">
              Total de Vendas (Qtd)
            </h3>
            <p className="text-3xl font-bold text-gray-800 mt-2">
              {totalSales}
            </p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-green-500">
            <h3 className="text-gray-500 text-sm font-medium uppercase">
              Receita Total
            </h3>
            <p className="text-3xl font-bold text-gray-800 mt-2">
              {formatCurrency(totalRevenue)}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold text-gray-700 mb-4">
              Volume de Vendas Mensal
            </h2>
            <div className="h-80 w-full min-h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                  <YAxis />
                  <Tooltip
                    formatter={(value: number | string | undefined) =>
                      formatCurrency(Number(value || 0))
                    }
                    contentStyle={{ borderRadius: '8px', border: 'none' }}
                  />
                  <Legend />
                  <Bar
                    dataKey="total_quantity"
                    name="Qtd. Vendas"
                    fill="#3B82F6"
                    radius={[4, 4, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold text-gray-700 mb-4">
              Faturamento Mensal
            </h2>
            <div className="h-80 w-full min-h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={data}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                  <YAxis tickFormatter={(value) => `R$ ${value}`} width={80} />
                  <Tooltip
                    formatter={(value: number | string | undefined) =>
                      formatCurrency(Number(value || 0))
                    }
                    contentStyle={{ borderRadius: '8px', border: 'none' }}
                  />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="total_revenue"
                    name="Receita (R$)"
                    stroke="#10B981"
                    strokeWidth={3}
                    dot={{ r: 4 }}
                    activeDot={{ r: 8 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold text-gray-700 mb-4">
            Receita por Categoria (Comparativo Mensal)
          </h2>
          <div className="h-96 w-full min-h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={categoryData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                <YAxis tickFormatter={(value) => `R$ ${value}`} width={80} />
                <Tooltip
                  formatter={(value: number | string | undefined) =>
                    formatCurrency(Number(value || 0))
                  }
                  contentStyle={{ borderRadius: '8px', border: 'none' }}
                  cursor={{ fill: 'transparent' }}
                />
                <Legend />

                {getCategoryKeys().map((categoryName, index) => (
                  <Bar
                    key={categoryName}
                    dataKey={categoryName}
                    name={categoryName}
                    stackId="a"
                    fill={colors[index % colors.length]}
                  />
                ))}
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Dashboard
