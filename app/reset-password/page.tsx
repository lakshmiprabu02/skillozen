'use client'

import { useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Suspense } from 'react'

function ResetPasswordForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const token = searchParams.get('token') || ''
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (newPassword !== confirmPassword) {
      setError('Passwords do not match')
      return
    }
    if (newPassword.length < 6) {
      setError('Password must be at least 6 characters')
      return
    }
    setLoading(true)
    setError('')
    try {
      const res = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ resetToken: token, newPassword }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error)
      setSuccess(true)
      setTimeout(() => router.push('/login'), 2000)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  if (!token) {
    return (
      <div className="text-center py-12">
        <div className="text-5xl mb-4">⚠️</div>
        <p className="text-gray-600 mb-4">Invalid reset link.</p>
        <a href="/forgot-password" className="btn-primary">
          Try Again
        </a>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-4xl shadow-card p-8">
      <div className="text-center mb-6">
        <div className="text-5xl mb-3">🔐</div>
        <h1 className="font-display text-3xl font-black text-brand-ink mb-2">
          Reset Password
        </h1>
        <p className="text-gray-500 text-sm">
          Enter your new password below.
        </p>
      </div>

      {success ? (
        <div className="text-center py-8 animate-fade-in">
          <div className="text-5xl mb-4">✅</div>
          <h2 className="font-display text-2xl font-black text-brand-ink mb-2">
            Password Reset!
          </h2>
          <p className="text-gray-500 mb-2">
            Your password has been updated successfully.
          </p>
          <p className="text-sm text-gray-400">
            Redirecting to login...
          </p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">
              New Password
            </label>
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="Minimum 6 characters"
              required
              className="w-full px-4 py-3 rounded-2xl border-2 border-gray-200 focus:outline-none focus:border-brand-violet font-semibold text-brand-ink placeholder:text-gray-400"
            />
          </div>
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">
              Confirm New Password
            </label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Re-enter new password"
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
            disabled={loading || !newPassword || !confirmPassword}
            className="btn-primary w-full justify-center py-4 text-base disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Resetting...' : 'Reset Password'}
          </button>
        </form>
      )}

      <div className="mt-6 text-center">
        <a href="/login" className="text-sm font-bold text-gray-400 hover:text-brand-violet transition-colors">
          Back to Login
        </a>
      </div>
    </div>
  )
}

export default function ResetPasswordPage() {
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
        <Suspense fallback={
          <div className="bg-white rounded-4xl shadow-card p-8 text-center">
            <div className="text-4xl mb-4">⏳</div>
            <p className="text-gray-500 font-semibold">Loading...</p>
          </div>
        }>
          <ResetPasswordForm />
        </Suspense>
      </div>
    </div>
  )
}
