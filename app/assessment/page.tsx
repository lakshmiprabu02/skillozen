'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import { useRouter } from 'next/navigation'

// ── Types ─────────────────────────────────────────────────────────────────────
interface EmojiOption { emoji: string; label: string }

interface Question {
  questionText: string
  audioText?: string
  questionType: 'emoji' | 'story' | 'choice'
  tier: 1 | 2 | 3
  skill: string
  // Tier 1
  options?: EmojiOption[] | string[]
  // Tier 2
  story?: string
  storyEmoji?: string
  // All
  correct: number
  followUp?: string
}

const SKILL_CONFIG: Record<string, { color: string; bg: string; emoji: string; label: string }> = {
  CRITICAL_THINKING: { color: '#5B2EFF', bg: '#EDE9FF', emoji: '🧠', label: 'Critical Thinking' },
  COMMUNICATION:     { color: '#00B4D8', bg: '#E0F7FF', emoji: '🗣️', label: 'Communication' },
  SOCIAL_EMOTIONAL:  { color: '#FF4785', bg: '#FFE8EF', emoji: '💛', label: 'Social-Emotional' },
  CREATIVITY:        { color: '#FF6B35', bg: '#FFF0EB', emoji: '🎨', label: 'Creativity' },
  DIGITAL_LITERACY:  { color: '#00D68F', bg: '#E0FFF6', emoji: '💻', label: 'Digital Literacy' },
}

const ENCOURAGEMENTS = [
  'Great thinking! 🌟', 'Love that answer! ✨', 'You are crushing it! 🔥',
  'Brilliant! 💡', 'Amazing! 🎯', 'Keep going! 🚀', 'Nice one! 👏',
  'Super smart! 🦸', 'Wow, great job! 🎉', 'You are a star! ⭐',
]

