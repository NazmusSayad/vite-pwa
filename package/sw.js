const preCache = 'preCache'
const runtimeCache = 'runtimeCache'
const assets = [preCacheFiles]

self.addEventListener('activate', evt => {
  evt.waitUntil(
    caches
      .keys()
      .then(keys => Promise.all(keys.map(key => caches.delete(key))))
      .then(() => caches.open(preCache).then(cache => cache.addAll(assets)))
  )
})

self.addEventListener('fetch', evt => {
  if (evt.request.url.startsWith(location.origin)) {
    evt.respondWith(
      caches.match(evt.request).then(cacheRes => {
        return (
          cacheRes ||
          fetch(evt.request).then(fetchRes => {
            return caches.open(runtimeCache).then(cache => {
              cache.put(evt.request.url, fetchRes.clone())
              return fetchRes
            })
          })
        )
      })
    )
  }
})
