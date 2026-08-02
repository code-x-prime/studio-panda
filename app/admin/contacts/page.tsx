'use client'

import { useEffect, useState, useCallback } from 'react'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { useDebounce } from '@/hooks/use-debounce'
import ReusableRefreshButton from '@/components/reusable-refresh-button'
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription,
} from '@/components/ui/dialog'
import { toast } from 'sonner'
import {
  IconMail, IconMailOpened, IconTrash, IconArrowLeft, IconSchool, IconClock,
  IconLoader2, IconSearch, IconEye,
} from '@tabler/icons-react'

interface ContactMessage {
  id: string
  name: string
  email: string
  phone: string | null
  subject: string | null
  message: string
  isRead: boolean
  createdAt: string
}

function formatDate(dateStr: string) {
  const d = new Date(dateStr)
  const now = new Date()
  const diffMs = now.getTime() - d.getTime()
  const diffMins = Math.floor(diffMs / 60000)
  const diffHrs = Math.floor(diffMs / 3600000)
  const diffDays = Math.floor(diffMs / 86400000)

  if (diffMins < 1) return 'Just now'
  if (diffMins < 60) return `${diffMins}m ago`
  if (diffHrs < 24) return `${diffHrs}h ago`
  if (diffDays < 7) return `${diffDays}d ago`
  return d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })
}

