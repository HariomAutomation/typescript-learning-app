# TypeScript Mastery Hub

A bilingual (English + Hinglish) interactive TypeScript course that runs entirely in the browser — no backend. Structured curriculum, live code execution in a worker sandbox, compiler visualizations, and an XP-based practice arena.

![stack](https://img.shields.io/badge/React_19-61DAFB) ![typescript](https://img.shields.io/badge/TypeScript_6-3178C6) ![vite](https://img.shields.io/badge/Vite_8-646CFF) ![vitest](https://img.shields.io/badge/Vitest-6B8E23)

## Features

- **10 chapters · 60+ lessons** — from first principles to generics, mapped types and advanced utility types
- **Practice Arena** — MCQs, output prediction, true/false, bug-fixes and real code challenges, graded instantly with XP rewards
- **Live playground** — run TypeScript in a Web Worker sandbox (2.5s timeout), inspect **emitted JavaScript** and the **AST tree** on demand
- **Behind the scenes** 🔬 — every lesson deep-dive gets a live compiled-JS / AST visualization
- **Hinglish localization** — flip the whole UI and content between English and Romanised Hindi
- **Progress & streaks** — XP, day streaks and accuracy stored in `localStorage`; nothing leaves the device

## Getting started

```bash
npm install
npm run dev       # start Vite dev server
npm run build     # tsc -b && vite build (typecheck + production bundle)
npm run preview   # serve the production bundle
npm run lint      # oxlint
npm test          # vitest (unit + data integrity)
```

Deployed from `dist/` at **/typescript-learning-app/** (see `vite.config.ts` `base`).

## Project layout

```
src/
├── components/   # QuestionCard, CodeEditor, CodeRunPanel, BehindScenes, Header/Layout…
├── pages/        # Landing, Learn, Chapter, Lesson, Practice, Playground, Settings, 404
├── data/         # course content: 10 chapters (ch01–ch10) + lookup helpers + stats
├── hooks/        # useProgress (pure reducer + context), useCodeRunner
├── lib/          # codeRunner (worker harness), tsLoader (cached TS compiler in browser)
├── i18n/         # EN/Hinglish dictionaries + LanguageContext
├── utils/        # validate.ts — output/assert grading logic
└── test/         # vitest setup
scripts/          # hinglish.mjs — Devanagari → Roman-script Hindi converter
```

## Code-challenge grading convention

Every code/bugfix question ships a `testCode` harness that prints

```ts
console.log('Assert 1:', solution(...) === expected)
```

`parseAssertions` (src/utils/validate.ts) picks the `Assert N: true|false` lines
(`A N:` accepted too); a challenge passes when **all** asserts are true. The
data-integrity tests in `src/data/index.test.ts` enforce this convention,
unique ids, bilingual fields and the "no Devanagari" Hinglish rule.

## Sandbox

`src/lib/codeRunner.worker.ts` compiles user code with the real TypeScript
compiler (loaded lazily via `import('typescript')`), executes it in a worker
with a 2.5s timeout, and returns console logs + errors to the ui.
`await getTS()`‑based helpers reuse the same cached compiler promise for the
playground's `<Compiled JS>`/`<AST>` tabs.

## Testing

```bash
npm test          # run the whole suite
```

- `utils/validate.test.ts` — answer-checking + assert parsing
- `data/index.test.ts` — content integrity (ids, types, bilingual text, traceability, stats)
- `hooks/useProgress.test.tsx` — reducer XP/streak/reset rules with faked timers