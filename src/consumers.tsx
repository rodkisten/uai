import {useState} from "react";
import {ArrowLeft,ExternalLink,Package,Search,Network,ShieldCheck} from "lucide-react";
import {Link} from "@tanstack/react-router";
import registry from "../registry.json";
import config from "../consumers.json";
import {Input} from "./components/ui/input";
import {Button} from "./components/ui/button";
export function Consumers(){
 const [query,setQuery]=useState("");
 const [filter,setFilter]=useState<"all"|"enabled"|"disabled">("all");
 const enabled=config.consumers.filter(c=>c.enabled).length;
 const rows=config.consumers.filter(c=>c.repository.toLowerCase().includes(query.toLowerCase())&&(filter==="all"||c.enabled===(filter==="enabled")));
 return <main className="mx-auto max-w-7xl space-y-6 p-4 md:p-8">
 <header className="flex flex-wrap items-center justify-between gap-3 border-b border-border pb-4"><div><Link to="/" search={{component:registry.items[0].name,tab:"preview"}} className="mb-2 inline-flex items-center gap-2 text-sm text-muted-foreground"><ArrowLeft size={14}/> Registry</Link><h1 className="text-2xl font-semibold tracking-tight">Consumers</h1><p className="text-sm text-muted-foreground">UAI Sync · Distribution control center</p></div><a href="https://github.com/rodkisten/uai/actions" className="inline-flex items-center gap-2 text-sm">Actions <ExternalLink size={14}/></a></header>
 <section className="grid grid-cols-2 gap-3 md:grid-cols-4" aria-label="Overview">{[{label:"Registered",value:config.consumers.length,Icon:Network},{label:"Enabled",value:enabled,Icon:ShieldCheck},{label:"Disabled",value:config.consumers.length-enabled,Icon:Network},{label:"Components",value:registry.items.length,Icon:Package}].map(({label,value,Icon})=><div key={label} className="rounded-lg border border-border bg-card p-3"><div className="flex items-center gap-2 text-xs text-muted-foreground"><Icon size={14}/>{label}</div><div className="mt-2 text-2xl font-semibold tabular-nums">{value}</div></div>)}</section>
 <section className="space-y-3"><div className="flex flex-wrap items-center gap-2"><div className="flex min-w-0 flex-1 items-center gap-2"><Search size={16}/><Input value={query} onChange={e=>setQuery(e.target.value)} placeholder="Search repositories" aria-label="Search repositories" autoCapitalize="none" className="text-base"/></div><div className="flex gap-1">{(["all","enabled","disabled"] as const).map(f=><Button key={f} size="sm" variant={filter===f?"secondary":"ghost"} aria-pressed={filter===f} onClick={()=>setFilter(f)} className="capitalize">{f}</Button>)}</div></div>
 <div className="overflow-hidden rounded-lg border border-border bg-card">{rows.map(c=><article key={c.repository} className="flex flex-wrap items-center justify-between gap-3 border-b border-border p-3 last:border-b-0"><div className="min-w-0"><a href={"https://github.com/"+c.repository} className="break-all text-sm font-medium hover:underline">{c.repository}</a><p className="text-xs text-muted-foreground">Installed version: not collected</p></div><div className="flex items-center gap-3"><span className="rounded-md border border-border px-2 py-1 text-xs">{c.enabled?"Enabled":"Disabled"}</span><a href={"https://github.com/"+c.repository+"/actions"} aria-label={"Actions for "+c.repository}><ExternalLink size={15}/></a></div></article>)}{!rows.length&&<p className="p-4 text-sm text-muted-foreground">No matching consumers.</p>}</div></section>
 <section className="rounded-lg border border-border bg-card p-4"><h2 className="font-medium">Distribution</h2><p className="mt-1 text-sm text-muted-foreground">Configuration snapshot from consumers.json. Live installed versions, PRs and deployment status are not connected yet.</p><a className="mt-3 inline-flex items-center gap-2 text-sm underline" href="https://github.com/rodkisten/uai/actions/workflows/distribute.yml">Open distribution workflow <ExternalLink size={14}/></a></section>
 </main>
}
