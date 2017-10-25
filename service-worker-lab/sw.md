### Service worker lifecycle

To install a service worker, you need to register it in your main JavaScript code. Registration tells the browser where your service worker is located, and to start installing it in the background. For example, you could include a <script> tag in your site’s index.html file (or whatever file you use as your application’s entry point) with code similar to the one shown here.

```js
if (!('serviceWorker' in navigator)) {
  console.log('Service Worker not supported');
  return;
}
navigator.serviceWorker.register('/service-worker.js')
.then(function(registration) {
  console.log('SW registered! Scope is:', registration.scope);
}); // .catch a registration error

```

The SW scope determines from which path the SW will intercept requests. The default scope is the path to the service worker file and extends to all lower directories.

```js
navigator.serviceWorker.register('/service-worker.js', {
  scope: '/app'
})
```

This event will trigger if the browser considers the service worker to be new, either because this is the first service worker encountered for this page, or because there is a byte difference between the current service worker and the previously installed one.

We can add an install event handler to perform actions during the install event.

The install event is a good time to do stuff like caching the App Shell or static assets using the Cache API.

```js
self.addEventListener('install', (event) => {
  // Good to cache your static assets at this point.
  // self.skipWaiting?
  ///do stuff during install
})
```

After it successfully install, we' activate it. Only one SW can be active at a time for a given scope. Once activated, the service worker will control all pages that load within its scope, and intercept corresponding network requests.

However the pages in your app that are open will not be under the service worker’s scope since the service worker was not loaded when the pages opened. To put currently open pages under service worker control you must reload the page or pages. Until then, requests from this page will bypass the service worker and operate like they normally would.
```js
self.addEventListener('activate', (event)=> {
  // Good to update any of your cache
})
```

A fetch event is fired every time a resource is requested. In this example we listen for the fetch event, and instead of going to the network, return the requested resource from the cache (assuming it is there).
```js
self.addEventListener('fetch',
function(event) {
  event.respondWith(
    caches.match(event.request)
  );
});
```

###PWA architecture
Migrating an existing site to PWA:
- Move to HTTPS
- Use caching strategies for perf and offline
- Implement an app shell architecture
- Incorporate "Add to Homescreen"
- Add Push notifications, Payment API, Credentials API, etc. (if relevant)

The application shell is the static assets that you want to load first. Cached shell loads instantly on repeat visits. So you have the outer app shell and the dynamic content model.

## Architectural patterns and caching strategies

- SSR
  - Server returns a complete page
  - Page loads CSS, JavaScript and all content
  - Page updates reload the DOM
- CSR
  - Server returns "template page" with CSS & JS
  - JS makes request to get content, adds to page
  - Page updates reload only the dynamic content
- Caching SSR
  - Cache common files: CSS, JS, common images
  - for offline use
    - If Server renders static pages, cache them
    - Add code for offline mod
    - Use if(navigator.offline)
- Caching CSR
  - Cache core code, CSS, and template page
  - Add code to:
    - Cache data using Cache API or indexedDB
    - Detect when app is offline and save user actions for later replay

### Caching strategies
You can cache the application shell on install. The basic navigation, the look and feel of a UI.

Event.waituntil, you make sure that all our cache has been added clientside. Skipwaiting method forces any new SW to be the active one.

Using indexedDB:
```js
var dbPromise = idb.open('test-db', 1, function(upgradeDb) {   if (!upgradeDb.objectStoreNames.contains('people')) {     var peopleOS = upgradeDb.createObjectStore('people')     peopleOS.createIndex('email', 'email', {unique: true});   }
});


dbPromise.then(function(db) {
  var tx = db.transaction(['people'], 'readonly');
  var store = tx.objectStore('people');
  return store.get('Fred');
});
```

### Push notifications
Push notifications use the following 2 apis:
- Notifications API
- Push API

Push API:
- User subscribes to push messaging: the push service used by the browser returns data to enable you to send messages to the user.
- your app saves user data to your server
- send a push message from your server to the user via the push service
- the user's app handles the push message in a service worker
