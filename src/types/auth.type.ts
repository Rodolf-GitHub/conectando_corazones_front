export interface AuthResponse {
  id: string
  access_token: string
  username: string
  email: string
}

export interface AuthLogin {
  username_or_email: string
  password: string
}

export interface AuthState {
  user: AuthResponse | null
  isAuthenticated: boolean
}

// Para manejar errores de axios tipados
export interface ApiError {
  response?: {
    data?: {
      detail?: string
    }
  }
}
