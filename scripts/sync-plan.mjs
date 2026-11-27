import { readFile } from "node:fs/promises";
import { createHash } from "node:crypto";
import { resolve, relative, isAbsolute } from "node:path";
const read = async path => JSON.parse(await readFile(path,"utf8"));
const [manifestPath, configPath="uai.json", lockPath="uai.lock.json"] = process.argv.slice(2);
if (!manifestPath) throw new Error("Usage: node sync-plan.mjs <release-manifest.json> [uai.json] [uai.lock.json]");
const release = await read(manifestPath);
const config = await read(configPath);
const lock = await read(lockPath).catch(e=>{if(e.code==="ENOENT")return {components:{}};throw e;});
if(release.schemaVersion!==1 || config.schemaVersion!==1) throw new Error("Unsupported schema");
const root=process.cwd();
const result=[];
for(const name of Object.keys(config.components)){
 const next=release.components[name], old=lock.components?.[name];
 if(!next){result.push({name,status:"missing"});continue;}
 const conflicts=[];
 for(const file of old?.files??[]){
  const path=resolve(root,file.path);
  const rel=relative(root,path);
  if(rel===".."||rel.startsWith("../")||isAbsolute(rel))throw new Error("Unsafe path: "+file.path);
  const actual=await readFile(path).then(b=>createHash("sha256").update(b).digest("hex"),e=>{if(e.code==="ENOENT")return null;throw e;});
  if(actual!==file.sha256)conflicts.push(file.path);
 }
 result.push({name,status:conflicts.length?"conflict":old?.sha256===next.sha256?"unchanged":old?"update":"install",conflicts});
}
console.log(JSON.stringify({version:release.version,components:result},null,2));
if(result.some(x=>x.status==="conflict"||x.status==="missing"))process.exitCode=2;
