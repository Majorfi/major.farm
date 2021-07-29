/******************************************************************************
**	@Author:				Thomas Bouder <Tbouder>
**	@Email:					Tbouder@protonmail.com
**	@Date:					Monday January 4th 2021
**	@Filename:				index.js
******************************************************************************/

import	React, {useState, useEffect}								from	'react';
import	Link														from	'next/link';
import	{ethers}													from	'ethers';
import	useCurrencies												from	'contexts/useCurrencies';
import	TopBar														from	'components/TopBar';
import	STRATEGIES													from	'utils/strategies';
import	Image														from	'next/image';
import	{Line}														from	'react-chartjs-2';
import	* as API													from	'utils/API'
import	{getProvider, getExplorer, getSymbol}						from	'utils/chains';
import	{address, chunk, bigNumber, countBy, splitBy, formatValue, formatDate, formatAmount}	from	'utils';
import	SIGNATURES, {getSignatureTitle, findSignatureTitle}			from	'utils/methodsSignatures';
import	{CheckIcon, DownloadIcon, ShieldCheckIcon, UploadIcon}		from	'@heroicons/react/outline';
import	{ChevronLeftIcon, ChevronRightIcon} 						from	'@heroicons/react/solid';

const optionsLineChart = {
	maintainAspectRatio: false,
	animation: false,
	plugins: {
		filler: {propagate: false},
		title: {display: false},
		legend: {display: false},
		// tooltip: {enabled: false},
	},
	scales: {
		y: {display: false},
		x: {display: false}
	},
	elements: {
		point: {radius: 0}
	},
	interaction: {intersect: false}
};

