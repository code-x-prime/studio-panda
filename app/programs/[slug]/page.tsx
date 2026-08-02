'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import PageHero from '@/components/page-hero'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { IconCheck, IconArrowLeft, IconClock, IconSchool, IconLoader2 } from '@tabler/icons-react'

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

function DetailSkeleton() {
  return (
    <div className="py-14 sm:py-20">
      <div className="mx-auto max-w-4xl px-6 sm:px-8 lg:px-12 space-y-8">
        <Skeleton className="h-6 w-32" />
        <Skeleton className="h-12 w-3/4" />
        <Skeleton className="h-5 w-full" />
        <Skeleton className="h-5 w-5/6" />
        <div className="grid grid-cols-2 gap-4">
          <Skeleton className="h-20 rounded-xl" />
          <Skeleton className="h-20 rounded-xl" />
        </div>
        <div className="space-y-3">
          {[1, 2, 3, 4].map(i => (
            <div key={i} className="flex items-center gap-3">
              <Skeleton className="h-5 w-5 rounded-full shrink-0" />
              <Skeleton className="h-4 w-48" />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default function ProgramDetailPage() {
  const params = useParams()
  const slug = params?.slug as string
  const [program, setProgram] = useState<Program | null>(null)
  const [loading, setLoading] = useState(true)
  const [notFound, setNotFound] = useState(false)

  useEffect(() => {
    if (!slug) return
    fetch('/api/public/programs')
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          const found = data.find((p: Program) => p.slug === slug)
          if (found) setProgram(found)
          else setNotFound(true)
        }
      })
      .catch(() => setNotFound(true))
      .finally(() => setLoading(false))
  }, [slug])

  if (loading) {
    return (
      <main className="min-h-screen bg-white">
        <PageHero eyebrow="Program" title="Loading..." />
        <DetailSkeleton />
      </main>
    )
  }

  if (notFound || !program) {
    return (
      <main className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <IconSchool className="h-20 w-20 text-zinc-200 mx-auto mb-6" stroke={1.5} />
          <h1 className="text-3xl font-black text-zinc-900 mb-3">Program Not Found</h1>
          <p className="text-zinc-500 mb-8">The program you&apos;re looking for doesn&apos;t exist.</p>
          <Link href="/programs">
            <Button className="bg-primary text-black font-semibold rounded-full">
              <IconArrowLeft className="h-4 w-4 mr-2" /> Back to Programs
            </Button>
          </Link>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-white">
      <PageHero
        eyebrow={program.category}
        title={program.title}
        subtitle=""
      />

      <section className="py-14 sm:py-20">
        <div className="mx-auto max-w-4xl px-6 sm:px-8 lg:px-12">
          {/* Back */}
          <Link href="/programs" className="inline-flex items-center gap-2 text-sm text-zinc-500 hover:text-primary mb-8 transition-colors">
            <IconArrowLeft className="h-4 w-4" /> All Programs
          </Link>

          {/* Info Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-12">
            <div className="p-5 rounded-2xl bg-zinc-50 border border-zinc-200">
              <IconClock className="h-5 w-5 text-primary mb-2" />
              <p className="text-xs text-zinc-400 font-medium mb-1">Duration</p>
              <p className="font-bold text-zinc-900">{program.duration}</p>
            </div>
            <div className="p-5 rounded-2xl bg-zinc-50 border border-zinc-200">
              <IconSchool className="h-5 w-5 text-primary mb-2" />
              <p className="text-xs text-zinc-400 font-medium mb-1">Audience</p>
              <p className="font-bold text-zinc-900 text-sm">{program.targetAudience}</p>
            </div>
            <div className="p-5 rounded-2xl bg-zinc-50 border border-zinc-200 col-span-2 sm:col-span-1">
              <p className="text-xs text-zinc-400 font-medium mb-1">Price</p>
              <p className="font-bold text-primary">{program.price}</p>
            </div>
          </div>

          {/* Features */}
          {program.features?.length > 0 && (
            <div className="mb-12">
              <h2 className="text-2xl font-bold text-zinc-900 mb-6">What You&apos;ll Learn</h2>
              <div className="grid sm:grid-cols-2 gap-3">
                {program.features.map((feat, idx) => (
                  <div key={idx} className="flex items-center gap-3 p-4 rounded-xl bg-zinc-50 border border-zinc-100">
                    <div className="flex h-6 w-6 items-center justify-center rounded-full bg-primary/10 shrink-0">
                      <IconCheck className="h-3.5 w-3.5 text-primary" stroke={3} />
                    </div>
                    <span className="text-sm text-zinc-700 font-medium">{feat}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Description - render HTML */}
          <div className="mb-12">
            <h2 className="text-2xl font-bold text-zinc-900 mb-6">About This Program</h2>
            <div
              className="prose prose-zinc max-w-none prose-headings:font-bold prose-h2:text-2xl prose-h3:text-xl prose-p:text-zinc-600 prose-p:leading-relaxed prose-a:text-primary prose-strong:text-zinc-900 prose-ul:list-disc prose-ol:list-decimal prose-li:text-zinc-600"
              dangerouslySetInnerHTML={{ __html: program.description }}
            />
          </div>

          {/* CTA */}
          <Card className="bg-primary border-0">
            <CardContent className="p-8 sm:p-10 text-center">
              <h3 className="text-2xl font-bold text-black mb-3">Interested in this program?</h3>
              <p className="text-black/60 mb-6 max-w-md mx-auto">
                Book a free presentation and we&apos;ll walk you through everything.
              </p>
              <Link href="/#final-cta">
                <Button className="bg-zinc-900 text-white hover:bg-zinc-800 font-semibold px-8 py-6 rounded-full text-base">
                  Book Free Presentation
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </section>
    </main>
  )
}
