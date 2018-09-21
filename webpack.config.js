const HTMLWebpackPlugin = require('html-webpack-plugin');
const path = require('path');
const webpack = require('webpack');

module.exports = {
    entry: {
        app: './src/index.js',
        widget: './src/widget.js',
    },

    output: {
        filename: ({ chunk: { name } }) => {
            if (process.env.RELEASE_NAME) {
                return name === 'widget' ? '[name].js' : `[name].${process.env.RELEASE_NAME}.js`;
            }
            return '[name].[chunkhash].js';
        },
        path: path.resolve(__dirname, 'dist'),
    },

    plugins: [
        new webpack.EnvironmentPlugin(['API_URL', 'BOOTSTRAP_ENDPOINT', 'RELEASE_NAME']),
        new HTMLWebpackPlugin({
            inject: false,
            template: 'src/index.html',
            templateParameters: (compilation, assets, options) => ({
                files: assets,
                options,
                RELEASE_NAME: process.env.RELEASE_NAME,
            }),
            title: `${process.env.RELEASE_NAME || 'development'} widget test page`,
        }),
    ],

    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /node_modules/,
                loader: 'babel-loader',
            },
            {
                test: /\.css$/,
                use: ['style-loader', 'css-loader'],
            },
        ],
    },

    devServer: {
        contentBase: './dist',
        disableHostCheck: true,
    },
};
