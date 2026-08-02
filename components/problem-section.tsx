'use client'

import Link from 'next/link'
import {
  IconMicrophone2,
  IconUsers,
  IconBulb,
  IconUsersGroup,
  IconDeviceMobile,
  IconFolderOff,
  IconPhoto,
  IconCamera,
  IconMicrophone,
  IconVideo,
  IconBook,
  IconNews,
  IconArrowRight,
} from '@tabler/icons-react'
import { motion } from 'framer-motion'
import Image from 'next/image'

const problemCards = [
  {
    icon: IconMicrophone2,
    title: 'Fear of speaking',
    desc: 'Students freeze at the thought of presenting in front of peers, parents, or interviewers.',
  },
  {
    icon: IconUsers,
    title: 'Weak communication',
    desc: 'Despite strong academics, most students cannot articulate ideas clearly or persuasively.',
  },
  {
    icon: IconBulb,
    title: 'No creative outlet',
    desc: 'Schools focus on marks — leaving students’ natural creativity untapped and undeveloped.',
  },
  {
    icon: IconUsersGroup,
    title: 'Poor collaboration',
    desc: 'Teamwork, leadership, and empathy aren’t taught — they’re assumed to develop on their own.',
  },
  {
    icon: IconDeviceMobile,
    title: 'Digital blind spots',
    desc: 'Students consume social media but lack the skills to create professional, purposeful content.',
  },
  {
    icon: IconFolderOff,
    title: 'Missing portfolios',
    desc: 'College admissions and jobs now require portfolios — but students graduate with none.',
  },
]

const creativeTools = [
  { icon: IconVideo, label: 'Filmmaking' },
  { icon: IconMicrophone, label: 'Podcasting' },
  { icon: IconCamera, label: 'Photography' },
  { icon: IconNews, label: 'School News' },
  { icon: IconUsers, label: 'Interviews' },
  { icon: IconBulb, label: 'AI Content' },
  { icon: IconDeviceMobile, label: 'Mobile Journalism' },
  { icon: IconBook, label: 'Storytelling' },
]

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.08 } },
}

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' as const } },
}

export default function ProblemSection() {
  return (
    <section id="problem" className="bg-background py-14 sm:py-20">
      <div className="mx-auto max-w-7xl px-5 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.5 }}
          className="mb-12 sm:mb-16 max-w-2xl"
        >
          <p className="mb-3 text-xs sm:text-sm font-semibold tracking-wide text-primary uppercase">
            The problem
          </p>
          <h2 className="text-2xl sm:text-4xl lg:text-5xl font-black text-foreground mb-4 leading-tight [text-wrap:balance]">
            Great marks. But are they ready for the real world?
          </h2>
          <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
            India produces millions of academically brilliant students every year — yet most
            struggle when it comes to the skills that actually matter in careers, college, and life.
          </p>
        </motion.div>

        {/* Problem Cards Grid — one consistent color, no rainbow icon backgrounds */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
          variants={containerVariants}
          className="mb-16 sm:mb-20 grid gap-4 sm:gap-5 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3"
        >
          {problemCards.map((card, idx) => {
            const Icon = card.icon
            return (
              <motion.div
                key={idx}
                variants={cardVariants}
                className="group rounded-xl border border-border bg-card p-5 sm:p-6 transition-colors duration-300 hover:border-primary/40"
              >
                <div className="mb-4 h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Icon className="h-5 w-5 text-primary" stroke={1.75} />
                </div>
                <h3 className="mb-1.5 font-bold text-foreground text-[15px]">{card.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{card.desc}</p>
              </motion.div>
            )
          })}
        </motion.div>

        {/* Learning by creating block */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.5 }}
          className="rounded-2xl bg-zinc-950 p-8 sm:p-12 lg:p-16"
        >
          <div className="grid gap-10 lg:grid-cols-2 lg:gap-16 items-center">
            {/* Left */}
            <div>
              <h3 className="mb-6 text-3xl sm:text-4xl lg:text-5xl font-black text-white leading-tight">
                Learning by creating.
                <br />
                Not just listening.
              </h3>
              <p className="mb-8 text-sm sm:text-base text-zinc-400 leading-relaxed max-w-md">
                Students at Studio Panda don&apos;t sit and watch — they produce, direct, interview,
                edit, and broadcast. Every project is real. Every skill is usable. Every student
                walks away with work they&apos;re proud of.
              </p>
              <div className="flex flex-wrap gap-2.5 mb-8">
                {creativeTools.map((tool, idx) => {
                  const Icon = tool.icon
                  return (
                    <div
                      key={idx}
                      className="flex items-center gap-1.5 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs sm:text-sm text-zinc-300"
                    >
                      <Icon className="h-3.5 w-3.5 text-primary" stroke={1.75} />
                      {tool.label}
                    </div>
                  )
                })}
              </div>
              <Link
                href="/programs"
                className="inline-flex items-center gap-2 text-sm font-semibold text-primary hover:text-primary/80 transition-colors"
              >
                See all programs
                <IconArrowRight className="h-4 w-4" />
              </Link>
            </div>

            {/* Right — real photos + one stat card, not color-cycling gradient tiles */}
            <div className="grid grid-cols-2 gap-3 sm:gap-4">
              <div className="col-span-1 rounded-xl overflow-hidden relative aspect-[3/4]">
                <Image
                  src="/gallery/students-filming.png"
                  alt="Students filming a project"
                  fill
                  className="object-cover"
                />
              </div>
              <div className="col-span-1 flex flex-col gap-3 sm:gap-4">
                <div className="rounded-xl overflow-hidden relative aspect-square">
                  <Image
                    src="/gallery/student-presenting.png"
                    alt="Student presenting on stage"
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="rounded-xl bg-primary flex-1 flex flex-col items-center justify-center py-4">
                  <div className="text-3xl sm:text-4xl font-black text-black">10+</div>
                  <div className="text-[11px] sm:text-xs text-black/70 font-semibold mt-1">
                    Media skills taught
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}