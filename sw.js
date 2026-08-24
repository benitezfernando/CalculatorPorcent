'use strict';

var CACHE_NAME = 'calc-v1';
var ARCHIVOS_CACHE = [
  './',
  './index.html',
  './styles.css',
  './calc.js',
  './app.js',
  './manifest.json',
  './icons/icon-192.svg',
  './icons/icon-512.svg'
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
