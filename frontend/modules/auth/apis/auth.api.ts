import http from "@/modules/shared/lib/http"
import {
  AuthLoginRequest,
  AuthRegisterRequest,
  AuthResponse,
} from "./auth.types"

export const loginAPI = async ({
  email,
  password,
}: AuthLoginRequest): Promise<AuthResponse> => {
  try {
    const response = await http.post(`/auth/login`, {
      email,
      password,
    })
    return response.data
  } catch (error) {
    console.error("Login error:", error)
    throw error
  }
}

export const logoutAPI = async () => {
  try {
    await http.post("/auth/logout")
  } catch (error) {
    console.error("Logout error:", error)
    throw error
  }
}
export const registerAPI = async ({
  email,
  password,
  username,
}: AuthRegisterRequest): Promise<AuthResponse> => {
  try {
    const response = await http.post(`/auth/register`, {
      email,
      password,
      username,
    })
    return response.data
  } catch (error) {
    console.error("Registration error:", error)
    throw error
  }
}
