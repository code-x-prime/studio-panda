'use client'

import { useEffect, useState, useRef, useCallback } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Skeleton } from '@/components/ui/skeleton'
import { Badge } from '@/components/ui/badge'
import { useDebounce } from '@/hooks/use-debounce'
import ReusableRefreshButton from '@/components/reusable-refresh-button'
import TiptapEditor from '@/components/tiptap-editor'
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription,
} from '@/components/ui/dialog'
import { toast } from 'sonner'
import {
  IconPlus, IconPencil, IconTrash, IconLoader2, IconHome, IconHomeOff,
  IconEye, IconEyeOff, IconSearch, IconUpload, IconX, IconExternalLink,
  IconPhoto,
} from '@tabler/icons-react'

interface Collaboration {
  id: string
  title: string
  partnerName: string
  partnerLogo?: string
  imageUrl?: string
  description: string
  websiteUrl?: string
  type?: string
  date?: string
  isFeatured: boolean
  isActive: boolean
  showOnHome: boolean
  position: number
  createdAt: string
}

const emptyForm = {
  title: '', partnerName: '', description: '', websiteUrl: '', type: '',
  date: '', isFeatured: true, showOnHome: false, isActive: true,
  imageUrl: '',
}

export default function AdminCollaborationsPage() {
  const [collabs, setCollabs] = useState<Collaboration[]>([])
  const [loading, setLoading] = useState(true)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [deleteOpen, setDeleteOpen] = useState(false)
  const [editing, setEditing] = useState<Collaboration | null>(null)
  const [deleting, setDeleting] = useState<Collaboration | null>(null)
  const [form, setForm] = useState(emptyForm)
  const [saving, setSaving] = useState(false)
  const [deletingItem, setDeletingItem] = useState(false)
  const [search, setSearch] = useState('')
  const debouncedSearch = useDebounce(search, 300)
  const [filter, setFilter] = useState<'all' | 'active' | 'inactive' | 'home'>('all')
  const [uploading, setUploading] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [lastFetched, setLastFetched] = useState<Date | null>(null)

  const fetchCollabs = useCallback(async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/collaborations')
      const data = await res.json()
      if (Array.isArray(data)) setCollabs(data)
      setLastFetched(new Date())
    } catch {
      toast.error('Failed to load collaborations')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { fetchCollabs() }, [fetchCollabs])

  const openAdd = () => { setEditing(null); setForm(emptyForm); setDialogOpen(true) }

  const openEdit = (c: Collaboration) => {
    setEditing(c)
    setForm({
      title: c.title || '', partnerName: c.partnerName, description: c.description,
      websiteUrl: c.websiteUrl || '', type: c.type || '', date: c.date || '',
      isFeatured: c.isFeatured, showOnHome: c.showOnHome, isActive: c.isActive,
      imageUrl: c.imageUrl || '',
    })
    setDialogOpen(true)
  }

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setUploading(true)
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
      toast.error('Upload failed')
    } finally {
      setUploading(false)
      if (fileInputRef.current) fileInputRef.current.value = ''
    }
  }

  const handleSave = async () => {
    if (!form.partnerName.trim() || !form.description.trim()) return
    setSaving(true)
    try {
      const method = editing ? 'PUT' : 'POST'
      const body = editing
        ? { id: editing.id, ...form, position: editing.position }
        : form
      await fetch('/api/collaborations', {
        method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body),
      })
      await fetchCollabs()
      setDialogOpen(false); setEditing(null)
      toast.success(editing ? 'Collaboration updated' : 'Collaboration created')
    } catch {
      toast.error('Failed to save')
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async () => {
    if (!deleting) return
    setDeletingItem(true)
    try {
      await fetch(`/api/collaborations?id=${deleting.id}`, { method: 'DELETE' })
      await fetchCollabs()
      setDeleteOpen(false); setDeleting(null)
      toast.success('Collaboration deleted')
    } catch {
      toast.error('Delete failed')
    } finally {
      setDeletingItem(false)
    }
  }

  const toggleField = async (collab: Collaboration, field: 'showOnHome' | 'isActive') => {
    try {
      const newVal = !collab[field]
      await fetch('/api/collaborations', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: collab.id, [field]: newVal }),
      })
      await fetchCollabs()
      toast.success(`${field === 'isActive' ? 'Visibility' : 'Home display'} updated`)
    } catch {
      toast.error('Update failed')
    }
  }

  const filtered = collabs.filter((c) => {
    if (debouncedSearch && !c.partnerName.toLowerCase().includes(debouncedSearch.toLowerCase()) && !c.title.toLowerCase().includes(debouncedSearch.toLowerCase())) return false
    if (filter === 'active') return c.isActive
    if (filter === 'inactive') return !c.isActive
    if (filter === 'home') return c.showOnHome
    return true
  })

  const counts = {
    all: collabs.length,
    active: collabs.filter(c => c.isActive).length,
    inactive: collabs.filter(c => !c.isActive).length,
    home: collabs.filter(c => c.showOnHome).length,
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Collaborations & Partnerships</h1>
          <p className="text-muted-foreground text-sm">Manage partner schools and organizations.</p>
        </div>
        <div className="flex items-center gap-3">
          <ReusableRefreshButton onRefresh={fetchCollabs} loading={loading} lastFetched={lastFetched} />
          <Button onClick={openAdd}><IconPlus className="h-4 w-4 mr-1" /> Add Collaboration</Button>
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
        <input placeholder="Search collaborations..." value={search} onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-zinc-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary" />
      </div>

      {/* Cards Grid */}
      {loading ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="rounded-xl border border-zinc-200 bg-white p-5 animate-pulse">
              <Skeleton className="h-40 w-full rounded-lg mb-4" />
              <Skeleton className="h-5 w-2/3 mb-2" />
              <Skeleton className="h-4 w-full mb-2" />
              <Skeleton className="h-4 w-1/2 mb-4" />
              <Skeleton className="h-6 w-16" />
            </div>
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="rounded-xl border border-zinc-200 bg-white py-16 text-center text-muted-foreground">
          No collaborations found. Click &quot;Add Collaboration&quot; to get started.
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((collab) => (
            <div key={collab.id} className="group rounded-xl border border-zinc-200 bg-white overflow-hidden hover:shadow-md transition-shadow">
              {collab.imageUrl && (
                <div className="relative h-40 bg-zinc-100 overflow-hidden">
                  <img src={collab.imageUrl} alt={collab.partnerName} className="w-full h-full object-cover" />
                  <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button variant="ghost" size="icon-sm" className="bg-white/90 backdrop-blur" onClick={() => openEdit(collab)}>
                      <IconPencil className="h-3.5 w-3.5" />
                    </Button>
                    <Button variant="ghost" size="icon-sm" className="bg-white/90 backdrop-blur" onClick={() => { setDeleting(collab); setDeleteOpen(true) }}>
                      <IconTrash className="h-3.5 w-3.5 text-destructive" />
                    </Button>
                  </div>
                </div>
              )}
              <div className="p-5">
                <div className="flex items-start justify-between gap-2 mb-2">
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold text-sm">{collab.partnerName}</h3>
                    {!collab.imageUrl && (
                      <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Button variant="ghost" size="icon-sm" onClick={() => openEdit(collab)}>
                          <IconPencil className="h-3.5 w-3.5" />
                        </Button>
                        <Button variant="ghost" size="icon-sm" onClick={() => { setDeleting(collab); setDeleteOpen(true) }}>
                          <IconTrash className="h-3.5 w-3.5 text-destructive" />
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
                <p className="text-xs text-muted-foreground mb-3 line-clamp-2" dangerouslySetInnerHTML={{ __html: collab.description.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim().slice(0, 120) }} />
                <div className="flex items-center gap-2 flex-wrap">
                  {collab.type && <Badge variant="secondary" className="text-xs">{collab.type}</Badge>}
                  <button onClick={() => toggleField(collab, 'isActive')}
                    className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold transition-all ${
                      collab.isActive ? 'bg-green-50 text-green-700 hover:bg-green-100' : 'bg-zinc-100 text-zinc-500 hover:bg-zinc-200'
                    }`}>
                    {collab.isActive ? <IconEye className="h-3 w-3" /> : <IconEyeOff className="h-3 w-3" />}
                    {collab.isActive ? 'Active' : 'Inactive'}
                  </button>
                  <button onClick={() => toggleField(collab, 'showOnHome')}
                    className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold transition-all ${
                      collab.showOnHome ? 'bg-primary text-black' : 'bg-zinc-100 text-zinc-500 hover:bg-zinc-200'
                    }`}>
                    {collab.showOnHome ? <IconHome className="h-3 w-3" /> : <IconHomeOff className="h-3 w-3" />}
                    {collab.showOnHome ? `#${collab.position}` : 'Hidden'}
                  </button>
                  {collab.websiteUrl && (
                    <a href={collab.websiteUrl} target="_blank" rel="noopener noreferrer" className="text-xs text-primary font-bold hover:underline flex items-center gap-1">
                      <IconExternalLink className="h-3 w-3" /> Website
                    </a>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add/Edit Dialog - Fullscreen */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="!max-w-[95vw] !w-[95vw] !h-[90vh] !p-0 !gap-0 !rounded-2xl flex flex-col">
          <DialogHeader className="px-6 py-4 border-b border-zinc-200 shrink-0">
            <DialogTitle>{editing ? 'Edit Collaboration' : 'Add New Collaboration'}</DialogTitle>
            <DialogDescription>{editing ? 'Update partnership details.' : 'Enter partner school details.'}</DialogDescription>
          </DialogHeader>

          <div className="flex-1 overflow-y-auto px-6 py-4">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Left: Content (2/3) */}
              <div className="lg:col-span-2 space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Partner Name *</Label>
                    <Input value={form.partnerName} onChange={(e) => setForm({ ...form, partnerName: e.target.value })} placeholder="e.g. Delhi Public School" />
                  </div>
                  <div className="space-y-2">
                    <Label>Title</Label>
                    <Input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="e.g. Media Lab Partnership" />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Description *</Label>
                  <TiptapEditor content={form.description} onChange={(html) => setForm({ ...form, description: html })} placeholder="Describe the partnership..." minHeight="200px" />
                </div>
              </div>

              {/* Right: Settings (1/3) */}
              <div className="space-y-4">
                {/* Image Upload */}
                <div className="space-y-2">
                  <Label>Partner Image</Label>
                  {form.imageUrl ? (
                    <div className="relative rounded-xl overflow-hidden border border-zinc-200">
                      <img src={form.imageUrl} alt="Preview" className="w-full h-40 object-cover" />
                      <button type="button" onClick={() => setForm({ ...form, imageUrl: '' })}
                        className="absolute top-2 right-2 p-1.5 rounded-full bg-white/90 backdrop-blur hover:bg-white shadow-sm">
                        <IconX className="h-4 w-4 text-zinc-600" />
                      </button>
                    </div>
                  ) : (
                    <button type="button" onClick={() => fileInputRef.current?.click()} disabled={uploading}
                      className="w-full h-32 rounded-xl border-2 border-dashed border-zinc-200 hover:border-primary/40 hover:bg-primary/5 transition-all flex flex-col items-center justify-center gap-2">
                      {uploading ? (
                        <IconLoader2 className="h-6 w-6 text-primary animate-spin" />
                      ) : (
                        <>
                          <IconPhoto className="h-6 w-6 text-zinc-400" />
                          <span className="text-xs text-zinc-500 font-medium">Click to upload image</span>
                        </>
                      )}
                    </button>
                  )}
                  <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-2">
                    <Label>Type</Label>
                    <Input value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })} placeholder="e.g. School, Ed-Tech" />
                  </div>
                  <div className="space-y-2">
                    <Label>Website URL</Label>
                    <Input value={form.websiteUrl} onChange={(e) => setForm({ ...form, websiteUrl: e.target.value })} placeholder="https://..." />
                  </div>
                </div>

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
                </div>
              </div>
            </div>
          </div>

          <DialogFooter className="px-6 py-4 border-t border-zinc-200 shrink-0">
            <Button variant="outline" onClick={() => setDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleSave} disabled={saving || !form.partnerName.trim() || !form.description.trim()}>
              {saving && <IconLoader2 className="h-4 w-4 animate-spin mr-1" />}
              {editing ? 'Save Changes' : 'Create Collaboration'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Dialog */}
      <Dialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <DialogContent className="sm:max-w-sm">
          <DialogHeader>
            <DialogTitle>Delete Collaboration</DialogTitle>
            <DialogDescription>Delete &quot;{deleting?.partnerName}&quot;? This cannot be undone.</DialogDescription>
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
