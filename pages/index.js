/******************************************************************************
**	@Author:				Thomas Bouder <Tbouder>
**	@Email:					Tbouder@protonmail.com
**	@Date:					Monday January 4th 2021
**	@Filename:				index.js
******************************************************************************/

import	{useEffect, Fragment, useRef, useState}			from	'react';
import	{Dialog, Transition}							from	'@headlessui/react';
import	{useToasts}										from	'react-toast-notifications';
import	{v4 as uuidv4}									from	'uuid';
import	useCurrencies									from	'contexts/useCurrencies';
import	useStrategies									from	'contexts/useStrategies';
import	StrategyBadgerWBTC, {PrepareStrategyBadgerWBTC}	from	'components/StrategyBadgerWBTC';
import	StrategyYVBoost, {PrepareStrategyYVBoost}		from	'components/StrategyYVBoost';
import	StrategyApe, {PrepareStrategyApe}				from	'components/StrategyApe';
import	StrategyPool, {PrepareStrategyPool}				from	'components/StrategyPool';
import	{toAddress}										from	'utils';
import	{ethers}					from	'ethers';

const	STRATEGIES = {
	'PoolTogether DAI': {
		parameters: {
			title: 'PoolTogether DAI',
			href: 'https://app.pooltogether.com/pools/mainnet/PT-cDAI',
			v2Address: `0x29fe7d60ddf151e5b52e5fab4f1325da6b2bd958`,
			v2Underlying: `0x49d716dfe60b37379010a75329ae09428f17118d`,
			migratorAddress: `0x801b4872a635dccc7e679eeaf04bef08e562972a`,
			contractAddress: `0x334cBb5858417Aee161B53Ee0D5349cCF54514CF`,
			poolPrizeAddress: `0xEBfb47A7ad0FD6e57323C8A42B2E5A6a4F68fc1a`,
			yieldContractAddress: `0xF362ce295F2A4eaE4348fFC8cDBCe8d729ccb8Eb`,
			yieldTokenSymbol: `POOL`,
			yieldTokenCgID: `pooltogether`,
			underlyingTokenAddress: `0x06325440d014e39736583c165c2963ba99faf14e`,
			underlyingTokenSymbol: `DAI`,
			underlyingTokenCgID: `dai`,
			underlyingTokenIcon: `/dai.svg`
		},
		prepare: (p, a) => PrepareStrategyPool(p, a),
		list: 'ape.tax',
		Strategy: StrategyPool
	},
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
	'Reflex me 📷💚': {
		parameters: {
			title: 'Reflex me 📷💚',
			href: 'https://ape.tax/rai',
			contractAddress: `0x4856a7efbbfcae92ab13c5e2e322fc77647bb856`,
			underlyingTokenAddress: `0x03ab458634910aad20ef5f1c8ee96f1d6ac54919`,
			underlyingTokenSymbol: `RAI`,
			underlyingTokenDecimal: 18,
			underlyingTokenCgID: `rai`,
			underlyingTokenIcon: `/rai.png`,
		},
		list: 'ape.tax',
		prepare: (p, a) => PrepareStrategyApe(p, a),
		Strategy: StrategyApe
	},
	'Old Grandmaster\'s DAI ♟👴': {
		parameters: {
			title: 'Old Grandmaster\'s DAI ♟👴',
			href: 'https://ape.tax/grandmastersdai',
			contractAddress: `0xB98Df7163E61bf053564bde010985f67279BBCEC`,
			underlyingTokenAddress: `0x6b175474e89094c44da98b954eedeac495271d0f`,
			underlyingTokenSymbol: `DAI`,
			underlyingTokenDecimal: 18,
			underlyingTokenCgID: `dai`,
			underlyingTokenIcon: `/dai.svg`,
		},
		list: 'ape.tax',
		prepare: (p, a) => PrepareStrategyApe(p, a),
		Strategy: StrategyApe
	},
	'Spartan Bank ⚔️🏦': {
		parameters: {
			title: 'Spartan Bank ⚔️🏦',
			href: 'https://ape.tax/spartanbank',
			contractAddress: `0xF29AE508698bDeF169B89834F76704C3B205aedf`,
			underlyingTokenAddress: `0xc011a73ee8576fb46f5e1c5751ca3b9fe0af2a6f`,
			underlyingTokenSymbol: `SNX`,
			underlyingTokenDecimal: 18,
			underlyingTokenCgID: `havven`,
			underlyingTokenIcon: `/snx.png`,
		},
		list: 'ape.tax',
		prepare: (p, a) => PrepareStrategyApe(p, a),
		Strategy: StrategyApe
	},
	'ETH\'s Ape Ape Baby 🧊👶': {
		parameters: {
			title: 'ETH\'s Ape Ape Baby 🧊👶',
			href: 'https://ape.tax/ethbaby',
			contractAddress: `0xD2C65E20C3fDE3F18097e7414e65596e0C83B1a9`,
			underlyingTokenAddress: `0xf16e81dce15b08f326220742020379b855b87df9`,
			underlyingTokenSymbol: `ICE`,
			underlyingTokenDecimal: 18,
			underlyingTokenCgID: `ice-token`,
			underlyingTokenIcon: `/ice.png`,
		},
		list: 'ape.tax',
		prepare: (p, a) => PrepareStrategyApe(p, a),
		Strategy: StrategyApe
	},
	'Bank Sushi 🏦🍣': {
		parameters: {
			title: 'Bank Sushi 🏦🍣',
			href: 'https://ape.tax/sushibank',
			contractAddress: `0xb32747b4045479b77a8b8eb44029ba12580214f8`,
			underlyingTokenAddress: `0x6b3595068778dd592e39a122f4f5a5cf09c90fe2`,
			underlyingTokenSymbol: `SUSHI`,
			underlyingTokenDecimal: 18,
			underlyingTokenCgID: `sushi`,
			underlyingTokenIcon: `/sushi.png`,
		},
		list: 'ape.tax',
		prepare: (p, a) => PrepareStrategyApe(p, a),
		Strategy: StrategyApe
	},
	'Ghosty Dollar 𓀀💵': {
		parameters: {
			title: 'Ghosty Dollar 𓀀💵',
			href: 'https://ape.tax/ghostysusd',
			contractAddress: `0xa5cA62D95D24A4a350983D5B8ac4EB8638887396`,
			underlyingTokenAddress: `0x57ab1ec28d129707052df4df418d58a2d46d5f51`,
			underlyingTokenSymbol: `sUSD`,
			underlyingTokenDecimal: 18,
			underlyingTokenCgID: `nusd`,
			underlyingTokenIcon: `/susd.png`,
		},
		list: 'ape.tax',
		prepare: (p, a) => PrepareStrategyApe(p, a),
		Strategy: StrategyApe
	},
	'Pool with Us 🏊‍♂️👩‍👩‍👧‍👧': {
		parameters: {
			title: 'Pool with Us 🏊‍♂️👩‍👩‍👧‍👧',
			href: 'https://ape.tax/poolwithus',
			contractAddress: `0x2F194Da57aa855CAa02Ea3Ab991fa5d38178B9e6`,
			underlyingTokenAddress: `0x1f9840a85d5af5bf1d1762f925bdaddc4201f984`,
			underlyingTokenSymbol: `UNI`,
			underlyingTokenDecimal: 18,
			underlyingTokenCgID: `uniswap`,
			underlyingTokenIcon: `/uni.svg`,
		},
		list: 'ape.tax',
		prepare: (p, a) => PrepareStrategyApe(p, a),
		Strategy: StrategyApe
	},
	'True Idle T🛌': {
		parameters: {
			title: 'True Idle T🛌',
			href: 'https://ape.tax/trueidle',
			contractAddress: `0x49b3E44e54b6220aF892DbA48ae45F1Ea6bC4aE9`,
			underlyingTokenAddress: `0x0000000000085d4780b73119b644ae5ecd22b376`,
			underlyingTokenSymbol: `TUSD`,
			underlyingTokenDecimal: 18,
			underlyingTokenCgID: `true-usd`,
			underlyingTokenIcon: `/tusd.svg`,
		},
		list: 'ape.tax',
		prepare: (p, a) => PrepareStrategyApe(p, a),
		Strategy: StrategyApe
	},
	'Idle Tether 🛌T': {
		parameters: {
			title: 'Idle Tether 🛌T',
			href: 'https://ape.tax/idletether',
			contractAddress: `0xAf322a2eDf31490250fdEb0D712621484b09aBB6`,
			underlyingTokenAddress: `0xdac17f958d2ee523a2206206994597c13d831ec7`,
			underlyingTokenSymbol: `USDT`,
			underlyingTokenDecimal: 6,
			underlyingTokenCgID: `tether`,
			underlyingTokenIcon: `/usdt.svg`,
		},
		list: 'ape.tax',
		prepare: (p, a) => PrepareStrategyApe(p, a),
		Strategy: StrategyApe
	},
	'Data AAVE 💿🕊': {
		parameters: {
			title: 'Data AAVE 💿🕊',
			href: 'https://ape.tax/dataaave',
			contractAddress: `0xAc1C90b9c76d56BA2e24F3995F7671c745f8f308`,
			underlyingTokenAddress: `0x7fc66500c84a76ad7e9c93437bfc5ac33e2ddae9`,
			underlyingTokenSymbol: `AAVE`,
			underlyingTokenCgID: `aave`,
			underlyingTokenIcon: `/aave.png`,
		},
		prepare: (p, a) => PrepareStrategyApe(p, a),
		list: 'ape.tax',
		Strategy: StrategyApe
	},
	'Full Metal Farmer 🧙‍♂️🧪': {
		parameters: {
			title: 'Full Metal Farmer 🧙‍♂️🧪',
			href: 'https://ape.tax/fullmetalfarmer',
			contractAddress: `0x56A5Fd5104a4956898753dfb060ff32882Ae0eb4`,
			underlyingTokenAddress: `0xdbdb4d16eda451d0503b854cf79d55697f90c8df`,
			underlyingTokenSymbol: `ALCX`,
			underlyingTokenCgID: `alchemix`,
			underlyingTokenIcon: `/alcx.png`,
		},
		prepare: (p, a) => PrepareStrategyApe(p, a),
		list: 'ape.tax',
		Strategy: StrategyApe
	},
	'sUSD Idle 🏆⚔️': {
		parameters: {
			title: 'sUSD Idle 🏆⚔️',
			href: 'https://ape.tax/susdidle',
			contractAddress: `0x3466c90017F82DDA939B01E8DBd9b0f97AEF8DfC`,
			underlyingTokenAddress: `0x57ab1ec28d129707052df4df418d58a2d46d5f51`,
			underlyingTokenSymbol: `sUSD`,
			underlyingTokenCgID: `nusd`,
			underlyingTokenIcon: `/susd.png`,
		},
		prepare: (p, a) => PrepareStrategyApe(p, a),
		list: 'ape.tax',
		Strategy: StrategyApe
	},
	'WETH Gen Lender 🧬💰': {
		parameters: {
			title: 'WETH Gen Lender 🧬💰',
			href: 'https://ape.tax/wethgenlender',
			contractAddress: `0xac333895ce1a73875cf7b4ecdc5a743c12f3d82b`,
			underlyingTokenAddress: `0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2`,
			underlyingTokenSymbol: `WETH`,
			underlyingTokenCgID: `eth`,
			underlyingTokenIcon: `/weth.png`,
		},
		prepare: (p, a) => PrepareStrategyApe(p, a),
		list: 'ape.tax',
		Strategy: StrategyApe
	},
	'WETH Iron Lender 🦾💰': {
		parameters: {
			title: 'WETH Iron Lender 🦾💰',
			href: 'https://ape.tax/ironlender',
			contractAddress: `0xED0244B688cF059f32f45E38A6ac6E479D6755f6`,
			underlyingTokenAddress: `0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2`,
			underlyingTokenSymbol: `WETH`,
			underlyingTokenCgID: `eth`,
			underlyingTokenIcon: `/weth.png`,
		},
		prepare: (p, a) => PrepareStrategyApe(p, a),
		list: 'ape.tax',
		Strategy: StrategyApe
	},
	'st. Ether-ETH Pool 💧🎱': {
		parameters: {
			title: 'st. Ether-ETH Pool 💧🎱',
			href: 'https://ape.tax/stecrv',
			contractAddress: `0xdCD90C7f6324cfa40d7169ef80b12031770B4325`,
			underlyingTokenAddress: `0x06325440d014e39736583c165c2963ba99faf14e`,
			underlyingTokenSymbol: `steCRV`,
			underlyingTokenCgID: `eth`,
			underlyingTokenIcon: `/stecrv.png`,
		},
		prepare: (p, a) => PrepareStrategyApe(p, a),
		list: 'ape.tax',
		Strategy: StrategyApe
	},
}

