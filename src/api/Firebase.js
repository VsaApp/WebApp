import {firebase} from '@firebase/app';
import '@firebase/messaging';
import {StorageAPI} from './Storage';

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

		if (StorageAPI.get('token') === undefined) {
			messaging.requestPermission().then(() => {
				return messaging.getToken();
			}).then(token => {
				console.log(token);
				StorageAPI.set('token', token);
				resolve(token);
			}).catch(reject);

		} else {
			messaging.requestPermission().then(() => {
				return messaging.getToken();
			}).then(token => {
				console.log(token);
				if (token !== StorageAPI.get('token')) {
					StorageAPI.set('token', token);
					subscribe(StorageAPI.get('grade') + 'test');
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
