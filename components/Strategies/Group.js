/******************************************************************************
**	@Author:				Thomas Bouder <Tbouder>
**	@Email:					Tbouder@protonmail.com
**	@Date:					Saturday May 8th 2021
**	@Filename:				GroupLabel.js
******************************************************************************/

import	Image				from	'next/image';

function	GroupElement({image, label, amount, value, address, details = undefined}) {
	return (
		<div className={'text-white text-opacity-80 pt-2 flex flex-row w-full items-baseline'}>
			<div className={'w-1/3 font-medium flex flex-row items-center'}>
				{
					image.startsWith('/') || image.startsWith('http') ?
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
					<p>{`${image}  ${label} :`}</p>
				}
			</div>
			<p className={'w-1/3 text-right'}>{amount}</p>
			<div className={'w-1/3 text-right'}>
				<p>{`${value} €`}</p>
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