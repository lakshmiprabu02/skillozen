export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'
export const maxDuration = 30

import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

const QUESTION_BANK: Record<string, Array<{
  questionText: string
  skill: string
  options: string[]
  correct: number
  explanation: string
}>> = {
  CRITICAL_THINKING: [
    {
      questionText: 'You notice your friend scored much higher than you on the same test. What is the BEST first step?',
      skill: 'CRITICAL_THINKING',
      options: [
        'Ask your friend to share answers next time',
        'Think about what they did differently to prepare',
        'Tell the teacher the test was unfair',
        'Give up and assume you are not smart enough',
      ],
      correct: 1,
      explanation: 'Reflecting on what others do differently helps you improve your own approach.',
    },
    {
      questionText: 'You read a headline: "Eating chocolate daily cures all diseases." What do you do?',
      skill: 'CRITICAL_THINKING',
      options: [
        'Share it immediately with all your friends',
        'Believe it because it is on the internet',
        'Search for the original study and check other sources',
        'Ignore it because health news is always fake',
      ],
      correct: 2,
      explanation: 'Always verify claims by checking original sources before believing or sharing.',
    },
    {
      questionText: 'You have to solve a problem but do not have all the information. What is the BEST approach?',
      skill: 'CRITICAL_THINKING',
      options: [
        'Wait until someone gives you all the answers',
        'Make a random guess and hope for the best',
        'Identify what you know, what you need, and look for clues',
        'Ask someone else to solve it for you',
      ],
      correct: 2,
      explanation: 'Breaking a problem into what you know and what you need is a key critical thinking skill.',
    },
    {
      questionText: 'Two of your friends give you opposite advice about the same situation. What do you do?',
      skill: 'CRITICAL_THINKING',
      options: [
        'Follow the advice of whichever friend you like more',
        'Ignore both and do whatever feels right without thinking',
        'Listen to both, weigh the pros and cons, then decide',
        'Flip a coin to decide',
      ],
      correct: 2,
      explanation: 'Evaluating different perspectives and weighing options is the foundation of good decision making.',
    },
  ],

  COMMUNICATION: [
    {
      questionText: 'You need to explain a difficult topic to a younger student. What is the BEST approach?',
      skill: 'COMMUNICATION',
      options: [
        'Use the same complicated words as the textbook',
        'Use simple words and a relatable example they would understand',
        'Tell them to figure it out themselves',
        'Read the textbook paragraph out loud to them',
      ],
      correct: 1,
      explanation: 'Good communicators adapt their language to suit their audience.',
    },
    {
      questionText: 'During a group discussion, someone says something you strongly disagree with. What do you do?',
      skill: 'COMMUNICATION',
      options: [
        'Stay silent and feel frustrated inside',
        'Interrupt them immediately and say they are wrong',
        'Wait for them to finish, then calmly share your perspective',
        'Walk out of the discussion',
      ],
      correct: 2,
      explanation: 'Listening fully before responding respectfully is a sign of strong communication.',
    },
    {
      questionText: 'You need to send an important message to your teacher. Which is the BEST way to write it?',
      skill: 'COMMUNICATION',
      options: [
        'hey sir i need help with assignment k thx',
        'Dear Sir, I hope you are well. I need help with the assignment. Thank you.',
        'HELP ME WITH ASSIGNMENT PLEASE!!!',
        'Send a voice note instead of writing anything',
      ],
      correct: 1,
      explanation: 'Professional communication uses proper greetings, clear language, and polite tone.',
    },
    {
      questionText: 'A friend is talking to you about their problem. What makes you a GOOD listener?',
      skill: 'COMMUNICATION',
      options: [
        'Check your phone while they talk so you do not get bored',
        'Interrupt often to share your own similar stories',
        'Make eye contact, nod, and ask questions to understand better',
        'Tell them their problem is not a big deal',
      ],
      correct: 2,
      explanation: 'Active listening involves giving full attention and showing you care about understanding.',
    },
  ],

  SOCIAL_EMOTIONAL: [
    {
      questionText: 'Your best friend is upset but will not tell you why. What do you do?',
      skill: 'SOCIAL_EMOTIONAL',
      options: [
        'Leave them alone and pretend nothing is wrong',
        'Tell everyone else that something is wrong with them',
        'Gently let them know you are there if they want to talk',
        'Force them to tell you what happened',
      ],
      correct: 2,
      explanation: 'Showing empathy means letting others know you care without pressuring them.',
    },
    {
      questionText: 'You made a mistake that hurt someone\'s feelings. What is the BEST response?',
      skill: 'SOCIAL_EMOTIONAL',
      options: [
        'Blame them for being too sensitive',
        'Pretend nothing happened and avoid them',
        'Sincerely apologize and ask how you can make it better',
        'Say sorry quickly just to end the awkwardness',
      ],
      correct: 2,
      explanation: 'A genuine apology acknowledges the impact of your actions and shows emotional maturity.',
    },
    {
      questionText: 'You feel very angry after losing a competition. What is the HEALTHIEST way to handle it?',
      skill: 'SOCIAL_EMOTIONAL',
      options: [
        'Shout at the winner and say it was unfair',
        'Take deep breaths, accept the result, and think about what to improve',
        'Quit all future competitions forever',
        'Pretend you did not care about winning at all',
      ],
      correct: 1,
      explanation: 'Managing emotions by staying calm and focusing on growth is a key life skill.',
    },
    {
      questionText: 'A classmate who is usually quiet seems sad today. What do you do?',
      skill: 'SOCIAL_EMOTIONAL',
      options: [
        'Ignore them since you are not close friends',
        'Tell your other friends to go check on them instead',
        'Smile, say hello, and ask if they are doing okay',
        'Make jokes to cheer them up even if they seem serious',
      ],
      correct: 2,
      explanation: 'Noticing and responding to others\' emotions with kindness builds social awareness.',
    },
  ],

  CREATIVITY: [
    {
      questionText: 'Your teacher asks you to present a project WITHOUT using PowerPoint. What do you do?',
      skill: 'CREATIVITY',
      options: [
        'Tell the teacher it is impossible without PowerPoint',
        'Create a poster, skit, model, or video instead',
        'Copy someone else\'s presentation style exactly',
        'Read your notes aloud without any visual aid',
      ],
      correct: 1,
      explanation: 'Creativity means finding new ways to solve problems when your usual tools are unavailable.',
    },
    {
      questionText: 'You are given a blank page and told to make something interesting. What is your FIRST instinct?',
      skill: 'CREATIVITY',
      options: [
        'Wait for someone to tell you exactly what to draw or write',
        'Leave it blank because you are not creative',
        'Start experimenting with ideas, shapes, or words freely',
        'Copy something you have already seen before',
      ],
      correct: 2,
      explanation: 'Creative people dive in and experiment rather than waiting for perfect conditions.',
    },
    {
      questionText: 'You need to raise money for a school event. Which idea shows the MOST creativity?',
      skill: 'CREATIVITY',
      options: [
        'Ask parents to donate money directly',
        'Organize a regular bake sale like every other school',
        'Create a unique talent show where students pay to vote for winners',
        'Do nothing and hope someone else figures it out',
      ],
      correct: 2,
      explanation: 'Creative solutions are original, engaging, and solve the problem in unexpected ways.',
    },
    {
      questionText: 'You are stuck on a problem and your first idea did not work. What do you do?',
      skill: 'CREATIVITY',
      options: [
        'Give up immediately since your best idea failed',
        'Try the exact same approach again hoping for different results',
        'Think of at least 3 different approaches before choosing one',
        'Ask someone to solve it for you',
      ],
      correct: 2,
      explanation: 'Creative thinkers generate multiple ideas and are not discouraged by initial failure.',
    },
  ],

  DIGITAL_LITERACY: [
    {
      questionText: 'You receive an email saying you won a prize and need to share your bank details. What do you do?',
      skill: 'DIGITAL_LITERACY',
      options: [
        'Reply immediately with your bank details to claim the prize',
        'Forward it to all your friends so they can win too',
        'Delete it — this is a phishing scam',
        'Click the link to see if the prize is real',
      ],
      correct: 2,
      explanation: 'Unsolicited prize emails are almost always phishing scams designed to steal your information.',
    },
    {
      questionText: 'Which password is the STRONGEST and safest to use?',
      skill: 'DIGITAL_LITERACY',
      options: [
        'password123',
        'YourName2008',
        'correct-horse-battery-staple',
        '12345678',
      ],
      correct: 2,
      explanation: 'Long passphrases using random words are much stronger than short passwords with numbers.',
    },
    {
      questionText: 'You want to find reliable information for a school project. Which source is MOST trustworthy?',
      skill: 'DIGITAL_LITERACY',
      options: [
        'A random blog post with no author listed',
        'A YouTube comment with thousands of likes',
        'A government or university website with cited references',
        'Your friend\'s social media post about the topic',
      ],
      correct: 2,
      explanation: 'Credible sources have identifiable authors, citations, and are published by trusted organisations.',
    },
    {
      questionText: 'An AI chatbot gives you an answer for your homework. What should you do?',
      skill: 'DIGITAL_LITERACY',
      options: [
        'Copy it directly without checking since AI is always right',
        'Verify the information with reliable sources before using it',
        'Assume it is wrong because AI cannot be trusted at all',
        'Share it online immediately to help other students',
      ],
      correct: 1,
      explanation: 'AI tools can make mistakes. Always verify AI-generated content with trusted sources.',
    },
  ],
}

