const CACHE_NAME = "version-1";
const urlsToCache = ["index.html", "offline.html"];

const self = this;

self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then((cache) => {
                console.log('Opened cache');
                return cache.addAll(urlsToCache);
            })
    )
});

self.addEventListener("fetch", (event) => {
    event.waitUntil(
        caches
            .match(event.request)
            .then(() => {
                return fetch(event.request);
            })
            .catch((err) => caches.match("offline.html"))
    );
});
self.addEventListener("activate", (event) => {
    const cacheWhiteList = [];
    cacheWhiteList.push(CACHE_NAME);

    event.waitUntil(
        caches.keys().then((cacheNames) => Promise.all(cacheNames.map((name) => {
            if (!cacheWhiteList.includes(name)) {
                return caches.delete(name);
            }
        })))
    );
});
