import {StorageAPI} from './Storage';

export const ReplacementplanAPI = {
	get: today => {
		return fetch('https://api.vsa.lohl1kohl.de/vp/' + (today ? 'today' : 'tomorrow') + '/' + StorageAPI.get('grade') + '.json').then(response => {
			return response.json();
		});
	}
};