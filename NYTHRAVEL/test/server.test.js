const {test}=require('node:test');
const assert=require('node:assert/strict');
const WebSocket=require('ws');
const {createGameServer}=require('../server');
test('HTTP files, isolated lobbies, three players, host start, deduplication and disconnect',async()=>{
 const {server,wss}=createGameServer();await new Promise(r=>server.listen(0,'127.0.0.1',r));const port=server.address().port,clients=[];
 const connect=()=>new Promise(resolve=>{const ws=new WebSocket(`ws://127.0.0.1:${port}`);clients.push(ws);ws.messages=[];ws.on('message',raw=>ws.messages.push(JSON.parse(raw)));ws.on('open',()=>resolve(ws));});
 const send=(ws,m)=>ws.send(JSON.stringify(m));
 const wait=async(ws,p)=>{for(let i=0;i<100;i++){const j=ws.messages.findIndex(p);if(j>=0)return ws.messages.splice(j,1)[0];await new Promise(r=>setTimeout(r,10));}throw Error('Missing message '+p);};
 try{
 for(const file of ['/','/game.js','/enhancements.js','/style.css'])assert.equal((await fetch(`http://127.0.0.1:${port}${file}`)).status,200);
 assert.equal((await fetch(`http://127.0.0.1:${port}/server.js`)).status,404);
 const h=await connect();send(h,{op:'create',name:'host',cl:0});const room=(await wait(h,m=>m.sys==='lobby')).code;
 const second=await connect();send(second,{op:'create'});const other=(await wait(second,m=>m.sys==='lobby')).code;assert.notEqual(room,other);
 const g1=await connect();send(g1,{op:'join',code:room,cl:1});await wait(g1,m=>m.sys==='lobby');
 const g2=await connect();send(g2,{op:'join',code:room,cl:2});assert.equal((await wait(g2,m=>m.sys==='lobby')).players.length,3);
 const extra=await connect();send(extra,{op:'join',code:room});assert.match((await wait(extra,m=>m.sys==='error')).message,/заполнена/);
 send(extra,{op:'join',code:'BADBAD'});assert.match((await wait(extra,m=>m.sys==='error')).message,/существует/);
 assert(!h.messages.some(m=>m.sys==='start'));
 send(g1,{op:'start'});assert.match((await wait(g1,m=>m.sys==='error')).message,/хозяин/);
 send(h,{op:'start'});for(const c of [h,g1,g2])await wait(c,m=>m.sys==='start');
 send(extra,{op:'join',code:room});assert.match((await wait(extra,m=>m.sys==='error')).message,/началась/);
 send(g1,{t:'u',k:'hp',slot:2,id:1,expected:0});const action=await wait(h,m=>m.t==='u');assert.equal(action.slot,1);
 send(g1,{t:'u',k:'hp',id:1});send(g1,{t:'p',s:77});await wait(h,m=>m.t==='p');assert(!h.messages.some(m=>m.t==='u'));
 send(h,{p:[],e:[],q:1});await wait(g1,m=>m.q===1);await wait(g2,m=>m.q===1);assert(!second.messages.some(m=>m.q===1));
 send(g2,{op:'leave'});assert.equal((await wait(h,m=>m.sys==='playerLeft')).slot,2);
 send(h,{op:'restart'});await wait(g1,m=>m.sys==='start');
 send(h,{op:'leave'});await wait(g1,m=>m.sys==='gone');
 }finally{clients.forEach(c=>c.terminate());await new Promise(r=>wss.close(r));await new Promise(r=>server.close(r));}
});
test('IP lobby: explicit host, no code, capacity, isolation and reopening',async()=>{
 const {server,wss}=createGameServer();await new Promise(r=>server.listen(0,'127.0.0.1',r));const clients=[];
 const connect=()=>new Promise(resolve=>{const ws=new WebSocket(`ws://127.0.0.1:${server.address().port}`);clients.push(ws);ws.messages=[];ws.on('message',raw=>ws.messages.push(JSON.parse(raw)));ws.on('open',()=>resolve(ws));});
 const send=(ws,m)=>ws.send(JSON.stringify(m));
 const wait=async(ws,p)=>{for(let i=0;i<100;i++){const j=ws.messages.findIndex(p);if(j>=0)return ws.messages.splice(j,1)[0];await new Promise(r=>setTimeout(r,10));}throw Error('Missing direct-lobby message');};
 try{
 const guest=await connect();send(guest,{op:'joinDirect'});assert.match((await wait(guest,m=>m.sys==='error')).message,/нет игры по IP/);
 const coded=await connect();send(coded,{op:'create'});await wait(coded,m=>m.sys==='lobby');
 send(guest,{op:'joinDirect'});assert.match((await wait(guest,m=>m.sys==='error')).message,/нет игры по IP/);
 const host=await connect();send(host,{op:'createDirect',name:'Host'});assert.equal((await wait(host,m=>m.sys==='lobby')).direct,true);
 const extra=await connect();send(extra,{op:'createDirect'});assert.match((await wait(extra,m=>m.sys==='error')).message,/уже создана/);
 send(guest,{op:'joinDirect'});await wait(guest,m=>m.sys==='lobby');
 const third=await connect();send(third,{op:'joinDirect'});assert.equal((await wait(third,m=>m.sys==='lobby')).players.length,3);
 send(extra,{op:'joinDirect'});assert.match((await wait(extra,m=>m.sys==='error')).message,/заполнена/);
 assert(!host.messages.some(m=>m.sys==='start'));send(host,{op:'start'});for(const c of [host,guest,third])await wait(c,m=>m.sys==='start');
 send(extra,{op:'joinDirect'});assert.match((await wait(extra,m=>m.sys==='error')).message,/началась/);
 send(host,{p:[],e:[],q:8});await wait(guest,m=>m.q===8);await wait(third,m=>m.q===8);assert(!coded.messages.some(m=>m.q===8));
 send(host,{op:'leave'});await wait(guest,m=>m.sys==='gone');send(extra,{op:'createDirect'});assert.equal((await wait(extra,m=>m.sys==='lobby')).direct,true);
 }finally{clients.forEach(c=>c.terminate());await new Promise(r=>wss.close(r));await new Promise(r=>server.close(r));}
});
test('Server owns inventory/gold and validates economy independently of host snapshots',async()=>{
 const {server,wss}=createGameServer();await new Promise(r=>server.listen(0,'127.0.0.1',r));const clients=[];
 const connect=()=>new Promise(resolve=>{const ws=new WebSocket(`ws://127.0.0.1:${server.address().port}`);clients.push(ws);ws.messages=[];ws.on('message',raw=>ws.messages.push(JSON.parse(raw)));ws.on('open',()=>resolve(ws));});
 const send=(ws,m)=>ws.send(JSON.stringify(m));const wait=async(ws,p)=>{for(let i=0;i<150;i++){const j=ws.messages.findIndex(p);if(j>=0)return ws.messages.splice(j,1)[0];await new Promise(r=>setTimeout(r,10));}throw Error('Missing authoritative economy message');};
 try{
 const host=await connect(),guest=await connect();send(host,{op:'createDirect'});await wait(host,m=>m.sys==='lobby');send(guest,{op:'joinDirect'});await wait(guest,m=>m.sys==='lobby');send(host,{op:'start'});await wait(guest,m=>m.sys==='start');await wait(guest,m=>m.sys==='economy');
 const C=require('../catalogue');send(host,{op:'worldDelta',seq:1,deltas:[{slot:0,gold:50,items:[C.make('steel-sword')]},{slot:1,gold:100,items:[C.make('traveler-helm'),C.make('ash-bow')]}]});const snapshot=await wait(guest,m=>m.sys==='economy'&&m.ackWorld===1);const own=snapshot.players[1].bag[0].uid,other=snapshot.players[0].bag[0].uid;
 send(guest,{op:'worldDelta',seq:2,deltas:[{slot:1,gold:9999,items:[]}]});assert.match((await wait(guest,m=>m.sys==='error')).message,/только хозяин/);
 send(guest,{op:'economy',id:1,kind:'sell',items:[other]});assert.match((await wait(guest,m=>m.sys==='error')).message,/сумке/);
 send(guest,{op:'economy',id:2,kind:'sell',items:[own]});const sold=await wait(guest,m=>m.sys==='economy'&&m.players[1].bag.length===1);assert.equal(sold.players[1].gold,114);
 send(guest,{op:'economy',id:2,kind:'sell',items:[own]});assert.match((await wait(guest,m=>m.sys==='error')).message,/Повторная/);
 const row=()=>[1800,1200,100,100,0,30,1,1,999999,0,0,0,1,0,0,[0,0,0],0,0,0,{},0,[0,0,0,0,0],0,{},{}];send(host,{q:19,p:[row(),row()],e:[],ex:[[{},{},[]],[{},{},snapshot.players[1].bag]]});const authoritative=await wait(guest,m=>m.q===19);assert.equal(authoritative.p[1][8],114);assert.equal(authoritative.ex[1][2].length,1);assert(!authoritative.ex[1][2].some(i=>i.uid===own));
 send(host,{op:'economy',id:1,kind:'invite',target:1});const pending=await wait(guest,m=>m.sys==='economy'&&Object.keys(m.trades).length===1);const trade=Object.keys(pending.trades)[0];send(guest,{op:'economy',id:3,kind:'accept',trade});await wait(guest,m=>m.sys==='economy'&&m.trades[trade]?.state==='active');send(guest,{op:'leave'});const canceled=await wait(host,m=>m.sys==='economy'&&Object.keys(m.trades).length===0&&m.revision>pending.revision);assert.equal(canceled.players[1].gold,114);
 }finally{clients.forEach(c=>c.terminate());await new Promise(r=>wss.close(r));await new Promise(r=>server.close(r));}
});
