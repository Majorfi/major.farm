/******************************************************************************
**	@Author:				Thomas Bouder <Tbouder>
**	@Email:					Tbouder@protonmail.com
**	@Date:					Friday April 23rd 2021
**	@Filename:				StrategyAssy.js
******************************************************************************/

import	{useState, useEffect}	from	'react';
import	useCurrencies			from	'contexts/useCurrencies';
import	{ethers}				from	'ethers';
import	{datediff}				from	'utils'

function	StrategyBAG() {
	const	{tokenPrices, currencyNonce} = useCurrencies();

	const	[APY, set_APY] = useState(0);
	const	[result, set_result] = useState(0);
	const	[resultImpermanent, set_resultImpermanent] = useState(0);
	const	[BAGBalance, set_BAGBalance] = useState(25.574815632277394423);
	const	[BAGEarned, set_BAGEarned] = useState(101.833 - 25.574815632277394423);
	const	[BAGGoldEarned, set_BAGGoldEarned] = useState(0);
	
	const	[ethToBaseCurrency, set_ethToBaseCurrency] = useState(tokenPrices['eth']?.price || 0);
	const	[bagToBaseCurrency, set_bagToBaseCurrency] = useState(tokenPrices['bag']?.price || 0);
	const	[bagGoldToBaseCurrency, set_bagGoldToBaseCurrency] = useState(20);
	const	phase1Fees = 0.00845614 + 0.009122064 + 0.008536818;
	const	phase2Fees = 0.011097408 + 0.004081968 + 0.004092616 + 0.0076317318 + 0.0092786;
	const	totalFeesEth = phase1Fees + phase2Fees;

	const	ETHLPBalance = 0.992724266290219546;
	const	ETHBalance = 1.992724266290219546;

	async function	retrieveBAGPhase2() {
		const	provider = new ethers.providers.AlchemyProvider('homestead', process.env.ALCHEMY_KEY)
		const	ABI = ['function pendingReward(uint256 _pid, address _user) external view returns (uint256)']
		const	smartContract = new ethers.Contract('0x5045D9CEbB3b84b56Baff6E8301cE9d9ad41b3C4', ABI, provider)
		const	pendingRewardBag = await smartContract.pendingReward(2, '0xc79f1910afe226cfb36a9823843b30bf0102836a');
		const	pendingRewardLp = await smartContract.pendingReward(3, '0xc79f1910afe226cfb36a9823843b30bf0102836a');
		const	_BAGGoldEarned = (pendingRewardLp.toString() / (1000000000000000000)) + (pendingRewardBag.toString() / (1000000000000000000));
		set_BAGGoldEarned(_BAGGoldEarned);
	}

	useEffect(() => {retrieveBAGPhase2()}, []);
	
	useEffect(() => {
		set_ethToBaseCurrency(tokenPrices['eth']?.price || 0);
		set_bagToBaseCurrency(tokenPrices['bag']?.price || 0);

	}, [currencyNonce]);

	useEffect(() => {
		const _result = (BAGBalance * bagToBaseCurrency) + (BAGEarned * bagToBaseCurrency) + (BAGGoldEarned * bagGoldToBaseCurrency) - (totalFeesEth * ethToBaseCurrency);
		set_result(_result);
		set_resultImpermanent(((_result) + ((BAGBalance * bagToBaseCurrency) - (ETHLPBalance * ethToBaseCurrency))));

	}, [BAGBalance, BAGEarned, BAGGoldEarned, ethToBaseCurrency, bagToBaseCurrency]);

	useEffect(() => {
		const	feesCost = totalFeesEth * ethToBaseCurrency;
		const	vi = (BAGBalance * bagToBaseCurrency);
		const	vf = (BAGEarned * bagToBaseCurrency) + (BAGGoldEarned * bagGoldToBaseCurrency) - feesCost;

		set_APY((vf - vi) / vi * 100)
	}, [ethToBaseCurrency, bagToBaseCurrency, BAGEarned, BAGGoldEarned])

	return (
		<>
			<div className={'flex flex-row justify-between items-center'}>
				<p className={'font-medium text-2xl text-white text-opacity-30 pb-6 inline'}>{'T-BAG PHASE 2'}</p>
				<div className={'font-medium text-xs text-white text-opacity-30 pb-6'}>
					<p className={'mb-1'}>{`${datediff('04/11/2021')} jours`}</p>
					<p className={`mb-1 ${APY > 0 ? 'text-green-400' : APY < 0 ? 'text-red-400' : 'text-white'}`}>{`${(APY).toFixed(2)}%`}</p>
				</div>
			</div>
			
			<div className={'w-full'}>
				<p className={'text-white text-opacity-80 pb-2 border-b border-dark-400 font-medium'}>{'Deposit'}</p>
				<div className={'text-white text-opacity-80 pt-2 flex flex-row w-full'}>
					<p className={'w-1/3 font-medium'}>💎&nbsp; {'ETH : '}</p>
					<p className={'w-1/3 text-right'}>{ETHBalance.toFixed(6)}</p>
					<p className={'w-1/3 text-right'}>{`${(ETHBalance * ethToBaseCurrency).toFixed(2)} €`}</p>
				</div>
			</div>

			<div className={'w-full mt-12'}>
				<p className={'text-white text-opacity-80 pb-2 border-b border-dark-400 font-medium'}>{'Crops'}</p>
				<div className={'text-white text-opacity-80 pt-2 flex flex-row w-full'}>
					<p className={'w-1/3 font-medium'}>💰&nbsp; {'BAG : '}</p>
					<p className={'w-1/3 text-right'}>{BAGBalance.toFixed(6)}</p>
					<div className={'w-1/3 text-right'}>
						<p>{`${(BAGBalance * bagToBaseCurrency).toFixed(2)} €`}</p>
						<p className={'font-light italic text-xs text-dark-100'}>{`${((BAGBalance * bagToBaseCurrency) - (ETHLPBalance * ethToBaseCurrency)).toFixed(2)} €`}</p>
					</div>
				</div>
			</div>

			<div className={'w-full mt-8'}>
				<p className={'text-white text-opacity-80 pb-2 border-b border-dark-400 font-medium'}>{'Yield'}</p>
				<div className={'text-white text-opacity-80 pt-2 flex flex-row w-full'}>
					<p className={'w-1/3 font-medium'}>💰&nbsp; {'BAG Earned : '}</p>
					<p className={'w-1/3 text-right'}>{BAGEarned.toFixed(6)}</p>
					<p className={'w-1/3 text-right'}>{`${(BAGEarned * bagToBaseCurrency).toFixed(2)} €`}</p>
				</div>
				<div className={'text-white text-opacity-80 pt-2 flex flex-row w-full'}>
					<p className={'w-1/3 font-medium'}>⚱️&nbsp; {'BAG Gold Earned : '}</p>
					<p className={'w-1/3 text-right'}>{BAGGoldEarned.toFixed(6)}</p>
					<p className={'w-1/3 text-right'}>{`${(BAGGoldEarned * bagGoldToBaseCurrency).toFixed(2)} €`}</p>
				</div>
				<div className={'text-white text-opacity-80 pt-2 flex flex-row w-full'}>
					<p className={'w-1/3 font-medium'}>⛽️&nbsp; {'FEES : '}</p>
					<p className={'w-1/3 text-right'}>{totalFeesEth.toFixed(6)}</p>
					<p className={'w-1/3 text-right'}>{`-${(totalFeesEth * ethToBaseCurrency).toFixed(2)} €`}</p>
				</div>
			</div>

			<div className={'w-full mt-auto pt-12'}>
				<p className={`text-opacity-80 font-medium text-center text-2xl ${result > 0 ? 'text-green-400' : result < 0 ? 'text-red-400' : 'text-white'}`}>
					{`${(result).toFixed(4)} €`}
				</p>
				<div
					className={`text-opacity-60 font-light italic text-center text-xs ${resultImpermanent > 0 ? 'text-green-400' : resultImpermanent < 0 ? 'text-red-400' : 'text-white'}`}>
					<p className={'text-dark-100 text-opacity-100 inline'}>{'With impermanent : '}</p>
					{`${(resultImpermanent).toFixed(4)} €`}
				</div>
			</div>
		</>
	)
}

export default StrategyBAG;