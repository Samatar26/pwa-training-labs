;(function() {
  'use strict'

  // TODO 2.1 - Cache static assets on install
  const APP_CACHE = 'static-cache'
  const urlsToCache = ['.', 'index.html', 'styles/main.css']

  self.addEventListener('install', event => {
    event.waitUntil(
      caches.open(APP_CACHE).then(cache => cache.addAll(urlsToCache))
    )
  })
  // TODO 2.2 - Fetch from the cache
  self.addEventListener('fetch', event => {
    event.respondWith(
      caches
        .match(event.request)
        .then(response => response || fetchAndCache(event.request))
    )
  })

  function fetchAndCache(url) {
    return fetch(url)
      .then(res => {
        if (!res.ok) throw Error(res.statusText)
        return caches.open(APP_CACHE).then(cache => {
          cache.put(url, res.clone())
          return response
        })
      })
      .catch(err => console.log('Request failed: ', err))
  }
})()
