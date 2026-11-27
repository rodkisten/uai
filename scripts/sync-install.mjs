import { readFile, writeFile, mkdir, lstat, rename, rm } from "node:fs/promises";
import { createHash, randomUUID } from "node:crypto";
import { resolve, dirname, relative, isAbsolute, sep } from "node:path";
const hash = bytes => createHash("sha256").update(bytes).digest("hex");
const read = async path => JSON.parse(await readFile(path,"utf8"));
const [bundle, mode] = process.argv.slice(2);
if(!bundle || (mode && mode!=="--apply")) throw new Error("Usage: sync-install.mjs <bundle-dir> [--apply]");
const root=process.cwd(), release=await read(resolve(bundle,"manifest.json")), config=await read("uai.json");
const lock=await read("uai.lock.json").catch(e=>{if(e.code==="ENOENT")return {components:{}};throw e;});
if(release.schemaVersion!==1 || config.schemaVersion!==1) throw new Error("Unsupported schema");
const own=(o,k)=>Object.hasOwn(o,k);
const safeName=n=>typeof n==="string" && /^[a-z0-9-]+$/.test(n);
async function safePath(path){
 if(typeof path!=="string"||isAbsolute(path)||path.includes("\\")||path.split("/").some(x=>!x||x==="."||x===".."||x===".git"))throw new Error("Unsafe path: "+path);
 const full=resolve(root,path);
 if(!relative(root,full)||relative(root,full).startsWith(".."+sep))throw new Error("Unsafe path: "+path);
 let cursor=root;
 for(const part of path.split("/")){
  cursor=resolve(cursor,part);
  const stat=await lstat(cursor).catch(e=>{if(e.code==="ENOENT")return null;throw e;});
  if(stat?.isSymbolicLink())throw new Error("Symlink forbidden: "+cursor);
 }
 return full;
}
const wanted=new Set(), external=new Set(), npm=new Set();
function visit(name){
 if(!safeName(name)||!own(release.components,name))throw new Error("Unknown component: "+name);
 if(wanted.has(name))return;
 wanted.add(name);
 const item=release.components[name];
 for(const dep of item.registryDependencies??[]) {
  if(own(release.components,dep))visit(dep);else external.add(dep);
 }
 for(const dep of item.dependencies??[])npm.add(dep);
}
for(const name of Object.keys(config.components))visit(name);
const next={schemaVersion:1,version:release.version,commit:release.commit,components:Object.create(null)};
const writes=new Map(), owners=new Map(), changes=[];
for(const [name,item] of Object.entries(lock.components??{})){
 for(const file of item.files??[]){
  const path=await safePath(file.path);
  if(owners.has(path))throw new Error("Duplicate ownership: "+file.path);
  owners.set(path,{name,sha256:file.sha256});
 }
}
for(const name of wanted){
 const item=release.components[name];
 if(item.payload!==name+".json")throw new Error("Invalid payload path");
 const bytes=await readFile(resolve(bundle,item.payload));
 if(hash(bytes)!==item.sha256)throw new Error("Payload checksum mismatch: "+name);
 const payload=JSON.parse(bytes);
 if(payload.name!==name)throw new Error("Payload name mismatch");
 const files=[];
 for(const file of payload.files??[]){
  const meta=item.files.find(x=>x.path===file.path);
  if(!meta||typeof file.content!=="string"||hash(file.content)!==meta.sha256)throw new Error("File checksum mismatch: "+file.path);
  const path=config.components[name]?.targets?.[file.path]??meta.target;
  const full=await safePath(path);
  if(writes.has(full))throw new Error("Target collision: "+path);
  const current=await readFile(full).catch(e=>{if(e.code==="ENOENT")return null;throw e;});
  const owner=owners.get(full);
  if(owner&&owner.name!==name)throw new Error("Ownership conflict: "+path);
  if(owner&&(!current||hash(current)!==owner.sha256))throw new Error("Local modification: "+path);
  if(!owner&&current&&hash(current)!==meta.sha256)throw new Error("Unmanaged file exists: "+path);
  writes.set(full,file.content);
  files.push({path,sha256:meta.sha256});
  if(!current||hash(current)!==meta.sha256)changes.push(path);
 }
 next.components[name]={sha256:item.sha256,files};
}
for(const [path,owner] of owners)if(!writes.has(path))throw new Error("Removed or relocated managed file requires explicit migration: "+path);
console.log(JSON.stringify({version:release.version,components:[...wanted],changes,npmDependencies:[...npm],externalRegistryDependencies:[...external]},null,2));
if(mode==="--apply"){
 if(external.size) {
  const approved=new Set(config.externalRegistryDependencies??[]);
  for(const dep of external)if(!approved.has(dep))throw new Error("External registry dependency must be explicitly provided: "+dep);
 }
 const lockPath=await safePath("uai.lock.json");
 if(writes.has(lockPath)||writes.has(await safePath("uai.json")))throw new Error("Reserved target");
 // Stage every write before renaming. Run in a clean disposable checkout; multi-file rename is not transactional.
 const staged=[];
 try{
  for(const [path,content] of [...writes,[lockPath,JSON.stringify(next,null,2)+"\n"]]){
   await mkdir(dirname(path),{recursive:true});
   const tmp=path+".uai-"+randomUUID();
   await writeFile(tmp,content,{flag:"wx"});
   staged.push([tmp,path]);
  }
  for(const [tmp,path] of staged)await rename(tmp,path);
 }finally{for(const [tmp] of staged)await rm(tmp,{force:true});}
}
