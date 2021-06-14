/******************************************************************************
**	@Author:				Thomas Bouder <Tbouder>
**	@Email:					Tbouder@protonmail.com
**	@Date:					Friday May 14th 2021
**	@Filename:				strategies.js
******************************************************************************/

import	StrategyBadgerWBTC, {PrepareStrategyBadgerWBTC}	from	'components/Strategies/StrategyBadgerWBTC';
import	StrategyYVBoost, {PrepareStrategyYVBoost}		from	'components/Strategies/StrategyYVBoost';
import	StrategyApe, {PrepareStrategyApe, DetectStrategyApe}				from	'components/Strategies/StrategyApe';
import	StrategyYearnV1, {PrepareStrategyYearnV1}		from	'components/Strategies/StrategyYearnV1';
import	StrategyYearnV2, {PrepareStrategyYearnV2}		from	'components/Strategies/StrategyYearnV2';
import	StrategyYearnCrvV1, {PrepareStrategyYearnCrvV1}	from	'components/Strategies/StrategyYearnCrvV1';
import	StrategyYearnCrvV2, {PrepareStrategyYearnCrvV2}	from	'components/Strategies/StrategyYearnCrvV2';

const	STRATEGIES_APE_TAX_POLYGON = {
	'Dollar Store Bento 💵🍱': {
		parameters: {
			title: 'Dollar Store Bento 💵🍱',
			href: 'https://ape.tax/dollarstorebento',
			contractAddress: '0x32A2d6F07079b6CdFe942B198773cDA1398544b1',
			underlyingTokenAddress: '0x2791bca1f2de4661ed88a30c99a7a9449aa84174',
			underlyingTokenSymbol: 'USDC',
			underlyingTokenDecimal: 6,
			underlyingTokenCgID: 'usd-coin',
			underlyingTokenIcon: '/tokens/usdc.svg',
			author: 'fp_crypto',
		},
		network: 'polygon',
		list: 'ape.tax',
		prepare: (p, a, n, normalTx, erc20Tx) => PrepareStrategyApe(p, a, n, normalTx, erc20Tx),
		detect: (p, a, n, normalTx, erc20Tx) => DetectStrategyApe(p, a, n, normalTx, erc20Tx),
		Strategy: StrategyApe
	},
	'Purple Twister 🟣🧬': {
		parameters: {
			title: 'Purple Twister 🟣🧬',
			href: 'https://ape.tax/purpletwister',
			contractAddress: '0xCcba0B868106d55704cb7ff19782C829dc949feB',
			underlyingTokenAddress: '0x0d500b1d8e8ef31e21c99d1db9a6444d3adf1270',
			underlyingTokenDecimal: 18,
			underlyingTokenSymbol: 'WMATIC',
			underlyingTokenCgID: 'matic',
			underlyingTokenIcon: '/tokens/matic.png',
			author: 'lance_upp'
		},
		network: 'polygon',
		list: 'ape.tax',
		prepare: (p, a, n, normalTx, erc20Tx) => PrepareStrategyApe(p, a, n, normalTx, erc20Tx),
		detect: (p, a, n, normalTx, erc20Tx) => DetectStrategyApe(p, a, n, normalTx, erc20Tx),
		Strategy: StrategyApe
	},
	'Matic\'s Magic Idle DAI 🏆🚀': {
		parameters: {
			title: 'Matic\'s Magic Idle DAI 🏆🚀',
			href: 'https://ape.tax/matic-idle-dai',
			contractAddress: '0x9Cfeb5e00a38ed1c9950dBadC0821ce4cb648a90',
			underlyingTokenAddress: '0x8f3cf7ad23cd3cadbd9735aff958023239c6a063',
			underlyingTokenSymbol: 'DAI',
			underlyingTokenDecimal: 18,
			underlyingTokenCgID: 'dai',
			underlyingTokenIcon: '/tokens/dai.svg',
			author: 'emilianobonassi',
		},
		network: 'polygon',
		list: 'ape.tax',
		prepare: (p, a, n, normalTx, erc20Tx) => PrepareStrategyApe(p, a, n, normalTx, erc20Tx),
		detect: (p, a, n, normalTx, erc20Tx) => DetectStrategyApe(p, a, n, normalTx, erc20Tx),
		Strategy: StrategyApe
	},
	'Matic\'s Wandering Woofy 🧭🐶': {
		parameters: {
			title: 'Matic\'s Wandering Woofy 🧭🐶',
			href: 'https://ape.tax/matic_woofy',
			contractAddress: '0xEAFB3Ee25B5a9a1b35F193A4662E3bDba7A95BEb',
			underlyingTokenAddress: '0xd0660cd418a64a1d44e9214ad8e459324d8157f1',
			underlyingTokenDecimal: 12,
			underlyingTokenSymbol: 'WOOFY',
			underlyingTokenCgID: 'woofy',
			underlyingTokenIcon: '/tokens/woofy.png',
			author: 'lance_upp'
		},
		network: 'polygon',
		list: 'ape.tax',
		prepare: (p, a, n, normalTx, erc20Tx) => PrepareStrategyApe(p, a, n, normalTx, erc20Tx),
		detect: (p, a, n, normalTx, erc20Tx) => DetectStrategyApe(p, a, n, normalTx, erc20Tx),
		Strategy: StrategyApe
	},
}
const	STRATEGIES_APE_TAX_FANTOM = {
	'FTM\'s Wandering Woofy 🧭🐶': {
		parameters: {
			title: 'FTM\'s Wandering Woofy 🧭🐶',
			href: 'https://ape.tax/ftm_woofy',
			contractAddress: '0x6fCE944d1f2f877B3972e0E8ba81d27614D62BeD',
			underlyingTokenAddress: '0xd0660cd418a64a1d44e9214ad8e459324d8157f1',
			underlyingTokenDecimal: 12,
			underlyingTokenSymbol: 'WOOFY',
			underlyingTokenCgID: 'woofy',
			underlyingTokenIcon: '/tokens/woofy.png',
			author: 'lance_upp',
		},
		network: 'fantom',
		list: 'ape.tax',
		prepare: (p, a, n, normalTx, erc20Tx) => PrepareStrategyApe(p, a, n, normalTx, erc20Tx),
		detect: (p, a, n, normalTx, erc20Tx) => DetectStrategyApe(p, a, n, normalTx, erc20Tx),
		Strategy: StrategyApe
	},
	'Spooky Skeletons 🙀👻': {
		parameters: {
			title: 'Spooky Skeletons 🙀👻',
			href: 'https://ape.tax/spooky',
			contractAddress: '0x79330397e161C67703e9bce2cA2Db73937D5fc7e',
			underlyingTokenAddress: '0x049d68029688eabf473097a2fc38ef61633a3c7a',
			underlyingTokenDecimal: 18,
			underlyingTokenSymbol: 'BOO',
			underlyingTokenCgID: 'spookyswap',
			underlyingTokenIcon: '/tokens/boo.png',
			author: 'lance_upp',
		},
		network: 'fantom',
		list: 'ape.tax',
		prepare: (p, a, n, normalTx, erc20Tx) => PrepareStrategyApe(p, a, n, normalTx, erc20Tx),
		detect: (p, a, n, normalTx, erc20Tx) => DetectStrategyApe(p, a, n, normalTx, erc20Tx),
		Strategy: StrategyApe
	},
	'FTM\'s Frapped Ape ☕️🦧': {
		parameters: {
			title: 'FTM\'s Frapped Ape ☕️🦧',
			href: 'https://ape.tax/ftmfrappedape',
			contractAddress: '0x1E9eC284BA99E14436f809291eBF7dC8CCDB12e1',
			underlyingTokenAddress: '0x049d68029688eabf473097a2fc38ef61633a3c7a',
			underlyingTokenDecimal: 6,
			underlyingTokenSymbol: 'fUSDT',
			underlyingTokenCgID: 'tether',
			underlyingTokenIcon: '/tokens/usdt.svg',
			author: 'poolpitako',
		},
		network: 'fantom',
		list: 'ape.tax',
		prepare: (p, a, n, normalTx, erc20Tx) => PrepareStrategyApe(p, a, n, normalTx, erc20Tx),
		detect: (p, a, n, normalTx, erc20Tx) => DetectStrategyApe(p, a, n, normalTx, erc20Tx),
		Strategy: StrategyApe
	},
	'Fantom\'s Ape Ape Baby 🧊👶': {
		parameters: {
			title: 'Fantom\'s Ape Ape Baby 🧊👶',
			href: 'https://ape.tax/fantombaby',
			contractAddress: '0xEea0714eC1af3b0D41C624Ba5ce09aC92F4062b1',
			underlyingTokenAddress: '0xf16e81dce15b08f326220742020379b855b87df9',
			underlyingTokenDecimal: 18,
			underlyingTokenSymbol: 'ICE',
			underlyingTokenCgID: 'ice-token',
			underlyingTokenIcon: '/tokens/ice.png',
			author: 'poolpitako',
		},
		network: 'fantom',
		list: 'ape.tax',
		prepare: (p, a, n, normalTx, erc20Tx) => PrepareStrategyApe(p, a, n, normalTx, erc20Tx),
		detect: (p, a, n, normalTx, erc20Tx) => DetectStrategyApe(p, a, n, normalTx, erc20Tx),
		Strategy: StrategyApe
	},
	'Fantom\'s Fury 👻⚡': {
		parameters: {
			title: 'Fantom\'s Fury 👻⚡',
			href: 'https://ape.tax/fantomsfury',
			contractAddress: '0x36e7aF39b921235c4b01508BE38F27A535851a5c',
			underlyingTokenAddress: '0x21be370d5312f44cb42ce377bc9b8a0cef1a4c83',
			underlyingTokenDecimal: 18,
			underlyingTokenSymbol: 'WFTM',
			underlyingTokenCgID: 'fantom',
			underlyingTokenIcon: '/tokens/fantom.png',
			author: 'poolpitako',
		},
		network: 'fantom',
		list: 'ape.tax',
		prepare: (p, a, n, normalTx, erc20Tx) => PrepareStrategyApe(p, a, n, normalTx, erc20Tx),
		detect: (p, a, n, normalTx, erc20Tx) => DetectStrategyApe(p, a, n, normalTx, erc20Tx),
		Strategy: StrategyApe
	},

}
const	STRATEGIES_APE_TAX = {
	'Wrapped Ultra Sound Money 🦇🔊': {
		parameters: {
			title: 'Wrapped Ultra Sound Money 🦇🔊',
			href: 'https://ape.tax/ultrasoundmoney',
			contractAddress: '0xa258C4606Ca8206D8aA700cE2143D7db854D168c',
			underlyingTokenAddress: '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2',
			underlyingTokenSymbol: 'WETH',
			underlyingTokenCgID: 'eth',
			underlyingTokenIcon: '/tokens/weth.png',
			author: 'fameal',
		},
		network: 'ethereum',
		list: 'ape.tax',
		prepare: (p, a, n, normalTx, erc20Tx) => PrepareStrategyApe(p, a, n, normalTx, erc20Tx),
		detect: (p, a, n, normalTx, erc20Tx) => DetectStrategyApe(p, a, n, normalTx, erc20Tx),
		Strategy: StrategyApe
	},
	'The Frog Prince 🐸💋 2': {
		parameters: {
			title: 'The Frog Prince 🐸💋 2',
			href: 'https://ape.tax/frogprince2',
			contractAddress: '0x671a912C10bba0CFA74Cfc2d6Fba9BA1ed9530B2',
			underlyingTokenAddress: '0x514910771af9ca656af840dff83e8264ecf986ca',
			underlyingTokenSymbol: 'LINK',
			underlyingTokenDecimal: 18,
			underlyingTokenCgID: 'link',
			underlyingTokenIcon: '/tokens/link.svg',
			author: 'jmonteer23',
		},
		network: 'ethereum',
		list: 'ape.tax',
		prepare: (p, a, n, normalTx, erc20Tx) => PrepareStrategyApe(p, a, n, normalTx, erc20Tx),
		detect: (p, a, n, normalTx, erc20Tx) => DetectStrategyApe(p, a, n, normalTx, erc20Tx),
		Strategy: StrategyApe
	},
	'Comfi Carousel 🛋🎠': {
		parameters: {
			title: 'Comfi Carousel 🛋🎠',
			href: 'https://ape.tax/complifiusdc',
			contractAddress: '0x71955515ADF20cBDC699B8bC556Fc7Fd726B31B0',
			underlyingTokenAddress: '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48',
			underlyingTokenSymbol: 'USDC',
			underlyingTokenDecimal: 6,
			underlyingTokenCgID: 'usd-coin',
			underlyingTokenIcon: '/tokens/usdc.svg',
			author: 'fp_crypto',
		},
		network: 'ethereum',
		list: 'ape.tax',
		prepare: (p, a, n, normalTx, erc20Tx) => PrepareStrategyApe(p, a, n, normalTx, erc20Tx),
		detect: (p, a, n, normalTx, erc20Tx) => DetectStrategyApe(p, a, n, normalTx, erc20Tx),
		Strategy: StrategyApe
	},
	'Reflex me 📷💚': {
		parameters: {
			title: 'Reflex me 📷💚',
			href: 'https://ape.tax/rai',
			contractAddress: '0x4856a7efbbfcae92ab13c5e2e322fc77647bb856',
			underlyingTokenAddress: '0x03ab458634910aad20ef5f1c8ee96f1d6ac54919',
			underlyingTokenSymbol: 'RAI',
			underlyingTokenDecimal: 18,
			underlyingTokenCgID: 'rai',
			underlyingTokenIcon: '/tokens/rai.png',
			author: 'emilianobonassi',
		},
		network: 'ethereum',
		list: 'ape.tax',
		prepare: (p, a, n, normalTx, erc20Tx) => PrepareStrategyApe(p, a, n, normalTx, erc20Tx),
		detect: (p, a, n, normalTx, erc20Tx) => DetectStrategyApe(p, a, n, normalTx, erc20Tx),
		Strategy: StrategyApe
	},
	'Old Grandmaster\'s DAI ♟👴': {
		parameters: {
			title: 'Old Grandmaster\'s DAI ♟👴',
			href: 'https://ape.tax/grandmastersdai',
			contractAddress: '0xB98Df7163E61bf053564bde010985f67279BBCEC',
			underlyingTokenAddress: '0x6b175474e89094c44da98b954eedeac495271d0f',
			underlyingTokenSymbol: 'DAI',
			underlyingTokenDecimal: 18,
			underlyingTokenCgID: 'dai',
			underlyingTokenIcon: '/tokens/dai.svg',
			author: '_tonkers',
		},
		network: 'ethereum',
		list: 'ape.tax',
		prepare: (p, a, n, normalTx, erc20Tx) => PrepareStrategyApe(p, a, n, normalTx, erc20Tx),
		detect: (p, a, n, normalTx, erc20Tx) => DetectStrategyApe(p, a, n, normalTx, erc20Tx),
		Strategy: StrategyApe
	},
	'ETH\'s Ape Ape Baby 🧊👶': {
		parameters: {
			title: 'ETH\'s Ape Ape Baby 🧊👶',
			href: 'https://ape.tax/ethbaby',
			contractAddress: '0xD2C65E20C3fDE3F18097e7414e65596e0C83B1a9',
			underlyingTokenAddress: '0xf16e81dce15b08f326220742020379b855b87df9',
			underlyingTokenSymbol: 'ICE',
			underlyingTokenDecimal: 18,
			underlyingTokenCgID: 'ice-token',
			underlyingTokenIcon: '/tokens/ice.png',
			author: 'poolpitako',
		},
		network: 'ethereum',
		list: 'ape.tax',
		prepare: (p, a, n, normalTx, erc20Tx) => PrepareStrategyApe(p, a, n, normalTx, erc20Tx),
		detect: (p, a, n, normalTx, erc20Tx) => DetectStrategyApe(p, a, n, normalTx, erc20Tx),
		Strategy: StrategyApe
	},
	'Bank Sushi 🏦🍣': {
		parameters: {
			title: 'Bank Sushi 🏦🍣',
			href: 'https://ape.tax/sushibank',
			contractAddress: '0xb32747b4045479b77a8b8eb44029ba12580214f8',
			underlyingTokenAddress: '0x6b3595068778dd592e39a122f4f5a5cf09c90fe2',
			underlyingTokenSymbol: 'SUSHI',
			underlyingTokenDecimal: 18,
			underlyingTokenCgID: 'sushi',
			underlyingTokenIcon: '/tokens/sushi.png',
			author: 'akshaynexust',
		},
		network: 'ethereum',
		list: 'ape.tax',
		prepare: (p, a, n, normalTx, erc20Tx) => PrepareStrategyApe(p, a, n, normalTx, erc20Tx),
		detect: (p, a, n, normalTx, erc20Tx) => DetectStrategyApe(p, a, n, normalTx, erc20Tx),
		Strategy: StrategyApe
	},
	'Pool with Us 🏊‍♂️👩‍👩‍👧‍👧': {
		parameters: {
			title: 'Pool with Us 🏊‍♂️👩‍👩‍👧‍👧',
			href: 'https://ape.tax/poolwithus',
			contractAddress: '0x2F194Da57aa855CAa02Ea3Ab991fa5d38178B9e6',
			underlyingTokenAddress: '0x1f9840a85d5af5bf1d1762f925bdaddc4201f984',
			underlyingTokenSymbol: 'UNI',
			underlyingTokenDecimal: 18,
			underlyingTokenCgID: 'uniswap',
			underlyingTokenIcon: '/tokens/uni.svg',
			author: 'mattdwest',
		},
		network: 'ethereum',
		list: 'ape.tax',
		prepare: (p, a, n, normalTx, erc20Tx) => PrepareStrategyApe(p, a, n, normalTx, erc20Tx),
		detect: (p, a, n, normalTx, erc20Tx) => DetectStrategyApe(p, a, n, normalTx, erc20Tx),
		Strategy: StrategyApe
	},
	'True Idle T🛌': {
		parameters: {
			title: 'True Idle T🛌',
			href: 'https://ape.tax/trueidle',
			contractAddress: '0x49b3E44e54b6220aF892DbA48ae45F1Ea6bC4aE9',
			underlyingTokenAddress: '0x0000000000085d4780b73119b644ae5ecd22b376',
			underlyingTokenSymbol: 'TUSD',
			underlyingTokenDecimal: 18,
			underlyingTokenCgID: 'true-usd',
			underlyingTokenIcon: '/tokens/tusd.svg',
			author: 'emilianobonassi',
		},
		network: 'ethereum',
		list: 'ape.tax',
		prepare: (p, a, n, normalTx, erc20Tx) => PrepareStrategyApe(p, a, n, normalTx, erc20Tx),
		detect: (p, a, n, normalTx, erc20Tx) => DetectStrategyApe(p, a, n, normalTx, erc20Tx),
		Strategy: StrategyApe
	},
	'Idle Tether 🛌T': {
		parameters: {
			title: 'Idle Tether 🛌T',
			href: 'https://ape.tax/idletether',
			contractAddress: '0xAf322a2eDf31490250fdEb0D712621484b09aBB6',
			underlyingTokenAddress: '0xdac17f958d2ee523a2206206994597c13d831ec7',
			underlyingTokenSymbol: 'USDT',
			underlyingTokenDecimal: 6,
			underlyingTokenCgID: 'tether',
			underlyingTokenIcon: '/tokens/usdt.svg',
			author: 'emilianobonassi',
		},
		network: 'ethereum',
		list: 'ape.tax',
		prepare: (p, a, n, normalTx, erc20Tx) => PrepareStrategyApe(p, a, n, normalTx, erc20Tx),
		detect: (p, a, n, normalTx, erc20Tx) => DetectStrategyApe(p, a, n, normalTx, erc20Tx),
		Strategy: StrategyApe
	},
	'Data AAVE 💿🕊': {
		parameters: {
			title: 'Data AAVE 💿🕊',
			href: 'https://ape.tax/dataaave',
			contractAddress: '0xAc1C90b9c76d56BA2e24F3995F7671c745f8f308',
			underlyingTokenAddress: '0x7fc66500c84a76ad7e9c93437bfc5ac33e2ddae9',
			underlyingTokenSymbol: 'AAVE',
			underlyingTokenCgID: 'aave',
			underlyingTokenIcon: '/tokens/aave.png',
			author: '0xangelfish',
		},
		network: 'ethereum',
		prepare: (p, a, n, normalTx, erc20Tx) => PrepareStrategyApe(p, a, n, normalTx, erc20Tx),
		detect: (p, a, n, normalTx, erc20Tx) => DetectStrategyApe(p, a, n, normalTx, erc20Tx),
		list: 'ape.tax',
		Strategy: StrategyApe
	},
	'Full Metal Farmer 🧙‍♂️🧪': {
		parameters: {
			title: 'Full Metal Farmer 🧙‍♂️🧪',
			href: 'https://ape.tax/fullmetalfarmer',
			contractAddress: '0x56A5Fd5104a4956898753dfb060ff32882Ae0eb4',
			underlyingTokenAddress: '0xdbdb4d16eda451d0503b854cf79d55697f90c8df',
			underlyingTokenSymbol: 'ALCX',
			underlyingTokenCgID: 'alchemix',
			underlyingTokenIcon: '/tokens/alcx.png',
			author: 'akshaynexust',
		},
		network: 'ethereum',
		prepare: (p, a, n, normalTx, erc20Tx) => PrepareStrategyApe(p, a, n, normalTx, erc20Tx),
		detect: (p, a, n, normalTx, erc20Tx) => DetectStrategyApe(p, a, n, normalTx, erc20Tx),
		list: 'ape.tax',
		Strategy: StrategyApe
	},
	'sUSD Idle 🏆⚔️': {
		parameters: {
			title: 'sUSD Idle 🏆⚔️',
			href: 'https://ape.tax/susdidle',
			contractAddress: '0x3466c90017F82DDA939B01E8DBd9b0f97AEF8DfC',
			underlyingTokenAddress: '0x57ab1ec28d129707052df4df418d58a2d46d5f51',
			underlyingTokenSymbol: 'sUSD',
			underlyingTokenCgID: 'nusd',
			underlyingTokenIcon: '/tokens/susd.png',
			author: 'emilianobonassi',
		},
		network: 'ethereum',
		prepare: (p, a, n, normalTx, erc20Tx) => PrepareStrategyApe(p, a, n, normalTx, erc20Tx),
		detect: (p, a, n, normalTx, erc20Tx) => DetectStrategyApe(p, a, n, normalTx, erc20Tx),
		list: 'ape.tax',
		Strategy: StrategyApe
	},
	'WETH Gen Lender 🧬💰': {
		parameters: {
			title: 'WETH Gen Lender 🧬💰',
			href: 'https://ape.tax/wethgenlender',
			contractAddress: '0xac333895ce1a73875cf7b4ecdc5a743c12f3d82b',
			underlyingTokenAddress: '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2',
			underlyingTokenSymbol: 'WETH',
			underlyingTokenCgID: 'eth',
			underlyingTokenIcon: '/tokens/weth.png',
			author: 'arbingsam',
		},
		network: 'ethereum',
		prepare: (p, a, n, normalTx, erc20Tx) => PrepareStrategyApe(p, a, n, normalTx, erc20Tx),
		detect: (p, a, n, normalTx, erc20Tx) => DetectStrategyApe(p, a, n, normalTx, erc20Tx),
		list: 'ape.tax',
		Strategy: StrategyApe
	},
	'WETH Iron Lender 🦾💰': {
		parameters: {
			title: 'WETH Iron Lender 🦾💰',
			href: 'https://ape.tax/ironlender',
			contractAddress: '0xED0244B688cF059f32f45E38A6ac6E479D6755f6',
			underlyingTokenAddress: '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2',
			underlyingTokenSymbol: 'WETH',
			underlyingTokenCgID: 'eth',
			underlyingTokenIcon: '/tokens/weth.png',
			author: 'arbingsam',
		},
		network: 'ethereum',
		prepare: (p, a, n, normalTx, erc20Tx) => PrepareStrategyApe(p, a, n, normalTx, erc20Tx),
		detect: (p, a, n, normalTx, erc20Tx) => DetectStrategyApe(p, a, n, normalTx, erc20Tx),
		list: 'ape.tax',
		Strategy: StrategyApe
	},
	'st. Ether-ETH Pool 💧🎱': {
		parameters: {
			title: 'st. Ether-ETH Pool 💧🎱',
			href: 'https://ape.tax/stecrv',
			contractAddress: '0xdCD90C7f6324cfa40d7169ef80b12031770B4325',
			underlyingTokenAddress: '0x06325440d014e39736583c165c2963ba99faf14e',
			underlyingTokenSymbol: 'steCRV',
			underlyingTokenCgID: 'eth',
			underlyingTokenIcon: '/tokens/stecrv.png',
			author: 'arbingsam',
		},
		network: 'ethereum',
		prepare: (p, a, n, normalTx, erc20Tx) => PrepareStrategyApe(p, a, n, normalTx, erc20Tx),
		detect: (p, a, n, normalTx, erc20Tx) => DetectStrategyApe(p, a, n, normalTx, erc20Tx),
		list: 'ape.tax',
		Strategy: StrategyApe
	}
}

