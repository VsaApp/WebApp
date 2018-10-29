export const CafetoriaAPI = {
	get: (id, pin) => {
		return fetch('https://api.vsa.lohl1kohl.de/cafetoria?id=' + id + '&password=' + pin).then(response => {
			return response.json();
		});
	}
};