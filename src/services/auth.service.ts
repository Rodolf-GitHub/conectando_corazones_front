import axios from 'axios'
import type { AuthLogin, AuthResponse } from '@/types/auth.type'

const API_URL = import.meta.env.VITE_API_URL || 'https://conectando-corazones.onrender.com'
const TOKEN_KEY = 'auth_token'
const USER_DATA_KEY = 'user_data'

const api = axios.create({
  baseURL: API_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
})

class AuthService {
  async login(credentials: AuthLogin): Promise<AuthResponse> {
    const { data } = await api.post<AuthResponse>('/api/auth/login', credentials)
    return data
  }

  setAuthToken(token: string): void {
    api.defaults.headers.common['Authorization'] = `Bearer ${token}`
  }

  removeAuthToken(): void {
    delete api.defaults.headers.common['Authorization']
  }

  getStoredToken(): string | null {
    return sessionStorage.getItem(TOKEN_KEY)
  }

  storeToken(token: string): void {
    sessionStorage.setItem(TOKEN_KEY, token)
  }

  removeToken(): void {
    sessionStorage.removeItem(TOKEN_KEY)
  }

  storeUserData(userData: AuthResponse): void {
    sessionStorage.setItem(USER_DATA_KEY, JSON.stringify(userData))
  }

  getStoredUserData(): AuthResponse | null {
    const data = sessionStorage.getItem(USER_DATA_KEY)
    return data ? JSON.parse(data) : null
  }

  removeUserData(): void {
    sessionStorage.removeItem(USER_DATA_KEY)
  }
}
export const authService = new AuthService()