function	StrategyCard({strategy}) {
	const	{tokenPrices, baseCurrency} = useCurrencies();
	const	[vaultInformations, set_vaultInformations] = useState({});
	const	[vaultInteractions, set_vaultInteractions] = useState({});
	const	[data, set_data] = useState(undefined);
	const	[txIndex, set_txIndex] = useState(0);

	function	reducer(accumulator, tx) {
		return ({
			totalGasUsed: bigNumber.from(accumulator.totalGasUsed).add(bigNumber.from(tx.gasUsed).mul(bigNumber.from(tx.gasPrice)))
		})
	}
	async function getStrategyData(_contractAddress) {
		const	provider = getProvider(strategy.network);
		const	ABI = [
			'function decimals() external view returns (uint256)',
			'function pricePerShare() external view returns (uint256)',
			'function depositLimit() external view returns (uint256)',
			'function managementFee() external view returns (uint256)',
			'function performanceFee() external view returns (uint256)',
			'function totalAssets() external view returns (uint256)',
		];
		const	smartContract = new ethers.Contract(_contractAddress, ABI, provider);
		const	underlyingToBaseCurrency = tokenPrices[strategy.parameters?.underlyingTokenCgID]?.price || 0;

		const [_pricePerShare, _depositLimit, _totalAssets, _managementFee, _performanceFee, decimals, transactions, transactionsERC20] = await Promise.all([
			smartContract.pricePerShare(),
			smartContract.depositLimit(),
			smartContract.totalAssets(),
			smartContract.managementFee(),
			smartContract.performanceFee(),
			smartContract.decimals(),
			API.retreiveTxFrom(strategy.network, _contractAddress),
			API.retreiveErc20TxFrom(strategy.network, _contractAddress),
		]);

		set_vaultInformations({
			pricePerShare: Number(ethers.utils.formatUnits(_pricePerShare, decimals)),
			depositLimit: Number(ethers.utils.formatUnits(_depositLimit, decimals)).toFixed(2),
			totalAssets: Number(ethers.utils.formatUnits(_totalAssets, decimals)).toFixed(2),
			totalValue: Number(ethers.utils.formatUnits(_totalAssets, decimals)).toFixed(2) * underlyingToBaseCurrency,
			managementFee: Number(_managementFee),
			performanceFee: Number(_performanceFee),
		});

		const	{totalGasUsed} = transactions.reduce(reducer, ({totalGasUsed: 0}));
		const	numberOfInteractors = countBy(transactions, 'from');
		const	typeOfActions = splitBy(transactions, 'input', (e) => findSignatureTitle(e.slice(0, 10)))
		const	chunckedTransactions = chunk(transactions, Math.round(transactions.length / 20))
		
		let		pricesPerShare = [];
		try {
			pricesPerShare = (await Promise.all(
				chunckedTransactions.map(async e => ({date: formatDate(e[0]?.timeStamp * 1000, baseCurrency), pricePerShare: await smartContract.pricePerShare({blockTag: Number(e[0]?.blockNumber)})}))
			)).reverse();
		} catch(e) {
			console.error(e);
		}
		pricesPerShare[0] = {date: 'Inception', pricePerShare: ethers.utils.parseUnits('1', decimals)};
		pricesPerShare[pricesPerShare.length] = {date: 'Now', pricePerShare: _pricePerShare};

		set_data({
			labels: [...pricesPerShare.map(e => `Date ${e.date}`)],
			datasets: [{
				label: 'Share value',
				data: [...pricesPerShare.map(e => Number(ethers.utils.formatUnits(e.pricePerShare, decimals)))],
				fill: 'start',
				backgroundColor: 'rgba(249, 177, 42, 0.5)',
				borderColor: 'rgba(249, 177, 42, 0.6)',
			}],
		})

		const	transactionsUpdated = transactions.map((tx) => {
			const actionType = findSignatureTitle(tx.input.slice(0, 10));
			if (actionType === 'DEPOSIT' || actionType === 'WITHDRAW') {
				return undefined;
			}
			return tx;
		}).filter(Boolean);

		const	transactionsERC20Updated = transactionsERC20.map(e => {
			if (address(e.from) === address(_contractAddress)) {
				e.input = SIGNATURES['YV_WITHDRAW'];
			} else if (address(e.to) === address(_contractAddress)) {
				e.input = SIGNATURES['YV_DEPOSIT'];
			}
			return (e);
		})

		set_vaultInteractions({
			transactionsList: [...transactionsUpdated, ...transactionsERC20Updated].sort((a, b) => b.blockNumber - a.blockNumber),
			numberOfTransactions: transactions.length,
			totalGasUsed: Number(ethers.utils.formatUnits(totalGasUsed, 18)),
			numberOfInteractors: numberOfInteractors,
			typeOfActions
		});


	}

	useEffect(() => {
		getStrategyData(strategy.parameters?.contractAddress);
	}, []);

	return (
		<>
			<div className={'w-full rounded-lg shadow bg-dark-600 relative overflow-hidden grid grid-cols-none lg:grid-cols-3'}>
				<div className={'flex flex-col p-6 row-span-1 lg:col-span-1'}>
					<div className={'grid grid-cols-4 gap-6 justify-center'}>
						<div className={'col-span-3'}>
							<h3 className={'font-medium text-2xl text-white truncate'}>{strategy.parameters?.title}</h3>
						</div>
						<div className={'col-span-1 flex flex-row space-x-2 justify-end'}>
							<div className={'bg-dark-900 rounded-full p-2 flex justify-center items-center w-10'}>
								{strategy.list === 'ape.tax' ? <Image
									src={'/protocols/ape.svg'}
									loading={'eager'}
									width={24}
									height={24} /> : null}
								{strategy.list === 'yearn' ? <Image
									src={'/protocols/yearn.svg'}
									loading={'eager'}
									width={24}
									height={24} /> : null}
								{strategy.list === 'yearn-crv' ? <Image
									src={'/protocols/yearn.svg'}
									loading={'eager'}
									width={24}
									height={24} /> : null}
							</div>
							<div className={'bg-dark-900 rounded-full p-2 flex justify-center items-center w-10'}>
								{strategy.network === 'ethereum' ? <Image
									src={'/chains/ethereum.png'}
									loading={'eager'}
									objectFit={'contain'}
									width={24}
									height={24} /> : null}
								{strategy.network === 'polygon' ? <Image
									src={'/chains/polygon.svg'}
									loading={'eager'}
									objectFit={'contain'}
									width={24}
									height={24} /> : null}
								{strategy.network === 'fantom' ? <Image
									src={'/chains/fantom.svg'}
									loading={'eager'}
									objectFit={'contain'}
									width={24}
									height={24} /> : null}
								{strategy.network === 'bsc' ? <Image
									src={'/chains/bsc.svg'}
									loading={'eager'}
									objectFit={'contain'}
									width={24}
									height={24} /> : null}
							</div>
						</div>
					</div>
					<div className={'flex flex-col h-full'}>
						<section aria-label={'Vault Informations'}>
							<label className={'mt-4 mb-2 block text-sm font-medium text-white text-opacity-50 border-b border-white border-opacity-10 pb-2'}>
								{'Strategy informations'}
							</label>
							<div className={'pt-1 flex flex-row items-center'}>
								<p className={'inline text-sm text-white text-opacity-50 w-2/5'}>{'Total Supply: '}</p>
								<p className={'inline text-base font-medium text-white text-opacity-90 w-3/5'}>{formatAmount(vaultInformations?.totalAssets || 0, baseCurrency)}</p>
							</div>
							<div className={'pt-2 flex flex-row items-center'}>
								<p className={'inline text-sm text-white text-opacity-50 w-2/5'}>{'Deposit Limit: '}</p>
								<p className={'inline text-base font-medium text-white text-opacity-90 w-3/5'}>{formatAmount(vaultInformations?.depositLimit || 0, baseCurrency)}</p>
							</div>
							<div className={'pt-2 flex flex-row items-center'}>
								<p className={'inline text-sm text-white text-opacity-50 w-2/5'}>{'Total Value: '}</p>
								<p className={'inline text-base font-medium text-white text-opacity-90 w-3/5'}>{formatValue(vaultInformations?.totalValue || vaultInformations?.totalAssets || 0, baseCurrency)}</p>
							</div>
							<div className={'pt-1 flex flex-row items-center'}>
								<p className={'inline text-sm text-white text-opacity-50 w-2/5'}>{'Share Price: '}</p>
								<p className={'inline text-base font-medium text-white text-opacity-90 w-3/5'}>{formatAmount(vaultInformations?.pricePerShare || 0, baseCurrency)}</p>
							</div>
							<div className={'pt-1 flex flex-row items-center text-white'}>
								<p className={'inline text-sm text-white text-opacity-50 w-2/5'}>{'Performance Fees: '}</p>
								<p className={'inline text-base font-medium text-white text-opacity-90 w-3/5'}>{`${(vaultInformations?.performanceFee || 0) / 100}%`}</p>
							</div>
							<div className={'pt-1 flex flex-row items-center text-white'}>
								<p className={'inline text-sm text-white text-opacity-50 w-2/5'}>{'Management Fees: '}</p>
								<p className={'inline text-base font-medium text-white text-opacity-90 w-3/5'}>{`${(vaultInformations?.managementFee || 0) / 100}%`}</p>
							</div>
							<div className={'pt-1 flex flex-row items-center'}>
								<p className={'inline text-sm text-white text-opacity-50 w-2/5'}>{'Author: '}</p>
								<div className={'inline w-3/5'}>
									<a className={'text-base font-medium text-white text-opacity-90 cursor-pointer hover:text-accent-900 hover:underline'} href={`https://twitter.com/${strategy.parameters?.author}`} target={'_blank'} rel={'noreferrer'}>
										{strategy.parameters?.author}
									</a>
								</div>
							</div>
						</section>

						<section aria-label={'Vault Interactions'}>
							<label className={'mt-4 mb-2 block text-sm font-medium text-white text-opacity-50 border-b border-white border-opacity-10 pb-2'}>
								{'Strategy interactions'}
							</label>
							<div className={'pt-2 flex flex-row items-center'}>
								<p className={'inline text-sm text-white text-opacity-50 w-2/5'}>{'Number of transactions: '}</p>
								<p className={'inline text-base font-medium text-white text-opacity-90 w-3/5'}>{vaultInteractions?.numberOfTransactions || 1}</p>
							</div>
							<div className={'pt-1 flex flex-row items-center text-white'}>
								<p className={'inline text-sm text-white text-opacity-50 w-2/5'}>{'Total Gas Fees: '}</p>
								<div className={'inline w-3/5'}>
									<p className={'inline text-base font-medium text-white text-opacity-90 w-3/5'}>
										{`${formatValue(vaultInteractions?.totalGasUsed * tokenPrices[getSymbol(strategy.network)]?.price, baseCurrency)}`}
									</p>
									<p className={'inline text-sm text-white text-opacity-50'}>{` ${formatAmount(vaultInteractions?.totalGasUsed || 0, baseCurrency)}`}</p>
								</div>
							</div>
							<div className={'pt-1 flex flex-row items-center'}>
								<p className={'inline text-sm text-white text-opacity-50 w-2/5'}>{'Number of Interactors: '}</p>
								<p className={'inline text-base font-medium text-white text-opacity-90 w-3/5'}>{vaultInteractions?.numberOfInteractors || 0}</p>
							</div>
						</section>
					
					</div>
				</div>
				<div className={'border-l border-solid border-white border-opacity-10 w-full relative row-span-1 col-span-full h-36 lg:col-span-2 lg:h-auto'}>
					<div className={'absolute bottom-0 right-0 left-0 h-36 lg:h-96'}>
						{data ? <Line
							className={'w-full'}
							data={data}
							options={optionsLineChart}
							height={144} /> : null}
					</div>
				</div>
			</div>

			<div className={'w-full rounded-lg shadow bg-dark-600 px-6 pb-6 relative overflow-hidden divide-y divide-dark-900'}>
				{(vaultInteractions?.transactionsList || []).filter((_,i) => i >= txIndex && i <= txIndex + 20).map((tx, i) => {
					const actionType = findSignatureTitle(tx.input.slice(0, 10));

					return (
						<a
							as={'dl'}
							href={`https://${getExplorer(strategy?.network).explorer}/tx/${tx.hash}`}
							target={'_blank'}
							rel={'noreferrer'}
							key={`${tx.hash}_${txIndex + i}`}
							className={'relative bg-dark-600 p-6 flex flex-row items-center hover:bg-dark-900 hover:bg-opacity-40 cursor-pointer'}>
							<dt>
								{actionType === 'MANAGEMENT' ? <div className={'bg-blue-200 rounded-full p-3 w-12 h-12 flex items-center justify-center'}>
									<ShieldCheckIcon className={'h-6 w-6 text-blue-600'} />
								</div> : null}
								{actionType === 'DEPOSIT' ? <div className={'bg-teal-200 rounded-full p-3 w-12 h-12 flex items-center justify-center'}>
									<DownloadIcon className={'h-6 w-6 text-teal-600'} />
								</div> : null}
								{actionType === 'WITHDRAW' ? <div className={'bg-pink-200 rounded-full p-3 w-12 h-12 flex items-center justify-center'}>
									<UploadIcon className={'h-6 w-6 text-pink-600'} />
								</div> : null}
								{actionType === 'APPROVE' ? <div className={'bg-purple-200 rounded-full p-3 w-12 h-12 flex items-center justify-center'}>
									<CheckIcon className={'h-6 w-6 text-purple-600'} />
								</div> : null}
							</dt>
							<dd className={'ml-16 flex items-baseline flex-col'}>
								<div className={'grid gap-6 \
									lg:grid lg:gap-6 lg:grid-flow-col lg:grid-cols-12 lg:grid-rows-none \
									md:flex md:flex-row md:flex-wrap md:items-baseline md:w-full md:gap-0 \
									sm:grid-flow-row sm:grid-rows-4 sm:grid-cols-1'}>
									<div className={'flex flex-col lg:col-span-1 md:mr-12 lg:mr-0 sm:row-span-1'}>
										<p className={'flex items-center text-xs text-gray-400'}>{'Date'}</p>
										<p className={'flex items-center text-sm text-white'} style={{lineBreak: 'anywhere'}}>
											{formatDate(tx.timeStamp * 1000, baseCurrency)}
										</p>
									</div>
									<div className={'flex flex-col lg:col-span-4 lg:flex md:hidden sm:row-span-1'}>
										<p className={'flex items-center text-xs text-gray-400'}>{'From'}</p>
										<p
											href={`https://${getExplorer(strategy?.network).explorer}/address/${tx.from}`}
											target={'_blank'}
											rel={'noreferrer'}
											className={'flex items-center text-sm text-white hover:text-accent-900 cursor-pointer hover:underline'} style={{lineBreak: 'anywhere'}}>
											{tx.from}
										</p>
									</div>
									<div className={'flex flex-col lg:col-span-4 lg:flex md:hidden sm:row-span-1'}>
										<p className={'flex items-center text-xs text-gray-400'}>{'To'}</p>
										<p
											href={`https://${getExplorer(strategy?.network).explorer}/address/${tx.to}`}
											target={'_blank'}
											rel={'noreferrer'}
											className={'flex items-center text-sm text-white hover:text-accent-900 cursor-pointer hover:underline'} style={{lineBreak: 'anywhere'}}>
											{tx.to}
										</p>
									</div>
									{actionType === 'MANAGEMENT' || actionType === 'APPROVE' ? <div className={'flex flex-col lg:col-span-2 md:mr-12 lg:mr-0 sm:row-span-1'}>
										<p className={'flex items-center text-xs text-gray-400'}>{'Action'}</p>
										<p className={'flex items-center text-sm text-white'}>
											{getSignatureTitle(tx.input.slice(0, 10))}
										</p>
									</div> : <div className={'flex flex-col lg:col-span-2 md:mr-12 lg:mr-0 sm:row-span-1'}>
										<p className={'flex items-center text-xs text-gray-400'}>{'Amount'}</p>
										<p className={'flex items-center text-sm text-white'}>
											{`${formatAmount(Number(ethers.utils.formatUnits(tx.value, tx.tokenDecimal)), baseCurrency)} ${tx.tokenSymbol}`}
										</p>
									</div>}
									<div className={'flex flex-col lg:col-span-1 md:mr-12 lg:mr-0 sm:row-span-1'}>
										<p className={'flex items-center text-xs text-gray-400'}>{'Fees'}</p>
										<p className={'flex items-center text-sm text-white'}>
											{formatAmount(Number(ethers.utils.formatUnits(bigNumber.from(tx.gasUsed).mul(tx.gasPrice), 18)), baseCurrency)}
										</p>
									</div>

									<div className={'flex-col hidden lg:hidden md:flex md:w-1/2 md:mt-6 md:pr-2 lg:w-auto lg:m-0'}>
										<p className={'flex items-center text-xs text-gray-400'}>{'From'}</p>
										<p className={'flex items-center text-sm text-white'} style={{lineBreak: 'anywhere'}}>
											{tx.from}
										</p>
									</div>
									<div className={'flex-col hidden lg:hidden md:flex md:w-1/2 md:mt-6 md:pl-2 lg:w-auto lg:m-0'}>
										<p className={'flex items-center text-xs text-gray-400'}>{'To'}</p>
										<p className={'flex items-center text-sm text-white'} style={{lineBreak: 'anywhere'}}>
											{tx.to}
										</p>
									</div>

								</div>
							</dd>
						</a>
					);
				})}
				<div className={'flex flex-row justify-end items-end pt-6'}>
					<ChevronLeftIcon
						onClick={() => set_txIndex(txIndex > 20 ? txIndex - 20 : 0)}
						className={'h-6 w-6 text-white text-opacity-50 hover:text-opacity-100 transition-opacity cursor-pointer'} />
					<ChevronRightIcon
						onClick={() => set_txIndex(txIndex + 20)}
						className={'h-6 w-6 text-white text-opacity-50 hover:text-opacity-100 transition-opacity cursor-pointer'} />
				</div>
			</div>
		</>
	);
}

