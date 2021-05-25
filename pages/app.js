/******************************************************************************
**	@Author:				Thomas Bouder <Tbouder>
**	@Email:					Tbouder@protonmail.com
**	@Date:					Monday January 4th 2021
**	@Filename:				index.js
******************************************************************************/

import	React, {useEffect, Fragment, useRef, useState}	from	'react';
import	{Dialog, Transition}							from	'@headlessui/react';
import	{useToasts}										from	'react-toast-notifications';
import	{v4 as uuidv4}									from	'uuid';
import	useCurrencies									from	'contexts/useCurrencies';
import	useStrategies									from	'contexts/useStrategies';
import	{PrepareStrategyBadgerWBTC}						from	'components/StrategyBadgerWBTC';
import	{PrepareStrategyYVBoost}						from	'components/StrategyYVBoost';
import	{toAddress}										from	'utils';
import	STRATEGIES										from	'utils/strategies';
import Image from 'next/image';
import Link from 'next/link';

function	StrategySelectorModal({strategyModal, set_strategyModal}) {
	const	{set_strategies} = useStrategies();
	const	[address, set_address] = useState('');
	const	[list, set_list] = useState('ape.tax');
	const	[strategy, set_strategy] = useState('');
	const	initialFocus = useRef()
	const	{addToast} = useToasts();

	useEffect(() => {
		set_strategy(Object.entries(STRATEGIES).filter(([, value]) => value.list === list)[0][0])
	}, [list])

	async function	prepareStrategy() {
		const	_address = toAddress(address)
		if (!_address) {
			return {status: 'KO', result: 'invalidAddress'}
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
			return {status: 'KO', result: 'error'}
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
				<div className={'flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0'}>
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
									<span className={'relative z-0 inline-flex shadow-sm rounded-md'}>
										<button
											onClick={() => set_list('ape.tax')}
											type={'button'}
											className={`${list === 'ape.tax' ? 'bg-dark-900 text-white text-opacity-100' : 'bg-dark-400 text-white text-opacity-75'} relative inline-flex items-center px-4 py-2 rounded-l-md border border-dark-300 text-sm font-medium hover:bg-dark-900 focus:outline-none transition-colors`}>
											{'🦍'}&nbsp;&nbsp;{'Ape.tax'}
										</button>
										<button
											onClick={() => set_list('yearn-v1')}
											type={'button'}
											className={`${list === 'yearn-v1' ? 'bg-dark-900 text-white text-opacity-100' : 'bg-dark-400 text-white text-opacity-75'} relative inline-flex items-center px-4 py-2 border border-dark-300 text-sm font-medium hover:bg-dark-900 focus:outline-none transition-colors`}>
											{'🔷'}&nbsp;&nbsp;{'Yearn V1'}
										</button>
										<button
											onClick={() => set_list('yearn-v1-crv')}
											type={'button'}
											className={`${list === 'yearn-v1-crv' ? 'bg-dark-900 text-white text-opacity-100' : 'bg-dark-400 text-white text-opacity-75'} relative inline-flex items-center px-4 py-2 border border-dark-300 text-sm font-medium hover:bg-dark-900 focus:outline-none transition-colors`}>
											{'🌈'}&nbsp;&nbsp;{'YearnCrv V1'}
										</button>
										<button
											onClick={() => set_list('misc')}
											type={'button'}
											className={`${list === 'misc' ? 'bg-dark-900 text-white text-opacity-100' : 'bg-dark-400 text-white text-opacity-75'} -ml-px relative inline-flex items-center px-4 py-2 rounded-r-md border border-dark-300 text-sm font-medium hover:bg-dark-900 focus:outline-none transition-colors`}>
											{'🌾'}&nbsp;&nbsp;{'Misc'}
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
										{Object.entries(STRATEGIES).filter(([, value]) => value.list === list).map(e => (
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
											if (res.status === 'KO') {
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

function	Currency() {
	const	{switchCurrency, baseCurrency} = useCurrencies();
	return (
		<div
			className={'ml-4 pl-4 text-dark-100 hover:text-accent-900 transition-colors cursor-pointer font-medium text-md flex flex-row items-center border-l border-dark-600 border-opacity-100'}
			onClick={() => switchCurrency()}>
			<h2>{baseCurrency === 'eur' ? '€' : '$'}</h2>
		</div>
	)
}

function	Index() {
	const	{strategies} = useStrategies();
	const	[strategyModal, set_strategyModal] = useState(false);

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

	function	Header() {
		return (
			<div className={'bg-dark-600 py-6 -mx-12 -mt-12 px-12 bg-opacity-30'}>
				<div className={'flex flex-row justify-between items-center'}>
					<Link href={'/'}>
						<div className={'flex flex-row items-center text-white cursor-pointer'}>
							<div>
								<Image src={'/sprout.svg'} width={30} height={30} />
							</div>
							<div className={'ml-4'}>
								<p className={'font-semibold text-xl text-white'}>{'Major\'s Farm'}</p>
								<p className={'font-normal text-sm text-white text-opacity-60'}>{'A degen loss calculator'}</p>
							</div>
						</div>
					</Link>
					<div className={'flex flex-row items-center'}>
						<div
							className={'text-dark-100 hover:text-accent-900 transition-colors cursor-pointer font-medium text-md flex flex-row items-center'}
							style={{marginLeft: 'auto'}}
							onClick={() => set_strategyModal(true)}>
							<svg className={'mr-1 h-5 w-5'} xmlns={'http://www.w3.org/2000/svg'} viewBox={'0 0 20 20'} fill={'currentColor'} aria-hidden={'true'}>
								<path fillRule={'evenodd'} d={'M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z'} clipRule={'evenodd'} />
							</svg>
							<h2>{'Add strategy'}</h2>
						</div>
						<Currency />
					</div>
				</div>
			</div>
		)
	}

	return (
		<div>
			<Header />
			<div className={'flex flex-wrap w-full mb-16 tabular-nums lining-nums space-y-6 flex-col lg:flex-row mt-12'}>
				<div className={'grid grid-cols-1 lg:grid-cols-2 2xl:grid-cols-3 w-full gap-6'}>
					{strategies.map((s, i) => (
						<div
							key={`${s.strategy}-${s.params?.address}-${s.params?.uuid}-${i}`}
							style={{display: 'inherit'}}>
							{renderStrategy(s.strategy, s)}
						</div>
					))}
				</div>
			</div>
			<StrategySelectorModal strategyModal={strategyModal} set_strategyModal={set_strategyModal} />
		</div>
	);
}

export default Index;
