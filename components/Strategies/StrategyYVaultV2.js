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
import	{analyzeZapIn, analyzeZapOut}				from	'utils/txHelpers';

async function	DetectStrategyYVaultV2(parameters, address, network, normalTx = undefined) {
	if (!normalTx)
		normalTx = await api.retreiveTxFrom(network, address);

	async function	detectTx() {
		const	hasSomeTx = (
			normalTx
				.some(tx => (
					(
						toAddress(tx.from) === toAddress(address) &&
						toAddress(tx.to) === toAddress(parameters.contractAddress) &&
						methods.DEPOSITS.includes(tx.input.slice(0, 10))
					)
				||
				(
					toAddress(tx.from) === toAddress(address) &&
					toAddress(tx.to) === toAddress(parameters.contractAddress) &&
						methods.WITHDRAWS.includes(tx.input.slice(0, 10))
				)
				))
		);
		return (hasSomeTx);
	}

	const	hasSomeTx = await detectTx();

	return hasSomeTx;
}

async function	PrepareStrategyYVaultV2(parameters, address, network, normalTx = undefined, erc20Tx = undefined) {
	let		fees;
	let		initialCrops;
	let		initialSeeds;
	let		harvest;
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
						methods.DEPOSITS.includes(tx.input.slice(0, 10))
					) || (
						toAddress(tx.from) === toAddress(address) &&
						toAddress(tx.to) === toAddress(parameters.contractAddress) &&
						methods.WITHDRAWS.includes(tx.input.slice(0, 10))
					) || (
						toAddress(tx.from) === toAddress(address) &&
						toAddress(tx.to) === toAddress(parameters.contractAddress) &&
						methods.TRANSFERS.includes(tx.input.slice(0, 10))
					) || (
						methods.APPROVES.includes(tx.input.slice(0, 10)) &&
						(tx.input.toLowerCase()).includes((parameters.contractAddress.slice(2)).toLowerCase())
					) || (
						methods.ZAP_INS.includes(tx.input.slice(0, 10)) &&
						(tx.input.toLowerCase()).includes((parameters.contractAddress.slice(2)).toLowerCase())
					) || (
						methods.ZAP_OUTS.includes(tx.input.slice(0, 10)) &&
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
						(toAddress(tx.to) === toAddress(parameters.contractAddress)) &&
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
					(toAddress(tx.from) === toAddress(parameters.contractAddress)) && (toAddress(tx.to) === toAddress(address)) &&
					(tx.tokenSymbol === parameters.underlyingTokenSymbol)
				)).reduce((accumulator, tx) => {
					return bigNumber.from(accumulator).add(tx.value);
				}, bigNumber.from(0))
		);
		return Number(ethers.utils.formatUnits(cumulativeHarvest, parameters.underlyingTokenDecimal || 18));
	}

	async function	computeZapIn() {
		const	filtered = normalTx.filter(tx => (
			methods.ZAP_INS.includes(tx.input.slice(0, 10)) &&
			(tx.input.toLowerCase()).includes((parameters.contractAddress.slice(2)).toLowerCase())
		))
		await Promise.all(filtered.map(async (tx) => {
			if (timestamp === undefined || timestamp > tx.timeStamp) {
				timestamp = tx.timeStamp;
			}
			const	{dataIn, dataOut} = await analyzeZapIn(address, toAddress(tx.to), toAddress(parameters.contractAddress), tx.hash, network);
			if (dataIn && dataIn?.valueRaw) {
				initialSeeds += Number(ethers.utils.formatUnits(bigNumber.from(dataIn?.valueRaw), dataIn?.decimals || 18));
				// console.log({dataIn: Number(ethers.utils.formatUnits(bigNumber.from(dataIn?.valueRaw), dataIn?.decimals || 18))})
			}
			if (dataOut && dataOut?.valueRaw) {
				// initialSeeds += Number(Number(ethers.utils.formatUnits(bigNumber.from(dataOut?.valueRaw), dataOut?.decimals || 18)));
				// console.log({dataOut: Number(ethers.utils.formatUnits(bigNumber.from(dataOut?.valueRaw), dataOut?.decimals || 18))})
			}
		}));
	}
	async function	computeZapOut() {
		const	filtered = normalTx.filter(tx => (
			methods.ZAP_OUTS.includes(tx.input.slice(0, 10)) &&
			(tx.input.toLowerCase()).includes((parameters.contractAddress.slice(2)).toLowerCase())
		))
		await Promise.all(filtered.map(async (tx) => {
			if (timestamp === undefined || timestamp > tx.timeStamp) {
				timestamp = tx.timeStamp;
			}
			const	{dataIn, dataOut} = await analyzeZapOut(address, toAddress(tx.to), toAddress(parameters.contractAddress), tx.hash, network);
			if (dataIn && dataIn?.valueRaw) {
				// initialSeeds -= Number(ethers.utils.formatUnits(bigNumber.from(dataIn?.valueRaw), dataIn?.decimals || 18));
				// console.log({dataIn: Number(ethers.utils.formatUnits(bigNumber.from(dataIn?.valueRaw), dataIn?.decimals || 18))})
			}
			if (dataOut && dataOut?.valueRaw) {
				// initialSeeds -= Number(ethers.utils.formatUnits(bigNumber.from(dataOut?.valueRaw), dataOut?.decimals || 18));
				harvest += Number(ethers.utils.formatUnits(bigNumber.from(dataOut?.valueRaw), dataOut?.decimals || 18));
				// console.log({dataOut: Number(ethers.utils.formatUnits(bigNumber.from(dataOut?.valueRaw), dataOut?.decimals || 18))})
			}
		}));
	}


	fees = await computeFees();
	initialCrops = await computeCrops();
	initialSeeds = await computeSeeds();
	harvest = await computeHarvest();


	await computeZapIn()
	await computeZapOut()

	return {
		status: initialCrops === 0 ? 'KO' : 'OK',
		fees,
		initialSeeds,
		initialCrops,
		harvest,
		timestamp,
	}
}

