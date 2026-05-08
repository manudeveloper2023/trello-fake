import http from "@/modules/shared/lib/http"
import { AuthLoginRequest, AuthLoginResponse } from "./auth.types"

export const loginAPI = async ({
  email,
  password,
}: AuthLoginRequest): Promise<AuthLoginResponse> => {
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
