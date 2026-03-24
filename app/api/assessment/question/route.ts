export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'
export const maxDuration = 30

import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// ── TIER 1: Ages 4-7 — Pure Emoji + Audio Questions ──────────────────────────
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
      questionText: 'Sun, Moon, Sun, Moon, Sun... What comes next? ⭐',
      audioText: 'Sun, Moon, Sun, Moon, Sun. What comes next?',
      skill: 'CRITICAL_THINKING',
      options: [
        { emoji: '☀️', label: 'Sun' },
        { emoji: '🌙', label: 'Moon' },
        { emoji: '⭐', label: 'Star' },
        { emoji: '☁️', label: 'Cloud' },
      ],
      correct: 1,
    },
    {
      questionText: 'Which one is the heaviest? 🏋️',
      audioText: 'Which one is the heaviest?',
      skill: 'CRITICAL_THINKING',
      options: [
        { emoji: '🪶', label: 'Feather' },
        { emoji: '🍎', label: 'Apple' },
        { emoji: '🐘', label: 'Elephant' },
        { emoji: '📌', label: 'Pin' },
      ],
      correct: 2,
    },
    {
      questionText: 'Which comes first in the morning? 🌅',
      audioText: 'Which comes first in the morning?',
      skill: 'CRITICAL_THINKING',
      options: [
        { emoji: '🌙', label: 'Night' },
        { emoji: '☀️', label: 'Sunrise' },
        { emoji: '🌆', label: 'Evening' },
        { emoji: '🌃', label: 'Midnight' },
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
      questionText: 'When someone talks to you, you should... 👂',
      audioText: 'When someone talks to you, you should...',
      skill: 'COMMUNICATION',
      options: [
        { emoji: '📱', label: 'Use phone' },
        { emoji: '👂', label: 'Listen' },
        { emoji: '💤', label: 'Sleep' },
        { emoji: '🏃', label: 'Walk away' },
      ],
      correct: 1,
    },
    {
      questionText: 'How do you feel when you get a surprise gift? 🎁',
      audioText: 'How do you feel when you get a surprise gift?',
      skill: 'COMMUNICATION',
      options: [
        { emoji: '😢', label: 'Sad' },
        { emoji: '😠', label: 'Angry' },
        { emoji: '🤩', label: 'Excited' },
        { emoji: '😴', label: 'Sleepy' },
      ],
      correct: 2,
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
    {
      questionText: 'You broke your friend\'s toy by mistake 😬. You should...',
      audioText: 'You broke your friend\'s toy by mistake. You should...',
      skill: 'SOCIAL_EMOTIONAL',
      options: [
        { emoji: '🏃', label: 'Run away' },
        { emoji: '🙊', label: 'Hide it' },
        { emoji: '🙏', label: 'Say sorry' },
        { emoji: '😐', label: 'Ignore it' },
      ],
      correct: 2,
    },
    {
      questionText: 'Your friend wins a prize 🏆. You did not win. You feel...',
      audioText: 'Your friend wins a prize. You did not win. You should feel...',
      skill: 'SOCIAL_EMOTIONAL',
      options: [
        { emoji: '😠', label: 'Very angry' },
        { emoji: '👏', label: 'Happy for them' },
        { emoji: '😭', label: 'Cry all day' },
        { emoji: '🙅', label: 'Stop being friends' },
      ],
      correct: 1,
    },
  ],
  CREATIVITY: [
    {
      questionText: 'You want to make a card for your mum 💝. You use...',
      audioText: 'You want to make a card for your mum. You use...',
      skill: 'CREATIVITY',
      options: [
        { emoji: '✏️', label: 'Draw and colour' },
        { emoji: '📺', label: 'Watch TV' },
        { emoji: '💤', label: 'Sleep instead' },
        { emoji: '🏃', label: 'Run around' },
      ],
      correct: 0,
    },
    {
      questionText: 'What can you build with blocks? 🧱',
      audioText: 'What can you build with blocks?',
      skill: 'CREATIVITY',
      options: [
        { emoji: '🏰', label: 'A castle' },
        { emoji: '🚀', label: 'A rocket' },
        { emoji: '🏠', label: 'A house' },
        { emoji: '🌈', label: 'Anything!' },
      ],
      correct: 3,
    },
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
      audioText: 'A stranger online asks for your home address. You should...',
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
      questionText: 'How long should you use a screen each day? 📱',
      audioText: 'How long should you use a screen each day?',
      skill: 'DIGITAL_LITERACY',
      options: [
        { emoji: '⏰', label: '1-2 hours' },
        { emoji: '🌙', label: 'All night' },
        { emoji: '☀️', label: 'All day' },
        { emoji: '⚡', label: 'No limit' },
      ],
      correct: 0,
    },
    {
      questionText: 'Someone online is being mean to you 😢. You...',
      audioText: 'Someone online is being mean to you. You should...',
      skill: 'DIGITAL_LITERACY',
      options: [
        { emoji: '😠', label: 'Be mean back' },
        { emoji: '👨‍👩‍👧', label: 'Tell a parent' },
        { emoji: '🤫', label: 'Keep secret' },
        { emoji: '😭', label: 'Cry alone' },
      ],
      correct: 1,
    },
    {
      questionText: 'Before you click a link, you should... 🔗',
      audioText: 'Before you click a link online, you should...',
      skill: 'DIGITAL_LITERACY',
      options: [
        { emoji: '⚡', label: 'Click fast' },
        { emoji: '🤔', label: 'Ask a parent' },
        { emoji: '😴', label: 'Ignore it' },
        { emoji: '📤', label: 'Share it' },
      ],
      correct: 1,
    },
  ],
}

