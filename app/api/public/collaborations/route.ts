import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const homeOnly = searchParams.get('home') === 'true'

    const where = homeOnly
      ? { isActive: true, showOnHome: true }
      : { isActive: true }

    const collabs = await prisma.collaboration.findMany({
      where,
      orderBy: { position: 'asc' },
    })
    return NextResponse.json(collabs)
  } catch (error) {
    console.error('Error fetching public collaborations:', error)
    return NextResponse.json([])
  }
}
