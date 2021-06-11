/******************************************************************************
**	@Author:				Thomas Bouder <Tbouder>
**	@Email:					Tbouder@protonmail.com
**	@Date:					Friday April 23rd 2021
**	@Filename:				StrategyYVBoost.js
******************************************************************************/

import	React, {useState, useEffect}	from	'react';
import	useCurrencies					from	'contexts/useCurrencies';
import	{ethers}						from	'ethers';
import	axios							from	'axios';
import	SectionRemove					from	'components/Strategies/SectionRemove'
import	SectionHead						from	'components/Strategies/SectionHead'
import	SectionFoot						from	'components/Strategies/SectionFoot'
import	Group, {GroupElement}			from	'components/Strategies/Group'
import	{toAddress, bigNumber}			from	'utils';
import	* as API						from	'utils/API';

async function	PrepareStrategyYVBoost(address) {
	let		timestamp = undefined;

	const	initialSeeds = [];
	const	normalTx = await API.retreiveTxFrom('ethereum', address);
	const	erc20Tx = await API.retreiveErc20TxFrom('ethereum', address);

	async function	computeFees() {
		const	cumulativeFees = (
			normalTx
				.filter(tx => (
					(toAddress(tx.to) === toAddress('0xc695f73c1862e050059367B2E64489E66c525983')) //DEPOSIT IN VAULT
				||
				(
					tx.input.startsWith('0x095ea7b3')
					&& tx.input.includes('c695f73c1862e050059367b2e64489e66c525983') //APPROVE VAULT
				)
				||
				(toAddress(tx.to) === toAddress('0xda481b277dce305b97f4091bd66595d57cf31634')) //DEPOSIT IN JAR
				||
				(
					toAddress(tx.to) === toAddress('0xced67a187b923f0e5ebcc77c7f2f7da20099e378')
					&& tx.input.startsWith('0x095ea7b3')
					&& tx.input.includes('da481b277dce305b97f4091bd66595d57cf31634') //APPROVE JAR
				)
				)).reduce((accumulator, tx) => {
					const	gasUsed = bigNumber.from(tx.gasUsed);
					const	gasPrice = bigNumber.from(tx.gasPrice);
					const	gasUsedPrice = gasUsed.mul(gasPrice);
					return bigNumber.from(accumulator).add(gasUsedPrice);
				}, bigNumber.from(0))
		);
		return (Number(ethers.utils.formatUnits(cumulativeFees, 'ether')));
	}

	async function	computeDepositERC20() {
		erc20Tx
			.filter(tx => (
				(toAddress(tx.to) === toAddress('0xc695f73c1862e050059367b2e64489e66c525983'))
			||
			(
				tx.input.startsWith('0x28932094')
				&& tx.input.includes('ced67a187b923f0e5ebcc77c7f2f7da20099e378')
			)
			)).forEach((tx) => {
				if (timestamp === undefined || timestamp < tx.timeStamp) {
					timestamp = tx.timeStamp;
				}
				initialSeeds.push({
					contractAddress: tx.contractAddress,
					hash: tx.hash,
					tokenDecimal: tx.tokenDecimal,
					tokenSymbol: tx.tokenSymbol,
					value: tx.value
				})
			})
	}

	async function	computeDepositEth() {
		normalTx
			.filter(tx => (
				(toAddress(tx.to) === toAddress('0xc695f73c1862e050059367B2E64489E66c525983'))
			||
			(
				tx.input.startsWith('0x28932094')
				&& tx.input.includes('ced67a187b923f0e5ebcc77c7f2f7da20099e378')
			)
			)).forEach((tx) => {
				if (tx.isError === '0' && tx.value !== '0') {
					if (timestamp === undefined) {
						timestamp = tx.timeStamp;
					}
					initialSeeds.push({
						contractAddress: '0',
						hash: tx.hash,
						tokenDecimal: 18,
						tokenSymbol: 'ETH',
						value: tx.value
					})
				}
			})
	}

	async function	computeYieldToken() {
		const	cumulativeYieldToken = (
			erc20Tx
				.filter(tx => (
					(toAddress(tx.from) === toAddress('0xc695f73c1862e050059367b2e64489e66c525983'))
				&&
				(toAddress(tx.contractAddress) === toAddress('0xced67a187b923f0e5ebcc77c7f2f7da20099e378'))
				&&
				(tx.tokenSymbol === 'pSLP')
				)).reduce((accumulator, tx) => {
					return bigNumber.from(accumulator).add(bigNumber.from(tx.value));
				}, bigNumber.from(0))
		);

		return (Number(ethers.utils.formatUnits(cumulativeYieldToken, 18)));
	}

	const	fees = await computeFees();
	const	initialCrops = await computeYieldToken();
	await	computeDepositEth();
	await	computeDepositERC20();

	return {
		fees,
		initialSeeds,
		initialCrops,
		timestamp,
	}
}

