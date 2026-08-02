'use client'

import { useEffect, useState, useRef, useCallback } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Skeleton } from '@/components/ui/skeleton'
import { Badge } from '@/components/ui/badge'
import { useDebounce } from '@/hooks/use-debounce'
import ReusableRefreshButton from '@/components/reusable-refresh-button'
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription,
} from '@/components/ui/dialog'
import { toast } from 'sonner'
import {
  IconPlus, IconTrash, IconLoader2, IconEye, IconEyeOff, IconDownload,
  IconHome, IconHomeOff, IconSearch, IconPhoto, IconFile,
  IconUpload, IconPencil,
} from '@tabler/icons-react'

interface GalleryItem {
  id: string
  title: string
  type: string
  url: string
  fileKey: string
  category: string
  mimeType: string | null
  size: number | null
  isActive: boolean
  showOnHome: boolean
  position: number
  createdAt: string
}

export default function AdminGalleryPage() {
  const [items, setItems] = useState<GalleryItem[]>([])
  const [loading, setLoading] = useState(true)
  const [uploading, setUploading] = useState(false)
  const [deleteOpen, setDeleteOpen] = useState(false)
  const [deleting, setDeleting] = useState<GalleryItem | null>(null)
  const [deletingItem, setDeletingItem] = useState(false)
  const [uploadTitle, setUploadTitle] = useState('')
  const [uploadCategory, setUploadCategory] = useState('Events')
  const [search, setSearch] = useState('')
  const debouncedSearch = useDebounce(search, 300)
  const [filter, setFilter] = useState<'all' | 'active' | 'inactive' | 'home'>('all')
  const [editOpen, setEditOpen] = useState(false)
  const [editing, setEditing] = useState<GalleryItem | null>(null)
  const [editTitle, setEditTitle] = useState('')
  const [editCategory, setEditCategory] = useState('')
  const [saving, setSaving] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [lastFetched, setLastFetched] = useState<Date | null>(null)

  const fetchItems = useCallback(async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/gallery')
      const data = await res.json()
      if (Array.isArray(data)) setItems(data)
      setLastFetched(new Date())
    } catch {
      toast.error('Failed to load gallery')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { fetchItems() }, [fetchItems])

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setUploading(true)
    try {
      const formData = new FormData()
      formData.append('file', file)
      const uploadRes = await fetch('/api/upload', { method: 'POST', body: formData })
      if (!uploadRes.ok) throw new Error('Upload failed')
      const { url, fileKey } = await uploadRes.json()

      const isImage = file.type.startsWith('image/')
      await fetch('/api/gallery', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: uploadTitle || file.name,
          type: isImage ? 'IMAGE' : 'DOCUMENT',
          url, fileKey,
          category: uploadCategory,
          mimeType: file.type,
          size: file.size,
        }),
      })
      await fetchItems()
      setUploadTitle('')
      setUploadCategory('Events')
      if (fileInputRef.current) fileInputRef.current.value = ''
      toast.success('File uploaded successfully')
    } catch {
      toast.error('Upload failed')
    } finally {
      setUploading(false)
    }
  }

  const openDelete = (item: GalleryItem) => { setDeleting(item); setDeleteOpen(true) }

  const handleDelete = async () => {
    if (!deleting) return
    setDeletingItem(true)
    try {
      await fetch(`/api/gallery?id=${deleting.id}`, { method: 'DELETE' })
      await fetchItems()
      setDeleteOpen(false); setDeleting(null)
      toast.success('File deleted')
    } catch {
      toast.error('Delete failed')
    } finally {
      setDeletingItem(false)
    }
  }

  const openEdit = (item: GalleryItem) => {
    setEditing(item)
    setEditTitle(item.title)
    setEditCategory(item.category)
    setEditOpen(true)
  }

  const handleEditSave = async () => {
    if (!editing || !editTitle.trim()) return
    setSaving(true)
    try {
      await fetch('/api/gallery', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: editing.id, title: editTitle, category: editCategory }),
      })
      await fetchItems()
      setEditOpen(false); setEditing(null)
      toast.success('Updated successfully')
    } catch {
      toast.error('Update failed')
    } finally {
      setSaving(false)
    }
  }

  const toggleField = async (item: GalleryItem, field: 'showOnHome' | 'isActive') => {
    try {
      const newVal = !item[field]
      await fetch('/api/gallery', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: item.id, [field]: newVal }),
      })
      await fetchItems()
      toast.success(`${field === 'isActive' ? 'Visibility' : 'Home display'} updated`)
    } catch {
      toast.error('Update failed')
    }
  }

  const filtered = items.filter((i) => {
    if (debouncedSearch && !i.title.toLowerCase().includes(debouncedSearch.toLowerCase())) return false
    if (filter === 'active') return i.isActive
    if (filter === 'inactive') return !i.isActive
    if (filter === 'home') return i.showOnHome
    return true
  })

  const counts = {
    all: items.length,
    active: items.filter(i => i.isActive).length,
    inactive: items.filter(i => !i.isActive).length,
    home: items.filter(i => i.showOnHome).length,
  }

  const images = filtered.filter((i) => i.type === 'IMAGE')
  const documents = filtered.filter((i) => i.type !== 'IMAGE')

  const formatSize = (bytes: number | null) => {
    if (!bytes) return 'Unknown'
    if (bytes < 1024) return `${bytes} B`
    if (bytes < 1048576) return `${(bytes / 1024).toFixed(1)} KB`
    return `${(bytes / 1048576).toFixed(1)} MB`
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Gallery & Media</h1>
          <p className="text-muted-foreground text-sm">Upload images, manage visibility, delete from R2.</p>
        </div>
        <ReusableRefreshButton onRefresh={fetchItems} loading={loading} lastFetched={lastFetched} />
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
        <input placeholder="Search gallery..." value={search} onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-zinc-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary" />
      </div>

      {/* Upload Section */}
      <div className="rounded-xl border border-zinc-200 bg-white p-5">
        <h3 className="text-sm font-semibold mb-3">Upload New File</h3>
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="flex-1">
            <Input placeholder="File title (optional)" value={uploadTitle} onChange={(e) => setUploadTitle(e.target.value)} />
          </div>
          <div className="w-full sm:w-40">
            <Input placeholder="Category" value={uploadCategory} onChange={(e) => setUploadCategory(e.target.value)} />
          </div>
          <div className="flex gap-2">
            <input ref={fileInputRef} type="file" accept="image/*,.pdf,.doc,.docx" onChange={handleUpload} className="hidden" />
            <Button onClick={() => fileInputRef.current?.click()} disabled={uploading}>
              {uploading ? <><IconLoader2 className="h-4 w-4 animate-spin mr-1" /> Uploading...</> : <><IconUpload className="h-4 w-4 mr-1" /> Choose File</>}
            </Button>
          </div>
        </div>
        <p className="text-xs text-muted-foreground mt-2">Max 25MB images, 50MB documents. JPG, PNG, WebP, PDF, DOC.</p>
      </div>

      {/* Images Section */}
      {loading ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="rounded-xl border border-zinc-200 bg-white p-3 animate-pulse">
              <Skeleton className="aspect-square rounded-lg mb-2" />
              <Skeleton className="h-4 w-3/4 mb-1" />
              <Skeleton className="h-3 w-1/2" />
            </div>
          ))}
        </div>
      ) : images.length === 0 ? (
        <div className="rounded-xl border border-zinc-200 bg-white py-12 text-center text-muted-foreground">
          <IconPhoto className="h-10 w-10 mx-auto mb-2" />
          No images found.
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {images.map((item) => (
            <div key={item.id} className="group rounded-xl border border-zinc-200 bg-white overflow-hidden hover:shadow-md transition-shadow">
              <div className="relative aspect-square bg-zinc-100">
                <img src={item.url} alt={item.title} className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                  <Button size="icon-sm" variant="secondary" onClick={() => openEdit(item)}>
                    <IconPencil className="h-4 w-4" />
                  </Button>
                  <Button size="icon-sm" variant="destructive" onClick={() => openDelete(item)}>
                    <IconTrash className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              <div className="p-3">
                <p className="text-sm font-medium truncate">{item.title}</p>
                <div className="flex items-center gap-2 mt-1 flex-wrap">
                  <Badge variant="secondary" className="text-xs">{item.category}</Badge>
                  <span className="text-xs text-muted-foreground">{formatSize(item.size)}</span>
                </div>
                <div className="flex items-center gap-2 mt-2">
                  <button onClick={() => toggleField(item, 'isActive')}
                    className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold transition-all ${
                      item.isActive ? 'bg-green-50 text-green-700 hover:bg-green-100' : 'bg-zinc-100 text-zinc-500 hover:bg-zinc-200'
                    }`}>
                    {item.isActive ? <IconEye className="h-3 w-3" /> : <IconEyeOff className="h-3 w-3" />}
                    {item.isActive ? 'Active' : 'Off'}
                  </button>
                  <button onClick={() => toggleField(item, 'showOnHome')}
                    className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold transition-all ${
                      item.showOnHome ? 'bg-primary text-black' : 'bg-zinc-100 text-zinc-500 hover:bg-zinc-200'
                    }`}>
                    {item.showOnHome ? <IconHome className="h-3 w-3" /> : <IconHomeOff className="h-3 w-3" />}
                    {item.showOnHome ? `#${item.position}` : 'Home'}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Documents Section */}
      {documents.length > 0 && (
        <div>
          <h2 className="text-lg font-semibold mb-3">Documents ({documents.length})</h2>
          <div className="space-y-2">
            {documents.map((item) => (
              <div key={item.id} className="group rounded-xl border border-zinc-200 bg-white p-3 flex items-center gap-3 hover:shadow-sm transition-shadow">
                <div className="p-2 rounded-lg bg-primary/10">
                  <IconFile className="h-5 w-5 text-primary" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{item.title}</p>
                  <p className="text-xs text-muted-foreground">{item.mimeType || 'document'} · {formatSize(item.size)}</p>
                </div>
                <div className="flex items-center gap-1">
                  <button onClick={() => toggleField(item, 'isActive')}
                    className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold transition-all ${
                      item.isActive ? 'bg-green-50 text-green-700' : 'bg-zinc-100 text-zinc-500'
                    }`}>
                    {item.isActive ? 'Active' : 'Off'}
                  </button>
                  <a href={item.url} target="_blank" rel="noopener noreferrer"
                    className="p-1.5 rounded-lg hover:bg-zinc-100 text-zinc-400 hover:text-primary transition-colors">
                    <IconDownload className="h-4 w-4" />
                  </a>
                  <button onClick={() => openDelete(item)}
                    className="p-1.5 rounded-lg hover:bg-red-50 text-zinc-400 hover:text-red-500 transition-colors">
                    <IconTrash className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Edit Dialog */}
      <Dialog open={editOpen} onOpenChange={setEditOpen}>
        <DialogContent className="sm:max-w-sm">
          <DialogHeader>
            <DialogTitle>Edit Gallery Item</DialogTitle>
            <DialogDescription>Update title and category.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <label className="text-sm font-medium">Title</label>
              <Input value={editTitle} onChange={(e) => setEditTitle(e.target.value)} placeholder="Title" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Category</label>
              <Input value={editCategory} onChange={(e) => setEditCategory(e.target.value)} placeholder="Category" />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditOpen(false)}>Cancel</Button>
            <Button onClick={handleEditSave} disabled={saving || !editTitle.trim()}>
              {saving && <IconLoader2 className="h-4 w-4 animate-spin mr-1" />} Save
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <Dialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <DialogContent className="sm:max-w-sm">
          <DialogHeader>
            <DialogTitle>Delete File</DialogTitle>
            <DialogDescription>
              Delete &quot;{deleting?.title}&quot;? The file will be permanently removed from R2 storage.
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
