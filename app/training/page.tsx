'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

interface Activity {
  id: string
  title: string
  description: string
  skill: string
  type: string
  difficulty: number
  xpReward: number
  durationMin: number
  tags: string[]
  isOffline: boolean
  content: Record<string, any>
}

interface ActivityLog {
  activityId: string
  completedAt: string
  xpEarned: number
}

const SKILL_CONFIG: Record<string, { color: string; bg: string; emoji: string; label: string }> = {
  CRITICAL_THINKING: { color: '#5B2EFF', bg: '#EDE9FF', emoji: '🧠', label: 'Critical Thinking' },
  COMMUNICATION:     { color: '#00B4D8', bg: '#E0F7FF', emoji: '🗣️', label: 'Communication' },
  SOCIAL_EMOTIONAL:  { color: '#FF4785', bg: '#FFE8EF', emoji: '💛', label: 'Social-Emotional' },
  CREATIVITY:        { color: '#FF6B35', bg: '#FFF0EB', emoji: '🎨', label: 'Creativity' },
  DIGITAL_LITERACY:  { color: '#00D68F', bg: '#E0FFF6', emoji: '💻', label: 'Digital Literacy' },
}

const TYPE_ICONS: Record<string, string> = {
  QUIZ: '❓', SIMULATION: '🎭', CREATIVE_TASK: '✏️',
  REFLECTION: '💭', CHALLENGE: '⚡', GAME: '🎮',
}

const DIFFICULTY_STARS = (d: number) => '⭐'.repeat(d) + '☆'.repeat(5 - d)

