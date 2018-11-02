importScripts('https://storage.googleapis.com/workbox-cdn/releases/3.6.3/workbox-sw.js');

workbox.routing.registerRoute(
	new RegExp(/\/vp\/(today|tomorrow)\/.+/g),
	workbox.strategies.networkFirst({
		plugins: [{
			requestWillFetch: async ({request}) => {
				new Request(request.url + '?v=' + Math.round((new Date()).getTime() / 1000), {
					method: request.method,
					headers: request.headers,
					body: body,
					referrer: request.referrer,
					referrerPolicy: request.referrerPolicy,
					mode: request.mode,
					credentials: request.credentials,
					cache: request.cache,
					redirect: request.redirect,
					integrity: request.integrity,
				})
			}
		}]
	})
);