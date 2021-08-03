/******************************************************************************
**	@Author:				Thomas Bouder <Tbouder>
**	@Email:					Tbouder@protonmail.com
**	@Date:					Saturday May 8th 2021
**	@Filename:				useStategies.js
******************************************************************************/

import	React, {useState, useEffect, useContext, createContext}	from	'react';
import	{useToasts}								from	'react-toast-notifications';
import	{v4 as uuidv4}							from	'uuid';
import	useArray								from	'hook/useArray';
import	useLocalStorage							from	'hook/useLocalStorage'
import	{openIndexDB}							from	'utils/indexDB';
import	STRATEGIES								from	'utils/strategies';
import	{asyncForEach}							from	'utils';
import	{retreiveTxFrom, retreiveErc20TxFrom}	from	'utils/API';

const StrategiesContext = createContext();

export const StrategiesContextApp = ({children}) => {
	const	{addToast} = useToasts();
	const	[hasIndexDB, set_hasIndexDB] = useState(false);
	const	strategies = useArray('strategies');
	const	[isMigrated, set_isMigrated] = useLocalStorage('isMigrated', false);
	const	[localStrategies, set_localStrategies] = useLocalStorage('strategies-v02', []);

	useEffect(() => {
		if (typeof(window) !== 'undefined') {
			if (!hasIndexDB) {
				openIndexDB(async (result) => {
					if (result.status === 'success') {
						strategies.set_items(result?.data?.strategies || []);
						set_hasIndexDB(true);
						if (!isMigrated) {
							localStrategies.map((oldStrat) => {
								strategies.add({
									uuid: oldStrat.params.uuid,
									name: oldStrat.strategy,
									fees: oldStrat.params.fees,
									initialSeeds: oldStrat.params.initialSeeds,
									initialCrops: oldStrat.params.initialCrops,
									harvest: oldStrat.params.harvest,
									timestamp: oldStrat.params.timestamp,
									date: oldStrat.params.date,
									address: oldStrat.params.address,
								})
							});
							set_localStrategies(undefined);
							set_isMigrated(true);
						}
					}
				});
			}
		}
	}, [typeof(window)]);

	function appendStrategy(title, newStrategy) {
		strategies.add({
			uuid: uuidv4(),
			name: title,
			fees: newStrategy.fees,
			initialSeeds: newStrategy.initialSeeds,
			initialCrops: newStrategy.initialCrops,
			harvest: newStrategy.harvest,
			timestamp: newStrategy.timestamp,
			date: newStrategy.date,
			address: newStrategy.address,
			
			seeds: newStrategy.seeds,
			crops: newStrategy.crops,
		})
	}

	async function	detectStrategies(_address) {
		addToast('Looking for strategies ...', {appearance: 'info'});
		const	normalTx = {};
		const	erc20Tx = {};
		await asyncForEach(Object.values(STRATEGIES), async (s) => {
			const	contractAddress = s?.parameters?.contractAddress;
			if (!contractAddress) {
				return;
			}
			const	detector = s?.detect;
			if (!detector) {
				return;
			}
			if (normalTx[s.network] === undefined) {
				normalTx[s.network] = await retreiveTxFrom(s.network, _address);
			}
			if (erc20Tx[s.network] === undefined) {
				erc20Tx[s.network] = await retreiveErc20TxFrom(s.network, _address);
			}
			const	hasSomeTx = await detector(s.parameters, _address, s.network, normalTx[s.network]);
			if (hasSomeTx) {
				const	newStrategy = await s.prepare(s.parameters, _address, s.network, normalTx[s.network], erc20Tx[s.network]);
				if (newStrategy.status !== 'KO') {
					newStrategy.date = new Date(newStrategy.timestamp * 1000);
					newStrategy.address = _address;
					appendStrategy(s?.parameters?.title, newStrategy);
					addToast(`Strategy ${s.parameters.title} available`, {appearance: 'success'});
				}
			}
		});
		addToast('All strategies detected !', {appearance: 'info'});
	}

	return (
		<StrategiesContext.Provider
			value={{
				strategies,
				detectStrategies
			}}>
			{children}
		</StrategiesContext.Provider>
	)
}

export const useStrategies = () => useContext(StrategiesContext)
export default useStrategies;
