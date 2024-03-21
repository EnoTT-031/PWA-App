const CACHE_NAME = "vitlev-v2"; // Увеличиваем версию кэша

const urlsToCache = [
  "/index.html"
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(urlsToCache);
    })
  );
});

self.addEventListener("activate", (event) => {
  // Удаляем устаревшие кэши
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});

self.addEventListener("fetch", (event) => {
  event.respondWith(
    // Пытаемся загрузить ресурс из сети
    fetch(event.request)
      .then((networkResponse) => {
        // Клонируем сетевой ответ перед кэшированием
        const responseToCache = networkResponse.clone();

        event.waitUntil(
          caches.open(CACHE_NAME).then((cache) => {
            return cache.put(event.request, responseToCache);
          })
        );

        // Возвращаем оригинальный сетевой ответ
        return networkResponse;
        // Кэшируем сетевой ответ
      })
      .catch(() => {
        // Если сеть недоступна, пытаемся загрузить из кеша
        return caches.match(event.request);
      })
  );
});
