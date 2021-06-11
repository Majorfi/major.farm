/******************************************************************************
**	@Author:				Thomas Bouder <Tbouder>
**	@Email:					Tbouder@protonmail.com
**	@Date:					Saturday May 8th 2021
**	@Filename:				useCurrencies.js
******************************************************************************/

import	React, {useState, useContext, createContext}	from	'react';
import	NProgress										from	'nprogress';
import	useInterval										from	'hook/useInterval';
import	{performGet}									from	'utils/API';
import	{request}										from	'graphql-request';
import	{ethers}										from	'ethers';

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
		'pooltogether',
		'usdp',
		'link',
		'yearn-finance',
		'1inch',
		'woofy',
		'matic-network'
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
		'https://api.thegraph.com/subgraphs/name/zippoxer/sushiswap-subgraph-fork',
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
	const	[baseCurrency, set_baseCurrency] = useState('eur');
	const	[tokenPrices, set_tokenPrices] = useState({});
	const	[crvPrices, set_crvPrices] = useState({});
	const	[sushiPairs, set_sushiPairs] = useState({});
	const	[currencyNonce, set_currencyNonce] = useState(0);

	async function	retrieveCurveLPVirtualPrice(lpTokenAddress) {
		const	CURVE_LP_REGISTRY = '0x7D86446dDb609eD0F5f8684AcF30380a356b2B4c';
		const	provider = new ethers.providers.AlchemyProvider('homestead', process.env.ALCHEMY_KEY)
		const	ABI = ['function get_virtual_price_from_lp_token(address) external view returns (uint256)']
		const	smartContract = new ethers.Contract(CURVE_LP_REGISTRY, ABI, provider)
		const	virtualPrice = await smartContract.get_virtual_price_from_lp_token(lpTokenAddress);
		return	Number(ethers.utils.formatUnits(virtualPrice, 18));
	}

	const updateCurrency = async (_baseCurrency) => {
		NProgress.start();

		const	cryptoListObj = {
			'btc': {price: 0, fetchID: 'bitcoin'},
			'eth': {price: 0, fetchID: 'ethereum'},
			'yearn-lazy-ape': {price: 1, fetchID: 'yearn-lazy-ape'},
			'assy-index': {price: 1, fetchID: 'assy-index'},
			'concentrated-voting-power': {price: 1, fetchID: 'concentrated-voting-power'},
			'usd-coin': {price: 1, fetchID: 'usd-coin'},
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
			'pooltogether': {price: 1, fetchID: 'pooltogether'},
			'usdp': {price: 1, fetchID: 'usdp'},
			'link': {price: 1, fetchID: 'link'},
			'yearn-finance': {price: 1, fetchID: 'yearn-finance'},
			'1inch': {price: 1, fetchID: '1inch'},
			'woofy': {price: 1, fetchID: 'woofy'},
			'matic': {price: 1, fetchID: 'matic-network'},
		}

		const	fetchedCryptoPrices = await fetchCryptoPrice(currencyNonce);
		Object.entries(cryptoListObj).forEach(([key, value]) => {
			cryptoListObj[key].price = fetchedCryptoPrices?.[value.fetchID][_baseCurrency] || 0
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
		set_currencyNonce(u => u + 1);
		NProgress.done();
	};

	const	updateCrvLPTokenPrice = async () => {
		const	mapping = {
			'eursCRV': '0x194ebd173f6cdace046c53eacce9b953f28411d1',
			'linkCRV': '0xcee60cfa923170e4f8204ae08b4fa6a3f5656f3a',
			'musd3CRV': '0x1aef73d49dedc4b1778d0706583995958dc862e6',
			'usdn3CRV': '0x4f3e8f405cf5afc05d68142f3783bdfe13811522',
			'ust3CRV': '0x94e131324b6054c0d789b190b2dac504e4361b53',
			'crvPlain3andSUSD': '0xc25a3a3b969415c80451098fa907ec722572917f',
			'husd3CRV': '0x5b5cfe992adac0c9d48e05854b2d91c73a003858',
			'a3CRV': '0xfd2a8fa60abd58efe3eee34dd494cd491dc14900',
			'usdp3CRV': '0x7eb40e450b9655f4b3cc4259bcc731c63ff55ae6',
			'ankrCRV': '0xaa17a236f2badc98ddc0cf999abb47d47fc0a6cf',
			'steCRV': '0x06325440d014e39736583c165c2963ba99faf14e'
		};
		Object.entries(mapping).forEach(async ([k, v]) => {
			const	price = await retrieveCurveLPVirtualPrice(v);
			const	priceToCurrency = baseCurrency === 'eur' ? price * tokenPrices['usdt']?.price || 1 : price
			set_crvPrices(v => ({...v, [k]: {price: priceToCurrency}}));
			set_currencyNonce(u => u + 1);
		})
	}

	useInterval(() => {
		updateCrvLPTokenPrice(baseCurrency)
	}, 1000 * 60 * 1, true, [baseCurrency])

	useInterval(() => {
		updateCurrency(baseCurrency)
	}, 1000 * 45, true, [baseCurrency])

	function	switchCurrency() {
		if (baseCurrency === 'eur') {
			set_baseCurrency('usd');
		} else {
			set_baseCurrency('eur');
		}
	}

	return (
		<CurrenciesContext.Provider
			value={{
				baseCurrency,
				switchCurrency,
				currencyNonce,
				tokenPrices,
				crvPrices,
				sushiPairs
			}}>
			{children}
		</CurrenciesContext.Provider>
	)
}

export const useCurrencies = () => useContext(CurrenciesContext)
export default useCurrencies;
