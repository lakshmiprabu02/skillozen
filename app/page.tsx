'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

const SKILLS = [
  { emoji: '🧠', label: 'Critical Thinking',  color: '#5B2EFF', bg: '#EDE9FF' },
  { emoji: '🗣️', label: 'Communication',      color: '#00B4D8', bg: '#E0F7FF' },
  { emoji: '💛', label: 'Social-Emotional',   color: '#FF4785', bg: '#FFE8EF' },
  { emoji: '🎨', label: 'Creativity',          color: '#FF6B35', bg: '#FFF0EB' },
  { emoji: '💻', label: 'Digital Literacy',   color: '#00D68F', bg: '#E0FFF6' },
  { emoji: '💰', label: 'Financial Literacy', color: '#FFB800', bg: '#FFF8E0' },
  { emoji: '🧘', label: 'Health & Wellness',  color: '#06D6A0', bg: '#E0FFF8' },
  { emoji: '🎯', label: 'Goal Setting',        color: '#7209B7', bg: '#F3E8FF' },
  { emoji: '🔬', label: 'Scientific Thinking',color: '#3A86FF', bg: '#E8F1FF' },
  { emoji: '🎤', label: 'Public Speaking',    color: '#FB5607', bg: '#FFF0EB' },
]

const FEATURES = [
  {
    icon: '🎯',
    title: 'Skill Analysis',
    tag: 'FREE',
    tagColor: '#00D68F',
    desc: 'A 20-question game-like diagnostic that maps your child\'s skill strengths and gaps across all 5 key areas.',
    bullets: ['Adaptive, not a boring test', 'Radar chart of all skills', 'Age-benchmarked comparisons', 'Parent report with action steps'],
  },
  {
    icon: '⚡',
    title: 'Skill Training',
    tag: '₹499/yr',
    tagColor: '#5B2EFF',
    desc: '500+ bite-sized activities, games, and challenges. 5–15 mins each. Personalised to your child\'s skill gaps.',
    bullets: ['Daily personalised activity queue', 'XP, badges & streak rewards', 'Quizzes, simulations, creative tasks', 'Offline-capable for all devices'],
  },
  {
    icon: '📊',
    title: 'Progress Dashboard',
    tag: '₹799/yr',
    tagColor: '#FF6B35',
    desc: 'The parent\'s window into their child\'s growth journey — real-time charts, AI insights, and predictive alerts.',
    bullets: ['AI-generated weekly reports', 'Skill heatmaps & trend charts', 'Goal-setting with milestones', 'Predictive struggle alerts'],
  },
]

const PRICING = [
  {
    name: 'Basic',
    price: 'Free',
    period: 'Forever',
    color: '#00D68F',
    features: ['Skill Analysis (1 assessment)', 'Skill Radar Chart', 'Parent Report Card', 'Age-benchmarked comparisons'],
    cta: 'Start Free',
    highlight: false,
  },
  {
    name: 'Standard',
    price: '₹499',
    period: '/ year',
    color: '#5B2EFF',
    features: ['Everything in Basic', '500+ Training Activities', 'Daily personalised queues', 'XP, Badges & Streaks', 'Repeatable assessments (3-monthly)'],
    cta: 'Get Standard',
    highlight: true,
  },
  {
    name: 'Premium',
    price: '₹799',
    period: '/ year',
    color: '#FF6B35',
    features: ['Everything in Standard', 'Smart Progress Dashboard', 'AI Weekly Reports', 'Predictive alerts', 'Goal-setting wizard'],
    cta: 'Get Premium',
    highlight: false,
  },
]

const TESTIMONIALS = [
  { quote: 'My daughter used to freeze up during group discussions. After 3 months on Skillozen, she\'s the one leading them!', name: 'Priya M.', role: 'Parent of 11-year-old', emoji: '👩' },
  { quote: 'The assessment was a revelation — we had no idea our son scored so high in creativity but struggled with digital literacy.', name: 'Rahul K.', role: 'Parent of 14-year-old', emoji: '👨' },
  { quote: 'Finally, something that\'s not just about academics. Skillozen focuses on the skills my child actually needs for life.', name: 'Ananya S.', role: 'Parent of 8-year-old', emoji: '👩‍🦰' },
]

