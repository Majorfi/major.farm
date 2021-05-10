/******************************************************************************
**	@Author:				Thomas Bouder <Tbouder>
**	@Email:					Tbouder@protonmail.com
**	@Date:					Saturday May 8th 2021
**	@Filename:				SectionRemove.js
******************************************************************************/

import	useStrategies		from	'contexts/useStrategies';
import	{removeFromArray}	from	'utils';

function	SectionRemove({uuid}) {
	const	{strategies, set_strategies, set_nonce} = useStrategies();

	return (
		<section
			aria-label={'remove strategy'}
			onClick={() => {
				const	_strategies = strategies;
				set_strategies(removeFromArray(_strategies, 'uuid', uuid));
				set_nonce(n => n + 1);
			}}
			className={'absolute top-2 right-2 text-dark-400 hover:text-dark-200 cursor-pointer'}>
			<svg className={'h-4 w-4'} xmlns={'http://www.w3.org/2000/svg'} viewBox={'0 0 20 20'} fill={'currentColor'} aria-hidden={'true'}>
				<path fillRule={'evenodd'} d={'M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z'} clipRule={'evenodd'} />
			</svg>
		</section>
	)
}

export default SectionRemove;