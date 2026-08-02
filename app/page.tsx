import Hero from '@/components/hero'
import ProblemSection from '@/components/problem-section'
import SkillsSection from '@/components/skills-section'
import HowItWorks from '@/components/how-it-works'
import ProgramsSection from '@/components/programs-section'
import WhyUs from '@/components/why-us'
import Testimonials from '@/components/testimonials'
import CollaborationsSection from '@/components/collaborations-section'
import NoticesSection from '@/components/notices-section'
import Gallery from '@/components/gallery'
import FinalCTA from '@/components/final-cta'

export default function Page() {
  return (
    <>
      <Hero />
      <ProblemSection />
      <SkillsSection />
      <HowItWorks />
      <ProgramsSection />
      <WhyUs />
      <Testimonials />
      <CollaborationsSection />
      <NoticesSection />
      <Gallery />
      <FinalCTA />
    </>
  )
}
