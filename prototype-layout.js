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
      '@media (min-width:700px) and (hover:hover) and (pointer:fine){body{padding:22px 0!important}.prototype-note{display:flex!important;width:430px!important;margin:0 auto!important;border-radius:18px 18px 0 0!important}.phone-shell{width:min(100%,430px)!important;max-width:430px!important;height:min(860px,calc(100dvh - 78px))!important;min-height:620px!important;margin:0 auto!important;border-radius:0 0 30px 30px!important;box-shadow:var(--shadow)!important}.phone-shell:before{content:""!important;display:block!important;position:absolute!important;inset:0!important;border:1px solid rgba(17,39,45,.12)!important;border-radius:0 0 30px 30px!important;pointer-events:none!important;z-index:40!important}.view{height:calc(100% - 76px - 72px - var(--safe-top) - var(--safe-bottom))!important}}'
    ].join('');
  }

  ensureButtonLayoutFix();
  document.addEventListener('DOMContentLoaded',ensureButtonLayoutFix);
  window.addEventListener('load',ensureButtonLayoutFix);
})();
