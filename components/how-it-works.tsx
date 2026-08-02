'use client'

import { IconSchool, IconUsers, IconBookmark, IconMovie, IconTrophy } from '@tabler/icons-react'
import { motion } from 'framer-motion'

const steps = [
  {
    number: '01',
    icon: IconSchool,
    title: 'Partner with your school',
    desc: 'We begin with a free presentation for your principal and leadership team. We understand your school\u2019s vision and customize a program to fit.',
  },
  {
    number: '02',
    icon: IconUsers,
    title: 'Set up student creator club',
    desc: 'We establish a dedicated creative space \u2014 your school\u2019s own media hub. Equipped, organized, and ready for student-led projects.',
  },
  {
    number: '03',
    icon: IconBookmark,
    title: 'Weekly hands-on workshops',
    desc: 'Students attend bi-weekly industry-professional-led workshops in filmmaking, podcasting, photography, and digital storytelling.',
  },
  {
    number: '04',
    icon: IconMovie,
    title: 'Students create real projects',
    desc: 'Students don\u2019t watch; they make. Every project is published, promoted, and celebrated \u2014 building a genuine portfolio.',
  },
  {
    number: '05',
    icon: IconTrophy,
    title: 'Showcase student achievements',
    desc: 'Annual showcase events bring community, media, and parents together. Students see their work celebrated \u2014 building lasting confidence.',
  },
]

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="bg-background py-14 sm:py-16 ">
      <div className="mx-auto max-w-5xl px-6 sm:px-8 lg:px-12">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.5 }}
          className="mb-20 sm:mb-24"
        >
          <p className="mb-4 text-xs sm:text-sm font-semibold tracking-wide text-primary uppercase">
            How it works
          </p>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-foreground leading-tight max-w-2xl">
            Five steps to transform your school
          </h2>
        </motion.div>

        {/* Steps */}
        <div className="space-y-0">
          {steps.map((step, idx) => {
            const Icon = step.icon
            return (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-80px' }}
                transition={{ duration: 0.5, delay: idx * 0.08 }}
                className="group flex gap-8 sm:gap-12 py-10 sm:py-12 border-b border-border last:border-b-0"
              >
                {/* Number */}
                <div className="shrink-0">
                  <span className="text-2xl sm:text-3xl font-black text-primary/40 group-hover:text-primary transition-colors duration-300">
                    {step.number}
                  </span>
                </div>

                {/* Content */}
                <div className="flex-1">
                  <h3 className="text-lg sm:text-xl font-bold text-foreground mb-3 group-hover:text-primary transition-colors duration-300">
                    {step.title}
                  </h3>
                  <p className="text-sm sm:text-base text-muted-foreground leading-relaxed max-w-xl">
                    {step.desc}
                  </p>
                </div>
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
