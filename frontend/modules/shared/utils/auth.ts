import { cookies } from "next/headers"

export const getSession = async () => {
  const session = (await cookies()).get("access_token")?.value
  return session
}
