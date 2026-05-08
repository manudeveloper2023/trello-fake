export interface AuthLoginRequest {
  email: string
  password: string
}

export interface AuthLoginResponse {
  message: string
  token: string
}