// eslint-disable-next-line no-unused-vars
const	STRATEGIES_YEARN_V1_DEPRECIED = {
	'Yearn V1 - mUSD': {
		parameters: {
			title: 'Yearn V1 - mUSD',
			href: 'https://yearn.finance/vaults/0xE0db48B4F71752C4bEf16De1DBD042B82976b8C7',
			contractAddress: '0xE0db48B4F71752C4bEf16De1DBD042B82976b8C7',
			tokenIcon: '/tokens/ymusd.png',
			underlyingTokenAddress: '0xe2f2a5c287993345a840db3b0845fbc70f5935a5',
			underlyingTokenSymbol: 'mUSD',
			underlyingTokenDecimal: 18,
			underlyingTokenCgID: 'mstable-usd',
			underlyingTokenIcon: '/tokens/musd.png',
			author: 'iearnfinance',
		},
		network: 'ethereum',
		list: 'yearn',
		prepare: (p, a, n, normalTx, erc20Tx) => PrepareStrategyYearnV1(p, a, n, normalTx, erc20Tx),
		Strategy: StrategyYearnV1
	},
}
const	STRATEGIES_YEARN_V1 = {
	'Yearn V1 - DAI': {
		parameters: {
			title: 'Yearn V1 - DAI',
			href: 'https://yearn.finance/vaults/0xACd43E627e64355f1861cEC6d3a6688B31a6F952',
			contractAddress: '0xACd43E627e64355f1861cEC6d3a6688B31a6F952',
			tokenIcon: '/tokens/ydai.png',
			underlyingTokenAddress: '0x6b175474e89094c44da98b954eedeac495271d0f',
			underlyingTokenSymbol: 'DAI',
			underlyingTokenCgID: 'dai',
			underlyingTokenIcon: '/tokens/dai.svg',
			author: 'iearnfinance',
		},
		network: 'ethereum',
		list: 'yearn',
		prepare: (p, a, n, normalTx, erc20Tx) => PrepareStrategyYearnV1(p, a, n, normalTx, erc20Tx),
		Strategy: StrategyYearnV1
	},
	'Yearn V1 - TUSD': {
		parameters: {
			title: 'Yearn V1 - TUSD',
			href: 'https://yearn.finance/vaults/0x37d19d1c4E1fa9DC47bD1eA12f742a0887eDa74a',
			contractAddress: '0x37d19d1c4E1fa9DC47bD1eA12f742a0887eDa74a',
			tokenIcon: '/tokens/ytusd.png',
			underlyingTokenAddress: '0x0000000000085d4780b73119b644ae5ecd22b376',
			underlyingTokenSymbol: 'TUSD',
			underlyingTokenCgID: 'true-usd',
			underlyingTokenIcon: '/tokens/tusd.svg',
			author: 'iearnfinance',
		},
		network: 'ethereum',
		list: 'yearn',
		prepare: (p, a, n, normalTx, erc20Tx) => PrepareStrategyYearnV1(p, a, n, normalTx, erc20Tx),
		Strategy: StrategyYearnV1
	},
	'Yearn V1 - USDC': {
		parameters: {
			title: 'Yearn V1 - USDC',
			href: 'https://yearn.finance/vaults/0x597aD1e0c13Bfe8025993D9e79C69E1c0233522e',
			contractAddress: '0x597aD1e0c13Bfe8025993D9e79C69E1c0233522e',
			tokenIcon: '/tokens/yusdc.png',
			underlyingTokenAddress: '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48',
			underlyingTokenSymbol: 'USDC',
			underlyingTokenDecimal: 6,
			underlyingTokenCgID: 'usd-coin',
			underlyingTokenIcon: '/tokens/usdc.svg',
			author: 'iearnfinance',
		},
		network: 'ethereum',
		list: 'yearn',
		prepare: (p, a, n, normalTx, erc20Tx) => PrepareStrategyYearnV1(p, a, n, normalTx, erc20Tx),
		Strategy: StrategyYearnV1
	},
	'Yearn V1 - USDT': {
		parameters: {
			title: 'Yearn V1 - USDT',
			href: 'https://yearn.finance/vaults/0x2f08119C6f07c006695E079AAFc638b8789FAf18',
			contractAddress: '0x2f08119C6f07c006695E079AAFc638b8789FAf18',
			tokenIcon: '/tokens/yusdt.png',
			underlyingTokenAddress: '0xdac17f958d2ee523a2206206994597c13d831ec7',
			underlyingTokenSymbol: 'USDT',
			underlyingTokenDecimal: 6,
			underlyingTokenCgID: 'tether',
			underlyingTokenIcon: '/tokens/usdt.svg',
			author: 'iearnfinance',
		},
		network: 'ethereum',
		list: 'yearn',
		prepare: (p, a, n, normalTx, erc20Tx) => PrepareStrategyYearnV1(p, a, n, normalTx, erc20Tx),
		Strategy: StrategyYearnV1
	}
}

