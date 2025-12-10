# Repository Guidelines

> Read `CONTRIBUTING.md` before contributing; it spells out commit messages, branch flow, and frontend/styling expectations that pair with this doc.

## Project Structure & Module Organization
- Next.js app router lives in `src/app` (`layout.tsx` sets the shell, `page.tsx` is the landing page, `globals.css` holds theme and Tailwind presets, `not-found.tsx` covers 404s).
- Shared UI sits in `src/components/ui` (buttons, dropdowns, header/footer) and `src/components/theme-provider.tsx`.
- Reusable helpers, enums, interfaces, and the server logger live under `src/lib` (`constants/media-sources.ts`, `enums/entry-status.ts`, `interfaces/entry.ts`, `utils.ts`, `logger.ts`); import with `@/...`.
- The logger wires `pino` with `LOG_LEVEL`/`LOG_DIR` controls, so run-time folders should match the `log/app.log` target or whichever `LOG_DIR` is configured.
- Dev-only component showcase is in `src/pages/components.tsx` (visible at `/components` during dev).
- Static assets live in `public/`.

## Routes & Docs
- `docs/api-routes.md` is the single source of truth for the current static pages (public: `/`, `/about`, `/terms-of-service`, `/privacy`, `/docs`; auth: `/signup`, `/login`, `/forgot-password`). Keep it current when adding or removing landing pages.

## Build, Test, and Development Commands
- Run all tooling through `bun` so lockfiles stay in sync (`package-lock.json` remains for compatibility but prefer `bun.lock` as the source of truth). CI mirrors this by running `bun install --frozen-lockfile` followed by `bunx eslint .`.
- `bun install` to pull deps (add `--frozen-lockfile` locally when you need reproducibility); keep `bun.lock` intact alongside `package-lock.json`.
- `bun run dev` starts the app at `http://localhost:3000`.
- `bun run lint` runs Next/ESLint (core web vitals + TypeScript).
- `bun run build` does the production build; `bun run start` serves the build.

## Coding Style & Naming Conventions
- TypeScript strict mode is on; prefer typed props/interfaces and named exports.
- Follow Tailwind CSS v4 utility-first styling; keep shared tokens in `globals.css`.
- Use shadcn/ui patterns; reuse existing components before adding new ones.
- When you do add components, prefer the shadcn CLI run through bun (`bunx --bun shadcn@latest add <component>`).
- Import using the `@/*` alias; keep component files in `PascalCase` and hooks/utils in `camelCase`.

## Testing Guidelines
- No automated test suite yet; add `*.test.ts(x)` alongside features using React Testing Library or Playwright for pages.
- Cover new utilities and critical UI states; include minimal fixtures/mocks.
- Run `bun run lint` (and `bun run build` when relevant) before opening a PR.

## Commit & Pull Request Guidelines
- Use Conventional Commits (`feat: ...`, `fix: ...`, `chore: ...`); keep messages short and present-tense.
- Follow the branching and workflow hierarchy named in `CONTRIBUTING.md` (`main` ← `develop` ← feature branches); branch names should match the scope (e.g., `feat/<scope>`).
- PR checklist: summarize changes, link issues or tasks, note env/setup steps, attach screenshots for UI updates, and confirm lint/build results.

## Environment & Security
- Copy `.env.example` to `.env.local` (or stage-specific file) and fill required keys; never commit secrets (Cloudinary, Supabase, and the experimental YouTube keys are enumerated there).
- The server logger writes to `log/app.log` by default; override `LOG_DIR` and `LOG_LEVEL` via env vars to change destinations or verbosity.
- Prefer Vercel or workspace env vars for credentials; avoid hardcoding URLs/IDs in components.
