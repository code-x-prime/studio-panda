'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import PageHero from '@/components/page-hero'
import { Skeleton } from '@/components/ui/skeleton'
import { IconArrowLeft, IconPin, IconCalendar, IconFileText, IconDownload } from '@tabler/icons-react'

interface Notice {
  id: string
  title: string
  category: string
  content: string
  isPinned: boolean
  pdfUrl?: string
  imageUrl?: string
  publishDate: string
}

const categoryColors: Record<string, string> = {
  NOTICE: 'bg-blue-50 text-blue-700 border-blue-200',
  EVENT: 'bg-purple-50 text-purple-700 border-purple-200',
  ACHIEVEMENT: 'bg-amber-50 text-amber-700 border-amber-200',
  ANNOUNCEMENT: 'bg-emerald-50 text-emerald-700 border-emerald-200',
}

export default function NoticeDetailPage() {
  const params = useParams()
  const [notice, setNotice] = useState<Notice | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/public/notices')
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          const found = data.find((n: Notice) => n.id === params.id)
          setNotice(found || null)
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [params.id])

  if (loading) {
    return (
      <main className="min-h-screen bg-white">
        <PageHero eyebrow="Notice" title="Loading..." subtitle="" />
        <div className="mx-auto max-w-4xl px-6 py-14">
          <Skeleton className="h-8 w-64 mb-4" />
          <Skeleton className="h-6 w-40 mb-6" />
          <Skeleton className="h-64 w-full rounded-2xl mb-6" />
          <Skeleton className="h-4 w-full mb-2" />
          <Skeleton className="h-4 w-5/6 mb-2" />
          <Skeleton className="h-4 w-4/6" />
        </div>
      </main>
    )
  }

  if (!notice) {
    return (
      <main className="min-h-screen bg-white">
        <PageHero eyebrow="Notice" title="Not Found" subtitle="This notice does not exist." />
        <div className="text-center py-10">
          <Link href="/notices" className="text-primary font-semibold hover:underline">
            ← Back to Notices
          </Link>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-white">
      <PageHero
        eyebrow={notice.category}
        title={notice.title}
        subtitle=""
      />

      <section className="py-14 sm:py-20">
        <div className="mx-auto max-w-4xl px-6 sm:px-8 lg:px-12">
          {/* Back */}
          <Link href="/notices" className="inline-flex items-center gap-1.5 text-sm font-semibold text-zinc-500 hover:text-primary transition-colors mb-8">
            <IconArrowLeft className="h-4 w-4" /> All Notices
          </Link>

          {/* Meta */}
          <div className="flex items-center gap-4 mb-6 flex-wrap">
            {notice.isPinned && (
              <span className="inline-flex items-center gap-1 text-xs font-bold text-amber-600">
                <IconPin className="h-3.5 w-3.5" /> Pinned
              </span>
            )}
            <span className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-bold border ${categoryColors[notice.category] || 'bg-zinc-100 text-zinc-600 border-zinc-200'}`}>
              {notice.category}
            </span>
            <span className="inline-flex items-center gap-1 text-xs text-zinc-400">
              <IconCalendar className="h-3.5 w-3.5" />
              {new Date(notice.publishDate).toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' })}
            </span>
          </div>

          {/* Image */}
          {notice.imageUrl && (
            <div className="rounded-2xl overflow-hidden mb-8 border border-zinc-200">
              <img src={notice.imageUrl} alt={notice.title} className="w-full h-auto max-h-[400px] object-cover" />
            </div>
          )}

          {/* Content - render HTML */}
          <div
            className="prose prose-zinc max-w-none prose-headings:font-bold prose-h2:text-2xl prose-h3:text-xl prose-p:text-zinc-600 prose-p:leading-relaxed prose-a:text-primary prose-strong:text-zinc-900 prose-ul:list-disc prose-ol:list-decimal prose-li:text-zinc-600"
            dangerouslySetInnerHTML={{ __html: notice.content }}
          />

          {/* PDF */}
          {notice.pdfUrl && (
            <div className="mt-10 pt-8 border-t border-zinc-200">
              <a
                href={notice.pdfUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-primary text-black font-bold hover:bg-primary/90 transition-colors"
              >
                <IconFileText className="h-4 w-4" /> View PDF <IconDownload className="h-4 w-4" />
              </a>
            </div>
          )}
        </div>
      </section>
    </main>
  )
}
