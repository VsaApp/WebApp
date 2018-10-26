import cookie from 'react-cookies';

export const UnitplanAPI = {
	get: () => {
		return fetch('https://api.vsa.lohl1kohl.de/sp/' + cookie.load('grade') + '.json').then(response => {
			return response.json();
		});
	}
}