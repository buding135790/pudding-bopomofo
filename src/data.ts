export const lessons = [
 {id:'bpmf', title:'一起認識 ㄅ ㄆ ㄇ ㄈ', subtitle:'第一站 · 雙唇與唇齒音', symbols:[
 {s:'ㄅ',p:'b',word:'包 bāo',tip:'雙唇閉合後打開，送氣較弱。漢語拼音 b 不代表英語的濁音 b。'},
 {s:'ㄆ',p:'p',word:'泡 pào',tip:'雙唇閉合後打開，明顯送氣。把手放在嘴前，感受氣流。'},
 {s:'ㄇ',p:'m',word:'貓 māo',tip:'雙唇閉合，聲音從鼻腔出來；感受鼻子輕輕震動。'},
 {s:'ㄈ',p:'f',word:'風 fēng',tip:'上排牙齒輕碰下唇，讓氣流從縫隙摩擦而出。'}]},
 {id:'dtnl',title:'再認識 ㄉ ㄊ ㄋ ㄌ',subtitle:'第二站 · 舌尖的練習',symbols:[
 {s:'ㄉ',p:'d',word:'刀 dāo',tip:'舌尖抵住上齒齦再放開，送氣較弱。拼音 d 不代表英語的濁音 d。'},
 {s:'ㄊ',p:'t',word:'兔 tù',tip:'舌尖抵住上齒齦再放開，明顯送氣。'},
 {s:'ㄋ',p:'n',word:'牛 niú',tip:'舌尖抵住上齒齦，讓聲音從鼻腔出來。'},
 {s:'ㄌ',p:'l',word:'鹿 lù',tip:'舌尖抵住上齒齦，氣流從舌頭兩側通過。'}]}
]
export const questions = [
 {prompt:'漢語拼音「b」對應哪一個注音符號？',options:['ㄆ','ㄅ','ㄇ','ㄈ'],answer:'ㄅ',why:'ㄅ 對應拼音 b，雙唇打開時送氣較弱；ㄆ（p）則明顯送氣。'},
 {prompt:'哪個符號的聲音從鼻腔出來？',options:['ㄈ','ㄅ','ㄆ','ㄇ'],answer:'ㄇ',why:'ㄇ 對應拼音 m。雙唇閉合，讓聲音從鼻腔出來。'},
 {prompt:'上齒輕碰下唇，氣流摩擦而出，是哪個符號？',options:['ㄇ','ㄈ','ㄅ','ㄆ'],answer:'ㄈ',why:'ㄈ 對應拼音 f，是唇齒摩擦音。'},
 {prompt:'「ㄆ」對應哪個漢語拼音？',options:['b','m','p','f'],answer:'p',why:'ㄆ 對應拼音 p，和 ㄅ 的重要差別是明顯送氣。'}
]
export const storageKey = 'pudding-learning-v1'
export function readProgress(): string[] {try { const data:unknown=JSON.parse(localStorage.getItem(storageKey)||'[]'); return Array.isArray(data)?data.filter((id):id is string=>typeof id==='string'&&lessons.some(l=>l.id===id)):[] } catch {return []} }
