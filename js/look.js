window.OILook=function(canvas,camera,blocked,onUpdate,onTalk){
	let pos={...OILayout.spawn},yaw=0,pitch=0,keys={},drag=null,abort=new AbortController();
	const signal=abort.signal,clamp=(v,l,h)=>Math.max(l,Math.min(h,v));
	function move(dx,dz){let nx=clamp(pos.x+dx,-8.6,11.6),nz=clamp(pos.z+dz,-6.6,6.6);if(!blocked(nx,pos.z))pos.x=nx;if(!blocked(pos.x,nz))pos.z=nz;onUpdate();}
	function step(d){if(d==='left')yaw+=.18;else if(d==='right')yaw-=.18;else{let k=d==='up'?1:-1;move(-Math.sin(yaw)*.35*k,-Math.cos(yaw)*.35*k);}sync();}
	function sync(){camera.position.set(pos.x,1.65,pos.z);camera.rotation.set(pitch,yaw,0,'YXZ');}
	function look(dx,dy){yaw-=clamp(dx,-100,100)*.002*(OIPrefs.data.sens/100);pitch=clamp(pitch-clamp(dy,-100,100)*.002*(OIPrefs.data.sens/100),-1.25,1.25);}
	canvas.addEventListener('click',()=>{try{canvas.requestPointerLock?.()?.catch?.(()=>{});}catch{}},{signal});
	canvas.addEventListener('pointerdown',e=>{if(document.pointerLockElement!==canvas){drag={x:e.clientX,y:e.clientY};canvas.setPointerCapture(e.pointerId);}},{signal});
	canvas.addEventListener('pointermove',e=>{if(document.pointerLockElement===canvas)return;if(drag){look(e.clientX-drag.x,e.clientY-drag.y);drag={x:e.clientX,y:e.clientY};}},{signal});
	canvas.addEventListener('pointerup',()=>drag=null,{signal});
	document.addEventListener('mousemove',e=>{if(document.pointerLockElement===canvas)look(e.movementX,e.movementY);},{signal});
	document.addEventListener('keydown',e=>{if(document.querySelector('dialog[open],[data-block-look]')||OITransition.busy||e.target.matches('input,select,textarea'))return;if(['KeyW','KeyA','KeyS','KeyD','ArrowUp','ArrowDown','ArrowLeft','ArrowRight'].includes(e.code)){keys[e.code]=true;e.preventDefault();}if(e.code==='KeyE'&&!e.repeat)onTalk();},{signal});
	document.addEventListener('keyup',e=>delete keys[e.code],{signal});
	window.addEventListener('blur',()=>keys={},{signal});
	return {pos,step,get pose(){return {...pos,yaw,pitch};},restore(p){if(p){Object.assign(pos,{x:p.x,z:p.z});yaw=p.yaw||0;pitch=p.pitch||0;}sync();},update(dt){if(document.querySelector('dialog[open],[data-block-look]')||OITransition.busy){keys={};return;}let f=(!!keys.KeyW||!!keys.ArrowUp)-(!!keys.KeyS||!!keys.ArrowDown),r=(!!keys.KeyD)-(!!keys.KeyA),n=Math.hypot(f,r)||1;if(keys.ArrowLeft)yaw+=dt*1.7;if(keys.ArrowRight)yaw-=dt*1.7;if(f||r)move((-Math.sin(yaw)*f+Math.cos(yaw)*r)*dt*2.7/n,(-Math.cos(yaw)*f-Math.sin(yaw)*r)*dt*2.7/n);sync();},stop(){abort.abort();keys={};if(document.pointerLockElement===canvas)document.exitPointerLock();}};
};
