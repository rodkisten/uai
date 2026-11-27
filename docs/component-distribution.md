# UAI component distribution architecture

Status: proposed implementation contract. React registry remains the priority; multiframework support is deferred.

## Trigger and release model
Every push to main, including direct commits and merged PRs, is eligible. Manual dispatch supports recovery and dry runs. No release PR is required in UAI. Compare the last successfully published immutable source SHA with the target SHA, not only the last commit. Serialize publication, reconcile retries, and prevent generated metadata commits from causing loops. Documentation-only changes do not distribute components.

Reuse existing shared actions from rodkisten/github for changed-file filtering, GitHub App authentication, PR operations and reporting where supported. Inspect actual action contracts before implementation. Use Ploocky installation tokens with least privilege. Do not duplicate shared workflows.

## Component layout
Each registry component owns a directory containing source files, component.json, CHANGELOG.md, README.md, optional examples and migrations. Preserve existing shadcn registry compatibility. Each component has a stable ID, semantic version, dependency IDs, source hashes and migration references. Registry release bundles retain a global version and immutable manifest for compatibility with current installers, while component versions advance independently.

## Tool selection
Prefer Changesets for independent component versions and changelogs if private workspace metadata is practical; no npm publication is required. Use its CLI directly in CI rather than requiring the default release PR workflow. Conventional Commits and conventional-changelog tooling are supplementary inputs for summaries and suggested release severity, not the sole authority. Evaluate git-cliff as a lightweight changelog alternative if component workspace packages prove artificial. Do not run two authoritative versioning engines. Confirm compatibility in a pilot before adoption.

Generate missing change records from changed paths, commit messages and API diffs, with explicit overrides for semantic impact. Ordinary compatible changes may default to patch; ambiguous or breaking changes must be held for classification rather than guessed. Store per-component structured change records with old/new versions, source SHA range, summary, breaking flag, affected APIs, dependency changes, migration IDs and checksums. Changelog is derived from these records and includes commit links; PR links are optional.

## Distribution
Validate quality and build, calculate changed component closure using dependency graph and published hashes, publish immutable bundle, then fan out only to enabled consumers whose manifests/locks intersect affected components. Candidates include orb, shell, jardim, userscripts-cf, rodsandbox and manage; verify actual repository names and opt-in readiness. Existing release/distribute/sync workflows should evolve rather than be duplicated. Consumer receiver workflows remain minimal. Detect consumer package manager and run frozen install, typecheck and build. Preserve local overrides; report conflicts rather than silently overwriting. One managed update PR per consumer by default, updated idempotently; direct consumer updates are not assumed authorized. Optional automerge only under explicit policy and verified protections. Record source version, target SHA, checks, migration reports and PR links centrally. Failed consumers can retry without republishing.

## Migrations
Use existing AST tooling (ts-morph or jscodeshift after pilot). Version migration scripts per component, declare applicable version ranges, execution order, checksums and required/optional status. Apply all required intermediate migrations in order to a clean isolated consumer branch. Scripts must be reviewed, deterministic, idempotent when feasible, scoped to intended files and tested against fixtures. Never execute AI-generated unreviewed codemods automatically. Pin installer and migration source SHA; avoid exposing write tokens during migration execution. Validate before creating or updating PRs; report failures without changing consumer main.

## Future userscript verification
A separate userscript will verify rendered playground/consumer output against declared component fixtures and expected behavior, producing structured results (component ID/version, source SHA, fixture ID, pass/fail, diagnostics). Start with manual execution; automated release gating is a later decision. Do not claim this exists yet.

## Implementation order
1. Inventory shared actions and current UAI registry/workflows.
2. Pilot component directories and version metadata with one existing component.
3. Implement path filtering, dependency closure, change record generation and immutable release.
4. Enable automatic main-push distribution to one opted-in consumer; prove retry and PR idempotency.
5. Add migration execution and rollback/recovery documentation.
6. Enroll remaining consumers and expose release history/status in the playground.
7. Implement userscript output verification later.

References: https://changesets.dev/guide/config ; https://github.com/conventional-changelog/conventional-changelog ; https://git-cliff.org/ ; https://semantic-release.gitbook.io/semantic-release/ .
