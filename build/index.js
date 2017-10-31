// see http://vuejs-templates.github.io/webpack for documentation.
var path = require('path')

module.exports = {
  dev: {
    env: require('./dev'),
    port: 8089,
    assetsSubDirectory: 'static',
    assetsPublicPath: '/',
    proxyTable: {
      // 代理
      '/user': {target: 'https://api.goodsogood.com', changeOrigin: true},
      '/merchant': {target: 'https://api.goodsogood.com', changeOrigin: true},
      '/pay': {target: 'https://api.goodsogood.com', changeOrigin: true},
      '/onedollar/v1': {target: 'http://m.goodsogood.com', changeOrigin: true},
      '/jdmall/v1': {target: 'http://m.goodsogood.com', changeOrigin: true},
      '/jdmall/v2': {target: 'http://m.goodsogood.com', changeOrigin: true},
      '/coupon': {target: 'http://192.168.2.144:8012', changeOrigin: true},
      // '/user': {target: 'http://gate.goodsogood.com', changeOrigin: true},
      // '/gs_card_gift': {target: 'http://card.goodsogood.com', changeOrigin: true}
      // '/v1': {target: 'http://120.26.164.70:9101', changeOrigin: true},
      // '/v2': {target: 'http://120.26.164.70:9101', changeOrigin: true}
      // '/v2': {target: 'http://192.168.1.85:9101', changeOrigin: true}
      // '/v2': {target: 'http://192.168.1.5:9002', changeOrigin: true}
    },
    // CSS Sourcemaps off by default because relative paths are "buggy"
    // with this option, according to the CSS-Loader README
    // (https://github.com/webpack/css-loader#sourcemaps)
    // In our experience, they generally work as expected,
    // just be aware of this issue when enabling this option.
    cssSourceMap: false
  }
}
