export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'
export const maxDuration = 30

import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// GET — fetch results for an exam
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const examId = searchParams.get('examId')
    if (!examId) return NextResponse.json({ error: 'Missing examId' }, { status: 400 })

    const results = await prisma.examResult.findMany({
      where: { examId },
      include: { subject: true },
    })

    return NextResponse.json({ results })
  } catch {
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}

// POST — save marks for an exam
export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { examId, childId, results } = body

    if (!examId || !childId || !results?.length) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    const saved = await Promise.all(
      results.map(async (r: { subjectId: string; marksObtained: number; remarks?: string }) => {
        const subject = await prisma.examSubject.findUnique({ where: { id: r.subjectId } })
        const percentage = subject ? (r.marksObtained / subject.maxMarks) * 100 : 0
        const grade =
          percentage >= 90 ? 'A+' :
          percentage >= 80 ? 'A'  :
          percentage >= 70 ? 'B+' :
          percentage >= 60 ? 'B'  :
          percentage >= 50 ? 'C'  :
          percentage >= 40 ? 'D'  : 'F'

        return prisma.examResult.upsert({
          where: { examId_subjectId: { examId, subjectId: r.subjectId } },
          update: { marksObtained: r.marksObtained, grade, remarks: r.remarks, childId },
          create: { examId, subjectId: r.subjectId, childId, marksObtained: r.marksObtained, grade, remarks: r.remarks },
        })
      })
    )

    return NextResponse.json({ results: saved })
  } catch {
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
