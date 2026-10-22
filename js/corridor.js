window.OICorridor={build(scene,m){
	const box=m.box,ob=m.obstacles;
	box(3,.12,14,0xd5d2c5,10.5,-.07,0,scene);box(3,.08,14,0xe2ddcf,10.5,3.4,0,scene);
	for(let z of [-7,7]){box(3,2.8,.12,0xc4c9be,10.5,1.4,z,scene);ob.push({x:10.5,z,hw:1.5,hd:.1});}
	for(let z=-6.6;z<=6.6;z+=.6){let post=box(.07,1.2,.07,0x788e95,11.95,.6,z,scene,{metalness:.6,roughness:.3});post.userData.land='flowers';}
	for(let y of [.15,.58,1.16]){let rail=box(.09,.06,14,0x6a858e,11.95,y,0,scene,{metalness:.7,roughness:.3});rail.userData.land='flowers';}
	box(.04,.85,14,0xa8c1bf,11.94,.55,0,scene,{transparent:true,opacity:.24,roughness:.2});ob.push({x:12.05,z:0,hw:.1,hd:7});
	box(11,.12,19,0x7e9b64,17,-3.6,0,scene);box(1.3,.03,18,0xc3b9a1,15,-3.52,0,scene);
	for(let z of [-5,0,5])box(.3,3.5,.3,0xa5ada1,10.5,-1.8,z,scene);
	const petalGeo=new THREE.SphereGeometry(1,8,6),flowerMat=[0xd78e9c,0xe4c96c,0xa795c9,0xeee4c7].map(color=>new THREE.MeshStandardMaterial({color,roughness:.8}));
	for(let i=0;i<28;i++){let x=13.2+(i%4)*1.55,z=-7+Math.floor(i/4)*2.15+.2*Math.sin(i*3),y=-3.1;box(.03,.5,.03,0x47774b,x,y-.25,z,scene);let flower=new THREE.Group();flower.position.set(x,y,z);scene.add(flower);for(let k=0;k<5;k++){let p=new THREE.Mesh(petalGeo,flowerMat[i%4]);p.position.set(Math.cos(k*1.257)*.14,0,Math.sin(k*1.257)*.14);p.scale.set(.14,.055,.14);flower.add(p);}let center=new THREE.Mesh(petalGeo,flowerMat[1]);center.scale.set(.08,.07,.08);flower.add(center);}
	const c=document.createElement('canvas');c.width=512;c.height=128;let ctx=c.getContext('2d');ctx.fillStyle='#355361';ctx.fillRect(0,0,512,128);ctx.fillStyle='#efe3bf';ctx.font='45px sans-serif';ctx.textAlign='center';ctx.fillText('2F · 机房 / 走廊',256,82);let sign=new THREE.Mesh(new THREE.PlaneGeometry(2,.5),new THREE.MeshBasicMaterial({map:new THREE.CanvasTexture(c)}));sign.position.set(8.88,2.65,4.5);sign.rotation.y=-Math.PI/2;scene.add(sign);
}};
