
const C=document.getElementById('c'),WW=NYTHRAVEL_WORLD.config.width,WH=NYTHRAVEL_WORLD.config.height;
let g=C.getContext('2d');
let W=960,H=600;
const R=Math.random,rr=(a,b)=>a+R()*(b-a),cl=(v,a,b)=>Math.max(a,Math.min(b,v));
const K={};
const CT=[{u:'KeyW',d:'KeyS',l:'KeyA',r:'KeyD',a:'KeyF',s:['KeyQ','KeyE','KeyR'],col:'#4aa3ff',n:'Игрок 1'},
{u:'ArrowUp',d:'ArrowDown',l:'ArrowLeft',r:'ArrowRight',a:'Enter',s:['KeyI','KeyO','KeyP'],col:'#ff6a8a',n:'Игрок 2'},
{u:'ArrowUp',d:'ArrowDown',l:'ArrowLeft',r:'ArrowRight',a:'Enter',s:['KeyI','KeyO','KeyP'],col:'#d6a6ff',n:'Игрок 3'}];
const UP=[['dmg','Сила','+4 урона',10],['hp','Живучесть','+20 здоровья',10],['spd','Ловкость','+6% скорости',5],
['crit','Меткость','+5% шанс крита',8,'dmg',2],['vamp','Похищение жизни','+0,5% фактического урона в лечение',5,'crit',2],
['dash','Рывок (1-й навык)','рывок с неуязвимостью',5],['nova','Нова (2-й навык)','взрыв вокруг',5,'dmg',3],
['heal','Исцеление (3-й навык)','лечит себя и союзника',5,'hp',3]];
const nm=k=>UP.find(u=>u[0]==k)[1];
const ET={slime:{hp:30,sp:55,d:6,r:12,c:'#5fd16a',xp:8,g:3},bat:{hp:18,sp:120,d:5,r:9,c:'#9a6bd6',xp:7,g:2},
archer:{hp:26,sp:50,d:8,r:11,c:'#d6b25f',xp:11,g:4,rng:1},skel:{hp:55,sp:75,d:11,r:13,c:'#d9dde6',xp:14,g:5},
mage:{hp:34,sp:45,d:9,r:12,c:'#e0507a',xp:15,g:6,rng:1},orc:{hp:110,sp:60,d:16,r:16,c:'#6b8f3a',xp:25,g:9},zombie:{hp:70,sp:42,d:9,r:13,c:'#7fa35a',xp:13,g:4},wolf:{hp:40,sp:130,d:9,r:12,c:'#8a8f99',xp:12,g:4},spider:{hp:35,sp:80,d:7,r:11,c:'#3a2a3f',xp:14,g:5,rng:1},goblin:{hp:28,sp:115,d:7,r:10,c:'#6bbf4a',xp:11,g:9},treant:{hp:170,sp:38,d:16,r:20,c:'#6b4a2a',xp:30,g:10},yeti:{hp:150,sp:55,d:18,r:19,c:'#e8f1ff',xp:32,g:11},wraith:{hp:42,sp:60,d:9,r:12,c:'#9fe0ff',xp:16,g:6,rng:1},toad:{hp:55,sp:70,d:10,r:13,c:'#6b8f3a',xp:15,g:5,rng:1},wisp:{hp:30,sp:90,d:8,r:9,c:'#7dffb0',xp:14,g:5,rng:1},croc:{hp:130,sp:60,d:17,r:18,c:'#4a7a3a',xp:28,g:10},bogling:{hp:60,sp:60,d:10,r:13,c:'#5a6b3a',xp:15,g:5}};
const ETK=Object.keys(ET);
const BS=[{n:'Король слизней',c:'#3fbf55',hp:600,r:34,sp:45},{n:'Костяной лучник',c:'#e8e2c8',hp:500,r:26,sp:60},
{n:'Огненный маг',c:'#ff7a2a',hp:520,r:26,sp:50},{n:'Каменный голем',c:'#8a8f99',hp:900,r:38,sp:35},
{n:'Королева пауков',c:'#8a2a7a',hp:700,r:30,sp:70},{n:'Призрачный рыцарь',c:'#9fd8ff',hp:650,r:28,sp:80},
{n:'Ледяной шаман',c:'#6fe0ff',hp:600,r:27,sp:55}];
let state='menu',coop=0,P=[],E=[],S=[],D=[],N=[],F=[],T=[],wave=0,wt=1,cam={x:0,y:0},ban={t:0,s:''};
const $=id=>document.getElementById(id),show=id=>$(id).style.display='flex',hide=id=>$(id).style.display='none';
addEventListener('keydown',e=>{if(e.target.matches('input,textarea,select'))return;K[e.code]=1;if(e.code.startsWith('Arrow')||e.code=='Space'||e.code=='Enter')e.preventDefault();
if(e.code=='KeyT'&&!e.repeat&&(state=='play'||state=='tree')&&$('shop').style.display!='flex'&&$('inv').style.display!='flex')tog();if(e.code=='Escape'&&$('tree').style.display=='flex')tog()});
addEventListener('keyup',e=>K[e.code]=0);
function mk(i){const up={};UP.forEach(u=>up[u[0]]=0);return{i,x:WW/2+i*50,y:WH/2,hp:100,mhp:100,xp:0,nx:30,lvl:1,pts:1,gold:0,wood:0,ore:0,wp:0,fx:1,fy:0,ac:0,cd:[0,0,0],inv:0,bag:[],up,dead:0}}
function start(c){coop=c;P=[mk(0)];if(c)P.push(mk(1));E=[];S=[];D=[];F=[];T=[];N=[];A=[];CH=[];QS={k:0,g:20,t:0};wave=0;wt=8;
for(let i=0;i<50;i++)N.push(node('tree'));for(let i=0;i<36;i++)N.push(node('rock'));state='play';hide('menu');hide('over');hide('tree');hide('shop');hide('inv');document.activeElement.blur()}
const node=t=>{let x,y,k=0;do{x=rr(80,WW-80);y=rr(80,WH-80);k++}while(k<12&&R()>NW[t][biomeAt(x,y)]);return{t,x,y,hp:25,mhp:25,rs:0}};
let dmgOf=p=>(10+p.wp*3+p.up.dmg*4+p.lvl*1.5+((p.wl&&p.wl[p.w|0])|0)*4)*CLS[p.cl|0].dm*(1+gs(p,'dm')+(p.bf&&p.bf.dm>0?.5:0));
function calc(p){const m=Math.round((100+p.up.hp*20+(p.lvl-1)*5)*CLS[p.cl|0].hp)+gs(p,'hp');p.hp+=m-p.mhp;p.mhp=m}
function xpAll(v){P.forEach(p=>{if(p.dead)return;p.xp+=v*(p.bf&&p.bf.xp>0?2:1);while(p.xp>=p.nx){p.xp-=p.nx;p.lvl++;p.pts++;p.nx=Math.floor(p.nx*1.35+10);const previousHP=p.hp;calc(p);p.hp=Math.min(p.mhp,previousHP);txt(p.x,p.y-30,'УРОВЕНЬ '+p.lvl+'!','#ffd54a')}})}
const txt=(x,y,s,c)=>T.push({x,y,s,c,t:.9});
const fxr=(x,y,r,c)=>F.push({x,y,r,c,t:.3,m:.3});
function spawnE(type,x,y){const d=ET[type],party=P.filter(p=>!p.offline).length||1,sc=(1+wave*.16)*(1+(party-1)*.4);return{type,x,y,hp:d.hp*sc*1.12,mhp:d.hp*sc*1.12,sp:d.sp*(1+wave*.018)*(party>=3?1.12:1),d:d.d*(1+wave*.035)*(party>=3?1.18:1),r:d.r,c:type=='wolf'&&biomeAt(x,y)==2?'#d8ecff':d.c,xp:d.xp,g:d.g,rng:d.rng,a:rr(0,2),f:0}}
function bossE(bi){const b=BS[bi%7],party=P.filter(p=>!p.offline).length||1,sc=(1+Math.floor(bi/7)*.8)*(1+(party-1)*.5)*(1+wave*.045);
return{type:'boss',boss:1,bi:bi%7,name:b.n,x:WW/2,y:80,hp:b.hp*sc*1.12,mhp:b.hp*sc*1.12,sp:b.sp*(1+wave*.02)*(party>=3?1.12:1),d:20*(1+wave*.04)*(party>=3?1.15:1),r:b.r,c:b.c,xp:120,g:60,a:2,b:3,s:0,ang:0,f:0,tl:0}}
function nextWave(){wave++;P.forEach(p=>{if(p.dead){p.dead=0;p.hp=p.mhp/2}});
const pos=()=>{const p=P[Math.floor(R()*P.length)],a=R()*6.283,d=rr(420,720);return[cl(p.x+Math.cos(a)*d,40,WW-40),cl(p.y+Math.sin(a)*d,40,WH-40)]};
const pool=ETK.slice(0,Math.min(6,2+Math.floor(wave/2)));if(wave>=2)pool.push('zombie','zombie');
if(wave%3==0){const bi=wave/3-1,[x,y]=pos(),b=bossE(bi);b.x=x;b.y=y;E.push(b);ban={t:3.5,s:'МИНИ-БОСС: '+b.name};
for(let i=0;i<3+Math.floor(wave/3);i++){const[a,c]=pos();E.push(spawnE(pickT(a,c,pool),a,c))}}
else{const n=Math.min(28,5+wave*2);for(let i=0;i<n;i++){const[a,c]=pos();E.push(spawnE(pickT(a,c,pool),a,c))}ban={t:2.5,s:'Волна '+wave};if(wave%4==0){for(let i=0;i<Math.floor(4+wave*.7);i++){const[a,c]=pos();E.push(spawnE('zombie',a,c))}ban={t:3,s:'Волна '+wave+': ОРДА ЗОМБИ!'}}}}
function hurt(p,d){if(p.inv>0||p.dead)return;if(p.cl==4)d*=.7;d*=(1-gs(p,'ar'))*(p.bf&&p.bf.sh>0?.7:1);p.hp-=d;p.inv=.6;txt(p.x,p.y-20,'-'+Math.ceil(d),'#ff5a5a');if(p.hp<=0){p.hp=0;p.dead=1}}
function hit(e,d,p){if(!E.includes(e))return;const cr=R()<.05+p.up.crit*.05;if(cr)d*=2;e.hp-=d;e.f=.1;burst(e.x,e.y,'#fff',3);txt(e.x,e.y-e.r,Math.ceil(d)+(cr?'!':''),cr?'#ffd54a':'#fff');
if(e.hp<=0)kill(e)}
function drop(x,y,t,v){D.push({x:x+rr(-14,14),y:y+rr(-14,14),t,v})}
function kill(e){if(!E.includes(e))return;E.splice(E.indexOf(e),1);xpAll(e.xp);if(e.type=='zombie'&&!e.rz&&R()<.25){const z=spawnE('zombie',e.x,e.y);z.rz=1;z.mhp*=.5;z.hp=z.mhp;z.ri=1.8;E.push(z);txt(e.x,e.y-20,'Встаёт!','#9fe870')}const n=e.boss?10:1+Math.floor(R()*2);
for(let i=0;i<n;i++)drop(e.x,e.y,'gold',Math.ceil(e.g/(e.boss?5:1)));
if(R()<.3||e.boss){drop(e.x,e.y,'ore',1+(e.boss?3:0))}if(R()<.3||e.boss){drop(e.x,e.y,'wood',1+(e.boss?3:0))}
if(R()<.12||e.boss)drop(e.x,e.y,'hp',30);if(R()<(e.boss?1:.07+Math.min(.06,wave*.004)))CH.push({x:e.x,y:e.y,r:e.boss?(R()<.5?2:3):chestR()});
if(e.boss){P.forEach(p=>p.pts++);txt(e.x,e.y-40,'+1 очко навыков всем!','#7dffb0')}fxr(e.x,e.y,e.r*2,e.c);burst(e.x,e.y,e.c,e.boss?32:12)}
function sh(e,a,sp,d,c,r=6){S.push({x:e.x,y:e.y,fx:SFX[e.type],vx:Math.cos(a)*sp,vy:Math.sin(a)*sp,d:d*(1+wave*.05),r,c,l:5})}
function ring(e,n,sp,d,o){for(let i=0;i<n;i++)sh(e,o+i/n*6.283,sp,d,'#ffb04a')}
function mv(e,p,s,dt){const a=Math.atan2(p.y-e.y,p.x-e.x);e.x+=Math.cos(a)*s*dt;e.y+=Math.sin(a)*s*dt}
function bossAI(e,dt,pl,d,ang){const k=e.hp<e.mhp/2?.7:1;e.a-=dt;e.b-=dt;e.tl=0;
switch(e.bi){
case 0:mv(e,pl,e.sp,dt);if(e.a<=0){e.a=3.2*k;for(let i=0;i<2;i++)E.push(spawnE('slime',e.x+rr(-40,40),e.y+rr(-40,40)))}break;
case 1:if(d<260)mv(e,pl,-e.sp,dt);else if(d>340)mv(e,pl,e.sp,dt);if(e.a<=0){e.a=2.4*k;ring(e,12,170,12,R()*6)}if(e.b<=0){e.b=.9*k;sh(e,ang,260,10,'#fff6b0')}break;
case 2:mv(e,pl,e.sp*.6,dt);if(e.a<=0){e.a=1.9*k;for(let i=-2;i<=2;i++)sh(e,ang+i*.3,230,12,'#ff7a2a',8)}
if(e.b<=0){e.b=5;e.x=e.blink?.x??pl.x+Math.cos(R()*6.28)*220;e.y=e.blink?.y??pl.y+Math.sin(R()*6.28)*220;e.blink=null;fxr(e.x,e.y,50,'#ff7a2a')}break;
case 3:if(e.s==0){mv(e,pl,e.sp,dt);if(e.a<=0){e.s=1;e.a=.7}}else if(e.s==1){e.tl=1;e.ang=ang;if(e.a<=0){e.s=2;e.a=.9}}
else{e.x+=Math.cos(e.ang)*340*dt;e.y+=Math.sin(e.ang)*340*dt;if(e.a<=0){e.s=0;e.a=3*k;ring(e,10,150,14,0)}}break;
case 4:mv(e,pl,e.sp,dt);if(e.a<=0){e.a=1.6*k;for(let i=-1;i<=1;i++)sh(e,ang+i*.25,240,10,'#b84fd6')}
if(e.b<=0){e.b=6;for(let i=0;i<2;i++)E.push(spawnE('bat',e.x+rr(-30,30),e.y+rr(-30,30)))}break;
case 5:mv(e,pl,e.sp,dt);if(e.b<=0){e.b=4*k;e.x=e.blink?.x??pl.x-pl.fx*90;e.y=e.blink?.y??pl.y-pl.fy*90;e.blink=null;ring(e,8,200,13,R());fxr(e.x,e.y,50,'#9fd8ff')}break;
case 6:e.ang+=dt*2.2;if(e.a<=0){e.a=.14;sh(e,e.ang,200,8,'#6fe0ff')}if(d<200)mv(e,pl,-e.sp,dt);else if(d>320)mv(e,pl,e.sp,dt);
if(e.b<=0){e.b=5*k;ring(e,14,150,12,0)}break}}
function upd(dt){
if(state!='play')return;ban.t-=dt;
const al=P.filter(p=>!p.dead);
if(!al.length){state='over';$('ovs').textContent='Дошли до волны '+wave+' · уровни: '+P.map(p=>p.lvl).join(' / ');show('over');return}
let cx=0,cy=0;al.forEach(p=>{cx+=p.x;cy+=p.y});cx/=al.length;cy/=al.length;
cam.x=cl(cx-W/2,0,WW-W);cam.y=cl(cy-H/2,0,WH-H);
P.forEach(p=>{if(p.dead)return;const c=CT[p.i];
// Network guest inputs are read by slot, never merged into the shared keyboard map.
const mx=(pkey(p,c.r,3)?1:0)-(pkey(p,c.l,2)?1:0),my=(pkey(p,c.d,1)?1:0)-(pkey(p,c.u,0)?1:0),l=Math.hypot(mx,my);
if(l){p.fx=mx/l;p.fy=my/l;const s=playerSpeed(p)*(p.st&&p.st.slow>0?.6:1)*BSP[biomeAt(p.x,p.y)];p.x+=p.fx*s*dt;p.y+=p.fy*s*dt}if(p.aim){const q=Math.hypot(p.aim[0],p.aim[1])||1;p.fx=p.aim[0]/q;p.fy=p.aim[1]/q}
p.x=cl(p.x,Math.max(20,cam.x+20),Math.min(WW-20,cam.x+W-20));p.y=cl(p.y,Math.max(20,cam.y+20),Math.min(WH-20,cam.y+H-20));
applyPlayerCollision(p);p.ac-=dt*playerAttackRate(p);p.inv-=dt;for(let i=0;i<3;i++)p.cd[i]-=dt;
if(pkey(p,c.a,4)&&p.ac<=0&&(!p.w||p.w>2)){p.ac=.35;const tw=p.w>2?p.w-2:0,d=dmgOf(p)*(tw?.5:1);F.push({x:p.x+p.fx*30,y:p.y+p.fy*30,r:44,c:'#fff',t:.12,m:.12});
E.slice().forEach(e=>{const dx=e.x-p.x,dy=e.y-(p.y-14),ds=Math.hypot(dx,dy),reach=p.eq?.weapon?.catalogId?.includes('dagger')?40:p.w===3||p.w===4?54:64;if(ds<e.r+reach&&(dx*p.fx+dy*p.fy)/(ds||1)>.65){hit(e,d,p);if(!e.boss){const push=14+(p.cl===0?(p.up.bladecraft||0)*3:0);e.x+=p.fx*push;e.y+=p.fy*push}}});
harvestNearby(p)}
playerAbilities(p,dt);applyPlayerCollision(p)});
if(!E.length){wt-=dt;if(wt<=0){nextWave();wt=20}}
E.slice().forEach(e=>enemyAI(e,dt,al));
S.slice().forEach(s=>{s.x+=s.vx*dt;s.y+=s.vy*dt;s.l-=dt;let rm=s.l<=0;
al.forEach(p=>{if(!rm&&Math.hypot(p.x-s.x,p.y-s.y)<s.r+12){hurt(p,s.d,s.kind||'magic');if(s.fx)stat(p,s.fx);rm=1}});if(rm)S.splice(S.indexOf(s),1)});
D.slice().forEach(o=>{if(o.t==='shard')return;const pl=al.reduce((a,p)=>Math.hypot(p.x-o.x,p.y-o.y)<Math.hypot(a.x-o.x,a.y-o.y)?p:a,al[0]);
const d=Math.hypot(pl.x-o.x,pl.y-o.y);if(d<100){o.x+=(pl.x-o.x)*dt*6;o.y+=(pl.y-o.y)*dt*6}
if(d<18){if(o.t=='hp')pl.hp=Math.min(pl.mhp,pl.hp+o.v);else pl[o.t]+=o.v;txt(pl.x,pl.y-30,'+'+o.v+' '+{gold:'🪙',wood:'🪵',ore:'⛏',hp:'❤'}[o.t],'#ffe9a0');D.splice(D.indexOf(o),1)}});

F.forEach(f=>f.t-=dt);F=F.filter(f=>f.t>0);T.forEach(t=>{t.t-=dt;t.y-=25*dt});T=T.filter(t=>t.t>0)}
function ball(x,y,r,c){g.fillStyle='rgba(0,0,0,.3)';g.beginPath();g.ellipse(x,y+r*.8,r,r*.4,0,0,7);g.fill();g.fillStyle=c;g.beginPath();g.arc(x,y,r,0,7);g.fill()}
function bar(x,y,w,v,m,c){g.fillStyle='#000a';g.fillRect(x,y,w,5);g.fillStyle=c;g.fillRect(x,y,w*Math.max(0,v/m),5)}
function draw(){
g.clearRect(0,0,W,H);g.save();g.translate(-cam.x,-cam.y);
for(let x=Math.floor(cam.x/64)*64;x<cam.x+W+64;x+=64)for(let y=Math.floor(cam.y/64)*64;y<cam.y+H+64;y+=64){g.fillStyle=((x+y)/64)%2?'#2f6a3a':'#2b6035';g.fillRect(x,y,64,64)}
g.strokeStyle='#000';g.lineWidth=6;g.strokeRect(0,0,WW,WH);
N.forEach(n=>{if(n.rs>0)return;if(n.t=='tree'){g.fillStyle='#5a3b1e';g.fillRect(n.x-4,n.y-4,8,20);ball(n.x,n.y-10,18,'#1f7a35')}else{ball(n.x,n.y,16,'#8d939c');g.fillStyle='#c7ccd4';g.fillRect(n.x-4,n.y-8,8,6)}
if(n.hp<n.mhp)bar(n.x-15,n.y-26,30,n.hp,n.mhp,'#ddd')});
D.forEach(o=>{g.fillStyle={gold:'#ffd54a',wood:'#a0702e',ore:'#7ec8e3',hp:'#ff4d6d',shard:'#cba0ff'}[o.t];g.beginPath();g.arc(o.x,o.y,o.t=='gold'?5:6,0,7);g.fill()});
E.forEach(e=>{ball(e.x,e.y,e.r,e.f>0?'#fff':e.tl&&Math.floor(Date.now()/80)%2?'#f55':e.c);
if(e.boss){g.fillStyle='#ffd54a';g.beginPath();g.moveTo(e.x-12,e.y-e.r);g.lineTo(e.x-12,e.y-e.r-12);g.lineTo(e.x-4,e.y-e.r-5);g.lineTo(e.x,e.y-e.r-14);g.lineTo(e.x+4,e.y-e.r-5);g.lineTo(e.x+12,e.y-e.r-12);g.lineTo(e.x+12,e.y-e.r);g.fill()}
g.fillStyle='#111';g.fillRect(e.x-e.r*.5,e.y-e.r*.3,3,3);g.fillRect(e.x+e.r*.3,e.y-e.r*.3,3,3);
if(!e.boss)bar(e.x-e.r,e.y-e.r-9,e.r*2,e.hp,e.mhp,'#e55')});
S.forEach(s=>{g.fillStyle=s.c;g.beginPath();g.arc(s.x,s.y,s.r,0,7);g.fill()});
P.forEach(p=>{if(p.dead){g.fillStyle='#888';g.font='20px sans-serif';g.fillText('💀',p.x-10,p.y+6);return}
if(p.inv>0&&Math.floor(Date.now()/60)%2)g.globalAlpha=.4;ball(p.x,p.y,13,CT[p.i].col);g.fillStyle='#fff';g.beginPath();g.arc(p.x+p.fx*9,p.y+p.fy*9,4,0,7);g.fill();g.globalAlpha=1;
bar(p.x-16,p.y-24,32,p.hp,p.mhp,'#4f4')});
F.forEach(f=>{g.globalAlpha=f.t/f.m;g.strokeStyle=f.c;g.lineWidth=4;g.beginPath();g.arc(f.x,f.y,f.r*(1.2-f.t/f.m*.3),0,7);g.stroke();g.globalAlpha=1});
g.font='bold 14px sans-serif';g.textAlign='center';T.forEach(t=>{g.globalAlpha=Math.min(1,t.t*2);g.fillStyle=t.c;g.fillText(t.s,t.x,t.y)});g.globalAlpha=1;
g.restore();hud()}
function hud(){g.textAlign='left';g.font='12px sans-serif';
P.forEach((p,i)=>{const x=10+i*(W-250),y=10;g.fillStyle='#000a';g.fillRect(x,y,240,86);g.fillStyle=CT[p.i].col;g.fillText(CT[p.i].n+' · ур. '+p.lvl+(p.pts?'  ★'+p.pts+' очк. (T)':''),x+6,y+14);
bar(x+6,y+20,228,p.hp,p.mhp,'#4f4');bar(x+6,y+28,228,p.xp,p.nx,'#6af');g.fillStyle='#fff';g.fillText('🪙'+p.gold+'  🪵'+p.wood+'  ⛏'+p.ore+'  ⚔'+Math.round(dmgOf(p)),x+6,y+52);
for(let k=0;k<3;k++){const u=[p.up.dash,p.up.nova,p.up.heal][k];g.fillStyle=u?(p.cd[k]>0?'#555':'#f5b942'):'#333';g.fillRect(x+6+k*40,y+60,34,18);g.fillStyle='#000';g.fillText(u?(p.cd[k]>0?Math.ceil(p.cd[k]):CT[p.i].s[k].replace('Key','')):'🔒',x+14+k*40,y+73)}});
g.textAlign='center';g.fillStyle='#fff';g.font='bold 16px sans-serif';g.fillText('Волна '+wave+' · врагов: '+E.length,W/2,P.length>1?146:24);
const b=E.find(e=>e.boss);if(b){g.fillStyle='#000a';g.fillRect(W/2-170,32,340,22);bar(W/2-166,44,332,b.hp,b.mhp,'#e33');g.fillStyle='#fff';g.font='bold 13px sans-serif';g.fillText(b.name,W/2,42)}
if(ban.t>0){g.globalAlpha=Math.min(1,ban.t);g.font='bold 32px sans-serif';g.fillStyle='#ffd54a';g.fillText(ban.s,W/2,H/2-100);g.globalAlpha=1}}
function tog(){if($('tree').style.display=='flex'){if(!NET)state='play';hide('tree')}else{if(!NET)state='tree';renderTree();show('tree')}}
function upg(i,k){if(NET=='guest'){snd({t:'u',k,expected:P[ME]?.up[k]});return}const p=P[i];p.pts--;p.up[k]++;if(k=='hp')calc(p);renderTree()}
function buy(i,w){if(NET=='guest'){snd({t:'b',w});return}const p=P[i];if(w=='pot'){p.gold-=25;p.hp=p.mhp}else{const n=p.wp+1;p.ore-=4*n;p.wood-=3*n;p.gold-=15*n;p.wp++}renderTree()}
function renderTree(){let h='<h2>🌳 Древо навыков и кузница</h2><div class="cols">';
P.forEach(p=>{if(NET&&p.i!=ME)return;const n=p.wp+1,fo=4*n,fw=3*n,fg=15*n;
h+=`<div class="col"><h3 style="color:${CT[p.i].col}">${CT[p.i].n} · ур. ${p.lvl}</h3>${clsHtml(p)}<p>Очки: <b>${p.pts}</b> · 🪙${p.gold} 🪵${p.wood} ⛏${p.ore}</p>`;
UP.forEach(u=>{const lv=p.up[u[0]],ok=p.pts>0&&lv<u[3]&&(!u[4]||p.up[u[4]]>=u[5]);
h+=`<div class="row"><span><b>${u[1]}</b> ${lv}/${u[3]}<br><small>${u[2]}${u[4]?' · нужно: '+nm(u[4])+' '+u[5]:''}</small></span><button ${ok?'':'disabled'} onclick="upg(${p.i},'${u[0]}')">+</button></div>`});
h+=shopHtml(p);h+=`<div class="row"><span><b>Зелье</b> (полное лечение)<br><small>25 🪙</small></span><button ${p.gold>=25?'':'disabled'} onclick="buy(${p.i},'pot')">Купить</button></div>`;
h+=`<div class="row"><span><b>Кузница: оружие ${p.wp}→${n}</b> (+3 урона)<br><small>${fo} ⛏ · ${fw} 🪵 · ${fg} 🪙</small></span><button ${p.ore>=fo&&p.wood>=fw&&p.gold>=fg?'':'disabled'} onclick="buy(${p.i},'forge')">Ковать</button></div></div>`});
$('tree').innerHTML=h+'</div><button onclick="tog()">Закрыть (T / Esc)</button>'}
/* === Улучшенная графика (переопределяет старые функции отрисовки) === */
const TIME=()=>performance.now()/1000;
const rnd=(x,y)=>{const s=Math.sin(x*127.1+y*311.7)*43758.5453;return s-Math.floor(s)};
const rrect=(x,y,w,h,r)=>{g.beginPath();g.moveTo(x+r,y);g.arcTo(x+w,y,x+w,y+h,r);g.arcTo(x+w,y+h,x,y+h,r);g.arcTo(x,y+h,x,y,r);g.arcTo(x,y,x+w,y,r);g.closePath()};
let bgc;
function makeBG(){bgc=document.createElement('canvas');bgc.width=WW;bgc.height=WH;const b=bgc.getContext('2d');
for(let x=0;x<WW;x+=32)for(let y=0;y<WH;y+=32){const v=rnd(x,y);b.fillStyle='hsl('+(112+v*14)+','+(42+v*10)+'%,'+(26+v*8)+'%)';b.fillRect(x,y,32,32)}
for(let i=0;i<70;i++){const x=rnd(i,1)*WW,y=rnd(i,2)*WH,r=40+rnd(i,3)*90,gr=b.createRadialGradient(x,y,0,x,y,r);gr.addColorStop(0,i%3==0?'rgba(120,90,50,.38)':'rgba(130,230,130,.13)');gr.addColorStop(1,'rgba(0,0,0,0)');b.fillStyle=gr;b.fillRect(x-r,y-r,r*2,r*2)}
b.lineWidth=1.5;for(let i=0;i<3800;i++){const x=rnd(i,7)*WW,y=rnd(i,8)*WH;b.strokeStyle='hsl('+(100+rnd(i,9)*30)+',50%,'+(30+rnd(i,4)*22)+'%)';b.beginPath();b.moveTo(x,y);b.lineTo(x+rnd(i,5)*6-3,y-4-rnd(i,6)*5);b.stroke()}
for(let i=0;i<280;i++){const x=rnd(i,11)*WW,y=rnd(i,12)*WH;b.fillStyle=['#fff','#ffd54a','#ff8aa8','#a8c8ff'][i%4];b.beginPath();b.arc(x,y,2.2,0,7);b.fill();b.fillStyle='#f5c518';b.fillRect(x-.7,y-.7,1.4,1.4)}
b.strokeStyle='#2f343e';b.lineWidth=28;b.strokeRect(0,0,WW,WH);b.strokeStyle='#7a8394';b.lineWidth=4;b.strokeRect(14,14,WW-28,WH-28);b.strokeStyle='#1a1d24';b.lineWidth=2;b.strokeRect(28,28,WW-56,WH-56)}
function ball(x,y,r,c){g.fillStyle='rgba(0,0,0,.28)';g.beginPath();g.ellipse(x,y+r*.85,r*.95,r*.38,0,0,7);g.fill();
g.fillStyle=c;g.beginPath();g.arc(x,y,r,0,7);g.fill();
const gr=g.createRadialGradient(x-r*.4,y-r*.45,r*.05,x,y,r*1.05);gr.addColorStop(0,'rgba(255,255,255,.5)');gr.addColorStop(.45,'rgba(255,255,255,0)');gr.addColorStop(1,'rgba(0,0,0,.5)');
g.fillStyle=gr;g.beginPath();g.arc(x,y,r,0,7);g.fill();g.strokeStyle='rgba(0,0,0,.45)';g.lineWidth=1.5;g.stroke()}
function bar(x,y,w,v,m,c){const f=w*Math.max(0,v/m);g.fillStyle='#000c';g.fillRect(x-1,y-1,w+2,7);g.fillStyle=c;g.fillRect(x,y,f,5);g.fillStyle='rgba(255,255,255,.3)';g.fillRect(x,y,f,2)}
function bar2(x,y,w,h,v,m,c1,c2,lb){g.fillStyle='#0009';rrect(x,y,w,h,h/2);g.fill();const f=Math.max(0,Math.min(1,v/m))*w;if(f>1){const gr=g.createLinearGradient(0,y,0,y+h);gr.addColorStop(0,c2);gr.addColorStop(1,c1);g.fillStyle=gr;rrect(x,y,f,h,h/2);g.fill()}
if(lb){g.fillStyle='#fff';g.font='bold 9px sans-serif';g.textAlign='center';g.fillText(lb,x+w/2,y+h-2)}}
function eyes(x,y,r,tx,ty,c){const a=Math.atan2(ty-y,tx-x);[-1,1].forEach(s=>{const ex=x+s*r*.38,ey=y-r*.15;g.fillStyle=c||'#fff';g.beginPath();g.ellipse(ex,ey,r*.24,r*.3,0,0,7);g.fill();g.fillStyle='#111';g.beginPath();g.arc(ex+Math.cos(a)*r*.1,ey+Math.sin(a)*r*.12,r*.12,0,7);g.fill()})}
function glow(x,y,r,c,a){const gr=g.createRadialGradient(x,y,0,x,y,r);gr.addColorStop(0,c);gr.addColorStop(1,'rgba(0,0,0,0)');g.globalAlpha=a;g.fillStyle=gr;g.fillRect(x-r,y-r,r*2,r*2);g.globalAlpha=1}
function nd(n,t){if(n.t=='tree'){const s=Math.sin(t*1.5+n.x)*2;g.fillStyle='rgba(0,0,0,.28)';g.beginPath();g.ellipse(n.x,n.y+16,24,8,0,0,7);g.fill();
const gr=g.createLinearGradient(n.x-6,0,n.x+6,0);gr.addColorStop(0,'#4a2f17');gr.addColorStop(1,'#7a5230');g.fillStyle=gr;g.fillRect(n.x-6,n.y-6,12,24);
[[-13,-26,16,'#17602b'],[13,-24,15,'#1c6f31'],[0,-34,19,'#238a3d'],[-4,-44,12,'#31a84e']].forEach(c=>{g.fillStyle=c[3];g.beginPath();g.arc(n.x+c[0]+s,n.y+c[1],c[2],0,7);g.fill()});
g.fillStyle='rgba(255,255,255,.15)';g.beginPath();g.arc(n.x-6+s,n.y-46,7,0,7);g.fill()}
else{g.fillStyle='rgba(0,0,0,.28)';g.beginPath();g.ellipse(n.x,n.y+14,22,7,0,0,7);g.fill();const P0=[[-18,10],[-20,-2],[-10,-14],[6,-16],[18,-6],[20,10]];
g.fillStyle='#6b717b';g.beginPath();P0.forEach((p,i)=>i?g.lineTo(n.x+p[0],n.y+p[1]):g.moveTo(n.x+p[0],n.y+p[1]));g.closePath();g.fill();
g.fillStyle='#98a0ab';g.beginPath();g.moveTo(n.x-20,n.y-2);g.lineTo(n.x-10,n.y-14);g.lineTo(n.x+6,n.y-16);g.lineTo(n.x-2,n.y-2);g.fill();
g.fillStyle='#4f545d';g.beginPath();g.moveTo(n.x+20,n.y+10);g.lineTo(n.x+18,n.y-6);g.lineTo(n.x+4,n.y+2);g.lineTo(n.x+4,n.y+10);g.fill();g.fillStyle='#7fd0ff';g.fillRect(n.x-3,n.y-8,4,4);g.fillRect(n.x+7,n.y,3,3)}
{const iy=n.y-(n.t=='tree'?80:42)+Math.sin(t*2+n.x)*2;g.fillStyle='rgba(12,16,28,.75)';g.beginPath();g.arc(n.x,iy,10,0,7);g.fill();g.strokeStyle='#f5b942';g.lineWidth=1.5;g.stroke();g.font='12px sans-serif';g.textAlign='center';g.fillStyle='#fff';g.fillText(n.t=='tree'?'🪵':'⛏',n.x,iy+4)}
if(n.hp<n.mhp)bar(n.x-15,n.y-(n.t=='tree'?62:26),30,n.hp,n.mhp,'#ddd')}
function en(e,t,pt){const x=e.x,y=e.y+Math.sin(t*6+e.x)*1.5,r=e.r;
if(e.boss){glow(x,y,r*3.2,e.c,.45+Math.sin(t*4)*.12)}
switch(e.type){
case 'slime':{g.save();g.translate(x,y);const q=1+Math.sin(t*5+e.x)*.1;g.scale(1.12*q,1/q);ball(0,0,r,e.c);g.restore();eyes(x,y,r,pt.x,pt.y);break}
case 'bat':{const fl=Math.sin(t*22+e.x)*.6;g.fillStyle='#4a2f78';[-1,1].forEach(s=>{g.beginPath();g.moveTo(x,y);g.lineTo(x+s*r*2.2,y-r*(1+fl));g.lineTo(x+s*r*1.6,y+r*.5);g.lineTo(x+s*r*.8,y+r*.2);g.fill()});ball(x,y,r,e.c);eyes(x,y,r,pt.x,pt.y,'#fcc');break}
case 'archer':{ball(x,y,r,e.c);g.fillStyle='#6b4a1f';g.beginPath();g.arc(x,y-r*.1,r,Math.PI,0);g.fill();eyes(x,y,r*.9,pt.x,pt.y);const a=Math.atan2(pt.y-y,pt.x-x);g.strokeStyle='#8a5a2b';g.lineWidth=2.5;g.beginPath();g.arc(x,y,r+5,a-1,a+1);g.stroke();break}
case 'skel':{ball(x,y,r,e.c);g.fillStyle='#111';[-1,1].forEach(s=>{g.beginPath();g.arc(x+s*r*.38,y-r*.15,r*.24,0,7);g.fill()});g.fillRect(x-1,y+r*.1,2,r*.2);g.fillRect(x-r*.4,y+r*.5,r*.8,2);g.fillStyle='#e8e2c8';g.fillRect(x-r*.1,y+r*.6,2,4);g.fillRect(x+r*.15,y+r*.6,2,4);break}
case 'mage':{ball(x,y,r,e.c);g.fillStyle='#4a2a8a';g.beginPath();g.moveTo(x-r*1.1,y-r*.4);g.lineTo(x+r*1.1,y-r*.4);g.lineTo(x+2,y-r*2.2);g.fill();g.fillStyle='#ffd54a';g.fillRect(x-1,y-r*1.2,3,3);eyes(x,y+2,r*.9,pt.x,pt.y);glow(x+r*1.3,y,14,'#ff7ad0',.9);break}
case 'zombie':{const a=Math.atan2(pt.y-y,pt.x-x),rs=e.ri>0,sw=Math.sin(t*4+e.x)*.25;if(rs){g.fillStyle='#5a4128';g.beginPath();g.ellipse(x,y+r*.7,r*1.3,r*.55,0,0,7);g.fill();g.globalAlpha=.6}
g.strokeStyle='#6f9150';g.lineWidth=4.5;g.lineCap='round';[-1,1].forEach(s=>{g.beginPath();g.moveTo(x+Math.cos(a+s*1.4)*r*.7,y+Math.sin(a+s*1.4)*r*.7);g.lineTo(x+Math.cos(a+s*.35+sw)*r*1.9,y+Math.sin(a+s*.35+sw)*r*1.9);g.stroke()});g.lineCap='butt';
ball(x,y,r,e.hp<e.mhp*.3?'#a5c36a':'#7fa35a');g.fillStyle='#3d4a5e';g.beginPath();g.arc(x,y+r*.25,r*.95,.15,Math.PI-.15);g.fill();
g.fillStyle='#e8f0c8';g.beginPath();g.arc(x-r*.35,y-r*.2,r*.22,0,7);g.fill();g.fillStyle='#111';g.beginPath();g.arc(x-r*.35+Math.cos(a)*2,y-r*.2+Math.sin(a)*2,r*.1,0,7);g.fill();g.beginPath();g.arc(x+r*.38,y-r*.15,r*.15,0,7);g.fill();
g.strokeStyle='#2a3318';g.lineWidth=1.5;g.beginPath();g.moveTo(x-r*.4,y+r*.15);g.lineTo(x+r*.4,y+r*.2);g.stroke();for(let i=-1;i<=1;i++){g.beginPath();g.moveTo(x+i*r*.2,y+r*.1);g.lineTo(x+i*r*.2,y+r*.3);g.stroke()}
g.globalAlpha=1;break}
case 'orc':{ball(x,y,r,e.c);g.fillStyle='#fff';[-1,1].forEach(s=>{g.beginPath();g.moveTo(x+s*r*.4,y+r*.3);g.lineTo(x+s*r*.6,y+r*.3);g.lineTo(x+s*r*.5,y-r*.15);g.fill()});eyes(x,y,r,pt.x,pt.y,'#ffe066');g.strokeStyle='#1a2a0a';g.lineWidth=2.5;g.beginPath();g.moveTo(x-r*.7,y-r*.65);g.lineTo(x-r*.15,y-r*.35);g.moveTo(x+r*.7,y-r*.65);g.lineTo(x+r*.15,y-r*.35);g.stroke();break}
default:{ball(x,y,r,e.c);eyes(x,y,r,pt.x,pt.y,'#ffb0b0');g.strokeStyle='#220';g.lineWidth=3;g.beginPath();g.moveTo(x-r*.7,y-r*.7);g.lineTo(x-r*.15,y-r*.4);g.moveTo(x+r*.7,y-r*.7);g.lineTo(x+r*.15,y-r*.4);g.stroke();
g.fillStyle='#ffd54a';g.strokeStyle='#a87a00';g.lineWidth=1.5;g.beginPath();g.moveTo(x-r*.5,y-r*.9);g.lineTo(x-r*.5,y-r*1.5);g.lineTo(x-r*.25,y-r*1.15);g.lineTo(x,y-r*1.6);g.lineTo(x+r*.25,y-r*1.15);g.lineTo(x+r*.5,y-r*1.5);g.lineTo(x+r*.5,y-r*.9);g.closePath();g.fill();g.stroke()}}
if(e.f>0){g.fillStyle='rgba(255,255,255,.7)';g.beginPath();g.arc(x,y,r,0,7);g.fill()}
if(e.tl&&Math.floor(t*12)%2){g.fillStyle='rgba(255,40,40,.5)';g.beginPath();g.arc(x,y,r*1.1,0,7);g.fill()}
if(!e.boss)bar(x-r,y-r-10,r*2,e.hp,e.mhp,'#e55')}
function pl(p,t){const col=CT[p.i].col;if(p.dead){g.fillStyle='rgba(0,0,0,.3)';g.beginPath();g.ellipse(p.x,p.y+10,14,5,0,0,7);g.fill();g.fillStyle='#8b919c';rrect(p.x-9,p.y-14,18,24,8);g.fill();g.fillStyle='#4b505a';g.fillRect(p.x-1.5,p.y-10,3,12);g.fillRect(p.x-5,p.y-6,10,3);return}
if(p.inv>0&&Math.floor(t*16)%2)g.globalAlpha=.4;
const a0=Math.atan2(p.fy,p.fx),sw=p.ac>0?1-p.ac/.35:-1;
ball(p.x,p.y,13,col);g.fillStyle='#f1c9a0';g.beginPath();g.arc(p.x,p.y-10,8,0,7);g.fill();g.fillStyle=col;g.beginPath();g.arc(p.x,p.y-12,8.5,Math.PI,0);g.fill();
g.fillStyle='#222';[-1,1].forEach(s=>{g.beginPath();g.arc(p.x+s*2.8+p.fx*2,p.y-9+p.fy*1.5,1.3,0,7);g.fill()});acc(p,t);
if(p.w){p.w>2?tool(p,a0,sw):wpn(p,a0)}else{const an=sw>=0?a0-1.3+sw*2.6:a0+.9,sx=p.x,sy=p.y+2;
if(sw>=0){g.strokeStyle='rgba(255,255,255,.45)';g.lineWidth=6;g.beginPath();g.arc(sx,sy,32,a0-1.3,an);g.stroke()}
g.lineCap='round';g.strokeStyle='#5a3b1e';g.lineWidth=5;g.beginPath();g.moveTo(sx+Math.cos(an)*8,sy+Math.sin(an)*8);g.lineTo(sx+Math.cos(an)*13,sy+Math.sin(an)*13);g.stroke();
g.strokeStyle='#d5dbe6';g.lineWidth=5;g.beginPath();g.moveTo(sx+Math.cos(an)*14,sy+Math.sin(an)*14);g.lineTo(sx+Math.cos(an)*40,sy+Math.sin(an)*40);g.stroke();
g.strokeStyle='#fff';g.lineWidth=1.5;g.beginPath();g.moveTo(sx+Math.cos(an)*14,sy+Math.sin(an)*14);g.lineTo(sx+Math.cos(an)*40,sy+Math.sin(an)*40);g.stroke();g.lineCap='butt'}
g.globalAlpha=1;bar(p.x-16,p.y-28,32,p.hp,p.mhp,'#4f4');g.font='11px sans-serif';g.textAlign='center';g.fillStyle='#fff';g.fillText(CLS[p.cl|0].e,p.x,p.y-33)}
function draw(){if(!bgc)makeBG();const t=TIME(),pt=P.find(p=>!p.dead)||P[0];
g.clearRect(0,0,W,H);drawWorldTerrain();g.save();g.translate(-cam.x,-cam.y);ground(t);
D.forEach(o=>{if(o.t==='shard')return;const b=Math.sin(t*5+o.x)*2,y=o.y+b;g.fillStyle='rgba(0,0,0,.25)';g.beginPath();g.ellipse(o.x,o.y+6,5,2,0,0,7);g.fill();
const c={gold:'#ffd54a',wood:'#a0702e',ore:'#7ec8e3',hp:'#ff4d6d',shard:'#cba0ff'}[o.t];glow(o.x,y,16,c,.55);g.fillStyle=c;
if(o.t=='gold'){g.beginPath();g.arc(o.x,y,5.5,0,7);g.fill();g.strokeStyle='#a87a00';g.lineWidth=1.5;g.stroke();g.fillStyle='#fff8';g.fillRect(o.x-2,y-3,2,4)}
else if(o.t=='ore'){g.beginPath();g.moveTo(o.x,y-8);g.lineTo(o.x+6,y);g.lineTo(o.x,y+7);g.lineTo(o.x-6,y);g.fill();g.fillStyle='#fff9';g.fillRect(o.x-1,y-5,2,4)}
else if(o.t=='wood'){g.save();g.translate(o.x,y);g.rotate(-.5);g.fillRect(-8,-3,16,6);g.fillStyle='#d9a566';g.beginPath();g.arc(8,0,3,0,7);g.fill();g.restore()}
else{g.beginPath();g.arc(o.x-3.5,y-2,4,0,7);g.arc(o.x+3.5,y-2,4,0,7);g.fill();g.beginPath();g.moveTo(o.x-7.5,y);g.lineTo(o.x,y+8);g.lineTo(o.x+7.5,y);g.fill()}});
const L=[];visibleNodes().forEach(n=>{if(n.rs<=0)L.push([n.y,()=>nd(n,t)])});E.filter(e=>onScreen(e,100)).forEach(e=>L.push([e.y,()=>en(e,t,pt)]));P.forEach(p=>L.push([p.y,()=>pl(p,t)]));
L.sort((a,b)=>a[0]-b[0]).forEach(l=>l[1]());
drawA(t);g.globalCompositeOperation='lighter';S.forEach(s=>glow(s.x,s.y,s.r*3.5,s.c,.8));g.globalCompositeOperation='source-over';
S.forEach(s=>{g.fillStyle=s.c;g.beginPath();g.arc(s.x,s.y,s.r,0,7);g.fill();g.fillStyle='#fff';g.beginPath();g.arc(s.x,s.y,s.r*.45,0,7);g.fill()});
F.forEach(f=>{const k=f.t/f.m;g.globalAlpha=k;g.strokeStyle=f.c;g.lineWidth=5*k+1;g.beginPath();g.arc(f.x,f.y,f.r*(1.25-k*.35),0,7);g.stroke();g.globalAlpha=k*.25;g.fillStyle=f.c;g.fill();g.globalAlpha=1});
g.font='bold 15px sans-serif';g.textAlign='center';g.lineJoin='round';T.forEach(q=>{g.globalAlpha=Math.min(1,q.t*2);g.strokeStyle='#000';g.lineWidth=3.5;g.strokeText(q.s,q.x,q.y);g.fillStyle=q.c;g.fillText(q.s,q.x,q.y)});g.globalAlpha=1;
drawFX(t);g.restore();light(t);
const vg=g.createRadialGradient(W/2,H/2,H*.45,W/2,H/2,H*.95);vg.addColorStop(0,'rgba(0,0,0,0)');vg.addColorStop(1,'rgba(5,8,20,.5)');g.fillStyle=vg;g.fillRect(0,0,W,H);hud()}
function hud(){P.forEach((p,i)=>{const w=256,x=10+i*270,y=10,col=CT[p.i].col;g.fillStyle='rgba(12,16,28,.8)';rrect(x,y,w,98,12);g.fill();g.strokeStyle=col;g.lineWidth=2;g.stroke();
g.fillStyle=col;g.beginPath();g.arc(x+24,y+26,16,0,7);g.fill();g.fillStyle='#fff';g.font='bold 14px sans-serif';g.textAlign='center';g.fillText(p.lvl,x+24,y+31);
g.font='bold 12px sans-serif';g.textAlign='left';g.fillStyle='#fff';g.fillText(CT[p.i].n+(p.pts?'  ★ '+p.pts+' очк. — T':''),x+48,y+17);
bar2(x+48,y+22,198,12,p.hp,p.mhp,'#c0262d','#ff7b7b',Math.ceil(p.hp)+' / '+p.mhp);bar2(x+48,y+37,198,9,p.xp,p.nx,'#1d5fd1','#7fb4ff');
g.textAlign='left';g.font='12px sans-serif';g.fillStyle='#ffe9a0';g.fillText('🪙 '+p.gold+'   🪵 '+p.wood+'   ⛏ '+p.ore+'   ⚔ '+Math.round(dmgOf(p)),x+10,y+64);
[['💨',p.up.dash],['💥',p.up.nova],['✚',p.up.heal]].forEach((s,k)=>{const sx=x+10+k*48,sy=y+70;g.fillStyle=s[1]?'#26304a':'#15181f';rrect(sx,sy,42,22,6);g.fill();g.strokeStyle=s[1]?'#f5b942':'#333';g.lineWidth=1.5;g.stroke();
g.textAlign='left';g.font='12px sans-serif';g.fillStyle='#fff';g.fillText(s[1]?s[0]:'🔒',sx+5,sy+16);g.font='bold 10px sans-serif';g.fillStyle='#f5b942';g.fillText(CT[p.i].s[k].replace('Key',''),sx+27,sy+15);
if(s[1]&&p.cd[k]>0){g.fillStyle='rgba(0,0,0,.65)';rrect(sx,sy,42,22,6);g.fill();g.fillStyle='#fff';g.font='bold 12px sans-serif';g.textAlign='center';g.fillText(Math.ceil(p.cd[k]),sx+21,sy+16)}})});
g.textAlign='center';g.lineJoin='round';g.font='bold 18px sans-serif';g.strokeStyle='#000';g.lineWidth=4;g.strokeText('Волна '+wave+' · врагов: '+E.length,W/2,P.length>1?146:24);g.fillStyle='#fff';g.fillText('Волна '+wave+' · врагов: '+E.length,W/2,P.length>1?146:24);
const b=E.find(e=>e.boss);if(b){g.fillStyle='rgba(12,16,28,.85)';rrect(W/2-190,P.length>1?156:34,380,30,10);g.fill();g.strokeStyle='#ffd54a';g.lineWidth=2;g.stroke();bar2(W/2-180,P.length>1?172:50,360,10,b.hp,b.mhp,'#a01515','#ff5a5a');g.fillStyle='#ffd54a';g.font='bold 13px sans-serif';g.fillText('👑 '+b.name,W/2,P.length>1?169:47)}
if(ban.t>0){g.globalAlpha=Math.min(1,ban.t);g.font='bold 34px sans-serif';g.strokeStyle='#000';g.lineWidth=6;g.strokeText(ban.s,W/2,H/2-100);g.fillStyle='#ffd54a';g.fillText(ban.s,W/2,H/2-100);g.globalAlpha=1}}
/* === Лук и магический посох === */
let A=[];
addEventListener('keydown',e=>{if(e.target.matches('input,textarea,select'))return;if(state!='play'||e.repeat)return;P.forEach(p=>{if(!p.dead&&e.code==(p.i?'KeyU':'KeyC')&&(!NET||(NET=='host'&&!p.i))){p.w=nextW(p);txt(p.x,p.y-34,WN[p.w],'#fff')}})});
function wpn(p,a0){const c=Math.cos(a0),s=Math.sin(a0);g.lineCap='round';
if(p.w==1){const cx=p.x+c*6,cy=p.y+2+s*6,rd=p.ac<=0;g.strokeStyle='#8a5a2b';g.lineWidth=4;g.beginPath();g.arc(cx,cy,15,a0-1.15,a0+1.15);g.stroke();
g.strokeStyle='#eee';g.lineWidth=1;g.beginPath();g.moveTo(cx+Math.cos(a0-1.15)*15,cy+Math.sin(a0-1.15)*15);g.lineTo(cx-c*(rd?6:0),cy-s*(rd?6:0));g.lineTo(cx+Math.cos(a0+1.15)*15,cy+Math.sin(a0+1.15)*15);g.stroke();
if(rd){g.strokeStyle='#d9b27a';g.lineWidth=2;g.beginPath();g.moveTo(cx-c*6,cy-s*6);g.lineTo(cx+c*24,cy+s*24);g.stroke();g.fillStyle='#cfd6e0';g.beginPath();g.arc(cx+c*24,cy+s*24,2.5,0,7);g.fill()}}
else{const an=a0-.4,bx=p.x+Math.cos(a0+1.3)*9,by=p.y+4+Math.sin(a0+1.3)*9,tx=bx+Math.cos(an)*40,ty=by+Math.sin(an)*40,k=p.ac>0?1.7:1;
g.strokeStyle='#5a3b1e';g.lineWidth=4.5;g.beginPath();g.moveTo(bx-Math.cos(an)*8,by-Math.sin(an)*8);g.lineTo(tx,ty);g.stroke();g.strokeStyle='#9a6b36';g.lineWidth=1.5;g.beginPath();g.moveTo(bx,by);g.lineTo(tx,ty);g.stroke();
g.globalCompositeOperation='lighter';glow(tx,ty,26*k,'#a855ff',.9);g.globalCompositeOperation='source-over';g.fillStyle='#d8b4fe';g.beginPath();g.arc(tx,ty,5*k,0,7);g.fill();g.fillStyle='#fff';g.beginPath();g.arc(tx-1,ty-1,2,0,7);g.fill()}g.lineCap='butt'}
function drawA(t){A.forEach(a=>{const an=Math.atan2(a.vy,a.vx);
if(a.t=='arrow'){g.save();g.translate(a.x,a.y);g.rotate(an);g.strokeStyle='#d9b27a';g.lineWidth=2.5;g.beginPath();g.moveTo(-16,0);g.lineTo(8,0);g.stroke();g.fillStyle='#cfd6e0';g.beginPath();g.moveTo(15,0);g.lineTo(6,-4);g.lineTo(6,4);g.fill();g.fillStyle='#e55';g.beginPath();g.moveTo(-16,0);g.lineTo(-21,-4);g.lineTo(-12,0);g.lineTo(-21,4);g.fill();g.restore();glow(a.x,a.y,14,'#ffe9a0',.35)}
else{g.globalCompositeOperation='lighter';glow(a.x,a.y,36,'#a855ff',.85);g.globalCompositeOperation='source-over';g.fillStyle='#e9d5ff';g.beginPath();g.arc(a.x,a.y,6+Math.sin(t*20),0,7);g.fill();g.fillStyle='#fff';g.beginPath();g.arc(a.x,a.y,3,0,7);g.fill();
for(let i=0;i<3;i++){const q=t*8+i*2.1;g.fillStyle='#d8b4fe';g.beginPath();g.arc(a.x+Math.cos(q)*11,a.y+Math.sin(q)*11,2,0,7);g.fill()}}})}
const upd0=upd;
upd=function(dt){upd0(dt);if(state!='play')return;
P.forEach(p=>{if(p.dead||!(p.w>0&&p.w<3)||!pkey(p,CT[p.i].a,4)||p.ac>0)return;const x=p.x+p.fx*22,y=p.y-14+p.fy*22,d=dmgOf(p);
if(p.w==1){p.ac=p.cl==1?.32:.45;A.push({x,y,vx:p.fx*560,vy:p.fy*560,d:d*.95,t:'arrow',l:1.1,p,r:5,pc:arrowPierce(p),h:[]})}
else{p.ac=.75;A.push({x,y,vx:p.fx*300,vy:p.fy*300,d:d*1.15,t:'orb',l:1.8,p,r:8})}});
A.slice().forEach(a=>{a.l-=dt;
if(a.t=='orb'){let b=null,bd=320;E.forEach(e=>{const q=Math.hypot(e.x-a.x,e.y-a.y);if(q<bd){bd=q;b=e}});
if(b){const sp=Math.hypot(a.vx,a.vy),ca=Math.atan2(a.vy,a.vx);let df=Math.atan2(b.y-a.y,b.x-a.x)-ca;while(df>Math.PI)df-=6.283;while(df<-Math.PI)df+=6.283;const na=ca+cl(df,-1,1)*dt*4;a.vx=Math.cos(na)*sp;a.vy=Math.sin(na)*sp}}
a.x+=a.vx*dt;a.y+=a.vy*dt;let rm=a.l<=0||a.x<0||a.y<0||a.x>WW||a.y>WH;
if(!rm)for(const e of E.slice()){if(Math.hypot(e.x-a.x,e.y-a.y)<e.r+a.r){
if(a.t=='arrow'){if(a.h.includes(e))continue;a.h.push(e);hit(e,a.d,a.p);if(--a.pc<=0){rm=1;break}}
else{fxr(a.x,a.y,70,a.p.cl==3?'#6dff9a':'#a855ff');if(a.p.cl==3)P.forEach(q=>{if(!q.dead&&Math.hypot(q.x-a.x,q.y-a.y)<90){q.hp=Math.min(q.mhp,q.hp+(6+Math.min(a.p.lvl,30)*.5)*(1+(a.p.up.devotion||0)*.08));txt(q.x,q.y-24,'+','#6dff9a')}});E.slice().forEach(q=>{if(Math.hypot(q.x-a.x,q.y-a.y)<(a.p.cl==2?85:62)+q.r)hit(q,a.d,a.p)});rm=1;break}}}
if(rm)A.splice(A.indexOf(a),1)})};
const hud0=hud;
hud=function(){hud0();P.forEach((p,i)=>{const x=10+i*270,y=10,w=p.w|0;g.fillStyle='#26304a';rrect(x+154,y+70,92,22,6);g.fill();g.strokeStyle='#f5b942';g.lineWidth=1.5;g.stroke();
g.textAlign='left';g.font='bold 11px sans-serif';g.fillStyle='#fff';g.fillText(WN[w]+' ['+((NET=='guest'||!i)?'C':'U')+']',x+159,y+85)})};
/* === Топор, кирка, сетевая игра (WebRTC) === */
const WN=['⚔ Меч','🏹 Лук','🔮 Посох','🪓 Топор','⛏ Кирка'];
let NET=0,ME=0,NET_SLOT=1,dc=null,pc=null,RK={},role='',sn=0;
function pkey(p,key,index){if(NET=='host'&&p.i>0)return !!((RK[p.i]||[])[index]);return !!K[key]}
function tool(p,a0,sw){const an=sw>=0?a0-1.3+sw*2.6:a0+.9,sx=p.x,sy=p.y+2,c=Math.cos(an),s=Math.sin(an),tx=sx+c*38,ty=sy+s*38,px=-s,py=c;g.lineCap='round';
if(sw>=0){g.strokeStyle='rgba(255,255,255,.4)';g.lineWidth=6;g.beginPath();g.arc(sx,sy,32,a0-1.3,an);g.stroke()}
g.strokeStyle='#6b4a1f';g.lineWidth=4;g.beginPath();g.moveTo(sx+c*6,sy+s*6);g.lineTo(tx,ty);g.stroke();
if(p.w==3){g.fillStyle='#cfd6e0';g.strokeStyle='#5b6370';g.lineWidth=1.5;g.beginPath();g.moveTo(tx-c*4,ty-s*4);g.lineTo(tx+px*15+c*4,ty+py*15+s*4);g.lineTo(tx+px*11+c*11,ty+py*11+s*11);g.lineTo(tx+c*6,ty+s*6);g.closePath();g.fill();g.stroke()}
else{g.strokeStyle='#aab3c2';g.lineWidth=4;g.beginPath();g.moveTo(tx+px*15-c*6,ty+py*15-s*6);g.quadraticCurveTo(tx+c*9,ty+s*9,tx-px*15-c*6,ty-py*15-s*6);g.stroke();g.strokeStyle='#fff';g.lineWidth=1;g.stroke()}g.lineCap='butt'}
const snd=o=>{if(NET=='guest')o.slot=ME;if(dc&&dc.readyState=='open')dc.send(JSON.stringify(o))};
const nst=s=>{$('nst').textContent=s;$('nst').scrollIntoView({block:'nearest'})};
function netMenu(){hide('menu');show('net')}function netBack(){try{if(dc)dc.close();if(pc)pc.close()}catch(e){}NET=0;role='';hide('net');show('menu')}
function cpy(){const t=$('ncode');t.select();try{navigator.clipboard.writeText(t.value)}catch(e){document.execCommand('copy')}}
function mkpc(){try{if(pc){pc.onconnectionstatechange=null;pc.close()}}catch(e){};dc=null;pc=new RTCPeerConnection({iceServers:[{urls:'stun:stun.l.google.com:19302'}]});pc.onconnectionstatechange=()=>{if(pc&&(pc.connectionState=='failed'||pc.connectionState=='closed'))lost()}}
function gather(){return new Promise(r=>{if(pc.iceGatheringState=='complete')return r();const t=setTimeout(r,3000);pc.addEventListener('icegatheringstatechange',()=>{if(pc.iceGatheringState=='complete'){clearTimeout(t);r()}})})}
function lost(){if(!NET)return;const g0=NET;NET=0;if(g0=='guest'){state='over';$('ovs').textContent='Соединение потеряно';show('over')}else{RK=[];P.length=1;coop=0;ban={t:3,s:'Игрок отключился'};try{dc&&dc.close();pc&&pc.close()}catch(e){}}}
function wire(ch){dc=ch;ch.onopen=()=>{hide('net');hide('menu');if(role=='host'){NET='host';ME=0;start(1)}else{NET='guest';ME=NET_SLOT;for(const k in K)K[k]=0;start(1);Object.assign(CT[1],{u:CT[0].u,d:CT[0].d,l:CT[0].l,r:CT[0].r,a:CT[0].a,s:CT[0].s})}};
ch.onclose=lost;ch.onmessage=e=>{
 let m;try{m=JSON.parse(e.data)}catch(err){return}
 if(role!='host'){applySnap(m);return}
 const slot=Math.max(1,Math.min(2,Number(m.slot)||1));
 // A guest may send input as soon as the socket opens; create its slot before processing any action.
 if(!P[slot]){P[slot]=mk(slot);P[slot].i=slot;coop=1}
 const p=P[slot];
 if(m.t=='p'){snd({pg:m.s});return}
 if(m.t=='k'){
   recordRemoteInput(slot,Array.from({length:8},(_,i)=>m.b&&m.b[i]?1:0),m.m);
   p.aim=Array.isArray(m.m)&&m.m.length>=2?m.m:null;
   lastK[slot]=performance.now();
 }else if(m.t=='q'){invAct(slot,m.a|0,m.k|0)}else if(m.t=='g'){gearBuy(slot,m.s|0)}else if(m.t=='f'){buff(slot,m.b)}else if(m.t=='c'){setCls(slot,m.k|0)}else if(m.t=='s'){shop(slot,m.k)}else if(m.t=='w'){if(!p.dead){p.w=nextW(p);txt(p.x,p.y-34,WN[p.w],'#fff')}}
 else if(m.t=='u'){const u=UP.find(x=>x[0]==m.k);if(u&&p.pts>0&&p.up[m.k]<u[3]&&(!u[4]||p.up[u[4]]>=u[5]))upg(slot,m.k)}
 else if(m.t=='b'){const n=p.wp+1;if(m.w=='pot'&&p.gold>=25)buy(slot,'pot');else if(m.w=='forge'&&p.ore>=4*n&&p.wood>=3*n&&p.gold>=15*n)buy(slot,'forge')}
}}
async function netHost(){try{if(!window.RTCPeerConnection){nst('WebRTC недоступен в этом окне. Нажмите «Создать комнату».');return}nst('Создаю соединение…');$('ncode').value='';role='host';mkpc();wire(pc.createDataChannel('g'));await pc.setLocalDescription(await pc.createOffer());nst('Собираю код…');await gather();$('ncode').value=await enc(JSON.stringify(pc.localDescription));autoCopy();nst('1) Отправьте этот код гостю. 2) Вставьте его ответ ниже и нажмите «Подключить».')}catch(e){nst('Ошибка: '+e.message)}}
function netJoin(){role='guest';mkpc();pc.ondatachannel=e=>wire(e.channel);$('ncode').value='';nst('Вставьте код хозяина в поле ниже и нажмите «Подключить».')}
async function netApply(){try{if(!role)return;const d=JSON.parse(await dec($('nin').value));await pc.setRemoteDescription(d);
if(role=='host')nst('Подключаемся…');else{await pc.setLocalDescription(await pc.createAnswer());nst('Собираю ответ…');await gather();$('ncode').value=await enc(JSON.stringify(pc.localDescription));autoCopy();nst('Отправьте этот код хозяину и ждите подключения.')}}catch(e){nst('Ошибка: '+e.message)}}
function snap(){const r=Math.round;FEX=0;return JSON.stringify({q:++SQ,
// Legacy snapshot shape; the world adapter removes nodes and sends server-owned resource patches separately.
ex:P.map(p=>[p.bt||{},p.eq||{},p.bag||[]]),qs:[QS.k,QS.g],w:wave,wt:wt,st:state,b:[ban.t,ban.s],
p:P.map(p=>[r(p.x),r(p.y),p.hp,p.mhp,p.xp,p.nx,p.lvl,p.pts,p.gold,p.wood,p.ore,p.wp,p.fx,p.fy,p.ac,p.cd,p.inv,p.dead,p.w|0,p.up,p.cl|0,p.wl||[0,0,0,0,0],p.asu|0,p.g||{},p.bf||{}]),
e:E.map(e=>[e.type,r(e.x),r(e.y),r(e.hp),r(e.mhp),e.r,e.c,e.boss?1:0,e.bi,e.name,e.f,e.tl,e.id||(e.id=++EID),e.ri>0?1:0]),
s:S.map(s=>[r(s.x),r(s.y),s.r,s.c]),a:A.map(a=>[r(a.x),r(a.y),r(a.vx),r(a.vy),a.t]),
ch:CH.map(c=>[Math.round(c.x),Math.round(c.y),c.r]),d:D.map(o=>[r(o.x),r(o.y),o.t,o.v]),
n:N.map(n=>[n.t,n.x,n.y,n.hp,n.mhp,n.rs]),T:T.map(q=>[r(q.x),r(q.y),q.s,q.c,q.t]),
F:F.map(f=>[r(f.x),r(f.y),r(f.r),f.c,f.t,f.m])})}
function applySnap(m){
if(m.pg){rtt=Math.round(performance.now()-m.pg);return}
if(m.q){if(m.q<lastQ)return;lastQ=m.q}
lastSnap=performance.now();wave=m.w;wt=m.wt;
if(m.qs){QS.k=m.qs[0];QS.g=m.qs[1]}
if(m.ex)m.ex.forEach((q,i)=>{const p=P[i]||(P[i]=mk(i));p.i=i;p.bt=q[0]||{};p.eq=q[1]||{};p.bag=q[2]||[]});
ban.t=m.b?.[0]||0;ban.s=m.b?.[1]||'';
(m.p||[]).forEach((q,i)=>{
 const p=P[i]||(P[i]=mk(i));p.i=i;const ox=p.x,oy=p.y;
 [p.x,p.y,p.hp,p.mhp,p.xp,p.nx,p.lvl,p.pts,p.gold,p.wood,p.ore,p.wp,p.fx,p.fy,p.ac,p.cd,p.inv,p.dead,p.w,p.up,p.cl,p.wl,p.asu,p.g,p.bf]=q;
 p.tx=p.x;p.ty=p.y;
 // Keep the displayed position for interpolation, but never run a second local simulation.
 p.x=ox;p.y=oy;
 if(!Number.isFinite(p.x)||!Number.isFinite(p.y)){p.x=p.tx;p.y=p.ty}
 if(Math.hypot(p.tx-p.x,p.ty-p.y)>260){p.x=p.tx;p.y=p.ty}
});
{const old=new Map(E.map(o=>[o.id,o]));E=(m.e||[]).map(a=>{const o=old.get(a[12]),n={type:a[0],x:a[1],y:a[2],hp:a[3],mhp:a[4],r:a[5],c:a[6],boss:a[7],bi:a[8],name:a[9],f:a[10],tl:a[11],id:a[12],ri:a[13],tx:a[1],ty:a[2]};if(o&&Math.hypot(o.x-n.x,o.y-n.y)<260){n.x=o.x;n.y=o.y}return n})}
S=(m.s||[]).map(a=>({x:a[0],y:a[1],r:a[2],c:a[3]}));
A=(m.a||[]).map(a=>({x:a[0],y:a[1],vx:a[2],vy:a[3],t:a[4]}));
D=(m.d||[]).map(a=>({x:a[0],y:a[1],t:a[2],v:a[3]}));CH=(m.ch||[]).map(a=>({x:a[0],y:a[1],r:a[2]}));
if(m.n)N=m.n.map(a=>({t:a[0],x:a[1],y:a[2],hp:a[3],mhp:a[4],rs:a[5]}));
T=(m.T||[]).map(q=>({x:q[0],y:q[1],s:q[2],c:q[3],t:q[4]}));F=(m.F||[]).map(f=>({x:f[0],y:f[1],r:f[2],c:f[3],t:f[4],m:f[5]}));
if(m.st=='over'&&state!='over'){state='over';$('ovs').textContent='Дошли до волны '+wave+'. Ждём, пока хозяин перезапустит игру.';show('over')}
if(m.st=='play'&&state=='over'){state='play';hide('over')}
if($('tree').style.display=='flex')renderTree();if($('shop').style.display=='flex')renderShop();if($('inv').style.display=='flex')renderInv()
}
const NET_KEYS={u:'KeyW',d:'KeyS',l:'KeyA',r:'KeyD',a:'KeyF',s:['KeyQ','KeyE','KeyR']};
function sendGuestInput(){
 if(['tree','shop','inv','settings','pause','stats','about','victory','merchant','quickSale','saleConfirm','trade'].some(id=>document.getElementById(id)?.style.display==='flex')){for(const k in K)K[k]=0;MD=0;}
 if(NET!=='guest'||!dc||dc.readyState!=='open')return;
 const c=NET_KEYS;
 // Explicit 8-key packet: up, down, left, right, attack, skill 1, skill 2, skill 3.
 snd({t:'k',slot:ME,b:[c.u,c.d,c.l,c.r,c.a,...c.s].map(k=>K[k]?1:0),m:aimv()});
}
addEventListener('keydown',e=>{if(e.target.matches('input,textarea,select'))return;if(NET=='guest'&&e.code=='KeyC'&&!e.repeat)snd({t:'w'});if(NET=='guest')sendGuestInput()});
addEventListener('keyup',()=>{if(NET=='guest')sendGuestInput()});
// Keep sending the latest state so the host receives both presses and releases.
setInterval(sendGuestInput,50);
const upd2=upd;
upd=function(dt){mouseApply();if(NET=='guest'){
 if(state=='menu')return;
 if(lastSnap&&performance.now()-lastSnap>5000){lost();return}
 // Guests do not run a second copy of combat or predict their own movement. The host is authoritative.
 const sk=Math.min(1,dt*18);
 P.forEach(p=>{if(p.tx!=null&&p.ty!=null){const d=Math.hypot(p.tx-p.x,p.ty-p.y);if(d>260){p.x=p.tx;p.y=p.ty}else{p.x+=(p.tx-p.x)*sk;p.y+=(p.ty-p.y)*sk}}});
 E.forEach(e=>{if(e.tx!=null){e.x+=(e.tx-e.x)*sk;e.y+=(e.ty-e.y)*sk}});
 ban.t=Math.max(0,ban.t-dt);T.forEach(q=>{q.t-=dt;q.y-=25*dt});T=T.filter(q=>q.t>0);F.forEach(f=>f.t-=dt);F=F.filter(f=>f.t>0);
 const al=P.filter(p=>!p.dead);if(al.length){let cx=0,cy=0;al.forEach(p=>{cx+=p.x;cy+=p.y});cx/=al.length;cy/=al.length;cam.x=cl(cx-W/2,0,WW-W);cam.y=cl(cy-H/2,0,WH-H)}
 return
}
if(NET=='host'){for(let i=1;i<=2;i++){if(P[i]&&performance.now()-(lastK[i]||0)>1500)RK[i]=[]}}
upd2(dt);revive(dt);if(NET=='host'){sn-=dt;if(sn<=0){sn=.05;if(dc&&dc.readyState=='open')dc.send(snap())}}};
/* === Удар на ЛКМ === */
let MD=0,MX=0,MY=0,mouseKnown=false;C.style.cursor='crosshair';
function mpos(e){mouseKnown=true;const r=C.getBoundingClientRect();MX=(e.clientX-r.left)*W/r.width;MY=(e.clientY-r.top)*H/r.height}
function aimv(){const p=P[ME];if(!mouseKnown||!p||p.dead)return 0;return[MX+cam.x-p.x,MY+cam.y-p.y]}
function mouseApply(){if(MD)K[NET=='guest'?NET_KEYS.a:CT[0].a]=1;if(NET!='guest'&&P[0])P[0].aim=mouseKnown?aimv():null}
C.addEventListener('mousedown',e=>{if(e.button!=0)return;MD=1;mpos(e);e.preventDefault()});
addEventListener('mousemove',mpos);
addEventListener('mouseup',e=>{if(e.button==0&&MD){MD=0;K[CT[0].a]=0}});
addEventListener('blur',()=>{MD=0;K[CT[0].a]=0});
/* === Доработка LAN: сжатые коды, сглаживание, пинг, сторожевые таймеры, воскрешение === */
let EID=0,rtt=0,lastSnap=0,lastK={};
async function enc(s){try{const cs=new CompressionStream('deflate-raw'),w=cs.writable.getWriter();w.write(new TextEncoder().encode(s));w.close();const b=new Uint8Array(await new Response(cs.readable).arrayBuffer());let t='';b.forEach(x=>t+=String.fromCharCode(x));return 'Z'+btoa(t)}catch(e){return 'P'+btoa(s)}}
async function dec(c){c=c.trim();if(c[0]=='P')return atob(c.slice(1));const b=Uint8Array.from(atob(c.slice(1)),x=>x.charCodeAt(0)),ds=new DecompressionStream('deflate-raw'),w=ds.writable.getWriter();w.write(b);w.close();return await new Response(ds.readable).text()}
function autoCopy(){try{navigator.clipboard.writeText($('ncode').value)}catch(e){}}
function revive(dt){auras(dt);P.forEach(p=>{if(p.bf)for(const k in p.bf)if(p.bf[k]>0)p.bf[k]-=dt});P.forEach(p=>{if(!p.dead||p.offline)return;const a=P.find(q=>!q.dead&&Math.hypot(q.x-p.x,q.y-p.y)<50);p.rv=a?(p.rv||0)+dt:0;if(p.rv>3){p.dead=0;p.rv=0;p.hp=p.mhp*.5;p.inv=1.5;txt(p.x,p.y-30,'Воскрешён!','#7dffb0')}})}
setInterval(()=>{if(NET=='guest')snd({t:'p',s:performance.now()})},1000);
addEventListener('blur',()=>{for(const k in K)K[k]=0});
const hud1=hud;
hud=function(){hud1();if(!NET)return;const t=NET=='guest'?'● LAN: слот '+(ME+1)+' · '+rtt+' мс':('● LAN: хозяин · '+(P[1]?'игрок 2':'')+(P[2]?' и игрок 3':''));g.textAlign='left';g.font='bold 12px sans-serif';g.lineWidth=3;g.strokeStyle='#000';g.strokeText(t,12,H-12);g.fillStyle=NET=='guest'&&rtt>120?'#ffb84a':'#7dffb0';g.fillText(t,12,H-12)};
function netServer(){
let target=($('serverIp')?.value||'').trim();
if(!target)target=location.host;
target=target.replace(/^wss?:\/\//i,'').replace(/^https?:\/\//i,'').replace(/\/$/,'');
if(!target){nst('Введи IP и порт сервера, например 192.168.1.100:3000.');return}
try{if(dc&&dc.close)dc.close()}catch(e){}
NET=0;role='';nst('Подключаюсь к '+target+' …');
let ws;try{ws=new WebSocket((location.protocol=='https:'?'wss://':'ws://')+target)}catch(e){nst('Неверный адрес сервера: '+e.message);return}
const a={readyState:'connecting',send:s=>{if(ws.readyState===WebSocket.OPEN)ws.send(s)}};
ws.onmessage=e=>{let m;try{m=JSON.parse(e.data)}catch(x){return}
if(m.sys=='role'){role=m.r;NET_SLOT=m.slot||1;wire(a);nst(role=='host'?'Вы хозяин. Ожидаем игроков (до 3 всего)…':'Подключились к серверу. Ожидаем запуска хозяином…');return}
if(m.sys=='ready'){if(a.readyState!='open'){a.readyState='open';if(a.onopen)a.onopen()}return}
if(m.sys=='playerJoined'&&role=='host'){const i=m.slot|0;if(i>=1&&i<=2){if(!P[i]||P[i].dead)P[i]=mk(i);P[i].i=i;coop=1;ban={t:3,s:'Игрок '+(i+1)+' подключился!'};nst('Игрок '+(i+1)+' подключился.')}return}
if(m.sys=='playerLeft'&&role=='host'){const i=m.slot|0;if(P[i]){P[i].dead=1;RK[i]=[];ban={t:3,s:'Игрок '+(i+1)+' отключился'};}return}
if(m.sys=='gone'){if(role=='host'){nst('Игрок отключился.');return}a.readyState='closed';if(a.onclose)a.onclose();nst('Соединение с сервером потеряно.');return}
if(m.sys=='full'){nst('Сервер уже заполнен: максимум 3 игрока.');return}
if(a.onmessage)a.onmessage(e)};
ws.onerror=()=>nst('Не удалось подключиться. Проверь IP, порт 3000, firewall и что server.js запущен.');
ws.onclose=()=>{if(a.readyState=='open'){a.readyState='closed';if(a.onclose)a.onclose()}};
}
/* === Классы и магазин улучшений === */
const CLS=[{n:'Мечник',e:'⚔️',w:0,dm:1.25,hp:1,sp:1,d:'+25% урона, широкая дуга удара'},
{n:'Лучник',e:'🏹',w:1,dm:1.1,hp:.85,sp:1.15,d:'Быстрый; стрелы летят чаще и пробивают до 3 целей'},
{n:'Маг',e:'🔮',w:2,dm:1.4,hp:.75,sp:1,d:'+40% урона, шар взрывается по большой области'},
{n:'Хиллер',e:'💚',w:2,dm:.8,hp:.9,sp:1.05,d:'Аура лечения рядом, шары лечат союзников, исцеление ×1.5'},
{n:'Танк',e:'🛡️',w:0,dm:.9,hp:1.8,sp:.9,d:'+80% здоровья, получает на 30% меньше урона'}];
function nextW(p){const L=[CLS[p.cl|0].w,3,4],i=L.indexOf(p.w|0);return L[(i+1)%3]}
function setCls(i,k){if(NET=='guest'){snd({t:'c',k});return}const p=P[i];if(!p||!(k>=0&&k<5))return;p.cl=k;p.w=CLS[k].w;calc(p);p.hp=p.mhp;renderTree()}
function shop(i,k){if(NET=='guest'){snd({t:'s',k});return}const p=P[i];if(!p)return;
if(k=='wl'){const w=p.w|0;p.wl=p.wl||[0,0,0,0,0];const n=p.wl[w]+1;if(p.wl[w]<10&&p.gold>=20*n&&p.ore>=3*n&&p.wood>=2*n){p.gold-=20*n;p.ore-=3*n;p.wood-=2*n;p.wl[w]++}}
else if(k=='as'){const n=(p.asu|0)+1;if(n<=5&&p.gold>=40*n){p.gold-=40*n;p.asu=n}}renderTree()}
function clsHtml(p){const c=CLS[p.cl|0];let h='<div style="display:flex;flex-wrap:wrap;gap:4px;margin:4px 0">';CLS.forEach((q,k)=>{h+=`<button style="padding:3px 7px;margin:0;font-size:12px;${k==(p.cl|0)?'outline:2px solid #fff':'opacity:.8'}" onclick="setCls(${p.i},${k})">${q.e} ${q.n}</button>`});return h+`</div><small>${c.d}</small>`}
function shopHtml(p){const w=p.w|0,l=(p.wl&&p.wl[w])|0,n=l+1,a=(p.asu|0)+1;
return `<div class="row"><span><b>Заточка: ${WN[w]}</b> ${l}/10<br><small>+4 урона · ${20*n} 🪙 ${3*n} ⛏ ${2*n} 🪵</small></span><button ${l<10&&p.gold>=20*n&&p.ore>=3*n&&p.wood>=2*n?'':'disabled'} onclick="shop(${p.i},'wl')">Улучшить</button></div>`+
`<div class="row"><span><b>Скорость атаки</b> ${a-1}/5<br><small>+10% скорости · ${40*a} 🪙</small></span><button ${a<=5&&p.gold>=40*a?'':'disabled'} onclick="shop(${p.i},'as')">Купить</button></div>`}
function auras(dt){P.forEach(h=>{if(h.cl!=3||h.dead)return;h.at=(h.at||0)+dt;if(h.at<1)return;h.at=0;P.forEach(q=>{if(!q.dead&&q.hp<q.mhp&&Math.hypot(q.x-h.x,q.y-h.y)<170){const v=(2+h.lvl*.3)*(1+(h.up.devotion||0)*.08);q.hp=Math.min(q.mhp,q.hp+v);txt(q.x,q.y-24,'+'+Math.round(v),'#6dff9a')}})})}
const hud2=hud;
hud=function(){hud2();P.forEach((p,i)=>{const x=10+i*270;g.textAlign='right';g.font='13px sans-serif';g.fillStyle='#fff';g.fillText(CLS[p.cl|0].e,x+246,27)})};
addEventListener('keydown',e=>{if(e.target.matches('input,textarea,select'))return;if(e.code=='KeyN'&&state=='play'&&NET!='guest'&&!E.length&&wt>.5)wt=.3});
const hud3=hud;
hud=function(){hud3();if(!E.length&&wt>0&&state!='over'){g.textAlign='center';g.font='bold 22px sans-serif';g.lineJoin='round';g.lineWidth=5;g.strokeStyle='#000';const s='Перерыв: '+Math.ceil(wt)+' с'+(NET!='guest'?'  ·  N — пропустить':'');g.strokeText(s,W/2,H-30);g.fillStyle='#9fe870';g.fillText(s,W/2,H-30)}};
/* === Магазин снаряжения + графика: свет, частицы, светлячки, облик классов и экипировки === */
const GEAR=[{k:'helm',n:'Шлем',e:'⛑️',t:[{n:'Кожаный шлем',hp:20,c:50},{n:'Железный шлем',hp:50,c:150},{n:'Мифриловый шлем',hp:100,c:380}]},
{k:'armor',n:'Броня',e:'🥋',t:[{n:'Кожаная броня',ar:.08,c:70},{n:'Кольчуга',ar:.16,c:200},{n:'Латы',ar:.26,c:480}]},
{k:'boots',n:'Сапоги',e:'👢',t:[{n:'Лёгкие сапоги',sp:.06,c:50},{n:'Сапоги ветра',sp:.12,c:150},{n:'Сапоги бури',sp:.2,c:360}]},
{k:'amu',n:'Амулет',e:'📿',t:[{n:'Амулет силы',dm:.08,c:90},{n:'Амулет ярости',dm:.16,c:240},{n:'Амулет титана',dm:.26,c:560}]},
{k:'ring',n:'Кольцо',e:'💍',t:[{n:'Кольцо вампира',vp:.03,c:110},{n:'Кольцо крови',vp:.06,c:280},{n:'Кольцо тьмы',vp:.1,c:600}]}];
const BUFS=[{k:'dm',n:'Эликсир ярости',e:'🔥',d:'+50% урона',c:40},{k:'sp',n:'Эликсир ветра',e:'💨',d:'+30% скорости',c:30},{k:'sh',n:'Эликсир стали',e:'🛡️',d:'−30% получаемого урона',c:40},{k:'xp',n:'Эликсир мудрости',e:'📘',d:'×2 опыта',c:50}];
let gs=(p,k)=>{let s=0;if(p.eq)for(const z in p.eq){const it=p.eq[z];if(it&&it[k])s+=it[k]}return s};
let gd=t=>[t.hp&&'+'+t.hp+' HP',t.ar&&'−'+Math.round(t.ar*100)+'% урона',t.sp&&'+'+Math.round(t.sp*100)+'% скор.',t.dm&&'+'+Math.round(t.dm*100)+'% урона',t.vp&&'+'+Math.round(t.vp*100)+'% выносливости/с'].filter(Boolean).join(', ');
function gearBuy(i,si){if(NET=='guest'){snd({t:'g',s:si});return}const p=P[i],G=GEAR[si];if(!p||!G)return;p.bt=p.bt||{};const n=p.bt[G.k]|0,t=G.t[n];if(!t||p.gold<t.c)return;p.gold-=t.c;p.bt[G.k]=n+1;addItem(p,{s:G.k,n:t.n,r:Math.min(n,2),t:n+1,hp:t.hp,ar:t.ar,sp:t.sp,dm:t.dm,vp:t.vp});txt(p.x,p.y-30,t.n+' → инвентарь (V)','#ffd54a');renderShop()}
function buff(i,k){if(NET=='guest'){snd({t:'f',b:k});return}const p=P[i],B=BUFS.find(b=>b.k==k);if(!p||!B||p.gold<B.c)return;p.gold-=B.c;p.bf=p.bf||{};p.bf[k]=45;renderShop()}
function renderShop(){let h='<h2>🛒 Магазин снаряжения</h2><div class="cols">';
P.forEach(p=>{if(NET&&p.i!=ME)return;h+=`<div class='col'><h3 style='color:${CT[p.i].col}'>${CT[p.i].n}</h3><p>🪙 ${p.gold}</p>`;
GEAR.forEach((G,si)=>{const n=(p.bt&&p.bt[G.k])|0,t=G.t[n],cur=n?G.t[n-1]:null;h+=`<div class='row'><span><b>${G.e} ${G.n}</b>: ${cur?cur.n:'—'}<br><small>${t?t.n+': '+gd(t)+' · '+t.c+' 🪙':'максимум'}</small></span><button ${t&&p.gold>=t.c?'':'disabled'} onclick='gearBuy(${p.i},${si})'>${t?'Купить':'✓'}</button></div>`});
h+='<p style="margin:8px 0 2px"><b>Эликсиры (45 с)</b></p>';
BUFS.forEach(B=>{const l=(p.bf&&p.bf[B.k]>0)?Math.ceil(p.bf[B.k])+' с':'';h+=`<div class='row'><span><b>${B.e} ${B.n}</b> ${l}<br><small>${B.d} · ${B.c} 🪙</small></span><button ${p.gold>=B.c?'':'disabled'} onclick='buff(${p.i},"${B.k}")'>Купить</button></div>`});h+='</div>'});
{const markup=h+'</div><button onclick="togShop()">Закрыть (B / Esc)</button>';if($('shop').dataset.markup!==markup){$('shop').innerHTML=markup;$('shop').dataset.markup=markup;}}}
function togShop(){if($('shop').style.display=='flex'){if(!NET)state='play';hide('shop')}else{if($('tree').style.display=='flex'||$('inv').style.display=='flex')return;if(!NET)state='tree';renderShop();show('shop')}}
addEventListener('keydown',e=>{if(e.target.matches('input,textarea,select'))return;if(e.code=='KeyB'&&!e.repeat&&(state=='play'||state=='tree'))togShop();if(e.code=='Escape'&&$('shop').style.display=='flex')togShop()});
let PT=[],pt0=performance.now(),lc;
function burst(x,y,c,n){for(let i=0;i<n;i++){const a=R()*6.283,s=40+R()*140;PT.push({x,y,vx:Math.cos(a)*s,vy:Math.sin(a)*s-30,l:.5+R()*.4,m:.9,c,r:1.5+R()*2.5})}}
function drawFX(t){const n=performance.now(),dt=Math.min(.05,(n-pt0)/1000);pt0=n;PT=PT.filter(q=>q.l>0);
PT.forEach(q=>{q.l-=dt;q.x+=q.vx*dt;q.y+=q.vy*dt;q.vy+=260*dt;g.globalAlpha=Math.max(0,q.l/q.m);g.fillStyle=q.c;g.beginPath();g.arc(q.x,q.y,q.r,0,7);g.fill()});g.globalAlpha=1;
g.globalCompositeOperation='lighter';for(let i=0;i<90;i++){const x=rnd(i,21)*WW+Math.sin(t*.5+i)*40,y=rnd(i,22)*WH+Math.cos(t*.4+i*2)*30;if(x<cam.x-20||x>cam.x+W+20||y<cam.y-20||y>cam.y+H+20)continue;glow(x,y,10,'#d8ff7a',.35+.35*Math.sin(t*3+i*5))}g.globalCompositeOperation='source-over'}
function light(t){if(!lc){lc=document.createElement('canvas');lc.width=W;lc.height=H}const c=lc.getContext('2d'),d=.1+.3*(.5+.5*Math.sin(wave*.8+1.2));
c.globalCompositeOperation='source-over';c.clearRect(0,0,W,H);c.fillStyle='rgba(6,10,40,'+d+')';c.fillRect(0,0,W,H);c.globalCompositeOperation='destination-out';
const L=(x,y,r,a)=>{const q=c.createRadialGradient(x,y,0,x,y,r);q.addColorStop(0,'rgba(0,0,0,'+a+')');q.addColorStop(1,'rgba(0,0,0,0)');c.fillStyle=q;c.fillRect(x-r,y-r,r*2,r*2)};
P.forEach(p=>{if(!p.dead)L(p.x-cam.x,p.y-cam.y,210,1)});E.forEach(e=>{if(e.boss)L(e.x-cam.x,e.y-cam.y,170,.8)});S.forEach(s=>L(s.x-cam.x,s.y-cam.y,60,.6));A.forEach(a=>L(a.x-cam.x,a.y-cam.y,70,.7));
g.drawImage(lc,0,0);g.globalCompositeOperation='lighter';P.forEach(p=>{if(!p.dead)glow(p.x-cam.x,p.y-cam.y,170,'#ffcf7a',.1)});g.globalCompositeOperation='source-over'}
function acc(p,t){const x=p.x,y=p.y,c=p.cl|0,gh=p.g&&p.g.helm,ga=p.g&&p.g.armor,TC=['#8a5a2b','#aab3c2','#7fe0ff'];
if(ga){g.strokeStyle=TC[ga-1];g.lineWidth=3;g.beginPath();g.arc(x,y,10,.3,2.84);g.stroke()}
if(c==0){g.fillStyle='#d33';g.fillRect(x-8,y-13,16,3)}
else if(c==1){g.fillStyle='#2f7d3a';g.beginPath();g.arc(x,y-11,9.5,Math.PI,0);g.fill();g.fillStyle='#8a5a2b';g.fillRect(x-p.fx*11-2,y-p.fy*11-8,4,12)}
else if(c==2){g.fillStyle='#4a2a8a';g.beginPath();g.moveTo(x-10,y-14);g.lineTo(x+10,y-14);g.lineTo(x+2,y-32);g.fill();g.fillStyle='#ffd54a';g.fillRect(x-1,y-20,3,3)}
else if(c==3){g.strokeStyle='#ffe066';g.lineWidth=2;g.beginPath();g.ellipse(x,y-22+Math.sin(t*3)*1.5,8,3,0,0,7);g.stroke()}
else{g.fillStyle='#8a93a6';g.beginPath();g.arc(x,y-12,9,Math.PI,0);g.fill();const sx=x-p.fy*15,sy=y+2+p.fx*15;g.fillStyle='#6b7280';g.strokeStyle='#cbd5e1';g.lineWidth=1.5;g.beginPath();g.arc(sx,sy,8,0,7);g.fill();g.stroke();g.fillStyle='#e5484d';g.fillRect(sx-1,sy-5,2,10)}
if(gh){g.fillStyle=TC[gh-1];g.beginPath();g.arc(x,y-12,9,Math.PI,0);g.fill();g.fillRect(x-9,y-13,18,2)}}
const hud4=hud;
hud=function(){hud4();P.forEach((p,i)=>{if(!p.bf)return;const x=10+i*270;let k=0;BUFS.forEach(B=>{if(p.bf[B.k]>0){g.fillStyle='rgba(12,16,28,.8)';rrect(x+k*50,112,46,20,6);g.fill();g.font='12px sans-serif';g.textAlign='left';g.fillStyle='#fff';g.fillText(B.e+' '+Math.ceil(p.bf[B.k]),x+4+k*50,126);k++}})})};
/* === Комнаты (room), модели мобов, декор === */
let SQ=0,lastQ=0,KL='',KT=0,CID=0;
const dec2=async z=>z[0]=='R'?z.slice(1):await dec(z),enc2=async s=>s.length>600?await enc(s):'R'+s;
async function netRoom(mkr){try{const RM=await claude.use('room');if(!RM){nst('Сетевые комнаты недоступны на этой странице.');return}
const code=mkr?Math.random().toString(36).slice(2,6):$('nin').value.trim().toLowerCase();
if(!/^[a-z0-9]{4}$/.test(code)){nst('Введите 4-символьный код комнаты в нижнее поле.');return}
nst('Подключаюсь…');const rm=await RM.join('rpg-'+code);role=mkr?'host':'guest';lastQ=0;let hi=0;const CB={};
const a={readyState:'connecting',send:async s=>{const z=await enc2(s);if(z.length<=3900){rm.emit('m',z);return}const id=++CID,n=Math.ceil(z.length/3700);for(let i=0;i<n;i++)rm.emit('m','K'+id+'|'+i+'|'+n+'|'+z.slice(i*3700,(i+1)*3700))}};
const op=()=>{if(a.readyState=='open')return;a.readyState='open';clearInterval(hi);a.onopen&&a.onopen()};wire(a);
rm.on('m',async msg=>{if(msg.sameTab)return;let z=msg.data;if(typeof z!='string')return;
if(z=='Hhello'){if(role=='host'){rm.emit('m','Hready');op()}return}
if(z=='Hready'){if(role=='guest')op();return}
const c=/^K(\d+)\|(\d+)\|(\d+)\|/.exec(z);
if(c){const id=c[1],b=CB[id]||(CB[id]={n:+c[3],p:[],c:0});if(b.p[+c[2]]==null){b.p[+c[2]]=z.slice(c[0].length);b.c++}if(b.c<b.n)return;delete CB[id];z=b.p.join('')}
try{a.onmessage&&a.onmessage({data:await dec2(z)})}catch(e){}});
if(mkr)nst('Код комнаты: '+code.toUpperCase()+'. Скажите его другу: он нажмёт «Войти по коду» и введёт код.');
else{nst('Ищу хозяина комнаты…');hi=setInterval(()=>rm.emit('m','Hhello'),1000)}
}catch(e){nst('Ошибка: '+(e.message||e.code||e))}}
const en0=en;
function mob2(e,t,pt){const x=e.x,y=e.y+Math.sin(t*6+e.x)*1.5,r=e.r,a=Math.atan2(pt.y-y,pt.x-x),c=Math.cos(a),s=Math.sin(a);
g.fillStyle='rgba(0,0,0,.28)';g.beginPath();g.ellipse(x,y+r*.85,r,r*.38,0,0,7);g.fill();
if(e.type=='slime'){const q=1+Math.sin(t*5+e.x)*.1;g.save();g.translate(x,y+r*.25);g.scale(1.15*q,.9/q);const gr=g.createRadialGradient(-r*.3,-r*.5,r*.1,0,0,r*1.1);gr.addColorStop(0,'#c8ffa8');gr.addColorStop(.5,'#5fd16a');gr.addColorStop(1,'#1f7a35');
g.globalAlpha=.92;g.fillStyle=gr;g.beginPath();g.arc(0,0,r,Math.PI,0);g.bezierCurveTo(r*1.1,r*.7,-r*1.1,r*.7,-r,0);g.fill();g.globalAlpha=.5;g.fillStyle='#145a26';g.beginPath();g.arc(r*.15,r*.15,r*.28,0,7);g.fill();g.globalAlpha=.6;g.fillStyle='#fff';g.beginPath();g.ellipse(-r*.4,-r*.5,r*.22,r*.12,-.5,0,7);g.fill();g.globalAlpha=1;g.restore();
eyes(x,y-r*.1,r,pt.x,pt.y);g.strokeStyle='#145a26';g.lineWidth=1.5;g.beginPath();g.arc(x,y+r*.3,r*.22,.2,Math.PI-.2);g.stroke()}
else if(e.type=='bat'){const fl=Math.sin(t*22+e.x)*.7;g.fillStyle='#3a2466';g.strokeStyle='#241447';g.lineWidth=1.2;
[-1,1].forEach(sg=>{g.beginPath();g.moveTo(x,y);g.quadraticCurveTo(x+sg*r*2,y-r*(1.8+fl),x+sg*r*3,y-r*(.6+fl*.6));g.lineTo(x+sg*r*2.4,y+r*.2);g.lineTo(x+sg*r*1.7,y-r*.1);g.lineTo(x+sg*r*1.1,y+r*.5);g.closePath();g.fill();g.stroke()});
const gr=g.createRadialGradient(x-r*.3,y-r*.3,1,x,y,r*1.2);gr.addColorStop(0,'#8a63c8');gr.addColorStop(1,'#2a1850');g.fillStyle=gr;g.beginPath();g.ellipse(x,y,r*.9,r*1.05,0,0,7);g.fill();
g.fillStyle='#2a1850';[-1,1].forEach(sg=>{g.beginPath();g.moveTo(x+sg*r*.2,y-r*.8);g.lineTo(x+sg*r*.8,y-r*1.6);g.lineTo(x+sg*r*.9,y-r*.5);g.fill()});
g.fillStyle='#ff4d4d';[-1,1].forEach(sg=>{g.beginPath();g.arc(x+sg*r*.35,y-r*.2,r*.2,0,7);g.fill()});g.fillStyle='#fff';g.fillRect(x-r*.3,y+r*.25,2,4);g.fillRect(x+r*.2,y+r*.25,2,4)}
else if(e.type=='skel'){g.strokeStyle='#d9d4bd';g.lineWidth=2;g.lineCap='round';for(let i=0;i<3;i++){g.beginPath();g.arc(x,y+r*.35+i*3.5,r*.75-i*1.5,.2,Math.PI-.2);g.stroke()}
g.beginPath();g.moveTo(x,y+r*.3);g.lineTo(x,y+r*1.1);g.stroke();const hx=x+c*r*1.1,hy=y+s*r*1.1;g.lineWidth=3;g.beginPath();g.moveTo(x+Math.cos(a+1.3)*r*.7,y+Math.sin(a+1.3)*r*.7);g.lineTo(hx,hy);g.stroke();
g.strokeStyle='#8a6a4a';g.beginPath();g.moveTo(hx,hy);g.lineTo(hx+c*r*1.5,hy+s*r*1.5);g.stroke();g.strokeStyle='#b8bec8';g.beginPath();g.moveTo(hx+c*r*.5,hy+s*r*.5);g.lineTo(hx+c*r*1.9,hy+s*r*1.9);g.stroke();g.lineCap='butt';
const gr=g.createRadialGradient(x-r*.3,y-r*.8,2,x,y-r*.5,r*1.1);gr.addColorStop(0,'#fffbe8');gr.addColorStop(1,'#bdb79a');g.fillStyle=gr;g.beginPath();g.arc(x,y-r*.35,r*.85,0,7);g.fill();g.fillRect(x-r*.5,y+r*.1,r,r*.4);
g.fillStyle='#14110a';[-1,1].forEach(sg=>{g.beginPath();g.arc(x+sg*r*.35,y-r*.4,r*.25,0,7);g.fill()});g.fillStyle='#ff5a3a';[-1,1].forEach(sg=>{g.beginPath();g.arc(x+sg*r*.35+c*1.5,y-r*.4+s*1.5,r*.1,0,7);g.fill()});
g.fillStyle='#14110a';g.beginPath();g.moveTo(x,y-r*.15);g.lineTo(x-r*.12,y+r*.05);g.lineTo(x+r*.12,y+r*.05);g.fill();g.fillRect(x-r*.4,y+r*.22,r*.8,2)}
else{const gr=g.createRadialGradient(x-r*.4,y-r*.5,2,x,y,r*1.2);gr.addColorStop(0,'#9fc45a');gr.addColorStop(1,'#3d5a1c');g.fillStyle=gr;g.beginPath();g.arc(x,y,r,0,7);g.fill();g.strokeStyle='rgba(0,0,0,.5)';g.lineWidth=1.5;g.stroke();
g.fillStyle='#6b4a2a';g.fillRect(x-r,y+r*.2,r*2,r*.35);g.fillStyle='#ffd54a';g.fillRect(x-2,y+r*.22,4,r*.3);g.fillStyle='#7d8696';[-1,1].forEach(sg=>{g.beginPath();g.arc(x+sg*r*.95,y-r*.2,r*.45,0,7);g.fill()});
const hx=x+c*r*1.2,hy=y+s*r*1.2;g.strokeStyle='#5a3b1e';g.lineWidth=4;g.beginPath();g.moveTo(hx,hy);g.lineTo(hx+c*r*1.6,hy+s*r*1.6);g.stroke();g.fillStyle='#8a93a6';g.beginPath();g.arc(hx+c*r*1.7,hy+s*r*1.7,r*.5,0,7);g.fill();
g.fillStyle='#ffe066';[-1,1].forEach(sg=>{g.beginPath();g.ellipse(x+sg*r*.38,y-r*.25,r*.17,r*.12,0,0,7);g.fill()});g.strokeStyle='#14200a';g.lineWidth=2.5;g.beginPath();g.moveTo(x-r*.7,y-r*.6);g.lineTo(x-r*.15,y-r*.4);g.moveTo(x+r*.7,y-r*.6);g.lineTo(x+r*.15,y-r*.4);g.stroke();
g.fillStyle='#f5f0dc';[-1,1].forEach(sg=>{g.beginPath();g.moveTo(x+sg*r*.35,y+r*.3);g.lineTo(x+sg*r*.55,y+r*.3);g.lineTo(x+sg*r*.45,y-r*.1);g.fill()})}
if(e.f>0){g.fillStyle='rgba(255,255,255,.65)';g.beginPath();g.arc(x,y,r,0,7);g.fill()}bar(x-r,y-r-12,r*2,e.hp,e.mhp,'#e55')}
en=function(e,t,pt){if(e.boss||e.ri>0||'slime,bat,skel,orc'.indexOf(e.type)<0)return en0(e,t,pt);mob2(e,t,pt)};
const pl0=pl;pl=function(p,t){if(!p.dead){g.strokeStyle=CT[p.i].col;g.globalAlpha=.6;g.lineWidth=2;g.beginPath();g.ellipse(p.x,p.y+11,16,6,0,0,7);g.stroke();g.globalAlpha=1}pl0(p,t)};
const mb0=makeBG;
makeBG=function(){mb0();const b=bgc.getContext('2d');b.lineCap='round';b.strokeStyle='rgba(150,115,70,.35)';b.lineWidth=46;b.beginPath();b.moveTo(0,WH*.5);b.bezierCurveTo(WW*.25,WH*.2,WW*.6,WH*.9,WW,WH*.45);b.stroke();b.strokeStyle='rgba(190,150,95,.25)';b.lineWidth=26;b.stroke();
b.strokeStyle='rgba(120,200,255,.5)';b.lineWidth=3;b.beginPath();b.arc(WW/2,WH/2,150,0,7);b.stroke();b.setLineDash([6,8]);b.beginPath();b.arc(WW/2,WH/2,120,0,7);b.stroke();b.setLineDash([]);
for(let i=0;i<8;i++){const a=i/8*6.283,x=WW/2+Math.cos(a)*150,y=WH/2+Math.sin(a)*150;b.fillStyle='#6b7280';b.fillRect(x-6,y-14,12,26);b.fillStyle='#9aa3b2';b.fillRect(x-6,y-14,12,5);b.fillStyle='rgba(120,200,255,.7)';b.fillRect(x-2,y-6,4,4)}
for(let i=0;i<70;i++){const x=rnd(i,31)*WW,y=rnd(i,32)*WH,k=i%3;if(Math.hypot(x-WW/2,y-WH/2)<190)continue;
if(k==0){b.fillStyle='rgba(0,0,0,.25)';b.beginPath();b.ellipse(x,y+8,16,6,0,0,7);b.fill();[[0,0,12,'#1e6b30'],[-9,3,9,'#25803a'],[9,3,9,'#2a8f40']].forEach(c=>{b.fillStyle=c[3];b.beginPath();b.arc(x+c[0],y+c[1],c[2],0,7);b.fill()})}
else if(k==1){b.fillStyle='#e8e0cc';b.fillRect(x-1.5,y,3,7);b.fillStyle='#d33a3a';b.beginPath();b.arc(x,y,6,Math.PI,0);b.fill();b.fillStyle='#fff';b.fillRect(x-3,y-3,2,2);b.fillRect(x+1,y-4,2,2)}
else{b.fillStyle='rgba(0,0,0,.25)';b.beginPath();b.ellipse(x,y+5,10,4,0,0,7);b.fill();b.fillStyle='#8b919c';b.beginPath();b.arc(x,y,7,0,7);b.fill();b.fillStyle='#b4bbc6';b.beginPath();b.arc(x-2,y-2,3,0,7);b.fill()}}};
/* === Герои по классам, новая графика, замена неподдерживаемых смайликов === */
(()=>{const f=s=>typeof s=='string'?s.replace(/\u{1FAB5}/gu,'\u{1F332}').replace(/\u{1FA99}/gu,'\u{1F4B0}'):s,Q=CanvasRenderingContext2D.prototype,ft=Q.fillText,st=Q.strokeText;
Q.fillText=function(s,...a){return ft.call(this,f(s),...a)};Q.strokeText=function(s,...a){return st.call(this,f(s),...a)};
const rt=renderTree,rs=renderShop;renderTree=function(){rt();$('tree').innerHTML=f($('tree').innerHTML)};renderShop=function(){rs();{const text=f($('shop').innerHTML);if(text!==$('shop').innerHTML)$('shop').innerHTML=text;}}})();
const PONDS=[[320,240,90,50],[1350,820,110,60],[900,980,70,40]];let SHK=0;
function hero(p,t){const x=p.x,y=p.y,c=p.cl|0,col=CT[p.i].col,fx=p.fx,fy=p.fy,a0=Math.atan2(fy,fx),sw=p.ac>0?1-p.ac/.35:-1;
const mv=p.lx!=null&&Math.hypot(x-p.lx,y-p.ly)>.3;p.lx=x;p.ly=y;const ph=t*14,bob=mv?-Math.abs(Math.sin(ph))*1.6:0,leg=mv?Math.sin(ph)*4:0;
const TC=['#8a5a2b','#aab3c2','#7fe0ff'],BODY=['#3b5b9a','#2f7d3a','#5b3aa8','#f2f4fa','#7b8494'][c],hy=y-14+bob;
g.fillStyle='rgba(0,0,0,.3)';g.beginPath();g.ellipse(x,y+13,13,5,0,0,7);g.fill();
if(c==0||c==4){g.fillStyle=c==0?'#b3262d':col;const w=Math.sin(t*5)*2;g.beginPath();g.moveTo(x-6,y-6+bob);g.lineTo(x+6,y-6+bob);g.lineTo(x+6-fx*10+w,y+14-fy*6);g.lineTo(x-6-fx*10+w,y+14-fy*6);g.fill()}
if(c==1){g.save();g.translate(x-fx*8,y-5+bob);g.rotate(.5);g.fillStyle='#6b4a1f';g.fillRect(-3,-9,6,16);g.fillStyle='#e8e0cc';g.fillRect(-2,-12,1.5,4);g.fillRect(1,-12,1.5,4);g.restore()}
if(c<2||c==4){g.fillStyle='#3a2a1a';g.fillRect(x-6,y+8+bob+leg*.5,5,6);g.fillRect(x+1,y+8+bob-leg*.5,5,6)}
g.fillStyle=BODY;
if(c==2||c==3){g.beginPath();g.moveTo(x-7,y-8+bob);g.lineTo(x+7,y-8+bob);g.lineTo(x+12,y+13);g.lineTo(x-12,y+13);g.closePath();g.fill();g.fillStyle='#ffd54a';g.fillRect(x-12,y+11,24,2);g.fillRect(x-7,y+1+bob,14,2.5);
if(c==3){g.fillStyle='#35c46b';g.fillRect(x-1.5,y-6+bob,3,9);g.fillRect(x-4.5,y-3+bob,9,3)}else{g.fillStyle='#ffd54a';g.fillRect(x-1,y+5,2,2);g.fillRect(x-5,y+8,2,2);g.fillRect(x+3,y+8,2,2)}}
else{const wd=c==4?24:18;rrect(x-wd/2,y-9+bob,wd,c==4?19:17,5);g.fill();g.fillStyle=['#c0392b','#6b4a1f',0,0,col][c];g.fillRect(x-wd/2,y+3+bob,wd,3);
if(c==0||c==4){g.fillStyle=c==4?'#9aa3b2':'#aab3c2';[-1,1].forEach(s=>{g.beginPath();g.arc(x+s*(wd/2+1),y-6+bob,c==4?6.5:4.5,0,7);g.fill()})}
if(c==4){g.fillStyle='#d5dbe6';[-7,0,7].forEach(o=>g.fillRect(x+o-1,y-5+bob,2,2))}}
if(p.g&&p.g.armor){g.strokeStyle=TC[p.g.armor-1];g.lineWidth=2.5;g.beginPath();g.arc(x,y+2+bob,10,.3,2.84);g.stroke()}
g.fillStyle='#f1c9a0';g.beginPath();g.arc(x,hy,7.5,0,7);g.fill();g.fillStyle='#222';[-1,1].forEach(s=>{g.beginPath();g.arc(x+s*2.8+fx*2,hy+1+fy*1.5,1.3,0,7);g.fill()});
if(c==0){g.fillStyle='#5a3b1e';g.beginPath();g.arc(x,hy-1,8,Math.PI,0);g.fill();g.fillStyle='#d33';g.fillRect(x-8,hy-3,16,3)}
else if(c==1){g.fillStyle='#2f7d3a';g.beginPath();g.arc(x,hy,9,Math.PI*.95,Math.PI*2.05);g.fill();g.strokeStyle='#e5484d';g.lineWidth=2;g.beginPath();g.moveTo(x+5,hy-7);g.lineTo(x+12,hy-14);g.stroke()}
else if(c==2){g.fillStyle='#3a2380';g.beginPath();g.ellipse(x,hy-4,12,4,0,0,7);g.fill();g.fillStyle='#5b3aa8';g.beginPath();g.moveTo(x-8,hy-4);g.lineTo(x+8,hy-4);g.quadraticCurveTo(x+5,hy-16,x+9,hy-26);g.lineTo(x-4,hy-4);g.fill();g.fillStyle='#ffd54a';g.fillRect(x+1,hy-14,3,3);g.fillStyle='#e8e8ee';g.beginPath();g.moveTo(x-5,hy+3);g.lineTo(x+5,hy+3);g.lineTo(x,hy+13);g.fill()}
else if(c==3){g.fillStyle='#f5d58a';g.beginPath();g.arc(x,hy-1,8.3,Math.PI,0);g.fill();g.fillRect(x-8,hy-1,3,9);g.fillRect(x+5,hy-1,3,9);g.strokeStyle='#ffe066';g.lineWidth=2;g.beginPath();g.ellipse(x,hy-12+Math.sin(t*3)*1.5,8,3,0,0,7);g.stroke()}
else{g.fillStyle='#9aa3b2';g.beginPath();g.arc(x,hy-1,8.8,Math.PI,0);g.fill();g.fillRect(x-8.8,hy-1,17.6,5);g.fillStyle='#14161c';g.fillRect(x-6,hy+1,12,2.5);g.strokeStyle='#e5484d';g.lineWidth=4;g.beginPath();g.moveTo(x,hy-9);g.quadraticCurveTo(x-fx*8,hy-16,x-fx*12,hy-5);g.stroke()}
if(p.g&&p.g.helm){g.strokeStyle=TC[p.g.helm-1];g.lineWidth=2;g.beginPath();g.arc(x,hy,9.5,Math.PI*1.05,Math.PI*1.95);g.stroke()}
if(c==4){const sx=x-fy*15,sy=y+2+fx*15,gr=g.createRadialGradient(sx-3,sy-3,1,sx,sy,11);gr.addColorStop(0,'#e1e6ee');gr.addColorStop(1,'#5b6270');g.fillStyle=gr;g.beginPath();g.arc(sx,sy,11,0,7);g.fill();g.strokeStyle='#cbd5e1';g.lineWidth=2;g.stroke();g.fillStyle=col;g.fillRect(sx-1.5,sy-7,3,14);g.fillRect(sx-7,sy-1.5,14,3)}
if(p.w==0){const an=sw>=0?a0-1.3+sw*2.6:a0+.9,ox=x,oy=y+2+bob,cn=Math.cos(an),sn=Math.sin(an);if(sw>=0){g.strokeStyle='rgba(255,255,255,.45)';g.lineWidth=7;g.beginPath();g.arc(ox,oy,32,a0-1.3,an);g.stroke()}
g.lineCap='round';g.strokeStyle='#5a3b1e';g.lineWidth=5;g.beginPath();g.moveTo(ox+cn*6,oy+sn*6);g.lineTo(ox+cn*12,oy+sn*12);g.stroke();g.strokeStyle='#ffd54a';g.lineWidth=3;g.beginPath();g.moveTo(ox+cn*13-sn*5,oy+sn*13+cn*5);g.lineTo(ox+cn*13+sn*5,oy+sn*13-cn*5);g.stroke();
g.strokeStyle='#d5dbe6';g.lineWidth=5;g.beginPath();g.moveTo(ox+cn*14,oy+sn*14);g.lineTo(ox+cn*42,oy+sn*42);g.stroke();g.strokeStyle='#fff';g.lineWidth=1.5;g.stroke();g.lineCap='butt'}
else if(p.w>2)tool(p,a0,sw);else wpn(p,a0)}
const pl1=pl;
pl=function(p,t){if(p.dead)return pl1(p,t);g.strokeStyle=CT[p.i].col;g.globalAlpha=.6;g.lineWidth=2;g.beginPath();g.ellipse(p.x,p.y+11,16,6,0,0,7);g.stroke();g.globalAlpha=1;
if(p.inv>0&&Math.floor(t*16)%2)g.globalAlpha=.45;hero(p,t);g.globalAlpha=1;bar(p.x-16,p.y-35,32,p.hp,p.mhp,'#4f4');g.font='11px sans-serif';g.textAlign='center';g.fillStyle='#fff';g.fillText(CLS[p.cl|0].e,p.x,p.y-40)};
function ground(t){const x0=Math.floor(cam.x/40)*40-40,y0=Math.floor(cam.y/40)*40-40;
[['#3b5c49',0],['#517058',.5]].forEach(([c,o])=>{g.strokeStyle=c;g.lineWidth=1.3;g.beginPath();for(let gx=x0;gx<cam.x+W+40;gx+=40)for(let gy=y0;gy<cam.y+H+40;gy+=40){if(rnd(gx+o*7,gy)>.5||biomeAt(gx,gy)==2)continue;const bx=gx+rnd(gy,gx+o)*40,by=gy+rnd(gx+o,gy*3)*40,s=Math.sin(t*1.8+bx*.02+by*.01)*3;g.moveTo(bx,by);g.quadraticCurveTo(bx+s*.4,by-5,bx+s,by-10)}g.stroke()});
PONDS.forEach((q,i)=>{if(q[0]+q[2]<cam.x||q[0]-q[2]>cam.x+W||q[1]+q[3]<cam.y||q[1]-q[3]>cam.y+H)return;for(let k=0;k<2;k++){const f=(t*.35+i*.37+k*.5)%1;g.strokeStyle='rgba(255,255,255,'+(.35*(1-f))+')';g.lineWidth=1.5;g.beginPath();g.ellipse(q[0],q[1],q[2]*f*.9,q[3]*f*.9,0,0,7);g.stroke()}
g.strokeStyle='rgba(255,255,255,.35)';g.lineWidth=2;g.beginPath();const sx=q[0]-q[2]*.4+Math.sin(t+i)*4;g.moveTo(sx,q[1]-q[3]*.3);g.lineTo(sx+q[2]*.3,q[1]-q[3]*.3);g.stroke()});
for(let i=0;i<5;i++){const x=(rnd(i,51)*WW+t*14*(1+rnd(i,52)))%(WW+400)-200,y=rnd(i,53)*WH,r=140+rnd(i,54)*80,q=g.createRadialGradient(x,y,0,x,y,r);q.addColorStop(0,'rgba(10,30,20,.14)');q.addColorStop(1,'rgba(0,0,0,0)');g.fillStyle=q;g.fillRect(x-r,y-r,r*2,r*2)}}
function torches(t){for(let i=0;i<8;i++){const a=i/8*6.283,x=WW/2+Math.cos(a)*150,y=WH/2+Math.sin(a)*150-18;if(x<cam.x-60||x>cam.x+W+60||y<cam.y-60||y>cam.y+H+60)continue;const f=1+Math.sin(t*9+i*2)*.15;g.globalCompositeOperation='lighter';glow(x,y,70*f,'#ff8a2a',.55);g.globalCompositeOperation='source-over';g.fillStyle='#ff9a2a';g.beginPath();g.ellipse(x,y,4*f,7*f,0,0,7);g.fill();g.fillStyle='#ffe27a';g.beginPath();g.ellipse(x,y+1.5,2*f,4*f,0,0,7);g.fill()}}
function grade(t){g.globalCompositeOperation='soft-light';const q=g.createLinearGradient(0,0,0,H);q.addColorStop(0,'rgba(90,120,255,.22)');q.addColorStop(1,'rgba(255,170,90,.22)');g.fillStyle=q;g.fillRect(0,0,W,H);g.globalCompositeOperation='source-over';
for(let i=0;i<16;i++){const x=((rnd(i,41)*W+t*(25+rnd(i,42)*25))%(W+40))-20,y=((rnd(i,43)*H+t*(14+rnd(i,44)*18)+Math.sin(t+i)*18)%(H+40))-20;g.save();g.translate(x,y);g.rotate(t*2+i);g.globalAlpha=.75;g.fillStyle=['#7bbf4a','#d9a441','#c46a2d'][i%3];g.beginPath();g.ellipse(0,0,3.2,1.6,0,0,7);g.fill();g.restore()}g.globalAlpha=1}
const li0=light;light=function(t){li0(t);g.save();g.translate(-cam.x,-cam.y);torches(t);g.restore();grade(t)};
const mb1=makeBG;makeBG=function(){mb1();const b=bgc.getContext('2d');PONDS.forEach(q=>{b.fillStyle='rgba(210,190,140,.9)';b.beginPath();b.ellipse(q[0],q[1],q[2]+10,q[3]+8,0,0,7);b.fill();const gr=b.createRadialGradient(q[0]-q[2]*.3,q[1]-q[3]*.3,5,q[0],q[1],q[2]);gr.addColorStop(0,'#6fc8f0');gr.addColorStop(1,'#1f6aa5');b.fillStyle=gr;b.beginPath();b.ellipse(q[0],q[1],q[2],q[3],0,0,7);b.fill();b.fillStyle='#2e8f4a';[[-.4,.1],[.3,-.2]].forEach(l=>{b.beginPath();b.arc(q[0]+l[0]*q[2],q[1]+l[1]*q[3],6,0,7);b.fill()})})};
const hu0=hurt;hurt=function(p,d){const h=p.hp;hu0(p,d);if(p.hp<h)SHK=Math.max(SHK,Math.min(8,d*.5))};
const bu0=burst;burst=function(x,y,c,n){bu0(x,y,c,n);if(n>20)SHK=Math.max(SHK,10)};
const dr0=draw;draw=function(){dr0();SHK*=.88;if(SHK<.3)SHK=0;C.style.transform=SHK?'translate('+((R()-.5)*SHK)+'px,'+((R()-.5)*SHK)+'px)':''};
/* === Биомы, большая карта, новые мобы, сундуки, инвентарь, мини-карта, задания === */
const SEEDS=[[.5,.5,0],[.13,.5,1],[.5,.93,1],[.5,.07,2],[.87,.2,2],[.87,.8,3],[.15,.92,3]],BN=['🌿 Луга','🌲 Тёмный лес','❄️ Снежные земли','🐸 Топи'],BSP=[1,1,.9,.85];
function biomeAt(x,y){let b=0,m=1e9;SEEDS.forEach((s,i)=>{const d=Math.hypot(x-s[0]*WW,y-s[1]*WH)*(1+.18*Math.sin(x*.004+i*3)*Math.cos(y*.005+i))*(s[2]?1:.8);if(d<m){m=d;b=s[2]}});return b}
const NW={tree:[.5,1,.2,.3],rock:[.5,.3,1,.3]},BP=[[],['wolf','goblin','spider','treant'],['yeti','wraith','wolf'],['toad','wisp','croc','bogling']],WU={wolf:1,goblin:1,spider:2,treant:5,yeti:4,wraith:3,toad:2,wisp:3,croc:5,bogling:2},
PC={spider:'#e8eef5',wraith:'#9fe0ff',wisp:'#6dffb0',toad:'#9acd32'},SFX={spider:'slow',wraith:'slow',yeti:'slow',wisp:'poison',toad:'poison',bogling:'poison',croc:'poison'},NEWT=Object.keys(WU);
const pickT=(x,y,pool)=>{const L=BP[biomeAt(x,y)].filter(k=>(WU[k]||1)<=wave);return R()<.45||!L.length?pool[Math.floor(R()*pool.length)]:L[Math.floor(R()*L.length)]};
const stat=(p,k)=>{p.st=p.st||{};p.st[k]=3};
const BC=[[[63,138,69],[84,160,84]],[[30,84,44],[44,116,60]],[[222,234,245],[190,214,236]],[[58,74,44],[84,107,58]]],MC=['#4a944f','#2a6a38','#dbe7f3','#4b5e38'];
PONDS.length=0;PONDS.push([WW*.35,WH*.33,100,55],[WW*.52,WH*.12,150,70],[WW*.85,WH*.8,160,80],[WW*.78,WH*.68,110,60],[WW*.14,WH*.9,130,70]);
makeBG=function(){bgc=document.createElement('canvas');bgc.width=WW;bgc.height=WH;const b=bgc.getContext('2d');b.fillStyle='#3f8a45';b.fillRect(0,0,WW,WH);
for(let x=0;x<WW+60;x+=48)for(let y=0;y<WH+60;y+=48){const px=x+rnd(x,y)*32-16,py=y+rnd(y,x)*32-16,c=BC[biomeAt(px,py)][rnd(y,x+3)<.5?0:1],gr=b.createRadialGradient(px,py,0,px,py,70);gr.addColorStop(0,'rgba('+c+',1)');gr.addColorStop(1,'rgba('+c+',0)');b.fillStyle=gr;b.fillRect(px-70,py-70,140,140)}
for(let i=0;i<14000;i++){const x=rnd(i,7)*WW,y=rnd(i,8)*WH,k=biomeAt(x,y),v=rnd(i,9);
if(k<2){b.strokeStyle=k?'hsl('+(120+v*30)+',45%,'+(18+v*14)+'%)':'hsl('+(100+v*35)+',50%,'+(28+v*24)+'%)';b.lineWidth=1.3;b.beginPath();b.moveTo(x,y);b.lineTo(x+v*5-2.5,y-4-v*5);b.stroke();if(!k&&i%50==0){b.fillStyle=['#fff','#ffd54a','#ff8aa8','#a8c8ff'][i%4];b.beginPath();b.arc(x,y,2,0,7);b.fill()}if(k&&i%70==0){b.fillStyle='#d33a3a';b.beginPath();b.arc(x,y,3,Math.PI,0);b.fill();b.fillStyle='#e8e0cc';b.fillRect(x-1,y,2,4)}}
else if(k==2){b.fillStyle='rgba(255,255,255,'+(.3+v*.5)+')';b.beginPath();b.arc(x,y,1+v*1.6,0,7);b.fill();if(i%90==0){b.fillStyle='rgba(150,200,240,.4)';b.beginPath();b.ellipse(x,y,22+v*20,9+v*8,v,0,7);b.fill()}}
else{b.fillStyle='rgba(20,30,15,'+(.15+v*.25)+')';b.beginPath();b.arc(x,y,1.5+v*2,0,7);b.fill();if(i%60==0){b.fillStyle='rgba(30,70,60,.55)';b.beginPath();b.ellipse(x,y,20+v*26,8+v*10,v,0,7);b.fill()}if(i%45==0){b.strokeStyle='#6b8f3a';b.lineWidth=2;b.beginPath();b.moveTo(x,y);b.lineTo(x+1,y-9);b.stroke();b.fillStyle='#8a5a2b';b.fillRect(x-1,y-12,3,5)}}}
b.lineCap='round';b.strokeStyle='rgba(150,115,70,.4)';b.lineWidth=60;b.beginPath();b.moveTo(WW*.18,WH*.5);b.bezierCurveTo(WW*.35,WH*.3,WW*.65,WH*.7,WW*.82,WH*.5);b.stroke();b.strokeStyle='rgba(190,150,95,.3)';b.lineWidth=34;b.stroke();
b.beginPath();b.moveTo(WW*.5,WH*.12);b.bezierCurveTo(WW*.45,WH*.3,WW*.55,WH*.7,WW*.5,WH*.9);b.strokeStyle='rgba(150,115,70,.35)';b.lineWidth=44;b.stroke();
PONDS.forEach(q=>{const k=biomeAt(q[0],q[1]);b.fillStyle=k==2?'rgba(230,245,255,.95)':k==3?'rgba(70,90,50,.9)':'rgba(210,190,140,.9)';b.beginPath();b.ellipse(q[0],q[1],q[2]+10,q[3]+8,0,0,7);b.fill();const gr=b.createRadialGradient(q[0]-q[2]*.3,q[1]-q[3]*.3,5,q[0],q[1],q[2]);gr.addColorStop(0,k==2?'#d8f4ff':k==3?'#5a8a5a':'#6fc8f0');gr.addColorStop(1,k==2?'#7fb8e0':k==3?'#2f5a3a':'#1f6aa5');b.fillStyle=gr;b.beginPath();b.ellipse(q[0],q[1],q[2],q[3],0,0,7);b.fill();if(k!=2){b.fillStyle='#2e8f4a';[[-.4,.1],[.3,-.2]].forEach(l=>{b.beginPath();b.arc(q[0]+l[0]*q[2],q[1]+l[1]*q[3],6,0,7);b.fill()})}});
b.strokeStyle='rgba(120,200,255,.55)';b.lineWidth=3;b.beginPath();b.arc(WW/2,WH/2,150,0,7);b.stroke();b.setLineDash([6,8]);b.beginPath();b.arc(WW/2,WH/2,120,0,7);b.stroke();b.setLineDash([]);
for(let i=0;i<8;i++){const a=i/8*6.283,x=WW/2+Math.cos(a)*150,y=WH/2+Math.sin(a)*150;b.fillStyle='#6b7280';b.fillRect(x-6,y-14,12,26);b.fillStyle='#9aa3b2';b.fillRect(x-6,y-14,12,5);b.fillStyle='rgba(120,200,255,.7)';b.fillRect(x-2,y-6,4,4)}
b.strokeStyle='#2f343e';b.lineWidth=28;b.strokeRect(0,0,WW,WH);b.strokeStyle='#7a8394';b.lineWidth=4;b.strokeRect(14,14,WW-28,WH-28)};
let CH=[],QS={k:0,g:20,t:0},FEX=0,MM,BB={b:-1,ts:0};
const SL=['helm','armor','boots','amu','ring'],SN=['Шлем','Доспех','Сапоги','Амулет','Кольцо'],RP=['','Закалённый ','Эпический ','Легендарный '],RC=['#b8bec8','#5aa9ff','#b36bff','#ff9a2a'];
const sv=it=>NYTHRAVEL_CATALOGUE.sellPrice(it),chestR=()=>{const q=R();return q<.6?0:q<.88?1:q<.98?2:3};
function genItem(r){const i=Math.floor(R()*5),m=1+r*.7,w=1+wave*.04,it={s:SL[i],n:RP[r]+SN[i],r,t:r?r<3?2:3:1};
if(i==0)it.hp=Math.round(20*m*w);if(i==1)it.ar=Math.min(.32,.07*m);if(i==2)it.sp=.06*m;if(i==3)it.dm=Math.min(.5,.08*m*w*.8);if(i==4)it.vp=.025*m;
if(r>=1){const k=['hp','dm','sp','vp'][Math.floor(R()*4)];it[k]=(it[k]||0)+(k=='hp'?Math.round(12*m*w):k=='dm'?.04*r:k=='sp'?.03*r:.01*r)}return it}
function addItem(p,it){p.bag=p.bag||[];if(p.bag.length<24)p.bag.push(it);else p.gold+=sv(it);FEX=1}
function invAct(i,a,k){if(NET=='guest'){snd({t:'q',a,k});return}const p=P[i];if(!p)return;p.eq=p.eq||{};p.bag=p.bag||[];
if(a==0){const it=p.bag[k];if(!it)return;const old=p.eq[it.s];p.eq[it.s]=it;p.bag.splice(k,1);if(old)p.bag.push(old)}
else if(a==1){const s=SL[k],it=p.eq[s];if(!it||p.bag.length>=24)return;p.bag.push(it);delete p.eq[s]}
else{const it=p.bag[k];if(!it)return;p.gold+=sv(it);p.bag.splice(k,1)}
p.g={};for(const z in p.eq)p.g[z]=p.eq[z].t;calc(p);p.hp=Math.max(1,Math.min(p.hp,p.mhp));FEX=1;renderInv()}
function renderInv(){let h='<h2>🎒 Инвентарь</h2><div class="cols">';
P.forEach(p=>{if(NET&&p.i!=ME)return;const eq=p.eq||{},iv=p.bag||[];h+=`<div class='col'><h3 style='color:${CT[p.i].col}'>${CT[p.i].n}</h3><p>💰 ${p.gold} · ❤ ${Math.round(p.mhp)} · ⚔ ${Math.round(dmgOf(p))}</p><b>Надето</b>`;
SL.forEach((s,i)=>{const it=eq[s];h+=`<div class='row'><span style='color:${it?RC[it.r]:'#778'}'><b>${SN[i]}</b>: ${it?it.n:'—'}<br><small>${it?gd(it):''}</small></span>${it?`<button onclick='invAct(${p.i},1,${i})'>Снять</button>`:''}</div>`});
h+=`<p style='margin:8px 0 2px'><b>Сумка ${iv.length}/24</b></p>`;
iv.forEach((it,k)=>{h+=`<div class='row'><span style='color:${RC[it.r]}'><b>${it.n}</b><br><small>${gd(it)}</small></span><span><button onclick='invAct(${p.i},0,${k})'>Надеть</button><button style='background:#7a4a4a;color:#fff' onclick='invAct(${p.i},2,${k})'>💰${sv(it)}</button></span></div>`});h+='</div>'});
{const markup=h+'</div><button onclick="togInv()">Закрыть (V / Esc)</button>';if($('inv').dataset.markup!==markup){$('inv').innerHTML=markup;$('inv').dataset.markup=markup;}}}
function togInv(){if($('inv').style.display=='flex'){hide('inv')}else{if($('tree').style.display=='flex'||$('shop').style.display=='flex')return;renderInv();show('inv')}}
addEventListener('keydown',e=>{if(e.target.matches('input,textarea,select'))return;if(e.code=='KeyV'&&!e.repeat&&(state=='play'||state=='tree'))togInv();if(e.code=='Escape'&&$('inv').style.display=='flex')togInv()});
function drawChest(c){const t=TIME(),col=RC[c.r],b=Math.sin(t*3+c.x)*1.5;g.fillStyle='rgba(0,0,0,.3)';g.beginPath();g.ellipse(c.x,c.y+11,13,5,0,0,7);g.fill();g.globalCompositeOperation='lighter';glow(c.x,c.y,44,col,.5+.2*Math.sin(t*4));g.globalCompositeOperation='source-over';
g.fillStyle='#7a4a22';rrect(c.x-12,c.y-4+b,24,14,3);g.fill();g.fillStyle='#9a622e';rrect(c.x-12,c.y-12+b,24,10,5);g.fill();g.fillStyle=col;g.fillRect(c.x-12,c.y-4+b,24,2.5);g.fillRect(c.x-2.5,c.y-12+b,5,22);g.fillStyle='#ffe066';g.fillRect(c.x-2,c.y-3+b,4,5)}
const gr0=ground;ground=function(t){gr0(t);CH.forEach(drawChest)};
function chestTick(dt){CH.slice().forEach(c=>{c.l=(c.l==null?90:c.l)-dt;const p=P.find(q=>!q.dead&&Math.hypot(q.x-c.x,q.y-c.y)<30);if(c.l<=0){CH.splice(CH.indexOf(c),1);return}if(!p)return;CH.splice(CH.indexOf(c),1);
const n=1+(R()<.3?1:0);for(let i=0;i<n;i++){const it=genItem(Math.max(0,c.r-(R()<.4?1:0)));addItem(p,it);txt(p.x,p.y-30-i*14,'📦 '+it.n,RC[it.r])}
const v=Math.round((15+wave*4)*(1+c.r));p.gold+=v;txt(p.x,p.y-14,'+'+v+' 💰','#ffd54a');burst(c.x,c.y,RC[c.r],18)})}
function stTick(dt){P.forEach(p=>{if(!p.st||p.dead)return;for(const k in p.st)if(p.st[k]>0)p.st[k]-=dt;if(p.st.poison>0){p.hp-=2.2*dt;if(p.hp<=0){p.hp=0;p.dead=1}}})}
const rv0=revive;revive=function(dt){rv0(dt);stTick(dt);chestTick(dt)};
const ki0=kill;kill=function(e){if(!E.includes(e))return;ki0(e);QS.k++;if(QS.k>=QS.g){QS.k=0;QS.g+=15;QS.t++;P.forEach(p=>{if(!p.dead){p.gold+=60*QS.t;txt(p.x,p.y-40,'Задание! +'+60*QS.t+' 💰','#ffd54a')}});CH.push({x:P[0].x+40,y:P[0].y,r:Math.min(3,QS.t)})}};
const pl2=pl;pl=function(p,t){pl2(p,t);if(p.st&&!p.dead){if(p.st.slow>0){g.strokeStyle='#8fd3ff';g.lineWidth=2;g.beginPath();g.arc(p.x,p.y,18,0,7);g.stroke()}if(p.st.poison>0){g.fillStyle='#7dff6a';for(let i=0;i<3;i++){g.beginPath();g.arc(p.x+Math.sin(t*4+i*2)*9,p.y-18-((t*20+i*8)%14),2,0,7);g.fill()}}}};
const nd1=nd;nd=function(n,t){nd1(n,t);const b=n.b!=null?n.b:(n.b=biomeAt(n.x,n.y));if(b==2){g.fillStyle='rgba(255,255,255,.88)';if(n.t=='tree'){g.beginPath();g.arc(n.x,n.y-38,13,Math.PI*1.1,Math.PI*1.9);g.fill();g.beginPath();g.arc(n.x-11,n.y-24,8,Math.PI*1.1,Math.PI*1.9);g.fill()}else{g.beginPath();g.arc(n.x,n.y-12,11,Math.PI*1.05,Math.PI*1.95);g.fill()}}else if(b==3&&n.t=='tree'){g.fillStyle='rgba(70,100,50,.55)';[-14,0,14].forEach(o=>g.fillRect(n.x+o,n.y-26,2,10+Math.sin(t+o)*2))}};
const gr1=grade;grade=function(t){gr1(t);const b=biomeAt(cam.x+W/2,cam.y+H/2);
if(b==2){g.fillStyle='rgba(255,255,255,.85)';for(let i=0;i<60;i++){const x=(rnd(i,61)*W+Math.sin(t*.8+i)*25+t*10)%W,y=(rnd(i,62)*H+t*(35+rnd(i,63)*40))%H;g.beginPath();g.arc(x,y,1.3+rnd(i,64)*1.4,0,7);g.fill()}g.fillStyle='rgba(180,210,255,.08)';g.fillRect(0,0,W,H)}
else if(b==3){g.fillStyle='rgba(70,110,60,.14)';g.fillRect(0,0,W,H)}else if(b==1){g.fillStyle='rgba(0,25,10,.14)';g.fillRect(0,0,W,H)}};
function mini(){if(!MM){MM=document.createElement('canvas');MM.width=150;MM.height=100;const c=MM.getContext('2d');for(let i=0;i<150;i++)for(let j=0;j<100;j++){c.fillStyle=MC[biomeAt((i+.5)/150*WW,(j+.5)/100*WH)];c.fillRect(i,j,1,1)}}
const x=W-160,y=H-155;g.globalAlpha=.9;g.drawImage(MM,x,y);g.globalAlpha=1;g.strokeStyle='#000c';g.lineWidth=2;g.strokeRect(x,y,150,100);
const dot=(px,py,c,r)=>{g.fillStyle=c;g.beginPath();g.arc(x+px/WW*150,y+py/WH*100,r,0,7);g.fill()};CH.forEach(q=>dot(q.x,q.y,'#ffd54a',2));E.forEach(e=>dot(e.x,e.y,e.boss?'#ff2a2a':'#d33',e.boss?3.5:1.2));P.forEach(p=>{if(!p.dead)dot(p.x,p.y,CT[p.i].col,3)});
g.strokeStyle='#fff8';g.lineWidth=1;g.strokeRect(x+cam.x/WW*150,y+cam.y/WH*100,W/WW*150,H/WH*100)}
const hud5=hud;hud=function(){hud5();mini();const p=P[ME]||P[0];if(p){const b=biomeAt(p.x,p.y);if(b!=BB.b){BB.b=b;BB.ts=performance.now()}}
const k=1-(performance.now()-BB.ts)/3000;if(BB.b>=0&&k>0){g.globalAlpha=Math.min(1,k*2);g.textAlign='center';g.font='bold 24px sans-serif';g.lineWidth=5;g.strokeStyle='#000';g.strokeText(BN[BB.b],W/2,150);g.fillStyle='#fff';g.fillText(BN[BB.b],W/2,150);g.globalAlpha=1}
g.textAlign='left';g.font='bold 12px sans-serif';g.lineWidth=3;g.strokeStyle='#000';const q='🎯 Охота: '+QS.k+'/'+QS.g,h='V — инвентарь · B — магазин · T — навыки';g.strokeText(q,12,H-48);g.fillStyle='#ffd54a';g.fillText(q,12,H-48);g.font='11px sans-serif';g.strokeText(h,12,H-32);g.fillStyle='#cfd6e0';g.fillText(h,12,H-32)};
function mob3(e,t,pt){const x=e.x,r=e.r,T=e.type,y=e.y+(T=='toad'?-Math.abs(Math.sin(t*5+e.x))*5:Math.sin(t*6+e.x)*1.2),a=Math.atan2(pt.y-y,pt.x-x),c=Math.cos(a),s=Math.sin(a),
F=(co,xx,yy,rr)=>{g.fillStyle=co;g.beginPath();g.arc(xx,yy,rr,0,7);g.fill()},E2=(co,xx,yy,rx,ry)=>{g.fillStyle=co;g.beginPath();g.ellipse(xx,yy,rx,ry,0,0,7);g.fill()};
g.fillStyle='rgba(0,0,0,.28)';g.beginPath();g.ellipse(x,e.y+r*.85,r*1.1,r*.4,0,0,7);g.fill();
if(T=='wolf'||T=='croc'){g.save();g.translate(x,y);g.rotate(a);const L=T=='croc'?1.7:1.3,W2=T=='croc'?.55:.75,w=Math.sin(t*10+e.x)*.25;
g.strokeStyle=e.c;g.lineWidth=T=='croc'?7:5;g.beginPath();g.moveTo(-r*L,0);g.quadraticCurveTo(-r*(L+.8),r*w*2,-r*(L+1.4),r*w*3);g.stroke();
for(const sg of[-1,1])for(const o of[-.6,.6]){g.fillStyle='#2a2a30';g.fillRect(r*o-2,sg*r*W2-2+sg*Math.sin(t*12+o*3)*2,5,5)}
E2(e.c,0,0,r*L,r*W2);E2('rgba(0,0,0,.2)',0,r*W2*.4,r*L*.8,r*W2*.5);
if(T=='wolf'){F(e.c,r*L*.9,0,r*.62);E2('#4a4f58',r*(L+.55),0,r*.45,r*.26);F('#111',r*(L+.95),0,2);[-1,1].forEach(sg=>{g.fillStyle=e.c;g.beginPath();g.moveTo(r*L*.7,sg*r*.3);g.lineTo(r*L*.5,sg*r*.95);g.lineTo(r*L*1.0,sg*r*.55);g.fill()});F('#ffd54a',r*L*1.05,-r*.25,2);F('#ffd54a',r*L*1.05,r*.25,2)}
else{E2(e.c,r*(L+.6),0,r*.9,r*.34);g.fillStyle='#fff';for(let i=0;i<5;i++){g.fillRect(r*(L+.2+i*.25),-r*.3,2,3);g.fillRect(r*(L+.2+i*.25),r*.27,2,3)}F('#ffd54a',r*(L+.1),-r*.3,2.5);F('#ffd54a',r*(L+.1),r*.3,2.5);g.fillStyle='#2a5a2a';for(let i=-2;i<=2;i++)g.fillRect(r*i*.5-2,-r*.1,4,3)}
g.restore()}
else if(T=='spider'){g.strokeStyle='#241a28';g.lineWidth=2;for(let i=0;i<8;i++){const sd=i<4?1:-1,k=(i%4-1.5),ph=Math.sin(t*12+i)*3;g.beginPath();g.moveTo(x,y);g.lineTo(x+sd*r*1.2,y+k*r*.7-6+ph);g.lineTo(x+sd*r*2,y+k*r*1.1+ph);g.stroke()}
E2('#3a2a3f',x-c*r*.5,y-s*r*.5+2,r*.9,r*.75);E2('#7a2a8a',x-c*r*.5,y+2-s*r*.5,r*.35,r*.25);F('#4a3650',x+c*r*.6,y+s*r*.6,r*.5);F('#ff3b3b',x+c*r*.8-3,y+s*r*.8,1.8);F('#ff3b3b',x+c*r*.8+3,y+s*r*.8,1.8);F('#ff3b3b',x+c*r*.6,y+s*r*.6-3,1.5)}
else if(T=='goblin'){F('#6b4a2a',x,y+r*.4,r*.85);F(e.c,x,y-r*.1,r*.85);[-1,1].forEach(sg=>{g.fillStyle=e.c;g.beginPath();g.moveTo(x+sg*r*.7,y-r*.3);g.lineTo(x+sg*r*1.9,y-r*.9);g.lineTo(x+sg*r*.8,y+r*.2);g.fill()});F('#ffe066',x-r*.3,y-r*.25,2.2);F('#ffe066',x+r*.3,y-r*.25,2.2);F('#111',x-r*.3+c,y-r*.25+s,1);F('#111',x+r*.3+c,y-r*.25+s,1);E2('#5aa03a',x,y+r*.05,r*.18,r*.25);g.fillStyle='#fff';g.fillRect(x-r*.35,y+r*.35,r*.7,2);g.strokeStyle='#cfd6e0';g.lineWidth=2.5;g.beginPath();g.moveTo(x+c*r,y+s*r);g.lineTo(x+c*r*2,y+s*r*2);g.stroke();F('#d9a441',x-c*r*.9,y-s*r*.4+r*.4,r*.4)}
else if(T=='treant'){const sw=Math.sin(t*2+e.x)*3;g.strokeStyle='#5a3b1e';g.lineWidth=6;g.lineCap='round';[-1,1].forEach(sg=>{g.beginPath();g.moveTo(x+sg*r*.6,y-r*.2);g.lineTo(x+sg*r*1.4+c*r*.5,y-r*.5+s*r*.5+sw);g.stroke();F('#3a8a3a',x+sg*r*1.4+c*r*.5,y-r*.5+s*r*.5+sw,4)});g.lineCap='butt';
const gr=g.createLinearGradient(x-r,0,x+r,0);gr.addColorStop(0,'#4a2f17');gr.addColorStop(.5,'#7a5230');gr.addColorStop(1,'#4a2f17');g.fillStyle=gr;rrect(x-r*.8,y-r,r*1.6,r*2,r*.5);g.fill();g.strokeStyle='#3a2410';g.lineWidth=2;[-.3,.2].forEach(o=>{g.beginPath();g.moveTo(x+o*r,y-r*.4);g.lineTo(x+o*r+2,y+r*.9);g.stroke()});
F('#9fff7a',x-r*.35,y-r*.35,3);F('#9fff7a',x+r*.35,y-r*.35,3);g.strokeStyle='#1a0f06';g.lineWidth=2.5;g.beginPath();g.arc(x,y+r*.15,r*.25,.2,2.9);g.stroke();[[-.6,-1.1,r*.7,'#1f6b30'],[.6,-1.1,r*.7,'#25803a'],[0,-1.5,r*.8,'#2e9a45']].forEach(q=>F(q[3],x+q[0]*r,y+q[1]*r,q[2]))}
else if(T=='yeti'){g.strokeStyle='#e8f1ff';g.lineWidth=7;g.lineCap='round';[-1,1].forEach(sg=>{g.beginPath();g.moveTo(x+sg*r*.8,y-r*.1);g.lineTo(x+sg*r*.9+c*r*.9,y+r*.5+s*r*.9);g.stroke()});g.lineCap='butt';F('#f2f7ff',x,y,r);g.fillStyle='#f2f7ff';
for(let i=0;i<14;i++){const an=i/14*6.283;g.beginPath();g.moveTo(x+Math.cos(an-.15)*r,y+Math.sin(an-.15)*r);g.lineTo(x+Math.cos(an)*r*1.25,y+Math.sin(an)*r*1.25);g.lineTo(x+Math.cos(an+.15)*r,y+Math.sin(an+.15)*r);g.fill()}
E2('#9fc4e8',x,y-r*.15,r*.55,r*.45);F('#ff4d4d',x-r*.22,y-r*.25,2.5);F('#ff4d4d',x+r*.22,y-r*.25,2.5);g.fillStyle='#143a5c';g.fillRect(x-r*.28,y+r*.02,r*.56,3);g.fillStyle='#fff';for(let i=0;i<4;i++)g.fillRect(x-r*.25+i*r*.15,y+r*.02,2,3)}
else if(T=='wraith'){g.globalAlpha=.85;const gr=g.createLinearGradient(0,y-r,0,y+r*1.6);gr.addColorStop(0,'#d8f4ff');gr.addColorStop(1,'rgba(120,180,255,0)');g.fillStyle=gr;g.beginPath();g.arc(x,y-r*.3,r*.8,Math.PI,0);for(let i=0;i<5;i++)g.lineTo(x+r*.8-i*r*.4,y+r*1.1+(i%2?-r*.3:r*.3)+Math.sin(t*6+i)*3);g.closePath();g.fill();g.globalAlpha=1;
g.globalCompositeOperation='lighter';glow(x,y,r*3,'#9fe0ff',.4);g.globalCompositeOperation='source-over';F('#0a2a4a',x-r*.3,y-r*.4,2.6);F('#0a2a4a',x+r*.3,y-r*.4,2.6);g.strokeStyle='#bfe8ff';g.lineWidth=2;g.beginPath();g.moveTo(x+c*r*.6,y+s*r*.4);g.lineTo(x+c*r*1.5,y+s*r*1.2);g.stroke()}
else if(T=='toad'){E2('#4a6b2a',x,y+r*.3,r*1.1,r*.8);E2('#b5d56a',x,y+r*.55,r*.75,r*.45);[[-.5,-.2],[.4,.1],[.1,.5],[-.2,.3]].forEach(q=>F('#3a5a1f',x+q[0]*r,y+q[1]*r,2));[-1,1].forEach(sg=>{F('#ffe066',x+sg*r*.55,y-r*.35,r*.3);E2('#111',x+sg*r*.55,y-r*.35,1.2,r*.2)});g.strokeStyle='#243a12';g.lineWidth=2;g.beginPath();g.arc(x,y+r*.2,r*.6,.2,2.9);g.stroke()}
else if(T=='wisp'){g.globalCompositeOperation='lighter';glow(x,y,r*3.2,'#6dffb0',.7);for(let i=1;i<5;i++)glow(x-c*i*5,y-s*i*5+Math.sin(t*8+i)*2,r*(1.6-i*.25),'#6dffb0',.35);g.globalCompositeOperation='source-over';F('#eafff3',x,y,r*.7);F('#0a3a22',x-r*.25,y-r*.1,1.8);F('#0a3a22',x+r*.25,y-r*.1,1.8)}
else{g.fillStyle='#4a5a2a';g.beginPath();for(let i=0;i<9;i++){const an=i/9*6.283,q=r*(1+.18*Math.sin(i*2.3+t*2));g.lineTo(x+Math.cos(an)*q,y+Math.sin(an)*q)}g.closePath();g.fill();[[-.4,-.5],[.3,-.6],[0,.4]].forEach(q=>F('#6b8f3a',x+q[0]*r,y+q[1]*r,r*.28));
g.strokeStyle='#3a4a1e';g.lineWidth=5;g.lineCap='round';[-1,1].forEach(sg=>{g.beginPath();g.moveTo(x+sg*r*.8,y);g.quadraticCurveTo(x+sg*r*1.2,y+r*.8,x+sg*r*1.1+c*3,y+r*1.2+s*3);g.stroke()});g.lineCap='butt';F('#ffe066',x-r*.3,y-r*.2,2.6);F('#ffe066',x+r*.3,y-r*.2,2.6);g.fillStyle='#2a3418';g.fillRect(x-r*.3,y+r*.2,r*.6,2.5);g.fillStyle='#7ab04a';for(let i=0;i<4;i++)g.fillRect(x-r*.7+i*r*.45,y+r*.9,2,5+Math.sin(t*3+i)*2)}
if(e.f>0){g.fillStyle='rgba(255,255,255,.6)';g.beginPath();g.arc(x,y,r*1.1,0,7);g.fill()}bar(x-r,e.y-r-12,r*2,e.hp,e.mhp,'#e55')}
const en1=en;en=function(e,t,pt){if(!e.boss&&NEWT.includes(e.type))return mob3(e,t,pt);return en1(e,t,pt)};