export default function AssessmentPage() {
  const router = useRouter()
  const [sessionData, setSessionData] = useState<{
    userId: string; childId: string; childName: string; childAge: number; avatar: string
  } | null>(null)
  const [assessmentId, setAssessmentId] = useState<string | null>(null)
  const [currentQ, setCurrentQ] = useState(0)
  const [question, setQuestion] = useState<Question | null>(null)
  const [selectedOption, setSelectedOption] = useState<number | null>(null)
  const [loading, setLoading] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [encouragement, setEncouragement] = useState('')
  const [showEncouragement, setShowEncouragement] = useState(false)
  const [totalXp, setTotalXp] = useState(0)
  const [error, setError] = useState('')
  const [phase, setPhase] = useState<'intro' | 'question' | 'complete'>('intro')
  const [isPlaying, setIsPlaying] = useState(false)
  const [speechSupported, setSpeechSupported] = useState(false)
  const synthRef = useRef<SpeechSynthesis | null>(null)

  // Check speech support
  useEffect(() => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      setSpeechSupported(true)
      synthRef.current = window.speechSynthesis
    }
  }, [])

  // Load session
  useEffect(() => {
    const stored = localStorage.getItem('skillozen_user')
    if (!stored) { router.push('/onboarding'); return }
    setSessionData(JSON.parse(stored))
  }, [router])

  // Text to speech
  function speakText(text: string) {
    if (!speechSupported || !synthRef.current) return
    synthRef.current.cancel()
    const utterance = new SpeechSynthesisUtterance(text)
    utterance.rate = 0.85
    utterance.pitch = 1.1
    utterance.volume = 1
    utterance.onstart  = () => setIsPlaying(true)
    utterance.onend    = () => setIsPlaying(false)
    utterance.onerror  = () => setIsPlaying(false)
    synthRef.current.speak(utterance)
  }

  // Auto-play audio for Tier 1 when question loads
  useEffect(() => {
    if (question?.tier === 1 && question.audioText && speechSupported) {
      setTimeout(() => speakText(question.audioText!), 600)
    }
  }, [question, speechSupported])

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
      if (!res.ok) {
        if (data.error === 'UPGRADE_REQUIRED') {
          router.push('/pricing?reason=assessment')
          return
        }
        throw new Error(data.error)
      }
      setAssessmentId(data.assessmentId)
      setPhase('question')
      await fetchQuestion(data.assessmentId, 0)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to start')
    } finally {
      setLoading(false)
    }
  }, [sessionData])

  async function fetchQuestion(assId: string, qIndex: number) {
    setLoading(true)
    setSelectedOption(null)
    try {
      const res = await fetch('/api/assessment/question', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          assessmentId:  assId,
          questionIndex: qIndex,
          childAge:      sessionData?.childAge || 10,
          childName:     sessionData?.childName || 'Explorer',
          previousAnswers: [],
        }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error)
      setQuestion(data.question)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load question')
    } finally {
      setLoading(false)
    }
  }

  async function submitAnswer() {
    if (!assessmentId || !question || !sessionData) return
    if (selectedOption === null) return
    setSubmitting(true)
    try {
      const isEmojiQ = question.questionType === 'emoji'
      const opts = question.options as (EmojiOption | string)[]
      const answerText = isEmojiQ
        ? (opts[selectedOption] as EmojiOption)?.label || String(selectedOption)
        : (opts[selectedOption] as string) || String(selectedOption)

      const res = await fetch('/api/assessment/complete', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          assessmentId,
          questionIndex:  currentQ,
          questionText:   question.questionText,
          skill:          question.skill,
          answerText,
          selectedOption,
          correctAnswer:  question.correct,
          options:        isEmojiQ
            ? (opts as EmojiOption[]).map((o) => o.label)
            : opts as string[],
          childAge:       sessionData.childAge,
        }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error)

      const xp = Math.round((data.score / 10) * 15)
      setTotalXp((prev) => prev + xp)
      setEncouragement(ENCOURAGEMENTS[Math.floor(Math.random() * ENCOURAGEMENTS.length)])
      setShowEncouragement(true)
      setTimeout(() => setShowEncouragement(false), 1800)

      const nextQ = currentQ + 1
      if (nextQ >= 20 || data.assessmentComplete) {
        setPhase('complete')
        setTimeout(() => router.push('/results/' + assessmentId), 2500)
        return
      }
      setCurrentQ(nextQ)
      await fetchQuestion(assessmentId, nextQ)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to submit')
    } finally {
      setSubmitting(false)
    }
  }

  const progress    = (currentQ / 20) * 100
  const skillColor  = question ? (SKILL_CONFIG[question.skill]?.color || '#5B2EFF') : '#5B2EFF'
  const skillLabel  = question ? (SKILL_CONFIG[question.skill]?.label || question.skill) : ''
  const skillEmoji  = question ? (SKILL_CONFIG[question.skill]?.emoji || '⭐') : '⭐'
  const tier        = question?.tier || 3

  if (!sessionData) return null

  // ── INTRO ─────────────────────────────────────────────────────────────────
  if (phase === 'intro') {
    const age = sessionData.childAge
    const tierLabel = age <= 7 ? '🎮 Fun Emoji Adventure!'
                    : age <= 12 ? '📖 Story Challenges!'
                    : '🧠 Real World Scenarios!'
    return (
      <div className="min-h-screen bg-brand-base flex items-center justify-center p-4">
        <div className="max-w-lg w-full text-center animate-fade-in">
          <div className="text-8xl mb-6 animate-float">🎮</div>
          <h1 className="font-display text-4xl font-black text-brand-ink mb-2">
            {sessionData.avatar} {sessionData.childName}&apos;s Skill Adventure!
          </h1>
          <p className="text-gray-500 text-lg mb-2">{tierLabel}</p>
          <p className="text-gray-400 mb-8 text-sm">
            {age <= 7
              ? 'Listen to the question and tap the picture that matches!'
              : age <= 12
              ? 'Read the story and choose the best answer!'
              : 'Read the scenario and choose the smartest response!'}
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

          {age <= 7 && speechSupported && (
            <div className="mb-6 p-4 rounded-2xl bg-brand-violet/5 border border-brand-violet/20">
              <p className="text-sm text-brand-violet font-bold">
                🔊 Questions will be read out loud for you!
              </p>
            </div>
          )}

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

  // ── COMPLETE ──────────────────────────────────────────────────────────────
  if (phase === 'complete') {
    return (
      <div className="min-h-screen bg-brand-base flex items-center justify-center p-4">
        <div className="max-w-lg w-full text-center animate-fade-in">
          <div className="text-8xl mb-6 animate-bounce-soft">🏆</div>
          <h1 className="font-display text-4xl font-black text-brand-ink mb-4">
            Amazing Work, {sessionData.childName}!
          </h1>
          <p className="text-gray-500 text-lg mb-6">
            You completed all 20 challenges! Creating your Skill Report Card...
          </p>
          <div className="flex items-center justify-center gap-2 text-brand-gold font-bold text-xl mb-8">
            <span>⚡</span> +{totalXp} XP earned!
          </div>
          <div className="flex items-center justify-center gap-2 text-gray-400">
            <div className="w-4 h-4 rounded-full border-2 border-brand-violet border-t-transparent animate-spin" />
            Generating your report...
          </div>
        </div>
      </div>
    )
  }

  // ── QUESTION ──────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-brand-base">
      {/* Top bar */}
      <div className="sticky top-0 z-10 glass-card border-b border-white/50 py-4">
        <div className="page-container">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <span className="text-xl">{sessionData.avatar}</span>
              <span className="font-bold text-brand-ink text-sm">{sessionData.childName}</span>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-brand-gold font-bold text-sm">⚡ {totalXp} XP</span>
              <span className="text-sm text-gray-500 font-semibold">{currentQ + 1} / 20</span>
            </div>
          </div>
          <div className="xp-bar">
            <div className="xp-bar-fill" style={{ width: progress + '%' }} />
          </div>
        </div>
      </div>

      {/* Encouragement popup */}
      {showEncouragement && (
        <div className="fixed top-20 left-1/2 -translate-x-1/2 z-50 px-6 py-3 rounded-full bg-brand-mint text-white font-bold text-lg shadow-glow animate-slide-up">
          {encouragement}
        </div>
      )}

      <div className="page-container py-8 max-w-2xl mx-auto">
        {/* Skill tag */}
        {question && (
          <div className="flex items-center gap-2 mb-5 animate-fade-in">
            <span className="text-xs font-bold px-3 py-1 rounded-full text-white"
                  style={{ background: skillColor }}>
              {skillEmoji} {skillLabel}
            </span>
            <span className="text-xs text-gray-400 font-medium">Challenge {currentQ + 1}</span>
          </div>
        )}

        {/* Question card */}
        <div className="bg-white rounded-4xl shadow-card overflow-hidden animate-slide-up"
             style={{ borderTop: '4px solid ' + skillColor }}>

          {loading ? (
            <div className="flex flex-col items-center justify-center py-16 gap-4">
              <div className="w-12 h-12 rounded-full border-4 border-brand-violet border-t-transparent animate-spin" />
              <p className="text-gray-500 font-semibold">Preparing your challenge...</p>
            </div>
          ) : question ? (
            <>
              {/* ── TIER 1: Emoji Cards (Ages 4-7) ────────────────────── */}
              {tier === 1 && (
                <div className="p-6">
                  {/* Audio controls */}
                  {speechSupported && question.audioText && (
                    <div className="flex items-center gap-3 mb-5 p-3 rounded-2xl bg-brand-violet/5 border border-brand-violet/10">
                      <button
                        onClick={() => speakText(question.audioText!)}
                        className="flex items-center gap-2 px-4 py-2 rounded-xl font-bold text-sm text-white transition-all"
                        style={{ background: isPlaying ? '#00D68F' : skillColor }}
                      >
                        {isPlaying ? '🔊 Playing...' : '🔊 Listen'}
                      </button>
                      <button
                        onClick={() => speakText(question.audioText!)}
                        className="flex items-center gap-2 px-3 py-2 rounded-xl font-bold text-xs border-2 border-gray-200 text-gray-500 hover:border-brand-violet hover:text-brand-violet transition-all"
                      >
                        🔁 Replay
                      </button>
                    </div>
                  )}

                  {/* Question text — large font */}
                  <h2 className="font-display text-2xl md:text-3xl font-black text-brand-ink mb-8 leading-snug text-center">
                    {question.questionText}
                  </h2>

                  {/* Emoji option cards */}
                  <div className="grid grid-cols-2 gap-4">
                    {(question.options as EmojiOption[]).map((opt, i) => (
                      <button
                        key={i}
                        onClick={() => setSelectedOption(i)}
                        className="relative flex flex-col items-center justify-center p-6 rounded-3xl border-4 transition-all duration-200 hover:scale-105 active:scale-95"
                        style={{
                          borderColor: selectedOption === i ? skillColor : '#e5e7eb',
                          background:  selectedOption === i
                            ? SKILL_CONFIG[question.skill]?.bg || '#EDE9FF'
                            : '#fafafa',
                          boxShadow:   selectedOption === i
                            ? '0 8px 24px -4px ' + skillColor + '40'
                            : '0 2px 8px rgba(0,0,0,0.06)',
                        }}
                      >
                        {selectedOption === i && (
                          <div className="absolute top-2 right-2 w-6 h-6 rounded-full flex items-center justify-center text-white text-xs font-black"
                               style={{ background: skillColor }}>
                            ✓
                          </div>
                        )}
                        <span className="text-5xl mb-3">{opt.emoji}</span>
                        <span className="font-display font-black text-base text-center text-brand-ink">
                          {opt.label}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* ── TIER 2: Story + Short Text (Ages 8-12) ─────────────── */}
              {tier === 2 && (
                <div className="p-6">
                  {/* Story card */}
                  {question.story && (
                    <div className="flex items-start gap-4 p-4 rounded-2xl mb-6 border-l-4"
                         style={{ background: SKILL_CONFIG[question.skill]?.bg || '#EDE9FF', borderLeftColor: skillColor }}>
                      <span className="text-4xl flex-shrink-0">{question.storyEmoji || '📖'}</span>
                      <p className="text-gray-700 font-semibold text-base leading-relaxed">
                        {question.story}
                      </p>
                    </div>
                  )}

                  {/* Question */}
                  <h2 className="font-display text-xl font-black text-brand-ink mb-5">
                    {question.questionText}
                  </h2>

                  {/* Short text options */}
                  <div className="grid gap-3">
                    {(question.options as string[]).map((opt, i) => (
                      <button
                        key={i}
                        onClick={() => setSelectedOption(i)}
                        className="w-full text-left p-4 rounded-2xl border-2 font-semibold transition-all text-sm"
                        style={{
                          borderColor: selectedOption === i ? skillColor : '#e5e7eb',
                          background:  selectedOption === i
                            ? SKILL_CONFIG[question.skill]?.bg || '#EDE9FF'
                            : 'white',
                          color: selectedOption === i ? skillColor : '#374151',
                        }}
                      >
                        <span className="inline-flex items-center gap-3">
                          <span className="w-7 h-7 rounded-xl flex items-center justify-center text-xs font-black border-2 transition-all flex-shrink-0"
                                style={{
                                  borderColor: selectedOption === i ? skillColor : '#d1d5db',
                                  background:  selectedOption === i ? skillColor : 'transparent',
                                  color:       selectedOption === i ? 'white' : '#9ca3af',
                                }}>
                            {['A', 'B', 'C', 'D'][i]}
                          </span>
                          {opt}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* ── TIER 3: Full Scenario Text (Ages 13-20) ─────────────── */}
              {tier === 3 && (
                <div className="p-6">
                  <h2 className="font-display text-xl font-black text-brand-ink mb-6 leading-snug">
                    {question.questionText}
                  </h2>
                  <div className="grid gap-3">
                    {(question.options as string[]).map((opt, i) => (
                      <button
                        key={i}
                        onClick={() => setSelectedOption(i)}
                        className="w-full text-left p-4 rounded-2xl border-2 font-semibold transition-all text-sm"
                        style={{
                          borderColor: selectedOption === i ? skillColor : '#e5e7eb',
                          background:  selectedOption === i
                            ? SKILL_CONFIG[question.skill]?.bg || '#EDE9FF'
                            : 'white',
                          color: selectedOption === i ? skillColor : '#374151',
                        }}
                      >
                        <span className="inline-flex items-center gap-3">
                          <span className="w-7 h-7 rounded-xl flex items-center justify-center text-xs font-black border-2 transition-all flex-shrink-0"
                                style={{
                                  borderColor: selectedOption === i ? skillColor : '#d1d5db',
                                  background:  selectedOption === i ? skillColor : 'transparent',
                                  color:       selectedOption === i ? 'white' : '#9ca3af',
                                }}>
                            {['A', 'B', 'C', 'D'][i]}
                          </span>
                          {opt}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Submit button */}
              <div className="px-6 pb-6">
                {error && (
                  <div className="mb-3 p-3 rounded-xl bg-red-50 text-red-600 text-sm font-semibold">{error}</div>
                )}
                <button
                  onClick={submitAnswer}
                  disabled={submitting || selectedOption === null}
                  className="btn-primary w-full justify-center py-4 text-lg font-display disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  {submitting ? '🔄 Saving...' : currentQ === 19 ? '🏁 Finish!' : 'Next →'}
                </button>
              </div>
            </>
          ) : null}
        </div>

        {/* Footer tip */}
        {tier === 1 && (
          <p className="text-center text-sm text-gray-400 font-medium mt-6">
            🔊 Tap Listen to hear the question · Tap a picture to answer
          </p>
        )}
        {tier !== 1 && (
          <p className="text-center text-sm text-gray-400 font-medium mt-6">
            🔒 No right or wrong — just be yourself!
          </p>
        )}
      </div>
    </div>
  )
}