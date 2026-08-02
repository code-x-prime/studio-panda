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

    const collabs = await prisma.collaboration.findMany({
      orderBy: { position: 'asc' },
    })
    return NextResponse.json(collabs)
  } catch (error) {
    console.error('Error fetching collaborations:', error)
    return NextResponse.json({ error: 'Failed to fetch collaborations' }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await req.json()
    const { title, partnerName, description, partnerLogo, imageUrl, websiteUrl, type, date, isFeatured, showOnHome, isActive, position } = body

    if (!partnerName || !description) {
      return NextResponse.json({ error: 'Partner name and description are required' }, { status: 400 })
    }

    let finalPosition = position || 0
    if (showOnHome && !position) {
      const maxPos = await prisma.collaboration.aggregate({ _max: { position: true }, where: { showOnHome: true } })
      finalPosition = (maxPos._max.position || 0) + 1
    }

    const newCollab = await prisma.collaboration.create({
      data: {
        title: title || `${partnerName} Partnership`,
        partnerName,
        description,
        partnerLogo: partnerLogo || null,
        imageUrl: imageUrl || null,
        websiteUrl: websiteUrl || null,
        type: type || null,
        date: date || null,
        isFeatured: isFeatured !== undefined ? Boolean(isFeatured) : true,
        isActive: isActive !== undefined ? Boolean(isActive) : true,
        showOnHome: Boolean(showOnHome),
        position: finalPosition,
      },
    })

    return NextResponse.json(newCollab, { status: 201 })
  } catch (error) {
    console.error('Error creating collaboration:', error)
    return NextResponse.json({ error: 'Failed to add collaboration' }, { status: 500 })
  }
}

export async function PUT(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await req.json()
    const { id, title, partnerName, description, partnerLogo, imageUrl, websiteUrl, type, date, isFeatured, showOnHome, isActive, position } = body

    if (!id) {
      return NextResponse.json({ error: 'Collaboration ID required' }, { status: 400 })
    }

    const updated = await prisma.collaboration.update({
      where: { id },
      data: {
        ...(title !== undefined && { title }),
        ...(partnerName !== undefined && { partnerName }),
        ...(description !== undefined && { description }),
        ...(partnerLogo !== undefined && { partnerLogo }),
        ...(imageUrl !== undefined && { imageUrl }),
        ...(websiteUrl !== undefined && { websiteUrl }),
        ...(type !== undefined && { type }),
        ...(date !== undefined && { date }),
        ...(isFeatured !== undefined && { isFeatured: Boolean(isFeatured) }),
        ...(showOnHome !== undefined && { showOnHome: Boolean(showOnHome) }),
        ...(isActive !== undefined && { isActive: Boolean(isActive) }),
        ...(position !== undefined && { position: Number(position) }),
      },
    })

    return NextResponse.json(updated)
  } catch (error) {
    console.error('Error updating collaboration:', error)
    return NextResponse.json({ error: 'Failed to update collaboration' }, { status: 500 })
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

    const deleted = await prisma.collaboration.findUnique({ where: { id }, select: { position: true, showOnHome: true } })

    await prisma.collaboration.delete({ where: { id } })

    if (deleted?.showOnHome && deleted.position > 0) {
      await prisma.collaboration.updateMany({
        where: { showOnHome: true, position: { gt: deleted.position } },
        data: { position: { decrement: 1 } },
      })
    }

    return NextResponse.json({ success: true, id })
  } catch (error) {
    console.error('Error deleting collaboration:', error)
    return NextResponse.json({ error: 'Failed to delete collaboration' }, { status: 500 })
  }
}
