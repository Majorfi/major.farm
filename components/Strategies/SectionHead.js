/******************************************************************************
**	@Author:				Thomas Bouder <Tbouder>
**	@Email:					Tbouder@protonmail.com
**	@Date:					Saturday May 8th 2021
**	@Filename:				SectionHead.js
******************************************************************************/

import	React					from	'react';
import	{useState, useEffect}	from	'react';
import	{ethers}				from	'ethers';
import	{datediff}				from	'utils';
import	{getExplorer}			from	'utils/chains';

function	SectionHead({network, title, href, address, date, APY}) {
	const	[ethAddress, set_ethAddress] = useState(address);

	useEffect(async () => {
		const	provider = new ethers.providers.AlchemyProvider('homestead', process.env.ALCHEMY_KEY)
		set_ethAddress(await provider.lookupAddress(address) || address);
	}, [address])

	return (
		<section
			aria-label={'head'}
			className={'flex flex-row justify-between items-center'}>
			<div className={'pb-6'}>
				<div>
					<a
						target={'_blank'}
						href={href}
						className={'font-medium text-2xl text-white text-opacity-30 transition-opacity hover:text-opacity-100'}
						rel={'noreferrer'}>
						{title}
					</a>
				</div>
				<a
					target={'_blank'}
					href={`https://${getExplorer(network).explorer}/address/${address}`}
					className={'text-xs text-white text-opacity-30 transition-all hover:text-accent-900 hover:text-opacity-100 hover:underline'}
					rel={'noreferrer'}>
					{ethAddress}
				</a>
			</div>
			<div className={'font-medium text-xs text-white text-opacity-30 pb-6'}>
				<p className={'mb-1'}>{`${datediff(date)} days`}</p>
				<p className={`mb-1 ${APY > 0 ? 'text-green-400' : APY < 0 ? 'text-red-400' : 'text-white'}`}>{`${(APY).toFixed(2)}%`}</p>
			</div>
		</section>
	)
}

export default SectionHead;