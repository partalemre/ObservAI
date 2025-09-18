import React from 'react'
import { cn } from '../../lib/utils'

interface TitleProps {
  children: React.ReactNode
  level?: 1 | 2 | 3 | 4 | 5 | 6
  className?: string
}

export const Title: React.FC<TitleProps> = ({
  children,
  level = 1,
  className,
}) => {
  const Component = `h${level}` as keyof JSX.IntrinsicElements

  const levelClasses = {
    1: 'text-4xl font-display font-bold text-ink tracking-tight',
    2: 'text-3xl font-display font-bold text-ink tracking-tight',
    3: 'text-2xl font-display font-semibold text-ink tracking-tight',
    4: 'text-xl font-display font-semibold text-ink tracking-tight',
    5: 'text-lg font-display font-semibold text-ink tracking-tight',
    6: 'text-base font-display font-semibold text-ink tracking-tight',
  }

  return (
    <Component className={cn(levelClasses[level], className)}>
      {children}
    </Component>
  )
}
