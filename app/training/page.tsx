'use client'

import { useEffect, useState, useCallback } from 'react'
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
  content: {
    story?: string
    question?: string
    options?: string[]
    correct?: number
    funFact?: string
    encouragement?: string
  }
}

const SKILL_CONFIG: Record<string, { color: string; bg: string; emoji: string; label: string }> = {
  CRITICAL_THINKING:  { color: '#5B2EFF', bg: '#EDE9FF', emoji: '🧠', label: 'Critical Thinking' },
  COMMUNICATION:      { color: '#00B4D8', bg: '#E0F7FF', emoji: '🗣️', label: 'Communication' },
  SOCIAL_EMOTIONAL:   { color: '#FF4785', bg: '#FFE8EF', emoji: '💛', label: 'Social-Emotional' },
  CREATIVITY:         { color: '#FF6B35', bg: '#FFF0EB', emoji: '🎨', label: 'Creativity' },
  DIGITAL_LITERACY:   { color: '#00D68F', bg: '#E0FFF6', emoji: '💻', label: 'Digital Literacy' },
  FINANCIAL_LITERACY: { color: '#FFB800', bg: '#FFF8E0', emoji: '💰', label: 'Financial Literacy' },
  HEALTH_WELLNESS:    { color: '#06D6A0', bg: '#E0FFF8', emoji: '🧘', label: 'Health & Wellness' },
  GOAL_SETTING:       { color: '#7209B7', bg: '#F3E8FF', emoji: '🎯', label: 'Goal Setting' },
  SCIENTIFIC_THINKING:{ color: '#3A86FF', bg: '#E8F1FF', emoji: '🔬', label: 'Scientific Thinking' },
  PUBLIC_SPEAKING:    { color: '#FB5607', bg: '#FFF0EB', emoji: '🎤', label: 'Public Speaking' },
}

const TYPE_ICONS: Record<string, string> = {
  QUIZ: '❓', SIMULATION: '🎭', CREATIVE_TASK: '✏️',
  REFLECTION: '💭', CHALLENGE: '⚡', GAME: '🎮',
}

function Confetti() {
  const pieces = Array.from({ length: 20 }, (_, i) => i)
  const colors = ['#5B2EFF', '#FF6B35', '#00D68F', '#FFB800', '#FF4785', '#00B4D8']
  return (
    <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
      {pieces.map((i) => (
        <div
          key={i}
          className="confetti-piece"
          style={{
            left: Math.random() * 100 + '%',
            width: Math.random() * 10 + 6 + 'px',
            height: Math.random() * 10 + 6 + 'px',
            background: colors[Math.floor(Math.random() * colors.length)],
            animationDuration: Math.random() * 2 + 2 + 's',
            animationDelay: Math.random() * 1 + 's',
            borderRadius: Math.random() > 0.5 ? '50%' : '2px',
          }}
        />
      ))}
    </div>
  )
}

