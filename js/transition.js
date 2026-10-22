window.OITransition=(()=>{
	let busy=false;
	async function run(fn,label='下一幕'){
		if(busy)return;busy=true;
		const el=document.createElement('div');el.className='scene-transition fade-shield';el.setAttribute('aria-label',label);el.setAttribute('aria-busy','true');document.body.appendChild(el);
		const surface=()=>document.querySelector('#walkscreen')||document.querySelector('.shell');
		let old=surface(),next=null,out=null,fade=null;
		try{
			if(OIPrefs.data.motion){fn();return;}
			if(old){out=old.animate([{opacity:1},{opacity:0}],{duration:150,easing:'ease-in',fill:'forwards'});await out.finished;old.style.opacity='0';out.cancel();}
			fn();next=surface();if(next)next.style.opacity='0';if(old&&old!==next)old.style.removeProperty('opacity');
			await new Promise(resolve=>requestAnimationFrame(()=>requestAnimationFrame(resolve)));
			if(next){fade=next.animate([{opacity:0},{opacity:1}],{duration:240,easing:'ease-out',fill:'forwards'});await fade.finished;next.style.removeProperty('opacity');fade.cancel();}
		}finally{old?.style.removeProperty('opacity');next?.style.removeProperty('opacity');out?.cancel();fade?.cancel();el.remove();busy=false;}
	}
	return {run,get busy(){return busy;}};
})();
