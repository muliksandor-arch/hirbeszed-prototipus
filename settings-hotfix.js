(function(){
  function ensureCarHotfixStyle(){
    if(document.getElementById('carHotfixStyle'))return;
    const style=document.createElement('style');
    style.id='carHotfixStyle';
    style.textContent='.skip-icon{position:relative;display:block;width:30px;height:24px;margin:0 auto 3px;color:var(--text)}.skip-icon svg{width:100%;height:100%;display:block;fill:currentColor}.skip-icon .skip-bar{fill:none;stroke:currentColor;stroke-width:3;stroke-linecap:round}.skip-icon.off{color:var(--muted)}.skip-icon.off:after{content:"";position:absolute;left:1px;right:1px;top:50%;height:3px;border-radius:3px;background:var(--coral);transform:rotate(-28deg);box-shadow:0 0 0 1px color-mix(in srgb,var(--surface) 72%,transparent)}.car-status{padding:14px 6px 12px}.wave{height:62px;display:flex;justify-content:center;align-items:center;gap:7px;margin:10px auto 0}.wave i{width:8px;height:18px;border-radius:999px;background:var(--voice);box-shadow:0 0 16px color-mix(in srgb,var(--voice) 34%,transparent);animation:wave 1s ease-in-out infinite;transform-origin:center}.wave i:nth-child(1),.wave i:nth-child(7){height:16px;opacity:.74}.wave i:nth-child(2),.wave i:nth-child(6){height:31px}.wave i:nth-child(3),.wave i:nth-child(5){height:46px}.wave i:nth-child(4){height:58px;background:var(--coral);box-shadow:0 0 18px color-mix(in srgb,var(--coral) 42%,transparent)}.wave i:nth-child(2){animation-delay:.08s}.wave i:nth-child(3){animation-delay:.16s}.wave i:nth-child(4){animation-delay:.24s}.wave i:nth-child(5){animation-delay:.32s}.wave i:nth-child(6){animation-delay:.4s}.wave i:nth-child(7){animation-delay:.48s}.wave.paused i{animation:none;height:10px;opacity:.68;box-shadow:none}';
    document.head.appendChild(style);
  }

  function skipIcon(active=true){
    return `<span class="skip-icon ${active?'':'off'}" aria-hidden="true"><svg viewBox="0 0 28 24" focusable="false"><path d="M4 5l8 7-8 7V5zM13 5l8 7-8 7V5z"></path><path class="skip-bar" d="M24 5v14"></path></svg></span>`;
  }

  function patchCarControls(){
    ensureCarHotfixStyle();
    const controls=document.querySelector('.car-controls');
    if(!controls)return;
    const mic=controls.querySelector('[data-car="mic"]');
    const play=controls.querySelector('[data-car="play"]');
    const auto=controls.querySelector('[data-car="auto"]');
    if(!mic||!play||!auto)return;
    const autoActive=!auto.classList.contains('off');
    auto.innerHTML=`${skipIcon(autoActive)}${autoActive?'Hírléptető aktív':'Hírléptető kikapcsolt'}`;
    controls.append(mic,play,auto);

    const status=document.querySelector('.car-status .status-label');
    if(status)status.textContent=state.playing?'● FELOLVASÁS':'Ⅱ KÉSZEN ÁLL';
    const wave=document.querySelector('.car-status .wave');
    if(wave&&wave.children.length<7)wave.innerHTML='<i></i><i></i><i></i><i></i><i></i><i></i><i></i>';
  }

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
    const themeButton=event.target.closest('button[data-theme]');
    if(!themeButton&&document.documentElement.hasAttribute('data-theme')){
      const currentTheme=document.documentElement.dataset.theme;
      document.documentElement.removeAttribute('data-theme');
      setTimeout(()=>{
        if(!document.documentElement.hasAttribute('data-theme'))document.documentElement.dataset.theme=currentTheme;
      },0);
    }
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
