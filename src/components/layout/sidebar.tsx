'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { 
  LayoutDashboard, 
  FolderOpen, 
  Newspaper, 
  Bot,
  TrendingUp,
  ChevronLeft,
  ChevronRight
} from 'lucide-react'

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarTrigger,
  useSidebar,
} from '@/components/ui/sidebar'

const navigation = [
  { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { name: 'Portfolio', href: '/portfolio', icon: FolderOpen },
  { name: 'News', href: '/news', icon: Newspaper },
  { name: 'AI Recommendations', href: '/recommendations', icon: Bot },
]

export function AppSidebar() {
  const pathname = usePathname()
  const { state } = useSidebar()
  const isCollapsed = state === 'collapsed'

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader>
        <div className="flex items-center justify-between px-2 py-2">
          <div className="flex items-center">
            <TrendingUp className="h-8 w-8 text-blue-600" />
            {!isCollapsed && (
              <span className="ml-2 text-xl font-bold text-gray-900">StockManager</span>
            )}
          </div>
          <SidebarTrigger className="ml-auto" />
        </div>
      </SidebarHeader>
      
      <SidebarContent>
        <SidebarGroup>
          {!isCollapsed && <SidebarGroupLabel>Navigation</SidebarGroupLabel>}
          <SidebarGroupContent>
            <SidebarMenu>
              {navigation.map((item) => (
                <SidebarMenuItem key={item.name}>
                  <SidebarMenuButton 
                    asChild 
                    isActive={pathname === item.href}
                    tooltip={isCollapsed ? item.name : undefined}
                  >
                    <Link href={item.href}>
                      <item.icon className="h-4 w-4" />
                      {!isCollapsed && <span>{item.name}</span>}
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  )
}