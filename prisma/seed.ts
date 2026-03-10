// prisma/seed.ts — Seeds the Skillozen database with activities & badges
import { PrismaClient, ActivityType, AgeGroup, SkillArea } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Seeding Skillozen database...')

  // ── Admin ────────────────────────────────────────────────────────────────
  const adminHash = await bcrypt.hash(process.env.ADMIN_PASSWORD || 'admin@skillozen2024', 10)
  await prisma.admin.upsert({
    where: { email: 'admin@skillozen.com' },
    update: {},
    create: { email: 'admin@skillozen.com', passwordHash: adminHash },
  })

  // ── Badges ───────────────────────────────────────────────────────────────
  const badges = [
    { name: 'First Step', emoji: '👶', description: 'Completed your first activity', condition: 'Complete 1 activity' },
    { name: 'Explorer', emoji: '🧭', description: 'Completed 10 activities', condition: 'Complete 10 activities', xpThreshold: 100 },
    { name: 'Thinker', emoji: '🧠', description: 'Mastered Critical Thinking basics', condition: 'Score 70+ in Critical Thinking', skill: SkillArea.CRITICAL_THINKING },
    { name: 'Communicator', emoji: '🗣️', description: 'Mastered Communication basics', condition: 'Score 70+ in Communication', skill: SkillArea.COMMUNICATION },
    { name: 'Creator', emoji: '🎨', description: 'Mastered Creativity basics', condition: 'Score 70+ in Creativity', skill: SkillArea.CREATIVITY },
    { name: 'Digital Native', emoji: '💻', description: 'Mastered Digital Literacy basics', condition: 'Score 70+ in Digital Literacy', skill: SkillArea.DIGITAL_LITERACY },
    { name: 'Empathy Star', emoji: '💛', description: 'Mastered Social-Emotional Learning', condition: 'Score 70+ in SEL', skill: SkillArea.SOCIAL_EMOTIONAL },
    { name: 'Week Warrior', emoji: '🔥', description: '7-day activity streak', condition: 'Maintain a 7-day streak', xpThreshold: 70 },
    { name: 'XP Legend', emoji: '⚡', description: 'Earned 500 XP', condition: 'Earn 500 XP total', xpThreshold: 500 },
    { name: 'Assessment Ace', emoji: '🏆', description: 'Scored 80+ overall in assessment', condition: 'Overall assessment score ≥ 80' },
  ]

  for (const badge of badges) {
    await prisma.badge.upsert({
      where: { id: badge.name.toLowerCase().replace(/\s+/g, '-') },
      update: {},
      create: { id: badge.name.toLowerCase().replace(/\s+/g, '-'), ...badge },
    })
  }

  // ── Activities ────────────────────────────────────────────────────────────
  const activities = [
    // CRITICAL THINKING
    {
      title: 'The Mystery Box Challenge',
      description: 'Use clues to figure out what's inside the mystery box. Practice deduction and logical reasoning!',
      skill: SkillArea.CRITICAL_THINKING,
      ageGroup: [AgeGroup.EARLY, AgeGroup.MIDDLE],
      type: ActivityType.GAME,
      difficulty: 1,
      xpReward: 15,
      durationMin: 8,
      content: {
        instructions: 'You will be given 5 clues one by one. After each clue, guess what is in the box.',
        clues: ['It is smaller than a football', 'You can eat it', 'It grows on trees', 'It is red or green', 'It is crunchy'],
        answer: 'Apple',
        explanation: 'Each clue narrows down the possibilities — this is deductive reasoning!',
      },
      tags: ['logic', 'deduction', 'fun'],
    },
    {
      title: 'Spot the Fake News',
      description: 'Read two headlines and decide which one is real news and which is fake. Build your media literacy!',
      skill: SkillArea.CRITICAL_THINKING,
      ageGroup: [AgeGroup.MIDDLE, AgeGroup.TEEN],
      type: ActivityType.QUIZ,
      difficulty: 3,
      xpReward: 20,
      durationMin: 10,
      content: {
        rounds: [
          {
            headline1: 'Scientists discover water on Mars in underground lakes',
            headline2: 'Eating chocolate daily cures all diseases, say doctors',
            real: 0,
            explanation: 'Always check: who said it? What's the source? Is it too good/crazy to be true?',
          },
          {
            headline1: 'New study shows exercise improves memory and mood',
            headline2: 'Local boy flies to school using homemade jetpack every day',
            real: 0,
            explanation: 'Real news is specific, sourced, and verifiable.',
          },
        ],
      },
      tags: ['media-literacy', 'critical-thinking', 'news'],
    },
    {
      title: 'The Bridge Problem',
      description: 'You have limited materials. Design the strongest bridge! Practice engineering thinking.',
      skill: SkillArea.CRITICAL_THINKING,
      ageGroup: [AgeGroup.MIDDLE, AgeGroup.TEEN, AgeGroup.YOUNG_ADULT],
      type: ActivityType.SIMULATION,
      difficulty: 4,
      xpReward: 25,
      durationMin: 15,
      content: {
        scenario: 'You have: 20 popsicle sticks, 1 meter of tape, 10 paper clips. Build a bridge that can hold the most weight.',
        choices: [
          { id: 'A', design: 'Triangle supports with tape reinforcement', strength: 85 },
          { id: 'B', design: 'Flat platform with paper clip connectors', strength: 40 },
          { id: 'C', design: 'Arch design with sticks and tape', strength: 70 },
          { id: 'D', design: 'X-frame with paper clips', strength: 55 },
        ],
        correct: 'A',
        explanation: 'Triangles are the strongest shape — they distribute weight evenly. Engineers use triangles in bridges, towers, and aircraft!',
      },
      tags: ['engineering', 'problem-solving', 'STEM'],
    },
    {
      title: 'Pros & Cons Decision Map',
      description: 'Learn to make smart decisions by mapping out pros and cons of real-life choices.',
      skill: SkillArea.CRITICAL_THINKING,
      ageGroup: [AgeGroup.TEEN, AgeGroup.YOUNG_ADULT],
      type: ActivityType.REFLECTION,
      difficulty: 3,
      xpReward: 20,
      durationMin: 12,
      content: {
        scenario: 'You have a free weekend. Option A: Study for next week\'s exams. Option B: Join friends for a trip.',
        task: 'List at least 3 pros and 3 cons for each option. Then decide which factors matter most to you.',
        reflection: 'Good decisions consider both short-term feelings and long-term outcomes.',
      },
      tags: ['decision-making', 'reflection', 'planning'],
    },

    // COMMUNICATION
    {
      title: 'Describe It Without Naming It',
      description: 'Pick an everyday object and describe it in 30 seconds — without saying its name. Communication magic!',
      skill: SkillArea.COMMUNICATION,
      ageGroup: [AgeGroup.EARLY, AgeGroup.MIDDLE],
      type: ActivityType.CHALLENGE,
      difficulty: 2,
      xpReward: 15,
      durationMin: 8,
      content: {
        objects: ['Umbrella', 'Telephone', 'Toothbrush', 'Book', 'Chair'],
        rules: ['No saying the word', 'No using your hands (imagine!)', 'Must describe it in 30 seconds', 'Use: shape, color, use, material'],
        tip: 'Great communication means helping others see what you see — even without showing them!',
      },
      tags: ['speaking', 'vocabulary', 'fun'],
    },
    {
      title: 'Email Etiquette Master',
      description: 'Fix the badly written emails! Learn professional communication for the real world.',
      skill: SkillArea.COMMUNICATION,
      ageGroup: [AgeGroup.TEEN, AgeGroup.YOUNG_ADULT],
      type: ActivityType.QUIZ,
      difficulty: 3,
      xpReward: 20,
      durationMin: 10,
      content: {
        scenarios: [
          {
            bad: 'hey sir i need u to give me extension for my assignment k thx',
            issues: ['Too informal', 'No subject', 'No greeting', 'No reason given', 'No sign-off'],
            good: 'Subject: Request for Assignment Extension\n\nDear Mr. Smith,\n\nI hope this message finds you well. I am writing to respectfully request a 2-day extension for the upcoming assignment, as I am dealing with an unexpected illness. I will submit by Thursday.\n\nThank you for your understanding.\n\nBest regards,\nAria',
          },
        ],
      },
      tags: ['email', 'professional', 'writing'],
    },
    {
      title: 'Active Listening Challenge',
      description: 'Read a short story, then answer questions — without re-reading! Train your listening and comprehension.',
      skill: SkillArea.COMMUNICATION,
      ageGroup: [AgeGroup.MIDDLE, AgeGroup.TEEN],
      type: ActivityType.QUIZ,
      difficulty: 2,
      xpReward: 15,
      durationMin: 10,
      content: {
        story: 'Maya was nervous about her school presentation. She had practiced for two weeks, but her hands still shook. Her teacher, Ms. Patel, noticed and whispered: "Take a deep breath. You know this better than anyone." Maya smiled, took a breath, and delivered the best presentation of her life.',
        questions: [
          { q: 'How long had Maya practiced?', options: ['One week', 'Two weeks', 'Three days', 'One month'], correct: 1 },
          { q: 'What did Ms. Patel do?', options: ['Ignored Maya', 'Told the class to be quiet', 'Gave Maya encouragement', 'Postponed the presentation'], correct: 2 },
          { q: 'What was Maya feeling at the start?', options: ['Excited', 'Nervous', 'Bored', 'Confident'], correct: 1 },
        ],
      },
      tags: ['listening', 'comprehension', 'reading'],
    },

    // SOCIAL-EMOTIONAL LEARNING
    {
      title: 'Emotion Identification Game',
      description: 'Match the face expression to the emotion. Build your emotional vocabulary!',
      skill: SkillArea.SOCIAL_EMOTIONAL,
      ageGroup: [AgeGroup.EARLY, AgeGroup.MIDDLE],
      type: ActivityType.GAME,
      difficulty: 1,
      xpReward: 10,
      durationMin: 7,
      content: {
        pairs: [
          { scenario: 'You got a gift you didn\'t expect', emotion: 'Surprised', emoji: '😮' },
          { scenario: 'Your friend moved to another city', emotion: 'Sad', emoji: '😢' },
          { scenario: 'Someone took your lunch without asking', emotion: 'Angry', emoji: '😠' },
          { scenario: 'You\'re about to perform on stage', emotion: 'Nervous', emoji: '😰' },
          { scenario: 'You helped someone and they said thank you', emotion: 'Proud', emoji: '😊' },
        ],
      },
      tags: ['emotions', 'empathy', 'self-awareness'],
    },
    {
      title: 'The Conflict Resolution Simulator',
      description: 'Handle tricky social situations wisely. Practice staying calm under pressure.',
      skill: SkillArea.SOCIAL_EMOTIONAL,
      ageGroup: [AgeGroup.MIDDLE, AgeGroup.TEEN],
      type: ActivityType.SIMULATION,
      difficulty: 3,
      xpReward: 25,
      durationMin: 12,
      content: {
        scenario: 'Your friend accused you of sharing their secret with others, but you didn\'t. They are upset and not speaking to you.',
        choices: [
          { text: 'Ignore them and wait for them to calm down', outcome: 'Tension grows. The friendship might end.', score: 20 },
          { text: 'Get angry and say "I never told anyone!"', outcome: 'Defensive reaction escalates the fight.', score: 30 },
          { text: 'Calmly say "I understand you\'re upset. Can we talk? I didn\'t share your secret."', outcome: 'Opens dialogue. Friendship is preserved.', score: 90 },
          { text: 'Apologize even though you didn\'t do it, just to end the fight', outcome: 'Conflict ends but you feel resentful. Short-term fix, long-term problem.', score: 50 },
        ],
        lesson: 'Assertive communication — expressing yourself honestly while staying calm — is the most effective conflict resolution tool.',
      },
      tags: ['conflict', 'empathy', 'relationships'],
    },
    {
      title: 'Gratitude Journal Entry',
      description: 'Write 3 things you\'re grateful for today. Science shows this boosts happiness and resilience!',
      skill: SkillArea.SOCIAL_EMOTIONAL,
      ageGroup: [AgeGroup.EARLY, AgeGroup.MIDDLE, AgeGroup.TEEN, AgeGroup.YOUNG_ADULT],
      type: ActivityType.REFLECTION,
      difficulty: 1,
      xpReward: 10,
      durationMin: 5,
      content: {
        prompts: [
          'One person who made your day better and why',
          'One small thing you often take for granted',
          'One thing about yourself you\'re proud of today',
        ],
        science: 'Studies show that daily gratitude journaling increases well-being by up to 25% and reduces stress hormones.',
      },
      tags: ['gratitude', 'mindfulness', 'well-being'],
      isOffline: true,
    },

    // CREATIVITY
    {
      title: 'The Impossible Invention',
      description: 'Invent a solution to a silly problem! Creativity means thinking beyond "normal".',
      skill: SkillArea.CREATIVITY,
      ageGroup: [AgeGroup.EARLY, AgeGroup.MIDDLE],
      type: ActivityType.CREATIVE_TASK,
      difficulty: 2,
      xpReward: 20,
      durationMin: 10,
      content: {
        problem: 'Dogs get bored when left alone. Invent something that keeps them entertained!',
        constraints: ['Must use only household items', 'Cannot need a human to operate', 'Must be safe for the dog'],
        inspiration: 'Remember: the best inventions solve real problems. Even "silly" ideas can become great ones!',
        sharePrompt: 'Describe your invention: What is it called? How does it work? Draw or write it out!',
      },
      tags: ['invention', 'design-thinking', 'imagination'],
    },
    {
      title: 'Story Remix Challenge',
      description: 'Take a classic story and flip it! Change the ending, the villain, or the setting.',
      skill: SkillArea.CREATIVITY,
      ageGroup: [AgeGroup.MIDDLE, AgeGroup.TEEN],
      type: ActivityType.CREATIVE_TASK,
      difficulty: 3,
      xpReward: 25,
      durationMin: 15,
      content: {
        originalStory: 'Cinderella — A girl with a cruel stepfamily gets help from a fairy godmother to attend a royal ball and wins the heart of a prince.',
        remixOptions: [
          'Flip the genders: Cinderella is a boy',
          'Set it in 2040: The "ball" is a virtual reality gaming tournament',
          'Tell it from the stepsisters\' perspective',
          'Give Cinderella agency: She doesn\'t need the prince, she becomes the queen herself',
        ],
        task: 'Pick one remix and write the first 5 sentences of your new story.',
      },
      tags: ['storytelling', 'writing', 'imagination'],
    },
    {
      title: '10 Uses for a Paperclip',
      description: 'The classic creativity test! Think of as many uses for a paperclip as you can in 2 minutes.',
      skill: SkillArea.CREATIVITY,
      ageGroup: [AgeGroup.MIDDLE, AgeGroup.TEEN, AgeGroup.YOUNG_ADULT],
      type: ActivityType.CHALLENGE,
      difficulty: 2,
      xpReward: 15,
      durationMin: 5,
      content: {
        task: 'List as many uses for a paperclip as you can think of in 2 minutes. Go beyond the obvious!',
        examples: ['Bookmark', 'Fish hook', 'Lock pick', 'Earring', 'Cable organizer'],
        scoring: { '1-5': 'Good start!', '6-10': 'Creative thinker!', '11-15': 'Innovation superstar!', '15+': '🏆 Divergent thinking genius!' },
        science: 'This is called the Alternative Uses Test — psychologists use it to measure divergent thinking, a key component of creativity.',
      },
      tags: ['divergent-thinking', 'brainstorming', 'quick'],
      isOffline: true,
    },

    // DIGITAL LITERACY & AI AWARENESS
    {
      title: 'How Does Google Search Work?',
      description: 'Understand the magic behind search engines — and how to use them smarter!',
      skill: SkillArea.DIGITAL_LITERACY,
      ageGroup: [AgeGroup.MIDDLE, AgeGroup.TEEN],
      type: ActivityType.QUIZ,
      difficulty: 2,
      xpReward: 15,
      durationMin: 8,
      content: {
        explainer: 'Search engines use "crawlers" — tiny robots — to read billions of web pages and organize them. When you search, an algorithm picks the most relevant results.',
        questions: [
          { q: 'What are web crawlers?', options: ['Bugs in computers', 'Robots that read websites', 'Viruses', 'Email filters'], correct: 1 },
          { q: 'Which search tip finds exact phrases?', options: ['Use caps', 'Use quotes ""', 'Add + sign', 'Use asterisk *'], correct: 1 },
          { q: 'What does ".gov" in a URL usually mean?', options: ['A game site', 'A government website', 'A school', 'Anything'], correct: 1 },
        ],
      },
      tags: ['search', 'internet', 'information-literacy'],
    },
    {
      title: 'AI: Friend or Foe?',
      description: 'Explore how AI is used in your daily life and learn to use it responsibly.',
      skill: SkillArea.DIGITAL_LITERACY,
      ageGroup: [AgeGroup.TEEN, AgeGroup.YOUNG_ADULT],
      type: ActivityType.REFLECTION,
      difficulty: 3,
      xpReward: 20,
      durationMin: 12,
      content: {
        examples: [
          { useCase: 'Spotify recommends songs', aiType: 'Recommendation Algorithm' },
          { useCase: 'Face ID unlocks your phone', aiType: 'Computer Vision' },
          { useCase: 'ChatGPT writes your essay', aiType: 'Large Language Model' },
          { useCase: 'Google Maps finds fastest route', aiType: 'Optimization AI' },
        ],
        reflection: [
          'Which of these AI uses do you think are helpful?',
          'Which ones might cause problems if misused?',
          'How would you use AI responsibly in your schoolwork?',
        ],
        keyMessage: 'AI is a tool. Like any tool (hammer, calculator, car), it can help or harm depending on how you use it.',
      },
      tags: ['AI', 'ethics', 'technology'],
    },
    {
      title: 'Password Security Challenge',
      description: 'Test how secure your passwords are. Learn to protect your digital identity!',
      skill: SkillArea.DIGITAL_LITERACY,
      ageGroup: [AgeGroup.MIDDLE, AgeGroup.TEEN, AgeGroup.YOUNG_ADULT],
      type: ActivityType.QUIZ,
      difficulty: 2,
      xpReward: 15,
      durationMin: 8,
      content: {
        passwords: [
          { password: 'password123', strength: 10, reason: 'Most commonly used password. Hacked in seconds.' },
          { password: 'Maya2008', strength: 30, reason: 'Personal info + year. Easy to guess if someone knows you.' },
          { password: 'Tr0ub4dor&3', strength: 75, reason: 'Mix of letters, numbers, symbols. Much harder to crack.' },
          { password: 'correct-horse-battery-staple', strength: 90, reason: '4 random words = very long + memorable = very strong!' },
        ],
        task: 'Rank these passwords from weakest to strongest, then create your own strong password using the tips.',
        tips: ['Use 12+ characters', 'Mix uppercase, lowercase, numbers, symbols', 'Never use personal info', 'Use a passphrase (4+ random words)'],
      },
      tags: ['cybersecurity', 'privacy', 'digital-safety'],
    },
  ]

  for (let i = 0; i < activities.length; i++) {
    const act = activities[i]
    await prisma.activity.upsert({
      where: { id: `seed-activity-${i + 1}` },
      update: {},
      create: {
        id: `seed-activity-${i + 1}`,
        ...act,
      },
    })
  }

  console.log(`✅ Seeded ${badges.length} badges and ${activities.length} activities`)
}

main()
  .catch((e) => { console.error(e); process.exit(1) })
  .finally(() => prisma.$disconnect())
