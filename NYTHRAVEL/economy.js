/* Atomic inventory/economy domain, executed by Node for network sessions. */
(function(root,factory){const C=typeof module==='object'&&module.exports?require('./catalogue'):root.NYTHRAVEL_CATALOGUE;const R=typeof module==='object'&&module.exports?require('./progression-rules'):root.NYTHRAVEL_PROGRESSION;const api=factory(C,R);if(typeof module==='object'&&module.exports)module.exports=api;else root.NYTHRAVEL_ECONOMY=api;})(globalThis,(C,R)=>{
 const copy=x=>JSON.parse(JSON.stringify(x));
 class Economy {
  constructor(profiles,{uuid,now}={}){let counter=0;this.now=now||Date.now;this.uuid=uuid||(()=>globalThis.crypto?.randomUUID?.()||'item-'+Date.now().toString(36)+'-'+(++counter));this.players={};this.context={};this.trades={};this.revision=0;this.ackWorld=0;this.effectId=0;this.lastActions={};profiles.forEach(p=>{this.players[p.slot]={gold:0,souls:0,wood:0,ore:0,dust:0,quests:{},discovered:[],tradeStage:1,consumableReady:{},bag:[],eq:{},wp:0,wl:[0,0,0,0,0],asu:0,bt:{}};this.context[p.slot]={cl:p.cl||0,lvl:1,dead:false,x:3600,y:2400};});}
  setContext(slot,context){if(!this.players[slot])return;this.context[slot]={...this.context[slot],...context};const p=this.players[slot],c=this.context[slot];p.tradeStage=Math.max(p.tradeStage||1,R.tradeStage(c.wave));if(c.wave>=4)this.recordProgress(slot,{kind:'stage',amount:1});if(c.dead||c.offline)return;const points=[['camp',2500,2150],['ruins',4700,1950],['grove',1500,2800],['watch',3800,850],['marsh',6100,3800],['mine',5400,1150]];for(const [id,x,y] of points)if(Math.hypot(c.x-x,c.y-y)<140&&!p.discovered.includes(id)){p.discovered.push(id);this.recordProgress(slot,{kind:'explore',amount:1});if(id==='ruins')this.recordProgress(slot,{kind:'ruins',amount:1});}}
  recordProgress(slot,event){const p=this.players[slot];if(!p)return;for(const q of R.quests)if(q.kind===event.kind){const current=p.quests[q.id]||(p.quests[q.id]={progress:0,claimed:false});current.progress=Math.min(q.goal,current.progress+Math.max(0,event.amount||0));}}

  locked(uid){return Object.values(this.trades).some(t=>Object.values(t.offers).some(o=>o.items.includes(uid)));}
  mint(item){let result;if(item.catalogId){result=C.make(item.catalogId);if(!result||result.r!==item.r)throw Error('Неизвестный предмет.');}else{
    if(!['helm','armor','boots','amu','ring','weapon','gloves','talisman'].includes(item.s)||!Number.isInteger(item.r)||item.r<0||item.r>4||typeof item.n!=='string'||item.n.length>100)throw Error('Некорректный предмет.');
    result={s:item.s,r:item.r,n:item.n,t:Math.max(1,Math.min(3,item.t||1))};for(const key of ['hp','ar','sp','dm','vp'])if(item[key]!==undefined){if(!Number.isFinite(item[key])||item[key]<0||item[key]>(key==='hp'?300:1))throw Error('Некорректные характеристики.');result[key]=item[key];}
   }return {...result,uid:this.uuid(),favorite:false};}
  worldDelta(seq,deltas){if(seq<=this.ackWorld)return {ok:true,duplicate:true};if(seq!==this.ackWorld+1||!Array.isArray(deltas)||deltas.length>3)return {ok:false,message:'Неверная последовательность наград.'};try{
    const planned=deltas.map(d=>{if(!this.players[d.slot])throw Error('Нет игрока.');for(const key of ['gold','souls','wood','ore','dust'])if(!Number.isSafeInteger(d[key]||0)||(d[key]||0)<0||(d[key]||0)>50000)throw Error('Неверная награда.');if(!Array.isArray(d.items)||d.items.length>24)throw Error('Неверная добыча.');if(d.events&&(!Array.isArray(d.events)||d.events.length>20||d.events.some(e=>!['kill','slime','elite','boss'].includes(e.kind)||!Number.isSafeInteger(e.amount)||e.amount<1||e.amount>100)))throw Error('Некорректное событие задания.');return {d,items:d.items.map(i=>this.mint(i))};});
    for(const {d,items} of planned){const p=this.players[d.slot];p.gold+=d.gold||0;p.souls+=d.souls||0;p.wood+=d.wood||0;p.ore+=d.ore||0;p.dust+=d.dust||0;for(const event of d.events||[])this.recordProgress(d.slot,event);for(const item of items){if(p.bag.length<24)p.bag.push(item);else p.gold+=C.sellPrice(item);}}
    this.ackWorld=seq;this.revision++;return {ok:true};
   }catch(error){return {ok:false,message:error.message};}}
  cancelFor(slot){for(const [id,t] of Object.entries(this.trades))if(t.slots.includes(slot))delete this.trades[id];this.revision++;}
  snapshot(){const players=copy(this.players);for(const p of Object.values(players))for(const item of p.bag)item.locked=this.locked(item.uid);return {revision:this.revision,ackWorld:this.ackWorld,players,trades:copy(this.trades)};}
  act(slot,m){const p=this.players[slot];if(!p)return {ok:false,message:'Игрок отключён.'};if(!Number.isSafeInteger(m.id)||m.id<= (this.lastActions[slot]||0))return {ok:false,message:'Повторная операция.'};this.lastActions[slot]=m.id;
   try{if(this.context[slot].dead&&['equip','buy','use','legacyGear','legacyBuff','legacyBuy','legacyUpgrade','forge'].includes(m.kind))throw Error('Персонаж погиб.');let effect=null;const get=uid=>{const item=p.bag.find(i=>i.uid===uid);if(!item)throw Error('Предмет больше не находится в сумке.');return item;};
    const movable=item=>{if(item.favorite||this.locked(item.uid))throw Error('Избранный или заблокированный предмет защищён.');};
    if(m.kind==='favorite'){const item=get(m.uid);if(this.locked(item.uid))throw Error('Предмет участвует в обмене.');item.favorite=!item.favorite;}
    else if(m.kind==='sell'){
     if(!Array.isArray(m.items)||!m.items.length||new Set(m.items).size!==m.items.length)throw Error('Выберите разные предметы для продажи.');const items=m.items.map(get);items.forEach(movable);const value=items.reduce((n,i)=>n+C.sellPrice(i),0);p.bag=p.bag.filter(i=>!m.items.includes(i.uid));p.gold+=value;
    }else if(m.kind==='equip'){
     const item=get(m.uid);if(this.locked(item.uid))throw Error('Предмет заблокирован обменом.');if(['consumable','material'].includes(item.s))throw Error('Расходник нельзя надеть.');if(!C.canUse(item,this.context[slot]))throw Error('Не выполнены требования класса или уровня.');
     if(item.unique&&Object.entries(p.eq).some(([slot,other])=>slot!==item.s&&other.unique===item.unique))throw Error('Уникальный эффект уже надет.');const old=p.eq[item.s];p.bag=p.bag.filter(i=>i.uid!==item.uid);if(old)p.bag.push(old);p.eq[item.s]=item;
    }else if(m.kind==='unequip'){
     const item=p.eq[m.slot];if(!item||p.bag.length>=24)throw Error('Нет предмета или сумка заполнена.');p.bag.push(item);delete p.eq[m.slot];
    }else if(m.kind==='buy'){
     const item=C.find(m.catalogId),context=this.context[slot];if(!item)throw Error('Нет товара.');if(Math.hypot(context.x-C.merchant.x,context.y-C.merchant.y)>C.merchant.range)throw Error('Подойдите к торговцу в стартовом биоме.');if((p.tradeStage||1)<item.stage)throw Error('Товар откроется на торговом этапе '+item.stage+'.');if(p.gold<item.buy||p.souls<(item.soulPrice||0)||p.wood<(item.materials?.wood||0)||p.ore<(item.materials?.ore||0)||item.s!=='material'&&p.bag.length>=24)throw Error('Недостаточно валюты, материалов или места.');p.gold-=item.buy;p.souls-=item.soulPrice||0;p.wood-=item.materials?.wood||0;p.ore-=item.materials?.ore||0;if(item.s==='material'){p[item.effect.resource]=(p[item.effect.resource]||0)+item.effect.amount;}else p.bag.push(this.mint(C.make(item.id)));
    }else if(m.kind==='use'){
     const item=get(m.uid);if(this.locked(item.uid))throw Error('Предмет заблокирован обменом.');if(!item.effect||this.context[slot].dead)throw Error('Этот предмет нельзя использовать.');if(item.effect.cooldown&&(p.consumableReady[item.catalogId]||0)>this.now())throw Error('Осколок восстановления ещё перезаряжается.');if(item.effect.cooldown)p.consumableReady[item.catalogId]=this.now()+item.effect.cooldown*1000;p.bag=p.bag.filter(i=>i.uid!==item.uid);effect={id:++this.effectId,slot,...item.effect};
    }else if(m.kind==='legacyGear'){
     const groups=[['helm','Кожаный шлем','Железный шлем','Мифриловый шлем'],['armor','Кожаная броня','Кольчуга','Латы'],['boots','Лёгкие сапоги','Сапоги ветра','Сапоги бури'],['amu','Амулет силы','Амулет ярости','Амулет титана'],['ring','Кольцо вампира','Кольцо крови','Кольцо тьмы']],g=groups[m.group];if(!g)throw Error('Нет товара.');const level=p.bt[g[0]]||0,cost=[70,260,950][level]+m.group*12;if(level>=3||p.gold<cost||p.bag.length>=24)throw Error('Недостаточно золота, места или достигнут максимум.');const item={s:g[0],n:g[level+1],r:Math.min(level,2),t:level+1};item[['hp','ar','sp','dm','vp'][m.group]]=[[12,28,55],[.035,.075,.13],[.025,.06,.1],[.04,.09,.15],[.01,.02,.035]][m.group][level];p.gold-=cost;p.bt[g[0]]=level+1;p.bag.push(this.mint(item));
    }else if(m.kind==='legacyBuff'){
     const prices={dm:40,sp:30,sh:40,xp:50},cost=prices[m.key];if(!cost||p.gold<cost)throw Error('Недостаточно золота.');p.gold-=cost;effect={id:++this.effectId,slot,type:'buff',key:m.key,duration:45};
    }else if(m.kind==='legacyBuy'){
     if(m.what==='pot'){if(p.gold<25)throw Error('Недостаточно золота.');p.gold-=25;effect={id:++this.effectId,slot,type:'heal',amount:1};}
     else if(m.what==='forge'){if(!R.forge(p,this.context[slot].weapon||0))throw Error('Недостаточно ресурсов или максимум кузницы.');this.recordProgress(slot,{kind:'forge',amount:1});}else throw Error('Нет покупки.');
    }else if(m.kind==='forge'){
     if(!R.forge(p,m.weapon))throw Error('Недостаточно ресурсов или максимум кузницы.');this.recordProgress(slot,{kind:'forge',amount:1});
    }else if(m.kind==='claimQuest'){
     const quest=R.quests.find(q=>q.id===m.quest),status=p.quests[m.quest];if(!quest||!status||status.claimed||status.progress<quest.goal)throw Error('Задание ещё не выполнено или награда уже получена.');status.claimed=true;p.gold+=quest.gold;p.souls+=quest.souls||0;effect={id:++this.effectId,slot,type:'quest',quest:quest.id,gold:quest.gold,souls:quest.souls||0};
    }else if(m.kind==='legacyUpgrade'){
     if(m.key==='wl'){if(!R.forge(p,m.weapon))throw Error('Недостаточно ресурсов или максимум заточки.');this.recordProgress(slot,{kind:'forge',amount:1});}
     else if(m.key==='as'){const n=p.asu+1;if(n>5||p.gold<40*n)throw Error('Недостаточно золота или максимум скорости.');p.gold-=40*n;p.asu=n;}else throw Error('Нет улучшения.');
    }else if(m.kind==='invite'){
     const target=Number(m.target);if(target===slot||!this.players[target]||this.context[target].offline)throw Error('Игрок недоступен.');if(Object.values(this.trades).some(t=>t.slots.includes(slot)||t.slots.includes(target)))throw Error('Один из игроков уже занят обменом.');const id=this.uuid();this.trades[id]={id,slots:[slot,target],state:'invited',version:0,offers:{[slot]:{items:[],gold:0},[target]:{items:[],gold:0}},confirmed:[]};
    }else if(['accept','cancel','offer','confirm'].includes(m.kind)){
     const t=this.trades[m.trade];if(!t||!t.slots.includes(slot))throw Error('Обмен уже закрыт.');
     if(m.kind==='cancel')delete this.trades[t.id];
     else if(m.kind==='accept'){if(t.state!=='invited'||t.slots[1]!==slot)throw Error('Нельзя принять запрос.');t.state='active';}
     else if(t.state!=='active')throw Error('Сначала примите приглашение.');
     else if(m.kind==='offer'){
      if(!Array.isArray(m.items)||new Set(m.items).size!==m.items.length||!Number.isSafeInteger(m.gold)||m.gold<0||m.gold>p.gold)throw Error('Неверное предложение.');const items=m.items.map(get);for(const item of items){if(item.favorite)throw Error('Избранное защищено от обмена.');const otherTrade=Object.values(this.trades).find(other=>other.id!==t.id&&Object.values(other.offers).some(o=>o.items.includes(item.uid)));if(otherTrade)throw Error('Предмет уже заблокирован.');}t.offers[slot]={items:m.items.slice(),gold:m.gold};t.confirmed=[];t.version++;
     }else if(m.kind==='confirm'){
      if(m.version!==t.version)throw Error('Предложение изменилось. Подтвердите заново.');const confirmed=t.confirmed.includes(slot)?t.confirmed.slice():t.confirmed.concat(slot);
      if(confirmed.length===2){const [a,b]=t.slots,pa=this.players[a],pb=this.players[b],oa=t.offers[a],ob=t.offers[b];
       if(!pa||!pb||this.context[a].offline||this.context[b].offline||pa.gold<oa.gold||pb.gold<ob.gold)throw Error('Игрок или золото больше недоступны.');
       const resolve=(owner,offer)=>offer.items.map(uid=>{const item=owner.bag.find(i=>i.uid===uid);if(!item||item.favorite)throw Error('Предмет больше недоступен.');return item;});const ia=resolve(pa,oa),ib=resolve(pb,ob);
       if(pa.bag.length-ia.length+ib.length>24||pb.bag.length-ib.length+ia.length>24){throw Error('Недостаточно свободного места.');}
       const bagA=pa.bag.filter(i=>!oa.items.includes(i.uid)).concat(ib),bagB=pb.bag.filter(i=>!ob.items.includes(i.uid)).concat(ia),goldA=pa.gold-oa.gold+ob.gold,goldB=pb.gold-ob.gold+oa.gold;
       pa.bag=bagA;pb.bag=bagB;pa.gold=goldA;pb.gold=goldB;delete this.trades[t.id];
      }else t.confirmed=confirmed;
     }
    }else throw Error('Неизвестная операция.');
    this.revision++;return {ok:true,effect};
   }catch(error){return {ok:false,message:error.message};}
  }
 }
 return {Economy};
});
