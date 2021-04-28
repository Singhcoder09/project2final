var cacheName = 'hello-pwa';
var filesToCache = [
  '/',
  '/views/form.pug',
  '/views/femalecollection.pug',
  '/views/index.pug',
  '/views/layout.pug',
  '/views/login.pug',
  '/views/mencollection.pug',
  '/views/register.pug',
  '/views/registranta.pug',
  '/views/thankyou.pug',
  '/public/css/style.css',
  '/public/css/login.css',
  '/routes/index.js'
];

/* Start the service worker and cache all of the app's content */
self.addEventListener('install', function(e) {
  e.waitUntil(
    caches.open(cacheName).then(function(cache) {
      return cache.addAll(filesToCache);
    })
  );
  self.skipWaiting();
});

/* Serve cached content when offline */
self.addEventListener('fetch', function(e) {
  e.respondWith(
    caches.match(e.request).then(function(response) {
      return response || fetch(e.request);
    })
  );
});