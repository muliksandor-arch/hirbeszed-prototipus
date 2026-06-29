(function(){
  if(window.__hirbeszedButtonLayoutFixLoaded)return;
  window.__hirbeszedButtonLayoutFixLoaded=true;

  function ensureButtonLayoutFix(){
    var style=document.getElementById('buttonLayoutFixStyle');
    if(!style){
      style=document.createElement('style');
      style.id='buttonLayoutFixStyle';
      document.head.appendChild(style);
    }
    style.textContent=[
      '.provider-list,.auth-actions{width:100%!important;max-width:none!important;margin-left:0!important;margin-right:0!important;display:grid!important;gap:10px!important}',
      '.provider-list .auth-social,.auth-actions button,.welcome-screen>.primary-button,.welcome-screen>.secondary-button,.auth-screen>.primary-button,.auth-screen>.secondary-button,.auth-screen>.text-button{width:100%!important;max-width:none!important;margin-left:0!important;margin-right:0!important}',
      '.auth-social{display:flex!important;align-items:center!important;justify-content:center!important;text-align:center!important}',
      '@media (min-width:700px) and (hover:hover) and (pointer:fine){body{padding:22px 0!important;overflow:auto!important}.prototype-frame{position:relative!important;width:430px!important;height:min(860px,calc(100dvh - 44px))!important;min-width:320px!important;min-height:560px!important;max-width:min(96vw,900px)!important;max-height:calc(100dvh - 44px)!important;display:flex!important;flex-direction:column!important;resize:both!important;overflow:auto!important;border:1px solid rgba(17,39,45,.16)!important;border-radius:30px!important;background:var(--bg)!important;box-shadow:var(--shadow)!important}.prototype-frame:after{content:""!important;position:absolute!important;right:7px!important;bottom:7px!important;width:18px!important;height:18px!important;border-right:3px solid color-mix(in srgb,var(--accent) 58%,var(--border))!important;border-bottom:3px solid color-mix(in srgb,var(--accent) 58%,var(--border))!important;border-radius:0 0 5px 0!important;pointer-events:none!important;opacity:.78!important}.prototype-resize-grip{position:absolute!important;right:0!important;bottom:0!important;width:36px!important;height:36px!important;z-index:95!important;cursor:nwse-resize!important;touch-action:none!important;background:linear-gradient(135deg,transparent 0 45%,color-mix(in srgb,var(--accent) 13%,transparent) 45% 100%)!important;border-radius:0 0 28px 0!important}.prototype-reset-frame{position:fixed!important;width:34px!important;height:34px!important;border:1px solid color-mix(in srgb,var(--accent) 32%,var(--border))!important;border-radius:50%!important;background:var(--surface)!important;color:var(--accent)!important;box-shadow:0 8px 22px rgba(17,39,45,.14)!important;font-size:18px!important;font-weight:900!important;line-height:1!important;display:grid!important;place-items:center!important;z-index:100!important;cursor:pointer!important}.prototype-viewport-toolbar{position:fixed!important;width:124px!important;display:grid!important;gap:6px!important;z-index:100!important}.prototype-viewport-toolbar button{width:100%!important;border:1px solid color-mix(in srgb,var(--accent) 24%,var(--border))!important;border-radius:14px!important;background:color-mix(in srgb,var(--surface) 94%,transparent)!important;color:var(--text)!important;box-shadow:0 8px 22px rgba(17,39,45,.12)!important;padding:7px 8px!important;text-align:left!important;display:grid!important;gap:2px!important;cursor:pointer!important}.prototype-viewport-toolbar button span{font-size:11px!important;line-height:13px!important;font-weight:850!important}.prototype-viewport-toolbar button small{font-size:9px!important;line-height:11px!important;color:var(--muted)!important}.prototype-viewport-toolbar button.active{border-color:var(--coral)!important;color:var(--coral)!important;background:color-mix(in srgb,var(--coral) 8%,var(--surface))!important}.prototype-note{display:none!important}.phone-shell{width:100%!important;max-width:none!important;height:100%!important;min-height:0!important;margin:0!important;border-radius:30px!important;box-shadow:none!important}.phone-shell:before{content:""!important;display:block!important;position:absolute!important;inset:0!important;border:1px solid rgba(17,39,45,.12)!important;border-radius:30px!important;pointer-events:none!important;z-index:40!important}.view{height:calc(100% - 76px - 72px - var(--safe-top) - var(--safe-bottom))!important}}'
    ].join('');
  }

  function isDesktopPreview(){
    return window.matchMedia&&window.matchMedia('(min-width:700px) and (hover:hover) and (pointer:fine)').matches;
  }

  var VIEWPORT_PRESETS=[
    {id:'base',label:'Alap',size:'430 x 860',width:null,height:null},
    {id:'small-mobile',label:'Kis mobil',size:'375 x 667',width:375,height:667},
    {id:'large-mobile',label:'Nagy mobil',size:'430 x 932',width:430,height:932},
    {id:'mobile-landscape',label:'Mobil fekvo',size:'844 x 390',width:844,height:390},
    {id:'small-mobile-landscape',label:'Kis fekvo',size:'740 x 360',width:740,height:360},
    {id:'foldable',label:'Foldable',size:'692 x 717',width:692,height:717},
    {id:'tablet-portrait',label:'Tablet allo',size:'820 x 1180',width:820,height:1180},
    {id:'large-tablet-portrait',label:'Nagy tablet allo',size:'1024 x 1366',width:1024,height:1366},
    {id:'tablet-landscape',label:'Tablet fekvo',size:'1180 x 820',width:1180,height:820},
    {id:'large-tablet-landscape',label:'Nagy tablet fekvo',size:'1366 x 1024',width:1366,height:1024}
  ];

  function frameViewportRect(){
    var frame=document.querySelector('.prototype-frame');
    if(frame)return frame.getBoundingClientRect();
    var width=window.visualViewport&&window.visualViewport.width||window.innerWidth;
    var height=window.visualViewport&&window.visualViewport.height||window.innerHeight;
    return {width:width,height:height};
  }

  function isMobileLandscapeViewport(rect){
    if(!rect)return false;
    var width=Math.round(rect.width);
    var height=Math.round(rect.height);
    return width>=640&&height<=480&&width>height*1.35;
  }

  function isTabletLandscapeViewport(rect){
    if(!rect)return false;
    var width=Math.round(rect.width);
    var height=Math.round(rect.height);
    return width>=900&&height>=600&&width>height*1.15;
  }

  function applyFeedBoxClasses(feedSmallBox){
    document.querySelectorAll('.view.feed-route-view .news-card').forEach(function(card){
      card.classList.toggle('compact-card',feedSmallBox);
      card.classList.toggle('news-box-small',feedSmallBox);
      card.classList.toggle('news-box-large',!feedSmallBox);
    });
  }

  function syncResponsivePreviewMode(){
    var frame=document.querySelector('.prototype-frame');
    var phone=document.querySelector('.phone-shell');
    var rect=frameViewportRect();
    var width=Math.round(rect.width);
    var height=Math.round(rect.height);
    var mobileLandscape=isMobileLandscapeViewport(rect);
    var tabletLandscape=isTabletLandscapeViewport(rect);
    var smallPortrait=width<=390&&height<=760&&width<height;
    var feedSmallBox=smallPortrait||mobileLandscape;
    var feedThreeColumn=!feedSmallBox&&width>=1000;
    var feedTwoColumn=!feedSmallBox&&width>=680&&!feedThreeColumn;
    var sideNavMode=width>=680&&height>=600;
    if(frame)frame.classList.toggle('is-mobile-landscape',mobileLandscape);
    if(phone)phone.classList.toggle('is-mobile-landscape',mobileLandscape);
    document.documentElement.classList.toggle('is-mobile-landscape',mobileLandscape);
    if(frame)frame.classList.toggle('is-tablet-landscape',tabletLandscape);
    if(phone)phone.classList.toggle('is-tablet-landscape',tabletLandscape);
    document.documentElement.classList.toggle('is-tablet-landscape',tabletLandscape);
    if(frame){
      frame.classList.toggle('is-feed-smallbox',feedSmallBox);
      frame.classList.toggle('is-feed-largebox',!feedSmallBox);
      frame.classList.toggle('is-feed-two-column',feedTwoColumn);
      frame.classList.toggle('is-feed-three-column',feedThreeColumn);
    }
    if(phone){
      phone.classList.toggle('is-feed-smallbox',feedSmallBox);
      phone.classList.toggle('is-feed-largebox',!feedSmallBox);
      phone.classList.toggle('is-feed-two-column',feedTwoColumn);
      phone.classList.toggle('is-feed-three-column',feedThreeColumn);
    }
    document.documentElement.classList.toggle('is-feed-smallbox',feedSmallBox);
    document.documentElement.classList.toggle('is-feed-largebox',!feedSmallBox);
    document.documentElement.classList.toggle('is-feed-two-column',feedTwoColumn);
    document.documentElement.classList.toggle('is-feed-three-column',feedThreeColumn);
    if(frame)frame.classList.toggle('is-side-nav',sideNavMode);
    if(phone)phone.classList.toggle('is-side-nav',sideNavMode);
    document.documentElement.classList.toggle('is-side-nav',sideNavMode);
    applyFeedBoxClasses(feedSmallBox);
  }

  function ensureResizableFrame(){
    var frame=document.querySelector('.prototype-frame');
    if(!frame)return;
    var grip=frame.querySelector('.prototype-resize-grip');
    var reset=document.querySelector('.prototype-reset-frame');
    var toolbar=document.querySelector('.prototype-viewport-toolbar');
    if(!isDesktopPreview()){
      if(grip)grip.remove();
      if(reset)reset.remove();
      if(toolbar)toolbar.remove();
      frame.style.removeProperty('width');
      frame.style.removeProperty('height');
      frame.style.removeProperty('min-width');
      frame.style.removeProperty('min-height');
      frame.style.removeProperty('max-width');
      frame.style.removeProperty('max-height');
      frame.removeAttribute('data-preview-preset');
      syncResponsivePreviewMode();
      return;
    }
    if(!grip){
      grip=document.createElement('div');
      grip.className='prototype-resize-grip';
      grip.setAttribute('aria-hidden','true');
      frame.appendChild(grip);
    }
    if(!reset){
      reset=document.createElement('button');
      reset.className='prototype-reset-frame';
      reset.type='button';
      reset.title='Alapnézet visszaállítása';
      reset.setAttribute('aria-label','Alapnézet visszaállítása');
      reset.textContent='↺';
      document.body.appendChild(reset);
    }
    if(!toolbar){
      toolbar=document.createElement('div');
      toolbar.className='prototype-viewport-toolbar';
      toolbar.setAttribute('aria-label','Elonezeti meretek');
      VIEWPORT_PRESETS.forEach(function(preset){
        var button=document.createElement('button');
        button.type='button';
        button.dataset.viewportPreset=preset.id;
        button.title=preset.label+' - '+preset.size;
        button.innerHTML='<span>'+preset.label+'</span><small>'+preset.size+'</small>';
        toolbar.appendChild(button);
      });
      document.body.appendChild(toolbar);
    }
    updatePresetButtons();
    positionPreviewControls();
    syncResponsivePreviewMode();
  }

  function positionPreviewControls(){
    var frame=document.querySelector('.prototype-frame');
    var reset=document.querySelector('.prototype-reset-frame');
    var toolbar=document.querySelector('.prototype-viewport-toolbar');
    if(!frame||!isDesktopPreview())return;
    var rect=frame.getBoundingClientRect();
    var left=rect.right+8;
    var top=rect.top;
    if(reset){
      var resetLeft=left;
      var resetTop=top;
      if(resetLeft+34>window.innerWidth-6){
        resetLeft=Math.max(8,rect.left+8);
        resetTop=rect.top+8;
      }
      reset.style.left=Math.round(resetLeft)+'px';
      reset.style.top=Math.round(resetTop)+'px';
    }
    if(!toolbar)return;
    var toolbarLeft=left;
    var toolbarTop=top+42;
    var maxToolbarHeight=Math.max(160,window.innerHeight-16);
    toolbar.style.maxHeight=Math.round(maxToolbarHeight)+'px';
    toolbar.style.overflowY='auto';
    if(toolbarLeft+124>window.innerWidth-6){
      toolbarLeft=Math.max(8,rect.left-132);
      if(toolbarLeft+124>rect.left-6)toolbarLeft=Math.max(8,rect.left+8);
      toolbarTop=rect.top+50;
    }
    var toolbarHeight=Math.min(toolbar.getBoundingClientRect().height||toolbar.scrollHeight||210,maxToolbarHeight);
    if(toolbarTop+toolbarHeight>window.innerHeight-6){
      toolbarTop=Math.max(8,window.innerHeight-toolbarHeight-6);
    }
    toolbar.style.left=Math.round(toolbarLeft)+'px';
    toolbar.style.top=Math.round(toolbarTop)+'px';
  }

  function clearFrameSize(frame){
    frame.style.removeProperty('width');
    frame.style.removeProperty('height');
    frame.style.removeProperty('min-width');
    frame.style.removeProperty('min-height');
    frame.style.removeProperty('max-width');
    frame.style.removeProperty('max-height');
    frame.removeAttribute('data-preview-preset');
  }

  function updatePresetButtons(){
    var frame=document.querySelector('.prototype-frame');
    var active=frame&&frame.getAttribute('data-preview-preset')||'base';
    document.querySelectorAll('.prototype-viewport-toolbar button').forEach(function(button){
      button.classList.toggle('active',button.dataset.viewportPreset===active);
    });
  }

  function setFramePreset(presetId){
    var frame=document.querySelector('.prototype-frame');
    if(!frame||!isDesktopPreview())return;
    var preset=VIEWPORT_PRESETS.find(function(item){return item.id===presetId;})||VIEWPORT_PRESETS[0];
    if(preset.id==='base'){
      clearFrameSize(frame);
    }else{
      frame.style.setProperty('width',preset.width+'px','important');
      frame.style.setProperty('height',preset.height+'px','important');
      frame.style.setProperty('min-width','0','important');
      frame.style.setProperty('min-height','0','important');
      frame.style.setProperty('max-width','none','important');
      frame.style.setProperty('max-height','none','important');
      frame.setAttribute('data-preview-preset',preset.id);
    }
    updatePresetButtons();
    syncResponsivePreviewMode();
    requestAnimationFrame(positionPreviewControls);
  }

  function handleViewportPresetClick(event){
    var button=event.target&&event.target.closest&&event.target.closest('[data-viewport-preset]');
    if(!button||!isDesktopPreview())return;
    event.preventDefault();
    setFramePreset(button.dataset.viewportPreset);
  }

  function resetFrameSize(event){
    var button=event.target&&event.target.closest&&event.target.closest('.prototype-reset-frame');
    if(!button||!isDesktopPreview())return;
    var frame=document.querySelector('.prototype-frame');
    if(!frame)return;
    event.preventDefault();
    clearFrameSize(frame);
    updatePresetButtons();
    syncResponsivePreviewMode();
    requestAnimationFrame(positionPreviewControls);
  }

  function clamp(value,min,max){
    return Math.min(Math.max(value,min),max);
  }

  function startFrameResize(event){
    var grip=event.target&&event.target.closest&&event.target.closest('.prototype-resize-grip');
    if(!grip||!isDesktopPreview())return;
    var frame=grip.closest('.prototype-frame');
    if(!frame)return;
    event.preventDefault();
    event.stopPropagation();
    var rect=frame.getBoundingClientRect();
    var startX=event.clientX;
    var startY=event.clientY;
    var startWidth=rect.width;
    var startHeight=rect.height;
    var minWidth=320;
    var minHeight=560;
    var maxWidth=Math.max(minWidth,Math.min(Math.round(window.innerWidth*.96),900));
    var maxHeight=Math.max(minHeight,Math.round(window.innerHeight-44));
    document.body.style.cursor='nwse-resize';
    document.body.style.userSelect='none';
    function move(moveEvent){
      var nextWidth=clamp(startWidth+(moveEvent.clientX-startX),minWidth,maxWidth);
      var nextHeight=clamp(startHeight+(moveEvent.clientY-startY),minHeight,maxHeight);
      frame.style.setProperty('width',Math.round(nextWidth)+'px','important');
      frame.style.setProperty('height',Math.round(nextHeight)+'px','important');
      frame.setAttribute('data-preview-preset','custom');
      updatePresetButtons();
      syncResponsivePreviewMode();
      positionPreviewControls();
    }
    function stop(){
      window.removeEventListener('pointermove',move,true);
      document.body.style.cursor='';
      document.body.style.userSelect='';
    }
    window.addEventListener('pointermove',move,true);
    window.addEventListener('pointerup',stop,{capture:true,once:true});
    window.addEventListener('pointercancel',stop,{capture:true,once:true});
  }

  ensureButtonLayoutFix();
  ensureResizableFrame();
  syncResponsivePreviewMode();
  window.HB_SYNC_RESPONSIVE_PREVIEW_MODE=syncResponsivePreviewMode;
  window.HB_APPLY_FEED_BOX_CLASSES=applyFeedBoxClasses;
  document.addEventListener('pointerdown',startFrameResize,true);
  document.addEventListener('click',resetFrameSize,true);
  document.addEventListener('click',handleViewportPresetClick,true);
  document.addEventListener('DOMContentLoaded',ensureButtonLayoutFix);
  document.addEventListener('DOMContentLoaded',function(){ensureResizableFrame();syncResponsivePreviewMode();});
  window.addEventListener('load',ensureButtonLayoutFix);
  window.addEventListener('load',function(){ensureResizableFrame();syncResponsivePreviewMode();});
  window.addEventListener('resize',function(){ensureResizableFrame();syncResponsivePreviewMode();});
  if(window.ResizeObserver){
    var observer=new ResizeObserver(function(){syncResponsivePreviewMode();positionPreviewControls();});
    var observedFrame=document.querySelector('.prototype-frame');
    if(observedFrame)observer.observe(observedFrame);
  }
})();
