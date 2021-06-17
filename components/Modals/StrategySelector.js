/******************************************************************************
**	@Author:				Thomas Bouder <Tbouder>
**	@Email:					Tbouder@protonmail.com
**	@Date:					Friday June 11th 2021
**	@Filename:				StrategySelector.js
******************************************************************************/

import	React, {useEffect, Fragment, useRef, useState}	from	'react';
import	Image											from	'next/image';
import	{Dialog, Transition}							from	'@headlessui/react';
import	{useToasts}										from	'react-toast-notifications';
import	{v4 as uuidv4}									from	'uuid';
import	{ethers}										from	'ethers';
import	useStrategies									from	'contexts/useStrategies';
import	{PrepareStrategyBadgerWBTC}						from	'components/Strategies/StrategyBadgerWBTC';
import	{PrepareStrategyYVBoost}						from	'components/Strategies/StrategyYVBoost';
import	{toAddress}										from	'utils';
import	STRATEGIES										from	'utils/strategies';

function	SectionChains({set_chain, chain}) {
	return (
		<section>
			<label htmlFor={'chain'} className={'ml-0.5 mb-2 block text-sm font-medium text-white text-opacity-75'}>
				{'Chain'}
			</label>
			<div className={'relative z-0 inline-flex shadow-sm rounded-md w-full'}>
				<button
					onClick={() => set_chain('ethereum')}
					type={'button'}
					className={`${chain === 'ethereum' ? 'bg-dark-900 text-white text-opacity-100' : 'bg-dark-400 text-white text-opacity-75'} relative flex flex-col items-center px-4 py-2 rounded-l-md border border-dark-300 text-sm font-medium hover:bg-dark-900 focus:outline-none transition-colors w-full text-center`}>
					<Image
						src={'/chains/ethereum.png'}
						loading={'eager'}
						width={26.4}
						height={42} />
					<p className={'mt-2'}>{'Ethereum'}</p>
				</button>
				<button
					onClick={() => set_chain('polygon')}
					type={'button'}
					className={`${chain === 'polygon' ? 'bg-dark-900 text-white text-opacity-100' : 'bg-dark-400 text-white text-opacity-75'} relative flex flex-col items-center px-4 py-2 border border-dark-300 text-sm font-medium hover:bg-dark-900 focus:outline-none transition-colors w-full text-center`}>
					<Image
						src={'/chains/polygon.svg'}
						loading={'eager'}
						width={42}
						height={42} />
					<p className={'mt-2'}>{'Polygon'}</p>
				</button>
				<button
					onClick={() => set_chain('bsc')}
					type={'button'}
					className={`${chain === 'bsc' ? 'bg-dark-900 text-white text-opacity-100' : 'bg-dark-400 text-white text-opacity-75'} relative flex flex-col items-center px-4 py-2 border border-dark-300 text-sm font-medium hover:bg-dark-900 focus:outline-none transition-colors w-full text-center`}>
					<Image
						src={'/chains/bsc.svg'}
						loading={'eager'}
						width={42}
						height={42} />
					<p className={'mt-2'}>{'Binance SC'}</p>
				</button>
				<button
					onClick={() => set_chain('fantom')}
					type={'button'}
					className={`${chain === 'fantom' ? 'bg-dark-900 text-white text-opacity-100' : 'bg-dark-400 text-white text-opacity-75'} -ml-px relative flex flex-col items-center px-4 py-2 rounded-r-md border border-dark-300 text-sm font-medium hover:bg-dark-900 focus:outline-none transition-colors w-full text-center`}>
					<Image
						src={'/chains/fantom.svg'}
						loading={'eager'}
						width={42}
						height={42} />
					<p className={'mt-2'}>{'Fantom'}</p>
				</button>
			</div>
		</section>
	);
}

