'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

interface SkillProfile {
  id: string
  overallScore: number
  criticalThinking: number
  communication: number
  socialEmotional: number
  creativity: number
  digitalLiteracy: number
  strengths: string[]
  gaps: string[]
  createdAt: string
  assessmentId: string
}

interface Assessment {
  id: string
  status: string
  startedAt: string
  completedAt: string | null
  currentQ: number
  totalQ: number
}

interface Badge {
  badge: {
    name: string
    emoji: string
    description: string
  }
  earnedAt: string
}

interface Child {
  id: string
  name: string
  age: number
  avatarEmoji: string
  totalXp: number
  level: number
  streakDays: number
  skillProfiles: SkillProfile[]
  assessments: Assessment[]
  badges: Badge[]
  _count: { activityLogs: number }
}

interface DashboardData {
  user: { id: string; name: string; email: string; plan: string }
  children: Child[]
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

export default function DashboardPage() {
  const router = useRouter()
  const [data, setData] = useState<DashboardData | null>(null)
  const [showAddChildModal, setShowAddChildModal] = useState(false)
  const [newChildName, setNewChildName] = useState('')
  const [newChildAge, setNewChildAge] = useState('')
  const [newChildAvatar, setNewChildAvatar] = useState('🧒')
  const [addingChild, setAddingChild] = useState(false)
  const [addChildError, setAddChildError] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [activeChild, setActiveChild] = useState(0)

  useEffect(() => {
    const token = localStorage.getItem('skillozen_token')
    if (!token) { router.push('/login'); return }
    loadDashboard(token)
  }, [router])
async function handleAddChild() {
  if (!newChildName.trim() || !newChildAge) return
  setAddingChild(true)
  setAddChildError('')
  try {
    const session = localStorage.getItem('skillozen_session')
    const res = await fetch('/api/user', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        userId: data?.user?.id,
        childName: newChildName.trim(),
        childAge: parseInt(newChildAge),
        avatarEmoji: newChildAvatar,
      }),
    })
    const result = await res.json()
    if (!res.ok) throw new Error(result.error)
    setShowAddChildModal(false)
    setNewChildName('')
    setNewChildAge('')
    setNewChildAvatar('🧒')
    window.location.reload()
  } catch (err) {
    setAddChildError(err instanceof Error ? err.message : 'Failed to add child')
  } finally {
    setAddingChild(false)
  }
}
  async function loadDashboard(token: string) {
    setLoading(true)
    try {
      const res = await fetch('/api/dashboard', {
        headers: { Authorization: `Bearer ${token}` },
      })
      const json = await res.json()
      if (!res.ok) {
        if (res.status === 401) { router.push('/login'); return }
        throw new Error(json.error)
      }
      setData(json)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load dashboard')
    } finally {
      setLoading(false)
    }
  }

  function handleLogout() {
    localStorage.removeItem('skillozen_token')
    localStorage.removeItem('skillozen_user')
    router.push('/login')
  }

  if (loading) return (
    <div className="min-h-screen bg-brand-base flex items-center justify-center">
      <div className="text-center animate-fade-in">
        <div className="text-6xl mb-4 animate-float">📊</div>
        <h2 className="font-display text-2xl font-black text-brand-ink mb-2">
          Loading Dashboard...
        </h2>
      </div>
    </div>
  )

  if (error) return (
    <div className="min-h-screen bg-brand-base flex items-center justify-center p-4">
      <div className="text-center max-w-md">
        <div className="text-5xl mb-4">⚠️</div>
        <p className="text-gray-600 mb-4">{error}</p>
        <button onClick={() => router.push('/login')} className="btn-primary">
          Back to Login
        </button>
      </div>
    </div>
  )

  if (!data) return null

  const child = data.children[activeChild]
  const latestProfile = child?.skillProfiles?.[0]

  return (
    <div className="min-h-screen bg-brand-base pb-16">
      {/* Header */}
      <div className="relative overflow-hidden pt-8 pb-16"
           style={{ background: 'linear-gradient(135deg, #1A1033 0%, #2D1B69 100%)' }}>
        <div className="page-container relative text-white">
          <div className="flex items-center justify-between mb-6">
            <a href="/" className="flex items-center gap-2">
              <span className="text-2xl">🌟</span>
              <span className="font-display text-xl font-black">
                Skill<span style={{ color: '#FF6B35' }}>ozen</span>
              </span>
            </a>
            <button
              onClick={handleLogout}
              className="px-4 py-2 rounded-xl text-sm font-bold text-white/60 hover:text-white transition-colors"
            >
              Logout →
            </button>
          </div>

          <div className="flex items-center gap-4 mb-6">
            <div className="w-14 h-14 rounded-2xl flex items-center justify-center text-3xl"
                 style={{ background: 'rgba(255,255,255,0.1)' }}>
              👨‍👩‍👧
            </div>
            <div>
              <h1 className="font-display text-3xl font-black">
                {data.user.name ? `${data.user.name}'s Dashboard` : 'My Dashboard'}
              </h1>
              <p className="text-white/60 text-sm font-medium">{data.user.email}</p>
            </div>
            <div className="ml-auto">
              <span className="px-3 py-1 rounded-full text-xs font-black text-white"
                    style={{ background: data.user.plan === 'PREMIUM' ? '#FF6B35' : data.user.plan === 'STANDARD' ? '#5B2EFF' : '#00D68F' }}>
                {data.user.plan}
              </span>
            </div>
          </div>

          {/* Children tabs */}
          {data.children.length > 1 && (
            <div className="flex gap-3 flex-wrap">
              {data.children.map((c, i) => (
                <button
                  key={c.id}
                  onClick={() => setActiveChild(i)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold transition-all ${
                    activeChild === i
                      ? 'bg-white text-brand-violet'
                      : 'bg-white/10 text-white hover:bg-white/20'
                  }`}
                >
                  <span>{c.avatarEmoji}</span>
                  <span>{c.name}</span>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="page-container -mt-8">
        {data.children.length === 0 ? (
          <div className="bg-white rounded-3xl shadow-card p-12 text-center">
            <div className="text-6xl mb-4">👶</div>
            <h2 className="font-display text-2xl font-black text-brand-ink mb-3">
              No Children Added Yet
            </h2>
            <p className="text-gray-500 mb-6">
              Add your child to start their skill assessment journey!
            </p>
            <button
              onClick={() => setShowAddChildModal(true)}
              className="btn-primary"
            >
              Add Child →
            </button>
          </div>
        ) : child ? (
          <>
            {/* Child overview card */}
            <div className="bg-white rounded-3xl shadow-card p-6 mb-6">
              <div className="flex items-center gap-4 mb-6">
                <div className="text-5xl">{child.avatarEmoji}</div>
                <div>
                  <h2 className="font-display text-2xl font-black text-brand-ink">
                    {child.name}
                  </h2>
                  <p className="text-gray-500 font-medium">Age {child.age}</p>
                </div>
                <div className="ml-auto flex gap-3">
                  <button
                    onClick={() => {
                      localStorage.setItem('skillozen_user', JSON.stringify({
                        userId:    data.user.id,
                        childId:   child.id,
                        childName: child.name,
                        childAge:  child.age,
                        avatar:    child.avatarEmoji,
                      }))
                      router.push('/assessment')
                    }}
                    className="btn-coral text-sm py-2 px-4"
                  >
                    🎮 Retake Assessment
                  </button>
                  <button
                    onClick={() => {
                      localStorage.setItem('skillozen_user', JSON.stringify({
                        userId:    data.user.id,
                        childId:   child.id,
                        childName: child.name,
                        childAge:  child.age,
                        avatar:    child.avatarEmoji,
                      }))
                      router.push('/training')
                    }}
                    className="btn-primary text-sm py-2 px-4"
                  >
                    ⚡ Start Training
                  </button>
                </div>
              </div>

              {/* Stats row */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                  { label: 'Total XP',    value: `⚡ ${child.totalXp}`,          color: '#FFB800' },
                  { label: 'Level',       value: `🏆 Level ${child.level}`,       color: '#5B2EFF' },
                  { label: 'Activities',  value: `✅ ${child._count.activityLogs}`, color: '#00D68F' },
                  { label: 'Streak',      value: `🔥 ${child.streakDays} days`,   color: '#FF4785' },
                ].map((s) => (
                  <div key={s.label}
                       className="rounded-2xl p-4 text-center"
                       style={{ background: `${s.color}15` }}>
                    <div className="font-bold text-lg" style={{ color: s.color }}>{s.value}</div>
                    <div className="text-gray-500 text-xs font-semibold mt-1">{s.label}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Latest Skill Profile */}
            {latestProfile ? (
              <div className="bg-white rounded-3xl shadow-card p-6 mb-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="font-display text-xl font-black text-brand-ink">
                    📊 Latest Skill Report
                  </h3>
                  <div className="flex items-center gap-3">
                    <span className="text-sm text-gray-400 font-medium">
                      {new Date(latestProfile.createdAt).toLocaleDateString('en-IN', {
                        day: 'numeric', month: 'short', year: 'numeric'
                      })}
                    </span>
                    <button
                      onClick={() => router.push(`/results/${latestProfile.assessmentId}`)}
                      className="btn-ghost text-sm py-2 px-4"
                    >
                      View Full Report →
                    </button>
                  </div>
                </div>

                {/* Overall score */}
                <div className="flex items-center gap-4 mb-6 p-4 rounded-2xl bg-brand-violet/5 border border-brand-violet/10">
                  <div className="relative w-16 h-16 flex-shrink-0">
                    <svg className="w-full h-full -rotate-90" viewBox="0 0 60 60">
                      <circle cx="30" cy="30" r="24" fill="none" stroke="#e5e7eb" strokeWidth="6" />
                      <circle cx="30" cy="30" r="24" fill="none" stroke="#5B2EFF" strokeWidth="6"
                              strokeDasharray={`${(latestProfile.overallScore / 100) * 150} 150`}
                              strokeLinecap="round" />
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="font-display text-sm font-black text-brand-violet">
                        {latestProfile.overallScore}
                      </span>
                    </div>
                  </div>
                  <div>
                    <div className="font-display text-lg font-black text-brand-ink">
                      Overall Score: {latestProfile.overallScore}/100
                    </div>
                    <div className="text-gray-500 text-sm font-medium">
                      {latestProfile.overallScore >= 85 ? '🌟 Expert level!' :
                       latestProfile.overallScore >= 70 ? '💪 Proficient!' :
                       latestProfile.overallScore >= 50 ? '📈 Developing well!' :
                       '🌱 Just getting started!'}
                    </div>
                  </div>
                </div>

                {/* Skill scores */}
                <div className="space-y-3">
                  {SKILL_CONFIG.map((s) => {
                    const score = latestProfile[s.key as keyof SkillProfile] as number
                    return (
                      <div key={s.key}>
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-sm font-bold text-gray-700">
                            {s.emoji} {s.label}
                          </span>
                          <span className="text-sm font-black" style={{ color: s.color }}>
                            {score}/100
                          </span>
                        </div>
                        <div className="h-2 rounded-full bg-gray-100 overflow-hidden">
                          <div
                            className="h-full rounded-full transition-all"
                            style={{ width: `${score}%`, background: s.color }}
                          />
                        </div>
                      </div>
                    )
                  })}
                </div>

                {/* Strengths */}
                {latestProfile.strengths?.length > 0 && (
                  <div className="mt-6">
                    <h4 className="font-bold text-brand-ink mb-3">✨ Key Strengths</h4>
                    <div className="space-y-2">
                      {latestProfile.strengths.map((s, i) => (
                        <div key={i} className="flex items-start gap-2 text-sm text-gray-600">
                          <span className="text-brand-mint font-black mt-0.5">✓</span>
                          {s}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="bg-white rounded-3xl shadow-card p-8 text-center mb-6">
                <div className="text-5xl mb-4">🎯</div>
                <h3 className="font-display text-xl font-black text-brand-ink mb-2">
                  No Assessment Yet
                </h3>
                <p className="text-gray-500 mb-6">
                  Start {child.name}&apos;s first skill assessment to see their report card!
                </p>
                <button
                  onClick={() => {
                    localStorage.setItem('skillozen_user', JSON.stringify({
                      userId:    data.user.id,
                      childId:   child.id,
                      childName: child.name,
                      childAge:  child.age,
                      avatar:    child.avatarEmoji,
                    }))
                    router.push('/assessment')
                  }}
                  className="btn-coral"
                >
                  🚀 Start Assessment →
                </button>
              </div>
            )}

            {/* Past Assessments */}
            {child.assessments.length > 0 && (
              <div className="bg-white rounded-3xl shadow-card p-6 mb-6">
                <h3 className="font-display text-xl font-black text-brand-ink mb-4">
                  📋 Assessment History
                </h3>
                <div className="space-y-3">
                  {child.assessments.map((a, i) => (
                    <div key={a.id}
                         className="flex items-center justify-between p-4 rounded-2xl border border-gray-100 hover:border-brand-violet/20 transition-all">
                      <div className="flex items-center gap-3">
                        <span className={`w-8 h-8 rounded-xl flex items-center justify-center text-sm font-black text-white ${
                          a.status === 'COMPLETED' ? 'bg-brand-mint' : 'bg-gray-300'
                        }`}>
                          {i + 1}
                        </span>
                        <div>
                          <div className="font-bold text-brand-ink text-sm">
                            {a.status === 'COMPLETED' ? '✅ Completed' : `⏳ In Progress (${a.currentQ}/${a.totalQ})`}
                          </div>
                          <div className="text-xs text-gray-400 font-medium">
                            {new Date(a.startedAt).toLocaleDateString('en-IN', {
                              day: 'numeric', month: 'short', year: 'numeric'
                            })}
                          </div>
                        </div>
                      </div>
                      {a.status === 'COMPLETED' && (
                        <button
                          onClick={() => router.push(`/results/${a.id}`)}
                          className="text-sm font-bold text-brand-violet hover:underline"
                        >
                          View Report →
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Badges */}
            {child.badges.length > 0 && (
              <div className="bg-white rounded-3xl shadow-card p-6">
                <h3 className="font-display text-xl font-black text-brand-ink mb-4">
                  🏅 Badges Earned
                </h3>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  {child.badges.map((b) => (
                    <div key={b.badge.name}
                         className="text-center p-4 rounded-2xl bg-brand-gold/5 border border-brand-gold/20">
                      <div className="text-3xl mb-2">{b.badge.emoji}</div>
                      <div className="font-bold text-sm text-brand-ink">{b.badge.name}</div>
                      <div className="text-xs text-gray-400 font-medium mt-1">
                        {b.badge.description}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </>
        ) : null}

        {/* Add another child */}
        <div className="mt-6 p-5 rounded-2xl bg-white shadow-card flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-2xl">👶</span>
            <div>
              <div className="font-bold text-brand-ink">Add Another Child</div>
              <div className="text-sm text-gray-500">Track multiple children from one account</div>
            </div>
          </div>
          <button
            onClick={() => setShowAddChildModal(true)}
            className="btn-ghost text-sm py-2 px-4"
          >
            Add Child →
          </button>
        </div>
 </div>

      {/* Add Child Modal */}
      {showAddChildModal && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-4xl shadow-glow w-full max-w-md p-8 animate-slide-up">
            <h2 className="font-display text-2xl font-black text-brand-ink mb-2">
              Add a Child Profile
            </h2>
            <p className="text-gray-500 text-sm mb-6">
              Track multiple children from one account
            </p>

            {/* Avatar Selection */}
            <div className="mb-5">
              <label className="text-sm font-bold text-gray-600 mb-2 block">
                Choose Avatar
              </label>
              <div className="flex gap-3 flex-wrap">
                {['🧒','👦','👧','🧑','👨','👩','🐣','🦁','🐯','🦊'].map((emoji) => (
                  <button
                    key={emoji}
                    onClick={() => setNewChildAvatar(emoji)}
                    className="text-2xl w-10 h-10 rounded-xl border-2 transition-all"
                    style={{
                      borderColor: newChildAvatar === emoji ? '#5B2EFF' : '#e5e7eb',
                      background: newChildAvatar === emoji ? '#EDE9FF' : 'white',
                    }}
                  >
                    {emoji}
                  </button>
                ))}
              </div>
            </div>

            {/* Child Name */}
            <div className="mb-4">
              <label className="text-sm font-bold text-gray-600 mb-2 block">
                Child's Name
              </label>
              <input
                type="text"
                value={newChildName}
                onChange={(e) => setNewChildName(e.target.value)}
                placeholder="Enter child's name"
                className="w-full px-4 py-3 rounded-2xl border-2 border-gray-200 focus:border-brand-violet outline-none font-semibold"
              />
            </div>

            {/* Child Age */}
            <div className="mb-6">
              <label className="text-sm font-bold text-gray-600 mb-2 block">
                Child's Age
              </label>
              <select
                value={newChildAge}
                onChange={(e) => setNewChildAge(e.target.value)}
                className="w-full px-4 py-3 rounded-2xl border-2 border-gray-200 focus:border-brand-violet outline-none font-semibold bg-white"
              >
                <option value="">Select age</option>
                {Array.from({ length: 17 }, (_, i) => i + 4).map((age) => (
                  <option key={age} value={age}>{age} years old</option>
                ))}
              </select>
            </div>

            {addChildError && (
              <p className="text-red-500 text-sm font-semibold mb-4">{addChildError}</p>
            )}

            {/* Buttons */}
            <div className="flex gap-3">
              <button
                onClick={() => setShowAddChildModal(false)}
                className="flex-1 py-3 rounded-2xl border-2 border-gray-200 font-bold text-gray-600 hover:border-gray-300 transition-all"
              >
                Cancel
              </button>
              <button
                onClick={handleAddChild}
                disabled={addingChild || !newChildName.trim() || !newChildAge}
                className="flex-1 py-3 rounded-2xl font-display font-black text-white transition-all disabled:opacity-40"
                style={{ background: '#5B2EFF' }}
              >
                {addingChild ? '⏳ Adding...' : '+ Add Child'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
