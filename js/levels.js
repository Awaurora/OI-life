window.OILevel=(()=>{
	const grades=['D','D+','C','C+','B','B+','A','A+','S','S+'],limits=[0,10,20,30,40,50,60,70,85,95],notes=['初识门径','开始入门','掌握基础','基础扎实','应对常规题','运用熟练','专项擅长','理解深入','融会贯通','出类拔萃'];
	function index(v){let i=0;while(i+1<limits.length&&v>=limits[i+1])i++;return i;}
	function rank(v){return grades[index(v)];}
	function desc(v){return notes[index(v)];}
	function clean(t){return String(t).replace(/(图论|动态规划|组合数学|贪心|数据结构|字符串|代码能力|思维能力|调试能力|抗压能力|注意力|学习效率|理科|文科)\s*\+\s*\d+(?:\.\d+)?/g,'$1有所成长');}
	function status(s){let e=E.effects(s);return `<div class="status-effects" aria-label="心态与信心的影响"><div class="${e.mood<1?'low':''}"><b>${e.mood<1?'心态偏低':'心态平稳'}</b><span>${e.mood<1?`做题成功率 ×${e.mood}，学习效率 ×${e.learn}`:'学习与解题无心态惩罚'}</span></div><div class="${e.confidence<1?'low':''}"><b>${e.confidence<1?'信心不足':'信心稳定'}</b><span>${e.confidence<1?`做题成功率再乘 ×${e.confidence}`:'解题无信心惩罚'}</span></div></div>`;}
function statusText(s){let e=E.effects(s);return `心态低于 50：成功率 ×0.9、学习效率 ×0.85；低于 30：成功率 ×0.8、学习效率 ×0.65。信心低于 45：成功率再乘 ×0.93；低于 25：再乘 ×0.85。当前成功率状态系数 ×${(e.mood*e.confidence).toFixed(2)}，学习状态系数 ×${e.learn}。运动、休息和看花可以恢复状态。`;}
function meter(v){let i=index(v),pct=i===grades.length-1?100:Math.max(0,Math.min(100,(v-limits[i])/(limits[i+1]-limits[i])*100));return `<div class="rank-meter"><div role="progressbar" aria-label="等级内进度" aria-valuemin="0" aria-valuemax="100" aria-valuenow="${Math.round(pct)}"><i style="width:${pct}%"></i></div><small>${i===grades.length-1?'S+ · 已达最高等级':`${grades[i]} → ${grades[i+1]} · ${Math.round(pct)}%`}</small></div>`;}
return {status,statusText,rank,desc,clean,grades,meter};
})();
