'use client'

import { useEffect, useState } from 'react'
import PageHero from '@/components/page-hero'
import CollaborationCard from '@/components/collaboration-card'
import { Skeleton } from '@/components/ui/skeleton'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { IconArrowRight, IconSchool } from '@tabler/icons-react'

interface Collaboration {
  id: string
  title: string
  partnerName: string
  partnerLogo?: string
  imageUrl?: string
  description: string
  websiteUrl?: string
  type?: string
}

function SkeletonCard() {
  return (
    <div className="rounded-2xl border border-zinc-200 bg-white overflow-hidden animate-pulse">
      <Skeleton className="h-48 w-full" />
      <div className="p-6">
        <Skeleton className="h-5 w-20 rounded-full mb-4" />
        <Skeleton className="h-6 w-3/4 mb-2" />
        <Skeleton className="h-4 w-full mb-2" />
        <Skeleton className="h-4 w-5/6 mb-5" />
        <Skeleton className="h-4 w-28 mt-4" />
      </div>
    </div>
  )
}

export default function CollaborationsPage() {
  const [collabs, setCollabs] = useState<Collaboration[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/public/collaborations')
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) setCollabs(data)
      })
      .catch(() => { })
      .finally(() => setLoading(false))
  }, [])

  return (
    <main className="min-h-screen bg-white">
      <PageHero
        eyebrow="School Network"
        title="Trusted by Premier Schools"
        subtitle="We collaborate with forward-thinking educational institutions to bring modern media labs and AI literacy to students."
      />

      <section className="py-14 sm:py-20">
        <div className="mx-auto max-w-6xl px-6 sm:px-8 lg:px-12">
          {/* Header */}
          <div className="text-center mb-14">
            <p className="mb-4 text-xs sm:text-sm font-semibold tracking-wide text-primary uppercase">
              Partnerships
            </p>
            <h2 className="text-3xl sm:text-4xl font-black text-zinc-900 leading-tight [text-wrap:balance]">
              Collaborations in Action
            </h2>
            <p className="mt-4 text-zinc-500 text-sm sm:text-base max-w-lg mx-auto">
              See how partner schools are empowering student creators
            </p>
          </div>

          {loading ? (
            <div className="grid gap-6 sm:gap-8 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
              {Array.from({ length: 6 }).map((_, i) => <SkeletonCard key={i} />)}
            </div>
          ) : collabs.length === 0 ? (
            <div className="text-center py-20">
              <IconSchool className="h-16 w-16 text-zinc-200 mx-auto mb-4" stroke={1.5} />
              <p className="text-zinc-500 text-lg font-medium">No collaborations listed yet.</p>
              <p className="text-zinc-400 text-sm mt-1">Check back soon!</p>
            </div>
          ) : (
            <div className="grid gap-6 sm:gap-8 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
              {collabs.map((collab) => (
                <CollaborationCard key={collab.id} collab={collab} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 sm:py-20 bg-zinc-50 border-t border-zinc-100">
        <div className="mx-auto max-w-4xl px-6 sm:px-8 lg:px-12 text-center">
          <h2 className="text-2xl sm:text-3xl font-black text-zinc-900 mb-4">
            Want Studio Panda in Your School?
          </h2>
          <p className="text-zinc-500 max-w-2xl mx-auto text-sm sm:text-base leading-relaxed mb-8">
            We handle everything — studio equipment, curriculum, instructor training, and student publication platforms.
          </p>
          <Link href="/contact">
            <Button className="font-bold gap-2 px-8 py-6 text-base rounded-full">
              Request Partner Proposal <IconArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </div>
      </section>
    </main>
  )
}
