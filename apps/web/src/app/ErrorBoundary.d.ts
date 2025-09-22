import React from 'react'
export declare class ErrorBoundary extends React.Component<
  {
    children: React.ReactNode
  },
  {
    error?: Error
  }
> {
  state: {
    error: Error | undefined
  }
  static getDerivedStateFromError(error: Error): {
    error: Error
  }
  componentDidCatch(error: Error, info: any): void
  render():
    | string
    | number
    | boolean
    | import('react/jsx-runtime').JSX.Element
    | Iterable<React.ReactNode>
    | null
    | undefined
}
