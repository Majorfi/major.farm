/******************************************************************************
**	@Author:				Thomas Bouder <Tbouder>
**	@Email:					Tbouder@protonmail.com
**	@Date:					Friday April 23rd 2021
**	@Filename:				StrategyAssy.js
******************************************************************************/

import	React, {useState, useEffect}	from	'react';
import	useCurrencies			from	'contexts/useCurrencies';
import	{datediff}				from	'utils'

function	StrategyYBagHunter() {
	const	{tokenPrices, currencyNonce} = useCurrencies();

	const	[APY, set_APY] = useState(0);
	const	[result, set_result] = useState(0);
	const	[wbtcEarned, set_wbtcEarned] = useState(0);
	const	[ethToBaseCurrency, set_ethToBaseCurrency] = useState(tokenPrices['eth']?.price || 0);
	const	[btcToBaseCurrency, set_btcToBaseCurrency] = useState(tokenPrices['btc']?.price || 0);
	
	const	totalFeesEth = 0.0036848152 + 0.007288866 + 0.00225704;
	const	wBTCDeposit = 0.02;
	const	wBTCWithdraw = 0.02008961;

	useEffect(() => {
		set_ethToBaseCurrency(tokenPrices['eth']?.price || 0);
		set_btcToBaseCurrency(tokenPrices['btc']?.price || 0);
	}, [currencyNonce]);

	useEffect(() => {
		const	_result = ((wBTCWithdraw - wBTCDeposit) * btcToBaseCurrency) - (totalFeesEth * ethToBaseCurrency);
		set_result(_result);
	}, [btcToBaseCurrency, ethToBaseCurrency])

	useEffect(() => {
		const	feesCost = totalFeesEth * ethToBaseCurrency;
		const	vi = wBTCDeposit * btcToBaseCurrency;
		const	vf = (wBTCWithdraw * btcToBaseCurrency) - feesCost;

		set_APY((vf - vi) / vi * 100)
	}, [btcToBaseCurrency, ethToBaseCurrency])

	return (
		<>
			<div className={'flex flex-row justify-between items-center'}>
				<p className={'font-medium text-2xl text-white text-opacity-30 pb-6 inline'}>{'YEARN BAG HUNTER'}</p>
				<div className={'font-medium text-xs text-white text-opacity-30 pb-6'}>
					<p className={'mb-1'}>{`${datediff('04/11/2021', '04/25/2021')} jours`}</p>
					<p className={`mb-1 ${APY > 0 ? 'text-green-400' : APY < 0 ? 'text-red-400' : 'text-white'}`}>{`${(APY).toFixed(2)}%`}</p>
				</div>
			</div>

			<div className={'w-full'}>
				<p className={'text-white text-opacity-80 pb-2 border-b border-dark-400 font-medium'}>{'Crops'}</p>
				<div className={'text-white text-opacity-80 pt-2 flex flex-row w-full'}>
					<p className={'w-1/3 font-medium'}>{'☢️ wBTC : '}</p>
					<p className={'w-1/3 text-right'}>{wBTCDeposit.toFixed(4)}</p>
					<p className={'w-1/3 text-right'}>{`${(wBTCDeposit * btcToBaseCurrency).toFixed(2)} €`}</p>
				</div>
			</div>

			<div className={'w-full mt-8'}>
				<p className={'text-white text-opacity-80 pb-2 border-b border-dark-400 font-medium'}>{'Yield'}</p>
				<div className={'text-white text-opacity-80 pt-2 flex flex-row w-full'}>
					<p className={'w-1/3 font-medium'}>{'☢️ wBTC Earned : '}</p>
					<p className={'w-1/3 text-right'}>{(wBTCWithdraw - wBTCDeposit).toFixed(6)}</p>
					<p className={'w-1/3 text-right'}>{`${((wBTCWithdraw - wBTCDeposit) * btcToBaseCurrency).toFixed(2)} €`}</p>
				</div>
				<div className={'text-white text-opacity-80 pt-2 flex flex-row w-full'}>
					<p className={'w-1/3 font-medium'}>{'⛽️ FEES : '}</p>
					<p className={'w-1/3 text-right'}>{totalFeesEth.toFixed(6)}</p>
					<p className={'w-1/3 text-right'}>{`-${(totalFeesEth * ethToBaseCurrency).toFixed(2)} €`}</p>
				</div>
			</div>

			<div className={'w-full mt-auto pt-12'}>
				<p className={`text-opacity-80 font-medium text-center text-2xl ${result > 0 ? 'text-green-400' : result < 0 ? 'text-red-400' : 'text-white'}`}>
					{`${(result).toFixed(4)} €`}
				</p>
				<div className={'text-opacity-60 font-light italic text-center text-xs text-red-600'}>
					{'CLOSED'}
				</div>
			</div>

			<div className={'absolute inset-0 flex items-center justify-center bg-dark-600 bg-opacity-80 rounded-lg'}>
				<p className={'failure text-red-600 bg-dark-600 rounded text-6xl md:text-8xl'}>
					{'Failure'}
				</p>
			</div>
		</>
	)
}

export default StrategyYBagHunter;