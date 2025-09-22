import React from 'react'

export class ErrorBoundary extends React.Component<
  { children: React.ReactNode },
  { error?: Error }
> {
  state = { error: undefined as Error | undefined }

  static getDerivedStateFromError(error: Error) {
    return { error }
  }

  componentDidCatch(error: Error, info: any) {
    console.error('ErrorBoundary caught an error:', error, info)
  }

  render() {
    if (this.state.error) {
      return (
        <div className="p-6 text-red-700">
          <h2 className="mb-2 text-lg font-semibold">Something went wrong</h2>
          <p className="text-sm">
            Runtime error: {String(this.state.error.message)}
          </p>
        </div>
      )
    }
    return this.props.children
  }
}
