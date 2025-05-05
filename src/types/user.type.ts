export interface UserCreate {
  username: string
  email: string
  password: string
}

export interface UserResponse {
  id: string
  username: string
  email: string
  created_at: string
  updated_at: string | null
}

export interface AllUsersResponse {
  id: string
  username: string
  email: string
}

export interface UserUpdate {
  username?: string
  email?: string
}

export interface ChangePassword {
  old_password: string
  new_password: string
}
