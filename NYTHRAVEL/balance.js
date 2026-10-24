/* Integrates the configurable rules with the existing world and host-authoritative co-op. */
const Rules=ROS_BALANCE, BAL=Rules.config;
UP.splice(0,UP.length,...BAL.skills.map(s=>[s.key,s.name,s.description,s.max,...(s.requires?.[0]||[])]));
RP.splice(0,RP.length,...BAL.loot.prefixes);RC.splice(0,RC.length,...BAL.loot.colors);
CLS.forEach((c,i)=>Object.assign(c,{d:['+16% базового урона, широкая дуга меча','+12% скорости, 88% HP, пробитие 3 целей','+22% базового урона, 80% HP, взрыв посоха','Лечебная аура, активное лечение ×1,35, 95% HP','+65% HP, −20% входящего урона, скорость 92%'][i],dm:BAL.classes[i].damage,hp:BAL.classes[i].hp,sp:BAL.classes[i].speed}));
const originalMakePlayer=mk;
mk=function(i){const p=originalMakePlayer(i);return Object.assign(p,{cl:0,w:0,stamina:BAL.progression.baseStamina,haste:0,sinceHit:10,downed:false});};
gs=(p,k)=>Rules.gear(p,k);
dmgOf=(p,kind)=>{const s=Rules.stats(p);return (kind||(p.w===2?'magic':'physical'))==='magic'?s.magic:s.physical;};
function playerSpeed(p){return Rules.stats(p).speed;}
function playerAttackRate(p){return Rules.stats(p).attackRate;}
function arrowPierce(p){return (p.cl===1?3:2)+(p.cl===1?Math.floor((p.up.fletching||0)/2):0);}
calc=function(p){const max=Rules.stats(p).hp;p.hp=cl(p.hp+max-p.mhp,0,max);p.mhp=max;};
const switchClassBeforeBalance=setCls;
setCls=function(i,k){const p=P[i];if(!p||!CLS[k])return;const fraction=p.mhp>0?p.hp/p.mhp:1;switchClassBeforeBalance(i,k);p.hp=cl(Math.round(p.mhp*fraction),p.dead?0:1,p.mhp);};
upg=function(i,key){const p=P[i];if(!p||!Rules.canUpgrade(p,key))return false;if(NET==='guest'){if(i!==ME)return false;snd({t:'u',k:key,expected:p.up[key]||0});return true;}
 if(!Rules.buyUpgrade(p,key))return false;if(key==='hp')calc(p);p.stamina=Math.min(p.stamina,Rules.stats(p).stamina);renderTree();return true;};
