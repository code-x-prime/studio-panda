import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { deleteFromR2 } from '@/lib/r2'

export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const items = await prisma.galleryItem.findMany({
      orderBy: { position: 'asc' },
    })
    return NextResponse.json(items)
  } catch (error) {
    console.error('Error fetching gallery:', error)
    return NextResponse.json([])
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await req.json()
    const { title, type, url, fileKey, category, mimeType, size, showOnHome, isActive, position } = body

    if (!title || !url) {
      return NextResponse.json({ error: 'Title and URL are required' }, { status: 400 })
    }

    let finalPosition = position || 0
    if (showOnHome && !position) {
      const maxPos = await prisma.galleryItem.aggregate({ _max: { position: true }, where: { showOnHome: true } })
      finalPosition = (maxPos._max.position || 0) + 1
    }

    const newItem = await prisma.galleryItem.create({
      data: {
        title,
        type: type || 'IMAGE',
        url,
        fileKey: fileKey || `file-${Date.now()}`,
        category: category || 'General',
        mimeType: mimeType || null,
        size: size || null,
        isActive: isActive !== undefined ? Boolean(isActive) : true,
        showOnHome: Boolean(showOnHome),
        position: finalPosition,
      },
    })

    return NextResponse.json(newItem, { status: 201 })
  } catch (error) {
    console.error('Error adding gallery item:', error)
    return NextResponse.json({ error: 'Failed to add item' }, { status: 500 })
  }
}

export async function PUT(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await req.json()
    const { id, title, type, url, fileKey, category, showOnHome, isActive, position } = body

    if (!id) {
      return NextResponse.json({ error: 'ID required' }, { status: 400 })
    }

    // If replacing file (new url + fileKey), delete old R2 file
    if (url && fileKey) {
      const existing = await prisma.galleryItem.findUnique({ where: { id } })
      if (existing && existing.fileKey && existing.fileKey !== fileKey) {
        await deleteFromR2(existing.fileKey)
      }
    }

    const updated = await prisma.galleryItem.update({
      where: { id },
      data: {
        ...(title !== undefined && { title }),
        ...(type !== undefined && { type }),
        ...(url !== undefined && { url }),
        ...(fileKey !== undefined && { fileKey }),
        ...(category !== undefined && { category }),
        ...(showOnHome !== undefined && { showOnHome: Boolean(showOnHome) }),
        ...(isActive !== undefined && { isActive: Boolean(isActive) }),
        ...(position !== undefined && { position: Number(position) }),
      },
    })

    return NextResponse.json(updated)
  } catch (error) {
    console.error('Error updating gallery item:', error)
    return NextResponse.json({ error: 'Failed to update item' }, { status: 500 })
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

    const item = await prisma.galleryItem.findUnique({ where: { id }, select: { fileKey: true, position: true, showOnHome: true } })

    // Delete from R2
    if (item?.fileKey) {
      await deleteFromR2(item.fileKey)
    }

    await prisma.galleryItem.delete({ where: { id } })

    // Auto-reorder
    if (item?.showOnHome && item.position > 0) {
      await prisma.galleryItem.updateMany({
        where: { showOnHome: true, position: { gt: item.position } },
        data: { position: { decrement: 1 } },
      })
    }

    return NextResponse.json({ success: true, id })
  } catch (error) {
    console.error('Error deleting gallery item:', error)
    return NextResponse.json({ error: 'Failed to delete item' }, { status: 500 })
  }
}
