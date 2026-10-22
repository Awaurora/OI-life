Object.assign(E,(()=>{
	const cap=v=>Math.max(0,Math.min(100,v)),names=E.peers.map(p=>p.name);
	function gain(s,id,v){let before=s.know[id];s.know[id]=cap(before+v*OICareer.mode(s).learn/(1+before/80));return s.know[id]-before;}
	function beginwalk(s){if(s.phase!=='free')return false;s.relation=E.peers.map((p,i)=>Number.isFinite(s.relation?.[i])?s.relation[i]:15);s.walk={left:180,total:180,spent:0,acts:[],pos:null};s.duel=null;s.phase='walk';E.log(s,'放学后，你走进机房。今天有 180 分钟自由安排。');return true;}
	function endwalk(s){if(s.phase!=='walk')return false;if(s.walk.left<1e-6)s.walk.left=0;let before=s.drive;s.drive=cap(s.drive+8);s.walk.driveBonus=s.drive-before;s.phase='walkresult';E.feedback(s,'walkend','散步结束',`放松之后重新有了干劲：+${s.walk.driveBonus}。`,'important');E.log(s,`散步结束：在机房度过 ${Math.round(s.walk.spent)} 分钟，完成 ${s.walk.acts.length} 次活动。`);return true;}
	function walkact(s,id,type){
		if(s.phase!=='walk'||!Number.isInteger(id)||id<0||id>=E.peers.length||!['chat','discuss'].includes(type))return false;
		let cost=type==='discuss'?15:0;if(s.walk.left<cost)return false;
		let chatted=s.walk.chatted??(s.walk.chatted=s.walk.acts.filter(a=>a.type==='chat').map(a=>a.id));
		const lines=E.peers.map(p=>p.name+'说：'+p.text);
		if(type==='chat'&&chatted.includes(id))return lines[id]+'（今天已经聊过近况，继续聊天不再重复获得支援。）';
		s.walk.left-=cost;s.walk.spent+=cost;let rel=type==='discuss'?6:3;
		if(type==='discuss')gain(s,E.peers[id].topic,4.5*(.65+s.stats[5]/100));else chatted.push(id);
		s.relation[id]=cap(s.relation[id]+rel);s.mood=cap(s.mood+3);s.drive=cap(s.drive+2);
		let text=type==='discuss'?`${names[id]}和你复盘了${E.topics[E.peers[id].topic]}的关键观察。${E.topics[E.peers[id].topic]}有所成长，支援 +${rel}。`:lines[id]+'（支援 +3，不消耗时间。）';
		s.walk.acts.push({type,id,cost,text});E.log(s,text);E.feedback(s,type,type==='discuss'?'讨论有所收获！':'支援加深！',text);if(s.walk.left<=0)endwalk(s);return text;
	}
	function samples(s,p){let bad=p.bugs+(p.hiddenBugs||0);p.sample=!bad||E.rand(s)<(p.bugs?.35:.7)?'passed':'failed';if(p.sample==='failed'){if(!p.bugs&&p.hiddenBugs){p.bugs++;p.hiddenBugs--;}p.verified=false;}return p.sample==='passed';}
	function duelcan(p,type){if(p.best===100)return false;return type==='submit'?p.thought>=100&&p.code>=100&&(p.sample==='passed'||p.verified):type==='debug'?p.code>=100&&!p.verified:['think','code'].includes(type)&&E.canwork(p,type);}
	function duelwork(s,p,type){
		if(!duelcan(p,type))return false;let msg,old=p.code;
		if(type==='submit'){
			p.submitted=true;
			if(!p.bugs&&!p.hiddenBugs){p.best=100;p.verdict='AC';msg='Accepted！全部测试通过。';}
			else{p.best=0;p.verdict='WA';p.bugs+=p.hiddenBugs||0;p.hiddenBugs=0;p.debugProgress=0;p.verified=false;p.sample='failed';msg='Wrong Answer：完整测试发现错误，已定位反例，请调试后重新提交。';}
			E.feedback(s,'submit',p.verdict==='AC'?'Accepted！':'Wrong Answer',msg,p.verdict==='AC'?'ac':'notice');return msg;
		}
		msg=E.work(s,p,type);
		if(type==='code'&&p.code>=100&&old<100){let pass=samples(s,p);msg=pass?'代码完成，小样例通过！可以跳过调试直接提交；完整测试仍可能发现边界错误。':'代码完成，小样例未通过。请先调试，再提交。';E.feedback(s,'sample',pass?'小样例通过！':'小样例未通过',msg,pass?'success':'notice');}
		else if(type==='debug'){if(p.verified){let pass=samples(s,p);msg=pass?'修复完成，小样例通过，可以立即提交。':'修复后样例仍未通过，继续调试。';}E.feedback(s,'debug',p.verified?'调试完成！':'定位与修复',msg);}
		return msg;
	}
	function duelnorm(d){if(!d||d.rulesRev===2)return;for(let p of d.probs){if(p.route!=='full'){Object.assign(p,p.paths?.full||{thought:0,code:0,bugs:0,hiddenBugs:0,verified:false});}p.duel=true;p.route='full';p.paths={};p.best=p.best===100?100:0;p.verdict=p.best===100?'AC':p.submitted?'WA':null;p.sample=p.code>=100?(p.verified||!p.bugs&&!p.hiddenBugs?'passed':'failed'):null;p.tested=false;}if(d.busy?.type==='stress'||d.busy&&!duelcan(d.probs[d.busy.idx],d.busy.type))d.busy=null;d.botNext=Math.min(d.botNext,d.elapsed+2);d.notes.unshift('CF duel 已更新：仅判 AC / WA，无部分分和对拍，小样例通过可直接提交。');d.rulesRev=2;}
	function duelmake(s,p,diff){let q={...E.make(s,p,diff),duel:true},scale=OICareer.mode(s).problem;q.diff*=scale;q.thoughtNeed*=scale;q.codeNeed*=scale;return q;}
	function beginduel(s,id){if(s.phase!=='walk'||!Number.isInteger(id)||id<0||id>=E.peers.length||E.peers[id].coach||s.walk.left<30)return false;let limit=Math.min(60,s.walk.left);s.duel={rulesRev:2,npc:id,total:limit,left:limit,elapsed:0,idx:0,probs:E.choose(s,2,E.peers[id].topic).map((p,i)=>duelmake(s,p,4+s.week*.2+i*2)),bot:Array.from({length:2},()=>({thought:0,code:0,stage:'读题',score:0,acTime:null})),botNext:2+E.rand(s),busy:null,notes:['Duel 开始。仅判 AC / WA；代码完成自动跑小样例，通过后可直接提交，无需对拍。'],reward:null};s.phase='duel';E.log(s,`与${names[id]}的 CF duel 开始。`);return true;}
	function duelqueue(s,type){if(s.phase!=='duel'||s.duel.busy)return false;let d=s.duel,p=d.probs[d.idx],cost=E.duelCosts[type];if(!cost||d.left+1e-7<cost||!duelcan(p,type))return false;d.busy={type,idx:d.idx,left:cost,total:cost};return true;}
	function complete(s){let d=s.duel,b=d.busy,p=d.probs[b.idx],text=E.work(s,p,b.type,true);if(p.best===100&&p.acTime===null)p.acTime=d.elapsed;d.notes.unshift(`T${b.idx+1} · ${text}`);d.notes=d.notes.slice(0,10);d.busy=null;if(d.probs.every(p=>p.best===100))E.settleduel(s);}
	function botstep(s){let d=s.duel,i=d.bot.findIndex(p=>p.score<100);if(i<0)return;let p=d.bot[i],skill=20+s.week*.6+(d.npc===0?4:0),luck=E.rand(s);if(p.thought<100){p.thought=cap(p.thought+16+luck*18+skill*.12);p.stage=p.thought<100?'思考中':'构思完成';}else if(p.code<100){p.code=cap(p.code+18+luck*16+skill*.1);p.stage=p.code<100?'编码中':'调试中';}else{p.score=100;p.stage='Accepted';p.acTime=d.elapsed;d.notes.unshift(`${names[d.npc]}通过了 T${i+1}。`);d.notes=d.notes.slice(0,10);}d.botNext=d.elapsed+1.5+E.rand(s);}
	function stats(rows){return {ac:rows.filter(p=>p.best===100||p.score===100).length,time:rows.reduce((a,p)=>a+(p.acTime??0),0)};}
	function settleduel(s,early=false){if(s.phase!=='duel'||early&&s.duel.elapsed<5)return false;let d=s.duel,a=stats(d.probs),b=stats(d.bot),win=a.ac>b.ac||a.ac===b.ac&&a.time<b.time,tie=a.ac===b.ac&&Math.abs(a.time-b.time)<.001,old=s.relation[d.npc],gains=[];for(let p of d.probs){let v=p.best===100?12:0;if(v)for(let id of E.tags(p))gains.push({topic:id,value:gain(s,id,v/Math.sqrt(E.tags(p).length))});}let rel=2+a.ac*4+Math.min(4,Math.floor(d.elapsed/15));s.relation[d.npc]=cap(old+rel);s.stats[1]=cap(s.stats[1]+1+a.ac);s.confidence=cap(s.confidence+(win?6:tie?2:0));d.reward={self:a,bot:b,label:win?'Duel 胜利':tie?'势均力敌':'对手获胜',gains,relation:s.relation[d.npc]-old};d.busy=null;s.walk.acts.push({type:'duel',id:d.npc,cost:d.elapsed,text:`与${names[d.npc]}的 duel：${a.ac} : ${b.ac}，${d.reward.label}。`});E.log(s,`与${names[d.npc]}的 CF duel 结束，完成 ${a.ac}/2 题，支援 +${d.reward.relation}。`);s.phase='duelresult';return true;}
	function walktick(s,dt){
		if(s.phase!=='duel'||!s.duel.busy||!Number.isFinite(dt)||dt<=0)return false;
		let remain=Math.min(dt,s.walk.left,s.duel.left,s.duel.busy.left);
		while(remain>1e-7&&s.phase==='duel'&&s.duel.busy){
			let step=Math.min(remain,.1),d=s.duel;s.walk.left=Math.max(0,s.walk.left-step);s.walk.spent+=step;d.left=Math.max(0,d.left-step);d.elapsed+=step;d.busy.left-=step;
			if(d.elapsed+1e-7>=d.botNext)botstep(s);
			if(d.busy.left<=1e-7)complete(s);
			if(d.left<=1e-7||s.walk.left<=1e-7)E.settleduel(s);remain-=step;
		}return true;
	}
	function continueduel(s){if(s.phase!=='duelresult')return false;s.duel=null;s.phase='walk';if(s.walk.left<=1e-7)endwalk(s);return true;}
	function bloom(s){if(s.phase!=='walk')return false;if(s.walk.flower){E.feedback(s,'flowers','楼下的花依然开着','这次散步已经观赏过花朵，可继续欣赏，不再重复获得恢复。','notice');return true;}s.walk.flower=true;s.mood=cap(s.mood+12);s.confidence=cap(s.confidence+5);s.energy=cap(s.energy+5);E.feedback(s,'flowers','二楼的晚风','倚着护栏看楼下的花。心态 +12、信心 +5、体力 +5，不消耗时间。');E.log(s,'你在二楼走廊看了楼下的花，心情逐渐平静。');return true;}
	function finishwalk(s){if(s.phase!=='walkresult')return false;s.walk=null;s.duel=null;E.next(s);return true;}
	return {samples,duelcan,duelwork,duelnorm,bloom,beginwalk,endwalk,walkact,beginduel,duelqueue,settleduel,walktick,continueduel,finishwalk,duelstats:stats};
})());