function	StrategyYVaultV2({parameters, network, address, uuid, fees, initialSeeds, initialCrops, harvest, date}) {
	const	{strategies} = useStrategies();
	const	{tokenPrices, currencyNonce} = useCurrencies();
	const	[isHarvested, set_isHarvested] = useState(false);
	const	[APY, set_APY] = useState(0);
	const	[result, set_result] = useState(0);
	const	[totalFees] = useState(fees);
	const	[cropsYielded, set_cropsYielded] = useState(1);
	const	[symbolToBaseCurrency, set_symbolToBaseCurrency] = useState(tokenPrices[getSymbol(network)]?.price || 0);
	const	[underlyingToBaseCurrency, set_underlyingToBaseCurrency] = useState(0);
	const	[shares, set_shares] = useState(initialCrops); //Number of share in the vault
	const	[underlyingEarned, set_underlyingEarned] = useState(0); //Values of the shares in the vault (shareValue - shares)

	const computeCRVPrice = useCallback(async () => {
		if (parameters.isCRV) {
			const	provider = getProvider(network);
			const	crvMinter = parameters.crv.minter;
			const	crvPoolContract = new ethers.Contract(crvMinter, ['function get_virtual_price() public view returns (uint256)'], provider);
			const	virtualPrice = await crvPoolContract.get_virtual_price();
			const	crvTokenValue = bigNumber.from(ethers.constants.WeiPerEther).mul(virtualPrice).div(bigNumber.from(10).pow(18));
			const	underlying = tokenPrices[parameters.underlyingTokenCgID]?.price || 0;
			set_underlyingToBaseCurrency(underlying * ethers.utils.formatUnits(crvTokenValue, 18));
		} else {
			set_underlyingToBaseCurrency(tokenPrices[parameters.underlyingTokenCgID]?.price || 0);
		}
	}, [network, parameters.isCRV, parameters.underlyingTokenCgID, tokenPrices]);

	const prepareData = useCallback(async () => {
		if (underlyingToBaseCurrency === 0) {
			return;
		}
		/**********************************************************************
		**	Retrieving the base prices
		**********************************************************************/
		const	_symbolToBaseCurrency = tokenPrices[getSymbol(network)]?.price || 0;
		set_symbolToBaseCurrency(_symbolToBaseCurrency);

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
		const	_cropsYielded = _shares - (initialSeeds / _pricePerShare);
		set_shares(_shares);
		set_underlyingEarned(_underlyingEarned);
		set_cropsYielded(_cropsYielded);

		/**********************************************************************
		**	Computing the result
		**********************************************************************/
		const	_initialSeedValue = initialSeeds * underlyingToBaseCurrency;
		const	_harvestValue = harvest * underlyingToBaseCurrency;
		const	_gasValue = totalFees * _symbolToBaseCurrency;
		const	_yieldValue = _cropsYielded * underlyingToBaseCurrency;
		const	_result = (_harvestValue + _yieldValue) - (_gasValue);
		set_result(_result);
		set_APY((_harvestValue + _yieldValue) / _initialSeedValue * 100);

		strategies.set(uuid, 'lastShares', _shares, true);
		strategies.set(uuid, 'lastSharesValue', _underlyingEarned * underlyingToBaseCurrency, true);
		strategies.set(uuid, 'lastResult', _result, true);
		strategies.set(uuid, 'lastGasValue', _gasValue, true);
		strategies.set(uuid, 'lastHarvestValue', _harvestValue, true);
	}, [tokenPrices, network, parameters.contractAddress, parameters.underlyingTokenDecimal, address, strategies, uuid, initialSeeds, harvest, totalFees, underlyingToBaseCurrency]);


	useEffect(() => {
		computeCRVPrice();
		prepareData();
	}, [computeCRVPrice, currencyNonce, prepareData])

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
						image={parameters.tokenIcon || '/tokens/yGeneric.svg'}
						label={`yv${parameters.underlyingTokenSymbol}`}
						address={parameters.contractAddress}
						amount={parseFloat(shares?.toFixed(10) || 0)}
						value={(underlyingEarned * underlyingToBaseCurrency).toFixed(2)} />
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
							image={parameters.tokenIcon || '/tokens/yGeneric.svg'}
							label={`yv${parameters.underlyingTokenSymbol}`}
							address={parameters.contractAddress}
							amount={cropsYielded.toFixed(10)}
							value={cropsYielded * underlyingToBaseCurrency.toFixed(2)} />
						{(typeof(harvest) === 'string' || typeof(harvest) === 'number') && (harvest?.toFixed(10) || 0) > 0 ? <GroupElement
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
							amount={parseFloat(totalFees?.toFixed(10) || 0)}
							value={-(totalFees * symbolToBaseCurrency).toFixed(2)} />
					</Group>
				}
			</div>

			<SectionFoot result={result} />
		</div>
	)
}

export {PrepareStrategyYVaultV2, DetectStrategyYVaultV2};
export default StrategyYVaultV2;