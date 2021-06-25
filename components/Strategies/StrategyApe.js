/******************************************************************************
**	@Author:				Thomas Bouder <Tbouder>
**	@Email:					Tbouder@protonmail.com
**	@Date:					Friday April 23rd 2021
**	@Filename:				StrategyYVBoost.js
******************************************************************************/

import	React, {useState, useEffect, useCallback}	from	'react';
import	useCurrencies								from	'contexts/useCurrencies';
import	useStrategies								from	'contexts/useStrategies';
import	{toAddress, bigNumber}						from	'utils';
import	{ethers}									from	'ethers';
import	SectionRemove								from	'components/StrategyCard/SectionRemove'
import	SectionHead									from	'components/StrategyCard/SectionHead'
import	SectionFoot									from	'components/StrategyCard/SectionFoot'
import	Group, {GroupElement}						from	'components/StrategyCard/Group'
import	* as api									from	'utils/API';
import	methods										from	'utils/methodsSignatures';
import	{getProvider, getSymbol}					from	'utils/chains';

async function	DetectStrategyApe(parameters, address, network, normalTx = undefined) {
	if (!normalTx)
		normalTx = await api.retreiveTxFrom(network, address);

	async function	detectTx() {
		const	hasSomeTx = (
			normalTx
				.some(tx => (
					(
						toAddress(tx.from) === toAddress(address) &&
						toAddress(tx.to) === toAddress(parameters.contractAddress) &&
					(
						tx.input.startsWith(methods.YV_DEPOSIT) ||
						tx.input.startsWith(methods.YV_DEPOSIT_VOWID)
					)
					)
				||
				(
					toAddress(tx.from) === toAddress(address) &&
					toAddress(tx.to) === toAddress(parameters.contractAddress) &&
					tx.input.startsWith(methods.YV_WITHDRAW)
				)
				))
		);
		return (hasSomeTx);
	}

	const	hasSomeTx = await detectTx();

	return hasSomeTx;
}

async function	PrepareStrategyApe(parameters, address, network, normalTx = undefined, erc20Tx = undefined) {
	let		timestamp = undefined;
	if (!normalTx)
		normalTx = await api.retreiveTxFrom(network, address);
	if (!erc20Tx)
		erc20Tx = await api.retreiveErc20TxFrom(network, address);

	async function	computeFees() {
		const	cumulativeFees = (
			normalTx
				.filter(tx => (
					(
						toAddress(tx.from) === toAddress(address) &&
						toAddress(tx.to) === toAddress(parameters.contractAddress) &&
						(
							tx.input.startsWith(methods.YV_DEPOSIT) ||
							tx.input.startsWith(methods.YV_DEPOSIT_VOWID)
						)
					)
				||
				(
					toAddress(tx.from) === toAddress(address) &&
					toAddress(tx.to) === toAddress(parameters.contractAddress) &&
					tx.input.startsWith(methods.YV_WITHDRAW)
				)
				||
				(
					toAddress(tx.from) === toAddress(address) &&
					toAddress(tx.to) === toAddress(parameters.contractAddress) &&
					tx.input.startsWith(methods.YV_TRANSFER)
				)
				||
				(
					tx.input.startsWith(methods.STANDARD_APPROVE) &&
					(tx.input.toLowerCase()).includes((parameters.contractAddress.slice(2)).toLowerCase())
				)
				)).reduce((accumulator, tx) => {
					const	gasUsed = bigNumber.from(tx.gasUsed);
					const	gasPrice = bigNumber.from(tx.gasPrice);
					const	gasUsedPrice = gasUsed.mul(gasPrice);
					return bigNumber.from(accumulator).add(gasUsedPrice);
				}, bigNumber.from(0))
		);
		return (Number(ethers.utils.formatUnits(cumulativeFees, 18)));
	}

	async function	computeSeeds() {
		const	cumulativeSeeds = (
			erc20Tx
				.filter(tx => (
					(
						(toAddress(tx.to) === toAddress(parameters.contractAddress))
						&&
						(tx.tokenSymbol === parameters.underlyingTokenSymbol)
					)
				)
				).reduce((accumulator, tx) => {
					if (timestamp === undefined || timestamp > tx.timeStamp) {
						timestamp = tx.timeStamp;
					}
					return bigNumber.from(accumulator).add(tx.value);
				}, bigNumber.from(0))
		);
		return Number(ethers.utils.formatUnits(cumulativeSeeds, parameters.underlyingTokenDecimal || 18));
	}

	async function	computeCrops() {
		const	provider = getProvider(network);
		const	ABI = ['function balanceOf(address) external view returns (uint256)']
		const	smartContract = new ethers.Contract(parameters.contractAddress, ABI, provider)
		const	balanceOf = await smartContract.balanceOf(address);
		return (Number(ethers.utils.formatUnits(balanceOf, parameters.underlyingTokenDecimal || 18)));
	}

	//SHOULD HANDLE TX OUT OF TOKEN
	async function	computeHarvest() {
		const	cumulativeHarvest = (
			erc20Tx
				.filter(tx => (
					(toAddress(tx.from) === toAddress(parameters.contractAddress)) && (toAddress(tx.to) === toAddress(address))
				&&
				(tx.tokenSymbol === parameters.underlyingTokenSymbol)
				)).reduce((accumulator, tx) => {
					return bigNumber.from(accumulator).add(tx.value);
				}, bigNumber.from(0))
		);
		return Number(ethers.utils.formatUnits(cumulativeHarvest, parameters.underlyingTokenDecimal || 18));
	}


	const	fees = await computeFees();
	const	initialCrops = await computeCrops();
	const	initialSeeds = await computeSeeds();
	const	harvest = await computeHarvest();

	return {
		status: initialCrops === 0 ? 'KO' : 'OK',
		fees,
		initialSeeds,
		initialCrops,
		harvest,
		timestamp,
	}
}

