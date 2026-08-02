'use client'

import { useState, useEffect, useCallback } from 'react'
import { IconStar, IconQuote } from '@tabler/icons-react'

const testimonials = {
  principal: [
    {
      stars: 5,
      quote:
        "Studio Panda didn't just add a program to our school — it changed our culture. Students who never raised their hands in class are now hosting school assemblies and producing our weekly news bulletin. The transformation has been remarkable.",
      author: 'Rajesh Menon',
      role: 'Principal, Delhi Public School, Pune',
      avatar: '/avatars/principal-1.jpg',
    },
    {
      stars: 5,
      quote:
        'The confidence boost in our students has been remarkable. Not just in media skills, but in how they carry themselves, how they speak in class, how they lead. Studio Panda has become integral to our school identity.',
      author: 'Priya Sharma',
      role: 'Head of Academics, Mumbai International School',
      avatar: '/avatars/principal-2.jpg',
    },
    {
      stars: 5,
      quote:
        "We've seen enrollment increase since partnering with Studio Panda. Parents specifically choose schools that offer real-world skills. This program gives us that edge.",
      author: 'Dr. Anand Verma',
      role: 'Director, Bangalore Public Academy',
      avatar: '/avatars/principal-3.jpg',
    },
  ],
  teacher: [
    {
      stars: 5,
      quote:
        'My shy students became vocal. My struggling students found an outlet. Studio Panda created an inclusive space where every student could shine. The change in classroom dynamics has been incredible.',
      author: 'Amit Desai',
      role: 'English Teacher, St. Mary\'s School',
      avatar: '/avatars/teacher-1.jpg',
    },
    {
      stars: 5,
      quote:
        'The resources and training we received made it easy to integrate media literacy into our curriculum. Our board scores improved and students are more engaged across all subjects.',
      author: 'Neha Singh',
      role: 'Geography Teacher, DPS Mumbai',
      avatar: '/avatars/teacher-2.jpg',
    },
  ],
  parent: [
    {
      stars: 5,
      quote:
        "My daughter came home excited every week. For the first time, she found something she was passionate about. She's now considering media studies in college. Thank you Studio Panda!",
      author: 'Meera Patel',
      role: 'Parent, Class 10 Student',
      avatar: '/avatars/parent-1.jpg',
    },
    {
      stars: 5,
      quote:
        "The showcase event was incredible. Seeing our kids' work on screen, hearing them speak about their creative process — it was the proudest moment as a parent.",
      author: 'Rohit Gupta',
      role: 'Parent, Class 11 Student',
      avatar: '/avatars/parent-2.jpg',
    },
  ],
  student: [
    {
      stars: 5,
      quote:
        "I was terrified of public speaking. After Studio Panda, I'm hosting my school's annual event. I never thought I could do this. This program changed everything about how I see myself.",
      author: 'Arjun Verma',
      role: 'Class 11 Student',
      avatar: '/avatars/student-1.jpg',
    },
    {
      stars: 5,
      quote:
        'Making a podcast taught me so much about storytelling, editing, and presenting ideas. This is real learning — not textbook stuff. I wake up excited for these sessions.',
      author: 'Zara Khan',
      role: 'Class 10 Student',
      avatar: '/avatars/student-2.jpg',
    },
  ],
}

const tabLabels: Record<keyof typeof testimonials, string> = {
  principal: 'Principal',
  teacher: 'Teacher',
  parent: 'Parent',
  student: 'Student',
}

const tabKeys = Object.keys(testimonials) as Array<keyof typeof testimonials>

function initials(name: string) {
  return name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .slice(0, 2)
    .toUpperCase()
}

