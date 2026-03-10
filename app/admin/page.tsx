'use client'

import { useState, useEffect } from 'react'

interface AdminStats {
  totalUsers: number
  totalChildren: number
  totalAssessments: number
  completedAssessments: number
  totalActivities: number
  recentSignups: Array<{ id: string; email: string; name: string | null; plan: string; createdAt: string; _count: { children: number } }>
  dailySignups: Array<{ date: string; count: number }>
  skillBreakdown: Array<{ skill: string; avgScore: number; count: number }>
  planBreakdown: Array<{ plan: string; _count: { id: number } }>
  usageByFeature: Array<{ feature: string; _count: { id: number } }>
}

export default function AdminPage() {
  const [password, setPassword] = useState('')
  const [token, setToken] = useState<string | null>(null)
  const [loginError, setLoginError] = useState('')
  const [loginLoading, setLoginLoading] = useState(false)
  const [stats, setStats] = useState<AdminStats | null>(null)
  const [statsLoading, setStatsLoading] = useState(false)
  const [activeTab, setActiveTab] = useState<'overview' | 'users' | 'usage'>('overview')

  // Try token from localStorage
  useEffect(() => {
    const stored = localStorage.getItem('admin_token')
    if (stored) { setToken(stored); loadStats(stored) }
  }, [])

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault()
    setLoginLoading(true)
    setLoginError('')
    try {
      const res = await fetch('/api/admin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Invalid password')
      setToken(data.token)
      localStorage.setItem('admin_token', data.token)
      loadStats(data.token)
    } catch (err) {
      setLoginError(err instanceof Error ? err.message : 'Login failed')
    } finally {
      setLoginLoading(false)
    }
  }

  async function loadStats(t: string) {
    setStatsLoading(true)
    try {
      const res = await fetch('/api/admin?action=stats', {
        headers: { Authorization: `Bearer ${t}` },
      })
      if (res.status === 401) { setToken(null); localStorage.removeItem('admin_token'); return }
      const data = await res.json()
      setStats(data)
    } catch {
      console.error('Failed to load stats')
    } finally {
      setStatsLoading(false)
    }
  }

  async function exportEmails() {
    if (!token) return
    const res = await fetch('/api/admin?action=export', {
      headers: { Authorization: `Bearer ${token}` },
    })
    const blob = await res.blob()
    const url  = URL.createObjectURL(blob)
    const a    = document.createElement('a')
    a.href     = url
    a.download = 'skillozen-users.csv'
    a.click()
  }

  // ── LOGIN ──────────────────────────────────────────────────────────────────
  if (!token) {
    return (
      <div className="min-h-screen bg-brand-ink flex items-center justify-center p-4">
        <div className="w-full max-w-sm">
          <div className="text-center mb-8">
            <span className="text-4xl">🔐</span>
            <h1 className="font-display text-2xl font-black text-white mt-2">Admin Panel</h1>
            <p className="text-white/50 text-sm">Skillozen Dashboard</p>
          </div>
          <form onSubmit={handleLogin} className="bg-white/5 rounded-3xl p-6 space-y-4">
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Admin password"
              className="w-full px-4 py-3 rounded-2xl bg-white/10 border border-white/20 text-white placeholder:text-white/30 font-semibold focus:outline-none focus:border-brand-violet"
            />
            {loginError && <p className="text-red-400 text-sm font-semibold">{loginError}</p>}
            <button
              type="submit"
              disabled={loginLoading}
              className="w-full py-3 rounded-2xl bg-brand-violet text-white font-bold transition-all hover:bg-brand-violet/80 disabled:opacity-50"
            >
              {loginLoading ? 'Logging in...' : 'Login →'}
            </button>
          </form>
        </div>
      </div>
    )
  }

  // ── DASHBOARD ──────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-brand-ink text-white">
      {/* Header */}
      <div className="border-b border-white/10 py-5 px-6">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-2xl">🌟</span>
            <div>
              <span className="font-display font-black text-lg">Skillozen</span>
              <span className="text-white/40 text-sm ml-2">Admin</span>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button onClick={exportEmails}
                    className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-sm font-bold transition-all">
              📥 Export CSV
            </button>
            <button onClick={() => loadStats(token)}
                    className="px-4 py-2 rounded-xl bg-brand-violet hover:bg-brand-violet/80 text-sm font-bold transition-all">
              🔄 Refresh
            </button>
            <button onClick={() => { setToken(null); localStorage.removeItem('admin_token') }}
                    className="px-4 py-2 rounded-xl bg-white/5 text-white/50 hover:text-white text-sm font-bold">
              Logout
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {statsLoading ? (
          <div className="text-center py-20 text-white/40">Loading stats...</div>
        ) : stats ? (
          <>
            {/* Tabs */}
            <div className="flex gap-2 mb-8">
              {(['overview', 'users', 'usage'] as const).map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-5 py-2 rounded-xl text-sm font-bold capitalize transition-all ${
                    activeTab === tab ? 'bg-brand-violet' : 'bg-white/5 hover:bg-white/10'
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>

            {activeTab === 'overview' && (
              <>
                {/* Key metrics */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                  {[
                    { label: 'Total Users',          value: stats.totalUsers,              icon: '👥', color: '#5B2EFF' },
                    { label: 'Children Profiles',    value: stats.totalChildren,            icon: '🧒', color: '#00D68F' },
                    { label: 'Assessments Done',     value: stats.completedAssessments,     icon: '📊', color: '#FFB800' },
                    { label: 'Activities Completed', value: stats.totalActivities,          icon: '⚡', color: '#FF6B35' },
                  ].map((m) => (
                    <div key={m.label}
                         className="rounded-2xl p-5 border border-white/10"
                         style={{ background: `${m.color}15` }}>
                      <div className="text-2xl mb-2">{m.icon}</div>
                      <div className="font-display text-3xl font-black" style={{ color: m.color }}>
                        {m.value.toLocaleString()}
                      </div>
                      <div className="text-white/50 text-sm font-medium mt-1">{m.label}</div>
                    </div>
                  ))}
                </div>

                {/* Plan breakdown */}
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="bg-white/5 rounded-2xl p-6">
                    <h3 className="font-display text-lg font-black mb-4">📦 Plan Breakdown</h3>
                    <div className="space-y-3">
                      {stats.planBreakdown.map((p) => (
                        <div key={p.plan} className="flex items-center justify-between">
                          <span className="font-semibold text-white/70">{p.plan}</span>
                          <div className="flex items-center gap-3">
                            <div className="w-32 h-2 rounded-full bg-white/10 overflow-hidden">
                              <div className="h-full rounded-full bg-brand-violet"
                                   style={{ width: `${(p._count.id / stats.totalUsers) * 100}%` }} />
                            </div>
                            <span className="font-bold w-8 text-right">{p._count.id}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="bg-white/5 rounded-2xl p-6">
                    <h3 className="font-display text-lg font-black mb-4">🎯 Usage by Feature</h3>
                    <div className="space-y-3">
                      {stats.usageByFeature.map((u) => (
                        <div key={u.feature} className="flex items-center justify-between">
                          <span className="font-semibold text-white/70 capitalize">{u.feature}</span>
                          <span className="font-bold text-brand-violet">{u._count.id} actions</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </>
            )}

            {activeTab === 'users' && (
              <div className="bg-white/5 rounded-2xl overflow-hidden">
                <div className="p-5 border-b border-white/10 flex items-center justify-between">
                  <h3 className="font-display text-lg font-black">Recent Signups</h3>
                  <span className="text-white/40 text-sm">{stats.recentSignups.length} shown</span>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-white/10">
                        {['Email', 'Name', 'Plan', 'Children', 'Joined'].map((h) => (
                          <th key={h} className="text-left p-4 text-white/40 font-bold">{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {stats.recentSignups.map((u) => (
                        <tr key={u.id} className="border-b border-white/5 hover:bg-white/5">
                          <td className="p-4 font-medium">{u.email}</td>
                          <td className="p-4 text-white/70">{u.name || '—'}</td>
                          <td className="p-4">
                            <span className={`px-2 py-0.5 rounded-full text-xs font-black ${
                              u.plan === 'PREMIUM' ? 'bg-brand-coral/20 text-brand-coral' :
                              u.plan === 'STANDARD' ? 'bg-brand-violet/20 text-brand-violet' :
                              'bg-white/10 text-white/50'
                            }`}>{u.plan}</span>
                          </td>
                          <td className="p-4 text-center">{u._count.children}</td>
                          <td className="p-4 text-white/40">
                            {new Date(u.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {activeTab === 'usage' && (
              <div className="bg-white/5 rounded-2xl p-6">
                <h3 className="font-display text-lg font-black mb-6">🧠 Average Skill Scores</h3>
                <div className="space-y-4">
                  {stats.skillBreakdown.map((s) => (
                    <div key={s.skill}>
                      <div className="flex justify-between text-sm font-semibold mb-1">
                        <span className="text-white/70">{s.skill.replace(/_/g, ' ')}</span>
                        <span>{s.avgScore}/100 (n={s.count})</span>
                      </div>
                      <div className="h-3 rounded-full bg-white/10 overflow-hidden">
                        <div className="h-full rounded-full bg-gradient-to-r from-brand-violet to-brand-coral"
                             style={{ width: `${s.avgScore}%` }} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </>
        ) : (
          <div className="text-center py-20 text-white/40">No data available</div>
        )}
      </div>
    </div>
  )
}
