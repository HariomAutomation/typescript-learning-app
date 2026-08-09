let cached: Promise<typeof import('typescript')> | null = null

/**
 * Shared singleton promise for the TypeScript compiler.
 * Used by useCodeRunner (transpile/pretty), CompilationVisualizer and ASTExplorer.
 * The import is lazy and code-split; every consumer shares the same chunk load.
 */
export function getTS(): Promise<typeof import('typescript')> {
  return (cached ??= import('typescript'))
}