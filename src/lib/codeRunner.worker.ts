/// <reference lib="webworker" />

interface RunMessage {
  id: string
  code: string
  test?: string
}

interface ResultMessage {
  id: string
  ok: boolean
  logs: string[]
  error?: string
  durationMs: number
}

let tsPromise: Promise<typeof import('typescript')> | null = null

function getTs() {
  return (tsPromise ??= import('typescript'))
}

function formatArg(arg: unknown): string {
  if (typeof arg === 'string') return arg
  if (arg === null) return 'null'
  if (arg === undefined) return 'undefined'
  if (typeof arg === 'number' || typeof arg === 'boolean' || typeof arg === 'bigint') return String(arg)
  try {
    return JSON.stringify(arg)
  } catch {
    return String(arg)
  }
}

function makeConsole(logs: string[]) {
  const push = (...args: unknown[]) => logs.push(args.map(formatArg).join(' '))
  return { log: push, info: push, warn: push, error: push, debug: push, trace: push }
}

async function compileToCjs(code: string, fileName: string): Promise<string> {
  const ts = await getTs()
  const out = ts.transpileModule(code, {
    fileName,
    compilerOptions: {
      target: ts.ScriptTarget.ES2020,
      module: ts.ModuleKind.CommonJS,
      strict: true,
      esModuleInterop: true,
      sourceMap: false,
    },
    reportDiagnostics: true,
  })
  const errors = (out.diagnostics ?? [])
    .filter((d) => d.category === ts.DiagnosticCategory.Error)
    .map((d) => ts.flattenDiagnosticMessageText(d.messageText, ' '))
  if (errors.length) throw new Error(errors.join('\n'))
  return out.outputText
}

async function runModule(code: string, logs: string[]): Promise<Record<string, unknown>> {
  const js = await compileToCjs(code, 'solution.ts')
  const module = { exports: {} as Record<string, unknown> }
  const scope = new Function('exports', 'module', 'console', 'require', '"use strict";\n' + js)
  scope(
    module.exports,
    module,
    makeConsole(logs),
    (id: string) => {
      throw new Error(`require() is not supported inside the sandbox: "${id}"`)
    },
  )
  return module.exports
}

async function runWithTests(solutionCode: string, testCode: string, logs: string[]) {
  const solutionExports = await runModule(solutionCode, logs)
  const transformed = testCode.replace(
    /import\s+\{\s*([^}]+)\s*\}\s+from\s+['"][^'"]*['"]/g,
    (_match, names: string) => `const { ${names.trim()} } = solution;`,
  )
  const js = await compileToCjs(transformed, 'tests.ts')
  const runner = new Function('console', 'solution', '"use strict";\n' + js)
  runner(makeConsole(logs), solutionExports)
}

self.onmessage = async (event: MessageEvent<RunMessage>) => {
  const { id, code, test } = event.data
  const started = performance.now()
  const logs: string[] = []
  try {
    if (test) {
      await runWithTests(code, test, logs)
    } else {
      await runModule(code, logs)
    }
    postMessage({
      id,
      ok: true,
      logs,
      durationMs: Math.round(performance.now() - started),
    } satisfies ResultMessage)
  } catch (error) {
    postMessage({
      id,
      ok: false,
      logs,
      error: error instanceof Error ? error.message : String(error),
      durationMs: Math.round(performance.now() - started),
    } satisfies ResultMessage)
  }
}