const path = require('path')
const HTMLPlugin = require('html-webpack-plugin')
const webpack = require('webpack')
const ExtractPlugin = require('extract-text-webpack-plugin') // css单独打包到一个文件（生产环境中））
const baseConfig = require('./webpack.base')
const merge = require('webpack-merge') // 合理合并配置项

const isDev = process.env.NODE_ENV === 'development'

const defaultPlugins = [
  new webpack.DefinePlugin({
    'process.env': {
      NODE_ENV: isDev ? '"development"' : '"production"'
    }
  }),
  new HTMLPlugin()
]

const devServer = {
	port: 8081,
	host: '0,0,0,0',
	overlay: {
		errors: true,
	},
	hot: true
}

let config

if(isDev){ // 开发环境
	config = merge(baseConfig, {
		devtool: '#cheap-module-eval-source-map',
		module: {
			rules: [
				{
					test: /\.styl/,
					use: [
						'vue-style-loader', // 具有css热重载功能
						'css-loader',
						{
							loader: 'postcss-loader',
							option: {
								sourceMap: true,
							}
						},
						'stylus-loader'
					]
				}
			]
		},
		devServer,
		plugins: defaultPlugins.concat([
			new webpack.HotModuleReplacementPlugin(),
			new webpack.NoEmitOnErrorsPlugin()
		])
	})
} else{ // 正式环境
	config = merge(baseConfig, {
		entry: {
			app: path.join(__dirname, '../client/index.js'),
			vendor: ['vue']
		},
		output: {
			filename: '[name].[chunkhash:8].js'
		},
		module: {
			rules: [
				{
					test: /\.styl/,
					use: ExtractPlugin.extract({
						fallback: 'vue-style-loader',
						use: [
							'css-loader',
							{
								loader: 'postcss-loader',
								option: {
									sourceMap: true,
								}
							},
							'stylus-loader'
						]
					})
				}
			]
		},
		plugins: defaultPlugins.concat([
			new ExtractPlugin('styles.[contentHash:8].css'),// css单独打包一个文件中
			new webpack.optimize.CommonsChunkPlugin({
				name: 'vender'
			}),
			new webpack.optimize.CommonsChunkPlugin({
				name: 'runtime'
			})
		])
	})
}

module.exports = config
