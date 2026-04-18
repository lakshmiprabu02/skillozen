export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'
export const maxDuration = 30

import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// ── TIER 1: Ages 4-7 — Emoji + Audio ─────────────────────────────────────────
const TIER1_QUESTIONS: Record<string, Array<{
  questionText: string
  audioText: string
  skill: string
  options: Array<{ emoji: string; label: string }>
  correct: number
}>> = {
  CRITICAL_THINKING: [
    {
      questionText: 'Which animal lives in water? 🌊',
      audioText: 'Which animal lives in water?',
      skill: 'CRITICAL_THINKING',
      options: [
        { emoji: '🐦', label: 'Bird' },
        { emoji: '🐟', label: 'Fish' },
        { emoji: '🐕', label: 'Dog' },
        { emoji: '🐈', label: 'Cat' },
      ],
      correct: 1,
    },
    {
      questionText: 'Which one does NOT belong? 🍎🍊🍌🚗',
      audioText: 'Apple, Orange, Banana, Car. Which one does not belong?',
      skill: 'CRITICAL_THINKING',
      options: [
        { emoji: '🍎', label: 'Apple' },
        { emoji: '🍊', label: 'Orange' },
        { emoji: '🍌', label: 'Banana' },
        { emoji: '🚗', label: 'Car' },
      ],
      correct: 3,
    },
    {
      questionText: 'What comes next? 🌙⭐🌙⭐🌙...?',
      audioText: 'Moon, Star, Moon, Star, Moon. What comes next?',
      skill: 'CRITICAL_THINKING',
      options: [
        { emoji: '🌙', label: 'Moon' },
        { emoji: '⭐', label: 'Star' },
        { emoji: '☀️', label: 'Sun' },
        { emoji: '☁️', label: 'Cloud' },
      ],
      correct: 1,
    },
    {
      questionText: 'Which is the biggest? 🐜🐈🐘🐕',
      audioText: 'Ant, Cat, Elephant, Dog. Which is the biggest?',
      skill: 'CRITICAL_THINKING',
      options: [
        { emoji: '🐜', label: 'Ant' },
        { emoji: '🐈', label: 'Cat' },
        { emoji: '🐘', label: 'Elephant' },
        { emoji: '🐕', label: 'Dog' },
      ],
      correct: 2,
    },
    {
      questionText: 'What melts in the sun? ☀️',
      audioText: 'What melts when left in the hot sun?',
      skill: 'CRITICAL_THINKING',
      options: [
        { emoji: '🪨', label: 'Rock' },
        { emoji: '🍦', label: 'Ice cream' },
        { emoji: '🪵', label: 'Wood' },
        { emoji: '📚', label: 'Book' },
      ],
      correct: 1,
    },
    {
      questionText: 'Which floats on water? 💧',
      audioText: 'Which one floats on water?',
      skill: 'CRITICAL_THINKING',
      options: [
        { emoji: '🪨', label: 'Stone' },
        { emoji: '🍃', label: 'Leaf' },
        { emoji: '🔑', label: 'Key' },
        { emoji: '🧱', label: 'Brick' },
      ],
      correct: 1,
    },
  ],
  COMMUNICATION: [
    {
      questionText: 'Your friend is crying 😢. What do you do?',
      audioText: 'Your friend is crying. What do you do?',
      skill: 'COMMUNICATION',
      options: [
        { emoji: '🤗', label: 'Hug them' },
        { emoji: '🏃', label: 'Run away' },
        { emoji: '😂', label: 'Laugh' },
        { emoji: '📱', label: 'Ignore them' },
      ],
      correct: 0,
    },
    {
      questionText: 'How do you ask for a cookie nicely? 🍪',
      audioText: 'How do you ask for a cookie nicely?',
      skill: 'COMMUNICATION',
      options: [
        { emoji: '😠', label: 'Grab it' },
        { emoji: '🙏', label: 'Say please' },
        { emoji: '😭', label: 'Cry loudly' },
        { emoji: '🤷', label: 'Take and run' },
      ],
      correct: 1,
    },
    {
      questionText: 'How do you ask for help nicely? 🙏',
      audioText: 'How do you ask for help nicely?',
      skill: 'COMMUNICATION',
      options: [
        { emoji: '😠', label: 'Give it to me!' },
        { emoji: '🙏', label: 'Please help me' },
        { emoji: '😭', label: 'Cry loudly' },
        { emoji: '🏃', label: 'Run away' },
      ],
      correct: 1,
    },
    {
      questionText: 'What do you say when someone helps you? 😊',
      audioText: 'What do you say when someone helps you?',
      skill: 'COMMUNICATION',
      options: [
        { emoji: '😶', label: 'Nothing' },
        { emoji: '🙏', label: 'Thank you!' },
        { emoji: '😠', label: 'Go away' },
        { emoji: '😴', label: 'Yawn' },
      ],
      correct: 1,
    },
    {
      questionText: 'Your friend is sad. What do you do? 😢',
      audioText: 'Your friend is sad. What do you do?',
      skill: 'COMMUNICATION',
      options: [
        { emoji: '😂', label: 'Laugh at them' },
        { emoji: '🤗', label: 'Give a hug' },
        { emoji: '🏃', label: 'Run away' },
        { emoji: '😶', label: 'Ignore them' },
      ],
      correct: 1,
    },
    {
      questionText: 'In a library you should use a... 📚',
      audioText: 'In a library you should use a quiet voice or a loud voice?',
      skill: 'COMMUNICATION',
      options: [
        { emoji: '📢', label: 'Loud voice' },
        { emoji: '🤫', label: 'Quiet voice' },
        { emoji: '🎤', label: 'Singing voice' },
        { emoji: '😱', label: 'Screaming voice' },
      ],
      correct: 1,
    },
  ],
  SOCIAL_EMOTIONAL: [
    {
      questionText: 'Your friend has no lunch 🍱. What do you do?',
      audioText: 'Your friend has no lunch. What do you do?',
      skill: 'SOCIAL_EMOTIONAL',
      options: [
        { emoji: '🤤', label: 'Eat alone' },
        { emoji: '🤝', label: 'Share yours' },
        { emoji: '😝', label: 'Tease them' },
        { emoji: '🏃', label: 'Walk away' },
      ],
      correct: 1,
    },
    {
      questionText: 'You feel angry 😠. What helps you calm down?',
      audioText: 'You feel angry. What helps you calm down?',
      skill: 'SOCIAL_EMOTIONAL',
      options: [
        { emoji: '😤', label: 'Shout loudly' },
        { emoji: '🌬️', label: 'Deep breath' },
        { emoji: '👊', label: 'Hit something' },
        { emoji: '😭', label: 'Cry all day' },
      ],
      correct: 1,
    },
  ],
  CREATIVITY: [
    {
      questionText: 'Blue + Yellow = ? 🎨',
      audioText: 'Blue and Yellow mixed together make which colour?',
      skill: 'CREATIVITY',
      options: [
        { emoji: '🔴', label: 'Red' },
        { emoji: '💚', label: 'Green' },
        { emoji: '💜', label: 'Purple' },
        { emoji: '🟠', label: 'Orange' },
      ],
      correct: 1,
    },
    {
      questionText: 'You have a blank paper 📄. What do you do?',
      audioText: 'You have a blank paper. What do you do?',
      skill: 'CREATIVITY',
      options: [
        { emoji: '🗑️', label: 'Throw it' },
        { emoji: '🎨', label: 'Draw something' },
        { emoji: '💤', label: 'Go to sleep' },
        { emoji: '😐', label: 'Just stare' },
      ],
      correct: 1,
    },
  ],
  DIGITAL_LITERACY: [
    {
      questionText: 'A stranger online asks your address 🏠. You...',
      audioText: 'A stranger online asks for your home address. What do you do?',
      skill: 'DIGITAL_LITERACY',
      options: [
        { emoji: '📝', label: 'Tell them' },
        { emoji: '🚫', label: 'Say NO' },
        { emoji: '🤔', label: 'Think about it' },
        { emoji: '📸', label: 'Send a photo' },
      ],
      correct: 1,
    },
    {
      questionText: 'Someone online is being mean to you 😢. You...',
      audioText: 'Someone online is being mean to you. What do you do?',
      skill: 'DIGITAL_LITERACY',
      options: [
        { emoji: '😠', label: 'Be mean back' },
        { emoji: '👨‍👩‍👧', label: 'Tell a parent' },
        { emoji: '🤫', label: 'Keep secret' },
        { emoji: '😭', label: 'Cry alone' },
      ],
      correct: 1,
    },
  ],
  FINANCIAL_LITERACY: [
    {
      questionText: 'You get ₹10 pocket money 💰. What is BEST?',
      audioText: 'You get 10 rupees pocket money. What is the best thing to do?',
      skill: 'FINANCIAL_LITERACY',
      options: [
        { emoji: '🍬', label: 'Spend it all' },
        { emoji: '🐷', label: 'Save some' },
        { emoji: '🎮', label: 'Lose it' },
        { emoji: '😴', label: 'Forget it' },
      ],
      correct: 1,
    },
    {
      questionText: 'Which is a NEED and not a want? 🤔',
      audioText: 'Which one is something you need and not just want?',
      skill: 'FINANCIAL_LITERACY',
      options: [
        { emoji: '🎮', label: 'Video game' },
        { emoji: '🍕', label: 'Pizza' },
        { emoji: '🍚', label: 'Rice and dal' },
        { emoji: '🧸', label: 'Toy' },
      ],
      correct: 2,
    },
  ],
  HEALTH_WELLNESS: [
    {
      questionText: 'What makes your body strong and healthy? 💪',
      audioText: 'What makes your body strong and healthy?',
      skill: 'HEALTH_WELLNESS',
      options: [
        { emoji: '🍭', label: 'Only candy' },
        { emoji: '📺', label: 'Watch TV all day' },
        { emoji: '🥦', label: 'Eat vegetables' },
        { emoji: '💤', label: 'Sleep all day' },
      ],
      correct: 2,
    },
    {
      questionText: 'How many hours should you sleep at night? 😴',
      audioText: 'How many hours should a child sleep at night?',
      skill: 'HEALTH_WELLNESS',
      options: [
        { emoji: '1️⃣', label: '1-2 hours' },
        { emoji: '4️⃣', label: '4-5 hours' },
        { emoji: '🌙', label: '8-10 hours' },
        { emoji: '☀️', label: 'No sleep needed' },
      ],
      correct: 2,
    },
  ],
  GOAL_SETTING: [
    {
      questionText: 'You want to learn to ride a bike 🚲. What do you do first?',
      audioText: 'You want to learn to ride a bike. What do you do first?',
      skill: 'GOAL_SETTING',
      options: [
        { emoji: '😴', label: 'Give up' },
        { emoji: '🎯', label: 'Practice every day' },
        { emoji: '😭', label: 'Cry about it' },
        { emoji: '📺', label: 'Watch TV instead' },
      ],
      correct: 1,
    },
    {
      questionText: 'What should you do BEFORE playing? 📚',
      audioText: 'What should you do before playing?',
      skill: 'GOAL_SETTING',
      options: [
        { emoji: '📺', label: 'Watch TV' },
        { emoji: '📚', label: 'Finish homework' },
        { emoji: '🍕', label: 'Eat junk food' },
        { emoji: '💤', label: 'Take a nap' },
      ],
      correct: 1,
    },
  ],
  SCIENTIFIC_THINKING: [
    {
      questionText: 'Why does ice become water? 🧊💧',
      audioText: 'Why does ice become water?',
      skill: 'SCIENTIFIC_THINKING',
      options: [
        { emoji: '🧙', label: 'Magic!' },
        { emoji: '🔥', label: 'Heat melts it' },
        { emoji: '🌧️', label: 'Rain falls on it' },
        { emoji: '🤷', label: 'No reason' },
      ],
      correct: 1,
    },
    {
      questionText: 'Plants need ___ to grow 🌱',
      audioText: 'Plants need what to grow?',
      skill: 'SCIENTIFIC_THINKING',
      options: [
        { emoji: '🍕', label: 'Pizza' },
        { emoji: '☀️', label: 'Sunlight and water' },
        { emoji: '📱', label: 'A phone' },
        { emoji: '🎵', label: 'Music only' },
      ],
      correct: 1,
    },
  ],
  PUBLIC_SPEAKING: [
    {
      questionText: 'You have to speak in class 🎤. You feel nervous. What do you do?',
      audioText: 'You have to speak in class and you feel nervous. What do you do?',
      skill: 'PUBLIC_SPEAKING',
      options: [
        { emoji: '🏃', label: 'Run away' },
        { emoji: '😤', label: 'Take a breath and try' },
        { emoji: '😭', label: 'Cry loudly' },
        { emoji: '🤫', label: 'Stay silent' },
      ],
      correct: 1,
    },
    {
      questionText: 'When you speak to the class you should... 👀',
      audioText: 'When you speak to the class you should...',
      skill: 'PUBLIC_SPEAKING',
      options: [
        { emoji: '👇', label: 'Look at floor' },
        { emoji: '👀', label: 'Look at people' },
        { emoji: '🙈', label: 'Cover your eyes' },
        { emoji: '🔄', label: 'Turn around' },
      ],
      correct: 1,
    },
  ],
}

