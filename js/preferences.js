window.OIPrefs=(()=>{
	let data={scale:100,motion:false,sens:100,quality:'standard'};
	try{let v=JSON.parse(localStorage.getItem('oiLifePrefs'));if(v){data.scale=[100,115,130].includes(+v.scale)?+v.scale:100;data.motion=!!v.motion;data.sens=Math.max(40,Math.min(180,+v.sens||100));data.quality=v.quality==='low'?'low':'standard';}}catch{}
	function apply(){document.documentElement.style.setProperty('--textscale',data.scale/100);document.documentElement.classList.toggle('reduce',data.motion);}
	return {data,set(key,value){data[key]=value;try{localStorage.setItem('oiLifePrefs',JSON.stringify(data));}catch{}apply();},apply};
})();
OIPrefs.apply();
