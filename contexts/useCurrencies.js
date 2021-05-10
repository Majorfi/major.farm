/*******************************************************************************
** @Author:					Thomas Bouder <Tbouder>
** @Email:					Tbouder@protonmail.com
** @Date:					Saturday 26 October 1985 - 09:15:00
** @Filename:				AppContext.js
**
** @Last modified by:		Tbouder
*******************************************************************************/

import	{useState, useContext, createContext}		from	'react';
import	NProgress									from	'nprogress';
import	useInterval									from	'hook/useInterval';
import	{performGet}								from	'utils/API';
import	{request}									from	'graphql-request';

const CurrenciesContext = createContext();

async function	fetchCryptoPrice(nonce) {
	const	to = ['eur', 'usd']
	const	from = [
		'bitcoin',
		'ethereum',
		'yearn-lazy-ape',
		'assy-index',
		'concentrated-voting-power',
		'usd-coin',
		'blockchain-adventurers-guild',
		'pickle-finance',
		'yvboost',
		'badger-dao',
		'rai',
		'dai',
		'havven',
		'ice-token',
		'sushi',
		'nusd',
		'uniswap',
		'true-usd',
		'tether',
		'aave',
		'alchemix',
	]
	const	result = await performGet(
		`https://api.coingecko.com/api/v3/simple/price?ids=${from}&vs_currencies=${to}&n=${nonce}`
	);

	if (result) {
		return result;
	}
	return null;
}

async function	getPriceFromSushiPair(pair, overwrite = {}) {
	const	graphResp = await request(
		`https://api.thegraph.com/subgraphs/name/zippoxer/sushiswap-subgraph-fork`,
		`{
			pair(id: "${pair}") {
				totalSupply
				reserve0
				reserve1
			}
		}`
	)
	const LPPrice = (
		((graphResp?.pair?.reserve0 * overwrite.token0Price) + (graphResp?.pair?.reserve1 * overwrite.token1Price))
		/ graphResp?.pair?.totalSupply
	)

	return (LPPrice)
}

export const CurrenciesContextApp = ({children}) => {
	const	[tokenPrices, set_tokenPrices] = useState({});
	const	[sushiPairs, set_sushiPairs] = useState({});
	const	[rowUpdate, set_rowUpdate] = useState(0);

	const updateCurrency = async () => {
		NProgress.start();

		const	cryptoListObj = {
			'btc': {price: 0, fetchID: 'bitcoin'},
			'eth': {price: 0, fetchID: 'ethereum'},
			'yearn-lazy-ape': {price: 1, fetchID: 'yearn-lazy-ape'},
			'assy': {price: 1, fetchID: 'assy-index'},
			'cvp': {price: 1, fetchID: 'concentrated-voting-power'},
			'usdc': {price: 1, fetchID: 'usd-coin'},
			'bag': {price: 1, fetchID: 'blockchain-adventurers-guild'},
			'pickle-finance': {price: 1, fetchID: 'pickle-finance'},
			'yvboost': {price: 1, fetchID: 'yvboost'},
			'badger-dao': {price: 1, fetchID: 'badger-dao'},
			'rai': {price: 1, fetchID: 'rai'},
			'dai': {price: 1, fetchID: 'dai'},
			'havven': {price: 1, fetchID: 'havven'},
			'ice-token': {price: 1, fetchID: 'ice-token'},
			'sushi': {price: 1, fetchID: 'sushi'},
			'nusd': {price: 1, fetchID: 'nusd'},
			'uniswap': {price: 1, fetchID: 'uniswap'},
			'true-usd': {price: 1, fetchID: 'true-usd'},
			'tether': {price: 1, fetchID: 'tether'},
			'aave': {price: 1, fetchID: 'aave'},
			'alchemix': {price: 1, fetchID: 'alchemix'},
		}

		const	fetchedCryptoPrices = await fetchCryptoPrice(rowUpdate);
		Object.entries(cryptoListObj).forEach(([key, value]) => {
			cryptoListObj[key].price = fetchedCryptoPrices?.[value.fetchID]['eur'] || 0
		});

		const	yvBoostEth = await getPriceFromSushiPair(
			'0x9461173740d27311b176476fa27e94c681b1ea6b',
			{
				token0Price: cryptoListObj['yvboost'].price,
				token1Price: cryptoListObj['eth'].price
			}
		)
		set_tokenPrices(cryptoListObj);
		set_sushiPairs({'0x9461173740d27311b176476fa27e94c681b1ea6b': yvBoostEth})

		set_rowUpdate(u => u + 1);
		NProgress.done();
	};

	useInterval(() => {
		updateCurrency()
	}, 1000 * 45, true, [])

	return (
		<CurrenciesContext.Provider
			children={children}
			value={{
				currencyNonce: rowUpdate,
				tokenPrices: tokenPrices,
				sushiPairs
			}} />
	)
}

export const useCurrencies = () => useContext(CurrenciesContext)
export default useCurrencies;
