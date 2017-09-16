var path = require("path");
const webpack = require("webpack");
const { resolve } = require("path");

module.exports = {
	entry: path.resolve(__dirname, 'src') + '/main.js',
	output: {
    filename: 'build.js',
    path: resolve(__dirname, 'public', 'javascripts'),
    publicPath: '/javascripts/',
  	},
	module: {
		loaders: [
			{ test: /\.css$/, loader: "style-loader!css-loader" },
			{
				test: /\.jsx?$/,
				loader: "babel-loader",
				exclude: /node_modules/,
				query: {
					presets: ["es2015", "react"]
				}
			}
		]
	},
};

