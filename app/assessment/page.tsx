'use client'

import { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'

interface Question {
  questionText: string
  questionType: 'scenario' | 'reflection' | 'choice' | 'open-ended'
  skill: string
  options?: string[]
  followUp?: string
}

const SKILL_COLORS: Record<string, string> = {
  CRITICAL_THINKING: '#5B2EFF',
  COMMUNICATION:     '#00B4D8',
  SOCIAL_EMOTIONAL:  '#FF4785',
  CREATIVITY:        '#FF6B35',
  DIGITAL_LITERACY:  '#00D68F',
}

const SKILL_LABELS: Record<string, string> = {
  CRITICAL_THINKING: '🧠 Critical Thinking',
  COMMUNICATION:     '🗣️ Communication',
  SOCIAL_EMOTIONAL:  '💛 Social-Emotional',
  CREATIVITY:        '🎨 Creativity',
  DIGITAL_LITERACY:  '💻 Digital Literacy',
}

const ENCOURAGEMENTS = [
  'Great thinking! 🌟', 'Love that answer! ✨', 'You\'re crushing it! 🔥',
  'Brilliant! 💡', 'Amazing response! 🎯', 'Keep going! 🚀', 'Nice one! 👏',
]

export default function AssessmentPage() {
  const router = useRouter()
  const [sessionData, setSessionData] = useState<{
    userId: string; childId: string; childName: string; childAge: number; avatar: string
  } | null>(null)
  const [assessmentId, setAssessmentId] = useState<string | null>(null)
  const [currentQ, setCurrentQ] = useState(0)
  const [question, setQuestion] = useState<Question | null>(null)
  const [correctAnswer, setCorrectAnswer] = useState<number | null>(null)
  const [answer, setAnswer] = useState('')
  const [selectedOption, setSelectedOption] = useState<number | null>(null)
  const [loading, setLoading] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [encouragement, setEncouragement] = useState('')
  const [showEncouragement, setShowEncouragement] = useState(false)
  const [xpGained, setXpGained] = useState(0)
  const [totalXp, setTotalXp] = useState(0)
  const [error, setError] = useState('')
  const [phase, setPhase] = useState<'intro' | 'question' | 'complete'>('intro')

  // Load session from localStorage
  useEffect(() => {
    const stored = localStorage.getItem('skillozen_user')
    if (!stored) { router.push('/onboarding'); return }
    setSessionData(JSON.parse(stored))
  }, [router])

  const startAssessment = useCallback(async () => {
    if (!sessionData) return
    setLoading(true)
    try {
      const res = await fetch('/api/assessment/start', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ childId: sessionData.childId }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error)
      setAssessmentId(data.assessmentId)
      setPhase('question')
      await fetchQuestion(data.assessmentId, 0, [])
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to start assessment')
    } finally {
      setLoading(false)
    }
  }, [sessionData])

  async function fetchQuestion(assId: string, qIndex: number, prevAnswers: Array<{ skill: string; score: number }>) {
    setLoading(true)
    setAnswer('')
    setSelectedOption(null)
    try {
      const res = await fetch('/api/assessment/question', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          assessmentId: assId,
          questionIndex: qIndex,
          childAge: sessionData?.childAge,
          childName: sessionData?.childName,
          previousAnswers: prevAnswers,
        }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error)
      setQuestion(data.question)
      setCorrectAnswer(data.question.correct ?? null)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load question')
    } finally {
      setLoading(false)
    }
  }

  async function submitAnswer() {
    if (!assessmentId || !question || !sessionData) return
    if (question.questionType === 'choice' && selectedOption === null) return
    if (question.questionType !== 'choice' && !answer.trim()) return

    setSubmitting(true)
    try {
      const res = await fetch('/api/assessment/complete', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          assessmentId,
          questionIndex: currentQ,
          questionText: question.questionText,
          skill: question.skill,
          answerText: selectedOption !== null ? question.options?.[selectedOption] : answer,
          selectedOption,
          options: question.options,
          correctAnswer: correctAnswer ?? undefined,
          childAge: sessionData.childAge,
        }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error)

      // XP feedback
      const xp = Math.round((data.score / 10) * 15)
      setXpGained(xp)
      setTotalXp((prev) => prev + xp)

      // Encouragement
      setEncouragement(ENCOURAGEMENTS[Math.floor(Math.random() * ENCOURAGEMENTS.length)])
      setShowEncouragement(true)
      setTimeout(() => setShowEncouragement(false), 1500)

      const nextQ = currentQ + 1
      if (nextQ >= 20 || data.assessmentComplete) {
        // Navigate to results
        setPhase('complete')
        setTimeout(() => router.push(`/results/${assessmentId}`), 2000)
        return
      }

      setCurrentQ(nextQ)
      await fetchQuestion(assessmentId, nextQ, data.previousAnswers || [])
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to submit answer')
    } finally {
      setSubmitting(false)
    }
  }

  const progress = (currentQ / 20) * 100
  const skillColor = question ? SKILL_COLORS[question.skill] || '#5B2EFF' : '#5B2EFF'

  if (!sessionData) return null

  // ── INTRO SCREEN ─────────────────────────────────────────────────────────────
  if (phase === 'intro') {
    return (
      <div className="min-h-screen bg-brand-base flex items-center justify-center p-4">
        <div className="max-w-lg w-full text-center animate-fade-in">
          <div className="text-8xl mb-6 animate-float">🎮</div>
          <h1 className="font-display text-4xl font-black text-brand-ink mb-4">
            {sessionData.avatar} {sessionData.childName}&apos;s Skill Adventure!
          </h1>
          <p className="text-gray-500 text-lg mb-8 leading-relaxed">
            You&apos;re about to explore <strong>20 fun challenges</strong> that help us understand your amazing skills.
            There are no right or wrong answers — just be yourself!
          </p>

          <div className="grid grid-cols-3 gap-4 mb-8">
            {[
              { icon: '⏱️', label: '~10 minutes' },
              { icon: '🎯', label: '20 questions' },
              { icon: '🏆', label: 'Earn XP!' },
            ].map((s) => (
              <div key={s.label} className="bg-white rounded-2xl p-4 shadow-card">
                <div className="text-2xl mb-1">{s.icon}</div>
                <div className="text-sm font-bold text-gray-600">{s.label}</div>
              </div>
            ))}
          </div>

          {error && (
            <div className="mb-4 p-3 rounded-xl bg-red-50 text-red-600 text-sm font-semibold">{error}</div>
          )}

          <button
            onClick={startAssessment}
            disabled={loading}
            className="btn-coral px-12 py-5 text-xl font-display w-full justify-center"
          >
            {loading ? '🔄 Loading...' : `Let's Go, ${sessionData.childName}! 🚀`}
          </button>
        </div>
      </div>
    )
  }

  // ── COMPLETE SCREEN ───────────────────────────────────────────────────────────
  if (phase === 'complete') {
    return (
      <div className="min-h-screen bg-brand-base flex items-center justify-center p-4">
        <div className="max-w-lg w-full text-center animate-fade-in">
          <div className="text-8xl mb-6 animate-bounce-soft">🏆</div>
          <h1 className="font-display text-4xl font-black text-brand-ink mb-4">
            Amazing Work, {sessionData.childName}!
          </h1>
          <p className="text-gray-500 text-lg mb-6">
            You completed all 20 challenges! Generating your personal Skill Report Card...
          </p>
          <div className="flex items-center justify-center gap-2 text-brand-gold font-bold text-xl">
            <span>⚡</span> +{totalXp} XP earned!
          </div>
          <div className="mt-8 flex items-center justify-center gap-2 text-gray-400">
            <div className="w-4 h-4 rounded-full border-2 border-brand-violet border-t-transparent animate-spin" />
            Creating your report...
          </div>
        </div>
      </div>
    )
  }

  // ── QUESTION SCREEN ───────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-brand-base">
      {/* Top bar */}
      <div className="sticky top-0 z-10 glass-card border-b border-white/50 py-4">
        <div className="page-container">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-3">
              <span className="text-xl">{sessionData.avatar}</span>
              <span className="font-bold text-brand-ink">{sessionData.childName}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-brand-gold font-bold text-sm">⚡ {totalXp} XP</span>
              <span className="text-sm text-gray-500 font-semibold">
                {currentQ + 1} / 20
              </span>
            </div>
          </div>
          {/* Progress bar */}
          <div className="xp-bar">
            <div className="xp-bar-fill" style={{ width: `${progress}%` }} />
          </div>
        </div>
      </div>

      {/* Encouragement popup */}
      {showEncouragement && (
        <div className="fixed top-20 left-1/2 -translate-x-1/2 z-50 px-6 py-3 rounded-full bg-brand-mint text-white font-bold text-lg shadow-glow animate-slide-up flex items-center gap-2">
          {encouragement} <span className="text-brand-gold">+{xpGained} XP</span>
        </div>
      )}

      <div className="page-container py-8 max-w-2xl mx-auto">

        {/* Skill indicator */}
        {question && (
          <div className="flex items-center gap-2 mb-6 animate-fade-in">
            <span className="text-xs font-bold px-3 py-1 rounded-full text-white"
                  style={{ background: skillColor }}>
              {SKILL_LABELS[question.skill] || question.skill}
            </span>
            <span className="text-xs text-gray-400 font-medium">Challenge {currentQ + 1}</span>
          </div>
        )}

        {/* Question card */}
        <div className="bg-white rounded-4xl shadow-card p-8 mb-6 animate-slide-up"
             style={{ borderTop: `4px solid ${skillColor}` }}>

          {loading ? (
            <div className="flex flex-col items-center justify-center py-12 gap-4">
              <div className="w-12 h-12 rounded-full border-4 border-brand-violet border-t-transparent animate-spin" />
              <p className="text-gray-500 font-semibold">Preparing your next challenge...</p>
            </div>
          ) : question ? (
            <>
              <h2 className="font-display text-2xl font-black text-brand-ink mb-8 leading-snug">
                {question.questionText}
              </h2>

              {/* Choice type */}
              {question.questionType === 'choice' && question.options && (
                <div className="grid gap-3">
                  {question.options.map((opt, i) => (
                    <button
                      key={i}
                      onClick={() => setSelectedOption(i)}
                      className={`w-full text-left p-4 rounded-2xl border-2 font-semibold transition-all ${
                        selectedOption === i
                          ? 'border-brand-violet bg-brand-violet/5 text-brand-violet'
                          : 'border-gray-100 hover:border-gray-200 text-gray-700'
                      }`}
                    >
                      <span className="inline-flex items-center gap-3">
                        <span className={`w-7 h-7 rounded-xl flex items-center justify-center text-sm font-black border-2 transition-all ${
                          selectedOption === i
                            ? 'border-brand-violet bg-brand-violet text-white'
                            : 'border-gray-200 text-gray-400'
                        }`}>
                          {['A', 'B', 'C', 'D'][i]}
                        </span>
                        {opt}
                      </span>
                    </button>
                  ))}
                </div>
              )}

              {/* Open-ended / reflection / scenario type */}
              {question.questionType !== 'choice' && (
                <textarea
                  value={answer}
                  onChange={(e) => setAnswer(e.target.value)}
                  placeholder={
                    question.questionType === 'reflection'
                      ? 'Take your time and share your thoughts...'
                      : 'Tell us what you think! There\'s no wrong answer 😊'
                  }
                  rows={5}
                  className="w-full px-4 py-3 rounded-2xl border-2 border-gray-200 focus:outline-none font-semibold text-brand-ink placeholder:text-gray-400 resize-none"
                  style={{ '--tw-border-opacity': '1', borderColor: answer.length > 10 ? skillColor : undefined } as React.CSSProperties}
                />
              )}

              {question.followUp && (
                <div className="mt-4 p-3 rounded-xl bg-gray-50 border border-gray-100">
                  <p className="text-sm text-gray-500 font-medium">💡 {question.followUp}</p>
                </div>
              )}
            </>
          ) : null}
        </div>

        {error && (
          <div className="mb-4 p-3 rounded-xl bg-red-50 text-red-600 text-sm font-semibold">{error}</div>
        )}

        {!loading && question && (
          <button
            onClick={submitAnswer}
            disabled={submitting || (question.questionType === 'choice' ? selectedOption === null : answer.trim().length < 3)}
            className="btn-primary w-full justify-center py-5 text-lg font-display disabled:opacity-40 disabled:cursor-not-allowed"
          >
            {submitting ? '🔄 Saving...' : currentQ === 19 ? '🏁 Finish Assessment!' : 'Next Challenge →'}
          </button>
        )}

        {/* Motivational tip */}
        <p className="text-center text-sm text-gray-400 font-medium mt-6">
          🔒 Your answers are private · There are no wrong answers · Just be yourself!
        </p>
      </div>
    </div>
  )
}
