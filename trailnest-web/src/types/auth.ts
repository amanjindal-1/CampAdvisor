export interface LoginRequest {
  email: string
  password: string
}

export interface RegisterRequest {
  email: string
  username: string
  password: string
  displayName: string
}

export interface AuthResponse {
  accessToken: string
  user: {
    id: string
    email: string
    username: string
    displayName: string | null
    avatarUrl: string | null
    role: 'USER' | 'OPERATOR' | 'ADMIN'
  }
}
