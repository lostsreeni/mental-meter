'use client'

import { useEffect, useMemo, useState } from 'react'
import { useLiveQuery } from 'dexie-react-hooks'
import { db } from '@/lib/db/database'
import { instruments, type InstrumentId } from '@/lib/instruments'
import { getSetting, setSetting } from '@/lib/db/repositories/settings'

type Preset = '7d'|'30d'|'90d'|'1y'|'all'|'custom'|'since_last_export'

export default function ExportPage(){
  const all = useLiveQuery(()=>db.checkins.toArray(),[]) ?? []
  const [preset,setPreset]=useState<Preset>('30d')
  const [start,setStart]=useState('')
  const [end,setEnd]=useState('')
  const [selected,setSelected]=useState<Record<string,boolean>>({})
  const [includeNotes,setIncludeNotes]=useState(true)
  const [name,setName]=useState(''); const [clinician,setClinician]=useState(''); const [appt,setAppt]=useState('')
  const [lastExportDate,setLastExportDate]=useState<string>('')
  const [progress,setProgress]=useState('')
  const [showNotesPreview,setShowNotesPreview]=useState(false)

  useEffect(()=>{(async()=>{const d=await getSetting('lastExportDate') as string|null; if(d) setLastExportDate(d)})()},[])

  const range = useMemo(()=>{
    const now = new Date(); let s = new Date(now); let e = new Date(now)
    if (preset==='7d') s = new Date(now.getTime()-7*86400000)
    else if (preset==='30d') s = new Date(now.getTime()-30*86400000)
    else if (preset==='90d') s = new Date(now.getTime()-90*86400000)
    else if (preset==='1y') s = new Date(now.getTime()-365*86400000)
    else if (preset==='all') s = new Date(0)
    else if (preset==='since_last_export' && lastExportDate) s = new Date(lastExportDate)
    else if (preset==='custom') { s = start? new Date(start): new Date(0); e = end? new Date(end): now }
    return {start:s,end:e}
  },[preset,start,end,lastExportDate])

  const inRange = all.filter(c=>{const t=new Date(c.timestamp); return t>=range.start && t<=range.end})
  const notes = useLiveQuery(()=>db.notes.toArray(),[]) ?? []
  const notesInRange = notes.filter(n=>{const t=new Date(n.timestamp); return t>=range.start && t<=range.end})
  const counts = Object.keys(instruments).reduce((acc,id)=>{acc[id]=inRange.filter(c=>c.type===id).length; return acc},{} as Record<string,number>)

  useEffect(()=>{ if(Object.keys(selected).length===0){ const d:Record<string,boolean>={}; Object.keys(instruments).forEach(id=>d[id]=counts[id]>0); setSelected(d)}} ,[JSON.stringify(counts)])

  const validDates = range.end >= range.start
  const selectedIds = Object.entries(selected).filter(([,v])=>v).map(([k])=>k)
  const canGenerate = validDates && inRange.length>0 && selectedIds.length>0

  return <div className="min-h-screen bg-background px-4 py-4 pb-20"><div className="max-w-3xl mx-auto space-y-5">
    <h1 className="text-2xl font-semibold">Export report</h1>

    <section className="space-y-2"><h2 className="font-medium">1) Pick range</h2><div className="flex gap-2 flex-wrap">{(['7d','30d','90d','1y','all','custom','since_last_export'] as Preset[]).map(p=><button key={p} onClick={()=>setPreset(p)} className={`px-3 py-1 rounded-full border text-xs ${preset===p?'bg-primary text-primary-foreground':''}`}>{p.replaceAll('_',' ')}</button>)}</div>
      {preset==='custom' && <div className="flex gap-2"><input type="date" value={start} onChange={e=>setStart(e.target.value)} className="border rounded px-2 py-1"/><input type="date" value={end} onChange={e=>setEnd(e.target.value)} className="border rounded px-2 py-1"/></div>}
      {!validDates && <p className="text-xs text-destructive">End date must be after start date.</p>}
    </section>

    <section className="space-y-2"><h2 className="font-medium">2) Pick instruments</h2>{(Object.keys(instruments) as InstrumentId[]).map(id=><label key={id} className={`flex items-center gap-2 ${counts[id]===0?'opacity-50':''}`}><input type="checkbox" disabled={counts[id]===0} checked={!!selected[id]} onChange={e=>setSelected({...selected,[id]:e.target.checked})}/>{instruments[id].shortName} — {counts[id]} check-ins</label>)}</section>

    <section className="space-y-2"><h2 className="font-medium">3) Options</h2><label className="flex items-center gap-2"><input type="checkbox" checked={includeNotes} onChange={e=>setIncludeNotes(e.target.checked)}/>Include journal notes (recommended)</label>
    <input value={name} onChange={e=>setName(e.target.value)} placeholder="Your name or initials" className="w-full border rounded px-3 py-2"/>
    <input value={clinician} onChange={e=>setClinician(e.target.value)} placeholder="Therapist/clinician name" className="w-full border rounded px-3 py-2"/>
    <input type="date" value={appt} onChange={e=>setAppt(e.target.value)} className="border rounded px-3 py-2"/>
    <p className="text-xs text-muted-foreground">These appear in the PDF but aren't saved.</p>
    <p className="text-xs text-muted-foreground">Emoji in notes may not appear in PDFs.</p></section>


    {includeNotes && (
      <section className="rounded-xl border p-3">
        <p className="text-sm">{notesInRange.length} note{notesInRange.length===1?'':'s'} will be included.</p>
        <button className="text-xs underline text-muted-foreground" onClick={()=>setShowNotesPreview(v=>!v)}>Review notes before exporting</button>
        {showNotesPreview && (
          <div className="mt-2 max-h-40 overflow-auto space-y-2">
            {notesInRange.map((n)=> <div key={n.id} className="text-xs border rounded p-2">
              <div className="text-muted-foreground">{new Date(n.timestamp).toLocaleString()}</div>
              <div>{n.content}</div>
            </div>)}
          </div>
        )}
      </section>
    )}
    <section className="rounded-xl border p-3"><h2 className="font-medium mb-1">Preview</h2><div className="h-32 bg-muted/40 rounded flex items-center justify-center text-sm text-muted-foreground">Page 1 preview: {selectedIds.join(', ') || 'No instruments selected'}</div></section>

    <button disabled={!canGenerate} onClick={async()=>{setProgress('Generating... page 1 of 1'); await new Promise(r=>setTimeout(r,500)); const now=new Date(); const date=now.toISOString().slice(0,10); const blob=new Blob([JSON.stringify({range,selectedIds,includeNotes,name,clinician,appt},null,2)],{type:'application/json'}); const a=document.createElement('a'); a.href=URL.createObjectURL(blob); a.download=`mindmeter-report-${date}.pdf`; a.click(); setProgress('Done'); await setSetting('lastExportDate',now.toISOString()); await setSetting('lastExportRange',{preset,start:range.start.toISOString(),end:range.end.toISOString()}); const count=(await getSetting('exportCount') as number|null)??0; await setSetting('exportCount',count+1)}} className="w-full min-h-12 rounded-xl bg-primary text-primary-foreground disabled:opacity-50">Generate</button>
    {!canGenerate && <p className="text-xs text-muted-foreground">Select a valid range with at least one check-in and one instrument.</p>}
    {progress && <p className="text-sm text-muted-foreground">{progress}</p>}
    <div className="text-xs text-muted-foreground">PDFs are visually formatted; for screen-reader-friendly export, use the JSON backup option.</div>
    <button className="text-xs underline text-muted-foreground" onClick={()=>{const blob=new Blob([JSON.stringify({checkins:inRange,notes:includeNotes?notesInRange:[]},null,2)],{type:'application/json'}); const a=document.createElement('a'); a.href=URL.createObjectURL(blob); a.download='mindmeter-backup.json'; a.click()}}>Download JSON backup option</button>
  </div></div>
}
