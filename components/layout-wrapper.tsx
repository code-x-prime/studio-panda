'use client'

import { usePathname } from 'next/navigation'
import Navbar from '@/components/navbar'
import Footer from '@/components/footer'

export default function LayoutWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const isAdmin = pathname?.startsWith('/admin')

  if (isAdmin) {
    return <>{children}</>
  }

  return (
    <div className="relative min-h-screen bg-zinc-950 text-foreground">
      {/* Ambient Layout Glowing Background */}
      <div className="fixed inset-0 pointer-events-none z-0">
        {/* Glow 1 - Top Right Ambient Amber */}
        <div className="absolute -top-40 -right-40 w-[650px] h-[650px] rounded-full bg-primary/10 blur-[150px]" />
        {/* Glow 2 - Mid Left Ambient Yellow/Gold */}
        <div className="absolute top-1/3 -left-40 w-[550px] h-[550px] rounded-full bg-amber-500/10 blur-[140px]" />
        {/* Glow 3 - Bottom Right Ambient Glow */}
        <div className="absolute -bottom-40 right-1/4 w-[650px] h-[650px] rounded-full bg-primary/10 blur-[160px]" />
      </div>

      {/* Persistent Global Navbar */}
      <Navbar />

      {/* Main Content Area */}
      <main className="relative z-10 min-h-[calc(100vh-80px)]">{children}</main>

      {/* Persistent Global Footer */}
      <Footer />
    </div>
  )
}
