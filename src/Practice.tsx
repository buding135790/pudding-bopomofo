import {useEffect,useState} from 'react'
import {ArrowRight, Trophy} from 'lucide-react'
import {lessons} from './data'
import {makeRound,questionBank,roundSize,mixedRoundSize,readRecords,readScope,saveResults,type Question} from './practice'
export default function Practice({initialLessonId,onReview,onComplete,availableLessonIds=lessons.map(l=>l.id)}:{initialLessonId?:string;availableLessonIds?:string[];onReview:(id:string)=>void;onComplete?:(results:{id:string;perfect:boolean}[])=>string}){
 const available=lessons.filter(l=>availableLessonIds.includes(l.id))
 const initial=initialLessonId||readScope()
 const [scope,setScope]=useState(initial==='mixed'||available.some(l=>l.id===initial)?initial:available[0].id),[round,setRound]=useState<Question[]>([]),[answers,setAnswers]=useState<Record<string,string>>({}),[index,setIndex]=useState(0),[finished,setFinished]=useState(false),[saved,setSaved]=useState(true)
 useEffect(()=>{try{localStorage.setItem('pudding-practice-scope',scope)}catch{/* Practice remains usable without storage. */}},[scope])
 const [reward,setReward]=useState('')
 const title=scope==='mixed'?'綜合隨機練習':lessons.find(l=>l.id===scope)?.title
 const current=round[index],selected=current?answers[current.id]:undefined
 const correct=round.filter(q=>answers[q.id]===q.answer).length
 const wrong=round.filter(q=>answers[q.id]!==q.answer)
 function start(){setRound(makeRound(scope,round.map(q=>q.id),available));setAnswers({});setIndex(0);setFinished(false);setSaved(true);setReward('')}
 function choose(value:string){setScope(value);setRound([]);setAnswers({});setIndex(0);setFinished(false);try{localStorage.setItem('pudding-practice-scope',value)}catch{/* Selection still works without persistence. */}}
 const records=readRecords()
 return <section className="workspace quiz"><div className="eyebrow">A LITTLE CHALLENGE</div><h1>注音互動練習</h1>
 <label htmlFor="practice-course">選擇練習課程</label><select id="practice-course" value={scope} onChange={e=>choose(e.target.value)}>{lessons.map(l=><option disabled={!availableLessonIds.includes(l.id)} key={l.id} value={l.id}>{l.title}</option>)}<option value="mixed">綜合隨機練習</option></select>
 {!round.length?<><h2>{title}</h2><p>依課程提供注音辨認、拼音、發音知識、聲調或閱讀理解。隨機抽題並優先選取上一組未出現的題目；目前是文字練習，並非音訊測驗。</p><p>題庫 {makeCount(scope,availableLessonIds)} 題，每組隨機抽 {Math.min(scope==='mixed'?mixedRoundSize:roundSize,makeCount(scope,availableLessonIds))} 題 · 綜合練習僅作複習，不發放分課通關獎勵。刷新頁面會重新開始，已完成的練習紀錄會保留。</p><button className="primary" onClick={start}>開始本組練習 <ArrowRight size={17}/></button><div className="practice-history"><h2>各課練習紀錄</h2>{[...lessons.map(l=>({id:l.id,title:l.title})),{id:'mixed',title:'綜合隨機練習'}].map(l=><p key={l.id}>{l.title}：{records[l.id]?`已練習 ${records[l.id].attempts} 次 · 最近答對 ${records[l.id].correct} / ${records[l.id].total} 題`:'尚未練習'}</p>)}</div></>:
 finished?<><Trophy className="trophy" size={56}/><h2>完成了！答對 {correct} / {round.length} 題</h2><p>正確率：{Math.round(correct/round.length*100)}%</p><p role="status">{saved?'練習紀錄已儲存；課程完成進度不受影響。':'目前無法儲存練習紀錄，本次結果仍可查看。'}</p><div className="practice-celebration">🍮 太棒了，完成本組挑戰！{reward&&<p>{reward}</p>}</div><h2>錯題與答案解析</h2>{wrong.length?wrong.map(q=><article className="feedback" key={q.id}><h3>{q.prompt}</h3><p>你的答案：{answers[q.id]} · 正確答案：{q.answer}</p><p>{q.why}</p><button className="text-link" onClick={()=>onReview(q.lessonId)}>複習這一課</button></article>):<p>全部答對，沒有錯題！</p>}<button className="primary" onClick={start}>再練習一次</button><button className="secondary" onClick={()=>setRound([])}>返回課程選擇與紀錄</button></>:
 <><p>{title} · 第 {index+1} / {round.length} 題</p><div className="track"><div style={{width:`${index/round.length*100}%`}}/></div><h2>{current.prompt}</h2><div className="answers">{current.options.map(o=><button key={o} disabled={selected!==undefined} className={selected!==undefined?(o===current.answer?'correct':o===selected?'incorrect':''):''} onClick={()=>setAnswers(a=>({...a,[current.id]:o}))}>{o}</button>)}</div>{selected!==undefined&&<div className="feedback" role="status"><strong>{selected===current.answer?'答對了，做得好！':'沒關係，我們一起記住它。'}</strong><p>{current.why}</p><button className="primary" onClick={()=>{if(index===round.length-1){setSaved(saveResults(round,answers,scope));setReward(onComplete?.(scope==='mixed'?[]:[{id:scope,perfect:round.every(q=>answers[q.id]===q.answer)}])||'');setFinished(true)}else setIndex(index+1)}}>{index===round.length-1?'查看結果':'下一題'} <ArrowRight size={17}/></button></div>}</>}
 </section>
}
function makeCount(scope:string,available:string[]){return questionBank(lessons.filter(l=>available.includes(l.id))).filter(q=>scope==='mixed'||q.lessonId===scope).length}
