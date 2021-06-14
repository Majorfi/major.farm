/******************************************************************************
**	@Author:				Thomas Bouder <Tbouder>
**	@Email:					Tbouder@protonmail.com
**	@Date:					Monday January 4th 2021
**	@Filename:				index.js
******************************************************************************/

import	React, {useState}				from	'react';
import	Image							from	'next/image';
import	Link							from	'next/link';
import	useCurrencies					from	'contexts/useCurrencies';
import	useStrategies					from	'contexts/useStrategies';
import	useWeb3							from	'contexts/useWeb3';
import	StrategySelectorModal			from	'components/Modals/StrategySelector';
import	LoginModal						from	'components/Modals/LoginModal';
import	useLocalStorage					from	'hook/useLocalStorage';
import	STRATEGIES						from	'utils/strategies';

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

function	Index() {
	const	{strategies} = useStrategies();
	const	{address, ens, active, deactivate, onDesactivate} = useWeb3();
	const	[strategyModal, set_strategyModal] = useState(false);
	const	[open, set_open] = useState(false);

	function	renderWallet() {
		if (ens) {
			return (
				<span className={'whitespace-nowrap text-white-95'}>
					{ens}
				</span>
			);
		} else if (address) {
			return (
				<span className={'whitespace-nowrap text-white-95'}>
					{`${address.slice(0, 4)}...${address.slice(-4)}`}
				</span>
			);
		} else if (active) {
			return (
				<span className={'whitespace-nowrap text-white-95 italic'}>
					{'Fetching information ...'}
				</span>
			);	
		}
		return (
			<span className={'whitespace-nowrap text-white-95'}>
				{'Connect a wallet'}
			</span>
		);
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
						<button
							suppressHydrationWarning
							onClick={() => {
								if (active) {
									deactivate();
									onDesactivate();
								} else {
									set_open(!open);
								}
							}}
							type={'button'}
							className={'ml-8 inline-flex px-4 py-2 items-center shadow-md leading-4 font-normal rounded-md text-xs border border-white border-opacity-10 bg-dark-400 hover:bg-dark-300 overflow-auto focus:outline-none overflow-y-hidden'}
							id={'options-menu'}
							aria-expanded={'true'}
							aria-haspopup={'true'}>
							{renderWallet()}
						</button>
					</div>
				</div>
				<LoginModal open={open} set_open={set_open} />
			</div>
		)
	}

	return (
		<div>
			<Header />
			<div id={'newsbanner'} className={'space-y-0.5'}>
				<NewsBanner
					bannerID={'newsBanner-2'}
					short={'💵🍱 and 🏆🚀 from ape.tax are now available'}
					long={'Dollar Store Bento 💵🍱 and Magic Idle DAI 🏆🚀 from ape.tax are now available for tracking !'}
					uri={'https://ape.tax'} />
			</div>

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
			<StrategySelectorModal strategyModal={strategyModal} set_strategyModal={set_strategyModal} />
		</div>
	);
}

export default Index;
