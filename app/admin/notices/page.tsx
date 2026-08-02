'use client'

import { useEffect, useState, useRef, useCallback } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Skeleton } from '@/components/ui/skeleton'
import { Badge } from '@/components/ui/badge'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { useDebounce } from '@/hooks/use-debounce'
import ReusableRefreshButton from '@/components/reusable-refresh-button'
import TiptapEditor from '@/components/tiptap-editor'
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription,
} from '@/components/ui/dialog'
import { toast } from 'sonner'
  import {
  IconPlus, IconPencil, IconTrash, IconLoader2, IconHome, IconHomeOff,
  IconEye, IconEyeOff, IconSearch, IconFileText, IconDownload, IconX,
  IconPin, IconPhoto,
} from '@tabler/icons-react'

interface Notice {
  id: string
  title: string
  category: string
  content: string
  isPinned: boolean
  pdfUrl?: string
  pdfFileKey?: string
  imageUrl?: string
  isActive: boolean
  showOnHome: boolean
  position: number
  publishDate: string
  createdAt: string
}

const emptyForm = {
  title: '', category: 'NOTICE', content: '', isPinned: false,
  pdfUrl: '', pdfFileKey: '', imageUrl: '', showOnHome: false, isActive: true,
}

export default function AdminNoticesPage() {
  const [notices, setNotices] = useState<Notice[]>([])
  const [loading, setLoading] = useState(true)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [deleteOpen, setDeleteOpen] = useState(false)
  const [editing, setEditing] = useState<Notice | null>(null)
  const [deleting, setDeleting] = useState<Notice | null>(null)
  const [form, setForm] = useState(emptyForm)
  const [saving, setSaving] = useState(false)
  const [deletingItem, setDeletingItem] = useState(false)
  const [search, setSearch] = useState('')
  const debouncedSearch = useDebounce(search, 300)
  const [filter, setFilter] = useState<'all' | 'active' | 'inactive' | 'home'>('all')
  const [uploadingPdf, setUploadingPdf] = useState(false)
  const [uploadingImg, setUploadingImg] = useState(false)
  const pdfInputRef = useRef<HTMLInputElement>(null)
  const imgInputRef = useRef<HTMLInputElement>(null)
  const [lastFetched, setLastFetched] = useState<Date | null>(null)

  const fetchNotices = useCallback(async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/notices')
      const data = await res.json()
      if (Array.isArray(data)) setNotices(data)
      setLastFetched(new Date())
    } catch {
      toast.error('Failed to load notices')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { fetchNotices() }, [fetchNotices])

  const openAdd = () => { setEditing(null); setForm(emptyForm); setDialogOpen(true) }

  const openEdit = (n: Notice) => {
    setEditing(n)
    setForm({
      title: n.title, category: n.category, content: n.content, isPinned: n.isPinned,
      pdfUrl: n.pdfUrl || '', pdfFileKey: n.pdfFileKey || '', imageUrl: n.imageUrl || '',
      showOnHome: n.showOnHome, isActive: n.isActive,
    })
    setDialogOpen(true)
  }

  const handlePdfUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setUploadingPdf(true)
    try {
      const formData = new FormData()
      formData.append('file', file)
      const res = await fetch('/api/upload', { method: 'POST', body: formData })
      const data = await res.json()
      if (data.success) {
        setForm({ ...form, pdfUrl: data.url, pdfFileKey: data.fileKey })
        toast.success('PDF uploaded')
      }
    } catch {
      toast.error('PDF upload failed')
    } finally {
      setUploadingPdf(false)
      if (pdfInputRef.current) pdfInputRef.current.value = ''
    }
  }

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setUploadingImg(true)
    try {
      const formData = new FormData()
      formData.append('file', file)
      const res = await fetch('/api/upload', { method: 'POST', body: formData })
      const data = await res.json()
      if (data.success) {
        setForm({ ...form, imageUrl: data.url })
        toast.success('Image uploaded')
      }
    } catch {
      toast.error('Image upload failed')
    } finally {
      setUploadingImg(false)
      if (imgInputRef.current) imgInputRef.current.value = ''
    }
  }

  const handleSave = async () => {
    if (!form.title.trim() || !form.content.trim()) return
    setSaving(true)
    try {
      const method = editing ? 'PUT' : 'POST'
      const body = editing
        ? { id: editing.id, ...form, position: editing.position }
        : form
      await fetch('/api/notices', {
        method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body),
      })
      await fetchNotices()
      setDialogOpen(false); setEditing(null)
      toast.success(editing ? 'Notice updated' : 'Notice posted')
    } catch {
      toast.error('Failed to save notice')
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async () => {
    if (!deleting) return
    setDeletingItem(true)
    try {
      await fetch(`/api/notices?id=${deleting.id}`, { method: 'DELETE' })
      await fetchNotices()
      setDeleteOpen(false); setDeleting(null)
      toast.success('Notice deleted')
    } catch {
      toast.error('Delete failed')
    } finally {
      setDeletingItem(false)
    }
  }

  const toggleField = async (notice: Notice, field: 'showOnHome' | 'isActive') => {
    try {
      const newVal = !notice[field]
      await fetch('/api/notices', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: notice.id, [field]: newVal }),
      })
      await fetchNotices()
      toast.success(`${field === 'isActive' ? 'Visibility' : 'Home display'} updated`)
    } catch {
      toast.error('Update failed')
    }
  }

  const filtered = notices.filter((n) => {
    if (debouncedSearch && !n.title.toLowerCase().includes(debouncedSearch.toLowerCase())) return false
    if (filter === 'active') return n.isActive
    if (filter === 'inactive') return !n.isActive
    if (filter === 'home') return n.showOnHome
    return true
  })

  const counts = {
    all: notices.length,
    active: notices.filter(n => n.isActive).length,
    inactive: notices.filter(n => !n.isActive).length,
    home: notices.filter(n => n.showOnHome).length,
  }

  const catColors: Record<string, string> = {
    NOTICE: 'bg-blue-50 text-blue-700',
    UPDATE: 'bg-emerald-50 text-emerald-700',
    ANNOUNCEMENT: 'bg-amber-50 text-amber-700',
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Notices & Updates</h1>
          <p className="text-muted-foreground text-sm">Post announcements, upload PDFs, manage visibility.</p>
        </div>
        <div className="flex items-center gap-3">
          <ReusableRefreshButton onRefresh={fetchNotices} loading={loading} lastFetched={lastFetched} />
          <Button onClick={openAdd}><IconPlus className="h-4 w-4 mr-1" /> Post Notice</Button>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap gap-2">
        {(['all', 'active', 'inactive', 'home'] as const).map((f) => (
          <button key={f} onClick={() => setFilter(f)}
            className={`px-4 py-2 rounded-full text-sm font-semibold transition-all ${
              filter === f ? 'bg-primary text-black' : 'bg-zinc-100 text-zinc-600 hover:bg-zinc-200'
            }`}>
            {f === 'all' ? 'All' : f === 'active' ? 'Active' : f === 'inactive' ? 'Inactive' : 'On Home'}
            <span className="ml-1.5 text-xs opacity-60">({counts[f]})</span>
          </button>
        ))}
      </div>

      {/* Search */}
      <div className="relative max-w-sm">
        <IconSearch className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <input placeholder="Search notices..." value={search} onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-zinc-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary" />
      </div>

      {/* Table */}
      {loading ? (
        <div className="space-y-3">{[1, 2, 3, 4].map(i => <Skeleton key={i} className="h-16 w-full rounded-lg" />)}</div>
      ) : filtered.length === 0 ? (
        <div className="rounded-xl border border-zinc-200 bg-white py-16 text-center text-muted-foreground">
          No notices found. Click &quot;Post Notice&quot; to get started.
        </div>
      ) : (
        <div className="rounded-xl border border-zinc-200 bg-white overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-12">#</TableHead>
                <TableHead>Title</TableHead>
                <TableHead className="hidden md:table-cell">Category</TableHead>
                <TableHead className="hidden lg:table-cell">Date</TableHead>
                <TableHead>PDF</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Home</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((notice, idx) => (
                <TableRow key={notice.id}>
                  <TableCell className="font-bold text-muted-foreground">
                    {notice.showOnHome ? <span className="text-primary">#{notice.position}</span> : idx + 1}
                  </TableCell>
                  <TableCell>
                    <div>
                      <div className="flex items-center gap-1.5">
                        <p className="font-semibold text-sm">{notice.title}</p>
                        {notice.isPinned && <IconPin className="h-3 w-3 text-red-500 shrink-0" />}
                      </div>
                      <p className="text-xs text-muted-foreground line-clamp-1" dangerouslySetInnerHTML={{ __html: notice.content.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim().slice(0, 80) }} />
                    </div>
                  </TableCell>
                  <TableCell className="hidden md:table-cell">
                    <Badge variant="secondary" className={`text-xs ${catColors[notice.category] || ''}`}>
                      {notice.category}
                    </Badge>
                  </TableCell>
                  <TableCell className="hidden lg:table-cell text-muted-foreground text-sm">
                    {new Date(notice.publishDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
                  </TableCell>
                  <TableCell>
                    {notice.pdfUrl ? (
                      <a href={notice.pdfUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-xs font-medium text-red-600 hover:underline">
                        <IconFileText className="h-3.5 w-3.5" /> PDF
                      </a>
                    ) : (
                      <span className="text-xs text-zinc-400">-</span>
                    )}
                  </TableCell>
                  <TableCell>
                    <button onClick={() => toggleField(notice, 'isActive')}
                      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold transition-all ${
                        notice.isActive ? 'bg-green-50 text-green-700 hover:bg-green-100' : 'bg-zinc-100 text-zinc-500 hover:bg-zinc-200'
                      }`}>
                      {notice.isActive ? <IconEye className="h-3 w-3" /> : <IconEyeOff className="h-3 w-3" />}
                      {notice.isActive ? 'Active' : 'Inactive'}
                    </button>
                  </TableCell>
                  <TableCell>
                    <button onClick={() => toggleField(notice, 'showOnHome')}
                      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold transition-all ${
                        notice.showOnHome ? 'bg-primary text-black' : 'bg-zinc-100 text-zinc-500 hover:bg-zinc-200'
                      }`}>
                      {notice.showOnHome ? <IconHome className="h-3 w-3" /> : <IconHomeOff className="h-3 w-3" />}
                      {notice.showOnHome ? `#${notice.position}` : 'Hidden'}
                    </button>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-1">
                      <Button variant="ghost" size="icon-sm" onClick={() => openEdit(notice)}>
                        <IconPencil className="h-3.5 w-3.5" />
                      </Button>
                      <Button variant="ghost" size="icon-sm" onClick={() => { setDeleting(notice); setDeleteOpen(true) }}>
                        <IconTrash className="h-3.5 w-3.5 text-destructive" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}

      {/* Add/Edit Dialog - Fullscreen */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="!max-w-[95vw] !w-[95vw] !h-[90vh] !p-0 !gap-0 !rounded-2xl flex flex-col">
          <DialogHeader className="px-6 py-4 border-b border-zinc-200 shrink-0">
            <DialogTitle>{editing ? 'Edit Notice' : 'Post New Notice'}</DialogTitle>
            <DialogDescription>{editing ? 'Update notice details.' : 'Share an announcement or update.'}</DialogDescription>
          </DialogHeader>

          <div className="flex-1 overflow-y-auto px-6 py-4">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Left: Content Editor (2/3) */}
              <div className="lg:col-span-2 space-y-4">
                <div className="space-y-2">
                  <Label>Title *</Label>
                  <Input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="e.g. Holiday Schedule Change" className="text-base" />
                </div>
                <div className="space-y-2">
                  <Label>Content *</Label>
                  <TiptapEditor content={form.content} onChange={(html) => setForm({ ...form, content: html })} placeholder="Write your notice..." minHeight="300px" />
                </div>
              </div>

              {/* Right: Settings (1/3) */}
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>Category</Label>
                  <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })}
                    className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring">
                    <option value="NOTICE">Notice</option>
                    <option value="UPDATE">Update</option>
                    <option value="ANNOUNCEMENT">Announcement</option>
                  </select>
                </div>

                {/* Image Upload */}
                <div className="space-y-2">
                  <Label>Image (optional)</Label>
                  {form.imageUrl ? (
                    <div className="relative rounded-xl overflow-hidden border border-zinc-200">
                      <img src={form.imageUrl} alt="Preview" className="w-full h-36 object-cover" />
                      <button type="button" onClick={() => setForm({ ...form, imageUrl: '' })}
                        className="absolute top-2 right-2 p-1.5 rounded-full bg-white/90 backdrop-blur hover:bg-white shadow-sm">
                        <IconX className="h-4 w-4 text-zinc-600" />
                      </button>
                    </div>
                  ) : (
                    <button type="button" onClick={() => imgInputRef.current?.click()} disabled={uploadingImg}
                      className="w-full h-24 rounded-xl border-2 border-dashed border-zinc-200 hover:border-primary/40 hover:bg-primary/5 transition-all flex flex-col items-center justify-center gap-2">
                      {uploadingImg ? (
                        <IconLoader2 className="h-5 w-5 text-primary animate-spin" />
                      ) : (
                        <>
                          <IconPhoto className="h-5 w-5 text-zinc-400" />
                          <span className="text-xs text-zinc-500 font-medium">Click to upload image</span>
                        </>
                      )}
                    </button>
                  )}
                  <input ref={imgInputRef} type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
                </div>

                {/* PDF Upload */}
                <div className="space-y-2">
                  <Label>PDF Document (optional)</Label>
                  {form.pdfUrl ? (
                    <div className="flex items-center gap-3 p-3 rounded-xl border border-red-200 bg-red-50">
                      <IconFileText className="h-5 w-5 text-red-500 shrink-0" />
                      <span className="text-sm font-medium text-red-700 truncate flex-1">{form.pdfFileKey || 'Uploaded PDF'}</span>
                      <a href={form.pdfUrl} target="_blank" rel="noopener noreferrer" className="text-red-600 hover:underline">
                        <IconDownload className="h-4 w-4" />
                      </a>
                      <button type="button" onClick={() => setForm({ ...form, pdfUrl: '', pdfFileKey: '' })} className="text-red-400 hover:text-red-600">
                        <IconX className="h-4 w-4" />
                      </button>
                    </div>
                  ) : (
                    <button type="button" onClick={() => pdfInputRef.current?.click()} disabled={uploadingPdf}
                      className="w-full h-24 rounded-xl border-2 border-dashed border-zinc-200 hover:border-red-300 hover:bg-red-50 transition-all flex flex-col items-center justify-center gap-2">
                      {uploadingPdf ? (
                        <IconLoader2 className="h-5 w-5 text-primary animate-spin" />
                      ) : (
                        <>
                          <IconFileText className="h-5 w-5 text-zinc-400" />
                          <span className="text-xs text-zinc-500 font-medium">Click to upload PDF</span>
                        </>
                      )}
                    </button>
                  )}
                  <input ref={pdfInputRef} type="file" accept=".pdf" className="hidden" onChange={handlePdfUpload} />
                </div>

                {/* Toggles */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 rounded-xl border border-zinc-200 bg-zinc-50">
                    <div className="flex items-center gap-2">
                      <IconHome className="h-4 w-4 text-primary" />
                      <span className="text-sm font-medium">Show on Home</span>
                    </div>
                    <button type="button" onClick={() => setForm({ ...form, showOnHome: !form.showOnHome })}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${form.showOnHome ? 'bg-primary' : 'bg-zinc-300'}`}>
                      <span className={`inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform ${form.showOnHome ? 'translate-x-6' : 'translate-x-1'}`} />
                    </button>
                  </div>
                  <div className="flex items-center justify-between p-3 rounded-xl border border-zinc-200 bg-zinc-50">
                    <div className="flex items-center gap-2">
                      <IconEye className="h-4 w-4 text-green-600" />
                      <span className="text-sm font-medium">Active</span>
                    </div>
                    <button type="button" onClick={() => setForm({ ...form, isActive: !form.isActive })}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${form.isActive ? 'bg-green-500' : 'bg-zinc-300'}`}>
                      <span className={`inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform ${form.isActive ? 'translate-x-6' : 'translate-x-1'}`} />
                    </button>
                  </div>
                  <div className="flex items-center justify-between p-3 rounded-xl border border-zinc-200 bg-zinc-50">
                    <div className="flex items-center gap-2">
                      <IconPin className="h-4 w-4 text-red-500" />
                      <span className="text-sm font-medium">Pinned</span>
                    </div>
                    <button type="button" onClick={() => setForm({ ...form, isPinned: !form.isPinned })}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${form.isPinned ? 'bg-red-500' : 'bg-zinc-300'}`}>
                      <span className={`inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform ${form.isPinned ? 'translate-x-6' : 'translate-x-1'}`} />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <DialogFooter className="px-6 py-4 border-t border-zinc-200 shrink-0">
            <Button variant="outline" onClick={() => setDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleSave} disabled={saving || !form.title.trim() || !form.content.trim()}>
              {saving && <IconLoader2 className="h-4 w-4 animate-spin mr-1" />}
              {editing ? 'Save Changes' : 'Post Notice'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Dialog */}
      <Dialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <DialogContent className="sm:max-w-sm">
          <DialogHeader>
            <DialogTitle>Delete Notice</DialogTitle>
            <DialogDescription>Delete &quot;{deleting?.title}&quot;? This cannot be undone.</DialogDescription>
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
