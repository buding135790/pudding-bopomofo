export {basicLessons,stages} from './curriculum'
export type {Lesson,LearningCard} from './curriculum'
import {curriculum} from './curriculum'
export const lessons=curriculum
// Keep the original IDs and storage key: old course and reward records remain valid.
export const storageKey='pudding-learning-v1'
export function readProgress():string[]{try{const data:unknown=JSON.parse(localStorage.getItem(storageKey)||'[]');return Array.isArray(data)?[...new Set(data.filter((id):id is string=>typeof id==='string'&&lessons.some(l=>l.id===id)))]:[]}catch{return []}}
export function graduated(completed:string[]){return lessons.filter(l=>l.stage===1).every(l=>completed.includes(l.id))}
export function nextLessonIndex(completed:string[]){return lessons.findIndex(l=>!completed.includes(l.id))}
