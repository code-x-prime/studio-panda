import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const homeOnly = searchParams.get('home') === 'true'

    const where = homeOnly
      ? { isActive: true, showOnHome: true }
      : { isActive: true }

    const items = await prisma.galleryItem.findMany({
      where,
      orderBy: { position: 'asc' },
    })
    return NextResponse.json(items)
  } catch (error) {
    console.error('Error fetching public gallery:', error)
    return NextResponse.json([])
  }
}
