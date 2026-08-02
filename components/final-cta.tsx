'use client'

import { useState } from 'react'
import { IconMail, IconCheck, IconLock, IconClock, IconTarget, IconLoader2, IconArrowRight, IconSparkles } from '@tabler/icons-react'
import { Button } from '@/components/ui/button'

export default function FinalCTA() {
  const [email, setEmail] = useState('')
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: 'Website Visitor',
          email,
          subject: 'School Presentation Request',
          message: `${email} is interested in booking a free school presentation.`,
        }),
      })
      if (res.ok) {
        setSubmitted(true)
        setEmail('')
        setTimeout(() => setSubmitted(false), 4000)
      }
    } catch {
    } finally {
      setLoading(false)
    }
  }

  const trustBadges = [
    { icon: IconLock, title: 'No commitment required', desc: '100% free consultation' },
    { icon: IconClock, title: 'Free 30-min presentation', desc: 'At a time that works for you' },
    { icon: IconTarget, title: 'Customized to your school', desc: 'We understand your unique needs' },
  ]

  return (
    <section id="final-cta" className="relative bg-primary py-12 sm:py-16 overflow-hidden border-t border-black/10">
      {/* Dynamic Animated Decorative Background Circles & Pattern */}
      <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-white/30 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-20 -right-20 w-80 h-80 bg-amber-300 rounded-full blur-2xl pointer-events-none opacity-80" />
      <div className="absolute top-10 left-10 w-64 h-64 bg-yellow-200 rounded-full blur-2xl pointer-events-none opacity-70" />

      {/* Modern Dots Texture Overlay */}
      <div className="absolute inset-0 bg-[radial-gradient(#000000_1px,transparent_1px)] [background-size:20px_20px] opacity-10 pointer-events-none" />

      <div className="relative mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 text-center">
        {/* Compact Badge */}
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-black/10 text-black text-[11px] font-bold tracking-wider uppercase mb-4 backdrop-blur-sm">
          <IconSparkles className="h-3.5 w-3.5" />
          <span>Transform Your School</span>
        </div>

        {/* Header - Compact Text */}
        <div className="mb-6 sm:mb-8">
          <h2 className="mb-3 text-2xl sm:text-3xl lg:text-4xl font-extrabold text-zinc-950 leading-tight tracking-tight [text-wrap:balance]">
            Ready to unlock your students&apos; <span className="relative inline-block text-zinc-900">full potential?</span>
          </h2>
          <p className="mx-auto max-w-lg text-xs sm:text-sm text-zinc-900/80 font-medium leading-relaxed">
            Book a free, no-obligation consultation with our team. We&apos;ll walk you through
            the program and answer all your questions.
          </p>
        </div>

        {/* Compact Form Container */}
        <div className="mx-auto max-w-xl mb-8 rounded-2xl bg-white/95 p-2 sm:p-2.5 shadow-xl border border-black/10 backdrop-blur-md">
          <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row items-center gap-2">
            <div className="relative w-full flex-1">
              <IconMail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400" stroke={1.75} />
              <input
                type="email"
                placeholder="Enter your school email address..."
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-xl border border-zinc-200 bg-zinc-50/80 py-2.5 pl-10 pr-3 text-xs sm:text-sm text-zinc-900 placeholder:text-zinc-400 focus:border-zinc-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-black/10 transition-all"
                required
              />
            </div>

            <Button
              type="submit"
              disabled={loading || submitted}
              className="w-full sm:w-auto shrink-0 bg-zinc-950 text-white hover:bg-zinc-800 font-bold text-xs sm:text-sm px-5 py-5 rounded-xl disabled:opacity-60 transition-all duration-300 shadow-sm flex items-center justify-center gap-1.5"
            >
              {loading ? (
                <IconLoader2 className="h-4 w-4 animate-spin" />
              ) : submitted ? (
                <>
                  <IconCheck className="h-4 w-4 text-emerald-400" stroke={2.5} />
                  <span>Request Sent!</span>
                </>
              ) : (
                <>
                  <span>Book Free Presentation</span>
                  <IconArrowRight className="h-3.5 w-3.5 stroke-[2.5]" />
                </>
              )}
            </Button>
          </form>
        </div>

        {/* Compact Trust Badges */}
        <div className="grid gap-3 grid-cols-1 sm:grid-cols-3">
          {trustBadges.map((badge, idx) => {
            const Icon = badge.icon
            return (
              <div key={idx} className="flex items-center gap-2.5 rounded-xl bg-black/5 border border-black/5 p-3 text-left backdrop-blur-sm hover:bg-black/10 transition-all group">
                <div className="p-2 rounded-lg bg-black/10 text-black group-hover:bg-zinc-950 group-hover:text-white transition-colors shrink-0">
                  <Icon className="h-4 w-4" stroke={1.75} />
                </div>
                <div>
                  <p className="text-xs font-bold text-zinc-950 leading-tight">{badge.title}</p>
                  <p className="text-[11px] text-zinc-800/75 mt-0.5 leading-snug">{badge.desc}</p>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}

