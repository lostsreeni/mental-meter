'use client'
import { useEffect, useMemo, useState } from 'react'
import { useLiveQuery } from 'dexie-react-hooks'
import Link from 'next/link'
import { db } from '@/lib/db/database'
import { instruments, type InstrumentId } from '@/lib/instruments'
import { getSetting, setSetting } from '@/lib/db/repositories/settings'
const PRESETS = [7,30,90,365,99999] as const
const TAGS=['Work','Sleep','Medication','Relationships','Physical health','Therapy','Other'] as const
export default function HistoryPage(){
const all=useLiveQuery(()=>db.checkins.orderBy('timestamp').toArray(),[])??[]
const [inst,setInst]=useState<InstrumentId>('phq9'); const [days,setDays]=useState(30); const [q,setQ]=useState(''); const [tag,setTag]=useState<string>('')
useEffect(()=>{(async()=>{const s=await getSetting('history_instrument') as InstrumentId|null; if(s) setInst(s)})()},[])
useEffect(()=>{void setSetting('history_instrument',inst)},[inst])
const notes=useLiveQuery(()=>db.notes.toArray(),[])??[]
const noteByCheckin=new Map(notes.filter(n=>n.checkinId).map(n=>[n.checkinId!,n]))
const filtered=useMemo(()=>{const end=new Date();const start=new Date(end.getTime()-days*86400000);return all.filter(c=>{if(c.type!==inst)return false; if(days!==99999 && new Date(c.timestamp)<start)return false; const n=noteByCheckin.get(c.id!); if(tag && !(n?.tags??[]).includes(tag)) return false; if(q && !(n?.content?.toLowerCase().includes(q.toLowerCase()))) return false; return true}).sort((a,b)=>+new Date(a.timestamp)-+new Date(b.timestamp))},[all,inst,days,q,tag,notes])
const scores=filtered.filter(c=>c.score!==null); const min=Math.min(...scores.map(s=>s.score as number),0); const max=Math.max(...scores.map(s=>s.score as number),0)
const rangeMax=instruments[inst].severityBands.at(-1)?.max??10
return <div className="min-h-screen bg-background px-4 py-4 pb-20"><div className="max-w-3xl mx-auto space-y-4"><h1 className="text-xl font-semibold">History</h1>
<div className="flex gap-2 overflow-x-auto">{(['phq9','gad7','who5','phq2','gad2','sleep','stress'] as InstrumentId[]).map(id=><button key={id} onClick={()=>setInst(id)} className={`px-3 py-2 rounded-full border text-sm ${inst===id?'bg-primary text-primary-foreground':'bg-card'}`}>{instruments[id].shortName}</button>)}</div>
<input value={q} onChange={e=>setQ(e.target.value)} placeholder="Search notes" className="w-full border rounded-lg px-3 py-2 text-sm"/>
<div className="flex gap-2 overflow-x-auto">{TAGS.map(t=><button key={t} onClick={()=>setTag(tag===t?'':t)} className={`px-2 py-1 rounded-full border text-xs ${tag===t?'bg-primary text-primary-foreground':''}`}>{t}</button>)} </div>
<div className="flex gap-2 overflow-x-auto">{PRESETS.map(d=><button key={d} onClick={()=>setDays(d)} className={`px-3 py-1 rounded-full border text-xs ${days===d?'bg-primary text-primary-foreground':'bg-card'}`}>{d===99999?'All time':`${d}d`}</button>)}</div>
{scores.length===0?<div className="rounded-xl border p-4"><p className="text-sm text-muted-foreground mb-2">{instruments[inst].description}</p><Link href={`/checkin/${inst}`} className="underline">Take your first {instruments[inst].shortName}</Link></div>:<div aria-label={`${instruments[inst].shortName} scores from history`} className="rounded-xl border p-3">{scores.length===1&&<p className="text-sm">Add another check-in to start seeing trends.</p>}<svg viewBox="0 0 320 140" className="w-full h-44"><polyline fill="none" stroke="currentColor" strokeWidth="2" points={scores.map((s,i)=>`${(i/(Math.max(scores.length-1,1)))*300+10},${120-((s.score as number)/rangeMax)*110+10}`).join(' ')} />{scores.map((s,i)=><circle key={s.id} cx={(i/(Math.max(scores.length-1,1)))*300+10} cy={120-((s.score as number)/rangeMax)*110+10} r={5} />)}</svg><table className="sr-only"><tbody>{scores.map(s=><tr key={s.id}><td>{new Date(s.timestamp).toLocaleDateString()}</td><td>{s.score}</td></tr>)}</tbody></table></div>}
<div className="grid grid-cols-2 gap-2 text-sm"><div className="rounded-lg border p-2">Check-ins: {filtered.length}</div><div className="rounded-lg border p-2">Average: {scores.length?(scores.reduce((a,b)=>a+(b.score as number),0)/scores.length).toFixed(1):'—'}</div><div className="rounded-lg border p-2">Range: {scores.length?`${min}–${max}`:'—'}</div></div>
<div className="space-y-2">{[...filtered].reverse().map(c=>{const n=noteByCheckin.get(c.id!); return <div key={c.id} className="rounded-lg border p-3"><div className="text-xs text-muted-foreground">{new Date(c.timestamp).toLocaleString()}</div><div className="font-medium">{c.score ?? 'Skipped'}</div><div className="text-xs">{c.severityBand ?? '—'}</div>{n&&<div className="text-xs text-muted-foreground mt-1">📝 {n.content.slice(0,80)}{n.content.length>80?'…':''}</div>}</div>})}</div>
</div></div>
}
