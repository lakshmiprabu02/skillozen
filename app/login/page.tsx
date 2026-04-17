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
        userId: data.userId,
        name: data.name,
        email: data.email,
        plan: data.plan,
        childId: data.children?.[0]?.id,
        childName: data.children?.[0]?.name,
        childAge: data.children?.[0]?.age,
        avatar: data.children?.[0]?.avatarEmoji,
      }))
      const params = new URLSearchParams(window.location.search)
      const redirect = params.get('redirect') || '/dashboard'
      router.push(redirect)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-brand-base flex items-center justify-center p-4">
      <div className="relative w-full max-w-md">
        <div className="text-center mb-8">
          <a href="/">
            <span className="font-display text-2xl font-black text-brand-ink">Skillozen</span>
          </a>
        </div>
        <div className="bg-white rounded-4xl shadow-card p-8">
          <h1 className="font-display text-3xl font-black text-brand-ink mb-2">Welcome Back!</h1>
          <p className="text-gray-500 mb-8">Log in to see your child skill progress.</p>
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                required
                className="w-full px-4 py-3 rounded-2xl border-2 border-gray-200 focus:outline-none font-semibold"
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                required
                className="w-full px-4 py-3 rounded-2xl border-2 border-gray-200 focus:outline-none font-semibold"
              />
            </div>
            {error && (
              <div className="p-3 rounded-xl bg-red-50 text-red-600 text-sm font-semibold">{error}</div>
            )}
            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full justify-center py-4 text-base mt-2 disabled:opacity-50"
            >
              {loading ? 'Logging in...' : 'Login'}
            </button>
            <div className="text-right">
              <a href="/forgot-password" className="text-sm font-bold text-gray-400 hover:text-brand-violet">
                Forgot Password?
              </a>
            </div>
          </form>
          <div className="mt-6 text-center">
            <p className="text-gray-500 text-sm">
              Do not have an account?
              <a href="/onboarding" className="text-brand-violet font-bold hover:underline ml-1">
                Register here
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
