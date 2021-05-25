const defaultTheme = require('tailwindcss/defaultTheme')
const colors = require('tailwindcss/colors')

module.exports = {
	purge: [
		'./pages/**/*.js',
		'./components/**/*.js'
	],
	darkMode: false,
	theme: {
		colors: {
			gray: colors.blueGray,
			teal: colors.teal,
			green: colors.green,
			red: colors.red,
			white: colors.white,
			accent: {
				900: '#f9b12a',
				800: '#f9b83f',
				700: '#fac054',
				600: '#fac869',
				500: '#fbd07f',
				400: '#fcd894',
				300: '#fcdfa9',
				200: '#fde7bf',
				100: '#fdefd4',
				50: '#fef7e9',
			},
			dark: {
				900: '#09162E',
				600: 'rgb(19,38,75)',
				400: 'rgb(24,48,95)',
				300: '#2f446f',
				200: '#46597e',
				100: '#5d6e8f',
			},
		},
		extend: {
			fontFamily: {
				sans: ['Inter var', ...defaultTheme.fontFamily.sans],
			},
		},
	},
	variants: {
		extend: {
			backgroundColor: ['group-focus'],
			opacity: ['group-hover', 'group-focus'],
			display: ['group-hover'],
		},
	},
	plugins: [
		require('@tailwindcss/typography'),
		require('@tailwindcss/forms'),
		require('@tailwindcss/aspect-ratio'),
	],
}
