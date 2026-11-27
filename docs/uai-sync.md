# UAI Sync — distribution contract

Phase 1: read-only planning. No automatic overwrite, merge or deploy is enabled.

Build the registry, then run `node scripts/release-manifest.mjs 0.1.0`. The manifest hashes the published registry JSON and each source file. The generator stages a complete version directory under dist/releases and refuses to replace a completed bundle. Push a new v-prefixed SemVer tag to publish the archive and manifest as GitHub Release assets. The workflow refuses to overwrite an existing release; repository administrators can still modify assets unless GitHub immutable releases are enabled.

Consumer uai.json:
```json
{"schemaVersion":1,"components":{"code-editor":{},"file-tree":{}}}
```

Consumer uai.lock.json records installed component hashes and actual local file paths/hashes, including any deterministic import relocation. Keep adapters outside managed files.

Run `node sync-plan.mjs release.json` from the consumer root. The planner reports install/update/unchanged/conflict/missing and exits 2 for conflicts or missing items. It never writes consumer files.

Next: dependency closure, safe installation and lock generation, reusable workflow, GitHub App dispatch, PR validation and deploy integration. Do not enable auto-merge before those gates exist.
