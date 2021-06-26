/******************************************************************************
**	@Author:				Thomas Bouder <Tbouder>
**	@Email:					Tbouder@protonmail.com
**	@Date:					Saturday May 8th 2021
**	@Filename:				GroupLabel.js
******************************************************************************/

import	React, {useState, useEffect}	from	'react';
import	Image							from	'next/image';
import	useCurrencies					from	'contexts/useCurrencies';
import	{getExplorer}					from	'utils/chains';

function	GroupElement({network, image, label, amount, value, address, details = undefined}) {
	const	[currentImage, set_currentImage] = useState(image)
	const	{baseCurrency} = useCurrencies();

	useEffect(() => {
		set_currentImage(image);
	}, [image])

	function	renderValue() {
		if (baseCurrency === 'eur') {
			return (new Intl.NumberFormat('fr-FR', {style: 'currency', currency: 'EUR'}).format(value))
		}
		return (new Intl.NumberFormat('en-US', {style: 'currency', currency: 'USD'}).format(value))
	}

	function	renderAmount() {
		if (baseCurrency === 'eur') {
			return (new Intl.NumberFormat('fr-FR', {minimumFractionDigits: 0, maximumFractionDigits: 8}).format(amount))
		}
		return (new Intl.NumberFormat('en-US', {minimumFractionDigits: 0, maximumFractionDigits: 8}).format(amount))
	}

	return (
		<div className={'text-white text-opacity-80 pt-2 flex flex-row w-full items-baseline'}>
			<div className={'w-1/3 font-medium flex flex-row items-center'}>
				{
					currentImage.startsWith('/') || currentImage.startsWith('http') ?
						<div className={'flex flex-row items-center'}>
							<div className={'w-4'} style={{minWidth: 16}}>
								<Image
									onError={() => set_currentImage('/tokens/yGeneric.svg')}
									src={currentImage}
									width={16}
									height={16}
									quality={95}
									loading={'eager'} />
							</div>
						&nbsp;&nbsp;
							<div>
								<a
									target={'_blank'}
									href={`https://${getExplorer(network).explorer}/token/${address}`}
									className={'hover:text-accent-900 hover:underline transition-color'} rel={'noreferrer'}>
									{`${label}`}
								</a>
							</div>
						</div>
						:
						<div className={'flex flex-row items-center'}>
							<div className={'w-4'} style={{minWidth: 16}}>
								<p>{currentImage}</p>
							</div>
						&nbsp;&nbsp;
							<div>
								<p>{label}</p>
							</div>
						</div>
				}
			</div>
			<p className={'w-1/3 text-right'}>{renderAmount()}</p>
			<div className={'w-1/3 text-right'}>
				<p>{renderValue()}</p>
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