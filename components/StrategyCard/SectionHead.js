/******************************************************************************
**	@Author:				Thomas Bouder <Tbouder>
**	@Email:					Tbouder@protonmail.com
**	@Date:					Saturday May 8th 2021
**	@Filename:				SectionHead.js
******************************************************************************/

import	React, {useState, useEffect}	from	'react';
import	Link							from	'next/link';
import	{ethers}						from	'ethers';
import	{datediff, truncateAddress}		from	'utils';
import	{getExplorer}					from	'utils/chains';
import	{MenuAlt3Icon}					from	'@heroicons/react/solid'

function	SectionHead({network, address, parameters, date, APY}) {
	const	{title, slug} = parameters;
	const	[ethAddress, set_ethAddress] = useState(truncateAddress(address));

	async function lookupAddress(_address) {
		const	provider = new ethers.providers.AlchemyProvider('homestead', process.env.ALCHEMY_KEY)
		set_ethAddress(await provider.lookupAddress(_address) || truncateAddress(_address));
	}

	useEffect(() => {lookupAddress(address);}, [address])

	return (
		<div className={'z-20 mb-3'}>
			<section aria-label={'head'}>
				<div className={'flex flex-col md:flex-row justify-between items-center w-full focus:outline-none group'}>
					<div className={'pb-6 text-left flex flex-row'}>
						<div>
							<div>
								<p className={'font-medium text-2xl text-white transition-all text-opacity-30 truncate'}>
									{title}
								</p>
							</div>
							<div className={'text-xs text-white text-opacity-30 pt-2'}>
								<a
									target={'_blank'}
									href={`https://${getExplorer(network).explorer}/address/${address}`}
									className={'transition-all hover:text-accent-900 hover:text-opacity-100 hover:underline'}
									rel={'noreferrer'}>
									{ethAddress}
								</a>
								&nbsp; &ndash;	&nbsp;
								<p className={'inline mb-1'}>{`For ${datediff(date)} days, earning `}</p>
								<p className={`inline font-medium mb-1 ${APY > 0 ? 'text-green-400' : APY < 0 ? 'text-red-400' : 'text-white'}`}>{`${(APY).toFixed(2)}%`}</p>
							</div>
						</div>
					</div>
					<Link href={`/strategies/${slug}`} passHref className={''}>
						<button
							type={'button'}
							className={'flex flex-row items-center justify-center px-2 py-2 leading-4 font-normal rounded-md text-xs border border-white border-opacity-5 bg-dark-400 bg-opacity-40 hover:bg-dark-300 mr-2 mb-2 text-white text-opacity-30 group-hover:text-opacity-90 transition-opacity'}
						>
							<span className={''}>{'Details'}</span>
							<MenuAlt3Icon className={'ml-2 h-5 w-5'} aria-hidden={'true'} />
						</button>
					</Link>
				</div>
			</section>
		</div>
	)
}

export default SectionHead;