export default function Testimonials() {
  const [activeTab, setActiveTab] = useState<keyof typeof testimonials>('principal')
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isTransitioning, setIsTransitioning] = useState(false)

  const currentTestimonials = testimonials[activeTab]

  const goTo = useCallback(
    (idx: number) => {
      if (idx === currentIndex || isTransitioning) return
      setIsTransitioning(true)
      setTimeout(() => {
        setCurrentIndex(idx)
        setTimeout(() => setIsTransitioning(false), 50)
      }, 200)
    },
    [currentIndex, isTransitioning]
  )

  const goNext = useCallback(() => {
    const next = (currentIndex + 1) % currentTestimonials.length
    goTo(next)
  }, [currentIndex, currentTestimonials.length, goTo])

  const goPrev = useCallback(() => {
    const prev = (currentIndex - 1 + currentTestimonials.length) % currentTestimonials.length
    goTo(prev)
  }, [currentIndex, currentTestimonials.length, goTo])

  const handleTabChange = useCallback((tab: keyof typeof testimonials) => {
    setActiveTab(tab)
    setCurrentIndex(0)
    setIsTransitioning(false)
  }, [])

  useEffect(() => {
    const interval = setInterval(goNext, 5000)
    return () => clearInterval(interval)
  }, [goNext])

  useEffect(() => {
    setCurrentIndex(0)
  }, [activeTab])

  const current = currentTestimonials[currentIndex]

  return (
    <section id="testimonials" className="bg-white py-14 sm:py-16 ">
      <div className="mx-auto max-w-4xl px-6 sm:px-8 lg:px-12 text-center">
        {/* Header */}
        <p className="mb-4 text-xs sm:text-sm font-semibold tracking-wide text-primary uppercase">
          Testimonials
        </p>
        <h2 className="mb-12 sm:mb-14 text-3xl sm:text-4xl lg:text-5xl font-black text-zinc-900 leading-tight [text-wrap:balance]">
          Heard from the people<br className="hidden sm:block" /> who matter
        </h2>

        {/* Filter tabs */}
        <div className="mb-12 sm:mb-14 flex flex-wrap items-center justify-center gap-2 sm:gap-3">
          {tabKeys.map((tab) => (
            <button
              key={tab}
              onClick={() => handleTabChange(tab)}
              className={`rounded-full px-5 sm:px-6 py-2.5 text-sm font-semibold transition-all duration-300 ${activeTab === tab
                  ? 'bg-primary text-white shadow-lg shadow-primary/25'
                  : 'bg-zinc-100 text-zinc-500 hover:bg-zinc-200 hover:text-zinc-700'
                }`}
            >
              {tabLabels[tab]}
            </button>
          ))}
        </div>

        {/* Testimonial card */}
        <div className="relative mx-auto max-w-3xl">
          <div
            className={`rounded-3xl border border-zinc-200 bg-white p-8 sm:p-10 md:p-12 shadow-xl shadow-black/[0.04] transition-all duration-300 ${isTransitioning ? 'opacity-0 scale-[0.98]' : 'opacity-100 scale-100'
              }`}
          >
            {/* Quote icon + Stars */}
            <div className="mb-6 sm:mb-8 flex items-center gap-4">
              <div className="flex h-12 w-12 sm:h-14 sm:w-14 items-center justify-center rounded-2xl bg-primary/10">
                <IconQuote className="h-6 w-6 sm:h-7 sm:w-7 text-primary" stroke={1.5} />
              </div>
              <div className="flex gap-0.5">
                {Array.from({ length: current.stars }).map((_, i) => (
                  <IconStar key={i} className="h-4 w-4 sm:h-5 sm:w-5 fill-primary text-primary" stroke={0} />
                ))}
              </div>
            </div>

            {/* Quote text */}
            <p className="mb-8 sm:mb-10 text-left text-lg sm:text-xl md:text-[22px] text-zinc-700 leading-relaxed font-medium">
              &ldquo;{current.quote}&rdquo;
            </p>

            {/* Author */}
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 sm:h-14 sm:w-14 items-center justify-center rounded-full bg-zinc-900 text-sm sm:text-base font-bold text-white shrink-0">
                {initials(current.author)}
              </div>
              <div className="text-left">
                <p className="font-bold text-zinc-900 text-sm sm:text-base">{current.author}</p>
                <p className="text-xs sm:text-sm text-zinc-500">{current.role}</p>
              </div>
            </div>
          </div>

          {/* Navigation arrows */}
          {currentTestimonials.length > 1 && (
            <>
              <button
                onClick={goPrev}
                className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 sm:-translate-x-6 lg:-translate-x-14 flex h-10 w-10 sm:h-12 sm:w-12 items-center justify-center rounded-full border border-zinc-200 bg-white text-zinc-500 shadow-md transition-all hover:border-primary/40 hover:text-primary hover:shadow-lg"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M15 18l-6-6 6-6" />
                </svg>
              </button>
              <button
                onClick={goNext}
                className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 sm:translate-x-6 lg:translate-x-14 flex h-10 w-10 sm:h-12 sm:w-12 items-center justify-center rounded-full border border-zinc-200 bg-white text-zinc-500 shadow-md transition-all hover:border-primary/40 hover:text-primary hover:shadow-lg"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M9 18l6-6-6-6" />
                </svg>
              </button>
            </>
          )}
        </div>

        {/* Dots */}
        {currentTestimonials.length > 1 && (
          <div className="mt-8 flex items-center justify-center gap-2.5">
            {currentTestimonials.map((_, idx) => (
              <button
                key={idx}
                onClick={() => goTo(idx)}
                className={`rounded-full transition-all duration-300 ${idx === currentIndex
                    ? 'h-2.5 w-2.5 bg-primary'
                    : 'h-2 w-2 bg-zinc-300 hover:bg-zinc-400'
                  }`}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
