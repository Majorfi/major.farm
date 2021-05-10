/******************************************************************************
**	@Author:				Thomas Bouder <Tbouder>
**	@Email:					Tbouder@protonmail.com
**	@Date:					Saturday May 8th 2021
**	@Filename:				SectionFoot.js
******************************************************************************/

function	SectionFoot({result, children}) {
	return (
		<section
			aria-label={'foot'}
			className={'w-full mt-auto pt-12'}>
				<p className={`text-opacity-80 font-medium text-center text-2xl ${result > 0 ? 'text-green-400' : result < 0 ? 'text-red-400' : 'text-white'}`}>
					{`${(result).toFixed(4)} €`}
				</p>
				{children ?
					<div className={`text-opacity-100 font-light italic text-center text-xs text-dark-200 mt-2`}>
						{children}
					</div>
					:
					<p className={`text-opacity-100 font-light italic text-center text-xs text-dark-200 mt-2`}>&nbsp;</p>
				}
		</section>
	)
}

export default SectionFoot;