(function(){
  const topicCatalog = [
    {id:'fresh',name:'Friss',description:'Legfrissebb és vezető hírek'},
    {id:'domestic',name:'Belföld',description:'Magyar közélet, politika és társadalom'},
    {id:'foreign',name:'Külföld',description:'Nemzetközi hírek, EU, világpolitika'},
    {id:'economy',name:'Gazdaság',description:'Infláció, árak, forint, cégek és ipar'},
    {id:'money',name:'Pénz',description:'Adózás, bank, hitel, nyugdíj és bérek'},
    {id:'business',name:'Vállalkozás',description:'KKV, pályázatok, támogatások és üzleti trendek'},
    {id:'tech_ai',name:'Tech & AI',description:'Mesterséges intelligencia, technológia és kiberbiztonság'},
    {id:'weather',name:'Időjárás',description:'Előrejelzés, riasztások és időjárási események'},
    {id:'traffic',name:'Közlekedés',description:'Útinform, balesetek, tömegközlekedés és üzemanyagár'},
    {id:'real_estate',name:'Ingatlan',description:'Lakásárak, albérlet, lakáshitel és építőipar'},
    {id:'career',name:'Munka',description:'Álláspiac, karrier, HR és munkajog'},
    {id:'health',name:'Egészség',description:'Egészségügy, gyógyszer, életmód és járványok'},
    {id:'education',name:'Oktatás',description:'Iskola, egyetem, felvételi és érettségi'},
    {id:'sport',name:'Sport',description:'Foci, Forma–1, kézilabda, olimpia és magyar sport'},
    {id:'culture',name:'Kultúra',description:'Film, zene, könyv, színház és programok'},
    {id:'tabloid',name:'Bulvár',description:'Celebek, TV, szórakozás és könnyed hírek'},
    {id:'auto',name:'Autó',description:'Autópiac, elektromos autók, KRESZ és bírságok'},
    {id:'green',name:'Zöld',description:'Környezet, klíma, energia és fenntarthatóság'},
    {id:'law',name:'Jog',description:'Törvények, rendeletek, fogyasztóvédelem és adatvédelem'},
    {id:'local',name:'Helyi',description:'Budapest, vármegyék, városi és helyi hírek'}
  ];

  const topicIds=topicCatalog.map(topic=>topic.id);
  const legacyTopics={Mind:'fresh',Technológia:'tech_ai',Világhírek:'foreign','Helyi hírek':'local'};
  if(!Array.isArray(state.enabledTopics))state.enabledTopics=[...topicIds];
  state.category=legacyTopics[state.category]||topicCatalog.find(topic=>topic.name===state.category)?.id||state.category||'fresh';
  const categoryUpdates={a1:'Közlekedés',a3:'Tech & AI',a5:'Külföld'};
  articles.forEach(article=>{if(categoryUpdates[article.id])article.category=categoryUpdates[article.id];});

  filteredArticles=function(){
    const selectedTopic=topicCatalog.find(topic=>topic.id===state.category);
    let items=articles.filter(article=>state.sources[article.source]!==false&&(state.category==='fresh'||article.category===selectedTopic?.name));
    if(state.sort==='unread')items=items.filter(article=>!state.read.has(article.id));
    if(state.sort==='personal')items=[...items].sort((a,b)=>(state.saved.has(b.id)?1:0)-(state.saved.has(a.id)?1:0));
    return items;
  };

  renderFeed=function(){
    setHeader('Hírfolyam',iconButton('⌕','Keresés','search')+iconButton('♡','Mentések és előzmények','library'));
    const visibleTopics=topicCatalog.filter(topic=>topic.id==='fresh'||state.enabledTopics.includes(topic.id));
    const items=filteredArticles();
    view.innerHTML=`<div class="segmented"><button data-sort="latest" class="${state.sort==='latest'?'active':''}">Legfrissebb</button><button data-sort="personal" class="${state.sort==='personal'?'active':''}">Nekem</button><button data-sort="unread" class="${state.sort==='unread'?'active':''}">Olvasatlan</button></div>
      <div class="chips topic-strip" aria-label="Hírtémák">${visibleTopics.map(topic=>`<button class="chip ${state.category===topic.id?'active':''}" data-category="${topic.id}">${topic.name}</button>`).join('')}</div>
      <div class="feed-list">${items.length?items.map((article,index)=>articleCard(article,index>0)).join(''):`<div class="empty"><div class="empty-icon">✓</div><h2>Minden hírt átnéztél</h2><p>Válassz másik témát vagy frissítsd az RSS-forrásokat.</p></div>`}</div>`;
  };

  settingsItems=function(){
    const activeSources=Object.values(state.sources).filter(Boolean).length;
    return [
      ['◉','RSS-források',`${activeSources} bekapcsolva`,'sources'],['#','Témák és érdeklődés',`${state.enabledTopics.length} kiválasztva`,'topics'],['🔔','Értesítések',state.notifications?'Bekapcsolva':'Kikapcsolva','notifications'],['◐','Megjelenés',state.theme==='system'?'Rendszer szerint':state.theme==='dark'?'Sötét':'Világos','appearance'],['◉','Hang és felolvasó','Magyar hang · 1,0×','voice'],['⇅','Mobiladat és tárhely',state.mobileData?'Mobilnet engedélyezve':'Csak Wi-Fi','data'],['⌖','Helyi hírek',state.location?'Budapest környéke':'Kikapcsolva','location'],['♙','Fiók és biztonság','Prototípus-fiók','account']
    ];
  };

  function topicSettingsSheet(){
    const buttons=topicCatalog.map(topic=>`<button class="chip ${topic.id==='fresh'||state.enabledTopics.includes(topic.id)?'active':''}" data-topic-toggle="${topic.id}">${topic.name}</button>`).join('');
    const rows=topicCatalog.map(topic=>{
      const active=topic.id==='fresh'||state.enabledTopics.includes(topic.id);
      return `<button class="settings-row topic-row ${topic.id==='fresh'?'fixed-topic':''}" data-topic-toggle="${topic.id}"><span class="row-icon">${topic.name[0]}</span><span class="row-copy"><strong>${topic.name}</strong><small>${topic.description}</small></span><span class="toggle ${active?'on':''}"></span></button>`;
    }).join('');
    openSheet('Témák és érdeklődés','A hírfolyam és a keresés témái',`<p class="settings-intro">A felső témasor oldalra görgethető. Kapcsold ki azokat a témákat, amelyeket nem szeretnél látni.</p><div class="chips topic-strip topic-settings-strip">${buttons}</div><div class="settings-group topic-settings-list">${rows}</div><div class="settings-group">${settingRow(['✦','Személyre szabott sorrend','Bekapcsolva','personal'])}${settingRow(['↺','Érdeklődési profil törlése','A mentések megmaradnak','reset-profile'])}</div>`);
  }

  function addSourceSheet(){
    const recommendations=['444','G7','Hírstart','Index','Népszava'];
    openSheet('Új RSS-forrás','Ajánlásból vagy RSS-linkkel',`<section class="source-add-screen"><h3 class="section-label">Ajánlott magyar források</h3><div class="settings-group">${recommendations.map(name=>`<button class="settings-row" data-recommended-source="${name}"><span class="row-icon">${name[0]}</span><span class="row-copy"><strong>${name}</strong><small>Ellenőrzött RSS-ajánlás</small></span><span class="row-end">＋</span></button>`).join('')}</div><h3 class="section-label">Hozzáadás RSS-linkkel</h3><form id="rssSourceForm" class="source-form"><label for="rssSourceUrl">RSS-csatorna címe</label><input id="rssSourceUrl" class="search-input" type="url" inputmode="url" placeholder="https://pelda.hu/rss" required><button class="primary-button" type="submit">RSS-forrás hozzáadása</button></form><button class="text-button" data-source-back>Vissza az RSS-forrásokhoz</button></section>`);
  }

  const originalSettingsSheet=settingsSheet;
  settingsSheet=function(type){
    if(type==='topics')return topicSettingsSheet();
    return originalSettingsSheet(type);
  };

  document.addEventListener('click',event=>{
    const add=event.target.closest('[data-add-source]');
    if(add){event.preventDefault();event.stopImmediatePropagation();addSourceSheet();return;}
    const back=event.target.closest('[data-source-back]');
    if(back){event.preventDefault();event.stopImmediatePropagation();settingsSheet('sources');return;}
    const recommendation=event.target.closest('[data-recommended-source]');
    if(recommendation){event.preventDefault();event.stopImmediatePropagation();const name=recommendation.dataset.recommendedSource;state.sources[name]=true;saveState();settingsSheet('sources');toast(`${name} hozzáadva`);return;}
    const toggle=event.target.closest('[data-topic-toggle]');
    if(toggle){event.preventDefault();event.stopImmediatePropagation();const id=toggle.dataset.topicToggle;if(id==='fresh'){toast('A Friss összesítő mindig elérhető');return;}state.enabledTopics=state.enabledTopics.includes(id)?state.enabledTopics.filter(topicId=>topicId!==id):[...state.enabledTopics,id];if(state.category===id&&!state.enabledTopics.includes(id))state.category='fresh';saveState();topicSettingsSheet();}
  },true);

  document.addEventListener('submit',event=>{
    if(event.target.id!=='rssSourceForm')return;
    event.preventDefault();event.stopImmediatePropagation();
    const input=document.querySelector('#rssSourceUrl');
    try{const url=new URL(input.value.trim());const name=url.hostname.replace(/^www\./,'');state.sources[name]=true;saveState();settingsSheet('sources');toast(`${name} hozzáadva`);}catch{toast('Adj meg egy érvényes RSS-linket');}
  },true);

  saveState();
  if(state.route==='feed')renderFeed();
  if(state.route==='settings')renderSettings();
})();
