/******************************************************************************
**	@Author:				Thomas Bouder <Tbouder>
**	@Email:					Tbouder@protonmail.com
**	@Date:					Wednesday June 16th 2021
**	@Filename:				useArray.js
******************************************************************************/

import	{useState, useCallback}			from	'react';
import	strategies						from	'utils/indexDBStrategies';

const	indexDBs = {strategies}
const	indexes = {strategies: 'uuid'}

const useArray = (indexDBCol) => {
	const [items, set_items] = useState([]);
	const [nonce, set_nonce] = useState(0);

	return {
		nonce,
		items,

		get: useCallback(() => {
			return items;
		}, [nonce]),

		set_items: (_items) => {
			set_items(_items);
			if (indexDBCol !== undefined && indexDBs[indexDBCol] !== undefined) {
				_items.map(e => indexDBs[indexDBCol].set(e));
			}
			set_nonce(_nonce => _nonce + 1);
		},

		set: useCallback((uuid, k, v, soft = false) => {
			set_items((_items) => {
				const	i = _items.findIndex(e => e[indexes[indexDBCol] || 'uuid'] === uuid);
				if (i === -1) {
					console.error('i should be above -1. Error with uuid.')
					return _items
				}
				_items[i][k] = v;

				if (indexDBCol !== undefined && indexDBs[indexDBCol] !== undefined) {
					indexDBs[indexDBCol].setKey(_items[i].uuid, k, v);
				}

				return (_items);
			});
			if (!soft)
				set_nonce(_nonce => _nonce + 1);
		}, [indexDBCol, nonce]),

		upd: useCallback((item) => {
			set_items((_items) => {
				const	i = _items.findIndex(e => e.uuid === item.uuid);
				_items[i] = item;

				if (indexDBCol !== undefined && indexDBs[indexDBCol] !== undefined) {
					indexDBs[indexDBCol].set(item);
				}

				return (_items);
			});
			set_nonce(_nonce => _nonce + 1);
		}, [indexDBCol, nonce]),

		add: useCallback(a => {
			set_items(_items => [..._items, a]);
			set_nonce(_nonce => _nonce + 1);

			if (indexDBCol !== undefined && indexDBs[indexDBCol] !== undefined) {
				indexDBs[indexDBCol].add(a);
			}
		}, [indexDBCol, nonce]),

		removeByUUID: useCallback((uuid) => {
			set_items((_items) => {
				let		i = 0;
				const	orderedItems = _items.filter((v) => {
					if (v && v.uuid !== uuid) {
						if (indexDBCol !== undefined && indexDBs[indexDBCol] !== undefined) {
							indexDBs[indexDBCol].setKey(v.uuid, 'position', i);
						}
						v.position = i;
						i++;
						return v;
					}
				});
				return (orderedItems);
			});
			set_nonce(_nonce => _nonce + 1);

			if (indexDBCol !== undefined && indexDBs[indexDBCol] !== undefined) {
				indexDBs[indexDBCol].removeByUUID(uuid);
			}
		}, [indexDBCol])
	};
};

export default useArray;