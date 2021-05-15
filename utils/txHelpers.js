/******************************************************************************
**	@Author:				Thomas Bouder <Tbouder>
**	@Email:					Tbouder@protonmail.com
**	@Date:					Friday May 14th 2021
**	@Filename:				txHelpers.js
******************************************************************************/

import	* as API		from	'utils/API'
import	{bigNumber}		from	'utils';
import	{ethers}		from	'ethers';

export async function	analyzeZapIn(from, zapIn, txHash) {
	const	zapInReceipt = await API.getTransactionReceipt(txHash);
	const	{logs} = zapInReceipt;
	const	fromAddress = from.slice(2).toLowerCase();
	const	zapInAddress = zapIn.slice(2).toLowerCase();
	const	dataIn = {};
	const	dataOut = {};

	const	LOG_TOPIC_TRANSFER = '0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef';
	await Promise.all(logs.map(async (log) => {
		if (log?.topics?.[0] === LOG_TOPIC_TRANSFER) {
			if (((log?.topics?.[1]).toLowerCase()).includes(fromAddress)) {
				if (((log?.topics?.[2]).toLowerCase()).includes(zapInAddress)) {
					const	tokenInfoCoingecko = await API.getTokenInfo(log?.address);
					const	tokenInfoEtherscan = await API.retrieveTokenDecimalByTokenAddress(log?.address);
					dataIn.id = tokenInfoCoingecko?.id || '';
					dataIn.name = tokenInfoEtherscan?.name || tokenInfoCoingecko?.name;
					dataIn.symbol = tokenInfoEtherscan?.symbol || tokenInfoCoingecko?.symbol;
					dataIn.address = log?.address;
					dataIn.valueRaw = bigNumber.from(log?.data).toString();
					dataIn.value = Number(ethers.utils.formatUnits(bigNumber.from(log?.data), tokenInfoEtherscan.decimals))
					dataIn.decimals = tokenInfoEtherscan.decimals
				}
			}
		}
		if (log?.topics?.[0] === LOG_TOPIC_TRANSFER) {
			if (((log?.topics?.[1]).toLowerCase()).includes(zapInAddress)) {
				if (((log?.topics?.[2]).toLowerCase()).includes(fromAddress)) {
					const	tokenInfoCoingecko = await API.getTokenInfo(log?.address);
					const	tokenInfoEtherscan = await API.retrieveTokenDecimalByTokenAddress(log?.address);
					dataOut.id = tokenInfoCoingecko?.id || '';
					dataOut.name = tokenInfoEtherscan?.name || tokenInfoCoingecko?.name;
					dataOut.symbol = tokenInfoEtherscan?.symbol || tokenInfoCoingecko?.symbol;
					dataOut.address = log?.address;
					dataOut.valueRaw = bigNumber.from(log?.data).toString();
					dataOut.value = Number(ethers.utils.formatUnits(bigNumber.from(log?.data), tokenInfoEtherscan.decimals))
					dataOut.decimals = tokenInfoEtherscan.decimals
				}
			}
		}
		Promise.resolve()
	}));
	return ({dataIn, dataOut})
}