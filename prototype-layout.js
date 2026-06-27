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
      '@media (min-width:700px) and (hover:hover) and (pointer:fine){body{padding:22px 0!important;overflow:auto!important}.prototype-frame{position:relative!important;width:430px!important;height:min(860px,calc(100dvh - 44px))!important;min-width:320px!important;min-height:560px!important;max-width:min(96vw,900px)!important;max-height:calc(100dvh - 44px)!important;display:flex!important;flex-direction:column!important;resize:both!important;overflow:auto!important;border:1px solid rgba(17,39,45,.16)!important;border-radius:30px!important;background:var(--bg)!important;box-shadow:var(--shadow)!important}.prototype-frame:after{content:""!important;position:absolute!important;right:7px!important;bottom:7px!important;width:18px!important;height:18px!important;border-right:3px solid color-mix(in srgb,var(--accent) 58%,var(--border))!important;border-bottom:3px solid color-mix(in srgb,var(--accent) 58%,var(--border))!important;border-radius:0 0 5px 0!important;pointer-events:none!important;opacity:.78!important}.prototype-resize-grip{position:absolute!important;right:0!important;bottom:0!important;width:36px!important;height:36px!important;z-index:95!important;cursor:nwse-resize!important;touch-action:none!important;background:linear-gradient(135deg,transparent 0 45%,color-mix(in srgb,var(--accent) 13%,transparent) 45% 100%)!important;border-radius:0 0 28px 0!important}.prototype-reset-frame{position:fixed!important;width:34px!important;height:34px!important;border:1px solid color-mix(in srgb,var(--accent) 32%,var(--border))!important;border-radius:50%!important;background:var(--surface)!important;color:var(--accent)!important;box-shadow:0 8px 22px rgba(17,39,45,.14)!important;font-size:18px!important;font-weight:900!important;line-height:1!important;display:grid!important;place-items:center!important;z-index:100!important;cursor:pointer!important}.prototype-note{display:none!important}.phone-shell{width:100%!important;max-width:none!important;height:100%!important;min-height:0!important;margin:0!important;border-radius:30px!important;box-shadow:none!important}.phone-shell:before{content:""!important;display:block!important;position:absolute!important;inset:0!important;border:1px solid rgba(17,39,45,.12)!important;border-radius:30px!important;pointer-events:none!important;z-index:40!important}.view{height:calc(100% - 76px - 72px - var(--safe-top) - var(--safe-bottom))!important}}'
    ].join('');
  }

  function isDesktopPreview(){
    return window.matchMedia&&window.matchMedia('(min-width:700px) and (hover:hover) and (pointer:fine)').matches;
  }

  function ensureResizableFrame(){
    var frame=document.querySelector('.prototype-frame');
    if(!frame)return;
    var grip=frame.querySelector('.prototype-resize-grip');
    var reset=document.querySelector('.prototype-reset-frame');
    if(!isDesktopPreview()){
      if(grip)grip.remove();
      if(reset)reset.remove();
      frame.style.removeProperty('width');
      frame.style.removeProperty('height');
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
    positionResetButton();
  }

  function positionResetButton(){
    var frame=document.querySelector('.prototype-frame');
    var reset=document.querySelector('.prototype-reset-frame');
    if(!frame||!reset||!isDesktopPreview())return;
    var rect=frame.getBoundingClientRect();
    var left=rect.right+8;
    var top=rect.top;
    if(left+34>window.innerWidth-6){
      left=rect.right-42;
      top=rect.top+8;
    }
    reset.style.left=Math.round(left)+'px';
    reset.style.top=Math.round(top)+'px';
  }

  function resetFrameSize(event){
    var button=event.target&&event.target.closest&&event.target.closest('.prototype-reset-frame');
    if(!button||!isDesktopPreview())return;
    var frame=document.querySelector('.prototype-frame');
    if(!frame)return;
    event.preventDefault();
    frame.style.removeProperty('width');
    frame.style.removeProperty('height');
    requestAnimationFrame(positionResetButton);
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
      positionResetButton();
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
  document.addEventListener('pointerdown',startFrameResize,true);
  document.addEventListener('click',resetFrameSize,true);
  document.addEventListener('DOMContentLoaded',ensureButtonLayoutFix);
  document.addEventListener('DOMContentLoaded',ensureResizableFrame);
  window.addEventListener('load',ensureButtonLayoutFix);
  window.addEventListener('load',ensureResizableFrame);
  window.addEventListener('resize',ensureResizableFrame);
})();
