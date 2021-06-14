/******************************************************************************
**	@Author:				Thomas Bouder <Tbouder>
**	@Email:					Tbouder@protonmail.com
**	@Date:					Saturday May 8th 2021
**	@Filename:				useStategies.js
******************************************************************************/

import	React, {useState, useEffect, useContext, createContext}	from	'react';
import	useLocalStorage									from	'hook/useLocalStorage'

const StrategiesContext = createContext();

export const StrategiesContextApp = ({children}) => {
	const	[nonce, set_nonce] = useState(0);
	const	[isLocalInit, set_isLocalInit] = useState(false);
	const	[localStrategies, set_localStrategies] = useLocalStorage('strategies-v02', []);
	const	[strategies, set_strategies] = useState([]);

	useEffect(() => {
		if (isLocalInit) {
			set_localStrategies(strategies);
		}
	}, [strategies, nonce, isLocalInit])

	useEffect(() => {
		if (isLocalInit === false) {
			set_isLocalInit(true)
			set_strategies(localStrategies)
		}
	}, [localStrategies])

	return (
		<StrategiesContext.Provider
			value={{
				strategies,
				set_strategies,
				set_nonce,
			}}>
			{children}
		</StrategiesContext.Provider>
	)
}

export const useStrategies = () => useContext(StrategiesContext)
export default useStrategies;
