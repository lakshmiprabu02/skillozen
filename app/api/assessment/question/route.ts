export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'
export const maxDuration = 30

// app/api/assessment/question/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { generateAssessmentQuestion } from '@/lib/openai'
import { getSkillForQuestion, checkRateLimit } from '@/lib/utils'
import { z } from 'zod'

const Schema = z.object({
  assessmentId:    z.string(),
  questionIndex:   z.number().min(0).max(19),
  childAge:        z.number().min(4).max(20),
  childName:       z.string(),
  previousAnswers: z.array(z.object({ skill: z.string(), score: z.number() })).optional(),
})

// Fallback questions if AI is unavailable
const FALLBACK_QUESTIONS: Record<string, { questionText: string; questionType: string; options?: string[] }> = {
  CRITICAL_THINKING: {
    questionText: 'You notice your friend got a much better grade than you on the same test. What would you do first?',
    questionType: 'choice',
    options: [
      'Ask your friend to share their answers next time',
      'Think about what they might have done differently to prepare',
      'Tell the teacher it is unfair',
      'Give up and assume you are just not smart enough',
    ],
  },
  COMMUNICATION: {
    questionText: 'Your teacher asks you to explain a topic to a younger student who doesn\'t understand it. How would you approach this?',
    questionType: 'open-ended',
  },
  SOCIAL_EMOTIONAL: {
    questionText: 'Your best friend is upset about something but won\'t tell you what. What would you do?',
    questionType: 'choice',
    options: [
      'Leave them alone and pretend nothing is wrong',
      'Tell them everything will be fine without asking more',
      'Gently let them know you\'re there and ask if they\'d like to talk',
      'Ask everyone else what happened',
    ],
  },
  CREATIVITY: {
    questionText: 'You have to give a school project presentation but you can\'t use PowerPoint. What would you do instead?',
    questionType: 'open-ended',
  },
  DIGITAL_LITERACY: {
    questionText: 'You read a news headline that says "Scientists confirm chocolate cures all diseases." What would you do?',
    questionType: 'choice',
    options: [
      'Share it immediately with all your friends',
      'Believe it because it\'s on the internet',
      'Search for the original study and check other sources',
      'Ignore it because it sounds boring',
    ],
  },
}

export async function POST(req: NextRequest) {
  const ip = req.headers.get('x-forwarded-for') || 'unknown'
  if (!checkRateLimit(`assessment-q:${ip}`, 60, 60_000)) {
    return NextResponse.json({ error: 'Too many requests' }, { status: 429 })
  }

  try {
    const body = await req.json()
    const { assessmentId, questionIndex, childAge, childName, previousAnswers } = Schema.parse(body)

    // Verify assessment exists and is in progress
    const assessment = await prisma.assessment.findUnique({ where: { id: assessmentId } })
    if (!assessment) return NextResponse.json({ error: 'Assessment not found' }, { status: 404 })
    if (assessment.status !== 'IN_PROGRESS') {
      return NextResponse.json({ error: 'Assessment already completed' }, { status: 400 })
    }

    const targetSkill = getSkillForQuestion(questionIndex)

    let question
    try {
      question = await generateAssessmentQuestion({
        childAge,
        childName,
        questionIndex,
        previousAnswers: previousAnswers || [],
        targetSkill,
      })
    } catch (aiErr) {
      console.warn('OpenAI unavailable, using fallback question:', aiErr)
      const fallback = FALLBACK_QUESTIONS[targetSkill] || FALLBACK_QUESTIONS.CRITICAL_THINKING
      question = { ...fallback, skill: targetSkill, followUp: 'Take your time — there\'s no wrong answer!' }
    }

    // Update assessment current question
    await prisma.assessment.update({
      where: { id: assessmentId },
      data:  { currentQ: questionIndex },
    })

    return NextResponse.json({ question })
  } catch (err) {
    if (err instanceof z.ZodError) {
      return NextResponse.json({ error: 'Invalid input', details: err.errors }, { status: 400 })
    }
    console.error('[POST /api/assessment/question]', err)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
