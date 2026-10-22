export type Stage = 1 | 2 | 3 | 4 | 5
export type Exercise = {prompt:string;options:string[];answer:string;why:string;kind:string}
export type LearningCard = {s:string;p:string;word:string;tip:string;example:string;note?:string}
export type Lesson = {id:string;title:string;subtitle:string;stage:Stage;kind:'initial'|'vowel'|'content';intro:string;symbols:LearningCard[];exercises?:Exercise[]}
export const stages:{id:Stage;title:string;description:string}[]=[
 {id:1,title:'基礎注音 · 37 個符號',description:'11 節小課，從聲母到韻符。'},
 {id:2,title:'聲調學習',description:'認識四聲、輕聲與注音標記位置。'},
 {id:3,title:'注音拼讀',description:'練習聲母、介音、韻母與聲調的組合。'},
 {id:4,title:'生活詞語',description:'用注音認識身邊的事物。'},
 {id:5,title:'簡單句子閱讀',description:'從短句讀懂誰在做什麼。'}
]
const card=(s:string,p:string,word:string,example:string,tip:string,note?:string):LearningCard=>({s,p,word,example,tip,note})
const initialIntro='這一課認識聲母。漢語拼音是讀音對照，不是英語發音；例字包含韻母與聲調，聲母不能單靠英文字母名稱來讀。'
const vowelIntro='這一課認識韻符。它們可表示單韻母或複合韻母；ㄧ、ㄨ、ㄩ 也可作介音。拼音拼寫會依完整音節改變，不能把每個符號機械地換成英文字母。'
function basic(id:string,title:string,subtitle:string,kind:'initial'|'vowel',symbols:LearningCard[],exercises?:Exercise[]):Lesson{return {id,title,subtitle,kind,stage:1,intro:kind==='initial'?initialIntro:vowelIntro,symbols,exercises}}
export const basicLessons:Lesson[]=[
 basic('bpmf','一起認識 ㄅ ㄆ ㄇ ㄈ','第 1 課 · 雙唇與唇齒音','initial',[
 card('ㄅ','b','包 bāo','ㄅㄠ','雙唇閉合後打開，送氣較弱。漢語拼音 b 不代表英語的濁音 b。'),
 card('ㄆ','p','泡 pào','ㄆㄠˋ','雙唇閉合後打開，明顯送氣。把手放在嘴前，感受氣流。'),
 card('ㄇ','m','貓 māo','ㄇㄠ','雙唇閉合，聲音從鼻腔出來；感受鼻子輕輕震動。'),
 card('ㄈ','f','風 fēng','ㄈㄥ','上排牙齒輕碰下唇，讓氣流從縫隙摩擦而出。')]),
 basic('dtnl','再認識 ㄉ ㄊ ㄋ ㄌ','第 2 課 · 舌尖的練習','initial',[
 card('ㄉ','d','刀 dāo','ㄉㄠ','舌尖抵住上齒齦再放開，送氣較弱。拼音 d 不代表英語的濁音 d。'),
 card('ㄊ','t','兔 tù','ㄊㄨˋ','舌尖抵住上齒齦再放開，明顯送氣。'),
 card('ㄋ','n','牛 niú','ㄋㄧㄡˊ','舌尖抵住上齒齦，讓聲音從鼻腔出來。'),
 card('ㄌ','l','鹿 lù','ㄌㄨˋ','舌尖抵住上齒齦，氣流從舌頭兩側通過。')]),
 basic('gkh','認識 ㄍ ㄎ ㄏ','第 3 課 · 舌根的聲音','initial',[
 card('ㄍ','g','高 gāo','ㄍㄠ','舌根抬起接近軟顎，阻住氣流後放開，送氣較弱。'),
 card('ㄎ','k','口 kǒu','ㄎㄡˇ','舌根抵住軟顎後放開，明顯送氣。和 ㄍ 比較嘴前的氣流。'),
 card('ㄏ','h','花 huā','ㄏㄨㄚ','舌根靠近軟顎但不完全封住，氣流從窄縫摩擦而出。')]),
 basic('jqx','認識 ㄐ ㄑ ㄒ','第 4 課 · 舌面的聲音','initial',[
 card('ㄐ','j','雞 jī','ㄐㄧ','舌面前部靠近硬顎，先阻氣再摩擦放開，送氣較弱。'),
 card('ㄑ','q','七 qī','ㄑㄧ','舌面前部靠近硬顎，先阻氣再摩擦放開，明顯送氣。'),
 card('ㄒ','x','西 xī','ㄒㄧ','舌面前部靠近硬顎，留窄縫讓氣流摩擦通過。')]),
 basic('zhchshr','認識 ㄓ ㄔ ㄕ ㄖ','第 5 課 · 舌尖稍微抬起','initial',[
 card('ㄓ','zh','豬 zhū','ㄓㄨ','舌尖稍向後抬，先阻氣再放開，送氣較弱。不需要用力捲舌。'),
 card('ㄔ','ch','車 chē','ㄔㄜ','舌尖稍向後抬，先阻氣再放開，明顯送氣。'),
 card('ㄕ','sh','書 shū','ㄕㄨ','舌尖稍向後抬，讓氣流持續摩擦通過。'),
 card('ㄖ','r','日 rì','ㄖˋ','舌尖稍向後抬，聲帶振動，氣流通過舌尖後方的窄處。','台灣國語的翹舌程度因人而異；先辨認 ㄓㄔㄕㄖ 與 ㄗㄘㄙ 的差別。')]),
 basic('zcs','認識 ㄗ ㄘ ㄙ','第 6 課 · 舌尖靠前','initial',[
 card('ㄗ','z','早 zǎo','ㄗㄠˇ','舌尖靠近上門齒後方，先阻氣再放開，送氣較弱。'),
 card('ㄘ','c','草 cǎo','ㄘㄠˇ','舌尖靠近上門齒後方，先阻氣再放開，明顯送氣。'),
 card('ㄙ','s','三 sān','ㄙㄢ','舌尖靠前，讓氣流從齒間附近的窄縫摩擦通過。')]),
 basic('iwu','認識 ㄧ ㄨ ㄩ','第 7 課 · 韻符與介音','vowel',[
 card('ㄧ','i','衣 yī','ㄧ','嘴角向兩邊展開，舌面前部抬高，嘴巴只開一小縫。','單獨成音節時拼音寫 yi；作介音如 家 jiā（ㄐㄧㄚ）。'),
 card('ㄨ','u','屋 wū','ㄨ','雙唇收圓並向前，舌面後部抬高。','單獨成音節時拼音寫 wu；作介音如 花 huā（ㄏㄨㄚ）。'),
 card('ㄩ','ü','魚 yú','ㄩˊ','先做 ㄧ 的舌位，再把嘴唇收圓；舌位仍靠前。','與 j、q、x、y 相接時 ü 省略兩點，如 ju、qu、xu、yu；與 n、l 相接保留，如 nǚ、lǜ。')]),
 basic('aoee','認識 ㄚ ㄛ ㄜ ㄝ','第 8 課 · 單韻母','vowel',[
 card('ㄚ','a','阿 ā','ㄚ','嘴巴自然張大，舌頭放低，雙唇不收圓。'),
 card('ㄛ','o','喔 ō','ㄛ','嘴唇收圓，嘴巴半開，舌頭略向後。','與聲母搭配時的實際音值可能因音節而異。'),
 card('ㄜ','e','鵝 é','ㄜˊ','嘴巴半開，舌位靠後，雙唇不收圓。','拼音 e 常表示 ㄜ，與 ㄝ 不同。'),
 card('ㄝ','ê（常寫 e）','葉 yè','ㄧㄝˋ','嘴巴半開，舌面前部較低，雙唇不收圓。','單獨標音可寫 ê；在 ie、üe 中寫 e，如 葉 yè、月 yuè。')]),
 basic('aieiaou','認識 ㄞ ㄟ ㄠ ㄡ','第 9 課 · 聲音滑動的複韻母','vowel',[
 card('ㄞ','ai','愛 ài','ㄞˋ','從較開的 a 舌位向 i 滑動，連成一個音節。'),
 card('ㄟ','ei','杯 bēi','ㄅㄟ','從中間舌位向 i 滑動，口形由較開變窄。'),
 card('ㄠ','ao','貓 māo','ㄇㄠ','從張口的 a 滑向較圓的收尾，連續發出。','拼音寫 ao；不是把字母 a 和 o 的名稱分開念。'),
 card('ㄡ','ou','口 kǒu','ㄎㄡˇ','由半開的圓唇音向 u 滑動，嘴唇逐漸更圓。')]),
 basic('anenangeng','認識 ㄢ ㄣ ㄤ ㄥ','第 10 課 · 鼻音韻尾','vowel',[
 card('ㄢ','an','安 ān','ㄢ','先發開口元音，再讓舌尖接近上齒齦，以前鼻音 n 收尾。'),
 card('ㄣ','en','恩 ēn','ㄣ','先發較中央的元音，再以舌尖前鼻音 n 收尾。','拼音 ㄧㄣ 寫 in、ㄩㄣ 寫 ün（如 yun），不能直接逐符號相加。'),
 card('ㄤ','ang','昂 áng','ㄤˊ','先張口發元音，再讓舌根抬起，以後鼻音 ng 收尾。'),
 card('ㄥ','eng','風 fēng','ㄈㄥ','先發較中央的元音，再以舌根後鼻音 ng 收尾。','前鼻音 n 與後鼻音 ng 的舌頭收尾位置不同。')]),
 basic('er','認識 ㄦ','第 11 課 · 捲舌韻母與基礎畢業','vowel',[
 card('ㄦ','er','耳 ěr','ㄦˇ','嘴巴半開，舌尖輕輕向上、向後抬起，發出帶捲舌色彩的元音。不要緊咬牙齒。','ㄦ 可獨立成音節，如 兒 ér、耳 ěr、二 èr；它和聲母 ㄖ（r）不同。例字的 ˊ、ˇ、ˋ 分別是二、三、四聲，下一階段會正式學聲調。')])
]
const exercise=(prompt:string,answer:string,options:string[],why:string,kind='knowledge'):Exercise=>({prompt,answer,options,why,kind})
basicLessons[10].exercises=[
 exercise('「兒 ér」的完整注音是？','ㄦˊ',['ㄦˊ','ㄦˇ','ㄦˋ','ㄖˊ'],'兒 ér 是二聲，注音為 ㄦˊ。','reading'),
 exercise('「耳 ěr」的聲調是？','三聲',['一聲','二聲','三聲','四聲'],'ěr 上的 ˇ 表示三聲，寫作 ㄦˇ。'),
 exercise('「二 èr」的完整注音是？','ㄦˋ',['ㄦˋ','ㄦˊ','ㄦˇ','ㄖˋ'],'二 èr 是四聲，注音為 ㄦˋ。','reading'),
 exercise('ㄦ 與 ㄖ 有什麼不同？','ㄦ 是韻符，ㄖ 是聲母',['ㄦ 是韻符，ㄖ 是聲母','兩者完全相同','ㄦ 是聲調記號','ㄖ 是漢語拼音'],'ㄦ 對應 er，ㄖ 對應聲母 r，不能互換。'),
 exercise('發 ㄦ 時，哪個口型提示合適？','嘴半開，舌尖輕抬向後',['嘴半開，舌尖輕抬向後','雙唇緊閉不張開','上齒咬住下唇','完全不讓氣流通過'],'ㄦ 是帶捲舌色彩的元音，不需要用力咬牙。'),
 exercise('哪個字的讀音包含 ㄦ？','耳',['耳','花','貓','水'],'耳讀作 ㄦˇ，是 ㄦ 加上三聲。'),
 exercise('看到拼音 er，應想到哪個符號？','ㄦ',['ㄦ','ㄖ','ㄜ','ㄝ'],'er 對應 ㄦ，單獨的 r 則是聲母 ㄖ。'),
 exercise('ㄦ 能不能獨立成音節？','可以，例如「二」',['可以，例如「二」','不可以，必須加 ㄅ','只能表示聲調','只能和 ㄧ 合用'],'二讀作 ㄦˋ，不需要聲母。')
]

