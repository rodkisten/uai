# Hosting

Build with `pnpm install --no-frozen-lockfile && pnpm typecheck && pnpm build`. The output is `dist/`, including `/r/*.json`. Serve this directory using Cloudflare Workers Static Assets. Production hostname: `uai.migos.club`; proposed PR hostname: `pr-<number>.uai.migos.club`. Configure CI credentials and verify the custom domains before enabling deployment. Registry endpoints must remain publicly readable. No API or database is needed.