function	StrategyApeV1({parameters, network, address, uuid, fees, initialSeeds, initialCrops, harvest, date}) {
	const	{strategies} = useStrategies();
	const	{tokenPrices, currencyNonce} = useCurrencies();
	const	[isHarvested, set_isHarvested] = useState(false);
	const	[APY, set_APY] = useState(0);
	const	[result, set_result] = useState(0);
	const	[crops, set_crops] = useState(initialCrops);
	const	[underlyingEarned, set_underlyingEarned] = useState(0);
	const	[totalFees] = useState(fees);
	const	[symbolToBaseCurrency, set_symbolToBaseCurrency] = useState(tokenPrices[getSymbol(network)]?.price || 0);
	const	[underlyingToBaseCurrency, set_underlyingToBaseCurrency] = useState(tokenPrices[parameters.underlyingTokenCgID]?.price || 0);
		
	const retrieveShareValue = useCallback(async () => {
		const	provider = getProvider(network);
		const	ABI = ['function pricePerShare() external view returns (uint256)']
		const	smartContract = new ethers.Contract(parameters.contractAddress, ABI, provider)
		const	pricePerShare = await smartContract.pricePerShare();
		const	share = initialCrops * (pricePerShare / (10**(parameters.underlyingTokenDecimal || 18)))
		set_underlyingEarned(share)
		strategies.set(uuid, 'lastSharesValue', share, true);
	}, [network, parameters.contractAddress, parameters.underlyingTokenDecimal, initialCrops, strategies, uuid]);

	const retrieveShares = useCallback(async () => {
		const	provider = getProvider(network);
		const	ABI = ['function balanceOf(address) external view returns (uint256)']
		const	smartContract = new ethers.Contract(parameters.contractAddress, ABI, provider)
		const	balanceOf = await smartContract.balanceOf(address);
		if (balanceOf.isZero()) {
			set_isHarvested(true);
			set_crops(0);
			strategies.set(uuid, 'isHarvested', true, true);
			return;
		}
		set_crops(Number(ethers.utils.formatUnits(balanceOf, parameters.underlyingTokenDecimal || 18)));
	}, [network, parameters.contractAddress, parameters.underlyingTokenDecimal, address, strategies, uuid]);

	useEffect(() => {
		set_symbolToBaseCurrency(tokenPrices[getSymbol(network)]?.price || 0);
		set_underlyingToBaseCurrency(tokenPrices[parameters.underlyingTokenCgID]?.price || 0);
		retrieveShares();
		retrieveShareValue();
	}, [currencyNonce, network, parameters.underlyingTokenCgID, retrieveShareValue, retrieveShares, tokenPrices]);

	useEffect(() => {
		let _result = 0;
		if (isHarvested) {
			_result = (((harvest - (initialSeeds)) * underlyingToBaseCurrency) - (totalFees * symbolToBaseCurrency));
		} else {
			_result = (
				((underlyingEarned - (initialSeeds - harvest)) * underlyingToBaseCurrency) -
				(totalFees * symbolToBaseCurrency)
			);
		}
		set_result(_result);
	}, [symbolToBaseCurrency, underlyingToBaseCurrency, underlyingEarned, totalFees, harvest, initialCrops, initialSeeds, isHarvested])

	useEffect(() => {
		if (isHarvested) {
			const	vi = (initialSeeds) * underlyingToBaseCurrency;
			const	vf = result + vi;
			set_APY((vf - vi) / vi * 100);
		} else {
			const	vi = (initialSeeds - harvest) * underlyingToBaseCurrency;
			const	vf = result + vi;
			set_APY((vf - vi) / vi * 100);
		}
	}, [symbolToBaseCurrency, initialSeeds, result, underlyingToBaseCurrency, harvest, isHarvested])

	return (
		<div className={'flex flex-col col-span-1 rounded-lg shadow bg-dark-600 p-6 relative overflow-hidden'}>
			<SectionRemove uuid={uuid} />
			<SectionHead
				network={network}
				parameters={parameters}
				address={address}
				date={date}
				APY={APY} />
			
			<div className={'space-y-8'}>
				<Group title={'Seeds'}>
					<GroupElement
						network={network}
						image={parameters.underlyingTokenIcon}
						label={parameters.underlyingTokenSymbol}
						address={parameters.underlyingTokenAddress}
						amount={parseFloat(initialSeeds).toFixed(10)}
						value={(initialSeeds * underlyingToBaseCurrency).toFixed(2)} />
				</Group>

				<Group title={'Crops'}>
					<GroupElement
						network={network}
						image={'/tokens/yGeneric.svg'}
						label={`yv${parameters.underlyingTokenSymbol}`}
						address={parameters.contractAddress}
						amount={parseFloat(crops.toFixed(10))}
						value={(crops * underlyingToBaseCurrency).toFixed(2)} />
				</Group>

				{isHarvested ?
					<>
						<Group title={'Harvest'}>
							<GroupElement
								network={network}
								image={parameters.underlyingTokenIcon}
								label={parameters.underlyingTokenSymbol}
								address={parameters.underlyingTokenAddress}
								amount={parseFloat(harvest.toFixed(10))}
								value={(harvest * underlyingToBaseCurrency).toFixed(2)} />
							<GroupElement
								network={network}
								image={'⛽️'}
								label={'Fees'}
								amount={parseFloat(totalFees.toFixed(10))}
								value={-(totalFees * symbolToBaseCurrency).toFixed(2)} />
						</Group>
					</>
					: 
					<Group title={'Yield'}>
						<GroupElement
							network={network}
							image={'/tokens/yGeneric.svg'}
							label={`yv${parameters.underlyingTokenSymbol}`}
							address={parameters.contractAddress}
							amount={parseFloat((underlyingEarned - (initialSeeds - harvest)).toFixed(10))}
							value={((underlyingEarned - (initialSeeds - harvest)) * underlyingToBaseCurrency).toFixed(2)} />
						<GroupElement
							network={network}
							image={'⛽️'}
							label={'Fees'}
							amount={parseFloat(totalFees.toFixed(10))}
							value={-(totalFees * symbolToBaseCurrency).toFixed(2)} />
					</Group>
				}
			</div>

			<SectionFoot result={result} />
		</div>
	)
}

