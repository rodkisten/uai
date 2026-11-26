import {useState} from "react";
import {PanelNavigation} from "../registry/components/panel-navigation";
import {SessionAlert} from "../registry/components/session-alert";
import {ExecutionTracker} from "../registry/components/execution-tracker";
import {PatchReview} from "../registry/components/patch-review";
import {WorkbenchLayout} from "../registry/components/workbench-layout";
export function Playground({name}:{name:string}){
 const [before,setBefore]=useState("name: Build\nrun: pnpm build");
 const [after,setAfter]=useState("name: Build\nrun: pnpm typecheck && pnpm build");
 const [pane,setPane]=useState("editor");
 const [status,setStatus]=useState("success");
 const [busy,setBusy]=useState(false);
 const field="w-full rounded-md border border-border bg-background p-2 text-base font-mono";
 if(name==="patch-review")return <div className="grid gap-3"><label className="grid gap-1 text-sm">Before<textarea className={field} value={before} onChange={e=>setBefore(e.target.value)}/></label><label className="grid gap-1 text-sm">After<textarea className={field} value={after} onChange={e=>setAfter(e.target.value)}/></label><PatchReview before={before} after={after}/></div>;
 if(name==="workbench-layout")return <div className="grid gap-3"><div className="flex gap-2">{["editor","inspector"].map(p=><button key={p} aria-pressed={pane===p} className="rounded-md border border-border p-2 text-sm" onClick={()=>setPane(p)}>{p}</button>)}</div><WorkbenchLayout activePane={pane}><div className="rounded-md border border-border p-4">Editor {pane==="editor"?"· active":""}</div><div className="rounded-md border border-border p-4">Inspector {pane==="inspector"?"· active":""}</div></WorkbenchLayout></div>;
 if(name==="execution-tracker")return <div className="grid gap-3"><label className="grid gap-1 text-sm">Execution status<select className={field} value={status} onChange={e=>setStatus(e.target.value)}>{["queued","in_progress","success","failure"].map(s=><option key={s}>{s}</option>)}</select></label><ExecutionTracker title="Workflow execution" name="Registry build" status={status} jobs={[{id:"build",name:"Build",status,steps:[{id:"install",name:"Install dependencies",status:status==="queued"?"queued":"success"},{id:"compile",name:"Typecheck and build",status}]}]} errors={status==="failure"?["Example: build failed"]:[]} note="Simulated execution, no external workflow triggered."/></div>;
 if(name==="panel-navigation")return <><PanelNavigation items={[{id:"editor",label:"Editor"},{id:"inspector",label:"Inspector"}]} value={pane} onChange={setPane}/><p className="text-sm">Selected: {pane}</p></>;
 if(name==="session-alert")return <SessionAlert title="Session expired" description="Example authentication state" busy={busy} onRetry={()=>{setBusy(true);setTimeout(()=>setBusy(false),800)}}/>;
 return <p className="text-sm text-muted-foreground">Interactive example not available yet. Source and installation are available below.</p>;
}
