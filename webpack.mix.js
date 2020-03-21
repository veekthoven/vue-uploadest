let mix = require('laravel-mix');
mix.js('src/index.js', 'dist/index.js');

mix.webpackConfig({
	output: {
		libraryTarget: 'umd'
	}
})