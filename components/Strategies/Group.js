/******************************************************************************
**	@Author:				Thomas Bouder <Tbouder>
**	@Email:					Tbouder@protonmail.com
**	@Date:					Saturday May 8th 2021
**	@Filename:				GroupLabel.js
******************************************************************************/

import	React, {useState, useEffect}	from	'react';
import	Image							from	'next/image';
import	useCurrencies					from	'contexts/useCurrencies';

function	GroupElement({image, label, amount, value, address, details = undefined}) {
	const	[currentImage, set_currentImage] = useState(image)
	const	{baseCurrency} = useCurrencies();

	useEffect(() => {
		set_currentImage(image);
	}, [image])

	return (
		<div className={'text-white text-opacity-80 pt-2 flex flex-row w-full items-baseline'}>
			<div className={'w-1/3 font-medium flex flex-row items-center'}>
				{
					currentImage.startsWith('/') || currentImage.startsWith('http') ?
					<>
						<Image
							onError={() => set_currentImage('/yGeneric.svg')}
							src={currentImage}
							width={16}
							height={16}
							quality={100}
							loading={'eager'} />
						&nbsp;&nbsp;
						<a
							target={'_blank'}
							href={`https://etherscan.io/token/${address}`}
							className={'hover:text-accent-900 hover:underline transition-color'} rel={'noreferrer'}>
							{`${label} :`}
						</a>
					</>
					:
					<p>{`${currentImage}  ${label} :`}</p>
				}
			</div>
			<p className={'w-1/3 text-right'}>{amount}</p>
			<div className={'w-1/3 text-right'}>
				<p>{`${value} ${baseCurrency === 'eur' ? '€' : '$'}`}</p>
				{details ? <p className={'font-light italic text-xs text-dark-100'}>
					{details}
				</p> : null}
			</div>
		</div>
	)
}

function	Group({title, children}) {
	return (
		<div className={'w-full'}>
			<p className={'text-white text-opacity-80 pb-2 border-b border-dark-400 font-medium'}>
				{title}
			</p>
			{children}
		</div>
	)
}

export {GroupElement};
export default Group;