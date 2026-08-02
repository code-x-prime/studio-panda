import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const notices = await prisma.notice.findMany({
      orderBy: [
        { isPinned: 'desc' },
        { position: 'asc' },
        { publishDate: 'desc' },
      ],
    })
    return NextResponse.json(notices)
  } catch (error) {
    console.error('Error fetching notices:', error)
    return NextResponse.json({ error: 'Failed to fetch notices' }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await req.json()
    const { title, category, content, isPinned, pdfUrl, pdfFileKey, imageUrl, showOnHome, isActive, position, publishDate } = body

    if (!title || !content) {
      return NextResponse.json({ error: 'Title and content are required' }, { status: 400 })
    }

    let finalPosition = position || 0
    if (showOnHome && !position) {
      const maxPos = await prisma.notice.aggregate({ _max: { position: true }, where: { showOnHome: true } })
      finalPosition = (maxPos._max.position || 0) + 1
    }

    const newNotice = await prisma.notice.create({
      data: {
        title,
        category: category || 'NOTICE',
        content,
        isPinned: Boolean(isPinned),
        pdfUrl: pdfUrl || null,
        pdfFileKey: pdfFileKey || null,
        imageUrl: imageUrl || null,
        isActive: isActive !== undefined ? Boolean(isActive) : true,
        showOnHome: Boolean(showOnHome),
        position: finalPosition,
        publishDate: publishDate ? new Date(publishDate) : new Date(),
      },
    })

    return NextResponse.json(newNotice, { status: 201 })
  } catch (error) {
    console.error('Error publishing notice:', error)
    return NextResponse.json({ error: 'Failed to publish notice' }, { status: 500 })
  }
}

export async function PUT(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await req.json()
    const { id, title, category, content, isPinned, pdfUrl, pdfFileKey, imageUrl, showOnHome, isActive, position, publishDate } = body

    if (!id) {
      return NextResponse.json({ error: 'Notice ID required' }, { status: 400 })
    }

    const updated = await prisma.notice.update({
      where: { id },
      data: {
        ...(title !== undefined && { title }),
        ...(category !== undefined && { category }),
        ...(content !== undefined && { content }),
        ...(isPinned !== undefined && { isPinned: Boolean(isPinned) }),
        ...(pdfUrl !== undefined && { pdfUrl }),
        ...(pdfFileKey !== undefined && { pdfFileKey }),
        ...(imageUrl !== undefined && { imageUrl }),
        ...(showOnHome !== undefined && { showOnHome: Boolean(showOnHome) }),
        ...(isActive !== undefined && { isActive: Boolean(isActive) }),
        ...(position !== undefined && { position: Number(position) }),
        ...(publishDate !== undefined && { publishDate: new Date(publishDate) }),
      },
    })

    return NextResponse.json(updated)
  } catch (error) {
    console.error('Error updating notice:', error)
    return NextResponse.json({ error: 'Failed to update notice' }, { status: 500 })
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(req.url)
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json({ error: 'ID required' }, { status: 400 })
    }

    const deleted = await prisma.notice.findUnique({ where: { id }, select: { position: true, showOnHome: true } })

    await prisma.notice.delete({ where: { id } })

    if (deleted?.showOnHome && deleted.position > 0) {
      await prisma.notice.updateMany({
        where: { showOnHome: true, position: { gt: deleted.position } },
        data: { position: { decrement: 1 } },
      })
    }

    return NextResponse.json({ success: true, id })
  } catch (error) {
    console.error('Error deleting notice:', error)
    return NextResponse.json({ error: 'Failed to delete notice' }, { status: 500 })
  }
}
