import {render,screen} from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import {beforeEach,expect,test,vi} from 'vitest'
import App from './App'
import {storageKey} from './data'
beforeEach(()=>{localStorage.clear();window.scrollTo=vi.fn()})
test('complete a lesson and retain progress after remount',async()=>{
 const user=userEvent.setup();const view=render(<App/>);
 await user.click(screen.getByRole('button',{name:/開始今天的學習/}));
 expect(screen.getByText('漢語拼音：b')).toBeInTheDocument();
 for(let i=0;i<3;i++)await user.click(screen.getByRole('button',{name:/下一個符號/}));
 await user.click(screen.getByRole('button',{name:/完成本堂課/}));
 expect(JSON.parse(localStorage.getItem(storageKey)!)).toEqual(['bpmf']);
 view.unmount();render(<App/>);
 await user.click(screen.getByRole('button',{name:'我的學習'}));
 expect(screen.getByText(/已完成 1 \/ 15 堂課/)).toBeInTheDocument();
})
test('malformed storage does not break app and Taiwanese remains independent',async()=>{
 localStorage.setItem(storageKey,'broken');render(<App/>);
 await userEvent.click(screen.getByRole('button',{name:'了解台灣台語課程'}));
 expect(screen.getByText(/台灣台語和台灣國語是不同的語言/)).toBeInTheDocument();
 expect(screen.getByText(/目前還不能開始學習/)).toBeInTheDocument();
})
