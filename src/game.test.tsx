import {render,screen} from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import {beforeEach,expect,test,vi} from 'vitest'
import App from './App'
import {lessons,storageKey} from './data'
import {balance,grant,migrateGame,gameKey,unlocked,readGame} from './game'
import {practiceKey,questionBank} from './practice'
import LearningMap from './LearningMap'
beforeEach(()=>{localStorage.clear();window.scrollTo=vi.fn()})
test('legacy progress and practice migrate idempotently without overwriting originals',()=>{
 localStorage.setItem(storageKey,JSON.stringify(['bpmf']))
 localStorage.setItem(practiceKey,JSON.stringify({bpmf:{attempts:2,correct:12,total:12,updatedAt:'2026-10-22'}}))
 const first=migrateGame();expect(balance(first)).toBe(18)
 localStorage.setItem(gameKey,JSON.stringify(first));expect(migrateGame()).toEqual(first)
 expect(localStorage.getItem(storageKey)).toBe('["bpmf"]')
 expect(balance(grant(first,'bpmf',['lesson','practice','perfect']))).toBe(18)
 expect(balance(grant(first,'dtnl',['lesson']))).toBe(28)
})
test('map locks future courses, unlocks after learning and respects old completed courses',()=>{
 expect(unlocked(1,[])).toBe(false);expect(unlocked(1,['bpmf'])).toBe(true);expect(unlocked(1,['dtnl'])).toBe(true)
 const onLearn=vi.fn();const view=render(<LearningMap completed={[]} game={{claims:[],reviewed:[]}} onLearn={onLearn} onReview={()=>{}} onPractice={()=>{}}/>);
 expect(screen.getByRole('button',{name:/再認識.*尚未解鎖/})).toBeDisabled()
 view.rerender(<LearningMap completed={['bpmf']} game={{claims:[],reviewed:[]}} onLearn={onLearn} onReview={()=>{}} onPractice={()=>{}}/>);
 expect(screen.getByRole('button',{name:/再認識.*目前關卡/})).toBeEnabled()
 const future={...lessons[0],id:'third'};expect(unlocked(2,['bpmf','dtnl'],[...lessons,future])).toBe(true)
})
test('course completion awards once, persists, and review does not complete another course',async()=>{
 const user=userEvent.setup();const view=render(<App/>);
 await user.click(screen.getByRole('button',{name:/繼續學習：/}));
 for(let i=0;i<3;i++)await user.click(screen.getByRole('button',{name:'下一步'}));await user.click(screen.getByRole('button',{name:'完成本堂課'}));
 expect(screen.getByRole('status')).toHaveTextContent('進度已保存');expect(balance(readGame())).toBe(10);
 await user.click(screen.getByRole('button',{name:'學習課程'}));
 await user.click(screen.getByRole('button',{name:'複習：一起認識 ㄅ ㄆ ㄇ ㄈ'}));
 await user.selectOptions(screen.getByLabelText('選擇課程'),'dtnl');
 for(let i=0;i<3;i++)await user.click(screen.getByRole('button',{name:'下一步'}));await user.click(screen.getByRole('button',{name:'完成本課複習'}));
 expect(localStorage.getItem(storageKey)).toBe('["bpmf"]');
 view.unmount();render(<App/>);expect(balance(readGame())).toBe(10);
 await user.click(screen.getByRole('button',{name:/複習：一起認識/}));for(let i=0;i<3;i++)await user.click(screen.getByRole('button',{name:'下一步'}));await user.click(screen.getByRole('button',{name:'完成本課複習'}));expect(balance(readGame())).toBe(10)
})
test('practice and perfect bonuses are once per course including mixed rounds',async()=>{
 const user=userEvent.setup();const view=render(<App/>);
 async function finish(perfect:boolean){await user.click(screen.getByRole('button',{name:/開始本組練習/}));while(!screen.queryByText(/正確率：/)){const prompt=screen.getAllByRole('heading',{level:2}).at(-1)!.textContent;const q=questionBank().find(q=>q.prompt===prompt)!;await user.click(screen.getByRole('button',{name:perfect?q.answer:q.options.find(o=>o!==q.answer)!}));await user.click(screen.getByRole('button',{name:/下一題|查看結果/}))}}
 await user.click(screen.getByRole('button',{name:'注音練習'}));await finish(false);expect(balance(readGame())).toBe(5)
 await user.click(screen.getByRole('button',{name:'選擇其他練習'}));await finish(true);expect(balance(readGame())).toBe(8)
 await user.selectOptions(screen.getByLabelText('選擇練習課程'),'mixed');await finish(true);expect(balance(readGame())).toBe(8)
 view.unmount();render(<App/>);expect(balance(readGame())).toBe(8)
})
