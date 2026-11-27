import { readFile, writeFile, mkdir, mkdtemp, rename, rm } from "node:fs/promises";
import { createHash } from "node:crypto";
import { resolve, join } from "node:path";
const hash = (bytes) => createHash("sha256").update(bytes).digest("hex");
const root = process.cwd();
const version = process.argv[2];
if (!version || !/^\d+\.\d+\.\d+(?:-[\w.-]+)?$/.test(version))
  throw new Error("Usage: node scripts/release-manifest.mjs <semver>");
const registry = JSON.parse(await readFile("registry.json", "utf8"));
const components = Object.create(null);
const payloads = new Map();
for (const item of registry.items) {
  if (!/^[a-z0-9-]+$/.test(item.name)) throw new Error("Invalid registry item name");
  const bytes = await readFile(resolve(root, "public/r", item.name + ".json"));
  const payload = JSON.parse(bytes);
  const files = [];
  for (const file of payload.files ?? []) {
    if (typeof file.content !== "string") throw new Error("Missing content: " + file.path);
    files.push({ path: file.path, target: file.target ?? file.path, sha256: hash(file.content) });
  }
  payloads.set(item.name + ".json", bytes);
  components[item.name] = {
    payload: item.name + ".json",
    sha256: hash(bytes),
    files,
    dependencies: payload.dependencies ?? [],
    registryDependencies: payload.registryDependencies ?? [],
  };
}
const manifest = { schemaVersion: 1, version, commit: process.env.GITHUB_SHA ?? null, components };
const parent = resolve(process.env.UAI_RELEASE_DIR ?? "dist/releases");
await mkdir(parent, { recursive: true });
const target = join(parent, version);
const staging = await mkdtemp(join(parent, ".stage-"));
try {
  for (const [name, bytes] of payloads) await writeFile(join(staging, name), bytes, { flag: "wx" });
  await writeFile(join(staging, "manifest.json"), JSON.stringify(manifest, null, 2) + "\n", {
    flag: "wx",
  });
  // A completed release directory is nonempty; rename refuses to replace it.
  await rename(staging, target);
} finally {
  await rm(staging, { recursive: true, force: true });
}
console.log("Release bundle:", target, Object.keys(components).length, "components");
