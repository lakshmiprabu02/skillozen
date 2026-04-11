export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-brand-base">
      {/* Header */}
      <div className="bg-white border-b border-gray-100 py-4">
        <div className="max-w-4xl mx-auto px-6 flex items-center justify-between">
          <a href="/" className="font-display text-xl font-black text-brand-ink">
            🌟 Skill<span style={{ color: '#FF6B35' }}>ozen</span>
          </a>
          <a href="/" className="text-sm font-semibold text-gray-500 hover:text-brand-violet">
            ← Back to Home
          </a>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 py-12">
        <h1 className="font-display text-4xl font-black text-brand-ink mb-2">Privacy Policy</h1>
        <p className="text-gray-500 mb-8">Last updated: April 2025</p>

        <div className="bg-white rounded-3xl shadow-card p-8 space-y-8">

          <section>
            <h2 className="font-display text-xl font-black text-brand-ink mb-3">1. Introduction</h2>
            <p className="text-gray-600 leading-relaxed">
              Clevergen Education ("we", "us", "our") operates Skillozen (skillozen.com).
              This Privacy Policy explains how we collect, use, and protect your information
              when you use our platform. We are committed to protecting the privacy of children
              and their families.
            </p>
          </section>

          <section>
            <h2 className="font-display text-xl font-black text-brand-ink mb-3">2. Information We Collect</h2>
            <p className="text-gray-600 leading-relaxed mb-3">We collect the following information:</p>
            <ul className="space-y-2 text-gray-600">
              <li>• <strong>Parent/Guardian:</strong> Name, email address</li>
              <li>• <strong>Child Profile:</strong> Name, age, avatar (no photos)</li>
              <li>• <strong>Assessment Data:</strong> Skill scores and answers</li>
              <li>• <strong>Training Data:</strong> Activities completed, XP earned</li>
              <li>• <strong>Academic Data:</strong> Exam marks entered by parent</li>
              <li>• <strong>Payment Data:</strong> Processed securely by Razorpay (we do not store card details)</li>
            </ul>
          </section>

          <section>
            <h2 className="font-display text-xl font-black text-brand-ink mb-3">3. How We Use Your Information</h2>
            <ul className="space-y-2 text-gray-600">
              <li>• To provide personalised skill assessments and training</li>
              <li>• To generate AI-powered progress reports</li>
              <li>• To track learning progress and achievements</li>
              <li>• To process payments and manage subscriptions</li>
              <li>• To improve our platform and services</li>
              <li>• To send important account and service updates</li>
            </ul>
          </section>

          <section>
            <h2 className="font-display text-xl font-black text-brand-ink mb-3">4. Children's Privacy</h2>
            <p className="text-gray-600 leading-relaxed">
              Skillozen is designed for children aged 4–20 but accounts are created and managed
              by parents or guardians. We do not knowingly collect personal information directly
              from children without parental consent. We collect only the minimum information
              necessary to provide our educational services. We do not show advertisements to children.
            </p>
          </section>

          <section>
            <h2 className="font-display text-xl font-black text-brand-ink mb-3">5. Data Sharing</h2>
            <p className="text-gray-600 leading-relaxed">
              We do not sell your personal data. We share data only with:
            </p>
            <ul className="mt-3 space-y-2 text-gray-600">
              <li>• <strong>OpenAI:</strong> To generate skill profiles and weekly reports (anonymised)</li>
              <li>• <strong>Razorpay:</strong> To process payments securely</li>
              <li>• <strong>Neon Database:</strong> To store your data securely</li>
              <li>• <strong>Vercel:</strong> To host our platform</li>
            </ul>
          </section>

          <section>
            <h2 className="font-display text-xl font-black text-brand-ink mb-3">6. Data Security</h2>
            <p className="text-gray-600 leading-relaxed">
              We implement industry-standard security measures including encrypted connections (HTTPS),
              secure database storage, and regular security reviews. Payment information is handled
              entirely by Razorpay and is never stored on our servers.
            </p>
          </section>

          <section>
            <h2 className="font-display text-xl font-black text-brand-ink mb-3">7. Data Retention</h2>
            <p className="text-gray-600 leading-relaxed">
              We retain your data for as long as your account is active. You may request deletion
              of your account and all associated data at any time by contacting us at
              <strong> support@skillozen.com</strong>. We will process deletion requests within 30 days.
            </p>
          </section>

          <section>
            <h2 className="font-display text-xl font-black text-brand-ink mb-3">8. Your Rights</h2>
            <ul className="space-y-2 text-gray-600">
              <li>• <strong>Access:</strong> Request a copy of your data</li>
              <li>• <strong>Correction:</strong> Update inaccurate information</li>
              <li>• <strong>Deletion:</strong> Request deletion of your account and data</li>
              <li>• <strong>Portability:</strong> Export your child's progress data</li>
            </ul>
          </section>

          <section>
            <h2 className="font-display text-xl font-black text-brand-ink mb-3">9. Cookies</h2>
            <p className="text-gray-600 leading-relaxed">
              We use session storage and local storage to maintain your login session and
              preferences. We do not use tracking cookies or advertising cookies.
            </p>
          </section>

          <section>
            <h2 className="font-display text-xl font-black text-brand-ink mb-3">10. Contact Us</h2>
            <p className="text-gray-600 leading-relaxed">
              For privacy-related questions or to exercise your rights, contact us at:
            </p>
            <div className="mt-3 p-4 bg-gray-50 rounded-2xl text-gray-600">
              <p><strong>Clevergen Education</strong></p>
              <p>Product: Skillozen</p>
              <p>Website: skillozen.com</p>
              <p>Email: support@skillozen.com</p>
              <p>Location: Chennai, Tamil Nadu, India</p>
            </div>
          </section>

        </div>
      </div>

      {/* Footer */}
      <div className="text-center py-8 text-gray-400 text-sm">
        © 2025 Clevergen Education. All rights reserved. Skillozen is a product of Clevergen Education.
      </div>
    </div>
  )
}
