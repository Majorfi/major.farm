/******************************************************************************
**	@Author:				Thomas Bouder <Tbouder>
**	@Email:					Tbouder@protonmail.com
**	@Date:					Monday June 14th 2021
**	@Filename:				LoginModal.js
******************************************************************************/

import	React, {Fragment, useRef}		from	'react';
import	{Dialog, Transition}			from	'@headlessui/react';
import	Image							from	'next/image';
import	useWeb3							from	'contexts/useWeb3';

function	LoginModal({open, set_open}) {
	const	walletConnectRef = useRef()
	const	{connect, walletType} = useWeb3();

	return (
		<Transition.Root show={open} as={Fragment}>
			<Dialog
				as={'div'}
				static
				className={'fixed z-10 inset-0 overflow-y-auto'}
				style={{zIndex: 9999999}}
				initialFocus={walletConnectRef}
				open={open}
				onClose={set_open}>
				<div className={'flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0'}>
					<Transition.Child
						as={Fragment}
						enter={'ease-out duration-300'} enterFrom={'opacity-0'} enterTo={'opacity-100'}
						leave={'ease-in duration-200'} leaveFrom={'opacity-100'} leaveTo={'opacity-0'}>
						<Dialog.Overlay className={'fixed inset-0 bg-opacity-75 bg-dark-900 transition-opacity'} />
					</Transition.Child>

					<span className={'hidden sm:inline-block sm:align-middle sm:h-screen'} aria-hidden={'true'}>
						&#8203;
					</span>
					<Transition.Child
						as={Fragment}
						enter={'ease-out duration-300'}
						enterFrom={'opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95'}
						enterTo={'opacity-100 translate-y-0 sm:scale-100'}
						leave={'ease-in duration-200'}
						leaveFrom={'opacity-100 translate-y-0 sm:scale-100'}
						leaveTo={'opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95'}>
						<div className={'inline-block align-bottom bg-dark-600 rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full md:mb-96'}>
							<div className={'bg-dark-600 rounded-lg p-6 space-y-4'}>
								<div
									onClick={() => {
										connect(walletType.METAMASK);
										set_open(false);
									}}
									className={'bg-dark-900 bg-opacity-20 hover:bg-opacity-30 cursor-pointer rounded-md flex flex-col justify-center items-center transition-colors p-6 text-center'}>
									<div className={'web3modal-icon'}>
										<Image src={'/wallets/logoMetamask.svg'} alt={'metamask'} width={45} height={45} />
									</div>
									<div className={'mt-2 font-bold text-2xl text-white'}>{'MetaMask'}</div>
									<div className={'mt-2 text-lg text-white text-opacity-60'}>{'Connect to your MetaMask Wallet'}</div>
								</div>
								<div
									onClick={() => {
										connect(walletType.WALLET_CONNECT);
										set_open(false);
									}}
									ref={walletConnectRef}
									className={'bg-dark-900 bg-opacity-20 hover:bg-opacity-30 cursor-pointer rounded-md flex flex-col justify-center items-center transition-colors p-6 text-center'}>
									<div className={'web3modal-icon'}>
										<Image src={'/wallets/logoWalletConnect.svg'} alt={'walletConnect'} width={45} height={45} />
									</div>
									<div className={'mt-2 font-bold text-2xl text-white'}>{'WalletConnect'}</div>
									<div className={'mt-2 text-lg text-white text-opacity-60'}>{'Scan with WalletConnect to connect'}</div>
								</div>
							</div>
						</div>
					</Transition.Child>
				</div>
			</Dialog>
		</Transition.Root>
	)
}


export default LoginModal;