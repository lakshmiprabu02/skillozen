'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import {
  RadarChart, PolarGrid, PolarAngleAxis, Radar, ResponsiveContainer,
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  BarChart, Bar, Cell,
} from 'recharts'

// ── Types ─────────────────────────────────────────────────────────────────────
interface SkillProfile {
  criticalThinking: number; communication: number; socialEmotional: number
  creativity: number; digitalLiteracy: number; financialLiteracy: number
  healthWellness: number; goalSetting: number; scientificThinking: number
  publicSpeaking: number; overallScore: number; createdAt: string
}
interface Exam {
  id: string; name: string; academicYear: string; examDate: string | null
  subjects: { id: string; name: string; maxMarks: number }[]
  results:  { subjectId: string; marksObtained: number; grade: string }[]
}
interface Goal {
  id: string; type: string; title: string; skill?: string
  targetScore?: number; targetMarks?: number; subject?: string
  currentValue: number; achieved: boolean; deadline?: string
}
interface WeeklyReport {
  summary: string; highlights: string[]; concerns: string[]
  recommendations: string[]; encouragement: string
  activitiesCompleted: number; xpEarned: number
}

const SKILL_CONFIG = [
  { key: 'criticalThinking',  label: 'Critical Thinking',  emoji: '🧠', color: '#5B2EFF' },
  { key: 'communication',     label: 'Communication',      emoji: '🗣️', color: '#00B4D8' },
  { key: 'socialEmotional',   label: 'Social-Emotional',   emoji: '💛', color: '#FF4785' },
  { key: 'creativity',        label: 'Creativity',         emoji: '🎨', color: '#FF6B35' },
  { key: 'digitalLiteracy',   label: 'Digital Literacy',   emoji: '💻', color: '#00D68F' },
  { key: 'financialLiteracy', label: 'Financial Literacy', emoji: '💰', color: '#FFB800' },
  { key: 'healthWellness',    label: 'Health & Wellness',  emoji: '🧘', color: '#06D6A0' },
  { key: 'goalSetting',       label: 'Goal Setting',       emoji: '🎯', color: '#7209B7' },
  { key: 'scientificThinking',label: 'Scientific Thinking',emoji: '🔬', color: '#3A86FF' },
  { key: 'publicSpeaking',    label: 'Public Speaking',    emoji: '🎤', color: '#FB5607' },
]