const tones:Lesson={id:'tones',stage:2,kind:'content',title:'聲調小花園',subtitle:'第二階段 · 四聲與輕聲',intro:'注音符號告訴我們音節怎麼發，聲調則標示音高走向。這裡是文字與標記練習，不會播放錄音或判斷你的聲音。',symbols:[
 card('一聲','mā','媽 mā','ㄇㄚ','音高保持較高而平穩。注音的一聲通常不標符號。'),
 card('二聲','má','麻 má','ㄇㄚˊ','音高向上升，注音標 ˊ。'),
 card('三聲','mǎ','馬 mǎ','ㄇㄚˇ','單獨慢讀可先降後升，注音標 ˇ。','連續說話時常只讀低降；兩個三聲相連時，前一個通常變為近似二聲。'),
 card('四聲','mà','罵 mà','ㄇㄚˋ','音高從高往低明顯下降，注音標 ˋ。'),
 card('輕聲','ma','嗎 ma','˙ㄇㄚ','聲音短而輕，音高受前面的音節影響，沒有固定高低走向。','注音輕聲點放在音節前方；台灣國語是否輕讀也會依詞語和語境而變。')],exercises:[]}
for(const c of tones.symbols){const sign=c.s==='一聲'?'不標符號':c.s==='輕聲'?'˙（音節前）':c.example.at(-1)!
 tones.exercises!.push(
 exercise(`「${c.word}」是什麼聲調？`,c.s,tones.symbols.map(s=>s.s),`${c.word} 的注音為 ${c.example}，是${c.s}。`,'tone'),
 exercise(`${c.s}的注音記號如何標示？`,sign,['不標符號','ˊ','ˇ','ˋ','˙（音節前）'],`${c.s}：${sign}。${c.tip}`,'notation'),
 exercise(`哪個注音是「${c.word}」？`,c.example,tones.symbols.map(s=>s.example),`${c.word} 對應 ${c.example}。`,'reading'))}
