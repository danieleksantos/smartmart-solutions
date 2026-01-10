import axios from 'axios'

const api = axios.create({
  baseURL: 'http://127.0.0.1:8000',
})

export interface Product {
  id: number
  name: string
  price: number
  category_id: number
  category?: {
    id: number
    name: string
  }
}

export interface Sale {
  id: number
  product_id: number
  month: string
  quantity: number
  total_price: number
  product?: Product
}

export interface Category {
  id: number
  name: string
}

export const fetchProducts = async () => {
  const response = await api.get<Product[]>('/products/')
  return response.data
}

export const fetchSales = async () => {
  const response = await api.get<Sale[]>('/sales/')
  return response.data
}

export const fetchCategories = async () => {
  const response = await api.get<Category[]>('/categories/')
  return response.data
}

export const uploadProductsCsv = async (file: File) => {
  const formData = new FormData()
  formData.append('file', file)

  const response = await api.post('/products/upload-csv', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  })
  return response.data
}

export default api
