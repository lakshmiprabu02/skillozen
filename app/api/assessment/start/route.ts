// app/api/assessment/start/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'
import { checkRateLimit } from '@/lib/utils'

const Schema = z.object({
  childId: z.string().min(1),
})

export async function POST(req: NextRequest) {
  const ip = req.headers.get('x-forwarded-for') || 'unknown'
  if (!checkRateLimit(`assessment-start:${ip}`, 5, 60_000)) {
    return NextResponse.json({ error: 'Too many requests' }, { status: 429 })
  }

  try {
    const body = await req.json()
    const { childId } = Schema.parse(body)

    // Verify child exists
    const child = await prisma.child.findUnique({ where: { id: childId } })
    if (!child) return NextResponse.json({ error: 'Child not found' }, { status: 404 })

    // Abandon any in-progress assessments
    await prisma.assessment.updateMany({
      where: { childId, status: 'IN_PROGRESS' },
      data:  { status: 'ABANDONED' },
    })

    // Create new assessment session
    const assessment = await prisma.assessment.create({
      data: { childId, status: 'IN_PROGRESS', currentQ: 0, totalQ: 20 },
    })

    // Log
    await prisma.toolUsage.create({
      data: {
        userId:  child.userId,
        feature: 'assessment',
        action:  'start',
        metadata: { childId, assessmentId: assessment.id },
      },
    })

    return NextResponse.json({ assessmentId: assessment.id })
  } catch (err) {
    if (err instanceof z.ZodError) {
      return NextResponse.json({ error: 'Invalid input' }, { status: 400 })
    }
    console.error('[POST /api/assessment/start]', err)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
