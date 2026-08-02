'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import PageHero from '@/components/page-hero'
import { Skeleton } from '@/components/ui/skeleton'
import { IconArrowLeft, IconExternalLink, IconBuildingStore } from '@tabler/icons-react'

interface Collaboration {
  id: string
  title: string
  partnerName: string
  imageUrl?: string
  description: string
  websiteUrl?: string
  type?: string
}

const typeColors: Record<string, string> = {
  School: 'bg-primary/10 text-primary',
  'Ed-Tech': 'bg-blue-50 text-blue-700',
  'Media House': 'bg-purple-50 text-purple-700',
  Corporate: 'bg-amber-50 text-amber-700',
  NGO: 'bg-emerald-50 text-emerald-700',
}

export default function CollaborationDetailPage() {
  const params = useParams()
  const [collab, setCollab] = useState<Collaboration | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/public/collaborations')
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          const found = data.find((c: Collaboration) => c.id === params.id)
          setCollab(found || null)
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [params.id])

  if (loading) {
    return (
      <main className="min-h-screen bg-white">
        <PageHero eyebrow="Collaboration" title="Loading..." subtitle="" />
        <div className="mx-auto max-w-4xl px-6 py-14">
          <Skeleton className="h-8 w-64 mb-4" />
          <Skeleton className="h-64 w-full rounded-2xl mb-6" />
          <Skeleton className="h-4 w-full mb-2" />
          <Skeleton className="h-4 w-5/6 mb-2" />
          <Skeleton className="h-4 w-4/6" />
        </div>
      </main>
    )
  }

  if (!collab) {
    return (
      <main className="min-h-screen bg-white">
        <PageHero eyebrow="Collaboration" title="Not Found" subtitle="This collaboration does not exist." />
        <div className="text-center py-10">
          <Link href="/collaborations" className="text-primary font-semibold hover:underline">
            ← Back to Collaborations
          </Link>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-white">
      <PageHero
        eyebrow={collab.type || 'Collaboration'}
        title={collab.partnerName}
        subtitle={collab.title && collab.title !== collab.partnerName ? collab.title : ''}
      />

      <section className="py-14 sm:py-20">
        <div className="mx-auto max-w-4xl px-6 sm:px-8 lg:px-12">
          {/* Back */}
          <Link href="/collaborations" className="inline-flex items-center gap-1.5 text-sm font-semibold text-zinc-500 hover:text-primary transition-colors mb-8">
            <IconArrowLeft className="h-4 w-4" /> All Collaborations
          </Link>

          {/* Image */}
          {collab.imageUrl && (
            <div className="rounded-2xl overflow-hidden mb-8 border border-zinc-200">
              <img src={collab.imageUrl} alt={collab.partnerName} className="w-full h-auto max-h-[400px] object-cover" />
            </div>
          )}

          {/* Meta */}
          <div className="flex items-center gap-3 mb-6">
            {collab.type && (
              <span className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-bold ${typeColors[collab.type] || 'bg-zinc-100 text-zinc-600'}`}>
                {collab.type}
              </span>
            )}
            <IconBuildingStore className="h-5 w-5 text-primary/40" />
          </div>

          {/* Description - render HTML */}
          <div
            className="prose prose-zinc max-w-none prose-headings:font-bold prose-h2:text-2xl prose-h3:text-xl prose-p:text-zinc-600 prose-p:leading-relaxed prose-a:text-primary prose-strong:text-zinc-900 prose-ul:list-disc prose-ol:list-decimal prose-li:text-zinc-600"
            dangerouslySetInnerHTML={{ __html: collab.description }}
          />

          {/* Website CTA */}
          {collab.websiteUrl && (
            <div className="mt-10 pt-8 border-t border-zinc-200">
              <a
                href={collab.websiteUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-primary text-black font-bold hover:bg-primary/90 transition-colors"
              >
                Visit Website <IconExternalLink className="h-4 w-4" />
              </a>
            </div>
          )}
        </div>
      </section>
    </main>
  )
}
