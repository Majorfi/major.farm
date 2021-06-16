/******************************************************************************
**	@Author:				Thomas Bouder <Tbouder>
**	@Email:					Tbouder@protonmail.com
**	@Date:					Friday June 11th 2021
**	@Filename:				chains.js
******************************************************************************/

import	{ethers}			from	'ethers';

export function getProvider(chain = 'ethereum') {
	if (chain === 'ethereum') {
		return new ethers.providers.AlchemyProvider('homestead', process.env.ALCHEMY_KEY);
	} else if (chain === 'polygon') {
		return new ethers.providers.JsonRpcProvider(`https://rpc-mainnet.maticvigil.com/v1/${process.env.POLYGON_MATIC_VIRGIL}`);
	} else if (chain === 'fantom') {
		return new ethers.providers.JsonRpcProvider('https://rpcapi.fantom.network');
	} else if (chain === 'bsc') {
		return new ethers.providers.JsonRpcProvider('https://bsc-dataseed.binance.org/');
	}
	return (new ethers.providers.AlchemyProvider('homestead', process.env.ALCHEMY_KEY));
}

export function	getExplorer(chain) {
	if (chain === 'ethereum') {
		return ({explorer: 'etherscan.io', apiKey: process.env.ETHERSCAN_API_KEY});
	} else if (chain === 'polygon') {
		return ({explorer: 'polygonscan.com', apiKey: process.env.POLYGONSCAN_API_KEY});
	} else if (chain === 'fantom') {
		return ({explorer: 'ftmscan.com', apiKey: process.env.FTMSCAN_API_KEY});
	} else if (chain === 'bsc') {
		return ({explorer: 'bscscan.com', apiKey: process.env.BSC_API_KEY});
	}
	return ({explorer: 'etherscan.io', apiKey: process.env.ETHERSCAN_API_KEY});
}

export function	getSymbol(chain) {
	if (chain === 'ethereum') {
		return ('eth');
	} else if (chain === 'polygon') {
		return ('matic');
	} else if (chain === 'fantom') {
		return ('fmt');
	} else if (chain === 'bsc') {
		return ('bnb');
	}
	return ('eth');
}