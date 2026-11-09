import {basicLessons,graduated,lessons,nextLessonIndex,stages} from './data'
import {unlocked} from './game'
export function Graduation({completed}:{completed:string[]}){
 return graduated(completed)?<p className="completion-note" aria-label="基礎注音畢業成就">基礎注音已完成：37 個符號，11 節課。</p>:null
}
export default function CourseCatalog({completed,onOpen,onReview,section='all'}:{completed:string[];onOpen:(i:number)=>void;onReview:(i:number)=>void;section?:'basic'|'advanced'|'all'}){
 const next=nextLessonIndex(completed)
 const basicCount=basicLessons.filter(l=>completed.includes(l.id)).length
 const selected=stages.filter(s=>section==='all'||(section==='basic'?s.id===1:s.id>1))
 return <section className="curriculum-catalog">
  <div className="page-heading"><h1>{section==='advanced'?'拼讀學習':'學習課程'}</h1><span>{section==='advanced'?'聲調、拼讀、詞語與閱讀':'37 個注音符號 · 11 節基礎課程'}</span></div>
  {section!=='advanced'&&<section className="progress-panel" aria-label="目前學習進度"><div><strong>基礎課程 {basicCount} / 11</strong><span>{Math.round(basicCount/11*100)}%</span></div><progress value={basicCount} max={11} aria-label="基礎課程完成比例"/><div className="continue-row">{next>=0?<button className="primary" onClick={()=>onOpen(next)}>繼續學習：{lessons[next].title}</button>:<p>全部課程已完成，可選擇課程複習。</p>}</div><Graduation completed={completed}/></section>}
  {selected.map(stage=><section className="curriculum-stage" key={stage.id}><h2>{stage.id===1?'基礎注音課程':stage.title}</h2><ol className="course-list">{lessons.filter(l=>l.stage===stage.id).map(l=>{const i=lessons.indexOf(l),done=completed.includes(l.id),open=unlocked(i,completed);return <li key={l.id}><article className={`course-row ${done?'completed':open?'available':'locked'}`}><span className="course-number">{i+1}</span><div className="course-info"><h3>{l.title}</h3><p>{done?'已完成':open?'可學習':`完成「${lessons[i-1].title}」後解鎖`}</p></div><button className={open&&!done?'primary':'secondary'} disabled={!open} aria-label={`${done?'複習':open?'學習':'尚未解鎖'}：${l.title}`} onClick={()=>done?onReview(i):onOpen(i)}>{done?'複習':open?'學習':'未解鎖'}</button></article></li>})}</ol></section>)}
 </section>
}
