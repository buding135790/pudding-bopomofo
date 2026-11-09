import {render,screen} from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import {beforeEach,expect,test,vi} from 'vitest'
import App from './App'
import {storageKey} from './data'
beforeEach(()=>{localStorage.clear();window.scrollTo=vi.fn()})
test('complete a lesson and retain progress after remount',async()=>{
 const user=userEvent.setup();const view=render(<App/>);
 await user.click(screen.getByRole('button',{name:/繼續學習：/}));
 expect(screen.getByText('b',{selector:'dd'})).toBeInTheDocument();
 for(let i=0;i<3;i++)await user.click(screen.getByRole('button',{name:/下一步/}));
 await user.click(screen.getByRole('button',{name:/完成本堂課/}));
 expect(JSON.parse(localStorage.getItem(storageKey)!)).toEqual(['bpmf']);
 view.unmount();render(<App/>);
 await user.click(screen.getByRole('button',{name:'學習記錄'}));
 expect(screen.getByText('1 / 15 課（7%）')).toBeInTheDocument();
})
test('malformed progress opens a usable course list and only four learning destinations',async()=>{
 localStorage.setItem(storageKey,'broken');render(<App/>);
 expect(screen.getByRole('heading',{name:'學習課程'})).toBeInTheDocument();
 expect(screen.getByRole('navigation').querySelectorAll('button')).toHaveLength(4);
 expect(document.querySelectorAll('.course-row')).toHaveLength(11);
 await userEvent.click(screen.getByRole('button',{name:'拼讀學習'}));
 expect(document.querySelectorAll('.course-row')).toHaveLength(4);
 expect(screen.getAllByRole('button',{name:/尚未解鎖：/})).toHaveLength(4);
})
