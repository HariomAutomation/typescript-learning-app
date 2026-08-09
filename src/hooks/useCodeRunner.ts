import { useCallback, useEffect, useRef, useState } from 'react'
import { cancelRun, RunCancelledError, runCode as runCodeCore } from '../lib/codeRunner'
import type { RunResult } from '../lib/codeRunner'

export type RunStatus = 'idle' | 'running' | 'done' | 'timeout' | 'error' | 'cancelled'

export interface RunState {
  status: RunStatus
  result: RunResult | null
}

const idleState: RunState = { status: 'idle', result: null }

/**
 * Runs user code via the worker runner.
 * - New run explicitly terminates the previous worker (runCodeCore does this).
 * - useEffect cleanup terminates any pending worker on unmount.
 * - Cancelled/timeout results never update state after unmount.
 */
export function useCodeRunner() {
  const [state, setState] = useState<RunState>(idleState)
  const mountedRef = useRef(true)
  const activeRef = useRef(false)

  useEffect(() => {
    mountedRef.current = true
    return () => {
      mountedRef.current = false
      cancelRun()
    }
  }, [])

  const run = useCallback(async (code: string, test?: string): Promise<RunState> => {
    activeRef.current = true
    setState({ status: 'running', result: null })
    try {
      const result = await runCodeCore(code, test)
      if (!mountedRef.current) return stateRef(result, 'cancelled')
      const next: RunState = { status: result.ok ? 'done' : 'error', result }
      if (!mountedRef.current) return next
      setState(next)
      return next
    } catch (error) {
      const status: RunStatus = error instanceof RunCancelledError ? 'cancelled' : 'timeout'
      const next: RunState = { status, result: null }
      if (mountedRef.current) setState(next)
      return next
    } finally {
      activeRef.current = false
    }
  }, [])

  const cancel = useCallback(() => cancelRun(), [])

  return { state, run, cancel }
}

function stateRef(result: RunResult, status: RunStatus): RunState {
  return { status, result }
}

export type { RunResult }