export const ClubsAPI = {
	get: () => {
		return fetch('https://api.vsa.lohl1kohl.de/ags/list.json').then(response => {
			return response.json();
		});
	}
};