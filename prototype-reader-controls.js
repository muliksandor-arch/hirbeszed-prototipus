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
    if(wave){
      wave.classList.toggle('paused',!nextPlaying);
      if(wave.classList.contains('voice-activity')){
        const live=liveState();
        const stored=storedState();
        const micOn=live?!!live.mic:!!stored.mic;
        const mode=nextPlaying?'speaking':micOn?'listening':'idle';
        wave.dataset.voiceState=mode;
        wave.classList.toggle('voice-speaking',mode==='speaking');
        wave.classList.toggle('voice-listening',mode==='listening');
        wave.classList.toggle('voice-idle',mode==='idle');
        wave.setAttribute('aria-label',mode==='speaking'?'Felolvasás folyamatban':mode==='listening'?'Mikrofon figyel':'Nyugalmi hangállapot');
      }
    }
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
    style.textContent='.skip-icon{position:relative;display:block;width:30px;height:24px;margin:0 auto 3px;color:var(--text)}.skip-icon svg{width:100%;height:100%;display:block;fill:currentColor}.skip-icon .skip-bar{fill:none;stroke:currentColor;stroke-width:3;stroke-linecap:round}.skip-icon.off{color:var(--muted)}.skip-icon.off:after{content:"";position:absolute;left:1px;right:1px;top:50%;height:3px;border-radius:3px;background:var(--coral);transform:rotate(-28deg);box-shadow:0 0 0 1px color-mix(in srgb,var(--surface) 72%,transparent)}.car-status{padding:18px 6px 16px}.car-status .status-label{display:none!important}';
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
