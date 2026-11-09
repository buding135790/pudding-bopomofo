import {lessons,type Lesson} from './data'
export type {Lesson} from './data'
export type Question={id:string;lessonId:string;kind:string;prompt:string;options:string[];answer:string;why:string}
export const roundSize=12
export const mixedRoundSize=24
function options(answer:string,others:string[]){return [answer,...[...new Set(others)].filter(v=>v!==answer).slice(0,3)]}
export function questionBank(courses:Lesson[]=lessons):Question[]{
 const basics=lessons.filter(l=>l.stage===1).flatMap(l=>l.symbols)
 return courses.flatMap(lesson=>{
  const generated:Question[]=lesson.kind==='content'?[]:lesson.symbols.flatMap(c=>{
   const pool=[...lesson.symbols,...basics]
   const label=lesson.kind==='initial'?'聲母':'韻符'
   const why=`${c.word}：${c.example}。${c.s} 的漢語拼音對照為 ${c.p}。${c.note||''}`
   const make=(kind:string,prompt:string,answer:string,others:string[],explanation=why):Question=>({id:`${lesson.id}-${c.s}-${kind}`,lessonId:lesson.id,kind,prompt,answer,options:options(answer,others),why:explanation})
   return [
    make('recognition',`「${c.word}」的${label==='聲母'?'聲母是哪個注音符號':'完整注音包含哪個本課韻符'}？`,c.s,pool.filter(s=>!c.example.includes(s.s)).map(s=>s.s)),
    make('pinyin',`注音「${c.s}」對應哪個漢語拼音（依本課對照）？`,c.p,pool.map(s=>s.p)),
    make('articulation',`哪個符號符合這個發音說明？${c.tip}`,c.s,pool.map(s=>s.s),`${c.s}：${c.tip}`),
    make('reading',`練習「${c.s}」：例字「${c.word}」的完整注音是？`,c.example,pool.map(s=>s.example)),
    make('example',`哪個例字的完整注音包含「${c.s}」？`,c.word,pool.filter(s=>!s.example.includes(c.s)).map(s=>s.word)),
    make('position',`發「${c.s}」時，哪個口型或舌位提示合適？`,c.tip,pool.map(s=>s.tip),`${c.s}：${c.tip}`),
    make('reverse-pinyin',`本課拼音對照「${c.p}」指的是哪個注音符號？`,c.s,pool.filter(s=>s.p!==c.p).map(s=>s.s))
   ]
  })
  return [...generated,...(lesson.exercises||[]).map((q,i)=>({...q,id:`${lesson.id}-custom-${i}`,lessonId:lesson.id}))]
 })
}
export function shuffle<T>(items:T[],random=Math.random):T[]{const next=[...items];for(let i=next.length-1;i>0;i--){const j=Math.floor(random()*(i+1));[next[i],next[j]]=[next[j],next[i]]}return next}
export function makeRound(scope:string,previous:string[]=[],courses:Lesson[]=lessons,mode:PracticeMode='all'):Question[]{
 const mistakes=scope==='mistakes'?readMistakes():{}
 const bank=questionBank(courses).filter(q=>(scope==='mixed'||scope==='mistakes'||q.lessonId===scope)&&matchesMode(q,mode)).filter(q=>scope!=='mistakes'||(mistakes[q.id]&&!mistakes[q.id].corrected))
 const fresh=(items:Question[])=>[...shuffle(items.filter(q=>!previous.includes(q.id))),...shuffle(items.filter(q=>previous.includes(q.id))) ]
 let round:Question[]=[]
 if(scope==='mixed'){
  // Balance courses before drawing further items, so a large bank cannot hide a small course.
  const groups=shuffle(courses.map(l=>fresh(bank.filter(q=>q.lessonId===l.id))))
  while(round.length<mixedRoundSize&&groups.some(g=>g.length))for(const group of groups){if(group.length&&round.length<mixedRoundSize)round.push(group.shift()!)}
  round=shuffle(round)
 }else round=fresh(bank).slice(0,roundSize)
 if(round.length>1&&round.every((q,i)=>q.id===previous[i]))round=[...round.slice(1),round[0]]
 return round.map(q=>({...q,options:shuffle(q.options)}))
}
export const practiceKey='pudding-practice-v1'
export type PracticeRecord={attempts:number;correct:number;total:number;updatedAt:string;rewardEligible?:boolean}
export function readRecords():Record<string,PracticeRecord>{try{
 const data:unknown=JSON.parse(localStorage.getItem(practiceKey)||'{}')
 if(!data||typeof data!=='object'||Array.isArray(data))return {}
 return Object.fromEntries(Object.entries(data).filter(([,r])=>r&&Number.isInteger(r.attempts)&&r.attempts>0&&Number.isInteger(r.correct)&&Number.isInteger(r.total)&&r.total>0&&r.correct>=0&&r.correct<=r.total&&typeof r.updatedAt==='string'))
 }catch{return {}}}
