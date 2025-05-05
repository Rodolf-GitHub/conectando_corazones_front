import axios from 'axios'
import type { UserCreate, UserUpdate, UserResponse, AllUsersResponse } from '@/types/user.type'
import { authService } from './auth.service'

// Crear instancia de axios con configuración base
const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://192.168.1.103:8000',
  headers: {
    'Content-Type': 'application/json'
  },
  withCredentials: true
})

// Interceptor para agregar el token en cada petición
apiClient.interceptors.request.use(
  (config) => {
    const token = authService.getStoredToken()
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

export const userService = {
  async getAllUsers(): Promise<AllUsersResponse[]> {
    const response = await apiClient.get('/api/users')
    return response.data
  },

  async getUserById(id: string): Promise<UserResponse> {
    const response = await apiClient.get(`/api/users/${id}`)
    return response.data
  },

  async createUser(userData: UserCreate): Promise<UserResponse> {
    const response = await apiClient.post('/api/users/', userData)
    return response.data
  },

  async updateUser(id: string, userData: UserUpdate): Promise<UserResponse> {
    const response = await apiClient.put(`/api/users/${id}`, userData)
    return response.data
  },

  async changePassword(id: string, passwordData: { old_password: string; new_password: string }): Promise<UserResponse> {
    const response = await apiClient.put(`/api/users/change_password/${id}`, passwordData)
    return response.data
  },

  async deleteUser(id: string): Promise<void> {
    await apiClient.delete(`/api/users/${id}`)
  }
}
