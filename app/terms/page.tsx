export default function TermsPage() {
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
        <h1 className="font-display text-4xl font-black text-brand-ink mb-2">Terms & Conditions</h1>
        <p className="text-gray-500 mb-8">Last updated: April {new Date().getFullYear()}</p>

        <div className="bg-white rounded-3xl shadow-card p-8 space-y-8">

          <section>
            <h2 className="font-display text-xl font-black text-brand-ink mb-3">1. About Us</h2>
            <p className="text-gray-600 leading-relaxed">
              Skillozen is an AI-powered life skills platform for children aged 4–20, developed and operated by
              <strong> Clevergen Education</strong>. By accessing or using Skillozen at skillozen.com,
              you agree to be bound by these Terms and Conditions.
            </p>
          </section>

          <section>
            <h2 className="font-display text-xl font-black text-brand-ink mb-3">2. Services</h2>
            <p className="text-gray-600 leading-relaxed">
              Skillozen provides AI-powered skill assessments, personalised training activities, progress tracking,
              and weekly AI reports for children. Our platform offers the following plans:
            </p>
            <ul className="mt-3 space-y-2 text-gray-600">
              <li>• <strong>Starter (Free):</strong> 3 assessments + skill report</li>
              <li>• <strong>Explorer (₹99 one-time):</strong> 3 additional assessments</li>
              <li>• <strong>Standard (₹499/year):</strong> Unlimited assessments + full training library</li>
              <li>• <strong>Premium (₹799/year):</strong> Everything + Smart Progress Dashboard</li>
            </ul>
          </section>

          <section>
            <h2 className="font-display text-xl font-black text-brand-ink mb-3">3. User Accounts</h2>
            <p className="text-gray-600 leading-relaxed">
              Parents or legal guardians must create accounts on behalf of children under 18.
              You are responsible for maintaining the confidentiality of your account credentials
              and for all activities that occur under your account. You must provide accurate and
              complete information when creating your account.
            </p>
          </section>

          <section>
            <h2 className="font-display text-xl font-black text-brand-ink mb-3">4. Payment Terms</h2>
            <p className="text-gray-600 leading-relaxed">
              All payments are processed securely through Razorpay. Prices are in Indian Rupees (INR)
              and inclusive of applicable taxes. Annual subscriptions are billed once per year.
              One-time purchases are non-recurring. Clevergen Education reserves the right to
              modify pricing with 30 days notice.
            </p>
          </section>

          <section>
            <h2 className="font-display text-xl font-black text-brand-ink mb-3">5. Refund Policy</h2>
            <p className="text-gray-600 leading-relaxed">
              We offer a 7-day refund policy for annual subscriptions. If you are not satisfied with
              our service, contact us within 7 days of purchase at
              <strong> support@skillozen.com</strong> for a full refund.
              One-time Explorer purchases (₹99) are non-refundable once assessments are accessed.
            </p>
          </section>

          <section>
            <h2 className="font-display text-xl font-black text-brand-ink mb-3">6. Children's Privacy</h2>
            <p className="text-gray-600 leading-relaxed">
              We take children's privacy seriously. We collect only the information necessary to
              provide our services. We do not sell, share, or disclose children's personal data
              to third parties except as required to operate our services. All data is stored
              securely and in compliance with applicable Indian data protection laws.
            </p>
          </section>

          <section>
            <h2 className="font-display text-xl font-black text-brand-ink mb-3">7. Intellectual Property</h2>
            <p className="text-gray-600 leading-relaxed">
              All content on Skillozen including activities, assessments, reports, and platform design
              is the intellectual property of Clevergen Education. You may not copy, reproduce,
              or distribute any content without written permission.
            </p>
          </section>

          <section>
            <h2 className="font-display text-xl font-black text-brand-ink mb-3">8. Limitation of Liability</h2>
            <p className="text-gray-600 leading-relaxed">
              Skillozen is an educational support tool and does not replace professional educational
              or psychological assessment. Clevergen Education shall not be liable for any indirect,
              incidental, or consequential damages arising from use of our platform.
            </p>
          </section>

          <section>
            <h2 className="font-display text-xl font-black text-brand-ink mb-3">9. Governing Law</h2>
            <p className="text-gray-600 leading-relaxed">
              These terms are governed by the laws of India. Any disputes shall be subject to the
              exclusive jurisdiction of the courts in Chennai, Tamil Nadu, India.
            </p>
          </section>

          <section>
            <h2 className="font-display text-xl font-black text-brand-ink mb-3">10. Contact Us</h2>
            <p className="text-gray-600 leading-relaxed">
              For any questions regarding these terms, please contact us at:
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
        © {new Date().getFullYear()} Clevergen Education. All rights reserved. Skillozen is a product of Clevergen Education.
      </div>
    </div>
  )
}