const forgeBeforeBalance=buy;
buy=function(i,w){if(w==='forge'&&(!P[i]||P[i].wp>=BAL.progression.maxForge))return false;return forgeBeforeBalance(i,w);};
// Keep all shop items, but curb runaway power from cheap guaranteed gear.
GEAR.forEach((group,i)=>group.t.forEach((item,tier)=>{item.c=[70,260,950][tier]+i*12;const key=['hp','ar','sp','dm','vp'][i];item[key]=[[12,28,55],[.035,.075,.13],[.025,.06,.1],[.04,.09,.15],[.01,.02,.035]][i][tier];}));
const shopBeforeBalance=shop;
shop=function(i,k){if(k==='wl'&&((P[i]?.wl||[])[P[i]?.w||0]||0)>=BAL.progression.maxWeapon)return;if(k==='as'&&(P[i]?.asu||0)>=BAL.progression.maxAttackShop)return;shopBeforeBalance(i,k);};
function playerAbilities(p){const c=CT[p.i],s=Rules.stats(p);p.stamina=cl(p.stamina??s.stamina,0,s.stamina);
 if(pkey(p,c.s[0],5)&&p.cd[0]<=0&&p.up.dash&&p.stamina>=BAL.progression.dashCost){p.stamina-=BAL.progression.dashCost;p.cd[0]=(BAL.progression.dashCooldown-(p.up.dash-1)*.45)*(1-Rules.stats(p).cooldown);p.inv=.3;p.x=cl(p.x+p.fx*BAL.progression.dashDistance,20,WW-20);p.y=cl(p.y+p.fy*BAL.progression.dashDistance,20,WH-20);p.haste=2;fxr(p.x,p.y,28,'#8bd5eb');}
 if(pkey(p,c.s[1],6)&&p.cd[1]<=0&&p.up.nova&&p.stamina>=30){p.stamina-=30;p.cd[1]=(9-(p.up.nova-1)*.4)*(1-Rules.stats(p).cooldown);const r=110+8*p.up.nova,d=dmgOf(p,'magic')*(1.15+p.up.nova*.13)+p.up.nova*4;fxr(p.x,p.y,r,'#cc9eff');E.slice().forEach(e=>{if(Math.hypot(e.x-p.x,e.y-p.y)<r+e.r)hit(e,d,p,'magic');});}
 if(pkey(p,c.s[2],7)&&p.cd[2]<=0&&p.up.heal&&p.stamina>=24){p.stamina-=24;p.cd[2]=(15-(p.up.heal-1)*.5)*(1-Rules.stats(p).cooldown);const amount=p.mhp*(.18+p.up.heal*.04)*(p.cl===3?1.35*(1+(p.up.devotion||0)*.08):1);P.forEach(q=>{if(!q.dead&&!q.offline){const v=Math.min(q.mhp-q.hp,q===p?amount:amount*.5);q.hp+=v;txt(q.x,q.y-24,'+'+Math.ceil(v),'#8de3b5');}});if(p.cl===4&&p.up.bulwark){p.bf=p.bf||{};p.bf.sh=2;}fxr(p.x,p.y,60,'#8de3b5');}
}
hurt=function(p,damage,kind='physical'){
 if(p.inv>0||p.dead||p.offline||!Number.isFinite(damage)||damage<=0)return false;
 const stats=Rules.stats(p);if(R()<stats.dodge){p.inv=.15;txt(p.x,p.y-30,'Уклонение','#a0dfeb');return false;}
 let reduction=kind==='physical'?stats.armor:stats.resist;
 let incoming=damage*(1-reduction)*(p.cl===4?Math.max(.66,.8-(p.up.bulwark||0)*.02):1)*(p.bf?.sh>0?.8:1);
 incoming=Math.max(.1,incoming);p.hp=Math.max(0,p.hp-incoming);p.inv=.45;p.sinceHit=0;SHK=Math.max(SHK,Math.min(6,incoming*.2));txt(p.x,p.y-24,'−'+Math.ceil(incoming),'#ed8d89');if(p.hp<=0)p.dead=1;return true;
};
hit=function(e,damage,p,kind){if(!E.includes(e)||e.killed||!Number.isFinite(damage))return;
 const previousHP=Math.max(0,e.hp);const cr=R()<Rules.stats(p).crit;if(cr)damage*=1.65;
 if(e.type==='sentinel'){const target=P[e.target]||p,angle=Math.atan2(target.y-e.y,target.x-e.x),incoming=Math.atan2(p.y-e.y,p.x-e.x);if(Math.cos(angle-incoming)>.5)damage*=.7;}
 if(e.elite)damage*=.95;e.hp-=damage;e.f=.12;burst(e.x,e.y,cr?'#ffe2a5':'#c0d9ee',cr?8:3);txt(e.x,e.y-e.r,Math.ceil(damage)+(cr?' КРИТ':''),cr?'#ffe2a5':'#e9edf4');
 if(!p.dead){const gain=NYTHRAVEL_WORLD.lifeSteal(p,Math.min(previousHP,Math.max(0,damage)),p.lifeStolen||0);p.hp=Math.min(p.mhp,p.hp+gain);p.lifeStolen=(p.lifeStolen||0)+gain;}if(e.hp<=0)kill(e);
};
// Actual drop roll happens once per kill; each chest contains exactly one item.
let lootSequence=0;
function spawnChest(source,x,y,forcedRoll){const roll=forcedRoll||Rules.rollDrop(source);if(!roll)return null;const chest={x,y,r:roll.rarity,source,id:++lootSequence,l:BAL.loot.lifetime};CH.push(chest);return chest;}
genItem=(r)=>Rules.makeItem(r,wave);
chestTick=function(dt){for(const chest of CH.slice()){
 if(!CH.includes(chest))continue;chest.l=(chest.l??BAL.loot.lifetime)-dt;
 if(chest.l<=0){CH.splice(CH.indexOf(chest),1);continue;}
 const p=P.find(p=>!p.dead&&!p.offline&&Math.hypot(p.x-chest.x,p.y-chest.y)<30);if(!p)continue;
 CH.splice(CH.indexOf(chest),1);const item=genItem(chest.r);addItem(p,item);txt(p.x,p.y-30,item.n,RC[item.r]);p.gold+=10+Math.min(wave,30)*2;burst(chest.x,chest.y,RC[item.r],item.r>=3?24:10);
 if(item.r>=3)ban={t:3,s:BAL.loot.names[item.r]+': '+item.n};
 }};
