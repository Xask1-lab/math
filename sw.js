/* Сервіс-воркер «Математика у клітинку»
   - файли програми кешуються при встановленні → працює без інтернету;
   - шрифти Google і бібліотека для PNG (cdnjs) кешуються при першому завантаженні;
   - нова версія не вмикається сама: сторінка показує повідомлення «Оновити / Пізніше»
     і надсилає SKIP_WAITING, коли користувач погодиться;
   - щоб користувачі отримали оновлення, змініть VERSION. */
const VERSION = 'math-v8';
const APP = ['./', 'index.html', 'manifest.webmanifest',
  'icons/icon-192.png', 'icons/icon-512.png', 'icons/icon-maskable-512.png', 'icons/apple-touch-icon.png'];

// Встановлення: кладемо файли програми в кеш і чекаємо згоди користувача
self.addEventListener('install', e => {
  e.waitUntil(caches.open(VERSION).then(c => c.addAll(APP)));
});

// Сторінка просить увімкнути нову версію
self.addEventListener('message', e => {
  if (e.data && e.data.type === 'SKIP_WAITING') self.skipWaiting();
});

// Активація: видаляємо кеші старих версій
self.addEventListener('activate', e => {
  e.waitUntil(caches.keys()
    .then(keys => Promise.all(keys.filter(k => k !== VERSION).map(k => caches.delete(k))))
    .then(() => self.clients.claim()));
});

self.addEventListener('fetch', e => {
  const req = e.request;
  if (req.method !== 'GET') return;
  // перевірка оновлень (cache: 'no-store') — завжди напряму з мережі
  if (req.cache === 'no-store') return;
  const url = new URL(req.url);

  // Сторінка: спершу мережа (щоб бачити свіжу версію), без мережі — кеш
  if (req.mode === 'navigate') {
    e.respondWith(fetch(req).then(r => {
      const copy = r.clone(); caches.open(VERSION).then(c => c.put('index.html', copy)); return r;
    }).catch(() => caches.match('index.html')));
    return;
  }

  // Шрифти Google, бібліотеки з cdnjs та власні файли: спершу кеш, потім мережа (і докладаємо в кеш)
  if (url.origin === location.origin || /fonts\.(googleapis|gstatic)\.com$|cdnjs\.cloudflare\.com$/.test(url.hostname)) {
    e.respondWith(caches.match(req).then(hit => hit || fetch(req).then(r => {
      if (r.ok || r.type === 'opaque') { const copy = r.clone(); caches.open(VERSION).then(c => c.put(req, copy)); }
      return r;
    })));
  }
});
