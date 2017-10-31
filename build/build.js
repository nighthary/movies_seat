const webpackConfig = require( '../config/webpack.config.prod' );
const ora = require( 'ora' );
const webpack = require( 'webpack' );
const rm = require( 'rimraf' );
const path = require( 'path' );
const chalk = require( 'chalk' );

const spring = ora( 'building for production...' );
spring.start();
rm( path.resolve( __dirname, '../dist' ), err => {
    if ( err ) throw err;

    webpack( webpackConfig, ( err, stats ) => {
        spring.stopAndPersist( { symbol: chalk.green( '√' ) } );

        console.log( '' );

        if ( err ) throw err;

        process.stdout.write( stats.toString( {
                colors: true,
                chunks: false,
                hash: true,
                assets: false,
            } ) + '\n\n' )
    } )
} )
