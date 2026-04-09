// lib/utils.ts — Shared utility functions
import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'
import { AgeGroup } from '@prisma/client'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Map age to AgeGroup enum
export function getAgeGroup(age: number): AgeGroup {
  if (age <= 7)  return AgeGroup.EARLY
  if (age <= 12) return AgeGroup.MIDDLE
  if (age <= 17) return AgeGroup.TEEN
  return AgeGroup.YOUNG_ADULT
}

// XP required per level (level 1 = 0 XP, level 2 = 100 XP, etc.)
export function xpForLevel(level: number): number {
  const xpMap: Record<number, number> = {
    1: 0, 2: 50, 3: 100, 4: 250,
    5: 500, 6: 1000, 7: 1500, 8: 2000
  }
  return xpMap[level] || 0
}

export function levelFromXp(xp: number): number {
  if (xp >= 2000) return 8
  if (xp >= 1500) return 7
  if (xp >= 1000) return 6
  if (xp >= 500)  return 5
  if (xp >= 250)  return 4
  if (xp >= 100)  return 3
  if (xp >= 50)   return 2
  return 1
}
}

// Skill rotation for 20 questions (4 questions per skill)
const SKILL_ROTATION = [
  'CRITICAL_THINKING', 'COMMUNICATION', 'SOCIAL_EMOTIONAL', 'CREATIVITY', 'DIGITAL_LITERACY',
  'CRITICAL_THINKING', 'COMMUNICATION', 'SOCIAL_EMOTIONAL', 'CREATIVITY', 'DIGITAL_LITERACY',
  'CRITICAL_THINKING', 'COMMUNICATION', 'SOCIAL_EMOTIONAL', 'CREATIVITY', 'DIGITAL_LITERACY',
  'CRITICAL_THINKING', 'COMMUNICATION', 'SOCIAL_EMOTIONAL', 'CREATIVITY', 'DIGITAL_LITERACY',
]

export function getSkillForQuestion(index: number): string {
  return SKILL_ROTATION[index] || 'CRITICAL_THINKING'
}

export function getSkillLabel(skill: string): string {
  const labels: Record<string, string> = {
    CRITICAL_THINKING:  'Critical Thinking',
    COMMUNICATION:      'Communication',
    SOCIAL_EMOTIONAL:   'Social-Emotional',
    CREATIVITY:         'Creativity',
    DIGITAL_LITERACY:   'Digital Literacy',
    FINANCIAL_LITERACY: 'Financial Literacy',
    HEALTH_WELLNESS:    'Health & Wellness',
    GOAL_SETTING:       'Goal Setting',
    SCIENTIFIC_THINKING:'Scientific Thinking',
    PUBLIC_SPEAKING:    'Public Speaking',
  }
  return labels[skill] || skill
}

export function getSkillColor(skill: string): string {
  const colors: Record<string, string> = {
    CRITICAL_THINKING:  '#5B2EFF',
    COMMUNICATION:      '#00B4D8',
    SOCIAL_EMOTIONAL:   '#FF4785',
    CREATIVITY:         '#FF6B35',
    DIGITAL_LITERACY:   '#00D68F',
    FINANCIAL_LITERACY: '#FFB800',
    HEALTH_WELLNESS:    '#06D6A0',
    GOAL_SETTING:       '#7209B7',
    SCIENTIFIC_THINKING:'#3A86FF',
    PUBLIC_SPEAKING:    '#FB5607',
  }
  return colors[skill] || '#5B2EFF'
}

export function getSkillEmoji(skill: string): string {
  const emojis: Record<string, string> = {
    CRITICAL_THINKING:  '🧠',
    COMMUNICATION:      '🗣️',
    SOCIAL_EMOTIONAL:   '💛',
    CREATIVITY:         '🎨',
    DIGITAL_LITERACY:   '💻',
    FINANCIAL_LITERACY: '💰',
    HEALTH_WELLNESS:    '🧘',
    GOAL_SETTING:       '🎯',
    SCIENTIFIC_THINKING:'🔬',
    PUBLIC_SPEAKING:    '🎤',
  }
  return emojis[skill] || '⭐'
}

export function getScoreLabel(score: number): { label: string; color: string } {
  if (score >= 85) return { label: 'Expert',      color: '#00D68F' }
  if (score >= 70) return { label: 'Proficient',  color: '#5B2EFF' }
  if (score >= 50) return { label: 'Developing',  color: '#FFB800' }
  if (score >= 30) return { label: 'Emerging',    color: '#FF6B35' }
  return              { label: 'Beginning',    color: '#FF4785' }
}

// Simple rate limiter store (in-memory — use Redis for production scale)
const rateLimitStore = new Map<string, { count: number; resetAt: number }>()

export function checkRateLimit(key: string, maxRequests = 30, windowMs = 60_000): boolean {
  const now = Date.now()
  const record = rateLimitStore.get(key)

  if (!record || now > record.resetAt) {
    rateLimitStore.set(key, { count: 1, resetAt: now + windowMs })
    return true
  }

  if (record.count >= maxRequests) return false
  record.count++
  return true
}

export function formatDate(date: Date | string): string {
  return new Date(date).toLocaleDateString('en-IN', {
    day: 'numeric', month: 'short', year: 'numeric',
  })
}
