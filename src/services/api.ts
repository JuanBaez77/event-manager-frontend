import axios from 'axios'
import { User } from '../types'

// @ts-ignore
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000'

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Interceptor para agregar el token de autenticación
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Interceptor para manejar errores de respuesta
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token')
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

export interface LoginCredentials {
  email: string
  password: string
}

export interface LoginResponse {
  access_token: string
  token_type: string
  user: User
}

export const authService = {
  login: async (credentials: LoginCredentials): Promise<LoginResponse> => {
    const response = await api.post('/auth/login', credentials)
    return response.data
  },
  
  logout: () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
  },
  
  getCurrentUser: () => {
    const user = localStorage.getItem('user')
    return user ? JSON.parse(user) : null
  },
}

// --- Servicios de usuarios ---
export const userService = {
  getAll: async (params?: any) => {
    const response = await api.get('/usuarios', { params })
    return response.data
  },
  search: async (email: string) => {
    const response = await api.get('/usuarios/buscar', { params: { email } })
    return response.data
  },
  getById: async (id: number) => {
    const response = await api.get(`/usuarios/${id}`)
    return response.data
  },
  create: async (data: any) => {
    const response = await api.post('/usuarios', data)
    return response.data
  },
  update: async (id: number, data: any) => {
    const response = await api.put(`/usuarios/${id}`, data)
    return response.data
  },
  delete: async (id: number) => {
    const response = await api.delete(`/usuarios/${id}`)
    return response.data
  },
  getByRole: async (rol: string, params?: any) => {
    const response = await api.get(`/usuarios/rol/${rol}`, { params })
    return response.data
  },
  getStats: async () => {
    const response = await api.get('/usuarios/stats/count')
    return response.data
  },
}

export default api 