
# CONTRIBUTIONS

Guidelines for contribuiting to the project.

## COMMITS

- Each commit message must be descriptive and clear.
- Use conventional commits, eg: feat: add new feature, fix: fix bug, chore: update dependencies, etc. [Conventional Commits](https://www.conventionalcommits.org/en/v1.0.0/)

## BRANCHES

- Main branch is the main branch of the project, for stable releases.
- Develop branch is the development branch of the project, for new features and bug fixes.
- frontend and backend branches are the branches for the frontend and backend of the project, for new features and bug fixes.
- Each branch must be named according to the feature or bug it is addressing, eg: feat/add-new-feature, fix/fix-bug, chore/update-dependencies, etc.

**Order of branches:**
`main` <- `develop` <- `frontend` | `backend` <- `feat/add-new-feature` | `fix/fix-bug` | `chore/update-dependencies`

eg: `git checkout -b scope/scope-info`

## FRONTEND & STYLES

- Use Tailwind CSS V4 with utility classes.
- Use Shadcn UI for components.
- Priorize `globals.css` over local styles, this allows for mantainability.

This ensures a consistent and maintainable codebase with light/dark mode support (next-theme).

**See:**

- [Shadcn UI](https://ui.shadcn.com/docs/) (specially the theming section)
- [Tailwind CSS](https://tailwindcss.com/docs)

### Implementing new components

- Use existing blocks/components whenever possible to make the development faster, they can be modified later.
- use shadcn's official commands, eg `bunx --bun shadcn@latest add button`
- use existing components may be used as reference to make new ones.
- Avoid using other component libraries, if in doubt ask the team.
