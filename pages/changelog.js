/******************************************************************************
**	@Author:				Thomas Bouder <Tbouder>
**	@Email:					Tbouder@protonmail.com
**	@Date:					Friday January 22nd 2021
**	@Filename:				prices.js
******************************************************************************/

import	React, {useEffect, useRef}	from	'react';
import	Link						from	'next/link';


function	ChangeItem({date, version, content, inProgress = false}) {
	return (
		<li>
			<div className={'relative pb-8'}>
				<span className={'absolute top-4 left-4 -ml-px h-full w-0.5 bg-dark-600'} aria-hidden={'true'} />
				<div className={'relative flex space-x-3'}>
					<div>
						{inProgress ?
							<span className={'h-8 w-8 rounded-full bg-gray-400 flex items-center justify-center ring-8 ring-dark-600 text-dark-600'}>
								<svg className={'h-5 w-5 text-dark-600'} xmlns={'http://www.w3.org/2000/svg'} viewBox={'0 0 24 24'} fill={'none'} stroke={'currentColor'} aria-hidden={'true'}><path strokeLinecap={'round'} strokeLinejoin={'round'} strokeWidth={'2'} d={'M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15'} /></svg>
							</span> :
							<span className={'h-8 w-8 rounded-full bg-accent-900 flex items-center justify-center ring-8 ring-dark-600 text-dark-600'}>
								<svg className={'h-5 w-5 text-dark-600'} xmlns={'http://www.w3.org/2000/svg'} viewBox={'0 0 20 20'} fill={'currentColor'} aria-hidden={'true'}><path fillRule={'evenodd'} d={'M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z'} clipRule={'evenodd'} />
								</svg>
							</span>}
					</div>
					<div className={'min-w-0 pt-1.5 flex justify-between'}>
						<div className={'prose prose-accent'} style={{width: '100%', maxWidth: '100%'}}>
							<div className={'items-center'}>
								<h6 className={'text-sm font-semibold pl-4 text-white'}>
									{version}
									<span className={'text-xs text-gray-400 font-normal pl-4'}>
										<time dateTime={date}>{date ? new Date(date).toLocaleDateString() : ''}</time>
									</span>
								</h6>
							</div>
							{content}
						</div>
					</div>
				</div>
			</div>
		</li>
	)
}

