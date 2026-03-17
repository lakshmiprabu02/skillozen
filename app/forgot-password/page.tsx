'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function ForgotPasswordPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [childName, setChildName] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      const res = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, childName }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error)
      router.push('/reset-password?token=' + data.resetToken)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-brand-base flex items-center justify-center p-4">
      <div className="relative w-full max-w-md">
        <div className="text-center mb-8">
          <a href="/" className="inline-flex items-center gap-2">
            <span className="text-3xl">🌟</span>
            <span className="font-display text-2xl font-black text-brand-ink">
              Skill<span className="gradient-text">ozen</span>
            </span>
          </a>
        </div>
        <div className="bg-white rounded-4xl shadow-card p-8">
          <div className="text-center mb-6">
            <div className="text-5xl mb-3">🔑</div>
            <h1 className="font-display text-3xl font-black text-brand-ink mb-2">
              Forgot Password?
            </h1>
            <p className="text-gray-500 text-sm">
              Enter your email and your child name to verify your identity.
            </p>
          </div>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">
                Your Email Address
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
                Your Child First Name
              </label>
              <input
                type="text"
                value={childName}
                onChange={(e) => setChildName(e.target.value)}
                placeholder="e.g. Arya"
                required
                className="w-full px-4 py-3 rounded-2xl border-2 border-gray-200 focus:outline-none focus:border-brand-violet font-semibold text-brand-ink placeholder:text-gray-400"
              />
              <p className="text-xs text-gray-400 font-medium mt-1">
                This is used to verify your identity
              </p>
            </div>
            {error && (
              <div className="p-3 rounded-xl bg-red-50 text-red-600 text-sm font-semibold">
                {error}
              </div>
            )}
            <button
              type="submit"
              disabled={loading || !email || !childName}
              className="btn-primary w-full justify-center py-4 text-base disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Verifying...' : 'Verify Identity'}
            </button>
          </form>
          <div className="mt-6 text-center">
            <a href="/login" className="text-sm font-bold text-gray-400 hover:text-brand-violet transition-colors">
              Back to Login
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}
