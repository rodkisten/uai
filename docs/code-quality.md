# Code quality

Use `pnpm format`, `pnpm format:check`, `pnpm lint`, `pnpm lint:fix`, and `pnpm check`. Registry calls the reusable quality workflow. CI checks formatting without rewriting sources and installs from the committed frozen lockfile. Use maintenance for intentional normalization. Generated registry artifacts are excluded. Existing unused variables and explicit any are warnings during migration.

Bootstrap uses TypeScript 6 because CI confirmed typescript-eslint 8.74 rejects TS 7. Maintenance is manually dispatched on a non-default branch, validates before committing, and uses GITHUB_TOKEN to avoid recursive runs. Re-run registry validation after the maintenance commit. Temporary workflows use the `delete-me-` filename prefix and are removed after successful execution. GitHub App credentials use `PLOOCKY_APP_ID` and `PLOOCKY_PRIVATE_KEY`. Restore TS 7 when lint compatibility is verified.
