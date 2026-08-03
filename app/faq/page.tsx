'use client'

import { useState } from 'react'
import Breadcrumb from '@/components/breadcrumb'
import PageHero from '@/components/page-hero'
import FAQAccordion from '@/components/faq-accordion'
import { Input } from '@/components/ui/input'
import { Search } from 'lucide-react'

const faqCategories = [
  {
    title: 'Handcrafting & Manufacturing',
    items: [
      {
        id: 'faq-1',
        question: '1. Are your perfumes handmade?',
        answer: 'Yes. Every Rhoseatte perfume is handcrafted in small batches to ensure exceptional quality, freshness, and attention to detail.',
      },
      {
        id: 'faq-2',
        question: '2. Where are your perfumes made?',
        answer: 'All Rhoseatte perfumes are handcrafted at our manufacturing unit in Nagpur, India.',
      },
      {
        id: 'faq-14',
        question: '14. Why does my perfume look slightly different from another bottle?',
        answer: 'Since our perfumes are handcrafted in small batches, slight variations in colour may occur due to natural ingredients. These variations do not affect the quality or performance of the fragrance.',
      },
    ],
  },
  {
    title: 'Orders, Shipping & Delivery',
    items: [
      {
        id: 'faq-3',
        question: '3. Can I modify my order after placing it?',
        answer: 'If your order has not entered production or been dispatched, please contact us immediately. Once production has started, modifications may not be possible.',
      },
      {
        id: 'faq-4',
        question: '4. Can I cancel my order?',
        answer: 'Orders may only be cancelled before production or dispatch. Customized perfume orders cannot be cancelled once formulation has begun.',
      },
      {
        id: 'faq-5',
        question: '5. How long does delivery take?',
        answer: 'Standard handmade perfumes are typically delivered within 5–20 business days. Customized perfumes require approximately 3–4 weeks.',
      },
      {
        id: 'faq-6',
        question: '6. Do you ship across India?',
        answer: 'Yes, we ship to most serviceable locations across India.',
      },
      {
        id: 'faq-7',
        question: '7. Do you offer international shipping?',
        answer: 'Currently, we primarily ship within India. International shipping may be introduced in the future.',
      },
      {
        id: 'faq-19',
        question: '19. What should I do if my order is delayed?',
        answer: 'While we strive to deliver within the estimated timeline, delays may occur due to courier operations, weather conditions, or other unforeseen circumstances. Please contact us if your order is delayed beyond the estimated delivery period.',
      },
      {
        id: 'faq-20',
        question: '20. What happens if I enter the wrong shipping address?',
        answer: 'Please contact us immediately. If your order has not been dispatched, we will try our best to update the address. Once dispatched, changes may not be possible.',
      },
    ],
  },
  {
    title: 'Returns, Exchanges & Restocks',
    items: [
      {
        id: 'faq-8',
        question: '8. Can I return my perfume?',
        answer: 'No. Due to hygiene and safety reasons, all perfume purchases are non-returnable.',
      },
      {
        id: 'faq-9',
        question: '9. Can I exchange my perfume if I don\'t like the fragrance?',
        answer: 'No. We do not offer exchanges based on personal fragrance preference or change of mind.',
      },
      {
        id: 'faq-21',
        question: '21. Do you restock sold-out fragrances?',
        answer: 'Yes, many of our fragrances are restocked periodically. You can subscribe to receive updates when they become available.',
      },
    ],
  },
  {
    title: 'Customized & Bespoke Perfumes',
    items: [
      {
        id: 'faq-10',
        question: '10. Do you create customized perfumes?',
        answer: 'Yes. We offer customized and bespoke perfume services for eligible orders.',
      },
      {
        id: 'faq-11',
        question: '11. How long do customized perfumes take?',
        answer: 'Customized perfumes generally require 3–4 weeks for formulation and preparation.',
      },
      {
        id: 'faq-12',
        question: '12. Can customized perfumes be returned or exchanged?',
        answer: 'No. Customized perfumes are non-returnable, non-exchangeable, and non-refundable unless they arrive damaged or an incorrect product is delivered.',
      },
    ],
  },
  {
    title: 'Usage, Safety & Gifting',
    items: [
      {
        id: 'faq-13',
        question: '13. How should I store my perfume?',
        answer: 'Store your perfume in a cool, dry place away from direct sunlight, excessive heat, and humidity. Keep the bottle tightly closed when not in use.',
      },
      {
        id: 'faq-15',
        question: '15. Are your perfumes safe for skin?',
        answer: 'Our perfumes are formulated using cosmetic-grade fragrance ingredients intended for external use. If you have sensitive skin, we recommend performing a patch test before regular use.',
      },
      {
        id: 'faq-16',
        question: '16. Can I apply perfume to my clothes?',
        answer: 'Yes, but we recommend testing on an inconspicuous area first, as some fabrics may stain.',
      },
      {
        id: 'faq-17',
        question: '17. Are your perfumes cruelty-free?',
        answer: 'We do not test our finished products on animals.',
      },
      {
        id: 'faq-18',
        question: '18. Do you offer bulk or corporate gifting?',
        answer: 'Yes. We offer bulk, corporate, wedding, and event gifting solutions. Please contact us for more information.',
      },
    ],
  },
]

