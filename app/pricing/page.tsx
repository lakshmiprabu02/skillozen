'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'

declare global {
  interface Window {
    Razorpay: any
  }
}

export default function PricingPage() {
  const router = useRouter()
  const [loading, setLoading] = useState<string | null>(null)
  const [userId, setUserId] = useState<string | null>(null)
  const [userPlan, setUserPlan] = useState<'FREE' | 'STANDARD' | 'PREMIUM' | null>(null)

  useEffect(() => {
    const stored = localStorage.getItem('skillozen_user')
    if (stored) {
      const s = JSON.parse(stored)
      setUserId(s.userId)
      setUserPlan(s.plan ?? 'FREE')
    } else {
      setUserPlan('FREE')
    }

    const script = document.createElement('script')
    script.src = 'https://checkout.razorpay.com/v1/checkout.js'
    script.async = true
    document.body.appendChild(script)
  }, [])

  async function handlePayment(plan: 'standard' | 'premium') {
    const stored = localStorage.getItem('skillozen_user')
    if (!stored) {
      router.push('/login?redirect=/pricing')
      return
    }
    const userData = JSON.parse(stored)
    const currentUserId = userData.userId
    if (!currentUserId) {
      router.push('/login?redirect=/pricing')
      return
    }
    setLoading(plan)
    try {
      const res = await fetch('/api/payment/create-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: currentUserId, plan }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error)

      const options = {
        key:         process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        amount:      data.amount,
        currency:    data.currency,
        name:        'Skillozen',
        description: data.description,
        order_id:    data.orderId,
        prefill: {
          name:  data.userName,
          email: data.userEmail,
        },
        theme: { color: '#5B2EFF' },
        handler: async (response: any) => {
          try {
            const verifyRes = await fetch('/api/payment/verify', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                razorpay_order_id:   response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature:  response.razorpay_signature,
                userId: currentUserId,
                plan,
              }),
            })
            const verifyData = await verifyRes.json()
            if (verifyData.success) {
              router.push('/dashboard?upgraded=true')
            }
          } catch {
            alert('Payment verification failed. Please contact support.')
          }
        },
      }

      const rzp = new window.Razorpay(options)
      rzp.open()
    } catch (err) {
      alert('Failed to initiate payment. Please try again.')
      console.error(err)
    } finally {
      setLoading(null)
    }
  }

  if (userPlan === null) {
    return (
      <div className="min-h-screen bg-brand-base flex items-center justify-center">
        <p className="text-gray-400 text-lg">Loading...</p>
      </div>
    )
  }

  if (userPlan === 'PREMIUM') {
    return (
      <div className="min-h-screen bg-brand-base flex flex-col items-center justify-center px-6 text-center">
        <div className="text-6xl mb-4">🏆</div>
        <h1 className="font-display text-3xl font-black text-brand-ink mb-2">
          You&apos;re on the best plan!
        </h1>
        <p className="text-gray-500 mb-6">
          You already have full access to everything Skillozen offers.
        </p>
        <button
          onClick={() => router.push('/dashboard')}
          className="py-3 px-8 rounded-2xl font-display font-black text-white btn-primary">
          Back to Dashboard
        </button>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-brand-base">
      {/* Header */}
      <div className="bg-white border-b border-gray-100 py-4">
        <div className="max-w-4xl mx-auto px-6 flex items-center justify-between">
          <a href="/dashboard" className="font-display text-xl font-black text-brand-ink">
            🌟 Skill<span style={{ color: '#FF6B35' }}>ozen</span>
          </a>
          <button onClick={() => router.back()}
            className="text-sm font-semibold text-gray-500 hover:text-brand-violet">
            ← Back
          </button>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 py-12">

        {/* Upgrade Banner */}
        <div className="text-center mb-12">
          <div className="text-5xl mb-4">🚀</div>
          <h1 className="font-display text-4xl font-black text-brand-ink mb-3">
            Unlock Your Child&apos;s Full Potential
          </h1>
          <p className="text-gray-500 text-lg max-w-xl mx-auto">
            {userPlan === 'STANDARD'
              ? 'Upgrade to Premium for AI Weekly Reports, Goal Wizard & more.'
              : "Upgrade to continue tracking your child's growth and access 1,500+ training activities."}
          </p>
        </div>

        {/* Plans */}
        <div className="grid md:grid-cols-2 gap-6 max-w-2xl mx-auto mb-12">

          {/* Standard — FREE users only */}
          {userPlan !== 'STANDARD' && (
            <div className="bg-white rounded-3xl p-8 border-2 border-brand-violet shadow-glow relative flex flex-col">
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full text-white text-xs font-black bg-brand-violet">
                Most Popular
              </div>
              <h2 className="font-display text-2xl font-black text-brand-ink mb-1">Standard</h2>
              <div className="flex items-baseline gap-1 mb-2">
                <span className="font-display text-4xl font-black text-brand-violet">₹499</span>
                <span className="text-gray-500">/ year</span>
              </div>
              <p className="text-gray-500 text-sm mb-6">Just ₹41/month</p>
              <ul className="space-y-3 flex-1 mb-8">
                {[
                  'Unlimited Assessments',
                  'Full Training Library (1,500+ activities)',
                  'Daily Personalised Queue',
                  'XP, Badges & Streaks',
                  'Email Skill Reports',
                  'Up to 3 Child Profiles',
                ].map(f => (
                  <li key={f} className="flex items-start gap-2 text-sm font-medium text-gray-700">
                    <span className="text-brand-violet font-black mt-0.5">✓</span>
                    {f}
                  </li>
                ))}
              </ul>
              <button
                onClick={() => handlePayment('standard')}
                disabled={loading === 'standard'}
                className="w-full py-3 rounded-2xl font-display font-black text-white btn-primary disabled:opacity-40 mt-auto">
                {loading === 'standard' ? '⏳ Loading...' : 'Get Standard — ₹499/yr →'}
              </button>
            </div>
          )}

          {/* Premium */}
          <div className={`bg-white rounded-3xl p-8 border-2 border-orange-200 relative flex flex-col ${userPlan === 'STANDARD' ? 'md:col-span-2 max-w-sm mx-auto w-full' : ''}`}>
            {userPlan === 'STANDARD' && (
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full text-white text-xs font-black bg-orange-500">
                Recommended Upgrade
              </div>
            )}
            <h2 className="font-display text-2xl font-black text-brand-ink mb-1">Premium</h2>
            <div className="flex items-baseline gap-1 mb-2">
              <span className="font-display text-4xl font-black text-brand-coral">₹799</span>
              <span className="text-gray-500">/ year</span>
            </div>
            <p className="text-gray-500 text-sm mb-6">Just ₹66/month</p>
            <ul className="space-y-3 mb-8">
              {[
                'Everything in Standard',
                'Up to 5 Child Profiles',
                'Smart Progress Dashboard',
                'AI Weekly Reports',
                'Goal Wizard',
                'Academic Tracker',
                'Predictive Skill Alerts',
              ].map(f => (
                <li key={f} className="flex items-start gap-2 text-sm font-medium text-gray-700">
                  <span className="text-brand-coral font-black mt-0.5">✓</span>
                  {f}
                </li>
              ))}
            </ul>
            <button
              onClick={() => handlePayment('premium')}
              disabled={loading === 'premium'}
              className="w-full py-3 rounded-2xl font-display font-black text-white transition-all disabled:opacity-40 mt-auto"
              style={{ background: '#FF6B35' }}>
              {loading === 'premium' ? '⏳ Loading...' : 'Get Premium — ₹799/year →'}
            </button>
          </div>

        </div>

        {/* Trust signals */}
        <div className="flex flex-wrap justify-center gap-6 text-center text-sm text-gray-500">
          <div>🔒 Secure payment via Razorpay</div>
          <div>↩️ 7-day refund guarantee</div>
          <div>👶 Up to 5 child profiles on Premium</div>
          <div>🌍 Trusted by Families Worldwide</div>
        </div>

      </div>
    </div>  
  )
}