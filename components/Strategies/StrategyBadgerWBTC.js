/******************************************************************************
**	@Author:				Thomas Bouder <Tbouder>
**	@Email:					Tbouder@protonmail.com
**	@Date:					Friday April 23rd 2021
**	@Filename:				StrategyBadgerWBTC.js
******************************************************************************/

import	React, {useState, useEffect}		from	'react';
import	useCurrencies						from	'contexts/useCurrencies';
import	{toAddress, bigNumber}				from	'utils';
import	{ethers}							from	'ethers';
import	axios								from	'axios';
import	SectionRemove						from	'components/StrategyCard/SectionRemove'
import	SectionHead							from	'components/StrategyCard/SectionHead'
import	SectionFoot							from	'components/StrategyCard/SectionFoot'
import	Group, {GroupElement}				from	'components/StrategyCard/Group'
import	{retreiveTxFrom, retreiveErc20TxFrom} from 'utils/API';

async function	PrepareStrategyBadgerWBTC(address) {
	let	timestamp = undefined;
	const	normalTx = await retreiveTxFrom('ethereum', address);
	const	erc20Tx = await retreiveErc20TxFrom('ethereum', address);

	async function	computeFees() {
		const	cumulativeFees = (
			normalTx
				.filter(tx => (
					(toAddress(tx.to) === toAddress('0x4b92d19c11435614cd49af1b589001b7c08cd4d5'))
				||
				(
					toAddress(tx.to) === toAddress('0x2260fac5e5542a773aa44fbcfedf7c193bc2c599')
					&& tx.input.startsWith('0x095ea7b3')
					&& tx.input.includes('4b92d19c11435614cd49af1b589001b7c08cd4d5')
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

	async function	computeDeposit() {
		const	cumulativeDeposits = (
			erc20Tx
				.filter(tx => (
					(toAddress(tx.to) === toAddress('0x4b92d19c11435614cd49af1b589001b7c08cd4d5'))
				||
				(
					toAddress(tx.to) === toAddress('0x2260fac5e5542a773aa44fbcfedf7c193bc2c599')
					&& tx.input.startsWith('0x35ac79c3')
					&& tx.input.includes('4b92d19c11435614cd49af1b589001b7c08cd4d5')
				)
				)).reduce((accumulator, tx) => {
					if (timestamp === undefined) {
						timestamp = tx.timeStamp;
					}
					return bigNumber.from(accumulator).add(bigNumber.from(tx.value));
				}, bigNumber.from(0))
		);
		return (Number(ethers.utils.formatUnits(cumulativeDeposits, 8)));
	}

	async function	computeYieldToken() {
		const	cumulativeYieldToken = (
			erc20Tx
				.filter(tx => (
					(toAddress(tx.from) === toAddress('0x0000000000000000000000000000000000000000'))
				&&
				(toAddress(tx.contractAddress) === toAddress('0x4b92d19c11435614cd49af1b589001b7c08cd4d5'))
				&&
				(tx.tokenSymbol === 'byvWBTC')
				)).reduce((accumulator, tx) => {
					return bigNumber.from(accumulator).add(bigNumber.from(tx.value));
				}, bigNumber.from(0))
		);

		return (Number(ethers.utils.formatUnits(cumulativeYieldToken, 8)));
	}

	return {
		fees: await computeFees(),
		initialDeposit: await computeDeposit(),
		initialYield: await computeYieldToken(),
		timestamp,
	}
}

function	StrategyBadgerWBTC({address, network = 'ethereum', uuid, fees, initialDeposit, initialYield, date}) {
	const	{tokenPrices, currencyNonce} = useCurrencies();

	const	[APY, set_APY] = useState(0);
	const	[result, set_result] = useState(0);
	const	[wbtcEarned, set_wbtcEarned] = useState(0);
	const	[badgerEarned, set_badgerEarned] = useState(0);

	const	[ethToBaseCurrency, set_ethToBaseCurrency] = useState(tokenPrices['eth']?.price || 0);
	const	[btcToBaseCurrency, set_btcToBaseCurrency] = useState(tokenPrices['btc']?.price || 0);
	const	[badgerToBaseCurrency, set_badgerToBaseCurrency] = useState(tokenPrices['badger-dao']?.price || 0);

	const	[totalFeesEth] = useState(fees);
	const	[wBTCDeposit] = useState(initialDeposit);
	const	[byvWBTCDeposit] = useState(initialYield);
	
	async function	retrieveShare() {
		const	provider = new ethers.providers.AlchemyProvider('homestead', process.env.ALCHEMY_KEY)
		const	ABI = ['function totalWrapperBalance(address account) public view returns (uint256 balance)']
		const	smartContract = new ethers.Contract('0x4b92d19c11435614CD49Af1b589001b7c08cD4D5', ABI, provider)
		const	totalWrapperBalance = await smartContract.totalWrapperBalance(address);
		set_wbtcEarned((totalWrapperBalance / 100000000) - wBTCDeposit)
	}

	async function retrieveBadgers() {
		const	{data} = await axios.get(`https://api.badger.finance/v2/reward/tree/${toAddress(address)}`)
		const	_badger = data.cumulativeAmounts[0];
		set_badgerEarned(_badger / 1e18)
	}

	useEffect(() => {
		retrieveShare()
		retrieveBadgers()
		set_ethToBaseCurrency(tokenPrices['eth']?.price || 0);
		set_btcToBaseCurrency(tokenPrices['btc']?.price || 0);
		set_badgerToBaseCurrency(tokenPrices['badger-dao']?.price || 0)
	}, [currencyNonce]);

	useEffect(() => {
		const	_result = (wbtcEarned * btcToBaseCurrency) + (badgerEarned * badgerToBaseCurrency) - (totalFeesEth * ethToBaseCurrency);
		set_result(_result);
	}, [btcToBaseCurrency, ethToBaseCurrency, badgerToBaseCurrency, badgerEarned, wbtcEarned])

	useEffect(() => {
		const	feesCost = totalFeesEth * ethToBaseCurrency;
		const	vi = wBTCDeposit * btcToBaseCurrency;
		const	vf = (((wBTCDeposit + wbtcEarned) * btcToBaseCurrency) + (badgerEarned * badgerToBaseCurrency)) - feesCost;

		set_APY((vf - vi) / vi * 100)
	}, [btcToBaseCurrency, ethToBaseCurrency, badgerToBaseCurrency, badgerEarned, wbtcEarned])

	return (
		<div className={'flex flex-col col-span-1 rounded-lg shadow bg-dark-600 p-6 relative'}>
			<SectionRemove uuid={uuid} />
			<SectionHead
				network={network}
				title={'BADGER WBTC'}
				href={'https://app.badger.finance/'}
				address={address}
				date={date}
				APY={APY} />

			<div className={'space-y-8'}>
				<Group title={'Fertilizer'}>
					<GroupElement
						network={network}
						image={'/tokens/btc.svg'}
						label={'wBTC'}
						address={'0x2260fac5e5542a773aa44fbcfedf7c193bc2c599'}
						amount={wBTCDeposit.toFixed(8)}
						value={(wBTCDeposit * btcToBaseCurrency).toFixed(2)} />
				</Group>

				<Group title={'Seeds'}>
					<GroupElement
						network={network}
						image={'/tokens/byvwbtc.png'}
						label={'byvWBTC'}
						address={'0x4b92d19c11435614cd49af1b589001b7c08cd4d5'}
						amount={byvWBTCDeposit.toFixed(8)}
						value={'---'} />
				</Group>

				<Group title={'Yield'}>
					<GroupElement
						network={network}
						image={'/tokens/btc.svg'}
						label={'wBTC earned'}
						address={'0x2260fac5e5542a773aa44fbcfedf7c193bc2c599'}
						amount={wbtcEarned.toFixed(8)}
						value={(wbtcEarned * btcToBaseCurrency).toFixed(2)} />
					<GroupElement
						network={network}
						image={'/tokens/badger.png'}
						label={'Badger earned'}
						address={'0x3472A5A71965499acd81997a54BBA8D852C6E53d'}
						amount={badgerEarned.toFixed(10)}
						value={(badgerEarned * badgerToBaseCurrency).toFixed(2)} />
					<GroupElement
						network={network}
						image={'⛽️'}
						label={'Fees'}
						amount={totalFeesEth.toFixed(10)}
						value={-(totalFeesEth * ethToBaseCurrency).toFixed(2)} />
				</Group>
			</div>

			<SectionFoot result={result} />
		</div>
	)
}

export {PrepareStrategyBadgerWBTC}
export default StrategyBadgerWBTC;