import {useState} from "react";
import {CodeEditor} from "../registry/components/code-editor";
import {ExpressionInput} from "../registry/components/expression-input";
import {SchemaForm,type SchemaField} from "../registry/components/schema-form";
import {KeyValueEditor,type KeyValueRow} from "../registry/components/key-value-editor";
import {InspectorFields} from "../registry/components/inspector-fields";
import {Input} from "./components/ui/input";
import {Button} from "./components/ui/button";
const fields:SchemaField[]=[{id:"name",label:"Workflow name",type:"string",required:true},{id:"environment",label:"Environment",type:"environment",options:["preview","production"]},{id:"retries",label:"Retries",type:"number"},{id:"dry",label:"Dry run",type:"boolean"}, {id:"notify",label:"Notify on failure",type:"switch",description:"Send a notification when the workflow fails."},{id:"confirm",label:"Confirm deployment",type:"checkbox"},{id:"timeout",label:"Timeout (minutes)",type:"range",min:1,max:60,step:1},{id:"notes",label:"Notes",type:"textarea",placeholder:"Deployment notes"},{id:"strategy",label:"Strategy",type:"choice",options:[{label:"Rolling update",value:"rolling"},{label:"Blue / green",value:"blue-green"}]}];
export function AdvancedPlayground({name}:{name:string}){
 const [code,setCode]=useState(name==="expression-input"?"steps.build.outputs.url":"name: Build\nsteps:\n  - run: pnpm build");
 const [disabled,setDisabled]=useState(false);
 const [values,setValues]=useState<Record<string,string>>({name:"Build",environment:"preview",retries:"2",dry:"true",notify:"true",confirm:"false",timeout:"15",notes:"",strategy:"rolling"});
 const [rows,setRows]=useState<KeyValueRow[]>([{id:"initial",key:"NODE_ENV",value:"production"}]);
 const update=(id:string,value:string)=>setValues(v=>({...v,[id]:value}));
 const suggestions=["steps.build.outputs.url","github.sha","env.NODE_ENV","inputs.environment"];
 return <div className="grid gap-3"><div className="flex justify-end"><Button variant="outline" size="sm" onClick={()=>setDisabled(v=>!v)} aria-pressed={disabled}>{disabled?"Enable":"Disable"} editing</Button></div>
 {name==="code-editor"?<CodeEditor value={code} onChange={setCode} disabled={disabled}/>:name==="expression-input"?<ExpressionInput value={code} onChange={setCode} suggestions={suggestions} disabled={disabled}/>:name==="schema-form"?<SchemaForm fields={fields} values={values} onChange={update} disabled={disabled} errors={!values.name?.trim()?{name:"Name is required"}:{}}/>:name==="key-value-editor"?<KeyValueEditor rows={rows} onChange={setRows} onAdd={()=>setRows(v=>[...v,{id:crypto.randomUUID(),key:"",value:""}])} disabled={disabled}/>:<InspectorFields groups={[{title:"General",keys:["name","environment"]},{title:"Advanced",keys:["retries","dry"]}]} values={values} render={key=><label key={key} className="grid gap-1 text-sm">{key}<Input value={values[key]??""} disabled={disabled} onChange={e=>update(key,e.target.value)} autoCapitalize="none"/></label>}/>}
 <pre className="max-h-40 overflow-auto rounded-md bg-background p-3 text-xs">{JSON.stringify(name==="code-editor"||name==="expression-input"?code:name==="key-value-editor"?rows:values,null,2)}</pre></div>;
}
