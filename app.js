const articles = [
  {id:'a1',source:'HVG',category:'Belföld',time:'12 perce',title:'Új közlekedési változások lépnek életbe a fővárosban',excerpt:'A hétvégétől több útvonal és menetrend is módosul. Összegyűjtöttük a legfontosabb tudnivalókat.',image:'assets/prototype/budapest-tram.svg',body:'A fővárosi közlekedés több ponton megváltozik a hétvégén. Egyes járatok terelve közlekednek, más vonalakon pótlóbuszok segítik az utasokat. Az RSS-forrás rövid összefoglalója alapján indulás előtt érdemes ellenőrizni az aktuális menetrendet.'},
  {id:'a2',source:'Portfolio',category:'Gazdaság',time:'28 perce',title:'Így változhatnak a hazai energiaárak a következő hónapban',excerpt:'Az elemzők több, egymással ellentétes hatásra hívták fel a figyelmet.',image:'assets/prototype/economy-city.svg',body:'Az energiaárakat egyszerre befolyásolja a nemzetközi kereslet, a készletek szintje és az időjárás. A szakértők szerint rövid távon ingadozás, később mérséklődés is elképzelhető.'},
  {id:'a3',source:'Qubit',category:'Technológia',time:'46 perce',title:'Új eszközök segíthetik a természetesebb magyar hangfelismerést',excerpt:'A fejlesztések a zajos környezetben elhangzó rövid utasításokra koncentrálnak.',image:'assets/prototype/technology-ai.svg',body:'A kutatók olyan beszédfelismerési eljárásokat vizsgálnak, amelyek autóban és utcai zajban is pontosabban értik a magyar nyelvű parancsokat. A cél az alacsony késleltetés és az adatvédelem javítása.'},
  {id:'a4',source:'Nemzeti Sport',category:'Sport',time:'1 órája',title:'Fontos mérkőzésekkel folytatódik a hétvégi sportprogram',excerpt:'Több magyar érdekeltségű esemény is képernyőre kerül.',image:'assets/prototype/sport-stadium.svg',body:'A hétvégi programban labdarúgó-, kézilabda- és autósport-események is szerepelnek. A pontos kezdési időpontokat az eredeti forrás közli.'},
  {id:'a5',source:'Telex',category:'Világhírek',time:'1 órája',title:'Új tárgyalássorozat kezdődik európai vezetők részvételével',excerpt:'A találkozó középpontjában gazdasági és biztonsági kérdések állnak.',image:'assets/prototype/economy-city.svg',body:'A résztvevők többnapos egyeztetésre készülnek. A napirenden gazdasági együttműködés, energiabiztonság és regionális fejlesztések szerepelnek.'},
  {id:'a6',source:'24.hu',category:'Kultúra',time:'2 órája',title:'Megnyílt a nyári kulturális programsorozat',excerpt:'Koncertek, szabadtéri vetítések és családi programok várják a látogatókat.',image:'assets/prototype/budapest-tram.svg',body:'A rendezvénysorozat több héten át kínál programokat. A szervezők külön figyelmet fordítanak az ingyenesen látogatható eseményekre.'}
];

const defaults = {
  route:'car', sort:'latest', category:'Mind', theme:'system', mic:true, autoNext:true,
  playing:false, carIndex:0, assistantMode:'voice', read:[], saved:[], history:[],
  sources:{HVG:true,Portfolio:true,Qubit:true,'Nemzeti Sport':true,Telex:true,'24.hu':true},
  notifications:true, location:false, mobileData:true,
  subscription:{status:'inactive',plan:'pro',trialDays:14,aiMinutesUsed:0,aiMinutesLimit:250,proPreviewAvailable:true,proPreviewRemaining:3,proPreviewActive:false}
};

const state = Object.assign({}, defaults, JSON.parse(localStorage.getItem('hirbeszed-state') || '{}'));
state.read = new Set(state.read || []); state.saved = new Set(state.saved || []); state.history = state.history || [];
state.subscription = {...defaults.subscription,...(state.subscription || {})};
let currentUtterance = null; let toastTimer = null; let activeSheetRenderer = null;
const $ = selector => document.querySelector(selector);
const view = $('#view'); const sheet = $('#sheet'); const sheetBody = $('#sheetBody');

