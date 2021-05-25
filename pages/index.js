/******************************************************************************
**	@Author:				Thomas Bouder <Tbouder>
**	@Email:					Tbouder@protonmail.com
**	@Date:					Monday January 4th 2021
**	@Filename:				index.js
******************************************************************************/

import	React, {useEffect, useRef}	from	'react';
import	Link						from	'next/link';

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
						<p className={'mt-3 max-w-md mx-auto text-lg text-gray-500 sm:text-xl md:mt-5 md:max-w-3xl'}>
							{'Yearn, Compound, AAVE, Curve ... There is a lot of fertilizer out there. Just try some of them, watch your seeds grow and harvest your yields when you are profitable !'}
						</p>
						<div className={'mt-10 sm:flex sm:justify-center lg:justify-start'}>
							<div className={'rounded-md shadow'}>
								<Link passHref href={'/app'}>
									<div className={'w-full flex items-center justify-center px-8 py-3 text-base font-medium rounded-md text-white bg-accent-900 hover:bg-accent-800 md:py-4 md:text-lg md:px-10 cursor-pointer'}>
										{'Visit my farm'}
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
		</div>
	);
}

export default Index;
