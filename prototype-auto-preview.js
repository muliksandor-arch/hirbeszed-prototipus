(function(){
  if(window.__hirbeszedAutoDisplayPreviewLoaded)return;
  window.__hirbeszedAutoDisplayPreviewLoaded=true;

  function ensureAutoPreviewStyle(){
    if(document.getElementById('autoDisplayPreviewStyle'))return;
    var style=document.createElement('style');
    style.id='autoDisplayPreviewStyle';
    style.textContent=[
      '.auto-display-entry{border-color:color-mix(in srgb,var(--accent) 38%,var(--border))!important}',
      '.auto-preview-tabs{display:grid;grid-template-columns:1fr 1fr;gap:6px;background:var(--surface-2);border-radius:16px;padding:4px;margin-bottom:14px}',
      '.auto-preview-tabs button{height:38px;border:0;border-radius:12px;background:transparent;color:var(--muted);font-size:12px;font-weight:800}',
      '.auto-preview-tabs button.active{background:var(--surface);color:var(--text);box-shadow:0 2px 9px rgba(0,0,0,.10)}',
      '.auto-preview-frame{aspect-ratio:16/9;border-radius:22px;overflow:hidden;border:1px solid var(--border);background:#070B0E;color:#F7FAFA;box-shadow:0 16px 34px rgba(0,0,0,.24);margin-bottom:14px}',
      '.auto-preview-frame button{font:inherit}',
      '.auto-aa{height:100%;display:grid;grid-template-columns:44px 1fr 104px;gap:10px;padding:12px;background:linear-gradient(145deg,#071015,#111820)}',
      '.auto-rail{display:grid;align-content:space-between;justify-items:center;border-radius:17px;background:#0F171D;padding:8px 0;color:#98F0D7;font-weight:900}',
      '.auto-rail span{display:grid;place-items:center;width:27px;height:27px;border-radius:10px;background:#17232B;color:#DDFBF3;font-size:13px}',
      '.auto-main{min-width:0;display:flex;flex-direction:column;gap:8px}',
      '.auto-platform-label{font-size:9px;letter-spacing:.8px;text-transform:uppercase;color:#7DE5CD;font-weight:900}',
      '.auto-main h3{font-size:19px;line-height:22px;margin:0;letter-spacing:0;color:#fff}',
      '.auto-main small,.auto-side small,.auto-card small{display:block;color:#9BAFB5;font-size:9px;line-height:12px}',
      '.auto-action-row{display:grid;grid-template-columns:repeat(3,1fr);gap:7px;margin-top:auto}',
      '.auto-action-row button{height:34px;border:1px solid rgba(255,255,255,.14);border-radius:13px;background:#15252E;color:#F7FAFA;font-size:15px;font-weight:900}',
      '.auto-side{display:grid;gap:7px}',
      '.auto-side div{border-radius:14px;background:#101A21;border:1px solid rgba(255,255,255,.08);padding:8px;font-size:10px;font-weight:800;line-height:13px}',
      '.auto-cp{height:100%;display:grid;grid-template-columns:44px 1fr;gap:10px;padding:12px;background:linear-gradient(145deg,#050608,#171A21 58%,#101521)}',
      '.auto-dock{display:grid;align-content:space-between;justify-items:center;border-radius:18px;background:rgba(255,255,255,.08);padding:8px 0;color:#fff}',
      '.auto-dock span{display:grid;place-items:center;width:28px;height:28px;border-radius:10px;background:rgba(255,255,255,.12);font-size:12px;font-weight:900}',
      '.auto-cp-grid{display:grid;grid-template-columns:1.2fr .8fr;gap:10px;min-width:0}',
      '.auto-card{border-radius:19px;background:rgba(255,255,255,.10);border:1px solid rgba(255,255,255,.12);padding:12px;min-width:0}',
      '.auto-card.now{display:flex;flex-direction:column;gap:8px;background:linear-gradient(145deg,rgba(83,184,170,.28),rgba(255,255,255,.10))}',
      '.auto-card h3{font-size:18px;line-height:21px;margin:0;letter-spacing:0;color:#fff}',
      '.auto-cp-controls{display:flex;gap:8px;margin-top:auto}',
      '.auto-cp-controls button{width:36px;height:36px;border:0;border-radius:50%;background:#F7FAFA;color:#111820;font-size:15px;font-weight:900}',
      '.auto-stack{display:grid;gap:9px}',
      '.auto-note{font-size:11px;line-height:16px;color:var(--muted);margin:0 3px 13px}',
      '.auto-diff-list{display:grid;gap:8px}',
      '.auto-diff-list .settings-row{cursor:default}',
      '@media(max-width:390px){.auto-aa{grid-template-columns:38px 1fr}.auto-side{display:none}.auto-cp-grid{grid-template-columns:1fr}.auto-stack{display:none}.auto-main h3,.auto-card h3{font-size:16px;line-height:19px}}'
    ].join('');
    document.head.appendChild(style);
  }

  function escapeHtml(value){
    return String(value||'').replace(/[&<>"']/g,function(char){
      return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'}[char];
    });
  }

  function previewArticle(){
    try{
      if(typeof currentCarArticle==='function')return currentCarArticle();
    }catch(error){}
    try{
      if(Array.isArray(articles)&&articles.length)return articles[0];
    }catch(error){}
    return {title:'Megnyílt a nyári kulturális programsorozat',source:'Hírbeszéd',time:'2 órája',category:'Friss'};
  }

  function androidAutoPreview(article){
    return '<div class="auto-preview-frame"><div class="auto-aa">'+
      '<div class="auto-rail"><span>H</span><span>▶</span><span>☰</span></div>'+
      '<div class="auto-main"><div><div class="auto-platform-label">Android Auto</div><small>Hírbeszéd · '+escapeHtml(article.source)+'</small></div>'+
      '<h3>'+escapeHtml(article.title)+'</h3><small>'+escapeHtml(article.category)+' · '+escapeHtml(article.time)+' · felolvasásra kész</small>'+
      '<div class="auto-action-row"><button type="button">▶</button><button type="button">›</button><button type="button">♡</button></div></div>'+
      '<div class="auto-side"><div>Most szól<small>rövid hírösszefoglaló</small></div><div>Következő<small>friss hírek listája</small></div><div>Hang<small>következő, mentés, állj</small></div></div>'+
      '</div></div>';
  }

  function carPlayPreview(article){
    return '<div class="auto-preview-frame"><div class="auto-cp">'+
      '<div class="auto-dock"><span>9:41</span><span>H</span><span>◉</span></div>'+
      '<div class="auto-cp-grid"><div class="auto-card now"><div><div class="auto-platform-label">Apple CarPlay</div><small>Hírbeszéd · '+escapeHtml(article.source)+'</small></div>'+
      '<h3>'+escapeHtml(article.title)+'</h3><small>'+escapeHtml(article.category)+' · '+escapeHtml(article.time)+'</small>'+
      '<div class="auto-cp-controls"><button type="button">‹</button><button type="button">▶</button><button type="button">›</button></div></div>'+
      '<div class="auto-stack"><div class="auto-card"><strong>Mentés</strong><small>későbbre</small></div><div class="auto-card"><strong>Források</strong><small>mobilon kezelve</small></div></div></div>'+
      '</div></div>';
  }

  function differenceRows(){
    return '<div class="settings-group auto-diff-list">'+
      '<div class="settings-row static-row"><span class="row-icon">A</span><span class="row-copy"><strong>Android Auto</strong><small>Material jellegű, Google Assistant-központú sablonok</small></span></div>'+
      '<div class="settings-row static-row"><span class="row-icon">C</span><span class="row-copy"><strong>CarPlay</strong><small>Apple sablonok, eltérő navigáció és vezérlők</small></span></div>'+
      '<div class="settings-row static-row"><span class="row-icon">=</span><span class="row-copy"><strong>Közös terméklogika</strong><small>hír felolvasása, következő, mentés, hangutasítás</small></span></div>'+
      '</div>';
  }

  function showAutoDisplayPreview(platform){
    ensureAutoPreviewStyle();
    var selected=platform==='carplay'?'carplay':'android';
    var article=previewArticle();
    var preview=selected==='carplay'?carPlayPreview(article):androidAutoPreview(article);
    if(typeof openSheet!=='function')return;
    openSheet('CarPlay / Android Auto','Ideiglenes autós kijelző nézet',
      '<section class="auto-display-preview-screen">'+
      '<div class="auto-preview-tabs"><button type="button" class="'+(selected==='android'?'active':'')+'" data-auto-platform="android">Android Auto</button><button type="button" class="'+(selected==='carplay'?'active':'')+'" data-auto-platform="carplay">CarPlay</button></div>'+
      preview+
      '<p class="auto-note">A két platform külön natív sablonrendszert használ, ezért a végleges felületet külön kell majd megtervezni és implementálni. A hírlogika közös maradhat.</p>'+
      differenceRows()+
      '</section>');
  }

  function settingsPreviewRow(){
    return '<div class="settings-group auto-display-entry"><button class="settings-row" data-auto-display-preview><span class="row-icon">▰</span><span class="row-copy"><strong>CarPlay / Android Auto nézet</strong><small>Ideiglenes autós kijelző előnézet</small></span><span class="row-end">›</span></button></div>';
  }

  function addSettingsEntry(){
    var view=document.getElementById('view');
    var pageTitle=document.getElementById('pageTitle');
    if(!view||!pageTitle||pageTitle.textContent.trim()!=='Beállítások')return;
    if(view.querySelector('[data-auto-display-preview]'))return;
    view.insertAdjacentHTML('afterbegin',settingsPreviewRow());
  }

  function patchRenderSettings(){
    if(typeof renderSettings!=='function'||renderSettings.__autoDisplayPreviewPatch)return;
    var previousRenderSettings=renderSettings;
    renderSettings=function(){
      var result=previousRenderSettings.apply(this,arguments);
      addSettingsEntry();
      return result;
    };
    renderSettings.__autoDisplayPreviewPatch=true;
  }

  ensureAutoPreviewStyle();
  patchRenderSettings();
  addSettingsEntry();

  document.addEventListener('click',function(event){
    var open=event.target.closest('[data-auto-display-preview]');
    if(open){
      event.preventDefault();
      event.stopImmediatePropagation();
      showAutoDisplayPreview('android');
      return;
    }
    var platform=event.target.closest('[data-auto-platform]');
    if(platform&&document.querySelector('.auto-display-preview-screen')){
      event.preventDefault();
      event.stopImmediatePropagation();
      showAutoDisplayPreview(platform.dataset.autoPlatform);
    }
  },true);
})();
