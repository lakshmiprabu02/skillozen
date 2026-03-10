// app/api/training/complete/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { levelFromXp, checkRateLimit } from '@/lib/utils'
import { z } from 'zod'

const Schema = z.object({
  childId:    z.string(),
  activityId: z.string(),
  score:      z.number().min(0).max(100).optional(),
})

// Badge thresholds
const BADGE_CHECKS = [
  { id: 'explorer', xpThreshold: 100 },
  { id: 'week-warrior', xpThreshold: 70 },
  { id: 'xp-legend', xpThreshold: 500 },
]

export async function POST(req: NextRequest) {
  const ip = req.headers.get('x-forwarded-for') || 'unknown'
  if (!checkRateLimit(`training-complete:${ip}`, 30, 60_000)) {
    return NextResponse.json({ error: 'Too many requests' }, { status: 429 })
  }

  try {
    const body = await req.json()
    const { childId, activityId, score } = Schema.parse(body)

    // Verify child and activity exist
    const [child, activity] = await Promise.all([
      prisma.child.findUnique({ where: { id: childId } }),
      prisma.activity.findUnique({ where: { id: activityId } }),
    ])
    if (!child)    return NextResponse.json({ error: 'Child not found' }, { status: 404 })
    if (!activity) return NextResponse.json({ error: 'Activity not found' }, { status: 404 })

    // Check if already completed (prevent XP farming)
    const alreadyDone = await prisma.activityLog.findFirst({
      where: { childId, activityId },
    })

    let xpEarned = 0
    let newBadges: string[] = []

    if (!alreadyDone) {
      // Calculate XP (base + bonus for high score)
      xpEarned = activity.xpReward
      if (score && score >= 90) xpEarned = Math.round(xpEarned * 1.2)
      if (score && score >= 100) xpEarned = Math.round(xpEarned * 1.5)

      // Log completion
      await prisma.activityLog.create({
        data: { childId, activityId, xpEarned, score },
      })

      // Update child XP and level
      const newTotalXp = child.totalXp + xpEarned
      const newLevel   = levelFromXp(newTotalXp)

      await prisma.child.update({
        where: { id: childId },
        data: {
          totalXp:    newTotalXp,
          level:      newLevel,
          lastActive: new Date(),
          streakDays: { increment: 0 }, // streak updated separately
        },
      })

      // Award first-step badge if this is first activity
      const activityCount = await prisma.activityLog.count({ where: { childId } })
      if (activityCount === 1) {
        try {
          await prisma.childBadge.create({
            data: { childId, badgeId: 'first-step' },
          })
          newBadges.push('First Step')
        } catch { /* already has badge */ }
      }

      // Check XP-based badges
      for (const check of BADGE_CHECKS) {
        if (newTotalXp >= check.xpThreshold) {
          const exists = await prisma.childBadge.findUnique({
            where: { childId_badgeId: { childId, badgeId: check.id } },
          })
          if (!exists) {
            try {
              await prisma.childBadge.create({ data: { childId, badgeId: check.id } })
              const badge = await prisma.badge.findUnique({ where: { id: check.id } })
              if (badge) newBadges.push(badge.name)
            } catch { /* race condition, badge already exists */ }
          }
        }
      }

      // Log tool usage
      await prisma.toolUsage.create({
        data: {
          userId:  child.userId,
          feature: 'training',
          action:  'complete_activity',
          metadata: { activityId, skill: activity.skill, xpEarned },
        },
      })
    }

    return NextResponse.json({
      xpEarned,
      alreadyCompleted: !!alreadyDone,
      newBadges,
      totalXp: child.totalXp + xpEarned,
      level:   levelFromXp(child.totalXp + xpEarned),
    })
  } catch (err) {
    if (err instanceof z.ZodError) {
      return NextResponse.json({ error: 'Invalid input' }, { status: 400 })
    }
    console.error('[POST /api/training/complete]', err)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
