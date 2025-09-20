'use client'

import React from 'react'
import { cn } from '@/lib/utils'

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode
  variant?: 'default' | 'elevated' | 'outlined'
}

export const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ children, className, variant = 'default', ...props }, ref) => {
    const variants = {
      default: 'bg-white dark:bg-gray-800 shadow-md',
      elevated: 'bg-white dark:bg-gray-800 shadow-xl',
      outlined: 'bg-transparent border border-gray-200 dark:border-gray-700',
    }

    return (
      <div
        ref={ref}
        className={cn(
          'rounded-lg p-4 transition-all duration-200',
          variants[variant],
          className
        )}
        {...props}
      >
        {children}
      </div>
    )
  }
)

Card.displayName = 'Card'

export default Card