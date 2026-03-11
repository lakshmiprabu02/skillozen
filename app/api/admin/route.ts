export const dynamic = 'force-dynamic'

import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'admin@skillozen2024'

function isAuthorized(req: NextRequest): boolean {
  const auth = req.headers.get('Authorization') || ''
  const token = auth.replace('Bearer ', '')
  return token === ADMIN_PASSWORD
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    if (body.password !== ADMIN_PASSWORD) {
      return NextResponse.json({ error: 'Invalid password' }, { status: 401 })
    }
    return NextResponse.json({ token: ADMIN_PASSWORD })
  } catch {
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}

export async function GET(req: NextRequest) {
  if (!isAuthorized(req)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const action = req.nextUrl.searchParams.get('action') || 'stats'

    if (action === 'export') {
      const users = await prisma.user.findMany({
        orderBy: { createdAt: 'desc' },
      })
      const rows = ['Email,Name,Plan,Joined']
      for (const u of users) {
        rows.push(
          u.email + ',' +
          (u.name || '') + ',' +
          u.plan + ',' +
          u.createdAt.toISOString()
        )
      }
      return new NextResponse(rows.join('\n'), {
        headers: {
          'Content-Type': 'text/csv',
          'Content-Disposition': 'attachment; filename="users.csv"',
        },
      })
    }

    const totalUsers = await prisma.user.count()
    const totalChildren = await prisma.child.count()
    const totalAssessments = await prisma.assessment.count()
    const completedAssessments = await prisma.assessment.count({
      where: { status: 'COMPLETED' },
    })
    const totalActivities = await prisma.activityLog.count()

    const recentSignups = await prisma.user.findMany({
      take: 50,
      orderBy: { createdAt: 'desc' },
      include: { _count: { select: { children: true } } },
    })

    const planBreakdown = await prisma.user.groupBy({
      by: ['plan'],
      _count: { id: true },
    })

    const usageByFeature = await prisma.toolUsage.groupBy({
      by: ['feature'],
      _count: { id: true },
      orderBy: { _count: { id: 'desc' } },
    })

    const profiles = await prisma.skillProfile.findMany()

    const skillBreakdown = profiles.length > 0
      ? [
          {
            skill: 'CRITICAL_THINKING',
            avgScore: Math.round(profiles.reduce((s, p) => s + p.criticalThinking, 0) / profiles.length),
            count: profiles.length,
          },
          {
            skill: 'COMMUNICATION',
            avgScore: Math.round(profiles.reduce((s, p) => s + p.communication, 0) / profiles.length),
            count: profiles.length,
          },
          {
            skill: 'SOCIAL_EMOTIONAL',
            avgScore: Math.round(profiles.reduce((s, p) => s + p.socialEmotional, 0) / profiles.length),
            count: profiles.length,
          },
          {
            skill: 'CREATIVITY',
            avgScore: Math.round(profiles.reduce((s, p) => s + p.creativity, 0) / profiles.length),
            count: profiles.length,
          },
          {
            skill: 'DIGITAL_LITERACY',
            avgScore: Math.round(profiles.reduce((s, p) => s + p.digitalLiteracy, 0) / profiles.length),
            count: profiles.length,
          },
        ]
      : []

    return NextResponse.json({
      totalUsers,
      totalChildren,
      totalAssessments,
      completedAssessments,
      totalActivities,
      recentSignups: recentSignups.map((u) => ({
        id: u.id,
        email: u.email,
        name: u.name,
        plan: u.plan,
        createdAt: u.createdAt.toISOString(),
        _count: u._count,
      })),
      planBreakdown,
      usageByFeature,
      skillBreakdown,
      dailySignups: [],
    })
  } catch {
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}