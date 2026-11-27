# Code quality

Use `pnpm format`, `pnpm format:check`, `pnpm lint`, `pnpm lint:fix`, and `pnpm check`. Registry calls the reusable quality workflow. During bootstrap CI formats its disposable checkout before validation; it does not push changes. Run formatting locally and commit the resulting changes and lockfile before switching to strict format-only CI. Generated registry artifacts are excluded. Existing unused variables and explicit any are warnings during migration.

Bootstrap uses TypeScript 6 because CI confirmed typescript-eslint 8.74 rejects TS 7. Maintenance is manually dispatched on a non-default branch, validates before committing, and uses GITHUB_TOKEN to avoid recursive runs. Re-run registry validation after the maintenance commit. Restore TS 7 when lint compatibility is verified.
