import { readFile, writeFile, mkdir } from "node:fs/promises";
import { createHash } from "node:crypto";
import { resolve } from "node:path";
const hash = bytes => createHash("sha256").update(bytes).digest("hex");
const root = process.cwd();
const version = process.argv[2];
if (!version || !/^\d+\.\d+\.\d+(?:-[\w.-]+)?$/.test(version)) throw new Error("Usage: node scripts/release-manifest.mjs <semver>");
const registry = JSON.parse(await readFile("registry.json", "utf8"));
const components = {};
for (const item of registry.items) {
  if (!/^[a-z0-9-]+$/.test(item.name)) throw new Error("Invalid registry item name");
  const bytes = await readFile(resolve(root, "public/r", item.name + ".json"));
  const payload = JSON.parse(bytes);
  const files = [];
  for (const file of payload.files ?? []) {
    if (typeof file.content !== "string") throw new Error("Missing content: " + file.path);
    files.push({ path: file.path, target: file.target ?? file.path, sha256: hash(file.content) });
  }
  components[item.name] = { sha256: hash(bytes), files, dependencies: payload.dependencies ?? [], registryDependencies: payload.registryDependencies ?? [] };
}
const manifest = { schemaVersion: 1, version, commit: process.env.GITHUB_SHA ?? null, components };
await mkdir("public/r/releases", { recursive: true });
await writeFile("public/r/releases/" + version + ".json", JSON.stringify(manifest, null, 2) + "\n");
console.log("Release manifest:", version, Object.keys(components).length, "components");
