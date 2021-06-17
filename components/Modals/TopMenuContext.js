/******************************************************************************
**	@Author:				Thomas Bouder <Tbouder>
**	@Email:					Tbouder@protonmail.com
**	@Date:					Thursday June 17th 2021
**	@Filename:				TopMenuContext.js
******************************************************************************/

import	React				from	'react';
import	{Transition}		from	'@headlessui/react';
import	useWeb3				from	'contexts/useWeb3';
import	useStrategies		from	'contexts/useStrategies';
import	useLocalStorage		from	'hook/useLocalStorage';
import	{FireIcon}			from	'@heroicons/react/outline'

function	ContextItemClaimable({set_open}) {
	const	{address} = useWeb3();
	const	{detectStrategies} = useStrategies();
	const	[hasAutoDetect, set_hasAutoDetect] = useLocalStorage('autoDetect', false);

	return (
		<li
			onClick={() => {
				detectStrategies(address);
				set_hasAutoDetect(true);
				set_open(false);
			}}
			className={'px-2 py-2 text-gray-400 flex items-center hover:bg-dark-400 hover:text-white cursor-pointer'}>
			<FireIcon className={'h-4 w-4'} aria-hidden={'true'} />
			<p className={'ml-2 text-sm inline'}>
				{'Auto-detect my strategies'}
			</p>
			{!hasAutoDetect ? <span className={'flex absolute h-3 w-3 right-0 mr-2'}>
				<span className={'animate-ping absolute inline-flex h-full w-full rounded-full bg-accent-600 opacity-75'} />
				<span className={'relative inline-flex rounded-full h-3 w-3 bg-accent-900'} />
			</span> : null}
		</li>
	);
}

function	ContextDisconnnect({set_open}) {
	const	{deactivate, onDesactivate} = useWeb3();

	return (
		<li
			onClick={() => {
				set_open(false);
				deactivate();
				onDesactivate();
			}}
			className={'px-2 py-2 text-gray-400 flex items-center hover:bg-dark-400 hover:text-white cursor-pointer'}>
			<svg xmlns={'http://www.w3.org/2000/svg'} className={'h-4 w-4 inline'} fill={'none'} viewBox={'0 0 24 24'} stroke={'currentColor'}><path strokeLinecap={'round'} strokeLinejoin={'round'} strokeWidth={2} d={'M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1'} /></svg>
			<p className={'ml-2 text-sm inline'}>
				{'Disconnect'}
			</p>
		</li>
	);
}


function	ContextMenuProgress({set_open}) {
	return (
		<div className={'absolute z-10 right-0 mt-6 px-2 max-w-md sm:px-0 w-60'}>
			<div className={'rounded-md shadow-lg overflow-auto'}>
				<div className={'relative grid gap-2'}>
					<div className={'bg-dark-600 border border-white border-opacity-10 rounded-lg overflow-hidden'}>
						<ul>
							<ContextItemClaimable set_open={set_open} />
							<ContextDisconnnect set_open={set_open} />
						</ul>
					</div>
				</div>
			</div>
		</div>
	);
}

function	ContextMenuProgressController({open, set_open}) {
	return (
		<>
			<Transition
				show={open}
				enter={'transition ease-out duration-200'}
				enterFrom={'opacity-0 translate-y-1'}
				enterTo={'opacity-100 translate-y-0'}
				leave={'transition ease-in duration-150'}
				leaveFrom={'opacity-100 translate-y-0'}
				leaveTo={'opacity-0 translate-y-1'}>
				<ContextMenuProgress set_open={set_open} />
			</Transition>
		</>
	);
}

export default ContextMenuProgressController;