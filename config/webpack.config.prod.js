const config = require( './webpack.config.base' );
const webpack = require( 'webpack' );
const merge = require( 'webpack-merge' );
const path = require( 'path' );
const ExtractTextPlugin = require( 'extract-text-webpack-plugin' );
const htmlWebpackPplugin = require( 'html-webpack-plugin' );

module.exports = merge( config, {
    devtool: false,
    entry: {
        main: [ 'babel-polyfill', path.resolve( __dirname, '../src/main.js' ) ],
        common: ['vue', 'vuex', 'vue-router' ],
    },
    output: {
        filename: '[name].[chunkhash].js',
        publicPath: '',
    },
    module: {
        rules: [ {
            test: /\.css$/,
            loaders: [ {
                loader: 'style-loader'
            }, {
                loader: 'css-loader',
                options: {
                    minimize: true,
                    sourceMap: false
                }
            } ]
        }, {
            // 处理图片等资源文件
            test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
            loader: 'url-loader',
            query: {
                limit: 10000,
                name: './img/[name].[hash:7].[ext]'
            }
        }, {
            // 处理图片等资源文件
            test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
            loader: 'url-loader',
            query: {
                limit: 10000,
                name: './fonts/[name].[hash:7].[ext]'
            }
        } ],
    },
    plugins: [
        new webpack.DefinePlugin( {
            'process.env': { NODE_ENV: '"production"' }
        } ),
        new webpack.optimize.UglifyJsPlugin( {
            compress: {
                warnings: false,
                drop_debugger: true,
                drop_console: true,
            }
        } ),
        new ExtractTextPlugin( {
            filename: path.resolve( __dirname, '../dist/css/[name].[contenthash].css' )
        } ),
        // 合并到html文件
        new htmlWebpackPplugin( {
            filename: 'index.html',
            template: path.resolve( __dirname, '../src/index.html' ),
            inject: true,
            chunksSortMode: 'dependency',
            minify: {
                removeComments: true,
                collapseWhitespace: true,
                removeAttributeQuotes: true
            },
        } ),
        // 提取公共文件
        new webpack.optimize.CommonsChunkPlugin( {
            name: 'common',
            minChunks: 2,
        } ),
        // 提取公共文件
        new webpack.optimize.CommonsChunkPlugin( {
            name: 'vender',
            minChunks: ( module, count ) => {
                // 找出node_modules里面的所有用到的模块
                return (
                    module.resource && /\.js$/.test( module.resource ) &&
                    module.resource.indexOf( path.join( __dirname, '../node_modules' ) ) === 0
                )
            }
        } ),
        // 提取公共文件
        new webpack.optimize.CommonsChunkPlugin( {
            name: 'manifest',
            chunks: [ 'vendor' ]
        } ),
    ],
} );