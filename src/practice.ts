import {lessons} from './data'
export type Lesson = (typeof lessons)[number]
export type Question = {id:string;lessonId:string;kind:'recognition'|'pinyin'|'articulation';prompt:string;options:string[];answer:string;why:string}
export function questionBank(courses:Lesson[]=lessons):Question[] {
 return courses.flatMap(lesson=>lesson.symbols.flatMap(symbol=>[
  {id:`${lesson.id}-${symbol.s}-recognition`,lessonId:lesson.id,kind:'recognition' as const,prompt:`「${symbol.word}」的聲母是哪個注音符號？`,options:lesson.symbols.map(s=>s.s),answer:symbol.s,why:`${symbol.word} 的聲母是 ${symbol.s}，對應漢語拼音 ${symbol.p}。`},
  {id:`${lesson.id}-${symbol.s}-pinyin`,lessonId:lesson.id,kind:'pinyin' as const,prompt:`注音「${symbol.s}」對應哪個漢語拼音？`,options:lesson.symbols.map(s=>s.p),answer:symbol.p,why:`${symbol.s} 對應漢語拼音 ${symbol.p}。${symbol.tip}`},
  {id:`${lesson.id}-${symbol.s}-articulation`,lessonId:lesson.id,kind:'articulation' as const,prompt:`哪個符號符合這個發音說明？${symbol.tip}`,options:lesson.symbols.map(s=>s.s),answer:symbol.s,why:`這是 ${symbol.s}（${symbol.p}）的發音方式。例字：${symbol.word}。`}
 ]))
}
export function shuffle<T>(items:T[],random= Math.random):T[]{const next=[...items];for(let i=next.length-1;i>0;i--){const j=Math.floor(random()*(i+1));[next[i],next[j]]=[next[j],next[i]]}return next}
export function makeRound(scope:string,previous:string[]=[],courses:Lesson[]=lessons):Question[]{
 const bank=questionBank(courses).filter(q=>scope==='mixed'||q.lessonId===scope)
 let round=shuffle(bank)
 if(round.length>1&&round.every((q,i)=>q.id===previous[i]))round=[...round.slice(1),round[0]]
 return round.map(q=>({...q,options:shuffle(q.options)}))
}
export const practiceKey='pudding-practice-v1'
export type PracticeRecord={attempts:number;correct:number;total:number;updatedAt:string}
export function readRecords():Record<string,PracticeRecord>{try{
 const data:unknown=JSON.parse(localStorage.getItem(practiceKey)||'{}')
 if(!data||typeof data!=='object'||Array.isArray(data))return {}
 return Object.fromEntries(Object.entries(data).filter(([,r])=>r&&Number.isInteger(r.attempts)&&r.attempts>0&&Number.isInteger(r.correct)&&Number.isInteger(r.total)&&r.total>0&&r.correct>=0&&r.correct<=r.total&&typeof r.updatedAt==='string'))
 }catch{return {}}}
export function saveResults(round:Question[],answers:Record<string,string>,scope:string){
 const records=readRecords(),groups=[...new Set(round.map(q=>q.lessonId))]
 if(scope==='mixed')groups.push('mixed')
 for(const id of groups){const subset=round.filter(q=>id==='mixed'||q.lessonId===id);records[id]={attempts:(records[id]?.attempts||0)+1,correct:subset.filter(q=>answers[q.id]===q.answer).length,total:subset.length,updatedAt:new Date().toISOString()}}
 try{localStorage.setItem(practiceKey,JSON.stringify(records));return true}catch{return false}
}
export function readScope(){try{const value=localStorage.getItem('pudding-practice-scope');return value==='mixed'||lessons.some(l=>l.id===value)?value!:lessons[0].id}catch{return lessons[0].id}}
