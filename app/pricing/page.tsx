'use client'
import { useRouter } from 'next/navigation'

export default function PricingPage() {
  const router = useRouter()

  return (
    <div className="min-h-screen bg-brand-base">
      {/* Header */}
      <div className="bg-white border-b border-gray-100 py-4">
        <div className="max-w-4xl mx-auto px-6 flex items-center justify-between">
          <a href="/" className="font-display text-xl font-black text-brand-ink">
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
            Unlock Your Child's Full Potential
          </h1>
          <p className="text-gray-500 text-lg max-w-xl mx-auto">
            You have used your free assessment. Upgrade to continue tracking
            your child's growth and access 1,500+ training activities.
          </p>
        </div>

        {/* Plans */}
        <div className="grid md:grid-cols-2 gap-6 max-w-2xl mx-auto mb-12">

          {/* Standard */}
          <div className="bg-white rounded-3xl p-8 border-2 border-brand-violet shadow-glow relative">
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full text-white text-xs font-black bg-brand-violet">
              Most Popular
            </div>
            <h2 className="font-display text-2xl font-black text-brand-ink mb-1">Standard</h2>
            <div className="flex items-baseline gap-1 mb-2">
              <span className="font-display text-4xl font-black text-brand-violet">₹499</span>
              <span className="text-gray-500">/ year</span>
            </div>
            <p className="text-gray-500 text-sm mb-6">Just ₹41/month</p>
            <ul className="space-y-3 mb-8">
              {[
                'Unlimited Assessments',
                'Full Training Library (1,500+ activities)',
                'Daily Personalised Queue',
                'XP, Badges & Streaks',
                'Email Skill Reports',
                'Unlimited Child Profiles',
              ].map(f => (
                <li key={f} className="flex items-start gap-2 text-sm font-medium text-gray-700">
                  <span className="text-brand-violet font-black mt-0.5">✓</span>
                  {f}
                </li>
              ))}
            </ul>
            <button
              onClick={() => router.push('/onboarding?plan=standard')}
              className="w-full py-3 rounded-2xl font-display font-black text-white btn-primary">
              Get Standard →
            </button>
          </div>

          {/* Premium */}
          <div className="bg-white rounded-3xl p-8 border-2 border-orange-200">
            <h2 className="font-display text-2xl font-black text-brand-ink mb-1">Premium</h2>
            <div className="flex items-baseline gap-1 mb-2">
              <span className="font-display text-4xl font-black text-brand-coral">₹799</span>
              <span className="text-gray-500">/ year</span>
            </div>
            <p className="text-gray-500 text-sm mb-6">Just ₹66/month</p>
            <ul className="space-y-3 mb-8">
              {[
                'Everything in Standard',
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
              onClick={() => router.push('/onboarding?plan=premium')}
              className="w-full py-3 rounded-2xl font-display font-black text-white transition-all"
              style={{ background: '#FF6B35' }}>
              Get Premium →
            </button>
          </div>

        </div>

        {/* Trust signals */}
        <div className="flex flex-wrap justify-center gap-6 text-center text-sm text-gray-500">
          <div>🔒 Secure payment via Razorpay</div>
          <div>↩️ 7-day refund guarantee</div>
          <div>👶 Unlimited child profiles</div>
          <div>🇮🇳 Made for Indian families</div>
        </div>

      </div>
    </div>
  )
}
