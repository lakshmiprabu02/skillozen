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
        // Check plan and child limit
    const user = await prisma.user.findUnique({ where: { id: userId } })
    const childCount = await prisma.child.count({ where: { userId } })
    
    const limits: Record<string, number> = {
      FREE:     1,
      STANDARD: 3,
      PREMIUM:  5,
    }
    
    const limit = limits[user?.plan || 'FREE']
    if (childCount >= limit) {
      return NextResponse.json({
        error: `Your ${user?.plan} plan allows maximum ${limit} child ${limit === 1 ? 'profile' : 'profiles'}. Please upgrade to add more children.`
      }, { status: 403 })
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
