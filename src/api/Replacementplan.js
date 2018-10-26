import cookie from 'react-cookies';

export const ReplacementplanAPI = {
	get: today => {
		return fetch('https://api.vsa.lohl1kohl.de/vp/' + (today ? 'today' : 'tomorrow') + '/' + cookie.load('grade') + '.json').then(response => {
			return response.json();
		});
	}
}