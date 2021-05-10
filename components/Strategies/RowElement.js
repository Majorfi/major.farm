/******************************************************************************
**	@Author:				Thomas Bouder <Tbouder>
**	@Email:					Tbouder@protonmail.com
**	@Date:					Saturday May 8th 2021
**	@Filename:				RowElement.js
******************************************************************************/

import	Image				from	'next/image';
import	useCurrencies		from	'contexts/useCurrencies';

function	RowElement({image, label, amount, value, address}) {
	const	{baseCurrency} = useCurrencies();

	return (
		<div className={'text-white text-opacity-80 pt-2 flex flex-row w-full'}>
			<div className={'w-1/3 font-medium flex flex-row items-center'}>
				{
					image.startsWith('/') ?
					<>
						<Image src={image} width={16} height={16} quality={100} loading={'eager'} />
						&nbsp;&nbsp;
						<a
							target={'_blank'}
							href={`https://etherscan.io/token/${address}`}
							className={'hover:text-accent-900 hover:underline transition-color'}>
							{`${label} :`}
						</a>
					</>
					:
					<p className={'w-1/3 font-medium'}>{`${image}  ${label} :`}</p>
				}
			</div>
			<p className={'w-1/3 text-right'}>{amount}</p>
			<p className={'w-1/3 text-right'}>{`${value} ${baseCurrency === 'eur' ? '€' : '$'}`}</p>
		</div>
	)
}

export default RowElement;