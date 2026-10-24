/* Item content and prices shared by the browser and authoritative economy server. */
(function(root,factory){const api=factory();if(typeof module==='object'&&module.exports)module.exports=api;else root.NYTHRAVEL_CATALOGUE=api;})(globalThis,()=>{
 const merchant={x:3780,y:2230,range:135,safeRadius:110};
 const rows=[
 ['steel-sword','Стальной клинок','weapon',0,75,18,{dm:.035},'Меч ремесленника. Надёжен в ближнем бою.',0],
 ['moon-sword','Лунная сталь','weapon',2,420,100,{dm:.10,hp:8},'Клинок, закалённый в лунном свете.',0],
 ['shade-dagger','Кинжал сумрака','weapon',1,160,38,{dm:.035,sp:.02},'Лёгкий клинок для подвижного бойца.',0],
 ['wood-axe','Топор поселенца','weapon',0,65,15,{dm:.025},'И оружие, и инструмент для заготовки дерева.',3],
 ['rift-axe','Топор разлома','weapon',3,980,240,{dm:.14,hp:15},'Тяжёлая кристаллическая секира.',3],
 ['ash-bow','Ясеневый лук','weapon',0,75,18,{dm:.03},'Гибкое дерево и крепкая тетива.',1],
 ['wind-bow','Лук ветров','weapon',2,430,105,{dm:.08,sp:.025},'Тихий выстрел на границе леса.',1],
 ['apprentice-staff','Посох ученика','weapon',0,75,18,{dm:.03},'Простой фокус для магических сфер.',2],
 ['amethyst-staff','Аметистовый посох','weapon',3,1050,260,{dm:.14},'Резонатор фиолетового кристалла.',2],
 ['traveler-helm','Шлем путника','helm',0,60,14,{hp:12},'Защита для первых путешествий.'],
 ['warden-helm','Шлем дозорного','helm',1,180,43,{hp:22},'Знак стражи северной дороги.'],
 ['crystal-crown','Кристальный венец','helm',3,920,225,{hp:42,dm:.025},'Серебряная оправа удерживает свет кристалла.'],
 ['linen-vest','Походный нагрудник','armor',0,65,15,{ar:.035},'Плотная ткань и кожаные накладки.'],
 ['guard-mail','Кольчуга стражи','armor',1,210,50,{ar:.065},'Кольца смягчают физические удары.'],
 ['night-plate','Латы ночного дозора','armor',2,520,125,{ar:.105,hp:10},'Усиленная защита без тяжёлой поступи.'],
 ['work-gloves','Перчатки мастера','gloves',0,55,13,{dm:.02},'Крепкий хват оружия и инструмента.'],
 ['duelist-gloves','Перчатки дуэлянта','gloves',1,185,44,{dm:.04},'Тонкие пластины защищают руки.'],
 ['star-gloves','Звёздные рукавицы','gloves',3,900,220,{dm:.08,hp:8},'В швах мерцает осколочная пыль.'],
 ['road-boots','Сапоги дорог','boots',0,60,14,{sp:.025},'Надёжная подошва для дальнего пути.'],
 ['scout-boots','Сапоги разведчика','boots',1,190,45,{sp:.045},'Мягкая кожа не мешает движению.'],
 ['mist-boots','Поступь тумана','boots',2,490,118,{sp:.07},'Лёгкая поступь сквозь холодный туман.'],
 ['copper-ring','Медное кольцо','ring',0,70,16,{vp:.006},'Слабый отголосок жизненной магии.'],
 ['garnet-ring','Гранатовое кольцо','ring',1,220,52,{vp:.012},'Тёплый камень отвечает на удары.'],
 ['eclipse-ring','Кольцо затмения','ring',3,1100,270,{vp:.025,dm:.025},'Редкий круг из тёмного серебра.'],
 ['blue-amulet','Синий оберег','amu',0,75,18,{dm:.025},'Маленький кристалл направляет силу.'],
 ['silver-amulet','Серебряная печать','amu',2,510,122,{dm:.07,hp:10},'Печать мастеров разрушенной цитадели.'],
 ['path-talisman','Талисман пути','talisman',0,70,16,{sp:.015,hp:6},'Помнит каждый пройденный перекрёсток.'],
 ['dawn-talisman','Талисман рассвета','talisman',2,540,130,{hp:24,ar:.025},'Тёплый свет среди ночных руин.'],
 ['health-vial','Малое зелье жизни','consumable',0,24,5,{},'Восстанавливает 30% максимального HP.',null,null,{type:'heal',amount:.30}],
 ['health-flask','Большое зелье жизни','consumable',1,60,14,{},'Восстанавливает 55% максимального HP.',null,null,{type:'heal',amount:.55}],
 ['stamina-vial','Настой бодрости','consumable',0,22,5,{},'Восстанавливает 45 выносливости.',null,null,{type:'stamina',amount:45}],
 ['rage-draught','Настой ярости','consumable',1,45,10,{},'Усиление урона на 45 секунд.',null,null,{type:'buff',key:'dm',duration:45}],
 ['wind-draught','Настой ветра','consumable',1,40,9,{},'Ускорение на 45 секунд.',null,null,{type:'buff',key:'sp',duration:45}],
 ['wisdom-draught','Настой мудрости','consumable',2,70,16,{},'Двойной опыт на 45 секунд.',null,null,{type:'buff',key:'xp',duration:45}],
 ['champion-blade','Клятва чемпиона','weapon',3,1450,350,{dm:.16,hp:12},'Классовый меч хранителя переднего ряда.',0,0],
 ['forest-oath','Обет леса','weapon',3,1450,350,{dm:.13,sp:.025},'Классовый лук следопыта.',1,1],
 ['astral-staff','Астральный фокус','weapon',4,2800,680,{dm:.20,hp:12},'Классовый посох с сердцем звёздного кристалла.',2,2],
 ['mercy-sigil','Печать милосердия','talisman',3,1400,340,{hp:32,dm:.035},'Классовый знак хранителя жизни.',null,3],
 ['bastion-sigil','Печать бастиона','talisman',4,2800,680,{hp:48,ar:.065},'Классовый знак несокрушимой защиты.',null,4]
 ];
 rows.push(['simple-pick','Простая кирка','tool',0,50,12,{},'Для добычи камня.',4],['improved-axe','Улучшенный топор','tool',1,150,35,{},'Добывает дерево двумя ударами.',3],['improved-pick','Улучшенная кирка','tool',1,150,35,{},'Усиленная кирка для залежей.',4],['reinforced-shield','Укреплённый щит','talisman',2,250,60,{ar:.055,hp:12},'Укреплён деревом и камнем.'],['quarry-blade','Клинок карьера','weapon',3,500,120,{dm:.14},'Особое оружие мастеров карьера.',0]);
 rows.push(
 ['timber-bundle','Связка древесины','material',0,30,6,{},'Пять древесины.',null,null,{type:'material',resource:'wood',amount:5}],
 ['stone-bundle','Короб камня','material',0,30,6,{},'Пять камня.',null,null,{type:'material',resource:'ore',amount:5}],
 ['crystal-dust','Кристальная пыль','material',2,100,20,{},'Для последних рангов заточки.',null,null,{type:'material',resource:'dust',amount:1}],
 ['iron-halberd','Алебарда стражи','weapon',1,240,55,{dm:.06},'Длинное оружие второго торгового этапа.',3],
 ['dusk-crossbow','Лук сумерек','weapon',1,250,58,{dm:.07},'Усиленное стрелковое оружие.',1],
 ['watcher-mail','Кольчуга дозорного','armor',1,260,60,{ar:.085},'Броня второго торгового этапа.'],
 ['vigor-flask','Флакон решимости','consumable',2,55,12,{},'Особое предложение: восстанавливает 65 выносливости.',null,null,{type:'stamina',amount:65}],
 ['warding-amulet','Амулет оберега','amu',2,440,100,{ar:.025,hp:12},'Дополнительная защита странника.'],
 ['ancient-edge','Клинок древних','weapon',3,1600,360,{dm:.17},'Особое предложение пятого торгового этапа.',0],
 ['royal-robe','Одеяние хранителя','armor',3,1500,340,{hp:25,ar:.10},'Снаряжение последнего торгового этапа.'],
 ['wayfarer-gloves','Перчатки странствия','gloves',2,450,102,{sp:.02,dm:.04},'Для дальних путешествий.'],
 ['soul-rest','Кольцо тихого восстановления','ring',2,0,0,{regen:.2},'До +0,2 HP/с только вне боя.'],
 ['soul-resolve','Кольцо стойкости','ring',2,0,0,{ar:.02},'Небольшое усиление защиты.'],
 ['soul-focus','Кольцо сосредоточения','ring',2,0,0,{cooldown:.02},'Перезарядки способностей короче на 2%.'],
 ['soul-vitality','Амулет жизненной силы','amu',2,0,0,{hpPercent:.03},'+3% максимального здоровья.'],
 ['soul-wanderer','Талисман странника','talisman',2,0,0,{sp:.02},'+2% скорости передвижения.'],
 ['soul-shard','Осколок восстановления','consumable',2,0,0,{},'Восстанавливает 12% HP, не чаще раза в 60 секунд.',null,null,{type:'heal',amount:.12,cooldown:60}]
 );
 const icons={material:'⬡',tool:'⚒',weapon:'⚔',helm:'♙',armor:'♜',gloves:'✦',boots:'➶',ring:'◉',amu:'◇',talisman:'❖',consumable:'⚗'};
 const items=rows.map(([id,n,s,r,buy,sell,stats,description,weapon,cls,effect])=>({id,n,s,r,buy,sell,...stats,description,icon:icons[s],...(weapon!==null&&weapon!==undefined?{weapon}:{}),...(cls!==null&&cls!==undefined?{class:cls,minLevel:4}:{}),...(effect?{effect}:{}),t:r>=3?3:r>=2?2:1}));
 items.forEach(i=>{if(i.id==='wood-axe'){i.buy=50;i.tool='axe';i.toolPower=1;}if(i.s==='tool'){i.tool=i.weapon===3?'axe':'pick';i.toolPower=i.id==='simple-pick'?1:2;}i.materials=({'improved-axe':{wood:20},'improved-pick':{ore:15},'reinforced-shield':{wood:15,ore:10},'quarry-blade':{wood:25,ore:20}})[i.id]||{};});
 const stages={'iron-halberd':2,'dusk-crossbow':2,'watcher-mail':2,'vigor-flask':3,'warding-amulet':3,'ancient-edge':5,'royal-robe':5,'wayfarer-gloves':3,'crystal-dust':4};
 const soulPrices={'soul-rest':14,'soul-resolve':10,'soul-focus':12,'soul-vitality':14,'soul-wanderer':10,'soul-shard':4};
 items.forEach((i,index)=>{i.stage=stages[i.id]||((i.tool||i.s==='material')?1:i.r===4?5:i.r===3?4:i.r===2?2:1);if(index>=44)i.merchantOnly=true;if(soulPrices[i.id]){i.soulPrice=soulPrices[i.id];i.stage=1;i.unique=i.id;}if(['vigor-flask','ancient-edge'].includes(i.id)){i.offer=true;i.listPrice=Math.round(i.buy/0.9);}});
 function find(id){return items.find(i=>i.id===id);}
 function make(id){const item=find(id);if(!item)return null;const {id:catalogId,buy,...rest}=item;return {catalogId,...rest};}
 function sellPrice(item){return item.catalogId?find(item.catalogId)?.sell||0:Math.max(1,Math.round(12*(1+(item.r||0)*.7)));}
 function canUse(item,context){return (item.class===undefined||item.class===(context.cl||0))&&(!item.minLevel||(context.lvl||1)>=item.minLevel);}
 return {items,merchant,find,make,sellPrice,canUse};
});
