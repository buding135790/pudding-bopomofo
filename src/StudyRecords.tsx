import {lessons,basicLessons} from './data'
import {readRecords,readAnswerStats,readMistakes,questionBank} from './practice'
export default function StudyRecords({completed,onReview,onMistakes}:{completed:string[];onReview:(id:string)=>void;onMistakes:()=>void}){
 const records=readRecords(),stats=readAnswerStats(),mistakes=readMistakes()
 const entries=questionBank().filter(q=>mistakes[q.id]).sort((a,b)=>mistakes[b.id].updatedAt.localeCompare(mistakes[a.id].updatedAt))
 const pending=entries.filter(q=>!mistakes[q.id].corrected)
 return <section><div className="page-heading"><h1>學習記錄</h1></div><div className="record-summary"><p>基礎課程<strong>{basicLessons.filter(l=>completed.includes(l.id)).length} / 11</strong></p><p>總學習進度<strong>{completed.length} / {lessons.length} 課（{Math.round(completed.length/lessons.length*100)}%）</strong></p><p>練習正確率<strong>{stats.total?`${Math.round(stats.correct/stats.total*100)}%（${stats.correct} / ${stats.total}）`:'尚無練習記錄'}</strong></p></div>
 <h2>課程與練習結果</h2><p className="muted">正確率依已保存的結果統計；舊版只保留各課最近一組成績。</p><div className="table-wrap"><table><thead><tr><th>課程</th><th>學習狀態</th><th>最近練習</th><th>操作</th></tr></thead><tbody>{lessons.map(l=><tr key={l.id}><th scope="row">{l.title}</th><td>{completed.includes(l.id)?'已完成':'未完成'}</td><td>{records[l.id]?`${records[l.id].correct} / ${records[l.id].total}`:'—'}</td><td>{completed.includes(l.id)&&<button className="text-link" onClick={()=>onReview(l.id)}>複習課程</button>}</td></tr>)}</tbody></table></div>
 <div className="section-actions"><h2>錯題記錄（{pending.length} 題待複習）</h2><button className="secondary" disabled={!pending.length} onClick={onMistakes}>複習錯題</button></div>
 {!entries.length?<p>尚無已保存的錯題。之後答錯的題目會記錄在這裡。</p>:<div className="mistake-list">{entries.map(q=><article key={q.id}><span className="muted">{lessons.find(l=>l.id===q.lessonId)?.title} · {mistakes[q.id].corrected?'已改正':'待複習'}</span><h3>{q.prompt}</h3><p>上次錯答：{mistakes[q.id].answer} · 正確答案：{q.answer}</p><p>{q.why}</p></article>)}</div>}
 </section>
}