export default function AdminContactsPage() {
  const [messages, setMessages] = useState<ContactMessage[]>([])
  const [loading, setLoading] = useState(true)
  const [selected, setSelected] = useState<ContactMessage | null>(null)
  const [actionLoading, setActionLoading] = useState<string | null>(null)
  const [search, setSearch] = useState('')
  const debouncedSearch = useDebounce(search, 300)
  const [filter, setFilter] = useState<'all' | 'unread' | 'read'>('all')
  const [deleteOpen, setDeleteOpen] = useState(false)
  const [deleting, setDeleting] = useState<ContactMessage | null>(null)
  const [deletingItem, setDeletingItem] = useState(false)
  const [lastFetched, setLastFetched] = useState<Date | null>(null)

  const fetchMessages = useCallback(async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/admin/contact')
      const data = await res.json()
      if (Array.isArray(data)) setMessages(data)
      setLastFetched(new Date())
    } catch {
      toast.error('Failed to load messages')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { fetchMessages() }, [fetchMessages])

  const markRead = async (msg: ContactMessage) => {
    setActionLoading(msg.id)
    try {
      await fetch('/api/admin/contact', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: msg.id, isRead: true }),
      })
      setMessages((prev) => prev.map((m) => m.id === msg.id ? { ...m, isRead: true } : m))
      setSelected((prev) => prev && prev.id === msg.id ? { ...prev, isRead: true } : prev)
    } catch {
      toast.error('Failed to mark as read')
    } finally {
      setActionLoading(null)
    }
  }

  const openDelete = (msg: ContactMessage) => { setDeleting(msg); setDeleteOpen(true) }

  const handleDelete = async () => {
    if (!deleting) return
    setDeletingItem(true)
    setActionLoading(deleting.id)
    try {
      await fetch('/api/admin/contact', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: deleting.id }),
      })
      setMessages((prev) => prev.filter((m) => m.id !== deleting.id))
      setSelected((prev) => prev && prev.id === deleting.id ? null : prev)
      setDeleteOpen(false)
      setDeleting(null)
      toast.success('Message deleted')
    } catch {
      toast.error('Failed to delete message')
    } finally {
      setDeletingItem(false)
      setActionLoading(null)
    }
  }

  const filtered = messages.filter((m) => {
    if (debouncedSearch && !m.name.toLowerCase().includes(debouncedSearch.toLowerCase()) && !m.email.toLowerCase().includes(debouncedSearch.toLowerCase())) return false
    if (filter === 'unread') return !m.isRead
    if (filter === 'read') return m.isRead
    return true
  })

  const unreadCount = messages.filter((m) => !m.isRead).length
  const counts = {
    all: messages.length,
    unread: unreadCount,
    read: messages.length - unreadCount,
  }

  // Detail view
  if (selected) {
    return (
      <div>
        <div className="flex items-center gap-4 mb-6">
          <Button variant="ghost" size="sm" onClick={() => setSelected(null)}>
            <IconArrowLeft className="h-4 w-4 mr-2" /> Back
          </Button>
          <h1 className="text-xl font-bold">Message Detail</h1>
        </div>

        <div className="rounded-xl border border-zinc-200 bg-white p-6 sm:p-8 space-y-6">
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-lg shrink-0">
                {selected.name.charAt(0).toUpperCase()}
              </div>
              <div>
                <h2 className="text-lg font-bold text-zinc-900">{selected.name}</h2>
                <p className="text-sm text-zinc-500">{selected.email}</p>
              </div>
            </div>
            <div className="flex gap-2 shrink-0">
              {!selected.isRead && (
                <Button size="sm" variant="outline" onClick={() => markRead(selected)} disabled={actionLoading === selected.id}>
                  {actionLoading === selected.id ? <IconLoader2 className="h-4 w-4 animate-spin mr-1" /> : <IconMailOpened className="h-4 w-4 mr-1" />}
                  Mark Read
                </Button>
              )}
              <Button size="sm" variant="destructive" onClick={() => openDelete(selected)} disabled={actionLoading === selected.id}>
                <IconTrash className="h-4 w-4 mr-1" /> Delete
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
            <div className="p-3 rounded-xl bg-zinc-50 border border-zinc-100">
              <p className="text-zinc-400 text-xs mb-1">School / Name</p>
              <p className="font-medium text-zinc-900 flex items-center gap-2">
                <IconSchool className="h-4 w-4 text-zinc-400" /> {selected.name}
              </p>
            </div>
            <div className="p-3 rounded-xl bg-zinc-50 border border-zinc-100">
              <p className="text-zinc-400 text-xs mb-1">Email</p>
              <p className="font-medium text-zinc-900 flex items-center gap-2">
                <IconMail className="h-4 w-4 text-zinc-400" /> {selected.email}
              </p>
            </div>
            {selected.phone && (
              <div className="p-3 rounded-xl bg-zinc-50 border border-zinc-100">
                <p className="text-zinc-400 text-xs mb-1">Phone</p>
                <p className="font-medium text-zinc-900">{selected.phone}</p>
              </div>
            )}
            {selected.subject && (
              <div className="p-3 rounded-xl bg-zinc-50 border border-zinc-100">
                <p className="text-zinc-400 text-xs mb-1">Subject</p>
                <p className="font-medium text-zinc-900">{selected.subject}</p>
              </div>
            )}
            <div className="p-3 rounded-xl bg-zinc-50 border border-zinc-100">
              <p className="text-zinc-400 text-xs mb-1">Received</p>
              <p className="font-medium text-zinc-900 flex items-center gap-2">
                <IconClock className="h-4 w-4 text-zinc-400" />
                {new Date(selected.createdAt).toLocaleString('en-IN', {
                  day: 'numeric', month: 'short', year: 'numeric',
                  hour: '2-digit', minute: '2-digit',
                })}
              </p>
            </div>
            <div className="p-3 rounded-xl bg-zinc-50 border border-zinc-100">
              <p className="text-zinc-400 text-xs mb-1">Status</p>
              <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                selected.isRead ? 'bg-green-50 text-green-700' : 'bg-amber-50 text-amber-700'
              }`}>
                {selected.isRead ? 'Read' : 'Unread'}
              </span>
            </div>
          </div>

          <div className="border-t border-zinc-100 pt-6">
            <p className="text-zinc-400 text-xs mb-3">Message</p>
            <div className="bg-zinc-50 rounded-xl p-5 text-sm leading-relaxed whitespace-pre-wrap text-zinc-700 border border-zinc-100">
              {selected.message}
            </div>
          </div>

          <div className="flex gap-3">
            <a href={`mailto:${selected.email}?subject=Re: ${selected.subject || 'Your enquiry'}`}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-primary text-black font-semibold text-sm hover:bg-primary/90 transition-colors">
              <IconMail className="h-4 w-4" /> Reply via Email
            </a>
            {selected.phone && (
              <a href={`tel:${selected.phone}`}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-zinc-200 text-zinc-700 font-semibold text-sm hover:bg-zinc-50 transition-colors">
                <IconPhone className="h-4 w-4" /> Call
              </a>
            )}
          </div>
        </div>
      </div>
    )
  }

  // List view
  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Contact Messages</h1>
          <p className="text-muted-foreground text-sm">
            {messages.length} total {unreadCount > 0 && <span className="text-primary font-semibold"> · {unreadCount} unread</span>}
          </p>
        </div>
        <ReusableRefreshButton onRefresh={fetchMessages} loading={loading} lastFetched={lastFetched} />
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap gap-2">
        {(['all', 'unread', 'read'] as const).map((f) => (
          <button key={f} onClick={() => setFilter(f)}
            className={`px-4 py-2 rounded-full text-sm font-semibold transition-all ${
              filter === f ? 'bg-primary text-black' : 'bg-zinc-100 text-zinc-600 hover:bg-zinc-200'
            }`}>
            {f === 'all' ? 'All' : f === 'unread' ? 'Unread' : 'Read'}
            <span className="ml-1.5 text-xs opacity-60">({counts[f]})</span>
          </button>
        ))}
      </div>

      {/* Search */}
      <div className="relative max-w-sm">
        <IconSearch className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <input placeholder="Search by name or email..." value={search} onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-zinc-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary" />
      </div>

      {/* Messages */}
      {loading ? (
        <div className="space-y-3">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="rounded-xl border border-zinc-200 bg-white p-4 animate-pulse">
              <div className="flex items-start gap-4">
                <Skeleton className="h-10 w-10 rounded-full shrink-0" />
                <div className="flex-1">
                  <Skeleton className="h-4 w-1/3 mb-2" />
                  <Skeleton className="h-3 w-1/2 mb-2" />
                  <Skeleton className="h-3 w-2/3" />
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="rounded-xl border border-zinc-200 bg-white py-16 text-center">
          <IconMail className="h-12 w-12 text-zinc-200 mx-auto mb-3" stroke={1.5} />
          <p className="text-zinc-500 font-medium">No messages found.</p>
        </div>
      ) : (
        <div className="space-y-2">
          {filtered.map((msg) => (
            <div key={msg.id}
              onClick={() => { setSelected(msg); if (!msg.isRead) markRead(msg) }}
              className={`rounded-xl border bg-white p-4 sm:p-5 flex items-start gap-4 cursor-pointer transition-all hover:shadow-md ${
                !msg.isRead ? 'border-primary/30 bg-primary/[0.02]' : 'border-zinc-200'
              }`}>
              <div className={`h-10 w-10 rounded-full flex items-center justify-center text-sm font-bold shrink-0 ${
                !msg.isRead ? 'bg-primary/10 text-primary' : 'bg-zinc-100 text-zinc-500'
              }`}>
                {msg.name.charAt(0).toUpperCase()}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <p className={`font-semibold text-sm ${!msg.isRead ? 'text-zinc-900' : 'text-zinc-500'}`}>
                    {msg.name}
                  </p>
                  {!msg.isRead && <span className="h-2 w-2 rounded-full bg-primary shrink-0" />}
                  <span className="text-xs text-zinc-400 ml-auto shrink-0">
                    {formatDate(msg.createdAt)}
                  </span>
                </div>
                <p className="text-xs text-zinc-400 truncate">{msg.email}</p>
                <p className="text-sm text-zinc-500 mt-1 line-clamp-2">{msg.message}</p>
                {msg.subject && (
                  <p className="text-xs text-zinc-400 mt-1">Re: {msg.subject}</p>
                )}
              </div>
              <div className="flex items-center gap-1 shrink-0">
                <button
                  onClick={(e) => { e.stopPropagation(); setSelected(msg); if (!msg.isRead) markRead(msg) }}
                  className="p-1.5 rounded-lg hover:bg-primary/10 text-zinc-400 hover:text-primary transition-colors"
                  title="View details"
                >
                  <IconEye className="h-4 w-4" />
                </button>
                <button
                  onClick={(e) => { e.stopPropagation(); openDelete(msg) }}
                  className="p-1.5 rounded-lg hover:bg-red-50 text-zinc-400 hover:text-red-500 transition-colors"
                  title="Delete"
                >
                  <IconTrash className="h-4 w-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Delete Confirmation */}
      <Dialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <DialogContent className="sm:max-w-sm">
          <DialogHeader>
            <DialogTitle>Delete Message</DialogTitle>
            <DialogDescription>
              Delete message from &quot;{deleting?.name}&quot;? This cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteOpen(false)}>Cancel</Button>
            <Button variant="destructive" onClick={handleDelete} disabled={deletingItem}>
              {deletingItem && <IconLoader2 className="h-4 w-4 animate-spin mr-1" />} Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

function IconPhone(props: { className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={props.className}>
      <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
      <path d="M5 4h4l2 5l-2.5 1.5a11 11 0 0 0 5 5l1.5 -2.5l5 2v4a2 2 0 0 1 -2 2a16 16 0 0 1 -15 -15a2 2 0 0 1 2 -2" />
    </svg>
  )
}