const blending:Lesson={id:'blending',stage:3,kind:'content',title:'把聲音拼在一起',subtitle:'第三階段 · 注音拼讀',intro:'先連起聲母與韻母，再帶上聲調。有些音節還包含介音；也有音節沒有聲母。拼音不是把每個字母名稱分開讀。',symbols:[
 card('ㄅ + ㄚ','bā','八 bā','ㄅㄚ','先準備 ㄅ 的雙唇，再接上張口的 ㄚ，連成 ㄅㄚ。'),
 card('ㄇ + ㄠ','māo','貓 māo','ㄇㄠ','雙唇先閉合發 ㄇ，再接 ㄠ，連成一個音節。'),
 card('ㄍ + ㄨ + ㄚ','guā','瓜 guā','ㄍㄨㄚ','由 ㄍ 接圓唇介音 ㄨ，再接 ㄚ；不要拆成三個字音。'),
 card('ㄒ + ㄩ + ˊ','xú','徐 xú','ㄒㄩˊ','舌面先準備 ㄒ，再接圓唇的 ㄩ，加上二聲。','拼音 x 後的 ü 省略兩點，所以寫 xu，不是 ㄒㄨ。')],exercises:[
 exercise('ㄅ 和 ㄚ 拼起來是？','ㄅㄚ',['ㄅㄚ','ㄆㄚ','ㄇㄠ','ㄍㄨㄚ'],'聲母 ㄅ 接韻母 ㄚ，合成 ㄅㄚ。','blend'),
 exercise('「八 bā」完整注音是？','ㄅㄚ',['ㄅㄚ','ㄅㄚˋ','ㄆㄚ','ㄇㄚ'],'八為一聲 ㄅㄚ，通常不標一聲符號。','reading'),
 exercise('ㄅㄚ 的聲母是？','ㄅ',['ㄅ','ㄚ','ㄆ','ㄇ'],'ㄅ 是聲母，ㄚ 是韻母。','structure'),
 exercise('ㄇ 和 ㄠ 拼起來是？','ㄇㄠ',['ㄇㄠ','ㄇㄡ','ㄅㄠ','ㄆㄠ'],'ㄇ 接 ㄠ 讀作 māo，例如貓。','blend'),
 exercise('「貓 māo」完整注音是？','ㄇㄠ',['ㄇㄠ','ㄇㄠˊ','ㄇㄡ','ㄅㄠ'],'貓 māo 為一聲，韻母是 ㄠ。','reading'),
 exercise('ㄇㄠ 的韻母是？','ㄠ',['ㄠ','ㄇ','ㄡ','ㄚ'],'ㄇ 是聲母，ㄠ 是韻母。','structure'),
 exercise('「瓜 guā」的拼讀組合是？','ㄍ + ㄨ + ㄚ',['ㄍ + ㄨ + ㄚ','ㄎ + ㄨ + ㄚ','ㄍ + ㄩ + ㄚ','ㄐ + ㄧ + ㄚ'],'瓜是 ㄍㄨㄚ，包含介音 ㄨ。','blend'),
 exercise('ㄍㄨㄚ 的介音是？','ㄨ',['ㄨ','ㄍ','ㄚ','ㄩ'],'介音 ㄨ 位於聲母 ㄍ 與主要元音 ㄚ 之間。','structure'),
 exercise('哪個拼音對應 ㄍㄨㄚ？','guā',['guā','kuā','jiā','huā'],'ㄍ 對應 g，ㄨㄚ 對應 ua，瓜為一聲。','pinyin'),
 exercise('「徐 xú」的完整注音是？','ㄒㄩˊ',['ㄒㄩˊ','ㄒㄨˊ','ㄒㄧˊ','ㄑㄩˊ'],'x 後的 u 在這裡代表 ü，徐讀 ㄒㄩˊ。','reading'),
 exercise('拼音 xu 中的 u 對應哪個注音？','ㄩ',['ㄩ','ㄨ','ㄧ','ㄜ'],'j、q、x 後的 ü 省略兩點，仍然是 ㄩ。','pinyin'),
 exercise('把注音拼起來時，哪個方法合適？','連成一個音節，再帶上聲調',['連成一個音節，再帶上聲調','每個符號各念成一個字','忽略韻母','把拼音當英文字母名稱讀'],'聲母、介音和韻母要銜接為同一音節。','knowledge'),
 exercise('「ㄅㄚ」與「ㄆㄚ」主要差在哪裡？','聲母的送氣強弱',['聲母的送氣強弱','一個沒有韻母','兩者聲調一定不同','字母數目不同'],'ㄅ 送氣較弱，ㄆ 明顯送氣，兩者可接同一韻母。'),
 exercise('「ㄍㄨㄚ」共有幾個注音符號（不計聲調）？','3 個',['1 個','2 個','3 個','4 個'],'ㄍ、ㄨ、ㄚ 共三個符號，但合成一個音節。') ]}
