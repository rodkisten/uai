import { readFile } from "node:fs/promises";
const registry = JSON.parse(await readFile("registry.json", "utf8"));
for (const item of registry.items) {
  const json = JSON.parse(await readFile("dist/r/" + item.name + ".json", "utf8"));
  if (
    json.name !== item.name ||
    !json.files?.every((f) => typeof f.content === "string" && f.content.length)
  )
    throw Error("Invalid registry item: " + item.name);
  console.log("✓ " + item.name);
}
