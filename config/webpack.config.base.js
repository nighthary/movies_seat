/*
 * webpack 基础公共配置
 * @author chuans
 */
const path = require( 'path' ),
    autoprefixer = require( 'autoprefixer' );


module.exports = {
    entry: path.resolve( __dirname, '../src/main.js' ),
    output: {
        path: path.resolve( __dirname, '../dist' ),
        filename: '[name].js',
        publicPath: '/',
    },
    resolve: {
        extensions: [ '.js', '.vue' ],
        // 创建文件夹路径别名
        alias: {
            // 以@开头指向src文件夹 比如现在要在view里面引入组件  import header from '@/component/header.vue';
            '@': path.resolve( __dirname, '../src/' ),
            'Ajax': path.resolve( __dirname, '../src/util/ajax.js' ),
            'vue': path.resolve( __dirname, '../plugins/vue.runtime.esm.js' ),
            'Toast': path.resolve( __dirname, '../src/util/toast.js' ),
            'assets': path.resolve( __dirname, '../src/assets/')
        }
    },
    module: {
        rules: [ {
            test: /\.js$/,
            loader: 'babel-loader',
            options: {
                presets: [ "env","es2015" ],
            },
            include: [
                path.resolve( __dirname, '../src' ),
            ]
        }, {
            test: /\.vue$/,
            loader: 'vue-loader',
            options: {
                postcss: [
                    require( 'autoprefixer' )( {
                        browsers: [ 'last 10 versions', 'Firefox >= 20', '> 1%', 'iOS 4', 'android >= 2.0', 'and_uc > 1' ]
                    } ),
                ]
            }
        }]
    }
}