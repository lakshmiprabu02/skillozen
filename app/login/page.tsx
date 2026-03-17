'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error)

      localStorage.setItem('skillozen_token', data.token)
      localStorage.setItem('skillozen_user', JSON.stringify({
        userId:   data.userId,
        name:     data.name,
        email:    data.email,
        plan:     data.plan,
        childId:  data.children?.[0]?.id,
        childName: data.children?.[0]?.name,
        childAge:  data.children?.[0]?.age,
        avatar:    data.children?.[0]?.avatarEmoji,
      }))

      router.push('/dashboard')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-brand-base flex items-center justify-center p-4">
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-20 right-20 w-64 h-64 rounded-full opacity-10 blur-3xl bg-brand-violet" />
        <div className="absolute bottom-20 left-20 w-64 h-64 rounded-full opacity-10 blur-3xl bg-brand-coral" />
      </div>

      <div className="relative w-full max-w-md">
        <div className="text-center mb-8">
          <a href="/" className="inline-flex items-center gap-2">
            <span className="text-3xl">🌟</span>
            <span className="font-display text-2xl font-black text-brand-ink">
              Skill<span className="gradient-text">ozen</span>
            </span>
          </a>
        </div>

        <div className="bg-white rounded-4xl shadow-card p-8 animate-slide-up">
          <h1 className="font-display text-3xl font-black text-brand-ink mb-2">
            Welcome Back! 👋
          </h1>
          <p className="text-gray-500 mb-8">
            Log in to see your child's skill progress.
          </p>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">
                Email Address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                required
                className="w-full px-4 py-3 rounded-2xl border-2 border-gray-200 focus:outline-none focus:border-brand-violet font-semibold text-brand-ink placeholder:text-gray-400"
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                required
                className="w-full px-4 py-3 rounded-2xl border-2 border-gray-200 focus:outline-none focus:border-brand-violet font-semibold text-brand-ink placeholder:text-gray-400"
              />
            </div>

            {error && (
              <div className="p-3 rounded-xl bg-red-50 text-red-600 text-sm font-semibold">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full justify-center py-4 text-base mt-2 disabled:opacity-50"
            >
              {loading ? '⏳ Logging in...' : 'Login →'}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-gray-500 text-sm font-medium">
              Do not have an account?{' '}
              <a href="/onboarding" className="text-brand-violet font-bold hover:underline">
                Register here
              </a>
            </p>
          </div>
        </div>

        <p className="text-center text-xs text-gray-400 font-medium mt-6">
          🔒 Your data is private and secure.
        </p>
      </div>
    </div>
  )
}
feat: add login page
