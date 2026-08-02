'use client'

import Link from 'next/link'
import {
  IconMail,
  IconPhone,
  IconMapPin,
  IconBrandX,
  IconBrandFacebook,
  IconBrandInstagram,
  IconShieldLock,
} from '@tabler/icons-react'
import Image from 'next/image'

const quickLinks = [
  { label: 'Home', href: '/' },
  { label: 'About', href: '/about' },
  { label: 'Programs', href: '/programs' },
  { label: 'Collaborations', href: '/collaborations' },
  { label: 'Notices', href: '/notices' },
]

const resourceLinks = [
  { label: 'Gallery', href: '/gallery' },
  { label: 'FAQ', href: '/faq' },
  { label: 'Contact us', href: '/contact' },
]

const socials = [
  { icon: IconBrandX, label: 'X', href: '#' },
  { icon: IconBrandFacebook, label: 'Facebook', href: '#' },
  { icon: IconBrandInstagram, label: 'Instagram', href: '#' },
]

export default function Footer() {
  return (
    <footer className="relative border-t border-black/10 bg-[#FDFAF2] overflow-hidden text-zinc-900">
      {/* Subtle warm top glow */}
      <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-amber-200/40 rounded-full blur-[120px] pointer-events-none" />

      <div className="relative mx-auto max-w-7xl px-5 sm:px-6 lg:px-8 py-14 sm:py-16">
        {/* Main grid */}
        <div className="mb-10 sm:mb-12 grid gap-10 grid-cols-2 lg:grid-cols-5">
          {/* Brand — full width on mobile */}
          <div className="col-span-2 lg:col-span-2">
            <Link href="/" className="mb-4 inline-block">
              <Image
                src="/logo.png"
                alt="Studio Panda"
                className="h-14 w-auto object-contain"
                width={100}
                height={100}
              />
            </Link>
            <p className="text-sm text-zinc-700 leading-relaxed mb-5 max-w-xs font-medium">
              Transforming schools into creative powerhouses through hands-on media education,
              podcasting, filmmaking, and AI tools.
            </p>
            <div className="flex gap-2">
              {socials.map(({ icon: Icon, label, href }) => (
                <a
                  key={label}
                  href={href}
                  aria-label={label}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2.5 rounded-lg bg-black/5 text-zinc-700 hover:text-black hover:bg-black/10 transition-colors"
                >
                  <Icon className="h-4 w-4" stroke={1.75} />
                </a>
              ))}
            </div>
          </div>

          {/* Quick links */}
          <div className="col-span-1 lg:col-span-1">
            <h4 className="mb-4 text-xs font-bold text-zinc-950 uppercase tracking-wider">Quick links</h4>
            <ul className="space-y-2.5 text-sm">
              {quickLinks.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-zinc-700 hover:text-black font-medium transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Resources */}
          <div className="col-span-1 lg:col-span-1">
            <h4 className="mb-4 text-xs font-bold text-zinc-950 uppercase tracking-wider">Resources</h4>
            <ul className="space-y-2.5 text-sm">
              {resourceLinks.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-zinc-700 hover:text-black font-medium transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact — full width on mobile */}
          <div className="col-span-2 lg:col-span-1">
            <h4 className="mb-4 text-xs font-bold text-zinc-950 uppercase tracking-wider">Contact</h4>
            <ul className="space-y-3 text-sm text-zinc-700 font-medium">
              <li className="flex items-center gap-2.5">
                <IconMail className="h-4 w-4 text-zinc-900 shrink-0" stroke={1.75} />
                <span className="break-all">contact@studiopanda.in</span>
              </li>
              <li className="flex items-center gap-2.5">
                <IconPhone className="h-4 w-4 text-zinc-900 shrink-0" stroke={1.75} />
                +91 98765 43210
              </li>
              <li className="flex items-center gap-2.5">
                <IconMapPin className="h-4 w-4 text-zinc-900 shrink-0" stroke={1.75} />
                New Delhi, India
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between border-t border-black/10 pt-6 gap-4 text-xs text-zinc-600 text-center sm:text-left">
          <p>&copy; {new Date().getFullYear()} Studio Panda. All rights reserved.</p>
          <div className="flex items-center gap-5 font-medium">
            <Link href="/privacy" className="hover:text-zinc-950 transition-colors">
              Privacy policy
            </Link>
            <Link href="/terms" className="hover:text-zinc-950 transition-colors">
              Terms of service
            </Link>
            <Link href="/admin/login" className="hover:text-zinc-950 transition-colors flex items-center gap-1.5">
              <IconShieldLock className="h-3.5 w-3.5" stroke={1.75} />
              Admin
            </Link>
          </div>
        </div>

        {/* Designed by */}
        <div className="mt-5 text-center">
          <p className="text-xs text-zinc-600">
            Designed and developed by{' '}
            <a
              href="https://groxmedia.in/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-zinc-950 hover:text-black font-bold underline underline-offset-2 transition-colors"
            >
              Grox Media
            </a>
          </p>
        </div>
      </div>
    </footer>
  )
}