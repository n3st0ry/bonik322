(function(root,factory){const api=factory();if(typeof module==='object'&&module.exports)module.exports=api;else root.NYTHRAVEL_PROGRESSION=api;})(globalThis,()=>{
 const config={forgeMax:5,forgeStep:.02,gearRegenCap:.4,totalRegenCap:1.2,cooldownCap:.06,hpPercentCap:.06,souls:{elite:1,champion:3,boss:8},shardCooldown:60};
 const quests=[
 {id:'hunt',name:'Дорога под охраной',description:'Победите 10 врагов вместе с находящейся рядом группой.',kind:'kill',goal:10,gold:40,group:true},
 {id:'slimes',name:'Слизь у порога',description:'Победите 6 слизней рядом с группой.',kind:'slime',goal:6,gold:35,group:true},
 {id:'elites',name:'Опасные противники',description:'Победите 3 элитных врагов рядом с группой.',kind:'elite',goal:3,gold:90,souls:1,group:true},
 {id:'wood',name:'Запас древесины',description:'Лично добудьте 20 древесины топором.',kind:'wood',goal:20,gold:35},
 {id:'ore',name:'Камень для мастера',description:'Лично добудьте 15 камня киркой.',kind:'ore',goal:15,gold:40},
 {id:'ruins',name:'Следы древних',description:'Лично посетите Старый акведук.',kind:'ruins',goal:1,gold:45},
 {id:'explore',name:'Карта странника',description:'Лично исследуйте четыре точки вне приюта.',kind:'explore',goal:4,gold:80,souls:1},
 {id:'stage',name:'Первый рубеж',description:'Пройдите первый этап вместе с группой.',kind:'stage',goal:1,gold:80,group:true},
 {id:'boss',name:'Падение стража',description:'Победите босса рядом с группой.',kind:'boss',goal:1,gold:150,souls:2,group:true},
 {id:'forge',name:'Работа мастера',description:'Один раз улучшите оружие в кузнице.',kind:'forge',goal:1,gold:25}
 ];
 function forgeLevel(p,w=p.w||0){return Math.max(0,Math.min(config.forgeMax,Math.max(Number(p.wp)||0,Number(p.wl?.[w])||0)));}
 function forgeCost(level){const n=level+1;return {gold:25*n*n,wood:3*n,ore:4*n,dust:Math.max(0,n-3)};}
 function canForge(p,w=p.w||0){const cost=forgeCost(forgeLevel(p,w));return Number.isInteger(w)&&w>=0&&w<=4&&forgeLevel(p,w)<config.forgeMax&&Object.entries(cost).every(([k,v])=>(p[k]||0)>=v);}
 function forge(p,w=p.w||0){if(!canForge(p,w))return false;const level=forgeLevel(p,w),cost=forgeCost(level);for(const [k,v] of Object.entries(cost))p[k]=(p[k]||0)-v;p.wl=p.wl||[0,0,0,0,0];p.wl[w]=level+1;return true;}
 function tradeStage(wave){return Math.min(5,1+Math.floor(Math.max(0,(wave||0)-1)/3));}
 return {config,quests,forgeLevel,forgeCost,canForge,forge,tradeStage};
});