function	Index({strategy}) {
	return (
		<div>
			<div className={'w-full space-y-6 mt-12 max-w-screen-2xl mx-auto flex flex-col'}>
				<Link passHref href={'/app'}>
					<div className={'flex flex-row items-center -mt-4 mb-4 text-gray-400 cursor-pointer space-x-2 hover:text-accent-900 hover:underline transition-colors'}>
						<svg xmlns={'http://www.w3.org/2000/svg'} className={'h-4 w-4'} fill={'none'} viewBox={'0 0 24 24'} stroke={'currentColor'}><path strokeLinecap={'round'} strokeLinejoin={'round'} strokeWidth={2} d={'M15 19l-7-7 7-7'} /></svg>
						<p className={'text-base font-medium'}>
							{'Back to your farm'}
						</p>
					</div>
				</Link>
			</div>

			<div className={'w-full space-y-6 mt-4 max-w-screen-2xl mx-auto flex flex-col'}>
				{strategy ? <StrategyCard strategy={strategy} /> : null}
			</div>

		</div>
	);
}

export async function getStaticPaths() {
	const	slug = Object.values(STRATEGIES).map((strat) => ({params: {slug: strat?.parameters?.slug}})) || []

	return	{paths: slug, fallback: false}
}

export async function getStaticProps({params}) {
	const	strategy = Object.values(STRATEGIES).find(e => e.parameters?.slug === params.slug);

	return {props: {strategy: {
		parameters: strategy.parameters,
		network: strategy.network,
		list: strategy.list,
	}}}
}


export default Index;
