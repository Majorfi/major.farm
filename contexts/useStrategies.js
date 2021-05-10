/******************************************************************************
**	@Author:				Thomas Bouder <Tbouder>
**	@Email:					Tbouder@protonmail.com
**	@Date:					Saturday May 8th 2021
**	@Filename:				useStategies.js
******************************************************************************/

import	{useState, useContext, createContext}		from	'react';
import	useLocalStorage								from	'hook/useLocalStorage'

const StrategiesContext = createContext();

export const StrategiesContextApp = ({children}) => {
	const	[nonce, set_nonce] = useState(0);
	const	[strategies, set_strategies] = useLocalStorage('strategies-v02', []);

	return (
		<StrategiesContext.Provider
			children={children}
			value={{
				strategies,
				set_strategies,
				set_nonce,
			}} />
	)
}

export const useStrategies = () => useContext(StrategiesContext)
export default useStrategies;