kill=function(e){const index=E.indexOf(e);if(index<0||e.killed)return false;e.killed=true;E.splice(index,1);xpAll(e.xp);
 if(e.type==='zombie'&&!e.rz&&R()<.20){const z=spawnE('zombie',e.x,e.y);z.rz=1;z.mhp*=.45;z.hp=z.mhp;z.ri=1.8;E.push(z);txt(e.x,e.y-20,'Встаёт!','#b2d193');}
 const count=e.boss?5:1;for(let i=0;i<count;i++)drop(e.x,e.y,'gold',Math.max(1,Math.ceil(e.g/count)));
 if(R()<.3||e.boss)drop(e.x,e.y,'ore',e.boss?3:1);if(R()<.3||e.boss)drop(e.x,e.y,'wood',e.boss?3:1);
 spawnChest(e.champion?'champion':e.boss?'boss':e.elite?'elite':'normal',e.x,e.y);
 if(e.boss){P.forEach(p=>{if(!p.offline)p.pts++;});txt(e.x,e.y-40,'+1 очко развития','#b0dfdb');}
 QS.k++;if(QS.k>=QS.g){QS.k=0;QS.g+=15;QS.t++;P.forEach(p=>{if(!p.offline)p.gold+=40+QS.t*10;});spawnChest('reward',P[0].x+50,P[0].y);}
 fxr(e.x,e.y,e.r*2,e.c);burst(e.x,e.y,e.c,e.boss?28:10);return true;
};
const spawnBeforeBalance=spawnE;
spawnE=function(type,x,y){const e=spawnBeforeBalance(type,x,y),party=P.filter(p=>!p.offline).length||1;
 const elite=wave>=BAL.enemies.eliteFromWave&&R()<BAL.enemies.eliteChance;
 const stats=Rules.enemyStats(ET[type],wave,party,{elite,hard:sessionSettings.difficulty==='hard'});
 Object.assign(e,{hp:stats.hp,mhp:stats.hp,d:stats.damage,sp:stats.speed,interval:stats.interval,elite,atkcd:.7+R()*.5,special:3+R()*2,turnSign:R()<.5?-1:1,target:0});
 if(elite){e.xp=Math.round(e.xp*1.6);e.g=Math.round(e.g*1.5);e.r*=1.12;}
 return e;
};
const makeBossBeforeBalance=bossE;
bossE=function(i){const e=makeBossBeforeBalance(i),party=P.filter(p=>!p.offline).length||1,stats=Rules.enemyStats({hp:BS[i%7].hp,d:20,sp:BS[i%7].sp},wave,party,{boss:true,hard:sessionSettings.difficulty==='hard'});
 Object.assign(e,{hp:stats.hp,mhp:stats.hp,d:stats.damage,sp:Math.min(100,stats.speed),atkcd:1.5,special:4,interval:1.8,turnSign:1});return e;
};
let nodeGrid=new Map(),indexedNodes=null;
function indexObstacles(){if(indexedNodes===N)return;indexedNodes=N;nodeGrid=new Map();N.forEach(n=>{const key=Math.floor(n.x/100)+':'+Math.floor(n.y/100);if(!nodeGrid.has(key))nodeGrid.set(key,[]);nodeGrid.get(key).push(n);});}
function blockedAt(x,y,e){indexObstacles();if(x<e.r||y<e.r||x>WW-e.r||y>WH-e.r)return true;
 const gx=Math.floor(x/100),gy=Math.floor(y/100);for(let dx=-1;dx<=1;dx++)for(let dy=-1;dy<=1;dy++)for(const n of nodeGrid.get((gx+dx)+':'+(gy+dy))||[]){if(n.rs>0)continue;const r=(n.t==='rock'?22:14)+e.r*.6;if(Math.hypot(x-n.x,y-n.y)<r)return true;}return false;
}
mv=function(e,target,speed,dt){const desired=Math.atan2(target.y-e.y,target.x-e.x)+(speed<0?Math.PI:0),step=Math.abs(speed)*dt,look=Math.max(28,step),sign=e.turnSign||1;
 let best=null,score=-Infinity;for(const offset of [0,.4*sign,-.4*sign,.8*sign,-.8*sign,1.25*sign,-1.25*sign,1.8*sign,-1.8*sign,Math.PI]){
  const angle=desired+offset,nx=e.x+Math.cos(angle)*step,ny=e.y+Math.sin(angle)*step;
  if(blockedAt(nx,ny,e)||blockedAt(e.x+Math.cos(angle)*look,e.y+Math.sin(angle)*look,e))continue;
  const value=Math.cos(offset)+(e.heading===undefined?0:Math.cos(angle-e.heading)*.18);if(value>score){score=value;best={nx,ny,angle};}
 }
 if(best){e.x=cl(best.nx,e.r,WW-e.r);e.y=cl(best.ny,e.r,WH-e.r);e.heading=best.angle;}
 else if(blockedAt(e.x,e.y,e)){ // A spawn or respawned node can overlap an enemy; allow it to escape.
  for(let r=25;r<=100;r+=25){let moved=false;for(let a=0;a<8;a++){const nx=e.x+Math.cos(a*Math.PI/4)*r,ny=e.y+Math.sin(a*Math.PI/4)*r;if(!blockedAt(nx,ny,e)){e.x=nx;e.y=ny;moved=true;break;}}if(moved)break;}
 }
};
sh=function(e,angle,speed,damage,color,r=6){if(S.length>=BAL.enemies.maxProjectiles)return;S.push({x:e.x,y:e.y,fx:SFX[e.type],vx:Math.cos(angle)*speed,vy:Math.sin(angle)*speed,d:damage*(e.boss?(1+wave*.025)*1.18:1),r,c:color,l:5,kind:e.type==='archer'||(e.boss&&e.bi===1)?'physical':'magic'});};
function beginAttack(e,type,target,radius,time,kind='physical'){
 const angle=Math.atan2(target.y-e.y,target.x-e.x);e.attack={type,x:type==='slam'?target.x:e.x,y:type==='slam'?target.y:e.y,r:radius,time,total:time,angle,kind,damage:e.d*(type==='slam'?1.35:1)};
 e.atkcd=e.interval||1.2;
}
function finishAttack(e,attack,players){
 if(attack.type==='bolt'){const spread=e.type==='mage'&&e.elite?[-.2,0,.2]:[0];spread.forEach(offset=>sh(e,attack.angle+offset,e.type==='archer'?255:190,attack.damage,PC[e.type]||e.c,e.type==='archer'?4:7));return;}
 if(attack.type==='charge'){e.charge={time:.55,dx:Math.cos(attack.angle),dy:Math.sin(attack.angle),hits:[]};return;}
 if(attack.type==='pulse'){ring(e,e.elite?10:6,145,e.d*.8,attack.angle);return;}
 players.forEach(p=>{if(Math.hypot(p.x-attack.x,p.y-attack.y)<attack.r+10&&hurt(p,attack.damage,attack.kind)&&SFX[e.type])stat(p,SFX[e.type]);});fxr(attack.x,attack.y,attack.r,e.elite?'#e8bd78':'#dd8d87');
}
const patternBossAI=bossAI;
bossAI=function(e,dt,p,d,angle){if((e.bi===2||e.bi===5)&&e.b>0&&e.b<.8&&!e.blink){e.blink={x:cl(p.x-p.fx*90,40,WW-40),y:cl(p.y-p.fy*90,40,WH-40)};}
 patternBossAI(e,dt,p,d,angle);
};
function enemyAI(e,dt,players){
 if(!E.includes(e)||e.killed||!players.length)return;e.f=Math.max(0,(e.f||0)-dt);if(e.ri>0){e.ri-=dt;return;}
 e.think=(e.think||0)-dt;if(e.think<=0||!players.some(p=>p.i===e.target)){e.think=.35;const target=players.reduce((a,p)=>{const score=q=>Math.hypot(q.x-e.x,q.y-e.y)*(e.rng?(.8+q.hp/q.mhp*.2):1);return score(p)<score(a)?p:a;},players[0]);e.target=target.i;}
 const p=players.find(p=>p.i===e.target)||players[0];if(!p)return;const d=Math.hypot(p.x-e.x,p.y-e.y),angle=Math.atan2(p.y-e.y,p.x-e.x);
 e.atkcd=Math.max(0,(e.atkcd||0)-dt);e.special=(e.special??4)-dt;
 if(e.boss)bossAI(e,dt,p,d,angle);
 if(e.attack){e.attack.time-=dt;if(e.attack.time<=0){const attack=e.attack;e.attack=null;finishAttack(e,attack,players);}return;}
 if(e.charge){const q=e.charge,speed=245,ny=e.y+q.dy*speed*dt,nx=e.x+q.dx*speed*dt;if(!blockedAt(nx,ny,e)){e.x=nx;e.y=ny;}else q.time=0;q.time-=dt;players.forEach(p=>{if(!q.hits.includes(p.i)&&Math.hypot(p.x-e.x,p.y-e.y)<e.r+16){q.hits.push(p.i);hurt(p,e.d*1.2,'physical');}});if(q.time<=0)e.charge=null;return;}
 if(e.special<=0&&!e.boss){
  if(['wolf','stalker','croc','bat'].includes(e.type)&&d<300&&d>65){beginAttack(e,'charge',p,e.r+16,.7);e.special=5.5;return;}
  if(['orc','yeti','treant'].includes(e.type)&&d<190){beginAttack(e,'slam',p,e.elite?100:76,.95);e.special=6;return;}
  if(e.type==='spider'&&d<260&&d>60){beginAttack(e,'bolt',p,10,.8,'magic');e.attack.web=true;e.special=6;return;}
  if(e.type==='goblin'&&d<190&&d>70){beginAttack(e,'bolt',p,10,.65,'physical');e.attack.fan=true;e.special=6.5;return;}
  if(e.type==='sentinel'){beginAttack(e,'pulse',p,100,.9,'magic');e.special=4.5;return;}
  if(e.elite&&d<220){beginAttack(e,'slam',p,70,.85,'magic');e.special=7;return;}
 }
 if(e.boss){if(d<e.r+35&&e.atkcd<=0)beginAttack(e,'melee',p,e.r+35,.65);return;}
 if(e.rng){const distance=e.type==='archer'?260:e.type==='toad'?185:225;
  if(d>distance+35)mv(e,p,e.sp,dt);else if(d<distance-55)mv(e,p,-e.sp*.85,dt);else if(e.type==='wraith'||e.type==='wisp')mv(e,{x:e.x+Math.cos(angle+Math.PI/2)*100,y:e.y+Math.sin(angle+Math.PI/2)*100},e.sp*.45,dt);
  if(e.atkcd<=0&&d<430){beginAttack(e,'bolt',p,10,BAL.enemies.rangedWindup,e.type==='archer'?'physical':'magic');e.atkcd=Math.max(1.1,1.85-wave*.018);}
 }else{
  if(d>e.r+23){const flank=['goblin','spider'].includes(e.type)&&d>90?e.turnSign*.45:0;mv(e,{x:p.x+Math.cos(angle+Math.PI/2)*flank*80,y:p.y+Math.sin(angle+Math.PI/2)*flank*80},e.sp*(e.type==='zombie'&&e.hp<e.mhp*.3?1.25:1),dt);}
  if(d<e.r+32&&e.atkcd<=0)beginAttack(e,'melee',p,e.r+30,BAL.enemies.meleeWindup);
 }
}
stTick=function(dt){P.forEach(p=>{if(!p.st||p.dead)return;for(const key in p.st)p.st[key]=Math.max(0,p.st[key]-dt);if(p.st.poison>0){p.hp=Math.max(0,p.hp-2.5*(1-Rules.stats(p).resist)*dt);p.sinceHit=0;if(!p.hp)p.dead=1;}});};
// Keep action press edges until the host has simulated one frame. A press/release
// pair can arrive in the same frame; movement remains a current-state input.
let pendingRemoteInput={};
function recordRemoteInput(slot,keys,aim){const previous=RK[slot]||[],pending=pendingRemoteInput[slot]||(pendingRemoteInput[slot]={keys:[]});for(let i=4;i<8;i++)if(keys[i]&&!previous[i])pending.keys[i]=1;if(keys[4]&&!previous[4]&&Array.isArray(aim)&&aim.every(Number.isFinite))pending.aim=aim;RK[slot]=keys;}
const keyBeforeLatch=pkey;
pkey=function(p,key,index){if(NET==='host'&&p.i>0&&pendingRemoteInput[p.i]?.keys[index])return true;return keyBeforeLatch(p,key,index);};
const startBeforeInputReset=start;
start=function(c){pendingRemoteInput={};startBeforeInputReset(c);};
const updateBeforeBalance=upd;
upd=function(dt){
 if(NET==='host'&&state==='play')for(const slot in pendingRemoteInput)if(pendingRemoteInput[slot].aim&&P[slot])P[slot].aim=pendingRemoteInput[slot].aim;
 if(NET!=='guest'&&state==='play')P.forEach(p=>{if(p.dead||p.offline)return;const s=Rules.stats(p);p.stamina=cl((p.stamina??s.stamina)+s.staminaRegen*dt,0,s.stamina);p.haste=Math.max(0,(p.haste||0)-dt);p.sinceHit=(p.sinceHit||0)+dt;p.lifeStealClock=(p.lifeStealClock||0)+dt;if(p.lifeStealClock>=1){p.lifeStealClock%=1;p.lifeStolen=0;}p.passiveClock=(p.passiveClock||0)+dt;if(p.passiveClock>=1){p.passiveClock%=1;p.passiveHealed=0;}if(p.sinceHit>=4){const heal=Math.min(p.mhp-p.hp,s.regen*dt,Math.max(0,NYTHRAVEL_PROGRESSION.config.totalRegenCap-(p.passiveHealed||0)));p.hp+=heal;p.passiveHealed=(p.passiveHealed||0)+heal;}});
 updateBeforeBalance(dt);
 if(NET==='host'&&state==='play')pendingRemoteInput={};
 if(PT.length>360)PT.splice(0,PT.length-360);if(F.length>160)F.splice(0,F.length-160);if(T.length>100)T.splice(0,T.length-100);
};
const snapshotBeforeBalance=snap;
snap=function(){const m=JSON.parse(snapshotBeforeBalance());m.rulesVersion=3;m.resources=P.map(p=>({stamina:p.stamina,haste:p.haste,sinceHit:p.sinceHit}));m.combat=E.map(e=>({id:e.id,elite:!!e.elite,target:e.target,attack:e.attack,charge:e.charge?{time:e.charge.time,dx:e.charge.dx,dy:e.charge.dy}:null,blink:e.blink,a:e.a,b:e.b,pulse:e.pulse}));m.ch=CH.map(c=>[Math.round(c.x),Math.round(c.y),c.r,c.source,c.id]);m.projectileKinds=S.map(s=>s.kind);return JSON.stringify(m);};
const applyBeforeBalance=applySnap;
applySnap=function(m){if(m.pg)return applyBeforeBalance(m);if(!Number.isFinite(m.q)||m.q<=lastQ)return;applyBeforeBalance(m);m.resources?.forEach((s,i)=>{if(P[i])Object.assign(P[i],s);});if(m.combat){const map=new Map(m.combat.map(e=>[e.id,e]));E.forEach(e=>Object.assign(e,map.get(e.id)||{}));}m.ch?.forEach((a,i)=>{if(CH[i]){CH[i].source=a[3];CH[i].id=a[4];}});m.projectileKinds?.forEach((kind,i)=>{if(S[i])S[i].kind=kind;});};
const drawEnemyBeforeBalance=en;
en=function(e,t,target){g.save();
 const attack=e.attack;if(attack){const progress=cl(1-attack.time/attack.total,0,1);g.strokeStyle=e.elite?'#f8c774':'#f29c99';g.fillStyle=e.elite?'#deaa492a':'#d85b6830';g.lineWidth=2;
  if(attack.type==='charge'||attack.type==='bolt'){g.translate(e.x,e.y);g.rotate(attack.angle);const width=attack.type==='charge'?e.r*2+16:12,length=attack.type==='charge'?180:320;g.fillRect(0,-width/2,length,width);g.strokeRect(0,-width/2,length,width);}
  else{g.beginPath();g.arc(attack.x,attack.y,attack.r,0,Math.PI*2);g.fill();g.stroke();g.lineWidth=4;g.beginPath();g.arc(attack.x,attack.y,attack.r,-Math.PI/2,-Math.PI/2+Math.PI*2*progress);g.stroke();}
 }
 g.restore();if(e.blink){g.strokeStyle='#b7d2ff';g.lineWidth=2;g.setLineDash([5,4]);g.beginPath();g.arc(e.blink.x,e.blink.y,e.r+35,0,7);g.stroke();g.setLineDash([]);}
 if(e.boss&&((e.a>0&&e.a<.65)||(e.b>0&&e.b<.65)||(e.rift&&e.pulse>0&&e.pulse<.7))){g.strokeStyle='#ffd5aa99';g.lineWidth=2;g.beginPath();g.arc(e.x,e.y,e.r+18,0,7);g.stroke();}
 drawEnemyBeforeBalance(e,t,target);
 if(e.elite){g.strokeStyle='#e6bc75';g.lineWidth=2;g.beginPath();g.arc(e.x,e.y,e.r+5,0,7);g.stroke();g.font='bold 10px sans-serif';g.textAlign='center';g.fillStyle='#ffe1aa';g.fillText('ЭЛИТА',e.x,e.y-e.r-20);}
};
