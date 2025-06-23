const CACHE_NAME = 'excel-analyzer-v1';
const CACHE_URLS = [
    '/',
    //'/static/style.css',
    'https://cdn.jsdelivr.net/particles.js/2.0.0/particles.min.js',
    'https://cdn.plot.ly/plotly-2.27.0.min.js'
];

// Service Worker 安装时缓存必要的文件
self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => {
                // console.log('正在缓存文件');
                return cache.addAll(CACHE_URLS);
            })
    );
});

// 当发现新版本时删除旧缓存
self.addEventListener('activate', event => {
    event.waitUntil(
        caches.keys().then(cacheNames => {
            return Promise.all(
                cacheNames.map(cacheName => {
                    if (cacheName !== CACHE_NAME) {
                        return caches.delete(cacheName);
                    }
                })
            );
        })
    );
});

// 处理资源请求
self.addEventListener('fetch', event => {
    event.respondWith(
        caches.match(event.request)
            .then(response => {
                // 如果在缓存中找到响应，则返回缓存的响应
                if (response) {
                    return response;
                }

                // 克隆请求，因为请求只能使用一次
                const fetchRequest = event.request.clone();

                // 尝试从网络获取资源
                return fetch(fetchRequest)
                    .then(response => {
                        // 检查是否收到有效的响应
                        if (!response || response.status !== 200 || response.type !== 'basic') {
                            return response;
                        }

                        // 克隆响应，因为响应只能使用一次
                        const responseToCache = response.clone();

                        // 将新响应添加到缓存
                        caches.open(CACHE_NAME)
                            .then(cache => {
                                cache.put(event.request, responseToCache);
                            });

                        return response;
                    })
                    .catch(() => {
                        // 如果网络请求失败，返回离线页面
                        if (event.request.mode === 'navigate') {
                            return caches.match('/');
                        }
                    });
            })
    );
}); 