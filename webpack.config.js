const HTMLWebpackPlugin = require('html-webpack-plugin');
const path = require('path');
const webpack = require('webpack');

module.exports = {
    entry: {
        button: './src/button.js',
        buttonLoader: './src/button-loader.js',
        iframe: './src/iframe.js',
        iframeLoader: './src/iframe-loader.js',
        widget: './src/widget.js',
        widgetLoader: './src/widget-loader.js',
    },

    output: {
        filename: ({ chunk: { name } }) => {
            if (process.env.RELEASE_NAME) {
                return name.indexOf('Loader') > -1 ?
                    '[name].js' :
                    `[name].${process.env.RELEASE_NAME}.js`;
            }
            return '[name].[chunkhash].js';
        },
        path: path.resolve(__dirname, 'dist'),
    },

    plugins: [
        new webpack.EnvironmentPlugin([
            'API_URL',
            'BOOTSTRAP_ENDPOINT',
            'CREDENTIALS',
            'RELEASE_NAME',
            'SCRIPT_DOMAIN',
        ]),
        new HTMLWebpackPlugin({
            inject: false,
            template: 'src/index.html',
            templateParameters: (compilation, assets, options) => ({
                files: assets,
                options,
                RELEASE_NAME: process.env.RELEASE_NAME,
                SCRIPT_DOMAIN: process.env.SCRIPT_DOMAIN,
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
