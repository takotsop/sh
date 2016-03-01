var path = require('path');

module.exports = {

	entry: './public/js/main.js',

	output: {
		filename: 'bundle.js',
		path: './public',
	},

	resolve: {
		root: [path.resolve('./public'), path.resolve('./public/js')],
		extensions: ['', '.js', '.css'],
	},

	module: {
		loaders: [
			{ test: /\.css$/, loader: "style-loader!css-loader" },
			{ test: /\.(png|jpg)$/, loader: 'url-loader?limit=4096' },
		]
	},

	externals: {
		"jquery": "jQuery",
		"simplewebrtc": "SimpleWebRTC",
		"socket.io": "io",
	},

};
