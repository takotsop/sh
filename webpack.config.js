'use strict';

var path = require('path');

module.exports = {

	entry: './public/scripts/main.js',

	output: {
		filename: 'bundle.js',
		path: './public',
	},

	resolve: {
		root: [path.resolve('./'), path.resolve('./public'), path.resolve('./public/scripts')],
		extensions: ['', '.js', '.css'],
	},

	module: {
		loaders: [
			{ test: /\.css$/, loader: "style-loader!css-loader" },
			{ test: /\.(png)$/, loader: 'url-loader?limit=4096' },
		],
	},

	externals: {
		"jquery": "jQuery",
	},

};