export default function ProgressPage() {
  const router = useRouter()
  const [sessionData, setSessionData] = useState<{
    userId: string; childId: string; childName: string; childAge: number; avatar: string
  } | null>(null)
  const [profiles, setProfiles]       = useState<SkillProfile[]>([])
  const [exams, setExams]             = useState<Exam[]>([])
  const [goals, setGoals]             = useState<Goal[]>([])
  const [report, setReport]           = useState<WeeklyReport | null>(null)
  const [activeTab, setActiveTab]     = useState<'skills' | 'academic' | 'goals' | 'report'>('skills')
  const [loading, setLoading]         = useState(true)
  const [generatingReport, setGeneratingReport] = useState(false)

  // Exam form state
  const [showExamForm, setShowExamForm]   = useState(false)
  const [examName, setExamName]           = useState('')
  const [examYear, setExamYear]           = useState(new Date().getFullYear().toString())
  const [examDate, setExamDate]           = useState('')
  const [subjects, setSubjects]           = useState([{ name: '', maxMarks: 100 }])
  const [savingExam, setSavingExam]       = useState(false)

  // Marks entry state
  const [activeExam, setActiveExam]       = useState<Exam | null>(null)
  const [marks, setMarks]                 = useState<Record<string, number>>({})
  const [savingMarks, setSavingMarks]     = useState(false)

  // Goal form state
  const [showGoalForm, setShowGoalForm]   = useState(false)
  const [goalType, setGoalType]           = useState<'SKILL' | 'ACADEMIC'>('SKILL')
  const [goalTitle, setGoalTitle]         = useState('')
  const [goalSkill, setGoalSkill]         = useState('')
  const [goalTarget, setGoalTarget]       = useState('')
  const [savingGoal, setSavingGoal]       = useState(false)

  useEffect(() => {
    const stored = localStorage.getItem('skillozen_user')
    if (!stored) { router.push('/login'); return }
    const s = JSON.parse(stored)
    const params = new URLSearchParams(window.location.search)
    const childId   = params.get('childId')   || s.childId
    const childName = params.get('childName') || s.childName
    const avatar    = params.get('avatar')    || s.avatar
    const childAge  = parseInt(params.get('childAge') || s.childAge)
    setSessionData({ ...s, childId, childName, avatar, childAge })
    loadAll(childId)
  }, [router])

  async function loadAll(childId: string) {
    setLoading(true)
    try {
      const [profileRes, examRes, goalRes, reportRes] = await Promise.all([
        fetch(`/api/assessment/result?childId=${childId}`),
        fetch(`/api/progress/exams?childId=${childId}`),
        fetch(`/api/progress/goals?childId=${childId}`),
        fetch(`/api/progress/report?childId=${childId}`),
      ])
      if (profileRes.ok) { const d = await profileRes.json(); setProfiles(d.profiles || []) }
      if (examRes.ok)    { const d = await examRes.json();    setExams(d.exams || []) }
      if (goalRes.ok)    { const d = await goalRes.json();    setGoals(d.goals || []) }
      if (reportRes.ok)  { const d = await reportRes.json();  setReport(d.report || null) }
    } finally {
      setLoading(false)
    }
  }

  async function createExam() {
    if (!sessionData || !examName || subjects.filter(s => s.name).length === 0) return
    setSavingExam(true)
    try {
      const res = await fetch('/api/progress/exams', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          childId: sessionData.childId, name: examName,
          academicYear: examYear, examDate: examDate || null,
          subjects: subjects.filter(s => s.name),
        }),
      })
      if (res.ok) {
        const d = await res.json()
        setExams(prev => [d.exam, ...prev])
        setShowExamForm(false)
        setExamName(''); setExamDate(''); setSubjects([{ name: '', maxMarks: 100 }])
      }
    } finally { setSavingExam(false) }
  }

  async function saveMarks() {
    if (!sessionData || !activeExam) return
    setSavingMarks(true)
    try {
      const results = Object.entries(marks).map(([subjectId, marksObtained]) => ({
        subjectId, marksObtained,
      }))
      const res = await fetch('/api/progress/results', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ examId: activeExam.id, childId: sessionData.childId, results }),
      })
      if (res.ok) {
        await loadAll(sessionData.childId)
        setActiveExam(null); setMarks({})
      }
    } finally { setSavingMarks(false) }
  }

    async function createGoal() {
    if (!sessionData || !goalTitle.trim()) return
    setSavingGoal(true)
    console.log('Creating goal:', { goalType, goalTitle, goalSkill, goalTarget })
    try {
      const res = await fetch('/api/progress/goals', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          childId:     sessionData.childId,
          type:        goalType,
          title:       goalTitle.trim(),
          skill: goalType === 'SKILL' && goalSkill ? 
            goalSkill.replace(/([A-Z])/g, '_$1').toUpperCase() as any : null,
          targetScore: goalType === 'SKILL' && goalTarget ? parseInt(goalTarget) : null,
          targetMarks: goalType === 'ACADEMIC' && goalTarget ? parseInt(goalTarget) : null,
        }),
      })
      const d = await res.json()
      if (!res.ok) throw new Error(d.error)
      setGoals(prev => [d.goal, ...prev])
      setShowGoalForm(false)
      setGoalTitle('')
      setGoalTarget('')
      setGoalSkill('')
      setGoalType('SKILL')
    } catch (err) {
      console.error(err)
    } finally {
      setSavingGoal(false)
    }
  }

  async function generateReport() {
    if (!sessionData) return
    setGeneratingReport(true)
    try {
      const res = await fetch('/api/progress/report', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ childId: sessionData.childId }),
      })
      if (res.ok) { const d = await res.json(); setReport(d.report) }
    } finally { setGeneratingReport(false) }
  }

  async function markGoalDone(goalId: string) {
    await fetch('/api/progress/goals', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ goalId, achieved: true }),
    })
    setGoals(prev => prev.map(g => g.id === goalId ? { ...g, achieved: true } : g))
  }

  if (loading) return (
    <div className="min-h-screen bg-brand-base flex items-center justify-center">
      <div className="text-center">
        <div className="text-5xl mb-4 animate-float">📊</div>
        <p className="font-display font-black text-brand-ink text-xl">Loading Progress...</p>
      </div>
    </div>
  )

  // Skill growth chart data
  const growthData = profiles.slice().reverse().map((p, i) => ({
    name: `Assessment ${i + 1}`,
    'Critical Thinking': p.criticalThinking,
    'Communication':     p.communication,
    'Creativity':        p.creativity,
    'Overall':           p.overallScore,
  }))

  // Latest skill radar data
  const latestProfile = profiles[0]
  const radarData = latestProfile ? SKILL_CONFIG.map(s => ({
    skill: s.emoji,
    score: latestProfile[s.key as keyof SkillProfile] as number,
  })) : []

  // Academic chart data
  const academicData = exams.flatMap(exam =>
    exam.subjects.map(sub => {
      const result = exam.results.find(r => r.subjectId === sub.id)
      return {
        subject: sub.name,
        exam:    exam.name,
        marks:   result ? (result.marksObtained / sub.maxMarks) * 100 : 0,
        grade:   result?.grade || 'N/A',
      }
    })
  )

  // Predictive alerts
  const alerts = latestProfile ? SKILL_CONFIG.filter(s =>
    (latestProfile[s.key as keyof SkillProfile] as number) < 50
  ) : []

  return (
    <div className="min-h-screen bg-brand-base pb-16">
      {/* Header */}
      <div className="relative overflow-hidden pt-8 pb-16"
           style={{ background: 'linear-gradient(135deg, #1A1033 0%, #2D1B69 100%)' }}>
        <div className="page-container text-white">
          <a href="/dashboard" className="text-white/60 hover:text-white text-sm font-semibold mb-6 inline-flex items-center gap-1">
            ← Back to Dashboard
          </a>
          <div className="flex items-center gap-4 mt-4">
            <div className="text-5xl">{sessionData?.avatar}</div>
            <div>
              <h1 className="font-display text-3xl font-black">
                {sessionData?.childName}&apos;s Progress
              </h1>
              <p className="text-white/60 mt-1">Smart Progress Dashboard</p>
            </div>
            <div className="ml-auto px-3 py-1 rounded-full text-xs font-black bg-brand-gold text-brand-ink">
              👑 PREMIUM
            </div>
          </div>
        </div>
      </div>

      <div className="page-container mt-6">
        {/* Predictive Alerts */}
        {alerts.length > 0 && (
          <div className="bg-orange-50 border border-orange-200 rounded-3xl p-5 mb-6">
            <h3 className="font-display font-black text-orange-700 mb-3 flex items-center gap-2">
              ⚠️ Predictive Alerts
            </h3>
            <div className="flex flex-wrap gap-2">
              {alerts.map(a => (
                <span key={a.key} className="px-3 py-1 rounded-full text-sm font-bold bg-orange-100 text-orange-700">
                  {a.emoji} {a.label} needs attention
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Tabs */}
        <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
          {[
            { key: 'skills',   label: '📊 Skill Growth' },
            { key: 'academic', label: '📚 Academic' },
            { key: 'goals',    label: '🎯 Goals' },
            { key: 'report',   label: '🤖 AI Report' },
          ].map(t => (
            <button key={t.key}
              onClick={() => setActiveTab(t.key as typeof activeTab)}
              className="px-4 py-2 rounded-2xl font-bold text-sm whitespace-nowrap transition-all"
              style={{
                background: activeTab === t.key ? '#5B2EFF' : 'white',
                color:      activeTab === t.key ? 'white' : '#374151',
              }}
            >
              {t.label}
            </button>
          ))}
        </div>

        {/* ── TAB: SKILL GROWTH ── */}
        {activeTab === 'skills' && (
          <div className="space-y-6">
            {profiles.length === 0 ? (
              <div className="bg-white rounded-3xl p-12 text-center shadow-card">
                <div className="text-5xl mb-4">📊</div>
                <h3 className="font-display text-xl font-black text-brand-ink mb-2">No Assessments Yet</h3>
                <p className="text-gray-500">Complete an assessment to see skill growth charts!</p>
                <button onClick={() => router.push('/assessment')} className="btn-primary mt-6">
                  Start Assessment →
                </button>
              </div>
            ) : (
              <>
                {/* Radar */}
                <div className="bg-white rounded-3xl shadow-card p-6">
                  <h2 className="font-display text-xl font-black text-brand-ink mb-4">🕸️ Current Skill Profile</h2>
                  <ResponsiveContainer width="100%" height={300}>
                    <RadarChart data={radarData}>
                      <PolarGrid stroke="#e5e7eb" />
                      <PolarAngleAxis dataKey="skill" tick={{ fontSize: 18 }} />
                      <Radar dataKey="score" stroke="#5B2EFF" fill="#5B2EFF" fillOpacity={0.2} strokeWidth={2} />
                    </RadarChart>
                  </ResponsiveContainer>
                </div>

                {/* Growth over time */}
                {growthData.length > 1 && (
                  <div className="bg-white rounded-3xl shadow-card p-6">
                    <h2 className="font-display text-xl font-black text-brand-ink mb-4">📈 Growth Over Time</h2>
                    <ResponsiveContainer width="100%" height={280}>
                      <LineChart data={growthData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
                        <XAxis dataKey="name" tick={{ fontSize: 11 }} />
                        <YAxis domain={[0, 100]} tick={{ fontSize: 11 }} />
                        <Tooltip />
                        <Legend />
                        <Line type="monotone" dataKey="Critical Thinking" stroke="#5B2EFF" strokeWidth={2} dot />
                        <Line type="monotone" dataKey="Communication"     stroke="#00B4D8" strokeWidth={2} dot />
                        <Line type="monotone" dataKey="Creativity"        stroke="#FF6B35" strokeWidth={2} dot />
                        <Line type="monotone" dataKey="Overall"           stroke="#00D68F" strokeWidth={2} dot strokeDasharray="5 5" />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                )}

                {/* All skill scores */}
                <div className="grid grid-cols-2 sm:grid-cols-5 gap-4">
                  {SKILL_CONFIG.map(s => {
                    const score = latestProfile ? latestProfile[s.key as keyof SkillProfile] as number : 0
                    const prev  = profiles[1] ? profiles[1][s.key as keyof SkillProfile] as number : score
                    const diff  = score - prev
                    return (
                      <div key={s.key} className="bg-white rounded-2xl p-4 text-center shadow-card border-t-4"
                           style={{ borderTopColor: s.color }}>
                        <div className="text-2xl mb-1">{s.emoji}</div>
                        <div className="font-black text-xl" style={{ color: s.color }}>{score}</div>
                        <div className="text-xs text-gray-500 font-semibold">{s.label}</div>
                        {diff !== 0 && (
                          <div className={`text-xs font-black mt-1 ${diff > 0 ? 'text-green-500' : 'text-red-400'}`}>
                            {diff > 0 ? '↑' : '↓'}{Math.abs(diff)}
                          </div>
                        )}
                      </div>
                    )
                  })}
                </div>
              </>
            )}
          </div>
        )}

        {/* ── TAB: ACADEMIC ── */}
        {activeTab === 'academic' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="font-display text-xl font-black text-brand-ink">📚 Academic Tracker</h2>
              <button onClick={() => setShowExamForm(true)} className="btn-primary text-sm py-2 px-4">
                + Add Exam
              </button>
            </div>

            {/* Add Exam Form */}
            {showExamForm && (
              <div className="bg-white rounded-3xl shadow-card p-6">
                <h3 className="font-display font-black text-brand-ink mb-4">Create New Exam</h3>
                <div className="grid md:grid-cols-3 gap-4 mb-4">
                  <input value={examName} onChange={e => setExamName(e.target.value)}
                    placeholder="Exam name (e.g. Pre-Term)"
                    className="px-4 py-3 rounded-2xl border-2 border-gray-200 font-semibold outline-none focus:border-brand-violet" />
                  <input value={examYear} onChange={e => setExamYear(e.target.value)}
                    placeholder="Academic year (e.g. 2024-25)"
                    className="px-4 py-3 rounded-2xl border-2 border-gray-200 font-semibold outline-none focus:border-brand-violet" />
                  <input type="date" value={examDate} onChange={e => setExamDate(e.target.value)}
                    className="px-4 py-3 rounded-2xl border-2 border-gray-200 font-semibold outline-none focus:border-brand-violet" />
                </div>

                <h4 className="font-bold text-gray-600 mb-3">Subjects</h4>
                <div className="space-y-3 mb-4">
                  {subjects.map((sub, i) => (
                    <div key={i} className="flex gap-3">
                      <input value={sub.name}
                        onChange={e => { const s = [...subjects]; s[i].name = e.target.value; setSubjects(s) }}
                        placeholder={`Subject ${i + 1} name`}
                        className="flex-1 px-4 py-2 rounded-xl border-2 border-gray-200 font-semibold outline-none" />
                      <input type="number" value={sub.maxMarks}
                        onChange={e => { const s = [...subjects]; s[i].maxMarks = parseInt(e.target.value); setSubjects(s) }}
                        placeholder="Max marks"
                        className="w-32 px-4 py-2 rounded-xl border-2 border-gray-200 font-semibold outline-none" />
                      {subjects.length > 1 && (
                        <button onClick={() => setSubjects(subjects.filter((_, j) => j !== i))}
                          className="text-red-400 font-black px-2">✕</button>
                      )}
                    </div>
                  ))}
                </div>

                <div className="flex gap-3">
                  <button onClick={() => setSubjects([...subjects, { name: '', maxMarks: 100 }])}
                    className="btn-ghost text-sm py-2 px-4">+ Add Subject</button>
                  <button onClick={createExam} disabled={savingExam}
                    className="btn-primary text-sm py-2 px-4 disabled:opacity-40">
                    {savingExam ? 'Saving...' : 'Save Exam'}
                  </button>
                  <button onClick={() => setShowExamForm(false)}
                    className="btn-ghost text-sm py-2 px-4">Cancel</button>
                </div>
              </div>
            )}

            {/* Exams list */}
            {exams.length === 0 ? (
              <div className="bg-white rounded-3xl p-12 text-center shadow-card">
                <div className="text-5xl mb-4">📝</div>
                <h3 className="font-display text-xl font-black text-brand-ink mb-2">No Exams Added Yet</h3>
                <p className="text-gray-500">Add your child&apos;s exams to track academic progress!</p>
              </div>
            ) : (
              <>
                {/* Academic bar chart */}
                {academicData.length > 0 && (
                  <div className="bg-white rounded-3xl shadow-card p-6">
                    <h3 className="font-display font-black text-brand-ink mb-4">📊 Subject Performance (%)</h3>
                    <ResponsiveContainer width="100%" height={250}>
                      <BarChart data={academicData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
                        <XAxis dataKey="subject" tick={{ fontSize: 11 }} />
                        <YAxis domain={[0, 100]} tick={{ fontSize: 11 }} />
                        <Tooltip formatter={(v: number) => `${v.toFixed(1)}%`} />
                        <Bar dataKey="marks" radius={[6, 6, 0, 0]}>
                          {academicData.map((_, i) => (
                            <Cell key={i} fill={['#5B2EFF','#00B4D8','#FF6B35','#00D68F','#FFB800'][i % 5]} />
                          ))}
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                )}

                {exams.map(exam => (
                  <div key={exam.id} className="bg-white rounded-3xl shadow-card p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <h3 className="font-display font-black text-brand-ink">{exam.name}</h3>
                        <p className="text-gray-500 text-sm">{exam.academicYear}</p>
                      </div>
                      <button onClick={() => { setActiveExam(exam); setMarks({}) }}
                        className="btn-primary text-sm py-2 px-4">
                        {exam.results.length > 0 ? 'Update Marks' : 'Enter Marks'}
                      </button>
                    </div>

                    {exam.results.length > 0 && (
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                        {exam.subjects.map(sub => {
                          const result = exam.results.find(r => r.subjectId === sub.id)
                          return (
                            <div key={sub.id} className="p-3 rounded-2xl bg-gray-50 text-center">
                              <div className="font-bold text-sm text-gray-600">{sub.name}</div>
                              <div className="font-black text-lg text-brand-violet">
                                {result ? `${result.marksObtained}/${sub.maxMarks}` : '—'}
                              </div>
                              <div className="text-xs font-bold text-brand-coral">{result?.grade || ''}</div>
                            </div>
                          )
                        })}
                      </div>
                    )}
                  </div>
                ))}
              </>
            )}

            {/* Enter Marks Modal */}
            {activeExam && (
              <div className="fixed inset-0 bg-black/60 flex items-center justify-center p-4 z-50">
                <div className="bg-white rounded-4xl shadow-glow w-full max-w-md p-8">
                  <h3 className="font-display text-xl font-black text-brand-ink mb-6">
                    Enter Marks — {activeExam.name}
                  </h3>
                  <div className="space-y-4 mb-6">
                    {activeExam.subjects.map(sub => (
                      <div key={sub.id} className="flex items-center gap-4">
                        <label className="flex-1 font-semibold text-gray-700">{sub.name}</label>
                        <input type="number" min={0} max={sub.maxMarks}
                          value={marks[sub.id] || ''}
                          onChange={e => setMarks(prev => ({ ...prev, [sub.id]: parseFloat(e.target.value) }))}
                          placeholder={`/ ${sub.maxMarks}`}
                          className="w-28 px-3 py-2 rounded-xl border-2 border-gray-200 font-semibold text-center outline-none focus:border-brand-violet" />
                      </div>
                    ))}
                  </div>
                  <div className="flex gap-3">
                    <button onClick={() => setActiveExam(null)}
                      className="flex-1 py-3 rounded-2xl border-2 border-gray-200 font-bold text-gray-600">
                      Cancel
                    </button>
                    <button onClick={saveMarks} disabled={savingMarks}
                      className="flex-1 py-3 rounded-2xl font-display font-black text-white disabled:opacity-40"
                      style={{ background: '#5B2EFF' }}>
                      {savingMarks ? 'Saving...' : 'Save Marks'}
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ── TAB: GOALS ── */}
        {activeTab === 'goals' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="font-display text-xl font-black text-brand-ink">🎯 Goal Wizard</h2>
              <button onClick={() => setShowGoalForm(true)} className="btn-primary text-sm py-2 px-4">
                + New Goal
              </button>
            </div>

            {/* Goal Form */}
            {showGoalForm && (
              <div className="bg-white rounded-3xl shadow-card p-6">
                <h3 className="font-display font-black text-brand-ink mb-4">Set a New Goal</h3>
                <div className="flex gap-3 mb-4">
                  {(['SKILL', 'ACADEMIC'] as const).map(t => (
                    <button key={t} onClick={() => { setGoalType(t); setGoalTitle(''); setGoalTarget(''); setGoalSkill('') }}
                      className="flex-1 py-2 rounded-xl font-bold text-sm transition-all"
                      style={{
                        background: goalType === t ? '#5B2EFF' : '#f3f4f6',
                        color:      goalType === t ? 'white' : '#374151',
                      }}>
                      {t === 'SKILL' ? '🧠 Skill Goal' : '📚 Academic Goal'}
                    </button>
                  ))}
                </div>  

                <input value={goalTitle} onChange={e => setGoalTitle(e.target.value)}
                  placeholder={goalType === 'SKILL' ? 'Goal title (e.g. Improve Public Speaking)' : 'Goal title (e.g. Score 90% in Maths)'}
                  className="w-full px-4 py-3 rounded-2xl border-2 border-gray-200 font-semibold outline-none focus:border-brand-violet mb-4" />

                {goalType === 'SKILL' && (
                  <select value={goalSkill} onChange={e => setGoalSkill(e.target.value)}
                    className="w-full px-4 py-3 rounded-2xl border-2 border-gray-200 font-semibold bg-white outline-none mb-4">
                    <option value="">Select skill</option>
                    {SKILL_CONFIG.map(s => (
                      <option key={s.key} value={s.key}>{s.emoji} {s.label}</option>
                    ))}
                  </select>
                )}

                <input type="number" value={goalTarget} onChange={e => setGoalTarget(e.target.value)}
                  placeholder={goalType === 'SKILL' ? 'Target score (0-100)' : 'Target marks'}
                  className="w-full px-4 py-3 rounded-2xl border-2 border-gray-200 font-semibold outline-none focus:border-brand-violet mb-4" />

                <div className="flex gap-3">
                  <button onClick={createGoal} disabled={savingGoal}
                    className="btn-primary text-sm py-2 px-6 disabled:opacity-40">
                    {savingGoal ? 'Saving...' : 'Set Goal 🎯'}
                  </button>
                  <button onClick={() => setShowGoalForm(false)}
                    className="btn-ghost text-sm py-2 px-4">Cancel</button>
                </div>
              </div>
            )}

            {goals.length === 0 ? (
              <div className="bg-white rounded-3xl p-12 text-center shadow-card">
                <div className="text-5xl mb-4">🎯</div>
                <h3 className="font-display text-xl font-black text-brand-ink mb-2">No Goals Set Yet</h3>
                <p className="text-gray-500">Set a skill or academic goal to track your child&apos;s progress!</p>
              </div>
            ) : (
              <div className="space-y-4">
                {goals.map(goal => (
                  <div key={goal.id}
                    className={`bg-white rounded-2xl shadow-card p-5 border-l-4 ${goal.achieved ? 'border-green-400' : 'border-brand-violet'}`}>
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="font-black text-brand-ink">{goal.title}</div>
                        <div className="text-sm text-gray-500 mt-1">
                          {goal.type === 'SKILL' ? `🧠 Skill Goal` : `📚 Academic Goal`}
                          {goal.targetScore && ` · Target: ${goal.targetScore}/100`}
                          {goal.targetMarks && ` · Target: ${goal.targetMarks} marks`}
                        </div>
                      </div>
                      {goal.achieved ? (
                        <span className="text-green-500 font-black text-sm">✅ Achieved!</span>
                      ) : (
                        <button onClick={() => markGoalDone(goal.id)}
                          className="text-sm font-bold px-3 py-1 rounded-xl bg-green-50 text-green-600 hover:bg-green-100 transition-all">
                          Mark Done ✓
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ── TAB: AI REPORT ── */}
        {activeTab === 'report' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="font-display text-xl font-black text-brand-ink">🤖 AI Weekly Report</h2>
              <button onClick={generateReport} disabled={generatingReport}
                className="btn-primary text-sm py-2 px-4 disabled:opacity-40">
                {generatingReport ? '⏳ Generating...' : '✨ Generate Report'}
              </button>
            </div>

            {!report ? (
              <div className="bg-white rounded-3xl p-12 text-center shadow-card">
                <div className="text-5xl mb-4">🤖</div>
                <h3 className="font-display text-xl font-black text-brand-ink mb-2">No Report Yet</h3>
                <p className="text-gray-500 mb-6">Generate your first AI weekly report!</p>
                <button onClick={generateReport} disabled={generatingReport} className="btn-primary">
                  {generatingReport ? '⏳ Generating...' : '✨ Generate Now'}
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                {/* Summary */}
                <div className="bg-white rounded-3xl shadow-card p-6">
                  <h3 className="font-display font-black text-brand-ink mb-3">📋 Weekly Summary</h3>
                  <p className="text-gray-600 leading-relaxed">{report.summary}</p>
                  <div className="flex gap-4 mt-4 text-sm font-semibold text-gray-500">
                    <span>⚡ {report.xpEarned} XP earned</span>
                    <span>✅ {report.activitiesCompleted} activities</span>
                  </div>
                </div>

                {/* Highlights */}
                {report.highlights?.length > 0 && (
                  <div className="bg-white rounded-3xl shadow-card p-6">
                    <h3 className="font-display font-black text-brand-ink mb-3">✨ Highlights</h3>
                    <div className="space-y-2">
                      {report.highlights.map((h, i) => (
                        <div key={i} className="flex items-start gap-3 p-3 rounded-2xl bg-brand-mint/5">
                          <span className="text-brand-mint font-black">✓</span>
                          <span className="text-gray-700 font-medium text-sm">{h}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Concerns */}
                {report.concerns?.length > 0 && (
                  <div className="bg-white rounded-3xl shadow-card p-6">
                    <h3 className="font-display font-black text-brand-ink mb-3">⚠️ Areas to Watch</h3>
                    <div className="space-y-2">
                      {report.concerns.map((c, i) => (
                        <div key={i} className="flex items-start gap-3 p-3 rounded-2xl bg-orange-50">
                          <span className="text-orange-500 font-black">!</span>
                          <span className="text-gray-700 font-medium text-sm">{c}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Recommendations */}
                {report.recommendations?.length > 0 && (
                  <div className="bg-white rounded-3xl shadow-card p-6">
                    <h3 className="font-display font-black text-brand-ink mb-3">💡 Recommendations</h3>
                    <div className="grid sm:grid-cols-3 gap-4">
                      {report.recommendations.map((r, i) => (
                        <div key={i} className="p-4 rounded-2xl border-2 border-brand-violet/10 bg-brand-violet/5">
                          <div className="w-7 h-7 rounded-xl bg-brand-violet text-white font-black text-sm flex items-center justify-center mb-2">
                            {i + 1}
                          </div>
                          <p className="text-gray-700 font-medium text-sm">{r}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Encouragement */}
                {report.encouragement && (
                  <div className="rounded-3xl p-6 text-white text-center"
                       style={{ background: 'linear-gradient(135deg, #5B2EFF 0%, #FF6B35 100%)' }}>
                    <div className="text-3xl mb-2">🌟</div>
                    <p className="font-display font-black text-xl">{report.encouragement}</p>
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
