/**
 * sw.js — Service Worker
 * Sabana Farma
 * Fase 6: estrategia de cache corregida
 *
 * ESTRATEGIA POR TIPO DE ARCHIVO:
 *   Cache First  → CSS, fuentes, íconos, imágenes (cambian poco)
 *   Network First → HTML (el usuario siempre ve la versión más reciente)
 *   Stale-While-Revalidate → JS de datos (catálogo, precios)
 *     El cliente carga inmediato desde cache y el SW actualiza en background.
 *     Garantiza que la próxima visita tiene precios actualizados.
 *
 * IMPORTANTE: nunca usar Cache First para productos-data.js ni promo-dia.js
 * porque los precios y las promociones cambian frecuentemente.
 */

'use strict';

var CACHE_VERSION   = 'sf-v10'; /* v10: precios corregidos, sabores, pagos Nequi/Daviplata, horario 8-8, GA4 */
var CACHE_STATIC    = CACHE_VERSION + '-static';
var CACHE_DATA      = CACHE_VERSION + '-data';
var CACHE_PAGES     = CACHE_VERSION + '-pages';

/* Archivos que se pre-cachean al instalar el SW */
var PRECACHE_STATIC = [
  '/css/estilos.css',
  '/img/icono.jpg',
  '/img/favicon.ico',
  '/manifest.json',
];

/* Páginas HTML — Network First (siempre frescas) */
var HTML_PAGES = [
  '/',
  '/index.html',
  '/productos.html',
  '/promociones.html',
  '/afiliaciones.html',
  '/contacto.html',
  '/politica-datos.html',
];

/* Archivos JS de datos — Stale-While-Revalidate */
var DATA_JS = [
  '/js/productos-data.js',
  '/js/top-ventas-data.js',
  '/js/top-ventas-imagenes.js',
  '/js/promo-dia.js',
  '/js/promociones-data.js',
];

/* ── Instalación: pre-cachear estáticos ── */
self.addEventListener('install', function (event) {
  event.waitUntil(
    caches.open(CACHE_STATIC).then(function (cache) {
      return cache.addAll(PRECACHE_STATIC);
    }).then(function () {
      return self.skipWaiting();
    })
  );
});

/* ── Activación: limpiar caches viejos ── */
self.addEventListener('activate', function (event) {
  event.waitUntil(
    caches.keys().then(function (keys) {
      return Promise.all(
        keys.filter(function (k) {
          return k !== CACHE_STATIC && k !== CACHE_DATA && k !== CACHE_PAGES;
        }).map(function (k) {
          return caches.delete(k);
        })
      );
    }).then(function () {
      return self.clients.claim();
    })
  );
});

/* ── Fetch: estrategia por tipo ── */
self.addEventListener('fetch', function (event) {
  var url = new URL(event.request.url);

  /* Solo interceptar mismo origen */
  if (url.origin !== location.origin) return;

  var path = url.pathname;

  /* ── 1. HTML: Network First ── */
  var isHTML = HTML_PAGES.indexOf(path) !== -1 ||
               path === '/' || path.endsWith('.html');
  if (isHTML) {
    event.respondWith(networkFirst(event.request, CACHE_PAGES));
    return;
  }

  /* ── 2. Datos JS: Stale-While-Revalidate ── */
  var isData = DATA_JS.some(function (d) { return path.endsWith(d.replace('/js/', '')); });
  if (isData) {
    event.respondWith(staleWhileRevalidate(event.request, CACHE_DATA));
    return;
  }

  /* ── 3. Resto (CSS, imágenes, fuentes, otros JS): Cache First ── */
  event.respondWith(cacheFirst(event.request, CACHE_STATIC));
});

/* ── Estrategias ── */

function networkFirst(request, cacheName) {
  return fetch(request).then(function (response) {
    if (response && response.status === 200) {
      var clone = response.clone();
      caches.open(cacheName).then(function (cache) { cache.put(request, clone); });
    }
    return response;
  }).catch(function () {
    return caches.match(request);
  });
}

function cacheFirst(request, cacheName) {
  return caches.match(request).then(function (cached) {
    if (cached) return cached;
    return fetch(request).then(function (response) {
      if (response && response.status === 200) {
        var clone = response.clone();
        caches.open(cacheName).then(function (cache) { cache.put(request, clone); });
      }
      return response;
    });
  });
}

function staleWhileRevalidate(request, cacheName) {
  var fetchPromise = fetch(request).then(function (response) {
    if (response && response.status === 200) {
      var clone = response.clone();
      caches.open(cacheName).then(function (cache) { cache.put(request, clone); });
    }
    return response;
  });
  return caches.match(request).then(function (cached) {
    return cached || fetchPromise;
  });
}
