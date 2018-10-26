export const TeacherAPI = {
	get: () => {
		return fetch('https://api.vsa.lohl1kohl.de/teachers/list.json').then(response => {
			return response.json();
		});
	}
}