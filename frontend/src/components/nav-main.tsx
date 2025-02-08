"use client";

import { ChevronRight, type LucideIcon } from "lucide-react"
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from "@/components/ui/sidebar"

interface NavItem {
  title: string;
  icon: LucideIcon;
  isActive?: boolean;
  children?: {
    title: string;
    href: string;
  }[];
}

const adminItems: NavItem[] = [
  {
    title: "Gestão",
    icon: ChevronRight,
    isActive: true,
    children: [
      { title: "Imóveis", href: "/dashboard/imoveis" },
      { title: "Contratos", href: "/dashboard/contratos" },
      { title: "Pagamentos", href: "/dashboard/pagamentos" },
    ],
  },
];

const clientItems: NavItem[] = [
  {
    title: "Minha Conta",
    icon: ChevronRight,
    isActive: true,
    children: [
      { title: "Meus Aluguéis", href: "/dashboard/meus-alugueis" },
      { title: "Pagamentos", href: "/dashboard/meus-pagamentos" },
    ],
  },
];

const NavMain = () => {
  const router = useRouter();
  const { userType } = useAuth();

  const items = userType === 'admin' ? adminItems : clientItems;

  const handleRedirect = (url: string) => {
    router.push(url);
  };

  return (
    <SidebarGroup>
      <SidebarGroupLabel>
        {userType === 'admin' ? 'Administração' : 'Menu'}
      </SidebarGroupLabel>
      <SidebarMenu>
        {items.map((item) => (
          <Collapsible
            key={item.title}
            asChild
            defaultOpen={item.isActive}
            className="group/collapsible"
          >
            <SidebarMenuItem>
              <CollapsibleTrigger asChild>
                <SidebarMenuButton tooltip={item.title}>
                  {item.icon && <item.icon />}
                  <span>{item.title}</span>
                  <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                </SidebarMenuButton>
              </CollapsibleTrigger>
              <CollapsibleContent>
                <SidebarMenuSub>
                  {item.children?.map((subItem) => (
                    <SidebarMenuSubItem key={subItem.title}>
                      <SidebarMenuSubButton 
                        onClick={() => handleRedirect(subItem.href)}
                      >
                        <span>{subItem.title}</span>
                      </SidebarMenuSubButton>
                    </SidebarMenuSubItem>
                  ))}
                </SidebarMenuSub>
              </CollapsibleContent>
            </SidebarMenuItem>
          </Collapsible>
        ))}
      </SidebarMenu>
    </SidebarGroup>
  )
}

export default NavMain;
