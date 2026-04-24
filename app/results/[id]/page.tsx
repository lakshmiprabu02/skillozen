'use client'

import { useEffect, useState } from 'react'
import { useRouter, useParams, useSearchParams } from 'next/navigation'
import {
  RadarChart, PolarGrid, PolarAngleAxis, Radar, ResponsiveContainer,
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Cell,
} from 'recharts'

interface SkillProfile {
  criticalThinking: number
  communication: number
  socialEmotional: number
  creativity: number
  digitalLiteracy: number
  financialLiteracy: number
  healthWellness: number
  goalSetting: number
  scientificThinking: number
  publicSpeaking: number
  overallScore: number
  strengths: string[]
  gaps: string[]
  recommendations: string[]
  summary: string
  criticalThinkingPct: number
  communicationPct: number
  socialEmotionalPct: number
  creativityPct: number
  digitalLiteracyPct: number
  financialLiteracyPct: number
  healthWellnessPct: number
  goalSettingPct: number
  scientificThinkingPct: number
  publicSpeakingPct: number
  child?: {
    name: string
    age: number
    avatarEmoji: string
  }
}

const SKILL_CONFIG = [
  { key: 'criticalThinking',  pctKey: 'criticalThinkingPct',  label: 'Critical Thinking',  emoji: '🧠', color: '#5B2EFF' },
  { key: 'communication',     pctKey: 'communicationPct',     label: 'Communication',      emoji: '🗣️', color: '#00B4D8' },
  { key: 'socialEmotional',   pctKey: 'socialEmotionalPct',   label: 'Social-Emotional',   emoji: '💛', color: '#FF4785' },
  { key: 'creativity',        pctKey: 'creativityPct',        label: 'Creativity',          emoji: '🎨', color: '#FF6B35' },
  { key: 'digitalLiteracy',   pctKey: 'digitalLiteracyPct',   label: 'Digital Literacy',   emoji: '💻', color: '#00D68F' },
  { key: 'financialLiteracy', pctKey: 'financialLiteracyPct', label: 'Financial Literacy', emoji: '💰', color: '#FFB800' },
  { key: 'healthWellness',    pctKey: 'healthWellnessPct',    label: 'Health & Wellness',  emoji: '🧘', color: '#06D6A0' },
  { key: 'goalSetting',       pctKey: 'goalSettingPct',       label: 'Goal Setting',        emoji: '🎯', color: '#7209B7' },
  { key: 'scientificThinking',pctKey: 'scientificThinkingPct',label: 'Scientific Thinking',emoji: '🔬', color: '#3A86FF' },
  { key: 'publicSpeaking',    pctKey: 'publicSpeakingPct',    label: 'Public Speaking',    emoji: '🎤', color: '#FB5607' },
]

function ScoreLabel({ score }: { score: number }) {
  const { label, color } =
    score >= 85 ? { label: 'Expert',     color: '#00D68F' } :
    score >= 70 ? { label: 'Proficient', color: '#5B2EFF' } :
    score >= 50 ? { label: 'Developing', color: '#FFB800' } :
    score >= 30 ? { label: 'Emerging',   color: '#FF6B35' } :
                  { label: 'Beginning',  color: '#FF4785' }
  return (
    <span className="text-xs font-black px-2 py-1 rounded-full text-white"
          style={{ background: color }}>
      {label}
    </span>
  )
}

