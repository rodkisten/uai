import { readFile } from "node:fs/promises";
const [manifestPath,mode]=process.argv.slice(2);
if(!manifestPath|| (mode && mode!=="--dispatch"))throw new Error("Usage: dispatch-consumers.mjs <manifest.json> [--dispatch]");
const release=JSON.parse(await readFile(manifestPath,"utf8"));
const config=JSON.parse(await readFile("consumers.json","utf8"));
if(release.schemaVersion!==1||config.schemaVersion!==1)throw new Error("Unsupported schema");
const token=process.env.GH_TOKEN;
if(!token)throw new Error("GH_TOKEN required");
if(!/^[a-f0-9]{40}$/.test(release.commit??""))throw new Error("Release commit required");
async function api(path,options={}){
 const response=await fetch("https://api.github.com/"+path,{...options,headers:{Authorization:"Bearer "+token,Accept:"application/vnd.github+json","X-GitHub-Api-Version":"2022-11-28","Content-Type":"application/json",...options.headers}});
 if(!response.ok)throw new Error("GitHub "+response.status+" "+path);
 return response.status===204?null:response.json();
}
let failed=false;
for(const consumer of config.consumers){
 if(!consumer.enabled)continue;
 const repo=consumer.repository;
 if(!/^rodkisten\/[a-zA-Z0-9_.-]+$/.test(repo))throw new Error("Repository outside allowed owner: "+repo);
 try{
  const get=async name=>{
   const result=await api("repos/"+repo+"/contents/"+name);
   return JSON.parse(Buffer.from(result.content,"base64").toString("utf8"));
  };
  const settings=await get("uai.json");
  const lock=await get("uai.lock.json");
  if(settings.schemaVersion!==1||lock.schemaVersion!==1)throw new Error("Unsupported consumer schema");
  const names=new Set();
  function visit(name){
   if(names.has(name))return;
   if(!Object.hasOwn(release.components,name))throw new Error("Missing component "+name);
   names.add(name);
   for(const dep of release.components[name].registryDependencies??[])if(Object.hasOwn(release.components,dep))visit(dep);
  }
  for(const name of Object.keys(settings.components))visit(name);
  const changed=[...names].filter(name=>release.components[name].sha256!==lock.components?.[name]?.sha256);
  console.log(JSON.stringify({repo,changed,status:changed.length?(mode==="--dispatch"?"dispatch":"planned"):"unchanged"}));
  if(changed.length&&mode==="--dispatch")await api("repos/"+repo+"/dispatches",{method:"POST",body:JSON.stringify({event_type:"uai-release",client_payload:{version:release.version,installer_ref:release.commit,components:changed}})});
 }catch(error){failed=true;console.error(repo,error.message);}
}
if(failed)process.exitCode=1;
