import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const homeOnly = searchParams.get('home') === 'true'

    const where = homeOnly
      ? { isActive: true, showOnHome: true }
      : { isActive: true }

    const notices = await prisma.notice.findMany({
      where,
      orderBy: [
        { isPinned: 'desc' },
        { position: 'asc' },
        { publishDate: 'desc' },
      ],
    })
    return NextResponse.json(notices)
  } catch (error) {
    console.error('Error fetching public notices:', error)
    return NextResponse.json([])
  }
}
