export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

// app/api/admin/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { checkRateLimit } from '@/lib/utils'

const JWT_SECRET = process.env.ADMIN_JWT_SECRET || 'dev-secret-change-in-production'

function verifyToken(req: NextRequest): boolean {
  const auth  = req.headers.get('Authorization') || ''
  const token = auth.replace('Bearer ', '')
  try {
    jwt.verify(token, JWT_SECRET)
    return true
  } catch {
    return false
  }
}

// POST /api/admin — Login
export async function POST(req: NextRequest) {
  const ip = req.headers.get('x-forwarded-for') || 'unknown'
  if (!checkRateLimit(`admin-login:${ip}`, 5, 60_000)) {
    return NextResponse.json({ error: 'Too many attempts' }, { status: 429 })
  }

  try {
    const { password } = await req.json()

    const admin = await prisma.admin.findFirst()
    if (!admin) return NextResponse.json({ error: 'No admin configured' }, { status: 401 })

    const valid = await bcrypt.compare(password, admin.passwordHash)
    if (!valid) return NextResponse.json({ error: 'Invalid password' }, { status: 401 })

    const token = jwt.sign({ adminId: admin.id }, JWT_SECRET, { expiresIn: '24h' })
    return NextResponse.json({ token })
  } catch {
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}

// GET /api/admin — Stats or export
export async function GET(req: NextRequest) {
  if (!verifyToken(req)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const action = req.nextUrl.searchParams.get('action') || 'stats'

  // ── CSV EXPORT ──────────────────────────────────────────────────────────────
  if (action === 'export') {
    const users = await prisma.user.findMany({
      include: { children: { select: { name: true, age: true } } },
      orderBy: { createdAt: 'desc' },
    })

    const rows = ['Email,Name,Plan,Children,Joined']
    for (const u of users) {
      const children = u.children.map((c) => `${c.name}(${c.age})`).join('; ')
      rows.push(`${u.email},${u.name || ''},${u.plan},${children},${u.createdAt.toISOString()}`)
    }

    return new NextResponse(rows.join('\n'), {
      headers: {
        'Content-Type':        'text/csv',
        'Content-Disposition': 'attachment; filename="skillozen-users.csv"',
      },
    })
  }

  // ── DASHBOARD STATS ─────────────────────────────────────────────────────────
  const [
    totalUsers,
    totalChildren,
    totalAssessments,
    completedAssessments,
    totalActivities,
    recentSignups,
    planBreakdown,
    usageByFeature,
    skillBreakdown,
  ] = await Promise.all([
    prisma.user.count(),
    prisma.child.count(),
    prisma.assessment.count(),
    prisma.assessment.count({ where: { status: 'COMPLETED' } }),
    prisma.activityLog.count(),
    prisma.user.findMany({
      take: 50,
      orderBy: { createdAt: 'desc' },
      include: { _count: { select: { children: true } } },
    }),
    prisma.user.groupBy({
      by: ['plan'],
      _count: { id: true },
    }),
    prisma.toolUsage.groupBy({
      by: ['feature'],
      _count: { id: true },
      orderBy: { _count: { id: 'desc' } },
    }),
    // Average skill scores from skill profiles
    prisma.$queryRaw<Array<{ skill: string; avg: number; count: bigint }>>`
      SELECT
        unnest(ARRAY['criticalThinking','communication','socialEmotional','creativity','digitalLiteracy']) as skill,
        ROUND(AVG(CASE
          WHEN unnest(ARRAY['criticalThinking','communication','socialEmotional','creativity','digitalLiteracy']) = 'criticalThinking' THEN "criticalThinking"
          WHEN unnest(ARRAY['criticalThinking','communication','socialEmotional','creativity','digitalLiteracy']) = 'communication' THEN communication
          WHEN unnest(ARRAY['criticalThinking','communication','socialEmotional','creativity','digitalLiteracy']) = 'socialEmotional' THEN "socialEmotional"
          WHEN unnest(ARRAY['criticalThinking','communication','socialEmotional','creativity','digitalLiteracy']) = 'creativity' THEN creativity
          ELSE "digitalLiteracy"
        END)) as avg,
        COUNT(*) as count
      FROM skill_profiles
      GROUP BY skill
    `.catch(() => []),
  ])

  // Simpler skill breakdown if raw query fails
  const profiles = await prisma.skillProfile.findMany()
  const simpleSkillBreakdown = profiles.length > 0 ? [
    { skill: 'CRITICAL_THINKING', avgScore: Math.round(profiles.reduce((s,p)=>s+p.criticalThinking,0)/profiles.length), count: profiles.length },
    { skill: 'COMMUNICATION',     avgScore: Math.round(profiles.reduce((s,p)=>s+p.communication,0)/profiles.length),     count: profiles.length },
    { skill: 'SOCIAL_EMOTIONAL',  avgScore: Math.round(profiles.reduce((s,p)=>s+p.socialEmotional,0)/profiles.length),   count: profiles.length },
    { skill: 'CREATIVITY',        avgScore: Math.round(profiles.reduce((s,p)=>s+p.creativity,0)/profiles.length),         count: profiles.length },
    { skill: 'DIGITAL_LITERACY',  avgScore: Math.round(profiles.reduce((s,p)=>s+p.digitalLiteracy,0)/profiles.length),   count: profiles.length },
  ] : []

  return NextResponse.json({
    totalUsers,
    totalChildren,
    totalAssessments,
    completedAssessments,
    totalActivities,
    recentSignups: recentSignups.map((u) => ({
      id:        u.id,
      email:     u.email,
      name:      u.name,
      plan:      u.plan,
      createdAt: u.createdAt.toISOString(),
      _count:    u._count,
    })),
    planBreakdown,
    usageByFeature,
    skillBreakdown: simpleSkillBreakdown,
    dailySignups: [],
  })
}
