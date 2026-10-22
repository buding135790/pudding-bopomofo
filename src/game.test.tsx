import {render,screen} from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import {beforeEach,expect,test,vi} from 'vitest'
import App from './App'
import {lessons,storageKey} from './data'
import {balance,grant,migrateGame,gameKey,unlocked} from './game'
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
test('course celebration awards once, persists, and review does not complete another course',async()=>{
 const user=userEvent.setup();const view=render(<App/>);
 await user.click(screen.getByRole('button',{name:'學習地圖'}));await user.click(screen.getByRole('button',{name:/一起認識.*目前關卡/}));
 for(let i=0;i<3;i++)await user.click(screen.getByRole('button',{name:/下一個符號/}));await user.click(screen.getByRole('button',{name:/完成本堂課/}));
 expect(screen.getByText('通關成功，布丁為你鼓掌！')).toBeInTheDocument();expect(screen.getByRole('status')).toHaveTextContent('10 顆')
 await user.click(screen.getByRole('button',{name:'看看闖關地圖'}));expect(screen.getByRole('button',{name:/再認識.*目前關卡/})).toBeEnabled()
 await user.click(screen.getAllByRole('button',{name:'複習'})[1]);
 for(let i=0;i<3;i++)await user.click(screen.getByRole('button',{name:/下一個符號/}));await user.click(screen.getByRole('button',{name:'完成本課複習'}));
 expect(localStorage.getItem(storageKey)).toBe('["bpmf"]');
 view.unmount();render(<App/>);expect(screen.getByText('10',{selector:'.candy-strip strong'})).toBeInTheDocument()
 await user.click(screen.getByRole('button',{name:/開始今天的學習/}));await user.click(screen.getByRole('button',{name:/一起認識 ㄅ ㄆ ㄇ ㄈ/}));for(let i=0;i<3;i++)await user.click(screen.getByRole('button',{name:/下一個符號/}));await user.click(screen.getByRole('button',{name:/完成本堂課/}));expect(screen.getByRole('status')).toHaveTextContent('不重複發放')

},10000)
test('practice and perfect bonuses are once per course including mixed rounds',async()=>{
 const user=userEvent.setup();const view=render(<App/>);
 async function finish(perfect:boolean){await user.click(screen.getByRole('button',{name:/開始本組練習/}));while(!screen.queryByText(/正確率：/)){const prompt=screen.getAllByRole('heading',{level:2}).at(-1)!.textContent;const q=questionBank().find(q=>q.prompt===prompt)!;await user.click(screen.getByRole('button',{name:perfect?q.answer:q.options.find(o=>o!==q.answer)!}));await user.click(screen.getByRole('button',{name:/下一題|查看結果/}))}}
 await user.click(screen.getByRole('button',{name:'開始互動練習'}));await finish(false);expect(screen.getByText('獲得 5 顆布丁糖果！')).toBeInTheDocument()
 await user.click(screen.getByRole('button',{name:'返回課程選擇與紀錄'}));await finish(true);expect(screen.getByText('獲得 3 顆布丁糖果！')).toBeInTheDocument()
 await user.selectOptions(screen.getByLabelText('選擇練習課程'),'mixed');await finish(true);expect(screen.getByText(/綜合練習完成！分課通關獎勵/)).toBeInTheDocument()
 view.unmount();render(<App/>);expect(screen.getByText('8',{selector:'.candy-strip strong'})).toBeInTheDocument()
})
