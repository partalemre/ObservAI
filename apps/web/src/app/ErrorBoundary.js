import { jsx as _jsx, jsxs as _jsxs } from 'react/jsx-runtime'
import React from 'react'
export class ErrorBoundary extends React.Component {
  state = { error: undefined }
  static getDerivedStateFromError(error) {
    return { error }
  }
  componentDidCatch(error, info) {
    console.error('ErrorBoundary caught an error:', error, info)
  }
  render() {
    if (this.state.error) {
      return _jsxs('div', {
        className: 'p-6 text-red-700',
        children: [
          _jsx('h2', {
            className: 'text-lg font-semibold mb-2',
            children: 'Something went wrong',
          }),
          _jsxs('p', {
            className: 'text-sm',
            children: ['Runtime error: ', String(this.state.error.message)],
          }),
        ],
      })
    }
    return this.props.children
  }
}
