import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const [programs, collaborations, notices, galleryItems, contactMessages, unreadMessages] = await Promise.all([
      prisma.program.count(),
      prisma.collaboration.count(),
      prisma.notice.count(),
      prisma.galleryItem.count(),
      prisma.contactMessage.count(),
      prisma.contactMessage.count({ where: { isRead: false } }),
    ])

    return NextResponse.json({
      programs,
      collaborations,
      notices,
      galleryItems,
      contactMessages,
      unreadMessages,
    })
  } catch (error) {
    console.error('Error fetching stats:', error)
    return NextResponse.json({ error: 'Failed to fetch stats' }, { status: 500 })
  }
}
