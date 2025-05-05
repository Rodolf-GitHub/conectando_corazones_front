import { defineStore } from 'pinia'
import type { AuthResponse, AuthLogin, AuthState } from '@/types/auth.type'
import { authService } from '@/services/auth.service'

export const useAuthStore = defineStore('auth', {
  state: (): AuthState => ({
    user: null,
    isAuthenticated: false,
  }),

  actions: {
    async login(credentials: AuthLogin) {
      try {
        const userData = await authService.login(credentials)
        this.setUserData(userData)
        return userData
      } catch (error) {
        this.clearUserData()
        throw error
      }
    },

    setUserData(userData: AuthResponse) {
      this.user = userData
      this.isAuthenticated = true
      // Almacenar token y datos del usuario
      authService.storeToken(userData.access_token)
      authService.storeUserData(userData)
      authService.setAuthToken(userData.access_token)
    },

    clearUserData() {
      this.user = null
      this.isAuthenticated = false
      authService.removeToken()
      authService.removeUserData()
      authService.removeAuthToken()
    },

    logout() {
      this.clearUserData()
    },

    async initializeAuth() {
      const token = authService.getStoredToken()
      const userData = authService.getStoredUserData()

      if (token && userData) {
        authService.setAuthToken(token)
        this.setUserData(userData)
      } else {
        this.clearUserData()
      }
    },
  },

  getters: {
    getUserData: (state): AuthResponse | null => state.user,
    isUserAuthenticated: (state): boolean => state.isAuthenticated,
  },
})
