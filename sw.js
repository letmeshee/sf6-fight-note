const CACHE_NAME = 'sf6-fight-note-v1';
const ASSETS_TO_CACHE = [
  './',
  './index.html',
  './assets/logo.png',
  './assets/icon.png',
  './manifest.json',
  'https://fonts.googleapis.com/css2?family=Rajdhani:wght@500;700&family=Noto+Sans+JP:wght@400;500;700&display=swap'
];

// インストール時にキャッシュ
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      return cache.addAll(ASSETS_TO_CACHE);
    })
  );
  self.skipWaiting();
});

// 古いキャッシュの削除
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys => {
      return Promise.all(
        keys.filter(key => key !== CACHE_NAME).map(key => caches.delete(key))
      );
    })
  );
  self.clients.claim();
});

// ネットワーク優先、失敗時にキャッシュから返す
self.addEventListener('fetch', event => {
  event.respondWith(
    fetch(event.request)
      .then(response => {
        // 成功したらキャッシュを更新
        const responseClone = response.clone();
        caches.open(CACHE_NAME).then(cache => {
          cache.put(event.request, responseClone);
        });
        return response;
      })
      .catch(() => {
        // オフライン時はキャッシュから返す
        return caches.match(event.request);
      })
  );
});
