"use client"

import * as React from "react"
import { Building2, Home, LogOut, FolderCog } from "lucide-react"
import NavMain from "@/components/nav-main"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
} from "@/components/ui/sidebar"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"
import { useAuth } from "@/contexts/AuthContext"

const adminNavItems = [
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

const clienteNavItems = [
  {
    title: "Meus Contratos",
    url: "/cliente/home",
    icon: Home,
  }
]

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const router = useRouter();
  const { signOut, user, userType } = useAuth();

  const navItems = userType === 'admin' ? adminNavItems : clienteNavItems;

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <div className="flex items-center gap-2 px-4 py-2">
          <h2 className="text-lg font-semibold">Aluga Fácil</h2>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={navItems} />
      </SidebarContent>
      <SidebarFooter>
        <div className="px-3 py-2">
          <Button
            variant="ghost"
            className="w-full justify-start"
            onClick={signOut}
          >
            <LogOut className="mr-2 h-4 w-4" />
            <span>Sair</span>
          </Button>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
