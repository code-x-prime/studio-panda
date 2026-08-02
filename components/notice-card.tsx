'use client'

import Link from 'next/link'
import { IconPin, IconCalendar, IconFileText, IconDownload, IconArrowRight } from '@tabler/icons-react'

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
  NOTICE: 'bg-blue-50 text-blue-700',
  UPDATE: 'bg-emerald-50 text-emerald-700',
  ANNOUNCEMENT: 'bg-amber-50 text-amber-700',
}

export default function NoticeCard({ notice }: { notice: Notice }) {
  const catColor = categoryColors[notice.category] || 'bg-zinc-100 text-zinc-600'

  return (
    <Link href={`/notices/${notice.id}`} className="group block h-full">
      <div className="h-full rounded-2xl border border-zinc-200 bg-white p-6 transition-all duration-300 hover:border-primary/30 hover:shadow-xl hover:shadow-primary/5 hover:-translate-y-1 flex flex-col">
        {/* Top row: category + pinned + date */}
        <div className="flex items-center justify-between gap-2 mb-4">
          <div className="flex items-center gap-2">
            <span className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-bold ${catColor}`}>
              {notice.category}
            </span>
            {notice.isPinned && (
              <span className="inline-flex items-center gap-1 rounded-full bg-red-50 text-red-600 px-2.5 py-1 text-xs font-bold">
                <IconPin className="h-3 w-3" /> Pinned
              </span>
            )}
          </div>
          <span className="flex items-center gap-1 text-xs text-zinc-400 font-medium">
            <IconCalendar className="h-3.5 w-3.5" />
            {new Date(notice.publishDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
          </span>
        </div>

        {/* Title */}
        <h3 className="text-lg font-bold text-zinc-900 mb-2 group-hover:text-primary transition-colors duration-300 line-clamp-2">
          {notice.title}
        </h3>

        {/* Content preview */}
        <p className="text-sm text-zinc-500 leading-relaxed mb-5 line-clamp-3 flex-1"
          dangerouslySetInnerHTML={{ __html: notice.content.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim().slice(0, 200) + (notice.content.replace(/<[^>]*>/g, ' ').length > 200 ? '...' : '') }}
        />

        {/* PDF indicator */}
        {notice.pdfUrl && (
          <div className="flex items-center gap-2 mb-4 px-3 py-2 rounded-lg bg-red-50 border border-red-100">
            <IconFileText className="h-4 w-4 text-red-500 shrink-0" />
            <span className="text-xs font-medium text-red-600">PDF Attached</span>
            <IconDownload className="h-3.5 w-3.5 text-red-400 ml-auto" />
          </div>
        )}

        {/* CTA */}
        <div className="flex items-center justify-between p-3 rounded-xl bg-zinc-50 group-hover:bg-primary/5 border border-transparent group-hover:border-primary/20 transition-all duration-300 mt-auto">
          <span className="text-sm font-semibold text-zinc-700 group-hover:text-primary transition-colors">
            Read Details
          </span>
          <IconArrowRight className="h-4 w-4 text-zinc-400 group-hover:text-primary group-hover:translate-x-1 transition-all duration-300" />
        </div>
      </div>
    </Link>
  )
}
