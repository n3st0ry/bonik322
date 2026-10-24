const {chromium}=require('playwright');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const {createGameServer}=require('../server');
(async()=>{
 const {server,wss}=createGameServer();await new Promise(r=>server.listen(0,'127.0.0.1',r));const base=`http://127.0.0.1:${server.address().port}`;
 const browser=await chromium.launch({headless:true,executablePath:process.env.CHROMIUM_PATH||(fs.existsSync('/usr/bin/chromium')?'/usr/bin/chromium':undefined),args:['--no-sandbox']});const errors=[];
 const page=async(width=1440,height=900)=>{const c=await browser.newContext({viewport:{width,height}}),p=await c.newPage();p.on('pageerror',e=>{errors.push(e.message);console.error('BROWSER:',e.message);});await p.goto(base);await p.waitForFunction(()=>document.getElementById('bootScreen')?.hidden===true);return p;};
 const wait=(p,fn)=>p.waitForFunction(fn,null,{timeout:10000});
 try{
 const p=await page();await p.waitForTimeout(1000);await p.screenshot({path:'test-results/menu-v3.png'});
 await p.getByRole('button',{name:'Об игре',exact:true}).click();assert(await p.locator('#about').isVisible());await p.locator('#about').getByRole('button',{name:'Назад',exact:true}).click();
 await p.getByRole('button',{name:'Настройки',exact:true}).click();await p.locator('#quality').selectOption('low');await p.getByRole('button',{name:'Сохранить и закрыть'}).click();assert.equal(await p.evaluate(()=>quality),'low');
 await p.getByRole('button',{name:'Одиночная игра',exact:true}).click();await wait(p,()=>state==='play');
 await p.evaluate(()=>{E=[];wt=10;});await p.keyboard.press('Escape');await wait(p,()=>state==='pause');const wt=await p.evaluate(()=>wt);await p.waitForTimeout(200);assert.equal(await p.evaluate(()=>wt),wt);
 await p.locator('#pause').getByRole('button',{name:'Характеристики',exact:true}).click();assert(await p.locator('#stats').isVisible());await p.keyboard.press('Escape');assert.equal(await p.evaluate(()=>state),'pause');await p.keyboard.press('Escape');await wait(p,()=>state==='play');
 await p.evaluate(()=>{P[0].up.dmg=2;P[0].pts=1;});await p.keyboard.press('t');const crit=p.locator('[data-skill="crit"] button');assert(await crit.isDisabled());assert.match(await crit.textContent(),/2 очк/);
 await p.evaluate(()=>{P[0].pts=2;renderTree();});await crit.click();assert.equal(await p.evaluate(()=>P[0].pts),0);assert.equal(await p.evaluate(()=>P[0].up.crit),1);assert.match(await p.locator('[data-skill="hp"] .stat-preview').textContent(),/100 → 112/);
 await p.locator('#tree').evaluate(e=>e.scrollTop=0);await p.screenshot({path:'test-results/skills-v3.png'});await p.keyboard.press('t');
 assert(await p.evaluate(()=>{const p=P[0];p.up.dash=1;p.cd[0]=0;p.stamina=0;p.fx=1;p.fy=0;const x=p.x;K.KeyQ=1;playerAbilities(p);K.KeyQ=0;return p.x===x&&p.cd[0]===0;}));
 assert(await p.evaluate(()=>{const p=P[0];p.stamina=32;p.inv=0;const x=p.x;K.KeyQ=1;playerAbilities(p);K.KeyQ=0;return p.x===x+140&&p.stamina===0&&p.inv===.3;}));
 const nav=await p.evaluate(()=>{N=[{t:'rock',x:760,y:600,hp:25,mhp:25,rs:0}];const e={x:600,y:600,r:12,turnSign:1};let min=Infinity;for(let i=0;i<110;i++){mv(e,{x:1050,y:600},100,.05);min=Math.min(min,Math.hypot(e.x-760,e.y-600));}return {x:e.x,min};});assert(nav.x>900,JSON.stringify(nav));assert(nav.min>=29,JSON.stringify(nav));
 const attacks=await p.evaluate(()=>{N=[];const p=P[0];Object.assign(p,{x:1000,y:1000,hp:100,mhp:100,inv:0,dead:0,eq:{}});p.up.dodge=0;p.up.armor=0;const e=spawnE('skel',1020,1000);e.atkcd=0;e.special=999;E=[e];enemyAI(e,.01,[p]);const warned=!!e.attack&&p.hp===100,attack={...e.attack};p.x=800;for(let i=0;i<10;i++)enemyAI(e,.05,[p]);const escaped=p.hp===100;
 p.x=1000;e.x=1020;e.y=1000;e.attack=null;e.atkcd=0;enemyAI(e,.01,[p]);for(let i=0;i<10;i++)enemyAI(e,.05,[p]);const hit=p.hp<100;
 const archer=spawnE('archer',1250,1000);archer.atkcd=0;E=[archer];S=[];enemyAI(archer,.01,[p]);const bowWarn=archer.attack?.type==='bolt'&&S.length===0;for(let i=0;i<12;i++)enemyAI(archer,.05,[p]);return {warned,escaped,hit,bowWarn,shot:S.some(s=>s.kind==='physical')};});assert.deepEqual(attacks,{warned:true,escaped:true,hit:true,bowWarn:true,shot:true});
 assert(await p.evaluate(()=>{const p=P[0];p.x=1000;p.y=1000;const e=spawnE('wolf',1150,1000);e.special=0;E=[e];enemyAI(e,.01,[p]);return e.attack?.type==='charge'&&e.attack.time>=.65;}));
 assert(await p.evaluate(()=>{const p=P[0];const e=bossE(5);e.b=.5;E=[e];bossAI(e,.01,p,100,0);const location={...e.blink};bossAI(e,.6,p,100,0);return Number.isFinite(location.x)&&e.x===location.x&&e.y===location.y;}));
 assert(await p.evaluate(()=>{const old=BAL.enemies.eliteChance;BAL.enemies.eliteChance=1;wave=5;const e=spawnE('orc',1200,1000);BAL.enemies.eliteChance=old;return e.elite&&e.hp>ET.orc.hp*2&&e.d>ET.orc.d*1.8;}));
 const deaths=await p.evaluate(()=>{const p=P[0];p.dead=0;p.hp=p.mhp;p.xp=0;p.nx=999999;p.bag=[];CH=[];D=[];QS={k:0,g:9999,t:0};const e=spawnE('slime',1200,1000);e.boss=1;E=[e];kill(e);const saved={xp:p.xp,k:QS.k,chests:CH.length,drops:D.length};kill(e);const single=p.xp===saved.xp&&QS.k===saved.k&&CH.length===saved.chests&&D.length===saved.drops&&saved.chests<=1;
 if(!CH.length)spawnChest('boss',p.x,p.y,{rarity:0});CH[0].x=p.x;CH[0].y=p.y;chestTick(.01);const count=p.bag.length;chestTick(.01);return {single,oneItem:count===1&&p.bag.length===count};});assert.deepEqual(deaths,{single:true,oneItem:true});
 await p.evaluate(()=>{CH=[];const p=P[0];for(let r=0;r<5;r++)addItem(p,genItem(r));renderInv();show('inv');});assert.equal(await p.locator('#inv .item-rarity').count(),6);await p.screenshot({path:'test-results/inventory-v3.png'});await p.keyboard.press('Escape');
 await p.evaluate(()=>{N=[];E=[];S=[];wave=15;stageRun={...stageRun,done:true,goal:0,progress:0};});await wait(p,()=>state==='victory');await p.getByRole('button',{name:'Продолжить — новый цикл'}).click();await wait(p,()=>state==='play');
 await p.evaluate(()=>returnMenu());await p.getByRole('button',{name:'Двое за одним экраном →'}).click();await wait(p,()=>P.length===2&&state==='play');const x2=await p.evaluate(()=>P[1].x);await p.keyboard.down('ArrowRight');await p.waitForTimeout(200);await p.keyboard.up('ArrowRight');assert(await p.evaluate(()=>P[1].x)>x2);
 const host=await page(),guest=await page(),third=await page();await host.evaluate(()=>{netMenu();connectRoom('createDirect');});await wait(host,()=>lobby?.direct);
 for(const client of [guest,third]){await client.evaluate(()=>{netMenu();connectRoom('joinDirect',location.host);});await wait(client,()=>lobby?.players.length>=2);}
 await wait(host,()=>lobby.players.length===3);assert.equal(await host.locator('.lobby-portrait').count(),3);await host.screenshot({path:'test-results/lobby-v3.png'});await host.getByRole('button',{name:'Начать игру',exact:true}).click();for(const client of [host,guest,third])await wait(client,()=>state==='play'&&P.length===3);
 await host.evaluate(()=>{P[1].pts=2;P[1].up.dmg=2;});await wait(guest,()=>P[1].up.dmg===2&&P[1].pts===2);await guest.keyboard.press('t');await guest.locator('[data-skill="crit"] button').click();await wait(third,()=>P[1].up.crit===1&&P[1].pts===0);assert.equal(await host.evaluate(()=>P[0].pts),1);
 await host.evaluate(()=>{N=[];const e=spawnE('orc',P[0].x+180,P[0].y);e.elite=true;e.atkcd=0;e.special=0;E=[e];});await wait(third,()=>E[0]?.elite&&!!E[0].attack);assert.equal(await third.evaluate(()=>E[0].attack.type),'slam');
 await host.evaluate(()=>{E=[];CH=[];spawnChest('boss',P[1].x+200,P[1].y,{rarity:4});});await wait(third,()=>CH.some(c=>c.r===4&&c.source==='boss'));const chestId=await third.evaluate(()=>CH[0].id);assert.equal(await guest.evaluate(()=>CH[0].id),chestId);
 await host.evaluate(()=>{const c=CH[0];P[1].x=c.x;P[1].y=c.y;chestTick(.01);});await wait(third,()=>P[1].bag.some(i=>i.r===4));await wait(guest,()=>P[1].bag.some(i=>i.r===4));assert.equal(await host.evaluate(()=>P[1].bag.length),1);
 assert(await host.evaluate(()=>{const p=P[1];p.up.dash=1;p.cd[0]=0;p.stamina=100;recordRemoteInput(1,[0,0,0,0,0,1,0,0]);recordRemoteInput(1,[0,0,0,0,0,0,0,0]);upd(.016);return p.cd[0]>0&&!RK[1][5]&&Object.keys(pendingRemoteInput).length===0;}));
 await guest.keyboard.press('t');await host.evaluate(()=>{P[1].up.dash=1;P[1].stamina=100;P[1].cd[0]=0;});await wait(guest,()=>P[1].up.dash===1);await guest.keyboard.press('q');await wait(host,()=>P[1].cd[0]>0);await wait(third,()=>P[1].stamina<90);await host.screenshot({path:'test-results/combat-v3.png'});
 await host.evaluate(()=>returnMenu());await wait(guest,()=>state==='menu');for(const client of [host,guest,third])await client.close();
 const small=await page(390,844);assert(await small.evaluate(()=>$('menu').scrollWidth<=innerWidth+1));await small.screenshot({path:'test-results/menu-mobile-v3.png'});await small.close();
 assert.equal(await p.evaluate(()=>document.querySelectorAll('#combatHud').length),1);assert(await p.evaluate(()=>uiPortraits.size<=5));assert.deepEqual(errors,[]);
 console.log('PASS tactical update: menu/settings/about, pause, variable-cost upgrades/previews, stamina, obstacle avoidance, dodgeable melee and ranged tells, charge, boss landing warning, elite stats, one kill/one item, five rarities, victory/continue, local two-player input, three-player IP sync of costs, telegraphs, legendary loot and stamina, mobile menu.');
 }finally{await browser.close();wss.clients.forEach(c=>c.terminate());await new Promise(r=>wss.close(r));await new Promise(r=>server.close(r));}
})().catch(error=>{console.error(error);process.exitCode=1;});
