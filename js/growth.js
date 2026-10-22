window.OIGrowth=(()=>{
	const depth=new WeakMap();
	for(let key of ['train','finish','free','act','settle','work','walkact','bloom','settleduel','resume','next','finishwalk']){let fn=E[key];E[key]=function(s,...args){let n=depth.get(s)||0,before=n?null:{know:[...s.know],stats:[...s.stats]};depth.set(s,n+1);try{return fn(s,...args);}finally{depth.set(s,n);if(!n){let items=[];for(let arr of ['know','stats'])for(let i=0;i<s[arr].length;i++){let delta=s[arr][i]-before[arr][i];if(delta>1e-7)items.push({arr,id:i,name:(arr==='know'?E.topics:E.skills)[i],before:before[arr][i],after:s[arr][i],delta});}if(items.length)s.growth={seq:(s.growth?.seq||0)+1,items};}}};}
	function panel(s){return s.growth?`<section class="growth-summary"><span>最近能力成长</span>${s.growth.items.map(g=>`<b>${g.name} <em>+${g.delta.toFixed(2)}</em></b>`).join('')}</section>`:'';}
	return {panel};
})();
