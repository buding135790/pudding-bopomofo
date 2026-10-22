import {useEffect,useRef,useState} from 'react'
import {lessons,readProgress} from './data'
import {readRecords} from './practice'
export const gameKey='pudding-game-v1'
export type RewardKind='lesson'|'practice'|'perfect'
export const rewardAmounts:Record<RewardKind,number>={lesson:10,practice:5,perfect:3}
export type Game={claims:string[];reviewed:string[]}
const validClaims=()=>lessons.flatMap(l=>Object.keys(rewardAmounts).map(k=>`${l.id}:${k}`))
export function readGame():Game{try{const d=JSON.parse(localStorage.getItem(gameKey)||'{}');return {claims:Array.isArray(d?.claims)?[...new Set<string>(d.claims.filter((x:unknown)=>typeof x==='string'&&validClaims().includes(x)))]:[],reviewed:Array.isArray(d?.reviewed)?d.reviewed.filter((x:unknown)=>lessons.some(l=>l.id===x)):[]}}catch{return {claims:[],reviewed:[]}}}
export function migrateGame():Game{
 const game=readGame(),records=readRecords()
 for(const l of lessons){if(readProgress().includes(l.id))game.claims.push(`${l.id}:lesson`);if(records[l.id]&&records[l.id].rewardEligible!==false){game.claims.push(`${l.id}:practice`);if(records[l.id].correct===records[l.id].total)game.claims.push(`${l.id}:perfect`)}}
 return {...game,claims:[...new Set(game.claims)]}
}
export function balance(game:Game){return game.claims.reduce((n,key)=>n+rewardAmounts[key.split(':').at(-1) as RewardKind],0)}
export function grant(game:Game,id:string,kinds:RewardKind[]){if(!lessons.some(l=>l.id===id))return game;return {...game,claims:[...new Set([...game.claims,...kinds.map(k=>`${id}:${k}`)])]}}
export function unlocked(index:number,completed:string[],courses=lessons){return !!courses[index]&&(index===0||completed.includes(courses[index].id)||completed.includes(courses[index-1].id))}
export function useGame(){
 const [game,setGame]=useState(migrateGame),current=useRef(game)
 const [storageWarning,setWarning]=useState('')
 function persist(next:Game){current.current=next;setGame(next);try{localStorage.setItem(gameKey,JSON.stringify(next));setWarning('')}catch{setWarning('目前無法儲存糖果與複習紀錄，關閉頁面後可能遺失。')}}
 useEffect(()=>{persist(current.current)},[])
 function award(id:string,kinds:RewardKind[]){const saved=readGame();const base={claims:[...new Set([...current.current.claims,...saved.claims])],reviewed:[...new Set([...current.current.reviewed,...saved.reviewed])]};const next=grant(base,id,kinds);const gained=balance(next)-balance(base);persist(next);return gained}
 function review(id:string){persist({...current.current,reviewed:[...new Set([...current.current.reviewed,id])]})}
 return {game,candies:balance(game),award,review,storageWarning}
}
