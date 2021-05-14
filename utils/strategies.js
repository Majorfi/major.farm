/******************************************************************************
**	@Author:				Thomas Bouder <Tbouder>
**	@Email:					Tbouder@protonmail.com
**	@Date:					Friday May 14th 2021
**	@Filename:				strategies.js
******************************************************************************/

import	StrategyBadgerWBTC, {PrepareStrategyBadgerWBTC}	from	'components/StrategyBadgerWBTC';
import	StrategyYVBoost, {PrepareStrategyYVBoost}		from	'components/StrategyYVBoost';
import	StrategyApe, {PrepareStrategyApe}				from	'components/StrategyApe';
import	StrategyYearnV1, {PrepareStrategyYearnV1}		from	'components/StrategyYearnV1';
import	StrategyYearnCrvV1, {PrepareStrategyYearnCrvV1}	from	'components/StrategyYearnCrvV1';

const	STRATEGIES_APE_TAX = {
	'Reflex me 📷💚': {
		parameters: {
			title: 'Reflex me 📷💚',
			href: 'https://ape.tax/rai',
			contractAddress: '0x4856a7efbbfcae92ab13c5e2e322fc77647bb856',
			underlyingTokenAddress: '0x03ab458634910aad20ef5f1c8ee96f1d6ac54919',
			underlyingTokenSymbol: 'RAI',
			underlyingTokenDecimal: 18,
			underlyingTokenCgID: 'rai',
			underlyingTokenIcon: '/rai.png',
		},
		list: 'ape.tax',
		prepare: (p, a) => PrepareStrategyApe(p, a),
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
			underlyingTokenIcon: '/dai.svg',
		},
		list: 'ape.tax',
		prepare: (p, a) => PrepareStrategyApe(p, a),
		Strategy: StrategyApe
	},
	'Spartan Bank ⚔️🏦': {
		parameters: {
			title: 'Spartan Bank ⚔️🏦',
			href: 'https://ape.tax/spartanbank',
			contractAddress: '0xF29AE508698bDeF169B89834F76704C3B205aedf',
			underlyingTokenAddress: '0xc011a73ee8576fb46f5e1c5751ca3b9fe0af2a6f',
			underlyingTokenSymbol: 'SNX',
			underlyingTokenDecimal: 18,
			underlyingTokenCgID: 'havven',
			underlyingTokenIcon: '/snx.png',
		},
		list: 'ape.tax',
		prepare: (p, a) => PrepareStrategyApe(p, a),
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
			underlyingTokenIcon: '/ice.png',
		},
		list: 'ape.tax',
		prepare: (p, a) => PrepareStrategyApe(p, a),
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
			underlyingTokenIcon: '/sushi.png',
		},
		list: 'ape.tax',
		prepare: (p, a) => PrepareStrategyApe(p, a),
		Strategy: StrategyApe
	},
	'Ghosty Dollar 𓀀💵': {
		parameters: {
			title: 'Ghosty Dollar 𓀀💵',
			href: 'https://ape.tax/ghostysusd',
			contractAddress: '0xa5cA62D95D24A4a350983D5B8ac4EB8638887396',
			underlyingTokenAddress: '0x57ab1ec28d129707052df4df418d58a2d46d5f51',
			underlyingTokenSymbol: 'sUSD',
			underlyingTokenDecimal: 18,
			underlyingTokenCgID: 'nusd',
			underlyingTokenIcon: '/susd.png',
		},
		list: 'ape.tax',
		prepare: (p, a) => PrepareStrategyApe(p, a),
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
			underlyingTokenIcon: '/uni.svg',
		},
		list: 'ape.tax',
		prepare: (p, a) => PrepareStrategyApe(p, a),
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
			underlyingTokenIcon: '/tusd.svg',
		},
		list: 'ape.tax',
		prepare: (p, a) => PrepareStrategyApe(p, a),
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
			underlyingTokenIcon: '/usdt.svg',
		},
		list: 'ape.tax',
		prepare: (p, a) => PrepareStrategyApe(p, a),
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
			underlyingTokenIcon: '/aave.png',
		},
		prepare: (p, a) => PrepareStrategyApe(p, a),
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
			underlyingTokenIcon: '/alcx.png',
		},
		prepare: (p, a) => PrepareStrategyApe(p, a),
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
			underlyingTokenIcon: '/susd.png',
		},
		prepare: (p, a) => PrepareStrategyApe(p, a),
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
			underlyingTokenIcon: '/weth.png',
		},
		prepare: (p, a) => PrepareStrategyApe(p, a),
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
			underlyingTokenIcon: '/weth.png',
		},
		prepare: (p, a) => PrepareStrategyApe(p, a),
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
			underlyingTokenIcon: '/stecrv.png',
		},
		prepare: (p, a) => PrepareStrategyApe(p, a),
		list: 'ape.tax',
		Strategy: StrategyApe
	}
}

