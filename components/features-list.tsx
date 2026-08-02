'use client'

import { useState, useRef } from 'react'
import { IconPlus, IconPencil, IconTrash, IconGripVertical, IconCheck, IconX } from '@tabler/icons-react'

interface FeaturesListProps {
  features: string[]
  onChange: (features: string[]) => void
}

export default function FeaturesList({ features, onChange }: FeaturesListProps) {
  const [newFeature, setNewFeature] = useState('')
  const [editingIdx, setEditingIdx] = useState<number | null>(null)
  const [editValue, setEditValue] = useState('')
  const [dragIdx, setDragIdx] = useState<number | null>(null)
  const [overIdx, setOverIdx] = useState<number | null>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const addFeature = () => {
    const val = newFeature.trim()
    if (!val) return
    onChange([...features, val])
    setNewFeature('')
    inputRef.current?.focus()
  }

  const removeFeature = (idx: number) => {
    onChange(features.filter((_, i) => i !== idx))
  }

  const startEdit = (idx: number) => {
    setEditingIdx(idx)
    setEditValue(features[idx])
  }

  const saveEdit = (idx: number) => {
    const val = editValue.trim()
    if (!val) return
    const updated = [...features]
    updated[idx] = val
    onChange(updated)
    setEditingIdx(null)
    setEditValue('')
  }

  const cancelEdit = () => {
    setEditingIdx(null)
    setEditValue('')
  }

  const moveFeature = (from: number, to: number) => {
    if (to < 0 || to >= features.length) return
    const updated = [...features]
    const [item] = updated.splice(from, 1)
    updated.splice(to, 0, item)
    onChange(updated)
  }

  const handleDragStart = (idx: number) => {
    setDragIdx(idx)
  }

  const handleDragOver = (e: React.DragEvent, idx: number) => {
    e.preventDefault()
    setOverIdx(idx)
  }

  const handleDrop = (idx: number) => {
    if (dragIdx !== null && dragIdx !== idx) {
      moveFeature(dragIdx, idx)
    }
    setDragIdx(null)
    setOverIdx(null)
  }

  const handleDragEnd = () => {
    setDragIdx(null)
    setOverIdx(null)
  }

  return (
    <div className="space-y-2">
      {/* Existing features */}
      {features.length > 0 && (
        <div className="space-y-1.5">
          {features.map((feat, idx) => (
            <div
              key={idx}
              draggable
              onDragStart={() => handleDragStart(idx)}
              onDragOver={(e) => handleDragOver(e, idx)}
              onDrop={() => handleDrop(idx)}
              onDragEnd={handleDragEnd}
              className={`flex items-center gap-2 p-2 rounded-lg border transition-all ${
                dragIdx === idx
                  ? 'border-primary bg-primary/5 opacity-50'
                  : overIdx === idx
                  ? 'border-primary/50 bg-primary/5'
                  : 'border-zinc-200 bg-white hover:border-zinc-300'
              }`}
            >
              {/* Drag handle */}
              <div className="cursor-grab active:cursor-grabbing text-zinc-300 hover:text-zinc-500 shrink-0">
                <IconGripVertical className="h-4 w-4" />
              </div>

              {/* Number */}
              <span className="text-xs font-bold text-zinc-300 w-5 text-center shrink-0">
                {idx + 1}
              </span>

              {/* Content */}
              {editingIdx === idx ? (
                <input
                  autoFocus
                  value={editValue}
                  onChange={(e) => setEditValue(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') saveEdit(idx)
                    if (e.key === 'Escape') cancelEdit()
                  }}
                  className="flex-1 text-sm px-2 py-1 rounded-md border border-primary bg-white focus:outline-none focus:ring-1 focus:ring-primary"
                />
              ) : (
                <span className="flex-1 text-sm text-zinc-700 truncate">{feat}</span>
              )}

              {/* Actions */}
              <div className="flex items-center gap-0.5 shrink-0">
                {editingIdx === idx ? (
                  <>
                    <button
                      onClick={() => saveEdit(idx)}
                      className="p-1 rounded-md text-green-600 hover:bg-green-50 transition-colors"
                      title="Save"
                    >
                      <IconCheck className="h-3.5 w-3.5" />
                    </button>
                    <button
                      onClick={cancelEdit}
                      className="p-1 rounded-md text-zinc-400 hover:bg-zinc-100 transition-colors"
                      title="Cancel"
                    >
                      <IconX className="h-3.5 w-3.5" />
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      onClick={() => startEdit(idx)}
                      className="p-1 rounded-md text-zinc-400 hover:text-primary hover:bg-primary/5 transition-colors"
                      title="Edit"
                    >
                      <IconPencil className="h-3.5 w-3.5" />
                    </button>
                    <button
                      onClick={() => removeFeature(idx)}
                      className="p-1 rounded-md text-zinc-400 hover:text-red-500 hover:bg-red-50 transition-colors"
                      title="Delete"
                    >
                      <IconTrash className="h-3.5 w-3.5" />
                    </button>
                  </>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add new feature */}
      <div className="flex items-center gap-2">
        <input
          ref={inputRef}
          value={newFeature}
          onChange={(e) => setNewFeature(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') addFeature()
          }}
          placeholder="Add a feature..."
          className="flex-1 text-sm px-3 py-2 rounded-lg border border-zinc-200 focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary"
        />
        <button
          onClick={addFeature}
          disabled={!newFeature.trim()}
          className="shrink-0 p-2 rounded-lg bg-primary text-black hover:bg-primary/90 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          title="Add feature"
        >
          <IconPlus className="h-4 w-4" />
        </button>
      </div>

      {features.length === 0 && (
        <p className="text-xs text-zinc-400 text-center py-2">No features added yet. Add one above.</p>
      )}
    </div>
  )
}
