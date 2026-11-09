import {useState} from 'react'
import CourseCatalog from './CourseCatalog'
import Practice from './Practice'
import StudyRecords from './StudyRecords'
import {lessons,nextLessonIndex,readProgress,storageKey} from './data'
import {unlocked,useGame} from './game'
type Page='courses'|'practice'|'blending'|'records'|'lesson'
export default function App(){
 const [page,setPage]=useState<Page>('courses'),[completed,setCompleted]=useState(readProgress)
 const [lessonIndex,setLessonIndex]=useState(0),[cardIndex,setCardIndex]=useState(0),[reviewing,setReviewing]=useState(false)
 const [practiceLesson,setPracticeLesson]=useState<string>(),[practiceVisit,setPracticeVisit]=useState(0),[notice,setNotice]=useState(''),[finished,setFinished]=useState(false)
 const {award,review,storageWarning}=useGame()
 const lesson=lessons[lessonIndex],card=lesson.symbols[cardIndex],next=nextLessonIndex(completed)
 const available=lessons.filter((_,i)=>unlocked(i,completed)).map(l=>l.id)
 function go(p:Page){setPage(p);setFinished(false);setNotice('');window.scrollTo({top:0,behavior:'auto'})}
 function openLesson(i:number,isReview=false){if(!unlocked(i,completed))return;setLessonIndex(i);setCardIndex(0);setReviewing(isReview);go('lesson')}
 function openPractice(id?:string){if(id&&id!=='mixed'&&id!=='mistakes'&&!available.includes(id))return;setPracticeLesson(id);setPracticeVisit(v=>v+1);go('practice')}
 function complete(){
  let saved=true
  if(reviewing)review(lesson.id)
  else{award(lesson.id,['lesson']);const updated=[...new Set([...completed,lesson.id])];setCompleted(updated);try{localStorage.setItem(storageKey,JSON.stringify(updated))}catch{saved=false}}
  setFinished(true);setNotice(saved?(reviewing?'本課複習已完成。':'本課學習已完成，進度已保存。'):'本課已完成，但目前無法儲存進度。')
 }
 const nav:[Page,string][]=[['courses','學習課程'],['practice','注音練習'],['blending','拼讀學習'],['records','學習記錄']]
 const active=page==='lesson'?(lesson.stage===1?'courses':'blending'):page
 return <><header className="site-header"><a className="brand" href="#" onClick={e=>{e.preventDefault();go('courses')}}>布丁的注音小教室</a><nav aria-label="主要導覽">{nav.map(([id,label])=><button key={id} className={active===id?'active':''} aria-current={active===id?'page':undefined} onClick={()=>id==='practice'?openPractice():go(id)}>{label}</button>)}</nav></header>
 <main>{storageWarning&&<p className="feedback" role="alert">{storageWarning}</p>}
 {page==='courses'&&<CourseCatalog completed={completed} section="basic" onOpen={i=>openLesson(i)} onReview={i=>openLesson(i,true)}/>}
 {page==='blending'&&<CourseCatalog completed={completed} section="advanced" onOpen={i=>openLesson(i)} onReview={i=>openLesson(i,true)}/>}
 {page==='lesson'&&<section className="lesson-page"><button className="text-link back" onClick={()=>go(lesson.stage===1?'courses':'blending')}>返回{lesson.stage===1?'學習課程':'拼讀學習'}</button><div className="page-heading"><h1>{lesson.title}</h1><span>{reviewing?'複習':'學習'} · {cardIndex+1} / {lesson.symbols.length}</span></div>
 <label htmlFor="lesson-select">選擇課程</label><select id="lesson-select" value={lesson.id} onChange={e=>openLesson(lessons.findIndex(l=>l.id===e.target.value),reviewing)}>{lessons.map((l,i)=><option key={l.id} disabled={!unlocked(i,completed)} value={l.id}>{l.title}{!unlocked(i,completed)?'（未解鎖）':''}</option>)}</select>
 <p className="lesson-intro">{lesson.intro}</p><div className="symbol-tabs" aria-label="本課內容">{lesson.symbols.map((c,i)=><button key={c.s} className={i===cardIndex?'chosen':''} aria-pressed={i===cardIndex} onClick={()=>{setCardIndex(i);setFinished(false);setNotice('')}}>{c.s}</button>)}</div>
 <article className="study-card"><div className={`study-symbol ${lesson.kind==='content'?'content-title':''}`}>{card.s}</div><dl><div><dt>漢語拼音</dt><dd>{card.p}</dd></div><div><dt>{lesson.kind==='content'?'學習說明':'發音方法'}</dt><dd>{card.tip}</dd></div><div><dt>{lesson.stage===5?'例句':'例字'}</dt><dd>{card.word}<span className="example-reading">{card.example}</span></dd></div>{card.note&&<div><dt>注意</dt><dd>{card.note}</dd></div>}</dl></article>
 <div className="lesson-actions"><button className="secondary" disabled={cardIndex===0} onClick={()=>{setCardIndex(cardIndex-1);setFinished(false);setNotice('')}}>上一步</button>{cardIndex<lesson.symbols.length-1?<button className="primary" onClick={()=>{setCardIndex(cardIndex+1);setFinished(false);setNotice('')}}>下一步</button>:<button className="primary" disabled={finished} onClick={complete}>{reviewing?'完成本課複習':'完成本堂課'}</button>}</div>
 {notice&&<p role="status" className="feedback">{notice}</p>}<div className="lesson-footer">{finished&&next>=0&&<button className="primary" onClick={()=>openLesson(next)}>繼續學習：{lessons[next].title}</button>}<button className="secondary" onClick={()=>openPractice(lesson.id)}>練習 {lesson.stage===1?lesson.symbols.map(c=>c.s).join(''):lesson.title}</button></div></section>}
 {page==='practice'&&<Practice key={practiceVisit} initialLessonId={practiceLesson} availableLessonIds={available} onReview={id=>openLesson(lessons.findIndex(l=>l.id===id),true)} onComplete={results=>{for(const r of results)award(r.id,r.perfect?['practice','perfect']:['practice']);return ''}}/>}
 {page==='records'&&<StudyRecords completed={completed} onReview={id=>openLesson(lessons.findIndex(l=>l.id===id),true)} onMistakes={()=>openPractice('mistakes')}/>}
 </main><footer>台灣國語注音 · 學習記錄儲存於此瀏覽器</footer></>
}
