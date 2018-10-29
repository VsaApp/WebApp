import {StorageAPI} from './Storage';

export const UnitplanAPI = {
	get: () => {
		return fetch('https://api.vsa.lohl1kohl.de/sp/' + StorageAPI.get('grade') + '.json').then(response => {
			return response.json();
		});
	}
};