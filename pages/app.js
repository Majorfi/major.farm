/******************************************************************************
**	@Author:				Thomas Bouder <Tbouder>
**	@Email:					Tbouder@protonmail.com
**	@Date:					Monday January 4th 2021
**	@Filename:				index.js
******************************************************************************/

import	React, {useState}							from	'react';
import	{useToasts}									from	'react-toast-notifications';
import	{v4 as uuidv4}								from	'uuid';
import	{ViewGridAddIcon, RefreshIcon, FireIcon}	from	'@heroicons/react/outline'
import	useStrategies								from	'contexts/useStrategies';
import	useWeb3										from	'contexts/useWeb3';
import	StrategySelectorModal						from	'components/Modals/StrategySelector';
import	TopBar										from	'components/TopBar';
import	useLocalStorage								from	'hook/useLocalStorage';
import	STRATEGIES									from	'utils/strategies';
import	* as api									from	'utils/API';
import	{asyncForEach}								from	'utils';

function	NewsBanner({short, long, uri, bannerID}) {
	const	[newsBanner, set_newsBanner] = useLocalStorage(bannerID, true);

	if (!newsBanner) {
		return null;
	}
	return (
		<div className={'bg-accent-900 bg-opacity-100 -mx-12'}>
			<div className={'max-w-7xl mx-auto py-3 px-12'}>
				<div className={'flex items-center justify-between flex-wrap'}>
					<div className={'w-0 flex-1 flex items-center'}>
						<span className={'flex p-2 rounded-lg bg-accent-900'}>
							<svg className={'h-6 w-6 text-white'} xmlns={'http://www.w3.org/2000/svg'} fill={'none'} viewBox={'0 0 24 24'} stroke={'currentColor'} aria-hidden={'true'}>
								<path strokeLinecap={'round'} strokeLinejoin={'round'} strokeWidth={'2'} d={'M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z'} />
							</svg>
						</span>
						<p className={'ml-3 font-medium text-white truncate'}>
							<span className={'md:hidden'}>{short}</span>
							<span className={'hidden md:inline tracking-wider'}>{long}</span>
						</p>
					</div>
					<div className={'order-3 mt-2 flex-shrink-0 w-full sm:order-2 sm:mt-0 sm:w-auto'}>
						<a
							href={uri}
							target={'_blank'}
							className={'flex items-center justify-center px-4 py-2 rounded-md shadow-sm text-sm font-medium text-accent-900 bg-white hover:bg-accent-50'} rel={'noreferrer'}>
							{'Learn more'}
						</a>
					</div>
					<div className={'order-2 flex-shrink-0 sm:order-3 sm:ml-3'}>
						<button
							onClick={() => set_newsBanner(false)}
							type={'button'}
							className={'-mr-1 flex p-2 rounded-md hover:bg-accent-500 focus:outline-none focus:ring-2 focus:ring-white sm:-mr-2'}>
							<span className={'sr-only'}>{'Dismiss'}</span>
							<svg className={'h-6 w-6 text-white'} xmlns={'http://www.w3.org/2000/svg'} fill={'none'} viewBox={'0 0 24 24'} stroke={'currentColor'} aria-hidden={'true'}>
								<path strokeLinecap={'round'} strokeLinejoin={'round'} strokeWidth={'2'} d={'M6 18L18 6M6 6l12 12'} />
							</svg>
						</button>
					</div>
				</div>
			</div>
		</div>
	)
}

