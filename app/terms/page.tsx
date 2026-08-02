import Link from 'next/link'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Terms of Service | Studio Panda',
  description: 'Terms and conditions for using Studio Panda services and website.',
}

export default function TermsOfServicePage() {
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
              Terms of Service
            </h1>
            <p className="text-sm text-zinc-500">
              Last updated: August 2, 2026
            </p>
          </div>

          {/* Content */}
          <div className="prose prose-zinc max-w-none space-y-8 text-sm sm:text-base leading-relaxed">
            <section>
              <h2 className="text-xl font-bold text-zinc-900 mb-3">1. Acceptance of Terms</h2>
              <p className="text-zinc-600">
                By accessing and using the Studio Panda website and services, you agree to be bound by these Terms of Service. If you do not agree with any part of these terms, please do not use our website or services.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-zinc-900 mb-3">2. Services</h2>
              <p className="text-zinc-600 mb-3">
                Studio Panda provides media education programs for schools, including:
              </p>
              <ul className="list-disc list-inside text-zinc-600 space-y-2 ml-4">
                <li>Podcasting workshops and training</li>
                <li>Filmmaking and video production programs</li>
                <li>Digital media and content creation courses</li>
                <li>AI tools education and integration</li>
                <li>School presentations and demonstrations</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-bold text-zinc-900 mb-3">3. Intellectual Property</h2>
              <p className="text-zinc-600">
                All content on the Studio Panda website, including text, graphics, logos, images, and software, is the property of Studio Panda and is protected by Indian and international copyright laws. Students retain ownership of content they create during our programs, while Studio Panda may use such content for promotional purposes with appropriate consent.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-zinc-900 mb-3">4. School Partnerships</h2>
              <p className="text-zinc-600">
                School partnerships and program enrollments are subject to separate agreements between Studio Panda and the participating school. These Terms of Service govern website usage and general interactions, while specific program terms are outlined in individual partnership agreements.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-zinc-900 mb-3">5. User Conduct</h2>
              <p className="text-zinc-600">
                When using our website and services, you agree not to misuse the platform, attempt unauthorized access to any part of the service, use the service for any unlawful purpose, or interfere with or disrupt the service or servers.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-zinc-900 mb-3">6. Limitation of Liability</h2>
              <p className="text-zinc-600">
                Studio Panda strives to provide accurate and up-to-date information on its website. However, we make no warranties about the completeness, reliability, or suitability of this information. Any reliance you place on such information is strictly at your own risk.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-zinc-900 mb-3">7. External Links</h2>
              <p className="text-zinc-600">
                Our website may contain links to external sites that are not operated by us. We have no control over the content and practices of these sites and cannot accept responsibility for their privacy policies or content.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-zinc-900 mb-3">8. Changes to Terms</h2>
              <p className="text-zinc-600">
                We reserve the right to modify these terms at any time. Changes will be effective immediately upon posting on this page. Your continued use of the website after any changes constitutes acceptance of the new terms.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-zinc-900 mb-3">9. Governing Law</h2>
              <p className="text-zinc-600">
                These terms are governed by and construed in accordance with the laws of India. Any disputes shall be subject to the exclusive jurisdiction of the courts in New Delhi, India.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-zinc-900 mb-3">10. Contact</h2>
              <p className="text-zinc-600">
                For questions about these Terms of Service, please contact us at:{' '}
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
