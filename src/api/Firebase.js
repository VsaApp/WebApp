import {firebase} from '@firebase/app';
import '@firebase/messaging';
import cookie from 'react-cookies';

const config = {
	apiKey: 'AIzaSyDlTjIPVZMhm7ChrGpCA2xNxe-r93bF0WY',
	authDomain: 'vsaapp-12965.firebaseapp.com',
	databaseURL: 'https://vsaapp-12965.firebaseio.com',
	projectId: 'vsaapp-12965',
	storageBucket: 'vsaapp-12965.appspot.com',
	messagingSenderId: '557300294456'
};

firebase.initializeApp(config);

const getToken = () => {
	return new Promise((resolve, reject) => {
		const messaging = firebase.messaging();

		if (cookie.load('token') === undefined || cookie.load('token') === '') {
			messaging.requestPermission().then(() => {
				return messaging.getToken();
			}).then(token => {
				console.log(token);
				cookie.save('token', token, {expires: new Date(Infinity), maxAge: Infinity});
				resolve(token);
			}).catch(reject);

		} else {
			messaging.requestPermission().then(() => {
				return messaging.getToken();
			}).then(token => {
				console.log(token);
				if (token !== cookie.load('token')) {
					cookie.save('token', token, {expires: new Date(Infinity), maxAge: Infinity});
					subscribe(cookie.load('grade') + 'test');
				}
				resolve(token);
			}).catch(reject);
		}
		messaging.onMessage(payload => {
			console.log('Got payload', payload);
		});
	});
};

const subscribe = topic => {
	return new Promise((resolve, reject) => {
		getToken().then(token => {
			fetch('https://api.vsa.lohl1kohl.de/subscribe?token=' + token + '&topic=' + topic).then(response => {
				console.log('Subscribed to ' + topic);
				resolve();
				return response.text();
			}).then(text => {
				console.log(text);
			}).catch(reject);
		}).catch(reject);
	});
};

export const FirebaseAPI = {
	subscribe
};
