export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'
export const maxDuration = 30

import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { TIER1_QUESTIONS, TIER2_QUESTIONS, TIER3_QUESTIONS } from '@/lib/questions'

function getTier(age: number): 1 | 2 | 3 {
  if (age <= 7)  return 1
  if (age <= 12) return 2
  return 3
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { assessmentId, questionIndex, childAge } = body

    const assessment = await prisma.assessment.findUnique({
      where: { id: assessmentId },
    })
    if (!assessment) {
      return NextResponse.json({ error: 'Assessment not found' }, { status: 404 })
    }

    let qMeta: { skill: string; index: number } | undefined

    if (assessment.questionOrder) {
      const storedOrder = assessment.questionOrder as { skill: string; index: number }[]
      qMeta = storedOrder[questionIndex]
    }

    if (!qMeta) {
      return NextResponse.json({ error: 'Invalid question index' }, { status: 400 })
    }

    const tier = getTier(childAge || 10)
    let rawQuestion: Record<string, unknown>

    if (tier === 1) {
      rawQuestion = { ...TIER1_QUESTIONS[qMeta.skill][qMeta.index], questionType: 'emoji', tier: 1 }
    } else if (tier === 2) {
      rawQuestion = { ...TIER2_QUESTIONS[qMeta.skill][qMeta.index], questionType: 'story', tier: 2 }
    } else {
      rawQuestion = { ...TIER3_QUESTIONS[qMeta.skill][qMeta.index], questionType: 'choice', tier: 3 }
    }

    // ── Normalise field name so frontend always receives `questionText` ──
    const question = {
      ...rawQuestion,
      questionText: (rawQuestion.questionText || rawQuestion.question || '') as string,
    }
    delete question.question

    await prisma.assessment.update({
      where: { id: assessmentId },
      data: { currentQ: questionIndex },
    })

    return NextResponse.json({ question })
  } catch {
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}