'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { IconMenu2, IconX } from '@tabler/icons-react'
import { Button } from '@/components/ui/button'
import Image from 'next/image'

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [hash, setHash] = useState('')
  const pathname = usePathname()
  const isHome = pathname === '/'

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24)
    onScroll()
    window.addEventListener('scroll', onScroll)

    const onHashChange = () => setHash(window.location.hash)
    onHashChange()
    window.addEventListener('hashchange', onHashChange)

    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('hashchange', onHashChange)
    }
  }, [])

  // On inner pages, always show scrolled (white bg) style
  // On homepage, toggle based on scroll
  const isScrolled = isHome ? scrolled : true

  const navLinks = [
    { label: 'Home', href: '/' },
    { label: 'About', href: '/about' },
    { label: 'Programs', href: '/programs' },
    { label: 'Collaborations', href: '/collaborations' },
    { label: 'Notices', href: '/notices' },
    { label: 'Gallery', href: '/gallery' },
    { label: 'Contact', href: '/contact' },
  ]

  const isActive = (href: string) => {
    if (href.includes('#')) {
      const [path, section] = href.split('#')
      return pathname === (path || '/') && hash === `#${section}`
    }
    return pathname === href || pathname.startsWith(`${href}/`)
  }

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 w-full transition-all duration-300 ${isScrolled || isOpen
        ? 'bg-white/95 backdrop-blur-md shadow-md border-b border-black/5'
        : 'bg-transparent'
        }`}
    >
      <div className="mx-auto w-[90%] px-5 sm:px-6 lg:px-8">
        <div className="flex h-20 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 shrink-0">
            <Image src="/logo.png" alt="Studio Panda" className={`h-15 w-auto object-contain ${isScrolled ? 'bg-transparent' : 'bg-white  rounded-2xl '}`}
              width={100}
              height={100}
            />
          </Link>

          {/* Desktop nav */}
          <div className="hidden lg:flex items-center gap-7">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`text-sm font-medium transition-colors ${isActive(link.href)
                  ? 'text-primary'
                  : isScrolled
                    ? 'text-zinc-600 hover:text-zinc-900'
                    : 'text-zinc-300 hover:text-white'
                  }`}
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Right side */}
          <div className="flex items-center gap-2">
            <Link href="/contact" className="hidden sm:block">
              <Button className="bg-primary hover:bg-primary/90 text-black font-semibold text-sm px-5 py-2 h-auto rounded-full">
                Book free presentation
              </Button>
            </Link>

            <button
              onClick={() => setIsOpen(!isOpen)}
              className={`lg:hidden p-2 -mr-2 transition-colors ${isScrolled ? 'text-zinc-700 hover:text-zinc-900' : 'text-zinc-300 hover:text-white'}`}
              aria-label="Toggle menu"
            >
              {isOpen ? <IconX className="h-5 w-5" /> : <IconMenu2 className="h-5 w-5" />}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {isOpen && (
          <div className="lg:hidden border-t border-black/5 pb-6 pt-2 max-h-[calc(100svh-4rem)] overflow-y-auto">
            <div className="space-y-1 py-2">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`block px-3 py-2.5 text-sm font-medium rounded-lg transition-colors ${isActive(link.href)
                    ? 'bg-primary/15 text-primary'
                    : 'text-zinc-600 hover:bg-black/5 hover:text-zinc-900'
                    }`}
                  onClick={() => setIsOpen(false)}
                >
                  {link.label}
                </Link>
              ))}
            </div>
            <Link href="/contact" onClick={() => setIsOpen(false)}>
              <Button className="w-full bg-primary text-black font-semibold hover:bg-primary/90 rounded-full mt-2">
                Book free presentation
              </Button>
            </Link>
          </div>
        )}
      </div>
    </nav>
  )
}
