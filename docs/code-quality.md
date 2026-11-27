# Code quality

Use `pnpm format`, `pnpm format:check`, `pnpm lint`, `pnpm lint:fix`, and `pnpm check`. Registry calls the reusable quality workflow. During bootstrap CI formats its disposable checkout before validation; it does not push changes. Run formatting locally and commit the resulting changes and lockfile before switching to strict format-only CI. Generated registry artifacts are excluded. Existing unused variables and explicit any are warnings during migration.
