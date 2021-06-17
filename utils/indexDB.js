/******************************************************************************
**	@Author:				Thomas Bouder <Tbouder>
**	@Email:					Tbouder@protonmail.com
**	@Date:					Wednesday June 16th 2021
**	@Filename:				indexDB.js
******************************************************************************/

let		db = undefined
const	DBName = 'MajorFarm';
const	DBVersion = 1;
const	Cols = ['strategies'];

export function	openIndexDB(callback = () => null) {
	if (typeof(window) !== 'undefined') {
		const	request = window.indexedDB.open(DBName, DBVersion);
		request.onerror = function() {
			callback({status: 'error'})
		};
		request.onsuccess = function(event) {
			setDB(event.target.result);
			const	transaction = db.transaction(Cols);
			const	promises = Cols.map((col) => (
				new Promise((resolve, reject) => {
					const	objectStore = transaction.objectStore(col);
					const	request = objectStore.getAll();
					request.onerror = function() {
						reject()
					};
					request.onsuccess = function() {
						const	result = request.result;
						result.sort((a, b) => a.position - b.position);
						resolve(result);
					};	
				})
			))

			Promise.all(promises).then((values) => {
				callback({
					status: 'success',
					data: {
						[Cols[0]]: values[0],
					}
				})
			});

		};
		request.onupgradeneeded = function(event) {
			const	_db = event.target.result
			upgradeRows(_db)
		}
	}
}

export function setDB(_db) {
	db = _db;
}

export function getDB() {
	return (db);
}

function	upgradeRows(_db) {
	if (_db.objectStoreNames.contains('strategies')) {
		return
	}
	const	objectStore = _db.createObjectStore('strategies', {keyPath: 'uuid'});
	objectStore.createIndex('uuid', 'uuid', {unique: true});
	objectStore.createIndex('position', 'position', {unique: false});
	objectStore.createIndex('name', 'name', {unique: false});
	objectStore.createIndex('fees', 'fees', {unique: false});
	objectStore.createIndex('initialSeeds', 'initialSeeds', {unique: false});
	objectStore.createIndex('initialCrops', 'initialCrops', {unique: false});
	objectStore.createIndex('harvest', 'harvest', {unique: false});
	objectStore.createIndex('timestamp', 'timestamp', {unique: false});
	objectStore.createIndex('date', 'date', {unique: false});
	objectStore.createIndex('address', 'address', {unique: false});

	/**************************************************************************
	**	Theses informations are populated from the strategy component and
	**	will be used to display some informations. The `lastXX` should match
	**	the current status of the vault.
	**************************************************************************/
	objectStore.createIndex('isHarvested', 'isHarvested', {unique: false});
	objectStore.createIndex('lastShares', 'lastShares', {unique: false});
	objectStore.createIndex('lastSharesValue', 'lastSharesValue', {unique: false});
	objectStore.createIndex('lastHarvest', 'lastHarvest', {unique: false});
	objectStore.createIndex('lastResult', 'lastResult', {unique: false});
	objectStore.createIndex('lastGasValue', 'lastGasValue', {unique: false});
}
