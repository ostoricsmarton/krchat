const cacheName = "v1";
async function impl(e) {
    let cache = await caches.open(cacheName); // Cache megnyitása, async
    let cacheResponse = await cache.match(e.request); // Lookup
    if (cacheResponse) // Ha megvan
        return cacheResponse // Visszadjuk
    else {
        let networkResponse = await fetch(e.request); // Ha nincs meg, akkor elindítjuk a tényleges hálózati lekérdezést
        cache.put(e.request, networkResponse.clone()) // Eltároljuk
        return networkResponse; // Visszadjuk
    }
}
self.addEventListener("fetch", e => e.respondWith(impl(e))); // Eseményre feliratkozás
self.addEventListener('push', function (e) {
  console.log('[Service Worker] Push esemény érkezett.');

  // 2. Üzenet tartalmának lekérése
  const message = e.data ? e.data.text() : null;

  // Ha nincs adat, nem csinálunk semmit
  if (!message) {
    console.log('[Service Worker] Üres push üzenet érkezett.');
    return;
  }

  // 3. Értesítés megjelenítése
  const title = 'Chat Notification'; // címsor
  const options = {
    body: message, // az üzenet tartalma
    icon: '/icons/icon-192.png', // opcionális ikon
    badge: '/icons/badge-72.png', // opcionális badge
    vibrate: [200, 100, 200], // opcionális rezgés minta
    data: { arrived: Date.now() } // opcionális extra adat
  };

  // showNotification visszaad egy Promise-t → e.waitUntil-lel várunk rá
  e.waitUntil(
    self.registration.showNotification(title, options)
  );
});