// ── TIER 2: Ages 8-12 — Story + Short Text ────────────────────────────────────
const TIER2_QUESTIONS: Record<string, Array<{
  questionText: string
  story: string
  storyEmoji: string
  skill: string
  options: string[]
  correct: number
}>> = {
  CRITICAL_THINKING: [
    {
      questionText: 'What is the BEST first step?',
      story: 'You got a lower score than your friend on the same test.',
      storyEmoji: '📝',
      skill: 'CRITICAL_THINKING',
      options: [
        'Copy your friend next time',
        'Think about what they did differently',
        'Tell the teacher it was unfair',
        'Give up trying',
      ],
      correct: 1,
    },
    {
      questionText: 'What should you do FIRST?',
      story: 'You see a headline: "Chocolate cures all diseases!" on social media.',
      storyEmoji: '📱',
      skill: 'CRITICAL_THINKING',
      options: [
        'Share it with everyone',
        'Believe it immediately',
        'Check other reliable sources',
        'Eat lots of chocolate',
      ],
      correct: 2,
    },
  ],
  COMMUNICATION: [
    {
      questionText: 'What is the BEST opening line?',
      story: 'Arjun is presenting his science project but is nervous and unsure how to start.',
      storyEmoji: '🎤',
      skill: 'COMMUNICATION',
      options: [
        'Um... so I guess I will talk now...',
        'Did you know plants can talk? Today I will show you!',
        'My project is about plants. Plants are green.',
        'I am not very good at this...',
      ],
      correct: 1,
    },
    {
      questionText: 'Which is the BEST message to your teacher?',
      story: 'You need help with an assignment from your teacher.',
      storyEmoji: '✉️',
      skill: 'COMMUNICATION',
      options: [
        'hey sir help me pls',
        'Dear Sir, I need help with the assignment. Thank you.',
        'HELP ME PLEASE!!!',
        'Send a voice note',
      ],
      correct: 1,
    },
  ],
  SOCIAL_EMOTIONAL: [
    {
      questionText: 'What is the MOST kind thing to do?',
      story: 'Your best friend got the school play lead role. You auditioned too but did not get it.',
      storyEmoji: '🎭',
      skill: 'SOCIAL_EMOTIONAL',
      options: [
        'Stop talking to your friend',
        'Tell everyone the teacher made a mistake',
        'Congratulate your friend sincerely',
        'Pretend you did not want it anyway',
      ],
      correct: 2,
    },
    {
      questionText: 'What is the HEALTHIEST way to handle it?',
      story: 'You feel very angry after losing a competition.',
      storyEmoji: '🏆',
      skill: 'SOCIAL_EMOTIONAL',
      options: [
        'Shout at the winner',
        'Take deep breaths and think about improving',
        'Quit all future competitions',
        'Pretend you did not care about winning',
      ],
      correct: 1,
    },
  ],
  CREATIVITY: [
    {
      questionText: 'What do you do?',
      story: 'Your teacher asks you to present a project WITHOUT using PowerPoint.',
      storyEmoji: '💡',
      skill: 'CREATIVITY',
      options: [
        'Say it is impossible',
        'Create a poster, skit or video instead',
        'Copy someone else exactly',
        'Read notes aloud with no visuals',
      ],
      correct: 1,
    },
    {
      questionText: 'What do you do NEXT?',
      story: 'You are stuck on a problem and your first idea did not work.',
      storyEmoji: '🔄',
      skill: 'CREATIVITY',
      options: [
        'Give up immediately',
        'Try the same thing again',
        'Think of 3 different approaches',
        'Ask someone to do it for you',
      ],
      correct: 2,
    },
  ],
  DIGITAL_LITERACY: [
    {
      questionText: 'What do you do?',
      story: 'You receive an email saying you won a prize and need to share your bank details.',
      storyEmoji: '📧',
      skill: 'DIGITAL_LITERACY',
      options: [
        'Reply with your bank details',
        'Forward to all your friends',
        'Delete it — this is a scam',
        'Click the link to check',
      ],
      correct: 2,
    },
    {
      questionText: 'Which source is MOST trustworthy?',
      story: 'You need reliable information for a school project.',
      storyEmoji: '🔍',
      skill: 'DIGITAL_LITERACY',
      options: [
        'A random blog with no author',
        'A YouTube comment with many likes',
        'A government or university website',
        'Your friend\'s social media post',
      ],
      correct: 2,
    },
  ],
  FINANCIAL_LITERACY: [
    {
      questionText: 'What is the SMARTEST choice?',
      story: 'Priya gets ₹500 as a birthday gift. She wants new shoes for ₹800.',
      storyEmoji: '👟',
      skill: 'FINANCIAL_LITERACY',
      options: [
        'Buy on credit and worry later',
        'Save more money and buy later',
        'Spend all ₹500 on other things',
        'Cry until parents buy the shoes',
      ],
      correct: 1,
    },
    {
      questionText: 'What is the BEST use of pocket money?',
      story: 'Rahul gets ₹200 pocket money every week.',
      storyEmoji: '💵',
      skill: 'FINANCIAL_LITERACY',
      options: [
        'Spend everything on snacks',
        'Save ₹100 and spend ₹100 wisely',
        'Give it all to friends',
        'Hide it and forget about it',
      ],
      correct: 1,
    },
  ],
  HEALTH_WELLNESS: [
    {
      questionText: 'What should Arjun do FIRST?',
      story: 'Arjun plays video games for 5 hours straight. His eyes hurt and head aches.',
      storyEmoji: '🎮',
      skill: 'HEALTH_WELLNESS',
      options: [
        'Play for 5 more hours',
        'Take a break, rest eyes, drink water',
        'Eat more junk food',
        'Ignore the pain and continue',
      ],
      correct: 1,
    },
    {
      questionText: 'Which routine is HEALTHIEST?',
      story: 'Meena needs to choose her daily after-school routine.',
      storyEmoji: '⏰',
      skill: 'HEALTH_WELLNESS',
      options: [
        'Phone for 4 hours then sleep late',
        'Snacks, play outside, homework, sleep by 9pm',
        'Skip meals and study all night',
        'Watch TV until midnight',
      ],
      correct: 1,
    },
  ],
  GOAL_SETTING: [
    {
      questionText: 'What is the BEST approach?',
      story: 'Vikram wants to improve his Maths grade from C to A in 3 months.',
      storyEmoji: '📊',
      skill: 'GOAL_SETTING',
      options: [
        'Hope it improves magically',
        'Practice 30 minutes daily and track progress',
        'Copy homework from friends',
        'Blame the teacher for bad grades',
      ],
      correct: 1,
    },
    {
      questionText: 'What is Aisha doing WRONG?',
      story: 'Aisha always says she will study tomorrow but never does. Exams are in 2 weeks.',
      storyEmoji: '📅',
      skill: 'GOAL_SETTING',
      options: [
        'She is being smart and resting',
        'She is procrastinating and wasting time',
        'She is planning carefully',
        'She does not need to study',
      ],
      correct: 1,
    },
  ],
  SCIENTIFIC_THINKING: [
    {
      questionText: 'What is the RIGHT thing to do?',
      story: 'Riya hears that drinking lemon water every morning cures all diseases.',
      storyEmoji: '🍋',
      skill: 'SCIENTIFIC_THINKING',
      options: [
        'Start drinking it immediately',
        'Share it with the whole school',
        'Ask for scientific evidence first',
        'Believe it because a friend said it',
      ],
      correct: 2,
    },
    {
      questionText: 'What is the BEST next step?',
      story: 'Karan wants to test if plants grow faster with music playing.',
      storyEmoji: '🌱',
      skill: 'SCIENTIFIC_THINKING',
      options: [
        'Guess the answer without testing',
        'Set up two plants — one with music, one without',
        'Ask friends what they think',
        'Look up the answer on Wikipedia only',
      ],
      correct: 1,
    },
  ],
  PUBLIC_SPEAKING: [
    {
      questionText: 'What should Rohan do?',
      story: 'Rohan has to give a 2-minute speech tomorrow. He is very nervous.',
      storyEmoji: '🎤',
      skill: 'PUBLIC_SPEAKING',
      options: [
        'Skip school tomorrow',
        'Practise in front of mirror and time himself',
        'Read directly from paper without looking up',
        'Ask someone else to do it',
      ],
      correct: 1,
    },
    {
      questionText: 'What is the BEST way to start a speech?',
      story: 'Divya is about to give a speech on saving water to her class.',
      storyEmoji: '💧',
      skill: 'PUBLIC_SPEAKING',
      options: [
        'Sorry I am not good at this...',
        'Did you know India may run out of water by 2030?',
        'Water is important. We need water.',
        'I will just read from my notes now.',
      ],
      correct: 1,
    },
  ],
}

