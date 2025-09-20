'use client'

import React from 'react'
import { Button } from '@/components/ui/Button'
import { VoteValue } from '@/types/vote'

interface VoteButtonsProps {
  onVote: (value: VoteValue) => void
  disabled?: boolean
}

export const VoteButtons: React.FC<VoteButtonsProps> = ({ onVote, disabled = false }) => {
  return (
    <div className="flex items-center justify-center gap-4 mt-6">
      <Button
        variant="danger"
        size="lg"
        onClick={() => onVote(-1)}
        disabled={disabled}
        className="rounded-full w-16 h-16 p-0"
        aria-label="Dislike"
      >
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M6 18L18 6M6 6l12 12"
          />
        </svg>
      </Button>

      <Button
        variant="secondary"
        size="lg"
        onClick={() => onVote(0)}
        disabled={disabled}
        className="rounded-full w-16 h-16 p-0"
        aria-label="Skip"
      >
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M5 15l7-7 7 7"
          />
        </svg>
      </Button>

      <Button
        variant="primary"
        size="lg"
        onClick={() => onVote(1)}
        disabled={disabled}
        className="rounded-full w-16 h-16 p-0 bg-success-500 hover:bg-success-600"
        aria-label="Like"
      >
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
          />
        </svg>
      </Button>
    </div>
  )
}

export default VoteButtons