function	Changelog() {
	return (
		<div className={'flow-root'}>
			<ul className={'-mb-8'}>
				<ChangeItem
					inProgress
					date={''}
					version={'1.0.0'}
					content={
						<ul>
							<li className={'text-base text-gray-200'}>
								{'Working on Yearn V2 + CRV Vaults strategies.'}
							</li>
							<li className={'text-base text-gray-200'}>
								{'Working on AAVE strategies'}
							</li>
							<li className={'text-base text-gray-200'}>
								{'Working on Compound strategies.'}
							</li>
							<li className={'text-base text-gray-200'}>
								{'Working on Curve strategies.'}
							</li>
							<li className={'text-base text-gray-200'}>
								{'Working to deploy on IPFS.'}
							</li>
						</ul>
					} />

				<ChangeItem
					date={'2021-06-26'}
					version={'0.1.2'}
					content={
						<ul>
							<li className={'text-base text-gray-200'}>
								{'Upgrading the strategy for Yearn from v0 to v1 (same as ape.tax). Experimental, but should work for the standard V2 Vaults.'}
							</li>
							<li className={'text-base text-gray-200'}>
								{'Updating the homepage on the analytics to talk about the '}<a href={'https://plausible.io/major.farm'} target={'_blank'} rel={'noreferrer'}>{'Plausible analytics'}</a>{' we are using for Major.farm'}
							</li>
						</ul>
					} />
				<ChangeItem
					date={'2021-06-25'}
					version={'0.1.1'}
					content={
						<ul>
							<li className={'text-base text-gray-200'}>
								{'Updating the ape.tax strategies with '}<a href={'https://ape.tax/tiedtyler'} target={'_blank'} rel={'noreferrer'}>{'Tied Tyler 🕴🪢'}</a>{' on Fantom.'}
							</li>
							<li className={'text-base text-gray-200'}>
								{'Updating the ape.tax strategies with '}<a href={'https://ape.tax/splitcameron'} target={'_blank'} rel={'noreferrer'}>{'Split Cameron 🕴🖖'}</a>{' on Fantom.'}
							</li>
							<li className={'text-base text-gray-200'}>
								{'The top banner is now displaying an overview of your position'}
							</li>
						</ul>
					} />

				<ChangeItem
					date={'2021-06-15'}
					version={'0.1.0'}
					content={
						<ul>
							<li className={'text-base text-gray-200'}>
								{'Adding support for your wallet. You can now connect your '}<a href={'https://metamask.io/'} target={'_blank'} rel={'noreferrer'}>{'Metamask'}</a>{' or mobile wallet (with '}<a href={'https://walletconnect.org/'} target={'_blank'} rel={'noreferrer'}>{'WalletConnect'}</a>{'). Once implemented, you will be able to interact with strategies directly from the Major\'s Farm !'}
							</li>
							<li className={'text-base text-gray-200'}>
								{'Adding a feature to fetch all your ape.tax strategies, based on your wallet transactions.'}
							</li>
							<li className={'text-base text-gray-200'}>
								{'Quick strategy card redesign.'}
							</li>
							<li className={'text-base text-gray-200'}>
								{'Adding the details button for the strategies, to access some information (fees, author, limit) and, once implemented, perform actions with theses strategies.'}
							</li>
							<li className={'text-base text-gray-200'}>
								{'Adding a banner for some quick actions, including adding a strategy, auto-detecting strategies and refreshing strategies.'}
							</li>
						</ul>
					} />

				<ChangeItem
					date={'2021-06-12'}
					version={'0.0.4'}
					content={
						<ul>
							<li className={'text-base text-gray-200'}>
								{'Updating the ape.tax strategies with '}<a href={'https://ape.tax/dollarstorebento'} target={'_blank'} rel={'noreferrer'}>{'Dollar Store Bento 💵🍱'}</a>{' on Polygon.'}
							</li>
							<li className={'text-base text-gray-200'}>
								{'Updating the ape.tax strategies with '}<a href={'https://ape.tax/matic-idle-dai'} target={'_blank'} rel={'noreferrer'}>{'Matic\'s Magic Idle DAI 🏆🚀'}</a>{' on Polygon.'}
							</li>
						</ul>
					} />

				<ChangeItem
					date={'2021-06-11'}
					version={'0.0.3'}
					content={
						<ul>
							<li className={'text-base text-gray-200'}>
								{'Adding the chain selection when adding a new strategy'}
							</li>
							<li className={'text-base text-gray-200'}>
								{'Updating the ape.tax strategies with '}<a href={'https://ape.tax/ftm_woofy'} target={'_blank'} rel={'noreferrer'}>{'FTM\'s Wandering Woofy 🧭🐶'}</a>{' on Fantom.'}
							</li>
							<li className={'text-base text-gray-200'}>
								{'Updating the ape.tax strategies with '}<a href={'https://ape.tax/spooky'} target={'_blank'} rel={'noreferrer'}>{'Spooky Skeletons 🙀👻'}</a>{' on Fantom.'}
							</li>
							<li className={'text-base text-gray-200'}>
								{'Updating the ape.tax strategies with '}<a href={'https://ape.tax/ftmfrappedape'} target={'_blank'} rel={'noreferrer'}>{'FTM\'s Frapped Ape ☕️🦧'}</a>{' on Fantom.'}
							</li>
							<li className={'text-base text-gray-200'}>
								{'Updating the ape.tax strategies with '}<a href={'https://ape.tax/fantombaby'} target={'_blank'} rel={'noreferrer'}>{'Fantom\'s Ape Ape Baby 🧊👶'}</a>{' on Fantom.'}
							</li>
							<li className={'text-base text-gray-200'}>
								{'Updating the ape.tax strategies with '}<a href={'https://ape.tax/fantomsfury'} target={'_blank'} rel={'noreferrer'}>{'Fantom\'s Fury 👻⚡'}</a>{' on Fantom.'}
							</li>
							<li className={'text-base text-gray-200'}>
								{'Adding Fantom support for the ape.tax strategies.'}
							</li>
							<li className={'text-base text-gray-200'}>
								{'Merging the lists for Yearn V1 & Yearn V2'}
							</li>
							<li className={'text-base text-gray-200'}>
								{'Updating the ape.tax strategies with '}<a href={'https://ape.tax/purpletwister'} target={'_blank'} rel={'noreferrer'}>{'Purple Twister 🟣🧬'}</a>{' on Polygon.'}
							</li>
							<li className={'text-base text-gray-200'}>
								{'Updating the ape.tax strategies with '}<a href={'https://ape.tax/matic_woofy'} target={'_blank'} rel={'noreferrer'}>{'Matic\'s Wandering Woofy 🧭🐶'}</a>{' on Polygon.'}
							</li>
							<li className={'text-base text-gray-200'}>
								{'Adding Polygon support for the ape.tax strategies.'}
							</li>
							<li className={'text-base text-gray-200'}>
								{'Updating the ape.tax strategies with '}<a href={'https://ape.tax/ultrasoundmoney'} target={'_blank'} rel={'noreferrer'}>{'Wrapped Ultra Sound Money 🦇🔊'}</a>{'.'}
							</li>
						</ul>
					} />
				<ChangeItem
					date={'2021-05-25'}
					version={'0.0.2'}
					content={
						<ul>
							<li className={'text-base text-gray-200'}>
								{'Integration of '}<a href={'https://ens.domains/'} target={'_blank'} rel={'noreferrer'}>{'Ethereum Name Service (ENS)'}</a>{' on the address selection and on the strategy card'}
							</li>
							<li className={'text-base text-gray-200'}>
								{'Creation of the new landing page.'}
							</li>
							<li className={'text-base text-gray-200'}>
								{'Updating the ape.tax strategies with '}<a href={'https://ape.tax/frogprince'} target={'_blank'} rel={'noreferrer'}>{'The Frog Prince 🐸💋'}</a>{'.'}
							</li>
							<li className={'text-base text-gray-200'}>
								{'Adding the Yearn V2 Vaults strategies.'}
							</li>
							<li className={'text-base text-gray-200'}>
								{'Adding the Yearn V1 + CRV Vaults strategies.'}
							</li>
							<li className={'text-base text-gray-200'}>
								{'Adding the Yearn V1 Vaults strategies.'}
							</li>
							<li className={'text-base text-gray-200'}>
								{'Updating the ape.tax strategies with '}<a href={'https://ape.tax/complifiusdc'} target={'_blank'} rel={'noreferrer'}>{'Comfi Carousel 🛋🎠'}</a>{'.'}
							</li>
						</ul>
					} />
				<ChangeItem
					date={'2021-05-10'}
					version={'0.0.1'}
					content={
						<ul>
							<li className={'text-base text-gray-200'}>
								{'Setup the UI/UX to add a new strategy'}
							</li>
							<li className={'text-base text-gray-200'}>
								{'Setup the APE strategy to handle the basic strategies from '}<a href={'https://ape.tax'} target={'_blank'} rel={'noreferrer'}>{'ape.tax'}</a>{'.'}
							</li>
							<li className={'text-base text-gray-200'}>
								{'Test with the Badger WBTC & Yearn yvBoost strategies.'}
							</li>
							<li className={'text-base text-gray-200'}>
								{'Setup of the "useCurrency" context to handle the countervalues (fiat <-> crypto) and fetch them every minutes thanks to the '}<a href={'https://www.coingecko.com/en/api'} target={'_blank'} rel={'noreferrer'}>{'Coingecko API'}</a>{'.'}
							</li>
							<li className={'text-base text-gray-200'}>
								{'Project configuration with NextJS, Vercel and Github.'}
							</li>
						</ul>
					} />


				<li>
					<div className={'relative pb-8'}>
						<div className={'relative flex space-x-3'}>
							<div>
								<span className={'h-8 w-8 rounded-full bg-accent-900 flex items-center justify-center ring-8 ring-dark-600 text-dark-600'}>
									<svg className={'h-5 w-5 text-dark-600'} xmlns={'http://www.w3.org/2000/svg'} viewBox={'0 0 24 24'} fill={'none'} stroke={'currentColor'} aria-hidden={'true'}><path strokeLinecap={'round'} strokeLinejoin={'round'} strokeWidth={'2'} d={'M21 15.546c-.523 0-1.046.151-1.5.454a2.704 2.704 0 01-3 0 2.704 2.704 0 00-3 0 2.704 2.704 0 01-3 0 2.704 2.704 0 00-3 0 2.704 2.704 0 01-3 0 2.701 2.701 0 00-1.5-.454M9 6v2m3-2v2m3-2v2M9 3h.01M12 3h.01M15 3h.01M21 21v-7a2 2 0 00-2-2H5a2 2 0 00-2 2v7h18zm-3-9v-2a2 2 0 00-2-2H8a2 2 0 00-2 2v2h12z'} /></svg>
								</span>
							</div>
							<div className={'min-w-0 pt-1.5 flex justify-between'}>
								<div className={'prose prose-accent'} style={{width: '100%', maxWidth: '100%'}}>
									<div className={'items-center'}>
										<h6 className={'text-sm font-semibold pl-4 text-white'}>
											{'0.0.0'}
											<span className={'text-xs text-gray-400 font-normal pl-4'}>
												<time dateTime={'2021-04-23'}>{new Date('2021-04-23').toLocaleDateString()}</time>
											</span>
										</h6>
									</div>
								</div>
							</div>
						</div>
					</div>
				</li>
			</ul>
		</div>
	);
}


