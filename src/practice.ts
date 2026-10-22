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
export function makeRound(scope:string,previous:string[]=[],courses:Lesson[]=lessons):Question[]{
 const bank=questionBank(courses).filter(q=>scope==='mixed'||q.lessonId===scope)
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
 const records=readRecords(),groups=[...new Set(round.map(q=>q.lessonId))]
 if(scope==='mixed')groups.push('mixed')
 for(const id of groups){const subset=round.filter(q=>id==='mixed'||q.lessonId===id);records[id]={attempts:(records[id]?.attempts||0)+1,correct:subset.filter(q=>answers[q.id]===q.answer).length,total:subset.length,updatedAt:new Date().toISOString(),rewardEligible:scope!=='mixed'}}
 try{localStorage.setItem(practiceKey,JSON.stringify(records));return true}catch{return false}
}
export function readScope(){try{const value=localStorage.getItem('pudding-practice-scope');return value==='mixed'||lessons.some(l=>l.id===value)?value!:lessons[0].id}catch{return lessons[0].id}}