export default function FAQPage() {
  const [searchQuery, setSearchQuery] = useState('')

  const filteredCategories = faqCategories
    .map((category) => {
      const filteredItems = category.items.filter(
        (item) =>
          item.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
          item.answer.toLowerCase().includes(searchQuery.toLowerCase())
      )
      return { ...category, items: filteredItems }
    })
    .filter((category) => category.items.length > 0)

  return (
    <main className="min-h-screen bg-background">
      <div className="bg-muted py-4 px-6">
        <div className="max-w-7xl mx-auto">
          <Breadcrumb items={[{ label: 'FAQ' }]} />
        </div>
      </div>

      <PageHero
        eyebrow="Got Questions?"
        title="Frequently Asked Questions"
        subtitle="Everything you need to know about our handcrafted perfumes, orders, delivery, and bespoke services."
      />

      <section className="py-8 px-6 max-w-2xl mx-auto">
        <div className="relative">
          <Search className="absolute left-3.5 top-3 h-5 w-5 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Search FAQs (e.g. handmade, return, shipping)..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-11 py-5 text-base border-primary/20 focus-visible:ring-primary shadow-sm"
          />
        </div>
      </section>

      <section className="py-12 px-6 max-w-4xl mx-auto">
        {filteredCategories.length > 0 ? (
          filteredCategories.map((category, idx) => (
            <div key={idx} className="mb-12">
              <h2 className="text-2xl font-bold text-foreground mb-6 border-b pb-2">
                {category.title}
              </h2>
              <FAQAccordion items={category.items} />
            </div>
          ))
        ) : (
          <div className="text-center py-12 border rounded-xl bg-muted/30">
            <p className="text-lg text-muted-foreground">
              No matching questions found for &quot;{searchQuery}&quot;.
            </p>
          </div>
        )}
      </section>

      <section className="py-16 px-6 max-w-4xl mx-auto mb-16">
        <div className="text-center p-12 rounded-2xl border bg-muted/50">
          <h2 className="text-3xl font-bold text-foreground mb-4">Still have questions?</h2>
          <p className="text-lg text-muted-foreground mb-8">
            Feel free to reach out to us for assistance regarding orders, custom formulations, or corporate gifting.
          </p>
          <a href="/contact" className="inline-block">
            <button className="px-8 py-3 bg-primary text-primary-foreground font-semibold rounded-full transition-all hover:opacity-90 shadow-md">
              Contact Support
            </button>
          </a>
        </div>
      </section>
    </main>
  )
}