// ── TIER 3: Ages 13-20 — Scenario Text ───────────────────────────────────────
const TIER3_QUESTIONS: Record<string, Array<{
  questionText: string
  skill: string
  options: string[]
  correct: number
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
    },
    {
      questionText: 'A study claims students who eat breakfast score 20% higher. Your school wants to make breakfast mandatory. What is your MOST important concern?',
      skill: 'CRITICAL_THINKING',
      options: [
        'Whether the breakfast will taste good',
        'Whether the study was peer reviewed with a large sample size',
        'Whether the school can afford it',
        'Whether students will wake up earlier',
      ],
      correct: 1,
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
    },
    {
      questionText: 'Your manager publicly criticised your work in front of the team unfairly. Tomorrow you have a 1-on-1. What is the BEST approach?',
      skill: 'COMMUNICATION',
      options: [
        'Confront aggressively and threaten to quit',
        'Say nothing and bottle up your feelings',
        'Calmly share how it affected you and ask for private feedback in future',
        'Complain to all colleagues about the manager',
      ],
      correct: 2,
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
    },
    {
      questionText: 'At a group hangout friends start mocking someone who is not present. They expect you to join in. What shows the highest emotional intelligence?',
      skill: 'SOCIAL_EMOTIONAL',
      options: [
        'Join in to avoid being left out',
        'Stay silent and change the subject',
        'Say clearly but calmly you are not comfortable and suggest doing something else',
        'Leave without saying anything',
      ],
      correct: 2,
    },
  ],
  CREATIVITY: [
    {
      questionText: 'Your teacher asks you to present WITHOUT using PowerPoint. What do you do?',
      skill: 'CREATIVITY',
      options: [
        'Tell the teacher it is impossible without PowerPoint',
        'Create a poster, skit, model, or video instead',
        'Copy someone else presentation style exactly',
        'Read your notes aloud without any visual aid',
      ],
      correct: 1,
    },
    {
      questionText: 'You notice college students struggle to find affordable healthy food near campus. Which solution shows the MOST creative thinking?',
      skill: 'CREATIVITY',
      options: [
        'Open a regular restaurant near campus',
        'Create a subscription tiffin service connecting home cooks with students',
        'Start a food blog with healthy recipes',
        'Petition the college to improve their canteen',
      ],
      correct: 1,
    },
  ],
  DIGITAL_LITERACY: [
    {
      questionText: 'A free flashlight app wants access to your contacts, location, camera and microphone. What does this indicate?',
      skill: 'DIGITAL_LITERACY',
      options: [
        'Accept all — popular apps need permissions',
        'This is a data harvesting red flag — deny unnecessary permissions',
        'Accept because free apps need data to survive',
        'Only accept location access',
      ],
      correct: 1,
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
    },
  ],
  FINANCIAL_LITERACY: [
    {
      questionText: 'You have saved ₹50,000. Three options: FD at 7% guaranteed, Stocks with potential 15% return but also 20% loss, Friend business idea promising 30% in 3 months. Which shows BEST financial thinking?',
      skill: 'FINANCIAL_LITERACY',
      options: [
        'Friend business — 30% sounds amazing',
        'Stocks because they always go up eventually',
        'FD for emergency fund first then small allocation to stocks',
        'Keep cash at home to avoid all risk',
      ],
      correct: 2,
    },
    {
      questionText: 'You just got your first salary of ₹25,000. What is the SMARTEST first move?',
      skill: 'FINANCIAL_LITERACY',
      options: [
        'Spend it all — you worked hard and deserve it',
        'Save 20% invest 10% and spend the rest mindfully',
        'Give it all to parents and keep nothing',
        'Buy the most expensive thing you wanted',
      ],
      correct: 1,
    },
  ],
  HEALTH_WELLNESS: [
    {
      questionText: 'Board exams are in 3 weeks. You are sleeping 4 hours and skipping meals. Your anxiety is increasing. What is the MOST effective approach?',
      skill: 'HEALTH_WELLNESS',
      options: [
        'Study 18 hours a day and sleep after exams',
        'Create a balanced schedule with study blocks 7-8 hours sleep and proper meals',
        'Stop studying and hope for the best',
        'Study only your favourite subjects',
      ],
      correct: 1,
    },
    {
      questionText: 'You feel constantly exhausted anxious and unmotivated for 3 weeks despite sleeping enough. What should you do?',
      skill: 'HEALTH_WELLNESS',
      options: [
        'Ignore it and push harder',
        'Drink more coffee and energy drinks',
        'Talk to a trusted adult or mental health professional',
        'Blame your school and teachers',
      ],
      correct: 2,
    },
  ],
  GOAL_SETTING: [
    {
      questionText: 'You want to get into a top engineering college in 2 years. What is the BEST approach?',
      skill: 'GOAL_SETTING',
      options: [
        'Start intensive studying 1 month before the exam',
        'Break the goal into monthly targets and track weekly progress',
        'Hope natural talent is enough',
        'Only study subjects you like',
      ],
      correct: 1,
    },
    {
      questionText: 'You keep setting goals but never follow through. What is the ROOT cause?',
      skill: 'GOAL_SETTING',
      options: [
        'You are not smart enough',
        'Goals are too vague without specific actions and deadlines',
        'Goal setting does not work for anyone',
        'You need more motivation before starting',
      ],
      correct: 1,
    },
  ],
  SCIENTIFIC_THINKING: [
    {
      questionText: 'A school wants to use an AI system to predict which students will fail based on past data. What is the MOST important ethical concern?',
      skill: 'SCIENTIFIC_THINKING',
      options: [
        'The AI might be too expensive',
        'The AI could create self-fulfilling prophecies and perpetuate bias',
        'Students might not like being monitored',
        'Teachers might lose their jobs',
      ],
      correct: 1,
    },
    {
      questionText: 'A viral post claims a new berry cures diabetes with no side effects. What is the SCIENTIFIC response?',
      skill: 'SCIENTIFIC_THINKING',
      options: [
        'Share it — it could help people',
        'Try it immediately on yourself',
        'Look for peer reviewed clinical trials before believing or sharing',
        'Believe it because many people shared it',
      ],
      correct: 2,
    },
  ],
  PUBLIC_SPEAKING: [
    {
      questionText: 'In a job interview the interviewer asks: Tell me about a time you failed. Which response demonstrates the HIGHEST communication intelligence?',
      skill: 'PUBLIC_SPEAKING',
      options: [
        'I have never really failed at anything important',
        'I missed a project deadline. I owned it communicated proactively and built a task system. All future projects were on time.',
        'I failed once but it was not really my fault',
        'Everyone fails so it is not a big deal',
      ],
      correct: 1,
    },
    {
      questionText: 'You need to present a controversial idea to a skeptical audience. What is the MOST effective strategy?',
      skill: 'PUBLIC_SPEAKING',
      options: [
        'Speak very fast so they cannot interrupt',
        'Acknowledge their concerns first then present evidence calmly',
        'Avoid eye contact so you seem humble',
        'Read every word from your notes',
      ],
      correct: 1,
    },
  ],
}

