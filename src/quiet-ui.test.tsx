import {render,screen,within} from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import {beforeEach,expect,test,vi} from 'vitest'
import App from './App'
import Practice from './Practice'
import {lessons,storageKey} from './data'
import {questionBank,makeRound,matchesMode,recordAnswer,readMistakes,mistakeKey,practiceKey,readAnswerStats,saveResults,readRecords} from './practice'
beforeEach(()=>{localStorage.clear();window.scrollTo=vi.fn()})
test('four destinations expose courses, practice, advanced study and records without marketing UI',async()=>{
 localStorage.setItem(storageKey,JSON.stringify(['bpmf','dtnl']));const user=userEvent.setup();render(<App/>);
 const nav=screen.getByRole('navigation');expect(within(nav).getAllByRole('button').map(b=>b.textContent)).toEqual(['學習課程','注音練習','拼讀學習','學習記錄']);
 expect(document.querySelectorAll('.course-row')).toHaveLength(11);
 expect(document.querySelector('.hero')).toBeNull();expect(document.querySelector('.pudding')).toBeNull();
 expect(screen.getByRole('button',{name:'繼續學習：認識 ㄍ ㄎ ㄏ'})).toBeEnabled();
 await user.click(within(nav).getByRole('button',{name:'注音練習'}));expect(screen.getByLabelText('選擇練習課程')).toBeInTheDocument();
 await user.click(within(nav).getByRole('button',{name:'拼讀學習'}));expect(document.querySelectorAll('.course-row')).toHaveLength(4);
 await user.click(within(nav).getByRole('button',{name:'學習記錄'}));expect(screen.getByText('2 / 15 課（13%）')).toBeInTheDocument();expect(screen.getByRole('heading',{name:'錯題記錄（0 題待複習）'})).toBeInTheDocument();
})
test('mistakes survive refresh and can be reviewed, corrected and retained in records',async()=>{
 const user=userEvent.setup();const view=render(<App/>);await user.click(screen.getByRole('button',{name:'注音練習'}));await user.click(screen.getByRole('button',{name:'開始本組練習'}));
 const prompt=screen.getAllByRole('heading',{level:2}).at(-1)!.textContent,q=questionBank().find(q=>q.prompt===prompt)!;
 const incorrect=q.options.find(o=>o!==q.answer)!;await user.click(screen.getByRole('button',{name:incorrect}));
 expect(readMistakes()[q.id].corrected).toBe(false);
 view.unmount();render(<App/>);await user.click(screen.getByRole('button',{name:'學習記錄'}));expect(screen.getByText(q.prompt)).toBeInTheDocument();await user.click(screen.getByRole('button',{name:'複習錯題'}));
 expect(screen.getByLabelText('選擇練習課程')).toHaveValue('mistakes');await user.click(screen.getByRole('button',{name:'開始本組練習'}));
 expect(screen.getByRole('heading',{level:2,name:q.prompt})).toBeInTheDocument();await user.click(screen.getByRole('button',{name:q.answer}));await user.click(screen.getByRole('button',{name:'查看結果'}));
 expect(readMistakes()[q.id]).toMatchObject({answer:incorrect,corrected:true,misses:1});expect(readRecords().mistakes).toMatchObject({correct:1,total:1,rewardEligible:false});expect(readAnswerStats()).toEqual({correct:1,total:1});
 await user.click(screen.getByRole('button',{name:'學習記錄'}));expect(screen.getByRole('heading',{name:'錯題記錄（0 題待複習）'})).toBeInTheDocument();expect(screen.getByText(/已改正/)).toBeInTheDocument();
})
test('all practice modes filter existing questions; locked courses stay excluded',async()=>{
 const user=userEvent.setup();localStorage.setItem(storageKey,JSON.stringify(lessons.map(l=>l.id)));render(<App/>);await user.click(screen.getByRole('button',{name:'注音練習'}));await user.selectOptions(screen.getByLabelText('選擇練習課程'),'mixed');
 for(const mode of ['recognition','pinyin','pronunciation','blending'] as const){
  await user.selectOptions(screen.getByLabelText('題型'),mode);await user.click(screen.getByRole('button',{name:'開始本組練習'}));
  const prompt=screen.getAllByRole('heading',{level:2}).at(-1)!.textContent,q=questionBank().find(q=>q.prompt===prompt)!;expect(matchesMode(q,mode)).toBe(true);
 }
 const limited=makeRound('mixed',[],lessons.slice(0,1),'blending');expect(limited).toEqual([])
})
test('legacy records remain intact and completed-round accuracy is counted once',()=>{
 const legacy={bpmf:{correct:8,total:12,attempts:2,updatedAt:'2026-10-22'}};localStorage.setItem(practiceKey,JSON.stringify(legacy));expect(readAnswerStats()).toEqual({correct:8,total:12});
 const round=makeRound('dtnl');saveResults(round,Object.fromEntries(round.map(q=>[q.id,q.answer])),'dtnl');expect(readAnswerStats()).toEqual({correct:20,total:24});expect(readRecords().bpmf).toEqual(legacy.bpmf);
 const wrong=questionBank()[0];recordAnswer(wrong,wrong.options.find(o=>o!==wrong.answer)!);expect(readMistakes()[wrong.id].corrected).toBe(false);recordAnswer(wrong,wrong.answer);recordAnswer(wrong,wrong.options.find(o=>o!==wrong.answer)!);expect(readMistakes()[wrong.id]).toMatchObject({corrected:false,misses:2});
})
test('empty, damaged and unavailable mistake storage is handled without blocking practice',async()=>{
 localStorage.setItem(mistakeKey,'null');expect(readMistakes()).toEqual({});localStorage.setItem(mistakeKey,'broken');expect(readMistakes()).toEqual({});
 const user=userEvent.setup();render(<Practice initialLessonId="mistakes" onReview={()=>{}}/>);expect(screen.getByRole('button',{name:'開始本組練習'})).toBeDisabled();
 await user.selectOptions(screen.getByLabelText('選擇練習課程'),'bpmf');await user.click(screen.getByRole('button',{name:'開始本組練習'}));
 const prompt=screen.getAllByRole('heading',{level:2}).at(-1)!.textContent,q=questionBank().find(q=>q.prompt===prompt)!;
 const spy=vi.spyOn(Storage.prototype,'setItem').mockImplementation(()=>{throw new Error('blocked')});await user.click(screen.getByRole('button',{name:q.options.find(o=>o!==q.answer)!}));expect(screen.getByRole('status')).toHaveTextContent(q.why);spy.mockRestore()
})
