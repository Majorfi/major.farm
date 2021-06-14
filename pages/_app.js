/******************************************************************************
**	@Author:				Thomas Bouder <Tbouder>
**	@Email:					Tbouder@protonmail.com
**	@Date:					Wednesday August 26th 2020
**	@Filename:				_app.js
******************************************************************************/

import	React						from	'react';
import	NProgress					from	'nprogress';
import	Router						from	'next/router';
import	Head						from	'next/head';
import	Link						from	'next/link';
import	{ToastProvider}				from	'react-toast-notifications';
import	{CurrenciesContextApp}		from	'contexts/useCurrencies';
import	{StrategiesContextApp}		from	'contexts/useStrategies';
import	{Web3ContextApp}			from	'contexts/useWeb3';
import	{Web3ReactProvider}			from	'@web3-react-fork/core';
import	{ethers}					from	'ethers';

import	'style/Default.css'
import	'tailwindcss/tailwind.css';

Router.events.on('routeChangeStart', () => NProgress.start());
Router.events.on('routeChangeComplete', () => NProgress.done());
Router.events.on('routeChangeError', () => NProgress.done());

function	AppWrapper(props) {
	const	{Component, pageProps, router} = props;

	return (
		<>
			<Head>
				<title>{'Major\'s Farm'}</title>
				<link rel={'icon'} href={'data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><text y=%22.9em%22 font-size=%2290%22>🌾</text></svg>'} />
				<meta httpEquiv={'X-UA-Compatible'} content={'IE=edge'} />
				<meta name={'viewport'} content={'width=device-width, initial-scale=1'} />
				<meta name={'description'} content={'Major\'s Farm - Degen yield loss calculator'} />
				<meta name={'msapplication-TileColor'} content={'#9fcc2e'} />
				<meta name={'theme-color'} content={'#ffffff'} />
				<meta charSet={'utf-8'} />
			</Head>
			<div className={'withAnim transition-opacity bg-dark-900 min-h-screen'}>
				<div id={'app'} className={'flex'}>
					<div className={'p-12 w-full'} style={{minHeight: '90vh'}}>
						<Component
							key={router.route}
							element={props.element}
							router={props.router}
							{...pageProps} />
					</div>
				</div>
				<div className={'mt-10 space-x-3 text-xs text-center flex flex-row justify-center items-center text-dark-200'}>
					<a href={'https://twitter.com/MajorTom_eth'} target={'_blank'} className={'hover:text-accent-900 hover:underline cursor-pointer'} rel={'noreferrer'}>{'Twitter'}</a>
					<p>{'-'}</p>
					<a href={'https://github.com/TBouder/major.farm'} target={'_blank'} className={'hover:text-accent-900 hover:underline cursor-pointer'} rel={'noreferrer'}>{'Github'}</a>
					<p>{'-'}</p>
					<a href={'mailto:major-tom.eth@pm.me'} target={'_blank'} className={'hover:text-accent-900 hover:underline cursor-pointer'} rel={'noreferrer'}>{'Contact'}</a>
					<p>{'-'}</p>
					<Link href={'/changelog'}>
						<p className={'hover:text-accent-900 hover:underline cursor-pointer'}>{'Changelog'}</p>
					</Link>
				</div>
				<div className={'py-3 text-xs text-center flex flex-row justify-center items-center text-dark-200'}>
					<p>{'Donation : major-tom.eth'}</p>
				</div>

			</div>
			<div id={'portal-root'} />
		</>
	);
}

const getLibrary = (provider) => {
	return new ethers.providers.Web3Provider(provider, 'any')
};

function	MyApp(props) {
	const	{Component, pageProps} = props;
	
	return (
		<CurrenciesContextApp>
			<StrategiesContextApp>
				<Web3ReactProvider getLibrary={getLibrary}>
					<Web3ContextApp>
						<ToastProvider autoDismiss>
							<AppWrapper
								Component={Component}
								pageProps={pageProps}
								element={props.element}
								router={props.router} />
						</ToastProvider>
					</Web3ContextApp>
				</Web3ReactProvider>
			</StrategiesContextApp>
		</CurrenciesContextApp>
	);
}


export default MyApp;
