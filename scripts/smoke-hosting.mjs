const base = process.argv[2];
if (!base) throw Error("Usage: node scripts/smoke-hosting.mjs https://host");
import { readFile } from "node:fs/promises";
const registry = JSON.parse(await readFile("registry.json", "utf8"));
for (const item of registry.items) {
  const url = new URL("/r/" + item.name + ".json", base);
  const res = await fetch(url, { signal: AbortSignal.timeout(15000) });
  if (!res.ok) throw Error(url + " HTTP " + res.status);
  const json = await res.json();
  if (json.name !== item.name || !json.files?.length) throw Error("Invalid item " + item.name);
  console.log("✓ " + url);
}
const home = await fetch(new URL("/", base), { signal: AbortSignal.timeout(15000) });
if (!home.ok || !(await home.text()).includes("UAI")) throw Error("Catalog unavailable");
