'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { signOut } from 'next-auth/react'
import { Toaster } from 'sonner'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet'
import {
  IconLayoutDashboard,
  IconBook,
  IconBuildingStore,
  IconBell,
  IconPhoto,
  IconSettings,
  IconLogout,
  IconExternalLink,
  IconShieldCheck,
  IconMenu2,
  IconMail,
} from '@tabler/icons-react'

const adminNav = [
  { label: 'Dashboard', href: '/admin/dashboard', icon: IconLayoutDashboard },
  { label: 'Programs & Classes', href: '/admin/programs', icon: IconBook },
  { label: 'Collaborations', href: '/admin/collaborations', icon: IconBuildingStore },
  { label: 'Notices & Updates', href: '/admin/notices', icon: IconBell },
  { label: 'Gallery & Media', href: '/admin/gallery', icon: IconPhoto },
  { label: 'Contact Messages', href: '/admin/contacts', icon: IconMail },
  { label: 'Website & SEO', href: '/admin/settings', icon: IconSettings },
]

function SidebarContent({ onNavClick }: { onNavClick?: () => void }) {
  const pathname = usePathname()
  const isActive = (href: string) => pathname === href || pathname.startsWith(href)

  return (
    <div className="flex flex-col h-full">
      <div className="p-4">
        <Link href="/admin/dashboard" className="flex items-center gap-2" onClick={onNavClick}>
          <img src="/logo.png" alt="Studio Panda" className="h-8 w-auto" />
          <span className="text-xs font-bold bg-primary/10 text-primary px-2 py-0.5 rounded">Admin</span>
        </Link>
      </div>

      <Separator />

      <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
        {adminNav.map((item) => {
          const Icon = item.icon
          const active = isActive(item.href)
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onNavClick}
              className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${active
                ? 'bg-primary text-primary-foreground'
                : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                }`}
            >
              <Icon className="h-4 w-4" />
              {item.label}
            </Link>
          )
        })}
      </nav>

      <Separator />

      <div className="p-3 space-y-1">
        <Link
          href="/"
          target="_blank"
          className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
          onClick={onNavClick}
        >
          <IconExternalLink className="h-4 w-4" />
          View Live Site
        </Link>
        <button
          onClick={() => signOut({ callbackUrl: '/admin/login' })}
          className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-destructive hover:bg-destructive/10 transition-colors"
        >
          <IconLogout className="h-4 w-4" />
          Sign Out
        </button>
      </div>
    </div>
  )
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const [open, setOpen] = useState(false)

  if (pathname === '/admin/login') {
    return <>{children}</>
  }

  return (
    <div className="min-h-screen bg-background flex flex-col md:flex-row">
      <Toaster position="top-right" richColors closeButton />
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex w-64 border-r bg-card flex-col flex-shrink-0 sticky top-0 h-screen">
        <SidebarContent />
      </aside>

      {/* Mobile Sidebar (Sheet) */}
      <div className="md:hidden fixed top-0 left-0 right-0 z-40 border-b bg-card">
        <div className="flex items-center justify-between px-4 h-14">
          <Link href="/admin/dashboard" className="flex items-center gap-2">
            <img src="/logo.png" alt="Studio Panda" className="h-7 w-auto" />
            <span className="text-xs font-bold bg-primary/10 text-primary px-2 py-0.5 rounded">Admin</span>
          </Link>
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger render={<Button variant="ghost" size="icon-sm" />}>
              <IconMenu2 className="h-5 w-5" />
            </SheetTrigger>
            <SheetContent side="left" className="w-72 p-0">
              <SheetHeader className="sr-only">
                <SheetTitle>Navigation</SheetTitle>
              </SheetHeader>
              <SidebarContent onNavClick={() => setOpen(false)} />
            </SheetContent>
          </Sheet>
        </div>
      </div>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0 min-h-screen md:min-h-screen">
        {/* Desktop Top Header */}
        <header className="hidden md:flex h-12 border-b bg-card/50 backdrop-blur px-6 items-center justify-between sticky top-0 z-30">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <IconShieldCheck className="h-4 w-4 text-primary" />
            <span className="font-medium">Studio Panda CMS</span>
          </div>
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <span className="h-2 w-2 rounded-full bg-green-500" />
            Online
          </div>
        </header>

        {/* Mobile spacer */}
        <div className="md:hidden h-14" />

        <div className="flex-1 p-4 md:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          {children}
        </div>
      </main>
    </div>
  )
}