// Order of 20 questions: 4 per skill
const QUESTION_ORDER = [
  { skill: 'CRITICAL_THINKING', index: 0 },
  { skill: 'COMMUNICATION',     index: 0 },
  { skill: 'SOCIAL_EMOTIONAL',  index: 0 },
  { skill: 'CREATIVITY',        index: 0 },
  { skill: 'DIGITAL_LITERACY',  index: 0 },
  { skill: 'CRITICAL_THINKING', index: 1 },
  { skill: 'COMMUNICATION',     index: 1 },
  { skill: 'SOCIAL_EMOTIONAL',  index: 1 },
  { skill: 'CREATIVITY',        index: 1 },
  { skill: 'DIGITAL_LITERACY',  index: 1 },
  { skill: 'CRITICAL_THINKING', index: 2 },
  { skill: 'COMMUNICATION',     index: 2 },
  { skill: 'SOCIAL_EMOTIONAL',  index: 2 },
  { skill: 'CREATIVITY',        index: 2 },
  { skill: 'DIGITAL_LITERACY',  index: 2 },
  { skill: 'CRITICAL_THINKING', index: 3 },
  { skill: 'COMMUNICATION',     index: 3 },
  { skill: 'SOCIAL_EMOTIONAL',  index: 3 },
  { skill: 'CREATIVITY',        index: 3 },
  { skill: 'DIGITAL_LITERACY',  index: 3 },
]

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { assessmentId, questionIndex } = body

    const assessment = await prisma.assessment.findUnique({
      where: { id: assessmentId },
    })
    if (!assessment) {
      return NextResponse.json({ error: 'Assessment not found' }, { status: 404 })
    }

    const qMeta = QUESTION_ORDER[questionIndex]
    if (!qMeta) {
      return NextResponse.json({ error: 'Invalid question index' }, { status: 400 })
    }

    const question = QUESTION_BANK[qMeta.skill][qMeta.index]

    await prisma.assessment.update({
      where: { id: assessmentId },
      data: { currentQ: questionIndex },
    })

    return NextResponse.json({
      question: {
        ...question,
        questionType: 'choice',
        followUp: 'Choose the option that best matches what you would do!',
      },
    })
  } catch {
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
```

**Step 4** — Scroll down → **Commit changes** → message:
```
feat: replace AI questions with choice-based question bank