const	STRATEGIES_YEARN_V1 = {
	'Yearn V1 - DAI': {
		parameters: {
			title: 'Yearn V1 - DAI',
			href: 'https://yearn.finance/vaults/0xACd43E627e64355f1861cEC6d3a6688B31a6F952',
			contractAddress: '0xACd43E627e64355f1861cEC6d3a6688B31a6F952',
			tokenIcon: '/ydai.png',
			underlyingTokenAddress: '0x6b175474e89094c44da98b954eedeac495271d0f',
			underlyingTokenSymbol: 'DAI',
			underlyingTokenCgID: 'dai',
			underlyingTokenIcon: '/dai.svg',
		},
		list: 'yearn-v1',
		prepare: (p, a) => PrepareStrategyYearnV1(p, a),
		Strategy: StrategyYearnV1
	},
	'Yearn V1 - TUSD': {
		parameters: {
			title: 'Yearn V1 - TUSD',
			href: 'https://yearn.finance/vaults/0x37d19d1c4E1fa9DC47bD1eA12f742a0887eDa74a',
			contractAddress: '0x37d19d1c4E1fa9DC47bD1eA12f742a0887eDa74a',
			tokenIcon: '/ytusd.png',
			underlyingTokenAddress: '0x0000000000085d4780b73119b644ae5ecd22b376',
			underlyingTokenSymbol: 'TUSD',
			underlyingTokenCgID: 'true-usd',
			underlyingTokenIcon: '/tusd.svg',
		},
		list: 'yearn-v1',
		prepare: (p, a) => PrepareStrategyYearnV1(p, a),
		Strategy: StrategyYearnV1
	},
	'Yearn V1 - USDC': {
		parameters: {
			title: 'Yearn V1 - USDC',
			href: 'https://yearn.finance/vaults/0x597aD1e0c13Bfe8025993D9e79C69E1c0233522e',
			contractAddress: '0x597aD1e0c13Bfe8025993D9e79C69E1c0233522e',
			tokenIcon: '/yusdc.png',
			underlyingTokenAddress: '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48',
			underlyingTokenSymbol: 'USDC',
			underlyingTokenDecimal: 6,
			underlyingTokenCgID: 'usdc',
			underlyingTokenIcon: '/usdc.svg',
		},
		list: 'yearn-v1',
		prepare: (p, a) => PrepareStrategyYearnV1(p, a),
		Strategy: StrategyYearnV1
	},
	'Yearn V1 - USDT': {
		parameters: {
			title: 'Yearn V1 - USDT',
			href: 'https://yearn.finance/vaults/0x2f08119C6f07c006695E079AAFc638b8789FAf18',
			contractAddress: '0x2f08119C6f07c006695E079AAFc638b8789FAf18',
			tokenIcon: '/yusdt.png',
			underlyingTokenAddress: '0xdac17f958d2ee523a2206206994597c13d831ec7',
			underlyingTokenSymbol: 'USDT',
			underlyingTokenDecimal: 6,
			underlyingTokenCgID: 'tether',
			underlyingTokenIcon: '/usdt.svg',
		},
		list: 'yearn-v1',
		prepare: (p, a) => PrepareStrategyYearnV1(p, a),
		Strategy: StrategyYearnV1
	},
	'Yearn V1 - mUSD': {
		parameters: {
			title: 'Yearn V1 - mUSD',
			href: 'https://yearn.finance/vaults/0xE0db48B4F71752C4bEf16De1DBD042B82976b8C7',
			contractAddress: '0xE0db48B4F71752C4bEf16De1DBD042B82976b8C7',
			tokenIcon: '/ymusd.png',
			underlyingTokenAddress: '0xe2f2a5c287993345a840db3b0845fbc70f5935a5',
			underlyingTokenSymbol: 'mUSD',
			underlyingTokenDecimal: 18,
			underlyingTokenCgID: 'mstable-usd',
			underlyingTokenIcon: '/musd.png',
		},
		list: 'yearn-v1',
		prepare: (p, a) => PrepareStrategyYearnV1(p, a),
		Strategy: StrategyYearnV1
	},
}

