// lib/openai.ts — Centralised OpenAI client (server-side only)
import OpenAI from 'openai'

if (!process.env.OPENAI_API_KEY) {
  throw new Error('Missing OPENAI_API_KEY environment variable')
}

export const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

// ─── Skill Profile Generator ──────────────────────────────────────────────────

export interface SkillProfileResult {
  // Original 5
  criticalThinking: number
  communication: number
  socialEmotional: number
  creativity: number
  digitalLiteracy: number
  // New 5
  financialLiteracy: number
  healthWellness: number
  goalSetting: number
  scientificThinking: number
  publicSpeaking: number
  // Overall
  overallScore: number
  strengths: string[]
  gaps: string[]
  recommendations: string[]
  summary: string
  // Percentiles — Original 5
  criticalThinkingPct: number
  communicationPct: number
  socialEmotionalPct: number
  creativityPct: number
  digitalLiteracyPct: number
  // Percentiles — New 5
  financialLiteracyPct: number
  healthWellnessPct: number
  goalSettingPct: number
  scientificThinkingPct: number
  publicSpeakingPct: number
}

export async function generateSkillProfile(params: {
  childName: string
  childAge: number
  answers: Array<{ skill: string; score: number; questionText: string; answerText: string }>
}): Promise<SkillProfileResult> {
  const { childName, childAge, answers } = params

  const skillScores: Record<string, number[]> = {}
  for (const a of answers) {
    if (!skillScores[a.skill]) skillScores[a.skill] = []
    skillScores[a.skill].push(a.score)
  }

  const avgScores: Record<string, number> = {}
  for (const [skill, scores] of Object.entries(skillScores)) {
    avgScores[skill] = Math.round((scores.reduce((a, b) => a + b, 0) / scores.length) * 10)
  }

  const prompt = `Generate a comprehensive skill profile report for ${childName}, aged ${childAge}.

Raw skill averages (0-100 scale): ${JSON.stringify(avgScores)}

The child was assessed on these 10 skills:
1. CRITICAL_THINKING — Critical Thinking and Problem Solving
2. COMMUNICATION — Communication Skills
3. SOCIAL_EMOTIONAL — Social-Emotional Learning
4. CREATIVITY — Creativity and Innovation
5. DIGITAL_LITERACY — Digital Literacy and AI Awareness
6. FINANCIAL_LITERACY — Financial Literacy
7. HEALTH_WELLNESS — Health and Wellness
8. GOAL_SETTING — Goal Setting and Time Management
9. SCIENTIFIC_THINKING — Scientific Thinking and Curiosity
10. PUBLIC_SPEAKING — Public Speaking and Confidence

Generate a parent-friendly skill report. Return ONLY valid JSON:
{
  "criticalThinking": <0-100>,
  "communication": <0-100>,
  "socialEmotional": <0-100>,
  "creativity": <0-100>,
  "digitalLiteracy": <0-100>,
  "financialLiteracy": <0-100>,
  "healthWellness": <0-100>,
  "goalSetting": <0-100>,
  "scientificThinking": <0-100>,
  "publicSpeaking": <0-100>,
  "overallScore": <0-100>,
  "strengths": ["strength 1", "strength 2", "strength 3"],
  "gaps": ["gap 1", "gap 2"],
  "recommendations": ["action step 1", "action step 2", "action step 3"],
  "summary": "2-3 sentence parent-friendly summary",
  "criticalThinkingPct": <0-100>,
  "communicationPct": <0-100>,
  "socialEmotionalPct": <0-100>,
  "creativityPct": <0-100>,
  "digitalLiteracyPct": <0-100>,
  "financialLiteracyPct": <0-100>,
  "healthWellnessPct": <0-100>,
  "goalSettingPct": <0-100>,
  "scientificThinkingPct": <0-100>,
  "publicSpeakingPct": <0-100>
}`

  const response = await openai.chat.completions.create({
    model: 'gpt-4o-mini',
    messages: [{ role: 'user', content: prompt }],
    temperature: 0.4,
    max_tokens: 1000,
    response_format: { type: 'json_object' },
  })

  const content = response.choices[0].message.content || '{}'
  return JSON.parse(content) as SkillProfileResult
}
