const path = require('path');
const merge = require('webpack-merge');
const webpack = require('webpack');
const NpmInstallPlugin = require('npm-install-webpack-plugin');//install webpack plugins and changes config

const TARGET = process.env.npm_lifecycle_event;
const PATHS = {
    app: path.join(__dirname, 'app'),
    build: path.join(__dirname, 'build')
};

process.env.BABEL_ENV = TARGET;

const common = {
    entry: {
        app: PATHS.app
    },
    //Add resolve.extensions
    resolve: {
        extensions: ['', '.js', '.jsx']
    },
    output: {
        path: PATHS.build,
        filename: 'bundle.js'
    },
    module: {
        loaders: [
          {
              //Test expects a RegExp!
              test: /\.css$/,
              loaders: ['style', 'css'],
              //Either path or an array of paths
              //If not set webpack will traverse
              //all directories start from base
              include: PATHS.app
          },
          //Thanks to regular expression it accepts .js
          {
              test: /\.jsx?$/,
              loaders: ['babel?cacheDirectory'],
              include: PATHS.app
          }
        ]
    }
};

//Default conf
if(TARGET === 'start' || !TARGET){
    module.exports = merge(common, {
        devtool: 'eval-source-map',
        devServer: {
            contentBase: PATHS.build,

            //Enable history API fallback
            // to let HTML5 History API based routing work.
            historyApiFallback: true,
            hot: true,
            inline: true,
            progress: true,

            //Display only errors, don't show everything
            stats: 'errors-only',

            //Parse host and port from env so this is easy to customize
            //For vagrant 
            //host: process.ebv.HOST || '0.0.0.0';
            host: process.env.HOST,
            port: process.env.PORT
        },
        plugins: [
            new webpack.HotModuleReplacementPlugin(),
            new NpmInstallPlugin({
                save: true // --save
            })
        ]
    });
}

if(TARGET === 'build'){
    module.exports = merge(common, {});
}
