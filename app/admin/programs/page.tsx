'use client'

import { useEffect, useState, useCallback } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Skeleton } from '@/components/ui/skeleton'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { useDebounce } from '@/hooks/use-debounce'
import ReusableRefreshButton from '@/components/reusable-refresh-button'
import TiptapEditor from '@/components/tiptap-editor'
import FeaturesList from '@/components/features-list'
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription,
} from '@/components/ui/dialog'
import { toast } from 'sonner'
import {
  IconPlus, IconPencil, IconTrash, IconLoader2, IconHome, IconHomeOff,
  IconEye, IconEyeOff, IconSearch,
} from '@tabler/icons-react'

interface Program {
  id: string
  title: string
  slug: string
  description: string
  category: string
  duration: string
  targetAudience: string
  features: string[]
  price: string
  showOnHome: boolean
  isActive: boolean
  position: number
  createdAt: string
}

const emptyForm = {
  title: '', description: '', category: 'School Program', duration: '3 Months',
  targetAudience: 'Students Grades 6-12', features: [] as string[], price: 'Contact for Pricing',
  showOnHome: false, isActive: true,
}

export default function AdminProgramsPage() {
  const [programs, setPrograms] = useState<Program[]>([])
  const [loading, setLoading] = useState(true)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [deleteOpen, setDeleteOpen] = useState(false)
  const [editing, setEditing] = useState<Program | null>(null)
  const [deleting, setDeleting] = useState<Program | null>(null)
  const [form, setForm] = useState(emptyForm)
  const [saving, setSaving] = useState(false)
  const [deletingItem, setDeletingItem] = useState(false)
  const [search, setSearch] = useState('')
  const debouncedSearch = useDebounce(search, 300)
  const [filter, setFilter] = useState<'all' | 'active' | 'inactive' | 'home'>('all')
  const [lastFetched, setLastFetched] = useState<Date | null>(null)

  const fetchPrograms = useCallback(async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/programs')
      const data = await res.json()
      setPrograms(data)
      setLastFetched(new Date())
    } catch {
      toast.error('Failed to load programs')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { fetchPrograms() }, [fetchPrograms])

  const openAdd = () => { setEditing(null); setForm(emptyForm); setDialogOpen(true) }

  const openEdit = (p: Program) => {
    setEditing(p)
    setForm({
      title: p.title, description: p.description, category: p.category,
      duration: p.duration, targetAudience: p.targetAudience,
      features: p.features || [], price: p.price || '',
      showOnHome: p.showOnHome, isActive: p.isActive,
    })
    setDialogOpen(true)
  }

  const handleSave = async () => {
    if (!form.title.trim()) return
    setSaving(true)
    try {
      const method = editing ? 'PUT' : 'POST'
      const body = editing
        ? { id: editing.id, ...form, position: editing.position }
        : { ...form }
      await fetch('/api/programs', { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) })
      await fetchPrograms()
      setDialogOpen(false); setEditing(null)
      toast.success(editing ? 'Program updated' : 'Program created')
    } catch {
      toast.error('Failed to save program')
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async () => {
    if (!deleting) return
    setDeletingItem(true)
    try {
      await fetch('/api/programs', { method: 'DELETE', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id: deleting.id }) })
      await fetchPrograms()
      setDeleteOpen(false); setDeleting(null)
      toast.success('Program deleted')
    } catch {
      toast.error('Delete failed')
    } finally {
      setDeletingItem(false)
    }
  }

  const toggleField = async (program: Program, field: 'showOnHome' | 'isActive') => {
    try {
      const newVal = !program[field]
      await fetch('/api/programs', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: program.id, [field]: newVal }),
      })
      await fetchPrograms()
      toast.success(`${field === 'isActive' ? 'Visibility' : 'Home display'} updated`)
    } catch {
      toast.error('Update failed')
    }
  }

  const filtered = programs.filter((p) => {
    if (debouncedSearch && !p.title.toLowerCase().includes(debouncedSearch.toLowerCase())) return false
    if (filter === 'active') return p.isActive
    if (filter === 'inactive') return !p.isActive
    if (filter === 'home') return p.showOnHome
    return true
  })

  const counts = {
    all: programs.length,
    active: programs.filter(p => p.isActive).length,
    inactive: programs.filter(p => !p.isActive).length,
    home: programs.filter(p => p.showOnHome).length,
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Programs</h1>
          <p className="text-muted-foreground text-sm">Manage all programs. Create, edit, activate, or deactivate.</p>
        </div>
        <div className="flex items-center gap-3">
          <ReusableRefreshButton onRefresh={fetchPrograms} loading={loading} lastFetched={lastFetched} />
          <Button onClick={openAdd}><IconPlus className="h-4 w-4 mr-1" /> Add Program</Button>
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
        <input placeholder="Search programs..." value={search} onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-zinc-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary" />
      </div>

      {/* Table */}
      {loading ? (
        <div className="space-y-3">{[1, 2, 3, 4].map(i => <Skeleton key={i} className="h-16 w-full rounded-lg" />)}</div>
      ) : filtered.length === 0 ? (
        <Card><CardContent className="py-16 text-center text-muted-foreground">No programs found.</CardContent></Card>
      ) : (
        <Card>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-12">#</TableHead>
                <TableHead>Title</TableHead>
                <TableHead className="hidden md:table-cell">Category</TableHead>
                <TableHead className="hidden lg:table-cell">Duration</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Home</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((program, idx) => (
                <TableRow key={program.id}>
                  <TableCell className="font-bold text-muted-foreground">
                    {program.showOnHome ? <span className="text-primary">#{program.position}</span> : idx + 1}
                  </TableCell>
                  <TableCell>
                    <div>
                      <p className="font-semibold text-sm">{program.title}</p>
                      <p className="text-xs text-muted-foreground line-clamp-1" dangerouslySetInnerHTML={{ __html: program.description.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim().slice(0, 80) }} />
                    </div>
                  </TableCell>
                  <TableCell className="hidden md:table-cell">
                    <Badge variant="secondary" className="text-xs">{program.category}</Badge>
                  </TableCell>
                  <TableCell className="hidden lg:table-cell text-muted-foreground text-sm">{program.duration}</TableCell>
                  <TableCell>
                    <button onClick={() => toggleField(program, 'isActive')}
                      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold transition-all ${
                        program.isActive ? 'bg-green-50 text-green-700 hover:bg-green-100' : 'bg-zinc-100 text-zinc-500 hover:bg-zinc-200'
                      }`}>
                      {program.isActive ? <IconEye className="h-3 w-3" /> : <IconEyeOff className="h-3 w-3" />}
                      {program.isActive ? 'Active' : 'Inactive'}
                    </button>
                  </TableCell>
                  <TableCell>
                    <button onClick={() => toggleField(program, 'showOnHome')}
                      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold transition-all ${
                        program.showOnHome ? 'bg-primary text-black' : 'bg-zinc-100 text-zinc-500 hover:bg-zinc-200'
                      }`}>
                      {program.showOnHome ? <IconHome className="h-3 w-3" /> : <IconHomeOff className="h-3 w-3" />}
                      {program.showOnHome ? `#${program.position}` : 'Hidden'}
                    </button>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-1">
                      <Button variant="ghost" size="icon-sm" onClick={() => openEdit(program)}>
                        <IconPencil className="h-3.5 w-3.5" />
                      </Button>
                      <Button variant="ghost" size="icon-sm" onClick={() => { setDeleting(program); setDeleteOpen(true) }}>
                        <IconTrash className="h-3.5 w-3.5 text-destructive" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Card>
      )}

      {/* Add/Edit Dialog - Fullscreen */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="!max-w-[95vw] !w-[95vw] !h-[90vh] !p-0 !gap-0 !rounded-2xl flex flex-col">
          <DialogHeader className="px-6 py-4 border-b border-zinc-200 shrink-0">
            <DialogTitle>{editing ? 'Edit Program' : 'Add New Program'}</DialogTitle>
            <DialogDescription>{editing ? 'Update program details.' : 'Create a new program.'}</DialogDescription>
          </DialogHeader>

          <div className="flex-1 overflow-y-auto px-6 py-4">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Left: Content (2/3) */}
              <div className="lg:col-span-2 space-y-4">
                <div className="space-y-2">
                  <Label>Title *</Label>
                  <Input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="e.g. Podcasting Workshop" className="text-base" />
                </div>
                <div className="space-y-2">
                  <Label>Description *</Label>
                  <TiptapEditor content={form.description} onChange={(html) => setForm({ ...form, description: html })} placeholder="Describe the program..." minHeight="200px" />
                </div>
                <div className="space-y-2">
                  <Label>Features</Label>
                  <FeaturesList features={form.features} onChange={(features) => setForm({ ...form, features })} />
                </div>
              </div>

              {/* Right: Settings (1/3) */}
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-2">
                    <Label>Category</Label>
                    <Input value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} placeholder="e.g. School Program" />
                  </div>
                  <div className="space-y-2">
                    <Label>Duration</Label>
                    <Input value={form.duration} onChange={(e) => setForm({ ...form, duration: e.target.value })} placeholder="e.g. 3 Months" />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Target Audience</Label>
                  <Input value={form.targetAudience} onChange={(e) => setForm({ ...form, targetAudience: e.target.value })} placeholder="e.g. Students Grades 6-12" />
                </div>
                <div className="space-y-2">
                  <Label>Price</Label>
                  <Input value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} placeholder="e.g. ₹1500/month" />
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
            <Button onClick={handleSave} disabled={saving || !form.title.trim()}>
              {saving && <IconLoader2 className="h-4 w-4 animate-spin mr-1" />}
              {editing ? 'Save Changes' : 'Create Program'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Dialog */}
      <Dialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <DialogContent className="sm:max-w-sm">
          <DialogHeader>
            <DialogTitle>Delete Program</DialogTitle>
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
