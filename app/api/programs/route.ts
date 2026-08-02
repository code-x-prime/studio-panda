import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const programs = await prisma.program.findMany({
      orderBy: { position: 'asc' },
    })
    return NextResponse.json(programs)
  } catch (error) {
    console.error('Error fetching programs:', error)
    return NextResponse.json({ error: 'Failed to fetch programs' }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await req.json()
    const { title, description, category, duration, targetAudience, features, imageUrl, price, isFeatured, showOnHome, isActive, position } = body

    if (!title || !description) {
      return NextResponse.json({ error: 'Title and description are required' }, { status: 400 })
    }

    const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')

    let finalPosition = position || 0
    if (showOnHome && !position) {
      const maxPos = await prisma.program.aggregate({ _max: { position: true }, where: { showOnHome: true } })
      finalPosition = (maxPos._max.position || 0) + 1
    }

    const newProgram = await prisma.program.create({
      data: {
        title,
        slug,
        description,
        category: category || 'General',
        duration: duration || '3 Months',
        targetAudience: targetAudience || 'All Grades',
        features: Array.isArray(features) ? features : features ? [features] : [],
        imageUrl: imageUrl || null,
        price: price || 'Contact for Pricing',
        isFeatured: Boolean(isFeatured),
        showOnHome: Boolean(showOnHome),
        isActive: isActive !== undefined ? Boolean(isActive) : true,
        position: finalPosition,
      },
    })

    return NextResponse.json(newProgram, { status: 201 })
  } catch (error) {
    console.error('Error creating program:', error)
    return NextResponse.json({ error: 'Failed to create program' }, { status: 500 })
  }
}

export async function PUT(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await req.json()
    const { id, title, description, category, duration, targetAudience, features, imageUrl, price, isFeatured, showOnHome, isActive, position } = body

    if (!id) {
      return NextResponse.json({ error: 'Program ID required' }, { status: 400 })
    }

    const slug = title ? title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') : undefined

    const updated = await prisma.program.update({
      where: { id },
      data: {
        ...(title && { title, slug }),
        ...(description && { description }),
        ...(category && { category }),
        ...(duration && { duration }),
        ...(targetAudience && { targetAudience }),
        ...(features && { features: Array.isArray(features) ? features : [features] }),
        ...(imageUrl !== undefined && { imageUrl }),
        ...(price !== undefined && { price }),
        ...(isFeatured !== undefined && { isFeatured: Boolean(isFeatured) }),
        ...(showOnHome !== undefined && { showOnHome: Boolean(showOnHome) }),
        ...(isActive !== undefined && { isActive: Boolean(isActive) }),
        ...(position !== undefined && { position: Number(position) }),
      },
    })

    return NextResponse.json(updated)
  } catch (error) {
    console.error('Error updating program:', error)
    return NextResponse.json({ error: 'Failed to update program' }, { status: 500 })
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
      return NextResponse.json({ error: 'Program ID required' }, { status: 400 })
    }

    const deleted = await prisma.program.findUnique({ where: { id }, select: { position: true, showOnHome: true } })

    await prisma.program.delete({ where: { id } })

    if (deleted?.showOnHome && deleted.position > 0) {
      await prisma.program.updateMany({
        where: { showOnHome: true, position: { gt: deleted.position } },
        data: { position: { decrement: 1 } },
      })
    }

    return NextResponse.json({ success: true, id })
  } catch (error) {
    console.error('Error deleting program:', error)
    return NextResponse.json({ error: 'Failed to delete program' }, { status: 500 })
  }
}
