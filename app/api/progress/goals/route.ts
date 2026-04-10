export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'
export const maxDuration = 30

import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// GET — fetch all goals for a child
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const childId = searchParams.get('childId')
    if (!childId) return NextResponse.json({ error: 'Missing childId' }, { status: 400 })

    const goals = await prisma.goal.findMany({
      where: { childId },
      orderBy: { createdAt: 'desc' },
    })

    return NextResponse.json({ goals })
  } catch {
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}

// POST — create a new goal
export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { childId, type, title, description, skill, targetScore, subject, targetMarks, examName, deadline } = body

    if (!childId || !type || !title) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    const goal = await prisma.goal.create({
      data: {
        childId,
        type: type as 'SKILL' | 'ACADEMIC',
        title,
        description,
        skill: skill ? skill as any : null,
        targetScore: targetScore || null,
        subject:     subject || null,
        targetMarks: targetMarks || null,
        examName:    examName || null,
        deadline:    deadline ? new Date(deadline) : null,
      },
    })

    return NextResponse.json({ goal })
  } catch {
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}

// PATCH — mark goal as achieved
export async function PATCH(req: NextRequest) {
  try {
    const body = await req.json()
    const { goalId, achieved, currentValue } = body

    if (!goalId) return NextResponse.json({ error: 'Missing goalId' }, { status: 400 })

    const goal = await prisma.goal.update({
      where: { id: goalId },
      data: {
        achieved:     achieved ?? undefined,
        achievedAt:   achieved ? new Date() : undefined,
        currentValue: currentValue ?? undefined,
      },
    })

    return NextResponse.json({ goal })
  } catch {
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}

// DELETE — delete a goal
export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const goalId = searchParams.get('goalId')
    if (!goalId) return NextResponse.json({ error: 'Missing goalId' }, { status: 400 })

    await prisma.goal.delete({ where: { id: goalId } })
    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
