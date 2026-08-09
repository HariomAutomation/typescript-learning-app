import { Component } from 'react'
import type { ErrorInfo, ReactNode } from 'react'

interface Props {
  fallback?: ReactNode
  children: ReactNode
}

interface State {
  hasError: boolean
}

export class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false }

  static getDerivedStateFromError(): State {
    return { hasError: true }
  }

  componentDidCatch(error: Error, info: ErrorInfo): void {
    console.error('ErrorBoundary caught:', error, info.componentStack)
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback ?? <div role="alert" className="glass" style={{ padding: 20 }}>Something failed to render.</div>
    }
    return this.props.children
  }
}