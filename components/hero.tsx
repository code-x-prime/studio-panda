'use client'

import Link from 'next/link'
import { IconArrowRight, IconChevronLeft, IconChevronRight } from '@tabler/icons-react'
import { Button } from '@/components/ui/button'
import { motion, AnimatePresence } from 'framer-motion'
import { useEffect, useState, useCallback } from 'react'

interface GalleryImage {
  id: string
  title: string
  url: string
  category: string
}

const DEFAULT_HERO_IMAGES: GalleryImage[] = [
  { id: 'hero-1', title: 'Filmmaking & Media Lab', url: '/hero/hero_filmmaking.png', category: 'Filmmaking' },
  { id: 'hero-2', title: 'Creative Podcast & Sound Studio', url: '/hero/hero_podcast.png', category: 'Podcasting' },
  { id: 'hero-3', title: 'AI Digital Art & Future Storytelling', url: '/hero/hero_ai.png', category: 'AI Media' },
]

const STATS = [
  { value: '200+', label: 'Schools reached' },
  { value: '15,000+', label: 'Students trained' },
  { value: '8', label: 'States across India' },
  { value: '98%', label: 'Principal satisfaction' },
]

export default function Hero() {
  const [images, setImages] = useState<GalleryImage[]>(DEFAULT_HERO_IMAGES)
  const [currentIdx, setCurrentIdx] = useState(0)

  useEffect(() => {
    fetch('/api/public/gallery')
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          const fetchedImgs = data.filter((i: GalleryImage) => i.url && i.url.startsWith('http'))
          if (fetchedImgs.length > 0) setImages(fetchedImgs)
        }
      })
      .catch(() => { })
  }, [])

  const nextSlide = useCallback(() => {
    setCurrentIdx((prev) => (prev + 1) % images.length)
  }, [images.length])

  const prevSlide = useCallback(() => {
    setCurrentIdx((prev) => (prev - 1 + images.length) % images.length)
  }, [images.length])

  useEffect(() => {
    if (images.length <= 1) return
    const timer = setInterval(nextSlide, 5500)
    return () => clearInterval(timer)
  }, [images.length, nextSlide])

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.09, delayChildren: 0.1 } },
  }
  const itemVariants = {
    hidden: { opacity: 0, y: 14 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.55, ease: 'easeOut' as const } },
  }

  return (
    // pt-16 = fixed navbar clearance. Section height = svh MINUS navbar, so content
    // never has to fight the navbar or get clipped on short mobile viewports.
    <section id="hero" className="relative w-full  bg-zinc-950 overflow-hidden">
      <div className="relative min-h-screen flex flex-col">
        {/* Background image, slow static zoom (no glow/noise gimmicks) */}
        <div className="absolute inset-0 z-0">
          {images.length > 0 && (
            <AnimatePresence mode="sync">
              <motion.div
                key={currentIdx}
                initial={{ opacity: 0, scale: 1.04 }}
                animate={{ opacity: 1, scale: 1.1 }}
                exit={{ opacity: 0 }}
                transition={{
                  opacity: { duration: 1, ease: 'easeInOut' },
                  scale: { duration: 6, ease: 'linear' },
                }}
                className="absolute inset-0 bg-cover bg-center"
                style={{ backgroundImage: `url(${images[currentIdx].url})` }}
              />
            </AnimatePresence>
          )}
          <div className="absolute inset-0 bg-gradient-to-r from-zinc-950 via-zinc-950/50 to-zinc-950/30" />
          <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/10 to-zinc-950/40" />
        </div>

        {/* Content column — flex-1 + justify-center, no hardcoded padding fighting the viewport */}
        <div className="relative z-10 flex-1 flex items-center">
          <div className="mx-auto w-full max-w-7xl px-5 sm:px-6 lg:px-8">
            <motion.div
              initial="hidden"
              animate="visible"
              variants={containerVariants}
              className="max-w-2xl py-16 sm:py-24 lg:py-32"
            >
              <motion.div
                variants={itemVariants}
                className="mb-8 inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-4 py-2"
              >
                <span className="h-1.5 w-1.5 rounded-full bg-primary shrink-0" />
                <span className="text-[11px] sm:text-xs font-medium tracking-wide text-primary">
                  India&apos;s premium future-skills platform for schools
                </span>
              </motion.div>

              <motion.h1
                variants={itemVariants}
                className="mb-8 text-[clamp(2rem,7vw,4.5rem)] leading-[1.15] font-black text-white tracking-tight [text-wrap:balance]"
              >
                Your students have{' '}
                <span className="text-primary">a story to tell.</span>{' '}
                We help them tell it.
              </motion.h1>

              <motion.p
                variants={itemVariants}
                className="mb-12 max-w-lg text-sm sm:text-base text-zinc-300 leading-relaxed"
              >
                Studio Panda transforms schools into creative powerhouses — building confident
                communicators, fearless storytellers, and future leaders through hands-on media
                projects, filmmaking, podcasting, and AI-driven content creation.
              </motion.p>

              <motion.div variants={itemVariants} className="flex flex-col gap-4 sm:flex-row">
                <Link href="/contact" className="w-full sm:w-auto">
                  <Button className="w-full sm:w-auto bg-primary hover:bg-primary/90 text-black font-semibold text-sm sm:text-base px-8 py-6 sm:py-7 rounded-full gap-2">
                    Book a free school presentation <IconArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
                <Link href="#programs" className="w-full sm:w-auto">
                  <Button
                    variant="outline"
                    className="w-full sm:w-auto border-zinc-700 bg-transparent text-white hover:bg-white/5 px-8 py-6 sm:py-7 rounded-full text-sm sm:text-base font-semibold"
                  >
                    Explore programs
                  </Button>
                </Link>
              </motion.div>
            </motion.div>
          </div>
        </div>

        {/* Stats — plain divided row, sits in normal flow (not absolutely positioned),
            so it can never collide with the carousel controls */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.6 }}
          className="relative z-10 border-t border-white/10"
        >
          <div className="mx-auto max-w-7xl px-5 sm:px-6 lg:px-8">
            <div className="grid grid-cols-2 sm:grid-cols-4 divide-x divide-white/10">
              {STATS.map((stat) => (
                <div key={stat.label} className="py-6 sm:py-8 px-6 sm:px-8 first:pl-0">
                  <div className="text-2xl sm:text-3xl font-bold text-white">{stat.value}</div>
                  <div className="text-xs sm:text-sm text-zinc-400 mt-1">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Carousel dots — inline in the same bar, right side, desktop only.
              On mobile they'd crowd a 2-col stat grid, so they're hidden there
              and slides just auto-rotate. */}
          {images.length > 1 && (
            <div className="hidden sm:flex absolute right-6 lg:right-8 top-1/2 -translate-y-1/2 items-center gap-2">
              <button onClick={prevSlide} aria-label="Previous slide" className="text-zinc-500 hover:text-white transition-colors">
                <IconChevronLeft className="w-4 h-4" />
              </button>
              {images.map((img, idx) => (
                <button
                  key={img.id || idx}
                  onClick={() => setCurrentIdx(idx)}
                  aria-label={img.title}
                  className={`h-1.5 rounded-full transition-all duration-500 ${idx === currentIdx ? 'bg-primary w-5' : 'bg-zinc-600 w-1.5 hover:bg-zinc-400'
                    }`}
                />
              ))}
              <button onClick={nextSlide} aria-label="Next slide" className="text-zinc-500 hover:text-white transition-colors">
                <IconChevronRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </motion.div>
      </div>
    </section>
  )
}