// eslint-disable-next-line no-unused-vars
const	STRATEGIES_YEARN_V1_CRV_DEPRECIED = {
	'Yearn V1 - crvLINK': {
		parameters: {
			title: 'Yearn V1 - crvLINK',
			href: 'https://yearn.fi/invest/0x96Ea6AF74Af09522fCB4c28C269C26F59a31ced6',
			contractAddress: '0x96Ea6AF74Af09522fCB4c28C269C26F59a31ced6',
			tokenIcon: '/tokens/yvlinkCRV.png',
			tokenSymbol: 'yvlinkCRV',
			underlyingTokenAddress: '0xcee60cfa923170e4f8204ae08b4fa6a3f5656f3a',
			underlyingTokenSymbol: 'linkCRV',
			underlyingTokenName: 'Curve.fi LINK/sLINK',
			underlyingTokenDecimal: 18,
			underlyingTokenCgID: 'linkCRV',
			underlyingTokenIcon: '/tokens/curve.png',
			author: 'iearnfinance',
		},
		network: 'ethereum',
		list: 'yearn-crv',
		prepare: (p, a, n, normalTx, erc20Tx) => PrepareStrategyYearnCrvV1(p, a, n, normalTx, erc20Tx),
		Strategy: StrategyYearnCrvV1
	},
	'Yearn V1 - crvMUSD': {
		parameters: {
			title: 'Yearn V1 - crvMUSD',
			href: 'https://yearn.fi/invest/0x0fcdaedfb8a7dfda2e9838564c5a1665d856afdf',
			contractAddress: '0x0fcdaedfb8a7dfda2e9838564c5a1665d856afdf',
			tokenIcon: '/tokens/yvmusdCRV.png',
			tokenSymbol: 'yvmusd3CRV',
			underlyingTokenAddress: '0x1aef73d49dedc4b1778d0706583995958dc862e6',
			underlyingTokenSymbol: 'musd3CRV',
			underlyingTokenName: 'Curve.fi MUSD/3Crv',
			underlyingTokenDecimal: 18,
			underlyingTokenCgID: 'musd3CRV',
			underlyingTokenIcon: '/tokens/curve.png',
			author: 'iearnfinance',
		},
		network: 'ethereum',
		list: 'yearn-crv',
		prepare: (p, a, n, normalTx, erc20Tx) => PrepareStrategyYearnCrvV1(p, a, n, normalTx, erc20Tx),
		Strategy: StrategyYearnCrvV1
	},
	'Yearn V1 - crvUSDN': {
		parameters: {
			title: 'Yearn V1 - crvUSDN',
			href: 'https://yearn.fi/invest/0xfe39ce91437c76178665d64d7a2694b0f6f17fe3',
			contractAddress: '0xfe39ce91437c76178665d64d7a2694b0f6f17fe3',
			tokenIcon: '/tokens/yvusdn3CRV.png',
			tokenSymbol: 'yvusdn3CRV',
			underlyingTokenAddress: '0x4f3e8f405cf5afc05d68142f3783bdfe13811522',
			underlyingTokenSymbol: 'usdn3CRV',
			underlyingTokenName: 'Curve.fi USDN/3Crv',
			underlyingTokenDecimal: 18,
			underlyingTokenCgID: 'usdn3CRV',
			underlyingTokenIcon: '/tokens/curve.png',
			author: 'iearnfinance',
		},
		network: 'ethereum',
		list: 'yearn-crv',
		prepare: (p, a, n, normalTx, erc20Tx) => PrepareStrategyYearnCrvV1(p, a, n, normalTx, erc20Tx),
		Strategy: StrategyYearnCrvV1
	},
	'Yearn V1 - crvUST': {
		parameters: {
			title: 'Yearn V1 - crvUST',
			href: 'https://yearn.fi/invest/0xf6c9e9af314982a4b38366f4abfaa00595c5a6fc',
			contractAddress: '0xf6c9e9af314982a4b38366f4abfaa00595c5a6fc',
			tokenIcon: '/tokens/yvust3CRV.png',
			tokenSymbol: 'yvust3CRV',
			underlyingTokenAddress: '0x94e131324b6054c0d789b190b2dac504e4361b53',
			underlyingTokenSymbol: 'ust3CRV',
			underlyingTokenName: 'Curve.fi UST/3Crv',
			underlyingTokenDecimal: 18,
			underlyingTokenCgID: 'ust3CRV',
			underlyingTokenIcon: '/tokens/curve.png',
			author: 'iearnfinance',
		},
		network: 'ethereum',
		list: 'yearn-crv',
		prepare: (p, a, n, normalTx, erc20Tx) => PrepareStrategyYearnCrvV1(p, a, n, normalTx, erc20Tx),
		Strategy: StrategyYearnCrvV1
	}
}
const	STRATEGIES_YEARN_V1_CRV = {
	'Yearn V1 - crvEURS': {
		parameters: {
			title: 'Yearn V1 - crvEURS',
			href: 'https://yearn.fi/invest/0x98B058b2CBacF5E99bC7012DF757ea7CFEbd35BC',
			contractAddress: '0x98B058b2CBacF5E99bC7012DF757ea7CFEbd35BC',
			tokenIcon: '/tokens/yveursCRV.png',
			tokenSymbol: 'yveursCRV',
			underlyingTokenAddress: '0x194ebd173f6cdace046c53eacce9b953f28411d1',
			underlyingTokenSymbol: 'eursCRV',
			underlyingTokenName: 'Curve.fi EURS/sEUR',
			underlyingTokenDecimal: 18,
			underlyingTokenCgID: 'eursCRV',
			underlyingTokenIcon: '/tokens/curve.png',
			author: 'iearnfinance',
		},
		network: 'ethereum',
		list: 'yearn-crv',
		prepare: (p, a, n, normalTx, erc20Tx) => PrepareStrategyYearnCrvV1(p, a, n, normalTx, erc20Tx),
		Strategy: StrategyYearnCrvV1
	},
	'Yearn V1 - crvSUSD': {
		parameters: {
			title: 'Yearn V1 - crvSUSD',
			href: 'https://yearn.fi/invest/0x5533ed0a3b83f70c3c4a1f69ef5546d3d4713e44',
			contractAddress: '0x5533ed0a3b83f70c3c4a1f69ef5546d3d4713e44',
			tokenIcon: '/tokens/yvcrvPlain3andSUSD.png',
			tokenSymbol: 'yvcrvPlain3andSUSD',
			underlyingTokenAddress: '0xc25a3a3b969415c80451098fa907ec722572917f',
			underlyingTokenSymbol: 'crvPlain3andSUSD',
			underlyingTokenName: 'Curve.fi DAI/USDC/USDT/sUSD',
			underlyingTokenDecimal: 18,
			underlyingTokenCgID: 'crvPlain3andSUSD',
			underlyingTokenIcon: '/tokens/curve.png',
			author: 'iearnfinance',
		},
		network: 'ethereum',
		list: 'yearn-crv',
		prepare: (p, a, n, normalTx, erc20Tx) => PrepareStrategyYearnCrvV1(p, a, n, normalTx, erc20Tx),
		Strategy: StrategyYearnCrvV1
	},
	'Yearn V1 - crvHUSD': {
		parameters: {
			title: 'Yearn V1 - crvHUSD',
			href: 'https://yearn.fi/invest/0x39546945695dcb1c037c836925b355262f551f55',
			contractAddress: '0x39546945695dcb1c037c836925b355262f551f55',
			tokenIcon: '/tokens/yvhusd3CRV.png',
			tokenSymbol: 'yvhusd3CRV',
			underlyingTokenAddress: '0x5b5cfe992adac0c9d48e05854b2d91c73a003858',
			underlyingTokenSymbol: 'husd3CRV',
			underlyingTokenName: 'Curve.fi HUSD/3Crv',
			underlyingTokenDecimal: 18,
			underlyingTokenCgID: 'husd3CRV',
			underlyingTokenIcon: '/tokens/curve.png',
			author: 'iearnfinance',
		},
		network: 'ethereum',
		list: 'yearn-crv',
		prepare: (p, a, n, normalTx, erc20Tx) => PrepareStrategyYearnCrvV1(p, a, n, normalTx, erc20Tx),
		Strategy: StrategyYearnCrvV1
	},
	'Yearn V1 - crvAAVE': {
		parameters: {
			title: 'Yearn V1 - crvDUSD',
			href: 'https://yearn.fi/invest/0x98B058b2CBacF5E99bC7012DF757ea7CFEbd35BC',
			contractAddress: '0x03403154afc09ce8e44c3b185c82c6ad5f86b9ab',
			tokenIcon: '/tokens/yva3CRV.png',
			tokenSymbol: 'yva3CRV',
			underlyingTokenAddress: '0xfd2a8fa60abd58efe3eee34dd494cd491dc14900',
			underlyingTokenSymbol: 'a3CRV',
			underlyingTokenName: 'Curve.fi aDAI/aUSDC/aUSDT',
			underlyingTokenDecimal: 18,
			underlyingTokenCgID: 'a3CRV',
			underlyingTokenIcon: '/tokens/curve.png',
			author: 'iearnfinance',
		},
		network: 'ethereum',
		list: 'yearn-crv',
		prepare: (p, a, n, normalTx, erc20Tx) => PrepareStrategyYearnCrvV1(p, a, n, normalTx, erc20Tx),
		Strategy: StrategyYearnCrvV1
	},
	'Yearn V1 - crvUSDP': {
		parameters: {
			title: 'yearn V1 - crvUSDP',
			href: 'https://yearn.fi/invest/0x1b5eb1173d2bf770e50f10410c9a96f7a8eb6e75',
			contractAddress: '0x1b5eb1173d2bf770e50f10410c9a96f7a8eb6e75',
			tokenIcon: '/tokens/yvusdp3CRV.png',
			tokenSymbol: 'yvusdp3CRV',
			underlyingTokenAddress: '0x7eb40e450b9655f4b3cc4259bcc731c63ff55ae6',
			underlyingTokenSymbol: 'usdp3CRV',
			underlyingTokenName: 'Curve.fi USDP/3Crv',
			underlyingTokenDecimal: 18,
			underlyingTokenCgID: 'usdp3CRV',
			underlyingTokenIcon: '/tokens/curve.png',
			author: 'iearnfinance',
		},
		network: 'ethereum',
		list: 'yearn-crv',
		prepare: (p, a, n, normalTx, erc20Tx) => PrepareStrategyYearnCrvV1(p, a, n, normalTx, erc20Tx),
		Strategy: StrategyYearnCrvV1
	},
	'yearn V1 - crvAETH': {
		parameters: {
			title: 'yearn V1 - crvAETH',
			href: 'https://yearn.fi/invest/0xe625f5923303f1ce7a43acfefd11fd12f30dbca4',
			contractAddress: '0xe625f5923303f1ce7a43acfefd11fd12f30dbca4',
			tokenIcon: '/tokens/yvankrCRV.png',
			tokenSymbol: 'yvankrCRV',
			underlyingTokenAddress: '0xaa17a236f2badc98ddc0cf999abb47d47fc0a6cf',
			underlyingTokenSymbol: 'ankrCRV',
			underlyingTokenName: 'Curve.fi ETH/aETH',
			underlyingTokenDecimal: 18,
			underlyingTokenCgID: 'ankrCRV',
			underlyingTokenIcon: '/tokens/curve.png',
			author: 'iearnfinance',
		},
		network: 'ethereum',
		list: 'yearn-crv',
		prepare: (p, a, n, normalTx, erc20Tx) => PrepareStrategyYearnCrvV1(p, a, n, normalTx, erc20Tx),
		Strategy: StrategyYearnCrvV1
	},	
}