function saveState(){
  const serial = {...state,read:[...state.read],saved:[...state.saved]};
  localStorage.setItem('hirbeszed-state',JSON.stringify(serial));
}
function effectiveTheme(){ return state.theme==='system' ? (matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light') : state.theme; }
function applyTheme(){
  const theme=effectiveTheme(); document.documentElement.dataset.theme=theme;
  $('#brandMark').src=`assets/brand/hirbeszed-mark-${theme}.svg`;
  document.querySelector('meta[name="theme-color"]').content=theme==='dark'?'#0D191E':'#F6F9F8';
}
function toast(message){ const el=$('#toast'); el.textContent=message; el.classList.add('show'); clearTimeout(toastTimer); toastTimer=setTimeout(()=>el.classList.remove('show'),1900); }
function iconButton(symbol,label,action){ return `<button class="icon-button" type="button" data-action="${action}" aria-label="${label}">${symbol}</button>`; }
function setHeader(title,actions=''){ $('#pageTitle').textContent=title; $('#headerActions').innerHTML=actions; }
function articleById(id){ return articles.find(article=>article.id===id); }
function recordRead(id){ state.read.add(id); state.history=[id,...state.history.filter(item=>item!==id)].slice(0,30); saveState(); }
function toggleSaved(id){ state.saved.has(id)?state.saved.delete(id):state.saved.add(id); saveState(); toast(state.saved.has(id)?'Mentve későbbre':'Eltávolítva a mentésekből'); }

function articleCard(article,compact=false){
  const read=state.read.has(article.id), saved=state.saved.has(article.id);
  return `<article class="news-card ${compact?'compact-card':''} ${read?'read':''}" data-article="${article.id}">
    <img class="article-image" src="${article.image}" alt="A hír illusztrációja">
    <div class="card-body"><div class="meta-line">${read?'':`<span class="unread-dot"></span>`}<span>${article.source}</span><span class="meta-time">· ${article.time}</span><button type="button" class="save-button ${saved?'saved':''}" data-save="${article.id}" aria-label="Mentés">${saved?'♥':'♡'}</button></div>
    <h2>${article.title}</h2>${compact?'':`<p>${article.excerpt}</p>`}</div></article>`;
}
function filteredArticles(){
  let items=articles.filter(a=>state.sources[a.source]!==false && (state.category==='Mind'||a.category===state.category));
  if(state.sort==='unread') items=items.filter(a=>!state.read.has(a.id));
  if(state.sort==='personal') items=[...items].sort((a,b)=>(state.saved.has(b.id)?1:0)-(state.saved.has(a.id)?1:0));
  return items;
}
function renderFeed(){
  setHeader('Hírfolyam',iconButton('⌕','Keresés','search')+iconButton('♡','Mentések és előzmények','library'));
  const categories=['Mind','Belföld','Gazdaság','Sport','Technológia','Világhírek','Kultúra']; const items=filteredArticles();
  view.innerHTML=`<div class="segmented"><button data-sort="latest" class="${state.sort==='latest'?'active':''}">Legfrissebb</button><button data-sort="personal" class="${state.sort==='personal'?'active':''}">Nekem</button><button data-sort="unread" class="${state.sort==='unread'?'active':''}">Olvasatlan</button></div>
    <div class="chips">${categories.map(c=>`<button class="chip ${state.category===c?'active':''}" data-category="${c}">${c}</button>`).join('')}</div>
    <div class="feed-list">${items.length?items.map((a,i)=>articleCard(a,i>0)).join(''):`<div class="empty"><div class="empty-icon">✓</div><h2>Minden hírt átnéztél</h2><p>Válassz másik témát vagy frissítsd az RSS-forrásokat.</p></div>`}</div>`;
}

function currentCarArticle(){ return articles[state.carIndex%articles.length]; }
function stopSpeech(update=true){
  if('speechSynthesis' in window) speechSynthesis.cancel(); currentUtterance=null; state.playing=false; if(update&&state.route==='car') renderCar();
}
function speakCurrent(details=false){
  const article=currentCarArticle();
  if(!('speechSynthesis' in window)){toast('A böngésző nem támogatja a felolvasást');return;}
  speechSynthesis.cancel();
  currentUtterance=new SpeechSynthesisUtterance(`${article.source}. ${article.title}. ${details?article.body:article.excerpt}`);
  currentUtterance.lang='hu-HU'; currentUtterance.rate=1; state.playing=true; renderCar();
  currentUtterance.onend=()=>{ recordRead(article.id); state.playing=false; const previewFinished=consumeProPreviewArticle(); if(previewFinished){renderCar();setTimeout(()=>proPreviewUpsell(),350);return;} if(state.autoNext&&state.route==='car'){setTimeout(()=>nextArticle(true),700)}else renderCar(); };
  currentUtterance.onerror=()=>{state.playing=false;renderCar();}; speechSynthesis.speak(currentUtterance);
}
function nextArticle(auto=false){ recordRead(currentCarArticle().id); state.carIndex=(state.carIndex+1)%articles.length; saveState(); renderCar(); if(auto||state.playing) setTimeout(()=>speakCurrent(),250); }
function consumeProPreviewArticle(){
  const sub=state.subscription;
  if(sub.plan!=='basic'||!sub.proPreviewActive) return false;
  sub.proPreviewRemaining=Math.max(0,sub.proPreviewRemaining-1);
  if(sub.proPreviewRemaining===0){sub.proPreviewActive=false;sub.proPreviewAvailable=false;saveState();return true;}
  saveState(); return false;
}
function proPreviewUpsell(){
  openSheet('Ilyen a Hírbeszéd Pro','A heti három próbahír véget ért',`<section class="subscription-screen"><div class="expired-hero"><span class="expired-icon">✦</span><span class="subscription-kicker">PRO HANGPRÓBA</span><h1>Hallható a különbség.</h1><p>A Pro csomag természetesebb felolvasást és havi 250 perc prémium AI-hangot biztosít.</p></div><button class="primary-button coral-button" data-subscribe="pro">Váltás Pro csomagra · 3500 Ft/hó</button><button class="text-button" data-action="close-sheet">Maradok az Alap csomagnál</button></section>`);
}
function renderCar(){
  setHeader('Autós mód',iconButton('⋯','További lehetőségek','car-more')); const article=currentCarArticle(); const sub=state.subscription; const showProSample=sub.plan==='basic'&&sub.status==='active'&&sub.proPreviewAvailable;
  view.innerHTML=`<section class="car-view"><div class="car-image-wrap"><img class="article-image" src="${article.image}" alt="${article.title}"><span class="car-badge">${article.category}</span></div>
    <div class="car-status"><div class="status-label">${sub.proPreviewActive?`✦ PRO HANGPRÓBA · ${sub.proPreviewRemaining} HÍR`:state.playing?'● FELOLVASÁS':'Ⅱ KÉSZEN ÁLL'}</div><h1>${article.title}</h1><p>${article.source} · ${article.time}</p><div class="wave ${state.playing?'':'paused'}"><i></i><i></i><i></i><i></i><i></i></div></div>
    ${showProSample?`<button class="pro-sample-card" data-car="pro-preview"><span class="pro-sample-icon">✦</span><span><strong>Próbáld ki a Pro hangot</strong><small>Heti 3 hír természetesebb AI-felolvasással</small></span><b>${sub.proPreviewRemaining} hír ›</b></button>`:''}
    <div class="car-controls"><button class="car-control mic ${state.mic?'':'off'}" data-car="mic"><strong>${state.mic?'◉':'⊘'}</strong>${state.mic?'Mikrofon':'Mikrofon ki'}</button><button class="car-control ${state.autoNext?'':'off'}" data-car="auto"><strong>⇥</strong>Auto: ${state.autoNext?'be':'ki'}</button><button class="car-control" data-car="play"><strong>${state.playing?'■':'▶'}</strong>${state.playing?'Leállítás':'Felolvasás'}</button></div>
    <p class="car-help">Mondd: „részletek”, „mentsd el” vagy „következő”</p></section>`;
}

const assistantResponses={
  'mai hírt':'A mai hírfolyamból a közlekedési változások, az energiaárak és a magyar hangfelismerés fejlesztése emelkedik ki.',
  'gazdaság':'A gazdasági hírek közül most az energiaárak várható változása a legfrissebb.',
  'technológ':'A technológiai források a zajos környezetben is pontosabb magyar hangfelismerésről írnak.',
  'sport':'A hétvégi sportprogram több magyar érdekeltségű eseményt tartalmaz.'
};
function answerFor(text){ const key=Object.keys(assistantResponses).find(k=>text.toLowerCase().includes(k)); return assistantResponses[key]||'A betöltött RSS-hírek között keresve több kapcsolódó cikket találtam. Pontosítsd a témát vagy a kívánt időszakot.'; }
function renderAssistant(){
  setHeader('Asszisztens',iconButton(state.assistantMode==='voice'?'⌨':'◉','Módváltás','assistant-toggle'));
  if(state.assistantMode==='voice'){
    view.innerHTML=`<section class="assistant-view"><div class="mode-switch"><button class="active" data-mode="voice">Hang</button><button data-mode="text">Gépelés</button><button data-mode="silent">Néma</button></div><div class="assistant-hero"><button class="assistant-orb" data-action="voice-demo">◉</button><div class="live">● FIGYELEK</div><h1>Miről szeretnél hallani?</h1><p>Kérdezz a betöltött hírekről.</p></div><div class="suggestion-list"><button class="suggestion" data-question="Foglalj össze három fontos mai hírt">„Foglalj össze három fontos mai hírt.”</button><button class="suggestion" data-question="Mi történt ma a gazdaságban?">„Mi történt ma a gazdaságban?”</button><button class="suggestion" data-question="Van új technológiai hír?">„Van új technológiai hír?”</button></div></section>`;
  } else {
    view.innerHTML=`<section class="assistant-view"><div class="mode-switch"><button data-mode="voice">Hang</button><button class="${state.assistantMode==='text'?'active':''}" data-mode="text">Gépelés</button><button class="${state.assistantMode==='silent'?'active':''}" data-mode="silent">Néma</button></div><div id="chatLog" class="chat-log"><div class="bubble">Szia! A beállított RSS-források híreiről kérdezhetsz.<span class="sources">6 aktív forrás</span></div></div><form id="composer" class="composer"><input id="chatInput" autocomplete="off" placeholder="Írj egy üzenetet…"><button type="submit">➤</button></form></section>`;
  }
}

function subscriptionLabel(){
  const sub=state.subscription;
  if(sub.status==='trial') return `${sub.plan==='pro'?'Pro':'Alap'} próba · ${sub.trialDays} nap van hátra`;
  if(sub.status==='active') return `${sub.plan==='pro'?'Pro':'Alap'} · aktív`;
  if(sub.status==='expired') return 'A próbaidő lejárt';
  return '14 nap ingyen · utána 1500 Ft-tól';
}
function settingsItems(){
  return [
    ['◉','RSS-források','6 bekapcsolva','sources'],['#','Témák és érdeklődés','7 kiválasztva','topics'],['🔔','Értesítések',state.notifications?'Bekapcsolva':'Kikapcsolva','notifications'],['◐','Megjelenés',state.theme==='system'?'Rendszer szerint':state.theme==='dark'?'Sötét':'Világos','appearance'],['◉','Hang és autós mód','Magyar hang · 1,0×','voice'],['⇅','Mobiladat és tárhely',state.mobileData?'Mobilnet engedélyezve':'Csak Wi-Fi','data'],['⌖','Helyi hírek',state.location?'Budapest környéke':'Kikapcsolva','location'],['♙','Fiók és biztonság','Prototípus-fiók','account']
  ];
}
function renderSettings(){
  const items=settingsItems();
  setHeader('Beállítások'); view.innerHTML=`<div class="settings-group subscription-entry">${settingRow(['✦','Előfizetés',subscriptionLabel(),'subscription'])}</div><div class="settings-group">${items.slice(0,4).map(settingRow).join('')}</div><div class="settings-group">${items.slice(4,7).map(settingRow).join('')}</div><div class="settings-group">${settingRow(items[7])}</div>`;
}
function settingRow(item){return `<button class="settings-row" data-setting="${item[3]}"><span class="row-icon">${item[0]}</span><span class="row-copy"><strong>${item[1]}</strong><small>${item[2]}</small></span><span class="row-end">›</span></button>`;}

function render(){
  stopSpeech(false); document.querySelectorAll('.bottom-nav button').forEach(b=>b.classList.toggle('active',b.dataset.route===state.route));
  ({feed:renderFeed,car:renderCar,assistant:renderAssistant,settings:renderSettings}[state.route]||renderCar)();
  view.scrollTop=0; saveState(); renderSubscriptionGate();
}
function renderSubscriptionGate(){
  const gate=$('#subscriptionGate'); if(!gate)return;
  const failed=state.subscription.status==='payment_failed'; const locked=failed||state.subscription.status==='expired';
  gate.classList.toggle('open',locked); gate.setAttribute('aria-hidden',locked?'false':'true');
  $('#gateKicker').textContent=failed?'FIZETÉSI PROBLÉMA':'AZ ELŐFIZETÉS LEJÁRT';
  $('#gateTitle').textContent=failed?'A fizetést nem sikerült megújítani.':'Válassz csomagot a folytatáshoz.';
  $('#gateCopy').textContent=failed?'Az áruházi türelmi idő lejárt. A mentéseid és beállításaid megmaradtak.':'A mentéseid és beállításaid megmaradtak, és előfizetés után azonnal folytathatod.';
  if(locked){stopSpeech(false);sheet.classList.remove('open');sheet.setAttribute('aria-hidden','true');}
}

function openSheet(title,subtitle,html,renderer=null){ $('#sheetTitle').textContent=title; $('#sheetSubtitle').textContent=subtitle||''; sheetBody.innerHTML=html; activeSheetRenderer=renderer; sheet.classList.add('open'); sheet.setAttribute('aria-hidden','false'); }
function closeSheet(){ sheet.classList.remove('open'); sheet.setAttribute('aria-hidden','true'); activeSheetRenderer=null; if(state.route==='feed')renderFeed(); if(state.route==='settings')renderSettings(); }
function openArticle(id){
  const a=articleById(id); recordRead(id); openSheet('Hírrészlet',`${a.source} · ${a.time}`,`<article class="detail"><div class="detail-hero"><img src="${a.image}" alt="A hír illusztrációja"></div><div class="meta-line"><span>${a.category}</span><span class="meta-time">· ${a.source}</span></div><h1>${a.title}</h1><div class="detail-actions"><button data-detail-save="${a.id}">${state.saved.has(a.id)?'♥ Mentve':'♡ Mentés'}</button><button data-detail-share="${a.id}">↗ Megosztás</button><button data-unread="${a.id}">○ Olvasatlan</button></div><p class="detail-copy">${a.body}</p><button class="primary-button" data-original="${a.id}">Eredeti cikk megnyitása</button></article>`);
}
function searchSheet(){ openSheet('Keresés','Hírek, témák és források',`<input id="searchInput" class="search-input" type="search" placeholder="Keresés…" autofocus><div id="searchResults">${articles.map(a=>articleCard(a,true)).join('')}</div>`); }
function librarySheet(tab='saved'){
  const ids=tab==='saved'?[...state.saved]:state.history; const items=ids.map(articleById).filter(Boolean);
  openSheet('Könyvtár',tab==='saved'?'Mentett hírek':'Előzmények',`<div class="sheet-tabs"><button data-library="saved" class="${tab==='saved'?'active':''}">Mentett</button><button data-library="history" class="${tab==='history'?'active':''}">Előzmények</button></div><div>${items.length?items.map(a=>articleCard(a,true)).join(''):`<div class="empty"><div class="empty-icon">♡</div><h2>Még nincs itt semmi</h2><p>A hírkártyák könyvjelzőjével menthetsz későbbre.</p></div>`}</div>`,()=>librarySheet(tab));
}
function planName(plan){return plan==='pro'?'Hírbeszéd Pro':'Hírbeszéd Alap';}
function planPrice(plan){return plan==='pro'?'3500 Ft':'1500 Ft';}
function planCards(){
  const selected=state.subscription.plan;
  return `<div class="plan-list">
    <button class="plan-card ${selected==='basic'?'selected':''}" data-plan="basic">
      <span class="plan-check">${selected==='basic'?'✓':''}</span>
      <span class="plan-copy"><span class="plan-title">Hírbeszéd Alap</span><span class="plan-price">1500 Ft <small>/ hó</small></span><span class="plan-description">Korlátlan rendszerhang, autós mód és AI-asszisztens.</span><span class="plan-features">✓ Rendszerhangos felolvasás<br>✓ Hangvezérlés és személyre szabás<br>✓ Alap AI-hírasszisztens</span></span>
    </button>
    <button class="plan-card pro ${selected==='pro'?'selected':''}" data-plan="pro">
      <span class="popular-badge">AJÁNLOTT</span><span class="plan-check">${selected==='pro'?'✓':''}</span>
      <span class="plan-copy"><span class="plan-title">Hírbeszéd Pro</span><span class="plan-price">3500 Ft <small>/ hó</small></span><span class="plan-description">Természetes AI-hang és fejlettebb, beszélgetős asszisztens.</span><span class="plan-features">✓ Minden az Alap csomagból<br>✓ Havi 250 perc prémium AI-hang<br>✓ Fejlettebb összefoglalók és hangok</span></span>
    </button>
  </div>`;
}
function subscriptionSheet(screen='overview'){
  const sub=state.subscription;
  if(screen==='plans'||(screen==='overview'&&sub.status==='inactive')){
    return openSheet('Prémium csomagok','14 napos ingyenes próba',`<section class="subscription-screen"><div class="subscription-hero"><span class="subscription-kicker">14 NAP INGYEN</span><h1>A hírek akkor is veled maradnak, amikor nem nézed a képernyőt.</h1><p>Válassz csomagot. A próba alatt nem terhelünk díjat, utána az alkalmazás-áruház havonta megújítja az előfizetést.</p></div>${planCards()}<button class="primary-button coral-button" data-sub-action="review">14 napos próba indítása</button><button class="text-button" data-sub-action="restore">Korábbi vásárlás visszaállítása</button><p class="legal-copy">Bármikor lemondható az Apple App Store vagy a Google Play előfizetési beállításaiban.</p></section>`);
  }
  if(screen==='confirm'){
    return openSheet('Próba indítása','Az áruház még nem terhel díjat',`<section class="subscription-screen"><div class="purchase-summary"><span class="summary-icon">✦</span><span class="subscription-kicker">KIVÁLASZTOTT CSOMAG</span><h1>${planName(sub.plan)}</h1><div class="summary-price">${planPrice(sub.plan)} <small>/ hó</small></div><div class="timeline"><div><strong>Ma</strong><span>14 napos próba indul</span></div><div><strong>11. nap</strong><span>Emlékeztetőt küldünk</span></div><div><strong>14. nap után</strong><span>${planPrice(sub.plan)} havonta</span></div></div></div><button class="primary-button coral-button" data-sub-action="start-trial">Próba megerősítése</button><button class="secondary-button" data-sub-action="plans">Másik csomagot választok</button><p class="store-note">A végleges alkalmazásban itt az Apple vagy a Google biztonságos fizetési ablaka jelenik meg.</p></section>`);
  }
  if(sub.status==='expired'){
    return openSheet('A próbaidő lejárt','Válassz csomagot a folytatáshoz',`<section class="subscription-screen"><div class="expired-hero"><span class="expired-icon">Ⅱ</span><span class="subscription-kicker">A PRÓBA VÉGET ÉRT</span><h1>Tartsd mozgásban a hírfolyamot.</h1><p>A mentéseid és beállításaid megmaradtak. Előfizetés után azonnal folytathatod.</p></div><button class="price-action" data-subscribe="basic"><span><strong>Hírbeszéd Alap</strong><small>Rendszerhang és autós mód</small></span><b>1500 Ft/hó</b></button><button class="price-action pro" data-subscribe="pro"><span><strong>Hírbeszéd Pro</strong><small>250 perc prémium AI-hang</small></span><b>3500 Ft/hó</b></button><button class="text-button" data-sub-action="restore">Vásárlás visszaállítása</button></section>`);
  }
  const isPro=sub.plan==='pro'; const percent=isPro?Math.min(100,Math.round((sub.aiMinutesUsed/sub.aiMinutesLimit)*100)):0;
  return openSheet('Előfizetés','Csomag és használat kezelése',`<section class="subscription-screen"><div class="membership-card ${isPro?'pro':''}"><div class="membership-top"><span class="subscription-kicker">${sub.status==='trial'?'PRÓBAIDŐ':'AKTÍV ELŐFIZETÉS'}</span><span class="status-pill">${sub.status==='trial'?`${sub.trialDays} nap`:'Aktív'}</span></div><h1>${planName(sub.plan)}</h1><p>${sub.status==='trial'?`A próba után ${planPrice(sub.plan)}/hó.`:`Következő megújítás: július 21.`}</p>${isPro?`<button class="usage-panel" data-sub-action="usage"><span><strong>Prémium AI-hang</strong><small>${sub.aiMinutesUsed} / ${sub.aiMinutesLimit} perc felhasználva</small></span><span>${sub.aiMinutesLimit-sub.aiMinutesUsed} perc</span><i><b style="width:${percent}%"></b></i></button>`:`<div class="basic-voice-note">A rendszerhangos felolvasás korlátlan. Hetente három híren kipróbálható a Pro hang.</div>`}</div><div class="settings-group subscription-actions"><button class="settings-row" data-sub-action="plans"><span class="row-icon">⇄</span><span class="row-copy"><strong>Csomagváltás</strong><small>Alap vagy Pro csomag választása</small></span><span class="row-end">›</span></button><button class="settings-row" data-sub-action="store-manage"><span class="row-icon">▣</span><span class="row-copy"><strong>Előfizetés kezelése</strong><small>Megújítás vagy lemondás az áruházban</small></span><span class="row-end">›</span></button><button class="settings-row" data-sub-action="restore"><span class="row-icon">↺</span><span class="row-copy"><strong>Vásárlás visszaállítása</strong><small>Másik készüléken vásárolt csomag</small></span><span class="row-end">›</span></button></div><button class="demo-link" data-sub-action="expire-demo">Prototípus: lejárt előfizetés</button><button class="demo-link" data-sub-action="payment-demo">Prototípus: sikertelen fizetés</button></section>`);
}
function usageSheet(){
  const sub=state.subscription; const remaining=Math.max(0,sub.aiMinutesLimit-sub.aiMinutesUsed);
  openSheet('Prémium AI-hang','Havi Pro hangkeret',`<section class="subscription-screen"><div class="minutes-ring" style="--usage:${Math.round((sub.aiMinutesUsed/sub.aiMinutesLimit)*360)}deg"><div><strong>${remaining}</strong><span>perc maradt</span></div></div><h2 class="center-title">Természetes AI-felolvasás</h2><p class="center-copy">A keret minden számlázási időszak elején újra 250 perc lesz. Ha elfogy, a hírek automatikusan a készülék rendszerhangján folytatódnak.</p><div class="settings-group"><div class="settings-row static-row"><span class="row-icon">▶</span><span class="row-copy"><strong>${sub.aiMinutesUsed} perc felhasználva</strong><small>Ebben a hónapban</small></span></div><div class="settings-row static-row"><span class="row-icon">↻</span><span class="row-copy"><strong>Július 21-én megújul</strong><small>Újabb 250 perc válik elérhetővé</small></span></div></div><button class="secondary-button" data-sub-action="subscription-home">Vissza az előfizetéshez</button></section>`);
}
function settingsSheet(type){
  if(type==='subscription') return subscriptionSheet();
  if(type==='appearance') return openSheet('Megjelenés','Téma és hozzáférhetőség',`<div class="theme-grid"><button class="theme-card ${state.theme==='light'?'active':''}" data-theme="light">Világos</button><button class="theme-card dark-preview ${state.theme==='dark'?'active':''}" data-theme="dark">Sötét</button><button class="theme-card system-preview ${state.theme==='system'?'active':''}" data-theme="system">Rendszer</button></div><div class="settings-group" style="margin-top:15px">${settingRow(['A','Betűméret','Rendszer szerint','font'])}${settingRow(['◌','Kontraszt növelése','Kikapcsolva','contrast'])}</div>`);
  if(type==='sources') return openSheet('RSS-források','Közvetlenül a készüléken',`<button class="primary-button" data-add-source>＋ Új RSS-forrás</button><div class="settings-group" style="margin-top:13px">${Object.entries(state.sources).map(([name,on])=>`<button class="settings-row" data-source="${name}"><span class="row-icon">${name[0]}</span><span class="row-copy"><strong>${name}</strong><small>${on?'Bekapcsolva':'Kikapcsolva'}</small></span><span class="toggle ${on?'on':''}"></span></button>`).join('')}</div>`);
  if(type==='topics') return openSheet('Témák és érdeklődés','A sorrend helyben készül',`<div class="chips" style="flex-wrap:wrap">${['Belföld','Világhírek','Gazdaság','Sport','Technológia','Kultúra','Helyi hírek'].map(c=>`<button class="chip active">${c}</button>`).join('')}</div><div class="settings-group">${settingRow(['✦','Személyre szabott sorrend','Bekapcsolva','personal'])}${settingRow(['↺','Érdeklődési profil törlése','A mentések megmaradnak','reset-profile'])}</div>`);
  if(type==='notifications') return openSheet('Értesítések','Helyi prototípus-beállítás',`<div class="settings-group"><button class="settings-row" data-toggle-setting="notifications"><span class="row-icon">!</span><span class="row-copy"><strong>Rendkívüli hírek</strong><small>${state.notifications?'Bekapcsolva':'Kikapcsolva'}</small></span><span class="toggle ${state.notifications?'on':''}"></span></button>${settingRow(['☀','Napi összefoglaló','Minden nap 07:30','digest'])}${settingRow(['☾','Csendes időszak','22:00–07:00','quiet'])}</div>`);
  if(type==='voice') return openSheet('Hang és autós mód','Felolvasás és viselkedés',`<div class="settings-group">${settingRow(['A','Felolvasóhang','Magyar rendszerhang','voice-name'])}${settingRow(['↔','Beszédsebesség','1,0×','rate'])}<button class="settings-row" data-toggle-setting="autoNext"><span class="row-icon">⇥</span><span class="row-copy"><strong>Automatikus következő</strong><small>${state.autoNext?'Bekapcsolva':'Kikapcsolva'}</small></span><span class="toggle ${state.autoNext?'on':''}"></span></button></div>`);
  if(type==='data') return openSheet('Mobiladat és tárhely','Hálózati beállítások',`<div class="settings-group"><button class="settings-row" data-toggle-setting="mobileData"><span class="row-icon">⇅</span><span class="row-copy"><strong>RSS-frissítés mobilneten</strong><small>${state.mobileData?'Engedélyezve':'Csak Wi-Fi'}</small></span><span class="toggle ${state.mobileData?'on':''}"></span></button>${settingRow(['▧','Képek mobilneten','Engedélyezve','images'])}${settingRow(['⌫','Gyorsítótár törlése','A mentések megmaradnak','cache'])}</div>`);
  if(type==='location') return openSheet('Helyi hírek','Hozzávetőleges hely',`<div class="empty" style="padding-top:28px"><div class="empty-icon">⌖</div><h2>Helyi hírek a közeledből</h2><p>A prototípus nem kér valódi helyadatot.</p></div><button class="primary-button" data-toggle-setting="location">${state.location?'Helyi hírek kikapcsolása':'Budapest kiválasztása'}</button>`);
  if(type==='account') return openSheet('Fiók és biztonság','Prototípus',`<div class="settings-group">${settingRow(['♙','Profil','Anna · anna@pelda.hu','profile'])}${settingRow(['A','Kapcsolt fiókok','Apple, Google, Facebook','accounts'])}${settingRow(['✦','Kétlépcsős védelem','Nincs bekapcsolva','2fa'])}</div><button class="secondary-button" data-demo-reset>Prototípusadatok törlése</button>`);
  openSheet('Beállítás','Prototípus',`<div class="empty"><div class="empty-icon">⚙</div><h2>Ez a rész a prototípusban bemutató jellegű</h2></div>`);
}

document.addEventListener('click',event=>{
  const route=event.target.closest('[data-route]'); if(route){state.route=route.dataset.route;render();return;}
  const save=event.target.closest('[data-save]'); if(save){event.stopPropagation();toggleSaved(save.dataset.save); if(state.route==='feed')renderFeed();return;}
  const card=event.target.closest('[data-article]'); if(card){openArticle(card.dataset.article);return;}
  const sort=event.target.closest('[data-sort]'); if(sort){state.sort=sort.dataset.sort;renderFeed();saveState();return;}
  const category=event.target.closest('[data-category]'); if(category){state.category=category.dataset.category;renderFeed();saveState();return;}
  const action=event.target.closest('[data-action]'); if(action){const a=action.dataset.action;if(a==='close-sheet'){closeSheet();return;}if(a==='search')searchSheet();if(a==='library')librarySheet();if(a==='assistant-toggle'){state.assistantMode=state.assistantMode==='voice'?'text':'voice';renderAssistant();}if(a==='voice-demo')toast('Hangmód prototípus: mondd el a kérdésed');if(a==='car-more')openSheet('Hangutasítások','Autós mód',`<div class="settings-group">${settingRow(['›','Következő','A következő hír indítása','cmd-next'])}${settingRow(['＋','Részletek','Hosszabb RSS-tartalom','cmd-detail'])}${settingRow(['♡','Mentés','Mentés későbbre','cmd-save'])}</div>`);return;}
  const car=event.target.closest('[data-car]'); if(car){if(car.dataset.car==='mic'){state.mic=!state.mic;toast(state.mic?'Mikrofon bekapcsolva':'Mikrofon kikapcsolva');renderCar();}if(car.dataset.car==='auto'){state.autoNext=!state.autoNext;renderCar();}if(car.dataset.car==='play'){state.playing?stopSpeech():speakCurrent();}if(car.dataset.car==='pro-preview'){state.subscription.proPreviewActive=true;saveState();renderCar();toast('A következő 3 hírt Pro hanggal hallod');}saveState();return;}
  const mode=event.target.closest('[data-mode]'); if(mode){state.assistantMode=mode.dataset.mode;renderAssistant();saveState();return;}
  const question=event.target.closest('[data-question]'); if(question){state.assistantMode='text';renderAssistant();setTimeout(()=>appendChat(question.dataset.question),0);return;}
  const setting=event.target.closest('[data-setting]'); if(setting){settingsSheet(setting.dataset.setting);return;}
  const plan=event.target.closest('[data-plan]'); if(plan){state.subscription.plan=plan.dataset.plan;saveState();subscriptionSheet('plans');return;}
  const subAction=event.target.closest('[data-sub-action]'); if(subAction){const action=subAction.dataset.subAction;if(action==='review'){subscriptionSheet('confirm');}if(action==='plans'){subscriptionSheet('plans');}if(action==='start-trial'){state.subscription.status='trial';state.subscription.trialDays=14;state.subscription.aiMinutesUsed=0;state.subscription.aiMinutesLimit=state.subscription.plan==='pro'?250:0;saveState();toast('A 14 napos próba elindult');subscriptionSheet();}if(action==='usage'){usageSheet();}if(action==='subscription-home'){subscriptionSheet();}if(action==='restore'){state.subscription.status='active';state.subscription.aiMinutesLimit=state.subscription.plan==='pro'?250:0;saveState();renderSubscriptionGate();toast('A vásárlást visszaállítottuk');subscriptionSheet();}if(action==='store-manage'){toast('Az alkalmazás-áruház előfizetési oldala nyílna meg');}if(action==='expire-demo'){state.subscription.status='expired';saveState();renderSubscriptionGate();}if(action==='payment-demo'){state.subscription.status='payment_failed';saveState();renderSubscriptionGate();}return;}
  const subscribe=event.target.closest('[data-subscribe]'); if(subscribe){state.subscription.plan=subscribe.dataset.subscribe;state.subscription.status='active';state.subscription.aiMinutesUsed=0;state.subscription.aiMinutesLimit=state.subscription.plan==='pro'?250:0;state.subscription.proPreviewAvailable=state.subscription.plan==='basic';state.subscription.proPreviewRemaining=3;state.subscription.proPreviewActive=false;state.route='car';saveState();render();toast(`${planName(state.subscription.plan)} aktiválva`);return;}
  const source=event.target.closest('[data-source]'); if(source){state.sources[source.dataset.source]=!state.sources[source.dataset.source];saveState();settingsSheet('sources');return;}
  const theme=event.target.closest('[data-theme]'); if(theme){state.theme=theme.dataset.theme;applyTheme();saveState();settingsSheet('appearance');return;}
  const lib=event.target.closest('[data-library]'); if(lib){librarySheet(lib.dataset.library);return;}
  const detailSave=event.target.closest('[data-detail-save]'); if(detailSave){toggleSaved(detailSave.dataset.detailSave);openArticle(detailSave.dataset.detailSave);return;}
  const unread=event.target.closest('[data-unread]'); if(unread){state.read.delete(unread.dataset.unread);saveState();toast('Olvasatlanra jelölve');return;}
  if(event.target.closest('[data-detail-share]')){toast('Megosztási párbeszéd helye');return;}
  if(event.target.closest('[data-original]')){toast('Az eredeti kiadói oldal nyílna meg');return;}
  const toggleSetting=event.target.closest('[data-toggle-setting]'); if(toggleSetting){const key=toggleSetting.dataset.toggleSetting;state[key]=!state[key];saveState();settingsSheet(key==='autoNext'?'voice':key==='mobileData'?'data':key==='location'?'location':'notifications');return;}
  if(event.target.closest('[data-add-source]')){toast('RSS-link hozzáadási folyamat');return;}
  if(event.target.closest('[data-demo-reset]')){localStorage.removeItem('hirbeszed-state');toast('Prototípusadatok törölve');setTimeout(()=>location.reload(),500);}
});

document.addEventListener('input',event=>{
  if(event.target.id==='searchInput'){const q=event.target.value.toLowerCase();$('#searchResults').innerHTML=articles.filter(a=>(a.title+' '+a.excerpt+' '+a.source+' '+a.category).toLowerCase().includes(q)).map(a=>articleCard(a,true)).join('')||`<div class="empty"><p>Nincs találat.</p></div>`;}
});
document.addEventListener('submit',event=>{if(event.target.id==='composer'){event.preventDefault();const input=$('#chatInput');if(input.value.trim()){appendChat(input.value.trim());input.value='';}}});
function appendChat(question){const log=$('#chatLog');if(!log)return;log.insertAdjacentHTML('beforeend',`<div class="bubble user">${question}</div><div class="bubble">${answerFor(question)}<span class="sources">A helyi RSS-hírfolyam alapján</span></div>`);view.scrollTop=view.scrollHeight;}

$('#sheetBack').addEventListener('click',event=>{event.preventDefault();event.stopPropagation();closeSheet();});
document.addEventListener('keydown',event=>{if(event.key==='Escape'&&sheet.classList.contains('open'))closeSheet();});
matchMedia('(prefers-color-scheme: dark)').addEventListener?.('change',()=>{if(state.theme==='system')applyTheme();});
applyTheme(); render();
if('serviceWorker' in navigator && location.protocol.startsWith('http')) navigator.serviceWorker.register('./sw.js').catch(()=>{});
