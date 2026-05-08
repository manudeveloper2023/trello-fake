"use client"

import { Button } from "@/components/ui/button"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarHeader,
} from "@/components/ui/sidebar"
import { logout } from "@/modules/auth/services/auth.service"

export default function UserDashboard() {
  return (
    <Sidebar>
      <SidebarHeader />
      <SidebarContent>
        <SidebarGroup />
        <SidebarGroup />
      </SidebarContent>
      <SidebarFooter />
      <Button variant="outline" className="w-full" onClick={logout}>
        Logout
      </Button>
    </Sidebar>
  )
}