const	STRATEGIES_YEARN_V2 = {
	'Yearn V2 - wETH': {
		parameters: {
			title: 'Yearn V2 - wETH',
			href: 'https://yearn.fi/invest/0xa9fE4601811213c340e850ea305481afF02f5b28',
			contractAddress: '0xa9fE4601811213c340e850ea305481afF02f5b28',
			tokenIcon: '/tokens/yweth.png',
			tokenSymbol: 'yvWETH',
			tokenName: 'WETH yVault',
			tokenDecimal: 18,
			underlyingTokenAddress: '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2',
			underlyingTokenSymbol: 'WETH',
			underlyingTokenName: 'Wrapped Ether',
			underlyingTokenDecimal: 18,
			underlyingTokenCgID: 'eth',
			underlyingTokenIcon: '/tokens/eth.svg',
			author: 'iearnfinance',
		},
		network: 'ethereum',
		list: 'yearn',
		prepare: (p, a, n, normalTx, erc20Tx) => PrepareStrategyYearnV2(p, a, n, normalTx, erc20Tx),
		Strategy: StrategyYearnV2
	},
	'Yearn V2 - YFI': {
		parameters: {
			title: 'Yearn V2 - YFI',
			href: 'https://yearn.fi/invest/0xE14d13d8B3b85aF791b2AADD661cDBd5E6097Db1',
			contractAddress: '0xE14d13d8B3b85aF791b2AADD661cDBd5E6097Db1',
			tokenIcon: '/tokens/yyfi.png',
			tokenSymbol: 'yvYFI',
			tokenName: 'YFI yVault',
			tokenDecimal: 18,
			underlyingTokenAddress: '0x0bc529c00c6401aef6d220be8c6ea1667f6ad93e',
			underlyingTokenSymbol: 'YFI',
			underlyingTokenName: 'yearn.finance',
			underlyingTokenDecimal: 18,
			underlyingTokenCgID: 'yearn-finance',
			underlyingTokenIcon: '/tokens/yfi.svg',
			author: 'iearnfinance',
		},
		network: 'ethereum',
		list: 'yearn',
		prepare: (p, a, n, normalTx, erc20Tx) => PrepareStrategyYearnV2(p, a, n, normalTx, erc20Tx),
		Strategy: StrategyYearnV2
	},
	'Yearn V2 - wBTC': {
		parameters: {
			title: 'Yearn V2 - wBTC',
			href: 'https://yearn.fi/invest/0xA696a63cc78DfFa1a63E9E50587C197387FF6C7E',
			contractAddress: '0xA696a63cc78DfFa1a63E9E50587C197387FF6C7E',
			tokenIcon: '/tokens/ywbtc.png',
			tokenSymbol: 'yvWBTC',
			tokenName: 'WBTC yVault',
			tokenDecimal: 8,
			underlyingTokenAddress: '0x2260fac5e5542a773aa44fbcfedf7c193bc2c599',
			underlyingTokenSymbol: 'WBTC',
			underlyingTokenName: 'Wrapped BTC',
			underlyingTokenDecimal: 8,
			underlyingTokenCgID: 'btc',
			underlyingTokenIcon: '/tokens/btc.svg',
			author: 'iearnfinance',
		},
		network: 'ethereum',
		list: 'yearn',
		prepare: (p, a, n, normalTx, erc20Tx) => PrepareStrategyYearnV2(p, a, n, normalTx, erc20Tx),
		Strategy: StrategyYearnV2
	},

	'Yearn V2 - DAI': {
		parameters: {
			title: 'Yearn V2 - DAI',
			href: 'https://yearn.fi/invest/0x19D3364A399d251E894aC732651be8B0E4e85001',
			contractAddress: '0x19D3364A399d251E894aC732651be8B0E4e85001',
			tokenIcon: '/tokens/ydai.png',
			tokenSymbol: 'yvDAI',
			tokenName: 'DAI yVault',
			tokenDecimal: 18,
			underlyingTokenAddress: '0x6b175474e89094c44da98b954eedeac495271d0f',
			underlyingTokenSymbol: 'DAI',
			underlyingTokenName: 'Dai Stablecoin',
			underlyingTokenDecimal: 18,
			underlyingTokenCgID: 'dai',
			underlyingTokenIcon: '/tokens/dai.svg',
			author: 'iearnfinance',
		},
		network: 'ethereum',
		list: 'yearn',
		prepare: (p, a, n, normalTx, erc20Tx) => PrepareStrategyYearnV2(p, a, n, normalTx, erc20Tx),
		Strategy: StrategyYearnV2
	},
	'Yearn V2 - USDC': {
		parameters: {
			title: 'Yearn V2 - USDC',
			href: 'https://yearn.fi/invest/0x5f18C75AbDAe578b483E5F43f12a39cF75b973a9',
			contractAddress: '0x5f18C75AbDAe578b483E5F43f12a39cF75b973a9',
			tokenIcon: '/tokens/yusdc.png',
			tokenSymbol: 'yvUSDC',
			tokenName: 'USDC yVault',
			tokenDecimal: 6,
			underlyingTokenAddress: '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48',
			underlyingTokenSymbol: 'USDC',
			underlyingTokenName: 'USD Coin',
			underlyingTokenDecimal: 6,
			underlyingTokenCgID: 'usd-coin',
			underlyingTokenIcon: '/tokens/usdc.svg',
			author: 'iearnfinance',
		},
		network: 'ethereum',
		list: 'yearn',
		prepare: (p, a, n, normalTx, erc20Tx) => PrepareStrategyYearnV2(p, a, n, normalTx, erc20Tx),
		Strategy: StrategyYearnV2
	},
	'Yearn V2 - USDT': {
		parameters: {
			title: 'Yearn V2 - USDT',
			href: 'https://yearn.fi/invest/0x7Da96a3891Add058AdA2E826306D812C638D87a7',
			contractAddress: '0x7Da96a3891Add058AdA2E826306D812C638D87a7',
			tokenIcon: '/tokens/yusdt.png',
			tokenSymbol: 'yvUSDT',
			tokenName: 'USDT yVault',
			tokenDecimal: 6,
			underlyingTokenAddress: '0xdac17f958d2ee523a2206206994597c13d831ec7',
			underlyingTokenSymbol: 'USDT',
			underlyingTokenName: 'Tether USD',
			underlyingTokenDecimal: 6,
			underlyingTokenCgID: 'tether',
			underlyingTokenIcon: '/tokens/usdt.svg',
			author: 'iearnfinance',
		},
		network: 'ethereum',
		list: 'yearn',
		prepare: (p, a, n, normalTx, erc20Tx) => PrepareStrategyYearnV2(p, a, n, normalTx, erc20Tx),
		Strategy: StrategyYearnV2
	},
	'Yearn V2 - sUSD': {
		parameters: {
			title: 'Yearn V2 - sUSD',
			href: 'https://yearn.fi/invest/0xa5cA62D95D24A4a350983D5B8ac4EB8638887396',
			contractAddress: '0xa5cA62D95D24A4a350983D5B8ac4EB8638887396',
			tokenIcon: '/tokens/ywbtc.png',
			tokenSymbol: 'yvsUSD',
			tokenName: 'sUSD yVault',
			tokenDecimal: 18,
			underlyingTokenAddress: '0x57ab1ec28d129707052df4df418d58a2d46d5f51',
			underlyingTokenSymbol: 'sUSD',
			underlyingTokenName: 'Synth sUSD',
			underlyingTokenDecimal: 18,
			underlyingTokenCgID: 'nusd',
			underlyingTokenIcon: '/tokens/susd.png',
			author: 'iearnfinance',
		},
		network: 'ethereum',
		list: 'yearn',
		prepare: (p, a, n, normalTx, erc20Tx) => PrepareStrategyYearnV2(p, a, n, normalTx, erc20Tx),
		Strategy: StrategyYearnV2
	},
	'Yearn V2 - SNX': {
		parameters: {
			title: 'Yearn V2 - SNX',
			href: 'https://yearn.fi/invest/0xF29AE508698bDeF169B89834F76704C3B205aedf',
			contractAddress: '0xF29AE508698bDeF169B89834F76704C3B205aedf',
			tokenIcon: '/tokens/yvsnx.png',
			tokenSymbol: 'yvSNX',
			tokenName: 'SNX yVault',
			tokenDecimal: 18,
			underlyingTokenAddress: '0xc011a73ee8576fb46f5e1c5751ca3b9fe0af2a6f',
			underlyingTokenSymbol: 'SNX',
			underlyingTokenDecimal: 18,
			underlyingTokenName: 'Synthetix Network Token',
			underlyingTokenCgID: 'havven',
			underlyingTokenIcon: '/tokens/snx.png',
			author: 'iearnfinance',
		},
		network: 'ethereum',
		list: 'yearn',
		prepare: (p, a, n, normalTx, erc20Tx) => PrepareStrategyYearnV2(p, a, n, normalTx, erc20Tx),
		Strategy: StrategyYearnV2
	},
	'Yearn V2 - UNI': {
		parameters: {
			title: 'Yearn V2 - UNI',
			href: 'https://yearn.fi/invest/0xFBEB78a723b8087fD2ea7Ef1afEc93d35E8Bed42',
			contractAddress: '0xFBEB78a723b8087fD2ea7Ef1afEc93d35E8Bed42',
			tokenIcon: '/tokens/yvuni.png',
			tokenSymbol: 'yvUNI',
			tokenName: 'UNI yVault',
			tokenDecimal: 18,
			underlyingTokenAddress: '0x1f9840a85d5af5bf1d1762f925bdaddc4201f984',
			underlyingTokenSymbol: 'UNI',
			underlyingTokenName: 'Uniswap',
			underlyingTokenDecimal: 18,
			underlyingTokenCgID: 'uniswap',
			underlyingTokenIcon: '/tokens/uni.svg',
			author: 'iearnfinance',
		},
		network: 'ethereum',
		list: 'yearn',
		prepare: (p, a, n, normalTx, erc20Tx) => PrepareStrategyYearnV2(p, a, n, normalTx, erc20Tx),
		Strategy: StrategyYearnV2
	},
	'Yearn V2 - 1Inch': {
		parameters: {
			title: 'Yearn V2 - 1Inch',
			href: 'https://yearn.fi/invest/0xB8C3B7A2A618C552C23B1E4701109a9E756Bab67',
			contractAddress: '0xB8C3B7A2A618C552C23B1E4701109a9E756Bab67',
			tokenIcon: '/tokens/yv1inch.png',
			tokenSymbol: 'yv1INCH',
			tokenName: '1INCH yVault',
			tokenDecimal: 18,
			underlyingTokenAddress: '0x111111111117dc0aa78b770fa6a738034120c302',
			underlyingTokenSymbol: '1INCH',
			underlyingTokenName: '1INCH Token',
			underlyingTokenDecimal: 18,
			underlyingTokenCgID: '1inch',
			underlyingTokenIcon: '/tokens/1inch.png',
			author: 'iearnfinance',
		},
		network: 'ethereum',
		list: 'yearn',
		prepare: (p, a, n, normalTx, erc20Tx) => PrepareStrategyYearnV2(p, a, n, normalTx, erc20Tx),
		Strategy: StrategyYearnV2
	}
}
const	STRATEGIES_YEARN_V2_CRV = {
	'Yearn V2 - crvSTETH': {
		parameters: {
			title: 'Yearn V2 - crvSTETH',
			href: 'https://yearn.fi/invest/0xdcd90c7f6324cfa40d7169ef80b12031770b4325',
			contractAddress: '0xdcd90c7f6324cfa40d7169ef80b12031770b4325',
			tokenIcon: '/tokens/yvCurve-stETH.png',
			tokenSymbol: 'yvCurve-stETH',
			underlyingTokenAddress: '0x06325440d014e39736583c165c2963ba99faf14e',
			underlyingTokenSymbol: 'steCRV',
			underlyingTokenName: 'Curve.fi ETH/stETH',
			underlyingTokenDecimal: 18,
			underlyingTokenCgID: 'steCRV',
			underlyingTokenIcon: '/tokens/curve.png',
			author: 'iearnfinance',
		},
		network: 'ethereum',
		list: 'yearn-crv',
		prepare: (p, a, n, normalTx, erc20Tx) => PrepareStrategyYearnCrvV2(p, a, n, normalTx, erc20Tx),
		Strategy: StrategyYearnCrvV2
	}
}

