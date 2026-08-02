import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { getToken } from 'next-auth/jwt'
import { envConfig } from './lib/env-config'

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl

  // Protect /admin routes (except /admin/login and /api/auth)
  if (pathname.startsWith('/admin') && !pathname.startsWith('/admin/login')) {
    const token = await getToken({
      req,
      secret: envConfig.nextAuthSecret,
      secureCookie: process.env.NODE_ENV === 'production',
    })

    if (!token) {
      const loginUrl = new URL('/admin/login', req.url)
      loginUrl.searchParams.set('callbackUrl', encodeURI(req.url))
      return NextResponse.redirect(loginUrl)
    }

    // Additional security: verify role is ADMIN
    if (token.role !== 'ADMIN') {
      const loginUrl = new URL('/admin/login', req.url)
      loginUrl.searchParams.set('error', 'unauthorized')
      return NextResponse.redirect(loginUrl)
    }
  }

  // Redirect away from login page if already authenticated
  if (pathname === '/admin/login') {
    const token = await getToken({
      req,
      secret: envConfig.nextAuthSecret,
      secureCookie: process.env.NODE_ENV === 'production',
    })

    if (token && token.role === 'ADMIN') {
      return NextResponse.redirect(new URL('/admin/dashboard', req.url))
    }
  }

  // Protect admin API routes (except NextAuth API routes)
  if (pathname.startsWith('/api') && !pathname.startsWith('/api/auth') && !pathname.startsWith('/api/public')) {
    const token = await getToken({
      req,
      secret: envConfig.nextAuthSecret,
      secureCookie: process.env.NODE_ENV === 'production',
    })

    if (!token || token.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized. Admin access required.' }, { status: 401 })
    }
  }

  // Add security headers
  const response = NextResponse.next()
  response.headers.set('X-Content-Type-Options', 'nosniff')
  response.headers.set('X-Frame-Options', 'DENY')
  response.headers.set('X-XSS-Protection', '1; mode=block')
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin')

  return response
}

export const config = {
  matcher: ['/admin/:path*', '/api/:path*'],
}
