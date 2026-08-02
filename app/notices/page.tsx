'use client'

import { useEffect, useState } from 'react'
import PageHero from '@/components/page-hero'
import NoticeCard from '@/components/notice-card'
import { Skeleton } from '@/components/ui/skeleton'
import { IconBell } from '@tabler/icons-react'

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

function SkeletonCard() {
  return (
    <div className="rounded-2xl border border-zinc-200 bg-white p-6 animate-pulse">
      <div className="flex items-center justify-between mb-4">
        <div className="flex gap-2">
          <Skeleton className="h-6 w-20 rounded-full" />
          <Skeleton className="h-6 w-14 rounded-full" />
        </div>
        <Skeleton className="h-4 w-24" />
      </div>
      <Skeleton className="h-6 w-3/4 mb-2" />
      <Skeleton className="h-4 w-full mb-2" />
      <Skeleton className="h-4 w-5/6 mb-5" />
      <Skeleton className="h-10 w-full rounded-xl" />
    </div>
  )
}

export default function NoticesPage() {
  const [notices, setNotices] = useState<Notice[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/public/notices')
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) setNotices(data)
      })
      .catch(() => { })
      .finally(() => setLoading(false))
  }, [])

  return (
    <main className="min-h-screen bg-white">
      <PageHero
        eyebrow="Updates & Announcements"
        title="Official Notices & Circulars"
        subtitle="Stay updated with the latest news, curriculum releases, and schedules."
      />

      <section className="py-14 sm:py-20">
        <div className="mx-auto max-w-6xl px-6 sm:px-8 lg:px-12">
          {/* Header */}
          <div className="text-center mb-14">
            <p className="mb-4 text-xs sm:text-sm font-semibold tracking-wide text-primary uppercase">
              Latest Updates
            </p>
            <h2 className="text-3xl sm:text-4xl font-black text-zinc-900 leading-tight [text-wrap:balance]">
              Notices & Announcements
            </h2>
            <p className="mt-4 text-zinc-500 text-sm sm:text-base max-w-lg mx-auto">
              Updated by the Studio Panda Admin Team
            </p>
          </div>

          {loading ? (
            <div className="grid gap-6 sm:gap-8 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
              {Array.from({ length: 6 }).map((_, i) => <SkeletonCard key={i} />)}
            </div>
          ) : notices.length === 0 ? (
            <div className="text-center py-20">
              <IconBell className="h-16 w-16 text-zinc-200 mx-auto mb-4" stroke={1.5} />
              <p className="text-zinc-500 text-lg font-medium">No notices posted yet.</p>
              <p className="text-zinc-400 text-sm mt-1">Check back soon!</p>
            </div>
          ) : (
            <div className="grid gap-6 sm:gap-8 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
              {notices.map((notice) => (
                <NoticeCard key={notice.id} notice={notice} />
              ))}
            </div>
          )}
        </div>
      </section>
    </main>
  )
}
