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
							<img className={'h-12'} src={'./protocols/yearn.svg'} alt={'Yearn Finance'} />
						</div>
					</a>
					<a href={'https://curve.fi/'} target={'_blank'} rel={'noreferrer'}>
						<div className={'col-span-1 flex justify-center md:col-span-2 lg:col-span-1 items-center opacity-60 hover:opacity-100 cursor-pointer'}>
							<img className={'h-12'} src={'./protocols/curve.svg'} alt={'Curve Fi'} />
						</div>
					</a>
					<a href={'https://aave.com/'} target={'_blank'} rel={'noreferrer'}>
						<div className={'col-span-1 flex justify-center md:col-span-2 lg:col-span-1 items-center opacity-60 hover:opacity-100 transition-opacity cursor-pointer'}>
							<img className={'h-12'} src={'./protocols/compound.svg'} alt={'Compound'} />
						</div>
					</a>
					<a href={'https://compound.finance/'} target={'_blank'} rel={'noreferrer'}>
						<div className={'col-span-1 flex justify-center md:col-span-3 lg:col-span-1 items-center opacity-60 hover:opacity-100 transition-opacity cursor-pointer'}>
							<img className={'h-10'} src={'./protocols/aave.svg'} alt={'AAVE'} />
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

const faqs = [
	{
		id: 1,
		question: 'What is Major\'s Farm ?',
		answer: (
			<p>
				{'It\'s a place where you can track some of your move related to yield farming in the DeFI ecosystem because if it\'s easy to get your yield, it\'s difficult to find the actual cost of your move, between impermanent loss, gas fees, gouv tokens etc.'}
			</p>
		),
	},
	{
		id: 2,
		question: 'Does this even works ?',
		answer: (
			<p>
				{'Yeah, maybe. Each strategy has been tested with a few addresses but it\'s not bulletproof. Feel free to '}<a href={'https://github.com/TBouder/major.farm/issues'} target={'_blank'} rel={'noreferrer'}>{'report any issue'}</a> {'you may find !'}
			</p>
		),
	},
	{
		id: 3,
		question: 'Where do you get the transactions ?',
		answer: (
			<p>
				{'When you add a new strategy to your farm, we try to retrieve all the related transaction from '}<a href={'https://etherscan.io/'} target={'_blank'} rel={'noreferrer'}>{'Etherscan'}</a>{'. They are then saved in your localStorage.'}
			</p>
		),
	},
	{
		id: 4,
		question: 'What do you do with my data',
		answer: (
			<p>
				{'What data ? There is no backend/db, and the '}<a href={'https://vercel.com/analytics'} target={'_blank'} rel={'noreferrer'}>{'only cookie used'}</a> {'is one that indicates how long it takes to render the page (the speed of the app).'}
			</p>
		),
	},
	{
		id: 5,
		question: 'Where do you get the prices ?',
		answer: (
			<p>
				{'The prices are mostly fetched from the '}<a href={'https://www.coingecko.com/en/api'} target={'_blank'} rel={'noreferrer'}>{'Coingecko API'}</a>{', but we also query the '}<a href={'https://curve.readthedocs.io/'} target={'_blank'} rel={'noreferrer'}>{'Curve SmartContract'}</a>{' for the CRV LP tokens, and from the '}<a href={'https://api.thegraph.com/subgraphs/name/zippoxer/sushiswap-subgraph-fork'} target={'_blank'} rel={'noreferrer'}>{'SushiSwap SubGraph'}</a> {'for the Sushi LP tokens !'}
			</p>
		),
	},
]
  
function FAQ() {
	return (
		<div>
			<div className={'max-w-7xl mx-auto py-16 px-4 sm:py-24 sm:px-6 lg:px-8'}>
				<h2 className={'text-3xl font-extrabold text-white text-opacity-75 text-center'}>{'Frequently asked questions'}</h2>
				<div className={'mt-12'}>
					<dl className={'space-y-10 md:space-y-0 md:grid md:grid-cols-2 md:grid-rows-2 md:gap-x-8 md:gap-y-12 lg:grid-cols-3'}>
						{faqs.map((faq) => (
							<div key={faq.id}>
								<span>
									<dt className={'inline text-lg leading-6 font-bold text-accent-900'}>{`${faq.id}. `}</dt>
									<dt className={'inline text-lg leading-6 font-medium text-white text-opacity-75'}>{faq.question}</dt>
								</span>
								<dd className={'mt-2 text-base text-gray-400 prose-accent prose-lg'}>{faq.answer}</dd>
							</div>
						))}
					</dl>
				</div>
			</div>
		</div>
	)
}
  
