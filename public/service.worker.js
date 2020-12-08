/* eslint-disable */
importScripts('https://storage.googleapis.com/workbox-cdn/releases/3.4.1/workbox-sw.js');

if(!workbox) {
  console.error('Failed to load workbox. so failed register service worker');
}

workbox.setConfig({ debug: false });

//cache all js files
workbox.routing.registerRoute(
  (context) => {
    // return null will not cache the files
    let { url } = context;
    if(/service-worker/.test(url)) return null;
    //if(/\.(?:js|css)/.test(url)) return true;
    return null;
  },
  workbox.strategies.cacheFirst({
    cacheName: 'static-resources',
    plugins: [
      new workbox.cacheableResponse.Plugin({
        statuses: [0, 200],
      }),
    ]
  }),
);

//cache all images
workbox.routing.registerRoute(
  /\.(?:png|gif|jpg|jpeg|svg)$/,
  workbox.strategies.cacheFirst({
    cacheName: 'images',
    plugins: [
      new workbox.cacheableResponse.Plugin({
        statuses: [0, 200],
      }),
      new workbox.expiration.Plugin({
        maxAgeSeconds: 3 * 24 * 60 * 60, // 3 Days
      }),
    ],
  }),
);

// workbox.routing.registerRoute(
//   /\.json$/,
//   workbox.strategies.cacheFirst({
//     cacheName: 'glass-binaries',
//     plugins: [
//       new workbox.cacheableResponse.Plugin({
//         statuses: [0, 200],
//       }),
//       new workbox.expiration.Plugin({
//         maxAgeSeconds: 1 * 24 * 60 * 60, // 3 Days
//       }),
//     ],
//   }),
// );

const glassBinaryCache = {};
self.addEventListener('fetch', (event) => {
  if(event.request.url.includes('.json')){
    caches.open('glass-binaries').then(cache => {
      cache.match(event.request).then(response => {
        glassBinaryCache[event.request.url] = response.json();
        return response;
      }).catch(err => {
        return fetch(event.request).then(response => {
          cache.put(event.request, response.clone());
          glassBinaryCache[event.request.url] = response.clone().json();
          return response;
        });
      })
    }).catch(err => {
      return fetch(event.request).then(response => {
        glassBinaryCache[event.request.url] = response.clone().json();
        return response;
      });
    });
  }
})

self.addEventListener('message', async function(event) {
  //console.log(`Received a message from main thread:`, event.data);
  let data = {
    isCached: false,
    payload: null
  }
  const isInCache = async (url) => {
    let fullUrl = Object.keys(glassBinaryCache).find(fullUrl => fullUrl.endsWith(url));
    let cachedData = await glassBinaryCache[fullUrl];
    return cachedData;
  }
  if(event.data.url) {
    let cachedData = await isInCache(event.data.url);
    if(cachedData) {
      data = {
        isCached: true,
        payload: cachedData
      }
    }
  }
  event.ports[0].postMessage(data);
});

//firebase.initializeApp({
//  'messagingSenderId': '798180766835'
//});
//const messaging = firebase.messaging();
//cache all ajax GET Request
// workbox.routing.registerRoute(
//   ({ url }) => {
//     return /\/1\//.test(url.pathname) && url.search.indexOf('__cache=false') == -1;
//   },
//   workbox.strategies.staleWhileRevalidate({
//     cacheName: 'dynamic-cache',
//     plugins: [
//       new workbox.cacheableResponse.Plugin({
//         statuses: [0, 200],
//       })
//     ],
//   }),
//   'GET'
// );

self.addEventListener('install', (event) => {
  //update the service workers immediately when new one comes.
  event.waitUntil(self.skipWaiting());
})

self.addEventListener('push', function(event) {
  //Customize notification here
  let data = {};
  if(event.data) {
    data = event.data.json();
  }
  var notificationTitle = 'Background Message Title';
  var notificationOptions = {
    body: data.notification.body,
    icon: 'icons/icon-192x192.png',
    data: {
      url: data.notification.click_action
    }
  };

  return self.registration.showNotification(data.notification.title,
    notificationOptions);
})


self.addEventListener('notificationclick', function(event) {
  event.notification.close();

  event.waitUntil(clients.matchAll({
    type: "window"
  }).then(function(clientList) {
    for (var i = 0; i < clientList.length; i++) {
      var client = clientList[i];
      if (client.url == '/' && 'focus' in client)
        return client.focus();
    }
    if (clients.openWindow)
      return clients.openWindow(event.notification.data.url);
  }));
});