function	SectionCTA({onAddStrategy, onDetectStrategies, onRefreshStrategies, detectingStrategies}) {
	return (
		<div className={'mt-12 shadow rounded-lg bg-dark-600 p-6 grid grid-cols-3 divide-x-2 divide-dark-400'}>
			<div className={'group flex px-6'}>
				<div
					onClick={onAddStrategy}
					className={'flex flex-row p-6 hover:bg-dark-400 rounded transition-all cursor-pointer opacity-70 hover:opacity-100'}>
					<div>
						<span className={'rounded-lg inline-flex p-2 text-white bg-accent-900'}>
							<ViewGridAddIcon className={'h-7 w-7'} aria-hidden={'true'} />
						</span>
					</div>
					<div className={'ml-8'}>
						<h3 className={'text-lg font-medium text-accent-900'}>
							{'Add a strategy'}
						</h3>
						<p className={'mt-2 text-sm text-white-75'}>
							{'Choose a specific strategy and start monitoring your Yield to see if you are profitable !'}
						</p>
					</div>
				</div>
			</div>
			<div className={'group flex px-6'}>
				<div
					onClick={onDetectStrategies}
					className={'flex flex-col p-6 hover:bg-dark-400 rounded transition-all cursor-pointer relative'}>
					<div className={'flex flex-row'}>
						<div>
							<span className={'rounded-lg inline-flex p-2 text-white bg-accent-900'}>
								<FireIcon className={'h-7 w-7'} aria-hidden={'true'} />
							</span>
						</div>
						<div className={'ml-8'}>
							<h3 className={'text-lg font-medium text-accent-900'}>
								{'Find your seeds'}
							</h3>
							<p className={'mt-2 text-sm text-white-75'}>
								{'The easy way ! Just click and let us find the strategies you invested in !'}
							</p>
						</div>
					</div>
					{detectingStrategies ? <div className={'absolute bottom-2 flex w-full justify-center items-center pr-12'}>
						<div className={'flex flex-row items-center'}>
							<div className={'w-3 h-3 rounded-full bg-accent-900 animate-pulse'} />
							<div className={'w-3 h-3 rounded-full bg-accent-900 animate-pulse mx-3'} style={{animationDelay: '1s'}} />
							<div className={'w-3 h-3 rounded-full bg-accent-900 animate-pulse'} />
						</div>
					</div> : null}
				</div>
			</div>
			<div className={'group flex px-6'}>
				<div
					onClick={onRefreshStrategies}
					className={'flex flex-row p-6 hover:bg-dark-400 rounded transition-all cursor-pointer opacity-70 hover:opacity-100'}>
					<div>
						<span className={'rounded-lg inline-flex p-2 text-white bg-accent-900'}>
							<RefreshIcon className={'h-7 w-7'} aria-hidden={'true'} />
						</span>
					</div>
					<div className={'ml-8'}>
						<h3 className={'text-lg font-medium text-accent-900'}>
							{'Update strategies'}
						</h3>
						<p className={'mt-2 text-sm text-white-75'}>
							{'Your strategies are outdated ? Refresh them to get the latest information.'}
						</p>
					</div>
				</div>
			</div>
		</div>
	);
}

function	Index() {
	const	{addToast} = useToasts();
	const	{address} = useWeb3();
	const	{strategies, set_strategies, set_nonce} = useStrategies();
	const	[strategyModal, set_strategyModal] = useState(false);
	const	[detectingStrategies, set_detectingStrategies] = useState(false);

	function appendStrategy(title, newStrategy) {
		set_strategies(_strategies => [..._strategies, {
			strategy: title,
			params: {
				uuid: uuidv4(),
				...newStrategy,
			}
		}]);
		set_nonce(n => n + 1);
	}
	async function	detectStrategies() {
		if (!address) {
			addToast('Please, connect your wallet first', {appearance: 'error'});
			return (null);
		}
		set_detectingStrategies(true);
		addToast('Looking for strategies ...', {appearance: 'info'});
		const	_address = address;
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
				normalTx[s.network] = await api.retreiveTxFrom(s.network, _address);
			}
			if (erc20Tx[s.network] === undefined) {
				erc20Tx[s.network] = await api.retreiveErc20TxFrom(s.network, _address);
			}
			const	hasSomeTx = await detector(s.parameters, _address, s.network, normalTx[s.network]);
			if (hasSomeTx) {
				const	newStrategy = await s.prepare(s.parameters, _address, s.network, normalTx[s.network], erc20Tx[s.network]);
				newStrategy.date = new Date(newStrategy.timestamp * 1000);
				newStrategy.address = _address;
				appendStrategy(s?.parameters?.title, newStrategy);
				addToast(`Strategy ${s.parameters.title} available`, {appearance: 'success'});
			}
		});
		set_detectingStrategies(false);
	}

	function	renderStrategy(strategy, s) {
		const	CurrentStrategy = STRATEGIES[strategy];
		if (!CurrentStrategy) {
			return null;
		}
		return (
			<CurrentStrategy.Strategy
				parameters={CurrentStrategy?.parameters}
				network={CurrentStrategy?.network || 'ethereum'}
				{...s.params} /> 
		)
	}

	return (
		<div>
			<TopBar set_strategyModal={set_strategyModal} />
			<div id={'newsbanner'} className={'space-y-0.5'}>
				<NewsBanner
					bannerID={'newsBanner-2'}
					short={'💵🍱 and 🏆🚀 from ape.tax are now available'}
					long={'Dollar Store Bento 💵🍱 and Magic Idle DAI 🏆🚀 from ape.tax are now available for tracking !'}
					uri={'https://ape.tax'} />
			</div>

			<SectionCTA
				onAddStrategy={() => set_strategyModal(true)}
				onDetectStrategies={() => detectStrategies()}
				onRefreshStrategies={() => addToast('Not implemented', {appearance: 'warning'})}
				detectingStrategies={detectingStrategies}
			/>

			<div className={'flex flex-wrap w-full mb-16 tabular-nums lining-nums space-y-6 flex-col lg:flex-row mt-12'} id={'strategies'}>
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
			<StrategySelectorModal
				strategyModal={strategyModal}
				set_strategyModal={set_strategyModal} />
		</div>
	);
}

export default Index;
