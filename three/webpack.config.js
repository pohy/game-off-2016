const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
    entry: [
        path.join(__dirname, 'src', 'index.js'),
        'webpack-dev-server/client?http://localhost:8080'
    ],
    output: {
        path: path.join(__dirname, 'dist'),
        publicPath: '/',
        filename: 'app.js'
    },
    devtool: 'source-map',
    module: {
        loaders: [{
            test: /\.js$/,
            include: path.join(__dirname, 'src'),
            loader: 'babel-loader',
            query: {
                presets: ['es2015']
            }
        }]
    },
    debug: true,
    devServer: {
        contentBase: path.join(__dirname, 'src')
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: path.join(__dirname, 'public', 'index.html'),
            inject: 'body'
        })
    ]
};