export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'
export const maxDuration = 30

import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { openai } from '@/lib/openai'

// GET — fetch latest weekly report
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const childId = searchParams.get('childId')
    if (!childId) return NextResponse.json({ error: 'Missing childId' }, { status: 400 })

    const report = await prisma.weeklyReport.findFirst({
      where: { childId },
      orderBy: { createdAt: 'desc' },
    })

    return NextResponse.json({ report })
  } catch {
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}

// POST — generate a new weekly report
export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { childId } = body
    if (!childId) return NextResponse.json({ error: 'Missing childId' }, { status: 400 })

    // Fetch child data
    const child = await prisma.child.findUnique({
      where: { id: childId },
      include: {
        skillProfiles: { orderBy: { createdAt: 'desc' }, take: 2 },
        activityLogs:  {
          orderBy: { createdAt: 'desc' },
          take: 20,
          include: { activity: true },
        },
        exams: {
          orderBy: { createdAt: 'desc' },
          take: 3,
          include: { subjects: true, results: true },
        },
        goals: { where: { achieved: false } },
      },
    })

    if (!child) return NextResponse.json({ error: 'Child not found' }, { status: 404 })

    // Build context for AI
    const recentActivities = child.activityLogs.map(l =>
      `${l.activity?.skill} — ${l.activity?.title} (+${l.xpEarned} XP)`
    ).join('\n')

    const skillScores = child.skillProfiles[0] ? `
      Critical Thinking: ${child.skillProfiles[0].criticalThinking}
      Communication: ${child.skillProfiles[0].communication}
      Social-Emotional: ${child.skillProfiles[0].socialEmotional}
      Creativity: ${child.skillProfiles[0].creativity}
      Digital Literacy: ${child.skillProfiles[0].digitalLiteracy}
      Financial Literacy: ${child.skillProfiles[0].financialLiteracy}
      Health & Wellness: ${child.skillProfiles[0].healthWellness}
      Goal Setting: ${child.skillProfiles[0].goalSetting}
      Scientific Thinking: ${child.skillProfiles[0].scientificThinking}
      Public Speaking: ${child.skillProfiles[0].publicSpeaking}
    ` : 'No assessment yet'

    const prompt = `Generate a warm encouraging weekly progress report for ${child.name} aged ${child.age}.

Skill Scores: ${skillScores}
Recent Activities (last 7 days): ${recentActivities || 'None this week'}
Current Streak: ${child.streakDays} days
Total XP: ${child.totalXp}
Active Goals: ${child.goals.length}

Write a parent-friendly report in simple English. Return ONLY valid JSON:
{
  "summary": "2-3 sentence overview of the week",
  "highlights": ["highlight 1", "highlight 2", "highlight 3"],
  "concerns": ["concern 1 if any"],
  "recommendations": ["action 1 for parent", "action 2", "action 3"],
  "encouragement": "One warm motivating sentence directly to the child"
}`

    const response = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.7,
      max_tokens: 800,
      response_format: { type: 'json_object' },
    })

    const content = JSON.parse(response.choices[0].message.content || '{}')

    // Calculate week dates
    const now = new Date()
    const weekStart = new Date(now)
    weekStart.setDate(now.getDate() - 7)

    // Save report
    const report = await prisma.weeklyReport.create({
      data: {
        childId,
        weekStart,
        weekEnd:             now,
        summary:             content.summary || '',
        highlights:          content.highlights || [],
        concerns:            content.concerns || [],
        recommendations:     content.recommendations || [],
        encouragement:       content.encouragement || '',
        activitiesCompleted: child.activityLogs.length,
        xpEarned:            child.activityLogs.reduce((sum, l) => sum + l.xpEarned, 0),
        skillsImproved:      [...new Set(child.activityLogs.map(l => l.activity?.skill || ''))],
      },
    })

    return NextResponse.json({ report })
  } catch {
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
