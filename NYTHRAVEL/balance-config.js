/* The single source of truth for combat, loot and progression. No browser dependency. */
(function(root,factory){const progression=typeof module==='object'&&module.exports?require('./progression-rules'):root.NYTHRAVEL_PROGRESSION;const value=factory(progression);if(typeof module==='object'&&module.exports)module.exports=value;else root.ROS_BALANCE=value;})(globalThis,Progression=>{
 const config={
  enemies:{health:1.4784,damage:2.3125,speed:1.08,maxSpeed:152,waveHealth:.13,waveDamage:.045,waveSpeed:.009,partyHealth:.38,partyDamage:.10,eliteChance:.07,eliteFromWave:3,eliteHealth:1.55,eliteDamage:1.5,attackInterval:1.05,meleeWindup:.42,rangedWindup:.55,maxProjectiles:300},
  bosses:{health:1.2544,damage:1.3924,partyHealth:.5,partyDamage:.08,windup:.85},
  loot:{
   names:['Обычный','Необычный','Редкий','Эпический','Легендарный'],
   colors:['#b9c4d0','#77ca96','#75b8ff','#c499ff','#ffc777'],
   prefixes:['','Закалённый ','Редкий ','Эпический ','Легендарный '],
   // Drop probability and conditional rarity are deliberately separate.
   dropChance:{normal:.003,elite:.02,champion:.10,boss:.30,reward:1},
   rarity:{normal:[.65,.25,.08,.018,.002],elite:[.50,.30,.16,.036,.004],champion:[.45,.33,.18,.036,.004],boss:[.38,.34,.23,.045,.005],reward:[.65,.25,.08,.018,.002]},
   power:[1,1.18,1.45,1.8,2.2],lifetime:110
  },
  progression:{maxForge:Progression.config.forgeMax,maxWeapon:Progression.config.forgeMax,maxAttackShop:5,hpPerLevel:4,damagePerLevel:.65,levelStatCap:30,baseStamina:100,staminaRegen:15,dashCost:32,dashCooldown:4.5,dashDistance:140,maxCrit:.30,maxDodge:.18,maxArmor:.55,maxResist:.45,maxAttackRate:1.85,gearCaps:{hp:220,ar:.40,sp:.30,dm:.60,vp:.10,regen:.4,cooldown:.06,hpPercent:.06}},
  classes:[{damage:1.16,hp:1,speed:1},{damage:1.05,hp:.88,speed:1.12},{damage:1.22,hp:.8,speed:1},{damage:.88,hp:.95,speed:1.04},{damage:.94,hp:1.65,speed:.92}],
  skills:[
   {key:'dmg',name:'Сила',branch:'attack',max:8,costs:[1,1,2,2,3,3,4,4],description:'+2 физического урона за ранг'},
   {key:'arcane',name:'Тайная сила',branch:'attack',max:8,costs:[1,1,2,2,3,3,4,4],description:'+2,2 магического урона за ранг'},
   {key:'crit',name:'Меткость',branch:'attack',max:6,costs:[2,2,3,3,4,4],any:[['dmg',2],['arcane',2]],description:'+2,5% шанса критического удара; множитель ×1,65'},
   {key:'vamp',name:'Похищение жизни',branch:'attack',max:5,costs:[2,3,4,5,6],requires:[['crit',2]],description:'0,5% фактического урона за ранг; максимум 1,5% HP в секунду'},
   {key:'attackSpeed',name:'Боевой ритм',branch:'attack',max:4,costs:[1,2,3,4],description:'+5% скорости атаки за ранг'},
   {key:'hp',name:'Живучесть',branch:'defense',max:8,costs:[1,1,2,2,3,3,4,4],description:'+12 базового здоровья за ранг; учитывает класс'},
   {key:'armor',name:'Стальная кожа',branch:'defense',max:5,costs:[1,2,2,3,4],description:'+2,5% снижения физического урона за ранг'},
   {key:'resist',name:'Оберег',branch:'defense',max:4,costs:[1,2,3,4],description:'+3,5% сопротивления магии и яду за ранг'},
   {key:'regen',name:'Второе дыхание',branch:'defense',max:4,costs:[1,2,3,4],requires:[['hp',1]],description:'+0,25 HP/с за ранг после 4 секунд без урона'},
   {key:'heal',name:'Исцеление',branch:'defense',max:3,costs:[2,3,4],requires:[['hp',2]],description:'R: 18% + 4% HP за ранг, союзникам половина; расход выносливости 24'},
   {key:'spd',name:'Ловкость',branch:'mobility',max:5,costs:[1,2,2,3,4],description:'+3,5% скорости передвижения за ранг'},
   {key:'dodge',name:'Уклонение',branch:'mobility',max:4,costs:[1,2,3,4],requires:[['spd',1]],description:'+2,5% шанса избежать удара за ранг'},
   {key:'dash',name:'Рывок',branch:'mobility',max:3,costs:[1,2,3],description:'Q: 140 единиц, 0,3 с неуязвимости; 32 выносливости'},
   {key:'haste',name:'Попутный ветер',branch:'mobility',max:3,costs:[2,3,4],requires:[['dash',1]],description:'+5% скорости за ранг на 2 секунды после рывка'},
   {key:'recovery',name:'Равновесие',branch:'mobility',max:4,costs:[1,2,3,4],description:'+2 выносливости в секунду за ранг'},
   {key:'endurance',name:'Запас сил',branch:'mobility',max:4,costs:[1,2,3,4],description:'+10 максимальной выносливости за ранг'},
   {key:'nova',name:'Нова',branch:'class',max:4,costs:[2,3,4,5],requires:[['arcane',2]],description:'E: магический взрыв, 30 выносливости; 9 с перезарядки'},
   {key:'bladecraft',name:'Мастер клинка',branch:'class',class:0,max:4,costs:[2,3,4,5],requires:[['dmg',2]],description:'+5% урона мечом и усиление отталкивания за ранг'},
   {key:'fletching',name:'Искусство стрел',branch:'class',class:1,max:4,costs:[2,3,4,5],requires:[['dmg',2]],description:'+4% урона луком за ранг; +1 пробитие на рангах 2 и 4'},
   {key:'spellcraft',name:'Рунический фокус',branch:'class',class:2,max:4,costs:[2,3,4,5],requires:[['arcane',2]],description:'+5% магического урона за ранг, усиление новы'},
   {key:'devotion',name:'Преданность',branch:'class',class:3,max:4,costs:[2,3,4,5],requires:[['heal',1]],description:'+8% эффективности лечения и ауры за ранг'},
   {key:'bulwark',name:'Несокрушимый',branch:'class',class:4,max:4,costs:[2,3,4,5],requires:[['armor',2]],description:'+2% дополнительной защиты за ранг; лечение даёт щит на 2 с'}
  ]
 };
 const clamp=(v,a,b)=>Math.max(a,Math.min(b,v));
 const rank=(p,k)=>Math.max(0,Number(p.up?.[k])||0);
 function skill(key){return config.skills.find(s=>s.key===key);}
 function skillCost(p,key){const s=skill(key),r=rank(p,key);return !s||r>=s.max?Infinity:s.costs[r];}
 function requirements(p,s){return !!s&&(s.class===undefined||s.class===(p.cl||0))&&(!s.requires||s.requires.every(([k,n])=>rank(p,k)>=n))&&(!s.any||s.any.some(([k,n])=>rank(p,k)>=n));}
 function canUpgrade(p,key){const s=skill(key);return !!p&&!p.dead&&!p.offline&&requirements(p,s)&&rank(p,key)<s.max&&p.pts>=skillCost(p,key);}
 function buyUpgrade(p,key){if(!canUpgrade(p,key))return false;p.pts-=skillCost(p,key);p.up[key]=rank(p,key)+1;return true;}
 function gear(p,k){let total=0;for(const item of Object.values(p.eq||{})){if(item.s==='weapon'&&item.weapon!==(p.w||0))continue;if(item.class!==undefined&&item.class!==(p.cl||0))continue;if(item.minLevel&&(p.lvl||1)<item.minLevel)continue;total+=Number(item?.[k])||0;}return clamp(total,0,config.progression.gearCaps[k]??1);}
 function stats(p){const c=config.classes[p.cl||0],s=config.progression,w=p.w||0;
  const forge=Progression.forgeLevel(p,w),base=(10+Math.min(Math.max(0,(p.lvl||1)-1),s.levelStatCap)*s.damagePerLevel)*(1+forge*Progression.config.forgeStep);
  const power=(kind)=>{const talent=(p.cl===0&&w===0&&kind==='physical'?rank(p,'bladecraft')*.05:p.cl===1&&w===1&&kind==='physical'?rank(p,'fletching')*.04:p.cl===2&&kind==='magic'?rank(p,'spellcraft')*.05:0);return (base+rank(p,kind==='magic'?'arcane':'dmg')*(kind==='magic'?2.2:2))*c.damage*(1+gear(p,'dm')+talent+(p.bf?.dm>0?.35:0));};
  return {physical:power('physical'),magic:power('magic'),hp:Math.round((100+rank(p,'hp')*12+Math.min(Math.max(0,(p.lvl||1)-1),s.levelStatCap)*s.hpPerLevel)*c.hp*(1+gear(p,'hpPercent'))+gear(p,'hp')),
   armor:clamp(gear(p,'ar')+rank(p,'armor')*.025,0,s.maxArmor),resist:clamp(rank(p,'resist')*.035,0,s.maxResist),crit:clamp(.05+rank(p,'crit')*.025,0,s.maxCrit),dodge:clamp(rank(p,'dodge')*.025,0,s.maxDodge),
   speed:170*c.speed*(1+rank(p,'spd')*.035+gear(p,'sp')+(p.bf?.sp>0?.2:0)+(p.haste>0?rank(p,'haste')*.05:0)),
   attackRate:Math.min(s.maxAttackRate,1+Math.min(p.asu||0,s.maxAttackShop)*.07+rank(p,'attackSpeed')*.05),stamina:s.baseStamina+rank(p,'endurance')*10,staminaRegen:s.staminaRegen+rank(p,'recovery')*2+gear(p,'vp')*100,regen:Math.min(1.2,rank(p,'regen')*.25+gear(p,'regen')),cooldown:gear(p,'cooldown')};
 }
 function enemyStats(base,wave,party,{elite=false,hard=false,boss=false}={}){const e=config.enemies,b=config.bosses,n=clamp(party,1,3)-1,stage=Math.max(0,wave);return {
  hp:Math.round(base.hp*(boss?b.health:e.health)*(1+stage*(boss?.075:e.waveHealth))*(1+n*(boss?b.partyHealth:e.partyHealth))*(elite?e.eliteHealth:1)*(hard?1.16:1)),
  damage:base.d*(boss?b.damage:e.damage)*(1+stage*e.waveDamage)*(1+n*(boss?b.partyDamage:e.partyDamage))*(elite?e.eliteDamage:1)*(hard?1.16:1),
  speed:Math.min(e.maxSpeed,base.sp*e.speed*(1+Math.min(.18,stage*e.waveSpeed))*(elite?1.04:1)),
  interval:Math.max(.85,e.attackInterval/(1+stage*.012))
 };}
 function pickRarity(source='normal',rng=Math.random){const weights=config.loot.rarity[source]||config.loot.rarity.normal;let roll=rng()*weights.reduce((a,b)=>a+b,0);for(let i=0;i<weights.length;i++){roll-=weights[i];if(roll<0)return i;}return weights.length-1;}
 function rollDrop(source='normal',rng=Math.random){if(rng()>=(config.loot.dropChance[source]??config.loot.dropChance.normal))return null;return {rarity:pickRarity(source,rng),source};}
 function makeItem(r,wave=1,rng=Math.random){r=clamp(r|0,0,4);const slots=['helm','armor','boots','amu','ring'],names=['Шлем','Доспех','Сапоги','Амулет','Кольцо'];const i=Math.min(4,Math.floor(rng()*5)),m=config.loot.power[r]*(1+Math.min(30,Math.max(0,wave))*.015);const prefix=config.loot.prefixes[r],agree=i===2?prefix.replace(/ый /,'ые ').replace(/ий /,'ие '):i===4?prefix.replace(/ый /,'ое ').replace(/ий /,'ое '):prefix;const it={s:slots[i],n:agree+(r?names[i].toLowerCase():names[i]),r,t:r>=3?3:r>=2?2:1};
  if(i===0)it.hp=Math.round(24*m);if(i===1)it.ar=Math.min(.18,.045*m);if(i===2)it.sp=Math.min(.12,.035*m);if(i===3)it.dm=Math.min(.23,.065*m);if(i===4)it.vp=Math.min(.04,.012*m);
  if(r>=2){const count=r===4?2:1;const pool=['hp','dm','sp','vp'];for(let j=0;j<count;j++){const key=pool.splice(Math.min(pool.length-1,Math.floor(rng()*pool.length)),1)[0];it[key]=(it[key]||0)+(key==='hp'?Math.round(6*m):key==='dm'?.015*m:key==='sp'?.01*m:.003*m);}}
  return it;
 }
 return {config,skill,rank,skillCost,requirements,canUpgrade,buyUpgrade,gear,stats,enemyStats,pickRarity,rollDrop,makeItem};
});
