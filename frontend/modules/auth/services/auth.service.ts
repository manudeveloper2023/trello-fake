import { redirect } from "next/navigation"
import { loginAPI, logoutAPI, registerAPI } from "../apis/auth.api"
import { AuthLoginRequest, AuthRegisterRequest } from "../apis/auth.types"
export const login = async ({ email, password }: AuthLoginRequest) => {
  try {
    const data = await loginAPI({ email, password })

    if (!data?.token) {
      throw new Error("Invalid login response")
    }

    return data
  } catch (error) {
    console.error("Login error:", error)
    throw error
  }
}

export const register = async ({
  email,
  password,
  username,
}: AuthRegisterRequest) => {
  try {
    const data = await registerAPI({ email, password, username })

    if (!data?.token) {
      throw new Error("Invalid register response")
    }

    return data
  } catch (error) {
    console.error("Register error:", error)
    throw error
  }
}

export const logout = async () => {
  try {
    await logoutAPI()
    redirect("/login")
  } catch (error) {
    console.error("Logout error:", error)
    throw error
  }
}
