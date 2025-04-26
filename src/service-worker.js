const CACHE_NAME = "cookBook-cache-v2";
const CACHE_LIST = [
  // HTML
  '/',
  '/index.html',
  '/about/',
  '/about/index.html',
  '/recipes/',
  '/recipes/index.html',
  '/recipes/coconut-lentil-soup/',
  '/recipes/coconut-lentil-soup/index.html',
  '/recipes/courgette-lemon-risotto/',
  '/recipes/courgette-lemon-risotto/index.html',
  '/recipes/simple-brownies/',
  '/recipes/simple-brownies/index.html',
  
  // Images
  '/img/logo.png',
  '/img/about.jpg',
  '/img/recipes/Hw4lLIF710-600.webp',
  '/img/recipes/Hw4lLIF710-1500.webp',
  '/img/recipes/kk0ALpp14--600.webp',
  '/img/recipes/kk0ALpp14--1500.webp',
  '/img/recipes/og2H_Z0nue-600.webp',
  '/img/recipes/og2H_Z0nue-1500.webp',
  '/img/recipes/sL5cvFkoGl-600.webp',
  '/img/recipes/sL5cvFkoGl-1500.webp',
  '/img/recipes/upsideDownBrownies.jpg'
];

//Better looking offline message
const OFFLINE_RESPONSE = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>Offline | Cook Book</title>
  <style>
    body { text-align: center; background-color: rgb(255, 233, 169); }
  </style>
</head>
<body>
  <img src="/img/logo.png" alt="Cook Book Logo">
  <h1>Welcome to your Online Cook Book</h1>
  <p>We can't show this page while offline.</p>
  <p>Please reconnect to see your delicious healthy recipes.</p>
  <button onclick="window.location.href='/'">Return to Home</button>
</body>
</html>
`;
//Cache files
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(CACHE_LIST))
      .then(() => self.skipWaiting())
  );
});
//Change the Simple Brownies picture with an upside one
self.addEventListener('fetch', event => {
  // Handle image swap
  if (event.request.url.includes('/img/recipes/sL5cvFkoGl-1500.webp') ||
  event.request.url.includes('/img/recipes/sL5cvFkoGl-600.webp')) {
    //"return event.respondwith" Prevents double calls since "return event.respondwith" is called twice in one event listener
    return event.respondWith(
      caches.match('/img/recipes/upsideDownBrownies.jpg')
        .then(cached => cached || fetch('/img/recipes/upsideDownBrownies.jpg'))
    );
  }

//Chosen startegy: Cache, falling back to network since website content won't be changing, and no need to cache everything
  event.respondWith(
    caches.match(event.request)
      .then(response => response || fetch(event.request))
      .catch(() => new Response(OFFLINE_RESPONSE, {
        headers: { 'Content-Type': 'text/html' }
      }))
  );
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys()
      .then(keys => Promise.all(
        keys.map(key => {
          if (key !== CACHE_NAME && key.startsWith('cookBook-cache')) {
            return caches.delete(key);
          }
        })
      ))
  );
});