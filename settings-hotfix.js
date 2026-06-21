(function(){
  function patchCarControls(){
    const controls=document.querySelector('.car-controls');
    if(!controls)return;
    const mic=controls.querySelector('[data-car="mic"]');
    const play=controls.querySelector('[data-car="play"]');
    const auto=controls.querySelector('[data-car="auto"]');
    if(!mic||!play||!auto)return;
    const autoActive=!auto.classList.contains('off');
    auto.innerHTML=`<strong>⇥</strong>${autoActive?'Hírléptető aktív':'Hírléptető kikapcsolt'}`;
    controls.append(mic,play,auto);
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