export function saveResults(round:Question[],answers:Record<string,string>,scope:string){
 const stats=readAnswerStats()
 const records=readRecords(),groups=[...new Set(round.map(q=>q.lessonId))]
 if(scope==='mixed'||scope==='mistakes')groups.push(scope)
 for(const id of groups){const subset=round.filter(q=>id===scope||q.lessonId===id);records[id]={attempts:(records[id]?.attempts||0)+1,correct:subset.filter(q=>answers[q.id]===q.answer).length,total:subset.length,updatedAt:new Date().toISOString(),rewardEligible:lessons.some(l=>l.id===scope)&&round.length>=roundSize}}
 try{localStorage.setItem(practiceKey,JSON.stringify(records));localStorage.setItem(statsKey,JSON.stringify({correct:stats.correct+round.filter(q=>answers[q.id]===q.answer).length,total:stats.total+round.length}));return true}catch{return false}
}
export function readScope(){try{const value=localStorage.getItem('pudding-practice-scope');return value==='mixed'||value==='mistakes'||lessons.some(l=>l.id===value)?value!:lessons[0].id}catch{return lessons[0].id}}

// Additive records: old lesson/practice/game keys and their contents remain valid.
export const mistakeKey='pudding-mistakes-v1'
export type Mistake={answer:string;misses:number;corrected:boolean;updatedAt:string}
export function readMistakes():Record<string,Mistake>{
 try{const data=JSON.parse(localStorage.getItem(mistakeKey)||'{}');if(!data||typeof data!=='object'||Array.isArray(data))return {}
 const ids=new Set(questionBank().map(q=>q.id))
 const result:Record<string,Mistake>={}
 for(const [id,v] of Object.entries(data)){const m=v as Mistake;if(ids.has(id)&&m&&typeof m.answer==='string'&&Number.isInteger(m.misses)&&m.misses>0&&typeof m.corrected==='boolean'&&typeof m.updatedAt==='string')result[id]=m}
 return result
 }catch{return {}}
}
export function recordAnswer(q:Question,answer:string){
 const records=readMistakes(),old=records[q.id]
 if(answer===q.answer&&!old)return true
 records[q.id]=answer===q.answer?{...old,corrected:true,updatedAt:new Date().toISOString()}:{answer,misses:(old?.misses||0)+1,corrected:false,updatedAt:new Date().toISOString()}
 try{localStorage.setItem(mistakeKey,JSON.stringify(records));return true}catch{return false}
}
export const statsKey='pudding-answer-stats-v1'
export function readAnswerStats():{correct:number;total:number}{
 try{const d=JSON.parse(localStorage.getItem(statsKey)||'null');if(d&&Number.isInteger(d.total)&&Number.isInteger(d.correct)&&d.total>=0&&d.correct>=0&&d.correct<=d.total)return {correct:d.correct,total:d.total}}catch{/* Fall back to the legacy per-course results. */}
 return Object.entries(readRecords()).filter(([id])=>lessons.some(l=>l.id===id)).reduce((sum,[,r])=>({correct:sum.correct+r.correct,total:sum.total+r.total}),{correct:0,total:0})
}
export const practiceModes=[{id:'all',label:'全部題型'},{id:'recognition',label:'注音識別'},{id:'pinyin',label:'拼音對應'},{id:'pronunciation',label:'發音辨認（文字）'},{id:'blending',label:'注音拼讀'}] as const
export type PracticeMode=(typeof practiceModes)[number]['id']
export function matchesMode(q:Question,mode:PracticeMode){
 if(mode==='all')return true
 if(mode==='recognition')return ['recognition','example','reading'].includes(q.kind)
 if(mode==='pinyin')return ['pinyin','reverse-pinyin'].includes(q.kind)
 if(mode==='pronunciation')return ['articulation','position','tone','notation'].includes(q.kind)
 return lessons.find(l=>l.id===q.lessonId)?.stage===3
}
