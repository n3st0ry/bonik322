/* Extensions to the original combat, loot, equipment and co-op simulation. */
let roomSocket=null,lobby=null,actionId=0,quality=localStorage.getItem('ros-quality')||'high';
let stageRun={index:0,mode:'hunt',goal:0,progress:0,done:false,total:1}, sessionSettings={difficulty:'normal'};
const esc=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const classOptions=CLS.map((c,i)=>`<option value="${i}">${c.n}</option>`).join('');
$('menu').innerHTML=`<small>THE SHATTERED FRONTIER · CO-OP RPG</small><h1>NYTHRAVEL</h1><p>Осколки древнего мира ждут своих хранителей.</p><label>Имя <input id="playerName" maxlength="24" value="Искатель"></label><label>Класс <select id="playerClass">${classOptions}</select></label><div><button onclick="solo()">Одиночная игра</button><button onclick="localGame()">Вдвоём на одном экране</button><button onclick="netMenu()">Мультиплеер</button><button onclick="openSettings()">Настройки</button></div><p><small>WASD — движение · ЛКМ / F — атака · Q E R — навыки<br>T — развитие · B — магазин · V — инвентарь · C — оружие<br>Второй локальный игрок: стрелки, Enter, I O P, U.</small></p>`;
$('net').innerHTML=`<h1>Путь вместе</h1><p>До трёх игроков. Для простой игры в одной сети используйте IP компьютера с сервером.</p><div class="col"><h2>Подключение по IP — без кода</h2><button onclick="connectRoom('createDirect')">Создать игру по IP</button><label>IP сервера <input id="directAddress" placeholder="192.168.1.100:3000" autocomplete="off" spellcheck="false"></label><button onclick="connectRoom('joinDirect',$(&quot;directAddress&quot;).value)">Подключиться по IP</button><p><small>Хозяин запускает npm start и создаёт игру. Гости вводят его IP. Если порт не указан, используется 3000.</small></p></div><h2>Комнаты с кодом</h2><div><button onclick="connectRoom('create')">Создать игру</button><button onclick="$('joinForm').hidden=false">Присоединиться к игре</button></div><div id="joinForm" hidden><label>Код комнаты <input id="roomInput" maxlength="6" autocomplete="off" placeholder="A1B2C3"></label><button onclick="connectRoom('join')">Присоединиться</button></div><div id="lobbyPanel" hidden></div><p id="nst" class="notice" role="status"></p><button onclick="netBack()">Назад / выйти из комнаты</button>`;
$('wrap').insertAdjacentHTML('beforeend',`<div class="ov" id="settings"><h2>Настройки</h2><label>Качество <select id="quality"><option value="high">Высокое: свет, частицы, погода</option><option value="low">Низкое: упрощённые эффекты</option></select></label><p>F11 — режим браузера; кнопка ниже — Fullscreen API.</p><button onclick="toggleFullscreen()">Полный экран</button><button onclick="saveSettings()">Сохранить и закрыть</button></div><div class="toolbar"><button onclick="if(state==='play'||state==='tree')tog()">Навыки (T)</button><button onclick="if(state==='play'||state==='tree')togShop()">Магазин (B)</button><button onclick="if(state==='play'||state==='tree')togInv()">Инвентарь (V)</button><button onclick="openSettings()">Настройки</button><button id="fullscreen" onclick="toggleFullscreen()">⛶ Полный экран</button><button onclick="returnMenu()">В меню</button></div><div id="stageInfo" class="stage" hidden></div>`);
$('directAddress').value=location.host;
function openSettings(){show('settings');$('quality').value=quality;clearInput();}
function saveSettings(){quality=$('quality').value;localStorage.setItem('ros-quality',quality);hide('settings');resizeCanvas();}
function clearInput(){for(const k in K)K[k]=0;MD=0;if(NET==='guest')sendGuestInput();}
async function toggleFullscreen(){try{if(document.fullscreenElement)await document.exitFullscreen();else await $('wrap').requestFullscreen();}catch{if($('settings').style.display==='flex')$('settings').insertAdjacentHTML('beforeend','<p>Браузер запретил Fullscreen API. Используйте F11.</p>');}}
function resizeCanvas(){
 const width=innerWidth,height=innerHeight,scale=Math.max(.6,Math.min(width/1000,height/680,1.6),width/WW,height/WH);
 W=Math.min(WW,Math.round(width/scale));H=Math.min(WH,Math.round(height/scale));
 const dpr=Math.min(devicePixelRatio||1,quality==='low'?1:2);
 C.width=Math.round(width*dpr);C.height=Math.round(height*dpr);
 $('stageInfo').style.top=Math.ceil(118*height/H)+'px';g.setTransform(C.width/W,0,0,C.height/H,0,0);g.imageSmoothingEnabled=true;lc=null;
}
addEventListener('resize',resizeCanvas);document.addEventListener('fullscreenchange',()=>{resizeCanvas();$('fullscreen').textContent=document.fullscreenElement?'⛶ Выйти из полного экрана':'⛶ Полный экран';});resizeCanvas();
addEventListener('keydown',e=>{if(e.code==='F11'&&document.fullscreenEnabled){e.preventDefault();if(!e.repeat)toggleFullscreen();}if(e.code==='Escape'){hide('settings');if($('inv').style.display==='flex')hide('inv');}});
for(const id of ['tree','shop','inv','settings'])$(id).addEventListener('pointerdown',clearInput);
function returnMenu(){netBack();hide('over');hide('tree');hide('shop');hide('inv');hide('settings');state='menu';$('stageInfo').hidden=true;clearInput();}
function solo(){if(roomSocket)netBack();NET=0;ME=0;start(0);setCls(0,+$('playerClass').value);}
function localGame(){NET=0;ME=0;start(1);setCls(0,+$('playerClass').value);setCls(1,1);}
const originalStart=start;
start=function(c){
 stageRun={index:0,mode:'hunt',goal:0,progress:0,done:false,total:1};BB={b:-1,ts:0};PT=[];RK={};lastK={};lastSnap=0;lastQ=0;SQ=0;actionId=0;
 Object.assign(CT[1],{u:'ArrowUp',d:'ArrowDown',l:'ArrowLeft',r:'ArrowRight',a:'Enter',s:['KeyI','KeyO','KeyP']});originalStart(c);P.forEach(p=>{p.cl=0;p.w=0;p.offline=false;});clearInput();hide('net');$('stageInfo').hidden=false;
};
netMenu=function(){hide('menu');show('net');};
netBack=function(){if(roomSocket){roomSocket.onclose=null;roomSocket.close();roomSocket=null;}NET=0;role='';dc=null;lobby=null;hide('net');show('menu');state='menu';$('lobbyPanel').hidden=true;};
function renderLobby(){if(!lobby)return;const host=role==='host';$('lobbyPanel').hidden=false;
 $('lobbyPanel').innerHTML=`${lobby.direct?'<p>Игра по IP · код не нужен</p>':`<p>Код комнаты</p><div class="room-code">${lobby.code}</div><button onclick="copyRoom()">Копировать код</button>`}<p>${lobby.players.length} / 3 игроков · ожидание хозяина</p><div class="roster">${lobby.players.map(p=>`<div class="col"><h3>${esc(p.name)} ${p.slot===0?'♛':''}</h3><p>${CLS[p.cl].e} ${CLS[p.cl].n}</p></div>`).join('')}</div><label>Ваш класс <select id="lobbyClass" onchange="roomSend({op:'profile',cl:+this.value})">${classOptions}</select></label>${host?`<label>Сложность <select id="difficulty"><option value="normal">Обычная</option><option value="hard">Испытание (+25% силы врагов)</option></select></label><button onclick="roomSend({op:'start',difficulty:$('difficulty').value})">Начать игру</button>`:'<p>Ожидаем запуска хозяином…</p>'}`;
 $('lobbyClass').value=lobby.players.find(p=>p.slot===ME)?.cl||0;
}
function roomSend(m){if(roomSocket?.readyState===WebSocket.OPEN)roomSocket.send(JSON.stringify(m));}
async function copyRoom(){try{await navigator.clipboard.writeText(lobby.code);nst('Код скопирован');}catch{nst('Скопируйте код: '+lobby.code);}}
function directEndpoint(address){
 const raw=address.trim();if(!raw)throw new Error('Введите IP компьютера с сервером.');
 const explicit=/^[a-z]+:\/\//i.test(raw);
 const url=new URL(explicit?raw:'http://'+raw);
 if(!['http:','https:','ws:','wss:'].includes(url.protocol)||url.username||url.password||url.pathname!=='/'||url.search||url.hash)throw new Error('Укажите только IP или адрес сервера, например 192.168.1.100:3000.');
 if(!explicit&&!/:\d+$/.test(raw.replace(/\/$/,'')))url.port='3000';
 const secure=url.protocol==='https:'||url.protocol==='wss:'||(!explicit&&location.protocol==='https:');
 if(location.protocol==='https:'&&!secure)throw new Error('Страница HTTPS требует защищённого сервера WSS. Для домашней сети откройте игру по http://IP:3000.');
 return (secure?'wss:':'ws:')+'//'+url.host;
}
function connectRoom(op,address=''){
 if(roomSocket&&roomSocket.readyState<=WebSocket.OPEN){nst('Сначала выйдите из текущей комнаты.');return;}
 if(location.protocol==='file:'){nst('Запустите npm start и откройте игру через сервер.');return;}
 const code=$('roomInput').value.trim().toUpperCase();
 if(op==='join'&&!/^[A-F0-9]{6}$/.test(code)){nst('Введите шестизначный код комнаты.');return;}
 let endpoint;try{endpoint=op==='joinDirect'?directEndpoint(address):`${location.protocol==='https:'?'wss':'ws'}://${location.host}`;}catch(error){nst(error.message);return;}
 let ws;try{ws=new WebSocket(endpoint);}catch{nst('Неверный адрес сервера.');return;}roomSocket=ws;nst('Подключение…');
 const timeout=setTimeout(()=>{if(ws.readyState===WebSocket.CONNECTING){ws.failed=true;nst('Сервер не отвечает. Проверьте IP, порт, npm start и брандмауэр Windows.');ws.close();}},10000);
 ws.onopen=()=>{clearTimeout(timeout);if(roomSocket===ws)roomSend({op,code,name:$('playerName').value,cl:+$('playerClass').value});};
 ws.onerror=()=>{clearTimeout(timeout);ws.failed=true;if(roomSocket===ws)nst('Не удалось связаться с сервером. Проверьте IP, порт, npm start и брандмауэр Windows.');};
 ws.onclose=()=>{clearTimeout(timeout);if(roomSocket!==ws)return;roomSocket=null;if(NET){NET=0;state='over';$('ovs').textContent='Соединение потеряно. Вернитесь в меню и создайте новую комнату.';show('over');}else if(!ws.failed)nst('Соединение закрыто. Повторите подключение.');};
 ws.onmessage=event=>{
  if(roomSocket!==ws)return;
  let m;try{m=JSON.parse(event.data);}catch{return;}
  if(m.sys==='error'){nst(m.message);if(!lobby){ws.failed=true;ws.close();}return;}
  if(m.sys==='role'){role=m.r;ME=m.slot;NET_SLOT=m.slot;return;}
  if(m.sys==='lobby'){lobby=m;if(m.status==='waiting'){renderLobby();nst('Комната готова.');}return;}
  if(m.sys==='gone'){returnMenu();netMenu();nst('Хозяин закрыл комнату.');return;}
  if(m.sys==='start'){lobby=m;sessionSettings=m.settings;launchRoom();return;}
  if(m.sys==='playerLeft'&&NET==='host'){
   const p=P[m.slot];if(p){p.dead=1;p.offline=true;RK[m.slot]=[];ban={t:3,s:'Союзник отключился'};}return;
  }
  if(dc?.onmessage)dc.onmessage(event);
 };
}
function launchRoom(){
 const adapter={readyState:'open',send:raw=>{const m=JSON.parse(raw);if(role==='guest'&&m.t!=='k'&&m.t!=='p')m.id=++actionId;roomSend(m);}};
 wire(adapter);adapter.onopen();NET=role;ME=role==='host'?0:NET_SLOT;
 P=Array.from({length:Math.max(...lobby.players.map(p=>p.slot))+1},(_,i)=>{const p=mk(i),profile=lobby.players.find(q=>q.slot===i);p.cl=profile?.cl||0;p.w=CLS[p.cl].w;p.offline=!profile;p.dead=profile?0:1;calc(p);return p;});
 coop=P.length>1?1:0;
 if(role==='host'){
  const legacyMessage=adapter.onmessage;
  adapter.onmessage=e=>{let m;try{m=JSON.parse(e.data);}catch{return;}const p=P[m.slot];if(!p||p.offline)return;
   if(m.t==='u'&&m.expected!==p.up[m.k])return;
   if(m.t==='c')return; // Class choice is fixed for the running session.
   legacyMessage(e);
  };
 }
 hide('net');hide('menu');hide('over');state='play';lastSnap=0;lastQ=0;clearInput();
}
const legacyToggle=tog;tog=function(){clearInput();legacyToggle();};
const legacyUpg=upg;
upg=function(i,k){const p=P[i],u=UP.find(u=>u[0]===k);if(!p||p.dead||!u||p.pts<1||p.up[k]>=u[3]||(u[4]&&p.up[u[4]]<u[5])||(NET&&i!==ME&&NET!=='host'))return false;legacyUpg(i,k);return true;};
const legacyBuy=buy;
buy=function(i,w){const p=P[i];if(!p||p.dead)return;const n=p.wp+1;if(w==='pot'?p.gold<25:w!=='forge'||p.ore<4*n||p.wood<3*n||p.gold<15*n)return;legacyBuy(i,w);};
const legacyClass=setCls;
setCls=function(i,k){if(NET&&state==='play')return;legacyClass(i,k);};
renderTree=function(){let html='<h2>Созвездия хранителя</h2><p>Каждый узел стоит 1 очко. Стрелки показывают необходимые навыки.</p><div class="cols">';
 P.forEach(p=>{if(p.offline||(NET&&p.i!==ME))return;html+=`<section class="col"><h3>${CLS[p.cl||0].e} ${esc(lobby?.players.find(q=>q.slot===p.i)?.name||CT[p.i].n)} · ур. ${p.lvl}</h3><p>Очки развития: <b>${p.pts}</b></p>${NET?`<p>${CLS[p.cl||0].n} · класс выбран в лобби</p>`:clsHtml(p)}<div class="skill-grid">`;
 UP.forEach(u=>{const level=p.up[u[0]],ok=!p.dead&&p.pts>0&&level<u[3]&&(!u[4]||p.up[u[4]]>=u[5]);html+=`<article class="skill ${ok?'available':'locked'}"><span class="branch">${u[4]?`${nm(u[4])} ${u[5]} → ${u[1]}`:'◆ Корневой навык'}</span><b>${u[1]} · ${level} / ${u[3]}</b><small>${u[2]}<br>Стоимость: 1 очко${u[4]?` · Нужно: ${nm(u[4])} ≥ ${u[5]}`:' · Без требований'}</small><button ${ok?'':'disabled'} onclick="upg(${p.i},'${u[0]}')">${level>=u[3]?'Максимум':'Изучить'}</button></article>`;});
 const n=p.wp+1;html+=`</div><p>Золото ${p.gold} · Дерево ${p.wood} · Руда ${p.ore}</p>${shopHtml(p)}<div class="row"><span>Зелье — 25 золота</span><button ${p.gold>=25?'':'disabled'} onclick="buy(${p.i},'pot')">Лечиться</button></div><div class="row"><span>Кузница ${p.wp} → ${n}<br><small>${4*n} руды · ${3*n} дерева · ${15*n} золота</small></span><button ${p.ore>=4*n&&p.wood>=3*n&&p.gold>=15*n?'':'disabled'} onclick="buy(${p.i},'forge')">Ковать</button></div></section>`;
 });const markup=html+'</div><button onclick="tog()">Закрыть (T / Esc)</button>';if($('tree').dataset.markup!==markup){$('tree').innerHTML=markup;$('tree').dataset.markup=markup;}
};
// Freeze timers, buffs and chests along with the single-player upgrade screen.
const legacyRevive=revive;revive=function(dt){if(state==='play')legacyRevive(dt);};
const legacyPkey=pkey;pkey=function(p,key,index){if(p.offline)return false;if(NET==='guest'||p.i===0){if(['tree','shop','inv','settings'].some(id=>$(id).style.display==='flex'))return false;}return legacyPkey(p,key,index);};
const legacySendInput=sendGuestInput;sendGuestInput=function(){if(['tree','shop','inv','settings'].some(id=>$(id).style.display==='flex'))clearKeysOnly();legacySendInput();};
function clearKeysOnly(){for(const k in K)K[k]=0;MD=0;}
const legacySnap=snap;snap=function(){const m=JSON.parse(legacySnap());m.stage=stageRun;m.anchor=stageAnchor;m.enemyFlags=E.map(e=>({id:e.id,rift:!!e.rift,champion:!!e.champion}));m.qs.push(QS.t);m.extra=P.map(p=>({st:p.st||{},offline:!!p.offline}));return JSON.stringify(m);};
const legacyApply=applySnap;applySnap=function(m){if(m.pg)return legacyApply(m);if(!Array.isArray(m.p)||!Array.isArray(m.e)||!Number.isFinite(m.q)||m.q<=lastQ)return;legacyApply(m);if(m.enemyFlags){const flags=new Map(m.enemyFlags.map(f=>[f.id,f]));E.forEach(e=>Object.assign(e,flags.get(e.id)||{}));}P.length=m.p.length;if(m.stage)stageRun=m.stage;if(m.anchor)stageAnchor=m.anchor;if(m.qs)QS.t=m.qs[2]||0;m.extra?.forEach((x,i)=>Object.assign(P[i],x));};
// Distinct objectives over the original wave progression. Inventory and upgrades persist.
const STAGES=[
 {name:'Поля рассвета',biome:0,mode:'hunt',desc:'Разбейте отряд захватчиков'},
 {name:'Лес шепчущих корней',biome:1,mode:'seal',desc:'Очистите врагов и удерживайте руну'},
 {name:'Ледяной перевал',biome:2,mode:'storm',desc:'Переживите метель и победите стража'},
 {name:'Болотный договор',biome:3,mode:'harvest',desc:'Соберите 6 осколков и зачистите топи'},
 {name:'Сердце разлома',biome:1,mode:'rift',desc:'Победите владыку и его подкрепления'}
];
let stageAnchor={x:WW/2,y:WH/2};
const legacyWave=nextWave;
nextWave=function(){
 const nextIndex=Math.floor(wave/3),s=STAGES[nextIndex%STAGES.length];
 if(nextIndex!==stageRun.index||wave===0){
  const seed=SEEDS.find(q=>q[2]===s.biome)||SEEDS[0];stageAnchor={x:cl(seed[0]*WW,550,WW-550),y:cl(seed[1]*WH,450,WH-450)};
  P.forEach((p,i)=>{if(p.offline)return;p.x=stageAnchor.x+i*40;p.y=stageAnchor.y;p.aim=null;});
  S=[];A=[];D=[];CH=[];PT=[];
 }
 stageRun={index:nextIndex,mode:s.mode,goal:s.mode==='seal'?8:s.mode==='harvest'?6:s.mode==='storm'?20:0,progress:0,done:false,total:1};
 legacyWave();P.forEach(p=>{if(p.offline){p.dead=1;p.hp=0;}});
 if(s.mode==='rift'){const boss=bossE(7+Math.floor(wave/3));boss.name='Владыка разлома';boss.r=44;boss.c='#bd75eb';boss.x=stageAnchor.x+350;boss.y=stageAnchor.y;boss.rift=true;E.push(boss);}
 if(s.mode==='storm'&&wave%3!==0){const chief=bossE(6);chief.name='Хрустальный надзиратель';chief.hp*=.55;chief.mhp=chief.hp;chief.r=30;chief.c='#b7e4f3';chief.x=stageAnchor.x+300;chief.y=stageAnchor.y-180;chief.champion=true;E.push(chief);}
 const pool=BP[s.biome];if(pool.length)for(let i=0;i<2;i++)E.push(spawnE(pool[Math.floor(R()*pool.length)],stageAnchor.x+rr(-380,380),stageAnchor.y+rr(-300,300)));
 if(s.mode==='harvest')for(let i=0;i<6;i++){const a=i/6*Math.PI*2;D.push({x:stageAnchor.x+Math.cos(a)*130,y:stageAnchor.y+Math.sin(a)*130,t:'shard',v:1});}
 stageRun.total=E.length;ban={t:4,s:`Этап ${nextIndex+1}: ${s.name}`};
};
const legacySpawn=spawnE;spawnE=function(type,x,y){const e=legacySpawn(type,x,y);const hard=sessionSettings.difficulty==='hard'?1.25:1;e.hp*=hard;e.mhp*=hard;e.d*=hard;return e;};
const legacyBoss=bossE;bossE=function(i){const e=legacyBoss(i);const hard=sessionSettings.difficulty==='hard'?1.25:1;e.hp*=hard;e.mhp*=hard;e.d*=hard;return e;};
const legacyBossAI=bossAI;bossAI=function(e,dt,pl,d,a){legacyBossAI(e,dt,pl,d,a);if(e.rift){e.pulse=(e.pulse||0)-dt;if(e.pulse<=0){e.pulse=5;ring(e,12,145,9,TIME());E.push(spawnE('wraith',e.x+40,e.y));}}};
ET.sentinel={hp:95,sp:65,d:13,r:17,c:'#e3b75d',xp:25,g:12};BP[2].push('sentinel');NEWT.push('sentinel');WU.sentinel=1;
ET.stalker={hp:65,sp:125,d:11,r:12,c:'#cb78c9',xp:20,g:10};BP[1].push('stalker');WU.stalker=1;
const legacyEnemy=en;en=function(e,t,pt){if(e.type==='sentinel'){
 g.save();g.translate(e.x,e.y);g.rotate(t*.7);g.fillStyle='#627f9b';g.strokeStyle='#f4db96';g.lineWidth=2;g.beginPath();for(let i=0;i<6;i++){const a=i*Math.PI/3;g.lineTo(Math.cos(a)*e.r,Math.sin(a)*e.r);}g.closePath();g.fill();g.stroke();g.restore();glow(e.x,e.y,24,'#8be6ff',.6);bar(e.x-20,e.y-25,40,e.hp,e.mhp,'#e8c16a');return;
 }if(e.type==='stalker'){g.save();g.globalAlpha=.75+.2*Math.sin(t*4);legacyEnemy({...e,type:'wolf',c:'#9d65b0'},t,pt);g.restore();return;}legacyEnemy(e,t,pt);};
