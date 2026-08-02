'use client'

import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { IconArrowRight } from '@tabler/icons-react'

interface CTABlockProps {
  variant?: 'dark' | 'yellow'
  eyebrow?: string
  title: string
  subtitle?: string
  primaryCTA?: { text: string; href: string }
  secondaryCTA?: { text: string; href: string }
}

export default function CTABlock({
  variant = 'yellow',
  eyebrow,
  title,
  subtitle,
  primaryCTA,
  secondaryCTA,
}: CTABlockProps) {
  const isDark = variant === 'dark'

  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-100px' }}
      transition={{ duration: 0.6 }}
      className={`py-20 px-6 rounded-2xl text-center ${isDark
        ? 'bg-muted/50 border border-border'
        : 'bg-gradient-to-r from-[#FFDD53] to-amber-400'
        }`}
    >
      {eyebrow && (
        <div className="inline-block mb-4">
          <span
            className={`uppercase tracking-wider text-sm font-semibold ${isDark ? 'text-primary' : 'text-black/80'
              }`}
          >
            {eyebrow}
          </span>
        </div>
      )}

      <h3 className={`text-4xl md:text-5xl font-bold mb-4 ${isDark ? 'text-foreground' : 'text-black'}`}>
        {title}
      </h3>

      {subtitle && (
        <p className={`text-lg mb-8 max-w-2xl mx-auto ${isDark ? 'text-muted-foreground' : 'text-black/80'}`}>
          {subtitle}
        </p>
      )}

      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        {primaryCTA && (
          <Button

            className={`px-8 py-6 text-lg font-semibold rounded-full ${isDark
              ? 'bg-primary hover:bg-primary/90 text-primary-foreground font-bold'
              : 'bg-black hover:bg-zinc-800 text-white font-bold'
              }`}
          >
            <a href={primaryCTA.href} className="flex items-center gap-2">
              {primaryCTA.text}
              <IconArrowRight className="h-5 w-5" stroke={2} />
            </a>
          </Button>
        )}
        {secondaryCTA && (
          <Button

            variant="outline"
            className={`px-8 py-6 text-lg font-semibold rounded-full ${isDark
              ? 'border-border text-foreground hover:bg-muted'
              : 'border-white/20 text-white hover:bg-white/10'
              }`}
          >
            <a href={secondaryCTA.href}>{secondaryCTA.text}</a>
          </Button>
        )}
      </div>
    </motion.section>
  )
}
