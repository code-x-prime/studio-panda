'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import ProgramCard from '@/components/program-card'

interface Program {
  id: string
  title: string
  slug: string
  category: string
  description: string
  features: string[]
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

export default function ProgramsSection() {
  const [programs, setPrograms] = useState<Program[]>([])
  const [loading, setLoading] = useState(true)
  const [hasData, setHasData] = useState(false)

  useEffect(() => {
    fetch('/api/public/programs?home=true')
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) {
          setPrograms(data)
          setHasData(true)
        } else {
          setHasData(false)
        }
      })
      .catch(() => setHasData(false))
      .finally(() => setLoading(false))
  }, [])

  if (loading) {
    return (
      <section id="programs" className="bg-white py-14 sm:py-16 ">
        <div className="mx-auto max-w-6xl px-6 sm:px-8 lg:px-12">
          <div className="mb-16 text-center max-w-3xl mx-auto">
            <Skeleton className="h-4 w-20 rounded-full mx-auto mb-4" />
            <Skeleton className="h-10 w-3/4 mx-auto mb-4" />
            <Skeleton className="h-5 w-1/2 mx-auto" />
          </div>
          <div className="grid gap-6 sm:gap-8 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 3 }).map((_, i) => <SkeletonCard key={i} />)}
          </div>
        </div>
      </section>
    )
  }

  if (!hasData || programs.length === 0) return null

  return (
    <section id="programs" className="bg-white py-14 sm:py-16 ">
      <div className="mx-auto max-w-6xl px-6 sm:px-8 lg:px-12">
        {/* Header */}
        <div className="mb-16 text-center max-w-3xl mx-auto">
          <p className="mb-4 text-xs sm:text-sm font-semibold tracking-wide text-primary uppercase">
            Programs
          </p>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-zinc-900 leading-tight [text-wrap:balance]">
            A program for every student, teacher, and parent
          </h2>
        </div>

        {/* Cards */}
        <div className="grid gap-6 sm:gap-8 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
          {programs.map((program) => (
            <ProgramCard key={program.id} program={program} />
          ))}
        </div>

        {/* View All */}
        <div className="mt-12 text-center">
          <Link href="/programs">
            <Button variant="outline" className="px-8 py-6 text-base font-semibold rounded-full border-zinc-200 hover:border-primary/40 hover:bg-primary/5 transition-all duration-300">
              View all programs
            </Button>
          </Link>
        </div>
      </div>
    </section>
  )
}
