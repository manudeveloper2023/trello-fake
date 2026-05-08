import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import UserDashboard from "@/modules/dashboard/components/UserDashboard"
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
    <SidebarProvider>
      <UserDashboard />
      <main>
        <SidebarTrigger />
        {children}
      </main>
    </SidebarProvider>
  )
}
