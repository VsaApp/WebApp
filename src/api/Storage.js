export const StorageAPI = {
	get: key => localStorage[key],
	set: (key, value) => localStorage[key] = value,
	remove: key => delete localStorage[key],
	keys: () => Object.keys(localStorage)
};