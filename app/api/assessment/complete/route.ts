// app/api/assessment/complete/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { scoreAnswer, generateSkillProfile } from '@/lib/openai'
import { getAgeGroup, checkRateLimit } from '@/lib/utils'
import { z } from 'zod'

const SubmitSchema = z.object({
  assessmentId:  z.string(),
  questionIndex: z.number().min(0).max(19),
  questionText:  z.string(),
  skill:         z.string(),
  answerText:    z.string(),
  selectedOption: z.number().optional(),
  options:       z.array(z.string()).optional(),
  childAge:      z.number().min(4).max(20),
})

export async function POST(req: NextRequest) {
  const ip = req.headers.get('x-forwarded-for') || 'unknown'
  if (!checkRateLimit(`assessment-submit:${ip}`, 60, 60_000)) {
    return NextResponse.json({ error: 'Too many requests' }, { status: 429 })
  }

  try {
    const body = await req.json()
    const data = SubmitSchema.parse(body)

    const assessment = await prisma.assessment.findUnique({
      where: { id: data.assessmentId },
      include: { child: true, answers: true },
    })
    if (!assessment) return NextResponse.json({ error: 'Assessment not found' }, { status: 404 })
    if (assessment.status !== 'IN_PROGRESS') {
      return NextResponse.json({ error: 'Assessment not in progress' }, { status: 400 })
    }

    // Score the answer (AI or fallback)
    let scoreResult = { score: 5, reasoning: 'Auto-scored', positiveNote: 'Good thinking!' }
    try {
      scoreResult = await scoreAnswer({
        childAge:       data.childAge,
        questionText:   data.questionText,
        skill:          data.skill,
        answer:         data.answerText,
        options:        data.options,
        selectedOption: data.selectedOption,
      })
    } catch {
      // Fallback scoring based on answer length / choice quality
      const isChoice = data.selectedOption !== null
      scoreResult.score = isChoice ? 6 : Math.min(10, Math.max(3, Math.floor(data.answerText.length / 20)))
    }

    // Save the answer
    await prisma.assessmentAnswer.create({
      data: {
        assessmentId: data.assessmentId,
        questionIndex: data.questionIndex,
        questionText: data.questionText,
        skill:        data.skill as 'CRITICAL_THINKING' | 'COMMUNICATION' | 'SOCIAL_EMOTIONAL' | 'CREATIVITY' | 'DIGITAL_LITERACY',
        answerText:   data.answerText,
        score:        scoreResult.score,
        reasoning:    scoreResult.reasoning,
      },
    })

    // Build previous answers list for adaptive questioning
    const allAnswers = [...assessment.answers, {
      skill: data.skill, score: scoreResult.score
    }].map((a) => ({ skill: a.skill, score: a.score }))

    // Check if this is the last question (question 19 = index 19)
    const isLastQuestion = data.questionIndex >= 19
    let assessmentComplete = false
    let profileId: string | undefined

    if (isLastQuestion) {
      // Generate final skill profile
      const freshAssessment = await prisma.assessment.findUnique({
        where: { id: data.assessmentId },
        include: { answers: true, child: true },
      })

      if (freshAssessment) {
        let profileData
        try {
          profileData = await generateSkillProfile({
            childName: freshAssessment.child.name,
            childAge:  data.childAge,
            answers: freshAssessment.answers.map((a) => ({
              skill:        a.skill,
              score:        a.score,
              questionText: a.questionText,
              answerText:   a.answerText,
            })),
          })
        } catch {
          // Fallback: compute scores manually
          const skillTotals: Record<string, number[]> = {}
          for (const a of freshAssessment.answers) {
            if (!skillTotals[a.skill]) skillTotals[a.skill] = []
            skillTotals[a.skill].push(a.score)
          }
          const avg = (arr: number[]) => Math.round((arr.reduce((a,b)=>a+b,0)/arr.length)*10)
          const ct  = avg(skillTotals.CRITICAL_THINKING || [5])
          const cm  = avg(skillTotals.COMMUNICATION || [5])
          const se  = avg(skillTotals.SOCIAL_EMOTIONAL || [5])
          const cr  = avg(skillTotals.CREATIVITY || [5])
          const dl  = avg(skillTotals.DIGITAL_LITERACY || [5])
          profileData = {
            criticalThinking: ct, communication: cm, socialEmotional: se,
            creativity: cr, digitalLiteracy: dl,
            overallScore: Math.round((ct+cm+se+cr+dl)/5),
            strengths: ['Strong foundational thinking skills', 'Good engagement with challenges'],
            gaps: ['Areas identified for growth and practice'],
            recommendations: ['Start with daily 10-minute skill activities', 'Focus on your lowest-scoring skill first', 'Retake assessment in 3 months to track progress'],
            summary: `${freshAssessment.child.name} has completed their first skill assessment. The personalised training modules will help strengthen each skill area.`,
            criticalThinkingPct: 55, communicationPct: 55, socialEmotionalPct: 55,
            creativityPct: 55, digitalLiteracyPct: 55,
          }
        }

        // Save skill profile
        const profile = await prisma.skillProfile.create({
          data: {
            childId:             freshAssessment.childId,
            assessmentId:        data.assessmentId,
            criticalThinking:    profileData.criticalThinking,
            communication:       profileData.communication,
            socialEmotional:     profileData.socialEmotional,
            creativity:          profileData.creativity,
            digitalLiteracy:     profileData.digitalLiteracy,
            overallScore:        profileData.overallScore,
            ageGroup:            getAgeGroup(data.childAge),
            strengths:           profileData.strengths,
            gaps:                profileData.gaps,
            recommendations:     profileData.recommendations,
            summary:             profileData.summary,
            criticalThinkingPct: profileData.criticalThinkingPct,
            communicationPct:    profileData.communicationPct,
            socialEmotionalPct:  profileData.socialEmotionalPct,
            creativityPct:       profileData.creativityPct,
            digitalLiteracyPct:  profileData.digitalLiteracyPct,
          },
        })
        profileId = profile.id

        // Mark assessment as completed
        await prisma.assessment.update({
          where: { id: data.assessmentId },
          data:  { status: 'COMPLETED', completedAt: new Date(), currentQ: 20 },
        })

        // Update child XP (+50 for completing assessment)
        await prisma.child.update({
          where: { id: freshAssessment.childId },
          data:  { totalXp: { increment: 50 }, lastActive: new Date() },
        })

        assessmentComplete = true
      }
    }

    return NextResponse.json({
      score:             scoreResult.score,
      positiveNote:      scoreResult.positiveNote,
      previousAnswers:   allAnswers,
      assessmentComplete,
      profileId,
    })
  } catch (err) {
    if (err instanceof z.ZodError) {
      return NextResponse.json({ error: 'Invalid input', details: err.errors }, { status: 400 })
    }
    console.error('[POST /api/assessment/complete]', err)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
