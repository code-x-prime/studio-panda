import { Poppins } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import type { Metadata, Viewport } from 'next'
import LayoutWrapper from '@/components/layout-wrapper'
import './globals.css'

const poppins = Poppins({
  subsets: ['latin'],
  weight: ['400', '600', '700', '800', '900'],
})

export const metadata: Metadata = {
  title: 'Studio Panda - India\'s Premium Future-Skills Platform for Schools',
  description: 'Transform schools into creative powerhouses. Studio Panda builds confident communicators and fearless storytellers through hands-on media projects.',
  generator: 'v0.app',
}

export const viewport: Viewport = {
  themeColor: '#F97316',
  userScalable: true,
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className={`scroll-smooth ${poppins.className}`}>
      <body className="antialiased">
        <LayoutWrapper>{children}</LayoutWrapper>
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}
