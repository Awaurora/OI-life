/* Adapted from vr-oi-simulator, Copyright (c) 2026 Deng Ziqian, MIT. See assets/VR-OI-LICENSE.txt. */
window.OIModels=function(scene){
const geoCache = new Map();
const matCache = new Map();

function getBoxGeo(w, h, d){
  const k = `${w}|${h}|${d}`;
  let g = geoCache.get(k);
  if (!g){ g = new THREE.BoxGeometry(w, h, d); geoCache.set(k, g); }
  return g;
}
function getSphereGeo(r, sw, sh){
  const k = `s${r}|${sw}|${sh}`;
  let g = geoCache.get(k);
  if (!g){ g = new THREE.SphereGeometry(r, sw, sh); geoCache.set(k, g); }
  return g;
}
function mat(color, opts){
  const k = color + '|' + JSON.stringify(opts || {});
  let m = matCache.get(k);
  if (!m){
    m = new THREE.MeshStandardMaterial(Object.assign(
      { color, roughness: 0.88, metalness: 0.04 }, opts || {}));
    matCache.set(k, m);
  }
  return m;
}
function box(w, h, d, color, x, y, z, parent, opts){
  const m = new THREE.Mesh(getBoxGeo(w, h, d), mat(color, opts));
  m.position.set(x, y, z);
  parent.add(m);
  return m;
}

/* ---------- 碰撞障碍 ---------- */
const obstacles = []; // {x, z, hw, hd}
function addObstacle(x, z, hw, hd){ obstacles.push({ x, z, hw, hd }); }
function collides(x, z, r){
  for (let i = 0; i < obstacles.length; i++){
    const o = obstacles[i];
    if (Math.abs(x - o.x) < o.hw + r && Math.abs(z - o.z) < o.hd + r) return true;
  }
  return false;
}

const ROOM_W = 16, ROOM_D = 14, ROOM_H = 3.4;
const DOOR_W = 0.95, DOOR_H = 2.15;   // 门洞尺寸（+X 墙上的开口）

/* 终局白光：门板 / 门口光面 / 外扩辉光 / 地面投射 / 点光源 */
let doorGroup = null, doorLightMesh = null, doorGlowMesh = null,
    doorFloorMesh = null, doorPointLight = null, doorFloorTex = null;
let doorOpenT = 0;

function buildRoom(){
  const W = ROOM_W, D = ROOM_D, H = ROOM_H;

  const floor = new THREE.Mesh(
    new THREE.PlaneGeometry(W, D),
    mat(0x22262e, { roughness: 0.96 })
  );
  floor.rotation.x = -Math.PI / 2;
  scene.add(floor);

  const gridHelper = new THREE.GridHelper(W, 16, 0x2e3442, 0x2a2f3b);
  gridHelper.position.y = 0.005;
  scene.add(gridHelper);

  const ceil = new THREE.Mesh(
    new THREE.PlaneGeometry(W, D),
    mat(0x171b23, { roughness: 1 })
  );
  ceil.rotation.x = Math.PI / 2;
  ceil.position.y = H;
  scene.add(ceil);

  const wallMat = mat(0x2b313d, { roughness: 0.92 });
  const mkWall = (w, h, x, y, z, ry) => {
    const m = new THREE.Mesh(new THREE.PlaneGeometry(w, h), wallMat);
    m.position.set(x, y, z); m.rotation.y = ry; scene.add(m);
  };
  mkWall(W, H,  0, H/2, -D/2, 0);
  mkWall(W, H,  0, H/2,  D/2, Math.PI);
  mkWall(D, H, -W/2, H/2, 0, Math.PI/2);
  /* +X 墙留出门洞：左右两段 + 顶部一段 */
  const sideW = (D - DOOR_W) / 2;
  mkWall(sideW, H, W/2, H/2, -(D/2 - sideW / 2), -Math.PI/2);
  mkWall(sideW, H, W/2, H/2,  (D/2 - sideW / 2), -Math.PI/2);
  mkWall(DOOR_W, H - DOOR_H, W/2, DOOR_H + (H - DOOR_H) / 2, 0, -Math.PI/2);

  /* 墙面障碍 */
  addObstacle(-W/2 - 0.5, 0, 0.5, D/2 + 1);
  addObstacle( W/2 + 0.5, 0, 0.5, D/2 + 1);
  addObstacle(0, -D/2 - 0.5, W/2 + 1, 0.5);
  addObstacle(0,  D/2 + 0.5, W/2 + 1, 0.5);

  /* 吊灯（只保留 3 个 PointLight，显示器不再单独挂灯） */
  for (let i = -1; i <= 1; i++){
    const lamp = new THREE.Mesh(
      getBoxGeo(3.4, 0.06, 0.42),
      new THREE.MeshBasicMaterial({ color: 0xfff4dc })
    );
    lamp.position.set(i * 4.6, H - 0.08, 0);
    scene.add(lamp);
    const pl = new THREE.PointLight(0xfff0d8, 0.42, 22, 2);
    pl.position.set(i * 4.6, H - 0.4, 0);
    scene.add(pl);
  }

  /* 黑板 */
  box(6, 2.0, 0.06, 0xf2f4f0, 0, 1.85, -D/2 + 0.05, scene,
    { roughness: 0.35, emissive: 0x1a1c1e, emissiveIntensity: 0.4 });
  box(6.16, 2.16, 0.03, 0x3a4150, 0, 1.85, -D/2 + 0.03, scene);

  const bc = document.createElement('canvas');
  bc.width = 1024; bc.height = 320;
  const bx = bc.getContext('2d');
  bx.fillStyle = '#f2f4f0'; bx.fillRect(0, 0, 1024, 320);
  bx.fillStyle = '#c0392b'; bx.font = 'bold 54px "Microsoft YaHei", sans-serif';
  bx.fillText('OI LIFE / 本周训练计划', 60, 90);
  bx.fillStyle = '#2c3e50'; bx.font = '30px "Microsoft YaHei", sans-serif';
  bx.fillText('1. 先想清楚状态，再写转移', 60, 160);
  bx.fillText('2. 找同学讨论，不忘构造反例', 60, 205);
  bx.fillText('3. 把每一天，写进自己的答案', 60, 250);
  const boardTex = new THREE.CanvasTexture(bc);
  boardTex.anisotropy = 4;
  const boardFace = new THREE.Mesh(
    new THREE.PlaneGeometry(5.96, 1.96),
    new THREE.MeshBasicMaterial({ map: boardTex })
  );
  boardFace.position.set(0, 1.85, -D/2 + 0.085);
  scene.add(boardFace);

  /* 挂钟 */
  const clockBody = new THREE.Mesh(
    new THREE.CylinderGeometry(0.32, 0.32, 0.07, 32),
    mat(0xe8ecf2, { roughness: 0.4 })
  );
  clockBody.rotation.x = Math.PI / 2;
  clockBody.position.set(6.2, 2.6, -D/2 + 0.08);
  scene.add(clockBody);
  const clockFace = new THREE.Mesh(
    new THREE.CircleGeometry(0.29, 32),
    new THREE.MeshBasicMaterial({ color: 0xfbfcfe })
  );
  clockFace.position.set(6.2, 2.6, -D/2 + 0.13);
  scene.add(clockFace);
  const hh = box(0.022, 0.15, 0.01, 0x1a1a1a, 6.2, 2.65, -D/2 + 0.14, scene);
  const mm = box(0.018, 0.23, 0.01, 0x333333, 6.2, 2.71, -D/2 + 0.145, scene);
  hh.rotation.z = 0.6; mm.rotation.z = -1.1;

  /* 门 */
  /* 注意：必须赋值给模块级 doorGroup（不能加 const，否则会遮蔽它，
     updateDoorLight / openTheDoor 拿到的就永远是 null） */
  doorGroup = new THREE.Group();
  doorGroup.position.set(W/2 - 0.04, 0, -0.475);   /* 铰链在门左侧 */
  scene.add(doorGroup);
  box(0.07, 2.15, 0.95, 0x4a3a2e, 0, 1.075, 0.475, doorGroup, { roughness: 0.7 });
  const handle = new THREE.Mesh(
    new THREE.CylinderGeometry(0.022, 0.022, 0.16, 10),
    mat(0xc9b037, { metalness: 0.85, roughness: 0.28 })
  );
  handle.rotation.x = Math.PI / 2;
  handle.position.set(-0.08, 1.05, 0.155);
  doorGroup.add(handle);

  const signC = document.createElement('canvas');
  signC.width = 256; signC.height = 96;
  const sx = signC.getContext('2d');
  sx.fillStyle = '#1f6b4a'; sx.fillRect(0, 0, 256, 96);
  sx.fillStyle = '#fff'; sx.font = 'bold 46px "Microsoft YaHei"';
  sx.textAlign = 'center'; sx.fillText('出 口', 128, 64);
  const sign = new THREE.Mesh(
    new THREE.PlaneGeometry(0.5, 0.19),
    new THREE.MeshBasicMaterial({ map: new THREE.CanvasTexture(signC) })
  );
  sign.position.set(W/2 - 0.09, 2.42, 0);
  sign.rotation.y = -Math.PI / 2;
  scene.add(sign);

  /* 窗 */
  box(0.06, 1.6, 3.0, 0x3a4150, -W/2 + 0.04, 1.9, 0, scene);
  const winGlass = new THREE.Mesh(
    new THREE.PlaneGeometry(2.8, 1.42),
    new THREE.MeshBasicMaterial({ color: 0x6d8fb8 })
  );
  winGlass.position.set(-W/2 + 0.09, 1.9, 0);
  winGlass.rotation.y = Math.PI / 2;
  scene.add(winGlass);

  /* 饮水机 */
  const cooler = new THREE.Group();
  cooler.position.set(-6.6, 0, 5.6);
  scene.add(cooler);
  box(0.36, 1.0, 0.36, 0xdfe4ec, 0, 0.5, 0, cooler, { roughness: 0.5 });
  box(0.3, 0.36, 0.3, 0x8fd0f0, 0, 1.18, 0, cooler,
    { transparent: true, opacity: 0.75, roughness: 0.15 });
  box(0.4, 0.04, 0.4, 0x9aa4b4, 0, 1.0, 0, cooler);
  addObstacle(-6.6, 5.6, 0.25, 0.25);
}

const deskScreens=[];
function drawDeskScreen(c,w,h){c.fillStyle='#0b1215';c.fillRect(0,0,w,h);c.fillStyle='#cfea90';c.font='bold 24px monospace';c.fillText('OI LIFE / TRAINING',25,45);c.fillStyle='#8da898';c.font='19px monospace';['#include <bits/stdc++.h>','using namespace std;','int main() {','    solve();','    return 0;','}'].forEach((s,i)=>c.fillText(s,25,95+i*35));}
function buildDesk(x, z, withMonitor, rot=0){
  const g = new THREE.Group();
  g.position.set(x, 0, z);
  g.rotation.y=rot;
  scene.add(g);

  const steel = 0x82939c;
  g.userData.workstation=true;g.userData.topHeight=.98;
  box(2.4, 0.08, 0.95, steel, 0, 0.94, 0, g, {metalness:.7,roughness:.3});
  for (const dx of [-1.1, 1.1])
    for (const dz of [-0.4, 0.4])
      box(0.065, 0.94, 0.065, 0x596c76, dx, 0.47, dz, g, {metalness:.75,roughness:.35});
  box(2.4, 0.48, 0.04, 0x677a84, 0, 0.67, -0.44, g, {metalness:.7,roughness:.4});

  /* 桌子碰撞（桌腿范围） */
  addObstacle(x, z, 1.2, 0.475);

  if (withMonitor){
    box(0.46, 0.025, 0.22, 0x22262e, 0, 0.775, -0.28, g);
    box(0.07, 0.34, 0.07, 0x2e3440, 0, 0.95, -0.30, g);
    box(0.80, 0.48, 0.035, 0x15181f, 0, 1.26, -0.30, g);

    /* 屏幕贴图 */
    const sc = document.createElement('canvas');
    sc.width = 640; sc.height = 384;
    const sx = sc.getContext('2d');
    drawDeskScreen(sx, 640, 384);
    const tex = new THREE.CanvasTexture(sc);
    tex.anisotropy = 4;
    const face = new THREE.Mesh(
      new THREE.PlaneGeometry(0.75, 0.44),
      new THREE.MeshBasicMaterial({ map: tex })
    );
    face.position.set(0, 1.26, -0.278);
    g.add(face);

    /* 记录以便后续刷新（切题 / 得分 / 读档时重新绘制） */
    deskScreens.push({ ctx: sx, tex: tex });

    /* 原先每台显示器一盏 PointLight，累计 6 盏，会把光照 shader 拖慢；
       这里换成一块微弱自发光平面，零光照开销。 */
    const glowPanel = new THREE.Mesh(
      new THREE.PlaneGeometry(0.55, 0.34),
      new THREE.MeshBasicMaterial({
        color: 0x35507f, transparent: true, opacity: 0.18, depthWrite: false
      })
    );
    glowPanel.position.set(0, 1.26, -0.06);
    g.add(glowPanel);

    /* 键盘 */
    const kbC = document.createElement('canvas');
    kbC.width = 512; kbC.height = 180;
    const kx = kbC.getContext('2d');
    kx.fillStyle = '#1c2028'; kx.fillRect(0, 0, 512, 180);
    kx.fillStyle = '#2c323e';
    for (let r = 0; r < 6; r++)
      for (let c = 0; c < 16; c++){
        const w = (r === 5 && c > 3 && c < 9) ? 40 : 26;
        kx.fillRect(10 + c * 31, 12 + r * 27, w, 21);
      }
    const kbTex = new THREE.CanvasTexture(kbC);
    const kb = new THREE.Mesh(
      getBoxGeo(0.46, 0.022, 0.16),
      new THREE.MeshStandardMaterial({ map: kbTex, roughness: 0.75 })
    );
    kb.position.set(0, 0.775, 0.08);
    g.add(kb);

    box(0.065, 0.028, 0.105, 0x1e222a, 0.38, 0.778, 0.10, g, { roughness: 0.6 });

    /* 水杯 */
    const cup = new THREE.Mesh(
      new THREE.CylinderGeometry(0.035, 0.03, 0.10, 16),
      new THREE.MeshStandardMaterial({
        color: 0xdfe6f2, transparent: true, opacity: 0.55, roughness: 0.2
      })
    );
    cup.position.set(0.66, 0.82, -0.02);
    g.add(cup);


    /* 草稿纸 */
    const paper = new THREE.Mesh(
      new THREE.PlaneGeometry(0.30, 0.42),
      new THREE.MeshStandardMaterial({
        color: 0xf2eee3, roughness: 0.95, side: THREE.DoubleSide
      })
    );
    paper.rotation.x = -Math.PI / 2;
    paper.rotation.z = 0.14;
    paper.position.set(-0.62, 0.772, 0.06);
    g.add(paper);


    /* 笔 */
    const pen = new THREE.Mesh(
      new THREE.CylinderGeometry(0.006, 0.006, 0.15, 8),
      mat(0x2a2f3a, { roughness: 0.5 })
    );
    pen.rotation.z = Math.PI / 2;
    pen.rotation.y = 0.3;
    pen.position.set(-0.62, 0.782, 0.20);
    g.add(pen);


  }

  for(const item of g.children.slice(6))item.position.y+=.2;
  for(const dz of [-.36,.36])box(2.4,.06,.06,0x647985,0,.56,dz,g,{metalness:.75,roughness:.3});
  /* 椅子 */
  const chair = new THREE.Group();
  chair.position.set(0, 0, 0.92);
  g.add(chair);
  box(0.46, 0.05, 0.46, 0x2e3440, 0, 0.45, 0, chair);
  box(0.46, 0.52, 0.05, 0x2e3440, 0, 0.72, 0.21, chair);
  box(0.05, 0.45, 0.05, 0x242a34, 0, 0.22, 0, chair);

  return g;
}

function buildPerson(x, z, shirtColor, rotY, startPose){
  const g = new THREE.Group();
  g.position.set(x, 0, z);
  g.rotation.y = rotY || 0;
  scene.add(g);

  const skin = 0xd8a878, pants = 0x2a3140;

  // 坐姿腿组
  const legsSit = new THREE.Group();
  box(0.17, 0.17, 0.44, pants, -0.115, 0.52, 0.22, legsSit);
  box(0.17, 0.17, 0.44, pants,  0.115, 0.52, 0.22, legsSit);
  box(0.16, 0.44, 0.16, pants, -0.115, 0.24, 0.42, legsSit);
  box(0.16, 0.44, 0.16, pants,  0.115, 0.24, 0.42, legsSit);
  g.add(legsSit);

  // 站姿腿组（垂直向下）
  const legsStand = new THREE.Group();
  box(0.17, 0.9, 0.17, pants, -0.115, 0.45, 0, legsStand);
  box(0.17, 0.9, 0.17, pants,  0.115, 0.45, 0, legsStand);
  g.add(legsStand);

  if (startPose === 'stand') legsSit.visible = false;
  else legsStand.visible = false;

  box(0.44, 0.58, 0.27, shirtColor, 0, 1.09, 0.01, g);
  const armL = box(0.115, 0.42, 0.115, shirtColor, -0.29, 1.06, 0.13, g);
  const armR = box(0.115, 0.42, 0.115, shirtColor,  0.29, 1.06, 0.13, g);

  const head = new THREE.Mesh(getSphereGeo(0.135, 16, 12), mat(skin, { roughness: 0.75 }));
  head.position.set(0, 1.52, 0.02);
  g.add(head);
  const hair = new THREE.Mesh(
    new THREE.SphereGeometry(0.142, 16, 12, 0, Math.PI * 2, 0, Math.PI * 0.62),
    mat(0x18181c, { roughness: 1 })
  );
  hair.position.set(0, 1.535, 0.02);
  g.add(hair);

  addContactShadow(g, 0.52);

  return { group: g, armL, armR, head, legsSit, legsStand,
           phase: Math.random() * Math.PI * 2 };
}

const _shadowGeo = new THREE.PlaneGeometry(1, 1);
const _shadowTex = (() => {
  const c = document.createElement('canvas');
  c.width = c.height = 64;
  const g = c.getContext('2d');
  const grad = g.createRadialGradient(32, 32, 1, 32, 32, 31);
  grad.addColorStop(0, 'rgba(0,0,0,0.9)');
  grad.addColorStop(0.55, 'rgba(0,0,0,0.5)');
  grad.addColorStop(1, 'rgba(0,0,0,0)');
  g.fillStyle = grad;
  g.fillRect(0, 0, 64, 64);
  return new THREE.CanvasTexture(c);
})();
const contactShadows = [];

function addContactShadow(parent, radius){
  const m = new THREE.Mesh(_shadowGeo, new THREE.MeshBasicMaterial({
    map: _shadowTex, transparent: true, opacity: 0.45, depthWrite: false
  }));
  m.rotation.x = -Math.PI / 2;
  m.position.y = 0.012;
  m.scale.set(radius * 2, radius * 2, 1);
  m.renderOrder = 1;
  parent.add(m);
  contactShadows.push(m);
  return m;
}

/* 紧张态：阴影变深（"阴影更深"的廉价实现，无需 shadowMap） */
return {room:buildRoom,desk:buildDesk,person:buildPerson,obstacles,box,mat};
};
