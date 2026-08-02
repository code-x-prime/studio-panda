'use client'

import { useEffect, useRef } from 'react'
import Link from 'next/link'
import {
  IconRocket,
  IconUsers,
  IconFileText,
  IconMoodSmile,
  IconSchool,
  IconTrendingUp,
  IconArrowRight,
} from '@tabler/icons-react'
import { Button } from '@/components/ui/button'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger)
}

const whyUsPoints = [
  {
    icon: IconRocket,
    title: 'Real-World Learning',
    desc: 'Every session produces something tangible — not hypothetical. Students film, publish, broadcast, and present real work to real audiences.',
    color: 'text-rose-400',
    bg: 'bg-rose-500/10',
  },
  {
    icon: IconUsers,
    title: 'Industry Mentors',
    desc: 'Our facilitators are working journalists, filmmakers, podcasters, and digital creators — not just trainers with slides.',
    color: 'text-amber-400',
    bg: 'bg-amber-500/10',
  },
  {
    icon: IconFileText,
    title: 'Portfolio-Based Education',
    desc: 'Students graduate with a professional portfolio ready for college applications, scholarship interviews, and job placements.',
    color: 'text-yellow-400',
    bg: 'bg-yellow-500/10',
  },
  {
    icon: IconMoodSmile,
    title: 'Measurable Confidence',
    desc: '94% of students report significantly increased confidence in public speaking within the first three months.',
    color: 'text-cyan-400',
    bg: 'bg-cyan-500/10',
  },
  {
    icon: IconSchool,
    title: 'Enhanced School Brand',
    desc: "Schools partnered with Studio Panda get featured in media, attract stronger student cohorts, and stand out in their city's education landscape.",
    color: 'text-primary',
    bg: 'bg-primary/10',
  },
  {
    icon: IconTrendingUp,
    title: 'Measurable Outcomes',
    desc: 'We track and report on skill development, project completion, and confidence growth — giving principals clear ROI data.',
    color: 'text-green-400',
    bg: 'bg-green-500/10',
  },
]

export default function WhyUs() {
  const sectionRef = useRef<HTMLDivElement>(null)
  const cardsContainerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (typeof window === 'undefined') return

    const matchMedia = window.matchMedia('(min-width: 1024px)')
    if (!matchMedia.matches) return

    const section = sectionRef.current
    const container = cardsContainerRef.current
    if (!section || !container) return

    const ctx = gsap.context(() => {
      const cards = Array.from(container.children) as HTMLElement[]

      cards.forEach((card, idx) => {
        gsap.fromTo(
          card,
          { y: 30, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.4,
            ease: 'power2.out',
            scrollTrigger: {
              trigger: card,
              start: 'top 90%',
              toggleActions: 'play none none none',
              once: true,
            },
            delay: idx * 0.05,
          }
        )
      })
    }, section)

    return () => ctx.revert()
  }, [])

  return (
    <section ref={sectionRef} id="why-us" className="bg-zinc-950 py-14 sm:py-16 ">
      <div className="mx-auto max-w-6xl px-6 sm:px-8 lg:px-12">
        {/* Desktop: 2 column */}
        <div className="hidden lg:grid lg:grid-cols-2 lg:gap-16">
          {/* Left - Sticky */}
          <div className="sticky top-28 self-start">
            <p className="mb-4 text-xs sm:text-sm font-semibold tracking-wide text-primary uppercase">
              Why schools choose us
            </p>
            <h2 className="mb-6 text-3xl sm:text-4xl lg:text-5xl font-black text-white leading-tight [text-wrap:balance]">
              Not just another extracurricular.
            </h2>
            <p className="mb-10 text-sm sm:text-base text-zinc-400 leading-relaxed max-w-md">
              Studio Panda is a structured, outcomes-driven, professionally delivered
              future-skills platform. Schools don&apos;t add us on — they upgrade with us.
            </p>
            <Link href="#final-cta">
              <Button className="bg-primary hover:bg-primary/90 text-black font-semibold rounded-full px-8 py-6 text-base gap-2">
                Book a Free Presentation
                <IconArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>

          {/* Right - Scrollable cards */}
          <div ref={cardsContainerRef} className="space-y-5 pb-24">
            {whyUsPoints.map((point, idx) => {
              const Icon = point.icon
              return (
                <div
                  key={idx}
                  className="group rounded-2xl border border-white/10 bg-white/[0.03] p-6 sm:p-7 transition-all duration-300 hover:border-white/20 hover:bg-white/[0.06]"
                >
                  <div className="flex gap-5">
                    <div className={`shrink-0 flex h-12 w-12 items-center justify-center rounded-xl ${point.bg} transition-transform duration-300 group-hover:scale-110`}>
                      <Icon className={`h-6 w-6 ${point.color}`} stroke={1.75} />
                    </div>
                    <div>
                      <h3 className="mb-2 text-lg font-bold text-white group-hover:text-primary transition-colors duration-300">
                        {point.title}
                      </h3>
                      <p className="text-sm text-zinc-400 leading-relaxed group-hover:text-zinc-300 transition-colors duration-300">
                        {point.desc}
                      </p>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Mobile */}
        <div className="lg:hidden">
          <div className="mb-12">
            <p className="mb-4 text-xs sm:text-sm font-semibold tracking-wide text-primary uppercase">
              Why schools choose us
            </p>
            <h2 className="mb-6 text-3xl sm:text-4xl font-black text-white leading-tight [text-wrap:balance]">
              Not just another extracurricular.
            </h2>
            <p className="mb-10 text-sm sm:text-base text-zinc-400 leading-relaxed max-w-md">
              Studio Panda is a structured, outcomes-driven, professionally delivered
              future-skills platform. Schools don&apos;t add us on — they upgrade with us.
            </p>
            <Link href="#final-cta">
              <Button className="bg-primary hover:bg-primary/90 text-black font-semibold rounded-full px-8 py-6 text-base gap-2">
                Book a Free Presentation
                <IconArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>

          <div className="space-y-4">
            {whyUsPoints.map((point, idx) => {
              const Icon = point.icon
              return (
                <div
                  key={idx}
                  className="group rounded-2xl border border-white/10 bg-white/[0.03] p-6 sm:p-7 transition-all duration-300 hover:border-white/20 hover:bg-white/[0.06]"
                >
                  <div className="flex gap-5">
                    <div className={`shrink-0 flex h-12 w-12 items-center justify-center rounded-xl ${point.bg} transition-transform duration-300 group-hover:scale-110`}>
                      <Icon className={`h-6 w-6 ${point.color}`} stroke={1.75} />
                    </div>
                    <div>
                      <h3 className="mb-2 text-lg font-bold text-white group-hover:text-primary transition-colors duration-300">
                        {point.title}
                      </h3>
                      <p className="text-sm text-zinc-400 leading-relaxed group-hover:text-zinc-300 transition-colors duration-300">
                        {point.desc}
                      </p>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </section>
  )
}
