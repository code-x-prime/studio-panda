'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { IconRefresh } from '@tabler/icons-react'

interface ReusableRefreshButtonProps {
  onRefresh: () => void | Promise<void>
  loading?: boolean
  lastFetched?: Date | null
}

export default function ReusableRefreshButton({ onRefresh, loading, lastFetched }: ReusableRefreshButtonProps) {
  const [spinning, setSpinning] = useState(false)

  const handleClick = async () => {
    setSpinning(true)
    await onRefresh()
    setSpinning(false)
  }

  return (
    <div className="flex flex-col items-end gap-1">
      <Button variant="outline" size="sm" onClick={handleClick} disabled={loading || spinning} className="shrink-0 gap-1.5">
        <IconRefresh className={`h-4 w-4 ${loading || spinning ? 'animate-spin' : ''}`} /> Refresh
      </Button>
      {lastFetched && (
        <span className="text-xs text-zinc-400">
          {lastFetched.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
        </span>
      )}
    </div>
  )
}
