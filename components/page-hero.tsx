'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { IconChevronRight, IconArrowRight } from '@tabler/icons-react'
import { Button } from '@/components/ui/button'

interface Crumb {
  label: string
  href?: string
}

interface PageHeroProps {
  eyebrow?: string
  title: string
  subtitle?: string
  ctaText?: string
  ctaHref?: string
  breadcrumbs?: Crumb[]
}

export default function PageHero({
  eyebrow,
  title,
  subtitle,
  ctaText,
  ctaHref,
  breadcrumbs,
}: PageHeroProps) {
  return (
    <section className="relative overflow-hidden bg-zinc-950 pt-28 pb-20 sm:pt-36 sm:pb-28">
      {/* Faint diagonal line texture — subtle, not a giveaway grid */}
      <div
        className="absolute inset-0 opacity-[0.04] pointer-events-none"
        style={{
          backgroundImage: 'repeating-linear-gradient(115deg, #fff 0px, #fff 1px, transparent 1px, transparent 64px)',
        }}
      />

      {/* Single off-center glow, kept low and away from text */}
      <div className="absolute -top-24 right-[-8%] w-[420px] h-[420px] bg-primary/20 rounded-full blur-[130px] pointer-events-none" />

      <div className="relative z-10 mx-auto max-w-5xl px-5 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        {breadcrumbs && breadcrumbs.length > 0 && (
          <motion.nav
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            aria-label="Breadcrumb"
            className="mb-8 flex items-center flex-wrap gap-1.5 text-xs sm:text-sm text-zinc-500"
          >
            {breadcrumbs.map((crumb, idx) => {
              const isLast = idx === breadcrumbs.length - 1
              return (
                <span key={idx} className="flex items-center gap-1.5">
                  {crumb.href && !isLast ? (
                    <Link href={crumb.href} className="hover:text-zinc-300 transition-colors">
                      {crumb.label}
                    </Link>
                  ) : (
                    <span className={isLast ? 'text-zinc-300 font-medium' : ''}>{crumb.label}</span>
                  )}
                  {!isLast && <IconChevronRight className="h-3.5 w-3.5 text-zinc-700" stroke={2} />}
                </span>
              )
            })}
          </motion.nav>
        )}

        <div className="max-w-2xl">
          {eyebrow && (
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="mb-5 inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-3.5 py-1.5"
            >
              <span className="h-1.5 w-1.5 rounded-full bg-primary shrink-0" />
              <span className="text-[11px] sm:text-xs font-semibold tracking-wide text-primary uppercase">
                {eyebrow}
              </span>
            </motion.div>
          )}

          <motion.h1
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.08, duration: 0.6 }}
            className="text-[clamp(1.9rem,5.5vw,3.75rem)] leading-[1.12] font-black text-white [text-wrap:balance]"
          >
            {title}
          </motion.h1>

          {subtitle && (
            <motion.p
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.16, duration: 0.55 }}
              className="mt-5 text-sm sm:text-base text-zinc-400 leading-relaxed max-w-xl"
            >
              {subtitle}
            </motion.p>
          )}

          {ctaText && ctaHref && (
            <motion.div
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.24, duration: 0.55 }}
              className="mt-8"
            >
              <Link href={ctaHref}>
                <Button className="bg-primary hover:bg-primary/90 text-black font-semibold px-6 py-5 sm:py-6 rounded-full gap-2">
                  {ctaText} <IconArrowRight className="h-4 w-4" />
                </Button>
              </Link>
            </motion.div>
          )}
        </div>
      </div>

      {/* Angled divider into the next section — replaces the flat hard edge */}
      <div
        className="absolute bottom-0 left-0 right-0 h-10 sm:h-14 bg-background"
        style={{ clipPath: 'polygon(0 100%, 100% 40%, 100% 100%)' }}
      />
    </section>
  )
}