import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const homeOnly = searchParams.get('home') === 'true'

    const where: Record<string, unknown> = { isActive: true }
    if (homeOnly) {
      where.showOnHome = true
    }

    const programs = await prisma.program.findMany({
      where,
      orderBy: { position: 'asc' },
    })
    return NextResponse.json(programs)
  } catch (error) {
    console.error('Error fetching public programs:', error)
    return NextResponse.json([])
  }
}
