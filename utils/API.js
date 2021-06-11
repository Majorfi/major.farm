/******************************************************************************
**	@Author:				Thomas Bouder <Tbouder>
**	@Email:					Tbouder@protonmail.com
**	@Date:					Saturday January 2nd 2021
**	@Filename:				API.js
******************************************************************************/

import	axios			from	'axios';
import	{getExplorer}	from	'utils/chains';

export const	performGet = (url) => {
	return (
		axios.get(url)
			.then(function (response) {
				return response.data
			})
			.catch(function (error) {
				console.warn(error)
				return null
			})
	);
};

export async function	fetchCryptoPrice(from, to) {
	const	result = await performGet(
		`https://api.coingecko.com/api/v3/simple/price?ids=${from}&vs_currencies=${to}`
	);

	if (result) {
		return result;
	}
	return null;
}

export async function	retreiveTxFrom(network, address) {
	const	{explorer, apiKey} = getExplorer(network);
	const	{result} = await axios.get(`https://api.${explorer}/api?module=account&action=txlist&address=${address}&startblock=0&endblock=99999999&sort=asc&apikey=${apiKey}`).then(e => e.data)

	return result || [];
}

export async function	retreiveErc20TxFrom(network, address) {
	const	{explorer, apiKey} = getExplorer(network);
	const	{result} = await axios.get(`https://api.${explorer}/api?module=account&action=tokentx&address=${address}&startblock=0&endblock=99999999&sort=asc&apikey=${apiKey}`).then(e => e.data)

	return result || [];
}

export async function	getTransactionReceiptFrom(network, hash) {
	const	{explorer, apiKey} = getExplorer(network);
	const	{result} = await axios.get(`https://api.${explorer}/api?module=proxy&action=eth_getTransactionReceipt&txhash=${hash}&apikey=1QJIBHW3HCXNV3MMB2MC23NKYVP2AIMVPU${apiKey}`).then(e => e.data)

	return result || [];
}

export async function retrieveTokenDecimalByTokenAddress(network, tokenAddress) {
	const	{explorer, apiKey} = getExplorer(network);
	const	{result} = await axios.get(`https://api.${explorer}/api?module=account&action=tokentx&contractaddress=${tokenAddress}&page=1&offset=1&sort=asc&apikey=${apiKey}`).then(e => e.data)
	return {
		decimals: result?.[0]?.tokenDecimal || 18,
		name: result?.[0]?.tokenName || '',
		symbol: result?.[0]?.tokenSymbol || '',
	};
}


export async function getQuotePriceEth(tokenAddress, coin = 'eth') {
	const	{market_data} = await axios.get(`https://api.coingecko.com/api/v3/coins/ethereum/contract/${tokenAddress}`).then(e => e.data)
	const	price = market_data?.current_price[coin] || 0
	return price;
}

export async function getTokenInfo(tokenAddress) {
	try {
		const	data = await axios.get(`https://api.coingecko.com/api/v3/coins/ethereum/contract/${tokenAddress}`).then(e => e.data)
		return	data;		
	} catch (error) {
		return	{};
	}
}

export async function getTokenMarket() {
	try {
		const	data = await axios.get('https://api.coingecko.com/api/v3/coins/cdai/market_chart?vs_currency=usd&days=45&interval=daily').then(e => e.data)
		return	data.prices;		
	} catch (error) {
		return	{};
	}
}
