"use client"

import * as React from "react"
import { Building2, Home, LogOut, FolderCog } from "lucide-react"
import NavMain from "@/components/nav-main"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"
import { useAuth } from "@/contexts/AuthContext"

const navItems = [
  {
    title: "Dashboard",
    url: "/admin/dashboard",
    icon: Building2,
  },
  {
    title: "Gestão",
    icon: FolderCog,
    isActive: true,
    children: [
      { title: "Imóveis", url: "/admin/dashboard/imoveis" },
      { title: "Clientes", url: "/admin/dashboard/clientes" },
      { title: "Contratos", url: "/admin/dashboard/contratos" },
      { title: "Pagamentos", url: "/admin/dashboard/pagamentos" },
    ],
  },
]

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const router = useRouter();
  const { signOut, user } = useAuth();

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <div className="flex items-center gap-2 px-4 py-2">
          <h2 className="text-lg font-semibold">Aluga Fácil</h2>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={navItems} />
        <div className="px-3 py-2">
          <Button
            variant="ghost"
            className="w-full justify-start gap-2"
            onClick={signOut}
          >
            <LogOut className="h-4 w-4" />
            Sair
          </Button>
        </div>
      </SidebarContent>
      <SidebarFooter>
        <div className="flex items-center gap-2 px-4 py-2">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium">{user?.nome}</p>
            <p className="text-xs text-muted-foreground">{user?.email}</p>
          </div>
        </div>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