function	SectionLists({set_list, list}) {
	return (
		<section>
			<label htmlFor={'list'} className={'ml-0.5 mb-2 block text-sm font-medium text-white text-opacity-75'}>
				{'List'}
			</label>
			<div className={'relative z-0 inline-flex shadow-sm rounded-md w-full'}>
				<button
					onClick={() => set_list('ape.tax')}
					type={'button'}
					className={`${list === 'ape.tax' ? 'bg-dark-900 text-white text-opacity-100' : 'bg-dark-400 text-white text-opacity-75'} relative inline-flex items-center px-4 py-2 rounded-l-md border border-dark-300 text-sm font-medium hover:bg-dark-900 focus:outline-none transition-colors w-1/3 text-center`}>
					{'🦍'}&nbsp;&nbsp;{'Ape.tax'}
				</button>
				<button
					onClick={() => set_list('yearn')}
					type={'button'}
					className={`${list === 'yearn' ? 'bg-dark-900 text-white text-opacity-100' : 'bg-dark-400 text-white text-opacity-75'} relative inline-flex items-center px-4 py-2 border border-dark-300 text-sm font-medium hover:bg-dark-900 focus:outline-none transition-colors w-1/3 text-center`}>
					{'🔷'}&nbsp;&nbsp;{'Yearn'}
				</button>
				<button
					onClick={() => set_list('yearn-crv')}
					type={'button'}
					className={`${list === 'yearn-crv' ? 'bg-dark-900 text-white text-opacity-100' : 'bg-dark-400 text-white text-opacity-75'} relative inline-flex items-center px-4 py-2 border border-dark-300 text-sm font-medium hover:bg-dark-900 focus:outline-none transition-colors w-1/3 text-center`}>
					{'🌈'}&nbsp;&nbsp;{'YearnCrv'}
				</button>
				<button
					onClick={() => set_list('misc')}
					type={'button'}
					className={`${list === 'misc' ? 'bg-dark-900 text-white text-opacity-100' : 'bg-dark-400 text-white text-opacity-75'} -ml-px relative inline-flex items-center px-4 py-2 rounded-r-md border border-dark-300 text-sm font-medium hover:bg-dark-900 focus:outline-none transition-colors w-1/3 text-center`}>
					{'🌾'}&nbsp;&nbsp;{'Misc'}
				</button>
			</div>
		</section>
	)
}

function	StrategySelectorModal({strategyModal, set_strategyModal}) {
	const	{strategies} = useStrategies();
	const	[address, set_address] = useState('');
	const	[chain, set_chain] = useState('ethereum');
	const	[list, set_list] = useState('ape.tax');
	const	[strategy, set_strategy] = useState('');
	const	initialFocus = useRef()
	const	{addToast} = useToasts();

	useEffect(() => {
		set_strategy(Object.entries(STRATEGIES).filter(([, value]) => value.list === list && value.network === chain)?.[0]?.[0])
	}, [list, chain])

	async function	prepareStrategy() {
		let	_address = toAddress(address.trim())
		if (!_address) {
			const	provider = new ethers.providers.AlchemyProvider('homestead', process.env.ALCHEMY_KEY)
			_address = toAddress(await provider.resolveName(address.trim()));
			if (!_address) {
				return {status: 'KO', result: 'invalidAddress'}
			}
		}

		let		result = undefined;
		if (strategy === 'Badger WBTC') {
			result = await PrepareStrategyBadgerWBTC(_address);
		} else if (strategy === 'yvBoost') {
			result = await PrepareStrategyYVBoost(_address);
		} else {
			const	currentStrategy = STRATEGIES[strategy];
			if (currentStrategy !== undefined) {
				result = await currentStrategy.prepare(currentStrategy.parameters, _address, currentStrategy.network)
			}
		}
	
		if (!result || result.status === 'KO') {
			return {status: 'KO', result: 'error'}
		}
		return {status: 'OK', result: {
			...result,
			date: new Date(result.timestamp * 1000),
			address: _address
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
						<div className={'inline-block align-bottom bg-dark-600 rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-xl sm:w-full md:mb-96'}>
							<div className={'bg-dark-600 rounded-lg p-6 space-y-4'}>

								<SectionChains chain={chain} set_chain={set_chain} />
								<SectionLists list={list} set_list={set_list} />

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
										{Object.entries(STRATEGIES).filter(([, value]) => value.list === list && value.network === chain).map(e => (
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
											strategies.add({
												uuid: uuidv4(),
												name: strategy,
												fees: populator.fees,
												initialSeeds: populator.initialSeeds,
												initialCrops: populator.initialCrops,
												harvest: populator.harvest,
												timestamp: populator.timestamp,
												date: populator.date,
												address: populator.address,
											})
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

export default StrategySelectorModal;