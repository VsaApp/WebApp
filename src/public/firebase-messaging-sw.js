/*
Give the service worker access to Firebase Messaging.
Note that you can only use Firebase Messaging here, other Firebase libraries are not available in the service worker.
*/
importScripts('https://www.gstatic.com/firebasejs/5.5.5/firebase-app.js')
importScripts('https://www.gstatic.com/firebasejs/5.5.5/firebase-messaging.js')

/*
Initialize the Firebase app in the service worker by passing in the messagingSenderId.
*/
firebase.initializeApp({'messagingSenderId': '557300294456'})

/*
Retrieve an instance of Firebase Messaging so that it can handle background messages.
*/
const messaging = firebase.messaging();

messaging.setBackgroundMessageHandler(payload => {
	const data = JSON.parse(payload.data.data);

	let title = data.weekday;
	let body = '';
	if (data.changes.length > 0) {
		body = data.changes.map(change => {
			return change.unit + '. ' + change.changed.info + ' ' + change.changed.teacher + ' ' + change.changed.room
		}).join('\n');
	} else {
		body = 'Keine Änderungen';
	}

	const notificationOptions = {
		body: body,
		icon: '/logo.png',
		badge: '/logo.png',
		data: {
			tab: 1,
			day: data.weekday
		}
	};

	return self.registration.showNotification(title, notificationOptions);
});

self.addEventListener('notificationclick', event => {
	const clickedNotification = event.notification;
	clickedNotification.close();

	const urlToOpen = new URL(self.location.origin);

	let promiseChain = clients.matchAll({
		type: 'window',
		includeUncontrolled: true
	}).then(windowClients => {
		let matchingClient = windowClients.filter(client => {
			console.log(new URL(client.url).hostname, urlToOpen.hostname);
			return new URL(client.url).hostname === urlToOpen.hostname;
		})[0];

		if (matchingClient) {
			return matchingClient.focus();
		} else {
			return clients.openWindow(urlToOpen.href + '#/' + encodeURIComponent(JSON.stringify(clickedNotification.data)));
		}
	});

	event.waitUntil(promiseChain);

	promiseChain = clients.matchAll({
		type: 'window',
		includeUncontrolled: true
	}).then(windowClients => {
		let matchingClient = windowClients.filter(client => {
			return new URL(client.url).hostname === urlToOpen.hostname;
		})[0];
		if (matchingClient) {
			console.log('Sending message to client.');
			matchingClient.postMessage(clickedNotification.data);
		}
	});

	event.waitUntil(promiseChain);
});