function	StrategyApe({parameters, network, address, uuid, fees, initialSeeds, initialCrops, harvest, date}) {
	const	{strategies} = useStrategies();
	const	{tokenPrices, currencyNonce} = useCurrencies();
	const	[isHarvested, set_isHarvested] = useState(false);
	const	[APY, set_APY] = useState(0);
	const	[result, set_result] = useState(0);
	const	[totalFees] = useState(fees);
	const	[symbolToBaseCurrency, set_symbolToBaseCurrency] = useState(tokenPrices[getSymbol(network)]?.price || 0);
	const	[underlyingToBaseCurrency, set_underlyingToBaseCurrency] = useState(tokenPrices[parameters.underlyingTokenCgID]?.price || 0);

	//Number of share in the vault
	const	[shares, set_shares] = useState(initialCrops);
	//Values of the shares in the vault (shareValue - shares)
	const	[underlyingEarned, set_underlyingEarned] = useState(0);

	const prepareData = useCallback(async () => {
		/**********************************************************************
		**	Retrieving the base prices
		**********************************************************************/
		const	_symbolToBaseCurrency = tokenPrices[getSymbol(network)]?.price || 0;
		const	_underlyingToBaseCurrency = tokenPrices[parameters.underlyingTokenCgID]?.price || 0;
		set_symbolToBaseCurrency(_symbolToBaseCurrency);
		set_underlyingToBaseCurrency(_underlyingToBaseCurrency);

		/**********************************************************************
		**	Querying the smartContract to know if the strategy is still in use
		**********************************************************************/
		const	provider = getProvider(network);
		const	ABI = [
			'function pricePerShare() external view returns (uint256)',
			'function balanceOf(address) external view returns (uint256)'
		]
		const	vault = new ethers.Contract(parameters.contractAddress, ABI, provider)
		const	balanceOf = await vault.balanceOf(address);
		if (balanceOf.isZero()) {
			set_isHarvested(true);
			set_shares(0);
			strategies.set(uuid, 'isHarvested', true, true);
			return;
		}

		/**********************************************************************
		**	Retrieving the shares & sharevalues
		**********************************************************************/
		const	pricePerShare = await vault.pricePerShare();
		const	_pricePerShare = Number(ethers.utils.formatUnits(pricePerShare, parameters.underlyingTokenDecimal || 18));
		const	_shares = Number(ethers.utils.formatUnits(balanceOf, parameters.underlyingTokenDecimal || 18));
		const	_underlyingEarned = _shares * _pricePerShare;
		set_shares(_shares);
		set_underlyingEarned(_underlyingEarned);

		strategies.set(uuid, 'lastShares', _shares, true);
		strategies.set(uuid, 'lastSharesValue', _underlyingEarned * _underlyingToBaseCurrency, true);

		/**********************************************************************
		**	Computing the result
		**********************************************************************/
		const	_initialSeedValue = (initialSeeds * _underlyingToBaseCurrency);
		const	_harvestValue = (harvest * _underlyingToBaseCurrency);
		const	_underlyingEarnedValue = (_underlyingEarned * _underlyingToBaseCurrency);
		const	_gasValue = (totalFees * _symbolToBaseCurrency);
		const	_result = (_harvestValue + _underlyingEarnedValue) - (_initialSeedValue + _gasValue);
		set_result(_result);
		strategies.set(uuid, 'lastResult', _result, true);
		strategies.set(uuid, 'lastGasValue', _gasValue, true);
		strategies.set(uuid, 'lastHarvestValue', _harvestValue, true);

		/**********************************************************************
		**	Computing the APY
		**********************************************************************/
		set_APY(((_harvestValue + _underlyingEarnedValue) - _initialSeedValue) / _initialSeedValue * 100);


	}, [tokenPrices, network, parameters.underlyingTokenCgID, parameters.contractAddress, parameters.underlyingTokenDecimal, address, strategies, uuid, initialSeeds, harvest, totalFees]);


	useEffect(() => {
		prepareData()
	}, [currencyNonce, prepareData])

	return (
		<div className={'flex flex-col col-span-1 rounded-lg shadow bg-dark-600 p-6 relative overflow-hidden'}>
			<SectionRemove uuid={uuid} />
			<SectionHead
				network={network}
				parameters={parameters}
				address={address}
				date={date}
				APY={APY} />
			
			<div className={'space-y-8'}>
				<Group title={'Seeds'}>
					<GroupElement
						network={network}
						image={parameters.underlyingTokenIcon}
						label={parameters.underlyingTokenSymbol}
						address={parameters.underlyingTokenAddress}
						amount={parseFloat(initialSeeds).toFixed(10)}
						value={(initialSeeds * underlyingToBaseCurrency).toFixed(2)} />
				</Group>

				<Group title={'Crops'}>
					<GroupElement
						network={network}
						image={'/tokens/yGeneric.svg'}
						label={`yv${parameters.underlyingTokenSymbol}`}
						address={parameters.contractAddress}
						amount={parseFloat(shares.toFixed(10))}
						value={(shares * underlyingToBaseCurrency).toFixed(2)} />
				</Group>

				{isHarvested ?
					<>
						<Group title={'Harvest'}>
							<GroupElement
								network={network}
								image={parameters.underlyingTokenIcon}
								label={parameters.underlyingTokenSymbol}
								address={parameters.underlyingTokenAddress}
								amount={parseFloat(harvest.toFixed(10))}
								value={(harvest * underlyingToBaseCurrency).toFixed(2)} />
							<GroupElement
								network={network}
								image={'⛽️'}
								label={'Fees'}
								amount={parseFloat(totalFees.toFixed(10))}
								value={-(totalFees * symbolToBaseCurrency).toFixed(2)} />
						</Group>
					</>
					: 
					<Group title={'Yield'}>
						<GroupElement
							network={network}
							image={'/tokens/yGeneric.svg'}
							label={`yv${parameters.underlyingTokenSymbol}`}
							address={parameters.contractAddress}
							amount={parseFloat((underlyingEarned - shares).toFixed(10))}
							value={((underlyingEarned - shares) * underlyingToBaseCurrency).toFixed(2)} />
						{harvest.toFixed(10) > 0 ? <GroupElement
							network={network}
							image={parameters.underlyingTokenIcon}
							label={`Harvested ${parameters.underlyingTokenSymbol}`}
							address={parameters.underlyingTokenAddress}
							amount={parseFloat(harvest.toFixed(10))}
							value={(harvest * underlyingToBaseCurrency).toFixed(2)} /> : null}
						<GroupElement
							network={network}
							image={'⛽️'}
							label={'Fees'}
							amount={parseFloat(totalFees.toFixed(10))}
							value={-(totalFees * symbolToBaseCurrency).toFixed(2)} />
					</Group>
				}
			</div>

			<SectionFoot result={result} />
		</div>
	)
}

export {PrepareStrategyApe, DetectStrategyApe};
export default StrategyApe;