export const dynamic = 'force-dynamic'

import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

async function getUserFromToken(token: string) {
  const session = await prisma.session.findUnique({
    where: { token },
    include: { user: true },
  })
  if (!session) return null
  if (session.expiresAt < new Date()) return null
  return session.user
}

export async function GET(req: NextRequest) {
  try {
    const token = req.headers.get('Authorization')?.replace('Bearer ', '')
    if (!token) {
      return NextResponse.json({ error: 'Not logged in' }, { status: 401 })
    }

    const user = await getUserFromToken(token)
    if (!user) {
      return NextResponse.json({ error: 'Session expired. Please login again.' }, { status: 401 })
    }

    const children = await prisma.child.findMany({
      where: { userId: user.id },
      include: {
        skillProfiles: {
          orderBy: { createdAt: 'desc' },
          take: 3,
        },
        badges: {
          include: { badge: true },
          orderBy: { earnedAt: 'desc' },
        },
        assessments: {
          orderBy: { startedAt: 'desc' },
          take: 5,
          select: {
            id:          true,
            status:      true,
            startedAt:   true,
            completedAt: true,
            currentQ:    true,
            totalQ:      true,
          },
        },
        _count: {
          select: { activityLogs: true },
        },
      },
    })

    return NextResponse.json({
      user: {
        id:    user.id,
        name:  user.name,
        email: user.email,
        plan:  user.plan,
      },
      children,
    })
  } catch (err) {
    console.error('[GET /api/dashboard]', err)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
