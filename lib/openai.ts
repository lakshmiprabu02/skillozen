// lib/openai.ts — Centralised OpenAI client (server-side only)
import OpenAI from 'openai'

if (!process.env.OPENAI_API_KEY) {
  throw new Error('Missing OPENAI_API_KEY environment variable')
}

export const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

// ─── Assessment Question Generator ───────────────────────────────────────────

export interface AssessmentQuestion {
  questionText: string
  questionType: 'scenario' | 'reflection' | 'choice' | 'open-ended'
  skill: 'CRITICAL_THINKING' | 'COMMUNICATION' | 'SOCIAL_EMOTIONAL' | 'CREATIVITY' | 'DIGITAL_LITERACY'
  options?: string[]   // for choice type
  followUp?: string    // adaptive follow-up hint
}

export async function generateAssessmentQuestion(params: {
  childAge: number
  childName: string
  questionIndex: number  // 0-19
  previousAnswers: Array<{ skill: string; score: number }>
  targetSkill: string
}): Promise<AssessmentQuestion> {
  const { childAge, childName, questionIndex, previousAnswers, targetSkill } = params

  const ageGroup = childAge <= 7 ? 'early childhood (4-7)' :
                   childAge <= 12 ? 'middle childhood (8-12)' :
                   childAge <= 17 ? 'teenager (13-17)' : 'young adult (18-20)'

  const prompt = `You are generating question ${questionIndex + 1} of 20 for a skill assessment for ${childName}, aged ${childAge} (${ageGroup}).

Target skill for this question: ${targetSkill}

Previous answer pattern: ${JSON.stringify(previousAnswers.slice(-3))}

Generate ONE age-appropriate, engaging assessment question that:
1. Feels like a game or exploration, NOT a test
2. Is suitable for ${ageGroup}
3. Assesses: ${targetSkill.replace(/_/g, ' ')}
4. Uses relatable scenarios or situations
5. Has a friendly, encouraging tone

Return ONLY valid JSON (no markdown):
{
  "questionText": "the question text here",
  "questionType": "scenario|reflection|choice|open-ended",
  "skill": "${targetSkill}",
  "options": ["option1", "option2", "option3", "option4"],  // ONLY for choice type, omit for others
  "followUp": "optional encouragement or hint text"
}`

  const response = await openai.chat.completions.create({
    model: 'gpt-4o-mini',
    messages: [{ role: 'user', content: prompt }],
    temperature: 0.8,
    max_tokens: 400,
    response_format: { type: 'json_object' },
  })

  const content = response.choices[0].message.content || '{}'
  return JSON.parse(content) as AssessmentQuestion
}

// ─── Answer Scorer ────────────────────────────────────────────────────────────

export interface AnswerScore {
  score: number       // 0-10
  reasoning: string   // brief explanation
  positiveNote: string // encouraging feedback
}

export async function scoreAnswer(params: {
  childAge: number
  questionText: string
  skill: string
  answer: string
  options?: string[]
  selectedOption?: number
}): Promise<AnswerScore> {
  const { childAge, questionText, skill, answer, options, selectedOption } = params

  const prompt = `Score this assessment answer for a ${childAge}-year-old child.

Skill being assessed: ${skill.replace(/_/g, ' ')}
Question: ${questionText}
${options ? `Options: ${options.join(', ')}\nSelected: ${options[selectedOption ?? 0]}` : `Answer: ${answer}`}

Score from 0-10 based on:
- Age-appropriateness (don't penalise for age-expected limitations)
- Depth of thinking demonstrated
- Skill-specific indicators

Return ONLY valid JSON:
{
  "score": 7,
  "reasoning": "brief explanation of the score",
  "positiveNote": "one encouraging sentence for the child"
}`

  const response = await openai.chat.completions.create({
    model: 'gpt-4o-mini',
    messages: [{ role: 'user', content: prompt }],
    temperature: 0.3,
    max_tokens: 200,
    response_format: { type: 'json_object' },
  })

  const content = response.choices[0].message.content || '{}'
  return JSON.parse(content) as AnswerScore
}

// ─── Skill Profile Generator ──────────────────────────────────────────────────

export interface SkillProfileResult {
  criticalThinking: number   // 0-100
  communication: number
  socialEmotional: number
  creativity: number
  digitalLiteracy: number
  overallScore: number
  strengths: string[]
  gaps: string[]
  recommendations: string[]
  summary: string
  // Simulated global percentiles
  criticalThinkingPct: number
  communicationPct: number
  socialEmotionalPct: number
  creativityPct: number
  digitalLiteracyPct: number
}

export async function generateSkillProfile(params: {
  childName: string
  childAge: number
  answers: Array<{ skill: string; score: number; questionText: string; answerText: string }>
}): Promise<SkillProfileResult> {
  const { childName, childAge, answers } = params

  // Pre-aggregate scores by skill
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

Assessment answers summary:
${answers.slice(0, 10).map(a => `- ${a.skill}: Q="${a.questionText.slice(0, 80)}" Score=${a.score}/10`).join('\n')}

Generate a parent-friendly skill report. Return ONLY valid JSON:
{
  "criticalThinking": <0-100>,
  "communication": <0-100>,
  "socialEmotional": <0-100>,
  "creativity": <0-100>,
  "digitalLiteracy": <0-100>,
  "overallScore": <0-100>,
  "strengths": ["strength 1 in plain English", "strength 2", "strength 3"],
  "gaps": ["gap 1 in plain English", "gap 2"],
  "recommendations": ["specific action step 1", "specific action step 2", "specific action step 3"],
  "summary": "2-3 sentence parent-friendly summary of the child's skill profile",
  "criticalThinkingPct": <0-100 global percentile estimate>,
  "communicationPct": <0-100>,
  "socialEmotionalPct": <0-100>,
  "creativityPct": <0-100>,
  "digitalLiteracyPct": <0-100>
}`

  const response = await openai.chat.completions.create({
    model: 'gpt-4o-mini',
    messages: [{ role: 'user', content: prompt }],
    temperature: 0.4,
    max_tokens: 800,
    response_format: { type: 'json_object' },
  })

  const content = response.choices[0].message.content || '{}'
  return JSON.parse(content) as SkillProfileResult
}
