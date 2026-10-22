window.OILayout=(()=>{
	const width=18,depth=14,xs=[-5,-2.6,-.2,2.2,4.6],seats=[{x:-2.6,z:-5.28,rot:Math.PI},{x:2.2,z:1.4,rot:Math.PI},{x:7,z:3.3,rot:0},{x:-5,z:-1.4,rot:0},{x:4.6,z:-5.28,rot:Math.PI},{x:-.2,z:5.28,rot:0},{x:4.6,z:1.4,rot:Math.PI},{x:-2.6,z:5.28,rot:0}];
	function build(scene,m){
		const box=m.box,mat=m.mat,ob=m.obstacles;
		function solid(w,h,d,color,x,y,z){let obj=box(w,h,d,color,x,y,z,scene);ob.push({x,z,hw:w/2,hd:d/2});return obj;}
		box(width,.12,depth,0xb5b6ad,0,-.07,0,scene);box(width,.08,depth,0xd6d8ce,0,3.4,0,scene);
		const grid=new THREE.GridHelper(18,36,0x969d96,0xa3aaa2);grid.position.y=.005;grid.scale.z=14/18;scene.add(grid);
		solid(.12,3.4,depth,0xc9d0c8,-9,1.7,0);solid(width,3.4,.12,0xd4d7ce,0,1.7,-7);solid(width,3.4,.12,0xd4d7ce,0,1.7,7);
		solid(.12,3.4,10.4,0xc9d0c8,9,1.7,-1.8);solid(.12,3.4,1.4,0xc9d0c8,9,1.7,6.3);box(.14,1.2,1.5,0xc9d0c8,9,2.8,4.55,scene);
		solid(.15,3.4,12.2,0xb6beb5,-6.4,1.7,-.9);
		for(let z of [-4.6,0,4.6])for(let x of [-4,2,7]){box(2.5,.06,.28,0xece8d5,x,3.25,z,scene,{emissive:0xfff0cc,emissiveIntensity:.6});}
		for(let x of [-3,4]){let l=new THREE.PointLight(0xfff1d3,.3,18,2);l.position.set(x,2.9,0);scene.add(l);}
		for(let z of [-4,0,4])box(.05,1.3,2.3,0x8fa9b0,-8.91,1.9,z,scene,{emissive:0x758e99,emissiveIntensity:.4});
		for(let x of xs){m.desk(x,-6.2,true,0);m.desk(x,-.48,true,Math.PI);m.desk(x,.48,true,0);m.desk(x,6.2,true,Math.PI);for(let z of [-5.28,-1.4,1.4,5.28])ob.push({x,z,hw:.23,hd:.24});}
		for(let z of [-3.1,3.3]){let chair=new THREE.Group();chair.position.set(-5.9,0,z);chair.rotation.y=Math.PI/2;scene.add(chair);box(.46,.06,.46,0x414b53,0,.45,0,chair);box(.46,.5,.06,0x414b53,0,.7,.22,chair);box(.08,.45,.08,0x35414a,0,.22,0,chair);ob.push({x:-5.9,z,hw:.24,hd:.26});}
		const screen=new THREE.Group();screen.position.set(8.85,0,0);screen.rotation.y=-Math.PI/2;scene.add(screen);box(4,.08,.35,0x3b454b,0,.2,0,screen);box(.13,1.1,.12,0x48515b,-1.1,.7,0,screen);box(.13,1.1,.12,0x48515b,1.1,.7,0,screen);box(4.3,1.9,.12,0x27343e,0,1.9,0,screen);
		const c=document.createElement('canvas');c.width=1024;c.height=448;let cx=c.getContext('2d');cx.fillStyle='#1d3037';cx.fillRect(0,0,1024,448);cx.fillStyle='#e0d5aa';cx.font='50px sans-serif';cx.fillText('机房 · 自由研习',75,100);cx.font='28px sans-serif';['讨论 / 15 分钟','CF DUEL / 两道题 / 最长 60 分钟','先思考，再实现，记得提交。'].forEach((s,i)=>cx.fillText(s,75,200+i*70));let face=new THREE.Mesh(new THREE.PlaneGeometry(4.1,1.7),new THREE.MeshBasicMaterial({map:new THREE.CanvasTexture(c)}));face.position.set(0,1.9,.07);screen.add(face);ob.push({x:8.65,z:0,hw:.35,hd:2.2});
		const door=new THREE.Group();door.position.set(9,0,3.5);scene.add(door);let panel=box(.1,2.15,2,0x617b7b,0,1.075,1,door);panel.userData.land='door';box(.12,.08,.18,0xcbb77a,-.08,1.05,1.8,door,{metalness:.7,roughness:.3});let doorObstacle={x:9,z:4.5,hw:.15,hd:1.1,door:true};ob.push(doorObstacle);return {door,doorObstacle};
	}
	return {width,depth,xs,seats,spawn:{x:7,z:5.7},build};
})();