export default function TrainingPage() {
  const router = useRouter()
  const [sessionData, setSessionData] = useState<{
    childId: string; childName: string; avatar: string; childAge: number
  } | null>(null)
  const [activities, setActivities] = useState<Activity[]>([])
  const [completedIds, setCompletedIds] = useState<Set<string>>(new Set())
  const [logs, setLogs] = useState<ActivityLog[]>([])
  const [totalXp, setTotalXp] = useState(0)
  const [streakDays, setStreakDays] = useState(0)
  const [level, setLevel] = useState(1)
  const [filterSkill, setFilterSkill] = useState<string>('ALL')
  const [filterType, setFilterType] = useState<string>('ALL')
  const [selectedActivity, setSelectedActivity] = useState<Activity | null>(null)
  const [activeChallenge, setActiveChallenge] = useState<Activity | null>(null)
  const [challengeAnswer, setChallengeAnswer] = useState<string | number | null>(null)
  const [challengeDone, setChallengeDone] = useState(false)
  const [xpEarned, setXpEarned] = useState(0)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const stored = localStorage.getItem('skillozen_user')
    if (!stored) { router.push('/onboarding'); return }
    const session = JSON.parse(stored)
    setSessionData(session)
    loadActivities(session.childId, session.childAge)
  }, [router])

  async function loadActivities(childId: string, childAge: number) {
    setLoading(true)
    try {
      const res = await fetch(`/api/training/activities?childId=${childId}&childAge=${childAge}`)
      const data = await res.json()
      setActivities(data.activities || [])
      setCompletedIds(new Set(data.completedIds || []))
      setLogs(data.logs || [])
      setTotalXp(data.totalXp || 0)
      setStreakDays(data.streakDays || 0)
      setLevel(data.level || 1)
    } catch {
      console.error('Failed to load activities')
    } finally {
      setLoading(false)
    }
  }

  async function completeActivity(activity: Activity, score?: number) {
    if (!sessionData) return
    try {
      const res = await fetch('/api/training/complete', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          childId: sessionData.childId,
          activityId: activity.id,
          score,
        }),
      })
      const data = await res.json()
      setXpEarned(data.xpEarned || activity.xpReward)
      setTotalXp((prev) => prev + (data.xpEarned || activity.xpReward))
      setCompletedIds((prev) => new Set([...prev, activity.id]))
      setChallengeDone(true)
      // Update level
      const newXp = totalXp + (data.xpEarned || activity.xpReward)
      setLevel(Math.floor(newXp / 100) + 1)
    } catch {
      console.error('Failed to complete activity')
    }
  }

  const xpToNextLevel = level * 100
  const xpProgress = (totalXp % 100)

  const filtered = activities.filter((a) => {
    if (filterSkill !== 'ALL' && a.skill !== filterSkill) return false
    if (filterType !== 'ALL' && a.type !== filterType) return false
    return true
  })

  const daily = activities.filter((a) => !completedIds.has(a.id)).slice(0, 3)

  if (!sessionData) return null

  // ── ACTIVITY MODAL ──────────────────────────────────────────────────────────
  if (activeChallenge) {
    const cfg = SKILL_CONFIG[activeChallenge.skill]
    const content = activeChallenge.content as Record<string, any>

    return (
      <div className="min-h-screen bg-brand-base flex items-center justify-center p-4">
        <div className="max-w-2xl w-full">
          <div className="bg-white rounded-4xl shadow-card overflow-hidden">
            {/* Header */}
            <div className="p-6 text-white" style={{ background: cfg?.color || '#5B2EFF' }}>
              <div className="flex items-center justify-between mb-4">
                <span className="text-sm font-bold opacity-80">{cfg?.emoji} {cfg?.label}</span>
                <button onClick={() => { setActiveChallenge(null); setChallengeDone(false); setChallengeAnswer(null) }}
                        className="text-white/60 hover:text-white font-bold">
                  ✕
                </button>
              </div>
              <h2 className="font-display text-2xl font-black">{activeChallenge.title}</h2>
              <div className="flex items-center gap-3 mt-2 text-white/80 text-sm">
                <span>⏱️ {activeChallenge.durationMin} min</span>
                <span>⚡ +{activeChallenge.xpReward} XP</span>
              </div>
            </div>

            <div className="p-6">
              {challengeDone ? (
                <div className="text-center py-8 animate-slide-up">
                  <div className="text-6xl mb-4 animate-bounce-soft">🏆</div>
                  <h3 className="font-display text-3xl font-black text-brand-ink mb-2">
                    Awesome Work!
                  </h3>
                  <p className="text-gray-500 mb-4">You earned</p>
                  <div className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-brand-gold/10 text-brand-gold font-display font-black text-2xl mb-6">
                    ⚡ +{xpEarned} XP
                  </div>
                  <div className="text-sm text-gray-400 font-medium mb-8">
                    Level {level} · {totalXp} total XP
                  </div>
                  <button
                    onClick={() => { setActiveChallenge(null); setChallengeDone(false); setChallengeAnswer(null) }}
                    className="btn-primary px-8 py-3">
                    Continue Training →
                  </button>
                </div>
              ) : (
                <>
                  {/* QUIZ type */}
                  {activeChallenge.type === 'QUIZ' && (content.questions as Array<{ q: string; options: string[]; correct: number }>) && (
                    <div className="space-y-6">
                      {(content.questions as Array<{ q: string; options: string[]; correct: number }>).slice(0, 1).map((q, qi) => (
                        <div key={qi}>
                          <p className="font-display text-lg font-black text-brand-ink mb-4">{q.q}</p>
                          <div className="grid gap-2">
                            {q.options.map((opt, oi) => (
                              <button
                                key={oi}
                                onClick={() => setChallengeAnswer(oi)}
                                className={`w-full text-left p-4 rounded-2xl border-2 font-semibold transition-all ${
                                  challengeAnswer === oi
                                    ? oi === q.correct
                                      ? 'border-brand-mint bg-brand-mint/10 text-brand-mint'
                                      : 'border-red-300 bg-red-50 text-red-500'
                                    : 'border-gray-100 hover:border-gray-200'
                                }`}
                              >
                                {opt}
                                {challengeAnswer === oi && oi === q.correct && ' ✓'}
                              </button>
                            ))}
                          </div>
                        </div>
                      ))}
                      <button
                        disabled={challengeAnswer === null}
                        onClick={() => completeActivity(activeChallenge, challengeAnswer !== null ? 80 : 0)}
                        className="btn-primary w-full justify-center disabled:opacity-40"
                      >
                        Submit Answer →
                      </button>
                    </div>
                  )}

                  {/* REFLECTION type */}
                  {(activeChallenge.type === 'REFLECTION' || activeChallenge.type === 'CREATIVE_TASK') && (
                    <div>
                      <div className="bg-gray-50 rounded-2xl p-4 mb-6">
                        <p className="text-gray-700 font-medium leading-relaxed">
                          {(content.scenario as string) || (content.task as string) || (content.problem as string) || activeChallenge.description}
                        </p>
                      </div>
                      {content.prompts && (
                        <div className="mb-4 space-y-2">
                          {(content.prompts as string[]).map((p, i) => (
                            <div key={i} className="text-sm text-gray-600 font-medium flex gap-2">
                              <span className="text-brand-violet font-bold">→</span> {p}
                            </div>
                          ))}
                        </div>
                      )}
                      <textarea
                        value={challengeAnswer as string || ''}
                        onChange={(e) => setChallengeAnswer(e.target.value)}
                        placeholder="Write your response here..."
                        rows={5}
                        className="w-full px-4 py-3 rounded-2xl border-2 border-gray-200 focus:outline-none focus:border-brand-violet font-semibold resize-none mb-4"
                      />
                      <button
                        disabled={!challengeAnswer || (challengeAnswer as string).length < 10}
                        onClick={() => completeActivity(activeChallenge, 85)}
                        className="btn-primary w-full justify-center disabled:opacity-40"
                      >
                        Submit Reflection →
                      </button>
                    </div>
                  )}

                  {/* GAME / CHALLENGE / SIMULATION type */}
                  {['GAME', 'CHALLENGE', 'SIMULATION'].includes(activeChallenge.type) && (
                    <div>
                      <div className="bg-gray-50 rounded-2xl p-4 mb-6">
                        <p className="text-gray-700 font-medium leading-relaxed">
                          {(content.scenario as string) || (content.task as string) || activeChallenge.description}
                        </p>
                      </div>
                      {content.choices && (
                        <div className="grid gap-3 mb-6">
                          {(content.choices as Array<{ id: string; design?: string; text?: string; strength?: number; score?: number }>).map((c) => (
                            <button
                              key={c.id}
                              onClick={() => setChallengeAnswer(c.id)}
                              className={`w-full text-left p-4 rounded-2xl border-2 font-semibold transition-all ${
                                challengeAnswer === c.id
                                  ? 'border-brand-violet bg-brand-violet/5 text-brand-violet'
                                  : 'border-gray-100 hover:border-gray-200'
                              }`}
                            >
                              <span className="font-black mr-2">{c.id}.</span>
                              {c.design || c.text}
                            </button>
                          ))}
                        </div>
                      )}
                      {!content.choices && (
                        <div className="mb-6 p-4 rounded-2xl bg-brand-violet/5 border border-brand-violet/10">
                          <p className="text-sm text-gray-600">{activeChallenge.description}</p>
                        </div>
                      )}
                      <button
                        disabled={content.choices ? challengeAnswer === null : false}
                        onClick={() => completeActivity(activeChallenge, 80)}
                        className="btn-primary w-full justify-center disabled:opacity-40"
                      >
                        Complete Challenge →
                      </button>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    )
  }

  // ── MAIN TRAINING PAGE ──────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-brand-base pb-16">
      {/* Header */}
      <div className="relative overflow-hidden pt-8 pb-16"
           style={{ background: 'linear-gradient(135deg, #1A1033 0%, #2D1B69 100%)' }}>
        <div className="page-container relative text-white">
          <div className="flex items-center justify-between mb-6">
            <a href="/" className="text-white/60 hover:text-white text-sm font-semibold">← Home</a>
            <button onClick={() => router.push(`/results/${sessionData.childId}`)}>
              <span className="text-sm text-white/60 font-semibold">View Report →</span>
            </button>
          </div>

          <div className="flex items-center gap-4 mb-6">
            <div className="text-4xl">{sessionData.avatar}</div>
            <div>
              <h1 className="font-display text-3xl font-black">
                {sessionData.childName}&apos;s Training Hub
              </h1>
              <div className="text-white/60 text-sm font-semibold">Level {level} Learner</div>
            </div>
          </div>

          {/* Stats row */}
          <div className="grid grid-cols-3 gap-4">
            {[
              { label: 'Total XP', value: `⚡ ${totalXp}`, color: '#FFB800' },
              { label: 'Streak', value: `🔥 ${streakDays} days`, color: '#FF4785' },
              { label: 'Completed', value: `✅ ${completedIds.size}`, color: '#00D68F' },
            ].map((s) => (
              <div key={s.label} className="rounded-2xl p-4" style={{ background: 'rgba(255,255,255,0.1)' }}>
                <div className="text-lg font-bold" style={{ color: s.color }}>{s.value}</div>
                <div className="text-white/50 text-xs font-semibold">{s.label}</div>
              </div>
            ))}
          </div>

          {/* Level progress bar */}
          <div className="mt-4">
            <div className="flex justify-between text-xs text-white/50 font-semibold mb-1">
              <span>Level {level}</span>
              <span>{xpProgress}/100 XP to Level {level + 1}</span>
            </div>
            <div className="h-2 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.1)' }}>
              <div className="h-full rounded-full bg-gradient-to-r from-brand-gold to-brand-coral transition-all"
                   style={{ width: `${xpProgress}%` }} />
            </div>
          </div>
        </div>
      </div>

      <div className="page-container -mt-8">

        {/* Today's Queue */}
        {daily.length > 0 && (
          <div className="bg-white rounded-3xl shadow-card p-6 mb-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-display text-xl font-black text-brand-ink">⚡ Today&apos;s Challenges</h2>
              <span className="text-xs font-bold px-3 py-1 rounded-full bg-brand-coral/10 text-brand-coral">
                {daily.length} ready
              </span>
            </div>
            <div className="grid sm:grid-cols-3 gap-4">
              {daily.map((a) => {
                const cfg = SKILL_CONFIG[a.skill]
                return (
                  <button
                    key={a.id}
                    onClick={() => setActiveChallenge(a)}
                    className="activity-card text-left"
                    style={{ borderTop: `3px solid ${cfg?.color}` }}
                  >
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-2xl">{TYPE_ICONS[a.type] || '📚'}</span>
                      <span className="text-xs font-bold px-2 py-1 rounded-full text-white"
                            style={{ background: cfg?.color }}>
                        +{a.xpReward} XP
                      </span>
                    </div>
                    <h3 className="font-display font-black text-brand-ink text-sm mb-1">{a.title}</h3>
                    <p className="text-xs text-gray-400 font-medium">⏱️ {a.durationMin} min · {DIFFICULTY_STARS(a.difficulty)}</p>
                  </button>
                )
              })}
            </div>
          </div>
        )}

        {/* Filters */}
        <div className="flex flex-wrap gap-3 mb-6">
          <button
            onClick={() => setFilterSkill('ALL')}
            className={`px-4 py-2 rounded-xl text-sm font-bold transition-all ${
              filterSkill === 'ALL' ? 'bg-brand-violet text-white' : 'bg-white text-gray-500 hover:text-brand-violet'
            }`}
          >
            All Skills
          </button>
          {Object.entries(SKILL_CONFIG).map(([k, v]) => (
            <button
              key={k}
              onClick={() => setFilterSkill(k === filterSkill ? 'ALL' : k)}
              className={`px-4 py-2 rounded-xl text-sm font-bold transition-all ${
                filterSkill === k ? 'text-white' : 'bg-white text-gray-500'
              }`}
              style={filterSkill === k ? { background: v.color } : {}}
            >
              {v.emoji} {v.label.split(' ')[0]}
            </button>
          ))}
        </div>

        {/* Activity grid */}
        {loading ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="bg-white rounded-3xl p-5 shadow-card animate-pulse">
                <div className="h-4 bg-gray-100 rounded w-3/4 mb-3" />
                <div className="h-3 bg-gray-50 rounded w-full mb-2" />
                <div className="h-3 bg-gray-50 rounded w-2/3" />
              </div>
            ))}
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filtered.map((a) => {
              const cfg = SKILL_CONFIG[a.skill]
              const done = completedIds.has(a.id)
              return (
                <div
                  key={a.id}
                  className={`activity-card relative ${done ? 'opacity-60' : ''}`}
                  onClick={() => !done && setActiveChallenge(a)}
                >
                  {done && (
                    <div className="absolute top-4 right-4 w-8 h-8 rounded-full bg-brand-mint text-white text-sm font-black flex items-center justify-center">
                      ✓
                    </div>
                  )}
                  {a.isOffline && (
                    <div className="absolute top-4 left-4 text-xs font-bold px-2 py-0.5 rounded-full bg-gray-100 text-gray-500">
                      📴 Offline
                    </div>
                  )}
                  <div className="flex items-center gap-3 mb-3 mt-6">
                    <span className="text-3xl">{TYPE_ICONS[a.type] || '📚'}</span>
                    <span className="text-xs font-bold px-2 py-1 rounded-full text-white"
                          style={{ background: cfg?.color }}>
                      {cfg?.emoji} {cfg?.label.split(' ')[0]}
                    </span>
                  </div>
                  <h3 className="font-display font-black text-brand-ink mb-2">{a.title}</h3>
                  <p className="text-sm text-gray-500 mb-4 line-clamp-2">{a.description}</p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3 text-xs text-gray-400 font-medium">
                      <span>⏱️ {a.durationMin} min</span>
                      <span>{DIFFICULTY_STARS(a.difficulty)}</span>
                    </div>
                    <span className="text-xs font-bold" style={{ color: cfg?.color }}>+{a.xpReward} XP</span>
                  </div>
                  {a.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-3">
                      {a.tags.slice(0, 2).map((t) => (
                        <span key={t} className="text-xs px-2 py-0.5 rounded-full bg-gray-50 text-gray-400 font-medium">
                          #{t}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        )}

        {filtered.length === 0 && !loading && (
          <div className="text-center py-16">
            <div className="text-5xl mb-4">🔍</div>
            <p className="text-gray-500 font-semibold">No activities found for these filters.</p>
            <button onClick={() => { setFilterSkill('ALL'); setFilterType('ALL') }}
                    className="btn-ghost mt-4 text-sm">
              Clear Filters
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
