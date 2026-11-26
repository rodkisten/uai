# UAI 🧩

Shared React component registry for the Rod ecosystem, powered by shadcn and Tailwind CSS v4.

## Development

```sh
pnpm install --no-frozen-lockfile
pnpm typecheck
pnpm build
pnpm dev
```

Build output: `dist/`. Registry items: `dist/r/*.json`.

## Consumer setup

In a project initialized with shadcn, merge this entry into `components.json` once the registry is hosted:

```json
{"registries":{"@uai":"https://uai.migos.club/r/{name}.json"}}
```

Then install a component with `pnpm dlx shadcn@latest add @uai/code-editor`. The hostname is planned, not yet live. Registry dependencies use the same namespace.

## Components

- `panel-navigation`
- `inspector-fields`
- `code-editor`
- `expression-input`
- `key-value-editor`
- `schema-form`
- `patch-review`
- `execution-tracker`
- `session-alert`
- `workbench-layout`