export default function LandingPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [emailSubmitted, setEmailSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)

  async function handleEmailSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!email) return
    setLoading(true)
    try {
      await fetch('/api/user', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      })
      setEmailSubmitted(true)
      setTimeout(() => router.push('/onboarding'), 1200)
    } catch {
      router.push('/onboarding')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-brand-base overflow-hidden">

      {/* ── NAV ───────────────────────────────────────────────── */}
      <nav className="sticky top-0 z-50 glass-card border-b border-white/50">
        <div className="page-container flex items-center justify-between py-4">
          <div className="flex items-center gap-2">
            <span className="text-2xl">🌟</span>
            <span className="font-display text-2xl font-black text-brand-ink">
              Skill<span className="gradient-text">ozen</span>
            </span>
          </div>
          <div className="hidden md:flex items-center gap-8">
            <a href="#features" className="font-semibold text-gray-600 hover:text-brand-violet transition-colors">Features</a>
            <a href="#pricing" className="font-semibold text-gray-600 hover:text-brand-violet transition-colors">Pricing</a>
            <a href="/admin" className="font-semibold text-gray-500 hover:text-brand-violet transition-colors text-sm">Admin</a>
          </div>
          <button onClick={() => router.push('/onboarding')} className="btn-primary text-sm">
            Start Free →
          </button>
        </div>
      </nav>

      {/* ── HERO ──────────────────────────────────────────────── */}
      <section className="relative pt-20 pb-32 overflow-hidden">
        {/* Background decoration */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-40 -right-40 w-96 h-96 rounded-full opacity-10"
               style={{ background: 'radial-gradient(circle, #5B2EFF, transparent)' }} />
          <div className="absolute -bottom-20 -left-20 w-80 h-80 rounded-full opacity-10"
               style={{ background: 'radial-gradient(circle, #FF6B35, transparent)' }} />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full opacity-5"
               style={{ background: 'radial-gradient(circle, #00D68F, transparent)' }} />
        </div>

        <div className="page-container relative">
          {/* Floating skill pills */}
          <div className="hidden lg:flex items-center gap-3 mb-8 flex-wrap">
            {SKILLS.map((s) => (
              <span key={s.label}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-bold animate-float"
                style={{ background: s.bg, color: s.color, animationDelay: `${Math.random() * 1}s` }}>
                {s.emoji} {s.label}
              </span>
            ))}
          </div>

          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-brand-violet/10 text-brand-violet font-bold text-sm mb-6">
              🚀 AI-Powered Life Skills Platform · Ages 4–20
            </div>

            <h1 className="font-display text-5xl md:text-7xl font-black text-brand-ink leading-none mb-6">
              Give Your Child<br />
              <span className="gradient-text">Skills That Last</span><br />
              <span className="text-4xl md:text-5xl text-gray-500 font-bold">a Lifetime</span>
            </h1>

            <p className="text-xl text-gray-600 mb-10 max-w-xl leading-relaxed">
              Skillozen measures, trains, and strengthens <strong>10 essential life skills</strong> — 
              <strong>Critical Thinking, Communication, Creativity, Social-Emotional Learning, Digital Literacy, Financial Literacy, Health & Wellness, Goal Setting, Scientific Thinking and Public Speaking</strong> — so your child thrives in the 21st century.
            </p>

            {/* Email capture form */}
            {emailSubmitted ? (
              <div className="flex items-center gap-3 p-5 rounded-2xl bg-mint/10 border-2 border-brand-mint text-brand-mint font-bold text-lg animate-fade-in">
                <span className="text-2xl">✅</span> You&apos;re in! Setting up your dashboard...
              </div>
            ) : (
              <form onSubmit={handleEmailSubmit} className="flex flex-col sm:flex-row gap-3 max-w-md">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email to start free"
                  required
                  className="flex-1 px-5 py-4 rounded-2xl border-2 border-gray-200 focus:outline-none focus:border-brand-violet font-semibold text-brand-ink placeholder:text-gray-400 bg-white"
                />
                <button
                  type="submit"
                  disabled={loading}
                  className="btn-coral whitespace-nowrap px-8 py-4 text-base"
                >
                  {loading ? '...' : 'Start for Free →'}
                </button>
              </form>
            )}
            <p className="mt-3 text-sm text-gray-500 font-medium">
              ✓ No credit card needed &nbsp;·&nbsp; ✓ Free skill assessment &nbsp;·&nbsp; ✓ Takes 10 minutes
            </p>
          </div>

          {/* Hero visual — score cards floating */}
          <div className="hidden lg:block absolute top-0 right-0 mt-8 mr-0">
            <div className="relative w-80 h-80">
              {SKILLS.slice(0, 5).map((s, i) => (
                <div
                  key={s.label}
                  className="absolute glass-card rounded-2xl p-4 shadow-card animate-float"
                  style={{
                    top:  `${[5, 5, 40, 70, 55][i]}%`,
                    left: `${[5, 65, 35, 5, 65][i]}%`,
                    animationDelay: `${i * 0.4}s`,
                    background: s.bg,
                    border: `2px solid ${s.color}20`,
                  }}
                >
                  <div className="text-2xl mb-1">{s.emoji}</div>
                  <div className="text-xs font-bold" style={{ color: s.color }}>{s.label}</div>
                  <div className="text-lg font-black" style={{ color: s.color }}>{[78, 91, 65, 84, 72][i]}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Stats bar */}
        <div className="page-container mt-16">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { n: '500+', l: 'Learning Activities' },
              { n: '10',   l: 'Core Life Skills' },
              { n: '4–20', l: 'Age Range (years)' },
              { n: '3mo',  l: 'Reassess & Track Growth' },
            ].map((s) => (
              <div key={s.l} className="text-center p-5 bg-white rounded-2xl shadow-card">
                <div className="font-display text-3xl font-black gradient-text">{s.n}</div>
                <div className="text-sm text-gray-500 font-semibold mt-1">{s.l}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FEATURES ──────────────────────────────────────────── */}
      <section id="features" className="py-24 bg-white">
        <div className="page-container">
          <div className="text-center mb-16">
            <div className="inline-block px-4 py-2 rounded-full bg-brand-violet/10 text-brand-violet font-bold text-sm mb-4">
              Platform Features
            </div>
            <h2 className="font-display text-4xl md:text-5xl font-black text-brand-ink mb-4">
              Everything Your Child Needs
            </h2>
            <p className="text-gray-500 text-lg max-w-xl mx-auto">
              From diagnosis to daily practice to measurable progress — all in one place.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {FEATURES.map((f) => (
              <div key={f.title}
                className="rounded-3xl p-8 border-2 border-gray-100 hover:border-brand-violet/20 transition-all duration-300 hover:shadow-skill group">
                <div className="flex items-start justify-between mb-6">
                  <span className="text-5xl group-hover:animate-bounce-soft">{f.icon}</span>
                  <span className="text-xs font-black px-3 py-1 rounded-full text-white"
                        style={{ background: f.tagColor }}>
                    {f.tag}
                  </span>
                </div>
                <h3 className="font-display text-2xl font-black text-brand-ink mb-3">{f.title}</h3>
                <p className="text-gray-600 mb-6 leading-relaxed">{f.desc}</p>
                <ul className="space-y-2">
                  {f.bullets.map((b) => (
                    <li key={b} className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                      <span className="text-brand-mint">✓</span> {b}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── SKILLS BREAKDOWN ──────────────────────────────────── */}
      <section className="py-24">
        <div className="page-container">
          <div className="text-center mb-16">
            <h2 className="font-display text-4xl font-black text-brand-ink mb-4">
             10 Skills That Define Future Success
            </h2>
            <p className="text-gray-500 text-lg max-w-xl mx-auto">
               Based on globally recognised 21st-century competency frameworks
            </p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-4">
            {SKILLS.map((s) => (
              <div key={s.label}
                className="rounded-3xl p-6 text-center hover:shadow-card transition-all"
                style={{ background: s.bg }}>
                <div className="text-4xl mb-3">{s.emoji}</div>
                <div className="font-display font-black text-sm" style={{ color: s.color }}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ──────────────────────────────────────── */}
      <section className="py-24 bg-white">
        <div className="page-container">
          <div className="text-center mb-16">
            <h2 className="font-display text-4xl font-black text-brand-ink mb-4">How Skillozen Works</h2>
          </div>
          <div className="grid md:grid-cols-4 gap-6">
            {[
              { step: '01', emoji: '📝', title: 'Create Profile', desc: 'Add your child\'s name and age. Takes 30 seconds.' },
              { step: '02', emoji: '🎮', title: 'Take the Assessment', desc: '20 game-like questions. No stress, no test anxiety.' },
              { step: '03', emoji: '📊', title: 'Get the Report', desc: 'Instant skill radar chart + parent-friendly insights.' },
              { step: '04', emoji: '⚡', title: 'Train Daily', desc: 'Personalised 5–15 min activities to build each skill.' },
            ].map((s) => (
              <div key={s.step} className="text-center">
                <div className="relative inline-flex mb-4">
                  <div className="w-16 h-16 rounded-2xl bg-brand-violet/10 flex items-center justify-center text-3xl">
                    {s.emoji}
                  </div>
                  <span className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-brand-violet text-white text-xs font-black flex items-center justify-center">
                    {s.step.replace('0', '')}
                  </span>
                </div>
                <h3 className="font-display text-lg font-black text-brand-ink mb-2">{s.title}</h3>
                <p className="text-gray-500 text-sm">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── TESTIMONIALS ──────────────────────────────────────── */}
      <section className="py-24">
        <div className="page-container">
          <div className="text-center mb-16">
            <h2 className="font-display text-4xl font-black text-brand-ink mb-4">Parents Love Skillozen</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {TESTIMONIALS.map((t) => (
              <div key={t.name} className="bg-white rounded-3xl p-8 shadow-card">
                <div className="text-4xl mb-4">{t.emoji}</div>
                <p className="text-gray-700 leading-relaxed mb-6 italic">&ldquo;{t.quote}&rdquo;</p>
                <div>
                  <div className="font-bold text-brand-ink">{t.name}</div>
                  <div className="text-sm text-gray-500">{t.role}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── PRICING ───────────────────────────────────────────── */}
      <section id="pricing" className="py-24 bg-white">
        <div className="page-container">
          <div className="text-center mb-16">
            <h2 className="font-display text-4xl font-black text-brand-ink mb-4">Simple, Fair Pricing</h2>
            <p className="text-gray-500 text-lg">Less than a coffee per month. Start completely free.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            {PRICING.map((p) => (
              <div key={p.name}
                className={`rounded-3xl p-8 border-2 transition-all relative ${
                  p.highlight
                    ? 'border-brand-violet shadow-skill scale-105'
                    : 'border-gray-100 hover:border-gray-200'
                }`}>
                {p.highlight && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full text-white text-xs font-black"
                       style={{ background: p.color }}>
                    Most Popular
                  </div>
                )}
                <h3 className="font-display text-xl font-black text-brand-ink mb-2">{p.name}</h3>
                <div className="flex items-baseline gap-1 mb-6">
                  <span className="font-display text-4xl font-black" style={{ color: p.color }}>{p.price}</span>
                  <span className="text-gray-500 font-medium">{p.period}</span>
                </div>
                <ul className="space-y-3 mb-8">
                  {p.features.map((f) => (
                    <li key={f} className="flex items-start gap-2 text-sm font-medium text-gray-700">
                      <span style={{ color: p.color }} className="font-black mt-0.5">✓</span>
                      {f}
                    </li>
                  ))}
                </ul>
                <button
                  onClick={() => router.push('/onboarding')}
                  className={`w-full py-3 rounded-2xl font-bold transition-all ${
                    p.highlight ? 'btn-primary' : 'btn-ghost'
                  }`}
                  style={p.highlight ? {} : { borderColor: p.color, color: p.color }}
                >
                  {p.cta}
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FINAL CTA ─────────────────────────────────────────── */}
      <section className="py-24 overflow-hidden relative">
        <div className="absolute inset-0" style={{ background: 'linear-gradient(135deg, #5B2EFF 0%, #FF6B35 100%)' }} />
        <div className="page-container relative text-center text-white">
          <h2 className="font-display text-4xl md:text-5xl font-black mb-6">
            Your Child&apos;s Future Starts Today
          </h2>
          <p className="text-white/80 text-lg mb-10 max-w-xl mx-auto">
            Join thousands of parents building their children&apos;s most important skills.
            Free to start. No credit card needed.
          </p>
          <button
            onClick={() => router.push('/onboarding')}
            className="px-10 py-5 rounded-2xl bg-white text-brand-violet font-display font-black text-xl shadow-glow hover:scale-105 transition-transform">
            Start the Free Skill Assessment →
          </button>
        </div>
      </section>

      {/* Footer */}
          <footer className="bg-brand-ink text-white py-12 mt-16">
            <div className="page-container">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-10">
                
                {/* Brand */}
                <div className="col-span-2 md:col-span-1">
                  <div className="font-display text-2xl font-black mb-3">
                    🌟 Skill<span style={{ color: '#FF6B35' }}>ozen</span>
                  </div>
                  <p className="text-white/60 text-sm leading-relaxed">
                    AI-powered life skills platform for children aged 4–20.
                    A product of Clevergen Education.
                  </p>
                </div>

                {/* Product */}
                <div>
                  <h4 className="font-bold text-white/80 mb-4 text-sm uppercase tracking-wide">Product</h4>
                  <ul className="space-y-2 text-white/60 text-sm">
                    <li><a href="/#skills" className="hover:text-white transition-colors">10 Life Skills</a></li>
                    <li><a href="/#pricing" className="hover:text-white transition-colors">Pricing</a></li>
                    <li><a href="/login" className="hover:text-white transition-colors">Login</a></li>
                    <li><a href="/onboarding" className="hover:text-white transition-colors">Get Started</a></li>
                  </ul>
                </div>

                {/* Legal */}
                <div>
                  <h4 className="font-bold text-white/80 mb-4 text-sm uppercase tracking-wide">Legal</h4>
                  <ul className="space-y-2 text-white/60 text-sm">
                    <li><a href="/terms" className="hover:text-white transition-colors">Terms & Conditions</a></li>
                    <li><a href="/privacy" className="hover:text-white transition-colors">Privacy Policy</a></li>
                    <li><a href="/refund" className="hover:text-white transition-colors">Refund Policy</a></li>
                  </ul>
                </div>

                {/* Contact */}
                <div>
                  <h4 className="font-bold text-white/80 mb-4 text-sm uppercase tracking-wide">Contact</h4>
                  <ul className="space-y-2 text-white/60 text-sm">
                    <li>support@skillozen.com</li>
                    <li>Chennai, Tamil Nadu</li>
                    <li>India</li>
                  </ul>
                </div>

              </div>

              {/* Bottom bar */}
              <div className="border-t border-white/10 pt-6 flex flex-col md:flex-row items-center justify-between gap-4">
                <p className="text-white/40 text-sm">
                  © 2025 Clevergen Education. All rights reserved.
                </p>
                <p className="text-white/40 text-sm">
                  Skillozen is a product of Clevergen Education
                </p>
              </div>
            </div>
          </footer>
    </div>
  )
}
