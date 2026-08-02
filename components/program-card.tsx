'use client'

import Link from 'next/link'
import { IconCheck, IconArrowRight } from '@tabler/icons-react'

interface Program {
  id: string
  title: string
  slug: string
  category: string
  duration?: string
  targetAudience?: string
  description: string
  features: string[]
  price?: string
}

const categoryColors: Record<string, string> = {
  Flagship: 'bg-primary/10 text-primary',
  Popular: 'bg-zinc-800 text-zinc-100',
  New: 'bg-emerald-50 text-emerald-700',
  Trending: 'bg-amber-50 text-amber-700',
  'For Teachers': 'bg-blue-50 text-blue-700',
  'For Parents': 'bg-purple-50 text-purple-700',
}

function stripHtml(html: string): string {
  return html.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim()
}

export default function ProgramCard({ program }: { program: Program }) {
  return (
    <Link href={`/programs/${program.slug}`} className="group block h-full">
      <div className="h-full rounded-2xl border border-zinc-200 bg-white p-6 sm:p-7 transition-all duration-300 hover:border-primary/30 hover:shadow-xl hover:shadow-primary/5 hover:-translate-y-1 flex flex-col">
        {/* Category Badge */}
        <div className="mb-4">
          <span className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-bold ${categoryColors[program.category] || 'bg-zinc-100 text-zinc-600'}`}>
            {program.category}
          </span>
        </div>

        {/* Title */}
        <h3 className="text-lg sm:text-xl font-bold text-zinc-900 mb-2 group-hover:text-primary transition-colors duration-300">
          {program.title}
        </h3>

        {/* Description */}
        <p className="text-sm text-zinc-500 leading-relaxed mb-5 line-clamp-3 flex-1">
          {stripHtml(program.description)}
        </p>

        {/* Features */}
        {program.features?.length > 0 && (
          <div className="space-y-2 mb-5 border-t border-zinc-100 pt-4">
            {program.features.slice(0, 3).map((feat, idx) => (
              <div key={idx} className="flex items-center gap-2.5">
                <div className="flex h-5 w-5 items-center justify-center rounded-full bg-primary/10 shrink-0">
                  <IconCheck className="h-3 w-3 text-primary" stroke={3} />
                </div>
                <span className="text-sm text-zinc-600">{feat}</span>
              </div>
            ))}
          </div>
        )}

        {/* CTA */}
        <div className="flex items-center justify-between p-3 rounded-xl bg-zinc-50 group-hover:bg-primary/5 border border-transparent group-hover:border-primary/20 transition-all duration-300 mt-auto">
          <span className="text-sm font-semibold text-zinc-700 group-hover:text-primary transition-colors">
            View Details
          </span>
          <IconArrowRight className="h-4 w-4 text-zinc-400 group-hover:text-primary group-hover:translate-x-1 transition-all duration-300" />
        </div>
      </div>
    </Link>
  )
}
