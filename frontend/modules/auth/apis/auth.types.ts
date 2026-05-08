export interface AuthLoginRequest {
  email: string
  password: string
}

export interface AuthResponse {
  message: string
  token: string
}

export interface AuthRegisterRequest {
  email: string
  password: string
  username: string
}
