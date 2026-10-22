import {render,screen} from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import {beforeEach,expect,test,vi} from 'vitest'
import App from './App'
import Practice from './Practice'
import {lessons,storageKey} from './data'
import {makeRound,questionBank,readRecords,practiceKey} from './practice'
beforeEach(()=>{localStorage.clear();window.scrollTo=vi.fn()})
async function finishRound(wrongFirst=false){
 const user=userEvent.setup();let count=0
 while(!screen.queryByText(/正確率：/)){
  const prompt=screen.getAllByRole('heading',{level:2}).at(-1)!.textContent
  const q=questionBank().find(q=>q.prompt===prompt)!
  expect(q).toBeDefined()
  const choice=wrongFirst&&count===0?q.options.find(o=>o!==q.answer)!:q.answer
  await user.click(screen.getByRole('button',{name:choice}))
  expect(screen.getByRole('button',{name:choice})).toBeDisabled()
  expect(screen.getByRole('status')).toHaveTextContent(q.why)
  await user.click(screen.getByRole('button',{name:/下一題|查看結果/}))
  count++
 }
 return count
}
test.each(['bpmf','dtnl','mixed'])('%s loads its full bank, scores answers and survives remount',async(scope)=>{
 const user=userEvent.setup();const view=render(<Practice onReview={()=>{}}/>);
 await user.selectOptions(screen.getByLabelText('選擇練習課程'),scope)
 await user.click(screen.getByRole('button',{name:/開始本組練習/}))
 const count=await finishRound(true)
 expect(count).toBe(scope==='mixed'?24:12)
 expect(screen.getByText(`完成了！答對 ${count-1} / ${count} 題`)).toBeInTheDocument()
 expect(screen.getByText(/你的答案：/)).toBeInTheDocument()
 const records=readRecords();expect(records[scope].correct).toBe(count-1)
 if(scope==='mixed'){expect(records.bpmf.total).toBe(12);expect(records.dtnl.total).toBe(12)}
 await user.click(screen.getByRole('button',{name:'再練習一次'}))
 expect(screen.getByText(new RegExp(`第 1 / ${count} 題`))).toBeInTheDocument()
 view.unmount();render(<Practice onReview={()=>{}}/>)
 expect(screen.getByLabelText('選擇練習課程')).toHaveValue(scope)
 expect(screen.getByText(new RegExp(`最近答對 ${count-1} / ${count} 題`))).toBeInTheDocument()
 await user.click(screen.getByRole('button',{name:/開始本組練習/}))
 expect(screen.getByText(new RegExp(`第 1 / ${count} 題`))).toBeInTheDocument()
})
test('second lesson completion offers its own practice and records do not overwrite first lesson',async()=>{
 const user=userEvent.setup();localStorage.setItem(practiceKey,JSON.stringify({bpmf:{attempts:3,correct:10,total:12,updatedAt:'2026-10-22'}}))
 render(<App/>);await user.click(screen.getByRole('button',{name:/開始今天的學習/}))
 await user.click(screen.getByRole('button',{name:lessons[1].title}))
 await user.click(screen.getByRole('button',{name:'練習 ㄉㄊㄋㄌ'}))
 expect(screen.getByLabelText('選擇練習課程')).toHaveValue('dtnl')
 await user.click(screen.getByRole('button',{name:'回到學習首頁'}))
 await user.click(screen.getByRole('button',{name:/開始今天的學習/}))
 await user.click(screen.getByRole('button',{name:lessons[1].title}))
 for(let i=0;i<3;i++)await user.click(screen.getByRole('button',{name:/下一個符號/}))
 await user.click(screen.getByRole('button',{name:/完成本堂課/}))
 await user.click(screen.getByRole('button',{name:'練習 ㄉㄊㄋㄌ'}))
 await user.click(screen.getByRole('button',{name:/開始本組練習/}))
 await finishRound()
 expect(readRecords().bpmf).toEqual({attempts:3,correct:10,total:12,updatedAt:'2026-10-22'})
 expect(readRecords().dtnl.correct).toBe(12)
 expect(JSON.parse(localStorage.getItem(storageKey)!)).toEqual(['dtnl'])
})
test('question banks cover each lesson, all types and future courses automatically',()=>{
 const third={...lessons[0],id:'future'}
 const courses=[...lessons,third]
 for(const lesson of courses){const bank=makeRound(lesson.id,[],courses);expect(bank).toHaveLength(lesson.symbols.length*3);expect(new Set(bank.map(q=>q.kind)).size).toBe(3);expect(bank.every(q=>q.lessonId===lesson.id&&q.options.includes(q.answer))).toBe(true)}
 expect(new Set(makeRound('mixed',[],courses).map(q=>q.lessonId))).toEqual(new Set(courses.map(l=>l.id)))
 const old=makeRound('bpmf');const random=vi.spyOn(Math,'random').mockReturnValue(.999)
 const first=makeRound('bpmf');const next=makeRound('bpmf',first.map(q=>q.id));expect(next.map(q=>q.id)).not.toEqual(first.map(q=>q.id));expect(old).toHaveLength(12);random.mockRestore()
})
test('broken records and unavailable storage leave practice usable',async()=>{
 localStorage.setItem(practiceKey,'broken');expect(readRecords()).toEqual({})
 render(<Practice onReview={()=>{}}/>);const spy=vi.spyOn(Storage.prototype,'setItem').mockImplementation(()=>{throw new Error('blocked')})
 await userEvent.click(screen.getByRole('button',{name:/開始本組練習/}));await finishRound()
 expect(screen.getByRole('status')).toHaveTextContent('目前無法儲存')
 spy.mockRestore()
})
