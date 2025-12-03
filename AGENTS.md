# Repository Guidelines

## Project Structure & Module Organization
- Next.js app router lives in `src/app` (`layout.tsx` sets the shell, `page.tsx` is the landing page, `globals.css` holds theme and Tailwind presets, `not-found.tsx` covers 404s).
- Shared UI sits in `src/components/ui` (buttons, dropdowns, header/footer) and `src/components/theme-provider.tsx`.
- Reusable helpers and enums are under `src/lib` (`constants/media-sources.ts`, `utils.ts`); import with `@/...`.
- Dev-only component showcase is in `src/pages/components.tsx` (visible at `/components` during dev).
- Static assets live in `public/`; API route list stays in `docs/api-routes.md`.

## Build, Test, and Development Commands
- `npm install` to pull deps; keep `package-lock.json` intact.
- `npm run dev` starts the app at `http://localhost:3000`.
- `npm run lint` runs Next/ESLint (core web vitals + TypeScript).
- `npm run build` does the production build; `npm run start` serves the build.

## Coding Style & Naming Conventions
- TypeScript strict mode is on; prefer typed props/interfaces and named exports.
- Follow Tailwind CSS v4 utility-first styling; keep shared tokens in `globals.css`.
- Use shadcn/ui patterns; reuse existing components before adding new ones.
- Import using the `@/*` alias; keep component files in `PascalCase` and hooks/utils in `camelCase`.

## Testing Guidelines
- No automated test suite yet; add `*.test.ts(x)` alongside features using React Testing Library or Playwright for pages.
- Cover new utilities and critical UI states; include minimal fixtures/mocks.
- Run `npm run lint` (and build when relevant) before opening a PR.

## Commit & Pull Request Guidelines
- Use Conventional Commits (`feat: ...`, `fix: ...`, `chore: ...`); keep messages short and present-tense.
- Branch naming mirrors CONTRIBUTING: `feat/<scope>`, `fix/<scope>`, `chore/<scope>`; open PRs against `develop` unless directed otherwise.
- PR checklist: summarize changes, link issues or tasks, note env/setup steps, attach screenshots for UI updates, and confirm lint/build results.

## Environment & Security
- Copy `.env.example` to `.env.local` (or stage-specific file) and fill required keys; never commit secrets.
- Prefer Vercel or workspace env vars for credentials; avoid hardcoding URLs/IDs in components.
