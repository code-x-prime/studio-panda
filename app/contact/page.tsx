'use client'

import { useState } from 'react'
import PageHero from '@/components/page-hero'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { IconMail, IconPhone, IconMapPin, IconCheck, IconSend, IconLoader2, IconAlertCircle } from '@tabler/icons-react'

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    customSubject: '',
    message: '',
  })
  const [submitted, setSubmitted] = useState(false)
  const [sending, setSending] = useState(false)
  const [error, setError] = useState('')
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({})

  const subjectOptions = [
    'Book a Demo',
    'Partnership Inquiry',
    'Workshop / Training',
    'Pricing & Plans',
    'Technical Support',
    'Media / Press',
    'Other',
  ]

  const validate = () => {
    const errors: Record<string, string> = {}
    if (!formData.name.trim()) errors.name = 'Name is required'
    if (!formData.email.trim()) errors.email = 'Email is required'
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) errors.email = 'Enter a valid email'
    if (!formData.message.trim()) errors.message = 'Message is required'
    else if (formData.message.trim().length < 10) errors.message = 'Message must be at least 10 characters'
    setFieldErrors(errors)
    return Object.keys(errors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validate()) return

    setSending(true)
    setError('')

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name.trim(),
          email: formData.email.trim(),
          phone: formData.phone.trim() || undefined,
          subject: (formData.subject === 'Other' ? formData.customSubject.trim() : formData.subject.trim()) || undefined,
          message: formData.message.trim(),
        }),
      })

      const data = await res.json()

      if (res.ok) {
        setSubmitted(true)
        setFormData({ name: '', email: '', phone: '', subject: '', customSubject: '', message: '' })
        setFieldErrors({})
      } else {
        setError(data.error || 'Failed to send message. Please try again.')
      }
    } catch {
      setError('Network error. Please check your connection and try again.')
    } finally {
      setSending(false)
    }
  }

  const handleChange = (field: string, value: string) => {
    setFormData({ ...formData, [field]: value })
    if (fieldErrors[field]) {
      setFieldErrors({ ...fieldErrors, [field]: '' })
    }
  }

  return (
    <main className="min-h-screen bg-white">
      <PageHero
        eyebrow="Get in Touch"
        title="Let's Build Something Great for Your Students"
        subtitle="Schedule a free 30-minute demonstration, consult on school broadcast studios, or enquire about custom workshops."
      />

      <section className="py-16 sm:py-20">
        <div className="mx-auto max-w-6xl px-6 sm:px-8 lg:px-12">
          <div className="grid gap-12 lg:grid-cols-2">
            {/* Contact Details */}
            <div className="space-y-8">
              <div>
                <span className="px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold uppercase tracking-wider">
                  Direct Contact
                </span>
                <h2 className="text-3xl font-black text-zinc-900 mt-3 mb-4">We&apos;d Love to Hear From You</h2>
                <p className="text-zinc-500 text-sm leading-relaxed">
                  Whether you are looking to set up a full student broadcast studio, launch a monthly podcast club, or conduct teacher training workshops, our experts are ready to assist.
                </p>
              </div>

              <div className="space-y-4">
                <div className="flex items-start gap-4 p-5 rounded-2xl bg-zinc-50 border border-zinc-100 hover:border-primary/20 hover:shadow-md transition-all duration-300">
                  <div className="h-10 w-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
                    <IconMail className="h-5 w-5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-zinc-900 text-sm">Email Us</h4>
                    <p className="text-xs text-zinc-500 mt-0.5">contact@studiopanda.in</p>
                    <p className="text-xs text-zinc-400 mt-1">Response within 24 business hours</p>
                  </div>
                </div>

                <div className="flex items-start gap-4 p-5 rounded-2xl bg-zinc-50 border border-zinc-100 hover:border-primary/20 hover:shadow-md transition-all duration-300">
                  <div className="h-10 w-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
                    <IconPhone className="h-5 w-5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-zinc-900 text-sm">Call Our Team</h4>
                    <p className="text-xs text-zinc-500 mt-0.5">+91 98765 43210</p>
                    <p className="text-xs text-zinc-400 mt-1">Mon - Sat, 9:00 AM - 6:00 PM IST</p>
                  </div>
                </div>

                <div className="flex items-start gap-4 p-5 rounded-2xl bg-zinc-50 border border-zinc-100 hover:border-primary/20 hover:shadow-md transition-all duration-300">
                  <div className="h-10 w-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
                    <IconMapPin className="h-5 w-5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-zinc-900 text-sm">Headquarters</h4>
                    <p className="text-xs text-zinc-500 mt-0.5">Studio Panda Educational Technologies</p>
                    <p className="text-xs text-zinc-400 mt-1">New Delhi, India</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Contact Form */}
            <div className="bg-zinc-50 border border-zinc-200 rounded-3xl p-6 sm:p-8 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl pointer-events-none" />

              <h3 className="text-2xl font-bold text-zinc-900 mb-2">Book a Demo / Consultation</h3>
              <p className="text-xs text-zinc-500 mb-6">Fill in your details and our team will get back to you promptly.</p>

              {submitted ? (
                <div className="p-8 text-center space-y-3 bg-emerald-50 border border-emerald-200 rounded-2xl">
                  <div className="h-14 w-14 rounded-full bg-emerald-100 flex items-center justify-center mx-auto">
                    <IconCheck className="h-7 w-7 text-emerald-600" />
                  </div>
                  <h4 className="text-lg font-bold text-zinc-900">Message Received!</h4>
                  <p className="text-sm text-zinc-500 max-w-sm mx-auto">
                    Thank you for reaching out. Our school relations team will contact you within 24 hours.
                  </p>
                  <button
                    onClick={() => setSubmitted(false)}
                    className="mt-4 text-sm font-semibold text-primary hover:underline"
                  >
                    Send another message
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4 relative z-10">
                  {error && (
                    <div className="flex items-center gap-2 p-3 rounded-xl bg-red-50 border border-red-200 text-red-600 text-sm">
                      <IconAlertCircle className="h-4 w-4 shrink-0" />
                      {error}
                    </div>
                  )}

                  <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                      <label className="block text-xs font-semibold text-zinc-700 mb-1.5">Full Name *</label>
                      <input
                        type="text"
                        value={formData.name}
                        onChange={(e) => handleChange('name', e.target.value)}
                        placeholder="e.g. Dr. Rajesh Kumar"
                        className={`w-full rounded-xl bg-white border px-3.5 py-2.5 text-zinc-900 text-sm focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all ${
                          fieldErrors.name ? 'border-red-400 bg-red-50' : 'border-zinc-200'
                        }`}
                      />
                      {fieldErrors.name && <p className="text-xs text-red-500 mt-1">{fieldErrors.name}</p>}
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-zinc-700 mb-1.5">Email Address *</label>
                      <input
                        type="email"
                        value={formData.email}
                        onChange={(e) => handleChange('email', e.target.value)}
                        placeholder="rajesh@school.edu.in"
                        className={`w-full rounded-xl bg-white border px-3.5 py-2.5 text-zinc-900 text-sm focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all ${
                          fieldErrors.email ? 'border-red-400 bg-red-50' : 'border-zinc-200'
                        }`}
                      />
                      {fieldErrors.email && <p className="text-xs text-red-500 mt-1">{fieldErrors.email}</p>}
                    </div>
                  </div>

                  <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                      <label className="block text-xs font-semibold text-zinc-700 mb-1.5">Phone Number</label>
                      <input
                        type="tel"
                        value={formData.phone}
                        onChange={(e) => handleChange('phone', e.target.value)}
                        placeholder="+91 98765 43210"
                        className="w-full rounded-xl bg-white border border-zinc-200 px-3.5 py-2.5 text-zinc-900 text-sm focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-zinc-700 mb-1.5">Subject</label>
                      <Select
                        value={formData.subject}
                        onValueChange={(val: string | null) => setFormData({ ...formData, subject: val ?? '', customSubject: val !== 'Other' ? '' : formData.customSubject })}
                      >
                        <SelectTrigger className="w-full bg-white border-zinc-200">
                          <SelectValue placeholder="Select a subject" />
                        </SelectTrigger>
                        <SelectContent>
                          {subjectOptions.map((opt) => (
                            <SelectItem key={opt} value={opt}>{opt}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  {formData.subject === 'Other' && (
                    <div>
                      <label className="block text-xs font-semibold text-zinc-700 mb-1.5">Specify Subject *</label>
                      <input
                        type="text"
                        value={formData.customSubject}
                        onChange={(e) => setFormData({ ...formData, customSubject: e.target.value })}
                        placeholder="e.g. Custom Workshop Inquiry"
                        className="w-full rounded-xl bg-white border border-zinc-200 px-3.5 py-2.5 text-zinc-900 text-sm focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                      />
                    </div>
                  )}

                  <div>
                    <label className="block text-xs font-semibold text-zinc-700 mb-1.5">Message / Requirements *</label>
                    <textarea
                      rows={4}
                      value={formData.message}
                      onChange={(e) => handleChange('message', e.target.value)}
                      placeholder="Tell us about your school's requirements..."
                      className={`w-full rounded-xl bg-white border px-3.5 py-2.5 text-zinc-900 text-sm focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all resize-none ${
                        fieldErrors.message ? 'border-red-400 bg-red-50' : 'border-zinc-200'
                      }`}
                    />
                    {fieldErrors.message && <p className="text-xs text-red-500 mt-1">{fieldErrors.message}</p>}
                  </div>

                  <Button
                    type="submit"
                    disabled={sending}
                    className="w-full bg-primary hover:bg-primary/90 text-black font-bold py-4 text-base rounded-xl gap-2 mt-2 transition-all"
                  >
                    {sending ? (
                      <>
                        <IconLoader2 className="h-4 w-4 animate-spin" /> Sending...
                      </>
                    ) : (
                      <>
                        <IconSend className="h-4 w-4" /> Submit Enquiry
                      </>
                    )}
                  </Button>
                </form>
              )}
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}
