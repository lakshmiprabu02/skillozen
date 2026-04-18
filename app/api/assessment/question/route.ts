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

    // Use stored random question order if available
    let qMeta: { skill: string; index: number } | undefined
    
    if (assessment.questionOrder) {
      const storedOrder = assessment.questionOrder as { skill: string; index: number }[]
      qMeta = storedOrder[questionIndex]
    }
    
    if (!qMeta) {
      return NextResponse.json({ error: 'Invalid question index' }, { status: 400 })
    }

    const tier = getTier(childAge || 10)
    let question: Record<string, unknown>

    if (tier === 1) {
      const q = TIER1_QUESTIONS[qMeta.skill][qMeta.index]
      question = { ...q, questionType: 'emoji', tier: 1 }
    } else if (tier === 2) {
      const q = TIER2_QUESTIONS[qMeta.skill][qMeta.index]
      question = { ...q, questionType: 'story', tier: 2 }
    } else {
      const q = TIER3_QUESTIONS[qMeta.skill][qMeta.index]
      question = { ...q, questionType: 'choice', tier: 3 }
    }

    await prisma.assessment.update({
      where: { id: assessmentId },
      data: { currentQ: questionIndex },
    })

    return NextResponse.json({ question })
  } catch {
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
