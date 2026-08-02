import { Metadata } from 'next'
import Breadcrumb from '@/components/breadcrumb'
import PageHero from '@/components/page-hero'
import FAQAccordion from '@/components/faq-accordion'
import { Input } from '@/components/ui/input'

export const metadata: Metadata = {
  title: 'FAQ | Studio Panda',
  description: 'Frequently asked questions about Studio Panda programs and partnerships.',
}

const faqCategories = [
  {
    title: 'General',
    items: [
      {
        id: 'gen-1',
        question: 'What is Studio Panda?',
        answer: 'Studio Panda is India\'s premium future-skills platform for schools, transforming education through hands-on creative projects in filmmaking, podcasting, photography, and AI-driven content creation.',
      },
      {
        id: 'gen-2',
        question: 'How long has Studio Panda been operating?',
        answer: 'We\'ve been partnering with schools since 2020, working with 50+ schools and impacting 5,000+ students across India.',
      },
      {
        id: 'gen-3',
        question: 'What makes Studio Panda different?',
        answer: 'We focus on hands-on, project-based learning with professional facilitators, real equipment, and measurable outcomes. Students build portfolios and gain career-ready skills.',
      },
    ],
  },
  {
    title: 'Programs',
    items: [
      {
        id: 'prog-1',
        question: 'How do I choose which program is right for our school?',
        answer: 'Contact our team for a consultation. We assess your school\'s needs, student interests, and existing resources to recommend the best programs.',
      },
      {
        id: 'prog-2',
        question: 'Can we run multiple programs simultaneously?',
        answer: 'Yes! Many schools run 2-3 programs at once with our dedicated teams. Our Professional and Enterprise plans support this.',
      },
      {
        id: 'prog-3',
        question: 'How many hours per week are programs?',
        answer: 'Programs typically meet 3-5 hours per week. We can customize timing to fit your school\'s schedule.',
      },
      {
        id: 'prog-4',
        question: 'Can we customize the curriculum?',
        answer: 'Absolutely. We work with schools to tie programs to existing subjects, adjust pacing, and create custom modules.',
      },
    ],
  },
  {
    title: 'Logistics',
    items: [
      {
        id: 'log-1',
        question: 'Do we need a dedicated studio space?',
        answer: 'No. We can set up in any classroom, cafeteria, or outdoor space. Our equipment is portable and flexible.',
      },
      {
        id: 'log-2',
        question: 'What equipment do students get access to?',
        answer: 'Professional cameras, audio equipment, lighting rigs, editing computers with industry-standard software, and more. It\'s all included.',
      },
      {
        id: 'log-3',
        question: 'How do you handle student safety and privacy?',
        answer: 'We follow strict protocols: parent consent forms for filming, secure storage of work, privacy training for students, and ethical guidelines for all content.',
      },
      {
        id: 'log-4',
        question: 'What happens to student work after the program?',
        answer: 'Students own all their work. They can share it on portfolios, college applications, or keep it private. Some programs showcase work on school channels.',
      },
    ],
  },
  {
    title: 'Outcomes & Support',
    items: [
      {
        id: 'out-1',
        question: 'How do we measure program success?',
        answer: 'We track: student confidence gains, work portfolio quality, skill development, engagement levels, and feedback from students, teachers, and parents.',
      },
      {
        id: 'out-2',
        question: 'Will students get certificates?',
        answer: 'Yes. Students receive completion certificates and detailed portfolio summaries they can use for college applications and resumes.',
      },
      {
        id: 'out-3',
        question: 'What support do teachers get?',
        answer: 'We provide full training, ongoing support, curriculum resources, and collaboration on student development throughout the program.',
      },
      {
        id: 'out-4',
        question: 'Can parents get involved?',
        answer: 'Yes! We offer parent workshops, showcase events, and optional family creative projects to build buy-in and home support.',
      },
    ],
  },
]

export default function FAQPage() {
  return (
    <main className="min-h-screen bg-background">
      <div className="bg-muted py-4 px-6">
        <div className="max-w-7xl mx-auto">
          <Breadcrumb items={[{ label: 'FAQ' }]} />
        </div>
      </div>

      <PageHero
        eyebrow="Questions?"
        title="Frequently Asked Questions"
        subtitle="Find answers to common questions about Studio Panda programs and partnerships."
      />

      <section className="py-12 px-6 max-w-2xl mx-auto">
        <Input
          type="text"
          placeholder="Search FAQs..."
          className="w-full"
        />
      </section>

      <section className="py-16 px-6 max-w-4xl mx-auto">
        {faqCategories.map((category, idx) => (
          <div key={idx} className="mb-12">
            <h2 className="text-2xl font-bold text-foreground mb-6">{category.title}</h2>
            <FAQAccordion items={category.items} />
          </div>
        ))}
      </section>

      <section className="py-16 px-6 max-w-4xl mx-auto mb-16">
        <div className="text-center p-12 rounded-2xl border bg-muted/50">
          <h2 className="text-3xl font-bold text-foreground mb-4">Still have questions?</h2>
          <p className="text-lg text-muted-foreground mb-8">
            We&apos;d love to chat about how Studio Panda can transform your school
          </p>
          <a href="/contact" className="inline-block">
            <button className="px-8 py-3 bg-primary text-primary-foreground font-semibold rounded-full transition-all hover:opacity-90">
              Schedule a Call
            </button>
          </a>
        </div>
      </section>
    </main>
  )
}
