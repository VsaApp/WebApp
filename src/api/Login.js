import {Sha256API} from './Sha256';
import {StorageAPI} from './Storage';

export const LoginAPI = {
	login: (username, password, i) => {
		if (!i) {
			i = 0;
		}
		return new Promise((resolve, reject) => {
			if (i === 3) {
				reject();
				return;
			}
			fetch('https://api.vsa.lohl1kohl.de/validate?username=' + Sha256API.hash(username) + '&password=' + Sha256API.hash(password)).then(response => {
				return response.text();
			}).then(text => {
				resolve(text === '0');
			}).catch(err => {
				if (err) {
					console.log('err:' + err);
					LoginAPI.login(username, password, ++i).then(resolve).catch(reject);
				}
			});
		});
	},
	logout: () => {
		StorageAPI.keys().forEach(key => {
			StorageAPI.remove(key);
		});
		window.location.reload();
	}
};