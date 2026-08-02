'use client'

import {
  IconMessageCircle,
  IconUsers,
  IconBulb,
  IconBrain,
  IconUsersGroup,
  IconTarget,
  IconBook,
  IconDeviceLaptop,
  IconArrowsExchange,
  IconStar,
} from '@tabler/icons-react'
import { motion } from 'framer-motion'

const skills = [
  {
    icon: IconMessageCircle,
    title: 'Communication',
    desc: 'Speak clearly, listen actively, and engage any audience with confidence.',
    color: 'text-purple-400',
    bg: 'bg-purple-500/10',
  },
  {
    icon: IconUsers,
    title: 'Leadership',
    desc: 'Take initiative, inspire teams, and make decisions under pressure.',
    color: 'text-amber-400',
    bg: 'bg-amber-500/10',
  },
  {
    icon: IconBulb,
    title: 'Creativity',
    desc: 'Generate original ideas and approach every challenge with fresh thinking.',
    color: 'text-yellow-400',
    bg: 'bg-yellow-500/10',
  },
  {
    icon: IconBrain,
    title: 'Critical Thinking',
    desc: 'Analyze information, spot patterns, and reason through complex problems.',
    color: 'text-cyan-400',
    bg: 'bg-cyan-500/10',
  },
  {
    icon: IconUsersGroup,
    title: 'Collaboration',
    desc: 'Work effectively in diverse teams toward a shared, meaningful goal.',
    color: 'text-orange-400',
    bg: 'bg-orange-500/10',
  },
  {
    icon: IconTarget,
    title: 'Problem Solving',
    desc: 'Identify root causes and design practical, elegant solutions.',
    color: 'text-green-400',
    bg: 'bg-green-500/10',
  },
  {
    icon: IconBook,
    title: 'Storytelling',
    desc: 'Craft narratives that move people — in person, on screen, and online.',
    color: 'text-rose-400',
    bg: 'bg-rose-500/10',
  },
  {
    icon: IconDeviceLaptop,
    title: 'Digital Literacy',
    desc: 'Create purposeful digital content using modern tools and AI.',
    color: 'text-blue-400',
    bg: 'bg-blue-500/10',
  },
  {
    icon: IconArrowsExchange,
    title: 'Adaptability',
    desc: 'Thrive in changing environments and learn fast when the world shifts.',
    color: 'text-teal-400',
    bg: 'bg-teal-500/10',
  },
  {
    icon: IconStar,
    title: 'Confidence',
    desc: 'Show up fully — in interviews, presentations, boardrooms, and life.',
    color: 'text-primary',
    bg: 'bg-primary/10',
  },
]

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.06 } },
}

const cardVariants = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.45, ease: 'easeOut' as const } },
}

export default function SkillsSection() {
  return (
    <section id="skills" className="bg-zinc-950 py-14 sm:py-16 ">
      <div className="mx-auto max-w-7xl px-5 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.5 }}
          className="mb-16 sm:mb-20 text-center max-w-3xl mx-auto"
        >
          <p className="mb-4 text-xs sm:text-sm font-semibold tracking-wide text-primary uppercase">
            Future skills
          </p>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white mb-6 leading-tight [text-wrap:balance]">
            The 10 skills that define success in the AI era
          </h2>
          <p className="text-sm sm:text-base text-zinc-400 leading-relaxed max-w-2xl mx-auto">
            These aren&apos;t soft skills anymore. They&apos;re the hard skills of the 21st
            century — and every Studio Panda program builds them deliberately.
          </p>
        </motion.div>

        {/* Skills grid */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
          variants={containerVariants}
          className="grid gap-4 sm:gap-5 grid-cols-2 sm:grid-cols-3 lg:grid-cols-5"
        >
          {skills.map((skill, idx) => {
            const Icon = skill.icon
            return (
              <motion.div
                key={idx}
                variants={cardVariants}
                className="group rounded-2xl border border-white/10 bg-white/[0.03] p-5 sm:p-6 transition-all duration-300 hover:border-white/20 hover:bg-white/[0.06] hover:scale-[1.02] hover:shadow-lg hover:shadow-white/5"
              >
                <div className={`mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl ${skill.bg} transition-transform duration-300 group-hover:scale-110`}>
                  <Icon className={`h-6 w-6 ${skill.color}`} stroke={1.75} />
                </div>
                <h3 className="font-bold text-white text-sm sm:text-[15px] mb-2">{skill.title}</h3>
                <p className="text-xs sm:text-sm text-zinc-500 leading-relaxed group-hover:text-zinc-400 transition-colors duration-300">
                  {skill.desc}
                </p>
              </motion.div>
            )
          })}
        </motion.div>
      </div>
    </section>
  )
}
