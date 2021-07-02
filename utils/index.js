/******************************************************************************
**	@Author:				Thomas Bouder <Tbouder>
**	@Email:					Tbouder@protonmail.com
**	@Date:					Thursday March 18th 2021
**	@Filename:				index.js
******************************************************************************/

import	axios							from	'axios';
import	{ethers}						from	'ethers';

export const fetcher = url => axios.get(url).then(res => res.data);

export const toAddress = (address) => {
	if (!address) {
		return undefined;
	}
	if (address === 'GENESIS') {
		return '0x0000000000000000000000000000000000000000'
	}
	try {
		return ethers.utils.getAddress(address);	
	} catch (error) {
		return undefined
	}
};
export const address = ethers.utils.getAddress;

export const bigNumber = ethers.BigNumber;

export const countBy = (objs, property) => [...new Set(objs.map(obj => obj[property]))].length;

export const splitBy = (arr, prop, modifier) => arr.reduce((prev, curr) => (prev[modifier(curr[prop])] = ++prev[modifier(curr[prop])] || 1, prev), {});

export const chunk = (arr, size) => arr.reduce((acc, e, i) => (i % size ? acc[acc.length - 1].push(e) : acc.push([e]), acc), []);

export const sortBy = (arr, k) => arr.concat().sort((b, a) => (a[k] > b[k]) ? 1 : ((a[k] < b[k]) ? -1 : 0));

export const partition = (arr, criteria) => arr.reduce((acc, i) => (acc[criteria(i) ? 0 : 1].push(i), acc), [[], []]);

export const hasIntersection = (a, ...arr) => [...new Set(a)].some(v => arr.some(b => b.includes(v)));

export const getIntersection = (a, ...arr) => [...new Set(a)].filter(v => arr.every(b => b.includes(v)));

export const randomInteger = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;

export const randomItem = arr => arr[(Math.random() * arr.length) | 0];

export const	removeFromArray = (arr, key, item) => {
	const i = arr.findIndex(a => a.params[key] === item);
	if (i > -1) {
		arr.splice(i, 1);
	}
	return arr;
}
export function jsNumberForAddress(address) {
	const addr = address.slice(2, 10);
	const seed = parseInt(addr, 16);
	return seed;
}

export function truncateAddress(address) {
	if (address !== undefined) {
		return `${address.slice(0, 4)}...${address.slice(-4)}`;
	}
	return '0x000...0000';
}

export function datediff(first, end) {
	const date1 = new Date(first);
	const date2 = end ? new Date(end) : new Date();
	const differenceInTime = date2.getTime() - date1.getTime();
	const differenceInDays = differenceInTime / (1000 * 3600 * 24);
	return differenceInDays.toFixed(0)
}

export async function asyncForEach(array, callback) {
	for (let index = 0; index < array.length; index++) {
		await callback(array[index], index, array);
	}
}
export async function asyncFilter(arr, predicate) {
	return Promise.all(arr.map(predicate)).then((results) => arr.filter((_v, index) => results[index]))
}

export function	formatValue(value, baseCurrency = 'eur') {
	if (baseCurrency === 'eur') {
		return (new Intl.NumberFormat('fr-FR', {style: 'currency', currency: 'EUR'}).format(value))
	}
	return (new Intl.NumberFormat('en-US', {style: 'currency', currency: 'USD'}).format(value))
}
export function	formatAmount(amount, baseCurrency = 'eur') {
	if (baseCurrency === 'eur') {
		return (new Intl.NumberFormat('fr-FR', {minimumFractionDigits: 0, maximumFractionDigits: 8}).format(amount))
	}
	return (new Intl.NumberFormat('en-US', {minimumFractionDigits: 0, maximumFractionDigits: 8}).format(amount))
}
export function	formatDate(timestamp, baseCurrency = 'eur') {
	if (baseCurrency === 'eur') {
		return (new Date(timestamp)).toLocaleString('fr-FR');
	}
	return (new Date(timestamp)).toLocaleString('en-US');
}
export function	formatPercent(percent) {
	return (new Intl.NumberFormat('en-US', {style: 'percent', minimumFractionDigits: 2}).format(percent))
}