function	ChangelogWrapper() {
	const	lottieRef = useRef(null);

	useEffect(() => {
		import('@lottiefiles/lottie-player');
	});

	return (
		<div>
			<main className={'lg:relative lg:h-xxl'}>
				<div className={'mx-auto max-w-7xl w-full pt-8 pb-10 text-center lg:py-24 lg:text-left'}>
					<div className={'px-4 lg:w-1/2 sm:px-8 xl:pr-16'}>
						<div className={''}>
							<Link passHref href={'/'}>
								<div className={'flex flex-row items-center -mt-4 mb-4 text-dark-200 cursor-pointer space-x-2 hover:text-accent-900 hover:underline transition-colors'}>
									<svg xmlns={'http://www.w3.org/2000/svg'} className={'h-4 w-4'} fill={'none'} viewBox={'0 0 24 24'} stroke={'currentColor'}><path strokeLinecap={'round'} strokeLinejoin={'round'} strokeWidth={2} d={'M15 19l-7-7 7-7'} /></svg>
									<p className={'text-base font-medium'}>
										{'Back to homepage'}
									</p>
								</div>
							</Link>
						</div>
						<h1 className={'text-4xl tracking-tight font-extrabold text-white sm:text-5xl md:text-6xl lg:text-5xl xl:text-6xl'}>
							<span className={'block xl:inline'}>{'It ain\'t much, '}</span>{' '}
							<span className={'block text-accent-900 xl:inline'}>{'it\'s honest work'}</span>
						</h1>
						<p className={'mt-3 max-w-md mx-auto text-lg text-gray-400 sm:text-xl md:mt-5 md:max-w-3xl'}>
							{'Yeah, we are working on this, and just for you, here is a little changelog !'}
						</p>
						<div className={'mt-10 sm:flex sm:justify-center lg:justify-start items-center'}>
							<div className={'rounded-md shadow'}>
								<Link passHref href={'/app'}>
									<div className={'w-full flex items-center justify-center px-8 py-3 text-base font-medium rounded-md text-white bg-accent-900 hover:bg-accent-800 md:py-4 md:text-lg md:px-10 cursor-pointer'}>
										{'Visit your farm'}
									</div>
								</Link>
							</div>
						</div>
					</div>
				</div>
				<div className={'relative w-full h-64 sm:h-72 md:h-96 lg:absolute lg:inset-y-0 lg:right-0 lg:w-1/2 lg:h-full xs:hidden sm:hidden md:hidden lg:flex'}>
					<lottie-player
						ref={lottieRef}
						autoplay
						loop
						mode={'normal'}
						src={'/changelog.json'}
						className={'absolute inset-0 w-full h-full object-cover'} />
				</div>
			</main>

			<div className={'w-full border-b border-dark-600 my-12'}>
			</div>
			<div className={'max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8'}>
				<Changelog />
			</div>
		</div>
	);
}


export default ChangelogWrapper;