const legacyMV=mv;mv=function(e,p,s,dt){if(e.type==='stalker'){e.dashTime=(e.dashTime||0)+dt;s*=Math.sin(e.dashTime*2)> .7?1.9:.7;}legacyMV(e,p,s,dt);};
const legacyUpdate=upd;upd=function(dt){
 if(NET!=='guest'&&state==='play'){
  // Pickups are handled before the original loot loop; other loot remains unchanged.
  D=D.filter(o=>{if(o.t!=='shard')return true;const p=P.find(p=>!p.dead&&Math.hypot(p.x-o.x,p.y-o.y)<28);if(!p)return true;stageRun.progress=Math.min(stageRun.goal,stageRun.progress+1);txt(p.x,p.y-35,'Осколок руны','#c7a2ff');return false;});
  if(stageRun.mode==='seal'&&P.some(p=>!p.dead&&Math.hypot(p.x-stageAnchor.x,p.y-stageAnchor.y)<85))stageRun.progress=Math.min(stageRun.goal,stageRun.progress+dt);
  if(stageRun.mode==='storm')stageRun.progress=Math.min(stageRun.goal,stageRun.progress+dt);
  if(stageRun.goal&&stageRun.progress<stageRun.goal&&E.length===0)wt=Math.max(wt,1+dt);
 }
 legacyUpdate(dt);
 if(NET!=='guest'&&state==='play'&&wave>0&&!E.length&&!stageRun.done&&stageRun.progress>=stageRun.goal){stageRun.done=true;P.forEach(p=>{if(!p.offline){p.gold+=25+wave*5;if(wave%3===0)p.pts++;}});spawnChest('reward',stageAnchor.x+30,stageAnchor.y);ban={t:3,s:'Этап волны завершён · награда получена'};}
};
// Shard pickups must not enter numeric resource counters in the legacy loop.
const legacyDropDrawGround=ground;ground=function(t){legacyDropDrawGround(t);if(stageRun.mode==='seal'){
 g.strokeStyle='#9ad9ed';g.lineWidth=3;g.beginPath();g.arc(stageAnchor.x,stageAnchor.y,85,0,7);g.stroke();g.save();g.translate(stageAnchor.x,stageAnchor.y);g.rotate(t*.3);g.strokeRect(-26,-26,52,52);g.restore();}
 D.filter(o=>o.t==='shard').forEach(o=>{glow(o.x,o.y,32,'#b28eff',.7);g.fillStyle='#e2caff';g.beginPath();g.moveTo(o.x,o.y-12);g.lineTo(o.x+7,o.y);g.lineTo(o.x,o.y+12);g.lineTo(o.x-7,o.y);g.fill();});
};
// Additional visual depth: canopies, rune ruins and class-specific spell sigils.
const legacyBG=makeBG;makeBG=function(){legacyBG();const b=bgc.getContext('2d');
 for(let i=0;i<90;i++){const x=rnd(i,91)*WW,y=rnd(i,92)*WH,k=biomeAt(x,y);if(k===2){b.strokeStyle='#a9c7df88';b.lineWidth=1;for(let j=0;j<3;j++){b.beginPath();b.moveTo(x+j*7,y);b.lineTo(x+25+j*5,y+30);b.stroke();}}else{b.fillStyle=k===3?'#8cb34d44':'#102e2540';b.beginPath();b.ellipse(x,y,35+rnd(i,93)*35,12, -.5,0,7);b.fill();}}
 for(let i=0;i<18;i++){const x=rnd(i,95)*WW,y=rnd(i,96)*WH;b.fillStyle='#283d4599';b.fillRect(x-20,y-15,40,30);b.strokeStyle='#b0d9d866';b.lineWidth=2;b.strokeRect(x-16,y-11,32,22);b.fillStyle='#7fd9e8';b.fillRect(x-2,y-8,4,16);}
};
const legacyNode=nd;nd=function(n,t){legacyNode(n,t);if(n.t==='tree'&&biomeAt(n.x,n.y)!==2){g.save();g.globalAlpha=.18;g.fillStyle='#b8e690';for(let i=0;i<4;i++){g.beginPath();g.ellipse(n.x-17+i*9,n.y-40-Math.sin(i)*10,8,3,-.4,0,7);g.fill();}g.restore();}};
const legacyHero=hero;hero=function(p,t){
 const c=p.cl||0,col=['#ed916a','#8bdd98','#c49aff','#fff0a4','#9fd9ec'][c];
 if(p.cd?.some((v,i)=>v>[3,5,13][i])){g.save();g.strokeStyle=col;g.globalAlpha=.5;g.lineWidth=1.5;g.beginPath();g.ellipse(p.x,p.y+10,24+Math.sin(t*8)*3,9,0,0,7);g.stroke();g.restore();}
 legacyHero(p,t);
 if(c===1){g.strokeStyle='#c9e4ad';g.lineWidth=1;g.beginPath();g.moveTo(p.x-7,p.y-7);g.lineTo(p.x+6,p.y+7);g.stroke();}
 if(c===4){g.fillStyle='#d8e3ef';g.fillRect(p.x-10,p.y-5,20,3);}
 if((p.g?.armor||0)>1){g.fillStyle=col;for(const sign of [-1,1]){g.beginPath();g.moveTo(p.x+sign*8,p.y-7);g.lineTo(p.x+sign*16,p.y-12);g.lineTo(p.x+sign*13,p.y);g.fill();}}
};
const legacyDrawFX=drawFX;drawFX=function(t){if(quality==='low'){PT=PT.slice(-60);return;}legacyDrawFX(t);};
const legacyLight=light;light=function(t){if(quality!=='low')legacyLight(t);};
const legacyGrade=grade;grade=function(t){if(quality!=='low')legacyGrade(t);};
const legacyDraw=draw;draw=function(){
 legacyDraw();const s=STAGES[stageRun.index%STAGES.length];const progress=stageRun.goal?`${Math.floor(stageRun.progress)} / ${stageRun.goal}${stageRun.mode==='seal'||stageRun.mode==='storm'?' с':''}`:`Врагов осталось: ${E.length}`;
 $('stageInfo').innerHTML=`Этап ${stageRun.index+1} · ${s.name}<br>${s.desc}<br>${progress}<progress max="${stageRun.goal||stageRun.total}" value="${stageRun.goal?stageRun.progress:Math.max(0,stageRun.total-E.length)}"></progress>`;
};
// Preserve native browser F11 where the API is unavailable. All aiming uses CSS bounds.
$('over').innerHTML='<h1>Поражение</h1><p id="ovs"></p><button onclick="restartGame()">Заново (хозяин)</button><button onclick="returnMenu()">В меню</button>';
function restartGame(){if(NET==='guest'){$('ovs').textContent='Ожидаем перезапуска хозяином.';return;}if(NET==='host')roomSend({op:'restart',difficulty:sessionSettings.difficulty});else{const classes=P.map(p=>p.cl||0);start(coop);classes.forEach((k,i)=>setCls(i,k));}}
const vegetationSprites=new Map();
function vegetationSprite(type,biome,variant){
 const key=type+biome+variant;if(vegetationSprites.has(key))return vegetationSprites.get(key);
 const c=document.createElement('canvas');c.width=160;c.height=180;const b=c.getContext('2d');
 b.translate(80,150);b.fillStyle='#06131644';b.beginPath();b.ellipse(5,5,36,11,0,0,7);b.fill();
 if(type==='tree'){
  b.strokeStyle='#4b3228';b.lineWidth=10;b.lineCap='round';b.beginPath();b.moveTo(0,3);b.lineTo(-2,-62);b.stroke();
  b.strokeStyle='#9d7950';b.lineWidth=2;b.beginPath();b.moveTo(1,-4);b.lineTo(1,-59);b.stroke();
  for(const sign of [-1,1]){b.strokeStyle='#604a31';b.lineWidth=5;b.beginPath();b.moveTo(0,-12);b.lineTo(sign*18,3);b.stroke();b.beginPath();b.moveTo(0,-40);b.lineTo(sign*22,-65);b.stroke();}
  if(biome===2){
   for(let j=0;j<4;j++){const y=-36-j*19,w=39-j*8;b.fillStyle=j%2?'#244f51':'#326568';b.beginPath();b.moveTo(0,y-39);b.lineTo(w,y+9);b.quadraticCurveTo(0,y+20,-w,y+9);b.closePath();b.fill();b.fillStyle='#dceff4';b.beginPath();b.moveTo(0,y-39);b.lineTo(w*.55,y-9);b.quadraticCurveTo(0,y,-w*.55,y-9);b.fill();}
  }else{
   const colors=biome===3?['#304d39','#456d45','#66854a']:biome===1?['#153f37','#21614a','#3d8359']:['#286441','#3b8751','#75ab5d'];
   for(let j=0;j<16;j++){const a=j*2.4,rad=Math.sqrt(j/16)*35,x=Math.cos(a)*rad,y=-76+Math.sin(a)*rad*.7;
    const gr=b.createRadialGradient(x-5,y-9,1,x,y,24);gr.addColorStop(0,colors[2]);gr.addColorStop(.45,colors[1]);gr.addColorStop(1,colors[0]);b.fillStyle=gr;b.beginPath();b.ellipse(x,y,23,18,-.3,0,7);b.fill();
   }
   b.fillStyle='#b8d18c55';for(let j=0;j<90;j++){const x=(rnd(j+variant*30,86)-.5)*78,y=-105+rnd(j+variant,87)*53;b.beginPath();b.ellipse(x,y,2.5,1.2,-.5,0,7);b.fill();}
   if(biome===3){b.strokeStyle='#93a86499';b.lineWidth=1.5;for(let j=0;j<10;j++){const x=-36+j*8;b.beginPath();b.moveTo(x,-65);b.quadraticCurveTo(x-8,-42,x-4,-26-rnd(j,89)*15);b.stroke();}}
  }
 }else{
  const points=[[-29,-1],[-33,-19],[-17,-36],[12,-40],[32,-19],[30,0],[5,8]];
  b.fillStyle=biome===2?'#9bb4cb':'#586979';b.beginPath();points.forEach(q=>b.lineTo(...q));b.closePath();b.fill();
  const facets=[[[ -33,-19],[-17,-36],[-3,-14]], [[-17,-36],[12,-40],[-3,-14]],[[12,-40],[32,-19],[-3,-14]], [[32,-19],[30,0],[-3,-14]], [[30,0],[5,8],[-3,-14]], [[5,8],[-29,-1],[-3,-14]]];
  facets.forEach((f,j)=>{b.fillStyle=['#778b9e','#b0bdc4','#92a4b0','#4a596c','#566979','#657b88'][j];b.beginPath();f.forEach(q=>b.lineTo(...q));b.fill();});
  b.strokeStyle='#25364999';b.lineWidth=1;b.beginPath();b.moveTo(9,-29);b.lineTo(4,-20);b.lineTo(9,-12);b.stroke();
  b.fillStyle=biome===2?'#e7f5fc':'#80a269';for(let j=0;j<8;j++){b.beginPath();b.ellipse(-20+j*5,-5+Math.sin(j)*3,4,2,0,0,7);b.fill();}
 }
 vegetationSprites.set(key,c);return c;
}
nd=function(n,t){const b=biomeAt(n.x,n.y),variant=Math.floor(n.x)%3,sprite=vegetationSprite(n.t,b,variant),scale=n.t==='tree'?.85: .8;
 g.drawImage(sprite,n.x-80*scale,n.y-150*scale,160*scale,180*scale);
 if(n.hp<n.mhp)bar(n.x-20,n.y-15,40,n.hp,n.mhp,'#a9cf81');
 if(P.some(p=>!p.dead&&Math.hypot(p.x-n.x,p.y-n.y)<110)){g.font='12px sans-serif';g.textAlign='center';g.fillStyle='#efd19a';g.fillText(n.t==='tree'?'Дерево · топор':'Руда · кирка',n.x,n.y+(n.t==='tree'?23:20));}
};
const originalExtendedGround=ground;ground=function(t){originalExtendedGround(t);if(stageRun.mode==='rift'){
 g.save();g.translate(stageAnchor.x,stageAnchor.y);g.rotate(-t*.12);g.strokeStyle='#c08fe488';g.lineWidth=3;
 for(let j=0;j<3;j++){g.beginPath();g.arc(0,0,100+j*45,0,Math.PI*2);g.stroke();}
 for(let j=0;j<12;j++){g.rotate(Math.PI/6);g.strokeRect(125,-8,16,16);}g.restore();
 }};
const originalExtendedEnemy=en;en=function(e,t,pt){originalExtendedEnemy(e,t,pt);if(e.champion){g.strokeStyle='#d3f4ff';g.lineWidth=3;g.beginPath();g.arc(e.x,e.y,e.r+10,0,Math.PI*2);g.stroke();}if(e.rift){g.save();g.translate(e.x,e.y);g.rotate(t);g.strokeStyle='#f0bcff';g.lineWidth=2;g.beginPath();for(let j=0;j<8;j++){const a=j*Math.PI/4,r=j%2?e.r*1.2:e.r*1.7;g.lineTo(Math.cos(a)*r,Math.sin(a)*r);}g.closePath();g.stroke();g.restore();}};
