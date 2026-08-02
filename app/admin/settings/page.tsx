'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Separator } from '@/components/ui/separator'
import { Skeleton } from '@/components/ui/skeleton'
import { IconLoader2, IconSettings, IconPhoto, IconSearch, IconLink } from '@tabler/icons-react'

interface SiteSettings {
  siteName: string
  siteDescription: string
  logoUrl: string
  faviconUrl: string
  contactEmail: string
  contactPhone: string
  contactAddress: string
  socialInstagram: string
  socialFacebook: string
  socialYoutube: string
  socialTwitter: string
  metaTitle: string
  metaDescription: string
  metaKeywords: string
}

const defaultSettings: SiteSettings = {
  siteName: 'Studio Panda',
  siteDescription: 'Premium yoga and wellness studio in the heart of Delhi.',
  logoUrl: '',
  faviconUrl: '',
  contactEmail: '',
  contactPhone: '',
  contactAddress: '',
  socialInstagram: '',
  socialFacebook: '',
  socialYoutube: '',
  socialTwitter: '',
  metaTitle: '',
  metaDescription: '',
  metaKeywords: '',
}

export default function AdminSettingsPage() {
  const [settings, setSettings] = useState<SiteSettings>(defaultSettings)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const res = await fetch('/api/settings')
        const data = await res.json()
        if (data && Object.keys(data).length > 0) {
          setSettings({ ...defaultSettings, ...data })
        }
      } catch {
        console.error('Failed to fetch settings')
      } finally {
        setLoading(false)
      }
    }
    fetchSettings()
  }, [])

  const handleSave = async () => {
    setSaving(true)
    setSaved(false)
    try {
      await fetch('/api/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(settings),
      })
      setSaved(true)
      setTimeout(() => setSaved(false), 3000)
    } catch (error) {
      console.error('Failed to save settings:', error)
    } finally {
      setSaving(false)
    }
  }

  const updateField = (field: keyof SiteSettings, value: string) => {
    setSettings((prev) => ({ ...prev, [field]: value }))
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-48" />
        <Card>
          <CardContent className="p-6 space-y-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="space-y-2">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-9 w-full" />
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Website & SEO Settings</h1>
          <p className="text-muted-foreground text-sm">Manage website content, contact info, and SEO metadata.</p>
        </div>
        <Button onClick={handleSave} disabled={saving}>
          {saving ? (
            <><IconLoader2 className="h-4 w-4 animate-spin" /> Saving...</>
          ) : saved ? (
            'Saved!'
          ) : (
            'Save All Changes'
          )}
        </Button>
      </div>

      {/* Basic Info */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <IconSettings className="h-4 w-4 text-primary" /> Basic Information
          </CardTitle>
          <CardDescription>Core website details displayed across the site.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="s-name">Site Name</Label>
              <Input
                id="s-name"
                value={settings.siteName}
                onChange={(e) => updateField('siteName', e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="s-desc">Site Description</Label>
              <Input
                id="s-desc"
                value={settings.siteDescription}
                onChange={(e) => updateField('siteDescription', e.target.value)}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Branding */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <IconPhoto className="h-4 w-4 text-primary" /> Branding
          </CardTitle>
          <CardDescription>Logo and favicon URLs (use R2 or external URLs).</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="s-logo">Logo URL</Label>
            <Input
              id="s-logo"
              value={settings.logoUrl}
              onChange={(e) => updateField('logoUrl', e.target.value)}
              placeholder="https://..."
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="s-favicon">Favicon URL</Label>
            <Input
              id="s-favicon"
              value={settings.faviconUrl}
              onChange={(e) => updateField('faviconUrl', e.target.value)}
              placeholder="https://..."
            />
          </div>
        </CardContent>
      </Card>

      {/* Contact Info */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <IconLink className="h-4 w-4 text-primary" /> Contact Information
          </CardTitle>
          <CardDescription>Displayed on the contact page and footer.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="s-email">Contact Email</Label>
              <Input
                id="s-email"
                type="email"
                value={settings.contactEmail}
                onChange={(e) => updateField('contactEmail', e.target.value)}
                placeholder="hello@studiopanda.in"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="s-phone">Contact Phone</Label>
              <Input
                id="s-phone"
                value={settings.contactPhone}
                onChange={(e) => updateField('contactPhone', e.target.value)}
                placeholder="+91 98765 43210"
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="s-address">Studio Address</Label>
            <Textarea
              id="s-address"
              value={settings.contactAddress}
              onChange={(e) => updateField('contactAddress', e.target.value)}
              placeholder="Studio Panda, 123 Wellness Lane, Delhi..."
              rows={2}
            />
          </div>
        </CardContent>
      </Card>

      {/* Social Links */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Social Media Links</CardTitle>
          <CardDescription>Links displayed in the footer and social sections.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            {[
              { key: 'socialInstagram' as const, label: 'Instagram', placeholder: 'https://instagram.com/...' },
              { key: 'socialFacebook' as const, label: 'Facebook', placeholder: 'https://facebook.com/...' },
              { key: 'socialYoutube' as const, label: 'YouTube', placeholder: 'https://youtube.com/...' },
              { key: 'socialTwitter' as const, label: 'Twitter / X', placeholder: 'https://x.com/...' },
            ].map((field) => (
              <div key={field.key} className="space-y-2">
                <Label htmlFor={`s-${field.key}`}>{field.label}</Label>
                <Input
                  id={`s-${field.key}`}
                  value={settings[field.key]}
                  onChange={(e) => updateField(field.key, e.target.value)}
                  placeholder={field.placeholder}
                />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* SEO */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <IconSearch className="h-4 w-4 text-primary" /> SEO & Meta Tags
          </CardTitle>
          <CardDescription>Improve search engine visibility with proper meta tags.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="s-meta-title">Meta Title</Label>
            <Input
              id="s-meta-title"
              value={settings.metaTitle}
              onChange={(e) => updateField('metaTitle', e.target.value)}
              placeholder="Studio Panda | Premium Yoga & Wellness Studio Delhi"
            />
            <p className="text-xs text-muted-foreground">{settings.metaTitle.length}/60 characters</p>
          </div>
          <div className="space-y-2">
            <Label htmlFor="s-meta-desc">Meta Description</Label>
            <Textarea
              id="s-meta-desc"
              value={settings.metaDescription}
              onChange={(e) => updateField('metaDescription', e.target.value)}
              placeholder="Join Studio Delhi's premier yoga and wellness studio..."
              rows={3}
            />
            <p className="text-xs text-muted-foreground">{settings.metaDescription.length}/160 characters</p>
          </div>
          <div className="space-y-2">
            <Label htmlFor="s-meta-keywords">Meta Keywords</Label>
            <Input
              id="s-meta-keywords"
              value={settings.metaKeywords}
              onChange={(e) => updateField('metaKeywords', e.target.value)}
              placeholder="yoga delhi, wellness studio, meditation classes..."
            />
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end">
        <Button onClick={handleSave} disabled={saving} size="lg">
          {saving ? (
            <><IconLoader2 className="h-4 w-4 animate-spin" /> Saving...</>
          ) : saved ? (
            'Saved!'
          ) : (
            'Save All Changes'
          )}
        </Button>
      </div>
    </div>
  )
}
