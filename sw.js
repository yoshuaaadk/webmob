
var CACHE_STATIC_NAME = 'static-v5';
var CACHE_DYNAMIC_NAME = 'dynamic-v5';

self.addEventListener('install', function(event) {
  console.log('[Service Worker] Installing Service Worker ...', event);
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_STATIC_NAME)
    .then(function(cache) {
      console.log('[Service Worker] Precaching App Shell');
      cache.addAll([
        './',
        './index.html',
        './offline.html',
        './js/app.js',
        './js/fetch.js',
        './css/style.css',
        './css/bootstrap.min.css',
        './css/font-awesome.min.css',
        './css/elegant-icons.css',
        './css/fresco.css',
        './css/owl.carousel.min.css',
        './js/vendor/jquery-3.2.1.min.js',
        './js/bootstrap.min.js',
        './js/owl.carousel.min.js',
        './js/masonry.pkgd.min.js',
        './js/main.js',
        './js/fresco.min.js',
        './img/nasa/home.jpg',
        './img/nasa/home2.jpg',
        './img/nasa/home3.jpg',
        './img/nasa/cat-eye.jpg',
        './img/nasa/Analemma-Moon.jpg',
        './img/nasa/Venere-Mercuri.jpg',
        './img/cs.png',
        './img/lowgo.png',
        'https://fonts.googleapis.com/css?family=Poppins:300,300i,400,400i,500,500i,600,600i,700,700i&display=swap',
        'https://fonts.googleapis.com/css?family=Roboto:400,400i,700&display=swap',
        './icon-fonts/ElegantIcons.woff',
        './icon-fonts/ElegantIcons.ttf',
        './icon-fonts/fontawesome-webfont.woff2',
        './icon-fonts/fontawesome-webfont.woff?v=4.7.0',
        'https://fonts.gstatic.com/s/poppins/v9/pxiByp8kv8JHgFVrLEj6Z1xlFQ.woff2',
        'https://fonts.gstatic.com/s/poppins/v9/pxiEyp8kv8JHgFVrJJfecg.woff2',
        'https://fonts.gstatic.com/s/poppins/v9/pxiByp8kv8JHgFVrLGT9Z1xlFQ.woff2',
        'https://fonts.gstatic.com/s/roboto/v20/KFOlCnqEu92Fr1MmWUlfBBc4.woff2',
        'https://fonts.gstatic.com/s/poppins/v9/pxiEyp8kv8JHgFVrJJfecnFHGPc.woff2',
        'https://fonts.gstatic.com/s/poppins/v9/pxiByp8kv8JHgFVrLEj6Z1xlFd2JQEk.woff2'
        ]);
    })
    )
});

self.addEventListener('activate', function(event) {
  console.log('[Service Worker] Activating Service Worker ....', event);
  event.waitUntil(
    caches.keys()
    .then(function(keyList) {
      return Promise.all(keyList.map(function(key) {
        if (key !== CACHE_STATIC_NAME && key !== CACHE_DYNAMIC_NAME) {
          console.log('[Service Worker] Removing old cache.', key);
          return caches.delete(key);
        }
      }));
    })
    );
  return self.clients.claim();
});

self.addEventListener('fetch', function(event) {
  event.respondWith(
    caches.match(event.request)
    .then(function(response) {
      if (response) {
        return response;
      } else {
        return fetch(event.request)
        .then(function(res) {
          return caches.open(CACHE_DYNAMIC_NAME)
          .then(function(cache) {
            cache.put(event.request.url, res.clone());
            return res;
          })
        })
        .catch(function(err) {
            return caches.open(CACHE_STATIC_NAME)
                .then(function(cache) {
                  return cache.match('./offline.html');
                });
        });
      }
    })
    );
});
