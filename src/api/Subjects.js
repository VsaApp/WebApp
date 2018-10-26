const subjects = {
	CH: 'Chemie',
	PH: 'Physik',
	MI: 'Mint',
	DB: 'NW',
	DP: 'PoWi',
	PO: 'PoWi',
	IF: 'Info',
	S: 'Spanisch',
	MU: 'Musik',
	SP: 'Sport',
	F: 'Französisch',
	L: 'Latein',
	ER: 'E. Reli',
	KR: 'K. Reli',
	D: 'Deutsch',
	E: 'Englisch',
	M: 'Mathe',
	PK: 'Politik',
	BI: 'Bio',
	UC: 'U. Chor',
	EK: 'Erdkunde',
	KU: 'Kunst',
	KW: 'Kunst',
	SW: 'SoWi',
	PL: 'Philosophie',
	GE: 'Geschichte',
	VM: 'Vertiefung Mathe',
	VD: 'Vertiefung Deutsch',
	VE: 'Vertiefung Englisch',
	FF: 'Französisch Förder',
	LF: 'Latein Förder',
	DF: 'Deutsch Förder',
	PJ: 'Projektkurs'
};

function getKeyByValue(object, value) {
	return Object.keys(object).find(key => object[key] === value);
}

export const SubjectsAPI = {
	subjects,
	getSubject: name => {
		let upperName = name.replace(/[0-9]/g, '').toUpperCase();
		if (getKeyByValue(subjects, name) !== undefined) {
			upperName = getKeyByValue(subjects, name);
		}
		return subjects[upperName] || name;
	}
};