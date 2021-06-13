/******************************************************************************
**	@Author:				Thomas Bouder <Tbouder>
**	@Email:					Tbouder@protonmail.com
**	@Date:					Saturday May 8th 2021
**	@Filename:				SectionHead.js
******************************************************************************/

import	React, {Fragment}			from	'react';
import	{useState, useEffect}		from	'react';
import	{ethers}					from	'ethers';
import	{datediff}					from	'utils';
import	{getProvider, getExplorer}	from	'utils/chains';
import	{Popover, Transition}		from	'@headlessui/react'
import	{MenuAlt3Icon, XIcon}		from	'@heroicons/react/solid'
import	{DownloadIcon, UploadIcon}	from	'@heroicons/react/outline'

const solutions = [
	{
		name: 'Deposit',
		description: 'Deposit some tokens to this vault',
		icon: DownloadIcon,
	},
	{
		name: 'Withdraw',
		description: 'Withdraw some of your share from this vault',
		icon: UploadIcon,
	},
]

function	SectionHead({network, address, parameters, date, APY}) {
	const	{title, contractAddress} = parameters;
	const	[ethAddress, set_ethAddress] = useState(address);
	const	[vaultInformations, set_vaultInformations] = useState({});

	async function lookupAddress(_address) {
		const	provider = new ethers.providers.AlchemyProvider('homestead', process.env.ALCHEMY_KEY)
		set_ethAddress(await provider.lookupAddress(_address) || _address);
	}
	async function getStrategyData(_contractAddress) {
		const	provider = getProvider(network);
		const	ABI = [
			'function decimals() external view returns (uint256)',
			'function pricePerShare() external view returns (uint256)',
			'function depositLimit() external view returns (uint256)',
			'function managementFee() external view returns (uint256)',
			'function performanceFee() external view returns (uint256)',
			'function totalAssets() external view returns (uint256)',
		];
		const	smartContract = new ethers.Contract(_contractAddress, ABI, provider);
		const	decimals = Number(await smartContract.decimals());

		const [_pricePerShare, _depositLimit, _totalAssets, _managementFee, _performanceFee] = await Promise.all([
			smartContract.pricePerShare(),
			smartContract.depositLimit(),
			smartContract.totalAssets(),
			smartContract.managementFee(),
			smartContract.performanceFee(),
		]);

		set_vaultInformations({
			pricePerShare: Number(ethers.utils.formatUnits(_pricePerShare, decimals)),
			depositLimit: Number(ethers.utils.formatUnits(_depositLimit, decimals)).toFixed(2),
			totalAssets: Number(ethers.utils.formatUnits(_totalAssets, decimals)).toFixed(2),
			managementFee: Number(_managementFee),
			performanceFee: Number(_performanceFee),
		});
	}

	useEffect(() => {lookupAddress(address);}, [address])
	useEffect(() => {getStrategyData(contractAddress);}, [contractAddress])

	return (
		<Popover className={'z-20'}>
			{({open}) => (
				<>
					<div className={'z-10'}>
						<section aria-label={'head'}>
							<Popover.Button className={'flex flex-row justify-between items-center w-full focus:outline-none group'}>
								<div className={'pb-6 text-left flex flex-row'}>
									<div>
										<div>
											<p className={`font-medium text-2xl text-white transition-all group-hover:text-opacity-100 ${open ? 'text-opacity-100' : 'text-opacity-30'}`}>
												{title}
											</p>
										</div>
										<a
											target={'_blank'}
											href={`https://${getExplorer(network).explorer}/address/${address}`}
											className={'text-xs text-white text-opacity-30 transition-all hover:text-accent-900 hover:text-opacity-100 hover:underline'}
											rel={'noreferrer'}>
											{ethAddress}
										</a>
									</div>
									<div className={'mt-2'}>
										{open ?
											<XIcon
												className={`ml-4 p-1 h-6 w-6 text-white transition-all group-hover:text-opacity-100 rounded-full border border-white border-solid group-hover:border-opacity-100 ${open ? 'border-opacity-100 text-opacity-100' : 'border-opacity-30 text-opacity-30'}`}
												aria-hidden={'true'} /> :
											<MenuAlt3Icon
												className={`ml-4 p-1 h-6 w-6 text-white transition-all group-hover:text-opacity-100 rounded-full border border-white border-solid group-hover:border-opacity-100 ${open ? 'border-opacity-100 text-opacity-100' : 'border-opacity-30 text-opacity-30'}`}
												aria-hidden={'true'} />
										}
									</div>
								</div>
								<div className={'font-medium text-xs text-white text-opacity-30 pb-6'}>
									<p className={'mb-1'}>{`${datediff(date)} days`}</p>
									<p className={`mb-1 ${APY > 0 ? 'text-green-400' : APY < 0 ? 'text-red-400' : 'text-white'}`}>{`${(APY).toFixed(2)}%`}</p>
								</div>
							</Popover.Button>
						</section>
					</div>

					<Transition
						show={open}
						as={Fragment}
						enter={'transition ease-out duration-200'}
						enterFrom={'opacity-0 -translate-y-1'}
						enterTo={'opacity-100 translate-y-0'}
						leave={'transition ease-in duration-150'}
						leaveFrom={'opacity-100 translate-y-0'}
						leaveTo={'opacity-0 -translate-y-1'}>
						<Popover.Panel static className={'absolute z-50 inset-x-0 transform shadow-lg h-full'}>
							<div className={'bg-dark-400 h-full'}>
								<div className={'p-6'}>
									<label className={'ml-0.5 mb-2 block text-sm font-medium text-white text-opacity-50 border-b border-white border-opacity-10 pb-2'}>
										{'Strategy informations'}
									</label>
									<div className={'pt-1 flex flex-row items-center'}>
										<p className={'inline text-sm text-white text-opacity-50 w-1/3'}>{'Supply: '}</p>
										<div className={'mt-1 w-full h-8 rounded bg-dark-600 relative overflow-hidden'}>
											<div className={'absolute top-0 left-0 bottom-0 bg-accent-900'} style={{width: `${((vaultInformations?.totalAssets || 0) / (vaultInformations?.depositLimit || 1) * 100)}%`}} />
											<div className={'absolute inset-0 flex justify-center items-center'}>
												<p className={'inline text-base font-medium text-white text-opacity-90'}>{`${(vaultInformations?.totalAssets || 0)} / ${(vaultInformations?.depositLimit || 1)} DAI`}</p>
											</div>
										</div>
									</div>

									<div className={'pt-2 flex flex-row items-center'}>
										<p className={'inline text-sm text-white text-opacity-50 w-1/3'}>{'Total Value: '}</p>
										<p className={'inline text-base font-medium text-white text-opacity-90 w-full'}>{'5634.84 $'}</p>
									</div>
									<div className={'pt-1 flex flex-row items-center'}>
										<p className={'inline text-sm text-white text-opacity-50 w-1/3'}>{'Share Price: '}</p>
										<p className={'inline text-base font-medium text-white text-opacity-90 w-full'}>{vaultInformations?.pricePerShare || 1}</p>
									</div>
									<div className={'pt-1 flex flex-row items-center text-white'}>
										<p className={'inline text-sm text-white text-opacity-50 w-1/3'}>{'Fees: '}</p>
										<div className={'inline w-full'}>
											<p className={'inline text-base font-medium text-white text-opacity-90'}>{`${(vaultInformations?.managementFee || 0) / 100}% - ${(vaultInformations?.performanceFee || 0) / 100}%`}</p>
											<p className={'inline text-sm text-white text-opacity-50'}>{' (mng - perf)'}</p>
										</div>
									</div>
									<div className={'pt-1 flex flex-row items-center'}>
										<p className={'inline text-sm text-white text-opacity-50 w-1/3'}>{'Author: '}</p>
										<div className={'inline w-full'}>
											<a className={'text-base font-medium text-white text-opacity-90 cursor-pointer hover:text-accent-900 hover:underline'} href={`https://twitter.com/${parameters.author}`} target={'_blank'} rel={'noreferrer'}>
												{parameters.author}
											</a>
										</div>
									</div>

									<label className={'pt-6 ml-0.5 mb-2 block text-sm font-medium text-white text-opacity-50 border-b border-white border-opacity-10 pb-2'}>
										{'Actions'}
									</label>
									<div className={'flex flex-row mt-2'}>
										{solutions.map((item) => (
											<button
												key={item.name}
												className={'p-3 flex flex-col justify-between rounded-lg hover:bg-dark-600 transition ease-in-out duration-150 w-1/2 cursor-pointer focus:outline-none'}>
												<div className={'flex md:h-full lg:flex-row'}>
													<div className={'flex-shrink-0'}>
														<div className={'inline-flex items-center justify-center h-10 w-10 rounded-md bg-accent-900 text-white sm:h-12 sm:w-12'}>
															<item.icon className={'h-6 w-6'} aria-hidden={'true'} />
														</div>
													</div>
													<div className={'ml-4 md:flex-1 md:flex md:flex-col md:justify-between text-left'}>
														<div>
															<p className={'text-base font-medium text-white'}>{item.name}</p>
															<p className={'text-xs text-white text-opacity-75'}>{item.description}</p>
														</div>
													</div>
												</div>
											</button>
										))}
									</div>
								</div>
							</div>
						</Popover.Panel>
					</Transition>
				</>
			)}
		</Popover>
	)
}

export default SectionHead;