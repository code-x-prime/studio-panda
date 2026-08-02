'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import NoticeCard from '@/components/notice-card'

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

export default function NoticesSection() {
  const [notices, setNotices] = useState<Notice[]>([])
  const [loading, setLoading] = useState(true)
  const [hasData, setHasData] = useState(false)

  useEffect(() => {
    fetch('/api/public/notices?home=true')
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) {
          setNotices(data)
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
      <section id="notices" className="bg-white py-14 sm:py-16 ">
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

  if (!hasData || notices.length === 0) return null

  return (
    <section id="notices" className="bg-white py-14 sm:py-16 ">
      <div className="mx-auto max-w-6xl px-6 sm:px-8 lg:px-12">
        {/* Header */}
        <div className="mb-16 text-center max-w-3xl mx-auto">
          <p className="mb-4 text-xs sm:text-sm font-semibold tracking-wide text-primary uppercase">
            Notices
          </p>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-zinc-900 leading-tight [text-wrap:balance]">
            Latest Updates & Announcements
          </h2>
          <p className="mt-4 text-zinc-500 text-sm sm:text-base max-w-lg mx-auto">
            Stay informed with the latest from Studio Panda
          </p>
        </div>

        {/* Cards */}
        <div className="grid gap-6 sm:gap-8 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
          {notices.map((notice) => (
            <NoticeCard key={notice.id} notice={notice} />
          ))}
        </div>

        {/* View All */}
        <div className="mt-12 text-center">
          <Link href="/notices">
            <Button variant="outline" className="px-8 py-6 text-base font-semibold rounded-full border-zinc-200 hover:border-primary/40 hover:bg-primary/5 transition-all duration-300">
              View all notices
            </Button>
          </Link>
        </div>
      </div>
    </section>
  )
}
