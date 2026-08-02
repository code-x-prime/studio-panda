'use client'

import { useEffect, useState, useCallback } from 'react'
import Link from 'next/link'
import { Skeleton } from '@/components/ui/skeleton'
import { IconX, IconChevronLeft, IconChevronRight } from '@tabler/icons-react'

interface GalleryItem {
  id: string
  title: string
  type: string
  url: string
  category: string
}

function SkeletonGrid() {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
      <div className="col-span-2 row-span-2 rounded-2xl bg-zinc-800 animate-pulse min-h-[280px] sm:min-h-[400px] lg:min-h-[500px]" />
      <div className="rounded-2xl bg-zinc-800 animate-pulse min-h-[180px] sm:min-h-[240px]" />
      <div className="rounded-2xl bg-zinc-800 animate-pulse min-h-[180px] sm:min-h-[240px]" />
      <div className="rounded-2xl bg-zinc-800 animate-pulse min-h-[180px] sm:min-h-[240px]" />
      <div className="rounded-2xl bg-zinc-800 animate-pulse min-h-[180px] sm:min-h-[240px]" />
      <div className="col-span-2 rounded-2xl bg-zinc-800 animate-pulse min-h-[200px] sm:min-h-[260px]" />
    </div>
  )
}

export default function Gallery() {
  const [items, setItems] = useState<GalleryItem[]>([])
  const [loading, setLoading] = useState(true)
  const [hasData, setHasData] = useState(false)
  const [lightboxIdx, setLightboxIdx] = useState<number | null>(null)

  useEffect(() => {
    fetch('/api/public/gallery?home=true')
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          const images = data.filter((i: GalleryItem) => i.type === 'IMAGE').slice(0, 7)
          if (images.length > 0) {
            setItems(images)
            setHasData(true)
          } else {
            setHasData(false)
          }
        }
      })
      .catch(() => setHasData(false))
      .finally(() => setLoading(false))
  }, [])

  const closeLightbox = useCallback(() => setLightboxIdx(null), [])
  const goNext = useCallback(() => {
    if (lightboxIdx === null) return
    setLightboxIdx((prev) => (prev! + 1) % items.length)
  }, [lightboxIdx, items.length])
  const goPrev = useCallback(() => {
    if (lightboxIdx === null) return
    setLightboxIdx((prev) => (prev! - 1 + items.length) % items.length)
  }, [lightboxIdx, items.length])

  useEffect(() => {
    if (lightboxIdx === null) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeLightbox()
      if (e.key === 'ArrowRight') goNext()
      if (e.key === 'ArrowLeft') goPrev()
    }
    window.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    return () => {
      window.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
    }
  }, [lightboxIdx, closeLightbox, goNext, goPrev])

  if (loading) {
    return (
      <section id="gallery" className="bg-zinc-950 py-14 sm:py-16 ">
        <div className="mx-auto max-w-6xl px-6 sm:px-8 lg:px-12">
          <div className="mb-10 sm:mb-12 text-center">
            <Skeleton className="h-4 w-20 mx-auto mb-4" />
            <Skeleton className="h-10 w-3/4 mx-auto" />
          </div>
          <SkeletonGrid />
        </div>
      </section>
    )
  }

  if (!hasData || items.length === 0) return null

  return (
    <section id="gallery" className="bg-zinc-950 py-14 sm:py-16 ">
      <div className="mx-auto max-w-6xl px-6 sm:px-8 lg:px-12">
        {/* Header */}
        <div className="mb-10 sm:mb-14 text-center">
          <p className="mb-4 text-xs sm:text-sm font-semibold tracking-wide text-primary uppercase">
            Gallery
          </p>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white leading-tight [text-wrap:balance]">
            Students in action
          </h2>
        </div>

        {/* Bento Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 auto-rows-[180px] sm:auto-rows-[220px] lg:auto-rows-[240px]">
          {items[0] && (
            <div
              onClick={() => setLightboxIdx(0)}
              className="col-span-2 row-span-2 group cursor-pointer rounded-2xl overflow-hidden relative"
            >
              <img src={items[0].url} alt=""
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" loading="lazy" />
            </div>
          )}
          {items.slice(1, 5).map((item, idx) => (
            <div key={item.id} onClick={() => setLightboxIdx(idx + 1)}
              className="group cursor-pointer rounded-2xl overflow-hidden relative">
              <img src={item.url} alt=""
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" loading="lazy" />
            </div>
          ))}
          {items.slice(5, 7).map((item, idx) => (
            <div key={item.id} onClick={() => setLightboxIdx(idx + 5)}
              className={`group cursor-pointer rounded-2xl overflow-hidden relative ${items.length <= 6 && idx === items.slice(5, 7).length - 1 ? 'col-span-2' : ''
                }`}>
              <img src={item.url} alt=""
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" loading="lazy" />
            </div>
          ))}
        </div>

        {/* View All */}
        <div className="mt-10 text-center">
          <Link href="/gallery">
            <button className="px-8 py-6 text-base font-semibold rounded-full border border-white/30 text-white hover:bg-white/10 hover:border-white/50 transition-all duration-300">
              View full gallery
            </button>
          </Link>
        </div>
      </div>

      {/* Lightbox */}
      {lightboxIdx !== null && (
        <div className="fixed inset-0 z-[999] flex items-center justify-center bg-black/95 backdrop-blur-sm" onClick={closeLightbox}>
          <button onClick={closeLightbox}
            className="absolute top-4 right-4 sm:top-6 sm:right-6 flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors z-10">
            <IconX className="h-5 w-5" stroke={2} />
          </button>
          {items.length > 1 && (
            <button onClick={(e) => { e.stopPropagation(); goPrev() }}
              className="absolute left-3 sm:left-6 top-1/2 -translate-y-1/2 flex h-14 w-14 items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/25 transition-colors z-10">
              <IconChevronLeft className="h-8 w-8" stroke={2} />
            </button>
          )}
          <div className="w-full max-w-5xl mx-auto px-4 sm:px-12" onClick={(e) => e.stopPropagation()}>
            <img src={items[lightboxIdx].url} alt=""
              className="w-full max-h-[80vh] object-contain rounded-xl" />
            <div className="mt-4 text-center">
              <p className="text-zinc-400 text-xs sm:text-sm">{lightboxIdx + 1} / {items.length}</p>
            </div>
          </div>
          {items.length > 1 && (
            <button onClick={(e) => { e.stopPropagation(); goNext() }}
              className="absolute right-3 sm:right-6 top-1/2 -translate-y-1/2 flex h-14 w-14 items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/25 transition-colors z-10">
              <IconChevronRight className="h-8 w-8" stroke={2} />
            </button>
          )}
        </div>
      )}
    </section>
  )
}
