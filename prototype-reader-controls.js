(function(){
  const STORE='hirbeszed-state';

  function liveState(){
    try{
      if(typeof state!=='undefined'&&state)return state;
    }catch(_){}
    return null;
  }

  function storedState(){
    try{return JSON.parse(localStorage.getItem(STORE)||'{}')||{};}catch(_){return {};}
  }

  function savePlaybackState(nextPlaying){
    const live=liveState();
    if(live){
      live.playing=nextPlaying;
      if(typeof saveState==='function')saveState();
      return live;
    }
    const stored=storedState();
    stored.playing=nextPlaying;
    localStorage.setItem(STORE,JSON.stringify(stored));
    return stored;
  }

  function paintPlaybackControl(nextPlaying){
    const play=document.querySelector('.car-controls [data-car="play"]');
    if(play){
      play.classList.toggle('playing',nextPlaying);
      const paused=nextPlaying&&play.classList.contains('paused');
      play.setAttribute('aria-label',paused?'Felolvasás folytatása':nextPlaying?'Felolvasás szüneteltetése':'Felolvasás indítása');
      if(typeof carControlIcon==='function'){
        play.innerHTML=`${carControlIcon(paused?'resume':nextPlaying?'pause':'play')}<span class="car-control-label">${paused?'Folytatás':nextPlaying?'Szünet':'Felolvasás'}</span>`;
      }
    }
    const wave=document.querySelector('.wave');
    if(wave)wave.classList.toggle('paused',!nextPlaying);
  }

  function togglePlaybackFromControl(){
    const live=liveState();
    const play=document.querySelector('.car-controls [data-car="play"]');
    const wave=document.querySelector('.wave');
    const uiPlaying=play?.classList.contains('playing')||wave&&!wave.classList.contains('paused');
    const isPlaying=!!uiPlaying;
    const nextPlaying=!isPlaying;
    if(nextPlaying&&typeof speakCurrent==='function'){
      try{
        speakCurrent();
        if(typeof saveState==='function')saveState();
        return;
      }catch(_){}
    }
    if(!nextPlaying&&typeof stopSpeech==='function'){
      try{
        stopSpeech();
        if(typeof saveState==='function')saveState();
        return;
      }catch(_){}
    }
    if(!nextPlaying)try{if('speechSynthesis' in window)speechSynthesis.cancel();}catch(_){}
    savePlaybackState(nextPlaying);
    if(live&&typeof renderCar==='function')renderCar();
    paintPlaybackControl(nextPlaying);
    if(nextPlaying&&(!('speechSynthesis' in window)||typeof SpeechSynthesisUtterance==='undefined')){
      if(typeof toast==='function')toast('A böngésző nem támogatja a felolvasást, vizuális próba fut');
    }
  }

  function togglePausePlaybackFromControl(){
    const live=liveState();
    if(live){
      if(live.paused){
        live.paused=false;
        live.playing=true;
        if(typeof resumeCurrentSpeech==='function')resumeCurrentSpeech();
        else try{if('speechSynthesis' in window)speechSynthesis.resume();}catch(_){}
        if(typeof saveState==='function')saveState();
        if(typeof updateCarDom==='function')updateCarDom();
        else if(typeof renderCar==='function')renderCar();
        return;
      }
      if(live.playing){
        live.paused=true;
        live.playing=true;
        try{if('speechSynthesis' in window)speechSynthesis.pause();}catch(_){}
        if(typeof saveState==='function')saveState();
        if(typeof updateCarDom==='function')updateCarDom();
        else if(typeof renderCar==='function')renderCar();
        return;
      }
    }
    if(typeof speakCurrent==='function'){
      speakCurrent();
      if(typeof saveState==='function')saveState();
      return;
    }
    savePlaybackState(true);
    paintPlaybackControl(true);
  }

  function ensureReaderControlStyle(){
    let style=document.getElementById('readerControlStyle');
    if(!style){
      style=document.createElement('style');
      style.id='readerControlStyle';
      document.head.appendChild(style);
    }
    style.textContent='.skip-icon{position:relative;display:block;width:30px;height:24px;margin:0 auto 3px;color:var(--text)}.skip-icon svg{width:100%;height:100%;display:block;fill:currentColor}.skip-icon .skip-bar{fill:none;stroke:currentColor;stroke-width:3;stroke-linecap:round}.skip-icon.off{color:var(--muted)}.skip-icon.off:after{content:"";position:absolute;left:1px;right:1px;top:50%;height:3px;border-radius:3px;background:var(--coral);transform:rotate(-28deg);box-shadow:0 0 0 1px color-mix(in srgb,var(--surface) 72%,transparent)}.car-status{padding:18px 6px 16px}.car-status .status-label{display:none!important}.wave{height:92px;display:flex;justify-content:center;align-items:center;gap:9px;margin:14px auto 0}.wave i{width:10px;height:28px;border-radius:999px;background:var(--voice);box-shadow:0 0 18px color-mix(in srgb,var(--voice) 34%,transparent);animation:wave .9s ease-in-out infinite;transform-origin:center}.wave i:nth-child(1){height:26px;background:var(--voice);opacity:.72}.wave i:nth-child(2){height:54px;background:var(--coral);box-shadow:0 0 20px color-mix(in srgb,var(--coral) 44%,transparent);animation-delay:.06s}.wave i:nth-child(3){height:76px;background:var(--voice);animation-delay:.12s}.wave i:nth-child(4){height:92px;background:var(--voice);animation-delay:.18s}.wave i:nth-child(5){height:68px;background:var(--coral);box-shadow:0 0 20px color-mix(in srgb,var(--coral) 44%,transparent);animation-delay:.24s}.wave i:nth-child(6){height:88px;background:var(--voice);animation-delay:.3s}.wave i:nth-child(7){height:58px;background:var(--voice);animation-delay:.36s}.wave i:nth-child(8){height:78px;background:var(--coral);box-shadow:0 0 20px color-mix(in srgb,var(--coral) 44%,transparent);animation-delay:.42s}.wave i:nth-child(9){height:30px;background:var(--voice);opacity:.76;animation-delay:.48s}.wave.paused i{animation:none;opacity:.72;box-shadow:none}.wave.paused i:nth-child(1),.wave.paused i:nth-child(9){height:22px}.wave.paused i:nth-child(2),.wave.paused i:nth-child(8){height:32px}.wave.paused i:nth-child(3),.wave.paused i:nth-child(7){height:42px}.wave.paused i:nth-child(4),.wave.paused i:nth-child(6){height:52px}.wave.paused i:nth-child(5){height:38px}';
  }

  function patchCarControls(){
    ensureReaderControlStyle();
    const controls=document.querySelector('.car-controls');
    if(!controls)return;
    const mic=controls.querySelector('[data-car="mic"]');
    const play=controls.querySelector('[data-car="play"]');
    const auto=controls.querySelector('[data-car="auto"]');
    if(!mic||!play||!auto)return;
    const autoActive=!auto.classList.contains('off');
    if(typeof carControlIcon==='function'){
      auto.innerHTML=`${carControlIcon('auto',autoActive)}<span class="car-control-label">Hírléptető</span>`;
      auto.setAttribute('aria-label',autoActive?'Hírléptető bekapcsolva':'Hírléptető kikapcsolva');
    }
    controls.append(mic,play,auto);
    if(!play.__stablePlaybackClick){
      play.addEventListener('click',event=>{
        event.preventDefault();
        event.stopPropagation();
        event.stopImmediatePropagation();
        togglePausePlaybackFromControl();
      });
      play.__stablePlaybackClick=true;
    }

    const status=document.querySelector('.car-status .status-label');
    if(status)status.remove();
    const wave=document.querySelector('.car-status .wave');
    if(wave&&wave.children.length!==9)wave.innerHTML='<i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i>';
  }

  document.addEventListener('click',event=>{
    const play=event.target.closest?.('.car-controls [data-car="play"]');
    if(play){
      event.preventDefault();
      event.stopPropagation();
      event.stopImmediatePropagation();
      togglePausePlaybackFromControl();
    }
  },true);

  if(typeof renderCar==='function'&&!renderCar.__carControlPatch){
    const originalRenderCar=renderCar;
    renderCar=function(...args){
      const result=originalRenderCar.apply(this,args);
      patchCarControls();
      return result;
    };
    renderCar.__carControlPatch=true;
    patchCarControls();
  }

  document.addEventListener('click',event=>{
    const profileSubmit=event.target.closest('#profileSettingsForm button[type="submit"]');
    if(profileSubmit){
      event.preventDefault();
      event.stopImmediatePropagation();
      const form=profileSubmit.closest('form');
      const name=form.elements.profileName.value.trim();
      const email=form.elements.profileEmail.value.trim();
      if(name&&email){
        state.settingsPrefs.profileName=name;
        state.settingsPrefs.profileEmail=email;
        saveState();
        toast('A profil mentve');
        settingsSheet('account');
      }
      return;
    }
    const rssSubmit=event.target.closest('#rssSettingsForm button[type="submit"]');
    if(rssSubmit){
      event.preventDefault();
      event.stopImmediatePropagation();
      const input=document.querySelector('#rssSettingsUrl');
      try{
        const url=new URL(input.value.trim());
        const name=url.hostname.replace(/^www\./,'');
        state.sources[name]=true;
        saveState();
        toast(`${name} hozzáadva`);
        settingsSheet('sources');
      }catch{
        toast('Adj meg egy érvényes RSS-linket');
      }
      return;
    }
    const library=event.target.closest('[data-library]');
    if(library){
      event.preventDefault();
      event.stopImmediatePropagation();
      librarySheet(library.dataset.library);
      return;
    }
    const toggle=event.target.closest('[data-toggle-setting]');
    if(!toggle)return;
    event.preventDefault();
    event.stopImmediatePropagation();
    const key=toggle.dataset.toggleSetting;
    state[key]=!state[key];
    saveState();
    settingsSheet(key==='autoNext'?'voice':key==='mobileData'?'data':key==='location'?'location':'notifications');
  },true);
})();
