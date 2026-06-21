(function(){
  if(window.__hirbeszedAuthHotfixLoaded)return;
  window.__hirbeszedAuthHotfixLoaded=true;

  function ensureAuthStyle(){
    let style=document.getElementById('authHotfixStyle');
    if(!style){
      style=document.createElement('style');
      style.id='authHotfixStyle';
      document.head.appendChild(style);
    }
    style.textContent='.auth-screen{display:flex;flex-direction:column;gap:13px}.auth-hero{padding:20px 16px;border:1px solid color-mix(in srgb,var(--coral) 35%,var(--border));border-radius:24px;background:linear-gradient(145deg,color-mix(in srgb,var(--coral) 10%,var(--surface)),var(--surface));text-align:left}.auth-hero h1{font-size:23px;line-height:28px;margin:8px 0 7px}.auth-hero p{font-size:12px;line-height:18px;color:var(--muted);margin:0}.auth-kicker{font-size:9px;font-weight:900;letter-spacing:1px;color:var(--coral)}.auth-badge{display:inline-grid;place-items:center;width:42px;height:42px;border-radius:15px;background:var(--coral);color:white;font-size:19px}.auth-form{display:grid;gap:9px}.auth-form label{font-size:10px;font-weight:800;color:var(--muted);margin-left:3px}.auth-form input{width:100%;height:46px;border:1px solid var(--border);border-radius:15px;background:var(--surface);color:var(--text);padding:0 13px;outline:none}.auth-form input:focus{border-color:var(--accent);box-shadow:0 0 0 3px color-mix(in srgb,var(--accent) 14%,transparent)}.auth-actions{display:grid;gap:9px}.social-grid{display:grid;grid-template-columns:1fr 1fr;gap:9px}.auth-social{height:50px;border:1px solid var(--border);border-radius:16px;background:var(--surface);color:var(--text);font-weight:850}.auth-social.facebook{border-color:color-mix(in srgb,#1877F2 55%,var(--border));color:#1877F2}.auth-social.google{border-color:color-mix(in srgb,var(--coral) 45%,var(--border));color:var(--coral)}.auth-divider{text-align:center;color:var(--muted);font-size:10px}.auth-code{letter-spacing:10px;text-align:center;font-size:22px;font-weight:900}.auth-note{font-size:10px;line-height:15px;color:var(--muted);text-align:center;margin:0 8px}.auth-profile-card{border-radius:24px;padding:18px;background:linear-gradient(145deg,var(--primary),color-mix(in srgb,var(--primary) 72%,var(--accent)));color:#fff}.auth-profile-card h1{font-size:22px;margin:10px 0 4px}.auth-profile-card p{font-size:11px;color:rgba(255,255,255,.74);margin:0}.auth-status{display:inline-flex;gap:6px;align-items:center;border:1px solid rgba(255,255,255,.24);border-radius:999px;padding:6px 9px;font-size:9px;font-weight:850}.auth-provider-row{display:flex;gap:7px;flex-wrap:wrap;margin-top:13px}.auth-provider-row span{border-radius:999px;background:rgba(255,255,255,.12);padding:6px 9px;font-size:9px;font-weight:800}.danger-button{width:100%;height:46px;border:1px solid color-mix(in srgb,var(--coral) 50%,var(--border));border-radius:15px;background:transparent;color:var(--coral);font-weight:850}';
  }

  function authState(){
    if(!state.auth)state.auth={loggedIn:false,name:'',email:'',phone:'',provider:'',twoFactor:false};
    return state.auth;
  }

  function authAccountSheet(){
    ensureAuthStyle();
    const auth=authState();
    if(auth.loggedIn){
      return openSheet('Fiók és biztonság','Belépett prototípus-fiók',`<section class="auth-screen"><div class="auth-profile-card"><span class="auth-status">✓ BELÉPVE</span><h1>${auth.name||'Hírbeszéd felhasználó'}</h1><p>${auth.email||auth.phone||'Közösségi fiókkal belépve'}</p><div class="auth-provider-row"><span>${auth.provider||'Email / telefon'}</span><span>${auth.twoFactor?'2FA bekapcsolva':'2FA nincs bekapcsolva'}</span></div></div><div class="settings-group">${settingRow(['♙','Profiladatok','Név, email és telefonszám','auth-profile'])}${settingRow(['A','Kapcsolt fiókok','Facebook, Google, email','auth-accounts'])}${settingRow(['✦','Kétlépcsős védelem',auth.twoFactor?'Bekapcsolva':'Kikapcsolva','auth-security'])}</div><button class="danger-button" data-auth-action="logout">Kijelentkezés</button></section>`);
    }
    openSheet('Fiók és biztonság','Belépés vagy regisztráció',`<section class="auth-screen"><div class="auth-hero"><span class="auth-badge">♙</span><div class="auth-kicker">FIÓK SZÜKSÉGES</div><h1>Mentsd a híreket, előzményeket és előfizetést.</h1><p>A végleges appban itt történik a belépés. A prototípus nem küld adatot külső rendszerbe.</p></div><div class="social-grid"><button class="auth-social facebook" data-auth-action="social-facebook">Facebook</button><button class="auth-social google" data-auth-action="social-google">Google</button></div><div class="auth-actions"><button class="primary-button coral-button" data-auth-action="login">Belépés emaillel vagy telefonnal</button><button class="secondary-button" data-auth-action="register">Új fiók létrehozása</button></div><p class="auth-note">Emailes vagy telefonszámos regisztrációnál kétlépcsős azonosító kódot is mutatunk.</p></section>`);
  }

  function authLoginSheet(){
    ensureAuthStyle();
    openSheet('Belépés','Email, telefon vagy közösségi fiók',`<section class="auth-screen"><div class="auth-form"><label for="authLoginId">Email vagy telefonszám</label><input id="authLoginId" autocomplete="username" placeholder="anna@pelda.hu vagy +36..."><label for="authLoginPass">Jelszó</label><input id="authLoginPass" type="password" autocomplete="current-password" placeholder="••••••••"></div><button class="primary-button coral-button" data-auth-action="start-login">Belépés</button><div class="auth-divider">vagy</div><div class="social-grid"><button class="auth-social facebook" data-auth-action="social-facebook">Facebook</button><button class="auth-social google" data-auth-action="social-google">Google</button></div><button class="text-button" data-auth-action="forgot">Elfelejtett jelszó</button><button class="secondary-button" data-auth-action="register">Nincs fiókom, regisztrálok</button></section>`);
  }

  function authRegisterSheet(){
    ensureAuthStyle();
    openSheet('Regisztráció','14 napos próba előtt',`<section class="auth-screen"><div class="auth-form"><label for="authRegName">Név</label><input id="authRegName" autocomplete="name" placeholder="Teljes név"><label for="authRegEmail">Email</label><input id="authRegEmail" autocomplete="email" inputmode="email" placeholder="email@pelda.hu"><label for="authRegPhone">Telefonszám</label><input id="authRegPhone" autocomplete="tel" inputmode="tel" placeholder="+36..."><label for="authRegPass">Jelszó</label><input id="authRegPass" type="password" autocomplete="new-password" placeholder="Legalább 8 karakter"></div><button class="primary-button coral-button" data-auth-action="start-register">Regisztráció és kód küldése</button><div class="auth-divider">gyors regisztráció</div><div class="social-grid"><button class="auth-social facebook" data-auth-action="social-facebook">Facebook</button><button class="auth-social google" data-auth-action="social-google">Google</button></div><button class="text-button" data-auth-action="login">Már van fiókom</button></section>`);
  }

  function authTwoFactorSheet(mode='login'){
    ensureAuthStyle();
    const auth=authState();
    const target=auth.draftEmail||auth.draftPhone||auth.email||auth.phone||'a megadott elérhetőség';
    openSheet('Kétlépcsős azonosítás',mode==='register'?'Regisztráció megerősítése':'Belépés megerősítése',`<section class="auth-screen"><div class="auth-hero"><span class="auth-badge">✦</span><div class="auth-kicker">BIZTONSÁGI KÓD</div><h1>Írd be a 6 jegyű kódot.</h1><p>A prototípusban bármilyen kód elfogadott. A végleges appban SMS-ben vagy emailben érkezne ide: ${target}.</p></div><div class="auth-form"><label for="authCode">Ellenőrző kód</label><input id="authCode" class="auth-code" inputmode="numeric" maxlength="6" placeholder="123456"></div><button class="primary-button coral-button" data-auth-action="complete-2fa">Megerősítés</button><button class="text-button" data-auth-action="resend-2fa">Kód újraküldése</button></section>`);
  }

  function authForgotSheet(){
    ensureAuthStyle();
    openSheet('Jelszó visszaállítása','Email vagy telefonszám alapján',`<section class="auth-screen"><div class="auth-form"><label for="authResetId">Email vagy telefonszám</label><input id="authResetId" placeholder="anna@pelda.hu vagy +36..."></div><button class="primary-button coral-button" data-auth-action="send-reset">Visszaállító link küldése</button><button class="text-button" data-auth-action="login">Vissza a belépéshez</button></section>`);
  }

  function authSecuritySheet(){
    ensureAuthStyle();
    const auth=authState();
    openSheet('Kétlépcsős védelem','Fiókbiztonság',`<section class="auth-screen"><div class="settings-group"><button class="settings-row" data-auth-action="toggle-2fa"><span class="row-icon">✦</span><span class="row-copy"><strong>Kétlépcsős azonosítás</strong><small>${auth.twoFactor?'Bekapcsolva':'Kikapcsolva'}</small></span><span class="toggle ${auth.twoFactor?'on':''}"></span></button>${settingRow(['#','Helyreállító kódok','Későbbi appfunkció','auth-recovery'])}</div><p class="auth-note">Email/telefon regisztrációnál ezt alapból érdemes bekapcsolva tartani.</p></section>`);
  }

  function authConnectedSheet(){
    ensureAuthStyle();
    const auth=authState();
    openSheet('Kapcsolt fiókok','Belépési módok',`<section class="auth-screen"><div class="settings-group"><div class="settings-row static-row"><span class="row-icon">f</span><span class="row-copy"><strong>Facebook</strong><small>${auth.provider==='Facebook'?'Kapcsolva':'Nincs kapcsolva'}</small></span></div><div class="settings-row static-row"><span class="row-icon">G</span><span class="row-copy"><strong>Google</strong><small>${auth.provider==='Google'?'Kapcsolva':'Nincs kapcsolva'}</small></span></div><div class="settings-row static-row"><span class="row-icon">@</span><span class="row-copy"><strong>Email / telefon</strong><small>${auth.email||auth.phone?'Beállítva':'Nincs beállítva'}</small></span></div></div></section>`);
  }

  if(typeof settingsSheet==='function'&&!settingsSheet.__authPatch){
    const originalSettingsSheet=settingsSheet;
    settingsSheet=function(type,...args){
      if(type==='account')return authAccountSheet();
      return originalSettingsSheet.call(this,type,...args);
    };
    settingsSheet.__authPatch=true;
  }

  document.addEventListener('click',event=>{
    const authAction=event.target.closest('[data-auth-action]');
    if(authAction){
      event.preventDefault();
      event.stopImmediatePropagation();
      const action=authAction.dataset.authAction;
      const auth=authState();
      if(action==='login')authLoginSheet();
      if(action==='register')authRegisterSheet();
      if(action==='forgot')authForgotSheet();
      if(action==='start-login'){
        const value=document.querySelector('#authLoginId')?.value?.trim()||'minta@hirbeszed.hu';
        if(value.includes('@'))auth.draftEmail=value;else auth.draftPhone=value;
        auth.pendingMode='login';
        saveState();
        authTwoFactorSheet('login');
      }
      if(action==='start-register'){
        auth.draftName=document.querySelector('#authRegName')?.value?.trim()||'Hírbeszéd felhasználó';
        auth.draftEmail=document.querySelector('#authRegEmail')?.value?.trim()||'minta@hirbeszed.hu';
        auth.draftPhone=document.querySelector('#authRegPhone')?.value?.trim()||'+36 30 000 0000';
        auth.pendingMode='register';
        saveState();
        authTwoFactorSheet('register');
      }
      if(action==='complete-2fa'){
        auth.loggedIn=true;
        auth.name=auth.draftName||auth.name||'Hírbeszéd felhasználó';
        auth.email=auth.draftEmail||auth.email||'minta@hirbeszed.hu';
        auth.phone=auth.draftPhone||auth.phone||'';
        auth.provider='Email / telefon';
        auth.twoFactor=true;
        auth.pendingMode='';
        saveState();
        toast('Belépés megerősítve');
        authAccountSheet();
      }
      if(action==='resend-2fa')toast('Új kód elküldve a prototípusban');
      if(action==='social-facebook'||action==='social-google'){
        auth.loggedIn=true;
        auth.name=action==='social-facebook'?'Facebook felhasználó':'Google felhasználó';
        auth.email=action==='social-facebook'?'facebook@hirbeszed.hu':'google@hirbeszed.hu';
        auth.provider=action==='social-facebook'?'Facebook':'Google';
        auth.twoFactor=false;
        saveState();
        toast(`${auth.provider} belépés kész`);
        authAccountSheet();
      }
      if(action==='send-reset'){toast('Visszaállító link elküldve');authLoginSheet();}
      if(action==='toggle-2fa'){auth.twoFactor=!auth.twoFactor;saveState();authSecuritySheet();}
      if(action==='logout'){auth.loggedIn=false;auth.provider='';saveState();toast('Kijelentkezve');authAccountSheet();}
      return;
    }
    const authSetting=event.target.closest('[data-setting^="auth-"]');
    if(authSetting){
      event.preventDefault();
      event.stopImmediatePropagation();
      const type=authSetting.dataset.setting;
      if(type==='auth-security')authSecuritySheet();
      else if(type==='auth-accounts')authConnectedSheet();
      else toast('Profiladatok szerkesztése későbbi prototípuslépés');
      return;
    }
  },true);
})();
