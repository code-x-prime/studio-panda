'use client'

import { motion } from 'framer-motion'

interface SectionHeadingProps {
  eyebrow?: string
  title: string
  subtitle?: string
  centered?: boolean
}

export default function SectionHeading({
  eyebrow,
  title,
  subtitle,
  centered = true,
}: SectionHeadingProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-100px' }}
      transition={{ duration: 0.6 }}
      className={centered ? 'text-center' : ''}
    >
      {eyebrow && (
        <div className="inline-block mb-4">
          <span className="uppercase tracking-wider text-sm font-semibold text-primary">
            {eyebrow}
          </span>
        </div>
      )}
      <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4 leading-tight">
        {title}
      </h2>
      {subtitle && (
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          {subtitle}
        </p>
      )}
    </motion.div>
  )
}
