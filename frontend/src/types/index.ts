export interface Category {
  id: number
  name: string
}

export interface Product {
  id: number
  name: string
  price: number
  category_id: number
  category?: Category
}

export interface DashboardMetric {
  month: string
  total_quantity: number
  total_revenue: number
}

export interface DashboardResponse {
  sales_by_month: DashboardMetric[]
  category_breakdown: Record<string, string | number>[]
}

export interface UploadResponse {
  message: string
  added?: number
  products_added?: number
  total_added?: number
  detail?: string
}
