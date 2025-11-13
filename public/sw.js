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
async function impl(e) {
    
    if (e.data?.text() != null) // Ha megvan
        return e.data?.text() // Visszadjuk
    else {
        return "No data"; // Visszadjuk
    }
}
self.addEventListener('push', event => {
    // event.data lehet null, ezért ellenőrzés
    const payload = event.data ? event.data.text() : null;
    const title = 'Chat Notification';
    const options = {
        body: payload ?? 'No data'
        // tetszőlegesen további opciók: icon, tag, actions, stb.
    };

    // showNotification visszaad egy Promise-t, várjunk rá
    event.waitUntil(self.registration.showNotification(title, options));
});
