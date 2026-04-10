export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'
export const maxDuration = 30

import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// GET — fetch all exams for a child
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const childId = searchParams.get('childId')
    if (!childId) return NextResponse.json({ error: 'Missing childId' }, { status: 400 })

    const exams = await prisma.exam.findMany({
      where: { childId },
      include: {
        subjects: { orderBy: { order: 'asc' } },
        results:  true,
      },
      orderBy: { createdAt: 'desc' },
    })

    return NextResponse.json({ exams })
  } catch {
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}

// POST — create a new exam
export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { childId, name, academicYear, examDate, subjects } = body

    if (!childId || !name || !subjects?.length) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    const exam = await prisma.exam.create({
      data: {
        childId,
        name,
        academicYear: academicYear || new Date().getFullYear().toString(),
        examDate:     examDate ? new Date(examDate) : null,
        subjects: {
          create: subjects.map((s: { name: string; maxMarks: number }, i: number) => ({
            name:     s.name,
            maxMarks: s.maxMarks || 100,
            order:    i,
          })),
        },
      },
      include: { subjects: true },
    })

    return NextResponse.json({ exam })
  } catch {
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}

// DELETE — delete an exam
export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const examId = searchParams.get('examId')
    if (!examId) return NextResponse.json({ error: 'Missing examId' }, { status: 400 })

    await prisma.exam.delete({ where: { id: examId } })
    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
