(function(){
  if(window.__hirbeszedAuthLoaded)return;
  window.__hirbeszedAuthLoaded=true;

  const STORE='hirbeszed-state';
  const LAUNCH='hirbeszed-default-launch';

  function ensureAuthStyle(){
    let style=document.getElementById('prototypeAuthStyle');
    if(!style){
      style=document.createElement('style');
      style.id='prototypeAuthStyle';
      document.head.appendChild(style);
    }
    style.textContent='.auth-screen{display:flex;flex-direction:column;gap:13px}.welcome-screen{display:flex;flex-direction:column;gap:14px}.welcome-card{position:relative;overflow:hidden;border:1px solid color-mix(in srgb,var(--coral) 42%,var(--border));border-radius:30px;padding:23px 18px 18px;background:radial-gradient(circle at 20% 5%,color-mix(in srgb,var(--coral) 22%,transparent),transparent 34%),linear-gradient(145deg,var(--primary),color-mix(in srgb,var(--primary) 72%,var(--accent)));color:#fff;box-shadow:var(--shadow)}.welcome-card:after{content:"";position:absolute;right:-45px;bottom:-55px;width:170px;height:170px;border-radius:50%;border:30px solid rgba(255,255,255,.08)}.welcome-brand{display:flex;align-items:center;gap:12px;position:relative;z-index:1}.welcome-brand img{width:46px;height:46px;filter:drop-shadow(0 8px 18px rgba(0,0,0,.18))}.welcome-wordmark{font-size:24px;font-weight:900;letter-spacing:-.8px}.welcome-wordmark span{color:#FF755F}.welcome-card h1{position:relative;z-index:1;font-size:27px;line-height:31px;letter-spacing:-.7px;margin:23px 0 9px}.welcome-card p{position:relative;z-index:1;font-size:12px;line-height:18px;color:rgba(255,255,255,.76);margin:0}.welcome-features{position:relative;z-index:1;display:flex;flex-wrap:wrap;gap:7px;margin-top:16px}.welcome-features span{border:1px solid rgba(255,255,255,.18);background:rgba(255,255,255,.1);border-radius:999px;padding:7px 9px;font-size:9px;font-weight:850}.welcome-wave{position:relative;z-index:1;display:flex;gap:5px;align-items:end;height:34px;margin-top:16px}.welcome-wave i{display:block;width:6px;border-radius:999px;background:#72C8BC}.welcome-wave i:nth-child(2),.welcome-wave i:nth-child(5){height:28px;background:#FF755F}.welcome-wave i:nth-child(1),.welcome-wave i:nth-child(7){height:12px}.welcome-wave i:nth-child(3),.welcome-wave i:nth-child(6){height:22px}.welcome-wave i:nth-child(4){height:34px}.auth-hero{padding:20px 16px;border:1px solid color-mix(in srgb,var(--coral) 35%,var(--border));border-radius:24px;background:linear-gradient(145deg,color-mix(in srgb,var(--coral) 10%,var(--surface)),var(--surface));text-align:left}.auth-hero h1{font-size:23px;line-height:28px;margin:8px 0 7px}.auth-hero p{font-size:12px;line-height:18px;color:var(--muted);margin:0}.auth-kicker{font-size:9px;font-weight:900;letter-spacing:1px;color:var(--coral)}.auth-badge{display:inline-grid;place-items:center;width:42px;height:42px;border-radius:15px;background:var(--coral);color:white;font-size:19px}.auth-form{display:grid;gap:9px}.auth-form label{font-size:10px;font-weight:800;color:var(--muted);margin-left:3px}.auth-form input{width:100%;height:46px;border:1px solid var(--border);border-radius:15px;background:var(--surface);color:var(--text);padding:0 13px;outline:none}.auth-form input:focus{border-color:var(--accent);box-shadow:0 0 0 3px color-mix(in srgb,var(--accent) 14%,transparent)}.auth-actions,.provider-list{display:grid;gap:9px}.social-grid{display:grid;grid-template-columns:1fr 1fr;gap:9px}.auth-social{height:50px;border:1px solid var(--border);border-radius:16px;background:var(--surface);color:var(--text);font-weight:850}.provider-list .auth-social{display:flex;align-items:center;justify-content:center;gap:8px}.auth-social.facebook{border-color:color-mix(in srgb,#1877F2 55%,var(--border));color:#1877F2}.auth-social.google{border-color:color-mix(in srgb,var(--coral) 45%,var(--border));color:var(--coral)}.auth-social.apple{background:#101418;border-color:#101418;color:#fff}[data-theme="dark"] .auth-social.apple{background:#F4FAF7;border-color:#F4FAF7;color:#101418}.auth-divider{text-align:center;color:var(--muted);font-size:10px}.auth-code{letter-spacing:10px;text-align:center;font-size:22px;font-weight:900}.auth-note{font-size:10px;line-height:15px;color:var(--muted);text-align:center;margin:0 8px}.auth-profile-card{border-radius:24px;padding:18px;background:linear-gradient(145deg,var(--primary),color-mix(in srgb,var(--primary) 72%,var(--accent)));color:#fff}.auth-profile-card h1{font-size:22px;margin:10px 0 4px}.auth-profile-card p{font-size:11px;color:rgba(255,255,255,.74);margin:0}.auth-status{display:inline-flex;gap:6px;align-items:center;border:1px solid rgba(255,255,255,.24);border-radius:999px;padding:6px 9px;font-size:9px;font-weight:850}.auth-provider-row{display:flex;gap:7px;flex-wrap:wrap;margin-top:13px}.auth-provider-row span{border-radius:999px;background:rgba(255,255,255,.12);padding:6px 9px;font-size:9px;font-weight:800}.danger-button{width:100%;height:46px;border:1px solid color-mix(in srgb,var(--coral) 50%,var(--border));border-radius:15px;background:transparent;color:var(--coral);font-weight:850}.privacy-check{display:flex;align-items:flex-start;gap:9px;border:1px solid var(--border);border-radius:16px;background:var(--surface);padding:12px;font-size:11px;line-height:16px;color:var(--text)}.privacy-check input{width:18px;height:18px;flex:0 0 18px;accent-color:var(--coral)}.privacy-link{margin-top:-7px}.legal-placeholder{display:grid;gap:11px}.legal-placeholder h3{font-size:13px;margin:0}.legal-placeholder p,.legal-placeholder li{font-size:11px;line-height:17px;color:var(--muted)}.onboarding-plan{width:100%;border:1px solid var(--border);border-radius:20px;background:var(--surface);color:var(--text);padding:16px;text-align:left;display:flex;justify-content:space-between;gap:12px}.onboarding-plan.pro{border:2px solid var(--coral);padding:15px}.onboarding-plan span strong,.onboarding-plan span small,.onboarding-plan em{display:block}.onboarding-plan span strong{font-size:15px}.onboarding-plan span small{font-size:10px;line-height:15px;color:var(--muted);margin-top:5px}.onboarding-plan em{font-style:normal;color:var(--coral);font-size:8px;font-weight:900;letter-spacing:.8px;margin-bottom:5px}.onboarding-plan b{font-size:12px;color:var(--coral);white-space:nowrap}.reset-warning{border:1px solid color-mix(in srgb,var(--coral) 42%,var(--border));background:color-mix(in srgb,var(--coral) 8%,var(--surface));border-radius:22px;padding:18px}.reset-warning h1{font-size:21px;line-height:26px;margin:8px 0}.reset-warning p{font-size:12px;line-height:18px;color:var(--muted);margin:0}';
  }

  function ensureSubscriptionStyle(){
    let style=document.getElementById('prototypeSubscriptionStyle');
    if(!style){
      style=document.createElement('style');
      style.id='prototypeSubscriptionStyle';
      document.head.appendChild(style);
    }
    style.textContent='.welcome-card{background:radial-gradient(circle at 18% 8%,rgba(255,117,95,.38),transparent 36%),linear-gradient(145deg,#061216,#0D242B 58%,#153841)!important;color:#fff!important}.welcome-brand{background:rgba(0,0,0,.18);border:1px solid rgba(255,255,255,.12);border-radius:18px;padding:9px 10px;width:max-content;max-width:100%}.welcome-card p{color:rgba(255,255,255,.84)!important}.provider-list,.auth-actions{width:min(100%,292px);margin-left:auto;margin-right:auto}.provider-list .auth-social,.auth-actions button,.welcome-screen>.primary-button,.welcome-screen>.secondary-button,.auth-screen>.primary-button,.auth-screen>.secondary-button{width:100%;max-width:292px;margin-left:auto;margin-right:auto}.plan-hero{position:relative;overflow:hidden;border-radius:28px;padding:22px 17px;background:radial-gradient(circle at 18% 4%,rgba(255,117,95,.34),transparent 35%),linear-gradient(145deg,#061216,#0D242B 62%,#153841);color:#fff;box-shadow:var(--shadow)}.plan-hero:after{content:"";position:absolute;right:-48px;bottom:-58px;width:170px;height:170px;border-radius:50%;border:30px solid rgba(255,255,255,.07)}.plan-hero h1{position:relative;z-index:1;font-size:25px;line-height:30px;margin:9px 0 7px}.plan-hero p{position:relative;z-index:1;font-size:12px;line-height:18px;color:rgba(255,255,255,.8);margin:0}.plan-hero .welcome-brand{position:relative;z-index:1;margin-bottom:16px}.plan-list-v4{display:grid;gap:10px}.plan-choice{position:relative;width:100%;border:1px solid var(--border);border-radius:20px;background:var(--surface);color:var(--text);padding:15px;text-align:left;display:grid;grid-template-columns:28px 1fr auto;gap:11px;align-items:start}.plan-choice.selected{border:2px solid var(--coral);padding:14px;background:color-mix(in srgb,var(--coral) 7%,var(--surface))}.choice-dot{width:24px;height:24px;border-radius:50%;border:2px solid var(--border);display:grid;place-items:center;font-size:13px;font-weight:900;color:#fff}.plan-choice.selected .choice-dot{background:var(--coral);border-color:var(--coral)}.choice-copy strong,.choice-copy small,.choice-copy em{display:block}.choice-copy strong{font-size:14px}.choice-copy small{font-size:10px;line-height:15px;color:var(--muted);margin-top:5px}.choice-copy em{font-style:normal;color:var(--coral);font-size:8px;font-weight:900;letter-spacing:.8px;margin-bottom:4px}.choice-price{font-size:11px;font-weight:900;color:var(--coral);white-space:nowrap}.plan-note-box{border:1px solid color-mix(in srgb,var(--accent) 28%,var(--border));background:color-mix(in srgb,var(--accent) 7%,var(--surface));border-radius:18px;padding:12px 13px;font-size:10px;line-height:15px;color:var(--muted)}';
  }

  function authState(){
    if(!state.auth)state.auth={loggedIn:false,name:'',email:'',phone:'',provider:'',twoFactor:false};
    return state.auth;
  }

  function onboardingState(){
    if(!state.onboarding)state.onboarding={required:false,introSeen:false,authDone:false,subscriptionDone:false,privacyAccepted:false,proOfferAvailable:false,completed:false};
    if(typeof state.onboarding.introSeen==='undefined')state.onboarding.introSeen=false;
    return state.onboarding;
  }

  function isSubscriptionReady(){
    return state.subscription&&['active','trial'].includes(state.subscription.status);
  }

  function neutralizeSpeechCallbacks(){
    try{
      if(typeof currentUtterance!=='undefined'&&currentUtterance){
        currentUtterance.onend=null;
        currentUtterance.onerror=null;
      }
    }catch(e){}
  }

  function safeStopSpeech(update){
    neutralizeSpeechCallbacks();
    try{if('speechSynthesis' in window)speechSynthesis.cancel();}catch(e){}
    try{currentUtterance=null;}catch(e){}
    state.playing=false;
    if(update&&state.route==='car')renderCar();
  }

  function setOnboardingLayout(active){
    const phone=document.getElementById('phone');
    phone?.classList.remove('startup-locked');
    phone?.classList.toggle('onboarding-active',!!active);
    document.documentElement.classList.remove('startup-locked');
    document.documentElement.classList.toggle('onboarding-active',!!active);
  }

  function closeOnboardingSheet(){
    const activeSheet=document.getElementById('sheet');
    const body=document.getElementById('sheetBody');
    if(body)body.scrollTop=0;
    activeSheet?.classList.remove('open');
    activeSheet?.setAttribute('aria-hidden','true');
    try{activeSheetRenderer=null;}catch(_){}
  }

  function enterNormalApp(withSpeech){
    setOnboardingLayout(false);
    closeOnboardingSheet();
    requestAnimationFrame(function(){
      startCarExperience(withSpeech);
    });
  }

  if(typeof stopSpeech==='function'&&!stopSpeech.__safeRoutePatch){
    const originalStopSpeech=stopSpeech;
    stopSpeech=function(update=true){
      neutralizeSpeechCallbacks();
      return originalStopSpeech.call(this,update);
    };
    stopSpeech.__safeRoutePatch=true;
  }

  function statusLabel(){return authState().loggedIn?'Bejelentkezve':'Kijelentkezve';}

  function privacyHtml(){
    const checked=onboardingState().privacyAccepted?'checked':'';
    return `<label class="privacy-check"><input id="privacyAccepted" type="checkbox" ${checked}><span>Elfogadom az adatvédelmi tájékoztatót és a prototípus használati feltételeit.</span></label><button class="text-button privacy-link" data-auth-action="privacy">Adatvédelmi tájékoztató megnyitása</button>`;
  }

  function socialButtons(){
    return `<div class="provider-list"><button class="auth-social apple" data-auth-action="social-apple">Apple bejelentkezés</button><button class="auth-social facebook" data-auth-action="social-facebook">Facebook folytatás</button><button class="auth-social google" data-auth-action="social-google">Google folytatás</button></div>`;
  }

  function welcomeSheet(){
    ensureAuthStyle();
    ensureSubscriptionStyle();
    openSheet('Hírbeszéd','Üdvözlő képernyő',`<section class="welcome-screen"><div class="welcome-card"><div class="welcome-brand"><img src="assets/brand/hirbeszed-mark-light.svg" alt=""><div class="welcome-wordmark"><span>Hír</span>beszéd</div></div><h1>Üdvözlünk a jövő hírapplikációjában.</h1><p>Friss magyar hírek, felolvasás, hangalapú vezérlés és AI asszisztens egyetlen letisztult appban.</p><div class="welcome-features"><span>RSS hírfolyam</span><span>Felolvasó</span><span>AI beszélgetés</span></div><div class="welcome-wave" aria-hidden="true"><i></i><i></i><i></i><i></i><i></i><i></i><i></i></div></div>${privacyHtml()}${socialButtons()}<button class="primary-button coral-button" data-auth-action="choose-register">Email / telefon regisztráció</button><button class="secondary-button" data-auth-action="login">Már van fiókom</button><p class="auth-note">A 14 napos próba az előfizetés-választás után indul. A fizetést később az Apple vagy Google áruház kezeli.</p></section>`);
  }

  function accountSheet(){
    ensureAuthStyle();
    ensureSubscriptionStyle();
    const auth=authState();
    if(auth.loggedIn){
      openSheet('Fiók és biztonság','Bejelentkezve',`<section class="auth-screen"><div class="auth-profile-card"><span class="auth-status">✓ BELÉPVE</span><h1>${auth.name||'Hírbeszéd felhasználó'}</h1><p>${auth.email||auth.phone||'Közösségi fiókkal belépve'}</p><div class="auth-provider-row"><span>${auth.provider||'Email / telefon'}</span><span>${auth.twoFactor?'2FA bekapcsolva':'2FA nincs bekapcsolva'}</span></div></div><div class="settings-group">${settingRow(['♙','Profiladatok','Név, email és telefonszám','auth-profile'])}${settingRow(['A','Kapcsolt fiókok','Apple, Facebook, Google, email','auth-accounts'])}${settingRow(['✦','Kétlépcsős védelem',auth.twoFactor?'Bekapcsolva':'Kikapcsolva','auth-security'])}</div><button class="danger-button" data-auth-action="logout">Kijelentkezés</button></section>`);
      return;
    }
    openSheet('Fiók és biztonság','Kijelentkezve',`<section class="auth-screen"><div class="auth-hero"><span class="auth-badge">♙</span><div class="auth-kicker">FIÓK SZÜKSÉGES</div><h1>Mentsd a híreket, előzményeket és előfizetést.</h1><p>A végleges appban itt történik a belépés. A prototípus nem küld adatot külső rendszerbe.</p></div>${socialButtons()}<div class="auth-actions"><button class="primary-button coral-button" data-auth-action="login">Belépés emaillel vagy telefonnal</button><button class="secondary-button" data-auth-action="register">Új fiók létrehozása</button></div><p class="auth-note">Emailes vagy telefonszámos regisztrációnál kétlépcsős azonosító kódot is mutatunk.</p></section>`);
  }

  function loginSheet(){
    ensureAuthStyle();
    ensureSubscriptionStyle();
    openSheet('Belépés','Email, telefon vagy közösségi fiók',`<section class="auth-screen"><div class="auth-hero"><span class="auth-badge">↪</span><div class="auth-kicker">VISSZATÉRŐ FELHASZNÁLÓ</div><h1>Folytasd ott, ahol abbahagytad.</h1><p>Mentett hírek, előzmények és előfizetés egy fiókban.</p></div><div class="auth-form"><label for="authLoginId">Email vagy telefonszám</label><input id="authLoginId" autocomplete="username" placeholder="anna@pelda.hu vagy +36..."><label for="authLoginPass">Jelszó</label><input id="authLoginPass" type="password" autocomplete="current-password" placeholder="••••••••"></div>${onboardingState().required?privacyHtml():''}<button class="primary-button coral-button" data-auth-action="start-login">Belépés</button><div class="auth-divider">vagy</div>${socialButtons()}<button class="text-button" data-auth-action="forgot">Elfelejtett jelszó</button><button class="secondary-button" data-auth-action="register">Nincs fiókom, regisztrálok</button></section>`);
  }

  function registerSheet(){
    ensureAuthStyle();
    ensureSubscriptionStyle();
    const first=onboardingState().required;
    openSheet(first?'Fiók létrehozása':'Regisztráció',first?'Első indítás · regisztráció':'14 napos próba előtt',`<section class="auth-screen"><div class="auth-hero"><span class="auth-badge">✦</span><div class="auth-kicker">HÍRBESZÉD FIÓK</div><h1>A személyes hírfolyamod innen indul.</h1><p>Regisztráció után jöhet az előfizetés-választás, majd a felolvasó automatikusan elindul.</p></div><div class="auth-form"><label for="authRegName">Név</label><input id="authRegName" autocomplete="name" placeholder="Teljes név"><label for="authRegEmail">Email</label><input id="authRegEmail" autocomplete="email" inputmode="email" placeholder="email@pelda.hu"><label for="authRegPhone">Telefonszám</label><input id="authRegPhone" autocomplete="tel" inputmode="tel" placeholder="+36..."><label for="authRegPass">Jelszó</label><input id="authRegPass" type="password" autocomplete="new-password" placeholder="Legalább 8 karakter"></div>${privacyHtml()}<button class="primary-button coral-button" data-auth-action="start-register">Regisztráció és kód küldése</button><div class="auth-divider">gyors regisztráció</div>${socialButtons()}<button class="text-button" data-auth-action="login">Már van fiókom</button></section>`);
  }

  function twoFactorSheet(mode){
    ensureAuthStyle();
    const auth=authState();
    const target=auth.draftEmail||auth.draftPhone||auth.email||auth.phone||'a megadott elérhetőség';
    openSheet('Kétlépcsős azonosítás',mode==='register'?'Regisztráció megerősítése':'Belépés megerősítése',`<section class="auth-screen"><div class="auth-hero"><span class="auth-badge">✦</span><div class="auth-kicker">BIZTONSÁGI KÓD</div><h1>Írd be a 6 jegyű kódot.</h1><p>A prototípusban bármilyen kód elfogadott. A végleges appban SMS-ben vagy emailben érkezne ide: ${target}.</p></div><div class="auth-form"><label for="authCode">Ellenőrző kód</label><input id="authCode" class="auth-code" inputmode="numeric" maxlength="6" placeholder="123456"></div><button class="primary-button coral-button" data-auth-action="complete-2fa">Megerősítés</button><button class="text-button" data-auth-action="resend-2fa">Kód újraküldése</button></section>`);
  }

  function forgotSheet(){
    ensureAuthStyle();
    openSheet('Jelszó visszaállítása','Email vagy telefonszám alapján',`<section class="auth-screen"><div class="auth-form"><label for="authResetId">Email vagy telefonszám</label><input id="authResetId" placeholder="anna@pelda.hu vagy +36..."></div><button class="primary-button coral-button" data-auth-action="send-reset">Visszaállító link küldése</button><button class="text-button" data-auth-action="login">Vissza a belépéshez</button></section>`);
  }

  function privacySheet(){
    ensureAuthStyle();
    openSheet('Adatvédelmi tájékoztató','Ideiglenes prototípus-oldal',`<section class="auth-screen legal-placeholder"><div class="auth-hero"><span class="auth-badge">§</span><div class="auth-kicker">JOGI SZÖVEG KÉSZÜL</div><h1>Adatkezelési alapelvek</h1><p>Ez egy ideiglenes prototípus-oldal. A végleges jogi szöveget később készítjük el.</p></div><h3>Mit fog tartalmazni?</h3><ul><li>Fiókadatok kezelése: email, telefonszám, Apple/Facebook/Google belépés.</li><li>Hírhasználati adatok: mentések, előzmények, érdeklődési témák.</li><li>Helyi hírekhez használt hozzávetőleges helyadatok.</li><li>Előfizetési státusz kezelése az Apple vagy Google áruházon keresztül.</li></ul><p>A prototípus jelenleg nem küld valódi regisztrációs adatot külső szerverre.</p><button class="primary-button" data-auth-action="welcome">Vissza az üdvözlő oldalra</button></section>`);
  }

  function securitySheet(){
    ensureAuthStyle();
    const auth=authState();
    openSheet('Kétlépcsős védelem','Fiókbiztonság',`<section class="auth-screen"><div class="settings-group"><button class="settings-row" data-auth-action="toggle-2fa"><span class="row-icon">✦</span><span class="row-copy"><strong>Kétlépcsős azonosítás</strong><small>${auth.twoFactor?'Bekapcsolva':'Kikapcsolva'}</small></span><span class="toggle ${auth.twoFactor?'on':''}"></span></button>${settingRow(['#','Helyreállító kódok','Későbbi appfunkció','auth-recovery'])}</div><p class="auth-note">Email/telefon regisztrációnál ezt alapból érdemes bekapcsolva tartani.</p></section>`);
  }

  function connectedSheet(){
    ensureAuthStyle();
    const auth=authState();
    openSheet('Kapcsolt fiókok','Belépési módok',`<section class="auth-screen"><div class="settings-group"><div class="settings-row static-row"><span class="row-icon">A</span><span class="row-copy"><strong>Apple</strong><small>${auth.provider==='Apple'?'Kapcsolva':'Nincs kapcsolva'}</small></span></div><div class="settings-row static-row"><span class="row-icon">f</span><span class="row-copy"><strong>Facebook</strong><small>${auth.provider==='Facebook'?'Kapcsolva':'Nincs kapcsolva'}</small></span></div><div class="settings-row static-row"><span class="row-icon">G</span><span class="row-copy"><strong>Google</strong><small>${auth.provider==='Google'?'Kapcsolva':'Nincs kapcsolva'}</small></span></div><div class="settings-row static-row"><span class="row-icon">@</span><span class="row-copy"><strong>Email / telefon</strong><small>${auth.email||auth.phone?'Beállítva':'Nincs beállítva'}</small></span></div></div></section>`);
  }

  function plansSheet(){
    ensureAuthStyle();
    ensureSubscriptionStyle();
    openSheet('Próbaidő és csomagok','Nincs fizetés most',`<section class="auth-screen"><div class="plan-hero"><div class="welcome-brand"><img src="assets/brand/hirbeszed-mark-light.svg" alt=""><div class="welcome-wordmark"><span>Hír</span>beszéd</div></div><div class="auth-kicker">14 NAPOS PRÓBA</div><h1>Kezdd el ingyen, előfizetés nélkül.</h1><p>Most csak a próbaidőt indítjuk. A próba lejártakor ugyanez az oldal segít majd eldönteni, hogy Alap vagy Pro csomaggal folytatod.</p></div><div class="plan-list-v4"><button class="plan-choice selected" data-onboarding-plan="trial"><span class="choice-dot">✓</span><span class="choice-copy"><em>ALAPÉRTELMEZETT</em><strong>Próbaidő megkezdése</strong><small>14 napig kipróbálhatod az appot fizetés nélkül. A felolvasó, hírfolyam, mentések és asszisztens tesztelhető.</small></span><b class="choice-price">0 Ft</b></button><button class="plan-choice" data-onboarding-plan="basic"><span class="choice-dot"></span><span class="choice-copy"><strong>Hírbeszéd Alap</strong><small>1500 Ft/hó. Rendszerhangos felolvasás, Felolvasó nézet, RSS hírfolyam, mentett hírek, előzmények és alap asszisztens.</small></span><b class="choice-price">1500 Ft/hó</b></button><button class="plan-choice" data-onboarding-plan="pro"><span class="choice-dot"></span><span class="choice-copy"><em>PRÉMIUM HANG</em><strong>Hírbeszéd Pro</strong><small>3500 Ft/hó. Minden Alap funkció, természetesebb AI-felolvasás és havi 240 perc Pro hangkeret. Ha elfogy, a felolvasás automatikusan visszavált az Alap rendszerhangra.</small></span><b class="choice-price">3500 Ft/hó</b></button></div><div class="plan-note-box">A fizetés a végleges appban az Apple App Store vagy a Google Play biztonságos rendszerén keresztül történik. A próba indításához most nem kérünk fizetési döntést.</div><button class="primary-button coral-button" data-onboarding-plan="trial">Próbaidő indítása</button></section>`);
  }

  function resetSheet(){
    ensureAuthStyle();
    openSheet('Prototípusadatok törlése','Első indítás újrajátszása',`<section class="auth-screen"><div class="reset-warning"><span class="auth-badge">↺</span><h1>Újrakezdjük a prototípust?</h1><p>Töröljük a mentett állapotot, majd megjelenik a brandelt nyitóképernyő, a regisztráció, az adatvédelmi elfogadás és az előfizetés-választó folyamat.</p></div><button class="danger-button" data-auth-action="confirm-reset-prototype">Törlés és első indítás indítása</button><button class="secondary-button" data-action="close-sheet">Mégsem</button></section>`);
  }

  function validatePrivacy(){
    const box=document.querySelector('#privacyAccepted');
    if(box&&box.checked){
      onboardingState().privacyAccepted=true;
      saveState();
      return true;
    }
    if(onboardingState().required){
      toast('Az adatvédelmi tájékoztatót el kell fogadni');
      return false;
    }
    return true;
  }

  function completeAuth(){
    const onboarding=onboardingState();
    if(onboarding.required){
      onboarding.authDone=true;
      onboarding.introSeen=true;
      saveState();
      plansSheet();
      return;
    }
    accountSheet();
  }

  function startCarExperience(withSpeech){
    safeStopSpeech(false);
    state.route='car';
    state.autoNext=true;
    state.mic=true;
    saveState();
    render();
    setTimeout(function(){
      patchProOfferCard();
      if(withSpeech){
        try{speakCurrent();}
        catch(e){state.playing=true;renderCar();patchProOfferCard();}
      }
    },250);
  }

  function completeOnboarding(plan){
    const onboarding=onboardingState();
    const selectedPlan=plan==='trial'?'basic':plan;
    state.subscription={...(state.subscription||{}),status:'trial',plan:selectedPlan,trialDays:14,aiMinutesUsed:0,aiMinutesLimit:selectedPlan==='pro'?240:0,proPreviewAvailable:true,proPreviewRemaining:3,proPreviewActive:false};
    onboarding.required=false;
    onboarding.introSeen=true;
    onboarding.authDone=true;
    onboarding.subscriptionDone=true;
    onboarding.completed=true;
    onboarding.proOfferAvailable=plan!=='pro';
    state.route='car';
    state.autoNext=true;
    state.mic=true;
    state.playing=false;
    saveState();
    enterNormalApp(true);
    toast(plan==='trial'?'A 14 napos próba elindult':(selectedPlan==='pro'?'Pro':'Alap')+' csomag kiválasztva');
  }

  function resetPrototypeData(){
    const fresh={route:'car',sort:'latest',category:'fresh',theme:'system',mic:true,autoNext:true,playing:false,carIndex:0,assistantMode:'voice',read:[],saved:[],history:[],notifications:true,location:false,mobileData:true,subscription:{status:'inactive',plan:'basic',trialDays:14,aiMinutesUsed:0,aiMinutesLimit:0,proPreviewAvailable:true,proPreviewRemaining:3,proPreviewActive:false},auth:{loggedIn:false,name:'',email:'',phone:'',provider:'',twoFactor:false},onboarding:{required:true,introSeen:false,authDone:false,subscriptionDone:false,rssDone:false,privacyAccepted:false,proOfferAvailable:true,completed:false}};
    localStorage.setItem(STORE,JSON.stringify(fresh));
    sessionStorage.removeItem(LAUNCH);
    setOnboardingLayout(true);
    closeOnboardingSheet();
    toast('Prototípusadatok törölve');
    setTimeout(function(){location.reload();},250);
  }

  function patchProOfferCard(){
    const onboarding=onboardingState();
    if(!onboarding.proOfferAvailable||state.route!=='car'||state.subscription&&state.subscription.plan==='pro')return;
    const controls=document.querySelector('.car-controls');
    if(!controls||document.querySelector('[data-onboarding-pro-preview]'))return;
    const card=document.createElement('button');
    card.type='button';
    card.className='pro-sample-card';
    card.dataset.onboardingProPreview='true';
    card.innerHTML='<span class="pro-sample-icon">✦</span><span><strong>Próbáld ki a Pro hangot</strong><small>Egyszeri prototípus ajánlat · 3 hír prémium AI-felolvasással</small></span><b>3 hír ›</b>';
    controls.before(card);
  }

  function renderSettingsV3(){
    const items=settingsItems().map(function(item){return item[3]==='account'?['♙','Fiók és biztonság',statusLabel(),'account']:item;});
    setHeader('Beállítások');
    view.innerHTML=`<div class="settings-group subscription-entry">${settingRow(['✦','Előfizetés',subscriptionLabel(),'subscription'])}</div><div class="settings-group">${items.slice(0,4).map(settingRow).join('')}</div><div class="settings-group">${items.slice(4,7).map(settingRow).join('')}</div><div class="settings-group">${settingRow(items[7])}</div><div class="settings-group">${settingRow(['↺','Prototípusadatok törlése','Regisztráció és első indítás tesztelése','reset-prototype'])}</div>`;
  }

  if(typeof renderSettings==='function'){
    renderSettings=renderSettingsV3;
  }

  if(typeof settingsSheet==='function'){
    const previousSettingsSheet=settingsSheet;
    settingsSheet=function(type){
      if(type==='account')return accountSheet();
      if(type==='reset-prototype')return resetSheet();
      return previousSettingsSheet.apply(this,arguments);
    };
  }

  if(typeof renderCar==='function'&&!renderCar.__proOfferPatch){
    const previousRenderCar=renderCar;
    renderCar=function(){
      const result=previousRenderCar.apply(this,arguments);
      patchProOfferCard();
      return result;
    };
    renderCar.__proOfferPatch=true;
  }

  document.addEventListener('change',function(event){
    if(event.target&&event.target.id==='privacyAccepted'){
      onboardingState().privacyAccepted=event.target.checked;
      saveState();
    }
  },true);

  document.addEventListener('click',function(event){
    const route=event.target.closest('[data-route]');
    if(route){
      event.preventDefault();
      event.stopImmediatePropagation();
      if(onboardingState().required){
        setOnboardingLayout(true);
        welcomeSheet();
        return;
      }
      safeStopSpeech(false);
      state.route=route.dataset.route;
      sheet.classList.remove('open');
      sheet.setAttribute('aria-hidden','true');
      saveState();
      render();
      return;
    }

    const setting=event.target.closest('[data-setting="reset-prototype"]');
    if(setting){
      event.preventDefault();
      event.stopImmediatePropagation();
      resetSheet();
      return;
    }

    const preview=event.target.closest('[data-onboarding-pro-preview]');
    if(preview){
      event.preventDefault();
      event.stopImmediatePropagation();
      onboardingState().proOfferAvailable=false;
      if(state.subscription){
        state.subscription.proPreviewActive=true;
        state.subscription.proPreviewRemaining=3;
      }
      saveState();
      renderCar();
      toast('A következő 3 hírt Pro hanggal hallod');
      return;
    }

    const plan=event.target.closest('[data-onboarding-plan]');
    if(plan){
      event.preventDefault();
      event.stopImmediatePropagation();
      completeOnboarding(plan.dataset.onboardingPlan);
      return;
    }

    const authAction=event.target.closest('[data-auth-action]');
    if(authAction){
      event.preventDefault();
      event.stopImmediatePropagation();
      const action=authAction.dataset.authAction;
      const auth=authState();
      if(action==='welcome')welcomeSheet();
      if(action==='choose-register'){
        if(!validatePrivacy())return;
        onboardingState().introSeen=true;
        saveState();
        registerSheet();
      }
      if(action==='login'){
        onboardingState().introSeen=true;
        saveState();
        loginSheet();
      }
      if(action==='register'){
        onboardingState().introSeen=true;
        saveState();
        registerSheet();
      }
      if(action==='privacy')privacySheet();
      if(action==='forgot')forgotSheet();
      if(action==='start-login'){
        if(onboardingState().required&&!validatePrivacy())return;
        const value=document.querySelector('#authLoginId')&&document.querySelector('#authLoginId').value.trim()||'minta@hirbeszed.hu';
        if(value.indexOf('@')>-1)auth.draftEmail=value;else auth.draftPhone=value;
        auth.pendingMode='login';
        saveState();
        twoFactorSheet('login');
      }
      if(action==='start-register'){
        if(!validatePrivacy())return;
        auth.draftName=document.querySelector('#authRegName')&&document.querySelector('#authRegName').value.trim()||'Hírbeszéd felhasználó';
        auth.draftEmail=document.querySelector('#authRegEmail')&&document.querySelector('#authRegEmail').value.trim()||'minta@hirbeszed.hu';
        auth.draftPhone=document.querySelector('#authRegPhone')&&document.querySelector('#authRegPhone').value.trim()||'+36 30 000 0000';
        auth.pendingMode='register';
        saveState();
        twoFactorSheet('register');
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
        completeAuth();
      }
      if(action==='resend-2fa')toast('Új kód elküldve a prototípusban');
      if(action==='social-apple'||action==='social-facebook'||action==='social-google'){
        if(onboardingState().required&&!validatePrivacy())return;
        const provider=action==='social-apple'?'Apple':action==='social-facebook'?'Facebook':'Google';
        auth.loggedIn=true;
        auth.name=provider+' felhasználó';
        auth.email=provider.toLowerCase()+'@hirbeszed.hu';
        auth.provider=provider;
        auth.twoFactor=false;
        onboardingState().introSeen=true;
        saveState();
        toast(provider+' belépés kész');
        completeAuth();
      }
      if(action==='send-reset'){
        toast('Visszaállító link elküldve');
        loginSheet();
      }
      if(action==='toggle-2fa'){
        auth.twoFactor=!auth.twoFactor;
        saveState();
        securitySheet();
      }
      if(action==='logout'){
        auth.loggedIn=false;
        auth.provider='';
        saveState();
        toast('Kijelentkezve');
        accountSheet();
      }
      if(action==='confirm-reset-prototype')resetPrototypeData();
      return;
    }

    const authSetting=event.target.closest('[data-setting^="auth-"]');
    if(authSetting){
      event.preventDefault();
      event.stopImmediatePropagation();
      const type=authSetting.dataset.setting;
      if(type==='auth-security')securitySheet();
      else if(type==='auth-accounts')connectedSheet();
      else toast('Profiladatok szerkesztése későbbi prototípuslépés');
      return;
    }
  },true);

  function enforceStartup(){
    const onboarding=onboardingState();
    if(onboarding.required){
      setOnboardingLayout(true);
      safeStopSpeech(false);
      state.route='car';
      state.autoNext=true;
      state.mic=true;
      saveState();
      if(onboarding.authDone&&onboarding.subscriptionDone&&!onboarding.rssDone&&typeof window.hirbeszedShowOnboardingSources==='function')window.hirbeszedShowOnboardingSources();
      else if(onboarding.authDone&&!onboarding.subscriptionDone)plansSheet();
      else if(onboarding.introSeen)registerSheet();
      else welcomeSheet();
      return;
    }
    setOnboardingLayout(false);
    if(authState().loggedIn&&isSubscriptionReady()&&!sessionStorage.getItem(LAUNCH)){
      sessionStorage.setItem(LAUNCH,'1');
      startCarExperience(true);
      return;
    }
    patchProOfferCard();
  }

  setTimeout(enforceStartup,0);
})();
