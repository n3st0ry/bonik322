const {test}=require('node:test');
const assert=require('node:assert/strict');
const Rules=require('../balance-config');
function rng(seed){return ()=>{seed|=0;seed=seed+0x6D2B79F5|0;let t=Math.imul(seed^seed>>>15,1|seed);t=t+Math.imul(t^t>>>7,61|t)^t;return ((t^t>>>14)>>>0)/4294967296;};}
function player(cl=0){return {cl,w:cl===2||cl===3?2:cl===1?1:0,lvl:1,pts:100,up:Object.fromEntries(Rules.config.skills.map(s=>[s.key,0])),eq:{},wp:0,wl:[0,0,0,0,0]};}
test('One million normal rarity rolls plus source-specific distributions',()=>{
 for(const [source,weights] of Object.entries(Rules.config.loot.rarity)){
  const n=source==='normal'?1000000:250000,random=rng(1234),counts=[0,0,0,0,0];
  for(let i=0;i<n;i++)counts[Rules.pickRarity(source,random)]++;
  for(let i=0;i<5;i++){const expected=n*weights[i],tolerance=7*Math.sqrt(n*weights[i]*(1-weights[i]))+2;assert(Math.abs(counts[i]-expected)<tolerance,`${source} rank ${i}: ${counts[i]}`);}
  console.log('RARITY',source,counts.map(x=>(100*x/n).toFixed(4)+'%').join(' / '));
 }
});
test('Drop probability is independent of rarity; bosses/elite improve both chances',()=>{
 for(const [source,chance] of Object.entries(Rules.config.loot.dropChance)){
  const random=rng(5678),n=200000;let dropped=0;
  for(let i=0;i<n;i++)if(Rules.rollDrop(source,random))dropped++;
  assert(Math.abs(dropped/n-chance)<.004,source);console.log('DROP',source,(100*dropped/n).toFixed(3)+'%');
 }
 assert(Rules.config.loot.dropChance.boss>Rules.config.loot.dropChance.elite);
 assert(Rules.config.loot.rarity.boss[4]>Rules.config.loot.rarity.normal[4]);
 assert.equal(Rules.rollDrop('normal',()=>.99),null);
});
test('All item tiers and slots remain finite and bounded, even on late waves',()=>{
 const random=rng(55),slots=new Set();for(let r=0;r<5;r++)for(let i=0;i<2000;i++){
  const item=Rules.makeItem(r,100000,random);slots.add(item.s);assert.equal(item.r,r);assert(item.n.length>0);for(const [k,v] of Object.entries(item))if(typeof v==='number')assert(Number.isFinite(v),k);assert((item.hp||0)<=100);assert((item.dm||0)<.4);assert((item.vp||0)<.07);
 }assert.equal(slots.size,5);
});
test('Upgrade transactions enforce real costs, prerequisites, class and caps',()=>{
 const p=player();p.pts=1;assert(!Rules.buyUpgrade(p,'nova'));assert(!Rules.buyUpgrade(p,'missing'));assert.equal(p.pts,1);
 assert(Rules.buyUpgrade(p,'dmg'));assert.equal(p.pts,0);assert(!Rules.buyUpgrade(p,'dmg'));p.pts=100;assert(Rules.buyUpgrade(p,'dmg'));assert.equal(Rules.skillCost(p,'dmg'),2);
 const points=p.pts;assert(Rules.buyUpgrade(p,'crit'));assert.equal(p.pts,points-2);
 assert(!Rules.buyUpgrade(p,'spellcraft'));
 while(Rules.buyUpgrade(p,'dmg')){}assert.equal(p.up.dmg,8);const remaining=p.pts;assert(!Rules.buyUpgrade(p,'dmg'));assert.equal(p.pts,remaining);
 p.dead=1;assert(!Rules.buyUpgrade(p,'hp'));
});
test('Each branch changes its actual combat statistics; every class has a viable talent',()=>{
 const p=player(),before=Rules.stats(p);p.up.hp=2;p.up.armor=2;p.up.resist=2;p.up.regen=2;p.up.spd=2;p.up.dodge=2;p.up.attackSpeed=2;p.up.endurance=2;p.up.recovery=2;p.up.dmg=2;p.up.arcane=2;const after=Rules.stats(p);
 for(const key of ['physical','magic','hp','armor','resist','regen','speed','dodge','attackRate','stamina','staminaRegen'])assert(after[key]>before[key],key);
 for(let cl=0;cl<5;cl++){const p=player(cl),talent=Rules.config.skills.find(s=>s.class===cl);for(const [key,value] of talent.requires)p.up[key]=value;assert(Rules.buyUpgrade(p,talent.key));}
});
test('Armor, lifesteal, attack rate and cheap permanent power have hard limits',()=>{
 const p=player(4);p.up.armor=5;p.up.attackSpeed=4;p.asu=999;p.wp=999;p.wl=[999,999,999,999,999];p.lvl=999;for(let i=0;i<5;i++)p.eq[i]={ar:100,vp:100,dm:100,hp:1000,sp:100};
 const s=Rules.stats(p);assert(s.armor<=Rules.config.progression.maxArmor);assert(s.attackRate<=Rules.config.progression.maxAttackRate);assert(Rules.gear(p,'vp')<=.1);assert(s.physical<200);assert(s.hp<700);
 const capped={...p,lvl:31,wp:8,wl:[10,10,10,10,10]};assert.equal(Rules.stats(capped).physical,s.physical);assert.equal(Rules.stats(capped).hp,s.hp);
});
test('Enemy growth supports solo, two and three players without runaway movement speed',()=>{
 const base={hp:40,d:8,sp:110};let previous=0;for(let party=1;party<=3;party++){const s=Rules.enemyStats(base,5,party);assert(s.hp>previous);previous=s.hp;assert(s.speed<=Rules.config.enemies.maxSpeed);}
 const first=Rules.enemyStats(base,1,1),later=Rules.enemyStats(base,10,1),elite=Rules.enemyStats(base,10,1,{elite:true}),hard=Rules.enemyStats(base,10,1,{hard:true});assert(later.hp>first.hp);assert(later.damage>first.damage);assert(elite.damage>later.damage);assert(hard.damage>later.damage);assert(Rules.enemyStats(base,1000,3).speed<=Rules.config.enemies.maxSpeed);
});
