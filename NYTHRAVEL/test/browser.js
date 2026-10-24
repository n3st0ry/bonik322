const {chromium}=require('playwright');
const assert=require('node:assert/strict');
const {createGameServer}=require('../server');
(async()=>{
 const {server,wss}=createGameServer();await new Promise(r=>server.listen(0,'127.0.0.1',r));const url=`http://127.0.0.1:${server.address().port}`;
 const browser=await chromium.launch({executablePath:process.env.CHROMIUM_PATH||(require('node:fs').existsSync('/usr/bin/chromium')?'/usr/bin/chromium':undefined),headless:true,args:['--no-sandbox']});const errors=[];
 const page=async(w=1920,h=1080,dpr=1)=>{const c=await browser.newContext({viewport:{width:w,height:h},deviceScaleFactor:dpr});const p=await c.newPage();p.on('pageerror',e=>{errors.push(e.message);console.error('BROWSER:',e.message);});await p.goto(url);await p.waitForFunction(()=>document.getElementById('bootScreen')?.hidden===true);return p;};
 const wait=async(p,f)=>p.waitForFunction(f,null,{timeout:10000});
 try{
 const solo=await page();await solo.getByRole('button',{name:'Одиночная игра',exact:true}).click();await wait(solo,()=>state==='play');
 await solo.keyboard.press('t');await wait(solo,()=>$('tree').style.display==='flex');
 await solo.locator('.skill').filter({has:solo.locator('b', {hasText:/^Живучесть/})}).getByRole('button').click();assert.equal(await solo.evaluate(()=>P[0].up.hp),1);assert.equal(await solo.evaluate(()=>P[0].pts),0);
 await solo.evaluate(()=>{upg(0,'hp');upg(0,'invalid');buy(0,'forge');});assert.equal(await solo.evaluate(()=>P[0].up.hp),1);assert.equal(await solo.evaluate(()=>P[0].gold),0);
 await solo.keyboard.press('t');await wait(solo,()=>$('tree').style.display==='none');
 await solo.keyboard.press('b');await wait(solo,()=>$('shop').style.display==='flex');await solo.keyboard.press('Escape');
 await solo.keyboard.press('v');await wait(solo,()=>$('inv').style.display==='flex');await solo.keyboard.press('Escape');
 const pos=await solo.evaluate(()=>P[0].x);await solo.keyboard.down('d');await solo.waitForTimeout(300);await solo.keyboard.up('d');assert(await solo.evaluate(()=>P[0].x)>pos);
 await solo.evaluate(()=>{P[0].up.dmg=0;P[0].pts=2;upg(0,'nova');});assert.equal(await solo.evaluate(()=>P[0].up.nova),0);
 await solo.evaluate(()=>{P[0].up.dmg=10;P[0].pts=2;upg(0,'dmg');});assert.equal(await solo.evaluate(()=>P[0].pts),2);
 // Exercise actual attack and loot/experience, with a controlled target in front of the hero.
 assert(await solo.evaluate(()=>{E=[];S=[];mouseKnown=false;const p=P[0];p.w=0;p.fx=1;p.fy=0;p.ac=0;const target=spawnE('slime',p.x+30,p.y);target.hp=1;E.push(target);const xp=p.xp;K.KeyF=1;upd(.016);K.KeyF=0;return !E.includes(target)&&p.xp>xp&&D.length>0;}));
 await solo.evaluate(()=>{P[0].gold=1000;gearBuy(0,0);invAct(0,0,0);});assert(await solo.evaluate(()=>!!P[0].eq.helm));
 await solo.evaluate(()=>{P[0].up.dmg=3;P[0].up.hp=3;P[0].up.arcane=2;P[0].pts=5;upg(0,'nova');upg(0,'heal');upg(0,'dash');});assert.deepEqual(await solo.evaluate(()=>[P[0].up.nova,P[0].up.heal,P[0].up.dash]),[1,1,1]);
 assert(await solo.evaluate(()=>{mouseKnown=false;const p=P[0];p.hp=p.mhp/2;p.cd=[0,0,0];p.fx=1;p.fy=0;E=[];const x=p.x;K.KeyQ=1;upd(.016);K.KeyQ=0;const dash=p.x>x+100;K.KeyR=1;const hp=p.hp;upd(.016);K.KeyR=0;const heal=p.hp>hp;const target=spawnE('orc',p.x+50,p.y);E=[target];const enemyHp=target.hp;K.KeyE=1;upd(.016);K.KeyE=0;return dash&&heal&&(!E.includes(target)||target.hp<enemyHp);}));
 await solo.evaluate(()=>{E=[];wave=3;nextWave();});assert.equal(await solo.evaluate(()=>stageRun.mode),'seal');
 await solo.evaluate(()=>{E=[];S=[];P[0].hp=P[0].mhp;P[0].st={};P[0].x=stageAnchor.x;P[0].y=stageAnchor.y;for(let i=0;i<170;i++)upd(.05);});assert.equal(await solo.evaluate(()=>stageRun.progress),8);
 await solo.evaluate(()=>{wave=9;E=[];nextWave();D.filter(o=>o.t==='shard').forEach(o=>{o.x=P[0].x;o.y=P[0].y;});upd(.016);});assert.equal(await solo.evaluate(()=>stageRun.progress),6);
 await solo.evaluate(()=>{wave=6;E=[];nextWave();});assert(await solo.evaluate(()=>E.some(e=>e.champion)));
 await solo.evaluate(()=>{wave=12;E=[];nextWave();});assert(await solo.evaluate(()=>E.some(e=>e.rift)));
 await solo.evaluate(()=>{state='play';P[0].dead=0;P[0].hp=P[0].mhp;E=[];S=[];wave=0;nextWave();});
 await solo.evaluate(()=>{const old=E;E=[...Object.keys(ET).map((k,i)=>spawnE(k,P[0].x+(i%5)*70-140,P[0].y+Math.floor(i/5)*60-120)),...BS.map((_,i)=>bossE(i))];draw();E=old;});
 for(let cl=0;cl<5;cl++){await solo.evaluate(cl=>{setCls(0,cl);draw();},cl);assert.equal(await solo.evaluate(()=>P[0].cl),cl);}
 await solo.evaluate(()=>{openSettings();$('quality').value='low';saveSettings();draw();});assert.equal(await solo.evaluate(()=>quality),'low');await solo.evaluate(()=>{openSettings();$('quality').value='high';saveSettings();});
 await solo.locator('#fullscreen').click();await wait(solo,()=>!!document.fullscreenElement);await solo.locator('#fullscreen').click();await wait(solo,()=>!document.fullscreenElement);
 for(const [w,h,dpr] of [[2560,1440,2],[1280,720,1],[800,600,1]]){
  const p=await page(w,h,dpr);await p.evaluate(()=>solo());await p.waitForTimeout(150);const sizes=await p.evaluate(()=>({w:C.width,h:C.height,W,H,ratio:(C.width/W)/(C.height/H)}));assert(Math.abs(sizes.ratio-1)<.01);assert.equal(sizes.w,w*Math.min(dpr,2));await p.evaluate(()=>{mpos({clientX:innerWidth/2,clientY:innerHeight/2});});assert(await p.evaluate(()=>Math.abs(MX-W/2)<1));await p.close();
 }
 const host=await page(),g1=await page(),g2=await page();
 await host.evaluate(()=>{netMenu();connectRoom('create');});await wait(host,()=>!!lobby);const code=await host.evaluate(()=>lobby.code);
 for(const [p,cl] of [[g1,1],[g2,2]]){await p.evaluate(({code,cl})=>{netMenu();$('roomInput').value=code;$('playerClass').value=cl;connectRoom('join');},{code,cl});await wait(p,()=>!!lobby);}
 await wait(host,()=>lobby.players.length===3);assert.equal(await host.evaluate(()=>state),'menu');
 await host.getByRole('button',{name:'Начать игру',exact:true}).click();for(const p of [host,g1,g2])await wait(p,()=>state==='play'&&P.length===3);
 await wait(g2,()=>P[2].cl===2);assert.deepEqual(await host.evaluate(()=>P.map(p=>p.cl)),[0,1,2]);
 await g1.keyboard.press('t');await wait(g1,()=>$('tree').style.display==='flex');await g1.locator('.skill').filter({has:g1.locator('b', {hasText:/^Живучесть/})}).getByRole('button').click();
 await wait(host,()=>P[1].up.hp===1);await wait(g2,()=>P[1].up.hp===1);assert.deepEqual(await host.evaluate(()=>P.map(p=>p.pts)),[1,0,1]);
 await g1.evaluate(()=>{roomSend({t:'u',id:1,k:'hp',expected:0});snd({t:'u',k:'hp',expected:0});});await g1.waitForTimeout(150);assert.equal(await host.evaluate(()=>P[1].up.hp),1);
 await g1.keyboard.press('t');const x=await host.evaluate(()=>P[1].x);await g1.keyboard.down('d');await g1.waitForTimeout(350);await g1.keyboard.up('d');await wait(host,()=>!RK[1]?.[3]);assert(await host.evaluate(()=>P[1].x)>x);
 await host.evaluate(()=>{grantWorld([{slot:1,gold:500,ore:50,wood:50,items:[]}]);});await wait(g1,()=>P[1].gold>=500);await g1.evaluate(()=>{gearBuy(1,0);});await wait(host,()=>P[1].bag.length===1);await wait(g1,()=>P[1].bag.length===1);await g1.evaluate(()=>invAct(1,0,0));await wait(g2,()=>!!P[1].eq.helm);
 await host.evaluate(()=>{P[0].up.hp=2;wave=3;E=[];nextWave();});await wait(g2,()=>stageRun.mode==='seal'&&P[0].up.hp===2);
 await host.evaluate(()=>{wave=12;E=[];nextWave();});await wait(g2,()=>E.some(e=>e.rift));
 await g2.evaluate(()=>returnMenu());await wait(host,()=>P[2].offline);await g1.evaluate(()=>returnMenu());await wait(host,()=>P[1].offline);
 await host.evaluate(()=>{E=[];wave=2;nextWave();});assert(await host.evaluate(()=>P[1].dead&&P[2].dead));
 await host.evaluate(()=>returnMenu());await host.close();await g1.close();await g2.close();
 const ipHost=await page(),ipGuest=await page(),ipThird=await page();
 await ipHost.getByRole('button',{name:'Мультиплеер',exact:true}).click();await ipHost.getByRole('button',{name:'Создать игру по IP',exact:true}).click();await wait(ipHost,()=>lobby?.direct);
 for(const p of [ipGuest,ipThird]){
  await p.getByRole('button',{name:'Мультиплеер',exact:true}).click();await p.locator('#directAddress').fill('127.0.0.1:'+server.address().port);await p.getByRole('button',{name:'Подключиться по IP',exact:true}).click();await wait(p,()=>lobby?.direct);
 }
 await wait(ipHost,()=>lobby.players.length===3);assert.equal(await ipGuest.evaluate(()=>state),'menu');
 await ipHost.getByRole('button',{name:'Начать игру',exact:true}).click();for(const p of [ipHost,ipGuest,ipThird])await wait(p,()=>P.length===3&&state==='play');
 const directX=await ipHost.evaluate(()=>P[1].x);await ipGuest.keyboard.down('d');await ipGuest.waitForTimeout(300);await ipGuest.keyboard.up('d');assert(await ipHost.evaluate(()=>P[1].x)>directX);
 await ipHost.evaluate(()=>returnMenu());await wait(ipGuest,()=>state==='menu'&&lobby===null);
 await ipGuest.locator('#directAddress').fill('http://user:password@127.0.0.1/path');await ipGuest.getByRole('button',{name:'Подключиться по IP',exact:true}).click();assert.match(await ipGuest.locator('#nst').textContent(),/только IP/);
 await ipGuest.locator('#directAddress').fill('127.0.0.1:'+server.address().port);await ipGuest.getByRole('button',{name:'Подключиться по IP',exact:true}).click();await wait(ipGuest,()=>roomSocket===null);assert.match(await ipGuest.locator('#nst').textContent(),/нет игры по IP/);
 await ipGuest.getByRole('button',{name:'Создать игру по IP',exact:true}).click();await wait(ipGuest,()=>lobby?.direct);await ipGuest.evaluate(()=>returnMenu());
 assert.equal(await ipGuest.evaluate(()=>directEndpoint('192.168.1.100')),'ws://192.168.1.100:3000');assert.equal(await ipGuest.evaluate(()=>directEndpoint('192.168.1.100:80')),'ws://192.168.1.100');
 await ipHost.close();await ipGuest.close();await ipThird.close();
 await solo.screenshot({path:'test-results/game-1920.png'});
 assert.deepEqual(errors,[]);console.log('PASS: solo combat/movement, skill prerequisites/bounds, inventory, objectives, fullscreen, DPI/resizing/aim, three-client lobby/start/upgrades/movement/equipment/stages/disconnect. IP connection without code (three clients), host departure, invalid address and retry. No browser errors.');
 }finally{await browser.close();wss.clients.forEach(ws=>ws.terminate());await new Promise(r=>wss.close(r));await new Promise(r=>server.close(r));}
})().catch(e=>{console.error(e);process.exitCode=1;});