function	StrategySelectorModal({strategyModal, set_strategyModal}) {
	const	{set_strategies} = useStrategies();
	const	[address, set_address] = useState('');
	const	[list, set_list] = useState('ape.tax');
	const	[strategy, set_strategy] = useState('');
	const	initialFocus = useRef()
	const	{addToast} = useToasts();

	useEffect(() => {
		set_strategy(Object.entries(STRATEGIES).filter(([key, value]) => value.list === list)[0][0])
	}, [list])

	async function	prepareStrategy() {
		const	_address = toAddress(address)
		if (!_address) {
			return {status: 'KO', result: `invalidAddress`}
		}

		let		result = undefined;
		if (strategy === 'Badger WBTC') {
			result = await PrepareStrategyBadgerWBTC(_address);
		} else if (strategy === 'yvBoost') {
			result = await PrepareStrategyYVBoost(_address);
		} else {
			const	currentStrategy = STRATEGIES[strategy];
			if (currentStrategy !== undefined) {
				result = await currentStrategy.prepare(currentStrategy.parameters, _address)
			}
		}
	
		if (!result) {
			return {status: 'KO', result: `error`}
		}
		return {status: 'OK', result: {
			...result,
			date: new Date(result.timestamp * 1000)
		}}
	}

	return (
		<Transition.Root show={strategyModal} as={Fragment}>
			<Dialog
				as={'div'}
				static
				className={'fixed z-10 inset-0 overflow-y-auto'}
				style={{zIndex: 100}}
				initialFocus={initialFocus}
				open={strategyModal}
				onClose={set_strategyModal}>
				<div className='flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0'>
					<Transition.Child
						as={Fragment}
						enter={'ease-out duration-300'} enterFrom={'opacity-0'} enterTo={'opacity-100'}
						leave={'ease-in duration-200'} leaveFrom={'opacity-100'} leaveTo={'opacity-0'}>
						<Dialog.Overlay className={'fixed inset-0 bg-dark-900 bg-opacity-75 transition-opacity'} />
					</Transition.Child>

					<span className={'hidden sm:inline-block sm:align-middle sm:h-screen'} aria-hidden={'true'}>
						&#8203;
					</span>
					<Transition.Child
						as={Fragment}
						enter={'ease-out duration-300'}
						enterFrom={'opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95'}
						enterTo={'opacity-100 translate-y-0 sm:scale-100'}
						leave={'ease-in duration-200'}
						leaveFrom={'opacity-100 translate-y-0 sm:scale-100'}
						leaveTo={'opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95'}>
						<div className={'inline-block align-bottom bg-dark-600 rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full md:mb-96'}>
							<div className={'bg-dark-600 rounded-lg p-6 space-y-4'}>

								<div>
									<label htmlFor={'list'} className={'ml-0.5 mb-2 block text-sm font-medium text-white text-opacity-75'}>
										{'List'}
									</label>
									<span className="relative z-0 inline-flex shadow-sm rounded-md">
										<button
											onClick={() => set_list('ape.tax')}
											type={'button'}
											className={`${list === 'ape.tax' ? 'bg-dark-900 text-white text-opacity-100' : 'bg-dark-400 text-white text-opacity-75'} relative inline-flex items-center px-4 py-2 rounded-l-md border border-dark-300 text-sm font-medium hover:bg-dark-900 focus:outline-none transition-colors`}>
											{'🦍 Ape.tax'}
										</button>
										<button
											onClick={() => set_list('yearn')}
											type={'button'}
											className={`${list === 'yearn' ? 'bg-dark-900 text-white text-opacity-100' : 'bg-dark-400 text-white text-opacity-75'} -ml-px relative inline-flex items-center px-4 py-2 rounded-r-md border border-dark-300 text-sm font-medium hover:bg-dark-900 focus:outline-none transition-colors`}>
											{'🌾 Yearn'}
										</button>
									</span>
								</div>

								<div>
									<label htmlFor={'strategy'} className={'block text-sm font-medium text-white text-opacity-75'}>
										{'Strategy'}
									</label>
									<select
										ref={initialFocus}
										id={'strategy'}
										name={'strategy'}
										value={strategy}
										onChange={e => set_strategy(e.target.value)}
										className={'mt-2 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-accent-500 focus:border-accent-500 sm:text-sm rounded-md'}>
										{Object.entries(STRATEGIES).filter(([key, value]) => value.list === list).map(e => (
											<option key={e[0]}>{e[0]}</option>	
										))}
									</select>
								</div>

								<div className={'mt-2'}>
									<label htmlFor={'ethAddress'} className={'block text-sm font-medium text-white text-opacity-75'}>
										{'Eth Address'}
									</label>
									<div className={'mt-2'}>
										<input
											value={address}
											onChange={e => set_address(e.target.value)}
											type={'text'}
											name={'ethAddress'}
											id={'ethAddress'}
											className={'shadow-sm focus:ring-accent-500 focus:border-accent-500 block w-full sm:text-sm border-gray-300 rounded-md'}
											placeholder={'Address or ENS'}/>
									</div>
								</div>

								<div className={'mt-2 flex justify-end'}>
									<button
										onClick={async () => {
											addToast('Preparing strategy', {appearance: 'info'});
											const res = await prepareStrategy()
											if (res.status === `KO`) {
												return addToast(`Error : ${res.result}`, {appearance: 'error'});
											}
											const	populator = res.result;
											set_strategies(s => [...s, {
												strategy,
												params: {
													uuid: uuidv4(),
													...populator,
													address,
												}
											}])
											addToast('Strategy available', {appearance: 'success'});
											set_strategyModal(false);
										}}
										type={'button'}
										className={'inline-flex items-center px-3 py-2 text-sm leading-4 font-medium rounded shadow-sm text-white bg-accent-900 hover:bg-accent-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-accent-500'}>
										{'Add strategy'}
									</button>
								</div>
							</div>
						</div>
					</Transition.Child>
				</div>
			</Dialog>
		</Transition.Root>
	)
}

