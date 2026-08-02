'use client'

import { useEffect, useState, useCallback } from 'react'
import Link from 'next/link'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import ReusableRefreshButton from '@/components/reusable-refresh-button'
import { toast } from 'sonner'
import {
  IconBook, IconBuildingStore, IconBell, IconPhoto, IconPlus,
  IconArrowRight, IconSettings, IconUsers, IconMail,
} from '@tabler/icons-react'

interface Stats {
  programs: number
  collaborations: number
  notices: number
  galleryItems: number
  contactMessages: number
  unreadMessages: number
}

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<Stats | null>(null)
  const [loading, setLoading] = useState(true)
  const [lastFetched, setLastFetched] = useState<Date | null>(null)

  const fetchStats = useCallback(async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/stats')
      const data = await res.json()
      setStats(data)
      setLastFetched(new Date())
    } catch {
      toast.error('Failed to load dashboard')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { fetchStats() }, [fetchStats])

  const statCards = stats
    ? [
        { label: 'Programs', value: stats.programs, icon: IconBook, href: '/admin/programs', color: 'text-blue-600 bg-blue-50' },
        { label: 'Collaborations', value: stats.collaborations, icon: IconBuildingStore, href: '/admin/collaborations', color: 'text-purple-600 bg-purple-50' },
        { label: 'Notices', value: stats.notices, icon: IconBell, href: '/admin/notices', color: 'text-amber-600 bg-amber-50' },
        { label: 'Gallery', value: stats.galleryItems, icon: IconPhoto, href: '/admin/gallery', color: 'text-green-600 bg-green-50' },
        {
          label: 'Messages',
          value: stats.contactMessages,
          icon: IconMail,
          href: '/admin/contacts',
          color: 'text-rose-600 bg-rose-50',
          badge: stats.unreadMessages,
        },
      ]
    : []

  const quickActions = [
    { label: 'Add Program', icon: IconPlus, href: '/admin/programs' },
    { label: 'Post Notice', icon: IconPlus, href: '/admin/notices' },
    { label: 'Upload Media', icon: IconPlus, href: '/admin/gallery' },
    { label: 'Add Partner', icon: IconBuildingStore, href: '/admin/collaborations' },
  ]

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Welcome back!</h1>
          <p className="text-muted-foreground text-sm">Manage your Studio Panda website from here.</p>
        </div>
        <ReusableRefreshButton onRefresh={fetchStats} loading={loading} lastFetched={lastFetched} />
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
        {loading
          ? Array.from({ length: 5 }).map((_, i) => (
              <Card key={i}>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="h-10 w-10 rounded-lg" />
                  </div>
                  <Skeleton className="h-8 w-16 mt-3" />
                </CardContent>
              </Card>
            ))
          : statCards.map((stat) => {
              const Icon = stat.icon
              return (
                <Link key={stat.href} href={stat.href}>
                  <Card className="hover:shadow-md transition-shadow cursor-pointer group relative">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-muted-foreground">{stat.label}</span>
                        <div className={`p-2 rounded-lg ${stat.color}`}>
                          <Icon className="h-5 w-5" />
                        </div>
                      </div>
                      <div className="mt-3 flex items-baseline gap-1">
                        <span className="text-2xl font-bold text-foreground">{stat.value}</span>
                        <span className="text-xs text-muted-foreground">items</span>
                      </div>
                      {stat.badge && stat.badge > 0 && (
                        <div className="absolute top-3 right-3">
                          <span className="flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white">
                            {stat.badge}
                          </span>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </Link>
              )
            })}
      </div>

      {/* Quick Actions */}
      <div>
        <h2 className="text-lg font-semibold text-foreground mb-3">Quick Actions</h2>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {quickActions.map((action) => {
            const Icon = action.icon
            return (
              <Link key={action.href} href={action.href}>
                <Button variant="outline" className="w-full justify-start gap-2 h-auto py-3">
                  <Icon className="h-4 w-4 text-primary" />
                  <span>{action.label}</span>
                </Button>
              </Link>
            )
          })}
        </div>
      </div>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Recent Activity</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[
              { icon: IconUsers, text: 'Admin account configured', time: 'Setup complete' },
              { icon: IconSettings, text: 'Website settings ready', time: 'Configured' },
              { icon: IconPhoto, text: 'Gallery upload system ready', time: 'R2 connected' },
            ].map((item, i) => {
              const Icon = item.icon
              return (
                <div key={i} className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                  <div className="p-2 rounded-lg bg-primary/10">
                    <Icon className="h-4 w-4 text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-foreground">{item.text}</p>
                    <p className="text-xs text-muted-foreground">{item.time}</p>
                  </div>
                  <IconArrowRight className="h-4 w-4 text-muted-foreground" />
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