const vocabulary:Lesson={id:'daily-words',stage:4,kind:'content',title:'身邊的生活詞語',subtitle:'第四階段 · 看懂生活小事物',intro:'把學會的拼讀放到生活裡。先看字義、再看注音，最後用練習把詞語和讀音連起來。',symbols:[
 card('花','huā','花 huā','ㄏㄨㄚ','花朵是植物的一部分。先連起 ㄏ、ㄨ、ㄚ，讀一聲。'),
 card('貓','māo','貓 māo','ㄇㄠ','貓是一種動物。雙唇先閉合發 ㄇ，再接 ㄠ，讀一聲。'),
 card('水','shuǐ','水 shuǐ','ㄕㄨㄟˇ','水是可以飲用的液體。由 ㄕ 接 ㄨㄟ，再讀三聲。','拼音 uei 在聲母後縮寫成 ui，因此寫 shuǐ。'),
 card('茶','chá','茶 chá','ㄔㄚˊ','茶是一種飲品。聲母 ㄔ 明顯送氣，接 ㄚ，讀二聲。')],exercises:[]}
for(const c of vocabulary.symbols){const meaning=c.s==='花'?'植物的一部分':c.s==='貓'?'一種動物':c.s==='水'?'可以飲用的液體':'一種飲品'
 vocabulary.exercises!.push(
 exercise(`詞語「${c.s}」的完整注音是？`,c.example,vocabulary.symbols.map(s=>s.example),`${c.s} 讀作 ${c.example}（${c.p}）。`,'reading'),
 exercise(`哪個生活詞語讀作「${c.example}」？`,c.s,vocabulary.symbols.map(s=>s.s),`${c.example} 是「${c.s}」，${meaning}。`,'meaning'),
 exercise(`「${c.s}」對應哪個漢語拼音？`,c.p,vocabulary.symbols.map(s=>s.p),`${c.s} 的拼音是 ${c.p}，注音為 ${c.example}。`,'pinyin'),
 exercise(`生活詞語「${c.s}」在本課代表什麼？`,meaning,['植物的一部分','一種動物','可以飲用的液體','一種飲品'],`${c.tip}`,'meaning'))}
