import CodeRunnerWorker from './codeRunner.worker?worker'
import { getTS } from './tsLoader'
import type ts from 'typescript'

export interface RunResult {
  ok: boolean
  logs: string[]
  error?: string
  durationMs: number
}

export class RunCancelledError extends Error {
  constructor() {
    super('run cancelled')
    this.name = 'RunCancelledError'
  }
}

const DEFAULT_TIMEOUT_MS = 2500

let currentWorker: Worker | null = null
let currentTimer: ReturnType<typeof setTimeout> | null = null
let cancelled = false
let runSeq = 0

/** Terminate any still-running worker. Safe to call anytime; idempotent. */
export function cancelRun(): void {
  cancelled = true
  if (currentTimer !== null) {
    clearTimeout(currentTimer)
    currentTimer = null
  }
  if (currentWorker) {
    currentWorker.terminate()
    currentWorker = null
  }
}

/**
 * Runs a TypeScript snippet inside a freshly spawned worker.
 *
 * - A new call explicitly terminates the previous worker first (cancelRun).
 * - Hard timeout (default 2.5s) kills infinite loops via worker.terminate().
 * - The worker is always terminated once the run settles.
 * - Pass `test` code for code-challenge questions (solution + asserts).
 */
export async function runCode(
  code: string,
  test?: string,
  timeoutMs: number = DEFAULT_TIMEOUT_MS,
): Promise<RunResult> {
  cancelRun()
  cancelled = false
  const id = `run-${++runSeq}`

  return new Promise<RunResult>((resolve, reject) => {
    const worker = new CodeRunnerWorker()
    currentWorker = worker

    const cleanup = () => {
      if (currentTimer !== null) {
        clearTimeout(currentTimer)
        currentTimer = null
      }
      worker.terminate()
      if (currentWorker === worker) currentWorker = null
    }

    worker.onmessage = (event: MessageEvent<RunResult>) => {
      if (cancelled) {
        cleanup()
        reject(new RunCancelledError())
        return
      }
      const result = event.data
      cleanup()
      resolve(result)
    }

    worker.onerror = (event) => {
      cleanup()
      if (cancelled) {
        reject(new RunCancelledError())
      } else {
        reject(new Error(event.message || 'Worker error'))
      }
    }

    currentTimer = setTimeout(() => {
      cleanup()
      if (cancelled) {
        reject(new RunCancelledError())
      } else {
        reject(timeoutError())
      }
    }, timeoutMs)

    try {
      worker.postMessage({ id, code, test })
    } catch (err) {
      cleanup()
      reject(err instanceof Error ? err : new Error(String(err)))
    }
  })
}

function timeoutError(): Error {
  const error = new Error('timed out')
  error.name = 'RunTimeoutError'
  return error
}

/** Transpile-only (no execution) — used by the Compilation Visualizer. */
export async function transpileOnly(code: string): Promise<{ js: string; errors: string[] }> {
  const ts = await getTS()
  const out = ts.transpileModule(code, {
    compilerOptions: {
      target: ts.ScriptTarget.ESNext,
      module: ts.ModuleKind.ESNext,
      strict: true,
    },
    reportDiagnostics: true,
  })
  const errors = (out.diagnostics ?? [])
    .filter((d) => d.category === ts.DiagnosticCategory.Error)
    .map((d) => ts.flattenDiagnosticMessageText(d.messageText, ' '))
  return { js: out.outputText, errors }
}

/** Parse to an AST and pretty-print a compact tree (AST Explorer). */
export async function inspectAst(code: string): Promise<{ tree: string; errors: string[] }> {
  const ts = await getTS()
  const source = ts.createSourceFile('playground.ts', code, ts.ScriptTarget.ESNext, true, ts.ScriptKind.TS)
  const errors: string[] = []
  const lines: string[] = []
  const lineCol = (pos: { line: number; character: number }) => `${pos.line + 1}:${pos.character + 1}`
  const visit = (node: ts.Node, depth: number) => {
    const kind = ts.SyntaxKind[node.kind] ?? String(node.kind)
    const nodeText = node.getText(source).split('\n')[0].slice(0, 60)
    lines.push(`${'  '.repeat(depth)}${kind}${depth === 0 ? '' : ` @ ${lineCol(source.getLineAndCharacterOfPosition(node.getStart(source)))}`} ${nodeText}`)
    node.forEachChild((child) => visit(child, depth + 1))
  }
  try {
    visit(source, 0)
  } catch (error) {
    errors.push(error instanceof Error ? error.message : String(error))
  }
  return { tree: lines.slice(0, 400).join('\n'), errors }
}