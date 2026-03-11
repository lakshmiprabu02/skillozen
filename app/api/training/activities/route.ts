export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

// app/api/training/activities/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getAgeGroup, checkRateLimit } from '@/lib/utils'
import { AgeGroup } from '@prisma/client'

export async function GET(req: NextRequest) {
  const childId  = req.nextUrl.searchParams.get('childId')
  const childAge = parseInt(req.nextUrl.searchParams.get('childAge') || '10')
  const skill    = req.nextUrl.searchParams.get('skill')

  if (!childId) return NextResponse.json({ error: 'childId required' }, { status: 400 })

  const ip = req.headers.get('x-forwarded-for') || 'unknown'
  if (!checkRateLimit(`training-activities:${ip}`, 30, 60_000)) {
    return NextResponse.json({ error: 'Too many requests' }, { status: 429 })
  }

  try {
    const child = await prisma.child.findUnique({
      where: { id: childId },
      include: {
        activityLogs: {
          orderBy: { completedAt: 'desc' },
          take: 50,
        },
      },
    })
    if (!child) return NextResponse.json({ error: 'Child not found' }, { status: 404 })

    const ageGroup = getAgeGroup(childAge)

    // Fetch age-appropriate activities
    const activities = await prisma.activity.findMany({
      where: {
        isActive: true,
        ageGroup: { has: ageGroup },
        ...(skill ? { skill: skill as 'CRITICAL_THINKING' | 'COMMUNICATION' | 'SOCIAL_EMOTIONAL' | 'CREATIVITY' | 'DIGITAL_LITERACY' } : {}),
      },
      orderBy: [{ difficulty: 'asc' }, { createdAt: 'desc' }],
    })

    const completedIds = child.activityLogs.map((l) => l.activityId)
    const logs = child.activityLogs.slice(0, 20).map((l) => ({
      activityId:  l.activityId,
      completedAt: l.completedAt,
      xpEarned:    l.xpEarned,
    }))

    // Calculate streak
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    let streakDays = 0
    const checkDate = new Date(today)
    while (true) {
      const dayStr = checkDate.toDateString()
      const hasActivity = child.activityLogs.some(
        (l) => new Date(l.completedAt).toDateString() === dayStr
      )
      if (!hasActivity) break
      streakDays++
      checkDate.setDate(checkDate.getDate() - 1)
    }

    return NextResponse.json({
      activities,
      completedIds,
      logs,
      totalXp:    child.totalXp,
      level:      child.level,
      streakDays,
    })
  } catch (err) {
    console.error('[GET /api/training/activities]', err)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
