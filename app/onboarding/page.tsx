'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

const AVATARS = ['🧒', '👧', '👦', '🧑', '👩', '👨', '🧒‍♀️', '🧒‍♂️', '🦊', '🐼', '🦁', '🐬']

export default function OnboardingPage() {
  const router = useRouter()
  const [step, setStep] = useState<'parent' | 'child'>('parent')
  const [parentEmail, setParentEmail] = useState('')
  const [parentName, setParentName] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [childName, setChildName] = useState('')
  const [childAge, setChildAge] = useState(10)
  const [avatar, setAvatar] = useState('🧒')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function handleSubmit() {
    if (password !== confirmPassword) {
      setError('Passwords do not match')
      return
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters')
      return
    }
    setLoading(true)
    setError('')
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email:       parentEmail,
          password,
          name:        parentName,
          childName,
          childAge,
          avatarEmoji: avatar,
        }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Failed to create profile')

      localStorage.setItem('skillozen_token', data.token)
      localStorage.setItem('skillozen_user', JSON.stringify({
        userId:    data.userId,
        childId:   data.childId,
        childName,
        childAge,
        avatar,
        parentName,
      }))
      router.push('/assessment')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong. Please try again.')
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

        {/* Progress dots */}
        <div className="flex items-center justify-center gap-2 mb-8">
          <div className={`h-3 rounded-full transition-all ${step === 'parent' ? 'bg-brand-violet w-8' : 'bg-brand-mint w-3'}`} />
          <div className={`h-3 rounded-full transition-all ${step === 'child' ? 'bg-brand-violet w-8' : 'bg-gray-200 w-3'}`} />
        </div>

        <div className="bg-white rounded-4xl shadow-card p-8 animate-slide-up">

          {step === 'parent' && (
            <>
              <h1 className="font-display text-3xl font-black text-brand-ink mb-2">
                Create Account 👋
              </h1>
              <p className="text-gray-500 mb-8">
                Set up your parent account to track your child&apos;s progress from any device.
              </p>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Your Name</label>
                  <input
                    type="text"
                    value={parentName}
                    onChange={(e) => setParentName(e.target.value)}
                    placeholder="e.g. Priya Sharma"
                    className="w-full px-4 py-3 rounded-2xl border-2 border-gray-200 focus:outline-none focus:border-brand-violet font-semibold text-brand-ink placeholder:text-gray-400"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Email Address</label>
                  <input
                    type="email"
                    value={parentEmail}
                    onChange={(e) => setParentEmail(e.target.value)}
                    placeholder="you@example.com"
                    className="w-full px-4 py-3 rounded-2xl border-2 border-gray-200 focus:outline-none focus:border-brand-violet font-semibold text-brand-ink placeholder:text-gray-400"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Password</label>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Minimum 6 characters"
                    className="w-full px-4 py-3 rounded-2xl border-2 border-gray-200 focus:outline-none focus:border-brand-violet font-semibold text-brand-ink placeholder:text-gray-400"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Confirm Password</label>
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Re-enter your password"
                    className="w-full px-4 py-3 rounded-2xl border-2 border-gray-200 focus:outline-none focus:border-brand-violet font-semibold text-brand-ink placeholder:text-gray-400"
                  />
                </div>
              </div>

              {error && (
                <div className="mt-4 p-3 rounded-xl bg-red-50 text-red-600 text-sm font-semibold">
                  {error}
                </div>
              )}

              <button
                onClick={() => {
                  if (!parentEmail) { setError('Please enter your email'); return }
                  if (!password) { setError('Please enter a password'); return }
                  if (password !== confirmPassword) { setError('Passwords do not match'); return }
                  if (password.length < 6) { setError('Password must be at least 6 characters'); return }
                  setError('')
                  setStep('child')
                }}
                className="btn-primary w-full mt-8 justify-center text-base py-4"
              >
                Continue →
              </button>

              <div className="mt-6 text-center">
                <p className="text-gray-500 text-sm font-medium">
                  Already have an account?{' '}
                  <a href="/login" className="text-brand-violet font-bold hover:underline">
                    Login here
                  </a>
                </p>
              </div>
            </>
          )}

          {step === 'child' && (
            <>
              <button
                onClick={() => setStep('parent')}
                className="text-sm text-gray-400 font-bold mb-4 hover:text-brand-violet transition-colors flex items-center gap-1">
                ← Back
              </button>

              <h1 className="font-display text-3xl font-black text-brand-ink mb-2">
                About Your Child 🧒
              </h1>
              <p className="text-gray-500 mb-8">
                We will tailor everything to their exact age.
              </p>

              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-3">Pick an Avatar</label>
                  <div className="grid grid-cols-6 gap-2">
                    {AVATARS.map((a) => (
                      <button
                        key={a}
                        onClick={() => setAvatar(a)}
                        className={`w-12 h-12 rounded-2xl text-2xl flex items-center justify-center transition-all border-2 ${
                          avatar === a
                            ? 'border-brand-violet bg-brand-violet/10 scale-110'
                            : 'border-gray-100 hover:border-brand-violet/40 bg-gray-50'
                        }`}
                      >
                        {a}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">
                    Child&apos;s First Name
                  </label>
                  <input
                    type="text"
                    value={childName}
                    onChange={(e) => setChildName(e.target.value)}
                    placeholder="e.g. Arya"
                    className="w-full px-4 py-3 rounded-2xl border-2 border-gray-200 focus:outline-none focus:border-brand-violet font-semibold text-brand-ink placeholder:text-gray-400"
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">
                    Age: <span className="text-brand-violet">{childAge} years</span>
                  </label>
                  <input
                    type="range"
                    min={4}
                    max={20}
                    value={childAge}
                    onChange={(e) => setChildAge(Number(e.target.value))}
                    className="w-full accent-brand-violet"
                  />
                  <div className="flex justify-between text-xs text-gray-400 font-medium mt-1">
                    <span>4 yrs</span>
                    <span>20 yrs</span>
                  </div>
                  <div className="mt-2 text-sm font-semibold text-brand-violet text-center">
                    {childAge <= 7  ? '🌱 Early Explorer (4–7)'    :
                     childAge <= 12 ? '🌿 Middle Learner (8–12)'   :
                     childAge <= 17 ? '🌲 Teen Achiever (13–17)'   :
                                      '🌳 Young Adult (18–20)'}
                  </div>
                </div>
              </div>

              {error && (
                <div className="mt-4 p-3 rounded-xl bg-red-50 text-red-600 text-sm font-semibold">
                  {error}
                </div>
              )}

              <div className="mt-6 p-4 rounded-2xl bg-brand-violet/5 border border-brand-violet/20">
                <p className="text-sm text-gray-600 font-medium text-center">
                  🎮 Ready to start <strong>{childName || 'your child'}&apos;s</strong> skill adventure?
                  The assessment takes about <strong>10 minutes</strong>!
                </p>
              </div>

              <button
                onClick={handleSubmit}
                disabled={loading || !childName || !parentEmail}
                className="btn-coral w-full mt-6 justify-center text-base py-4 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? '⏳ Setting up...' : `🚀 Start ${childName || 'the'} Assessment!`}
              </button>
            </>
          )}
        </div>

        <p className="text-center text-xs text-gray-400 font-medium mt-6">
          🔒 Your data is private and secure. We never share it.
        </p>
      </div>
    </div>
  )
}
