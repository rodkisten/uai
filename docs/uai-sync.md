# UAI Sync — distribution contract

Phase 1: read-only planning. No automatic overwrite, merge or deploy is enabled.

Build the registry, then run `node scripts/release-manifest.mjs 0.1.0`. The manifest hashes the published registry JSON and each source file. The generator stages a complete version directory under dist/releases and refuses to replace a completed bundle. Push a new v-prefixed SemVer tag to publish the archive and manifest as GitHub Release assets. The workflow refuses to overwrite an existing release; repository administrators can still modify assets unless GitHub immutable releases are enabled.

Consumer uai.json:

```json
{ "schemaVersion": 1, "components": { "code-editor": {}, "file-tree": {} } }
```

Consumer uai.lock.json records installed component hashes and actual local file paths/hashes, including any deterministic import relocation. Keep adapters outside managed files.

Run `node sync-plan.mjs release.json` from the consumer root. The planner reports install/update/unchanged/conflict/missing and exits 2 for conflicts or missing items. It never writes consumer files.

Next: dependency closure, safe installation and lock generation, reusable workflow, GitHub App dispatch, PR validation and deploy integration. Do not enable auto-merge before those gates exist.

## Installer

Run `node sync-install.mjs /path/to/extracted-release` in the consumer root for a dry run. Add `--apply` only in a clean disposable checkout. Internal registry dependencies are resolved recursively; external shadcn dependencies must be supplied by the consumer and explicitly listed in `externalRegistryDependencies`. npm dependencies are reported, not installed. Optional per-component `targets` maps source paths to local paths; source bytes are not rewritten. Existing modified, missing managed, or conflicting unmanaged files abort before writes. Removed or relocated files require explicit migration. Writes are staged but the final multi-file rename is not transactional. The lock records exact installed bytes. Automated workflow must validate dependencies, typecheck and build before committing.

## Reusable workflow

Call .github/workflows/sync.yml with a release version and a full trusted installer commit SHA. Provide a consumer-scoped write token (prefer a short-lived GitHub App installation token) and optionally a UAI read token. The initial workflow supports npm consumers with existing dependencies, typecheck and build scripts. It opens a version-specific PR only after validation; existing sync branches are deliberately not overwritten. No automatic merge or deployment yet. Keep caller and installer refs pinned to reviewed commits. The archive is trusted from the UAI release publisher; enable immutable releases and restrict release permissions.

## Distribution

Configure PLOOCKY_APP_ID and PLOOCKY_PRIVATE_KEY with an installation authorized for the listed repositories and contents write permission for repository dispatch. Consumers are disabled until their manifests, locks and receiver workflows exist on main. Manually dispatch distribute.yml with a release version; dry run is default. Enable dispatch explicitly to send uai-release events only to consumers with changed component hashes, including internal dependencies. Automatic release chaining is not enabled yet.

## Release chaining and policy

Set UAI_AUTO_DISTRIBUTE=true to chain distribution after successful release publication. Consumers remain individually opt-in. sync.updates accepts patch/minor/major policies auto, pr, off; defaults to pr, major auto is downgraded to pr. The workflow rejects non-advancing stable versions. Auto policy currently opens a validated PR and reports the requested auto-merge; actual merge remains disabled until required branch checks are verified and a consumer-specific gate is configured. Deploys must be triggered by the consumer's existing main workflow after merge.

## Auto-merge gate

For stable patch/minor updates with auto policy, set consumer repository variable UAI_AUTO_MERGE=true. The workflow checks classic branch protection, administrator enforcement, strict required status checks and a nonempty required-check list. If inspection fails (including ruleset-only repositories or insufficient token permissions), the PR remains manual. GitHub native auto-merge uses squash and the expected head SHA, without admin bypass. Configure the app without bypass privileges and require the consumer's real PR validation checks; deploy remains the consumer's existing main workflow. This gate has not yet been exercised against a live consumer.
