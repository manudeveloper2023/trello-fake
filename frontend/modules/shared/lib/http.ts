import axios from "axios"
import { API_URL } from "../config/api"
import { redirect } from "next/navigation"

const http = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL ?? API_URL,
  withCredentials: true,
})

http.interceptors.response.use(
  (response) => response,
  (err) => {
    if (err.response?.status === 401 && window.location.pathname !== "/login") {
      redirect("/login")
    }
    return Promise.reject(err)
  }
)

export default http
