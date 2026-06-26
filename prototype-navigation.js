(function(){
  if(window.__hirbeszedNavigationLoaded)return;
  window.__hirbeszedNavigationLoaded=true;

  function normalizeCopy(value){
    if(typeof value!=='string')return value;
    return value
      .replace(/Hang és autós mód/g,'Hang és felolvasó')
      .replace(/Autós mód/g,'Felolvasó')
      .replace(/autós mód/g,'felolvasó')
      .replace(/autós felolvasás/g,'felolvasás')
      .replace(/Rendszerhang és autós mód/g,'Rendszerhang és felolvasó');
  }

  function ensureReaderNavStyle(){
    if(document.getElementById('prototypeNavigationStyle'))return;
    var style=document.createElement('style');
    style.id='prototypeNavigationStyle';
    style.textContent=[
      '.bottom-nav{overflow:hidden;grid-template-columns:repeat(4,minmax(0,1fr));align-items:stretch;padding:0 6px var(--safe-bottom)!important}',
      '.bottom-nav button{position:relative;width:100%;min-width:0;height:100%;min-height:0;overflow:visible;outline:0!important;display:grid!important;grid-template-rows:36px 18px;place-items:center;align-content:center;justify-items:center;gap:1px;padding:5px 0 8px;text-align:center;transition:color .18s ease,background .18s ease}',
      '.bottom-nav button:focus,.bottom-nav button:focus-visible{outline:0!important;box-shadow:none!important}',
      '.bottom-nav button:before{content:"";position:absolute;left:50%;top:29px;width:74px;height:46px;border-radius:999px;background:radial-gradient(ellipse at center,color-mix(in srgb,var(--accent) 24%,transparent) 0%,color-mix(in srgb,var(--accent) 10%,transparent) 46%,transparent 100%);box-shadow:none;filter:blur(8px);transform:translate(-50%,-50%);opacity:0;transition:opacity .18s ease;pointer-events:none}',
      '.bottom-nav button:hover:before,.bottom-nav button:focus-visible:before,.bottom-nav button.active:before{opacity:1}',
      '.bottom-nav button:after{content:"";position:absolute;left:50%;bottom:4px;width:0;height:5px;border-radius:999px;background:var(--coral);box-shadow:0 2px 9px color-mix(in srgb,var(--coral) 46%,transparent);transform:translateX(-50%);transition:width .18s ease,opacity .18s ease;opacity:.92;pointer-events:none}',
      '.bottom-nav button.active:after{width:48px}',
      '.bottom-nav button>*{position:relative;z-index:1}',
      '.bottom-nav button.active{color:var(--text)}',
      '.bottom-nav .nav-label{grid-row:2;display:block;width:100%;max-width:100%;font-size:11px;line-height:1.05;letter-spacing:0;text-align:center;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}',
      '.nav-icon{grid-row:1;display:grid;place-items:center;width:44px;height:32px;margin:0 auto;font-size:0;line-height:1;color:color-mix(in srgb,var(--accent) 56%,var(--muted));pointer-events:none;transform:none!important}',
      '.nav-icon svg{width:44px;height:32px;display:block;overflow:visible;pointer-events:none}',
      '.nav-icon *{pointer-events:none}',
      '.bottom-nav button.active .nav-icon{color:var(--accent)}',
      '.nav-feed .feed-line,.nav-reader .reader-line,.nav-assistant .person-line,.nav-settings .gear-line{fill:none;stroke:currentColor;stroke-linecap:round;stroke-linejoin:round}',
      '.nav-feed .feed-line{stroke-width:3.5}',
      '.nav-reader .reader-line{stroke-width:3.6}',
      '.nav-feed .feed-accent,.nav-reader .reader-accent,.nav-assistant .person-accent,.nav-settings .gear-core{fill:none;stroke:color-mix(in srgb,var(--coral) 46%,var(--muted));stroke-linecap:round;stroke-linejoin:round}',
      '.nav-feed .feed-accent{stroke-width:3.5}',
      '.nav-reader .reader-accent{stroke-width:3.6}',
      '.nav-assistant .person-line{stroke-width:3.5}',
      '.nav-assistant .person-accent{stroke-width:3.5;opacity:.86}',
      '.nav-settings .gear-line{stroke-width:3.2}',
      '.nav-settings .gear-core{stroke-width:3.2}',
      '.bottom-nav button.active .nav-feed .feed-line,.bottom-nav button.active .nav-reader .reader-line{stroke:var(--accent)}',
      '.bottom-nav button.active .nav-feed .feed-accent,.bottom-nav button.active .nav-reader .reader-accent,.bottom-nav button.active .nav-assistant .person-accent{stroke:var(--coral);opacity:1}',
      '.bottom-nav button.active .nav-settings .gear-core{stroke:var(--coral)}',
      '[data-theme="dark"] .nav-icon{color:color-mix(in srgb,var(--accent) 72%,var(--muted))}',
      '[data-theme="dark"] .bottom-nav button:before{background:radial-gradient(ellipse at center,rgba(120,205,198,.20) 0%,rgba(120,205,198,.09) 46%,rgba(120,205,198,0) 100%);box-shadow:none}',
      '[data-theme="dark"] .bottom-nav button.active .nav-icon{color:color-mix(in srgb,var(--accent) 92%,#fff)}',
      '[data-theme="dark"] .bottom-nav button.active .nav-feed .feed-line{stroke:var(--accent)}',
      '[data-theme="dark"] .bottom-nav button.active .nav-feed .feed-accent{stroke:var(--coral)}',
      '[data-theme="dark"] .bottom-nav button.active .nav-reader .reader-line{stroke:var(--accent)}',
      '[data-theme="dark"] .bottom-nav button.active .nav-reader .reader-accent{stroke:var(--coral)}',
      '[data-theme="dark"] .bottom-nav button.active .nav-settings .gear-core{stroke:var(--coral)}',
      '[data-theme="light"] .bottom-nav button:before{background:radial-gradient(ellipse at center,color-mix(in srgb,var(--accent) 16%,transparent) 0%,color-mix(in srgb,var(--accent) 7%,transparent) 46%,transparent 100%);box-shadow:none}'
    ].join('');
    document.head.appendChild(style);
  }

  function iconSvg(type){
    if(type==='feed'){
      return '<svg class="nav-svg nav-feed" viewBox="0 0 48 48" preserveAspectRatio="xMidYMid meet" aria-hidden="true" focusable="false">'+
        '<g class="icon-grid">'+
          '<path class="feed-line" d="M12 13H36"></path>'+
          '<path class="feed-accent" d="M12 20.5H36"></path>'+
          '<path class="feed-line" d="M12 28H36"></path>'+
          '<path class="feed-line" d="M12 35.5H36"></path>'+
        '</g>'+
      '</svg>';
    }
    if(type==='reader'){
      return '<svg class="nav-svg nav-reader" viewBox="0 0 48 48" preserveAspectRatio="xMidYMid meet" aria-hidden="true" focusable="false">'+
        '<g class="icon-grid">'+
          '<path class="reader-line" d="M7.5 21V32"></path>'+
          '<path class="reader-accent" d="M13 12V39"></path>'+
          '<path class="reader-line" d="M18.5 16V35"></path>'+
          '<path class="reader-line" d="M24 8V42"></path>'+
          '<path class="reader-accent" d="M29.5 15V35.5"></path>'+
          '<path class="reader-accent" d="M35 12V39"></path>'+
          '<path class="reader-line" d="M40.5 21V32"></path>'+
        '</g>'+
      '</svg>';
    }
    if(type==='assistant'){
      return '<svg class="nav-svg nav-assistant" viewBox="0 0 48 48" preserveAspectRatio="xMidYMid meet" aria-hidden="true" focusable="false">'+
        '<g class="icon-grid">'+
          '<circle class="person-line" cx="24" cy="14" r="7"></circle>'+
          '<path class="person-line" d="M13.5 40V31.5c0-5.2 4.2-8.8 9.4-8.8h2.2c5.2 0 9.4 3.6 9.4 8.8V40"></path>'+
          '<path class="person-accent" d="M24 32V39"></path>'+
        '</g>'+
      '</svg>';
    }
    return '<svg class="nav-svg nav-settings" viewBox="0 0 48 48" preserveAspectRatio="xMidYMid meet" aria-hidden="true" focusable="false">'+
      '<g class="icon-grid">'+
        '<path class="gear-line" d="M24 5.5l3.2.7 1.2 4.4c1 .3 2 .7 2.9 1.2l4-2 2.7 2.7-2 4c.5.9.9 1.9 1.2 2.9l4.4 1.2.7 3.4-.7 3.4-4.4 1.2c-.3 1-.7 2-1.2 2.9l2 4-2.7 2.7-4-2c-.9.5-1.9.9-2.9 1.2l-1.2 4.4-3.2.7-3.2-.7-1.2-4.4c-1-.3-2-.7-2.9-1.2l-4 2-2.7-2.7 2-4c-.5-.9-.9-1.9-1.2-2.9l-4.4-1.2-.7-3.4.7-3.4 4.4-1.2c.3-1 .7-2 1.2-2.9l-2-4 2.7-2.7 4 2c.9-.5 1.9-.9 2.9-1.2l1.2-4.4 3.2-.7Z"></path>'+
        '<circle class="gear-core" cx="24" cy="24" r="5.2"></circle>'+
      '</g>'+
    '</svg>';
  }

  function setNavButton(button,type,label){
    if(!button)return;
    if(button.getAttribute('aria-label')!==label)button.setAttribute('aria-label',label);
    var icon=button.querySelector('.nav-icon');
    var text=button.querySelector('.nav-label');
    var spans=button.querySelectorAll('span');
    if(!icon){
      icon=document.createElement('span');
      icon.className='nav-icon';
      button.insertBefore(icon,button.firstChild);
    }
    if(!text){
      text=spans[1]||document.createElement('span');
      text.className='nav-label';
      if(!text.parentNode)button.appendChild(text);
    }
    if(icon.dataset.navIcon!==type)icon.dataset.navIcon=type;
    var nextIcon=iconSvg(type);
    if(icon.innerHTML!==nextIcon)icon.innerHTML=nextIcon;
    if(text.textContent!==label)text.textContent=label;
  }

  function syncReaderNav(){
    ensureReaderNavStyle();
    setNavButton(document.querySelector('.bottom-nav [data-route="feed"]'),'feed','Hírfolyam');
    setNavButton(document.querySelector('.bottom-nav [data-route="car"]'),'reader','Felolvasó');
    setNavButton(document.querySelector('.bottom-nav [data-route="assistant"]'),'assistant','Asszisztens');
    setNavButton(document.querySelector('.bottom-nav [data-route="settings"]'),'settings','Beállítások');
    var title=document.getElementById('pageTitle');
    if(title)title.textContent=normalizeCopy(title.textContent);
  }

  function replaceTextNodes(root){
    if(!root||!document.createTreeWalker)return;
    var walker=document.createTreeWalker(root,NodeFilter.SHOW_TEXT);
    var nodes=[];
    while(walker.nextNode())nodes.push(walker.currentNode);
    nodes.forEach(function(node){
      var next=normalizeCopy(node.nodeValue);
      if(next!==node.nodeValue)node.nodeValue=next;
    });
  }

  function patchFunctions(){
    if(typeof setHeader==='function'&&!setHeader.__readerModePatch){
      var previousSetHeader=setHeader;
      setHeader=function(title,actions){
        var result=previousSetHeader.call(this,normalizeCopy(title),actions);
        syncReaderNav();
        return result;
      };
      setHeader.__readerModePatch=true;
    }
    if(typeof openSheet==='function'&&!openSheet.__readerModePatch){
      var previousOpenSheet=openSheet;
      openSheet=function(title,subtitle,html,renderer){
        return previousOpenSheet.call(this,normalizeCopy(title),normalizeCopy(subtitle),normalizeCopy(html),renderer);
      };
      openSheet.__readerModePatch=true;
    }
    if(typeof settingsItems==='function'&&!settingsItems.__readerModePatch){
      var previousSettingsItems=settingsItems;
      settingsItems=function(){
        return previousSettingsItems.apply(this,arguments).map(function(item){
          return [item[0],normalizeCopy(item[1]),normalizeCopy(item[2]),item[3]];
        });
      };
      settingsItems.__readerModePatch=true;
    }
  }

  var scheduled=false;
  function scheduleSync(){
    if(scheduled)return;
    scheduled=true;
    (window.requestAnimationFrame||setTimeout)(function(){
      scheduled=false;
      syncReaderNav();
      replaceTextNodes(document.body);
    },0);
  }

  patchFunctions();
  syncReaderNav();
  replaceTextNodes(document.body);
  document.addEventListener('DOMContentLoaded',function(){
    patchFunctions();
    scheduleSync();
  });
  window.addEventListener('load',scheduleSync);
  if(window.MutationObserver){
    new MutationObserver(scheduleSync).observe(document.body,{subtree:true,childList:true,characterData:true});
  }
})();
