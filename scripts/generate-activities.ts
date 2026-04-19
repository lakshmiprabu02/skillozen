import { PrismaClient } from '@prisma/client'
import OpenAI from 'openai'

const prisma = new PrismaClient()
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY })

const SKILLS = [
  'CRITICAL_THINKING', 'COMMUNICATION', 'SOCIAL_EMOTIONAL', 'CREATIVITY',
  'DIGITAL_LITERACY', 'FINANCIAL_LITERACY', 'HEALTH_WELLNESS',
  'GOAL_SETTING', 'SCIENTIFIC_THINKING', 'PUBLIC_SPEAKING',
]
const AGE_GROUPS = ['EARLY', 'MIDDLE', 'TEEN'] as const
type AgeGroup = typeof AGE_GROUPS[number]
const TARGET = 50 // activities per skill per age group = 1,500 total

function buildPrompt(skill: string, ageGroup: AgeGroup, count: number): string {
  if (ageGroup === 'EARLY') {
    return `Generate ${count} unique life skills activities for Indian children aged 4-7 for the skill: ${skill}.
Return ONLY a valid JSON array. No markdown. No explanation.
Each item must have EXACTLY this structure:
{
  "title": "3-5 word title",
  "description": "One sentence description",
  "type": "GAME" | "QUIZ" | "SIMULATION" | "REFLECTION" | "CREATIVE_TASK",
  "difficulty": 1 or 2,
  "xpReward": 10 or 15,
  "durationMin": 5 or 6,
  "isOffline": true,
  "content": {
    "story": "1-2 sentence Indian story with names like Ravi, Priya, Meena, Arjun",
    "question": "Simple child-friendly question",
    "audioText": "Same question phrased for listening aloud",
    "options": [
      {"emoji": "🎯", "label": "Short label"},
      {"emoji": "🎯", "label": "Short label"},
      {"emoji": "🎯", "label": "Short label"},
      {"emoji": "🎯", "label": "Short label"}
    ],
    "correct": 0,
    "funFact": "Fun educational fact for kids",
    "encouragement": "Encouraging message with emoji"
  }
}
Rules:
- Indian names and family contexts (school, festivals, home, market)
- Options MUST be emoji objects not plain strings
- correct is the index (0-3) of the right answer
- Every activity must be unique and different`
  }

  if (ageGroup === 'MIDDLE') {
    return `Generate ${count} unique life skills activities for Indian children aged 8-12 for the skill: ${skill}.
Return ONLY a valid JSON array. No markdown. No explanation.
Each item must have EXACTLY this structure:
{
  "title": "3-5 word title",
  "description": "One sentence description",
  "type": "QUIZ" | "SIMULATION" | "GAME" | "REFLECTION" | "CREATIVE_TASK" | "CHALLENGE",
  "difficulty": 2 or 3,
  "xpReward": 15 or 20,
  "durationMin": 8 or 10,
  "isOffline": true or false,
  "content": {
    "story": "2-3 sentence Indian school or family context story",
    "storyEmoji": "one relevant emoji",
    "question": "Thoughtful question requiring reasoning",
    "options": ["Option A text", "Option B text", "Option C text", "Option D text"],
    "correct": 0,
    "funFact": "Interesting educational fact",
    "encouragement": "Encouraging message with emoji"
  }
}
Rules:
- Options MUST be plain strings not emoji objects
- Use realistic Indian school, family, friendship scenarios
- correct is the index (0-3) of the right answer
- Every activity must be unique`
  }

  return `Generate ${count} unique life skills activities for Indian teenagers aged 13-20 for the skill: ${skill}.
Return ONLY a valid JSON array. No markdown. No explanation.
Each item must have EXACTLY this structure:
{
  "title": "3-5 word title",
  "description": "One sentence description",
  "type": "SIMULATION" | "QUIZ" | "REFLECTION" | "CHALLENGE" | "CREATIVE_TASK",
  "difficulty": 3 or 4,
  "xpReward": 20 or 25,
  "durationMin": 10 or 12,
  "isOffline": true or false,
  "content": {
    "story": "2-3 sentence realistic Indian teen scenario (board exams, college, social media, career, peer pressure)",
    "question": "Challenging analytical question with no obvious answer",
    "options": ["Detailed option A", "Detailed option B", "Detailed option C", "Detailed option D"],
    "correct": 0,
    "funFact": "Substantive real-world fact or insight",
    "encouragement": "Encouraging message with emoji"
  }
}
Rules:
- Options MUST be plain strings not emoji objects
- Scenarios must be genuinely nuanced and challenging
- correct is the index (0-3) of the right answer
- Every activity must be unique`
}

function makeId(skill: string, ageGroup: string, index: number): string {
  const s = skill.toLowerCase().replace(/_/g, '-')
  const a = ageGroup.toLowerCase()
  return `${s}-${a}-gen-${index}`
}

async function generateBatch(skill: string, ageGroup: AgeGroup, count: number): Promise<any[]> {
  const prompt = buildPrompt(skill, ageGroup, count)
  const res = await openai.chat.completions.create({
    model: 'gpt-4o-mini',
    messages: [{ role: 'user', content: prompt }],
    temperature: 0.85,
    max_tokens: 4000,
  })
  const text = res.choices[0].message.content || '[]'
  const clean = text.replace(/```json|```/g, '').trim()
  return JSON.parse(clean)
}

async function main() {
  console.log('🚀 Skillozen Activity Generator Starting...\n')

  let totalGenerated = 0

  for (const ageGroup of AGE_GROUPS) {
    for (const skill of SKILLS) {
      // Count existing
      const existing = await prisma.activity.count({
        where: { skill: skill as any, ageGroup: { has: ageGroup } },
      })

      const needed = TARGET - existing
      if (needed <= 0) {
        console.log(`✅ ${ageGroup} | ${skill}: Already has ${existing}/${TARGET}`)
        continue
      }

      console.log(`\n🎮 ${ageGroup} | ${skill}: Needs ${needed} more (has ${existing})`)

      let generated = 0
      const batchSize = 10

      while (generated < needed) {
        const batch = Math.min(batchSize, needed - generated)
        console.log(`   Generating batch of ${batch}...`)

        try {
          const activities = await generateBatch(skill, ageGroup, batch)

          for (let i = 0; i < activities.length; i++) {
            const act = activities[i]
            const id = makeId(skill, ageGroup, existing + generated + i + 1)

            await prisma.activity.create({
              data: {
                id,
                title:       act.title,
                description: act.description,
                ageGroup:    [ageGroup],
                skill:       skill as any,
                type:        act.type as any,
                difficulty:  act.difficulty,
                xpReward:    act.xpReward,
                durationMin: act.durationMin,
                isOffline:   act.isOffline ?? true,
                content:     act.content,
                tags:        [skill.toLowerCase(), ageGroup.toLowerCase()],
                isActive:    true,
              },
            })
          }

          generated += activities.length
          totalGenerated += activities.length
          console.log(`   ✓ ${generated}/${needed} done`)

          // Avoid OpenAI rate limits
          await new Promise(r => setTimeout(r, 1500))
        } catch (err) {
          console.error(`   ❌ Batch failed:`, err)
          await new Promise(r => setTimeout(r, 3000))
        }
      }

      console.log(`✅ ${ageGroup} | ${skill}: Complete`)
    }
  }

  const total = await prisma.activity.count()
  console.log(`\n🎉 Done! Generated ${totalGenerated} new activities.`)
  console.log(`📊 Total in database: ${total}`)
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect())