function	Index() {
	const	{switchCurrency, baseCurrency} = useCurrencies();
	const	{strategies} = useStrategies();
	const	[currentTab, set_currentTab] = useState(0);
	const	[strategyModal, set_strategyModal] = useState(false);


	async function	computeCrops() {
		const	provider = new ethers.providers.AlchemyProvider('homestead', process.env.ALCHEMY_KEY)
		const	ABI = ['function claim(address user) external returns (uint256)']
		const	smartContract = new ethers.Contract('0xf362ce295f2a4eae4348ffc8cdbce8d729ccb8eb', ABI, provider)
		const	claim = await smartContract.callStatic.claim('0x9e63b020ae098e73cf201ee1357edc72dfeaa518');
		console.log(claim)
		console.log (Number(ethers.utils.formatUnits(claim, 18)));
	}
	useEffect(() => {
		computeCrops()
	}, [])

	function	renderStrategy(strategy, s) {
		const	CurrentStrategy = STRATEGIES[strategy];
		if (!CurrentStrategy) {
			return null;
		}
		return (
			<CurrentStrategy.Strategy
				parameters={CurrentStrategy?.parameters}
				{...s.params} /> 
		)
	}

	function	renderStrategies() {
		if (currentTab === 0) {
			return (
				<div className={'grid grid-cols-1 lg:grid-cols-2 2xl:grid-cols-3 w-full gap-6'}>
					{strategies.map((s, i) => (
						<div
							key={`${s.strategy}-${s.params?.address}-${s.params?.uuid}-${i}`}
							style={{display: 'inherit'}}>
							{renderStrategy(s.strategy, s)}
						</div>
					))}
				</div>
			);
		}
		return (
			<div className={'grid grid-cols-1 lg:grid-cols-2 2xl:grid-cols-3 w-full gap-6'}>
			</div>
		);
	}

	return (
		<div>
			<div className={'w-full border-b border-dark-600 mb-6'}>
				<span className={'text-3xl md:text-3xl font-medium text-white text-opacity-80 flex flex-row justify-center items-center'}>
					<h1>{'🌾'}</h1>
					<h1 className={'mx-2 md:mx-4 text-center'}>{` A degen loss calculator `}</h1>
					<h1 style={{transform: 'rotateY(-180deg)'}}>{'🌾'}</h1>
				</span>
				<div className={'mt-6 flex flex-row space-x-4 items-center'}>
					<div className={`border-b pb-4 ${currentTab === 0 ? 'border-accent-900' : 'border-dark-600'} transition-colors`} onClick={() => set_currentTab(0)}>
						<h2 className={`${currentTab === 0 ? 'text-white' : 'text-dark-100 hover:text-white hover:text-opacity-60'} transition-colors cursor-pointer font-medium text-md`}>
							{'Current Strategies'}
						</h2>
					</div>
					<div className={`border-b pb-4 ${currentTab === 1 ? 'border-accent-900' : 'border-dark-600'} transition-colors`} onClick={() => set_currentTab(1)}>
						<h2 className={`${currentTab === 1 ? 'text-white' : 'text-dark-100 hover:text-white hover:text-opacity-60'} transition-colors cursor-pointer font-medium text-md`}>
							{'Old Strategies'}
						</h2>
					</div>
					<div
						className={`pb-4 text-dark-100 hover:text-accent-900 transition-colors cursor-pointer font-medium text-md flex flex-row items-center`}
						style={{marginLeft: 'auto'}}
						onClick={() => set_strategyModal(true)}>
						<svg className={'mr-1 h-5 w-5'} xmlns={'http://www.w3.org/2000/svg'} viewBox={'0 0 20 20'} fill={'currentColor'} aria-hidden={'true'}>
							<path fillRule={'evenodd'} d={'M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z'} clipRule={'evenodd'} />
						</svg>
						<h2>{'Add strategy'}</h2>
					</div>
					<div
						className={`pl-4 mb-4 text-dark-100 hover:text-accent-900 transition-colors cursor-pointer font-medium text-md flex flex-row items-center border-l border-dark-600 border-opacity-75`}
						onClick={() => switchCurrency()}>
						<h2>{baseCurrency === 'eur' ? '€' : '$'}</h2>
					</div>
				</div>
			</div>
			<div className={'flex flex-wrap w-full mb-16 tabular-nums lining-nums space-y-6 flex-col lg:flex-row'}>
				{renderStrategies()}
			</div>
			<StrategySelectorModal strategyModal={strategyModal} set_strategyModal={set_strategyModal} />
		</div>
	);
}

export default Index;
