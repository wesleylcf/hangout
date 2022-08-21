module.exports = {
	env: {
		browser: true,
		es2021: true,
		node: true
	},
	extends: ['plugin:react/recommended', 'standard'],
	parser: '@typescript-eslint/parser',
	parserOptions: {
		ecmaFeatures: {
			jsx: true
		},
		ecmaVersion: 'latest',
		sourceType: 'module'
	},
	plugins: ['react', '@typescript-eslint'],
	rules: {
		indent: [2, 'tab'],
		'no-tabs': 0
	},
	settings: {
		react: {
			version: 'detect'
		}
	}
}
