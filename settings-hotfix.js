(function(){
  document.addEventListener('click',event=>{
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
