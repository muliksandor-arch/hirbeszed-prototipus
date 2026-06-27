let articles = [];
const NEWS_FEED_URL = './news.json';
const EMPTY_ARTICLE = {
  id:'empty-news',
  source:'Hírbeszéd',
  category:'Friss',
  time:'',
  title:'Nincs betöltött hír',
  excerpt:'A fejlesztési hírfolyam betöltése nem sikerült.',
  body:'A fejlesztési hírfolyam betöltése nem sikerült. Ellenőrizd a news.json fájlt vagy a helyi szervert.',
  image:'assets/prototype/budapest-tram.svg',
  url:''
};

const topics = [
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

const ASSISTANT_CHAT_MAX_MESSAGES = 40;
const defaults = {
  route:'car', sort:'latest', category:'fresh', theme:'system', mic:true, autoNext:true,
  playing:false, paused:false, detailedRead:false, carIndex:0, assistantMode:'voice', read:[], saved:[], history:[], assistantChat:[],
  sources:{HVG:true,Portfolio:true,Qubit:true,'Nemzeti Sport':true,Telex:true,'24.hu':true},
  enabledTopics:topics.map(topic=>topic.id), notifications:true, location:false, mobileData:true,
  subscription:{status:'inactive',plan:'pro',trialDays:14,aiMinutesUsed:0,aiMinutesLimit:240,proPreviewAvailable:true,proPreviewRemaining:3,proPreviewActive:false}
};

const state = Object.assign({}, defaults, JSON.parse(localStorage.getItem('hirbeszed-state') || '{}'));
state.read = new Set(state.read || []); state.saved = new Set(state.saved || []); state.history = state.history || [];
state.subscription = {...defaults.subscription,...(state.subscription || {})};
state.sources = {...defaults.sources,...(state.sources || {})};
state.enabledTopics = Array.isArray(state.enabledTopics) ? state.enabledTopics : [...defaults.enabledTopics];
state.assistantChat = Array.isArray(state.assistantChat) ? state.assistantChat.filter(item=>item&&['user','assistant'].includes(item.role)&&typeof item.text==='string'&&item.text.trim()).slice(-ASSISTANT_CHAT_MAX_MESSAGES) : [];
const legacyTopics = {Mind:'fresh',Technológia:'tech_ai',Világhírek:'foreign','Helyi hírek':'local'};
state.category = legacyTopics[state.category] || topics.find(topic=>topic.name===state.category)?.id || state.category || 'fresh';
let currentUtterance = null; let speechRunId = 0; let currentSpeechText = ''; let currentSpeechOffset = 0; let currentSpeechDetails = false; let assistantSpeaking = false; let currentRecognition = null; let recognitionContext = null; let toastTimer = null; let activeSheetRenderer = null; let carAutoAdvanceTimer = null; let carDeferredSheetTimer = null; let carMicWindowTimer = null; let carMicWindowActive = false;
let assistantPromptPool = []; let activeAssistantPrompt = null; let assistantVoiceResult = null;
const $ = selector => document.querySelector(selector);
const view = $('#view'); const sheet = $('#sheet'); const sheetBody = $('#sheetBody');

function saveState(){
  const serial = {...state,read:[...state.read],saved:[...state.saved]};
  localStorage.setItem('hirbeszed-state',JSON.stringify(serial));
}
function normalizeNewsArticle(item,index){
  const text=value=>String(value||'').trim();
  const source=text(item.source)||'RSS';
  return {
    id:text(item.id)||`rss-${index}`,
    source,
    category:text(item.category)||'Friss',
    time:text(item.time),
    publishedAt:text(item.publishedAt),
    title:text(item.title)||'Cím nélküli hír',
    excerpt:text(item.excerpt||item.description)||'Nincs rövid leírás.',
    body:text(item.body||item.content||item.excerpt)||'A részletes RSS-tartalom nem érhető el.',
    image:text(item.image)||'assets/prototype/budapest-tram.svg',
    url:text(item.url||item.link),
    feedUrl:text(item.feedUrl)
  };
}
async function loadNewsArticles(){
  try{
    const response=await fetch(NEWS_FEED_URL,{cache:'no-store'});
    if(!response.ok)throw new Error('news feed unavailable');
    const payload=await response.json();
    const items=Array.isArray(payload.items)?payload.items:[];
    articles=items.map(normalizeNewsArticle).filter(article=>article.title&&article.id);
    articles.forEach(article=>{ if(!(article.source in state.sources))state.sources[article.source]=true; });
    if(!articles.length)articles=[EMPTY_ARTICLE];
    if(state.carIndex>=articles.length)state.carIndex=0;
  }catch(error){
    console.warn('A fejlesztési hírfolyam nem tölthető be.',error);
    articles=[EMPTY_ARTICLE];
    state.carIndex=0;
  }
}
function effectiveTheme(){ return state.theme==='system' ? (matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light') : state.theme; }
function applyTheme(){
  const theme=effectiveTheme(); document.documentElement.dataset.theme=theme;
  $('#brandMark').src=`assets/brand/hirbeszed-mark-${theme}.svg`;
  document.querySelector('meta[name="theme-color"]').content=theme==='dark'?'#0D191E':'#F6F9F8';
}
function toast(message,options={}){
  const el=$('#toast');
  if(state.route==='car'&&!options.allowInCar){
    clearTimeout(toastTimer);
    if(el) el.classList.remove('show');
    return;
  }
  if(!el)return;
  el.textContent=message;
  el.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer=setTimeout(()=>el.classList.remove('show'),1900);
}
function transitionCarControl(button, pressed, callback){
  if(!button){callback();return;}
  if(button.dataset.transitioning==='true')return;
  button.dataset.transitioning='true';
  button.classList.toggle('is-pressed-state',pressed);
  setTimeout(()=>{delete button.dataset.transitioning;callback();},150);
}
function iconButton(symbol,label,action){ return `<button class="icon-button" type="button" data-action="${action}" aria-label="${label}">${symbol}</button>`; }
function carControlIcon(type,active=true){
  const offClass=active?'':' off';
  if(type==='mic'){
    return `<span class="car-control-icon mic-icon${offClass}" aria-hidden="true"><svg viewBox="0 0 48 48" focusable="false"><path class="control-line" d="M18 13c0-3.3 2.7-6 6-6s6 2.7 6 6v11c0 3.3-2.7 6-6 6s-6-2.7-6-6V13Z"></path><path class="control-line" d="M13 23v1c0 6.1 4.9 11 11 11s11-4.9 11-11v-1"></path><path class="control-line" d="M24 35v6"></path><path class="control-line" d="M18 41h12"></path>${active?'<path class="control-accent" d="M24 14v8"></path>':'<path class="control-slash" d="M12 39L36 9"></path>'}</svg></span>`;
  }
  if(type==='stop'){
    return `<span class="car-control-icon read-icon" aria-hidden="true"><svg viewBox="0 0 48 48" focusable="false"><rect class="control-line" x="10" y="9" width="28" height="30" rx="9"></rect><rect class="control-accent" x="20" y="18" width="8" height="12" rx="2"></rect></svg></span>`;
  }
  if(type==='auto'){
    return `<span class="car-control-icon auto-icon${offClass}" aria-hidden="true"><svg viewBox="0 0 48 48" focusable="false"><rect class="control-line" x="9" y="10" width="30" height="28" rx="8"></rect><path class="control-line" d="M15 18h12M15 24h10M15 30h12"></path><path class="control-accent" d="M30 18l5 6-5 6"></path>${active?'':'<path class="control-slash" d="M13 37L35 11"></path>'}</svg></span>`;
  }
  if(type==='prev'){
    return `<span class="car-control-icon step-icon" aria-hidden="true"><svg viewBox="0 0 48 48" focusable="false"><rect class="control-line" x="10" y="9" width="28" height="30" rx="9"></rect><path class="control-accent" d="M17 17v14"></path><path class="control-line" d="M31 17l-8 7 8 7"></path></svg></span>`;
  }
  if(type==='next'){
    return `<span class="car-control-icon step-icon" aria-hidden="true"><svg viewBox="0 0 48 48" focusable="false"><rect class="control-line" x="10" y="9" width="28" height="30" rx="9"></rect><path class="control-line" d="M17 17l8 7-8 7"></path><path class="control-accent" d="M31 17v14"></path></svg></span>`;
  }
  if(type==='pause'){
    return `<span class="car-control-icon pause-icon" aria-hidden="true"><svg viewBox="0 0 48 48" focusable="false"><rect class="control-line" x="10" y="9" width="28" height="30" rx="9"></rect><path class="control-accent" d="M20 17v14M28 17v14"></path></svg></span>`;
  }
  if(type==='resume'){
    return `<span class="car-control-icon pause-icon" aria-hidden="true"><svg viewBox="0 0 48 48" focusable="false"><rect class="control-line" x="10" y="9" width="28" height="30" rx="9"></rect><path class="control-accent" d="M20 17l12 7-12 7V17Z"></path></svg></span>`;
  }
  if(type==='details'){
    return `<span class="car-control-icon details-icon${offClass}" aria-hidden="true"><svg viewBox="0 0 48 48" focusable="false"><rect class="control-line" x="9" y="10" width="30" height="28" rx="8"></rect><path class="control-line" d="M15 17h18M15 24h18M15 31h12"></path><path class="control-accent" d="M33 30l4 4"></path></svg></span>`;
  }
  return `<span class="car-control-icon read-icon" aria-hidden="true"><svg viewBox="0 0 48 48" focusable="false"><rect class="control-line" x="10" y="9" width="28" height="30" rx="9"></rect><path class="control-accent" d="M20 17l12 7-12 7V17Z"></path></svg></span>`;
}
function carControlViewModel(){
  const micLabel='Mikrofon';
  const playbackLabel=state.paused?'Folytatás':state.playing?'Szünet':'Felolvasás';
  const autoLabel='Hírléptető';
  const prevLabel='Előző';
  const detailLabel=state.detailedRead?'Rövidített hírek':'Részletes hírek';
  const saveLabel='Mentés';
  const nextLabel='Következő';
  const voiceCommands=[micLabel,playbackLabel,autoLabel,prevLabel,detailLabel,saveLabel,nextLabel];
  const button = (className,aria,icon,label) => ({className,aria,html:`${icon}<span class="car-control-label">${label}</span>`});
  return {
    voicePanel:state.mic
      ? `<div class="voice-command-panel"><strong>${carMicWindowActive?'Mikrofon figyel:':state.autoNext?'Hír végén 3 mp:':'Hír végén figyel:'}</strong><span>${state.autoNext?voiceCommands.join(' · '):`${voiceCommands.join(' · ')} · hír végén nyitva marad`}</span></div>`
      : `<div class="voice-command-panel inactive"><strong>Hangutasítások kikapcsolva</strong><span>Hangutasításokhoz kapcsold be a mikrofont a Mikrofon gomb megnyomásával.</span></div>`,
    buttons:{
      mic:button(`car-control mic ${state.mic?'':'off is-pressed-state'}`,state.mic?'Mikrofon bekapcsolva':'Mikrofon kikapcsolva',carControlIcon('mic',state.mic),micLabel),
      play:button(`car-control read-toggle ${state.playing?'playing':''} ${state.paused?'paused is-pressed-state':''}`,state.paused?'Felolvasás folytatása':state.playing?'Felolvasás szüneteltetése':'Felolvasás indítása',carControlIcon(state.paused?'resume':state.playing?'pause':'play'),playbackLabel),
      auto:button(`car-control auto-next ${state.autoNext?'':'off is-pressed-state'}`,state.autoNext?'Hírléptető bekapcsolva':'Hírléptető kikapcsolva',carControlIcon('auto',state.autoNext),autoLabel),
      prev:button('car-control step-control','Előző hír',carControlIcon('prev'),prevLabel),
      details:button(`car-control step-control details-control ${state.detailedRead?'active is-pressed-state':''}`,state.detailedRead?'Rövidített hírek bekapcsolása':'Részletes hírek bekapcsolása',carControlIcon('details',state.detailedRead),detailLabel),
      next:button('car-control step-control','Következő hír',carControlIcon('next'),nextLabel)
    }
  };
}
function updateCarButton(kind,config){
  const button=document.querySelector(`[data-car="${kind}"]`);
  if(!button)return;
  if(button.className!==config.className)button.className=config.className;
  if(button.getAttribute('aria-label')!==config.aria)button.setAttribute('aria-label',config.aria);
  if(button.innerHTML!==config.html)button.innerHTML=config.html;
  delete button.dataset.transitioning;
}
function updateCarDom(){
  if(state.route!=='car'||!document.querySelector('.car-view')){renderCar();return;}
  const article=currentCarArticle();
  const image=document.querySelector('.car-image-wrap .article-image');
  if(image){
    if(image.getAttribute('src')!==article.image)image.setAttribute('src',article.image);
    if(image.getAttribute('alt')!==article.title)image.setAttribute('alt',article.title);
  }
  const badge=document.querySelector('.car-badge'); if(badge&&badge.textContent!==article.category)badge.textContent=article.category;
  const title=document.querySelector('.car-status h1'); if(title&&title.textContent!==article.title)title.textContent=article.title;
  const meta=document.querySelector('.car-status p'); const metaText=`${article.source} · ${article.time}`; if(meta&&meta.textContent!==metaText)meta.textContent=metaText;
  setVoiceActivityState(document.querySelector('.car-wave-area .voice-activity'),carVoiceActivityState());
  const model=carControlViewModel();
  Object.entries(model.buttons).forEach(([kind,config])=>updateCarButton(kind,config));
  const panel=document.querySelector('.voice-command-panel'); if(panel&&panel.outerHTML!==model.voicePanel)panel.outerHTML=model.voicePanel;
}
function setHeader(title,actions=''){ $('#pageTitle').textContent=title; $('#headerActions').innerHTML=actions; }
function articleById(id){ return articles.find(article=>article.id===id); }
function recordRead(id){ state.read.add(id); state.history=[id,...state.history.filter(item=>item!==id)].slice(0,30); saveState(); }
function toggleSaved(id){ state.saved.has(id)?state.saved.delete(id):state.saved.add(id); saveState(); toast(state.saved.has(id)?'Mentve későbbre':'Eltávolítva a mentésekből'); }

function articleCard(article,compact=false){
  const read=state.read.has(article.id), saved=state.saved.has(article.id);
  return `<article class="news-card ${compact?'compact-card':''} ${read?'read':''}" data-article="${escapeHtml(article.id)}">
    <img class="article-image" src="${escapeHtml(article.image)}" alt="A hír illusztrációja">
    <div class="card-body"><div class="meta-line">${read?'':`<span class="unread-dot"></span>`}<span>${escapeHtml(article.source)}</span><span class="meta-time">· ${escapeHtml(article.time)}</span><button type="button" class="save-button ${saved?'saved':''}" data-save="${escapeHtml(article.id)}" aria-label="Mentés">${saved?'♥':'♡'}</button></div>
    <h2>${escapeHtml(article.title)}</h2>${compact?'':`<p>${escapeHtml(article.excerpt)}</p>`}</div></article>`;
}
function filteredArticles(){
  const selectedTopic=topics.find(topic=>topic.id===state.category);
  let items=articles.filter(a=>state.sources[a.source]!==false && (state.category==='fresh'||a.category===selectedTopic?.name));
  if(state.sort==='unread') items=items.filter(a=>!state.read.has(a.id));
  if(state.sort==='personal') items=[...items].sort((a,b)=>(state.saved.has(b.id)?1:0)-(state.saved.has(a.id)?1:0));
  return items;
}
function renderFeed(){
  setHeader('Hírfolyam',iconButton('⌕','Keresés','search')+iconButton('♡','Mentések és előzmények','library'));
  const visibleTopics=topics.filter(topic=>topic.id==='fresh'||state.enabledTopics.includes(topic.id)); const items=filteredArticles();
  view.innerHTML=`<div class="segmented"><button data-sort="latest" class="${state.sort==='latest'?'active':''}">Legfrissebb</button><button data-sort="personal" class="${state.sort==='personal'?'active':''}">Nekem</button><button data-sort="unread" class="${state.sort==='unread'?'active':''}">Olvasatlan</button></div>
    <div class="chips topic-strip" aria-label="Hírtémák">${visibleTopics.map(topic=>`<button class="chip ${state.category===topic.id?'active':''}" data-category="${topic.id}">${topic.name}</button>`).join('')}</div>
    <div class="feed-list">${items.length?items.map((a,i)=>articleCard(a,i>0)).join(''):`<div class="empty"><div class="empty-icon">✓</div><h2>Minden hírt átnéztél</h2><p>Válassz másik témát vagy frissítsd az RSS-forrásokat.</p></div>`}</div>`;
}

function currentCarArticle(){ return articles.length?articles[state.carIndex%articles.length]:EMPTY_ARTICLE; }
function currentSpeechBody(details=state.detailedRead){
  const article=currentCarArticle();
  return `${article.source}. ${article.title}. ${details?article.body:article.excerpt}`;
}
function resumeCurrentSpeech(){
  const details=currentSpeechText?currentSpeechDetails:state.detailedRead;
  if(!('speechSynthesis' in window)||typeof SpeechSynthesisUtterance==='undefined'){
    speakCurrent(details,currentSpeechOffset);
    return;
  }
  if(typeof navigator!=='undefined'&&/Android/i.test(navigator.userAgent||'')){
    speakCurrent(details,currentSpeechOffset);
    return;
  }
  try{speechSynthesis.resume();}catch(_){}
  setTimeout(()=>{
    if(state.route!=='car'||!state.playing||state.paused)return;
    let silent=false;
    try{silent=!speechSynthesis.speaking||speechSynthesis.paused;}catch(_){silent=true;}
    if(silent)speakCurrent(details,currentSpeechOffset);
  },420);
}
window.resumeCurrentSpeech=resumeCurrentSpeech;
function saveCurrentCarArticle(){
  const article=currentCarArticle();
  if(state.saved.has(article.id)){
    toast('Már a mentett hírek között van');
    return;
  }
  toggleSaved(article.id);
}
function handleVoiceCommand(text){
  if(state.route!=='car')return false;
  const command=(text||'').toLowerCase();
  if(command.includes('mikrofon')){state.mic=!state.mic;clearCarMicWindow();toast(state.mic?'Mikrofon bekapcsolva: hír végén figyel':'Mikrofon kikapcsolva');updateCarDom();saveState();return true;}
  if(command.includes('felolvasás')||command.includes('felolvaso')||command.includes('felolvasó')){toggleCarPlayback();return true;}
  if(command.includes('hírléptető')||command.includes('hirlepteto')||command.includes('hírléptetés')){const wasOn=state.autoNext;state.autoNext=!state.autoNext;if(!state.autoNext)clearCarMicWindow();if(!wasOn&&state.autoNext){saveState();goToAdjacentArticle(1);return true;}saveState();updateCarDom();toast(state.autoNext?'Hírléptető bekapcsolva':'Hírléptető kikapcsolva');return true;}
  if(command.includes('következő')){goToAdjacentArticle(1);return true;}
  if(command.includes('előző')){goToAdjacentArticle(-1);return true;}
  if(command.includes('állj')||command.includes('stop')){stopSpeech();return true;}
  if(command.includes('szünet')){togglePause();return true;}
  if(command.includes('folytat')){togglePause();return true;}
  if(command.includes('rövidített')||command.includes('rövid hírek')||command.includes('rövidhírek')){if(state.detailedRead)toggleDetailedRead();else toast('Már rövidített híreket hallasz');return true;}
  if(command.includes('részlet')){toggleDetailedRead();return true;}
  if(command.includes('ment')){saveCurrentCarArticle();return true;}
  toast('Nem értettem a hangutasítást');
  return false;
}
function shouldKeepRecognitionAlive(context){
  if(context==='car')return state.route==='car'&&state.mic&&carMicWindowActive;
  if(context==='assistant')return state.route==='assistant'&&state.assistantMode==='voice';
  return false;
}
function startRecognition(context,onResult,options={}){
  const Recognition=window.SpeechRecognition||window.webkitSpeechRecognition;
  const warnOptions={allowInCar:context==='car'};
  if(!Recognition){toast('Ez a böngésző nem támogatja a mikrofonos vezérlést',warnOptions);return false;}
  if(!shouldKeepRecognitionAlive(context))return false;
  const continuous=options.continuous!==false;
  try{
    stopVoiceListening();
    recognitionContext=context;
    currentRecognition=new Recognition();
    currentRecognition.lang='hu-HU';
    currentRecognition.continuous=continuous;
    currentRecognition.interimResults=false;
    currentRecognition.onresult=event=>{
      const result=event.results[event.results.length-1];
      const handled=onResult(result&&result[0]&&result[0].transcript);
      if(context==='car'&&handled&&state.autoNext)finishCarMicWindow(false);
    };
    currentRecognition.onerror=()=>toast('A mikrofon nem hallható vagy nincs engedély',warnOptions);
    currentRecognition.onend=()=>{if(continuous&&shouldKeepRecognitionAlive(context))try{currentRecognition.start();}catch(_){}}; 
    currentRecognition.start();
    toast(context==='assistant'?'Asszisztens figyel':'Mikrofon figyel');
    return true;
  }catch(_){
    toast('A mikrofon engedélyezése nem sikerült',warnOptions);
    return false;
  }
}
function startVoiceListening(){
  return startCarMicWindow();
}
function clearCarMicWindow(){
  if(carMicWindowTimer){clearTimeout(carMicWindowTimer);carMicWindowTimer=null;}
  carMicWindowActive=false;
  if(recognitionContext==='car')stopVoiceListening();
}
function finishCarMicWindow(advance=false){
  const shouldAdvance=advance&&state.route==='car'&&state.autoNext;
  clearCarMicWindow();
  if(state.route==='car')updateCarDom();
  if(shouldAdvance){
    carAutoAdvanceTimer=setTimeout(()=>{carAutoAdvanceTimer=null;if(state.route==='car'&&state.autoNext)nextArticle(true);},140);
  }
}
function scheduleAutoNextAfterReader(){
  if(state.route!=='car'){updateCarDom();return;}
  if(state.mic){
    startCarMicWindow();
    return;
  }
  if(!state.autoNext){updateCarDom();return;}
  updateCarDom();
  carAutoAdvanceTimer=setTimeout(()=>{carAutoAdvanceTimer=null;if(state.route==='car'&&state.autoNext)nextArticle(true);},700);
}
function startCarMicWindow(){
  if(state.route!=='car'||!state.mic)return false;
  clearCarMicWindow();
  carMicWindowActive=true;
  updateCarDom();
  const started=startRecognition('car',handleVoiceCommand,{continuous:!state.autoNext});
  if(state.autoNext){
    carMicWindowTimer=setTimeout(()=>finishCarMicWindow(true),3000);
    toast('Hír végi mikrofonablak: 3 másodperc');
    return true;
  }
  if(!started){
    carMicWindowActive=false;
    updateCarDom();
    return false;
  }
  toast('Mikrofon figyel: mondd a következő parancsot');
  return true;
}
function handleAssistantVoiceCommand(text){
  if(state.route!=='assistant'||state.assistantMode!=='voice')return;
  const question=(text||'').trim();
  if(!question)return;
  handleAssistantQuestion(question);
}
function startAssistantListening(){
  if(state.route!=='assistant'||state.assistantMode!=='voice')return false;
  return startRecognition('assistant',handleAssistantVoiceCommand);
}
function stopVoiceListening(){
  const recognition=currentRecognition;
  currentRecognition=null;
  recognitionContext=null;
  try{if(recognition){recognition.onend=null;recognition.stop();}}catch(_){}
}
function stopSpeech(update=true){
  clearReaderTimers();
  speechRunId++;
  if('speechSynthesis' in window)try{speechSynthesis.cancel();}catch(_){}
  currentUtterance=null; currentSpeechText=''; currentSpeechOffset=0; assistantSpeaking=false; state.playing=false; state.paused=false; if(update&&state.route==='car') updateCarDom(); if(update&&state.route==='assistant') updateAssistantDom();
}
function clearReaderTimers(){
  if(carAutoAdvanceTimer){clearTimeout(carAutoAdvanceTimer);carAutoAdvanceTimer=null;}
  if(carDeferredSheetTimer){clearTimeout(carDeferredSheetTimer);carDeferredSheetTimer=null;}
  if(carMicWindowTimer){clearTimeout(carMicWindowTimer);carMicWindowTimer=null;}
  carMicWindowActive=false;
  if(recognitionContext==='car')stopVoiceListening();
}
function stopReaderSession(resetOptions=false){
  clearReaderTimers();
  stopVoiceListening();
  stopSpeech(false);
  state.playing=false;
  state.paused=false;
  if(resetOptions)state.detailedRead=false;
}
function stopAssistantSession(){
  stopVoiceListening();
  stopSpeech(false);
}
function enforceSilentRoute(){
  stopVoiceListening();
  stopSpeech(false);
  clearReaderTimers();
  state.detailedRead=false;
}
function speakCurrent(details=state.detailedRead,startOffset=0){
  clearCarMicWindow();
  const article=currentCarArticle();
  const fullText=currentSpeechBody(details);
  const maxOffset=Math.max(0,fullText.length-1);
  const offset=Math.max(0,Math.min(Number(startOffset)||0,maxOffset));
  currentSpeechText=fullText;
  currentSpeechDetails=details;
  currentSpeechOffset=offset;
  if(!('speechSynthesis' in window)||typeof SpeechSynthesisUtterance==='undefined'){
    state.playing=true; state.paused=false;
    saveState();
    updateCarDom();
    toast('A böngésző nem támogatja a felolvasást, vizuális próba fut');
    return;
  }
  const runId=++speechRunId;
  try{speechSynthesis.cancel();}catch(_){}
  const remaining=fullText.slice(offset).trim()||fullText;
  const runOffset=remaining===fullText?0:offset;
  currentUtterance=new SpeechSynthesisUtterance(remaining);
  currentUtterance.lang='hu-HU'; currentUtterance.rate=1; state.playing=true; state.paused=false; updateCarDom();
  currentUtterance.onboundary=event=>{ if(runId!==speechRunId)return; if(typeof event.charIndex==='number')currentSpeechOffset=Math.min(fullText.length,runOffset+event.charIndex); };
  currentUtterance.onend=()=>{ if(runId!==speechRunId)return; currentSpeechText=''; currentSpeechOffset=0; recordRead(article.id); state.playing=false; state.paused=false; const previewFinished=consumeProPreviewArticle(); if(previewFinished){updateCarDom();carDeferredSheetTimer=setTimeout(()=>{carDeferredSheetTimer=null;if(state.route==='car')proPreviewUpsell();},350);return;} scheduleAutoNextAfterReader(); };
  currentUtterance.onerror=()=>{ if(runId!==speechRunId)return; currentUtterance=null;state.playing=true;state.paused=false;updateCarDom();toast('A böngésző hangmotorja nem indult el, vizuális próba fut');};
  try{speechSynthesis.speak(currentUtterance);}catch(_){if(runId!==speechRunId)return; currentUtterance=null;state.playing=true;state.paused=false;updateCarDom();toast('A böngésző hangmotorja nem indult el, vizuális próba fut');}
}
function toggleCarPlayback(){
  if(state.paused){
    state.paused=false; state.playing=true;
    resumeCurrentSpeech();
    updateCarDom(); saveState(); return;
  }
  if(state.playing){
    state.paused=true; state.playing=true;
    if('speechSynthesis' in window)try{speechSynthesis.pause();}catch(_){}
    updateCarDom(); saveState(); return;
  }
  speakCurrent();
  saveState();
}
window.toggleCarPlayback=toggleCarPlayback;
function handleCarPlayButton(event){
  event?.preventDefault?.();
  event?.stopPropagation?.();
  event?.stopImmediatePropagation?.();
  toggleCarPlayback();
  return false;
}
window.handleCarPlayButton=handleCarPlayButton;
function nextArticle(auto=false){ if(auto&&state.route!=='car')return; recordRead(currentCarArticle().id); state.carIndex=(state.carIndex+1)%articles.length; saveState(); if(auto||state.playing){state.playing=true;state.paused=false;speakCurrent();}else updateCarDom(); }
function goToAdjacentArticle(direction,continuePlayback=true){
  if(state.route!=='car')return;
  clearReaderTimers();
  speechRunId++;
  if('speechSynthesis' in window)try{speechSynthesis.cancel();}catch(_){}
  currentUtterance=null; currentSpeechText=''; currentSpeechOffset=0;
  recordRead(currentCarArticle().id);
  state.carIndex=(state.carIndex+articles.length+direction)%articles.length;
  state.paused=false;
  saveState();
  if(continuePlayback){
    state.playing=true;
    speakCurrent();
    return;
  }
  state.playing=false;
  updateCarDom();
}
function togglePause(){
  if(state.paused){
    state.paused=false; state.playing=true;
    resumeCurrentSpeech();
    updateCarDom(); saveState(); return;
  }
  if(!state.playing){speakCurrent();return;}
  state.paused=true; state.playing=true;
  if('speechSynthesis' in window)try{speechSynthesis.pause();}catch(_){}
  updateCarDom(); saveState();
}
function toggleDetailedRead(){
  const switchingToDetailed=!state.detailedRead;
  if(!switchingToDetailed){
    speechRunId++;
    if('speechSynthesis' in window)try{speechSynthesis.cancel();}catch(_){}
    currentUtterance=null; currentSpeechText=''; currentSpeechOffset=0;
    recordRead(currentCarArticle().id);
    state.carIndex=(state.carIndex+1)%articles.length;
  }
  state.detailedRead=switchingToDetailed;
  state.paused=false;
  saveState();
  state.playing=true;
  speakCurrent(state.detailedRead);
  toast(state.detailedRead?'Részletes hírek bekapcsolva':'Rövidített hírek bekapcsolva');
}
function consumeProPreviewArticle(){
  const sub=state.subscription;
  if(sub.plan!=='basic'||!sub.proPreviewActive) return false;
  sub.proPreviewRemaining=Math.max(0,sub.proPreviewRemaining-1);
  if(sub.proPreviewRemaining===0){sub.proPreviewActive=false;sub.proPreviewAvailable=false;saveState();return true;}
  saveState(); return false;
}
function proPreviewUpsell(){
  openSheet('Ilyen a Hírbeszéd Pro','A heti három próbahír véget ért',`<section class="subscription-screen"><div class="expired-hero"><span class="expired-icon">✦</span><span class="subscription-kicker">PRO HANGPRÓBA</span><h1>Hallható a különbség.</h1><p>A Pro csomag természetesebb felolvasást és havi 240 perc prémium AI-hangot biztosít.</p></div><button class="primary-button coral-button" data-subscribe="pro">Váltás Pro csomagra · 3500 Ft/hó</button><button class="text-button" data-action="close-sheet">Maradok az Alap csomagnál</button></section>`);
}
function carVoiceActivityState(){
  if(state.playing&&!state.paused)return 'speaking';
  if(carMicWindowActive)return 'listening';
  return 'idle';
}
function voiceActivityMarkup(mode='idle',extraClass=''){
  const safeMode=['idle','speaking','listening'].includes(mode)?mode:'idle';
  const label=safeMode==='speaking'?'Felolvasás folyamatban':safeMode==='listening'?'Mikrofon figyel':'Nyugalmi hangállapot';
  return `<div class="wave voice-activity voice-${safeMode} ${safeMode==='speaking'?'':'paused'} ${extraClass}" data-voice-state="${safeMode}" role="img" aria-label="${label}"><span class="voice-rings" aria-hidden="true"><b></b><b></b><b></b></span><span class="voice-core" aria-hidden="true"></span><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i></div>`;
}
function setVoiceActivityState(element,mode){
  if(!element)return;
  const safeMode=['idle','speaking','listening'].includes(mode)?mode:'idle';
  element.dataset.voiceState=safeMode;
  element.classList.toggle('voice-idle',safeMode==='idle');
  element.classList.toggle('voice-speaking',safeMode==='speaking');
  element.classList.toggle('voice-listening',safeMode==='listening');
  element.classList.toggle('paused',safeMode!=='speaking');
  element.setAttribute('aria-label',safeMode==='speaking'?'Felolvasás folyamatban':safeMode==='listening'?'Mikrofon figyel':'Nyugalmi hangállapot');
}
function renderCar(){
  setHeader('Felolvasó',iconButton('⋯','További lehetőségek','car-more')); const article=currentCarArticle(); const sub=state.subscription; const showProSample=sub.plan==='basic'&&sub.status==='active'&&sub.proPreviewAvailable;
  const micLabel='Mikrofon';
  const playbackLabel=state.paused?'Folytatás':state.playing?'Szünet':'Felolvasás';
  const autoLabel='Hírléptető';
  const prevLabel='Előző';
  const detailLabel=state.detailedRead?'Rövidített hírek':'Részletes hírek';
  const saveLabel='Mentés';
  const nextLabel='Következő';
  const voiceCommands=[micLabel,playbackLabel,autoLabel,prevLabel,detailLabel,saveLabel,nextLabel];
  const voicePanel=state.mic
    ? `<div class="voice-command-panel"><strong>${carMicWindowActive?'Mikrofon figyel:':state.autoNext?'Hír végén 3 mp:':'Hír végén figyel:'}</strong><span>${state.autoNext?voiceCommands.join(' · '):`${voiceCommands.join(' · ')} · hír végén nyitva marad`}</span></div>`
    : `<div class="voice-command-panel inactive"><strong>Hangutasítások kikapcsolva</strong><span>Hangutasításokhoz kapcsold be a mikrofont a Mikrofon gomb megnyomásával.</span></div>`;
  view.innerHTML=`<section class="car-view"><div class="car-news-stack"><div class="car-image-wrap"><img class="article-image" src="${escapeHtml(article.image)}" alt="${escapeHtml(article.title)}"><span class="car-badge">${escapeHtml(article.category)}</span></div>
    <div class="car-status"><h1>${escapeHtml(article.title)}</h1><p>${escapeHtml(article.source)} · ${escapeHtml(article.time)}</p></div></div>
    <div class="car-bottom-stack">${showProSample?`<button class="pro-sample-card" data-car="pro-preview"><span class="pro-sample-icon">✦</span><span><strong>Próbáld ki a Pro hangot</strong><small>Heti 3 hír természetesebb AI-felolvasással</small></span><b>${sub.proPreviewRemaining} hír ›</b></button>`:''}<div class="car-wave-area">${voiceActivityMarkup(carVoiceActivityState())}</div>${voicePanel}
      <div class="car-controls"><button class="car-control step-control" data-car="prev" aria-label="Előző hír">${carControlIcon('prev')}<span class="car-control-label">${prevLabel}</span></button><button type="button" class="car-control read-toggle ${state.playing?'playing':''} ${state.paused?'paused is-pressed-state':''}" data-car="play" aria-label="${state.paused?'Felolvasás folytatása':state.playing?'Felolvasás szüneteltetése':'Felolvasás indítása'}">${carControlIcon(state.paused?'resume':state.playing?'pause':'play')}<span class="car-control-label">${playbackLabel}</span></button><button class="car-control step-control" data-car="next" aria-label="Következő hír">${carControlIcon('next')}<span class="car-control-label">${nextLabel}</span></button></div>
      <div class="car-step-controls"><button class="car-control mic ${state.mic?'':'off is-pressed-state'}" data-car="mic" aria-label="${state.mic?'Mikrofon bekapcsolva':'Mikrofon kikapcsolva'}">${carControlIcon('mic',state.mic)}<span class="car-control-label">${micLabel}</span></button><button class="car-control step-control details-control ${state.detailedRead?'active is-pressed-state':''}" data-car="details" aria-label="${state.detailedRead?'Rövidített hírek bekapcsolása':'Részletes hírek bekapcsolása'}">${carControlIcon('details',state.detailedRead)}<span class="car-control-label">${detailLabel}</span></button><button class="car-control auto-next ${state.autoNext?'':'off is-pressed-state'}" data-car="auto" aria-label="${state.autoNext?'Hírléptető bekapcsolva':'Hírléptető kikapcsolva'}">${carControlIcon('auto',state.autoNext)}<span class="car-control-label">${autoLabel}</span></button></div>
      </div></section>`;
}

const assistantOpeningQuestion='Melyik témával kezdjük a hírmustrát?';
const assistantPromptFallbacks=[
  {question:'Mivel kezdjük a hírmustrát?',description:'Mondd el, milyen témára vagy kíváncsi, és átnézem hozzá a híreket.'},
  {question:'Milyen hírekről beszéljünk?',description:'Kérdezhetsz témára, eseményre vagy forrásra, én pedig összefoglalom.'},
  {question:'Mi érdekel most leginkább?',description:'Mondd ki a témát, és segítek eligazodni a friss hírek között.'},
  {question:'Milyen témában nézzünk körül?',description:'Elég egy kulcsszó, például gazdaság, sport, közlekedés vagy technológia.'},
  {question:'Mit keressek meg a hírfolyamban?',description:'Mondd el röviden, mire vagy kíváncsi, és megkeresem a kapcsolódó híreket.'},
  {question:'Miről szeretnél hallani?',description:'Válaszolj természetesen, én pedig összefoglalom a lényeget.'},
  {question:'Melyik témával induljunk?',description:'Mondd ki a témát, és elmondom, mi történt benne mostanában.'},
  {question:'Miben segítsek a hírek között?',description:'Kérdezhetsz friss eseményről, háttérről vagy egy konkrét témáról.'},
  {question:'Melyik hír érdekel?',description:'Mondd el, mire gondolsz, és átnézem a hozzá kapcsolódó cikkeket.'},
  {question:'Keresünk valami frisset?',description:'Mondd ki a témát, és összeszedem a legfontosabb híreket.'},
  {question:'Mi legyen az első téma?',description:'Kezdhetünk bármivel, ami most érdekel a hírfolyamból.'},
  {question:'Milyen irányba menjünk?',description:'Mondhatsz témakört, hírtípust vagy egyszerű kérdést is.'},
  {question:'Mit nézzek át neked?',description:'A friss RSS-hírek alapján röviden összefoglalom, amit találok.'},
  {question:'Mire vagy kíváncsi a hírekből?',description:'Kérdezz szóban, és válaszolok a beállított források alapján.'},
  {question:'Kezdjük a hírmustrát?',description:'Mondd meg, milyen témával induljunk, és már nézem is.'},
  {question:'Mi foglalkoztat most?',description:'Elmondhatod saját szavaiddal, én hírekre fordítom a kérdést.'},
  {question:'Melyik témát bontsam ki?',description:'Röviden vagy részletesebben is elmondhatom, amit a hírekből látok.'},
  {question:'Kérdezz a friss hírekről.',description:'Mondd ki, mi érdekel, és keresek hozzá kapcsolódó híreket.'},
  {question:'Milyen hírt hallgatnál meg?',description:'Választhatsz témát, forrást vagy konkrét eseményt is.'},
  {question:'Indulhat a hangos hírmustra?',description:'Mondd el, merre induljunk, és összefoglalom a legfontosabbakat.'}
];
function normalizeAssistantPrompt(item){
  if(!item||typeof item.question!=='string'||typeof item.description!=='string')return null;
  const question=item.question.trim();
  const description=item.description.trim();
  return question&&description?{question,description}:null;
}
async function fetchAssistantPromptProvider(){
  // Later this can call the real AI/API endpoint with current news and user preferences.
  const response=await fetch('./assistant-prompts.json',{cache:'no-store'});
  if(!response.ok)throw new Error('assistant prompts unavailable');
  const data=await response.json();
  const items=Array.isArray(data)?data:data.items;
  if(!Array.isArray(items))throw new Error('assistant prompts malformed');
  return items.map(normalizeAssistantPrompt).filter(Boolean);
}
async function loadAssistantPromptProvider(){
  try{
    const prompts=await fetchAssistantPromptProvider();
    assistantPromptPool=prompts.length?prompts:[...assistantPromptFallbacks];
  }catch(_){
    assistantPromptPool=[...assistantPromptFallbacks];
  }
}
function randomAssistantPrompt(){
  const prompts=assistantPromptPool.length?assistantPromptPool:assistantPromptFallbacks;
  return prompts[Math.floor(Math.random()*prompts.length)]||{question:assistantOpeningQuestion,description:'Mondd el, mire vagy kíváncsi, és átnézem hozzá a híreket.'};
}
function prepareAssistantVoiceOpening(){
  activeAssistantPrompt=randomAssistantPrompt();
  assistantVoiceResult=null;
}
function currentAssistantPrompt(){
  if(!activeAssistantPrompt)prepareAssistantVoiceOpening();
  return activeAssistantPrompt;
}
function escapeHtml(value){
  return String(value??'').replace(/[&<>"']/g, char=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]));
}
function assistantMessageId(){
  return `am-${Date.now().toString(36)}-${Math.random().toString(36).slice(2,8)}`;
}
function trimAssistantChat(){
  state.assistantChat=state.assistantChat.slice(-ASSISTANT_CHAT_MAX_MESSAGES);
}
function assistantOpeningMessageText(prompt=currentAssistantPrompt()){
  return `${prompt.question} ${prompt.description}`;
}
function addAssistantChatMessage(role,text,options={}){
  const clean=String(text||'').trim();
  if(!clean)return null;
  const message={
    id:assistantMessageId(),
    role,
    text:clean,
    kind:options.kind||'',
    title:options.title||'',
    description:options.description||'',
    source:options.source||'',
    articleId:options.articleId||'',
    articleIds:Array.isArray(options.articleIds)?options.articleIds.filter(Boolean).slice(0,5):[],
    createdAt:Date.now()
  };
  state.assistantChat.push(message);
  trimAssistantChat();
  saveState();
  return message;
}
function ensureAssistantConversation(){
  if(state.assistantChat.length)return;
  const prompt=currentAssistantPrompt();
  addAssistantChatMessage('assistant',assistantOpeningMessageText(prompt),{kind:'opening',title:prompt.question,description:prompt.description});
}
function resetAssistantConversation(){
  state.assistantChat=[];
  prepareAssistantVoiceOpening();
  ensureAssistantConversation();
  assistantVoiceResult=null;
  saveState();
}
function assistantHasRealExchange(){
  return state.assistantChat.some(message=>message.role==='user');
}
function normalizeIntentText(text){
  return String(text||'').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'');
}
const ASSISTANT_STOP_WORDS=new Set('akkor ahol ahogy akarok alapjan amit arra arrol azt azok csak cikk cikket egy ebben engem ennek erdekel erdekelne ezt fel hogy hirek hireket hir hirbol hirt hozza kerlek kicsit lehet legyen meg melyik mi mik miket milyen mit most mondj mutasd vagy van vannak valami valamit'.split(' '));
function assistantKeywords(text){
  return normalizeIntentText(text).split(/[^a-z0-9]+/).filter(word=>word.length>2&&!ASSISTANT_STOP_WORDS.has(word));
}
function assistantIntentFor(text){
  const value=normalizeIntentText(text);
  return {
    value,
    keywords:assistantKeywords(text),
    wantsMore:['reszletes','bovebben','mondj tobbet','hatter','miert','errol','folytasd','bontsd ki'].some(phrase=>value.includes(phrase)),
    wantsSummary:['osszefoglal','foglalj ossze','attekintes','mi tortent','legfontosabb','hir mustra','hirmustra'].some(phrase=>value.includes(phrase)),
    wantsShort:['roviden','tomoren','egy mondatban'].some(phrase=>value.includes(phrase))
  };
}
function isAssistantNewConversationIntent(text){
  const value=normalizeIntentText(text);
  return ['mas erdekel','valtsunk temat','tema valtas','mas tema','uj beszelgetes','uj cseveges','kezdjunk ujat','kezdjuk ujra'].some(phrase=>value.includes(phrase));
}
function latestAssistantAnswer(){
  return [...state.assistantChat].reverse().find(message=>message.role==='assistant'&&message.kind!=='opening')||null;
}
function latestAssistantArticle(){
  const latest=latestAssistantAnswer();
  const id=latest?.articleId||latest?.articleIds?.[0];
  return id?articleById(id):null;
}
function titleFromAssistantText(text){
  const clean=String(text||'').replace(/\s+/g,' ').trim();
  const direct=clean.match(/^(.+?) friss híre:\s*(.+?)(?:\. Részletesebben:|$)/);
  if(direct)return direct[2].trim();
  const digest=clean.match(/\b1\.\s*([^:]+):\s*(.+?)(?:\. \d\.|$)/);
  if(digest)return digest[2].trim();
  return '';
}
function latestAssistantVoiceContext(){
  const latest=latestAssistantAnswer();
  if(!latest)return null;
  const title=latest.title||titleFromAssistantText(latest.text)||'Folytassuk innen';
  const description=latest.description||firstSentence(latest.text)||'Mondd el, merre menjünk tovább a hírek között.';
  return {message:latest,title,description};
}
function matchingArticleForQuestion(text){
  const matches=assistantArticleMatches(assistantIntentFor(text),1);
  return matches[0]||null;
}
function firstSentence(text){
  const clean=String(text||'').replace(/^Rövid hír:\s*/i,'').replace(/^Részletes hír:\s*/i,'').trim();
  const match=clean.match(/^.*?[.!?](?=\s|$)/);
  return (match?match[0]:clean).trim();
}
function assistantArticleScore(article,intent,index){
  if(state.sources[article.source]===false)return -1;
  const title=normalizeIntentText(article.title);
  const excerpt=normalizeIntentText(article.excerpt);
  const body=normalizeIntentText(article.body);
  const category=normalizeIntentText(article.category);
  const source=normalizeIntentText(article.source);
  let score=Math.max(0,30-index)*0.01;
  if(intent.value.includes(source))score+=12;
  if(intent.value.includes(category))score+=9;
  intent.keywords.forEach(word=>{
    if(source.includes(word))score+=8;
    if(category.includes(word))score+=6;
    if(title.includes(word))score+=4;
    if(excerpt.includes(word))score+=2;
    if(body.includes(word))score+=1;
  });
  return score;
}
function assistantArticleMatches(intent,limit=3){
  const scored=articles.map((article,index)=>({article,index,score:assistantArticleScore(article,intent,index)})).filter(item=>item.score>0);
  const matches=(scored.length?scored:articles.filter(article=>state.sources[article.source]!==false).map((article,index)=>({article,index,score:0})))
    .sort((a,b)=>b.score-a.score||a.index-b.index)
    .map(item=>item.article);
  return matches.slice(0,limit);
}
function assistantArticleLine(article,index){
  return `${index+1}. ${article.source}: ${article.title}. ${firstSentence(article.excerpt)}`;
}
function assistantSingleArticleAnswer(article,intent){
  const intro=intent.wantsMore?'Kibontom az utolsó kapcsolódó hírt.':'A hírfolyam alapján ez kapcsolódik leginkább a kérdésedhez.';
  const speech=intent.wantsShort
    ? `${article.source}: ${article.title}. ${firstSentence(article.excerpt)}`
    : `${intro} ${article.source} cikke szerint: ${article.title}. Röviden: ${firstSentence(article.excerpt)} Részletesebben: ${article.body}`;
  return {
    speech,
    title:article.title,
    description:firstSentence(article.excerpt||article.body),
    articleId:article.id,
    articleIds:[article.id]
  };
}
function assistantMultiArticleAnswer(matches,intent){
  if(!matches.length){
    return {speech:'A fejlesztési RSS-hírfolyam most nem tartalmaz elérhető hírt.',title:'Nincs találat',description:'A hírlista jelenleg üres.',articleIds:[]};
  }
  const main=matches[0];
  const topic=intent.keywords[0]?`a(z) ${intent.keywords[0]} témában`:'a betöltött RSS-hírek között';
  const lead=intent.wantsSummary?'Rövid hírmustrát adok.':`Ezt találtam ${topic}.`;
  const speech=`${lead} ${matches.map(assistantArticleLine).join(' ')} A legfontosabbnak most a ${main.source} híre tűnik: ${main.title}. Ha szeretnéd, ezt részletesebben is kibontom.`;
  return {
    speech,
    title:intent.wantsSummary?'Rövid hírmustra':main.title,
    description:firstSentence(main.excerpt||speech),
    articleId:main.id,
    articleIds:matches.map(article=>article.id)
  };
}
function assistantVoiceAnswerFor(text){
  const intent=assistantIntentFor(text);
  const previous=latestAssistantArticle();
  if(intent.wantsMore&&previous)return assistantSingleArticleAnswer(previous,intent);
  const matchLimit=intent.wantsSummary?3:3;
  const matches=assistantArticleMatches(intent,matchLimit);
  if(matches.length===1||(!intent.wantsSummary&&intent.keywords.length>0&&assistantArticleScore(matches[0],intent,0)>=8)){
    return assistantSingleArticleAnswer(matches[0],intent);
  }
  return assistantMultiArticleAnswer(matches,intent);
}
function handleAssistantQuestion(question){
  const clean=String(question||'').trim();
  if(!clean)return;
  if(isAssistantNewConversationIntent(clean)){
    resetAssistantConversation();
    renderAssistant();
    focusAssistantComposer();
    toast('Új csevegés indult');
    if(state.assistantMode!=='silent')speakAssistantText(assistantOpeningSpeechText());
    return;
  }
  const answer=assistantVoiceAnswerFor(clean);
  addAssistantChatMessage('user',clean);
  addAssistantChatMessage('assistant',answer.speech,{
    title:answer.title,
    description:answer.description,
    source:'A helyi RSS-hírfolyam alapján',
    articleId:answer.articleId,
    articleIds:answer.articleIds
  });
  assistantVoiceResult={title:answer.title,description:answer.description};
  renderAssistant();
  focusAssistantComposer();
  if(state.assistantMode==='voice')toast('Asszisztens válasz felolvasása indul');
  if(state.assistantMode!=='silent')speakAssistantText(answer.speech);
}
function assistantWaveState(mode=state.assistantMode){
  if(assistantSpeaking)return 'speaking';
  if(mode==='voice')return 'listening';
  return 'idle';
}
function assistantLiveLabel(mode=state.assistantMode){
  if(mode==='voice')return assistantSpeaking?'Felolvasok':'Figyelek';
  if(mode==='text')return assistantSpeaking?'Felolvasok':'Gépelés';
  return 'Néma';
}
function assistantTitle(mode=state.assistantMode){
  if(mode==='voice'){
    const latest=latestAssistantVoiceContext();
    return assistantVoiceResult?.title||latest?.title||currentAssistantPrompt().question;
  }
  return assistantOpeningQuestion;
}
function assistantSubtitle(mode=state.assistantMode){
  if(mode==='voice'){
    const latest=latestAssistantVoiceContext();
    return assistantVoiceResult?.description||latest?.description||currentAssistantPrompt().description;
  }
  if(mode==='text')return 'Írd be, mire vagy kíváncsi, a választ felolvassa.';
  return 'Írd be, mire vagy kíváncsi, a választ szövegben kapod.';
}
function assistantOpeningSpeechText(){
  const prompt=currentAssistantPrompt();
  return `${prompt.question} ${prompt.description}`;
}
function assistantEntrySpeechText(){
  const latest=latestAssistantVoiceContext();
  if(latest)return `${latest.title}. ${latest.description}`;
  return assistantOpeningSpeechText();
}
function nextAssistantMode(mode=state.assistantMode){
  return mode==='voice'?'text':mode==='text'?'silent':'voice';
}
function assistantModeIcon(mode,extraClass=''){
  const cls=`mode-icon mode-icon-${mode}${extraClass?` ${extraClass}`:''}`;
  if(mode==='voice'){
    return `<span class="${cls}" aria-hidden="true"><svg viewBox="0 0 32 32" focusable="false"><path class="mode-line" d="M7 18v-4"></path><path class="mode-line" d="M12 22V10"></path><path class="mode-accent" d="M16 25V7"></path><path class="mode-line" d="M20 22V10"></path><path class="mode-line" d="M25 18v-4"></path></svg></span>`;
  }
  if(mode==='text'){
    return `<span class="${cls}" aria-hidden="true"><svg viewBox="0 0 32 32" focusable="false"><rect class="mode-line" x="5.5" y="8.5" width="21" height="15" rx="4"></rect><path class="mode-accent" d="M11 19.5h10"></path><circle class="mode-dot" cx="10.5" cy="14" r="1.4"></circle><circle class="mode-dot" cx="16" cy="14" r="1.4"></circle><circle class="mode-dot" cx="21.5" cy="14" r="1.4"></circle></svg></span>`;
  }
  return `<span class="${cls}" aria-hidden="true"><svg viewBox="0 0 32 32" focusable="false"><path class="mode-line" d="M6 18v-4h5l6-5v14l-6-5H6Z"></path><path class="mode-accent" d="M22.5 12.5l4 7"></path><path class="mode-accent" d="M26.5 12.5l-4 7"></path></svg></span>`;
}
function assistantModeButtons(mode=state.assistantMode){
  const modes=[['voice','Beszéd'],['text','Gépelés'],['silent','Néma']];
  return `<div class="mode-switch" aria-label="Asszisztens mód">${modes.map(([id,label])=>`<button class="${mode===id?'active':''}" data-mode="${id}" aria-label="${label} mód">${assistantModeIcon(id)}<span class="mode-label">${label}</span></button>`).join('')}</div>`;
}
function assistantChatEntryMarkup(message){
  const classes=['bubble'];
  if(message.role==='user')classes.push('user');
  if(message.kind==='opening')classes.push('opening');
  const source=message.source&&message.role==='assistant'?`<span class="sources">${escapeHtml(message.source)}</span>`:'';
  return `<div class="${classes.join(' ')}" data-message-id="${escapeHtml(message.id)}">${escapeHtml(message.text)}${source}</div>`;
}
function assistantChatLogMarkup(){
  ensureAssistantConversation();
  return `<div id="chatLog" class="chat-log">${state.assistantChat.map(assistantChatEntryMarkup).join('')}</div>`;
}
function assistantComposerMarkup(){
  return `<form id="composer" class="composer"><input id="chatInput" autocomplete="off" placeholder="Írj egy üzenetet…"><button type="submit">➤</button></form>`;
}
function assistantFullChatMarkup(){
  return `<div class="assistant-chat-panel">${assistantChatLogMarkup()}</div>${assistantComposerMarkup()}`;
}
function assistantVoiceSummaryMarkup(){
  return `<div class="assistant-voice-summary" aria-live="polite"><h1>${escapeHtml(assistantTitle('voice'))}</h1><p>${escapeHtml(assistantSubtitle('voice'))}</p></div>`;
}
function scrollAssistantChatToEnd(){
  requestAnimationFrame(()=>{const log=$('#chatLog');if(log)log.scrollTop=log.scrollHeight;});
}
function focusAssistantComposer(){
  if(state.route!=='assistant'||state.assistantMode==='voice')return;
  requestAnimationFrame(()=>{
    const input=$('#chatInput');
    if(!input)return;
    input.focus({preventScroll:true});
    input.setSelectionRange?.(input.value.length,input.value.length);
  });
}
function updateAssistantDom(){
  if(state.route!=='assistant')return;
  setVoiceActivityState(document.querySelector('.assistant-voice-activity'),assistantWaveState());
  const live=document.querySelector('.assistant-view .live');
  if(live)live.textContent=assistantLiveLabel();
}
function finishAssistantSpeech(runId,restartAssistantListening){
  if(runId!==speechRunId)return;
  currentUtterance=null;
  assistantSpeaking=false;
  updateAssistantDom();
  if(restartAssistantListening&&state.route==='assistant'&&state.assistantMode==='voice')startAssistantListening();
}
function finishAssistantSpeechAfterMinimum(runId,restartAssistantListening,duration,startedAt){
  const delay=Math.max(0,duration-(Date.now()-startedAt));
  setTimeout(()=>finishAssistantSpeech(runId,restartAssistantListening),delay);
}
function runAssistantVisualSpeechFallback(runId,restartAssistantListening,message,duration=3600){
  assistantSpeaking=true;
  updateAssistantDom();
  if(message)toast(message);
  setTimeout(()=>finishAssistantSpeech(runId,restartAssistantListening),duration);
}
function configureAssistantUtterance(utterance){
  utterance.lang='hu-HU';
  utterance.rate=1;
  try{
    const voices=speechSynthesis.getVoices?.()||[];
    const huVoice=voices.find(voice=>/^hu[-_]?/i.test(voice.lang||''))||voices.find(voice=>/magyar|hungarian/i.test(`${voice.name} ${voice.lang}`));
    if(huVoice)utterance.voice=huVoice;
  }catch(_){}
}
function speakAssistantText(text){
  if(state.route!=='assistant'||state.assistantMode==='silent')return;
  const visualDuration=Math.min(6500,Math.max(3600,String(text||'').length*55));
  if(!('speechSynthesis' in window)||typeof SpeechSynthesisUtterance==='undefined'){
    const runId=++speechRunId;
    runAssistantVisualSpeechFallback(runId,state.assistantMode==='voice','A válasz felolvasása vizuális próba',visualDuration);
    return;
  }
  const restartAssistantListening=state.assistantMode==='voice';
  if(restartAssistantListening)stopVoiceListening();
  const runId=++speechRunId;
  const startedAt=Date.now();
  try{speechSynthesis.cancel();}catch(_){}
  const utterance=new SpeechSynthesisUtterance(text);
  configureAssistantUtterance(utterance);
  currentUtterance=utterance;
  assistantSpeaking=true;
  updateAssistantDom();
  utterance.onend=()=>finishAssistantSpeechAfterMinimum(runId,restartAssistantListening,visualDuration,startedAt);
  utterance.onerror=()=>runAssistantVisualSpeechFallback(runId,restartAssistantListening,'A böngésző hangmotorja nem indult el, vizuális próba fut',visualDuration);
  try{
    speechSynthesis.resume?.();
    speechSynthesis.speak(utterance);
    setTimeout(()=>{try{speechSynthesis.resume?.();}catch(_){}},80);
  }catch(_){
    runAssistantVisualSpeechFallback(runId,restartAssistantListening,'A böngésző hangmotorja nem indult el, vizuális próba fut',visualDuration);
  }
}
function renderAssistant(){
  const nextMode=nextAssistantMode();
  const nextModeLabel=nextMode==='voice'?'Beszéd':nextMode==='text'?'Gépelés':'Néma';
  setHeader('Asszisztens',iconButton(assistantModeIcon(nextMode,'header-mode-icon'),`${nextModeLabel} mód megnyitása`,'assistant-toggle'));
  const mode=state.assistantMode;
  ensureAssistantConversation();
  const wave=voiceActivityMarkup(assistantWaveState(mode),'assistant-voice-activity');
  if(mode==='voice'){
    view.innerHTML=`<section class="assistant-view assistant-mode-voice">${assistantModeButtons(mode)}<div class="assistant-hero"><div class="live">${assistantLiveLabel(mode)}</div><button class="assistant-wave-button" type="button" data-action="voice-demo" aria-label="Asszisztens hangállapot">${wave}</button>${assistantVoiceSummaryMarkup()}</div></section>`;
    return;
  }
  if(mode==='text'){
    view.innerHTML=`<section class="assistant-view assistant-mode-text">${assistantModeButtons(mode)}<div class="assistant-hero assistant-fixed-hero"><div class="live">${assistantLiveLabel(mode)}</div><button class="assistant-wave-button" type="button" data-action="voice-demo" aria-label="Asszisztens hangállapot">${wave}</button></div>${assistantFullChatMarkup()}</section>`;
    scrollAssistantChatToEnd();
    return;
  }
  view.innerHTML=`<section class="assistant-view assistant-mode-silent">${assistantModeButtons(mode)}<div class="assistant-silent-header"><div class="live">${assistantLiveLabel(mode)}</div></div>${assistantFullChatMarkup()}</section>`;
  scrollAssistantChatToEnd();
}

function activateRouteAudio(route=state.route){
  if(route==='car'){
    stopVoiceListening();
    return;
  }
  if(route==='assistant'){
    ensureAssistantConversation();
    if(state.assistantMode==='voice')speakAssistantText(assistantEntrySpeechText());
    else stopVoiceListening();
    if(state.assistantMode==='silent')stopSpeech(false);
    return;
  }
  enforceSilentRoute();
}
function changeRoute(nextRoute){
  if(!nextRoute||state.route===nextRoute)return;
  const previousRoute=state.route;
  if(previousRoute==='car')stopReaderSession(true);
  if(previousRoute==='assistant')stopAssistantSession();
  if(nextRoute==='feed'||nextRoute==='settings')enforceSilentRoute();
  state.route=nextRoute;
  render();
  activateRouteAudio(nextRoute);
  saveState();
}
function setAssistantMode(mode){
  if(!['voice','text','silent'].includes(mode))return;
  if(state.assistantMode===mode){
    renderAssistant();
    activateRouteAudio('assistant');
    return;
  }
  stopAssistantSession();
  state.assistantMode=mode;
  renderAssistant();
  activateRouteAudio('assistant');
  saveState();
}

function subscriptionLabel(){
  const sub=state.subscription;
  if(sub.status==='trial') return `${sub.plan==='pro'?'Pro':'Alap'} próba · ${sub.trialDays} nap van hátra`;
  if(sub.status==='active') return `${sub.plan==='pro'?'Pro':'Alap'} · aktív`;
  if(sub.status==='expired') return 'A próbaidő lejárt';
  return '14 nap ingyen · utána 1500 Ft-tól';
}
function settingsItems(){
  const activeSources=Object.values(state.sources).filter(Boolean).length;
  const activeTopics=state.enabledTopics.length;
  return [
    ['◉','RSS-források',`${activeSources} bekapcsolva`,'sources'],['#','Témák és érdeklődés',`${activeTopics} kiválasztva`,'topics'],['🔔','Értesítések',state.notifications?'Bekapcsolva':'Kikapcsolva','notifications'],['◐','Megjelenés',state.theme==='system'?'Rendszer szerint':state.theme==='dark'?'Sötét':'Világos','appearance'],['◉','Hang és felolvasó','Magyar hang · 1,0×','voice'],['⇅','Mobiladat és tárhely',state.mobileData?'Mobilnet engedélyezve':'Csak Wi-Fi','data'],['⌖','Helyi hírek',state.location?'Budapest környéke':'Kikapcsolva','location'],['♙','Fiók és biztonság','Prototípus-fiók','account']
  ];
}
function renderSettings(){
  const items=settingsItems();
  setHeader('Beállítások'); view.innerHTML=`<div class="settings-group subscription-entry">${settingRow(['✦','Előfizetés',subscriptionLabel(),'subscription'])}</div><div class="settings-group">${items.slice(0,4).map(settingRow).join('')}</div><div class="settings-group">${items.slice(4,7).map(settingRow).join('')}</div><div class="settings-group">${settingRow(items[7])}</div>`;
}
function settingRow(item){return `<button class="settings-row" data-setting="${item[3]}"><span class="row-icon">${item[0]}</span><span class="row-copy"><strong>${item[1]}</strong><small>${item[2]}</small></span><span class="row-end">›</span></button>`;}

function render(){
  stopSpeech(false);
  if(state.route!=='car'){stopVoiceListening();state.detailedRead=false;}
  document.querySelectorAll('.bottom-nav button').forEach(b=>b.classList.toggle('active',b.dataset.route===state.route));
  view.classList.toggle('car-route-view',state.route==='car');
  view.classList.toggle('assistant-route-view',state.route==='assistant');
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

function openSheet(title,subtitle,html,renderer=null){ $('#sheetTitle').textContent=title; $('#sheetSubtitle').textContent=subtitle||''; sheetBody.innerHTML=html; activeSheetRenderer=renderer; sheet.classList.remove('sheet-no-header'); sheet.classList.add('open'); sheet.setAttribute('aria-hidden','false'); }
function closeSheet(){ sheet.classList.remove('open','sheet-no-header'); sheet.setAttribute('aria-hidden','true'); activeSheetRenderer=null; if(state.route==='feed')renderFeed(); if(state.route==='settings')renderSettings(); }
function openArticle(id){
  const a=articleById(id);
  if(!a)return;
  recordRead(id);
  const originalButton=a.url?`<button class="primary-button" data-original="${escapeHtml(a.id)}">Eredeti cikk megnyitása</button>`:'';
  openSheet('Hírrészlet',`${a.source} · ${a.time}`,`<article class="detail"><div class="detail-hero"><img src="${escapeHtml(a.image)}" alt="A hír illusztrációja"></div><div class="meta-line"><span>${escapeHtml(a.category)}</span><span class="meta-time">· ${escapeHtml(a.source)}</span></div><h1>${escapeHtml(a.title)}</h1><div class="detail-actions"><button data-detail-save="${escapeHtml(a.id)}">${state.saved.has(a.id)?'♥ Mentve':'♡ Mentés'}</button><button data-detail-share="${escapeHtml(a.id)}">↗ Megosztás</button><button data-unread="${escapeHtml(a.id)}">○ Olvasatlan</button></div><p class="detail-copy">${escapeHtml(a.body)}</p>${originalButton}</article>`);
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
      <span class="plan-copy"><span class="plan-title">Hírbeszéd Alap</span><span class="plan-price">1500 Ft <small>/ hó</small></span><span class="plan-description">Korlátlan rendszerhang, felolvasó és AI-asszisztens.</span><span class="plan-features">✓ Rendszerhangos felolvasás<br>✓ Hangvezérlés és személyre szabás<br>✓ Alap AI-hírasszisztens</span></span>
    </button>
    <button class="plan-card pro ${selected==='pro'?'selected':''}" data-plan="pro">
      <span class="popular-badge">AJÁNLOTT</span><span class="plan-check">${selected==='pro'?'✓':''}</span>
      <span class="plan-copy"><span class="plan-title">Hírbeszéd Pro</span><span class="plan-price">3500 Ft <small>/ hó</small></span><span class="plan-description">Természetes AI-hang és fejlettebb, beszélgetős asszisztens.</span><span class="plan-features">✓ Minden az Alap csomagból<br>✓ Havi 240 perc prémium AI-hang<br>✓ Ha elfogy, automatikus visszaváltás Alap rendszerhangra</span></span>
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
    return openSheet('A próbaidő lejárt','Válassz csomagot a folytatáshoz',`<section class="subscription-screen"><div class="expired-hero"><span class="expired-icon">Ⅱ</span><span class="subscription-kicker">A PRÓBA VÉGET ÉRT</span><h1>Tartsd mozgásban a hírfolyamot.</h1><p>A mentéseid és beállításaid megmaradtak. Előfizetés után azonnal folytathatod.</p></div><button class="price-action" data-subscribe="basic"><span><strong>Hírbeszéd Alap</strong><small>Rendszerhang és felolvasó</small></span><b>1500 Ft/hó</b></button><button class="price-action pro" data-subscribe="pro"><span><strong>Hírbeszéd Pro</strong><small>240 perc prémium AI-hang, utána Alap hang</small></span><b>3500 Ft/hó</b></button><button class="text-button" data-sub-action="restore">Vásárlás visszaállítása</button></section>`);
  }
  const isPro=sub.plan==='pro'; const percent=isPro?Math.min(100,Math.round((sub.aiMinutesUsed/sub.aiMinutesLimit)*100)):0;
  return openSheet('Előfizetés','Csomag és használat kezelése',`<section class="subscription-screen"><div class="membership-card ${isPro?'pro':''}"><div class="membership-top"><span class="subscription-kicker">${sub.status==='trial'?'PRÓBAIDŐ':'AKTÍV ELŐFIZETÉS'}</span><span class="status-pill">${sub.status==='trial'?`${sub.trialDays} nap`:'Aktív'}</span></div><h1>${planName(sub.plan)}</h1><p>${sub.status==='trial'?`A próba után ${planPrice(sub.plan)}/hó.`:`Következő megújítás: július 21.`}</p>${isPro?`<button class="usage-panel" data-sub-action="usage"><span><strong>Prémium AI-hang</strong><small>${sub.aiMinutesUsed} / ${sub.aiMinutesLimit} perc felhasználva</small></span><span>${sub.aiMinutesLimit-sub.aiMinutesUsed} perc</span><i><b style="width:${percent}%"></b></i></button>`:`<div class="basic-voice-note">A rendszerhangos felolvasás korlátlan. Hetente három híren kipróbálható a Pro hang.</div>`}</div><div class="settings-group subscription-actions"><button class="settings-row" data-sub-action="plans"><span class="row-icon">⇄</span><span class="row-copy"><strong>Csomagváltás</strong><small>Alap vagy Pro csomag választása</small></span><span class="row-end">›</span></button><button class="settings-row" data-sub-action="store-manage"><span class="row-icon">▣</span><span class="row-copy"><strong>Előfizetés kezelése</strong><small>Megújítás vagy lemondás az áruházban</small></span><span class="row-end">›</span></button><button class="settings-row" data-sub-action="restore"><span class="row-icon">↺</span><span class="row-copy"><strong>Vásárlás visszaállítása</strong><small>Másik készüléken vásárolt csomag</small></span><span class="row-end">›</span></button></div><button class="demo-link" data-sub-action="expire-demo">Prototípus: lejárt előfizetés</button><button class="demo-link" data-sub-action="payment-demo">Prototípus: sikertelen fizetés</button></section>`);
}
function usageSheet(){
  const sub=state.subscription; const remaining=Math.max(0,sub.aiMinutesLimit-sub.aiMinutesUsed);
  openSheet('Prémium AI-hang','Havi Pro hangkeret',`<section class="subscription-screen"><div class="minutes-ring" style="--usage:${Math.round((sub.aiMinutesUsed/sub.aiMinutesLimit)*360)}deg"><div><strong>${remaining}</strong><span>perc maradt</span></div></div><h2 class="center-title">Természetes AI-felolvasás</h2><p class="center-copy">A keret minden számlázási időszak elején újra 240 perc lesz. Ha elfogy, a hírek automatikusan a készülék rendszerhangján folytatódnak.</p><div class="settings-group"><div class="settings-row static-row"><span class="row-icon">▶</span><span class="row-copy"><strong>${sub.aiMinutesUsed} perc felhasználva</strong><small>Ebben a hónapban</small></span></div><div class="settings-row static-row"><span class="row-icon">↻</span><span class="row-copy"><strong>Július 21-én megújul</strong><small>Újabb 240 perc válik elérhetővé</small></span></div></div><button class="secondary-button" data-sub-action="subscription-home">Vissza az előfizetéshez</button></section>`);
}
function addSourceSheet(){
  const recommendations=['444','G7','Hírstart','Index','Népszava'];
  openSheet('Új RSS-forrás','Ajánlásból vagy RSS-linkkel',`<section class="source-add-screen"><h3 class="section-label">Ajánlott magyar források</h3><div class="settings-group">${recommendations.map(name=>`<button class="settings-row" data-recommended-source="${name}"><span class="row-icon">${name[0]}</span><span class="row-copy"><strong>${name}</strong><small>Ellenőrzött RSS-ajánlás</small></span><span class="row-end">＋</span></button>`).join('')}</div><h3 class="section-label">Hozzáadás RSS-linkkel</h3><form id="rssSourceForm" class="source-form"><label for="rssSourceUrl">RSS-csatorna címe</label><input id="rssSourceUrl" class="search-input" type="url" inputmode="url" placeholder="https://pelda.hu/rss" required><button class="primary-button" type="submit">RSS-forrás hozzáadása</button></form><button class="text-button" data-source-back>Vissza az RSS-forrásokhoz</button></section>`);
}
function topicSettingsSheet(){
  const topicButtons=topics.map(topic=>`<button class="chip ${topic.id==='fresh'||state.enabledTopics.includes(topic.id)?'active':''}" data-topic-toggle="${topic.id}">${topic.name}</button>`).join('');
  const topicRows=topics.map(topic=>{
    const active=topic.id==='fresh'||state.enabledTopics.includes(topic.id);
    return `<button class="settings-row topic-row ${topic.id==='fresh'?'fixed-topic':''}" data-topic-toggle="${topic.id}"><span class="row-icon">${topic.name[0]}</span><span class="row-copy"><strong>${topic.name}</strong><small>${topic.description}</small></span><span class="toggle ${active?'on':''}"></span></button>`;
  }).join('');
  openSheet('Témák és érdeklődés','A hírfolyam és a keresés témái',`<p class="settings-intro">A felső témasor oldalra görgethető. Kapcsold ki azokat a témákat, amelyeket nem szeretnél látni.</p><div class="chips topic-strip topic-settings-strip">${topicButtons}</div><div class="settings-group topic-settings-list">${topicRows}</div><div class="settings-group">${settingRow(['✦','Személyre szabott sorrend','Bekapcsolva','personal'])}${settingRow(['↺','Érdeklődési profil törlése','A mentések megmaradnak','reset-profile'])}</div>`);
}
function settingsSheet(type){
  if(type==='subscription') return subscriptionSheet();
  if(type==='appearance') return openSheet('Megjelenés','Téma és hozzáférhetőség',`<div class="theme-grid"><button class="theme-card ${state.theme==='light'?'active':''}" data-theme="light">Világos</button><button class="theme-card dark-preview ${state.theme==='dark'?'active':''}" data-theme="dark">Sötét</button><button class="theme-card system-preview ${state.theme==='system'?'active':''}" data-theme="system">Rendszer</button></div><div class="settings-group" style="margin-top:15px">${settingRow(['A','Betűméret','Rendszer szerint','font'])}${settingRow(['◌','Kontraszt növelése','Kikapcsolva','contrast'])}</div>`);
  if(type==='sources') return openSheet('RSS-források','Közvetlenül a készüléken',`<button class="primary-button" data-add-source>＋ Új RSS-forrás</button><div class="settings-group" style="margin-top:13px">${Object.entries(state.sources).map(([name,on])=>`<button class="settings-row" data-source="${name}"><span class="row-icon">${name[0]}</span><span class="row-copy"><strong>${name}</strong><small>${on?'Bekapcsolva':'Kikapcsolva'}</small></span><span class="toggle ${on?'on':''}"></span></button>`).join('')}</div>`);
  if(type==='topics') return topicSettingsSheet();
  if(type==='notifications') return openSheet('Értesítések','Helyi prototípus-beállítás',`<div class="settings-group"><button class="settings-row" data-toggle-setting="notifications"><span class="row-icon">!</span><span class="row-copy"><strong>Rendkívüli hírek</strong><small>${state.notifications?'Bekapcsolva':'Kikapcsolva'}</small></span><span class="toggle ${state.notifications?'on':''}"></span></button>${settingRow(['☀','Napi összefoglaló','Minden nap 07:30','digest'])}${settingRow(['☾','Csendes időszak','22:00–07:00','quiet'])}</div>`);
  if(type==='voice') return openSheet('Hang és felolvasó','Felolvasás és viselkedés',`<div class="settings-group">${settingRow(['A','Felolvasóhang','Magyar rendszerhang','voice-name'])}${settingRow(['↔','Beszédsebesség','1,0×','rate'])}<button class="settings-row" data-toggle-setting="autoNext"><span class="row-icon">⇥</span><span class="row-copy"><strong>Automatikus következő</strong><small>${state.autoNext?'Bekapcsolva':'Kikapcsolva'}</small></span><span class="toggle ${state.autoNext?'on':''}"></span></button></div>`);
  if(type==='data') return openSheet('Mobiladat és tárhely','Hálózati beállítások',`<div class="settings-group"><button class="settings-row" data-toggle-setting="mobileData"><span class="row-icon">⇅</span><span class="row-copy"><strong>RSS-frissítés mobilneten</strong><small>${state.mobileData?'Engedélyezve':'Csak Wi-Fi'}</small></span><span class="toggle ${state.mobileData?'on':''}"></span></button>${settingRow(['▧','Képek mobilneten','Engedélyezve','images'])}${settingRow(['⌫','Gyorsítótár törlése','A mentések megmaradnak','cache'])}</div>`);
  if(type==='location') return openSheet('Helyi hírek','Hozzávetőleges hely',`<div class="empty" style="padding-top:28px"><div class="empty-icon">⌖</div><h2>Helyi hírek a közeledből</h2><p>A prototípus nem kér valódi helyadatot.</p></div><button class="primary-button" data-toggle-setting="location">${state.location?'Helyi hírek kikapcsolása':'Budapest kiválasztása'}</button>`);
  if(type==='account') return openSheet('Fiók és biztonság','Prototípus',`<div class="settings-group">${settingRow(['♙','Profil','Anna · anna@pelda.hu','profile'])}${settingRow(['A','Kapcsolt fiókok','Apple, Google, Facebook','accounts'])}${settingRow(['✦','Kétlépcsős védelem','Nincs bekapcsolva','2fa'])}</div><button class="secondary-button" data-demo-reset>Prototípusadatok törlése</button>`);
  openSheet('Beállítás','Prototípus',`<div class="empty"><div class="empty-icon">⚙</div><h2>Ez a rész a prototípusban bemutató jellegű</h2></div>`);
}

document.addEventListener('click',event=>{
  const route=event.target.closest('[data-route]'); if(route){changeRoute(route.dataset.route);return;}
  const save=event.target.closest('[data-save]'); if(save){event.stopPropagation();toggleSaved(save.dataset.save); if(state.route==='feed')renderFeed();return;}
  const card=event.target.closest('[data-article]'); if(card){openArticle(card.dataset.article);return;}
  const sort=event.target.closest('[data-sort]'); if(sort){state.sort=sort.dataset.sort;renderFeed();saveState();return;}
  const category=event.target.closest('[data-category]'); if(category){state.category=category.dataset.category;renderFeed();saveState();return;}
  const action=event.target.closest('[data-action]'); if(action){const a=action.dataset.action;if(a==='close-sheet'){closeSheet();return;}if(a==='search')searchSheet();if(a==='library')librarySheet();if(a==='assistant-toggle')setAssistantMode(nextAssistantMode());if(a==='voice-demo')toast(state.assistantMode==='voice'?'Beszéd mód: mondd el a kérdésed':state.assistantMode==='text'?'Gépelés mód: a válasz felolvasva érkezik':'Néma mód: csak szöveges válasz');if(a==='car-more')openSheet('Hangutasítások','Felolvasó',`<div class="settings-group">${settingRow(['›','Következő','A következő hír indítása','cmd-next'])}${settingRow(['＋','Részletek','Hosszabb RSS-tartalom','cmd-detail'])}${settingRow(['♡','Mentés','Mentés későbbre','cmd-save'])}</div>`);return;}
  const car=event.target.closest('[data-car]'); if(car){
    const carAction=car.dataset.car;
    if(carAction==='mic'){
      const nextMic=!state.mic;
      transitionCarControl(car,!nextMic,()=>{state.mic=nextMic;clearCarMicWindow();toast(state.mic?(state.autoNext?'Mikrofon bekapcsolva: hír végén 3 mp':'Mikrofon bekapcsolva: hír végén nyitva marad'):'Mikrofon kikapcsolva');updateCarDom();saveState();});
      return;
    }
    if(carAction==='auto'){
      const wasOn=state.autoNext;
      const nextAuto=!state.autoNext;
      transitionCarControl(car,!nextAuto,()=>{state.autoNext=nextAuto;if(!state.autoNext)clearCarMicWindow();if(!wasOn&&state.autoNext){saveState();goToAdjacentArticle(1);return;}updateCarDom();saveState();});
      return;
    }
    if(carAction==='play'){toggleCarPlayback();saveState();return;}
    if(carAction==='prev'){goToAdjacentArticle(-1);return;}
    if(carAction==='next'){goToAdjacentArticle(1);return;}
    if(carAction==='details'){transitionCarControl(car,!state.detailedRead,()=>toggleDetailedRead());return;}
    if(carAction==='pro-preview'){state.subscription.proPreviewActive=true;saveState();document.querySelector('.pro-sample-card')?.remove();updateCarDom();toast('A következő 3 hírt Pro hanggal hallod');return;}
    saveState();return;
  }
  const mode=event.target.closest('[data-mode]'); if(mode){setAssistantMode(mode.dataset.mode);return;}
  const question=event.target.closest('[data-question]'); if(question){handleAssistantQuestion(question.dataset.question);return;}
  const setting=event.target.closest('[data-setting]'); if(setting){settingsSheet(setting.dataset.setting);return;}
  const plan=event.target.closest('[data-plan]'); if(plan){state.subscription.plan=plan.dataset.plan;saveState();subscriptionSheet('plans');return;}
  const subAction=event.target.closest('[data-sub-action]'); if(subAction){const action=subAction.dataset.subAction;if(action==='review'){subscriptionSheet('confirm');}if(action==='plans'){subscriptionSheet('plans');}if(action==='start-trial'){state.subscription.status='trial';state.subscription.trialDays=14;state.subscription.aiMinutesUsed=0;state.subscription.aiMinutesLimit=state.subscription.plan==='pro'?240:0;saveState();toast('A 14 napos próba elindult');subscriptionSheet();}if(action==='usage'){usageSheet();}if(action==='subscription-home'){subscriptionSheet();}if(action==='restore'){state.subscription.status='active';state.subscription.aiMinutesLimit=state.subscription.plan==='pro'?240:0;saveState();renderSubscriptionGate();toast('A vásárlást visszaállítottuk');subscriptionSheet();}if(action==='store-manage'){toast('Az alkalmazás-áruház előfizetési oldala nyílna meg');}if(action==='expire-demo'){state.subscription.status='expired';saveState();renderSubscriptionGate();}if(action==='payment-demo'){state.subscription.status='payment_failed';saveState();renderSubscriptionGate();}return;}
  const subscribe=event.target.closest('[data-subscribe]'); if(subscribe){state.subscription.plan=subscribe.dataset.subscribe;state.subscription.status='active';state.subscription.aiMinutesUsed=0;state.subscription.aiMinutesLimit=state.subscription.plan==='pro'?240:0;state.subscription.proPreviewAvailable=state.subscription.plan==='basic';state.subscription.proPreviewRemaining=3;state.subscription.proPreviewActive=false;saveState();changeRoute('car');toast(`${planName(state.subscription.plan)} aktiválva`);return;}
  const source=event.target.closest('[data-source]'); if(source){state.sources[source.dataset.source]=!state.sources[source.dataset.source];saveState();settingsSheet('sources');return;}
  const recommendedSource=event.target.closest('[data-recommended-source]'); if(recommendedSource){const name=recommendedSource.dataset.recommendedSource;state.sources[name]=true;saveState();settingsSheet('sources');toast(`${name} hozzáadva`);return;}
  const topicToggle=event.target.closest('[data-topic-toggle]'); if(topicToggle){const id=topicToggle.dataset.topicToggle;if(id==='fresh'){toast('A Friss összesítő mindig elérhető');return;}state.enabledTopics=state.enabledTopics.includes(id)?state.enabledTopics.filter(topicId=>topicId!==id):[...state.enabledTopics,id];if(state.category===id&&!state.enabledTopics.includes(id))state.category='fresh';saveState();topicSettingsSheet();return;}
  const lib=event.target.closest('[data-library]'); if(lib){librarySheet(lib.dataset.library);return;}
  const theme=event.target.closest('button[data-theme]'); if(theme){state.theme=theme.dataset.theme;applyTheme();saveState();settingsSheet('appearance');return;}
  const detailSave=event.target.closest('[data-detail-save]'); if(detailSave){toggleSaved(detailSave.dataset.detailSave);openArticle(detailSave.dataset.detailSave);return;}
  const unread=event.target.closest('[data-unread]'); if(unread){state.read.delete(unread.dataset.unread);saveState();toast('Olvasatlanra jelölve');return;}
  if(event.target.closest('[data-detail-share]')){toast('Megosztási párbeszéd helye');return;}
  const original=event.target.closest('[data-original]'); if(original){const article=articleById(original.dataset.original); if(article?.url)window.open(article.url,'_blank','noopener'); else toast('Ehhez a hírhez nincs eredeti link'); return;}
  const toggleSetting=event.target.closest('[data-toggle-setting]'); if(toggleSetting){const key=toggleSetting.dataset.toggleSetting;state[key]=!state[key];saveState();settingsSheet(key==='autoNext'?'voice':key==='mobileData'?'data':key==='location'?'location':'notifications');return;}
  if(event.target.closest('[data-add-source]')){addSourceSheet();return;}
  if(event.target.closest('[data-source-back]')){settingsSheet('sources');return;}
  if(event.target.closest('[data-demo-reset]')){localStorage.removeItem('hirbeszed-state');toast('Prototípusadatok törölve');setTimeout(()=>location.reload(),500);}
});

document.addEventListener('input',event=>{
  if(event.target.id==='searchInput'){const q=event.target.value.toLowerCase();$('#searchResults').innerHTML=articles.filter(a=>(a.title+' '+a.excerpt+' '+a.source+' '+a.category).toLowerCase().includes(q)).map(a=>articleCard(a,true)).join('')||`<div class="empty"><p>Nincs találat.</p></div>`;}
});
document.addEventListener('submit',event=>{
  if(event.target.id==='composer'){event.preventDefault();const input=$('#chatInput');if(input.value.trim()){handleAssistantQuestion(input.value.trim());input.value='';}}
  if(event.target.id==='rssSourceForm'){event.preventDefault();const input=$('#rssSourceUrl');try{const url=new URL(input.value.trim());const name=url.hostname.replace(/^www\./,'');state.sources[name]=true;saveState();settingsSheet('sources');toast(`${name} hozzáadva`);}catch{toast('Adj meg egy érvényes RSS-linket');}}
});
function appendChat(question){handleAssistantQuestion(question);}

$('#sheetBack').addEventListener('click',event=>{event.preventDefault();event.stopPropagation();closeSheet();});
document.addEventListener('keydown',event=>{if(event.key==='Escape'&&sheet.classList.contains('open'))closeSheet();});
matchMedia('(prefers-color-scheme: dark)').addEventListener?.('change',()=>{if(state.theme==='system')applyTheme();});
async function startApp(){
  applyTheme();
  await loadNewsArticles();
  await loadAssistantPromptProvider();
  if(state.route==='assistant'&&!state.assistantChat.length)prepareAssistantVoiceOpening();
  render();
  activateRouteAudio(state.route);
}
startApp();
if('serviceWorker' in navigator && location.protocol.startsWith('http')) navigator.serviceWorker.register('./sw.js').catch(()=>{});