function	StrategyYVBoost({address, network = 'ethereum', uuid, fees, initialCrops, initialSeeds, date}) {
	const	{tokenPrices, sushiPairs, currencyNonce, baseCurrency} = useCurrencies();

	const	[APY, set_APY] = useState(0);
	const	[result, set_result] = useState(0);
	const	[resultImpermanent, set_resultImpermanent] = useState(0);

	const	[seeds, set_seeds] = useState([]);
	const	[seedsValue, set_seedsValue] = useState(0);

	const	[pickleEarned, set_pickleEarned] = useState(0);
	const	[yvBoostEthEarned, set_yvBoostEthEarned] = useState(0);

	const	[ethToBaseCurrency, set_ethToBaseCurrency] = useState(tokenPrices['eth']?.price || 0);
	const	[usdToBaseCurrency, set_usdToBaseCurrency] = useState(tokenPrices['usd']?.price || 0);
	const	[pickleToBaseCurrency, set_pickleToBaseCurrency] = useState(tokenPrices['pickle-finance']?.price || 0);
	
	const	[totalFeesEth] = useState(fees);
	const	[crops] = useState(initialCrops);

	async function	retrievePickle() {
		const	provider = new ethers.providers.AlchemyProvider('homestead', process.env.ALCHEMY_KEY)
		const	ABI = ['function earned(address account) external view returns (uint256)']
		const	smartContract = new ethers.Contract('0xDA481b277dCe305B97F4091bD66595d57CF31634', ABI, provider)
		const	earnedBalance = await smartContract.earned(toAddress(address));
		const	_earned = earnedBalance.toString() / (1000000000000000000);
		set_pickleEarned(_earned)
	}
	async function	retrieveYvBoostLpEth() {
		const	{data} = await axios.get(`https://stkpowy01i.execute-api.us-west-1.amazonaws.com/prod//protocol/earnings/${address.toLowerCase()}`)
		// const	{data} = await axios.get(`https://api.pickle-jar.info/protocol/earnings/${address.toLowerCase()}`)
		const	_amount = data?.jarEarnings[0]?.earned;
		set_yvBoostEthEarned(_amount);
	}
	async function	prepareSeeds() {
		set_seedsValue(0);
		return (
			Promise.all(
				initialSeeds?.map(async (f, i) => {
					if (f.contractAddress === '0') {
						const	amount = Number(ethers.utils.formatUnits(bigNumber.from(f.value), 18)).toFixed(8); 
						set_seedsValue(v => v + (amount * ethToBaseCurrency));
						return Promise.resolve(
							<GroupElement
								key={`${i}_${f.contractAddress}`}
								image={'/tokens/eth.svg'}
								label={f.tokenSymbol}
								address={f.contractAddress}
								amount={amount}
								value={(amount * ethToBaseCurrency).toFixed(2)} />
						);
					} else {
						const	amount = Number(ethers.utils.formatUnits(bigNumber.from(f.value), f.tokenDecimal)).toFixed(f.tokenDecimal > 8 ? 8 : f.tokenDecimal);
						const	priceToBaseCurrency = await API.getQuotePriceEth(f.contractAddress, baseCurrency);
						set_seedsValue(v => v + (amount * priceToBaseCurrency));

						return Promise.resolve(
							<GroupElement
								key={`${i}_${f.contractAddress}`}
								image={`https://tokens.1inch.exchange/${f.contractAddress}.png`}
								label={f.tokenSymbol}
								address={f.contractAddress}
								amount={amount}
								value={(amount * priceToBaseCurrency).toFixed(2)} />
						);
					}
				})
			)
		);
	}

	useEffect(async () => {
		set_seeds(await prepareSeeds())
	}, [initialSeeds, ethToBaseCurrency])

	useEffect(() => {
		set_usdToBaseCurrency(tokenPrices['usdc']?.price || 0);
		set_ethToBaseCurrency(tokenPrices['eth']?.price || 0);
		set_pickleToBaseCurrency(tokenPrices['pickle-finance']?.price || 0);
		retrievePickle();
	}, [currencyNonce]);

	useEffect(() => {
		retrieveYvBoostLpEth()
	}, [currencyNonce, usdToBaseCurrency]);

	useEffect(() => {
		set_result(
			(pickleEarned * pickleToBaseCurrency) +
			((yvBoostEthEarned * sushiPairs['0x9461173740d27311b176476fa27e94c681b1ea6b'])) -
			(totalFeesEth * ethToBaseCurrency)
		);
		set_resultImpermanent(
			(
				(pickleEarned * pickleToBaseCurrency) +
				((yvBoostEthEarned * sushiPairs['0x9461173740d27311b176476fa27e94c681b1ea6b']))
			) + 
			(
				((crops * sushiPairs['0x9461173740d27311b176476fa27e94c681b1ea6b']))
				- seedsValue
			)
			- (totalFeesEth * ethToBaseCurrency)
		);
	}, [ethToBaseCurrency, pickleToBaseCurrency, pickleEarned, yvBoostEthEarned, crops, seedsValue, totalFeesEth])

	useEffect(() => {
		const	vi = seedsValue;
		const	vf = resultImpermanent + vi;
		set_APY((vf - vi) / vi * 100)
	}, [ethToBaseCurrency, resultImpermanent])

	// return null

	return (
		<div className={'flex flex-col col-span-1 rounded-lg shadow bg-dark-600 p-6 relative'}>
			<SectionRemove uuid={uuid} />
			<SectionHead
				network={network}
				title={'yvBOOST'}
				href={'https://yearn.fi/invest/0x9d409a0A012CFbA9B15F6D4B36Ac57A46966Ab9a'}
				address={address}
				date={date}
				APY={APY} />
			
			<div className={'space-y-8'}>
				<Group network={network} title={'Seeds'}>
					{seeds}
				</Group>

				<Group network={network} title={'Crops'}>
					<GroupElement
						image={'/tokens/yvboost.png'}
						label={'yvBoost-ETH'}
						address={'0xced67a187b923f0e5ebcc77c7f2f7da20099e378'}
						amount={crops.toFixed(8)}
						value={(crops * sushiPairs['0x9461173740d27311b176476fa27e94c681b1ea6b']).toFixed(2)}
						details={`${((crops * sushiPairs['0x9461173740d27311b176476fa27e94c681b1ea6b']) - seedsValue).toFixed(2)} ${baseCurrency === 'eur' ? '€' : '$'}`} />
				</Group>


				<Group network={network} title={'Yield'}>
					<GroupElement
						image={'/tokens/pickle.png'}
						label={'Pickle'}
						address={'0x429881672B9AE42b8EbA0E26cD9C73711b891Ca5'}
						amount={pickleEarned.toFixed(10)}
						value={(pickleEarned * pickleToBaseCurrency).toFixed(2)} />
					<GroupElement
						image={'/tokens/yvboost.png'}
						label={'yvBoost-ETH'}
						address={'0x9461173740d27311b176476fa27e94c681b1ea6b'}
						amount={yvBoostEthEarned.toFixed(10)}
						value={(yvBoostEthEarned * sushiPairs['0x9461173740d27311b176476fa27e94c681b1ea6b']).toFixed(2)} />
					<GroupElement
						image={'⛽️'}
						label={'Fees'}
						amount={totalFeesEth.toFixed(10)}
						value={-(totalFeesEth * ethToBaseCurrency).toFixed(2)} />
				</Group>
			</div>

			<SectionFoot result={result}>
				<div
					className={`text-opacity-60 font-light italic text-center text-xs ${resultImpermanent > 0 ? 'text-green-400' : resultImpermanent < 0 ? 'text-red-400' : 'text-white'}`}>
					<p className={'text-dark-100 text-opacity-100 inline'}>{'With impermanent : '}</p>
					{`${(resultImpermanent).toFixed(4)} ${baseCurrency === 'eur' ? '€' : '$'}`}
				</div>
			</SectionFoot>
		</div>
	)
}

export {PrepareStrategyYVBoost};
export default StrategyYVBoost;