const reading:Lesson={id:'short-reading',stage:5,kind:'content',title:'讀懂一句小日常',subtitle:'第五階段 · 簡單句子閱讀',intro:'先把注音連成詞，再讀整句。留意「誰」和「做什麼」，標點符號提示一句話的結束。',symbols:[
 card('小貓喝水。','xiǎo māo hē shuǐ','小貓喝水。','ㄒㄧㄠˇ ㄇㄠ ㄏㄜ ㄕㄨㄟˇ','小貓是動作的主角，「喝」是動作，「水」是喝的東西。'),
 card('我愛小貓。','wǒ ài xiǎo māo','我愛小貓。','ㄨㄛˇ ㄞˋ ㄒㄧㄠˇ ㄇㄠ','「我」是說話的人，「愛」表示喜愛，「小貓」是喜愛的對象。'),
 card('小貓吃飯。','xiǎo māo chī fàn','小貓吃飯。','ㄒㄧㄠˇ ㄇㄠ ㄔ ㄈㄢˋ','「吃飯」是一個動作。「吃」讀 ㄔ；這類音節在注音中不另寫韻符，並非實際發音沒有元音。'),
 card('你喝茶。','nǐ hē chá','你喝茶。','ㄋㄧˇ ㄏㄜ ㄔㄚˊ','「你」指對方，「喝茶」是動作；句尾的句號表示一句話結束。')],exercises:[
 exercise('「小貓喝水。」誰在喝水？','小貓',['小貓','小狗','我','你'],'句中的主角是小貓，牠在喝水。','comprehension'),
 exercise('「小貓喝水。」小貓在做什麼？','喝水',['喝水','吃飯','看花','喝茶'],'「喝水」是這句話中的動作。','comprehension'),
 exercise('「小貓喝水。」喝的東西是？','水',['水','茶','飯','花'],'句中明確說喝「水」。','comprehension'),
 exercise('句子「小貓喝水。」中的「喝」讀作？','ㄏㄜ',['ㄏㄜ','ㄏㄜˋ','ㄎㄜ','ㄔㄚˊ'],'喝水的「喝」讀 hē，為一聲。','reading'),
 exercise('「我愛小貓。」誰喜歡小貓？','我',['我','你','小貓','小狗'],'「我」是喜愛小貓的人。','comprehension'),
 exercise('「我愛小貓。」喜愛的對象是？','小貓',['小貓','水','茶','花'],'句中的「小貓」是喜愛的對象。','comprehension'),
 exercise('「我愛小貓。」哪個字表示喜愛？','愛',['愛','我','小','貓'],'「愛」在這裡表示喜愛。','comprehension'),
 exercise('「我愛小貓。」中的「愛」讀作？','ㄞˋ',['ㄞˋ','ㄞˊ','ㄟˋ','ㄚˋ'],'愛 ài 的完整注音是 ㄞˋ。','reading'),
 exercise('「小貓吃飯。」小貓在做什麼？','吃飯',['吃飯','喝水','喝茶','睡覺'],'這句話描述小貓吃飯。','comprehension'),
 exercise('「小貓吃飯。」中的「飯」讀作？','ㄈㄢˋ',['ㄈㄢˋ','ㄈㄤˋ','ㄏㄢˋ','ㄈㄢˊ'],'飯 fàn 的韻母是 ㄢ，聲調為四聲。','reading'),
 exercise('「小貓吃飯。」的動作是哪個字？','吃',['吃','小','貓','飯'],'「吃」是動作，「飯」是吃的東西。','comprehension'),
 exercise('「小貓吃飯。」中的「吃」讀作？','ㄔ',['ㄔ','ㄘ','ㄑㄧ','ㄓ'],'吃 chī 的注音寫 ㄔ，一聲通常不標記。','reading'),
 exercise('「你喝茶。」誰在喝茶？','你',['你','我','小貓','小狗'],'「你」指聽話的對方，是這句話的主角。','comprehension'),
 exercise('「你喝茶。」喝的東西是？','茶',['茶','水','飯','花'],'這裡喝的是茶，不是水。','comprehension'),
 exercise('「你喝茶。」中的「茶」讀作？','ㄔㄚˊ',['ㄔㄚˊ','ㄘㄚˊ','ㄔㄚˋ','ㄓㄚˊ'],'茶 chá 是二聲，聲母是 ㄔ。','reading'),
 exercise('「你喝茶。」末尾的「。」表示什麼？','一句話結束',['一句話結束','一定要提高聲調','還少一個注音符號','表示三聲'],'句號是標點，表示一句話結束，不是聲調記號。','punctuation') ]}
basicLessons[4].intro+=' ㄓ、ㄔ、ㄕ、ㄖ 自成音節時，注音不另寫韻符；拼音 zhi、chi、shi、ri 中的 i 不讀作 ㄧ。'
basicLessons[5].intro+=' ㄗ、ㄘ、ㄙ 自成音節時，注音不另寫韻符；拼音 zi、ci、si 中的 i 不讀作 ㄧ。'
export const curriculum:Lesson[]=[...basicLessons,tones,blending,vocabulary,reading]
