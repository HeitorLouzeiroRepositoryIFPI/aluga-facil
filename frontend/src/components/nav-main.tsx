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
  url?: string;
  icon: LucideIcon;
  isActive?: boolean;
  children?: {
    title: string;
    url: string;
  }[];
}

interface Props {
  items: NavItem[];
}

const NavMain = ({ items }: Props) => {
  const router = useRouter();
  const { userType } = useAuth();

  const handleClick = (item: NavItem) => {
    if (item.url) {
      router.push(item.url);
    }
  };

  return (
    <SidebarGroup>
      <SidebarGroupLabel>
        {userType === 'admin' ? 'Administração' : 'Menu'}
      </SidebarGroupLabel>
      <SidebarMenu>
        {items.map((item) => {
          if (item.children) {
            return (
              <Collapsible
                key={item.title}
                asChild
                defaultOpen={item.isActive}
                className="group/collapsible"
              >
                <SidebarMenuItem>
                  <CollapsibleTrigger asChild>
                    <SidebarMenuButton tooltip={item.title}>
                      {item.icon && <item.icon className="h-4 w-4" />}
                      <span>{item.title}</span>
                      <ChevronRight className="ml-auto h-4 w-4 transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                    </SidebarMenuButton>
                  </CollapsibleTrigger>
                  <CollapsibleContent>
                    <SidebarMenuSub>
                      {item.children.map((subItem) => (
                        <SidebarMenuSubItem key={subItem.title}>
                          <SidebarMenuSubButton 
                            onClick={() => router.push(subItem.url)}
                          >
                            <span>{subItem.title}</span>
                          </SidebarMenuSubButton>
                        </SidebarMenuSubItem>
                      ))}
                    </SidebarMenuSub>
                  </CollapsibleContent>
                </SidebarMenuItem>
              </Collapsible>
            );
          }

          return (
            <SidebarMenuItem key={item.title}>
              <SidebarMenuButton 
                onClick={() => handleClick(item)}
                tooltip={item.title}
              >
                {item.icon && <item.icon className="h-4 w-4" />}
                <span>{item.title}</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          );
        })}
      </SidebarMenu>
    </SidebarGroup>
  );
};

export default NavMain;
