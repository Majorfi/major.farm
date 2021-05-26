/******************************************************************************
**	@Author:				Thomas Bouder <Tbouder>
**	@Email:					Tbouder@protonmail.com
**	@Date:					Monday January 4th 2021
**	@Filename:				index.js
******************************************************************************/

import	React, {useEffect, useRef}	from	'react';
import	Link						from	'next/link';

function Protocols() {
	return (
		<div>
			<div className={'max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8'}>
				<div className={'grid grid-cols-2 gap-8 md:grid-cols-4 lg:grid-cols-4'}>
					<a href={'https://yearn.finance/'} target={'_blank'} rel={'noreferrer'}>
						<div className={'col-span-1 flex justify-center md:col-span-2 lg:col-span-1 items-center opacity-60 hover:opacity-100 transition-opacity cursor-pointer'}>
							<img className={'h-12'} src={'/protocols/yearn.svg'} alt={'Yearn Finance'} />
						</div>
					</a>
					<a href={'https://curve.fi/'} target={'_blank'} rel={'noreferrer'}>
						<div className={'col-span-1 flex justify-center md:col-span-2 lg:col-span-1 items-center opacity-60 hover:opacity-100 cursor-pointer'}>
							<img className={'h-12'} src={'/protocols/curve.svg'} alt={'Curve Fi'} />
						</div>
					</a>
					<a href={'https://aave.com/'} target={'_blank'} rel={'noreferrer'}>
						<div className={'col-span-1 flex justify-center md:col-span-2 lg:col-span-1 items-center opacity-60 hover:opacity-100 transition-opacity cursor-pointer'}>
							<img className={'h-12'} src={'/protocols/compound.svg'} alt={'Compound'} />
						</div>
					</a>
					<a href={'https://compound.finance/'} target={'_blank'} rel={'noreferrer'}>
						<div className={'col-span-1 flex justify-center md:col-span-3 lg:col-span-1 items-center opacity-60 hover:opacity-100 transition-opacity cursor-pointer'}>
							<img className={'h-10'} src={'/protocols/aave.svg'} alt={'AAVE'} />
						</div>
					</a>
				</div>
			</div>
		</div>
	)
}

function Features() {
	const features = [
		{
			title: 'The Farming Landscape is Changing',
			illustration: 'https://images.unsplash.com/photo-1499529112087-3cb3b73cec95?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80',
			desc: 'Digital seeds are at the center of several trends reshaping the farming landscape, particularly new crops availabilities, an updated fertilising paradigm, and evolving farming techniques.',
		},
		{
			title: 'Our World may be a Farming Simulation',
			illustration: 'https://images.unsplash.com/photo-1462690417829-5b41247f6b0e?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80',
			desc: 'Much like the farmers did decades ago, the yield farming is radically transforming legacy crops systems around the field.',
		},
		{
			title: 'Crops Diversification is Key',
			illustration: 'https://images.unsplash.com/photo-1464226184884-fa280b87c399?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80',
			desc: 'Allocating seeds across different fields and soil – from Loam soil to Silty Clay soil to dirt – allows farmers to diversify their yields. In turn, this can help farmers lower their risk and generate higher returns.',
		}
	]

	return (
		<div className={'max-w-screen-2xl mx-auto py-12 px-4 sm:px-6 lg:px-8 mt-12'}>
			<ul className={'space-y-12 sm:grid grid-cols-1 md:grid-cols-1 lg:grid-cols-3 sm:gap-x-6 sm:gap-y-12 sm:space-y-0 lg:gap-x-12'}>
				{features.map((feature) => (
					<li key={feature.title}>
						<div className={'space-y-4'}>
							<div className={'aspect-w-4 aspect-h-2'}>
								<img className={'object-cover shadow-lg rounded-lg'} src={feature.illustration} alt={''} />
							</div>
							<div className={'leading-6'}>
								<h3 className={'text-white text-opacity-80 text-3xl font-bold'}>{feature.title}</h3>
							</div>
							<div className={'text-xl'}>
								<p className={'text-gray-400'}>{feature.desc}</p>
							</div>
						</div>
					</li>
				))}
			</ul>
		</div>
	)
}

function	Index() {
	const	lottieRef = useRef(null);

	useEffect(() => {
		import('@lottiefiles/lottie-player');
	});

	return (
		<div>
			<main className={'lg:relative'}>
				<div className={'mx-auto max-w-7xl w-full pt-16 pb-20 text-center lg:py-48 lg:text-left'}>
					<div className={'px-4 lg:w-1/2 sm:px-8 xl:pr-16'}>
						<h1 className={'text-4xl tracking-tight font-extrabold text-white sm:text-5xl md:text-6xl lg:text-5xl xl:text-6xl'}>
							<span className={'block xl:inline'}>{'Plant your seeds and'}</span>{' '}
							<span className={'block text-accent-900 xl:inline'}>{'let them grow'}</span>
						</h1>
						<p className={'mt-3 max-w-md mx-auto text-lg text-gray-400 sm:text-xl md:mt-5 md:max-w-3xl'}>
							{'Yearn, Compound, AAVE, Curve ... There is a lot of fertilizer out there. Just try some of them, watch your seeds grow and harvest your yields when you are profitable !'}
						</p>
						<div className={'mt-10 sm:flex sm:justify-center lg:justify-start'}>
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
				<div className={'relative w-full h-64 sm:h-72 md:h-96 lg:absolute lg:inset-y-0 lg:right-0 lg:w-1/2 lg:h-full'}>
					<lottie-player
						ref={lottieRef}
						autoplay
						loop
						mode={'normal'}
						src={'/grow.json'}
						className={'absolute inset-0 w-full h-full object-cover'} />
				</div>
			</main>

			<div className={'w-full border-b border-dark-600 my-12'}>
			</div>

			<Protocols />

			<Features />
		</div>
	);
}

export default Index;
