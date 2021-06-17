/******************************************************************************
**	@Author:				Thomas Bouder <Tbouder>
**	@Email:					Tbouder@protonmail.com
**	@Date:					Wednesday June 16th 2021
**	@Filename:				indexDBStrategies.js
******************************************************************************/

import	{getDB}		from 'utils/indexDB';

const	ColName = 'strategies';

export function	get(callback = () => null) {
	const	transaction = getDB().transaction(ColName);
	const	objectStore = transaction.objectStore(ColName);
	const	request = objectStore.getAll();
	request.onerror = function() {
		callback({status: 'error'})
	};
	request.onsuccess = function() {
		const	result = request.result;
		result.sort((a, b) => a.position - b.position)
		callback({status: 'success', store: result});
	};
}

export function	add(newStrat, callback = () => null) {
	const	transaction = getDB().transaction(ColName, 'readwrite');
	const	objectStore = transaction.objectStore(ColName);
	const	countRequest = objectStore.count();

	countRequest.onerror = function(e) {
		console.log(e)
		callback({status: 'error'})
	};
	countRequest.onsuccess = function() {
		newStrat.position = countRequest.result;
		const	request = objectStore.add(newStrat);
		request.onsuccess = function(event) {
			callback({status: 'success', row: event.target.result})
		};
		request.onerror = function(e) {
			console.log(e)
			callback({status: 'error'})
		};
	}
}

export function	setKey(uuid, key, value, callback = () => null) {
	const	transaction = getDB().transaction(ColName, 'readwrite');
	const	objectStore = transaction.objectStore(ColName);
	const	request = objectStore.get(uuid);
	request.onerror = function() {
		callback({status: 'error'})
	};
	request.onsuccess = function(event) {
		const	data = event.target.result;
		data[key] = value
		const	requestUpdate = objectStore.put(data);
		requestUpdate.onerror = function() {
			callback({status: 'error'})
		};
		requestUpdate.onsuccess = function(event) {
			callback({status: 'success', row: event.target.result})
		};
	};
}

export function	set(value, callback = () => null) {
	const	transaction = getDB().transaction(ColName, 'readwrite');
	const	objectStore = transaction.objectStore(ColName);
	const	request = objectStore.put(value);
	request.onerror = function() {
		callback({status: 'error'})
	};
	request.onsuccess = function(event) {
		callback({status: 'success', row: event.target.result})
	};
}

export function	removeByUUID(uuid, callback = () => null) {
	const	transaction = getDB().transaction(ColName, 'readwrite');
	const	objectStore = transaction.objectStore(ColName);
	const	request = objectStore.delete(uuid);
	request.onerror = function() {
		callback({status: 'error'})
	};
	request.onsuccess = function(event) {
		callback({status: 'success', row: event.target.result})
	};
}

export default {add, set, setKey, removeByUUID}