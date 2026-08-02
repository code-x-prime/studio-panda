'use client'

import { useEffect, useState, useCallback } from 'react'
import PageHero from '@/components/page-hero'
import { IconPhoto, IconFileText, IconExternalLink, IconX, IconChevronLeft, IconChevronRight } from '@tabler/icons-react'

interface GalleryItem {
  id: string
  title: string
  type: string
  url: string
  category: string
  mimeType: string | null
}

function SkeletonGrid() {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
      <div className="col-span-2 rounded-2xl bg-zinc-200 animate-pulse min-h-[280px] sm:min-h-[360px]" />
      <div className="rounded-2xl bg-zinc-200 animate-pulse min-h-[180px] sm:min-h-[360px]" />
      <div className="rounded-2xl bg-zinc-200 animate-pulse min-h-[180px] sm:min-h-[260px]" />
      <div className="rounded-2xl bg-zinc-200 animate-pulse min-h-[180px] sm:min-h-[260px]" />
      <div className="rounded-2xl bg-zinc-200 animate-pulse min-h-[180px] sm:min-h-[260px]" />
      <div className="col-span-2 lg:col-span-1 rounded-2xl bg-zinc-200 animate-pulse min-h-[180px] sm:min-h-[260px]" />
    </div>
  )
}

export default function GalleryPage() {
  const [items, setItems] = useState<GalleryItem[]>([])
  const [loading, setLoading] = useState(true)
  const [lightboxIdx, setLightboxIdx] = useState<number | null>(null)

  useEffect(() => {
    fetch('/api/public/gallery')
      .then((res) => res.json())
      .then((data) => { if (Array.isArray(data)) setItems(data) })
      .catch(() => { })
      .finally(() => setLoading(false))
  }, [])

  const images = items.filter((i) => i.type === 'IMAGE')
  const documents = items.filter((i) => i.type !== 'IMAGE')

  const closeLightbox = useCallback(() => setLightboxIdx(null), [])
  const goNext = useCallback(() => {
    if (lightboxIdx === null) return
    setLightboxIdx((prev) => (prev! + 1) % images.length)
  }, [lightboxIdx, images.length])
  const goPrev = useCallback(() => {
    if (lightboxIdx === null) return
    setLightboxIdx((prev) => (prev! - 1 + images.length) % images.length)
  }, [lightboxIdx, images.length])

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
      <main className="min-h-screen bg-zinc-50 text-zinc-900">
        <PageHero eyebrow="Gallery" title="Students in action" subtitle="Explore photos of students in action, workshop highlights, and events." />
        <div className="py-14 sm:py-20">
          <div className="mx-auto max-w-6xl px-6 sm:px-8 lg:px-12"><SkeletonGrid /></div>
        </div>
      </main>
    )
  }

  if (images.length === 0 && documents.length === 0) {
    return (
      <main className="min-h-screen bg-zinc-50 text-zinc-900">
        <PageHero eyebrow="Gallery" title="Students in action" subtitle="Explore photos of students in action, workshop highlights, and events." />
        <div className="py-20">
          <div className="mx-auto max-w-6xl px-6 sm:px-8 lg:px-12 text-center">
            <IconPhoto className="h-16 w-16 text-zinc-200 mx-auto mb-4" stroke={1.5} />
            <p className="text-zinc-500 text-lg font-medium">No media uploaded yet.</p>
            <p className="text-zinc-400 text-sm mt-1">Check back soon!</p>
          </div>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-zinc-50 text-zinc-900">
      <PageHero eyebrow="Gallery" title="Students in action" subtitle="Explore photos of students in action, workshop highlights, and events." />
      <div className="py-14 sm:py-20">
        <div className="mx-auto max-w-6xl px-6 sm:px-8 lg:px-12">

          {/* Images Bento Grid */}
          {images.length > 0 && (
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 auto-rows-[200px] sm:auto-rows-[260px] lg:auto-rows-[280px]">
              {images[0] && (
                <div onClick={() => setLightboxIdx(0)}
                  className="col-span-2 group cursor-pointer rounded-2xl overflow-hidden relative">
                  <img src={images[0].url} alt=""
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" loading="lazy" />
                </div>
              )}
              {images.slice(1).map((item, idx) => (
                <div key={item.id} onClick={() => setLightboxIdx(idx + 1)}
                  className={`group cursor-pointer rounded-2xl overflow-hidden relative ${idx === images.length - 2 && images.length % 3 === 1 ? 'col-span-2 lg:col-span-1' : ''
                    }`}>
                  <img src={item.url} alt=""
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" loading="lazy" />
                </div>
              ))}
            </div>
          )}

          {/* Documents */}
          {documents.length > 0 && (
            <div className="mt-16 sm:mt-20">
              <h2 className="text-xl sm:text-2xl font-bold text-zinc-900 mb-6">Documents</h2>
              <div className="space-y-3">
                {documents.map((item) => (
                  <div key={item.id}
                    className="bg-white border border-zinc-200 rounded-xl p-4 sm:p-5 flex items-center gap-4 hover:shadow-md hover:border-zinc-300 transition-all duration-300">
                    <div className="p-2.5 rounded-xl bg-primary/10 shrink-0">
                      <IconFileText className="h-5 w-5 text-primary" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-zinc-900 truncate">{item.title}</p>
                      <p className="text-xs text-zinc-500">{item.category}</p>
                    </div>
                    <a href={item.url} target="_blank" rel="noopener noreferrer"
                      className="text-primary text-xs font-bold hover:underline flex items-center gap-1 shrink-0">
                      View <IconExternalLink className="h-3.5 w-3.5" />
                    </a>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Lightbox */}
      {lightboxIdx !== null && (
        <div className="fixed inset-0 z-[999] flex items-center justify-center bg-black/95 backdrop-blur-sm" onClick={closeLightbox}>
          <button onClick={closeLightbox}
            className="absolute top-4 right-4 sm:top-6 sm:right-6 flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors z-10">
            <IconX className="h-5 w-5" stroke={2} />
          </button>
          {images.length > 1 && (
            <button onClick={(e) => { e.stopPropagation(); goPrev() }}
              className="absolute left-3 sm:left-6 top-1/2 -translate-y-1/2 flex h-14 w-14 items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/25 transition-colors z-10">
              <IconChevronLeft className="h-8 w-8" stroke={2} />
            </button>
          )}
          <div className="w-full max-w-5xl mx-auto px-4 sm:px-12" onClick={(e) => e.stopPropagation()}>
            <img src={images[lightboxIdx].url} alt=""
              className="w-full max-h-[80vh] object-contain rounded-xl" />
            <div className="mt-4 text-center">
              <p className="text-zinc-400 text-xs sm:text-sm">{lightboxIdx + 1} / {images.length}</p>
            </div>
          </div>
          {images.length > 1 && (
            <button onClick={(e) => { e.stopPropagation(); goNext() }}
              className="absolute right-3 sm:right-6 top-1/2 -translate-y-1/2 flex h-14 w-14 items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/25 transition-colors z-10">
              <IconChevronRight className="h-8 w-8" stroke={2} />
            </button>
          )}
        </div>
      )}
    </main>
  )
}