export default function ResultsPage() {
  const router = useRouter()
  const params = useParams()
  const assessmentId = params.id as string
  const searchParams = useSearchParams()
  const urlChildName = searchParams.get('name')
  const [profile, setProfile] = useState<SkillProfile | null>(null)
  const [sessionData, setSessionData] = useState<{
    childName: string; avatar: string; childAge: number; plan: string
  } | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [retries, setRetries] = useState(0)

  useEffect(() => {
    const stored = localStorage.getItem('skillozen_user')
    if (stored) setSessionData(JSON.parse(stored))
    loadProfile()
  }, [assessmentId])

  async function loadProfile() {
    try {
      const res = await fetch('/api/assessment/result?id=' + assessmentId)
      const data = await res.json()
      if (res.status === 202 && retries < 10) {
        setTimeout(() => {
          setRetries((r) => r + 1)
          loadProfile()
        }, 3000)
        return
      }
      if (!res.ok) throw new Error(data.error)
      setProfile(data.profile)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load results')
    } finally {
      setLoading(false)
    }
  }

  if (loading) return (
    <div className="min-h-screen bg-brand-base flex items-center justify-center">
      <div className="text-center animate-fade-in">
        <div className="text-6xl mb-4 animate-float">📊</div>
        <h2 className="font-display text-2xl font-black text-brand-ink mb-2">
          Building Your Skill Report Card...
        </h2>
        <p className="text-gray-500 mb-4">
          Analysing {urlChildName || profile?.child?.name || sessionData?.childName || 'your child'}&apos;s answers across all 10 skills
        </p>
        <div className="flex items-center justify-center gap-2 text-gray-400">
          <div className="w-4 h-4 rounded-full border-2 border-brand-violet border-t-transparent animate-spin" />
          This takes about 15 seconds
        </div>
      </div>
    </div>
  )

  if (error) return (
    <div className="min-h-screen bg-brand-base flex items-center justify-center p-4">
      <div className="text-center max-w-md">
        <div className="text-5xl mb-4">⚠️</div>
        <p className="text-gray-600 mb-4">{error}</p>
        <button onClick={() => router.push('/dashboard')} className="btn-primary">
          Back to Dashboard
        </button>
      </div>
    </div>
  )

  if (!profile) return null

  const radarData = SKILL_CONFIG.map((s) => ({
    skill: s.emoji + ' ' + s.label.split(' ')[0],
    score: profile[s.key as keyof SkillProfile] as number,
    fullMark: 100,
  }))

  const barData = SKILL_CONFIG.map((s) => ({
    name: s.emoji,
    score: profile[s.key as keyof SkillProfile] as number,
    color: s.color,
    label: s.label,
  }))

  const topSkills = [...SKILL_CONFIG]
    .sort((a, b) =>
      (profile[b.key as keyof SkillProfile] as number) -
      (profile[a.key as keyof SkillProfile] as number)
    )
    .slice(0, 3)

  const weakSkills = [...SKILL_CONFIG]
    .sort((a, b) =>
      (profile[a.key as keyof SkillProfile] as number) -
      (profile[b.key as keyof SkillProfile] as number)
    )
    .slice(0, 3)

  return (
    <div className="min-h-screen bg-brand-base pb-16">
      {/* Header */}
      <div className="relative overflow-hidden pt-12 pb-20"
           style={{ background: 'linear-gradient(135deg, #1A1033 0%, #2D1B69 100%)' }}>
        <div className="page-container relative text-white">
          <a href="/dashboard"
             className="text-white/60 hover:text-white font-semibold text-sm transition-colors mb-8 inline-flex items-center gap-1">
            ← Back to Dashboard
          </a>
          <div className="flex flex-col md:flex-row items-start md:items-center gap-6 mt-4">
            <div className="w-24 h-24 rounded-3xl flex items-center justify-center text-5xl"
                 style={{ background: 'rgba(255,255,255,0.1)' }}>
              {profile?.child?.avatarEmoji || sessionData?.avatar || '🧒'}
            </div>
            <div>
              <div className="text-white/60 font-semibold mb-1">
                10-Skill Report Card
              </div>
              <h1 className="font-display text-4xl font-black">
                {profile?.child?.name || sessionData?.childName || 'Explorer'}&apos;s Results
              </h1>
              <div className="flex items-center gap-3 mt-3">
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-bold"
                     style={{ background: 'rgba(255,255,255,0.15)' }}>
                  Age {profile?.child?.age || sessionData?.childAge}
                </div>
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-bold"
                     style={{ background: 'rgba(91,46,255,0.4)' }}>
                  Overall: {profile.overallScore}/100
                </div>
              </div>
            </div>
            {/* Overall score ring */}
            <div className="md:ml-auto text-center">
              <div className="relative w-32 h-32 mx-auto">
                <svg className="w-full h-full -rotate-90" viewBox="0 0 120 120">
                  <circle cx="60" cy="60" r="50" fill="none"
                          stroke="rgba(255,255,255,0.1)" strokeWidth="12" />
                  <circle cx="60" cy="60" r="50" fill="none"
                          stroke="#5B2EFF" strokeWidth="12"
                          strokeDasharray={`${(profile.overallScore / 100) * 314} 314`}
                          strokeLinecap="round" />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="font-display text-3xl font-black text-white">
                    {profile.overallScore}
                  </span>
                  <span className="text-white/60 text-xs font-semibold">/ 100</span>
                </div>
              </div>
              <div className="mt-2">
                <ScoreLabel score={profile.overallScore} />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="page-container -mt-6">
        {/* Summary */}
        <div className="bg-white rounded-3xl shadow-card p-6 mb-6 col-span-full">
          <h2 className="font-display text-xl font-black text-brand-ink mb-3">
            📋 Summary
          </h2>
          <p className="text-gray-600 leading-relaxed">{profile.summary}</p>
        </div>

        <div className="grid md:grid-cols-2 gap-6 mb-6">
          {/* Radar Chart */}
          <div className="bg-white rounded-3xl shadow-card p-6">
            <h2 className="font-display text-xl font-black text-brand-ink mb-6">
              🕸️ Skill Radar
            </h2>
            <ResponsiveContainer width="100%" height={300}>
              <RadarChart data={radarData}>
                <PolarGrid stroke="#e5e7eb" />
                <PolarAngleAxis
                  dataKey="skill"
                  tick={{ fill: '#374151', fontSize: 10, fontWeight: 600 }}
                />
                <Radar
                  name="Skills"
                  dataKey="score"
                  stroke="#5B2EFF"
                  fill="#5B2EFF"
                  fillOpacity={0.2}
                  strokeWidth={2}
                />
              </RadarChart>
            </ResponsiveContainer>
          </div>

          {/* Bar Chart */}
          <div className="bg-white rounded-3xl shadow-card p-6">
            <h2 className="font-display text-xl font-black text-brand-ink mb-2">
              📊 All Skill Scores
            </h2>
            <p className="text-xs text-gray-400 font-medium mb-4">Score out of 100</p>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={barData} margin={{ left: -20 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
                <XAxis dataKey="name" tick={{ fontSize: 16 }} />
                <YAxis domain={[0, 100]} tick={{ fontSize: 11 }} />
                <Tooltip
                  formatter={(value: number, _: string, props: { payload?: { label?: string } }) => [
                    `${value}/100`,
                    props.payload?.label || 'Score',
                  ]}
                  contentStyle={{
                    borderRadius: '12px',
                    border: 'none',
                    boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
                  }}
                />
                <Bar dataKey="score" radius={[6, 6, 0, 0]}>
                  {barData.map((entry, i) => (
                    <Cell key={i} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Top 3 Skills */}
        <div className="grid md:grid-cols-2 gap-6 mb-6">
          <div className="bg-white rounded-3xl shadow-card p-6">
            <h2 className="font-display text-xl font-black text-brand-ink mb-4 flex items-center gap-2">
              🏆 Top 3 Skills
            </h2>
            <div className="space-y-3">
              {topSkills.map((s, i) => {
                const score = profile[s.key as keyof SkillProfile] as number
                return (
                  <div key={s.key}
                       className="flex items-center gap-4 p-3 rounded-2xl"
                       style={{ background: s.color + '15' }}>
                    <span className="font-black text-lg w-6"
                          style={{ color: s.color }}>
                      {i + 1}
                    </span>
                    <span className="text-xl">{s.emoji}</span>
                    <div className="flex-1">
                      <div className="font-bold text-sm text-brand-ink">{s.label}</div>
                      <div className="h-2 rounded-full bg-white/50 mt-1 overflow-hidden">
                        <div className="h-full rounded-full transition-all"
                             style={{ width: score + '%', background: s.color }} />
                      </div>
                    </div>
                    <span className="font-black text-lg" style={{ color: s.color }}>
                      {score}
                    </span>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Focus Areas */}
          <div className="bg-white rounded-3xl shadow-card p-6">
            <h2 className="font-display text-xl font-black text-brand-ink mb-4 flex items-center gap-2">
              🎯 Focus Areas
            </h2>
            <div className="space-y-3">
              {weakSkills.map((s, i) => {
                const score = profile[s.key as keyof SkillProfile] as number
                return (
                  <div key={s.key}
                       className="flex items-center gap-4 p-3 rounded-2xl bg-orange-50 border border-orange-100">
                    <span className="font-black text-lg w-6 text-brand-coral">
                      {i + 1}
                    </span>
                    <span className="text-xl">{s.emoji}</span>
                    <div className="flex-1">
                      <div className="font-bold text-sm text-brand-ink">{s.label}</div>
                      <div className="h-2 rounded-full bg-white mt-1 overflow-hidden">
                        <div className="h-full rounded-full transition-all"
                             style={{ width: score + '%', background: s.color }} />
                      </div>
                    </div>
                    <span className="font-black text-lg" style={{ color: s.color }}>
                      {score}
                    </span>
                  </div>
                )
              })}
            </div>
          </div>
        </div>

        {/* All 10 Skill Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 mb-6">
          {SKILL_CONFIG.map((s) => {
            const score = profile[s.key as keyof SkillProfile] as number
            const pct   = profile[s.pctKey as keyof SkillProfile] as number
            return (
              <div key={s.key}
                   className="bg-white rounded-2xl p-4 shadow-card border-t-4 text-center"
                   style={{ borderTopColor: s.color }}>
                <div className="text-3xl mb-2">{s.emoji}</div>
                <div className="font-bold text-xs text-gray-600 mb-1 leading-tight">
                  {s.label}
                </div>
                <div className="font-display text-2xl font-black mb-1"
                     style={{ color: s.color }}>
                  {score}
                </div>
                <ScoreLabel score={score} />
                <div className="mt-2 text-xs text-gray-400 font-medium">
                  Top {100 - pct}% globally
                </div>
                <div className="mt-2 h-1.5 rounded-full bg-gray-100 overflow-hidden">
                  <div className="h-full rounded-full"
                       style={{ width: score + '%', background: s.color }} />
                </div>
              </div>
            )
          })}
        </div>

        {/* Strengths and Gaps */}
        <div className="grid md:grid-cols-2 gap-6 mb-6">
          <div className="bg-white rounded-3xl shadow-card p-6">
            <h2 className="font-display text-xl font-black text-brand-ink mb-5 flex items-center gap-2">
              <span className="text-brand-mint">✨</span> Key Strengths
            </h2>
            <div className="space-y-3">
              {profile.strengths.map((s, i) => (
                <div key={i}
                     className="flex items-start gap-3 p-3 rounded-2xl bg-brand-mint/5 border border-brand-mint/20">
                  <span className="text-brand-mint font-black mt-0.5">✓</span>
                  <span className="text-gray-700 font-medium text-sm">{s}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-3xl shadow-card p-6">
            <h2 className="font-display text-xl font-black text-brand-ink mb-5 flex items-center gap-2">
              <span className="text-brand-coral">🎯</span> Growth Opportunities
            </h2>
            <div className="space-y-3">
              {profile.gaps.map((g, i) => (
                <div key={i}
                     className="flex items-start gap-3 p-3 rounded-2xl bg-orange-50 border border-orange-100">
                  <span className="text-brand-coral font-black mt-0.5">→</span>
                  <span className="text-gray-700 font-medium text-sm">{g}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Recommendations */}
        <div className="bg-white rounded-3xl shadow-card p-6 mb-6">
          <h2 className="font-display text-xl font-black text-brand-ink mb-5 flex items-center gap-2">
            <span className="text-brand-violet">💡</span> Recommended Action Steps
          </h2>
          <div className="grid sm:grid-cols-3 gap-4">
            {profile.recommendations.map((r, i) => (
              <div key={i}
                   className="p-4 rounded-2xl border-2 border-brand-violet/10 bg-brand-violet/5">
                <div className="w-8 h-8 rounded-xl bg-brand-violet text-white font-black text-sm flex items-center justify-center mb-3">
                  {i + 1}
                </div>
                <p className="text-gray-700 font-medium text-sm leading-relaxed">{r}</p>
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="mt-8 rounded-3xl p-8 text-center text-white"
             style={{ background: 'linear-gradient(135deg, #5B2EFF 0%, #FF6B35 100%)' }}>
          <h2 className="font-display text-3xl font-black mb-3">
            Ready to Strengthen These Skills?
          </h2>
          <p className="text-white/80 mb-6">
            Start daily 5-15 minute activities personalised to{' '}
            {profile?.child?.name || sessionData?.childName}&apos;s skill gaps across all 10 life skills.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              onClick={() => router.push('/training')}
              className="px-8 py-4 bg-white text-brand-violet font-display font-black text-lg rounded-2xl hover:scale-105 transition-transform">
              🚀 Start Training →
            </button>
            <div className="text-white/70 text-sm font-semibold">
              1,500+ activities · XP rewards · Daily streaks
            </div>
          </div>
        </div>

        {/* Reassessment notice */}
        {!sessionData ? null : (sessionData.plan === 'STANDARD' || sessionData.plan === 'PREMIUM') ? (
        <div className="mt-6 p-5 rounded-2xl bg-white shadow-card flex items-center gap-4">
          <span className="text-3xl">🔄</span>
          <div>
            <div className="font-bold text-brand-ink">Next Assessment</div>
            <div className="text-sm text-gray-500">
              Come back in 3 months to track{' '}
              {profile?.child?.name || sessionData?.childName}&apos;s measurable growth across all 10 skills!
            </div>
          </div>
        </div>
      ) : (
        <div className="mt-6 p-5 rounded-2xl bg-white shadow-card flex items-center gap-4">
          <span className="text-3xl">🔒</span>
          <div className="flex-1">
            <div className="font-bold text-brand-ink">Want to track growth over time?</div>
            <div className="text-sm text-gray-500 mt-1">
              Upgrade to Standard to unlock unlimited assessments and measure{' '}
              {sessionData.childName}&apos;s improvement every month.
            </div>
          </div>
          <a href="/pricing"
            className="flex-shrink-0 px-4 py-2 rounded-xl bg-brand-violet text-white text-sm font-black hover:opacity-90 transition-opacity">
            Upgrade →
          </a>
        </div>
      )}
      </div>
    </div>
  )
}
