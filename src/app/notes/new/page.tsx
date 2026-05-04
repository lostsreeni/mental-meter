'use client'
import { useEffect, useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createNote } from '@/lib/db/repositories/notes'
import { db } from '@/lib/db/database'
import { getSetting, setSetting } from '@/lib/db/repositories/settings'

const TAGS = ['Work','Sleep','Medication','Relationships','Physical health','Therapy','Other']
const PROMPTS = ['What was happening today?','Anything notable about sleep, appetite, or energy?','Stressors or supports?','Medication changes?']

export default function NewNotePage(){
 const router=useRouter(); const [checkinId,setCheckinId]=useState<number|null>(null); const [instrumentId,setInstrumentId]=useState('')
 const [content,setContent]=useState(''); const [tags,setTags]=useState<string[]>([]); const [showPrivacy,setShowPrivacy]=useState(false)
 const key=useMemo(()=>`note:${checkinId ?? 'standalone'}`,[checkinId])
 useEffect(()=>{const p=new URLSearchParams(window.location.search);const id=Number(p.get('checkinId')??'');setCheckinId(Number.isFinite(id)?id:null);setInstrumentId(p.get('instrumentId')??'')},[])
 useEffect(()=>{(async()=>{const seen=await getSetting('note_privacy_seen_count') as number|null; setShowPrivacy((seen??0)<3); const d=await db.noteDrafts.get(key); if(d){setContent(d.content);setTags(d.tags)}})()},[key])
 useEffect(()=>{const t=setTimeout(()=>{void db.noteDrafts.put({key,content,tags,updatedAt:new Date()})},500); return ()=>clearTimeout(t)},[key,content,tags])
 const rotate = PROMPTS[new Date().getDate()%PROMPTS.length]
 const warn = content.length>=4500
 return <div className="min-h-screen bg-background px-6 py-8"><div className="max-w-2xl mx-auto space-y-4"><h1 className="text-2xl font-semibold">Add a note</h1>
 <p className="text-sm text-muted-foreground">{checkinId?`For ${instrumentId.toUpperCase()} check-in`:'Standalone quick note'}</p>
 <textarea value={content} onChange={e=>setContent(e.target.value.slice(0,5000))} placeholder={rotate} className="w-full min-h-[40vh] rounded-xl border p-4" />
 <div className="text-xs text-muted-foreground">{content.length}/5000 {warn && <span className="text-amber-700">Approaching limit</span>}</div>
 <div className="flex gap-2 flex-wrap">{TAGS.map(t=><button key={t} onClick={()=>setTags(prev=>prev.includes(t)?prev.filter(x=>x!==t):[...prev,t])} className={`px-2 py-1 border rounded-full text-xs ${tags.includes(t)?'bg-primary text-primary-foreground':''}`}>{t}</button>)}</div>
 {showPrivacy && <p className="text-xs text-muted-foreground">Notes stay on this device, like everything else.</p>}
 <div className="flex gap-2"><button className="flex-1 border rounded-xl min-h-12" onClick={()=>router.back()}>Cancel</button><button className="flex-1 bg-primary text-primary-foreground rounded-xl min-h-12" onClick={async()=>{if(!content.trim())return; await createNote({timestamp:new Date(),content:content.trim(),checkinId,tags,editedAt:null}); await db.noteDrafts.delete(key); const seen=await getSetting('note_privacy_seen_count') as number|null; await setSetting('note_privacy_seen_count',(seen??0)+1); router.push('/history')}}>Save</button></div>
 </div></div>
}
