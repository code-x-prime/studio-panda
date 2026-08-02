import PageHero from '@/components/page-hero'
import { IconTarget, IconEye, IconAward, IconUsers, IconSparkles, IconSchool, IconMusic, IconDeviceDesktop, IconVideo } from '@tabler/icons-react'
import Image from 'next/image'

export const metadata = {
  title: 'About Us | Studio Panda - Media Education for Schools',
  description: 'Learn about Studio Panda vision, mission, and how we are empowering the next generation of storytellers and communicators across India.',
}

export default function AboutPage() {
  const coreValues = [
    {
      icon: IconTarget,
      title: 'Empowerment First',
      desc: 'We place real equipment, microphones, cameras, and AI tools directly into student hands, turning passive consumers into active creators.',
      color: 'text-rose-500',
      bg: 'bg-rose-500/10',
    },
    {
      icon: IconEye,
      title: 'Future Readiness',
      desc: 'Confidence, public speaking, critical thinking, and media literacy are non-negotiable future skills for 21st-century leaders.',
      color: 'text-amber-500',
      bg: 'bg-amber-500/10',
    },
    {
      icon: IconAward,
      title: 'Academic Synergy',
      desc: "Our programs don't disrupt school curriculum; they enrich STEM, humanities, and language learning through experiential media projects.",
      color: 'text-emerald-500',
      bg: 'bg-emerald-500/10',
    },
    {
      icon: IconUsers,
      title: 'Inclusivity & Expression',
      desc: 'Every student has a voice. We create a safe, supportive environment where even the quietest students find their confidence.',
      color: 'text-primary',
      bg: 'bg-primary/10',
    },
  ]

  const impactNumbers = [
    { value: '200+', label: 'Partner Schools', icon: IconSchool },
    { value: '15,000+', label: 'Students Trained', icon: IconUsers },
    { value: '500+', label: 'Podcasts & Episodes', icon: IconMusic },
    { value: '100%', label: 'Hands-on Experiential', icon: IconDeviceDesktop },
  ]

  return (
    <main className="min-h-screen bg-white">
      <PageHero
        eyebrow="About Studio Panda"
        title="Transforming Indian Education Through Media & Creativity"
        subtitle="Studio Panda is on a mission to bring future-skills, filmmaking, podcasting, and media literacy to every school across India."
      />

      {/* Story Section */}
      <section className="py-14 sm:py-20">
        <div className="mx-auto max-w-6xl px-6 sm:px-8 lg:px-12">
          <div className="grid gap-12 lg:grid-cols-2 lg:gap-16 items-center">
            {/* Left - Text & Photo */}
            <div>
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-xs font-bold uppercase tracking-wider mb-6">
                <IconSparkles className="h-4 w-4" />
                Why Studio Panda Was Born
              </div>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-zinc-900 leading-tight [text-wrap:balance] mb-6">
                Bridging the gap between textbook education and real-world expression.
              </h2>
              <p className="text-zinc-600 leading-relaxed text-base sm:text-lg mb-5">
                In today&apos;s fast-changing digital landscape, traditional academic scores alone are no longer enough. Students must know how to articulate ideas, present with conviction, produce engaging content, and navigate modern AI workflows.
              </p>
              <p className="text-zinc-500 leading-relaxed text-sm sm:text-base mb-8">
                Founded by media professionals and educators, Studio Panda provides end-to-end support for schools — setting up TV broadcast studios, establishing student podcast clubs, and conducting structured workshops across India.
              </p>

              {/* Realistic Studio Image Banner */}
              <div className="relative h-64 sm:h-72 w-full rounded-2xl overflow-hidden shadow-lg border border-zinc-200">
                <Image
                  src="/about/students-studio.png"
                  alt="Students working in media studio"
                  fill
                  className="object-cover"
                />
              </div>
            </div>

            {/* Right - Photo & Impact Numbers */}
            <div className="flex flex-col gap-8">
              <div className="relative h-64 sm:h-72 w-full rounded-3xl overflow-hidden shadow-md border border-zinc-200">
                <Image
                  src="/about/podcast-workshop.png"
                  alt="Student podcasting workshop"
                  fill
                  className="object-cover"
                />
              </div>

              <div className="rounded-3xl bg-zinc-50 border border-zinc-200 p-8 sm:p-10">
                <h3 className="text-2xl font-bold text-primary mb-8">Our Impact Numbers</h3>
                <div className="grid grid-cols-2 gap-6">
                  {impactNumbers.map((item, idx) => {
                    const Icon = item.icon
                    return (
                      <div key={idx} className="group">
                        <div className="flex items-center gap-3 mb-2">
                          <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                            <Icon className="h-5 w-5 text-primary" stroke={1.75} />
                          </div>
                          <p className="text-3xl sm:text-4xl font-black text-zinc-900">{item.value}</p>
                        </div>
                        <p className="text-sm text-zinc-500 font-medium ml-[52px]">{item.label}</p>
                      </div>
                    )
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Core Values */}
      <section className="py-14 sm:py-20 bg-zinc-50">
        <div className="mx-auto max-w-6xl px-6 sm:px-8 lg:px-12">
          <div className="text-center mb-14">
            <p className="mb-4 text-xs sm:text-sm font-semibold tracking-wide text-primary uppercase">
              Guided by Excellence
            </p>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-zinc-900 leading-tight [text-wrap:balance]">
              Our Core Guiding Principles
            </h2>
            <p className="mt-4 text-zinc-500 text-sm sm:text-base max-w-lg mx-auto">
              How we create impactful, lasting educational experiences for schools
            </p>
          </div>

          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {coreValues.map((val, idx) => {
              const Icon = val.icon
              return (
                <div
                  key={idx}
                  className="group bg-white border border-zinc-200 rounded-2xl p-6 sm:p-7 hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5 transition-all duration-300"
                >
                  <div className={`h-12 w-12 rounded-xl ${val.bg} flex items-center justify-center mb-5 group-hover:scale-110 transition-transform duration-300`}>
                    <Icon className={`h-6 w-6 ${val.color}`} stroke={1.75} />
                  </div>
                  <h3 className="text-lg font-bold text-zinc-900 mb-2 group-hover:text-primary transition-colors">
                    {val.title}
                  </h3>
                  <p className="text-sm text-zinc-500 leading-relaxed">
                    {val.desc}
                  </p>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Mission Statement */}
      <section className="py-14 sm:py-20">
        <div className="mx-auto max-w-4xl px-6 sm:px-8 lg:px-12 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-xs font-bold uppercase tracking-wider mb-6">
            <IconVideo className="h-4 w-4" />
            Our Mission
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-zinc-900 leading-tight [text-wrap:balance] mb-6">
            To make every school a creative powerhouse
          </h2>
          <p className="text-zinc-500 text-base sm:text-lg leading-relaxed max-w-2xl mx-auto">
            We believe every student deserves the tools and confidence to tell their story. Through hands-on media education, we&apos;re building the next generation of communicators, creators, and leaders.
          </p>
        </div>
      </section>
    </main>
  )
}

