const CACHE='hirbeszed-prototype-2.001-leftnav-center';
const ASSETS=['./','./index.html','./styles.css?v=2.001-leftnav-center','./app.js?v=2.001-leftnav-center','./news.json','./assistant-prompts.json','./prototype-topics.css?v=2.001-leftnav-center','./prototype-topics.js?v=2.001-leftnav-center','./prototype-settings.css?v=2.001-leftnav-center','./prototype-settings.js?v=2.001-leftnav-center','./prototype-reader-controls.js?v=2.001-leftnav-center','./prototype-auth.js?v=2.001-leftnav-center','./prototype-onboarding.js?v=2.001-leftnav-center','./prototype-layout.js?v=2.001-leftnav-center','./prototype-auto-preview.js?v=2.001-leftnav-center','./prototype-navigation.js?v=2.001-leftnav-center','./topics.json','./manifest.webmanifest','./assets/brand/hirbeszed-mark-light.svg','./assets/brand/hirbeszed-mark-dark.svg','./assets/brand/hirbeszed-app-icon-light.svg','./assets/brand/hirbeszed-app-icon-dark.svg','./assets/prototype/budapest-tram.svg','./assets/prototype/economy-city.svg','./assets/prototype/sport-stadium.svg','./assets/prototype/technology-ai.svg'];
self.addEventListener('install',event=>event.waitUntil(caches.open(CACHE).then(cache=>cache.addAll(ASSETS)).then(()=>self.skipWaiting())));
self.addEventListener('activate',event=>event.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(key=>key!==CACHE).map(key=>caches.delete(key)))).then(()=>self.clients.claim())));
self.addEventListener('fetch',event=>{
  if(event.request.method!=='GET')return;
  const path=new URL(event.request.url).pathname;
  if(event.request.cache==='no-store'||path.endsWith('/assistant-prompts.json')||path.endsWith('/news.json')){
    const fallback=path.endsWith('/news.json')?'./news.json':'./assistant-prompts.json';
    event.respondWith(fetch(event.request).catch(()=>caches.match(fallback)));
    return;
  }
  event.respondWith(caches.match(event.request).then(cached=>cached||fetch(event.request).then(response=>{const copy=response.clone();caches.open(CACHE).then(cache=>cache.put(event.request,copy));return response;}).catch(()=>caches.match('./index.html'))));
});
