// app/layout.tsx
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { AppSidebar } from '@/components/layout/sidebar'
import { Header } from '@/components/layout/header'
import { SidebarProvider, SidebarInset } from '@/components/ui/sidebar'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Stock Portfolio Manager',
  description: 'Manage your stock portfolio with real-time data and AI recommendations',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <SidebarProvider>
          <AppSidebar />
          <SidebarInset>
            <Header />
            <main className="flex-1 p-6">
              {children}
            </main>
          </SidebarInset>
        </SidebarProvider>
      </body>
    </html>
  )
}