/******************************************************************************
**	@Author:				Thomas Bouder <Tbouder>
**	@Email:					Tbouder@protonmail.com
**	@Date:					Monday August 24th 2020
**	@Filename:				next.config.js
******************************************************************************/

const Dotenv = require('dotenv-webpack');

module.exports = ({
	plugins: [
		new Dotenv()
	],
	env: {
		ALCHEMY_KEY: process.env.ALCHEMY_KEY,
		ETHERSCAN_API_KEY: process.env.ETHERSCAN_API_KEY,
		POLYGONSCAN_API_KEY: process.env.POLYGONSCAN_API_KEY,
		POLYGON_MATIC_VIRGIL: process.env.POLYGON_MATIC_VIRGIL,
	},
	optimization: {
		minimize: true,
		splitChunks: {
			chunks: 'all',
			maxInitialRequests: 25,
			minSize: 20000
		}
	},
	images: {
		domains: [
			'tokens.1inch.exchange'
		],
	},
	webpack: (config, {webpack}) => {
		// Note: we provide webpack above so you should not `require` it
		// Perform customizations to webpack config
		// Important: return the modified config
		config.plugins.push(new webpack.IgnorePlugin(/\/__tests__\//))
		return config
	},
	webpackDevMiddleware: (config) => {
		// Perform customizations to webpack dev middleware config
		// Important: return the modified config
		return config
	},
})