const	STRATEGIES_MISC = {
	'Yearn YVBoost': {
		parameters: {
			title: 'Yearn YVBoost',
			href: 'https://yearn.fi/invest/0x9d409a0A012CFbA9B15F6D4B36Ac57A46966Ab9a',
			contractAddress: '0x9d409a0A012CFbA9B15F6D4B36Ac57A46966Ab9a',
			tokenIcon: '/tokens/yvboost.png',
			tokenSymbol: 'yvboost',
			underlyingTokenAddress: '0xc5bddf9843308380375a611c18b50fb9341f502a',
			underlyingTokenSymbol: 'yveCRV-DAO',
			underlyingTokenName: 'veCRV-DAO yVault',
			underlyingTokenDecimal: 18,
			underlyingTokenCgID: 'yveCRV-DAO',
			underlyingTokenIcon: '/tokens/curve.png',
			author: 'iearnfinance',
		},
		network: 'ethereum',
		list: 'misc',
		prepare: (p, a, n, normalTx, erc20Tx) => PrepareStrategyYearnCrvV2(p, a, n, normalTx, erc20Tx),
		Strategy: StrategyYearnCrvV2
	},
	'Badger WBTC': {
		list: 'misc',
		prepare: (a) => PrepareStrategyBadgerWBTC(a),
		Strategy: StrategyBadgerWBTC
	},
	'yvBoost': {
		list: 'misc',
		prepare: (a) => PrepareStrategyYVBoost(a),
		Strategy: StrategyYVBoost
	},
}

export default {...STRATEGIES_YEARN_V1_CRV, ...STRATEGIES_YEARN_V1, ...STRATEGIES_YEARN_V2, ...STRATEGIES_YEARN_V2_CRV, ...STRATEGIES_APE_TAX_POLYGON, ...STRATEGIES_APE_TAX_FANTOM, ...STRATEGIES_APE_TAX, ...STRATEGIES_MISC};