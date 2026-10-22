
window.E=(()=>{
const topics=['图论','动态规划','组合数学','贪心','数据结构','字符串'];
const skills=['代码能力','思维能力','调试能力','抗压能力','注意力','学习效率','理科','文科'];
const peers=[
{name:'阿树',title:'图论研习者',symbol:'树',topic:0,text:'“先别急着写。我们试着画一个反例？”',bio:'总把图画满整张草稿纸，喜欢从路径里寻找性质。'},
{name:'小 D',title:'状态的编织者',symbol:'递',topic:1,text:'“状态想清楚了吗？再来一场 duel 吧。”',bio:'喜欢把复杂的问题拆成状态，复盘时能聊到机房熄灯。'},
{name:'周教练',title:'机房的守望者',symbol:'师',topic:2,coach:true,text:'“先拿稳能拿到的分，再追求更远的目标。”',bio:'比起名次，更在意你是否学会独立判断。'},
{name:'小贪',title:'局部最优的追寻者',symbol:'贪',topic:3,text:'“这个选择为什么不会让答案变差？”',bio:'习惯先找交换论证，再把看似冒险的直觉变成证明。'},
{name:'阿数',title:'结构的搭建者',symbol:'构',topic:4,text:'“把操作拆开，数据结构自然就出现了。”',bio:'熟悉树与区间结构，也乐意帮同学调通难写的模板。'},
{name:'小串',title:'字符间的漫游者',symbol:'串',topic:5,text:'“从一个前缀开始，看看它能延伸到哪里。”',bio:'草稿上总写着长长的字符串，擅长匹配与自动机。'},
{name:'阿桥',title:'连通性的观察者',symbol:'桥',topic:0,text:'“删掉这条边之后，这张图会怎样？”',bio:'偏爱连通性和网络中的特殊结构，讨论时喜欢举极端例子。'},
{name:'学长',title:'递推的引路人',symbol:'研',topic:1,text:'“先写暴力，再观察哪些状态被重复计算了。”',bio:'经历过多个赛季，愿意陪你从暴力一步步推到正解。'}
];
const words=[
['Bridge','Path','Forest','Vertex','Island','Beacon','River','Network','Orbit','Trail','Valley','Compass'],
['Echo','Memory','Ladder','Sequence','Journey','Canvas','Harvest','Mirage','Pattern','Window','Archive','Promise'],
['Prism','Factor','Lattice','Vector','Crystal','Series','Symmetry','Matrix','Number','Alchemy','Chance','Polygon'],
['Choice','Arrow','Market','Signal','Sprint','Anchor','Balance','Ember','Schedule','Crown','Monarch','Stride'],
['Branch','Segment','Stack','Queue','Heap','Index','Query','Buffer','Chain','Range','Ledger','Order'],
['Prefix','Suffix','Letter','Word','Text','Alphabet','Mirror','Border','Palindrome','Whisper','Script','Lexicon']];
const extra=[
['Avenue','Harbor','Summit','Tunnel','Crossing','Metro','Circuit','Delta','Junction','Frontier','Station','Voyage','Canyon','Horizon','Plateau','Rapids','Estuary','Watershed','Highway','Viaduct','Borough','Outpost','Sanctuary','Peninsula','Causeway','Archipelago','Labyrinth','Passage'],
['Dream','Rhythm','Melody','Sonata','Ballad','Cadence','Tempo','Refrain','Harmony','Prelude','Fugue','Etude','Chorus','Opera','Symphony','Rhapsody','Anthem','Nocturne','Overture','Variation','Interlude','Concerto','Serenade','Minuet','Waltz','Finale','Octave','Arpeggio'],
['Abacus','Axiom','Theorem','Lemma','Proof','Digit','Integer','Fraction','Residue','Divisor','Prime','Parity','Sum','Product','Quotient','Infinity','Ellipse','Triangle','Square','Circle','Sphere','Cube','Tangent','Radius','Chord','Spiral','Angle','Equation'],
['Treasure','Auction','Parcel','Gift','Deadline','Medal','Ribbon','Ticket','Basket','Bundle','Harvesting','Festival','Banquet','Feast','Contest','Pursuit','Fortune','Destiny','Reward','Exchange','Priority','Victory','Champion','Knight','Quest','Lantern','Torch','Glimmer'],
['Treap','Splay','Array','Bucket','Deque','Table','Block','Node','Leaf','Root','Trunk','Logbook','Catalog','Register','Directory','Database','Vault','Storage','Cache','Counter','Interval','Partition','Collection','Container','Module','Layer','Framework','Structure'],
['Poem','Verse','Phrase','Sentence','Paragraph','Chapter','Novel','Fable','Legend','Tale','Rune','Glyph','Symbol','Cipher','Password','Message','Envelope','Postcard','Telegram','Manuscript','Scroll','Notebook','Journal','Dictionary','Thesaurus','Quotation','Signature','Inscription']];
for(let i=0;i<words.length;i++)words[i].push(...extra[i]);
const bank=words.flatMap((row,tag)=>row.map((name,i)=>({name,tag,tags:[tag,...(i%4?[(tag+1+i%5)%6]:[]),...(i%4===3?[(tag+3)%6]:[])].filter((v,j,a)=>a.indexOf(v)===j),level:i%4,adhoc:tag===3&&i%4===3,partial:i%3===2?75:50,desc:['将关系画成一张图，寻找路径与连通性质。','从较小状态出发，推导可复用的转移。','整理计数对象，利用数学性质计算答案。','证明当前选择，逐步构造最优方案。','维护变化的数据，回答区间或集合上的询问。','观察字符与前后缀，寻找重复的结构。'][tag]})));
function effects(s){return {learn:s.mood<30?.65:s.mood<50?.85:1,mood:s.mood<30?.8:s.mood<50?.9:1,confidence:s.confidence<25?.85:s.confidence<45?.93:1};}
function focus(s){return s.plan.length===1?1.6:s.plan.length===2?1.25:1;}
function setplan(s,id){if(s.phase!=='train'||!Number.isInteger(id)||id<0||id>=topics.length)return false;if(s.plan.includes(id)){if(s.plan.length===1){feedback(s,'plan','至少保留一项','请至少选择一项基础训练专项。','notice');return false;}s.plan=s.plan.filter(v=>v!==id);return true;}if(s.plan.length>=3){feedback(s,'plan','最多选择三项','减少专项数量可提高集中训练效率。','notice');return false;}s.plan.push(id);return true;}
function routecap(p){return p.route==='full'||!p.route?100:p.route==='partial'?(p.partialCap||50):Number(p.route.slice(4));}
function routes(p){if(p.duel)return [{id:'full',cap:100,name:'正解'}];return [{id:'full',cap:100,name:'正解'},...[...new Set([p.partialCap===75?25:20,50,p.partialCap===75?75:80])].sort((a,b)=>a-b).map((cap,i)=>({id:cap===(p.partialCap||50)?'partial':'part'+cap,cap,name:cap+' 分'}))];}
function workload(p,code=false){let cap=routecap(p),scale=cap===100?1:p.tierRev>=1?.2+cap*.008:.32+cap*.006;return (code?(p.codeNeed||180):(p.thoughtNeed||200))*scale*(code?.95:1);}
function canwork(p,type){return type==='think'?p.thought<100:type==='code'?p.code<100&&p.thought>=100:type==='debug'?p.code>=100&&!p.verified:type==='stress'?p.code>=100&&p.verified&&!p.tested:type==='submit'?p.code>0:false;}
function make(s,entry,diff){return {name:entry.name,tag:entry.tag,tags:entry.tags||[entry.tag],desc:entry.desc,diff:diff+entry.level,thoughtNeed:(180+entry.level*15+diff*.5)*(entry.adhoc?.7:1),codeNeed:165+entry.level*12+diff*.5,adhoc:entry.adhoc,partialCap:entry.partial,route:'full',paths:{},thought:0,code:0,bugs:0,hiddenBugs:0,debugProgress:0,verified:false,tested:false,clue:0,best:0,submitted:false,acTime:null};}
function choose(s,count,tag){let pool=bank.filter(p=>tag===undefined||(p.tags||[p.tag]).includes(tag)),out=[];while(out.length<count&&pool.length)out.push(pool.splice(Math.floor(rand(s)*pool.length),1)[0]);return out;}
function selectroute(s,route,duel=false){let c=duel?s.duel:s.contest;if(!c||duel)return false;let p=c.probs[c.idx],r=routes(p).find(r=>r.id===route);if(!r||(p.route||'full')===route)return false;p.paths??={};p.paths[p.route||'full']={thought:p.thought,code:p.code,bugs:p.bugs,hiddenBugs:p.hiddenBugs||0,verified:!!p.verified,tested:!!p.tested,debugProgress:p.debugProgress||0};Object.assign(p,p.paths[route]||{thought:0,code:0,bugs:0,hiddenBugs:0,debugProgress:0,verified:false,tested:false});p.route=route;feedback(s,'route',r.cap===100?'正解路线':r.name,`目标 ${r.cap} 分；各档路线分别保存进度，保留最高提交分。`,'notice');return true;}
function score(p){if(p.duel)return p.thought>=100&&p.code>=100&&!p.bugs&&!p.hiddenBugs?100:0;let max=routecap(p);return Math.max(0,Math.floor(Math.min(p.thought,p.code)/25)*max/4-(p.bugs+(p.hiddenBugs||0))*25)|0;}
function work(s,p,type,duel=false){
 if(type==='code'&&p.thought<100)return false;
 if(duel)return E.duelwork(s,p,type);
 let prev={thought:p.thought,code:p.code,bugs:p.bugs,debugProgress:p.debugProgress||0},msg='';
 if(type==='think'){
  if(p.thought>=100)msg='当前路线思路已完整，可以开始编码。';
  else{let burst=rand(s)<attention(s,p);if(burst||rand(s)<chance(s,p,false,true)){p.thought=clamp(p.thought+(30+rand(s)*15+(burst?24+s.stats[4]*.2:0))*100/workload(p));p.stalls=0;if(burst)p.focusHits=(p.focusHits||0)+1;msg=burst?'专注突破！注意力帮助你越过卡点，思考大幅推进。':'成功推进思考，路线逐渐完整。';add(s,'confidence',2);}else{p.clue++;p.stalls=(p.stalls||0)+1;add(s,'mood',-1);msg='排除一条错误路线，积累线索并重新集中注意力。';}}
 }else if(type==='code'){
  if(rand(s)<chance(s,p,true)){p.code=clamp(p.code+(34+rand(s)*16)*100/workload(p,true),0,p.thought);if(p.code>prev.code){p.verified=false;p.tested=false;p.debugProgress=0;if(rand(s)<.18/(1+s.stats[2]/60))p.bugs++;if(rand(s)<.15/(1+s.stats[2]/80))p.hiddenBugs=(p.hiddenBugs||0)+1;}msg=p.code>=100?'代码完成！写代码操作已切换为调试。':p.code>prev.code?'编码成功推进，继续完善实现。':'编码已追上思路，请先继续思考。';}
  else{add(s,'confidence',-.5);msg='实现暂时受阻，再检查一下思路与细节。';}
 }else if(type==='debug'){
  if(p.bugs>0){p.debugProgress=(p.debugProgress||0)+40+s.stats[2]*.45+rand(s)*25;if(p.debugProgress>=100){p.bugs--;p.debugProgress=0;}}else p.debugProgress=0;p.verified=p.bugs===0;p.tested=false;
  msg=p.verified?'调试完成，可以提交或花 5 分钟对拍。人工调试可能遗漏边界错误，未对拍直接提交仍有失分风险。':p.bugs<prev.bugs?'修复了一处错误，仍需继续调试。':`正在定位错误：${Math.floor(p.debugProgress)}%。继续检查边界与实现。`;gain(s,'stats',2,.35);
 }else if(type==='stress'){
  if(p.hiddenBugs){p.bugs+=p.hiddenBugs;p.hiddenBugs=0;p.debugProgress=0;p.verified=false;p.tested=false;msg='对拍发现反例！已退回调试，修复后可再次对拍。';}
  else{p.tested=true;msg=`对拍通过，未发现错误！当前路线提交可得 ${routecap(p)} 分。`;}
 }else if(type==='submit'){
  p.best=Math.max(p.best,score(p));p.submitted=true;msg=duel?(p.best===100?'Accepted！':`提交反馈：${score(p)} 分，最高 ${p.best} 分。`):'提交成功，OI 成绩赛后揭晓。未修复的错误（含未对拍发现的错误）每处扣 25 分。';
 }
 let ok=type==='think'?p.thought>prev.thought:type==='code'?p.code>prev.code:type==='debug'?p.verified||p.bugs<prev.bugs||p.debugProgress>prev.debugProgress:type==='stress'?p.tested:true;
 let title={think:ok?'思考突破！':'继续推导',code:ok?'编码推进！':'继续实现',debug:p.verified?'调试完成！':p.bugs<prev.bugs?'错误已修复':'正在定位错误',stress:p.tested?'对拍通过！':'对拍发现错误',submit:duel&&p.best===100?'Accepted！':'提交成功！'}[type];
 feedback(s,type,title,msg,duel&&type==='submit'&&p.best===100?'ac':ok?'success':'notice');return msg;
}
const costs={think:1,code:.65,debug:.4,stress:1,submit:.2,rest:1},duelCosts={think:1,code:.65,debug:.4,submit:.25};
function feedback(s,kind,title,text,tone='success'){s.feedback={seq:(s.feedback?.seq||0)+1,kind,title,text,tone};}
const modes=[{name:'不停课',hours:9,culture:4,load:3},{name:'半停课',hours:24,culture:1,load:9},{name:'全天集训',hours:42,culture:-3,load:17}];
const clamp=(v,l=0,h=100)=>Math.max(l,Math.min(h,v));
function create(seed=Date.now()){return {version:1,seed:seed>>>0,week:1,phase:'train',mode:2,trainId:0,lastTrain:null,perfectWeek:0,feedback:null,balanceRev:2,plan:[0,1],stats:[24,24,22,25,23,25,62,58],know:[20,20,18,25,18,15],mood:75,confidence:60,drive:65,energy:85,trust:30,relation:Array(peers.length).fill(15),awards:[],log:['九月，第一次推开机房的门。离赛季结束还有 24 周。'],contest:null,last:null,ending:null};}
function rand(s){s.seed=(Math.imul(1664525,s.seed)+1013904223)>>>0;return s.seed/4294967296;}
function log(s,t){s.log.unshift(t);s.log=s.log.slice(0,300);}
function add(s,k,v){s[k]=clamp(s[k]+v);}
function gain(s,arr,id,v){s[arr][id]=clamp(s[arr][id]+v*(window.OICareer?OICareer.mode(s).learn:1)/(1+s[arr][id]/80));}
function eff(s){return (.55+s.stats[5]/100)*effects(s).learn*(.65+s.energy/250);}
function train(s,id){
	if(s.phase!=='train'||s.drive<12||!Number.isInteger(id)||id<0||id>=12)return false;
	let roll=rand(s),quality=roll<.15?'bad':roll<.65?'normal':roll<.9?'good':'perfect',mult={bad:.666,normal:1,good:1.5,perfect:2}[quality];
	s.trainId=id;add(s,'drive',-12);add(s,'energy',-4);let v=.7*eff(s)*mult;
	if(id<6)gain(s,'know',id,v);else gain(s,'stats',id-6,v);
	add(s,'mood',rand(s)<.2?-4:1);let bonus=quality==='perfect'&&s.perfectWeek!==s.week;if(bonus){add(s,'drive',20);s.perfectWeek=s.week;}s.lastTrain={id,quality,mult,week:s.week,bonus:bonus?20:0};feedback(s,'train',quality.toUpperCase(),`${id<6?topics[id]:skills[id-6]}训练完成，效果 ×${mult}。${bonus?'干劲 +20，本周首次 Perfect 奖励！':''}`,quality==='perfect'?'perfect':quality==='bad'?'notice':'success');
	log(s,`额外训练${id<6?topics[id]:skills[id-6]}：${quality}（×${mult}），干劲 −12。`);return true;
}
function finish(s){if(s.phase!=='train')return false;s.mode=2;s.plan=[...new Set(s.plan)].filter(i=>i>=0&&i<6).slice(0,3);if(!s.plan.length)s.plan=[0];let m=modes[2],v=m.hours/7*eff(s);for(let id of s.plan)gain(s,'know',id,v/Math.max(1,s.plan.length)*1.8*focus(s));gain(s,'stats',0,v*.4);gain(s,'stats',1,v*.45);gain(s,'stats',5,.6);for(let id of [6,7])gain(s,'stats',id,m.culture);add(s,'energy',-m.load);add(s,'drive',-6);add(s,'trust',s.stats[6]<40?-6:2);log(s,`第 ${s.week} 周基础训练完成：${m.name}，${m.hours} 小时。`);s.phase='free';feedback(s,'training','本周集训完成','六天基础训练结束，去安排一次自由行动吧。','important');return true;}
function free(s,type,npc=0){if(s.phase!=='free')return false;if(type==='mock'){start(s,'周末模拟赛',false);return true;}if(type==='chat'){let id=[0,1,2][npc];gain(s,'know',id,4*eff(s));s.relation[npc]=clamp(s.relation[npc]+8);add(s,'mood',7);add(s,'drive',8);log(s,['和阿树讨论最短路，从反例中发现了盲点。','和小 D 打了一场 CF duel，学会先写可证的状态。','教练提醒：先拿稳部分分，再追求满分。'][npc]);}else if(type==='surf'){add(s,'drive',25);add(s,'energy',18);add(s,'mood',8);log(s,'水谷、看讨论、收藏题解。短暂放空后重新有了干劲。');}else if(type==='sport'){add(s,'energy',30);add(s,'mood',15);gain(s,'stats',3,2);log(s,'操场慢跑。呼吸平稳了，脑中的结也松开了。');}else return false;next(s);return true;}
function next(s){return OICareer.next(s);}
function advance(s){return OICareer.advance(s);}
function setmode(s,id){if(s.phase!=='train')return false;s.mode=2;return id===2;}
function grade(s,p,id){let level=bank.find(q=>q.name===p.name)?.level||0,chapter=Math.floor(((s.week-1)%48)/4);p.tierRev=2;p.tierName=['基础','标准','进阶','挑战'][id];p.tier=id;p.diff=[25,60,95,130][id]+level+chapter*3;if(id<2)p.adhoc=false;p.thoughtNeed=([200,380,720,1200][id]+level*6+chapter*4)*(p.adhoc?.85:1);p.codeNeed=[180,330,560,880][id]+level*5+chapter*3;return p;}
function tune(s,p,slot,bias=0){let q=grade(s,p,slot),scale=OICareer.mode(s).problem;q.diff=(q.diff+bias)*scale;q.thoughtNeed*=scale*(1+bias/160);q.codeNeed*=scale*(1+bias/200);return q;}
function rebalance(s,c){if(!c)return;let bias=OICareer.entry(c.eventId)?.bias||0;for(let [i,p] of c.probs.entries())if(p.tierRev!==2)tune(s,p,c.probs.length===3?[0,2,3][i]:i,bias);}
function start(s,name,official,cfg={}){let count=cfg.count||4,minutes=cfg.minutes||240,bias=cfg.bias||0,scale=OICareer.mode(s).problem,pool=bank.filter(p=>!cfg.seen?.includes(p.name)),chosen=[];while(chosen.length<count&&pool.length)chosen.push(pool.splice(Math.floor(rand(s)*pool.length),1)[0]);s.contest={name,official,max:count*100,total:minutes/5,left:minutes/5,eventId:cfg.id,day:cfg.day||1,year:cfg.year,idx:0,probs:chosen.map((p,i)=>tune(s,make(s,p,0),count===3?[0,2,3][i]:i,bias)),notes:[],breaks:0};s.phase='contest';log(s,`${name}开始：${minutes} 分钟，${count} 道题，赛后揭晓成绩。`);feedback(s,'contest',name,`${count} 题 / ${minutes} 分钟。按当前能力评估各档分数，安排解题顺序。`,'important');}
function tags(p){return [...new Set(p.tags||[p.tag])];}
function knowledge(s,p){let list=tags(p);return list.length===1?s.know[list[0]]:s.know[list[0]]*.6+list.slice(1).reduce((a,id)=>a+s.know[id],0)/ (list.length-1)*.4;}
function attention(s,p){return Math.min(.3,.04+s.stats[4]*.0026+(p.stalls||0)*.01);}
function ease(s,p,route){let q={...p,route},prob=(chance(s,q)+chance(s,q,true))/2,cost=workload(q)/(38*Math.max(.15,chance(s,q)))+workload(q,true)/(42*Math.max(.15,chance(s,q,true))),weight=knowledge(s,q)*.35+s.stats[1]*.35+s.stats[0]*.2+s.stats[4]*.1,diff=q.diff*(.35+.65*routecap(q)/100),ratio=weight-diff;return prob<.42||ratio< -65?'我毫无头绪':cost>35||ratio< -35?'感觉不是很可做':cost>22||ratio< -12?'可以完成':cost>12||prob<.85?'比较可做':'很简单';}
function chance(s,p,code=false,raw=false){let know=knowledge(s,p),a=code?s.stats[0]*.7+know*.3:s.stats[1]*.45+know*.4+s.stats[4]*.15,e=effects(s),diff=p.tierRev>=1?p.diff*(.35+.65*routecap(p)/100):p.diff,rate=.76+(a-diff)/140+(.16*(1-routecap(p)/100))+Math.min(.15,p.clue*.025);if(!code&&p.adhoc&&p.thought<35)rate=rate*.6+p.clue*.06;let pressure=s.contest?Math.max(0,1-s.contest.left/(s.contest.total||48))*Math.max(0,.05-s.stats[3]/1000):0;let ceiling=p.tierRev===2?Math.min(.98,[.97,.88,.74,.58][p.tier]+(1-routecap(p)/100)*.25):.98,base=clamp(rate*e.mood*e.confidence*(s.energy<20?.88:1)-pressure,.12,ceiling);return code||raw?base:base+(1-base)*attention(s,p);}
function band(p){return p>=.95?'很有把握 · 95–99%':p<.1?'根本无从下手 · 0–10%':p<.25?'很难 · 10–25%':p<.5?'比较麻烦 · 25–50%':p<.75?'正常 · 50–75%':'顺手 · 75–95%';}
function progress(v){return v===0?'尚未开始':v<30?'刚有头绪 · 1–29%':v<65?'逐渐成形 · 30–64%':v<100?'接近完整 · 65–99%':'已完成';}
function act(s,type){if(s.phase!=='contest')return false;let c=s.contest,p=c.probs[c.idx],cost=costs[type];if(!cost||c.left+1e-7<cost||type!=='rest'&&!canwork(p,type)||type==='rest'&&c.breaks>=3)return false;c.left=Math.max(0,c.left-cost);let msg;if(type==='rest'){c.breaks++;add(s,'energy',10);add(s,'mood',8);msg='喝水休息后，体力和心态恢复了。';feedback(s,'rest','状态恢复！',msg);}else{msg=work(s,p,type);add(s,'energy',-.25);}c.notes.unshift(`T${c.idx+1} · ${msg}`);c.notes=c.notes.slice(0,12);if(c.left<=1e-7){c.left=0;settle(s);}return true;}
function settle(s){if(s.phase!=='contest')return false;let c=s.contest,score=c.probs.reduce((a,p)=>a+p.best,0),max=c.max||c.probs.length*100,ratio=score/max,rank=ratio>=.75?'一等奖':ratio>=.5?'二等奖':ratio>=.25?'三等奖':'继续积累';s.last={name:c.name,score,max,rank,rows:c.probs.map(p=>({name:p.name,score:p.best,submitted:p.submitted})),official:c.official,...OICareer.record(s,c,score)};for(let p of c.probs){let list=tags(p);for(let id of list)gain(s,'know',id,(1+p.best/40)/Math.sqrt(list.length));gain(s,'stats',1,.4);}gain(s,'stats',3,1.5);add(s,'confidence',ratio>=.375?8:-4);add(s,'drive',ratio>=.375?8:3);log(s,`${c.name}：${score}/${max}，${rank}。已复盘并吸收经验。`);s.phase='result';feedback(s,'result',`${c.name} · ${score}/${max}`,s.last.nextDay?'第一天结束，确认战报后进入 Day 2。':`${rank}。复盘经验已结算。`,'important');return true;}
function resume(s){if(s.phase!=='result')return false;OICareer.resume(s);return true;}


return {tune,rebalance,gain,tags,knowledge,attention,ease,grade,bank,make,choose,score,work,routecap,routes,workload,canwork,effects,focus,setplan,selectroute,peers,costs,duelCosts,feedback,topics,skills,modes,create,rand,log,train,finish,free,next,setmode,start,chance,band,progress,act,settle,resume};
})();
