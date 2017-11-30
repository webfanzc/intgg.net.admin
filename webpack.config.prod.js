var webpack = require('webpack');
var webpackMerge = require('webpack-merge');
var commonConfig = require('./webpack.config.common.js');
var ngtools = require('@ngtools/webpack');
var helpers = require('./helpers');
var ExtractTextPlugin = require('extract-text-webpack-plugin');

module.exports = webpackMerge.smart(commonConfig, {
    entry: {
        'app': './assets/app/main.ts'
    },

    output: {
        path: '/opt/www/intgg.net.admin/public/js/app',
        publicPath: '/js/app/',
        filename: 'bundle.js',
        chunkFilename: '[id].[hash].chunk.js'
    },
    module: {
        loaders: [
            {
                test: /\.ts$/,
                loaders: [
                    'awesome-typescript-loader',
                    'angular2-template-loader',
                    'angular2-router-loader'
                ]
            },
            {
                test: /\.html$/,
                loader: 'html-loader'
            },
            {
                test: /\.css$/,
                loader: 'raw-loader'
            },
            {
                test: /(?:\.ngfactory\.js|\.ngstyle\.js|\.ts)$/,
                loader: '@ngtools/webpack',
            }
        ]
    },
    plugins: [
        // new webpack.NoEmitOnErrorsPlugin(),
        // new ExtractTextPlugin({
        //     filename: '[name].[hash].css',
        //     disable: false,
        //     allChunks: true
        // }),
        //最小化 (minify)
        new webpack.optimize.UglifyJsPlugin({
            mangle: true,
            screw_ie8: true,
            beautify: false,
            comments: false,
            compress: {
                warnings: false,
                warnings: true,
                drop_console: false,
                collapse_vars: true,
                reduce_vars: true
            }
        }),
        new webpack.LoaderOptionsPlugin({
            options: {
                htmlLoader: {
                    minimize: false
                }
            }
        }),

        //ng2 aot webpack插件配置
        //ng2 aot webpack config
        // new ngtools.AotPlugin({
        //     tsConfigPath: './tsconfig.aot.json',
        //     entryModule: helpers.root('intgg.net.admin/assets','app','app.module')+'#AppModule'
        // }),
        new ngtools.AngularCompilerPlugin({
            tsConfigPath: './tsconfig.json',
            entryModule: helpers.root('intgg.net.admin/assets','app','app.module')+'#AppModule',
            // sourceMap: true
        })

        // new webpack.DefinePlugin({
        //     'process.env': {
        //         'NODE_ENV': JSON.stringify(env)
        //     }
        // })
    ]

    // output: {
    //     path: '/opt/www/intgg.net/public/js/app',
    //     publicPath: '/js/app/',
    //     filename: 'bundle.js',
    //     chunkFilename: '[id].[hash].chunk.js'
    // },
    //


    // plugins: [
    //     new webpack.NoErrorsPlugin(),
    //     new webpack.optimize.UglifyJsPlugin({
    //         sourceMap: false
    //     })
    // ]
});