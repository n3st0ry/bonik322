'use strict';
const http = require('node:http');
const fs = require('node:fs');
const path = require('node:path');
const crypto = require('node:crypto');
const WebSocket = require('ws');
const {Economy}=require('./economy');
const World=require('./world-rules');
const files = {'/':'rpg.html','/rpg.html':'rpg.html','/game.js':'game.js','/enhancements.js':'enhancements.js','/style.css':'style.css','/balance-config.js':'balance-config.js','/balance.js':'balance.js','/interface.js':'interface.js','/assets/nythravel-logo.svg':'assets/nythravel-logo.svg','/assets/nythravel-favicon.svg':'assets/nythravel-favicon.svg','/assets/nythravel-icon-192.png':'assets/nythravel-icon-192.png','/assets/nythravel-background.webp':'assets/nythravel-background.webp','/favicon.ico':'assets/nythravel-favicon.ico','/site.webmanifest':'site.webmanifest','/catalogue.js':'catalogue.js','/economy.js':'economy.js','/economy-runtime.js':'economy-runtime.js'};
function createGameServer() {
  const rooms = new Map();
  let directRoom=null;
  const server = http.createServer((req,res) => {
    let pathname;
    try { pathname = new URL(req.url,'http://localhost').pathname; } catch {res.writeHead(400);return res.end();}
    const dynamic=/^\/assets\/(?:v5-[a-z-]+\.webp|audio\/[a-z0-9-]+\.wav)$/.test(pathname)?pathname.slice(1):null;const moduleFile=['/world-rules.js','/world-runtime.js','/audio.js','/visuals.js','/progression-rules.js','/progression-runtime.js'].includes(pathname)?pathname.slice(1):null;const file=files[pathname]||dynamic||moduleFile;
    if (!file || !['GET','HEAD'].includes(req.method)) {res.writeHead(404);return res.end('NYTHRAVEL: Not found');}
    fs.readFile(path.join(__dirname,file),(err,data)=>{
      if(err){res.writeHead(500);return res.end('NYTHRAVEL: Unable to load game files');}
      res.writeHead(200,{'Content-Type':({'.js':'text/javascript; charset=utf-8','.css':'text/css; charset=utf-8','.svg':'image/svg+xml','.png':'image/png','.webp':'image/webp','.ico':'image/x-icon','.wav':'audio/wav','.webmanifest':'application/manifest+json','.html':'text/html; charset=utf-8'})[path.extname(file)]||'application/octet-stream','Cache-Control':'no-store','X-Content-Type-Options':'nosniff'});
      res.end(req.method==='HEAD'?undefined:data);
    });
  });
  const wss = new WebSocket.Server({server,maxPayload:1024*1024});
  wss.on('error',()=>{}); // HTTP server handles listen errors (for example a busy port).
  const send=(ws,m)=>{if(ws?.readyState===WebSocket.OPEN)ws.send(JSON.stringify(m));};
  const broadcast=(r,m)=>r.players.forEach((_,ws)=>send(ws,m));
  const economyMessage=(r,effect=null,receipt=null)=>({sys:'economy',...r.economy.snapshot(),epoch:r.epoch,effect,receipt});
  const roster=r=>({sys:'lobby',code:r.code,direct:!!r.direct,status:r.status,epoch:r.epoch,settings:r.settings,players:[...r.players.values()].map(({slot,name,cl})=>({slot,name,cl}))});
  function leave(ws) {
    const r=ws.room;if(!r)return;ws.room=null;
    const p=r.players.get(ws);r.players.delete(ws);
    if(p.slot===0){if(directRoom===r)directRoom=null;rooms.delete(r.code);r.players.forEach((_,other)=>{other.room=null;send(other,{sys:'gone'});});}
    else {if(r.economy){r.economy.setContext(p.slot,{offline:true});r.economy.cancelFor(p.slot);broadcast(r,economyMessage(r));}send(r.host,{sys:'playerLeft',slot:p.slot});broadcast(r,roster(r));}
  }
  wss.on('connection',ws=>{
    ws.alive=true;ws.on('pong',()=>ws.alive=true);
    ws.on('error',()=>{});ws.on('close',()=>leave(ws));
    ws.on('message',(raw,binary)=>{
      if(binary)return;let m;try{m=JSON.parse(raw.toString());}catch{return;}
      if(!m||typeof m!=='object'||Array.isArray(m))return;
      const fail=message=>send(ws,{sys:'error',message});
      if(m.op==='leave'){leave(ws);return send(ws,{sys:'left'});}
      if(['create','join','createDirect','joinDirect'].includes(m.op)){
        if(ws.room)return fail('Сначала выйдите из текущей комнаты.');
        let r;
        if(m.op==='create'||m.op==='createDirect'){
          if(m.op==='createDirect'&&directRoom)return fail('Игра по IP уже создана. Присоединитесь к ней или дождитесь выхода хозяина.');
          if(rooms.size>=500)return fail('Сервер заполнен.');
          let code;do{code=crypto.randomBytes(3).toString('hex').toUpperCase();}while(rooms.has(code));
          r={code,direct:m.op==='createDirect',status:'waiting',players:new Map(),host:ws,settings:{difficulty:'normal'}};rooms.set(code,r);if(r.direct)directRoom=r;
        }else{
          r=m.op==='joinDirect'?directRoom:rooms.get(String(m.code||'').trim().toUpperCase());
          if(!r&&m.op==='joinDirect')return fail('На этом сервере нет игры по IP. Хозяин должен нажать «Создать игру по IP».');
          if(!r)return fail('Комната не существует или закрыта.');
          if(r.status!=='waiting')return fail('Игра уже началась.');
          if(r.players.size>=3)return fail('Комната заполнена (максимум 3).');
        }
        const occupied=[...r.players.values()].map(p=>p.slot),slot=[0,1,2].find(i=>!occupied.includes(i));
        r.players.set(ws,{slot,name:String(m.name||'Искатель').replace(/[<>\x00-\x1f]/g,'').slice(0,24),cl:Number.isInteger(m.cl)&&m.cl>=0&&m.cl<5?m.cl:0,lastId:0,count:0,since:Date.now()});
        ws.room=r;send(ws,{sys:'role',r:slot===0?'host':'guest',slot});broadcast(r,roster(r));return;
      }
      const r=ws.room;if(!r)return fail('Сначала создайте комнату или введите код.');
      const p=r.players.get(ws);
      if(r.status==='playing'&&m.epoch&&m.epoch!==r.epoch)return;
      if(m.op==='profile'&&r.status==='waiting'){
        if(Number.isInteger(m.cl)&&m.cl>=0&&m.cl<5)p.cl=m.cl;
        if(typeof m.name==='string')p.name=m.name.replace(/[<>\x00-\x1f]/g,'').slice(0,24)||'Искатель';
        broadcast(r,roster(r));return;
      }
      if(m.op==='start'||m.op==='restart'){
        if(p.slot!==0)return fail('Только хозяин запускает игру.');
        if(m.op==='start'&&r.status!=='waiting')return;
        if(m.op==='restart'&&r.status!=='playing')return;
        r.status='playing';r.epoch=crypto.randomUUID();
        r.settings.difficulty=m.difficulty==='hard'?'hard':'normal';
        r.players.forEach(p=>p.lastId=0);
        r.world=new World.ResourceWorld(crypto.randomBytes(4).readUInt32LE());
        r.economy=new Economy([...r.players.values()],{uuid:()=>crypto.randomUUID()});
        broadcast(r,{...roster(r),sys:'start'});broadcast(r,economyMessage(r));broadcast(r,{sys:'world',epoch:r.epoch,...r.world.snapshot(Date.now())});return;
      }
      if(r.status!=='playing')return;
      if(Date.now()-p.since>1000){p.count=0;p.since=Date.now();}if(++p.count>120)return;
      if(m.op==='harvest'){const assets=r.economy.players[p.slot],context=r.economy.context[p.slot];const available={...assets,bag:assets.bag.filter(i=>!r.economy.locked(i.uid)),eq:Object.fromEntries(Object.entries(assets.eq).filter(([,i])=>!r.economy.locked(i.uid)))};const result=r.world.harvest(p.slot,m,context,available,Date.now());if(result.ok){assets.wood=available.wood;assets.ore=available.ore;if(result.quantity)r.economy.recordProgress(p.slot,{kind:result.resource,amount:result.quantity});}if(!result.ok)return fail(result.message);r.economy.revision++;broadcast(r,economyMessage(r));broadcast(r,{sys:'world',epoch:r.epoch,seed:r.world.seed,revision:r.world.revision,partial:true,nodes:[result.node],harvest:{slot:p.slot,node:m.node,quantity:result.quantity,resource:result.resource}});return;}
      if(m.op==='worldDelta'){if(p.slot!==0)return fail('Награды назначает только хозяин симуляции.');const result=r.economy.worldDelta(m.seq,m.deltas);if(!result.ok)return fail(result.message);broadcast(r,economyMessage(r));return;}
      if(m.op==='economy'){const result=r.economy.act(p.slot,m);if(!result.ok)return fail(result.message);broadcast(r,economyMessage(r,result.effect,{slot:p.slot,kind:m.kind}));return;}
      if(p.slot===0){
        if(m.p&&m.e&&Number.isFinite(m.q)){
          m.p.forEach((row,slot)=>{if(!Array.isArray(row))return;r.economy.setContext(slot,{x:row[0],y:row[1],lvl:row[6],wave:m.w,dead:!!row[17],weapon:row[18],fx:row[12],fy:row[13]});const owner=r.economy.players[slot];if(owner){row[8]=owner.gold;row[9]=owner.wood;row[10]=owner.ore;row[11]=owner.wp;row[21]=owner.wl;row[22]=owner.asu;}});
          m.ex=m.p.map((row,slot)=>{const owner=r.economy.players[slot];return owner?[owner.bt,owner.eq,owner.bag]:[{}, {}, []];});m.economy=r.economy.snapshot();m.epoch=r.epoch;delete m.n;if(r.world.tick(Date.now()))broadcast(r,{sys:'world',epoch:r.epoch,...r.world.snapshot(Date.now())});
          r.players.forEach((other,target)=>{if(other.slot!==0)send(target,m);});
        }
        else if(Number.isFinite(m.pg))r.players.forEach((other,target)=>{if(other.slot!==0)send(target,m);});
      } else {
        if(!['k','u','q','g','f','c','s','w','b','p'].includes(m.t))return;
        if(m.t!=='k'&&m.t!=='p'){
          if(!Number.isSafeInteger(m.id)||m.id<=p.lastId)return;p.lastId=m.id;
        }
        if(['q','g','f','b','s'].includes(m.t)){
          let request={id:m.id};const owner=r.economy.players[p.slot];
          if(m.t==='q'){request=m.a===0?{...request,kind:'equip',uid:owner.bag[m.k]?.uid}:m.a===1?{...request,kind:'unequip',slot:['helm','armor','boots','amu','ring','weapon','gloves','talisman'][m.k]}:{...request,kind:'sell',items:[owner.bag[m.k]?.uid]};}
          if(m.t==='g')request={...request,kind:'legacyGear',group:m.s};if(m.t==='f')request={...request,kind:'legacyBuff',key:m.b};if(m.t==='b')request={...request,kind:'legacyBuy',what:m.w};if(m.t==='s')request={...request,kind:'legacyUpgrade',key:m.k,weapon:0};
          const result=r.economy.act(p.slot,request);if(!result.ok)return fail(result.message);broadcast(r,economyMessage(r,result.effect));return;
        }
        if(m.t==='k'){
          m.b=Array.from({length:8},(_,i)=>m.b?.[i]?1:0);
          m.m=Array.isArray(m.m)&&m.m.length===2&&m.m.every(Number.isFinite)?m.m.map(x=>Math.max(-10000,Math.min(10000,x))):null;
        }
        delete m.sys;delete m.op;m.slot=p.slot;send(r.host,m);
      }
    });
  });
  const heartbeat=setInterval(()=>wss.clients.forEach(ws=>{if(!ws.alive)return ws.terminate();ws.alive=false;ws.ping();}),15000);
  heartbeat.unref();server.on('close',()=>clearInterval(heartbeat));
  return {server,wss,rooms};
}
if(require.main===module){
  const {server}=createGameServer();
  server.on('error',err=>{console.error(err.code==='EADDRINUSE'?'Порт занят. Закройте другой сервер или задайте PORT.':err.message);process.exitCode=1;});
  const port=Number(process.env.PORT||3000);
  if(!Number.isInteger(port)||port<0||port>65535){console.error('Некорректный PORT');process.exitCode=1;}
  else server.listen(port,'0.0.0.0',()=>{
    const actualPort=server.address().port;
    console.log(`NYTHRAVEL: http://localhost:${actualPort}`);
    for(const addresses of Object.values(require('node:os').networkInterfaces()))for(const address of addresses||[])if(address.family==='IPv4'&&!address.internal)console.log(`Для друзей в вашей сети: http://${address.address}:${actualPort} · подключение по IP: ${address.address}:${actualPort}`);
    console.log('Мультиплеер → Создать игру по IP. Гости подключаются по адресу без кода. Максимум 3 игрока.');
  });
}
module.exports={createGameServer};
