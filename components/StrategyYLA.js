/******************************************************************************
**	@Author:				Thomas Bouder <Tbouder>
**	@Email:					Tbouder@protonmail.com
**	@Date:					Friday April 23rd 2021
**	@Filename:				StrategyAssy.js
******************************************************************************/

import	React, {useState, useEffect}	from	'react';
import	useCurrencies			from	'contexts/useCurrencies';
import	{ethers}				from	'ethers';
import	{datediff}				from	'utils'

function	StrategyYLA() {
	const	{tokenPrices, currencyNonce} = useCurrencies();

	const	[APY, set_APY] = useState(0);
	const	[result, set_result] = useState(0);
	const	[resultImpermanent, set_resultImpermanent] = useState(0);
	const	[cvpEarned, set_cvpEarned] = useState(0);
	const	[cvpVested, set_cvpVested] = useState(0);

	const	[ethToBaseCurrency, set_ethToBaseCurrency] = useState(tokenPrices['eth']?.price || 0);
	const	[cvpToBaseCurrency, set_cvpToBaseCurrency] = useState(tokenPrices['cvp']?.price || 0);
	const	[ylaToBaseCurrency, set_ylaToBaseCurrency] = useState(tokenPrices['yearn-lazy-ape']?.price || 0);
	
	const	totalFeesEth = 0.00597732 + 0.009814746 + 0.012145953 + 0.0221916;
	
	const	EUROBalance = 2850;
	const	YLABalance = 2361.665;
	const	CVPBalance = 336.78;

	async function	retrieveCVP() {
		const	provider = new ethers.providers.AlchemyProvider('homestead', process.env.ALCHEMY_KEY)
		const	ABI = [
			'function pendingCvp(uint256 _pid, address _user) external view returns (uint256)',
			'function vestableCvp(uint256 _pid, address user) external view returns (uint256)'
		]
		const	smartContract = new ethers.Contract('0xf09232320ebeac33fae61b24bb8d7ca192e58507', ABI, provider)
		const	pendingCVP = await smartContract.pendingCvp(13, '0x9E63B020ae098E73cF201EE1357EDc72DFEaA518');
		const	vestableCVP = await smartContract.vestableCvp(13, '0x9E63B020ae098E73cF201EE1357EDc72DFEaA518');
		const	_cvpEarned = pendingCVP.toString() / (1000000000000000000);
		const	_cvpVested = vestableCVP.toString() / (1000000000000000000);

		set_cvpEarned(_cvpEarned);
		set_cvpVested(_cvpVested);
	}

	useEffect(() => {retrieveCVP()}, []);

	useEffect(() => {
		set_ethToBaseCurrency(tokenPrices['eth']?.price || 0);
		set_ylaToBaseCurrency(tokenPrices['yearn-lazy-ape']?.price || 0);
		set_cvpToBaseCurrency(tokenPrices['cvp']?.price || 0);

	}, [currencyNonce]);

	useEffect(() => {
		const	_result = ((cvpEarned + cvpVested) * cvpToBaseCurrency) - (totalFeesEth * ethToBaseCurrency);
		set_result(_result);
		const	_ylaImpermanent = (YLABalance * ylaToBaseCurrency) - 2000;
		const	_cvpImpermanent = (CVPBalance * cvpToBaseCurrency) - 850;
		set_resultImpermanent(_result + _ylaImpermanent + _cvpImpermanent)
	}, [cvpEarned, cvpVested, cvpToBaseCurrency, ethToBaseCurrency, ylaToBaseCurrency])

	useEffect(() => {
		const	feesCost = totalFeesEth * ethToBaseCurrency;
		const	vi = (CVPBalance * cvpToBaseCurrency) + (YLABalance * ylaToBaseCurrency);
		const	vf = ((CVPBalance + cvpEarned + cvpVested) * cvpToBaseCurrency) + (YLABalance * ylaToBaseCurrency) - feesCost;

		set_APY((vf - vi) / vi * 100)
	}, [cvpToBaseCurrency, ylaToBaseCurrency, ethToBaseCurrency])

	return (
		<>
			<div className={'flex flex-row justify-between items-center'}>
				<p className={'font-medium text-2xl text-white text-opacity-30 pb-6 inline'}>{'LIVRET YLA'}</p>
				<div className={'font-medium text-xs text-white text-opacity-30 pb-6'}>
					<p className={'mb-1'}>{`${datediff('04/22/2021')} jours`}</p>
					<p className={`mb-1 ${APY > 0 ? 'text-green-400' : APY < 0 ? 'text-red-400' : 'text-white'}`}>{`${(APY).toFixed(2)}%`}</p>
				</div>
			</div>

			<div className={'w-full'}>
				<p className={'text-white text-opacity-80 pb-2 border-b border-dark-400 font-medium'}>{'Deposits - Fiat'}</p>
				<div className={'text-white text-opacity-80 pt-2 flex flex-row w-full'}>
					<p className={'w-1/3 font-medium'}>{'💶&nbsp; '}{'EURO : '}</p>
					<p className={'w-1/3 text-right'}>{EUROBalance.toFixed(2)}</p>
					<p className={'w-1/3 text-right'}>{`${EUROBalance.toFixed(2)} €`}</p>
				</div>
			</div>

			<div className={'w-full mt-8'}>
				<p className={'text-white text-opacity-80 pb-2 border-b border-dark-400 font-medium'}>{'Crops'}</p>
				<div className={'text-white text-opacity-80 pt-2 flex flex-row w-full'}>
					<p className={'w-1/3 font-medium'}>{'🐵&nbsp; '}{'YLA : '}</p>
					<p className={'w-1/3 text-right'}>{YLABalance.toFixed(4)}</p>
					<div className={'w-1/3 text-right'}>
						<p>{`${(YLABalance * ylaToBaseCurrency).toFixed(2)} €`}</p>
						<p className={'font-light italic text-xs text-dark-100'}>{`${((YLABalance * ylaToBaseCurrency) - 2000).toFixed(2)} €`}</p>
					</div>
				</div>
				<div className={'text-white text-opacity-80 pt-2 flex flex-row w-full'}>
					<p className={'w-1/3 font-medium'}>{'🌀&nbsp; '}{'CVP : '}</p>
					<p className={'w-1/3 text-right'}>{CVPBalance.toFixed(6)}</p>
					<div className={'w-1/3 text-right'}>
						<p>{`${(CVPBalance * cvpToBaseCurrency).toFixed(2)} €`}</p>
						<p className={'font-light italic text-xs text-dark-100'}>{`${((CVPBalance * cvpToBaseCurrency) - 850).toFixed(2)} €`}</p>
					</div>
				</div>
			</div>

			<div className={'w-full mt-8'}>
				<p className={'text-white text-opacity-80 pb-2 border-b border-dark-400 font-medium'}>{'Yield'}</p>
				<div className={'text-white text-opacity-80 pt-2 flex flex-row w-full'}>
					<p className={'w-1/3 font-medium'}>{'🔒&nbsp; '}{'CVP Earned : '}</p>
					<p className={'w-1/3 text-right'}>{cvpEarned.toFixed(6)}</p>
					<p className={'w-1/3 text-right'}>{`${(cvpEarned * cvpToBaseCurrency).toFixed(2)} €`}</p>
				</div>
				<div className={'text-white text-opacity-80 pt-2 flex flex-row w-full'}>
					<p className={'w-1/3 font-medium'}>{'🔓&nbsp; '}{'CVP Vested : '}</p>
					<p className={'w-1/3 text-right'}>{cvpVested.toFixed(6)}</p>
					<p className={'w-1/3 text-right'}>{`${(cvpVested * cvpToBaseCurrency).toFixed(2)} €`}</p>
				</div>
				<div className={'text-white text-opacity-80 pt-2 flex flex-row w-full'}>
					<p className={'w-1/3 font-medium'}>{'⛽️&nbsp; '}{'FEES : '}</p>
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

export default StrategyYLA;