// ── TIER 2: Ages 8-12 — Story + Short Text Choices ───────────────────────────
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
    {
      questionText: 'What is the BEST approach?',
      story: 'You need to solve a problem but you do not have all the information.',
      storyEmoji: '🧩',
      skill: 'CRITICAL_THINKING',
      options: [
        'Wait for someone to help',
        'Guess randomly',
        'Find what you know and what you need',
        'Ask someone else to do it',
      ],
      correct: 2,
    },
    {
      questionText: 'What do you do?',
      story: 'Two friends gave you completely opposite advice about the same problem.',
      storyEmoji: '🤔',
      skill: 'CRITICAL_THINKING',
      options: [
        'Follow the friend you like more',
        'Ignore both and guess',
        'Listen to both and weigh the options',
        'Flip a coin',
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
      questionText: 'Which is the BEST response?',
      story: 'In a group discussion, someone says something you strongly disagree with.',
      storyEmoji: '💬',
      skill: 'COMMUNICATION',
      options: [
        'Stay silent and feel frustrated',
        'Interrupt and say they are wrong',
        'Wait, then calmly share your view',
        'Walk out of the room',
      ],
      correct: 2,
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
    {
      questionText: 'What makes you a GOOD listener?',
      story: 'Your friend is telling you about their problem.',
      storyEmoji: '👂',
      skill: 'COMMUNICATION',
      options: [
        'Check your phone while they talk',
        'Interrupt with your own stories',
        'Give full attention and ask questions',
        'Tell them it is not a big deal',
      ],
      correct: 2,
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
      questionText: 'What is the SAFEST thing to do?',
      story: 'You see a classmate being teased by older students in the playground.',
      storyEmoji: '🏫',
      skill: 'SOCIAL_EMOTIONAL',
      options: [
        'Walk away and ignore it',
        'Fight the older students alone',
        'Get a trusted adult immediately',
        'Video it and post online',
      ],
      correct: 2,
    },
    {
      questionText: 'What is the BEST response?',
      story: 'You made a mistake that hurt your friend\'s feelings.',
      storyEmoji: '💔',
      skill: 'SOCIAL_EMOTIONAL',
      options: [
        'Blame them for being sensitive',
        'Pretend nothing happened',
        'Sincerely apologise and make it better',
        'Say sorry quickly to end it',
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
      questionText: 'What is your FIRST instinct?',
      story: 'You are given a blank page and told to make something interesting.',
      storyEmoji: '📄',
      skill: 'CREATIVITY',
      options: [
        'Wait to be told what to do',
        'Leave it blank',
        'Start experimenting freely',
        'Copy something you have seen',
      ],
      correct: 2,
    },
    {
      questionText: 'Which idea shows the MOST creativity?',
      story: 'Your class needs to raise money for a school trip.',
      storyEmoji: '💰',
      skill: 'CREATIVITY',
      options: [
        'Ask parents directly for money',
        'Do a regular bake sale',
        'Create a unique talent show with student voting',
        'Do nothing and hope for the best',
      ],
      correct: 2,
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
      questionText: 'Which password is the STRONGEST?',
      story: 'You need to create a strong password for your account.',
      storyEmoji: '🔐',
      skill: 'DIGITAL_LITERACY',
      options: [
        'password123',
        'YourName2015',
        'correct-horse-battery-staple',
        '12345678',
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
    {
      questionText: 'What should you do?',
      story: 'An AI chatbot gives you an answer for your homework.',
      storyEmoji: '🤖',
      skill: 'DIGITAL_LITERACY',
      options: [
        'Copy it directly — AI is always right',
        'Verify it with reliable sources first',
        'Assume it is wrong — never trust AI',
        'Share it with all classmates',
      ],
      correct: 1,
    },
  ],
}

// ── TIER 3: Ages 13-20 — Scenario Text (existing) ────────────────────────────
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
      questionText: 'You read a headline: "Eating chocolate daily cures all diseases." What do you do?',
      skill: 'CRITICAL_THINKING',
      options: [
        'Share it immediately with all your friends',
        'Believe it because it is on the internet',
        'Search for the original study and check other sources',
        'Ignore it because health news is always fake',
      ],
      correct: 2,
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
      questionText: 'During a group discussion, someone says something you strongly disagree with. What do you do?',
      skill: 'COMMUNICATION',
      options: [
        'Stay silent and feel frustrated inside',
        'Interrupt them immediately and say they are wrong',
        'Wait for them to finish, then calmly share your perspective',
        'Walk out of the discussion',
      ],
      correct: 2,
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
      questionText: 'You made a mistake that hurt someone feelings. What is the BEST response?',
      skill: 'SOCIAL_EMOTIONAL',
      options: [
        'Blame them for being too sensitive',
        'Pretend nothing happened and avoid them',
        'Sincerely apologize and ask how you can make it better',
        'Say sorry quickly just to end the awkwardness',
      ],
      correct: 2,
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
    },
  ],
  CREATIVITY: [
    {
      questionText: 'Your teacher asks you to present a project WITHOUT using PowerPoint. What do you do?',
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
      questionText: 'You are given a blank page and told to make something interesting. What is your FIRST instinct?',
      skill: 'CREATIVITY',
      options: [
        'Wait for someone to tell you exactly what to draw or write',
        'Leave it blank because you are not creative',
        'Start experimenting with ideas, shapes, or words freely',
        'Copy something you have already seen before',
      ],
      correct: 2,
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
    },
  ],
  DIGITAL_LITERACY: [
    {
      questionText: 'You receive an email saying you won a prize and need to share your bank details. What do you do?',
      skill: 'DIGITAL_LITERACY',
      options: [
        'Reply immediately with your bank details to claim the prize',
        'Forward it to all your friends so they can win too',
        'Delete it as this is a phishing scam',
        'Click the link to see if the prize is real',
      ],
      correct: 2,
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
    },
    {
      questionText: 'You want to find reliable information for a school project. Which source is MOST trustworthy?',
      skill: 'DIGITAL_LITERACY',
      options: [
        'A random blog post with no author listed',
        'A YouTube comment with thousands of likes',
        'A government or university website with cited references',
        'Your friend social media post about the topic',
      ],
      correct: 2,
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
}

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

    const qMeta = QUESTION_ORDER[questionIndex]
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
