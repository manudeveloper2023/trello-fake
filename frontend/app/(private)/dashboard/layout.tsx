import { getSession } from "@/modules/shared/utils/auth"
import { redirect } from "next/navigation"

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await getSession()

  if (!session) {
    redirect("/login")
  }

  return (
    <div className="flex min-h-svh">
      <div className="w-64 border-r p-6">
        <h2 className="font-medium">Dashboard</h2>
        <p>
          Welcome to your dashboard. Here you can manage your projects and
          tasks.
        </p>
      </div>
      <div className="flex-1 p-6">{children}</div>
    </div>
  )
}
