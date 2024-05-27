/// <reference types="@sveltejs/kit" />
import { build, files, version } from '$service-worker';

const CACHE = `cache-${version}`;

const ASSETS = [
    ...build, // the app itself
    ...files  // everything in `static`
];

self.addEventListener('install', (event) => {
    // Create a new cache and add all files to it
    async function addFilesToCache() {
        const cache = await caches.open(CACHE);
        await cache.addAll(ASSETS);
    }

    event.waitUntil(addFilesToCache());
});

self.addEventListener('activate', (event) => {
    async function deleteOldCache() {
        for (const key of await caches.keys()) {
            if (key !== CACHE) await caches.delete(key);
        }
    }
    event.waitUntil(deleteOldCache())
});

self.addEventListener('fetch', (event) => {
    async function respond() {
        const url = new URL(event.request.url);
        const cache = await caches.open(CACHE);

        if (ASSETS.includes(url.pathname)) {
            return cache.match(event.request)
        }

        try {
            // Ignore chrome-extension URLs
            if (url.protocol === 'chrome-extension:') {
                throw new Error('Unsupported protocol');
            }

            const response = await fetch(event.request);
            if (response.status == 200) {
                cache.put(event.request, response.clone());
            }
            return response;
        } catch {
            return cache.match(event.request);
        }
    }

    event.respondWith(respond());
});