const	STRATEGIES_YEARN_V1_CRV = {
	'Yearn V1 - crvEURS': {
		parameters: {
			title: 'Yearn V1 - crvEURS',
			href: 'https://yearn.fi/invest/0x98B058b2CBacF5E99bC7012DF757ea7CFEbd35BC',
			contractAddress: '0x98B058b2CBacF5E99bC7012DF757ea7CFEbd35BC',
			tokenIcon: '/yveursCRV.png',
			tokenSymbol: 'yveursCRV',
			underlyingTokenAddress: '0x194ebd173f6cdace046c53eacce9b953f28411d1',
			underlyingTokenSymbol: 'eursCRV',
			underlyingTokenName: 'Curve.fi EURS/sEUR',
			underlyingTokenDecimal: 18,
			underlyingTokenCgID: 'eursCRV',
			underlyingTokenIcon: '/curve.png',
		},
		list: 'yearn-v1',
		prepare: (p, a) => PrepareStrategyYearnCrvV1(p, a),
		Strategy: StrategyYearnCrvV1
	},
}

const	STRATEGIES_MISC = {
	'Badger WBTC': {
		list: 'yearn',
		prepare: (a) => PrepareStrategyBadgerWBTC(a),
		Strategy: StrategyBadgerWBTC
	},
	'yvBoost': {
		list: 'yearn',
		prepare: (a) => PrepareStrategyYVBoost(a),
		Strategy: StrategyYVBoost
	},
	// 'Yearn V1 - crvLINK': {
	// 	parameters: {
	// 		title: 'Yearn V1 - crvLINK',
	// 		href: 'https://ape.tax/rai',
	// 		contractAddress: `0x4856a7efbbfcae92ab13c5e2e322fc77647bb856`,
	// 		underlyingTokenAddress: `0x03ab458634910aad20ef5f1c8ee96f1d6ac54919`,
	// 		underlyingTokenSymbol: `RAI`,
	// 		underlyingTokenDecimal: 18,
	// 		underlyingTokenCgID: `rai`,
	// 		underlyingTokenIcon: `/rai.png`,
	// 	},
	// 	list: 'yearn',
	// 	prepare: (p, a) => PrepareStrategyApe(p, a),
	// 	Strategy: StrategyApe
	// },
	// 'Yearn V1 - crvMUSD': {
	// 	parameters: {
	// 		title: 'Yearn V1 - crvMUSD',
	// 		href: 'https://ape.tax/rai',
	// 		contractAddress: `0x4856a7efbbfcae92ab13c5e2e322fc77647bb856`,
	// 		underlyingTokenAddress: `0x03ab458634910aad20ef5f1c8ee96f1d6ac54919`,
	// 		underlyingTokenSymbol: `RAI`,
	// 		underlyingTokenDecimal: 18,
	// 		underlyingTokenCgID: `rai`,
	// 		underlyingTokenIcon: `/rai.png`,
	// 	},
	// 	list: 'yearn',
	// 	prepare: (p, a) => PrepareStrategyApe(p, a),
	// 	Strategy: StrategyApe
	// },
	// 'Yearn V1 - crvUSDN': {
	// 	parameters: {
	// 		title: 'Yearn V1 - crvUSDN',
	// 		href: 'https://ape.tax/rai',
	// 		contractAddress: `0x4856a7efbbfcae92ab13c5e2e322fc77647bb856`,
	// 		underlyingTokenAddress: `0x03ab458634910aad20ef5f1c8ee96f1d6ac54919`,
	// 		underlyingTokenSymbol: `RAI`,
	// 		underlyingTokenDecimal: 18,
	// 		underlyingTokenCgID: `rai`,
	// 		underlyingTokenIcon: `/rai.png`,
	// 	},
	// 	list: 'yearn',
	// 	prepare: (p, a) => PrepareStrategyApe(p, a),
	// 	Strategy: StrategyApe
	// },
	// 'Yearn V1 - crvUST': {
	// 	parameters: {
	// 		title: 'Yearn V1 - crvUST',
	// 		href: 'https://ape.tax/rai',
	// 		contractAddress: `0x4856a7efbbfcae92ab13c5e2e322fc77647bb856`,
	// 		underlyingTokenAddress: `0x03ab458634910aad20ef5f1c8ee96f1d6ac54919`,
	// 		underlyingTokenSymbol: `RAI`,
	// 		underlyingTokenDecimal: 18,
	// 		underlyingTokenCgID: `rai`,
	// 		underlyingTokenIcon: `/rai.png`,
	// 	},
	// 	list: 'yearn',
	// 	prepare: (p, a) => PrepareStrategyApe(p, a),
	// 	Strategy: StrategyApe
	// },
	// 'Yearn V1 - crvSUSD': {
	// 	parameters: {
	// 		title: 'Yearn V1 - crvSUSD',
	// 		href: 'https://ape.tax/rai',
	// 		contractAddress: `0x4856a7efbbfcae92ab13c5e2e322fc77647bb856`,
	// 		underlyingTokenAddress: `0x03ab458634910aad20ef5f1c8ee96f1d6ac54919`,
	// 		underlyingTokenSymbol: `RAI`,
	// 		underlyingTokenDecimal: 18,
	// 		underlyingTokenCgID: `rai`,
	// 		underlyingTokenIcon: `/rai.png`,
	// 	},
	// 	list: 'yearn',
	// 	prepare: (p, a) => PrepareStrategyApe(p, a),
	// 	Strategy: StrategyApe
	// },
	// 'Yearn V1 - crvHUSD': {
	// 	parameters: {
	// 		title: 'Yearn V1 - crvHUSD',
	// 		href: 'https://ape.tax/rai',
	// 		contractAddress: `0x4856a7efbbfcae92ab13c5e2e322fc77647bb856`,
	// 		underlyingTokenAddress: `0x03ab458634910aad20ef5f1c8ee96f1d6ac54919`,
	// 		underlyingTokenSymbol: `RAI`,
	// 		underlyingTokenDecimal: 18,
	// 		underlyingTokenCgID: `rai`,
	// 		underlyingTokenIcon: `/rai.png`,
	// 	},
	// 	list: 'yearn',
	// 	prepare: (p, a) => PrepareStrategyApe(p, a),
	// 	Strategy: StrategyApe
	// },
	// 'Yearn V1 - crvDUSD': {
	// 	parameters: {
	// 		title: 'Yearn V1 - crvDUSD',
	// 		href: 'https://ape.tax/rai',
	// 		contractAddress: `0x4856a7efbbfcae92ab13c5e2e322fc77647bb856`,
	// 		underlyingTokenAddress: `0x03ab458634910aad20ef5f1c8ee96f1d6ac54919`,
	// 		underlyingTokenSymbol: `RAI`,
	// 		underlyingTokenDecimal: 18,
	// 		underlyingTokenCgID: `rai`,
	// 		underlyingTokenIcon: `/rai.png`,
	// 	},
	// 	list: 'yearn',
	// 	prepare: (p, a) => PrepareStrategyApe(p, a),
	// 	Strategy: StrategyApe
	// },
	// 'Yearn V1 - crvAAVE': {
	// 	parameters: {
	// 		title: 'Yearn V1 - crvAAVE',
	// 		href: 'https://ape.tax/rai',
	// 		contractAddress: `0x4856a7efbbfcae92ab13c5e2e322fc77647bb856`,
	// 		underlyingTokenAddress: `0x03ab458634910aad20ef5f1c8ee96f1d6ac54919`,
	// 		underlyingTokenSymbol: `RAI`,
	// 		underlyingTokenDecimal: 18,
	// 		underlyingTokenCgID: `rai`,
	// 		underlyingTokenIcon: `/rai.png`,
	// 	},
	// 	list: 'yearn',
	// 	prepare: (p, a) => PrepareStrategyApe(p, a),
	// 	Strategy: StrategyApe
	// },
	// 'Yearn V1 - crvUSDP': {
	// 	parameters: {
	// 		title: 'yearn V1 - crvUSDP',
	// 		href: 'https://ape.tax/rai',
	// 		contractAddress: `0x4856a7efbbfcae92ab13c5e2e322fc77647bb856`,
	// 		underlyingTokenAddress: `0x03ab458634910aad20ef5f1c8ee96f1d6ac54919`,
	// 		underlyingTokenSymbol: `RAI`,
	// 		underlyingTokenDecimal: 18,
	// 		underlyingTokenCgID: `rai`,
	// 		underlyingTokenIcon: `/rai.png`,
	// 	},
	// 	list: 'yearn',
	// 	prepare: (p, a) => PrepareStrategyApe(p, a),
	// 	Strategy: StrategyApe
	// },
	// 'yearn V1 - crvAETH': {
	// 	parameters: {
	// 		title: 'yearn V1 - crvAETH',
	// 		href: 'https://ape.tax/rai',
	// 		contractAddress: `0x4856a7efbbfcae92ab13c5e2e322fc77647bb856`,
	// 		underlyingTokenAddress: `0x03ab458634910aad20ef5f1c8ee96f1d6ac54919`,
	// 		underlyingTokenSymbol: `RAI`,
	// 		underlyingTokenDecimal: 18,
	// 		underlyingTokenCgID: `rai`,
	// 		underlyingTokenIcon: `/rai.png`,
	// 	},
	// 	list: 'yearn',
	// 	prepare: (p, a) => PrepareStrategyApe(p, a),
	// 	Strategy: StrategyApe
	// },	
}

export default [...STRATEGIES_YEARN_V1_CRV, ...STRATEGIES_YEARN_V1, ...STRATEGIES_APE_TAX, ...STRATEGIES_MISC];