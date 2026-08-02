'use client'

import Link from 'next/link'
import { IconBuildingStore, IconArrowRight, IconExternalLink } from '@tabler/icons-react'

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

const typeColors: Record<string, string> = {
  School: 'bg-primary/10 text-primary',
  'Ed-Tech': 'bg-blue-50 text-blue-700',
  'Media House': 'bg-purple-50 text-purple-700',
  Corporate: 'bg-amber-50 text-amber-700',
  NGO: 'bg-emerald-50 text-emerald-700',
}

function stripHtml(html: string): string {
  return html.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim()
}

export default function CollaborationCard({ collab }: { collab: Collaboration }) {
  return (
    <Link href={`/collaborations/${collab.id}`}>
      <div className="group h-full rounded-2xl border border-zinc-200 bg-white overflow-hidden transition-all duration-300 hover:border-primary/30 hover:shadow-xl hover:shadow-primary/5 hover:-translate-y-1 flex flex-col cursor-pointer">
        {/* Image */}
        {collab.imageUrl && (
          <div className="relative h-48 overflow-hidden bg-zinc-100">
            <img
              src={collab.imageUrl}
              alt={collab.partnerName}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
          </div>
        )}

        <div className="p-6 flex flex-col flex-1">
          {/* Top row: Type badge + icon */}
          <div className="flex items-center justify-between mb-4">
            {collab.type ? (
              <span className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-bold ${typeColors[collab.type] || 'bg-zinc-100 text-zinc-600'}`}>
                {collab.type}
              </span>
            ) : (
              <span className="inline-flex items-center rounded-full px-3 py-1 text-xs font-bold bg-zinc-100 text-zinc-600">
                Partner
              </span>
            )}
            <IconBuildingStore className="h-5 w-5 text-primary/40 group-hover:text-primary transition-colors" />
          </div>

          {/* Partner name */}
          <h3 className="text-lg font-bold text-zinc-900 mb-1 group-hover:text-primary transition-colors duration-300">
            {collab.partnerName}
          </h3>

          {/* Title */}
          {collab.title && collab.title !== collab.partnerName && (
            <p className="text-sm font-medium text-zinc-500 mb-2">{collab.title}</p>
          )}

          {/* Description - strip HTML */}
          <p className="text-sm text-zinc-500 leading-relaxed mb-5 line-clamp-3 flex-1">
            {stripHtml(collab.description)}
          </p>

          {/* CTA */}
          <div className="mt-auto border-t border-zinc-100 pt-4 flex items-center justify-between">
            {collab.websiteUrl ? (
              <span
                onClick={(e) => { e.preventDefault(); window.open(collab.websiteUrl, '_blank') }}
                className="flex items-center gap-1.5 text-sm font-semibold text-primary hover:underline"
              >
                Visit Website <IconExternalLink className="h-3.5 w-3.5" />
              </span>
            ) : (
              <span />
            )}
            <div className="flex items-center gap-1 text-zinc-400 group-hover:text-primary transition-colors">
              <span className="text-xs font-semibold">Learn more</span>
              <IconArrowRight className="h-3.5 w-3.5 group-hover:translate-x-1 transition-transform duration-300" />
            </div>
          </div>
        </div>
      </div>
    </Link>
  )
}
