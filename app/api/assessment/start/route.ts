export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'
export const maxDuration = 30

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
      
      // Check plan and assessment limit
      const user = await prisma.user.findUnique({ where: { id: child.userId } })
      if (user?.plan === 'FREE') {
        const completedAssessments = await prisma.assessment.count({
          where: { childId, status: 'COMPLETED' },
        })
        if (completedAssessments >= 1) {
          return NextResponse.json({ 
            error: 'UPGRADE_REQUIRED',
            message: 'Free plan allows 1 assessment per child. Upgrade to Standard for unlimited assessments.',
          }, { status: 403 })
        }
      }

    // Abandon any in-progress assessments
    await prisma.assessment.updateMany({
      where: { childId, status: 'IN_PROGRESS' },
      data:  { status: 'ABANDONED' },
    })

    // Generate random question order (2 from 6 per skill)
      const SKILLS = [
        'CRITICAL_THINKING', 'COMMUNICATION', 'SOCIAL_EMOTIONAL', 'CREATIVITY',
        'DIGITAL_LITERACY', 'FINANCIAL_LITERACY', 'HEALTH_WELLNESS',
        'GOAL_SETTING', 'SCIENTIFIC_THINKING', 'PUBLIC_SPEAKING'
      ]
      
      function shuffleArray<T>(arr: T[]): T[] {
        const a = [...arr]
        for (let i = a.length - 1; i > 0; i--) {
          const j = Math.floor(Math.random() * (i + 1));
          [a[i], a[j]] = [a[j], a[i]]
        }
        return a
      }
      
      // Get previously seen questions for this child
      const seenQuestions = (child.seenQuestions as Record<string, number[]> | null) || {}
      
      // Pick 2 unseen indices from 0-5 for each skill
      const questionOrder = shuffleArray(
        SKILLS.flatMap(skill => {
          const seen = seenQuestions[skill] || []
          const unseen = [0,1,2,3,4,5].filter(i => !seen.includes(i))
          
          // If less than 2 unseen reset this skill
          const pool = unseen.length >= 2 ? unseen : [0,1,2,3,4,5]
          const indices = shuffleArray(pool).slice(0, 2)
          return indices.map(index => ({ skill, index }))
        })
      )
      
      // Update seen questions for this child
      const updatedSeen: Record<string, number[]> = { ...seenQuestions }
      questionOrder.forEach(({ skill, index }) => {
        if (!updatedSeen[skill]) updatedSeen[skill] = []
        if (!updatedSeen[skill].includes(index)) {
          updatedSeen[skill].push(index)
        }
        // Reset if all 6 seen
        if (updatedSeen[skill].length >= 6) {
          updatedSeen[skill] = []
        }
      })
      
      // Save updated seen questions
      await prisma.child.update({
        where: { id: childId },
        data: { seenQuestions: updatedSeen },
      })
      
      // Create new assessment session
      const assessment = await prisma.assessment.create({
        data: { childId, status: 'IN_PROGRESS', currentQ: 0, totalQ: 20, questionOrder },
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
