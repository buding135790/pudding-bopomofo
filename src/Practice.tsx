import {useEffect,useState} from 'react'
import {ArrowRight, Trophy} from 'lucide-react'
import {lessons} from './data'
import {makeRound,questionBank,readRecords,readScope,saveResults,type Question} from './practice'
export default function Practice({initialLessonId,onReview}:{initialLessonId?:string;onReview:(id:string)=>void}){
 const [scope,setScope]=useState(initialLessonId||readScope),[round,setRound]=useState<Question[]>([]),[answers,setAnswers]=useState<Record<string,string>>({}),[index,setIndex]=useState(0),[finished,setFinished]=useState(false),[saved,setSaved]=useState(true)
 useEffect(()=>{try{localStorage.setItem('pudding-practice-scope',scope)}catch{/* Practice remains usable without storage. */}},[scope])
 const title=scope==='mixed'?'綜合隨機練習':lessons.find(l=>l.id===scope)?.title
 const current=round[index],selected=current?answers[current.id]:undefined
 const correct=round.filter(q=>answers[q.id]===q.answer).length
 const wrong=round.filter(q=>answers[q.id]!==q.answer)
 function start(){setRound(makeRound(scope,round.map(q=>q.id)));setAnswers({});setIndex(0);setFinished(false);setSaved(true)}
 function choose(value:string){setScope(value);setRound([]);setAnswers({});setIndex(0);setFinished(false);try{localStorage.setItem('pudding-practice-scope',value)}catch{/* Selection still works without persistence. */}}
 const records=readRecords()
 return <section className="workspace quiz"><div className="eyebrow">A LITTLE CHALLENGE</div><h1>注音互動練習</h1>
 <label htmlFor="practice-course">選擇練習課程</label><select id="practice-course" value={scope} onChange={e=>choose(e.target.value)}>{lessons.map(l=><option key={l.id} value={l.id}>{l.title}</option>)}<option value="mixed">綜合隨機練習</option></select>
 {!round.length?<><h2>{title}</h2><p>注音辨認、拼音對照、發音知識，每次重新排列題目。發音知識是文字練習，並非音訊測驗。</p><p>共 {makeCount(scope)} 題 · 刷新頁面會重新開始，已完成的練習紀錄會保留。</p><button className="primary" onClick={start}>開始本組練習 <ArrowRight size={17}/></button><div className="practice-history"><h2>各課練習紀錄</h2>{[...lessons.map(l=>({id:l.id,title:l.title})),{id:'mixed',title:'綜合隨機練習'}].map(l=><p key={l.id}>{l.title}：{records[l.id]?`已練習 ${records[l.id].attempts} 次 · 最近答對 ${records[l.id].correct} / ${records[l.id].total} 題`:'尚未練習'}</p>)}</div></>:
 finished?<><Trophy className="trophy" size={56}/><h2>完成了！答對 {correct} / {round.length} 題</h2><p>正確率：{Math.round(correct/round.length*100)}%</p><p role="status">{saved?'練習紀錄已儲存；課程完成進度不受影響。':'目前無法儲存練習紀錄，本次結果仍可查看。'}</p><h2>錯題與答案解析</h2>{wrong.length?wrong.map(q=><article className="feedback" key={q.id}><h3>{q.prompt}</h3><p>你的答案：{answers[q.id]} · 正確答案：{q.answer}</p><p>{q.why}</p><button className="text-link" onClick={()=>onReview(q.lessonId)}>複習這一課</button></article>):<p>全部答對，沒有錯題！</p>}<button className="primary" onClick={start}>再練習一次</button><button className="secondary" onClick={()=>setRound([])}>返回課程選擇與紀錄</button></>:
 <><p>{title} · 第 {index+1} / {round.length} 題</p><div className="track"><div style={{width:`${index/round.length*100}%`}}/></div><h2>{current.prompt}</h2><div className="answers">{current.options.map(o=><button key={o} disabled={selected!==undefined} className={selected!==undefined?(o===current.answer?'correct':o===selected?'incorrect':''):''} onClick={()=>setAnswers(a=>({...a,[current.id]:o}))}>{o}</button>)}</div>{selected!==undefined&&<div className="feedback" role="status"><strong>{selected===current.answer?'答對了，做得好！':'沒關係，我們一起記住它。'}</strong><p>{current.why}</p><button className="primary" onClick={()=>{if(index===round.length-1){setSaved(saveResults(round,answers,scope));setFinished(true)}else setIndex(index+1)}}>{index===round.length-1?'查看結果':'下一題'} <ArrowRight size={17}/></button></div>}</>}
 </section>
}
function makeCount(scope:string){return questionBank().filter(q=>scope==='mixed'||q.lessonId===scope).length}
