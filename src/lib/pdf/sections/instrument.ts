import type { PDFBuilder } from '../generator'
import type { Instrument } from '@/lib/instruments'

type Checkin = { id?: number; type: string; timestamp: Date | string; score: number | null; severityBand: string | null }
type Response = { checkinId: number; questionId: string; value: number | null }

function median(nums:number[]){ if(!nums.length) return 0; const a=[...nums].sort((x,y)=>x-y); const m=Math.floor(a.length/2); return a.length%2?a[m]:(a[m-1]+a[m])/2 }
function stddev(nums:number[]){ if(nums.length<2) return 0; const mean=nums.reduce((a,b)=>a+b,0)/nums.length; const v=nums.reduce((a,b)=>a+(b-mean)**2,0)/nums.length; return Math.sqrt(v) }

export function addInstrumentSection(builder: PDFBuilder, instrument: Instrument, checkins: Checkin[], responses: Response[], opts?: { chartPng?: string; heatmapPng?: string }) {
  builder.addPageBreakIfNeeded(40)
  builder.addHeading(`${instrument.name} (${instrument.shortName})`, 2)
  builder.addParagraph(instrument.recallWindow, { muted: true })
  builder.addParagraph(`${instrument.description.split('.')[0]}.`, { muted: true })
  builder.addParagraph(`Total check-ins in range: ${checkins.length}`)
  builder.addSpacer(2)

  if (opts?.chartPng) {
    builder.addImage(opts.chartPng, 170, 80)
  } else {
    builder.addParagraph('Timeline chart placeholder (render SVG→canvas→PNG before embedding).', { muted: true })
  }

  const scores = checkins.map(c=>c.score).filter((s):s is number=>s!==null)
  const stats = {
    mean: scores.length ? scores.reduce((a,b)=>a+b,0)/scores.length : 0,
    median: median(scores),
    min: scores.length ? Math.min(...scores) : 0,
    max: scores.length ? Math.max(...scores) : 0,
    sd: stddev(scores),
    count: scores.length,
  }
  builder.addParagraph(`Stats — Mean: ${stats.mean.toFixed(2)} · Median: ${stats.median.toFixed(2)} · Min: ${stats.min} · Max: ${stats.max} · SD: ${stats.sd.toFixed(2)} · Count: ${stats.count}`)

  const dist = instrument.severityBands.map(b=>{
    const n=checkins.filter(c=>c.score!==null && (c.score as number)>=b.min && (c.score as number)<=b.max).length
    const pct=checkins.length?Math.round((n/checkins.length)*100):0
    return `${b.label}: ${pct}% (${n})`
  }).join(' | ')
  builder.addParagraph(`Severity distribution — ${dist}`)

  if (instrument.questions.length > 1) {
    builder.addPageBreakIfNeeded(90)
    if (opts?.heatmapPng) builder.addImage(opts.heatmapPng, 170, 90)
    else builder.addParagraph('Per-item heatmap placeholder (render off-screen component to PNG).', { muted: true })

    const rows = instrument.questions.map(q=>{
      const vals = checkins.map(c=>responses.find(r=>r.checkinId===c.id && r.questionId===q.key)?.value ?? null).filter((v):v is number=>v!==null)
      const mean = vals.length?vals.reduce((a,b)=>a+b,0)/vals.length:0
      const elevated = vals.filter(v=>v>=2).length
      const pct = vals.length?Math.round((elevated/vals.length)*100):0
      const lastIdx = checkins.map((c,i)=>({i,v:responses.find(r=>r.checkinId===c.id&&r.questionId===q.key)?.value??null})).filter(x=>x.v!==null&&x.v>=2).at(-1)?.i
      const last = lastIdx===undefined?'—':new Date(checkins[lastIdx].timestamp).toLocaleDateString()
      return { q:q.text, mean, pct, last }
    }).sort((a,b)=>b.mean-a.mean)

    builder.addParagraph('Item statistics (sorted by mean response descending):')
    rows.forEach(r=>builder.addParagraph(`${r.q} — mean ${r.mean.toFixed(2)} · ≥2: ${r.pct}% · last elevated: ${r.last}`, { muted: true }))
  } else {
    builder.addParagraph('Sleep and stress are non-validated quick checks intended for personal context, not clinical assessment.', { muted: true })
  }
}
