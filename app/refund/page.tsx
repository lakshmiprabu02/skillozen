export default function RefundPage() {
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
        <h1 className="font-display text-4xl font-black text-brand-ink mb-2">Refund Policy</h1>
        <p className="text-gray-500 mb-8">Last updated: April 2025</p>

        <div className="bg-white rounded-3xl shadow-card p-8 space-y-8">

          <section>
            <h2 className="font-display text-xl font-black text-brand-ink mb-3">Our Commitment</h2>
            <p className="text-gray-600 leading-relaxed">
              At Clevergen Education, we want you to be completely satisfied with Skillozen.
              If you are not happy with our service, we offer a fair and transparent refund policy.
            </p>
          </section>

          <section>
            <h2 className="font-display text-xl font-black text-brand-ink mb-3">Refund Eligibility</h2>
            <div className="space-y-4">

              <div className="p-5 rounded-2xl border-2 border-green-100 bg-green-50">
                <h3 className="font-bold text-green-700 mb-2">✅ Standard Plan (₹499/year)</h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  Full refund available within <strong>7 days</strong> of purchase if you are
                  not satisfied with the service. Contact us at support@skillozen.com with your
                  registered email and order ID.
                </p>
              </div>

              <div className="p-5 rounded-2xl border-2 border-green-100 bg-green-50">
                <h3 className="font-bold text-green-700 mb-2">✅ Premium Plan (₹799/year)</h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  Full refund available within <strong>7 days</strong> of purchase if you are
                  not satisfied with the service. Contact us at support@skillozen.com with your
                  registered email and order ID.
                </p>
              </div>

              <div className="p-5 rounded-2xl border-2 border-orange-100 bg-orange-50">
                <h3 className="font-bold text-orange-700 mb-2">⚠️ Explorer Plan (₹99 one-time)</h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  Non-refundable once the additional assessments have been accessed.
                  If you have not used the assessments, contact us within 48 hours for a refund.
                </p>
              </div>

              <div className="p-5 rounded-2xl border-2 border-red-100 bg-red-50">
                <h3 className="font-bold text-red-700 mb-2">❌ Not Eligible for Refund</h3>
                <ul className="text-gray-600 text-sm space-y-1">
                  <li>• Refund requests made after 7 days of purchase</li>
                  <li>• Explorer plan after assessments are accessed</li>
                  <li>• Accounts suspended for violation of Terms of Service</li>
                </ul>
              </div>

            </div>
          </section>

          <section>
            <h2 className="font-display text-xl font-black text-brand-ink mb-3">How to Request a Refund</h2>
            <div className="space-y-3">
              <div className="flex items-start gap-4">
                <div className="w-8 h-8 rounded-xl bg-brand-violet text-white font-black text-sm flex items-center justify-center shrink-0">1</div>
                <p className="text-gray-600 pt-1">Email us at <strong>support@skillozen.com</strong> with subject line "Refund Request"</p>
              </div>
              <div className="flex items-start gap-4">
                <div className="w-8 h-8 rounded-xl bg-brand-violet text-white font-black text-sm flex items-center justify-center shrink-0">2</div>
                <p className="text-gray-600 pt-1">Include your registered email address and Razorpay order ID</p>
              </div>
              <div className="flex items-start gap-4">
                <div className="w-8 h-8 rounded-xl bg-brand-violet text-white font-black text-sm flex items-center justify-center shrink-0">3</div>
                <p className="text-gray-600 pt-1">We will process your refund within <strong>5-7 business days</strong></p>
              </div>
              <div className="flex items-start gap-4">
                <div className="w-8 h-8 rounded-xl bg-brand-violet text-white font-black text-sm flex items-center justify-center shrink-0">4</div>
                <p className="text-gray-600 pt-1">Refund will be credited to your original payment method</p>
              </div>
            </div>
          </section>

          <section>
            <h2 className="font-display text-xl font-black text-brand-ink mb-3">Cancellation Policy</h2>
            <p className="text-gray-600 leading-relaxed">
              You can cancel your subscription at any time. Cancellation stops future renewals
              but does not trigger an automatic refund. To request a refund along with cancellation,
              please follow the refund request process above within the eligible period.
            </p>
          </section>

          <section>
            <h2 className="font-display text-xl font-black text-brand-ink mb-3">Contact Us</h2>
            <div className="p-4 bg-gray-50 rounded-2xl text-gray-600">
              <p><strong>Clevergen Education</strong></p>
              <p>Product: Skillozen</p>
              <p>Email: support@skillozen.com</p>
              <p>Website: skillozen.com</p>
              <p>Response time: Within 24 business hours</p>
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
