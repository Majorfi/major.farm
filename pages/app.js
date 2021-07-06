/******************************************************************************
**	@Author:				Thomas Bouder <Tbouder>
**	@Email:					Tbouder@protonmail.com
**	@Date:					Monday January 4th 2021
**	@Filename:				index.js
******************************************************************************/

import	React, {useState, useEffect, useCallback}	from	'react';
import	{ArrowSmDownIcon, FireIcon, TrendingUpIcon, ChartPieIcon, CurrencyEuroIcon, MinusIcon}			from	'@heroicons/react/solid'
import	useStrategies								from	'contexts/useStrategies';
import	useCurrencies								from	'contexts/useCurrencies';
import	useLocalStorage								from	'hook/useLocalStorage';
import	STRATEGIES									from	'utils/strategies';
import	{formatValue, formatPercent}				from	'utils';

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

function Stats() {
	const	{tokenPrices, currencyNonce, baseCurrency} = useCurrencies();
	const	{strategies} = useStrategies();
	const	[seedInvested, set_seedInvested] = useState(0);
	const	[cropsYielding, set_cropsYielding] = useState(0);
	const	[currentYield, set_currentYield] = useState(0);
	const	[harvest, set_harvest] = useState(0);
	const	[currentGas, set_currentGas] = useState(0);

	const computeYieldValue = useCallback((_strategies) => {
		const	result = _strategies.reduce((accumulator, s) => {
			if (s?.isHarvested) {
				return {
					seeds: accumulator.seeds,
					yield: accumulator.yield,
					crops: accumulator.crops,
					harvest: accumulator.harvest,
					gas: accumulator.gas + (s?.lastGasValue || 0)
				};
			}
			const	strategy = STRATEGIES[s.name];
			return {
				seeds: accumulator.seeds + (s?.initialSeeds || 0) * (tokenPrices[strategy?.parameters?.underlyingTokenCgID]?.price || 1),
				yield: accumulator.yield + (s?.lastResult || 0),
				crops: accumulator.crops + (s?.lastSharesValue || 0),
				harvest: accumulator.harvest + (s?.lastHarvestValue || 0),
				gas: accumulator.gas + (s?.lastGasValue || 0),
			};
		}, ({seeds: 0, yield: 0, crops: 0, harvest: 0, gas: 0}));
		set_seedInvested(result.seeds);
		set_currentYield(result.yield);
		set_cropsYielding(result.crops);
		set_harvest(result.harvest);
		set_currentGas(result.gas);
	}, [tokenPrices]);

	useEffect(() => {
		const	_strategies = strategies.get();
		computeYieldValue(_strategies)
	}, [strategies.nonce, strategies.get, computeYieldValue, strategies, currencyNonce])

	function	OtherStat({title, value, HeroIcon}) {
		return (
			<div className={'p-4 flex flex-row items-center'}>
				<div className={'inline-flex items-center justify-center h-10 w-10 rounded-md bg-dark-400 text-white-75 sm:h-12 sm:w-12'}>
					<HeroIcon className={'h-6 w-6'} aria-hidden={'true'} />
				</div>
				<div className={'ml-4'}>
					<dt className={'text-sm font-normal text-white-80'}>{title}</dt>
					<dd className={'mt-1 flex justify-between items-baseline md:block lg:flex'}>
						<div className={'flex items-baseline text-xl font-semibold text-accent-900'}>
							{formatValue(value, baseCurrency)}
						</div>
					</dd>
				</div>
			</div>
		)
	}

	let	statClassName = 'text-dark-200';
	let	icon = (
		<MinusIcon
			className={'-ml-1 mr-0.5 flex-shrink-0 self-center h-5 w-5 text-dark-200'}
			aria-hidden={'true'} />
	)
	if (currentYield.toFixed(2) > 0) {
		statClassName = 'text-green-400';
		icon = (
			<ArrowSmDownIcon
				className={'-ml-1 mr-0.5 flex-shrink-0 self-center h-5 w-5 text-green-400'}
				aria-hidden={'true'} />
		)
	} else if (currentYield.toFixed(2) < 0) {
		statClassName = 'text-red-400';
		icon = (
			<ArrowSmDownIcon
				className={'-ml-1 mr-0.5 flex-shrink-0 self-center h-5 w-5 text-red-400'}
				aria-hidden={'true'} />
		)
	}

	return (
		<div>
			<dl className={'mt-5 grid grid-cols-1 rounded-lg bg-dark-600 overflow-hidden shadow divide-y divide-dark-400'}>
				<div className={'flex w-full justify-center'}>
					<div className={'px-4 py-5 sm:p-6 text-center'}>
						<dt className={'text-base font-normal text-white'}>{'Total Yield'}</dt>
						<dd className={'mt-1 flex justify-between items-baseline'}>
							<div className={'flex items-baseline text-2xl font-semibold text-accent-900'}>
								{formatValue(currentYield, baseCurrency)}
							</div>

							<div
								className={`${statClassName} bg-dark-400 inline-flex items-baseline px-2.5 py-0.5 rounded-full text-sm font-medium md:mt-2 lg:mt-0 ml-4`}>
								{icon}
								{formatPercent(((seedInvested + currentYield) - seedInvested) / seedInvested)}
							</div>
						</dd>
					</div>
				</div>

				<dl className={'mt-0 grid grid-cols-1 rounded-lg bg-dark-600 overflow-hidden shadow divide-y divide-dark-400 md:grid-cols-4 md:divide-y-0 md:divide-x'}>
					<OtherStat title={'Total Seeds Invested'} value={seedInvested} HeroIcon={ChartPieIcon} />
					<OtherStat title={'Total Crops Yielding'} value={cropsYielding} HeroIcon={TrendingUpIcon} />
					<OtherStat title={'Total Harvest'} value={harvest} HeroIcon={CurrencyEuroIcon} />
					<OtherStat title={'Total Gas Cost'} value={currentGas} HeroIcon={FireIcon} />
				</dl>

			</dl>
		</div>
	)
}


function	Index() {
	const	{strategies} = useStrategies();

	function	renderStrategy(strategy) {
		const	CurrentStrategy = STRATEGIES[strategy.name];
		if (!CurrentStrategy) {
			return null;
		}
		return (
			<CurrentStrategy.Strategy
				parameters={CurrentStrategy?.parameters}
				network={CurrentStrategy?.network || 'ethereum'}
				{...strategy} /> 
		)
	}

	return (
		<div>
			<div id={'newsbanner'} className={'space-y-0.5'}>
				<NewsBanner
					bannerID={'newsBanner-4'}
					short={'✨🍣 & 👻🪙 from ape.tax is now available'}
					long={'Intergalactic Sushi ✨🍣 & Fantom Bitcoin 👻🪙 from ape.tax are now available for tracking !'}
					uri={'https://ape.tax'} />
			</div>
			<Stats />

			<div className={'flex flex-wrap w-full mb-16 tabular-nums lining-nums space-y-6 flex-col lg:flex-row mt-12'} id={'strategies'}>
				<div className={'grid grid-cols-1 lg:grid-cols-2 2xl:grid-cols-3 w-full gap-6'}>
					{strategies.get().map((s) => (
						<div
							key={s.uuid}
							style={{display: 'inherit'}}>
							{renderStrategy(s)}
						</div>
					))}
				</div>
			</div>
		</div>
	);
}

export default Index;
