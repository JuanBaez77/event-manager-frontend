export interface User {
  id: number
  nombre: string
  email: string
  rol: string
}

export interface Categoria {
  id: number
  nombre: string
  descripcion?: string
}

export interface Event {
  id: number
  nombre: string
  descripcion: string
  fecha_inicio: string
  fecha_fin: string
  lugar: string
  cupos: number
  categoria_id?: number
  categoria?: Categoria
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