function Banner() {
	return (
		<div>
			<div className={'relative sm:py-16'}>
				<div aria-hidden={'true'} className={'hidden sm:block'}>
					<svg className={'absolute top-8 left-1/2 -ml-3'} width={404} height={392} fill={'none'} viewBox={'0 0 404 392'}><defs><pattern id={'8228f071-bcee-4ec8-905a-2a059a2cc4fb'} x={0} y={0} width={20} height={20} patternUnits={'userSpaceOnUse'}><rect x={0} y={0} width={4} height={4} className={'text-dark-600'} fill={'currentColor'} /></pattern></defs><rect width={404} height={392} fill={'url(#8228f071-bcee-4ec8-905a-2a059a2cc4fb)'} /></svg>
				</div>
				<div className={'mx-auto max-w-md px-4 sm:max-w-3xl sm:px-6 lg:max-w-7xl lg:px-8'}>
					<div className={'relative rounded-2xl px-6 py-10 bg-accent-900 overflow-hidden shadow-xl sm:px-12'}>
						<div aria-hidden={'true'} className={'absolute inset-0 -mt-72 sm:-mt-32 md:mt-0'}>
							<svg className={'absolute inset-0 h-full w-full'} preserveAspectRatio={'xMidYMid slice'} xmlns={'http://www.w3.org/2000/svg'} fill={'none'} viewBox={'0 0 1463 360'}><path className={'text-accent-500 text-opacity-40'} fill={'currentColor'} d={'M-82.673 72l1761.849 472.086-134.327 501.315-1761.85-472.086z'}/><path className={'text-accent-600 text-opacity-40'} fill={'currentColor'} d={'M-217.088 544.086L1544.761 72l134.327 501.316-1761.849 472.086z'}/></svg>
						</div>
						<div className={'relative'}>
							<div className={'sm:text-center'}>
								<h2 className={'text-3xl font-extrabold text-white tracking-tight sm:text-4xl'}>
									{'Start planting seeds now.'}
								</h2>
								<p className={'mt-6 mx-auto max-w-2xl text-lg text-white'}>
									{'Some people say that money does not grow on trees. That may be true. But not on your farm.'}
								</p>
							</div>
							<div className={'mt-8 mx-auto flex justify-center'}>
								<div className={'mt-4 sm:mt-0 sm:ml-3'}>
									<Link href={'/app'}>
										<button
											className={'block w-full rounded-md px-5 py-3 bg-white text-base font-medium text-accent-900 shadow hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-accent-900 sm:px-10'}>
											{'Visit your farm'}
										</button>
									</Link>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
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
				<div className={'mx-auto max-w-7xl w-full pt-8 pb-10 text-center lg:py-24 lg:text-left'}>
					<div className={'px-4 lg:w-1/2 sm:px-8 xl:pr-16'}>
						<h1 className={'text-4xl tracking-tight font-extrabold text-white sm:text-5xl md:text-6xl lg:text-5xl xl:text-6xl'}>
							<span className={'block xl:inline'}>{'Plant your seeds and'}</span>{' '}
							<span className={'block text-accent-900 xl:inline'}>{'let them grow'}</span>
						</h1>
						<p className={'mt-3 max-w-md mx-auto text-lg text-gray-400 sm:text-xl md:mt-5 md:max-w-3xl'}>
							{'Yearn, Compound, AAVE, Curve ... There is a lot of fertilizer out there. Just try some of them, watch your seeds grow and harvest your yields when you are profitable !'}
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
						src={'/grow.json'}
						className={'absolute inset-0 w-full h-full object-cover'} />
				</div>
			</main>

			<div className={'w-full border-b border-dark-600 my-12'}>
			</div>

			<Protocols />

			<Features />

			<Banner />

			<FAQ />
		</div>
	);
}

export default Index;
