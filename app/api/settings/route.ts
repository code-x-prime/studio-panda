import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

// GET: fetch all site config (public for non-sensitive, admin for all)
export async function GET() {
  try {
    const configs = await prisma.siteConfig.findMany({
      orderBy: { key: 'asc' },
    })

    // Convert array to key-value object
    const configObj: Record<string, string> = {}
    configs.forEach((c) => {
      configObj[c.key] = c.value
    })

    return NextResponse.json(configObj)
  } catch (error) {
    console.error('Error fetching site config:', error)
    return NextResponse.json({ error: 'Failed to fetch settings' }, { status: 500 })
  }
}

// POST/PUT: save site config (admin only)
export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await req.json()

    // Upsert each key-value pair
    const upserts = Object.entries(body).map(([key, value]) =>
      prisma.siteConfig.upsert({
        where: { key },
        update: { value: String(value) },
        create: {
          key,
          value: String(value),
          label: key.replace(/([A-Z])/g, ' $1').replace(/^./, (s) => s.toUpperCase()),
          group: key.includes('meta') ? 'seo' : 'general',
        },
      })
    )

    await Promise.all(upserts)

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error saving site config:', error)
    return NextResponse.json({ error: 'Failed to save settings' }, { status: 500 })
  }
}
