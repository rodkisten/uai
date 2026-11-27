import {useState,useEffect} from "react";
import {createRoot} from "react-dom/client";
import {Copy,Search,Package,ExternalLink} from "lucide-react";
import {createRootRoute,createRoute,createRouter,RouterProvider,Link} from "@tanstack/react-router";
import * as Tabs from "@radix-ui/react-tabs";
import registry from "../registry.json";
import {Consumers} from "./consumers";
import {Playground} from "./playground";
import {SourceView} from "./source-view";
import {Button} from "./components/ui/button";
import {Input} from "./components/ui/input";
import "./styles.css";
const tabs=["preview","source","install"] as const;
const rootRoute=createRootRoute();
const catalogRoute=createRoute({getParentRoute:()=>rootRoute,path:"/",validateSearch:(search:Record<string,unknown>)=>({component:registry.items.find(i=>i.name===search.component)?.name??registry.items[0].name,tab:tabs.find(t=>t===search.tab)??"preview"}),component:App});
const consumersRoute=createRoute({getParentRoute:()=>rootRoute,path:"/consumers",component:Consumers});
const router=createRouter({routeTree:rootRoute.addChildren([catalogRoute,consumersRoute])});
declare module "@tanstack/react-router" {interface Register {router:typeof router}}
function App(){
 const [query,setQuery]=useState(""),[source,setSource]=useState(""),[error,setError]=useState(""),[notice,setNotice]=useState("");
 const {component:selected,tab}=catalogRoute.useSearch();
 const nav=catalogRoute.useNavigate();
 const item=registry.items.find(i=>i.name===selected)!;
 function navigate(name:string,nextTab:typeof tab){void nav({search:{component:name,tab:nextTab}});setNotice("")}
 useEffect(()=>{const c=new AbortController();setSource("");setError("");fetch("/r/"+selected+".json",{signal:c.signal}).then(r=>{if(!r.ok)throw Error("Registry unavailable");return r.json()}).then(v=>{if(!c.signal.aborted)setSource(v.files?.[0]?.content??"")}).catch(e=>{if(!c.signal.aborted)setError(String(e))});return()=>c.abort()},[selected]);
 async function copy(s:string){try{await navigator.clipboard.writeText(s);setNotice("Copied")}catch{setNotice("Clipboard unavailable")}}
 const command="pnpm dlx shadcn@latest add "+location.origin+"/r/"+selected+".json";
 return <main className="mx-auto max-w-7xl p-4 md:p-8"><header className="mb-6 flex items-center justify-between border-b border-border pb-4"><div><h1 className="text-3xl font-semibold tracking-tight">🧩 uai</h1><p className="text-sm text-muted-foreground">Shared component registry · {registry.items.length} components</p></div><div className="flex items-center gap-4"><Link to="/consumers" className="text-sm font-medium">Consumers</Link><a className="flex items-center gap-2 text-sm" href="https://github.com/rodkisten/uai">GitHub <ExternalLink size={16}/></a></div></header>
 <div className="grid gap-5 md:grid-cols-[240px_minmax(0,1fr)]"><aside className="min-w-0"><label className="flex items-center gap-2"><Search size={16}/><Input aria-label="Search components" placeholder="Search components" value={query} onChange={e=>setQuery(e.target.value)} autoCapitalize="none" className="text-base"/></label><nav className="mt-3 grid gap-1" aria-label="Components">{registry.items.filter(i=>(i.name+" "+i.description).toLowerCase().includes(query.toLowerCase())).map(i=><Button key={i.name} variant={selected===i.name?"secondary":"ghost"} onClick={()=>navigate(i.name,"preview")} aria-current={selected===i.name?"page":undefined} className="justify-start"><Package size={15}/>{i.name}</Button>)}</nav></aside>
 <article className="min-w-0"><div className="mb-4 flex flex-wrap items-center justify-between gap-2"><div><h2 className="text-2xl font-semibold">{item.name}</h2><p className="mt-1 text-sm text-muted-foreground">{item.description}</p></div><Button variant="outline" size="sm" onClick={()=>void copy(location.href)}><Copy size={14}/> Share</Button></div>
 <Tabs.Root value={tab} onValueChange={v=>navigate(selected,v as typeof tab)}><Tabs.List aria-label="Component details" className="mb-4 flex gap-1 border-b border-border">{tabs.map(t=><Tabs.Trigger key={t} value={t} className="border-b-2 border-transparent px-3 py-2 text-sm capitalize text-muted-foreground data-[state=active]:border-primary data-[state=active]:text-foreground">{t}</Tabs.Trigger>)}</Tabs.List>
 <Tabs.Content value="preview" className="rounded-xl border border-border bg-card p-4"><Playground key={selected} name={selected}/></Tabs.Content>
 <Tabs.Content value="source"><div className="mb-2 flex justify-end"><Button size="sm" variant="outline" disabled={!source} onClick={()=>void copy(source)}><Copy size={14}/> Copy source</Button></div>{error?<p role="alert">{error}</p>:source?<SourceView source={source}/>:<p>Loading source…</p>}</Tabs.Content>
 <Tabs.Content value="install" className="grid gap-3 rounded-xl border border-border bg-card p-4"><h3 className="font-medium">Installation</h3><div className="flex items-center gap-2 rounded-md bg-background p-3"><code className="min-w-0 flex-1 break-all text-xs">{command}</code><Button size="icon" variant="ghost" aria-label="Copy install command" onClick={()=>void copy(command)}><Copy size={16}/></Button></div><h3 className="font-medium">Dependencies</h3><div className="flex flex-wrap gap-2">{[...item.dependencies,...item.registryDependencies].map(d=><code key={d} className="rounded-md border border-border px-2 py-1 text-xs">{d}</code>)}</div></Tabs.Content></Tabs.Root><p className="mt-2 text-xs text-muted-foreground" role="status">{notice}</p></article></div></main>
}
createRoot(document.getElementById("root")!).render(<RouterProvider router={router}/>);
