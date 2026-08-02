'use client'

import { useEffect, useState } from 'react'
import PageHero from '@/components/page-hero'
import ProgramCard from '@/components/program-card'
import { Skeleton } from '@/components/ui/skeleton'
import { IconSchool } from '@tabler/icons-react'

interface Program {
  id: string
  title: string
  slug: string
  category: string
  duration: string
  targetAudience: string
  description: string
  features: string[]
  price: string
}

function SkeletonCard() {
  return (
    <div className="rounded-2xl border border-zinc-200 bg-white p-6 sm:p-7 animate-pulse">
      <Skeleton className="h-6 w-20 rounded-full mb-4" />
      <Skeleton className="h-6 w-3/4 mb-3" />
      <Skeleton className="h-4 w-full mb-2" />
      <Skeleton className="h-4 w-5/6 mb-5" />
      <div className="space-y-2.5 border-t border-zinc-100 pt-4">
        {[1, 2, 3].map(i => (
          <div key={i} className="flex items-center gap-2.5">
            <Skeleton className="h-5 w-5 rounded-full shrink-0" />
            <Skeleton className="h-4 w-28" />
          </div>
        ))}
      </div>
      <Skeleton className="h-10 w-full rounded-xl mt-5" />
    </div>
  )
}

export default function ProgramsPage() {
  const [programs, setPrograms] = useState<Program[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/public/programs')
      .then((res) => res.json())
      .then((data) => { if (Array.isArray(data)) setPrograms(data) })
      .catch(() => { })
      .finally(() => setLoading(false))
  }, [])

  return (
    <main className="min-h-screen bg-white">
      <PageHero
        eyebrow="Courses & Studio Clubs"
        title="Programs Built for Tomorrow's Creators"
        subtitle="Empower your students with structured, hands-on media programs tailored to school curriculums."
      />

      <section className="py-14 sm:py-20">
        <div className="mx-auto max-w-6xl px-6 sm:px-8 lg:px-12">
          {/* Header */}
          <div className="text-center mb-14">
            <p className="mb-4 text-xs sm:text-sm font-semibold tracking-wide text-primary uppercase">
              Our Curriculum
            </p>
            <h2 className="text-3xl sm:text-4xl font-black text-zinc-900 leading-tight [text-wrap:balance]">
              Designed for Every Grade & Interest
            </h2>
            <p className="mt-4 text-zinc-500 text-sm sm:text-base max-w-lg mx-auto">
              From beginner podcasting to advanced AI video creation
            </p>
          </div>

          {loading ? (
            <div className="grid gap-6 sm:gap-8 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
              {Array.from({ length: 6 }).map((_, i) => <SkeletonCard key={i} />)}
            </div>
          ) : programs.length === 0 ? (
            <div className="text-center py-20">
              <IconSchool className="h-16 w-16 text-zinc-200 mx-auto mb-4" stroke={1.5} />
              <p className="text-zinc-500 text-lg font-medium">No programs available yet.</p>
              <p className="text-zinc-400 text-sm mt-1">Check back soon!</p>
            </div>
          ) : (
            <div className="grid gap-6 sm:gap-8 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
              {programs.map((program) => (
                <ProgramCard key={program.id} program={program} />
              ))}
            </div>
          )}
        </div>
      </section>
    </main>
  )
}