export default function TrainingPage() {
  const router = useRouter()
  const [sessionData, setSessionData] = useState<{
    childId: string; childName: string; avatar: string; childAge: number
  } | null>(null)
  const [activities, setActivities] = useState<Activity[]>([])
  const [completedIds, setCompletedIds] = useState<Set<string>>(new Set())
  const [totalXp, setTotalXp] = useState(0)
  const [streakDays, setStreakDays] = useState(0)
  const [level, setLevel] = useState(1)
  const [filterSkill, setFilterSkill] = useState<string>('ALL')
  const [activeChallenge, setActiveChallenge] = useState<Activity | null>(null)
  const [selectedOption, setSelectedOption] = useState<number | null>(null)
  const [showAnswers, setShowAnswers] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [isCorrect, setIsCorrect] = useState(false)
  const [xpEarned, setXpEarned] = useState(0)
  const [showConfetti, setShowConfetti] = useState(false)
  const [loading, setLoading] = useState(true)
  const [completing, setCompleting] = useState(false)

  useEffect(() => {
    const stored = localStorage.getItem('skillozen_user')
    if (!stored) { router.push('/onboarding'); return }
    const session = JSON.parse(stored)
    setSessionData(session)
    loadActivities(session.childId, session.childAge)
  }, [router])

  const loadActivities = useCallback(async (childId: string, childAge: number) => {
    setLoading(true)
    try {
      const res = await fetch('/api/training/activities?childId=' + childId + '&childAge=' + childAge)
      const data = await res.json()
      setActivities(data.activities || [])
      setCompletedIds(new Set(data.completedIds || []))
      setTotalXp(data.totalXp || 0)
      setStreakDays(data.streakDays || 0)
      setLevel(data.level || 1)
    } catch {
      console.error('Failed to load activities')
    } finally {
      setLoading(false)
    }
  }, [])

  async function handleComplete() {
    if (!activeChallenge || !sessionData || completing) return
    if (selectedOption === null) return
    setCompleting(true)
    try {
      const correct = activeChallenge.content.correct
      const correct_answer = correct !== undefined && selectedOption === correct
      setIsCorrect(correct_answer)
      setSubmitted(true)

      const res = await fetch('/api/training/complete', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          childId: sessionData.childId,
          activityId: activeChallenge.id,
          score: correct_answer ? 100 : 50,
        }),
      })
      const data = await res.json()
      const earned = data.xpEarned || activeChallenge.xpReward
      setXpEarned(earned)
      setTotalXp((prev) => prev + earned)
      setCompletedIds((prev) => new Set([...prev, activeChallenge.id]))
      setLevel(data.level || level)
      setShowConfetti(true)
      setTimeout(() => setShowConfetti(false), 4000)
    } catch {
      console.error('Failed to complete activity')
    } finally {
      setCompleting(false)
    }
  }

  function closeChallenge() {
    setActiveChallenge(null)
    setSelectedOption(null)
    setSubmitted(false)
    setIsCorrect(false)
    setXpEarned(0)
  }

  const xpProgress = totalXp % 100
  const filtered = activities.filter((a) =>
    filterSkill === 'ALL' || a.skill === filterSkill
  )
  const daily = activities.filter((a) => !completedIds.has(a.id)).slice(0, 3)

  if (!sessionData) return null

  // ── ACTIVITY MODAL ──────────────────────────────────────────────────────────
  if (activeChallenge) {
    const cfg = SKILL_CONFIG[activeChallenge.skill]
    const content = activeChallenge.content
    const options = content.options || []
    const correct = content.correct ?? -1

    return (
      <div className="fixed inset-0 bg-black/60 flex items-center justify-center p-4 z-40">
        {showConfetti && <Confetti />}
        <div className="bg-white rounded-4xl shadow-glow w-full max-w-lg overflow-hidden animate-slide-up">
          {/* Header */}
          <div className="p-6 text-white" style={{ background: cfg?.color || '#5B2EFF' }}>
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm font-bold opacity-80">
                {cfg?.emoji} {cfg?.label}
              </span>
              <button
                onClick={closeChallenge}
                className="text-white/60 hover:text-white font-bold text-xl"
              >
                ✕
              </button>
            </div>
            <h2 className="font-display text-xl font-black">{activeChallenge.title}</h2>
            <div className="flex items-center gap-3 mt-2 text-white/80 text-sm">
              <span>{TYPE_ICONS[activeChallenge.type]} {activeChallenge.type.replace('_', ' ')}</span>
              <span>⏱️ {activeChallenge.durationMin} min</span>
              <span>⚡ +{activeChallenge.xpReward} XP</span>
            </div>
          </div>

          <div className="p-6 max-h-96 overflow-y-auto">
            {!submitted ? (
              <>
                {/* Story */}
                {content.story && (
                  <div className="bg-gray-50 rounded-2xl p-4 mb-5 border-l-4"
                       style={{ borderLeftColor: cfg?.color }}>
                    <p className="text-gray-700 font-medium text-sm leading-relaxed">
                      {content.story}
                    </p>
                  </div>
                )}

                {/* Question */}
                {content.question && (
                <p className="font-display text-lg font-black text-brand-ink mb-4">
                {content.question}
                </p>
                )}

               {/* Options */}
               {!showAnswers ? (
                <button
                onClick={() => setShowAnswers(true)}
                className="w-full py-4 rounded-2xl font-display font-black text-white text-lg"
                style={{ background: cfg?.color || '#5B2EFF' }}
                >
               Tap to Answer →
               </button>
              ) : (
              <div className="space-y-3">
              {options.map((opt, i) => (
                    <button
                      key={i}
                      onClick={() => setSelectedOption(i)}
                      className={`w-full text-left p-4 rounded-2xl border-2 font-semibold transition-all text-sm ${
                        selectedOption === i
                          ? 'border-brand-violet bg-brand-violet/5 text-brand-violet'
                          : 'border-gray-100 hover:border-gray-200 text-gray-700'
                      }`}
                    >
                      <span className={`inline-flex items-center justify-center w-7 h-7 rounded-xl text-xs font-black mr-3 border-2 transition-all ${
                        selectedOption === i
                          ? 'border-brand-violet bg-brand-violet text-white'
                          : 'border-gray-200 text-gray-400'
                      }`}>
                        {['A', 'B', 'C', 'D'][i]}
                      </span>
                      {opt}
                    </button>
                  ))}
                  </div>
                 )}

                <button
                  onClick={handleComplete}
                  disabled={selectedOption === null || completing}
                  className="btn-primary w-full justify-center py-4 mt-6 disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  {completing ? 'Checking...' : 'Submit Answer →'}
                </button>
              </>
            ) : (
              <div className="text-center py-4 animate-fade-in">
                {/* Result */}
                <div className="text-6xl mb-3 animate-bounce-soft">
                  {isCorrect ? '🎉' : '💪'}
                </div>
                <h3 className="font-display text-2xl font-black text-brand-ink mb-2">
                  {isCorrect ? 'Correct!' : 'Good Try!'}
                </h3>

                {/* Show correct answer if wrong */}
                {!isCorrect && correct >= 0 && (
                  <div className="mb-4 p-3 rounded-xl bg-brand-mint/10 border border-brand-mint/30 text-left">
                    <p className="text-sm font-bold text-brand-mint mb-1">Correct Answer:</p>
                    <p className="text-sm text-gray-700 font-medium">{options[correct]}</p>
                  </div>
                )}

                {/* XP earned */}
                <div className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-brand-gold/10 text-brand-gold font-display font-black text-xl mb-4">
                  ⚡ +{xpEarned} XP
                </div>

                {/* Fun fact */}
                {content.funFact && (
                  <div className="mb-4 p-4 rounded-2xl bg-brand-violet/5 border border-brand-violet/20 text-left">
                    <p className="text-xs font-black text-brand-violet mb-1">DID YOU KNOW?</p>
                    <p className="text-sm text-gray-700 font-medium leading-relaxed">
                      {content.funFact}
                    </p>
                  </div>
                )}

                {/* Encouragement */}
                {content.encouragement && (
                  <p className="text-sm font-bold text-gray-500 mb-6 italic">
                    {content.encouragement}
                  </p>
                )}

                {/* XP Progress */}
                <div className="mb-6">
                  <div className="flex justify-between text-xs font-semibold text-gray-400 mb-1">
                    <span>Level {level}</span>
                    <span>{xpProgress}/100 XP</span>
                  </div>
                  <div className="h-3 rounded-full bg-gray-100 overflow-hidden">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-brand-violet to-brand-coral transition-all duration-1000"
                      style={{ width: xpProgress + '%' }}
                    />
                  </div>
                </div>

                <button
                  onClick={closeChallenge}
                  className="btn-primary w-full justify-center py-4"
                >
                  Continue Training →
                </button>
              </div>
            )}
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
            <a href="/dashboard" className="text-white/60 hover:text-white text-sm font-semibold">
              Home
            </a>
            <button
              onClick={() => router.push('/dashboard')}
              className="text-white/60 hover:text-white text-sm font-semibold"
            >
              Dashboard
            </button>
          </div>

          <div className="flex items-center gap-4 mb-6">
            <div className="text-4xl">{sessionData.avatar}</div>
            <div>
              <h1 className="font-display text-3xl font-black">
                {sessionData.childName} Training Hub
              </h1>
              <div className="text-white/60 text-sm font-semibold">
                Level {level} Learner
              </div>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-4 mb-4">
            {[
              { label: 'Total XP',  value: '⚡ ' + totalXp,          color: '#FFB800' },
              { label: 'Streak',    value: '🔥 ' + streakDays + ' days', color: '#FF4785' },
              { label: 'Completed', value: '✅ ' + completedIds.size,  color: '#00D68F' },
            ].map((s) => (
              <div key={s.label} className="rounded-2xl p-4"
                   style={{ background: 'rgba(255,255,255,0.1)' }}>
                <div className="text-lg font-bold" style={{ color: s.color }}>{s.value}</div>
                <div className="text-white/50 text-xs font-semibold">{s.label}</div>
              </div>
            ))}
          </div>

          {/* Level bar */}
          <div>
            <div className="flex justify-between text-xs text-white/50 font-semibold mb-1">
              <span>Level {level}</span>
              <span>{xpProgress}/100 XP to Level {level + 1}</span>
            </div>
            <div className="h-2 rounded-full overflow-hidden"
                 style={{ background: 'rgba(255,255,255,0.1)' }}>
              <div
                className="h-full rounded-full bg-gradient-to-r from-brand-gold to-brand-coral transition-all"
                style={{ width: xpProgress + '%' }}
              />
            </div>
          </div>
        </div>
      </div>

      <div className="page-container mt-4">

        {/* Today Queue */}
        {daily.length > 0 && (
          <div className="bg-white rounded-3xl shadow-card p-6 mb-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-display text-xl font-black text-brand-ink">
                ⚡ Today Challenges
              </h2>
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
                    onClick={() => {
                      setActiveChallenge(a)
                      setShowAnswers(false)
                      setSelectedOption(null)
                      setSelectedOption(null)
                      setSubmitted(false)
                    }}
                    className="activity-card text-left"
                    style={{ borderTop: '3px solid ' + cfg?.color }}
                  >
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-2xl">{TYPE_ICONS[a.type] || '📚'}</span>
                      <span className="text-xs font-bold px-2 py-1 rounded-full text-white"
                            style={{ background: cfg?.color }}>
                        +{a.xpReward} XP
                      </span>
                    </div>
                    <h3 className="font-display font-black text-brand-ink text-sm mb-1">
                      {a.title}
                    </h3>
                    <p className="text-xs text-gray-400 font-medium">
                      ⏱️ {a.durationMin} min
                    </p>
                  </button>
                )
              })}
            </div>
          </div>
        )}

        {/* Skill Filters */}
        <div className="flex flex-wrap gap-2 mb-6">
          <button
            onClick={() => setFilterSkill('ALL')}
            className={'px-4 py-2 rounded-xl text-sm font-bold transition-all ' +
              (filterSkill === 'ALL' ? 'bg-brand-violet text-white' : 'bg-white text-gray-500 hover:text-brand-violet')}
          >
            All Skills
          </button>
          {Object.entries(SKILL_CONFIG).map(([k, v]) => (
            <button
              key={k}
              onClick={() => setFilterSkill(k === filterSkill ? 'ALL' : k)}
              className={'px-4 py-2 rounded-xl text-sm font-bold transition-all ' +
                (filterSkill === k ? 'text-white' : 'bg-white text-gray-500')}
              style={filterSkill === k ? { background: v.color } : {}}
            >
              {v.emoji} {v.label.split(' ')[0]}
            </button>
          ))}
        </div>

        {/* Activities Grid */}
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
                  className={'activity-card relative ' + (done ? 'opacity-60' : '')}
                  onClick={() => {
                    if (!done) {
                      setActiveChallenge(a)
                      setShowAnswers(false)
                      setSelectedOption(null)
                      setSelectedOption(null)
                      setSubmitted(false)
                    }
                  }}
                >
                  {done && (
                    <div className="absolute top-4 right-4 w-8 h-8 rounded-full bg-brand-mint text-white text-sm font-black flex items-center justify-center">
                      ✓
                    </div>
                  )}
                  <div className="flex items-center gap-3 mb-3">
                    <span className="text-3xl">{TYPE_ICONS[a.type] || '📚'}</span>
                    <span className="text-xs font-bold px-2 py-1 rounded-full text-white"
                          style={{ background: cfg?.color }}>
                      {cfg?.emoji} {cfg?.label.split(' ')[0]}
                    </span>
                  </div>
                  <h3 className="font-display font-black text-brand-ink mb-2">{a.title}</h3>
                  <p className="text-sm text-gray-500 mb-4 line-clamp-2">{a.description}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-400 font-medium">⏱️ {a.durationMin} min</span>
                    <span className="text-xs font-bold" style={{ color: cfg?.color }}>
                      +{a.xpReward} XP
                    </span>
                  </div>
                </div>
              )
            })}
          </div>
        )}

        {filtered.length === 0 && !loading && (
          <div className="text-center py-16">
            <div className="text-5xl mb-4">🔍</div>
            <p className="text-gray-500 font-semibold">No activities found.</p>
            <button
              onClick={() => setFilterSkill('ALL')}
              className="btn-ghost mt-4 text-sm"
            >
              Show All
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
