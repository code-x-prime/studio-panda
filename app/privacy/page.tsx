import Link from 'next/link'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Privacy Policy | Studio Panda',
  description: 'Privacy policy for Studio Panda - How we collect, use, and protect your information.',
}

export default function PrivacyPolicyPage() {
  return (
    <main className="min-h-screen bg-zinc-50 text-zinc-900">
      <div className="pt-28 sm:pt-32 pb-20 sm:pb-28">
        <div className="mx-auto max-w-3xl px-6 sm:px-8 lg:px-12">
          {/* Header */}
          <div className="mb-12">
            <p className="mb-4 text-xs sm:text-sm font-semibold tracking-wide text-primary uppercase">
              Legal
            </p>
            <h1 className="mb-4 text-3xl sm:text-4xl lg:text-5xl font-black text-zinc-900 leading-tight">
              Privacy Policy
            </h1>
            <p className="text-sm text-zinc-500">
              Last updated: August 2, 2026
            </p>
          </div>

          {/* Content */}
          <div className="prose prose-zinc max-w-none space-y-8 text-sm sm:text-base leading-relaxed">
            <section>
              <h2 className="text-xl font-bold text-zinc-900 mb-3">1. Information We Collect</h2>
              <p className="text-zinc-600 mb-3">
                When you visit Studio Panda or submit a contact form, we may collect the following information:
              </p>
              <ul className="list-disc list-inside text-zinc-600 space-y-2 ml-4">
                <li>Name and email address (via contact form submissions)</li>
                <li>School or organization name</li>
                <li>Phone number (if provided)</li>
                <li>Browser and device information (automatically collected)</li>
                <li>Usage data such as pages visited and time spent on the site</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-bold text-zinc-900 mb-3">2. How We Use Your Information</h2>
              <p className="text-zinc-600 mb-3">
                We use the information we collect to:
              </p>
              <ul className="list-disc list-inside text-zinc-600 space-y-2 ml-4">
                <li>Respond to your inquiries and provide requested information</li>
                <li>Schedule and conduct school presentations</li>
                <li>Improve our website and services</li>
                <li>Send relevant updates about our programs (with your consent)</li>
                <li>Ensure the security and functionality of our platform</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-bold text-zinc-900 mb-3">3. Data Protection</h2>
              <p className="text-zinc-600">
                We implement appropriate technical and organizational measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction. Your data is stored securely and is only accessed by authorized personnel who need it to perform their duties.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-zinc-900 mb-3">4. Third-Party Services</h2>
              <p className="text-zinc-600">
                We may use third-party services such as Cloudflare (for content delivery and security), Google Analytics (for website analytics), and email service providers. These services have their own privacy policies governing how they handle data.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-zinc-900 mb-3">5. Cookies</h2>
              <p className="text-zinc-600">
                Our website may use cookies and similar tracking technologies to enhance your browsing experience. You can choose to disable cookies through your browser settings, though some features of the site may not function properly as a result.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-zinc-900 mb-3">6. Children&apos;s Privacy</h2>
              <p className="text-zinc-600">
                Studio Panda works with schools and students. We do not knowingly collect personal information directly from children under 13 without parental or school consent. If you believe we have collected information from a child without proper consent, please contact us immediately.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-zinc-900 mb-3">7. Your Rights</h2>
              <p className="text-zinc-600 mb-3">
                You have the right to:
              </p>
              <ul className="list-disc list-inside text-zinc-600 space-y-2 ml-4">
                <li>Access the personal information we hold about you</li>
                <li>Request correction of inaccurate data</li>
                <li>Request deletion of your personal data</li>
                <li>Opt out of marketing communications</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-bold text-zinc-900 mb-3">8. Changes to This Policy</h2>
              <p className="text-zinc-600">
                We may update this privacy policy from time to time. Any changes will be posted on this page with an updated revision date. We encourage you to review this policy periodically.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-zinc-900 mb-3">9. Contact Us</h2>
              <p className="text-zinc-600">
                If you have any questions about this privacy policy or how we handle your data, please contact us at:{' '}
                <a href="mailto:contact@studiopanda.in" className="text-primary font-medium hover:underline">
                  contact@studiopanda.in
                </a>
              </p>
            </section>
          </div>

          {/* Back link */}
          <div className="mt-12 pt-8 border-t border-zinc-200">
            <Link href="/" className="text-sm text-primary font-medium hover:underline">
              &larr; Back to Home
            </Link>
          </div>
        </div>
      </div>
    </main>
  )
}
