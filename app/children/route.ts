export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { userId, childName, childAge, avatarEmoji } = body

    if (!userId || !childName || !childAge) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    // Check for duplicate
    const existing = await prisma.child.findFirst({
      where: {
        userId,
        name: { equals: childName, mode: 'insensitive' },
      },
    })

    if (existing) {
      return NextResponse.json({ error: 'A child with this name already exists' }, { status: 400 })
    }

    const child = await prisma.child.create({
      data: {
        userId,
        name: childName,
        age: childAge,
        avatarEmoji: avatarEmoji || '🧒',
      },
    })

    return NextResponse.json({ child })
  } catch {
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