// ── Question Order: 10 skills × 2 questions = 20 total ───────────────────────
const QUESTION_ORDER = [
  { skill: 'CRITICAL_THINKING',   index: 0 },
  { skill: 'COMMUNICATION',       index: 0 },
  { skill: 'SOCIAL_EMOTIONAL',    index: 0 },
  { skill: 'CREATIVITY',          index: 0 },
  { skill: 'DIGITAL_LITERACY',    index: 0 },
  { skill: 'FINANCIAL_LITERACY',  index: 0 },
  { skill: 'HEALTH_WELLNESS',     index: 0 },
  { skill: 'GOAL_SETTING',        index: 0 },
  { skill: 'SCIENTIFIC_THINKING', index: 0 },
  { skill: 'PUBLIC_SPEAKING',     index: 0 },
  { skill: 'CRITICAL_THINKING',   index: 1 },
  { skill: 'COMMUNICATION',       index: 1 },
  { skill: 'SOCIAL_EMOTIONAL',    index: 1 },
  { skill: 'CREATIVITY',          index: 1 },
  { skill: 'DIGITAL_LITERACY',    index: 1 },
  { skill: 'FINANCIAL_LITERACY',  index: 1 },
  { skill: 'HEALTH_WELLNESS',     index: 1 },
  { skill: 'GOAL_SETTING',        index: 1 },
  { skill: 'SCIENTIFIC_THINKING', index: 1 },
  { skill: 'PUBLIC_SPEAKING',     index: 1 },
]

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
    } else {
      qMeta = QUESTION_ORDER[questionIndex]
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
