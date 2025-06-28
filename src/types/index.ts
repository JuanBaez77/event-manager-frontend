export interface User {
  id: number
  nombre: string
  email: string
  rol: string
}

export interface Event {
  id: number
  title: string
  description: string
  date: string
  location: string
  capacity: number
  price: number
  status: 'active' | 'inactive' | 'cancelled'
  created_by: number
  created_at: string
  updated_at: string
}

export interface ApiResponse<T> {
  data: T
  message: string
  success: boolean
}

export interface PaginatedResponse<T> {
  data: T[]
  total: number
  page: number
  per_page: number
  total_pages: number
} 