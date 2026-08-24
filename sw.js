'use strict';

// IMPORTANTE: bumpear este valor (calc-vN) cada vez que cambie CUALQUIER archivo en
// ARCHIVOS_CACHE — de lo contrario los usuarios quedan con la versión vieja cacheada
// indefinidamente, sin mecanismo de recuperación.
var CACHE_NAME = 'calc-v4';
var ARCHIVOS_CACHE = [
  './',
  './index.html',
  './styles.css',
  './calc.js',
  './app.js',
  './manifest.json',
  './icons/icon-192.svg',
  './icons/icon-512.svg',
  './icons/icon-192.png',
  './icons/icon-512.png'
];

self.addEventListener('install', function (evento) {
  evento.waitUntil(
    caches.open(CACHE_NAME).then(function (cache) {
      return cache.addAll(ARCHIVOS_CACHE);
    })
  );
  self.skipWaiting();
});

self.addEventListener('activate', function (evento) {
  evento.waitUntil(
    caches.keys().then(function (nombres) {
      return Promise.all(
        nombres
          .filter(function (nombre) { return nombre !== CACHE_NAME; })
          .map(function (nombre) { return caches.delete(nombre); })
      );
    })
  );
  self.clients.claim();
});

self.addEventListener('fetch', function (evento) {
  if (evento.request.method !== 'GET') return;
  evento.respondWith(
    caches.match(evento.request).then(function (respuestaCache) {
      return respuestaCache || fetch(evento.request);
    })
  );
});
