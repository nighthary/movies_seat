const http = require( 'http' ),
    webpack = require( 'webpack' ),
    devConfig = require( '../config/webpack.config.dev' ),
    express = require( 'express' ),
    opn = require( 'opn' ),
    path = require( 'path' ),
    proxy = require( 'express-http-proxy' ),
    chalk = require( 'chalk' ),
    webpackHotMiddleware = require( 'webpack-hot-middleware' ),
    webpackDevMiddleware = require( 'webpack-dev-middleware' ),
    proxyMiddleware = require('http-proxy-middleware'),
    // 创建express
    app = express(),
    // 创建webpack配置
    compiler = webpack( devConfig ),
    // http 服务器端口
    port = process.env.PORT || 8082,
    // uri 打开的地址
    uri = `http://localhost:${port}`,
    hotMiddleware = webpackHotMiddleware( compiler, {
        log: () => {
        }
    } ),
    devMiddleware = webpackDevMiddleware( compiler, {
        publicPath: devConfig.output.publicPath,
        quiet: true,
    } );

var config = require('./index')
var proxyTable = config.dev.proxyTable


// force page reload when html-webpack-plugin template changes
compiler.plugin( 'compilation', function ( compilation ) {
    compilation.plugin( 'html-webpack-plugin-after-emit', function ( data, cb ) {
        hotMiddleware.publish( { action: 'reload' } );
        cb();
    } )
} );

// proxy api requests
Object.keys(proxyTable).forEach(function (context) {
  var options = proxyTable[context]
  if (typeof options === 'string') {
    options = { target: options }
  }
  app.use(proxyMiddleware(context, options))
})

// 设置静态目录
app.use( express.static( path.resolve( __dirname, '../dist' ) ) );

// 添加地址代理
app.use( '/apim', proxy( 'http://card.goodsogood.com' ) );

// 关联server服务器和webpack编译
app.use( devMiddleware );

// 关联热替换
app.use( hotMiddleware );


http.createServer( app ).listen( port, err => {
    if ( err ) return console.log( chalk.red( err ) );

    // 打开链接
    opn( uri );
} )



