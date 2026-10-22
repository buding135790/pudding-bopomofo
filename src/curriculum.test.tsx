import {render,screen,within} from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import {beforeEach,expect,test,vi} from 'vitest'
import App from './App'
import Practice from './Practice'
import {basicLessons,lessons,storageKey,graduated,readProgress} from './data'
import {makeRound,questionBank,roundSize,saveResults} from './practice'
import {migrateGame,unlocked} from './game'
beforeEach(()=>{localStorage.clear();window.scrollTo=vi.fn()})
test('37 symbols appear exactly once in the requested 11 lessons; every lesson has a varied valid bank',()=>{
 const groups=['ㄅㄆㄇㄈ','ㄉㄊㄋㄌ','ㄍㄎㄏ','ㄐㄑㄒ','ㄓㄔㄕㄖ','ㄗㄘㄙ','ㄧㄨㄩ','ㄚㄛㄜㄝ','ㄞㄟㄠㄡ','ㄢㄣㄤㄥ','ㄦ']
 expect(basicLessons.map(l=>l.symbols.map(c=>c.s).join(''))).toEqual(groups)
 expect(new Set(groups.join('')).size).toBe(37)
 expect(lessons.map(l=>l.stage)).toEqual([...Array(11).fill(1),2,3,4,5])
 const all=questionBank();expect(new Set(all.map(q=>q.id)).size).toBe(all.length);expect(new Set(all.map(q=>q.prompt)).size).toBe(all.length)
 for(const lesson of lessons){const bank=questionBank([lesson]);expect(bank.length).toBeGreaterThan(12);expect(new Set(bank.map(q=>q.prompt)).size).toBe(bank.length);expect(new Set(bank.map(q=>q.kind)).size).toBeGreaterThanOrEqual(3)
  for(const q of bank){expect(q.lessonId).toBe(lesson.id);expect(q.options.length).toBeGreaterThanOrEqual(2);expect(new Set(q.options).size).toBe(q.options.length);expect(q.options.filter(o=>o===q.answer)).toHaveLength(1);expect(q.why.length).toBeGreaterThan(5)}
  for(const card of lesson.symbols){expect(card.tip).toBeTruthy();expect(card.word).toBeTruthy();expect(card.example).toBeTruthy()}
 }
 const vowels=questionBank(basicLessons.filter(l=>l.kind==='vowel'))
 expect(vowels.filter(q=>q.kind==='recognition').every(q=>!q.prompt.includes('聲母'))).toBe(true)
 expect(questionBank([basicLessons[10]]).every(q=>q.options.length>1)).toBe(true)
})
test('samples new questions, preserves bank and limits mixed practice to available courses',()=>{
 const bank=questionBank([lessons[0]]),copy=JSON.stringify(bank),first=makeRound('bpmf'),second=makeRound('bpmf',first.map(q=>q.id))
 expect(first).toHaveLength(roundSize);expect(second.every(q=>!first.some(old=>old.id===q.id))).toBe(true);expect(JSON.stringify(bank)).toBe(copy)
 const available=lessons.slice(0,3),mixed=makeRound('mixed',[],available)
 expect(mixed).toHaveLength(24);expect(new Set(mixed.map(q=>q.lessonId))).toEqual(new Set(available.map(l=>l.id)));expect(new Set(mixed.map(q=>q.id)).size).toBe(24)
 const answers=Object.fromEntries(mixed.map(q=>[q.id,q.answer]));saveResults(mixed,answers,'mixed');expect(migrateGame().claims).toEqual([])
})
test('legacy two-lesson user sees all basic lessons and immediately continues through graduation and all later stages',async()=>{
 localStorage.setItem(storageKey,JSON.stringify(['bpmf','dtnl']));const user=userEvent.setup();const view=render(<App/>);
 const firstStage=screen.getByRole('heading',{name:'第一階段 · 基礎注音 · 37 個符號'}).closest('section')!
 expect(within(firstStage).getAllByRole('article')).toHaveLength(11)
 expect(screen.getByRole('button',{name:'繼續學習：認識 ㄍ ㄎ ㄏ'})).toBeEnabled()
 const third=lessons[2]
 await user.click(screen.getByRole('button',{name:`繼續學習：${third.title}`}));expect(screen.getByText('漢語拼音：g')).toBeInTheDocument()
 expect(screen.getByRole('button',{name:lessons[3].title})).toBeDisabled()
 for(let index=2;index<lessons.length;index++){
  const lesson=lessons[index]
  for(let card=1;card<lesson.symbols.length;card++)await user.click(screen.getByRole('button',{name:/下一個符號|下一張卡片/}))
  await user.click(screen.getByRole('button',{name:'完成本堂課'}))
  expect(readProgress()).toContain(lesson.id)
  if(index===10){expect(screen.getByLabelText('基礎注音畢業成就')).toBeInTheDocument();expect(graduated(readProgress())).toBe(true)}
  if(index<lessons.length-1){expect(unlocked(index+1,readProgress())).toBe(true);await user.click(screen.getByRole('button',{name:`繼續學習：${lessons[index+1].title}`}))}
 }
 expect(readProgress()).toEqual(lessons.map(l=>l.id));view.unmount();render(<App/>);
 expect(screen.getByLabelText('基礎注音畢業成就')).toBeInTheDocument();expect(screen.getByText('所有階段已完成，歡迎再來複習 ♡')).toBeInTheDocument()
},20000)
test.each(['gkh','iwu','aoee','er','tones','blending','daily-words','short-reading'])('%s supports a real 12-question interactive round and persistent results',async id=>{
 const user=userEvent.setup();const view=render(<Practice initialLessonId={id} onReview={()=>{}}/>);await user.click(screen.getByRole('button',{name:/開始本組練習/}))
 for(let i=0;i<12;i++){
  const prompt=screen.getAllByRole('heading',{level:2}).at(-1)!.textContent;const q=questionBank([lessons.find(l=>l.id===id)!]).find(q=>q.prompt===prompt)!
  expect(q).toBeDefined();await user.click(screen.getByRole('button',{name:q.answer}));await user.click(screen.getByRole('button',{name:/下一題|查看結果/}))
 }
 expect(screen.getByText('完成了！答對 12 / 12 題')).toBeInTheDocument();view.unmount();render(<Practice onReview={()=>{}}/>);expect(screen.getByLabelText('選擇練習課程')).toHaveValue(id);expect(screen.getByText(new RegExp(`${lessons.find(l=>l.id===id)!.title}：已練習 1 次`))).toBeInTheDocument()
})
