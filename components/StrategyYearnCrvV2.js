/******************************************************************************
**	@Author:				Thomas Bouder <Tbouder>
**	@Email:					Tbouder@protonmail.com
**	@Date:					Friday April 23rd 2021
**	@Filename:				StrategyYearnCrvV2.js
******************************************************************************/

import	React, {useState, useEffect, useCallback}		from	'react';
import	useCurrencies						from	'contexts/useCurrencies';
import	{toAddress, bigNumber, asyncFilter}	from	'utils';
import	{ethers}							from	'ethers';
import	SectionRemove						from	'components/Strategies/SectionRemove'
import	SectionHead							from	'components/Strategies/SectionHead'
import	SectionFoot							from	'components/Strategies/SectionFoot'
import	Group, {GroupElement}				from	'components/Strategies/Group'
import	* as api							from	'utils/API';
import	methods								from	'utils/methodsSignatures';
import	{analyzeZapIn}						from	'utils/txHelpers';

async function	PrepareStrategyYearnCrvV2(parameters, address, network) {
	let		timestamp = undefined;
	const	normalTx = await api.retreiveTxFrom(network, address);
	const	erc20Tx = await api.retreiveErc20TxFrom(network, address);

	/***************************************************************************
	** The seeds represent the initial investment. It could be the underlying
	** token you deposit, or just any token you zap in.
	** That's what you spend to get the yield.
	****************************************************************************/
	const	seeds = []

	/***************************************************************************
	** The crops represent the token/coin you got from your seeds. For example
	** with the Yean Dai Vault V1, your seeds are some DAI, and your crops are
	** some yDAI.
	****************************************************************************/
	const	crops = []

	/***************************************************************************
	** The harvest represent what you got at the end, once you exit the
	** strategy. It's all your crops + all your yields
	****************************************************************************/
	const	harvest = []

	async function	computeFees() {
		const	cumulativeFees = (
			normalTx
				.filter(tx => ((
					toAddress(tx.from) === toAddress(address) &&
					toAddress(tx.to) === toAddress(parameters.contractAddress) &&
					tx.input.startsWith(methods.YEARNV1_DEPOSIT)
				) || (
					toAddress(tx.from) === toAddress(address) &&
					toAddress(tx.to) === toAddress(parameters.contractAddress) &&
					tx.input.startsWith(methods.YEARNV1_WITHDRAW)
				) || (
					tx.input.startsWith(methods.STANDARD_APPROVE) &&
					(tx.input.toLowerCase()).includes((parameters.contractAddress.slice(2)).toLowerCase())
				) || (
					tx.input.startsWith(methods.ZAP_IN) &&
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
		const	filtered = await asyncFilter(erc20Tx, async (tx) => (
			toAddress(tx.to) === toAddress(parameters.contractAddress) &&
			tx.tokenSymbol === parameters.underlyingTokenSymbol
		));
		await Promise.all(filtered.map((tx) => {
			if (timestamp === undefined || timestamp > tx.timeStamp) {
				timestamp = tx.timeStamp;
			}
			const	newValue = bigNumber.from(tx?.value);
			const	oldValue = bigNumber.from(seeds[toAddress(tx.contractAddress)]?.valueRaw || 0);
			const	cumulativeValueRaw = newValue.add(oldValue);
			seeds[toAddress(tx.contractAddress)] = {
				name: tx?.tokenName,
				symbol: tx?.tokenSymbol,
				address: tx?.contractAddress,
				value: Number(ethers.utils.formatUnits(bigNumber.from(cumulativeValueRaw), tx?.tokenDecimal || 18)),
				valueRaw: bigNumber.from(cumulativeValueRaw).toString(),
				decimals: tx?.tokenDecimal,
			}
		}));
	}
	async function	computeZapIn() {
		const	filtered = normalTx.filter(tx => (
			tx.input.startsWith(methods.ZAP_IN) &&
			(tx.input.toLowerCase()).includes((parameters.contractAddress.slice(2)).toLowerCase())
		))
		await Promise.all(filtered.map(async (tx) => {
			if (timestamp === undefined || timestamp > tx.timeStamp) {
				timestamp = tx.timeStamp;
			}
			const	{dataIn, dataOut} = await analyzeZapIn(address, toAddress(tx.to), tx.hash, network);
			if (dataIn && dataIn?.valueRaw) {
				const	newValue = bigNumber.from(dataIn?.valueRaw);
				const	oldValue = bigNumber.from(seeds[toAddress(dataIn?.address)]?.valueRaw || 0);
				const	cumulativeValueRaw = newValue.add(oldValue);
				seeds[toAddress(dataIn?.address)] = {
					id: dataIn?.id,
					name: dataIn?.name,
					symbol: dataIn?.symbol,
					address: dataIn?.address,
					value: Number(ethers.utils.formatUnits(bigNumber.from(cumulativeValueRaw), dataIn?.decimals || 18)),
					valueRaw: bigNumber.from(cumulativeValueRaw).toString(),
					decimals: dataIn?.decimals,
				}
			}
			if (dataOut && dataOut?.valueRaw) {
				const	newValue = bigNumber.from(dataOut?.valueRaw);
				const	oldValue = bigNumber.from(crops[toAddress(dataOut?.address)]?.valueRaw || 0);
				const	cumulativeValueRawOut = newValue.add(oldValue);
				crops[toAddress(dataOut?.address)] = {
					id: dataOut?.id,
					name: dataOut?.name,
					symbol: dataOut?.symbol,
					address: dataOut?.address,
					value: Number(ethers.utils.formatUnits(bigNumber.from(cumulativeValueRawOut), dataOut?.decimals || 18)),
					valueRaw: bigNumber.from(cumulativeValueRawOut).toString(),
					decimals: dataOut?.decimals,
				}
			}
		}));
	}
	async function	computeCrops() {
		const	filtered = erc20Tx.filter(tx => (
			(toAddress(tx.from) === toAddress('0x0000000000000000000000000000000000000000')) &&
			(toAddress(tx.to) === toAddress(address)) &&
			(tx.tokenSymbol === parameters.tokenSymbol)
		))
		await Promise.all(filtered.map((tx) => {
			if (timestamp === undefined || timestamp > tx.timeStamp) {
				timestamp = tx.timeStamp;
			}
			const	newValue = bigNumber.from(tx?.value);
			const	oldValue = bigNumber.from(crops[toAddress(tx.contractAddress)]?.valueRaw || 0);
			const	cumulativeValueRaw = newValue.add(oldValue);
			crops[toAddress(tx.contractAddress)] = {
				name: tx?.tokenName,
				symbol: tx?.tokenSymbol,
				address: tx?.contractAddress,
				value: Number(ethers.utils.formatUnits(bigNumber.from(cumulativeValueRaw), tx?.tokenDecimal || 18)),
				valueRaw: bigNumber.from(cumulativeValueRaw).toString(),
				decimals: tx?.tokenDecimal,
			}
		}));
	}
	async function	computeHarvest() {
		const	filtered = erc20Tx.filter(tx => (
			(toAddress(tx.from) === toAddress(parameters.contractAddress)) &&
			(toAddress(tx.to) === toAddress(address)) &&
			(tx.tokenSymbol === parameters.underlyingTokenSymbol)
		))
		await Promise.all(filtered.map((tx) => {
			if (timestamp === undefined || timestamp > tx.timeStamp) {
				timestamp = tx.timeStamp;
			}
			const	newValue = bigNumber.from(tx?.value);
			const	oldValue = bigNumber.from(harvest[toAddress(tx.contractAddress)]?.valueRaw || 0);
			const	cumulativeValueRaw = newValue.add(oldValue);
			harvest[toAddress(tx.contractAddress)] = {
				name: tx?.tokenName,
				symbol: tx?.tokenSymbol,
				address: tx?.contractAddress,
				value: Number(ethers.utils.formatUnits(bigNumber.from(cumulativeValueRaw), tx?.tokenDecimal || 18)),
				valueRaw: bigNumber.from(cumulativeValueRaw).toString(),
				decimals: tx?.tokenDecimal,
			}
		}));
	}

	await computeSeeds();
	await computeZapIn();
	await computeCrops();
	await computeHarvest();

	return ({
		fees: await computeFees(),
		seeds: Object.values(seeds).map(e => e),
		crops: Object.values(crops).map(e => e),
		harvest: Object.values(harvest).map(e => e),
		timestamp,
	})
}

function	StrategyYearnCrvV2({parameters, network, address, uuid, fees, seeds, crops, harvest, date}) {
	const	{tokenPrices, crvPrices, currencyNonce} = useCurrencies();

	const	[preRenderStep, set_preRenderStep] = useState({
		seedPrice: false,
		harvest: false,
		prices: false,
		result: false,
	})
	const	[cumulativeSeedsPrice, set_cumulativeSeedsPrice] = useState(0); //Total virtual price of all the seeds (right now)
	const	[cumulativeCropsPrice, set_cumulativeCropsPrice] = useState(0); //Total virtual price of all the crops from the seeds (right now)
	const	[yieldEarnedPrice, set_yieldEarnedPrice] = useState(0); //Total virtual price of all the yield from the crops (right now)
	const	[cumulativeFarmPrice, set_cumulativeFarmPrice] = useState(0); //Total virtual price of all the crops + yield from the seeds (right now)
	const	[cumulativeHarvestPrice, set_cumulativeHarvestPrice] = useState(0); //Total virtual price of all the harvest (right now)
	const	[cropsShare, set_cropsShare] = useState(0); //Value of 1 underlying token in baseToken
	const	[yieldEarned, set_yieldEarned] = useState(0); //How many yield did you make (benef from shareValue)
	const	[harvested, set_harvested] = useState(0); //How many did you harvest
	const	[actualCrops, set_actualCrops] = useState(0); //How many crops do you still have ?

	const	[APY, set_APY] = useState(0);
	const	[result, set_result] = useState(0);

	const	[isHarvested, set_isHarvested] = useState(false);

	const	[ethToBaseCurrency, set_ethToBaseCurrency] = useState(tokenPrices['eth']?.price || 0);
	const	[underlyingToBaseCurrency, set_underlyingToBaseCurrency] = useState(tokenPrices[parameters.underlyingTokenCgID]?.price || 0);

	const retrieveShareValue = useCallback(async () => {
		const	provider = new ethers.providers.AlchemyProvider('homestead', process.env.ALCHEMY_KEY);
		const	ABI = ['function pricePerShare() external view returns (uint256)'];
		const	smartContract = new ethers.Contract(parameters.contractAddress, ABI, provider);
		const	pricePerShare = await smartContract.pricePerShare();
		set_cropsShare(pricePerShare);
	}, [parameters.contractAddress]);

	const retrieveBalanceOf = useCallback(async () => {
		const	provider = new ethers.providers.AlchemyProvider('homestead', process.env.ALCHEMY_KEY);
		const	ABI = ['function balanceOf(address) external view returns (uint256)'];
		const	smartContract = new ethers.Contract(parameters.contractAddress, ABI, provider);
		const	balanceOf = await smartContract.balanceOf(address);
		const	_actualCrops = Number(ethers.utils.formatUnits(balanceOf, parameters.underlyingTokenDecimal || 18));
		set_actualCrops(_actualCrops);

		return _actualCrops;
	}, [address, parameters.contractAddress, parameters.underlyingTokenDecimal]);

	/**************************************************************************
	**	Update the prices & get the data from the related smartContracts
	**	Will set :
	**	- set_ethToBaseCurrency
	**	- set_underlyingToBaseCurrency
	**	- set_actualCrops
	**	- set_cropsShare
	**************************************************************************/
	useEffect(() => {
		set_ethToBaseCurrency(tokenPrices['eth']?.price || 0);
		set_underlyingToBaseCurrency(crvPrices[parameters.underlyingTokenCgID]?.price || 0);
		retrieveShareValue();
		retrieveBalanceOf();
	}, [currencyNonce, retrieveBalanceOf, crvPrices, tokenPrices, parameters.underlyingTokenCgID, retrieveShareValue]);

	/**************************************************************************
	**	Get the total price for all the seeds
	**	Will set :
	**	- set_cumulativeSeedsPrice
	**************************************************************************/
	useEffect(() => {
		let		_cumulativeSeedsPrice = 0;
		seeds.forEach((seed) => {
			const tokenPrice = seed.symbol === parameters.underlyingTokenSymbol ? underlyingToBaseCurrency : tokenPrices[seed.id || seed.symbol]?.price || 0;
			_cumulativeSeedsPrice += (seed.value * tokenPrice);
		});
		set_cumulativeSeedsPrice(_cumulativeSeedsPrice);
		set_preRenderStep(v => ({...v, seedPrice: true}))
	}, [parameters.underlyingTokenSymbol, seeds, tokenPrices, underlyingToBaseCurrency])

	/**************************************************************************
	**	Get the total amount harvested
	**	Will set :
	**	- set_harvested
	**************************************************************************/
	useEffect(() => {
		let		_cumulativeHarvested = 0;
		harvest.forEach((h) => {
			_cumulativeHarvested = bigNumber.from(_cumulativeHarvested).add(bigNumber.from(h.valueRaw))
		});
		set_harvested(Number(ethers.utils.formatUnits(_cumulativeHarvested, parameters.tokenDecimal || 18)));
		set_preRenderStep(v => ({...v, harvest: true}))
	}, [harvest, parameters.tokenDecimal])

	/**************************************************************************
	**	Get the total price for all the crops and all the yield
	**	Will set :
	**	- set_isHarvested
	**	- set_cumulativeCropsPrice
	**	- set_cumulativeFarmPrice
	**	- set_cumulativeHarvestPrice
	**	- set_yieldEarnedPrice
	**	- set_yieldEarned
	**************************************************************************/
	const computeGroupPrices = useCallback(async () => {
		if (underlyingToBaseCurrency && cropsShare) {
			const	_cumulativeHarvestPrice = harvested * underlyingToBaseCurrency;
			set_cumulativeHarvestPrice(_cumulativeHarvestPrice);

			if ((actualCrops === 0 || isHarvested) && harvest.length > 0) {
				set_isHarvested(true);

				const	_remainingCrops =  await retrieveBalanceOf();
				const	_cumulativeCropsPrice = _remainingCrops * underlyingToBaseCurrency;
				set_cumulativeCropsPrice(_cumulativeCropsPrice);
	
				const	_cumulativeYield = _remainingCrops * (cropsShare / 1e18);
				const	_cumulativeFarmPrice = _cumulativeYield * underlyingToBaseCurrency;
				set_cumulativeFarmPrice(_cumulativeFarmPrice);

				set_yieldEarned((actualCrops * (cropsShare / 1e18)) - actualCrops);
				set_yieldEarnedPrice(((actualCrops * (cropsShare / 1e18)) - actualCrops) * underlyingToBaseCurrency);
			} else {
				const	_cumulativeCrops = await retrieveBalanceOf();
				const	_cumulativeCropsPrice = _cumulativeCrops * underlyingToBaseCurrency;
				set_cumulativeCropsPrice(_cumulativeCropsPrice);
	
				const	_cumulativeYield = _cumulativeCrops * (cropsShare / 1e18);
				const	_cumulativeFarmPrice = _cumulativeYield * underlyingToBaseCurrency;
				set_cumulativeFarmPrice(_cumulativeFarmPrice);

				const	_yieldEarned = _cumulativeYield - _cumulativeCrops;
				const	_yieldEarnedPrice = _yieldEarned * underlyingToBaseCurrency;
				set_yieldEarnedPrice(_yieldEarnedPrice);
				set_yieldEarned(_yieldEarned);
			}
			set_preRenderStep(v => ({...v, prices: true}))
		}
	}, [underlyingToBaseCurrency, cropsShare, harvested, actualCrops, isHarvested, retrieveBalanceOf, harvest]);
	useEffect(() => {computeGroupPrices()}, [computeGroupPrices])

	/**************************************************************************
	**	Compute the current result & the resultImpermanent
	**	The result is the total yield minus the fees
	**	The resultImpermanent is totalFarmPrice - totalSeedsPrice - fees
	**	Will set :
	**	- set_result
	**	- set_resultImpermanent
	**	- set_APY
	**************************************************************************/
	useEffect(() => {
		const	feesPrice = (fees * ethToBaseCurrency);
		const	vf = (cumulativeHarvestPrice + yieldEarnedPrice + cumulativeCropsPrice) - feesPrice;
		const	vi = cumulativeSeedsPrice;
		set_result((cumulativeHarvestPrice + yieldEarnedPrice + cumulativeCropsPrice) - feesPrice - cumulativeSeedsPrice);
		set_APY((vf - vi) / vi * 100)
		set_preRenderStep(v => ({...v, result: true}))
	}, [yieldEarnedPrice, fees, ethToBaseCurrency, isHarvested, harvested, cumulativeHarvestPrice, cumulativeSeedsPrice, cumulativeFarmPrice, cumulativeCropsPrice])

	function	renderSeeds() {
		return (
			seeds.map((seed, i) => {
				const tokenPrice = seed.symbol === parameters.underlyingTokenSymbol ? underlyingToBaseCurrency : tokenPrices[seed.id || seed.symbol]?.price || 0;
				return <GroupElement
					key={`seed_${seed.name}_${i}`}
					image={seed.symbol === parameters.underlyingTokenSymbol ? parameters.underlyingTokenIcon : `https://tokens.1inch.exchange/${seed.address}.png`}
					label={seed.name}
					address={seed.address}
					amount={parseFloat(seed.value.toFixed(10))}
					value={(seed.value * tokenPrice).toFixed(2)} />
			})
		)
	}

	function	renderCrops() {
		return (
			crops.map((crop, i) => {
				return <GroupElement
					key={`crop_${crop.name}_${i}`}
					image={parameters.tokenIcon}
					label={crop.name}
					address={crop.address}
					amount={parseFloat(actualCrops.toFixed(10))}
					value={(actualCrops * underlyingToBaseCurrency).toFixed(2)} />
			})
		)
	}

	function	renderYield() {
		return (
			<Group network={network} title={'Yield'}>
				<GroupElement
					image={parameters.tokenIcon}
					label={parameters.underlyingTokenName}
					address={parameters.contractAddress}
					amount={parseFloat(yieldEarned.toFixed(10))}
					value={(yieldEarned * underlyingToBaseCurrency).toFixed(2)} />
				<GroupElement
					image={'⛽️'}
					label={'Fees'}
					amount={parseFloat(fees.toFixed(10))}
					value={-(fees * ethToBaseCurrency).toFixed(2)} />
			</Group>
		);
	}

	function	renderYieldAndHarvest() {
		return (
			<>
				<Group network={network} title={'Yield'}>
					<GroupElement
						image={parameters.tokenIcon}
						label={parameters.underlyingTokenName}
						address={parameters.contractAddress}
						amount={parseFloat(yieldEarned.toFixed(10))}
						value={(yieldEarned * underlyingToBaseCurrency).toFixed(2)} />
				</Group>
				<Group network={network} title={'Harvest'}>
					<GroupElement
						image={parameters.underlyingTokenIcon}
						label={parameters.underlyingTokenName}
						address={parameters.underlyingTokenAddress}
						amount={parseFloat(harvested.toFixed(10))}
						value={(harvested * underlyingToBaseCurrency).toFixed(2)} />
					<GroupElement
						image={'⛽️'}
						label={'Fees'}
						amount={parseFloat(fees.toFixed(10))}
						value={-(fees * ethToBaseCurrency).toFixed(2)} />
				</Group>
			</>
		)
	}

	const	isPreRenderOK = preRenderStep.seedPrice && preRenderStep.harvest && preRenderStep.prices && preRenderStep.result;
	return (
		<div className={`flex flex-col col-span-1 rounded-lg shadow bg-dark-600 p-6 relative transition-opacity ${isPreRenderOK ? 'opacity-100' : 'opacity-0'}`}>
			<SectionRemove uuid={uuid} />
			<SectionHead
				network={network}
				title={parameters.title}
				href={parameters.href}
				address={address}
				date={date}
				APY={APY} />
			
			<div className={'space-y-8'}>
				<Group network={network} title={'Seeds'}>
					{renderSeeds()}
				</Group>

				<Group network={network} title={'Crops'}>
					{renderCrops()}
				</Group>

				{isHarvested ? renderYieldAndHarvest() : renderYield()}
			</div>

			<SectionFoot result={result} />
		</div>
	)
}

export {PrepareStrategyYearnCrvV2};
export default StrategyYearnCrvV2;