const staticCacheName = "static-site-v2";
const dynamicCacheName = 'site-dynamic-v2';
const assets = [
    '/',
    '/index.html',
    '/js/app.js',
    '/js/ui.js',
    '/js/materialize.min.js',
    '/css/style.css',
    '/css/materialize.min.css',
    '/img/dish.png',
    'https://fonts.googleapis.com/icon?family=Material+Icons',
    'https://fonts.gstatic.com/s/materialicons/v47/flUhRq6tzZclQEJ-Vdg-IuiaDsNcIhQ8tQ.woff2',
    '/pages/fallback.html'
]

 
const limitCacheSize = (name, size) => {
    caches.open(name).then( cache => {
        cache.keys().then(keys => {
            if(keys.length > size){
                cache.delete(keys[0]).then(limitCacheSize(name,size))
            }
        })
    })
}

//install service worker
self.addEventListener('install', event => {
    //console.log("Service Worker has been installed successfully")
    event.waitUntil(caches.open(staticCacheName)
    .then((cache) => {
        cache.addAll(assets)
    }))   
})

//activate service worker
 self.addEventListener('activate', (event) => {
     //console.log("Service worker has been activated")
     event.waitUntil(
         caches.keys().then(keys => {
             //console.log(keys)
             return Promise.all(keys.filter(key => key !== staticCacheName && key !== dynamicCacheName)
             .map(key => caches.delete(key)))
         })
     )
 })

 //Fetch events
 self.addEventListener('fetch', (event) => {
    if(event.request.url.indexOf('firestore.googleapis.com') === -1){
        event.respondWith(
            caches.match(event.request)
            .then(cacheres => {
                return cacheres || fetch(event.request).then(fetchRes => {
                    return caches.open(dynamicCacheName).then(cache => {
                        cache.put(event.request.url, fetchRes.clone())
                        limitCacheSize(dynamicCacheName, 3)
                        return fetchRes
                    })
                });
            }).catch(() => {
                if(event.request.url.indexOf('.html') > -1){
                   return caches.match('/pages/fallback.html')
                }
            })
        );
    }
    
 })