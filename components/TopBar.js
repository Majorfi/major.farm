/******************************************************************************
**	@Author:				Thomas Bouder <Tbouder>
**	@Email:					Tbouder@protonmail.com
**	@Date:					Monday June 14th 2021
**	@Filename:				TopBar.js
******************************************************************************/

import	React, {useState}				from	'react';
import	Image							from	'next/image';
import	Link							from	'next/link';
import	useCurrencies					from	'contexts/useCurrencies';
import	useWeb3							from	'contexts/useWeb3';
import	LoginModal						from	'components/Modals/LoginModal';

function	Currency() {
	const	{switchCurrency, baseCurrency} = useCurrencies();
	return (
		<div
			className={'ml-4 pl-4 text-dark-100 hover:text-accent-900 transition-colors cursor-pointer font-medium text-md flex flex-row items-center md:border-l border-dark-600 border-opacity-100'}
			onClick={() => switchCurrency()}>
			<h2>{baseCurrency === 'eur' ? '€' : '$'}</h2>
		</div>
	)
}

function	Header({set_strategyModal}) {
	const	{address, ens, active, deactivate, onDesactivate} = useWeb3();
	const	[open, set_open] = useState(false);

	function	renderWallet() {
		if (ens) {
			return (
				<span className={'whitespace-nowrap text-white-95'}>
					{ens}
				</span>
			);
		} else if (address) {
			return (
				<span className={'whitespace-nowrap text-white-95'}>
					{`${address.slice(0, 4)}...${address.slice(-4)}`}
				</span>
			);
		} else if (active) {
			return (
				<span className={'whitespace-nowrap text-white-95 italic'}>
					{'Fetching information ...'}
				</span>
			);	
		}
		return (
			<span className={'whitespace-nowrap text-white-95'}>
				{'Connect a wallet'}
			</span>
		);
	}

	return (
		<div className={'bg-dark-600 py-6 -mx-4 md:-mx-12 -mt-12 px-4 md:px-12 bg-opacity-30'}>
			<div className={'flex flex-row justify-between items-center'}>
				<Link href={'/'}>
					<div className={'flex flex-row items-center text-white cursor-pointer'}>
						<div>
							<Image src={'/sprout.svg'} width={30} height={30} />
						</div>
						<div className={'ml-4'}>
							<p className={'font-semibold text-xl text-white'}>{'Major\'s Farm'}</p>
							<p className={'font-normal text-sm text-white text-opacity-60 md:block hidden'}>{'A degen loss calculator'}</p>
						</div>
					</div>
				</Link>
				<div className={'flex flex-row items-center'}>
					<div
						className={'text-dark-100 hover:text-accent-900 transition-colors cursor-pointer font-medium text-md hidden md:flex flex-row items-center'}
						style={{marginLeft: 'auto'}}
						onClick={() => set_strategyModal(true)}>
						<svg className={'mr-1 h-5 w-5'} xmlns={'http://www.w3.org/2000/svg'} viewBox={'0 0 20 20'} fill={'currentColor'} aria-hidden={'true'}>
							<path fillRule={'evenodd'} d={'M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z'} clipRule={'evenodd'} />
						</svg>
						<h2>{'Add strategy'}</h2>
					</div>
					<Currency />
					<button
						suppressHydrationWarning
						onClick={() => {
							if (active) {
								deactivate();
								onDesactivate();
							} else {
								set_open(!open);
							}
						}}
						type={'button'}
						className={'ml-8 inline-flex px-4 py-2 items-center shadow-md leading-4 font-normal rounded-md text-xs border border-white border-opacity-10 bg-dark-400 hover:bg-dark-300 overflow-auto focus:outline-none overflow-y-hidden'}
						id={'options-menu'}
						aria-expanded={'true'}
						aria-haspopup={'true'}>
						{renderWallet()}
					</button>
				</div>
			</div>
			<LoginModal open={open} set_open={set_open} />
		</div>
	)
}

export default Header;
