/******************************************************************************
**	@Author:				Thomas Bouder <Tbouder>
**	@Email:					Tbouder@protonmail.com
**	@Date:					Sunday June 13th 2021
**	@Filename:				useWeb3.js
******************************************************************************/

import	React, {useState, useEffect, useContext, createContext, useCallback}	from	'react';
import	QRCodeModal												from	'@walletconnect/qrcode-modal';
import	{useWeb3React}											from	'@web3-react-fork/core';
import	{InjectedConnector}										from	'@web3-react-fork/injected-connector';
import	{ConnectorEvent}										from	'@web3-react-fork/types';
import	{WalletConnectConnector}								from	'@web3-react-fork/walletconnect-connector';
import	useLocalStorage											from	'hook/useLocalStorage';
import	{toAddress}												from	'utils';
import	{getProvider, getRPC}									from	'utils/chains';

const walletType = {NONE: -1, METAMASK: 0, WALLET_CONNECT: 1};
const Web3Context = createContext();
export const Web3ContextApp = ({children}) => {
	const	web3 = useWeb3React();
	const	[provider, set_provider] = useState(undefined);
	const	[address, set_address] = useLocalStorage('address', '');
	const	[ens, set_ens] = useLocalStorage('ens', '');
	const	[chainID, set_chainID] = useLocalStorage('chainID', -1);
	const	[lastWallet, set_lastWallet] = useLocalStorage('lastWallet', walletType.NONE);
	const	[, set_nonce] = useState(0);
	const	{activate, active, library, connector, account, chainId, deactivate} = web3;

	const onUpdate = useCallback(async (update) => {
		if (update.provider) {
			set_provider(library);
		}
		if (update.chainId) {
			set_chainID(parseInt(update.chainId, 16));
		}
		if (update.account) {
			await getProvider().lookupAddress(toAddress(update.account)).then(_ens => set_ens(_ens || ''));
			set_address(toAddress(update.account));
		}
		set_nonce(n => n + 1);
	}, [library, set_address, set_chainID]);

	const onDesactivate = useCallback(() => {
		set_address('');
		set_ens('');
		set_chainID(-1);
		set_provider(undefined);
		set_lastWallet(walletType.NONE);
		if (connector !== undefined) {
			connector
				.off(ConnectorEvent.Update, onUpdate)
				.off(ConnectorEvent.Deactivate, onDesactivate)
		}
	}, [connector, onUpdate, set_address, set_chainID, set_lastWallet]);

	const onActivate = useCallback(async () => {
		set_provider(library);
		await getProvider().lookupAddress(toAddress(account)).then(_ens => set_ens(_ens || ''));
		set_address(toAddress(account));
		set_chainID(parseInt(chainId, 16));

		connector
			.on(ConnectorEvent.Update, onUpdate)
			.on(ConnectorEvent.Deactivate, onDesactivate)
	}, [account, chainId, connector, library, onDesactivate, onUpdate, set_address, set_chainID]);


	/**************************************************************************
	**	connect
	**	What should we do when the user choose to connect it's wallet ?
	**	Based on the providerType (AKA Metamask or WalletConnect), differents
	**	actions should be done.
	**	Then, depending on the providerType, a similar action, but different
	**	code is executed to set :
	**	- The provider for the web3 actions
	**	- The current address/account
	**	- The current chain
	**	Moreover, we are starting to listen to events (disconnect, changeAccount
	**	or changeChain).
	**************************************************************************/
	const connect = useCallback(async (_providerType) => {
		if (_providerType === walletType.METAMASK) {
			if (active) {
				deactivate()
			}
			const	injected = new InjectedConnector({
				supportedChainIds: [
					1, // ETH MAINNET
					56, // BSC MAINNET
					137, // MATIC MAINNET
					250, // FANTOM MAINNET
				]
			})
			activate(injected, undefined, true);
			set_lastWallet(walletType.METAMASK);
		} else if (_providerType === walletType.WALLET_CONNECT) {
			if (active) {
				deactivate()
			}
			const walletconnect = new WalletConnectConnector({
				rpc: {
					1: getRPC('ethereum'),
					56: getRPC('bsc'),
					137: getRPC('polygon'),
					250: getRPC('fantom')
				},
				chainId: 1,
				bridge: 'https://bridge.walletconnect.org',
				pollingInterval: 12000,
				qrcodeModal: QRCodeModal,
				qrcode: true,
			});
			try {
				await activate(walletconnect, () => set_lastWallet(walletType.NONE), true);
				set_lastWallet(walletType.WALLET_CONNECT);
			} catch (error) {
				set_lastWallet(walletType.NONE);
			}
		}
	}, [activate, active, deactivate, set_lastWallet]);

	useEffect(() => {
		if (active)
			onActivate()
	}, [active, onActivate])

	useEffect(() => {
		if (!active && lastWallet !== walletType.NONE) {
			connect(lastWallet);
		}
	// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [active])

	return (
		<Web3Context.Provider
			value={{
				address,
				ens,
				connect,
				deactivate,
				onDesactivate,
				walletType,
				chainID,
				active,

				provider,
				currentRPCProvider: provider
			}}>
			{children}
		</Web3Context.Provider>
	)
}

export const useWeb3 = () => useContext(Web3Context)
export default useWeb3;
