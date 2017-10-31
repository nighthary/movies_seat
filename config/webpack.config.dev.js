const baseConfig = require( './webpack.config.base' ),
    path = require( 'path' ),
    merge = require( 'webpack-merge' ),
    webpack = require( 'webpack' ),
    htmlWebpackPplugin = require( 'html-webpack-plugin' ),
    frendError = require( 'friendly-errors-webpack-plugin' );

module.exports = merge( baseConfig, {
    entry: [
        'babel-polyfill',
        'webpack-hot-middleware/client',
        path.resolve( __dirname, '../src/main.js' )
    ],
    devtool: 'eval-source-map',
    module: {
        rules: [ {
            test: /\.css$/,
            use: [ 'style-loader', 'css-loader' ]
        }, {
            test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
            loader: 'url-loader',
            query: {
                limit: 10000,
                name: 'imgs/[name].[ext]'
            }
        }, {
            test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
            loader: 'file-loader',
            query: {
                limit: 10000,
                name: 'fonts/[name].[ext]'
            }
        }, {
            
        } ],
    },
    plugins: [
        new webpack.DefinePlugin( {
            'process.env': { NODE_ENV: '"development"' }
        } ),
        new frendError(),
        new webpack.HotModuleReplacementPlugin(),
        new webpack.NoEmitOnErrorsPlugin(),
        new htmlWebpackPplugin( {
            filename: 'index.html',
            template: path.resolve( __dirname, '../src/index.html' ),
            inject: true,
        } ),
    ],
} )
